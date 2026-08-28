/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  ClipboardList, 
  LayoutDashboard, 
  BadgeAlert, 
  Award, 
  Sparkles, 
  Lock 
} from 'lucide-react';

interface PageHeaderBannerProps {
  tab: 'materials' | 'exams' | 'dashboard' | 'practical' | 'achievements' | 'registration' | 'discounts' | 'admin';
}

const PAGE_DETAILS = {
  registration: {
    title: 'قسم العضوية والتسجيل الإلكتروني',
    subtitle: 'قيد وتوثيق بيانات الخادم رباعياً وتعديل كارت الهوية الشخصي لأصدقاء الملائكة بمميزات حديثة.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
    icon: User,
    gradient: 'from-blue-600/90 to-indigo-950/95',
  },
  materials: {
    title: 'المناهج والمواد العلمية',
    subtitle: 'مكتبة الخادم الذهبية من مراجع وصوتيات وتفسيرات ومقررات تخصصية تدريبية.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200',
    icon: BookOpen,
    gradient: 'from-emerald-600/95 to-slate-950/95',
  },
  exams: {
    title: 'الاختبارات والمهام',
    subtitle: 'بنك أسئلة تقييمي شامل ومستمر مبني على معايير الجودة لتأكيد الحصيلة اللاهوتية والتطبيقية.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200',
    icon: ClipboardList,
    gradient: 'from-[#15803d]/90 to-teal-950/95',
  },
  dashboard: {
    title: 'لوحة تحكم الطالب والدرجات المفتوحة',
    subtitle: 'متابعة حية وفورية لنقاط الإنجاز، وساعات التدريب الميداني، وعلاوات رصيدك التربوي.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    icon: LayoutDashboard,
    gradient: 'from-indigo-600/90 to-slate-900/95',
  },
  practical: {
    title: 'التقييم الميداني',
    subtitle: 'تقييم كفاءة النزول الفعلي للخدمة من زيارات المخدومين والالتزام بضوابط المشرف.',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=1200',
    icon: BadgeAlert,
    gradient: 'from-amber-600/90 to-slate-950/95',
  },
  achievements: {
    title: 'لوحة مراتب الشرف وتصنيف الخدام',
    subtitle: 'مراتب المجد الخدمية المتدرجة؛ تنافس روحي شريف في حصد الأوسمة والتقدم للقمة.',
    image: 'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&q=80&w=1200',
    icon: Award,
    gradient: 'from-[#8e24aa]/90 to-black/95',
  },
  discounts: {
    title: 'البونص والخصومات',
    subtitle: 'قائمة مكافآت وبونص التميز الحضور، وسجل الخصومات والمخالفات السلوكية الفنية.',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1200',
    icon: Sparkles,
    gradient: 'from-[#ba1a1a]/90 to-slate-950/95',
  },
  admin: {
    title: 'التحكم والإدارة الكبرى',
    subtitle: 'مأمن مشرفي اللوائح لتطوير المناهج وتفريع مسائل الاختبارات ورصد حركات النقاط.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    icon: Lock,
    gradient: 'from-slate-800/90 to-zinc-950/95',
  }
};

export default function PageHeaderBanner({ tab }: PageHeaderBannerProps) {
  const current = PAGE_DETAILS[tab] || PAGE_DETAILS.dashboard;
  const Icon = current.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full h-44 md:h-52 rounded-3xl overflow-hidden shadow-lg mb-8"
    >
      {/* Background Image Cover */}
      <img 
        src={current.image} 
        alt={current.title} 
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />
      
      {/* Gradient scrim & noise overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${current.gradient} mix-blend-multiply opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

      {/* Grid subtle design backdrop line */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Content wrapper */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 text-right z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner text-white">
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-[#6cf8bb] opacity-90 block mb-1">
              {tab.toUpperCase()} SECTION Cover
            </span>
            <h1 className="font-display text-lg md:text-2xl font-black text-white m-0 tracking-tight leading-tight">
              {current.title}
            </h1>
          </div>
        </div>
        
        <p className="mt-3 text-xs md:text-sm text-slate-200/90 max-w-xl font-sans font-medium leading-relaxed">
          {current.subtitle}
        </p>
      </div>

      {/* Decorative round vector */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border border-white/5 pointer-events-none" />
    </motion.div>
  );
}
