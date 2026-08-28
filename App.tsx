/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { USER_PROFILE, SCORE_HISTORY } from './data';
import { ActiveExam, ScoreHistoryItem, UserProfile } from './types';
import { syncUsersWithServer } from './sync';

// Importing Modular Views
import MaterialsView from './components/MaterialsView';
import ExamsView from './components/ExamsView';
import DashboardView from './components/DashboardView';
import PracticalView from './components/PracticalView';
import AchievementsView from './components/AchievementsView';
import RegistrationView from './components/RegistrationView';
import ActiveQuizModal from './components/ActiveQuizModal';
import DiscountsView from './components/DiscountsView';
import AdminView from './components/AdminView';
import PageHeaderBanner from './components/PageHeaderBanner';
import InteractiveWelcomeSplash from './components/InteractiveWelcomeSplash';

// Icons
import {
  BookOpen,
  GraduationCap,
  Calendar,
  LogOut,
  Bell,
  Menu,
  X,
  Award,
  BadgeAlert,
  ClipboardList,
  Sparkles,
  Search,
  Settings,
  Flame,
  LayoutDashboard,
  User,
  LucideIcon,
  Lock,
  BadgePercent
} from 'lucide-react';

export default function App() {
  const [loginMethod, setLoginMethod] = useState<'quick' | 'full' | null>(() => {
    const lastProfile = localStorage.getItem('angels_last_saved_profile');
    if (lastProfile) {
      return 'full';
    }
    const local = localStorage.getItem('angels_login_method');
    const session = sessionStorage.getItem('angels_login_method');
    return (local || session) as 'quick' | 'full' | null;
  });

  const [activeTab, setActiveTab] = useState<'materials' | 'exams' | 'dashboard' | 'practical' | 'achievements' | 'registration' | 'discounts' | 'admin'>(() => {
    const lastProfile = localStorage.getItem('angels_last_saved_profile');
    if (lastProfile) {
      try {
        const parsed = JSON.parse(lastProfile);
        return parsed.isAdmin ? 'admin' : 'registration';
      } catch (e) {
        return 'registration';
      }
    }
    const local = localStorage.getItem('angels_login_method');
    const session = sessionStorage.getItem('angels_login_method');
    const saved = local || session;
    if (saved === 'quick') return 'materials';
    
    return 'registration';
  });

  const [showSplash, setShowSplash] = useState<boolean>(() => {
    const lastProfile = localStorage.getItem('angels_last_saved_profile');
    if (lastProfile) {
      return false;
    }
    const local = localStorage.getItem('angels_login_method');
    const session = sessionStorage.getItem('angels_login_method');
    return !(local || session);
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentPortal, setCurrentPortal] = useState<'user' | 'admin'>(() => {
    const lastProfile = localStorage.getItem('angels_last_saved_profile');
    if (lastProfile) {
      try {
        const parsed = JSON.parse(lastProfile);
        if (parsed.isAdmin) return 'admin';
      } catch (e) {}
    }
    return 'user';
  });

  // Intercept view navigation for Quick Guest mode
  const changeTab = (tab: 'materials' | 'exams' | 'dashboard' | 'practical' | 'achievements' | 'registration' | 'discounts' | 'admin') => {
    if (loginMethod === 'quick' && tab !== 'materials' && tab !== 'exams') {
      triggerToast('🔒 عذراً، هذا القسم مغلق لزوار الدخول السريع. يرجى تسجيل الدخول بحساب كامل لتفعيل كافة خواص التقييم والمواد والخصم والدراسة.');
      return;
    }
    if (userProfile.disableDashboardAccess && (tab === 'dashboard' || tab === 'admin')) {
      triggerToast('🔒 عذراً، لوحة التحكم والتحليلات البيانية الكبرى (Dashboard/Admin Panel) مغلقة للحسابات الكلاسيكية الكلية القديمة. يرجى تسجيل حساب مستخدم جديد للاستمتاع وحصد النقاط والمتابعة الكاملة.');
      return;
    }
    setActiveTab(tab);
    setShowSplash(false);
  };

  const handleLoginQuick = () => {
    setLoginMethod('quick');
    localStorage.setItem('angels_login_method', 'quick');
    setActiveTab('materials');
    setShowSplash(false);
    triggerToast('✓ تم الدخول السريع كزائر بنجاح. تصفح الآن كراسات المواد العلمية والدراسية والكتب المتاحة.');
  };

  const handleLoginFull = (customProfile?: Partial<UserProfile>, defaultTab: any = 'registration') => {
    setLoginMethod('full');
    
    // Always store full login state in localStorage to guarantee auto-login persistence on the device
    localStorage.setItem('angels_login_method', 'full');
    localStorage.setItem('angels_remember_me', 'true');
    
    let targetTab = defaultTab;
    
    if (customProfile) {
      const updated = {
        ...userProfile,
        ...customProfile
      };
      
      if (updated.disableDashboardAccess && (targetTab === 'dashboard' || targetTab === 'admin')) {
        targetTab = 'materials';
      }
      
      setUserProfile(updated);
      
      localStorage.setItem('angels_user_profile_v1', JSON.stringify(updated));
      localStorage.setItem('angels_last_saved_profile', JSON.stringify(updated));
      
      setPoints(updated.points || 0);
      setCompletedExamsCount(updated.completedExams || 0);
    } else {
      if (userProfile.disableDashboardAccess && (targetTab === 'dashboard' || targetTab === 'admin')) {
        targetTab = 'materials';
      }
      localStorage.setItem('angels_last_saved_profile', JSON.stringify(userProfile));
    }
    
    // Clear explicit session logout block so it can auto-login next time
    sessionStorage.removeItem('angels_just_logged_out');
    
    setActiveTab(targetTab);
    setShowSplash(false);
    triggerToast(`✓ مرحباً بك يا ${customProfile?.fullName || userProfile.fullName}! تم تسجيل دخولك بنجاح، وفتح كافة الأقسام التفاعلية.`);
  };
  
  // High fidelity toast notification banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState<string[]>([
    'تم تحديث كشف درجات الشهر الحالي لمسار القسم الروحي.',
    'تنبيه عملي: يرجى تسليم نموذج الإسعافات الأولية قبل غد.',
    'مبارك! لقد وصلت لرتبة الخادم المميز بحصولك على 2450 نقطة!'
  ]);

  // Main global interactive states that update across screens
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>(SCORE_HISTORY);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const localProfile = localStorage.getItem('angels_user_profile_v1');
    const sessionProfile = sessionStorage.getItem('angels_user_profile_v1');
    const saved = localProfile || sessionProfile;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      fullName: USER_PROFILE.fullName,
      age: USER_PROFILE.age,
      phone: USER_PROFILE.phone,
      address: USER_PROFILE.address,
      currentService: USER_PROFILE.currentService,
      avatarUrl: USER_PROFILE.avatarUrl,
      logoUrl: USER_PROFILE.logoUrl,
      level: USER_PROFILE.level,
      rankOrder: USER_PROFILE.rankOrder,
      points: USER_PROFILE.points,
      completedExams: USER_PROFILE.completedExams,
      averageResult: USER_PROFILE.averageResult,
      password: '123456',
    };
  });

  const [points, setPoints] = useState(userProfile.points);
  const [completedExamsCount, setCompletedExamsCount] = useState(userProfile.completedExams);

  // Sync user profile with points and exams count changes
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      points: points,
      completedExams: completedExamsCount
    }));
  }, [points, completedExamsCount]);

  // Persist userProfile changes dynamically
  useEffect(() => {
    const rememberMe = localStorage.getItem('angels_remember_me') === 'true';
    if (rememberMe) {
      localStorage.setItem('angels_user_profile_v1', JSON.stringify(userProfile));
    } else {
      sessionStorage.setItem('angels_user_profile_v1', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Active quiz simulator triggers
  const [activeExamToSimulate, setActiveExamToSimulate] = useState<ActiveExam | null>(null);

  // Set document direction to RTL for beautiful Arabic text flow
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // Sync local custom users with server on startup
    syncUsersWithServer().then(syncedUsers => {
      console.log(`✓ Synchronized ${syncedUsers.length} users with central server database.`);
    }).catch(err => {
      console.warn("Failed to sync users with central server on startup:", err);
    });

    // Startup check: if a saved profile exists and they didn't just log out in this browser session, auto-login!
    const savedProfileStr = localStorage.getItem('angels_last_saved_profile');
    const justLoggedOut = sessionStorage.getItem('angels_just_logged_out') === 'true';
    if (savedProfileStr && !justLoggedOut && !loginMethod) {
      try {
        const savedProfile = JSON.parse(savedProfileStr);
        handleLoginFull(savedProfile, 'registration');
        triggerToast(`✨ مرحباً بك مجدداً! تم تسجيل دخولك تلقائياً بحسابك الموثق على هذا الجهاز.`);
      } catch (e) {
        console.error("Auto login error on startup:", e);
      }
    }

    // Dynamic direct login check via scanned QR code username parameter
    const params = new URLSearchParams(window.location.search);
    const queryUsername = params.get('username');
    if (queryUsername) {
      // 1. Fetch custom users list
      const saved = localStorage.getItem('angels_custom_users');
      let matchingUser = null;
      if (saved) {
        try {
          const list = JSON.parse(saved);
          matchingUser = list.find((u: any) => u.username === queryUsername);
        } catch (e) {}
      }
      
      // 2. If matched, perform full auto-login!
      if (matchingUser) {
        handleLoginFull(matchingUser, 'registration');
        triggerToast(`✨ تم تسجيل الدخول المباشر والتلقائي بنجاح عبر قراءة رمز الـ QR المعتمد للخادم @${queryUsername}!`);
      } else if (queryUsername === 'fady_full' || queryUsername === 'member' || queryUsername === 'admin') {
        // Default users fallback
        handleLoginFull({}, 'registration');
        triggerToast(`✨ تم تسجيل الدخول المباشر والتلقائي بنجاح عبر قراءة رمز الـ QR المعتمد!`);
      } else {
        triggerToast(`⚠️ عذراً، لم نتمكن من العثور على خادم موثق بـ @${queryUsername} بقاعدة بيانات الـ QR.`);
      }
      
      // Clean query parameter from URL without reloading page
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // Synchronize registered servant parameters when switching tabs so points and level updates are real-time
  useEffect(() => {
    const saved = localStorage.getItem('angels_user_profile_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.points !== points) {
          setPoints(parsed.points);
        }
        if (parsed.completedExams !== completedExamsCount) {
          setCompletedExamsCount(parsed.completedExams);
        }
        setUserProfile(parsed);
      } catch (e) {}
    }
  }, [activeTab]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    // Add to the header panel notifications too
    setNotificationsList(prev => [msg, ...prev]);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleStartExamSimulation = (exam: ActiveExam) => {
    setActiveExamToSimulate(exam);
  };

  const handleFinishExamSimulation = (percentageScore: number) => {
    if (!activeExamToSimulate) return;

    // 1. Log a new score history item representing dynamic assessment completion
    const newItem: ScoreHistoryItem = {
      id: `score-${Date.now()}`,
      subjectName: activeExamToSimulate.title,
      date: 'اليوم (الآن)',
      maxScore: 100,
      achievedScore: percentageScore,
      status: percentageScore >= 50 ? 'passed' : 'failed',
      category: activeExamToSimulate.category
    };

    setScoreHistory(prev => [newItem, ...prev]);
    
    // 2. Increase points based on score
    const pointsGained = Math.round(percentageScore * 2.5);
    setPoints(prev => prev + pointsGained);

    // 3. Mark completed count
    setCompletedExamsCount(prev => prev + 1);

    // 4. Trigger celebration banner
    triggerToast(
      `تهانينا! لقد أكملت اختبار "${activeExamToSimulate.title}" وحصلت على ${percentageScore}%. تم كسب +${pointsGained} نقطة إنجاز!`
    );

    setActiveExamToSimulate(null);
  };

  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Remove only active session indicator to go to splash screen
    localStorage.removeItem('angels_login_method');
    sessionStorage.removeItem('angels_login_method');
    
    // Do NOT remove angels_user_profile_v1, angels_last_saved_profile, or angels_remember_me,
    // so that auto-login works perfectly when reloading or revisiting on the same device.
    // Also, we remove the "just logged out" restriction so reload auto-logs in instantly.
    sessionStorage.removeItem('angels_just_logged_out');
    
    setLoginMethod(null);
    setShowLogoutConfirm(false);
    setShowSettingsModal(false);
    setShowSplash(true);
    triggerToast('✓ تم تسجيل الخروج بنجاح والرجوع للأرضية الافتتاحية للمنصة مع حفظ الحساب للدخول التلقائي.');
  };

  if (showSplash) {
    return (
      <InteractiveWelcomeSplash 
        userProfile={userProfile} 
        loginMethod={loginMethod}
        onLoginQuick={handleLoginQuick}
        onLoginFull={handleLoginFull}
        activeTab={activeTab}
        setActiveTab={changeTab}
        onNotify={triggerToast}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col font-sans antialiased pb-24 md:pb-0 md:pr-64">
      
      {/* Dynamic Floating Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-4 z-[100] max-w-sm sm:max-w-md bg-white border-r-4 border-[#15803d] rounded-xl shadow-2xl p-4 flex gap-3 items-start animate-bounce text-right">
          <div className="bg-[#dcfce7] p-2 rounded-lg text-[#15803d] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-bold text-xs text-[#15803d]">إشعار المنصة الفوري</h5>
            <p className="font-sans text-xs text-[#434654] mt-1 leading-relaxed">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 text-xs shrink-0 self-center pr-2">
            ✕
          </button>
        </div>
      )}

      {/* Top Header Navigation Bar (Mobile & Desktop Global Head) */}
      <header className="fixed top-0 left-0 md:left-0 right-0 h-16 bg-white border-b border-[#c3c5d7]/30 px-4 md:px-10 flex items-center justify-between z-40 shadow-xs">
        
        {/* Profile and Logo active redirect link */}
        <button 
          onClick={() => setShowSplash(true)} 
          className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-all focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 rounded-xl p-1 text-right"
          title="الانتقال إلى الصفحة الافتتاحية والواجهة الرئيسية"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#15803d]/20 bg-emerald-50 shrink-0 shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              src={userProfile.logoUrl || USER_PROFILE.logoUrl} 
              alt="شعار مؤسسة أصدقاء الملائكة" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <h1 className="font-display text-sm md:text-lg font-black text-[#15803d] tracking-tight">مؤسسة أصدقاء الملائكة</h1>
        </button>

        {/* GUEST BANNER INDICATION (تنبيه كزائر ذكي) */}
        {loginMethod === 'quick' && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-950 px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold animate-pulse">
            <span>⚠️ أنت تستخدم التطبيق كزائر</span>
            <button 
              onClick={() => {
                localStorage.removeItem('angels_login_method');
                setLoginMethod(null);
                setShowSplash(true);
              }}
              className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black rounded-md text-[9px] transition-all cursor-pointer"
            >
              سجل حسابك الآن
            </button>
          </div>
        )}

        {/* Global Notifications and interactive dropdown trigger */}
        <div className="flex items-center gap-3 relative">
          
          {/* Quick Return & Logout Header Button */}
          <button 
            onClick={initiateLogout}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-rose-50 text-[#dc2626] transition-colors"
            title="خروج وعودة للمنصة الافتتاحية"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-[#15803d]" />
            <span className="absolute top-2 left-2.5 w-2 h-2 rounded-full bg-red-650 bg-red-500" />
          </button>

          {/* User profile tiny preview */}
          <button 
            onClick={() => changeTab('registration')}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#15803d]/30 hover:border-[#15803d] hidden sm:block cursor-pointer transition-all"
            title="تعديل الملف الشخصي"
          >
            <img 
              className="w-full h-full object-cover" 
              src={userProfile.avatarUrl} 
              alt="Profile" 
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Notification Droplist Drawer */}
          {showNotifications && (
            <div className="absolute top-12 left-0 w-72 bg-white rounded-xl border border-[#c3c5d7] shadow-xl overflow-hidden text-right z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-[#dcfce7] p-3 text-xs font-display font-extrabold text-[#15803d] flex justify-between items-center border-b border-[#c3c5d7]/35">
                <span>تنبيهات المنصة الأخيرة ({notificationsList.length})</span>
                <button onClick={() => setNotificationsList([])} className="text-[10px] text-slate-500 hover:underline">
                  مسح الكل
                </button>
              </div>
              <div className="p-2 space-y-2 max-h-60 overflow-y-auto divide-y divide-slate-100">
                {notificationsList.length > 0 ? (
                  notificationsList.map((noti, idx) => (
                    <div key={idx} className="p-2 text-xs font-sans text-slate-700 leading-relaxed pt-2.5">
                      {noti}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    لا تتوفر إشعارات جديدة حالياً.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </header>

      {/* Desktop Main Side Navigation Panel (Sticky on right in RTL) */}
      <aside className="hidden md:flex fixed top-16 right-0 bottom-0 w-64 bg-white border-l border-[#c3c5d7]/30 flex-col p-4 z-30 justify-between">
        
        {/* Profile Card Summary Banner Header connected to live registered values */}
        <div className="flex flex-col items-center py-4 border-b border-[#c3c5d7]/20">
          <button 
            onClick={() => changeTab('registration')}
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 mb-2.5 relative shadow-md cursor-pointer hover:scale-105 transition-all"
            title="تحديث صورة التسجيل"
          >
            <img 
               className="w-full h-full object-cover" 
               src={userProfile.avatarUrl} 
               alt="Avatar Headshot" 
               referrerPolicy="no-referrer"
            />
          </button>
          <h4 className="font-display font-extrabold text-sm text-[#151c27] text-center px-2 truncate max-w-[220px]">
             {userProfile.fullName.split(' ').slice(0, 2).join(' ') || userProfile.fullName}
          </h4>
          {userProfile.username && (
            <p className="text-[11px] font-mono font-bold text-slate-400 text-center select-all" dir="ltr">
              @{userProfile.username}
            </p>
          )}
          <p className="font-sans text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md mt-1 mb-0.5 text-center">
            {userProfile.level}
          </p>
          <p className="font-sans text-[10px] text-[#434654] opacity-85 text-center">{userProfile.rankOrder}</p>
        </div>
           {/* Active Portal Digital Switcher (بوابة المستخدم 👤 وبوابة الإدارة 🔑) */}
        <div className="mx-3 mt-3 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-1.5 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold block">مستوى الدخول المفعل للمنصة</span>
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-xl">
            <button 
              type="button"
              onClick={() => {
                setCurrentPortal('user');
                setActiveTab('dashboard');
                triggerToast('👤 تم الانتقال إلى بوابة خادم الملائكة (بوابة المستخدم) بنجاح.');
              }}
              className={`py-1.5 px-0.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer ${
                currentPortal === 'user' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-250/20'
              }`}
            >
              بوابة خادم
            </button>
            <button 
              type="button"
              onClick={() => {
                setCurrentPortal('admin');
                setActiveTab('admin');
                triggerToast('🔑 تم الانتقال إلى بوابة السيطرة والإرشاد الفني والأمن (بوابة المشرفين).');
              }}
              className={`py-1.5 px-0.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer ${
                currentPortal === 'admin' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-250/20'
              }`}
            >
              بوابة الإدارة
            </button>
          </div>
        </div>

        {/* Categories / Navigation Links filtered dynamically by selected portal */}
        <nav className="space-y-1 mt-4 flex-grow overflow-y-auto pr-1">
          
          {currentPortal === 'user' ? (
            <>
              {/* User Portal Navigation Links */}
              <button
                onClick={() => changeTab('registration')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'registration'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-50/50 hover:text-blue-700'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>الملف التعريفي</span>
              </button>

              <button
                onClick={() => changeTab('materials')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'materials'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-50/50 hover:text-blue-700'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>المناهج والمواد العلمية</span>
              </button>

              <button
                onClick={() => changeTab('exams')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'exams'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-50/50 hover:text-blue-700'
                }`}
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>الاختبارات والمهام</span>
              </button>

              <button
                onClick={() => changeTab('discounts')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'discounts'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-50/50 hover:text-blue-700'
                }`}
              >
                <BadgePercent className={`w-4 h-4 shrink-0 ${activeTab === 'discounts' ? 'text-white' : 'text-blue-600'}`} />
                <span>البونص والخصومات</span>
              </button>

              <button
                onClick={() => changeTab('practical')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'practical'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-50/50 hover:text-blue-700'
                }`}
              >
                <BadgeAlert className="w-4 h-4 shrink-0" />
                <span>التقييم الميداني</span>
              </button>

              <button
                onClick={() => changeTab('dashboard')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-50/50 hover:text-blue-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-500" />
                <span>لوحة البيانات والتحكم</span>
              </button>
            </>
          ) : (
            <>
              {/* Admin Portal Navigation Links */}
              <div className="p-3 bg-blue-50 border border-blue-150 rounded-2xl mb-2 text-right">
                <span className="text-[10px] text-blue-800 font-extrabold block">🔑 بوابات الرقابة والإدارة</span>
                <p className="text-[9.5px] text-slate-500 leading-relaxed mt-1">
                  أنت مخول الآن لقراءة كشف درجات الطلاب، إعمال التعديلات وصرف الكود المكافئ لبونص الأوائل والمراقب الميداني.
                </p>
              </div>

              <button
                onClick={() => changeTab('admin')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-label text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#434654] hover:bg-blue-550/20 hover:text-blue-700'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0 text-amber-500" />
                <span>غرفة الإدارة والسيطرة (رقم سري)</span>
              </button>
            </>
          )}

        </nav>

        {/* Footer actions like Logout and Settings */}
        <div className="pt-3 border-t border-[#c3c5d7]/20 space-y-1">
          <button 
            onClick={() => setShowSplash(true)}
            className="w-full flex items-center gap-3.5 p-2 rounded-lg text-xs font-bold text-amber-600 hover:bg-amber-50/60 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-550 animate-pulse text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span>عرض الصفحة الافتتاحية التفاعلية</span>
          </button>

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center gap-3.5 p-2 rounded-lg text-xs font-semibold text-[#434654] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>الإعدادات المتقدمة</span>
          </button>

          <button 
            onClick={initiateLogout}
            className="w-full flex items-center gap-3.5 p-2 rounded-lg text-xs font-bold text-red-650 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

      </aside>

      {/* Main Container Stage */}
      <main className="flex-grow pt-24 px-4 md:px-10 pb-24 max-w-7xl mx-auto w-full">
        
        {/* Dynamic page cover with responsive name illustration */}
        <PageHeaderBanner tab={activeTab} />

        {/* Render Selected View Component */}
        {activeTab === 'registration' && (
          <RegistrationView 
            userProfile={userProfile}
            onChangeProfile={setUserProfile}
            onNotify={triggerToast}
            onLogout={initiateLogout}
            onChangeTab={changeTab}
          />
        )}
        {activeTab === 'materials' && (
          <MaterialsView onNotify={triggerToast} onChangeTab={changeTab} />
        )}
        {activeTab === 'exams' && (
          <ExamsView 
            onStartExam={handleStartExamSimulation} 
            scoreHistoryState={scoreHistory}
            onNotify={triggerToast}
            onChangeTab={changeTab}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardView 
            onNotify={triggerToast} 
            onNavigateToPractical={() => changeTab('practical')} 
            pointsAccumulated={points}
          />
        )}
        {activeTab === 'practical' && (
          <PracticalView onNotify={triggerToast} />
        )}
        {activeTab === 'discounts' && (
          <DiscountsView onNotify={triggerToast} />
        )}
        {activeTab === 'admin' && (
          <AdminView 
            onNotify={triggerToast} 
            onRefreshGlobalData={() => {
              const saved = localStorage.getItem('angels_user_profile_v1');
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  setPoints(parsed.points);
                } catch (e) {}
              }
            }}
          />
        )}

      </main>

      {/* Mobile Sticky Bottom Navigation Dock (Hidden on Large Screen) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-[#c3c5d7]/40 flex overflow-x-auto justify-around items-center px-1.5 z-40 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)] scrollbar-none">
        
        {currentPortal === 'user' ? (
          <>
            <button
              onClick={() => changeTab('registration')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[50px] ${
                activeTab === 'registration' 
                  ? 'bg-blue-50 text-blue-700 font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">الملف</span>
            </button>

            <button
              onClick={() => changeTab('materials')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[50px] ${
                activeTab === 'materials' 
                  ? 'bg-blue-50 text-blue-700 font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">المناهج</span>
            </button>

            <button
              onClick={() => changeTab('exams')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[50px] ${
                activeTab === 'exams' 
                  ? 'bg-blue-50 text-blue-700 font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">الاختبارات</span>
            </button>

            <button
              onClick={() => changeTab('discounts')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[50px] ${
                activeTab === 'discounts'
                  ? 'bg-blue-50 text-blue-700 font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <BadgePercent className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">البونص</span>
            </button>

            <button
              onClick={() => changeTab('practical')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[50px] ${
                activeTab === 'practical'
                  ? 'bg-blue-50 text-blue-700 font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <BadgeAlert className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">الميداني</span>
            </button>

            <button
              onClick={() => changeTab('dashboard')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[50px] ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="text-[9px] font-label font-bold mt-1">التحكم</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setCurrentPortal('user');
                setActiveTab('registration');
                triggerToast('👤 تم الرجوع إلى بوابة الطالب (بوابة خادم).');
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[120px] text-blue-700 bg-blue-50 font-black border border-blue-150"
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">↩ العودة لبوابة خادم</span>
            </button>

            <button
              onClick={() => changeTab('admin')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all shrink-0 min-w-[120px] ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white font-bold px-2 py-1' 
                  : 'text-[#434654]'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-label font-bold mt-1">غرفة الإدارة والسيطرة</span>
            </button>
          </>
        )}

      </nav>

      {/* Live exam simulator modal popup */}
      {activeExamToSimulate && (
        <ActiveQuizModal 
          exam={activeExamToSimulate}
          onClose={() => setActiveExamToSimulate(null)}
          onFinish={handleFinishExamSimulation}
        />
      )}

      {/* 🔴 Custom Logout Confirmation Dialog Modal (حوار تأكيد الخروج الذكي) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[150] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center border border-slate-105 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-slate-900 leading-tight">تأكيد تسجيل الخروج</h3>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
              هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك الحالي؟ إذا قمت بالخروج، ستحتاج لإدخال اسم المستخدم وكلمة المرور الخاصة بك للولوج مجدداً.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={confirmLogout}
                className="py-2.5 px-4 bg-[#dc2626] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                تأكيد الخروج
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                بقاء في المنصة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ Custom Advanced Settings Modal Layout (نافذة الإعدادات المتقدمة المدمجة بقرار الخروج) */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-[140] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-right border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-display font-black text-base text-[#15803d] flex items-center gap-1.5">
                <Settings className="w-5 h-5" />
                <span>الإعدادات المتقدمة للمشترك</span>
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Profile Summary within settings */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-250 border-emerald-300">
                <img src={userProfile.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="leading-tight">
                <strong className="block text-slate-900 text-xs font-display">{userProfile.fullName}</strong>
                <span className="text-[10px] text-slate-400 font-mono" dir="ltr">@{userProfile.username || 'guest'}</span>
              </div>
            </div>

            {/* Preferences block */}
            <div className="space-y-4 font-sans text-xs mb-6 text-slate-800">
              <div className="flex items-center justify-between p-1">
                <span>🔔 تفعيل نظام الإشعارات الفورية:</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#15803d]" />
              </div>

              <div className="flex items-center justify-between p-1">
                <span>🎵 تشغيل المؤثرات الصوتية عند إنهاء الاختبار:</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#15803d]" />
              </div>

              <div className="flex items-center justify-between p-1">
                <span>📳 رنين الاهتزاز عند استلام مكافأة (موبايل):</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#15803d]" />
              </div>

              <div className="flex items-center justify-between p-1 border-t border-slate-100 pt-3">
                <span>نسخة تطبيق البوابة الكلية:</span>
                <strong className="font-mono text-[10px] text-slate-450 text-slate-500">v1.2.8 PRO - 2026</strong>
              </div>
            </div>

            {/* Exit Section inside Settings view */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setShowSettingsModal(false);
                  initiateLogout();
                }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من الحساب الحالي فورا</span>
              </button>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                عرض التغييرات وحفظ الاستكشاف
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
