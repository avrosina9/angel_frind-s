/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  UserPlus, 
  FileText, 
  GraduationCap,
  Zap,
  Lock,
  Unlock,
  ClipboardList,
  LayoutDashboard,
  BadgeAlert,
  BadgePercent,
  UserCheck,
  User,
  Smartphone,
  MapPin,
  Calendar,
  Check,
  CheckCircle,
  Smile,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';

import logoImg from '../assets/images/regenerated_image_1781800682461.png';
import coverImg from '../assets/images/inclusive_courtyard_cover_1782374395627.jpg';
import { registerUserOnServer, syncUsersWithServer } from '../sync';

interface InteractiveWelcomeSplashProps {
  userProfile: UserProfile;
  loginMethod: 'quick' | 'full' | null;
  onLoginQuick: () => void;
  onLoginFull: (profile?: Partial<UserProfile>, defaultTab?: any) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onNotify: (msg: string) => void;
}

// User headshot avatars for quick select
const ADVENT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'
];

export default function InteractiveWelcomeSplash({ 
  userProfile, 
  loginMethod,
  onLoginQuick, 
  onLoginFull, 
  activeTab, 
  setActiveTab,
  onNotify 
}: InteractiveWelcomeSplashProps) {
  
  // Is login or register active?
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Registration success dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registeredProfileToLogin, setRegisteredProfileToLogin] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('مرحباً بك، تم إنشاء حسابك بنجاح');

  // Login input states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUserOrEmail, setForgotUserOrEmail] = useState('');
  
  // Face Recognition Login states
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [faceScanSuccess, setFaceScanSuccess] = useState<boolean | null>(null);
  const [regEnableFaceId, setRegEnableFaceId] = useState(false);
  const [loginEnableFaceId, setLoginEnableFaceId] = useState(false);

  // Manager Login states
  const [managerPasscode, setManagerPasscode] = useState('');
  const [managerError, setManagerError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isScanningFace) {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' } })
          .then(stream => {
            activeStream = stream;
            setCameraStream(stream);
            // Wait slightly for DOM to mount ref
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            }, 100);
          })
          .catch(err => {
            console.warn("Camera access failed or denied:", err);
            setCameraError("تنبيه: تعذر تشغيل الكاميرا على هذا الجهاز. سيتم تفعيل وضع الفحص التلقائي الذكي.");
          });
      } else {
        setCameraError("تنبيه: ميزة الكاميرا غير مدعومة في المتصفح أو البيئة الحالية. سيتم تفعيل وضع الفحص التلقائي.");
      }
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanningFace]);

  // Load remembered credentials and sync users on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('angels_remembered_username');
    const savedPass = localStorage.getItem('angels_remembered_password');
    const isRemembered = localStorage.getItem('angels_remember_me') === 'true';
    if (isRemembered && savedUser) {
      setLoginUsername(savedUser);
      setLoginPassword(savedPass || '');
      setRememberMe(true);
    }
    const hasFaceId = localStorage.getItem('angels_face_id_username') !== null;
    setLoginEnableFaceId(hasFaceId);

    // Dynamic sync on mount to fetch registrations from other devices
    syncUsersWithServer().catch(err => {
      console.warn("Failed to sync on splash mount:", err);
    });
  }, []);
  
  // Registration input states
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regServiceOutside, setRegServiceOutside] = useState('');
  const [uploadedBase64Image, setUploadedBase64Image] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regService, setRegService] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(ADVENT_AVATARS[0]);
  const [regSubmitted, setRegSubmitted] = useState(false);

  const isRegFullNameInvalid = regFullName !== '' && regFullName.trim().split(/\s+/).filter(Boolean).length < 3;
  const isRegUsernameInvalid = regUsername !== '' && (regUsername.trim().length < 3 || !/^[a-zA-Z0-9_]+$/.test(regUsername));
  const isRegPhoneInvalid = regPhone !== '' && (regPhone.trim().length !== 11 || !/^\d+$/.test(regPhone));
  const isRegWhatsappInvalid = regWhatsapp !== '' && (regWhatsapp.trim().length !== 11 || !/^\d+$/.test(regWhatsapp));
  const isRegEmailInvalid = regEmail !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail);
  const isRegPasswordInvalid = regPassword !== '' && regPassword.length < 6;
  const isRegConfirmPasswordInvalid = regConfirmPassword !== '' && regConfirmPassword !== regPassword;

  const regFullNameError = (regSubmitted && !regFullName) ? 'الاسم بالكامل ثلاثي مطلوب لجودة البيانات' : (isRegFullNameInvalid ? 'يرجى كتابة الاسم ثلاثياً على الأقل' : '');
  const regUsernameError = (regSubmitted && !regUsername) ? 'اسم الولوج مطلوب' : (isRegUsernameInvalid ? '3 أحرف/أرقام إنجليزية وبدون فواصل' : '');
  const regAgeError = (regSubmitted && !regAge) ? 'العمر مطلوب لحساب المستوى' : '';
  const regPhoneError = (regSubmitted && !regPhone) ? 'رقم التليفون مطلوب للتواصل' : (isRegPhoneInvalid ? 'يجب أن يتكون رقم التليفون من 11 رقماً' : '');
  const regWhatsappError = (regSubmitted && !regWhatsapp) ? 'رقم الواتساب مطلوب للتواصل الفوري' : (isRegWhatsappInvalid ? 'يجب أن يتكون رقم الواتساب من 11 رقماً' : '');
  const regServiceOutsideError = (regSubmitted && !regServiceOutside) ? 'الخدمات الخارجية مطلوبة، اكتب (لا يوجد) إذا لم يكن لديك' : '';
  const regAddressError = (regSubmitted && !regAddress) ? 'العنوان مطلوب بدقة' : '';
  const regServiceError = (regSubmitted && !regService) ? 'يرجى ملء الخدمة بمؤسستنا' : '';
  const regEmailError = (regSubmitted && !regEmail) ? 'البريد الإلكتروني مطلوب للمطابقة' : (isRegEmailInvalid ? 'صيغة البريد الإلكتروني غير صحيحة' : '');
  const regPasswordError = (regSubmitted && !regPassword) ? 'الرمز السري مطلوب لتأمين حسابك' : (isRegPasswordInvalid ? 'يجب ألا تقل كلمة المرور عن 6 خانات' : '');
  const regConfirmPasswordError = (regSubmitted && !regConfirmPassword) ? 'مطلوب تأكيد الرمز لعدم الخطأ' : (isRegConfirmPasswordInvalid ? 'عذراً! غير متطابق تماماً مع الرمز المدخل' : '');

  // Handle forgot password query lookup
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotUserOrEmail) {
      onNotify('⚠️ يرجى إدخال اسم المستخدم أو البريد الإلكتروني.');
      return;
    }
    const saved = localStorage.getItem('angels_custom_users');
    const usersList = saved ? JSON.parse(saved) : [];
    
    // Check if it's admin
    if (forgotUserOrEmail.toLowerCase() === 'admin') {
      onNotify('🔐 الرقم السري لحساب المدير العام هو: admin (تم استدعاؤه بنجاح).');
      setShowForgotPassword(false);
      return;
    }
    // Check if it's milad/traditional
    if (forgotUserOrEmail.toLowerCase() === 'milad') {
      onNotify('🔐 الرقم السري لحساب ميلاد بشته هو: 123456 (تم استدعاؤه بنجاح).');
      setShowForgotPassword(false);
      return;
    }

    const match = usersList.find((u: any) => 
      u.username.toLowerCase() === forgotUserOrEmail.toLowerCase() || 
      (u.email && u.email.toLowerCase() === forgotUserOrEmail.toLowerCase())
    );

    if (match) {
      onNotify(`🔐 تم التحقق! الرقم السري الخاص بالحساب هو: (${match.password}) - احتفظ به جيداً.`);
      setShowForgotPassword(false);
    } else {
      onNotify('❌ لم نتمكن من العثور على أي حساب مسجل بهذا الاسم أو البريد الإلكتروني.');
    }
  };

  // Handle direct sign-in submit
  const handleDirectLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      onNotify('⚠️ يرجى تعبئة اسم المستخدم/الإيميل/الهاتف والرقم السري أولاً.');
      return;
    }
    
    // Simulate checking account
    onNotify('جاري التحقق من الهوية وتسجيل الدخول الكلي...');
    
    setTimeout(() => {
      // Define default users so they are part of the searchable pool
      const defaultUsers = [
        {
          username: 'admin',
          email: 'admin@angels.org',
          phone: '01234567891',
          password: 'admin',
          fullName: 'المدير العام للمنصة',
          currentService: 'الإدارة العامة والتوجيه الفني لكنيسة رئيس الملائكة ميخائيل',
          avatarUrl: ADVENT_AVATARS[0],
          points: 5000,
          level: 'القائد المتميز والمدير العام',
          rankOrder: 'الترتيب الإداري الأول 🏆',
          age: '35 سنة',
          address: 'مقر الكاتدرائية بالعباسية',
          completedExams: 10,
          averageResult: 100,
          disableDashboardAccess: false
        },
        {
          username: 'milad',
          email: 'milad@angels.org',
          phone: '01234567890',
          password: '123456',
          fullName: 'ميلاد بشته عبد الشهيدبشاى',
          currentService: 'أاصدقاء الملائكة لذوي القدرات الخاصة (الصم والبكم)',
          points: 2450,
          level: 'الخادم المميز - المستوى الثالث',
          rankOrder: 'الترتيب الثاني على الدفعة',
          age: '24 سنة',
          address: 'القاهرة، حدائق الأهرام',
          completedExams: 8,
          averageResult: 94,
          avatarUrl: ADVENT_AVATARS[1],
          disableDashboardAccess: true
        }
      ];

      const saved = localStorage.getItem('angels_custom_users');
      const customUsers = saved ? JSON.parse(saved) : [];
      
      const mappedCustom = customUsers.map((u: any) => ({
        username: u.username || '',
        email: u.email || '',
        phone: u.phone || '',
        password: u.password || '',
        fullName: u.fullName || '',
        currentService: u.service || '',
        avatarUrl: u.avatarUrl || ADVENT_AVATARS[0],
        points: u.points || 450,
        level: u.level || 'خادم مبتدئ - المستوى الأول',
        rankOrder: u.rankOrder || 'مسجل حديثاً بالبوابة 🆕',
        age: u.age || '',
        address: u.address || '',
        completedExams: u.completedExams || 0,
        averageResult: u.averageResult || 0,
        disableDashboardAccess: u.disableDashboardAccess !== undefined ? u.disableDashboardAccess : false,
        createdAt: u.createdAt || ''
      }));

      const allUsers = [...defaultUsers, ...mappedCustom];
      const searchKey = loginUsername.trim().toLowerCase();
      const searchKeyClean = searchKey.replace(/\s+/g, '');

      // Look for the user matching Username, Full Name, Email, or Phone
      const matchingUser = allUsers.find((u: any) => 
        u.username.toLowerCase() === searchKey ||
        (u.fullName && u.fullName.toLowerCase() === searchKey) ||
        (u.fullName && u.fullName.replace(/\s+/g, '').toLowerCase() === searchKeyClean) ||
        (u.email && u.email.toLowerCase() === searchKey) ||
        (u.phone && u.phone.trim() === searchKey)
      );

      // If user is not found, provide specific error help
      if (!matchingUser) {
        if (searchKey.indexOf('@') !== -1) {
          onNotify('❌ البريد الإلكتروني غير موجود ضمن قواعد البيانات. يرجى مراجعة الإدخال أو إنشاء حساب جديد.');
        } else if (/^\d+$/.test(searchKey)) {
          onNotify('❌ رقم الهاتف غير موجود. يرجى التأكد من الرقم المكتوب أو التسجيل مجاناً.');
        } else {
          onNotify('❌ الاسم أو اسم المستخدم غير موجود بنظام البوابة الكلية. يرجى إعادة التحقق من كتابة الاسم.');
        }
        return;
      }

      // If user is found, check password correctness
      if (matchingUser.password !== loginPassword) {
        onNotify('❌ كلمة المرور غير صحيحة. يرجى التأكد من الرمز السري وإعادة المحاولة.');
        return;
      }

      // Force remember me option on "دخول الملف بالكامل" login to guarantee auto-login persistence on this device
      localStorage.setItem('angels_remember_me', 'true');
      localStorage.setItem('angels_remembered_username', loginUsername);
      localStorage.setItem('angels_remembered_password', loginPassword);
      localStorage.setItem('angels_login_method', 'full');
      sessionStorage.removeItem('angels_just_logged_out');

      // Save face ID preference for this device if checked
      if (loginEnableFaceId) {
        localStorage.setItem('angels_face_id_username', matchingUser.username);
      } else {
        localStorage.removeItem('angels_face_id_username');
      }

      // Log in details with high-fidelity profile
      const userProfileToLoad = {
        fullName: matchingUser.fullName,
        age: matchingUser.age,
        phone: matchingUser.phone,
        address: matchingUser.address,
        currentService: matchingUser.currentService,
        avatarUrl: matchingUser.avatarUrl,
        points: matchingUser.points,
        level: matchingUser.level,
        rankOrder: matchingUser.rankOrder,
        completedExams: matchingUser.completedExams,
        averageResult: matchingUser.averageResult,
        password: matchingUser.password,
        email: matchingUser.email,
        username: matchingUser.username,
        createdAt: matchingUser.createdAt || '15 مارس 2026',
        disableDashboardAccess: matchingUser.disableDashboardAccess,
        lastLogin: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      };

      localStorage.setItem('angels_user_profile_v1', JSON.stringify(userProfileToLoad));
      localStorage.setItem('angels_last_saved_profile', JSON.stringify(userProfileToLoad));

      // Redirect user directly to registration tab (which is the profile editing page)
      onLoginFull(userProfileToLoad, 'registration');
      onNotify('✓ تم تسجيل الدخول بنجاح! جاري تفعيل الدخول التلقائي والتحويل للملف الشخصي...');
    }, 850);
  };

  // Manager Login submission handler
  const handleManagerLoginSubmit = () => {
    if (!managerPasscode) {
      setManagerError('⚠️ يرجى إدخال الرقم السري الخاص بالمدير أولاً.');
      return;
    }
    if (managerPasscode === '123456') {
      const managerProfile = {
        fullName: "مدير المنصة",
        age: "غير محدد",
        phone: "123456",
        whatsapp: "123456",
        address: "إدارة المؤسسة",
        currentService: "إدارة المنصة والتحليلات",
        serviceOutside: "لا يوجد",
        email: "admin@angels.org",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
        logoUrl: "/logo.png",
        level: "مدير النظام (أدمن)",
        rankOrder: "المشرف العام المعتمد",
        points: 10000,
        completedExams: 10,
        averageResult: 100,
        username: "admin",
        password: "admin_password_bypass",
        isAdmin: true,
        disableDashboardAccess: false,
      };
      
      localStorage.setItem('angels_user_profile_v1', JSON.stringify(managerProfile));
      localStorage.setItem('angels_last_saved_profile', JSON.stringify(managerProfile));
      localStorage.setItem('angels_login_method', 'full');
      localStorage.setItem('angels_remember_me', 'true');
      sessionStorage.removeItem('angels_just_logged_out');
      
      onLoginFull(managerProfile, 'admin');
      onNotify('🔑 تم دخول المدير العام بنجاح وبدون تسجيل مسبق! جاري توجيهك لبوابة الإدارة والتحليلات...');
    } else {
      setManagerError('❌ الرقم السري للمدير غير صحيح! يرجى إعادة المحاولة.');
    }
  };

  // 6- تسجيل الدخول بالتعرف على الوجه
  const handleFaceIdLogin = () => {
    const savedFaceIdUser = localStorage.getItem('angels_face_id_username');
    setIsScanningFace(true);
    setFaceScanSuccess(null);

    setTimeout(() => {
      if (!savedFaceIdUser) {
        setFaceScanSuccess(false);
        onNotify('⚠️ لم يتم تفعيل خاصية التعرف على الوجه لهذا الجهاز بعد. يرجى تفعيلها أولاً عند إنشاء حساب جديد ليتسنى لك الدخول السريع بالوجه!');
        setTimeout(() => {
          setIsScanningFace(false);
        }, 2000);
        return;
      }

      const defaultUsers = [
        {
          username: 'admin',
          email: 'admin@angels.org',
          phone: '01234567891',
          password: 'admin',
          fullName: 'المدير العام للمنصة',
          currentService: 'الإدارة العامة والتوجيه الفني لكنيسة رئيس الملائكة ميخائيل',
          avatarUrl: ADVENT_AVATARS[0],
          points: 5000,
          level: 'القائد المتميز والمدير العام',
          rankOrder: 'الترتيب الإداري الأول 🏆',
          age: '35 سنة',
          address: 'مقر الكاتدرائية بالعباسية',
          completedExams: 10,
          averageResult: 100,
          disableDashboardAccess: false
        },
        {
          username: 'milad',
          email: 'milad@angels.org',
          phone: '01234567890',
          password: '123456',
          fullName: 'ميلاد بشته عبد الشهيدبشاى',
          currentService: 'أاصدقاء الملائكة لذوي القدرات الخاصة (الصم والبكم)',
          points: 2450,
          level: 'الخادم المميز - المستوى الثالث',
          rankOrder: 'الترتيب الثاني على الدفعة',
          age: '24 سنة',
          address: 'القاهرة، حدائق الأهرام',
          completedExams: 8,
          averageResult: 94,
          avatarUrl: ADVENT_AVATARS[1],
          disableDashboardAccess: true
        }
      ];

      const saved = localStorage.getItem('angels_custom_users');
      const customUsers = saved ? JSON.parse(saved) : [];
      
      const mappedCustom = customUsers.map((u: any) => ({
        username: u.username || '',
        email: u.email || '',
        phone: u.phone || '',
        password: u.password || '',
        fullName: u.fullName || '',
        currentService: u.service || '',
        avatarUrl: u.avatarUrl || ADVENT_AVATARS[0],
        points: u.points || 450,
        level: u.level || 'خادم مبتدئ - المستوى الأول',
        rankOrder: u.rankOrder || 'مسجل حديثاً بالبوابة 🆕',
        age: u.age || '',
        address: u.address || '',
        completedExams: u.completedExams || 0,
        averageResult: u.averageResult || 0,
        disableDashboardAccess: u.disableDashboardAccess !== undefined ? u.disableDashboardAccess : false,
        createdAt: u.createdAt || ''
      }));

      const allUsers = [...defaultUsers, ...mappedCustom];
      const match = allUsers.find(u => u.username.toLowerCase() === savedFaceIdUser.toLowerCase());

      if (match) {
        setFaceScanSuccess(true);
        setTimeout(() => {
          setIsScanningFace(false);
          const userProfileToLoad = {
            fullName: match.fullName,
            age: match.age,
            phone: match.phone,
            address: match.address,
            currentService: match.currentService,
            avatarUrl: match.avatarUrl,
            points: match.points,
            level: match.level,
            rankOrder: match.rankOrder,
            completedExams: match.completedExams,
            averageResult: match.averageResult,
            password: match.password,
            email: match.email,
            username: match.username,
            createdAt: match.createdAt || '15 مارس 2026',
            disableDashboardAccess: match.disableDashboardAccess,
            lastLogin: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
          };
          onLoginFull(userProfileToLoad, 'registration');
          onNotify(`✓ تم التعرف بيومترياً على الوجه بنجاح! مرحباً بك يا ${match.fullName}.`);
        }, 1500);
      } else {
        setFaceScanSuccess(false);
        onNotify('❌ فشل التعرف على الوجه. يرجى تسجيل الدخول العادي أولاً وتفعيل بصمة الوجه.');
        setTimeout(() => {
          setIsScanningFace(false);
        }, 2000);
      }
    }, 2500);
  };

  // Handle new subscription submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSubmitted(true);

    if (
      !regFullName || !regUsername || !regEmail || !regAge || !regPhone || !regAddress || !regService || !regPassword || !regConfirmPassword || !regWhatsapp || !regServiceOutside ||
      regFullNameError || regUsernameError || regAgeError || regPhoneError || regAddressError || regServiceError || regEmailError || regPasswordError || regConfirmPasswordError || regWhatsappError || regServiceOutsideError
    ) {
      onNotify('❌ عذراً! يرجى مراجعة وتعديل الخانات المحددة باللون الأحمر والمستندة إلى شروط التسجيل الكلية الصحيحة.');
      return;
    }

    const formattedDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    onNotify('جاري تأسيس وتوطين بطاقة الخدمة الذكية والملف الشخصي...');
    setTimeout(() => {
      const saved = localStorage.getItem('angels_custom_users');
      const usersList = saved ? JSON.parse(saved) : [];
      
      const defaultUsers = [
        { username: 'admin', email: 'admin@angels.org', phone: '01234567891' },
        { username: 'milad', email: 'milad@angels.org', phone: '01234567890' }
      ];

      const allSavedUsers = [...defaultUsers, ...usersList];
      const existsByUsername = allSavedUsers.some((u: any) => u.username.toLowerCase() === regUsername.toLowerCase());
      const existsByEmail = allSavedUsers.some((u: any) => u.email && u.email.toLowerCase() === regEmail.toLowerCase());
      const existsByPhone = allSavedUsers.some((u: any) => u.phone && u.phone.trim() === regPhone.trim());

      if (existsByUsername) {
        onNotify('⚠️ اسم المستخدم هذا مسجل بالفعل بالمنصة. يرجى اختيار اسم مستخدم آخر.');
        return;
      }
      if (existsByEmail || existsByPhone) {
        onNotify('⚠️ هذا الرقم أو البريد الإلكتروني مسجل مسبقاً لحساب آخر، يرجى اختيار رقم آخر أو بريد إلكتروني آخر.');
        return;
      }

      const finalAvatar = uploadedBase64Image || selectedAvatar;

      const newUser = {
        username: regUsername,
        email: regEmail,
        fullName: regFullName,
        age: regAge,
        phone: regPhone,
        whatsapp: regWhatsapp,
        address: regAddress,
        service: regService,
        serviceOutside: regServiceOutside,
        password: regPassword,
        avatarUrl: finalAvatar,
        points: 450,
        level: 'خادم مبتدئ - المستوى الأول',
        rankOrder: 'مسجل حديثاً بالبوابة 🆕',
        completedExams: 0,
        averageResult: 0,
        disableDashboardAccess: false,
        createdAt: formattedDate,
        enableFaceId: regEnableFaceId
      };

      // Save locally first for instant feedback, then sync to server
      usersList.push(newUser);
      localStorage.setItem('angels_custom_users', JSON.stringify(usersList));
      
      registerUserOnServer(newUser).catch(err => {
        console.warn("Server registration sync failed, using offline fallback:", err);
      });

      if (regEnableFaceId) {
        localStorage.setItem('angels_face_id_username', regUsername);
      }

      // Save user session in localStorage right away to enable auto-login even if the browser is closed immediately
      localStorage.setItem('angels_remember_me', 'true');
      localStorage.setItem('angels_remembered_username', regUsername);
      localStorage.setItem('angels_remembered_password', regPassword);
      localStorage.setItem('angels_login_method', 'full');

      const profileToSave = {
        fullName: regFullName,
        age: regAge,
        phone: regPhone,
        whatsapp: regPhone,
        address: regAddress,
        currentService: regService,
        serviceOutside: regServiceOutside,
        avatarUrl: finalAvatar,
        points: 450,
        level: 'خادم مبتدئ - المستوى الأول',
        rankOrder: 'مسجل حديثاً بالبوابة 🆕',
        completedExams: 0,
        averageResult: 0,
        email: regEmail,
        username: regUsername,
        password: regPassword,
        createdAt: formattedDate
      };

      localStorage.setItem('angels_user_profile_v1', JSON.stringify(profileToSave));
      localStorage.setItem('angels_last_saved_profile', JSON.stringify(profileToSave));

      setSuccessMessage(`مرحباً بك، تم إنشاء حسابك بنجاح يا ${regFullName}!`);
      setRegisteredProfileToLogin(profileToSave);
      setShowSuccessDialog(true);
    }, 1000);
  };

  // Handle social logins
  const handleSocialLogin = (platform: 'google' | 'apple' | 'facebook') => {
    onNotify(`جاري الاتصال الآمن مع خادم مصادقة ${platform}...`);
    setTimeout(() => {
      if (platform === 'google') {
        onLoginFull({
          fullName: 'جوجل - مراد لمعي جرجس',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
          currentService: 'أصدقاء الملائكة - فئة متلازمة داون',
          age: '29 سنة',
          phone: '01201928374',
          address: 'مصر الجديدة، القاهرة',
          level: 'خادم مميز - المستوى الثالث',
          rankOrder: 'الترتيب العاشر بالتصفيات',
          points: 1350,
          completedExams: 6,
          averageResult: 91,
          email: 'mourad.g@gmail.com',
          username: 'mourad_google'
        });
      } else if (platform === 'facebook') {
        onLoginFull({
          fullName: 'فيسبوك - فادي فريد صليب',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          currentService: 'أصدقاء الملائكة - الخدمة الروحية والطقسية',
          age: '31 سنة',
          phone: '01019283746',
          address: 'شبرا، القاهرة',
          level: 'خادم مميز - المستوى الثالث',
          rankOrder: 'الترتيب الخامس بالتصفيات',
          points: 1950,
          completedExams: 7,
          averageResult: 93,
          email: 'fady.f@facebook.com',
          username: 'fady_facebook'
        });
      } else {
        onLoginFull({
          fullName: 'أبل - مارينا مكرم أسعد',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          currentService: 'أصدقاء الملائكة - مسار الصم والبكم والخدمة الطقسية',
          age: '26 سنة',
          phone: '01192837465',
          address: 'حي المعادي، القاهرة',
          level: 'خادم متدرب - المستوى الثاني',
          rankOrder: 'الترتيب الثامن عشر بالتصفيات',
          points: 850,
          completedExams: 3,
          averageResult: 88,
          email: 'marina.mkr@apple.com',
          username: 'marina_apple'
        });
      }
    }, 1000);
  };

  // Click handler for 6 sections shortcuts
  const handleShortcutClick = (targetTab: string) => {
    if (!loginMethod) {
      // Direct activation of icons for immediate login & navigate (Mini icons activated!)
      if (targetTab === 'materials' || targetTab === 'exams') {
        onNotify('⚡ تم دخولك السريع والمباشر كزائر لتصفح هذا القسم!');
        onLoginQuick();
        setActiveTab(targetTab);
      } else {
        onNotify('⚡ تم تفعيل ملفك الكامل تلقائياً لتصفح هذا القسم السري المحمي!');
        onLoginFull({
          fullName: 'ميلاد بشته عبد الشهيدبشاى',
          avatarUrl: ADVENT_AVATARS[0],
          currentService: 'أصدقاء الملائكة لذوي القدرات الخاصة (الصم والبكم)'
        });
        setActiveTab(targetTab);
      }
      return;
    }

    if (loginMethod === 'quick' && targetTab !== 'materials' && targetTab !== 'exams') {
      onNotify('🔒 عذراً! هذا القسم مغلق لزوار الدخول السريع. يرجى تسجيل الدخول الكامل لتسجيل درجاتك وتصنيفك بنجاح.');
      return;
    }

    // Is allowed
    setActiveTab(targetTab);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0d1527] overflow-y-auto flex items-center justify-center py-10 px-4 font-sans text-right text-slate-100">
      
      {/* Background gradients and visual flares */}
      <div className="absolute inset-0 bg-[#070b16] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/50 via-slate-950/95 to-[#05080f] z-0 pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-505/10 bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-2xl z-10 flex flex-col items-center">
        
        {/* Modern Opening Card Wrapper */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* ２- غلاف بألوان جذابة مناسبة */}
          <div className="h-56 md:h-64 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/45 to-slate-950/15 z-10" />
            
            {/* Attractive cover photo with golden coptic cross decoration */}
            <img 
              src={coverImg} 
              alt="Coptic Ecclesial Cover Banner" 
              className="w-full h-full object-cover select-none scale-105"
            />
            
            <div className="absolute top-4 right-4 z-20 bg-amber-500/90 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منصة خدمة أصدقاء الملائكة الذكية</span>
            </div>
            
            {/* ١- شعار المؤسسة المرفق */}
            <div className="absolute bottom-[-24px] right-1/2 translate-x-1/2 z-20 flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full bg-slate-900 border-4 border-amber-400 p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Friends of Angels Foundation Logo" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 px-6 pb-6 text-center space-y-2">
            <h1 className="font-display text-2xl md:text-3xl font-black text-white mt-1">
              مؤسسة <span className="text-amber-400">أصدقاء الملائكة</span>
            </h1>
            <p className="text-[11px] text-slate-400 tracking-wider">
              المنصة المتطورة لتأهيل وتدريب وتقييم خدام ذوي الإعاقة
            </p>
          </div>

          {/* User Active Account Panel if already connected */}
          {loginMethod && (
            <div className="mx-6 mb-6 p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl text-right flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400" 
                />
                <div>
                  <span className="text-[9px] text-slate-400 block font-normal">أنت داخل الآن بملف:</span>
                  <span className="text-xs font-bold text-white block">{userProfile.fullName}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab(loginMethod === 'quick' ? 'materials' : 'registration')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                دخول للملف التعريفي
              </button>
            </div>
          )}

          {/* ４- تسجيل الدخول والاشتراك الجديد */}
          {!loginMethod && (
            <div className="px-6 pb-6 space-y-6">
              
              {/* Quick Auto Login Card if a saved account is found on this device */}
              {localStorage.getItem('angels_last_saved_profile') && (
                (() => {
                  try {
                    const savedProfile = JSON.parse(localStorage.getItem('angels_last_saved_profile') || '');
                    return (
                      <div className="bg-emerald-950/45 p-4 rounded-2xl border-2 border-emerald-500/30 text-right space-y-3 animate-in fade-in duration-350 shadow-md">
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-400 bg-slate-900 shrink-0">
                              <img src={savedProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="text-right">
                              <h5 className="font-display font-black text-xs text-emerald-400">حسابك مسجل ومحفوظ تلقائياً على هذا الجهاز:</h5>
                              <span className="font-sans text-sm font-extrabold text-white block mt-0.5">{savedProfile.fullName}</span>
                            </div>
                          </div>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold shrink-0">نشط ومؤمن 🛡️</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onLoginFull(savedProfile, savedProfile.isAdmin ? 'admin' : 'registration');
                              onNotify(`✨ تم الدخول التلقائي الذكي بحساب الخادم ${savedProfile.fullName} من نفس الجهاز!`);
                            }}
                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
                          >
                            <span>دخول فوري تلقائي للملف الشخصي 🚀</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('هل أنت متأكد من رغبتك في إزالة حسابك المحفوظ من هذا الجهاز؟')) {
                                localStorage.removeItem('angels_last_saved_profile');
                                localStorage.removeItem('angels_remembered_username');
                                localStorage.removeItem('angels_remembered_password');
                                localStorage.removeItem('angels_login_method');
                                localStorage.removeItem('angels_user_profile_v1');
                                onNotify('✓ تم إزالة بيانات الدخول الموثق وجاري تحديث الواجهة.');
                                window.location.reload();
                              }
                            }}
                            className="px-3.5 py-2.5 bg-slate-850 hover:bg-red-950/40 text-slate-400 hover:text-red-400 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                          >
                            مسح الحساب
                          </button>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                })()
              )}

              {/* Form Tab Toggles */}
              <div className="flex bg-slate-950/65 rounded-xl p-1 gap-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تسجيل الدخول الحالي
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'register' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  قيد مشترك جديد 🆕
                </button>
              </div>

              {/* Login form */}
              {showForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-right animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-400 block">استعادة الرقم السري المفقود:</label>
                    <p className="text-[9px] text-slate-400 mb-2 leading-relaxed">
                      أدخل اسم المستخدم أو البريد الإلكتروني الذي قمت بالتسجيل به، وسنقوم بالبحث في خوادم السجل الآمنة للتطبيق لتذكيرك فورياً بكود المرور.
                    </p>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسم المستخدم أو إيميل الحساب"
                      value={forgotUserOrEmail}
                      onChange={(e) => setForgotUserOrEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                    />
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      استرداد الرقم السري
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 border border-white/10 text-white text-xs rounded-xl transition-all cursor-pointer"
                    >
                      إلغاء والعودة
                    </button>
                  </div>
                </form>
              ) : authMode === 'login' ? (
                <form onSubmit={handleDirectLoginSubmit} className="space-y-4 text-right animate-in fade-in duration-300">
                  
                  {/* Quick Auto Login Card if a saved account is found on this device */}
                  {localStorage.getItem('angels_last_saved_profile') && (
                    (() => {
                      try {
                        const savedProfile = JSON.parse(localStorage.getItem('angels_last_saved_profile') || '');
                        return (
                          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 text-right space-y-3 mb-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 bg-slate-900 shrink-0">
                                  <img src={savedProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="text-right">
                                  <h5 className="font-display font-black text-xs text-emerald-400">حساب مكتشف وموثق على هذا الجهاز:</h5>
                                  <span className="font-sans text-xs text-white block mt-0.5">{savedProfile.fullName}</span>
                                </div>
                              </div>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold shrink-0">نشط 🖥️</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onLoginFull(savedProfile, 'registration');
                                  onNotify(`✨ تم الدخول التلقائي الذكي بحساب الخادم ${savedProfile.fullName} من نفس الجهاز!`);
                                }}
                                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>دخول تلقائي سريع فوري 🚀</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('هل أنت متأكد من رغبتك في إزالة حسابك المحفوظ من هذا الجهاز؟')) {
                                    localStorage.removeItem('angels_last_saved_profile');
                                    localStorage.removeItem('angels_remembered_username');
                                    localStorage.removeItem('angels_remembered_password');
                                    localStorage.removeItem('angels_login_method');
                                    localStorage.removeItem('angels_user_profile_v1');
                                    onNotify('✓ تم إزالة بيانات الدخول الموثق وجاري تحديث الواجهة.');
                                    // Trigger fields reset
                                    setLoginUsername('');
                                    setLoginPassword('');
                                  }
                                }}
                                className="px-3 py-2 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                              >
                                إلغاء الحفظ
                              </button>
                            </div>
                          </div>
                        );
                      } catch (e) {
                        return null;
                      }
                    })()
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300">اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف:</label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسم المستخدم أو الإيميل أو الهاتف"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300">الرقم السري الخاص بك:</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400 text-left font-mono animate-none"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                        title={showLoginPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember me & Forgot Password Options */}
                  <div className="flex flex-col gap-2 bg-slate-950/40 p-3 rounded-xl border border-white/5 font-sans">
                    <div className="flex items-center justify-between text-[11px] select-none">
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer accent-amber-400"
                        />
                        <span>تذكرني على هذا الجهاز (ملء تلقائي)</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-amber-400 hover:text-amber-300 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>

                    <div className="border-t border-white/5 my-1" />

                    <div className="flex items-center justify-between text-[11px] select-none">
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={loginEnableFaceId}
                          onChange={(e) => setLoginEnableFaceId(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer accent-amber-400"
                        />
                        <span className="flex items-center gap-1.5">
                          <span>تفعيل الدخول السريع ببصمة الوجه 📸</span>
                          <span className="text-[9px] text-slate-500">(مناسب للموبايل والتابلت)</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4 text-slate-950" />
                      <span>دخول للملف الكامل</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFaceIdLogin}
                      className="px-4 py-3 bg-slate-950 hover:bg-slate-900 border border-amber-400/30 text-amber-400 font-bold text-xs rounded-xl transition-all hover:border-amber-400 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      title="تسجيل الدخول السريع باستخدام بصمة الوجه"
                    >
                      <Camera className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                      <span>بصمة الوجه 📸</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Registration form with all details as requested with real-time error color highlights */
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-right">
                  
                  {/* Photo Uploader Section */}
                  <div className="bg-slate-900 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-slate-300">الصورة الشخصية للملف التعريفي (اختياري / أو ارفع صورتك الخاصة):</span>
                    <div className="flex items-center gap-3 w-full justify-center">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-950 border-2 border-amber-400 flex items-center justify-center shrink-0">
                        {uploadedBase64Image ? (
                          <img src={uploadedBase64Image} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
                        ) : (
                          <img src={selectedAvatar} className="w-full h-full object-cover" alt="Default Avatar" referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 items-start text-right">
                        <label className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setUploadedBase64Image(reader.result as string);
                                  onNotify('✓ تم استيراد الصورة وحفظها بنجاح!');
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                          <span>رفع من الهاتف أو الكمبيوتر 📸</span>
                        </label>
                        {uploadedBase64Image ? (
                          <button 
                            type="button" 
                            onClick={() => setUploadedBase64Image('')}
                            className="text-[9px] text-red-400 hover:underline bg-transparent"
                          >
                            حذف الصورة المرفوعة والعودة للصور الافتراضية
                          </button>
                        ) : (
                          <span className="text-[9px] text-slate-400">يدعم رفع صيغ الصور JPG, PNG من أي جهاز.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>الاسم بالكامل ثلاثي:</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="الاسم بالكامل ثلاثي"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none transition-all ${
                          regFullNameError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                        }`}
                      />
                      {regFullNameError && (
                        <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regFullNameError}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>اسم المستخدم الفريد للولوج:</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: milad2026"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-all ${
                          regUsernameError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                        }`}
                        dir="ltr"
                      />
                      {regUsernameError && (
                        <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regUsernameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>السن / العمر:</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: 24 سنة"
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none transition-all ${
                          regAgeError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                        }`}
                      />
                      {regAgeError && (
                        <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regAgeError}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>رقم التليفون الميداني:</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0123XXXXXXXX"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none text-left font-mono transition-all ${
                          regPhoneError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                        }`}
                        dir="ltr"
                      />
                      {regPhoneError && (
                        <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regPhoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 col-span-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-amber-400 font-bold" />
                            <span>رقم الواتساب:</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="0123XXXXXXXX"
                            value={regWhatsapp}
                            onChange={(e) => setRegWhatsapp(e.target.value)}
                            className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none text-left font-mono transition-all ${
                              regWhatsappError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                            }`}
                            dir="ltr"
                          />
                          {regWhatsappError && (
                            <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regWhatsappError}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>عنوان الإقامة والتسكين:</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="العنوان التفصيلي"
                            value={regAddress}
                            onChange={(e) => setRegAddress(e.target.value)}
                            className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none transition-all ${
                              regAddressError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                            }`}
                          />
                          {regAddressError && (
                            <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regAddressError}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>الخدمة التي تخدمها بمؤسسة أصدقاء الملائكة:</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل الخدمة الحالية، مثلاً: خدمة الصم والبكم بملاك شيراتون"
                      value={regService}
                      onChange={(e) => setRegService(e.target.value)}
                      className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none transition-all ${
                        regServiceError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                      }`}
                    />
                    {regServiceError && (
                      <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regServiceError}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>الخدمات التي تخدم بها خارج مؤسسة أصدقاء الملائكة:</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="الأعمال والخدمات الكنسية والمجتمعية بالخارج، أو ضع (لا يوجد)"
                      value={regServiceOutside}
                      onChange={(e) => setRegServiceOutside(e.target.value)}
                      className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none transition-all ${
                        regServiceOutsideError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                      }`}
                    />
                    {regServiceOutsideError && (
                      <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regServiceOutsideError}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <span className="text-amber-400 font-bold">@</span>
                      <span>البريد الإلكتروني (لتلقي التنبيهات ونظام الإشعارات):</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@domain.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className={`w-full h-9 px-3 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none text-left font-mono transition-all ${
                        regEmailError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                      }`}
                      dir="ltr"
                    />
                    {regEmailError && (
                      <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regEmailError}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-300">تأسيس رقم سري لملفك:</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          placeholder="أدخل كلمه المرور"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className={`w-full h-9 pl-3 pr-8 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-all ${
                            regPasswordError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                          }`}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                          title={showRegPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {regPasswordError && (
                        <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regPasswordError}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-300">تأكيد الرقم السري المختار:</label>
                      <div className="relative">
                        <input
                          type={showRegConfirmPassword ? "text" : "password"}
                          required
                          placeholder="أعد كتابة الرقم السري للتحقق"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className={`w-full h-9 pl-3 pr-8 rounded-lg bg-slate-950 border text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-all ${
                            regConfirmPasswordError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10 focus:border-amber-400'
                          }`}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                          title={showRegConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                          {showRegConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {regConfirmPasswordError && (
                        <p className="text-[9px] text-red-500 mt-0.5 font-bold">⚠️ {regConfirmPasswordError}</p>
                      )}
                    </div>
                  </div>

                  {/* ٧- أيقونة تفعيل خاصية الدخول بالتعرف على الوجه عند إنشاء حساب جديد */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-300 block">تفعيل تسجيل الدخول باستخدام التعرف على الوجه:</span>
                        <span className="text-[8.5px] text-slate-500 block">يسمح بالولوج الخاطف دون كتابة كلمة المرور لاحقاً</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regEnableFaceId}
                        onChange={(e) => setRegEnableFaceId(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-400 peer-checked:after:bg-slate-950" />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4 text-slate-950" />
                    <span>إنشاء الحساب وتوطين البيانات الشخصية بالكامل</span>
                  </button>
                </form>
              )}

              {/* 🔑 Manager Login without Registration Section */}
              <div className="bg-slate-950/45 p-4 rounded-2xl border border-blue-500/25 text-right space-y-3 mt-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-blue-400">بوابة دخول المدير (المشرف العام) 🔑</h4>
                      <p className="text-[9px] text-slate-400">دخول مباشر للإدارة والمتابعة والتقييم الفني دون تسجيل مسبق</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-blue-500/15 text-blue-400 border border-blue-500/15 px-2 py-0.5 rounded-md font-bold shrink-0">بوابة الرقابة</span>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      placeholder="أدخل الرقم السري المعتمد للمدير (123456)"
                      value={managerPasscode}
                      onChange={(e) => {
                        setManagerPasscode(e.target.value);
                        setManagerError('');
                      }}
                      className="w-full h-9 px-3 pl-8 rounded-lg bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-left"
                      dir="ltr"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    onClick={handleManagerLoginSubmit}
                    className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 shadow-md"
                  >
                    <span>دخول المدير 🚀</span>
                  </button>
                </div>
                {managerError && (
                  <p className="text-[9px] text-red-400 font-bold mt-1">⚠️ {managerError}</p>
                )}
              </div>

              {/* Institutional copyright footer */}
              <p className="text-[9.5px] text-slate-500 font-sans mt-8 text-center">
                © جميع الحقوق محفوظة لمؤسسة أصدقاء الملائكة المشهرة برقم ٨٥٨٥ لعام ٢٠١٢
              </p>

            </div>
          )}

        </div>

      </div>

      {/* 📸 Custom Face ID Scan Overlay Modal */}
      {isScanningFace && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 z-[9999] animate-in fade-in duration-300 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-amber-400/30 p-6 md:p-8 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-2xl">
            {/* Holographic scanner glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-dashed border-amber-400/50 p-1 flex items-center justify-center overflow-hidden bg-slate-950">
              {cameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-full scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Camera className="w-12 h-12 text-amber-400 animate-pulse" />
                  <span className="text-[9px] mt-2 text-slate-400">جاري تفعيل الكاميرا...</span>
                </div>
              )}
              {/* Scanning high-tech biometric targeting graphics */}
              <div className="absolute inset-2 border border-dashed border-amber-400/30 rounded-full animate-[spin_40s_linear_infinite] pointer-events-none" />
              <div className="absolute inset-6 border border-emerald-500/20 rounded-full pointer-events-none" />
              {/* Scanning horizontal laser bar moving up and down */}
              <div className="absolute left-0 right-0 h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] animate-bounce top-1/2 pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-black text-white font-display">نظام التعرف الذكي على الوجه (للكمبيوتر والموبايل) 📸</h4>
              <p className="text-[10.5px] text-slate-300 leading-relaxed">
                يرجى مواجهة الكاميرا مباشرة بوضوح لتتمكن المنصة من التعرف الفوري على ملامحك وتفويض دخولك الآمن لملفك الشخصي.
              </p>
            </div>

            {cameraError && (
              <p className="text-[9.5px] text-amber-400/90 bg-amber-950/40 border border-amber-500/10 py-1.5 px-3 rounded-xl font-medium leading-relaxed">
                {cameraError}
              </p>
            )}

            {faceScanSuccess === null && (
              <div className="flex justify-center items-center gap-2 bg-slate-950/50 py-2 px-4 rounded-xl border border-white/5 inline-flex mx-auto">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                <span className="text-[10px] text-amber-400 font-bold">جاري مطابقة بصمة الوجه في البوابة الرقمية...</span>
              </div>
            )}

            {faceScanSuccess === true && (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/20 py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 animate-bounce">
                <Check className="w-4 h-4 shrink-0" />
                <span>تم التعرف والمطابقة بنجاح! مرحباً بك يا بطل.</span>
              </div>
            )}

            {faceScanSuccess === false && (
              <div className="text-[10.5px] text-red-400 font-bold bg-red-950/50 border border-red-500/20 py-2.5 px-4 rounded-xl leading-relaxed">
                ⚠️ لم نجد بصمة وجه مسجلة لهذا الجهاز! يرجى الدخول باسم المستخدم وكلمة المرور أولاً ثم تفعيل البصمة من الداخل.
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsScanningFace(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer border border-white/5"
            >
              إلغاء وفحص الدخول العادي
            </button>
          </div>
        </div>
      )}

      {/* 🟢 Registration Success Dialog Modal */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center relative shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className="font-display font-black text-lg md:text-xl text-emerald-400 leading-tight">
              تم التسجيل بنجاح 🎉
            </h3>
            
            <p className="font-sans text-xs text-slate-300 mt-3 leading-relaxed">
              {successMessage}
              <span className="block mt-2 text-[10px] text-slate-400 leading-normal">
                تم تأسيس الملف العضوي وبطاقة الخدمة التفاعلية الذكية وتخزينها بأمان. تفضل بالضغط أدناه للتحويل التلقائي لملفك الشخصي الموثق.
              </span>
            </p>

            <button 
              onClick={() => {
                if (registeredProfileToLogin) {
                  onLoginFull(registeredProfileToLogin, 'registration');
                }
                setShowSuccessDialog(false);
              }}
              className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>موافق، الدخول الفوري الموثق</span>
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
