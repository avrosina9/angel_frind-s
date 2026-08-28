/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_PRACTICAL_SECTIONS, DEFAULT_FIELD_ALERTS, SKILL_CHECKLIST, EVALUATION_NOTES } from '../data';
import { PracticalSection, FieldAlertTask, SkillChecklistItem } from '../types';
import { 
  Check, 
  AlertTriangle, 
  MessageSquare, 
  CalendarClock, 
  Sparkles, 
  Send,
  Compass,
  Users,
  BookOpen,
  Activity,
  Calendar,
  Award,
  Sparkle,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle,
  XCircle,
  Info,
  CalendarDays,
  ListFilter,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

interface PracticalViewProps {
  onNotify: (message: string) => void;
}

export default function PracticalView({ onNotify }: PracticalViewProps) {
  // 1. Core Evaluation Data from LocalStorage
  const [sections, setSections] = useState<PracticalSection[]>(() => {
    const saved = localStorage.getItem('angels_practical_evaluation_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PRACTICAL_SECTIONS;
  });

  // 2. Field Alerts from LocalStorage
  const [alerts, setAlerts] = useState<FieldAlertTask[]>(() => {
    const saved = localStorage.getItem('angels_field_alerts_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_FIELD_ALERTS;
  });

  // 3. Alerts attendance statuses (confirm, excuse, absent, etc)
  const [attendance, setAttendance] = useState<Record<string, 'confirmed' | 'excused' | 'idle'>>(() => {
    const saved = localStorage.getItem('angels_alerts_attendance_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // 4. Stored written excuses for absences
  const [excuses, setExcuses] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('angels_alerts_excuses_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Calendar States for Weekly and Monthly Views
  const [calendarTab, setCalendarTab] = useState<'monthly' | 'weekly'>('monthly');
  const [currentMonth, setCurrentMonth] = useState<number>(6); // 6 is June 2026, 7 is July, 8 is August
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<FieldAlertTask | null>(null);
  
  // Excusals Text Form States
  const [isExcusalInputOpen, setIsExcusalInputOpen] = useState<string | null>(null); // holds alert.id who's excuse form is open
  const [excuseText, setExcuseText] = useState<string>('');

  const [checklist, setChecklist] = useState<SkillChecklistItem[]>(SKILL_CHECKLIST);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Supervisor chat drawer setup
  const [supervisorMessage, setSupervisorNote] = useState('');
  const [conversation, setConversation] = useState<Array<{ sender: 'user' | 'supervisor'; text: string }>>([
    { sender: 'supervisor', text: 'مرحباً ميلاد، أداؤك الميداني والروحي متميز جداً بوسط الفصول والمؤسسة، نتابع بدقة ملفات الافتقاد والفعاليات والرحلات المدرجة لإعداد تقرير التقييم السنوي العام.' }
  ]);

  // Sync backends
  useEffect(() => {
    localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(sections));
    
    // Save summed total score to link with dashboard
    let sumAchieved = 0;
    sections.forEach(sec => {
      sec.items.forEach(item => {
        sumAchieved += item.achievedScore;
      });
    });
    localStorage.setItem('angels_fieldwork_total_score_v2', sumAchieved.toString());
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('angels_field_alerts_v2', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('angels_alerts_attendance_v2', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('angels_alerts_excuses_v2', JSON.stringify(excuses));
  }, [excuses]);

  // Read updates immediately from storage to support administrative changes real-time
  useEffect(() => {
    const checkUpdates = () => {
      const savedAlerts = localStorage.getItem('angels_field_alerts_v2');
      if (savedAlerts) {
        try {
          setAlerts(JSON.parse(savedAlerts));
        } catch(e) {}
      }
    };
    const interval = setInterval(checkUpdates, 1500);
    return () => clearInterval(interval);
  }, []);

  // Handle skill check toggle
  const handleToggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.checked;
        onNotify(nextState ? `تم تحديث المهارة الاسترشادية "${item.label}" إلى مكتملة.` : `تم إلغاء مهارة "${item.label}".`);
        return {
          ...item,
          checked: nextState,
          status: nextState ? 'completed' : 'required',
          statusText: nextState ? 'مكتمل' : 'مطلوب'
        };
      }
      return item;
    }));
  };

  // Confirm attendance button
  const handleConfirmAttendance = (alertId: string, alertTitle: string) => {
    setAttendance(prev => ({ ...prev, [alertId]: 'confirmed' }));
    
    // Clean any previous excuse if they decide to attend
    const updatedExcuses = { ...excuses };
    delete updatedExcuses[alertId];
    setExcuses(updatedExcuses);

    onNotify(`✓ تم تأكيد حضورك رسمياً للحدث: "${alertTitle}". سيتم إرسال الإشعار لغرفة الإشراف.`);
  };

  // Handle Excusal Submit Form
  const handleExcuseSubmit = (alertId: string, alertTitle: string) => {
    if (!excuseText.trim()) {
      onNotify('يرجى تقديم مبرر أو عذر للغياب أولاً لتثبيته في كشف حساب التقييم الميداني.');
      return;
    }
    setAttendance(prev => ({ ...prev, [alertId]: 'excused' }));
    setExcuses(prev => ({ ...prev, [alertId]: excuseText }));
    onNotify(`⚠️ تم تسجيل عذر غياب معتمد لـ "${alertTitle}": "${excuseText}".`);
    
    setIsExcusalInputOpen(null);
    setExcuseText('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorMessage.trim()) return;

    setConversation(prev => [
      ...prev,
      { sender: 'user', text: supervisorMessage }
    ]);
    
    const sentMsg = supervisorMessage;
    setSupervisorNote('');
    onNotify('تم إرسال رسالتك التقييمية لمشرفك بنجاح.');

    setTimeout(() => {
      setConversation(prev => [
        ...prev,
        { sender: 'supervisor', text: `تلقيت رسالتك واستفسارك: "${sentMsg}". سنقوم بمطابقتها وتقييم الإنجازات الميدانية بدقة وتطوير درجاتك باللوحة العامة للتكامل.` }
      ]);
      onNotify('📧 وصلك تعليق فوري من المشرف العام للرعاية الميدانية.');
    }, 2000);
  };

  // Map Lucide icons dynamically 
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-sky-600" />;
      case 'Award': return <Award className="w-5 h-5 text-yellow-500" />;
      default: return <Sparkles className="w-5 h-5 text-teal-600" />;
    }
  };

  // Calculations for scores
  let totalMaxScore = 0;
  let totalAchievedScore = 0;
  
  sections.forEach(sec => {
    sec.items.forEach(item => {
      totalMaxScore += item.maxScore;
      totalAchievedScore += item.achievedScore;
    });
  });

  const overallPercentage = totalMaxScore > 0 ? Math.round((totalAchievedScore / totalMaxScore) * 100) : 0;

  // Determine servant level and badge colors
  let levelTitle = '';
  let levelColor = '';
  let levelDesc = '';

  if (overallPercentage >= 90) {
    levelTitle = 'خادم رعاية محترف (رتبة الخدمة الذهبية)';
    levelColor = 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]';
    levelDesc = 'أداؤك الميداني متألق جداً ويسهم في دمج متكامل وناجح للأطفال بمجتمع أصدقاء الملائكة.';
  } else if (overallPercentage >= 80) {
    levelTitle = 'خادم متميز مستوفي الأركان الميدانية';
    levelColor = 'bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe]';
    levelDesc = 'ملتزم بالافتقاد والرحلات وحضور ممتاز للقداسات والخدمات الفرعية والتفاعل الكلي.';
  } else if (overallPercentage >= 70) {
    levelTitle = 'خادم نشط متكامل قيد التطوير المتقدم';
    levelColor = 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]';
    levelDesc = 'حضورك طيب وننصح بزيادة وتيرة الزيارات الميدانية وتسجيل تقارير كتاب الافتقاد بانتظام.';
  } else {
    levelTitle = 'مبتدئ وقيد التدريب المكثف';
    levelColor = 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]';
    levelDesc = 'يرجى مراجعة الجدول الزمني الميداني وإشراك أخصائي المتابعة لدعم خطتك الخدمية.';
  }

  // --- CALENDAR GRID GENERATOR (June 2026, July 2026, August 2026) ---
  const getDaysInMonth = (monthNum: number) => {
    if (monthNum === 6) { // June 2026
      return { startOffset: 1, totalDays: 30, name: 'يونيو 2026' }; // Monday (1) implies offset of 1
    } else if (monthNum === 7) { // July 2026
      return { startOffset: 3, totalDays: 31, name: 'يوليو 2026' }; // Wednesday (3) implies offset of 3
    } else { // August 2026
      return { startOffset: 6, totalDays: 31, name: 'أغسطس 2026' }; // Saturday (6) starts on Sat
    }
  };

  const currentMonthData = getDaysInMonth(currentMonth);

  // Checks if a calendar day number has any mapped field alerts
  const checkDayAlert = (day: number) => {
    const dateQueryStr = `2026-0${currentMonth}-${day < 10 ? '0' + day : day}`;
    return alerts.find(al => al.date === dateQueryStr);
  };

  // Generate weeks of selected month for weekly browse as requested:
  const getWeeksRange = () => {
    if (currentMonth === 6) {
      return [
        { label: 'الأسبوع الأول (١ - ٧ يونيو)', start: 1, end: 7 },
        { label: 'الأسبوع الثاني (٨ - ١٤ يونيو)', start: 8, end: 14 },
        { label: 'الأسبوع الثالث (١٥ - ٢١ يونيو)', start: 15, end: 21 },
        { label: 'الأسبوع الرابع والختامي (٢٢ - ٣٠ يونيو)', start: 22, end: 30 }
      ];
    } else if (currentMonth === 7) {
      return [
        { label: 'الأسبوع الأول (١ - ٧ يوليو)', start: 1, end: 7 },
        { label: 'الأسبوع الثاني (٨ - ١٤ يوليو)', start: 8, end: 14 },
        { label: 'الأسبوع الثالث (١٥ - ٢١ يوليو)', start: 15, end: 21 },
        { label: 'الأسبوع الرابع والأخير (٢٢ - ٣١ يوليو)', start: 22, end: 31 }
      ];
    } else {
      return [
        { label: 'الأسبوع الأول (١ - ٧ أغسطس)', start: 1, end: 7 },
        { label: 'الأسبوع الثاني (٨ - ١٤ أغسطس)', start: 8, end: 14 },
        { label: 'الأسبوع الثالث (١٥ - ٢١ أغسطس)', start: 15, end: 21 },
        { label: 'الأسبوع الرابع والأخير (٢٢ - ٣١ أغسطس)', start: 22, end: 31 }
      ];
    }
  };

  const currentWeeks = getWeeksRange();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right" id="practical_premium_root">
      
      {/* 1. Header Banner */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden" id="practical_banner">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-emerald-50 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#15803d] rounded-full text-[10px] font-bold border border-emerald-100">
              <Sparkle className="w-3.5 h-3.5 fill-[#15803d]" />
              التقييم العملي والالتزام الميداني للخدمة
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-[#151c27]">
              سجل التقييم والتحركات الميدانية التفاعلية
            </h2>
            <p className="font-sans text-xs text-slate-500 max-w-2xl">
              تصفح التنبيهات المدرسية الميدانية والمهام الكنسية المطلوبة بشكل أسبوعي أو شهري، وقم بتأكيد حضورك أو تقديم مبررات وأعذار الغياب المعتمدة لتسجيلها بملف التقييم تلقائياً.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3">
            <div className={`px-4 py-2.5 rounded-2xl border text-center transition-all ${levelColor}`}>
              <span className="block text-[9px] uppercase tracking-wider font-bold opacity-80 font-mono">المستــوى الميداني للدارس</span>
              <span className="block text-xs font-black font-display mt-0.5">{levelTitle}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED FULL-WIDTH FIELDWORK PLANNERS CENTER BASED ON CALENDAR (Weekly or Monthly) */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6" id="calendar_fieldwork_schedule_panel">
        
        {/* Top bar controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1 text-right">
            <h3 className="font-display font-black text-sm text-[#111622] flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-blue-600 animate-pulse" />
              <span>المخطط التقويمي للمهام والتنبيهات الميدانية الكنسية</span>
            </h3>
            <p className="font-sans text-[11px] text-slate-400">تصفح وجدولة التحركات بالتاريخ، حدد الحضور وسجل الأعذار الرسمية بشكل موثق.</p>
          </div>

          <div className="flex items-center gap-4.5 flex-wrap self-stretch justify-between md:justify-end">
            
            {/* View Filter tabs: Weekly or Monthly */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => {
                  setCalendarTab('monthly');
                  setSelectedAlertForDetail(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  calendarTab === 'monthly' ? 'bg-blue-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>التقويم الشهري المصور</span>
              </button>

              <button 
                onClick={() => {
                  setCalendarTab('weekly');
                  setSelectedAlertForDetail(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  calendarTab === 'weekly' ? 'bg-blue-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>التصفح بالأيام والأسابيع</span>
              </button>
            </div>

            {/* Month Select Slider */}
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[10.5px] text-slate-404 font-bold">الشهر النشط:</span>
              <select 
                value={currentMonth}
                onChange={(e) => {
                  setCurrentMonth(Number(e.target.value));
                  setSelectedAlertForDetail(null);
                }}
                className="bg-slate-50 border border-slate-200 text-xs font-sans p-1.5 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
              >
                <option value={6}>يونيو 2026</option>
                <option value={7}>يوليو 2026</option>
                <option value={8}>أغسطس 2026</option>
              </select>
            </div>

          </div>
        </div>

        {/* --- GRID OR LIST MAIN PRESENTATION INNER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Navigation (Canvas grid or timeline scheduler) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* MONTHLY VIEW CALENDAR CANVAS GRID */}
            {calendarTab === 'monthly' ? (
              <div className="space-y-4">
                
                {/* Visual Calendar grid representation of selectedMonth */}
                <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/20" id="monthly_days_grid_holder">
                  
                  {/* Month header label inside grid */}
                  <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-150 flex justify-between items-center text-xs font-bold font-display text-slate-700">
                    <span>{currentMonthData.name}</span>
                    <span className="text-[10px] bg-white text-blue-700 px-2.5 py-0.5 rounded-md border border-slate-200 font-sans">جدول التتبع الذكي</span>
                  </div>

                  {/* Calendar Weekdays Columns Header */}
                  <div className="grid grid-cols-7 text-center py-2 bg-slate-50 border-b border-slate-150 font-display text-[10px] text-slate-400 font-bold">
                    <div>الأحد</div>
                    <div>الاثنين</div>
                    <div>الثلاء</div>
                    <div>الأربعاء</div>
                    <div>الخميس</div>
                    <div>الجمعة</div>
                    <div>السبت</div>
                  </div>

                  {/* Days boxes dynamic mapping */}
                  <div className="grid grid-cols-7 gap-px bg-slate-200">
                    {/* Render Blank days before month start */}
                    {Array.from({ length: currentMonthData.startOffset }).map((_, i) => (
                      <div key={`blank-${i}`} className="bg-white/80 h-11 md:h-13" />
                    ))}

                    {/* Render Month Days */}
                    {Array.from({ length: currentMonthData.totalDays }).map((_, i) => {
                      const dayNumber = i + 1;
                      const dayAlert = checkDayAlert(dayNumber);
                      const isAlertDay = !!dayAlert;
                      const isSelected = selectedAlertForDetail?.id === dayAlert?.id && isAlertDay;

                      return (
                        <div 
                          key={`day-${dayNumber}`}
                          onClick={() => {
                            if (dayAlert) {
                              setSelectedAlertForDetail(dayAlert);
                              setIsExcusalInputOpen(null);
                            }
                          }}
                          className={`bg-white h-11 md:h-13 p-1 flex flex-col justify-between transition-all select-none ${
                            isAlertDay ? 'cursor-pointer hover:bg-amber-50/60' : ''
                          } ${
                            isSelected ? 'bg-amber-50 border-2 border-amber-300' : ''
                          }`}
                        >
                          <span className={`font-sans text-[10.5px] font-bold ${
                            isAlertDay ? 'text-[#15803d]' : 'text-slate-400'
                          }`}>
                            {dayNumber}
                          </span>

                          {/* Event label or active indicator inside day slot */}
                          {isAlertDay ? (
                            <div className="space-y-0.5 text-right">
                              <span className="block h-1.5 w-1.5 bg-rose-500 rounded-full mx-auto md:hidden" />
                              <div className="hidden md:block truncate text-[7.5px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded-md font-bold font-display scale-90 origin-right">
                                {dayAlert.title}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                </div>

                <div className="flex items-center gap-2 text-[10.5px] font-sans text-slate-400">
                  <span className="w-3 h-3 bg-amber-100 border border-amber-350 rounded" />
                  <span>تلميح: الأيام ذات الخلايا والملصقات البارزة تحتوي على مهام وتحركات خدمة ميدانية نشطة. اضغط عليها للمشاهدة والتأكيد.</span>
                </div>

              </div>
            ) : (
              
              /* WEEKLY GROUPS BROWSER TAB */
              <div className="space-y-4">
                {currentWeeks.map((week, idx) => {
                  // Find all alerts falling in this week's date range
                  const weekAlerts = alerts.filter(al => {
                    const parts = al.date.split('-');
                    const alertMonth = Number(parts[1]);
                    const alertDay = Number(parts[2]);
                    return alertMonth === currentMonth && alertDay >= week.start && alertDay <= week.end;
                  });

                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-3xs">
                      
                      {/* Week label header */}
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-display font-extrabold text-[#111622] text-xs flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          {week.label}
                        </span>
                        <span className="font-sans text-[9.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                          إجمالي المهام المرفقة: {weekAlerts.length}
                        </span>
                      </div>

                      {/* Display alerts inside this week */}
                      {weekAlerts.length > 0 ? (
                        <div className="space-y-2">
                          {weekAlerts.map(wa => {
                            const status = attendance[wa.id] || 'idle';
                            return (
                              <div 
                                key={wa.id}
                                onClick={() => {
                                  setSelectedAlertForDetail(wa);
                                  setIsExcusalInputOpen(null);
                                }}
                                className={`p-3 bg-slate-50/50 rounded-xl border border-slate-200 hover:border-blue-450 transition-colors cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                                  selectedAlertForDetail?.id === wa.id ? 'border-blue-400 bg-blue-50/30' : ''
                                }`}
                              >
                                <div className="space-y-1">
                                  <h5 className="font-display font-black text-xs text-[#151c27]">{wa.title}</h5>
                                  <div className="flex gap-2 text-[10px] text-slate-400 font-sans">
                                    <span>المكان: {wa.location}</span>
                                    <span>•</span>
                                    <span>التاريخ والوقت: {wa.date} في {wa.time}</span>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  {status === 'confirmed' ? (
                                    <span className="bg-emerald-50 text-emerald-800 text-[8.5px] px-2 py-0.5 rounded-md font-bold">تم تأكيد الحضور ✅</span>
                                  ) : status === 'excused' ? (
                                    <span className="bg-amber-50 text-amber-800 text-[8.5px] px-2 py-0.5 rounded-md font-bold">غياب مع عذر ⏳</span>
                                  ) : (
                                    <span className="bg-slate-100 text-slate-500 text-[8.5px] px-2 py-0.5 rounded-md font-bold">لم يتخذ قرار</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-slate-400 font-sans text-[10.5px] py-1 text-center">لا توجد مهام أو تنبيهات مجدولة لهذا الأسبوع مسبقاً.</p>
                      )}

                    </div>
                  );
                })}
              </div>

            )}

          </div>

          {/* DYNAMIC SIDE-PANEL FOR COMPREHENSIVE ACTION ON SELECTED FIELDWORK ALERT */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between" id="calendar_interaction_details_sidebar">
            
            {selectedAlertForDetail ? (
              <div className="space-y-4 text-right">
                
                {/* Active alert metadata */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] bg-blue-105 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">البيان الميداني</span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tight">{selectedAlertForDetail.date}</span>
                  </div>
                  <h4 className="font-display font-black text-xs text-slate-900 leading-snug">{selectedAlertForDetail.title}</h4>
                </div>

                <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-150/80 text-[11px] font-sans text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>الوقت المعتمد:</strong> {selectedAlertForDetail.time}</span>
                  </div>

                  <div className="flex items-start gap-1.5 border-t border-slate-100 pt-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>نقطة التمركز والموقع الميداني:</strong> {selectedAlertForDetail.location}</span>
                  </div>

                  <div className="flex items-start gap-1.5 border-t border-slate-100 pt-2.5">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>حالة حضورك الحالية: </strong>
                      {attendance[selectedAlertForDetail.id] === 'confirmed' && <strong className="text-emerald-700">مؤكد ✅</strong>}
                      {attendance[selectedAlertForDetail.id] === 'excused' && <strong className="text-amber-700">معتذر رسمي مع عذر</strong>}
                      {(!attendance[selectedAlertForDetail.id] || attendance[selectedAlertForDetail.id] === 'idle') && <strong className="text-slate-500">منظور قيد الانتظار ⏳</strong>}
                    </span>
                  </div>

                  {/* Excuse Text Review */}
                  {attendance[selectedAlertForDetail.id] === 'excused' && excuses[selectedAlertForDetail.id] && (
                    <div className="bg-amber-100/30 p-2.5 rounded-lg border border-amber-150 mt-2 text-[10px] text-amber-900">
                      <strong>التبرير والسبب الـمرفوع:</strong> <br />
                      "{excuses[selectedAlertForDetail.id]}"
                    </div>
                  )}
                </div>

                {/* Confirm / Excusal forms buttons */}
                <div className="space-y-2.5 pt-2">
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmAttendance(selectedAlertForDetail.id, selectedAlertForDetail.title)}
                      className="flex-1 h-9.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-label font-bold transition-transform cursor-pointer"
                    >
                      تأكيد الحضور والالتزام
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsExcusalInputOpen(selectedAlertForDetail.id);
                        setExcuseText(excuses[selectedAlertForDetail.id] || '');
                      }}
                      className="flex-1 h-9.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-250 rounded-lg text-[10px] font-label font-bold transition-all cursor-pointer"
                    >
                      أرغب بالاعتذار بعذر
                    </button>
                  </div>

                  {/* Pop expanded text blocks to insert excuse text */}
                  {isExcusalInputOpen === selectedAlertForDetail.id && (
                    <div className="bg-white border border-amber-200 p-3 rounded-xl space-y-2 text-right">
                      <label className="block text-[10px] font-bold text-amber-900">تبرير وسبب الغياب الرسمي التفصيلي:</label>
                      <textarea 
                        rows={2}
                        value={excuseText}
                        onChange={(e) => setExcuseText(e.target.value)}
                        placeholder="مثلاً: سفر طارئ مع العائلة / واجب دراسي كنسي إلزامي / دوع عذر مرضي..."
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2 font-sans text-[11px] focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <button
                        onClick={() => handleExcuseSubmit(selectedAlertForDetail.id, selectedAlertForDetail.title)}
                        className="w-full h-8.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg"
                      >
                        إقرار العذر وتثبيت التبرير
                      </button>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 font-sans text-xs space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" strokeWidth={1.5} />
                <p>يرجى اختيار أحد الأيام أو المهام لعرض تفاصيلها الميدانية وإثبات حضورك أو تقديم مبررات الغياب.</p>
              </div>
            )}

            <div className="border-t border-slate-200 mt-4 pt-3.5 text-center">
              <span className="font-sans text-[10px] text-slate-400 font-medium">مؤسسة أصدقاء الملائكة للرعاية الكاملة 🛡️</span>
            </div>

          </div>

        </div>

      </section>

      {/* 3. The 7 core evaluation sections detailed grids */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <h3 className="font-display text-md font-extrabold text-[#151c27] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#15803d]" />
            أبواب معايير التقييم السبع وعناصرها الموثقة بالتفصيل
          </h3>
          <span className="text-[10px] text-slate-450 font-sans">
            اضغط على البند لعرض تفاصيل عناصره الفرعية والدرجة القصوى والدرجة الفعلية للخادم
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => {
            const isExpanded = selectedSection === sec.id;
            
            // Calculate progress for this section
            let secMax = 0;
            let secAchieved = 0;
            sec.items.forEach(it => {
              secMax += it.maxScore;
              secAchieved += it.achievedScore;
            });
            const secPercentage = secMax > 0 ? Math.round((secAchieved / secMax) * 100) : 0;

            return (
              <div 
                key={sec.id}
                className={`bg-white rounded-2xl border transition-all hover:shadow-sm overflow-hidden flex flex-col justify-between ${
                  isExpanded ? 'ring-2 ring-blue-600 border-transparent animate-pulse' : 'border-slate-200/70'
                }`}
              >
                {/* Section Header */}
                <div 
                  onClick={() => setSelectedSection(isExpanded ? null : sec.id)}
                  className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-3xs border border-slate-200/80 shrink-0">
                      {getIconComponent(sec.icon)}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-xs text-[#151c27]">{sec.title}</h4>
                      <span className="text-[10px] text-slate-450 font-sans font-medium block">
                        إجمالي: {secAchieved} من {secMax} درجة ({secPercentage}%)
                      </span>
                    </div>
                  </div>

                  <span className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>

                {/* Section body with items */}
                <div className="p-4 flex-grow space-y-3.5">
                  {/* Progress bar */}
                  <div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-blue-600" 
                        style={{ width: `${secPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {/* List of elements inside this section */}
                  <div className="space-y-2.5 pt-1">
                    {sec.items.map((it) => (
                      <div 
                        key={it.id}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/80 hover:bg-white transition-all flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="font-display font-bold text-[11px] text-[#151c27]">{it.label}</p>
                          <span className="text-[9px] text-slate-450 font-sans block">خاضع لمتابعة المشرف الصفي الميداني</span>
                        </div>
                        
                        <div className="text-left shrink-0">
                          <span className="inline-block bg-white text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border border-slate-200">
                            {it.achievedScore} / {it.maxScore} <span className="text-slate-400 text-[9px] font-normal font-sans">درجة</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Supplemental text context about child attendance items as required */}
                  {sec.id === 'attendance' && (
                    <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100 text-[9px] text-blue-800 font-sans flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 shrink-0 text-blue-600 mt-0.5" />
                      <span>يتضمن بند حضور الأطفال متابعة دورة السيارة لضمان وصول ومغادرة الأطفال من ذوي الهمم بكامل السلامة البدنية والاهتمام بالتواصل مع الأسر.</span>
                    </div>
                  )}

                  {sec.id === 'visitation' && (
                    <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100 text-[9px] text-emerald-800 font-sans flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>يشمل الالتزام بالاتصال المباشر والزيارة المنزلية وتسجيل تفاصيل وصعوبات الحالة في كتاب الافتقاد وتقديمه للمشرف.</span>
                    </div>
                  )}

                </div>

                {/* Expand indicator card footer */}
                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 text-[9px] font-sans text-slate-400 text-center">
                  خاضع للتقييم والتعديل من لوحة تحكم الإدارة
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Skills list checklists retained for interaction */}
      <section className="space-y-4">
        <h3 className="font-display text-xs font-black text-[#151c27] flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Sparkles className="w-4 h-4 text-[#15803d]" />
          تحقق المهارات المساعدة والمعرفة الإضافية (تفاعلي للدارس)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleCheck(item.id)}
              className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-blue-600 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 border rounded-lg flex items-center justify-center transition-all ${
                  item.checked ? 'bg-blue-600 border-blue-600' : 'border-[#c3c5d7]'
                }`}>
                  {item.checked && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                </div>
                
                <span className={`font-display text-[11px] transition-all relative ${
                  item.checked ? 'text-slate-400 font-medium line-through' : 'text-[#151c27] font-bold'
                }`}>
                  {item.label}
                </span>
              </div>

              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-label ${
                item.checked 
                  ? 'bg-emerald-100 text-[#15803d]' 
                  : item.status === 'review' ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-red-750'
              }`}>
                {item.checked ? 'مكتمل' : item.statusText}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Message and Interactive Chat section */}
      <section className="bg-amber-50/50 border border-amber-250 p-6 rounded-2xl flex flex-col lg:flex-row gap-6 justify-between items-stretch">
        
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-display text-sm font-black text-amber-950 flex items-center gap-1">
              <span className="grayscale">📌</span>
              ملاحظة التقييم العام الإرشادية - د. هدى صفوت
            </h3>
            <div className="bg-white p-4 rounded-xl border border-amber-200/80 leading-relaxed font-sans text-xs text-slate-800 shadow-3xs">
              {EVALUATION_NOTES.note}
            </div>
          </div>
          
          <div className="bg-amber-100/50 border border-amber-200 rounded-xl p-3.5 text-[10px] text-amber-900 leading-normal mt-4">
            💡 <strong>إرشاد:</strong> مجموع درجاتك الحالية يؤهلك للحصول على رتبة بونص إضافية. تواصل مع المشرف المسؤول مباشرة في أي وقت لتعديل درجات الحضور إن كانت هناك ساعات عذر معتمد مسجل يدوياً.
          </div>
        </div>

        {/* Dynamic chat window */}
        <div className="lg:w-1/2 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs">
          <div className="border-b pb-2 mb-3">
            <h4 className="font-display font-extrabold text-xs text-[#151c27] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              صندوق الملاحظات والاستفسارات المباشر مع إدارة رعاية أصدقاء الملائكة
            </h4>
            <p className="text-[9px] text-slate-400 font-sans mt-0.5">تواصل للتدقيق في لوحة درجات التقييم وتوضيح بنود الافتقاد والرحلات الميدانية</p>
          </div>

          <div className="space-y-3 h-40 overflow-y-auto p-2 bg-slate-50/70 rounded-lg mb-3 flex flex-col scrollbar-none">
            {conversation.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-3xs ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white self-start rounded-tr-none' 
                    : 'bg-emerald-50 text-[#151c27] border border-emerald-100 self-end rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={supervisorMessage}
              onChange={(e) => setSupervisorNote(e.target.value)}
              placeholder="اكتب استفسارك المباشر لإدارة التقييم هنا..."
              className="flex-grow text-xs font-sans p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-label text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>

      </section>

    </div>
  );
}
