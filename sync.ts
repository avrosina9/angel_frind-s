/**
 * Client-server synchronization utility for user accounts
 */

/**
 * Helper to build an absolute URL for API requests.
 * This prevents DOMException "The string did not match the expected pattern" in Safari
 * and other browsers when running within sandboxed or srcdoc iframes where the base URL
 * might be "about:srcdoc" or "about:blank".
 */
function getApiUrl(path: string): string {
  try {
    let base = window.location.href;
    
    // If running in about:srcdoc, about:blank or similar opaque contexts,
    // fallback to referrer or parse from location.host
    if (!base || base.startsWith('about:') || base.startsWith('blob:')) {
      if (document.referrer && document.referrer.startsWith('http')) {
        base = document.referrer;
      } else if (window.location.host) {
        const protocol = window.location.protocol && window.location.protocol.startsWith('http') 
          ? window.location.protocol 
          : 'https:';
        return `${protocol}//${window.location.host}${path.startsWith('/') ? path : '/' + path}`;
      } else {
        // Absolute fallback: try to use the current hostname or return relative path
        return path;
      }
    }
    
    return new URL(path, base).toString();
  } catch (error) {
    console.warn("Error resolving API URL, falling back to relative:", error);
    return path;
  }
}

// Simple helper to fetch and merge users
export async function syncUsersWithServer(): Promise<any[]> {
  try {
    const saved = localStorage.getItem('angels_custom_users');
    const localUsers = saved ? JSON.parse(saved) : [];

    const response = await fetch(getApiUrl('/api/sync'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users: localUsers }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.users)) {
        localStorage.setItem('angels_custom_users', JSON.stringify(result.users));
        return result.users;
      }
    }
  } catch (error) {
    console.warn("Server sync is unavailable, running in local-only mode:", error);
  }
  
  // Return local storage users as fallback
  const saved = localStorage.getItem('angels_custom_users');
  return saved ? JSON.parse(saved) : [];
}

// Register a new user on the server and update local storage
export async function registerUserOnServer(newUser: any): Promise<boolean> {
  try {
    // 1. Update local storage first for instant feedback
    const saved = localStorage.getItem('angels_custom_users');
    const localUsers = saved ? JSON.parse(saved) : [];
    if (!localUsers.some((u: any) => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      localUsers.push(newUser);
      localStorage.setItem('angels_custom_users', JSON.stringify(localUsers));
    }

    // 2. Send to server
    const response = await fetch(getApiUrl('/api/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: newUser }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        // Fetch fresh list from server to stay 100% in sync
        await syncUsersWithServer();
        return true;
      }
    }
  } catch (error) {
    console.error("Failed to register on server, saved locally:", error);
  }
  return false;
}

// Update user profile on the server and update local storage
export async function updateUserOnServer(updatedProfile: any): Promise<boolean> {
  try {
    // 1. Update local storage first
    const saved = localStorage.getItem('angels_custom_users');
    if (saved) {
      const localUsers = JSON.parse(saved);
      const index = localUsers.findIndex((u: any) => u.username.toLowerCase() === updatedProfile.username.toLowerCase());
      if (index !== -1) {
        localUsers[index] = {
          ...localUsers[index],
          ...updatedProfile,
          // Map RegistrationView names to InteractiveWelcomeSplash names
          service: updatedProfile.currentService || updatedProfile.service,
        };
        localStorage.setItem('angels_custom_users', JSON.stringify(localUsers));
      }
    }

    // 2. Send to server
    const response = await fetch(getApiUrl('/api/update-profile'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile: updatedProfile }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        await syncUsersWithServer();
        return true;
      }
    }
  } catch (error) {
    console.error("Failed to update on server, updated locally:", error);
  }
  return false;
}
