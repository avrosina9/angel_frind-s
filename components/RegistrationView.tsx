/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  Phone, 
  MapPin, 
  Heart, 
  Calendar, 
  BadgeCheck, 
  Award, 
  Save, 
  Camera,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Printer,
  QrCode,
  LogOut
} from 'lucide-react';

import brandLogo from '../assets/images/regenerated_image_1781800682461.png';
import { updateUserOnServer } from '../sync';

interface RegistrationViewProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onNotify: (message: string) => void;
  onLogout?: () => void;
  onChangeTab?: (tab: 'materials' | 'exams' | 'dashboard' | 'practical' | 'achievements' | 'registration' | 'discounts' | 'admin') => void;
}

export default function RegistrationView({ userProfile, onChangeProfile, onNotify, onLogout, onChangeTab }: RegistrationViewProps) {
  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [age, setAge] = useState(userProfile.age || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [currentService, setCurrentService] = useState(userProfile.currentService || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150');
  const [level, setLevel] = useState(userProfile.level || 'خادم مبتدئ - المستوى الأول');
  const [rankOrder, setRankOrder] = useState(userProfile.rankOrder || 'الترتيب الثالث بالدفعة الحالية 🌟');
  const [password, setPassword] = useState(userProfile.password || '123456');
  const [confirmPassword, setConfirmPassword] = useState(userProfile.password || '123456');
  const [email, setEmail] = useState(userProfile.email || '');
  const [username, setUsername] = useState(userProfile.username || '');
  const [serviceOutside, setServiceOutside] = useState(userProfile.serviceOutside || '');
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');

  // Security visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [revealCardPassword, setRevealCardPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic Level calculation based on points (Linked to Control panel)
  const calculatedLevel = (() => {
    const pts = userProfile.points || 450;
    if (pts >= 2000) return 'خادم قائد - المستوى الرابع';
    if (pts >= 1200) return 'خادم مميز - المستوى الثالث';
    if (pts >= 600) return 'خادم متدرب - المستوى الثاني';
    return 'خادم مبتدئ - المستوى الأول';
  })();

  // Dynamic ranking placement (based on total accumulated points)
  const calculatedRanking = (() => {
    const pts = userProfile.points || 450;
    if (pts >= 2000) return 'الترتيب الأول فئة (أ) 🏆';
    if (pts >= 1200) return 'الترتيب الثاني فرع المتميزين ⭐';
    if (pts >= 600) return 'الترتيب الثالث فرع المتدربين 🌟';
    return 'الترتيب العام الرابع (مستوى تمهيدي) 🆕';
  })();

  // Define dynamic style for membership card coloring as requested:
  // (قائد لون ازرق - خادم مميز لون اخضر - مبتدئ لون اصفر - متدرب لون احمر)
  const getCardStyle = () => {
    const lvl = calculatedLevel.toLowerCase();
    if (lvl.includes('قائد') || lvl.includes('leader') || lvl.includes('الرابع')) {
      return {
        bg: 'bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 border-blue-400 ring-4 ring-blue-200/50',
        text: 'text-white',
        accentText: 'text-cyan-300',
        badge: 'bg-blue-950 text-cyan-300 border border-cyan-500/30',
        printCss: 'background: linear-gradient(135deg, #1d4ed8, #1e3a8a) !important; color: #ffffff !important;'
      };
    } else if (lvl.includes('مميز') || lvl.includes('distinguished') || lvl.includes('الثالث')) {
      return {
        bg: 'bg-gradient-to-br from-[#166534] via-[#15803d] to-slate-900 border-emerald-400 ring-4 ring-emerald-200/50',
        text: 'text-white',
        accentText: 'text-yellow-300',
        badge: 'bg-emerald-950 text-emerald-300 border border-emerald-500/30',
        printCss: 'background: linear-gradient(135deg, #166534, #15803d) !important; color: #ffffff !important;'
      };
    } else if (lvl.includes('متدرب') || lvl.includes('trainee') || lvl.includes('الثاني')) {
      return {
        bg: 'bg-gradient-to-br from-rose-700 via-rose-800 to-slate-900 border-rose-400 ring-4 ring-rose-200/50',
        text: 'text-white',
        accentText: 'text-rose-200',
        badge: 'bg-rose-950 text-rose-300 border border-rose-500/30',
        printCss: 'background: linear-gradient(135deg, #be123c, #9f1239) !important; color: #ffffff !important;'
      };
    } else {
      // Beginner / مبتدئ
      return {
        bg: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 border-amber-300 ring-4 ring-amber-200/50',
        text: 'text-slate-950',
        accentText: 'text-amber-900',
        badge: 'bg-amber-950 text-amber-200 border border-amber-400/30',
        printCss: 'background: linear-gradient(135deg, #fbbf24, #f59e0b) !important; color: #0f172a !important;'
      };
    }
  };

  const currentThemeStyle = getCardStyle();

  const handleMockPictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      onNotify('جاري قراءة ومعالجة الصورة وتحديث بطاقة العضوية الإلكترونية...');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        setIsUploading(false);
        onNotify('تم رفع صورتك الشخصية الخاصة بنجاح لتغذية الكارت الذكي!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.split(' ').filter(Boolean).length < 3) {
      onNotify('⚠️ يرجى كتابة اسمك الثلاثي على الأقل لتوثيق الكارت الذكي.');
      return;
    }

    if (!age.trim()) {
      onNotify('⚠️ يرجى إدخال العمر السني.');
      return;
    }

    if (!phone.trim()) {
      onNotify('⚠️ يرجى إدخال رقم التلفون للتواصل الميداني.');
      return;
    }

    if (!address.trim()) {
      onNotify('⚠️ يرجى كتابة عنوان الإقامة التفصيلي.');
      return;
    }

    if (!currentService.trim()) {
      onNotify('⚠️ يرجى تحديد الخدمة الحالية الخاصة بك بمؤسسة أصدقاء الملائكة.');
      return;
    }

    if (password !== confirmPassword) {
      onNotify('❌ عذراً! الرقم السري غير متطابق مع تأكيد الرقم السري الجديد. يرجى المراجعة وتكراره بصورة صحيحة لحماية حسابك.');
      return;
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      fullName,
      fullName_clean: fullName.split(' ').slice(0, 2).join(' '),
      age,
      phone,
      address,
      currentService,
      serviceOutside,
      whatsapp,
      avatarUrl,
      level: calculatedLevel,
      rankOrder: calculatedRanking,
      password,
      email,
      username,
    };

    if (username) {
      const saved = localStorage.getItem('angels_custom_users');
      if (saved) {
        try {
          const usersList = JSON.parse(saved);
          const index = usersList.findIndex((u: any) => u.username.toLowerCase() === username.toLowerCase());
          if (index !== -1) {
            usersList[index] = {
              ...usersList[index],
              fullName,
              age,
              phone,
              address,
              service: currentService,
              serviceOutside,
              whatsapp,
              avatarUrl,
              password,
              email,
            };
            localStorage.setItem('angels_custom_users', JSON.stringify(usersList));
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Sync update to the central cloud database for laptop + mobile link
      updateUserOnServer({
        ...updatedProfile,
        username,
        fullName,
        age,
        phone,
        address,
        currentService,
        serviceOutside,
        whatsapp,
        avatarUrl,
        password,
        email,
      }).catch(err => {
        console.warn("Failed to sync profile update to server:", err);
      });
    }

    onChangeProfile(updatedProfile);
    onNotify('✨ تهانينا الحارة! تم اعتماد وحفظ بطاقة العضوية الذكية بنجاح وتوطيدها بالمنصة.');
  };

  // Printing trigger
  const handlePrintCard = () => {
    onNotify('جاري تشغيل محرك الطباعة لتوليد استمارة التقديم الرسمية بصيغة PDF...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* Dynamic Style block specifically injected for clean printing of the card in high resolution */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide everything except our custom designed document layout */
          body * {
            visibility: hidden !important;
          }
          #printable-professional-form, #printable-professional-form * {
            visibility: visible !important;
          }
          #printable-professional-form {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Cairo', sans-serif !important;
            display: block !important;
            padding: 20px !important;
          }
        }
      `}} />

      {/* 📄 Professional Official A4 Form Sheet - HIDDEN on screen, but perfectly formatted for printing on A4 */}
      <div id="printable-professional-form" className="hidden print:block bg-white text-slate-900 text-right font-sans p-8 border-4 border-double border-slate-350 rounded-2xl max-w-4xl mx-auto">
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <img className="w-14 h-14 object-cover rounded-full border-2 border-blue-600 shadow-sm" src={brandLogo} alt="Logo" />
            <div className="leading-tight">
              <h2 className="font-display font-black text-md text-blue-800">مؤسسة أصدقاء الملائكة لرعاية ذوي الهمم</h2>
              <p className="text-[10px] text-slate-500 font-bold">منصة التأهيل والتقييم الخدمي الموحدة للشمامسة والخدام</p>
            </div>
          </div>
          <div className="text-left font-mono text-[9px] text-slate-400">
            <p>تاريخ استخراج الاستمارة: {new Date().toLocaleDateString('ar-EG')}</p>
            <p>معرف النظام الرقمي: ANGELS-PRO-{userProfile.points || 0}</p>
          </div>
        </div>

        <div className="text-center my-6">
          <h1 className="font-display font-black text-xl text-blue-900 tracking-tight underline dec-blue shadow-sm bg-blue-50 py-2.5 rounded-xl inline-block px-10 border border-blue-150">
            استمارة قيد وتوثيق بيانات العضوية والدرجة الخدمية
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-6 my-8 items-start">
          {/* Information Table Col */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-1 gap-3.5">
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">اسم الخادم الكامل:</span>
                <span className="font-sans text-xs font-black text-slate-800">{fullName || 'ميلاد بشته'}</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">اسم المستخدم للولوج (معرف):</span>
                <span className="font-mono text-xs font-bold text-blue-700">@{username || 'guest_user'}</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">رقم الهاتف الفردي:</span>
                <span className="font-mono text-xs font-bold text-slate-800">{phone || '01234567890'}</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">رقم الواتساب الفعال:</span>
                <span className="font-mono text-xs font-bold text-emerald-700">{whatsapp || '01234567890'} 💬</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">البريد الإلكتروني الموثق:</span>
                <span className="font-mono text-xs font-bold text-slate-800">{email || 'member@angels.org'}</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">عنوان السكن الأساسي:</span>
                <span className="font-sans text-xs font-bold text-slate-800">{address || 'القاهرة، مصر'}</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">الخدمات داخل المؤسسة:</span>
                <span className="font-sans text-xs font-bold text-blue-700">{currentService || 'خدمة أصدقاء الملائكة'}</span>
              </div>
              <div className="flex border-b border-slate-100 pb-1.5 justify-between">
                <span className="font-bold text-xs text-slate-500">الخدمات خارج المؤسسة:</span>
                <span className="font-sans text-xs font-bold text-slate-700">{serviceOutside || 'لا يوجد'}</span>
              </div>
            </div>
          </div>

          {/* Photo and QR code Area Col */}
          <div className="col-span-1 flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
            <h5 className="font-display font-bold text-[10px] text-slate-400 mb-2.5">الصورة الشخصية للملف الشخصي للخدمة</h5>
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-md bg-slate-250 mb-4 shrink-0">
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-150 flex flex-col items-center w-full text-center mb-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?username=' + (username || 'guest_user'))}`}
                alt="QR Link"
                className="w-16 h-16 rounded-md bg-white p-0.5 border"
              />
              <span className="font-mono text-[7px] text-slate-400 mt-1">SCAN TO LOGIN DIRECTLY</span>
            </div>
          </div>
        </div>

        {/* Level and scores information */}
        <div className="grid grid-cols-3 gap-4 my-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-center border-l border-slate-200">
            <span className="text-[10px] text-slate-400 block">مرتبة ودرجة الخادم المعتمدة</span>
            <strong className="text-blue-700 text-sm mt-1 block">{calculatedLevel}</strong>
          </div>
          <div className="text-center border-l border-slate-200">
            <span className="text-[10px] text-slate-400 block">مجموع نقاط التميّز</span>
            <strong className="text-emerald-700 text-sm mt-1 block font-mono">+{userProfile.points || 0} نقطة إجمالية</strong>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">ترتيب المشارك بالدفعة</span>
            <strong className="text-amber-600 text-sm mt-1 block">{calculatedRanking}</strong>
          </div>
        </div>

        {/* Verification stamp blocks */}
        <div className="grid grid-cols-2 gap-8 mt-14 pt-8 border-t border-slate-200">
          <div className="text-right">
            <h5 className="text-xs font-bold text-slate-900">توقيع واعتماد المشرف العام:</h5>
            <div className="h-10 mt-2" />
            <p className="text-[10px] text-slate-400">....................................................</p>
          </div>
          <div className="text-left font-sans">
            <h5 className="text-xs font-bold text-slate-900">توقيع واعتماد المرشد الروحي للدفعة الكنسية:</h5>
            <div className="h-10 mt-2" />
            <p className="text-[10px] text-slate-400">....................................................</p>
          </div>
        </div>
      </div>

      {/* RENDER USER PROFILE PHOTO AT THE TOP (عرض صورة المشترك في الأعلى) */}
      <div className="bg-gradient-to-r from-blue-700 to-[#1e293b] rounded-2xl p-6 text-white border border-blue-700/30 shadow-md flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          {/* Active headshot of user displayed in high fidelity */}
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 overflow-hidden shrink-0 shadow-lg relative bg-slate-800">
            <img 
              src={avatarUrl} 
              alt="صورة المشترك" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-amber-400 font-bold text-[11px] block">الملف الشخصي الفعال للمشترك</span>
            <h2 className="font-display font-black text-xl md:text-2xl mt-0.5">{fullName || 'ميلاد بشته'}</h2>
            <p className="text-xs text-slate-300 font-sans mt-0.5">{currentService || 'خادم أصدقاء الملائكة المعين'}</p>
            {userProfile.createdAt ? (
              <span className="text-[10px] text-blue-300 font-sans mt-1 block">
                🗓️ تاريخ إنشاء الحساب بالبوابة الكلية: {userProfile.createdAt}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-sans mt-1 block">
                🗓️ تاريخ إنشاء الحساب بالبوابة الكلية: 15 مارس 2026
              </span>
            )}
          </div>
        </div>

        {/* Live dynamic metrics connected directly to control panel points */}
        <div className="flex gap-4">
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 block">درجة الخادم المتغيرة</span>
            <strong className="text-blue-400 text-xs mt-1 block">{calculatedLevel}</strong>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 block">ترتيب المشاركين</span>
            <strong className="text-amber-400 text-xs mt-1 block">{calculatedRanking}</strong>
          </div>
        </div>
      </div>

      {/* 🔮 Quick App Navigation Portal (بوابة التنقل السريع للتطبيق بالكامل والعبور الفوري) */}
      {onChangeTab && (
        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100/60 shadow-xs text-right animate-in fade-in duration-300">
          <h4 className="font-display font-black text-blue-700 text-xs flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
            <span>بوابة الولوج الفعالة لمعالم وتفاصيل التطبيق بالكامل 🌟</span>
          </h4>
          <p className="font-sans text-[11px] text-slate-600 leading-relaxed max-w-full mb-4">
            لقد تم تفعيل تسجيل حسابك وتوطين البيانات الشخصية بنجاح على البوابة الكلية! تفضّل بنقرة واحدة للانتقال الفوري وتصفّح المنهج التدريبي، أو بدء الامتحانات وربط نقاط كارت العضوية الخدمي الذكي:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                onChangeTab('practical');
                onNotify('🚀 تم نقلك بنجاح لمفكرة العمل التفاعلي والتقييم الميداني.');
              }}
              className="py-3 px-4 bg-white hover:bg-blue-700 hover:text-white border border-blue-200 text-slate-800 text-xs font-bold rounded-xl transition-all shadow-3xs flex items-center justify-center gap-2 cursor-pointer duration-200 active:scale-95"
            >
              <span>الذهاب لدفتر التقييم الميداني والعملي 📋</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChangeTab('materials');
                onNotify('📖 تم نقلك للمواد العلمية والتدريبية ومطالعة الدروس التفاعلية.');
              }}
              className="py-3 px-4 bg-white hover:bg-blue-700 hover:text-white border border-blue-200 text-slate-800 text-xs font-bold rounded-xl transition-all shadow-3xs flex items-center justify-center gap-2 cursor-pointer duration-200 active:scale-95"
            >
              <span>تصفّح المواد والمنهج الدراسي 📖</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChangeTab('exams');
                onNotify('📝 تم نقلك لخوض الامتحانات وتقييم مستوى حفظ مخدوميك.');
              }}
              className="py-3 px-4 bg-white hover:bg-blue-700 hover:text-white border border-blue-200 text-slate-800 text-xs font-bold rounded-xl transition-all shadow-3xs flex items-center justify-center gap-2 cursor-pointer duration-200 active:scale-95"
            >
              <span>دخول مركز الاختبارات الفورية 📝</span>
            </button>
          </div>
        </div>
      )}

      {/* Intro Header */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#c3c5d7]/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-right">
          <div className="flex items-center gap-3 mb-2 text-blue-700">
            <img 
              className="w-11 h-11 object-cover rounded-full border border-slate-200" 
              src={brandLogo} 
              alt="شعار مؤسسة أصدقاء الملائكة" 
            />
            <h2 className="font-display text-lg font-black m-0">استمارة الكارت الذكي للعضوية</h2>
          </div>
          <p className="font-sans text-xs text-[#434654] leading-relaxed">
            املأ بيانات ملفك الشخصي بالكامل وسيرتسم الكارت الذكي الخاص بك حياً تلقائياً بلون ودرجة تقييمك الخدمي فورياً.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-12 xl:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-[#c3c5d7]/50 shadow-sm space-y-6">
          <h3 className="font-display text-md font-extrabold text-[#151c27] border-b pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-650 text-blue-600" />
            <span>بيانات المشترك الدقيقة</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>اسم المشترك رباعياً (مطلوب للكارت):</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل الاسم رباعياً بالكامل"
                  className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 focus:border-blue-650 pr-9"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>السن / العمر الدقيق:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثال: 24 سنة"
                  className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 focus:border-blue-650 pr-9"
                  required
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>رقم التليفون الميداني:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 01234567890"
                  className="w-full text-xs font-sans p-3 text-left bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 focus:border-blue-650"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>رقم الواتساب الفعال للقروبات:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="رقم الواتساب (مثال: 01234567890)"
                  className="w-full text-xs font-sans p-3 text-left bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 focus:border-blue-650"
                  required
                />
                <span className="absolute right-3 top-3 font-bold text-emerald-500 text-xs text-center">💬</span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>العنوان السكني التفصيلي لتوفير وسائل الانتقال:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: 12 شارع صلاح الدين، مصر الجديدة"
                  className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-605 focus:border-blue-650 pr-9"
                  required
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Current Service */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>الخدمة التي تخدمها بمؤسسة أصدقاء الملائكة:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={currentService}
                  onChange={(e) => setCurrentService(e.target.value)}
                  placeholder="أدخل الخدمة بمؤسستنا، مثال: فريق مسرح العرائس بمكرم عبيد"
                  className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-605 focus:border-blue-650 pr-9"
                  required
                />
                <Heart className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 text-blue-500" />
              </div>
            </div>

            {/* Service Outside */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>الخدمات التي تخدمها خارج المؤسسة (إن وجد):</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={serviceOutside}
                  onChange={(e) => setServiceOutside(e.target.value)}
                  placeholder="مثال: خادم مدارس أحد بكنيسة مارجرجس هليوبوليس"
                  className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-605 focus:border-blue-600 pr-9"
                />
                <span className="absolute right-3 top-3 text-xs">⛪</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>البريد الإلكتروني المعتمد لتلقي التنبيهات والإشعارات الفورية:</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 focus:border-blue-650"
                required
              />
            </div>

            {/* Username field */}
            {username && (
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-450 text-slate-400">اسم المستخدم الفريد (المعرف غير القابل للتعديل):</label>
                <input 
                  type="text" 
                  value={username}
                  disabled
                  className="w-full text-xs font-mono p-3 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl select-none"
                  dir="ltr"
                />
              </div>
            )}

            {/* Password view */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>تغيير كود القفل السري للملف:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="الرقم السري الجديد"
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 pr-9"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Confirm Password view */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>تأكيد كود القفل السري الجديد:</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة الرقم السري للتحقق"
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 pr-9"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="text-slate-500 text-xs hover:text-blue-700 rounded flex items-center gap-1 px-3 py-1.5 bg-slate-100 border border-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{showPassword ? 'إخفاء الأرقام السرية' : 'إظهار الأرقام السرية للتحقق'}</span>
              </button>
            </div>

          </div>

          {/* Avatar Area - NO presets choice anymore, only upload & source url */}
          <div className="space-y-3 pt-4 border-t">
            <span className="text-xs font-bold text-slate-700 block">تحديث صورتك الشخصية بملفك:</span>
            
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-sm relative shrink-0 bg-slate-100">
                {isUploading ? (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <span className="text-[10px] text-white animate-spin">⚡</span>
                  </div>
                ) : (
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                )}
              </div>

              {/* Upload Input */}
              <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>رفع صورة شخصية جديدة</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleMockPictureUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ واعتماد بطاقة التسجيل والملف ✓</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-3.5 bg-red-50 text-red-650 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-3"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>تسجيل الخروج من البوابة الفعالة</span>
            </button>
          )}
        </form>

        {/* Live Preview Card Column - Smart Membership Card for Friends of Angels Foundation */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6" id="print-area-wrapper">
          
          <div className="bg-slate-50 p-4 rounded-xl border text-center print:hidden flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-display flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>معاينة وتصدير المستندات</span>
            </span>
            <button
              type="button"
              onClick={handlePrintCard}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة PDF 📄</span>
            </button>
          </div>

          {/* Premium Membership Card Visual Design - Responsive level colored theme */}
          <div 
            id="printable-membership-card" 
            className={`relative rounded-3xl p-6 shadow-2xl border overflow-hidden flex flex-col justify-between h-[420px] transition-all transform ${currentThemeStyle.bg}`}
          >
            
            {/* Design elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-slate-900/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <img 
                  className="w-9 h-9 object-cover rounded-full border border-white/20 shadow-xs" 
                  src={brandLogo} 
                  alt="شعار المؤسسة" 
                />
                <div className="text-right">
                  <h4 className={`font-display font-black text-xs ${currentThemeStyle.accentText}`}>بوابة أصدقاء الملائكة الذكية</h4>
                  <p className="text-[8px] opacity-80 font-sans tracking-wide">كارت العضوية المعتمد لعام 2026</p>
                </div>
              </div>
              <div className="bg-white/10 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest border border-white/5 font-bold">
                MEMBER-RFID
              </div>
            </div>

            {/* Body */}
            <div className="my-5 flex gap-4 items-center relative z-10">
              
              {/* Photo */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white bg-slate-800 shrink-0 relative shadow-lg">
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Patient and User details */}
              <div className="space-y-1.5 flex-grow text-right leading-tight block">
                <div>
                  <span className="text-[8.5px] opacity-75 block">الاسم رباعياً للمشترك:</span>
                  <span className="font-sans text-xs font-extrabold tracking-tight block max-w-[210px] leading-normal">
                    {fullName || 'ميلاد بشته مسعود قلينى'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[7px] opacity-75 block">العمر:</span>
                    <span className="font-sans text-[10px] font-bold block">{age || '24 سنة'}</span>
                  </div>
                  <div>
                    <span className="text-[7px] opacity-75 block">الهاتف:</span>
                    <span className="font-mono text-[9.5px] font-bold block tracking-wider">{phone || '01234567890'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Custom parameters */}
            <div className="space-y-1 text-right border-t border-white/10 pt-2.5 text-[10px] font-sans relative z-10 opacity-95">
              <div className="flex justify-between">
                <span className="opacity-75 text-[9px]">العنوان السكني:</span>
                <span className="font-medium truncate max-w-[215px]">{address || 'القاهرة، مصر'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-75 text-[9px]">الخدمة بالمؤسسة:</span>
                <span className={`font-black truncate max-w-[215px] ${currentThemeStyle.accentText}`}>{currentService || 'أصدقاء الملائكة'}</span>
              </div>
              {serviceOutside && (
                <div className="flex justify-between">
                  <span className="opacity-75 text-[9px]">خدمات أخرى:</span>
                  <span className="font-medium truncate max-w-[215px]">{serviceOutside}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="opacity-75 text-[9px]">واتساب الخدمة:</span>
                <span className="font-mono font-medium truncate max-w-[215px]">{whatsapp || phone || 'غير محدد'}</span>
              </div>

              {/* Password */}
              <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1">
                <span className="opacity-75 text-[9px]">رمز التحقق للمشترك:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[10px]">
                    {revealCardPassword ? password : '••••••'}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setRevealCardPassword(!revealCardPassword);
                    }}
                    className="p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
                  >
                    {revealCardPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer containing Level and personal page QR code frame */}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 relative z-10">
              <div className="text-right">
                <span className={`text-[9px] font-bold font-display px-2.5 py-0.5 rounded-full inline-block ${currentThemeStyle.badge}`}>
                  {calculatedLevel}
                </span>
                <span className="text-[9.5px] block mt-1 font-extrabold">
                  🍁 {calculatedRanking}
                </span>
              </div>

              {/* Interactive QR Code representing link to personal info page */}
              <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-lg border border-white/5">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?username=' + (username || 'guest_user'))}`}
                  alt="QR Link"
                  className="w-8 h-8 rounded-md shrink-0 bg-white p-0.5"
                />
                <div className="text-left font-mono text-[6px] hidden sm:block">
                  <p>SCAN-ME</p>
                  <p>LOGIN-QR</p>
                </div>
              </div>
            </div>

          </div>

          {/* Rules alert block */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-right print:hidden">
            <h5 className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-1 animate-pulse">
              <Printer className="w-3.5 h-3.5 animate-spin" />
              <span>طبع وتصدير الكشف الذكي للعضوية:</span>
            </h5>
            <ol className="list-decimal list-inside text-[10px] text-slate-500 space-y-1 font-sans">
              <li>انقر فوق الزر العلوي <strong className="text-blue-700">"طباعة الاستمارة PDF"</strong> لطباعة كشف النموذج الفردي وتصديره.</li>
              <li>يمكّنك الكارت الملّون وباقة البيانات من عبور بوابات الخدمة وتوثيق المحاضرات والامتيازات.</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
}
