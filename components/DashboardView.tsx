/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { USER_PROFILE, RANK_LEVELS, SECTION_COMPLETION } from '../data';
import dashboardCover from '../assets/images/angels_sunday_school_cover_1782062060183.jpg';
import { 
  School, 
  Timer, 
  Check, 
  Lock, 
  ChevronLeft, 
  LineChart, 
  ClipboardList, 
  Plus, 
  UserCheck,
  Trophy,
  Sparkles,
  Activity,
  Award,
  Gift,
  Compass,
  Utensils,
  Star,
  ListOrdered,
  BadgePercent,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

interface DashboardViewProps {
  onNotify: (message: string) => void;
  onNavigateToPractical: () => void;
  pointsAccumulated?: number;
}

export default function DashboardView({ onNotify, onNavigateToPractical, pointsAccumulated = 2450 }: DashboardViewProps) {
  // Current active sub-set: 'overview' (الأداء الأكاديمي) vs 'ranking' (الترتيب والجوائز)
  const [subTab, setSubTab] = useState<'overview' | 'ranking'>('overview');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [trainingHours, setTrainingHours] = useState(124);
  const [profile, setProfile] = useState<any>(USER_PROFILE);
  const [netBalance, setNetBalance] = useState(0);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [fieldworkTotalScore, setFieldworkTotalScore] = useState(450);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    // Read dynamic profile
    const savedProf = localStorage.getItem('angels_user_profile_v1');
    if (savedProf) {
      try {
        setProfile(JSON.parse(savedProf));
      } catch (e) {}
    }

    // Read field evaluation total score
    const savedFieldwork = localStorage.getItem('angels_fieldwork_total_score_v2');
    if (savedFieldwork) {
      try {
        setFieldworkTotalScore(parseInt(savedFieldwork, 10));
      } catch (e) {}
    }

    // Read bonuses and discounts to show net balance and precise stats
    const savedLogs = localStorage.getItem('angels_bonuses_discounts_logs_v1');
    if (savedLogs) {
      try {
        const logs = JSON.parse(savedLogs);
        const myLogs = logs.filter((item: any) => item.servantName === "ميلاد بشته");
        const b = myLogs.filter((i: any) => i.type === 'bonus').reduce((acc: number, curr: any) => acc + curr.amount, 0);
        const d = myLogs.filter((i: any) => i.type === 'discount').reduce((acc: number, curr: any) => acc + curr.amount, 0);
        setNetBalance(b - d);
      } catch (e) {}
    }
  }, []);

  const handleCreateRequest = () => {
    if (requestSubmitted) return;
    setRequestSubmitted(true);
    onNotify('تم تسجيل طلبك لبدء مشروع عملي جديد. سيقوم المشرف العام بمراجعته وإفادتك.');
  };

  const handlePracticeHours = () => {
    setTrainingHours(prev => prev + 1);
    onNotify('تمت إضافة ساعة تدريبية معتمدة لرصيدك بنجاح!');
  };

  const handleClaimReward = (rewardTitle: string, minPoints: number) => {
    const activePoints = profile.points || (examsTotalScore + fieldworkTotalScore + netBalance);
    if (activePoints < minPoints) {
      onNotify(`عذراً، نقاطك الحالية (${activePoints}) غير كافية لطلب هذه الجائزة الكبرى. تجمع المزيد من النقاط!`);
      return;
    }
    setSelectedReward(rewardTitle);
    onNotify(`يا له من إنجاز رائع! تم تقديم طلبك بنجاح لاستلام الجائزة: "${rewardTitle}". سيتم إصدار الكود الخاص بك بشكل فوري.`);
  };

  // Calculated Exam scores & Fieldwork scores
  const examsTotalScore = 380; // Sum of multiple exams
  const grandTotalScore = profile.points || (examsTotalScore + fieldworkTotalScore + netBalance);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      
      {/* 1. Header Hero Welcome Widget (Extremely Compact & High-Fidelity) */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-[#c3c5d7]/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <School className="w-36 h-36 text-[#15803d]" />
        </div>
        
        <div className="z-10 text-right space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="p-1.5 bg-[#dcfce7] text-[#15803d] rounded-xl shrink-0">
              <UserCheck className="w-5 h-5" />
            </span>
            <div className="flex flex-col items-start text-right">
              <h1 className="font-display text-xs sm:text-sm font-bold text-slate-600">
                مرحباً بك، <span className="text-[11px] sm:text-xs font-extrabold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100 inline-block mt-1">{profile.fullName}</span>
              </h1>
              {profile.username && (
                <span className="font-mono text-xs text-amber-600 block mt-0.5" dir="ltr">
                  @{profile.username}
                </span>
              )}
            </div>
          </div>
          <p className="font-sans text-[#434654] text-xs leading-relaxed max-w-lg">
            أنت تتقدم بثبات في مسارك الخدمي والتأهيلي التابع لمؤسسة ملائكة أصدقاء الرعاية لذوي الاحتياجات الخاصة.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
            <span className="bg-[#dcfce7] text-[#15803d] border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {profile.level}
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {profile.rankOrder}
            </span>
          </div>
        </div>

        {/* Dynamic Hours Increment in Header - Space Saver */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5 flex items-center gap-1 justify-end">
              ساعات التدريب المعتمدة
              <Timer className="w-3 h-3 text-[#15803d]" />
            </span>
            <span className="text-3xl font-black font-display text-[#151c27] block leading-none">{trainingHours}</span>
            <span className="text-[9px] text-[#15803d] font-semibold mt-1 block">مكتمل وموثق هذا الفصل الدراسي</span>
          </div>
          <button
            onClick={handlePracticeHours}
            className="w-full sm:w-auto px-4 py-2 bg-[#15803d] text-white hover:bg-[#166534] rounded-xl text-xs font-bold font-label active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            حضور ساعة تدريب ميداني (+1 ساعة)
          </button>
        </div>
      </section>

      {/* 2. Unified Navigation Pill Tab Selector (Grades vs Ranks) */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl flex md:max-w-md mx-auto items-center shadow-xs border border-slate-200/60 font-label text-xs">
        <button
          onClick={() => setSubTab('overview')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'overview'
              ? 'bg-white text-[#15803d] shadow-xs ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-[#15803d]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>الأداء والدرجات والمتابعة</span>
        </button>
        <button
          onClick={() => setSubTab('ranking')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'ranking'
              ? 'bg-white text-[#15803d] shadow-xs ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-[#15803d]'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>تصنيف الخدام والجوائز الكبرى</span>
        </button>
      </div>



      {/* SUB-TAB VIEW 1: Overview & Academic Progress */}
      {subTab === 'overview' && (
        <div className="space-y-6">

          {/* Detailed Monthly Curve Analysis (6 Modules Analytics Panel) */}
          {selectedMonth && (() => {
            // High fidelity realistic dynamic month statistics
            const monthReports: Record<string, {
              title: string;
              desc: string;
              values: number[]; // Weekly values for line diagram
              academic: number;
              academicTopic: string;
              examsCount: number;
              examsAvg: number;
              practicalScore: number;
              practicalFeedback: string;
              bonus: number;
              discounts: number;
              strength: string;
              weakness: string;
              levelDescription: string;
            }> = {
              "يناير": {
                title: "شهر يناير التأسيسي",
                desc: "مرحلة التقديرات الأولى للدب الرعوي والتعريف الأساسي بلغة الإشارة الوصفية الموحدة وتحدي الملاحظة النشطة.",
                values: [70, 72, 75, 78],
                academic: 75,
                academicTopic: "لغة الإشارة الحركية والملامح التعبيرية التناغمية للوجه",
                examsCount: 2,
                examsAvg: 81,
                practicalScore: 78,
                practicalFeedback: "أداء ممتاز في الحفظ التعبيري وهدوء ثابت أمام محاكاة طفل التوحد.",
                bonus: 50,
                discounts: 10,
                strength: "سرعة مذهلة في التقاط معاني لغة الإشارة المجهرية وسعة صدر كاملة للملاحظة.",
                weakness: "قصور طفيف في نقل الحركة التعبيرية المتسلسلة دون وقفات طويلة.",
                levelDescription: "خادم مطلع ذو إمكانات واعدة بحاجة لمزيد من المراس العملي الحركي."
              },
              "فبراير": {
                title: "شهر فبراير لدمج الحركة",
                desc: "التعامل الميداني المتقدم للأطفال المصابين بالشلل الحركي والتصلب الدماغي وكيفية النقل الآمن.",
                values: [76, 78, 80, 82],
                academic: 80,
                academicTopic: "أمان حركة ذوي الهمم، واستخدام أدوات الرعاية البدنية والطبية",
                examsCount: 3,
                examsAvg: 85,
                practicalScore: 82,
                practicalFeedback: "طاعة تامة لبروتوكول السلامة ونقل المحاكاة المتنقلة بامتياز.",
                bonus: 80,
                discounts: 20,
                strength: "الحرص التام واليقظة الكاملة على راحة وأمان الكراسي المتحركة أثناء المزارات.",
                weakness: "تأخير في توثيق استبيان الرأي النفسي المخصص للمشرف الفني لمدة يومين.",
                levelDescription: "خادم كفء يمتلك المهارات اللوجستية الضرورية لإدارة الرحلات والنزولات الميدانية."
              },
              "مارس": {
                title: "شهر مارس الحسي",
                desc: "تصميم وتنفيذ الألعاب اللمسية والسمعية الترفيهية الفردية لتطوير استجابات طفل متلازمة داون.",
                values: [80, 81, 84, 85],
                academic: 85,
                academicTopic: "تعديل المناهج السلوكية وصياغة الألعاب التعليمية المندمجة والمحسوسة",
                examsCount: 3,
                examsAvg: 88,
                practicalScore: 85,
                practicalFeedback: "تنظيم فعال للغاية للألعاب المجمعة وذكاء رائع في لفت انتباه الطفل الصعب.",
                bonus: 100,
                discounts: 15,
                strength: "ابتكار وسيلة لعب مجسمة جديدة مخصصة للمصابين بقصر الانتباه الحركي.",
                weakness: "تباطؤ نسبي في استدعاء وتطبيق خطة الإخلاء والإنقاذ المدرجة بالمناورات.",
                levelDescription: "التزام مرتفع وإبداع مميز في صياغة الألعاب يحتاج لسرعة تعامل أفضل بأوقات الطوارئ."
              },
              "أبريل": {
                title: "شهر أبريل لمناورات الإسعاف",
                desc: "الإنعاش ومناورات هيملايش الميدانية السلوكية لملء الفراغات الطارئة للأطفال تحت نوبات الاختناق.",
                values: [84, 86, 88, 90],
                academic: 90,
                academicTopic: "البروتوكول الصحي والإنعاش الرئوي والتثبيت الفوري في الفناء",
                examsCount: 4,
                examsAvg: 92,
                practicalScore: 90,
                practicalFeedback: "سرعة رد فعل ممتازة مع تطبيق عملي بنسبة مطابقة 94% للمناورة المعالجة.",
                bonus: 150,
                discounts: 10,
                strength: "ثبات انفعالي استثنائي وسرعة اتخاذ قرار حرج دون الاستعانة بالمدرب المساعد.",
                weakness: "تحفظ طفيف في تسجيل تقرير الأداء الروحي الأسبوعي للملف الرقمي الشامل.",
                levelDescription: "مستوى طبي ميداني متقدم؛ إمكانية ترشيح كامل للاعتماد الفردي لسلامة الأفواج."
              },
              "مايو": {
                title: "شهر مايو للترانيم الصامتة",
                desc: "سرد وتلحين القصص الروحية والترانيم الصامتة باللغة الإشارية الكلية المتناغمة مع المهرجانات.",
                values: [88, 90, 92, 94],
                academic: 93,
                academicTopic: "التلحين الإشاري التعبيري والقصص المنهجية التفاعلية الروحية والتكاملية",
                examsCount: 4,
                examsAvg: 95,
                practicalScore: 94,
                practicalFeedback: "نقل روحي رائع جداً كسر حاجز الملل وأضفى سعادة مطلقة على محاكاة الأطفال الصم.",
                bonus: 200,
                discounts: 0,
                strength: "جاذبية روحية وتعبيرية لافتة للوجدان وإدارة ممتازة للحضور والتأثير الصامت.",
                weakness: "حاجة طفيفة للتدقيق في ترتيب بعض الأفعال الزمنية داخل الهيكل اللغوي السرياني المترجم.",
                levelDescription: "خادم متميز جداً مؤهل لإدارة الطاقات والتطوير في مهرجان الملائكة السنوي."
              },
              "يونيو": {
                title: "شهر يونيو للمشروع النهائي",
                desc: "مشروع الدمج الميداني العملي المتكامل للمؤسسة والتعامل الكامل مع الحالات بالغة الصعوبة وذات التحدي.",
                values: [92, 94, 96, 98],
                academic: 98,
                academicTopic: "استراتيجيات دمج ذوي الاحتياجات الخاصة مع المجتمع، وبنود الإرشاد الأسري المباشر",
                examsCount: 5,
                examsAvg: 97,
                practicalScore: 96,
                practicalFeedback: "أداء نخبوي رائد ونموذج قيادي يحتذى به في إرشاد الأسر والخدام الجدد بالمجموعة.",
                bonus: 300,
                discounts: 0,
                strength: "إتقان كوني لكافة فنون التواصل البديل والوجداني ونضج روحي مفعم بالحب والرعاية.",
                weakness: "لا توجد نقاط ضعف ملحوظة (حائز على الدرجة النهائية الشرفية للدفعة الخدمية).",
                levelDescription: "سفير متميز للخدمة الخدمية؛ متمكن ومعتمد للتقييم والتوجيه وصنع الكفاءات الجديدة."
              }
            };

            const activeReport = monthReports[selectedMonth] || monthReports["يونيو"];

            return (
              <div key={selectedMonth} className="bg-slate-900 border-2 border-blue-600 rounded-3xl p-5 md:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200 text-right space-y-6 text-white">
                
                {/* Close Button Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                      <LineChart className="w-5 h-5 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="font-display font-black text-sm md:text-base text-blue-400">
                        التحليل البياني والمنحنيات التفصيلية للأداء خلال {selectedMonth} 📊
                      </h3>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                        تحليل علمي شامل لتقدير نقاط القوة والضعف للخادم وتعيين مستوى جودة الخدمة
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedMonth(null)}
                    type="button"
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    إغلاق التقرير والعودة للرئيسية ↩
                  </button>
                </div>

                {/* Grid Layout representing the SIX elements requested by the user */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  
                  {/* MODULE 1: منحنى التقييم الشهري (Weekly curve line diagram using vector SVG) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                    <strong className="text-[11px] font-bold text-blue-400 flex items-center gap-1 leading-none">
                      <span>١. منحنى التقييم السلوكي والتطوير الأسبوكي</span>
                    </strong>
                    
                    {/* SVG Line chart vector representation */}
                    <div className="relative h-28 bg-slate-900 rounded-xl p-2 flex flex-col justify-between border border-white/5">
                      <div className="absolute inset-x-0 top-6 h-px bg-white/5" />
                      <div className="absolute inset-x-0 top-14 h-px bg-white/5" />
                      <div className="absolute inset-x-0 top-22 h-px bg-white/5" />
                      
                      <svg className="w-full h-20 absolute inset-0 pt-4" viewBox="0 0 400 100">
                        {/* Define line drawing connecting the 4 weeks */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={`50,${100 - activeReport.values[0]} 150,${100 - activeReport.values[1]} 250,${100 - activeReport.values[2]} 350,${100 - activeReport.values[3]}`}
                        />
                        {/* Interactive dots representing week status */}
                        {activeReport.values.map((val, idx) => (
                          <circle
                            key={idx}
                            cx={50 + idx * 100}
                            cy={100 - val}
                            r="5"
                            fill="#ffffff"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                        ))}
                      </svg>
                      
                      {/* X axis week markers */}
                      <div className="flex justify-between text-[8px] text-slate-400 font-label font-bold mt-16 z-10 px-2">
                        <span>أسبوع ١ ({activeReport.values[0]}%)</span>
                        <span>أسبوع ٢ ({activeReport.values[1]}%)</span>
                        <span>أسبوع ٣ ({activeReport.values[2]}%)</span>
                        <span>أسبوع ٤ ({activeReport.values[3]}%)</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed-snug pr-1">
                      {activeReport.desc}
                    </p>
                  </div>

                  {/* MODULE 2: الإنجاز العلمي والدراسي (Scientific / curriculum details) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                    <strong className="text-[11px] font-bold text-blue-400 flex items-center gap-1 leading-none">
                      <span>٢. دراسة المحتوى والحصيلة العلمية المكتملة</span>
                    </strong>
                    
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5 flex items-center gap-3">
                      {/* circular visual representation of percent progress */}
                      <div className="w-12 h-12 rounded-full border-4 border-blue-500/25 border-t-blue-500 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black font-display text-blue-400">{activeReport.academic}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">الموضوع المنهجي:</span>
                        <strong className="text-xs text-white block mt-0.5 leading-snug">{activeReport.academicTopic}</strong>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-900/60 text-slate-300 p-2.5 rounded-lg block border border-white/5">
                      📖 تم قراءة وتحليل كراسات الأخصائيين المحددة للدورة بنجاح.
                    </span>
                  </div>

                  {/* MODULE 3: مركز الاختبارات والنتائج (Periodic Exams) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                    <strong className="text-[11px] font-bold text-blue-400 flex items-center gap-1 leading-none">
                      <span>٣. درجات الاختبارات المكتملة وعلامات القيد</span>
                    </strong>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] bg-slate-900 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-400">عدد الامتحانات المحلولة:</span>
                        <span className="font-bold text-white font-mono">{activeReport.examsCount} امتحانات</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] bg-slate-900 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-400">متوسط الدرجات المعتمد:</span>
                        <span className="font-bold text-blue-400 font-mono">{activeReport.examsAvg}%</span>
                      </div>
                      <div className="flex justify-between items-center text-[9.5px] bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 text-amber-300">
                        <span>⭐ علامة مهارات العيون والملامح: متقدم جداً</span>
                      </div>
                    </div>
                  </div>

                  {/* MODULE 4: التقييم العملي الميداني (Field Work Evaluation) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                    <strong className="text-[11px] font-bold text-blue-400 flex items-center gap-1 leading-none">
                      <span>٤. تقييم المعمل والميدان لعمل المحاكاة</span>
                    </strong>
                    
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5 text-right space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">الدرجة الميدانية للمشرف:</span>
                        <strong className="text-white text-xs">{activeReport.practicalScore} من 100</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeReport.practicalScore}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-300 leading-normal italic">
                        &ldquo;{activeReport.practicalFeedback}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* MODULE 5: الخصومات والبونص (Rewards & Deductions Log) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                    <strong className="text-[11px] font-bold text-blue-400 flex items-center gap-1 leading-none">
                      <span>٥. مستخلص رصيد البونص والمخالفات</span>
                    </strong>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-emerald-950/40 text-emerald-300 border border-emerald-500/25 rounded-xl">
                        <span className="text-[9px] block text-slate-400 font-bold">بونص مضاف بقرار</span>
                        <strong className="font-mono text-base block mt-0.5">+{activeReport.bonus}</strong>
                        <span className="text-[8px] block">منح تميز سلوك</span>
                      </div>
                      <div className="p-2 bg-rose-950/40 text-rose-300 border border-rose-500/25 rounded-xl">
                        <span className="text-[9px] block text-slate-400 font-bold">نقاط الخصم</span>
                        <strong className="font-mono text-base block mt-0.5">-{activeReport.discounts}</strong>
                        <span className="text-[8px] block">تأخير أوراق</span>
                      </div>
                    </div>
                  </div>

                  {/* MODULE 6: مهارات التواصل والتحديات (Strengths & Weaknesses analysis report) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                    <strong className="text-[11px] font-bold text-blue-400 flex items-center gap-1 leading-none">
                      <span>٦. رصد مهارات وتعيين نقاط القوة والضعف</span>
                    </strong>
                    
                    <div className="space-y-2 text-[10.5px]">
                      <div className="p-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 rounded-lg">
                        <strong className="text-[9px] text-emerald-400 block mb-0.5">💪 نقاط القوة المعتمدة حالياً:</strong>
                        <p>{activeReport.strength}</p>
                      </div>
                      <div className="p-2 bg-rose-500/10 text-rose-300 border border-rose-500/15 rounded-lg">
                        <strong className="text-[9px] text-rose-400 block mb-0.5">⚠️ نقاط الضعف لحاجة الصقل:</strong>
                        <p>{activeReport.weakness}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Combined level output */}
                <div className="bg-blue-950/80 p-3.5 rounded-2xl border border-blue-500/20 text-center text-xs space-y-1">
                  <span className="text-slate-450 text-slate-400 font-label block">التوجيه الختامي للمشرف العام عن شهر {selectedMonth}:</span>
                  <p className="font-bold text-blue-300 leading-relaxed pr-1">{activeReport.levelDescription}</p>
                </div>

              </div>
            );
          })()}
          
          {/* Quick Stats Grid Row */}
          <section className="bg-white rounded-3xl p-5 border border-[#c3c5d7]/50 shadow-xs space-y-4">
            <h3 className="font-display text-sm font-extrabold text-[#151c27] pb-2 border-b border-slate-100 flex items-center gap-1.5 justify-start">
              <Sparkles className="w-4 h-4 text-[#15803d]" />
              <span>لوحة التقديرات الشاملة والدرجات للدارس</span>
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Exams points */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-right space-y-1.5">
                <span className="font-sans text-[10px] text-slate-400 font-bold block flex items-center justify-end gap-1">
                  درجات الامتحانات والتقييمات
                  <ClipboardList className="w-3.5 h-3.5 text-[#15803d]" />
                </span>
                <span className="font-display font-black text-lg text-slate-800 block">
                  {examsTotalScore} <span className="text-[10px] text-slate-400 font-normal">درجة</span>
                </span>
                <span className="text-[9px] text-[#006c49] font-bold block">✓ مناهج وكتب الدارسين</span>
              </div>

              {/* Stat 2: Field Work practical score */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-right space-y-1.5">
                <span className="font-sans text-[10px] text-slate-400 font-bold block flex items-center justify-end gap-1">
                  التقييم العملي الميداني
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                </span>
                <span className="font-display font-black text-lg text-slate-800 block">
                  {fieldworkTotalScore} <span className="text-[10px] text-slate-400 font-normal">درجة</span>
                </span>
                <span className="text-[9px] text-purple-700 font-bold block">✓ محاكاة غرفة الرعاية</span>
              </div>

              {/* Stat 3: Net Bonuses/Discounts balance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-right space-y-1.5">
                <span className="font-sans text-[10px] text-slate-400 font-bold block flex items-center justify-end gap-1">
                  البونص والمخالفات
                  <BadgePercent className="w-3.5 h-3.5 text-[#006c49]" />
                </span>
                <span className={`font-display font-black text-lg block ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {netBalance >= 0 ? `+${netBalance}` : `${netBalance}`} <span className="text-[10px] text-slate-400 font-normal">درجة</span>
                </span>
                <span className="text-[9px] text-slate-500 block">رصيد تراكمي من الإدارة</span>
              </div>

              {/* Stat 4: Grand final score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#15803d] to-[#012586] text-white text-right space-y-1.5 shadow-sm">
                <span className="font-sans text-[10px] text-blue-100 font-bold block flex items-center justify-end gap-1">
                  المجموع الكلي التراكمي
                  <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                </span>
                <span className="font-display font-black text-lg text-yellow-300 block">
                  {grandTotalScore} <span className="text-[10px] text-blue-100 font-normal">نقطة</span>
                </span>
                <span className="text-[9px] text-blue-100 font-bold block">الترتيب الثاني على الدفعة</span>
              </div>

            </div>
          </section>

          {/* Progress Timeline and Data Graphs Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Steps Progress Timeline Widget (Simplified) */}
            <div className="bg-white rounded-2xl p-5 border border-[#c3c5d7]/50 shadow-xs flex flex-col justify-between">
              <h4 className="font-display text-[#151c27] text-sm font-bold mb-4 flex items-center gap-1.5 justify-start">
                <UserCheck className="w-4 h-4 text-[#15803d]" />
                <span>المسار والمستوى التعليمي الحالي</span>
              </h4>

              <div className="space-y-4 relative flex-grow pr-2">
                <div className="absolute right-[14px] top-3 bottom-3 w-0.5 bg-slate-100" />

                {/* Level 1 & 2 combined/completed */}
                <div className="relative flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#006c49] text-white flex items-center justify-center z-10 shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-right">
                    <p className="font-label text-xs text-[#006c49] font-bold">المستوى 1 و 2: التأسيس والدراسة</p>
                    <p className="font-sans text-[10px] text-[#434654]">تم اجتيازه بنجاح في ديسمبر 2025</p>
                  </div>
                </div>

                {/* Level 3 & 4 */}
                <div className="relative flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#15803d] text-white flex items-center justify-center z-10 shrink-0 shadow-xs ring-4 ring-[#dcfce7]">
                    <span className="font-display text-[10px] font-mono font-black">L4</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label text-xs text-[#15803d] font-extrabold">المستوى 4 الميداني: خادم تدريب متطور</p>
                    <p className="font-sans text-[10px] text-[#15803d] font-semibold">تحت إشراف معمل المحاكاة الميداني حالياً</p>
                  </div>
                </div>

                {/* Level 5 */}
                <div className="relative flex items-center gap-3 opacity-45">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center z-10 shrink-0 border border-slate-300">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-right">
                    <p className="font-label text-xs text-[#434654] font-bold">المستوى 5 النهائي: الخادم المحترف المعتمد</p>
                    <p className="font-sans text-[10px] text-[#737686]">مغلق بشكل مؤقت لحين استيفاء التقييم</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={onNavigateToPractical}
                className="mt-5 w-full py-2.5 bg-[#15803d] text-white hover:bg-[#166534] rounded-xl font-label text-[11px] font-bold active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>الذهاب فوراً للتقييم العملي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Performance column chart (Interactive Monthly Analyzer) */}
            <div className="bg-white rounded-2xl p-5 border border-[#c3c5d7]/50 shadow-xs flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h4 className="font-display text-[#151c27] text-sm font-bold flex items-center gap-1.5 justify-start">
                  <LineChart className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span>تحليل المستوى والتقدم الأخير</span>
                </h4>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">آخر 6 أشهر - اضغط للتحليل التفصيلي 📊</span>
              </div>

              {/* Informational tip */}
              <p className="text-[10px] text-slate-500 font-sans mb-3 text-right">
                💡 انقر فوق أي شهر بالأسفل لفتح تابة تقرير كاملة تستعرض منحنيات الأداء الستة ونقاط القوة والضعف المحددة لك.
              </p>

              {/* Minified layout for performance chart made fully interactive as button controls */}
              <div className="flex items-end justify-between h-32 border-b border-l border-slate-200 pb-2.5 px-2 relative bg-slate-50/50 rounded-xl p-2 mb-4">
                <div className="absolute inset-x-0 top-6 h-px bg-slate-100" />
                <div className="absolute inset-x-0 top-16 h-px bg-slate-100" />
                <div className="absolute inset-x-0 top-24 h-px bg-slate-100" />
                
                {/* bars with exact values and triggers */}
                {[
                  { key: "يناير", height: "h-12", value: "75%", label: "يناير" },
                  { key: "فبراير", height: "h-16", value: "80%", label: "فبراير" },
                  { key: "مارس", height: "h-10", value: "85%", label: "مارس" },
                  { key: "أبريل", height: "h-20", value: "90%", label: "أبريل" },
                  { key: "مايو", height: "h-14", value: "92%", label: "مايو" },
                  { key: "يونيو", height: "h-24", value: "98%", label: "يونيو" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(item.key);
                      onNotify(`📊 تم فتح بوابة التحليل المتقدم الدقيق لشهر (${item.key}) لمراجعة نقاط القوة والضعف والمنحنيات الستة.`);
                    }}
                    className={`flex flex-col items-center gap-1 w-9 group hover:scale-105 transition-all text-center focus:outline-none cursor-pointer ${
                      selectedMonth === item.key ? 'ring-2 ring-blue-500 rounded-lg p-0.5' : ''
                    }`}
                  >
                    <div className={`w-full bg-blue-200 group-hover:bg-blue-600 transition-all ${item.height} rounded-t-md relative flex items-end justify-center pb-1 shadow-3xs`}>
                      <span className="text-[7.5px] font-black text-blue-800 group-hover:text-white leading-none scale-90 block mb-0.5">{item.value}</span>
                    </div>
                    <span className={`text-[9.5px] font-bold font-label transition-colors ${
                      selectedMonth === item.key ? 'text-blue-700 font-extraboldUnderline' : 'text-slate-500 group-hover:text-blue-600'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-1 grid grid-cols-2 gap-2 text-right">
                <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="text-[9px] text-slate-400 font-label">معدل الدقة والسلوك المعتمد</p>
                  <p className="text-xs font-black text-blue-700">94% ممتاز تراكمي</p>
                </div>
                <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="text-[9px] text-slate-400 font-label">التقارير المكتملة المقبولة</p>
                  <p className="text-xs font-black text-blue-700">28 من 30 تقرير</p>
                </div>
              </div>

            </div>

          </section>

          {/* Condensed Active Tasks Grid Section */}
          <section className="space-y-3">
            <h4 className="font-display text-[#151c27] text-md font-bold flex items-center gap-1.5 justify-start">
              <ClipboardList className="w-5 h-5 text-[#15803d]" />
              <span>المهام العملية والميدانية النشطة حالياً</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Task 1 */}
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 p-4 hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-label">
                     مستمر ومفتوح
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans">تسليم: غداً</span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#151c27]">الإسعافات الأولية وتأمين المريض ذوي همم</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">تطبيق مناورة طوارئ الحركات اللاإرادية والتشنجات الحركية.</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[9px] text-slate-400 flex justify-between items-center">
                  <span>المشرف الفني: د. ماري</span>
                  <span className="text-emerald-600 font-bold">150 نقطة</span>
                </div>
              </div>

              {/* Task 2 */}
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 p-4 hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-label">
                     قفل القيد قريباً
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans">خلال 3 أيام</span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#151c27]">اختبار لغة الإشارة والقاموس الطبي</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">المحاكاة التطبيقية لترجمة التوجيهات الطفيفة للمريض الصم.</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[9px] text-slate-400 flex justify-between items-center">
                  <span>المشرف الفني: أ. ماريو</span>
                  <span className="text-purple-600 font-bold">100 نقطة</span>
                </div>
              </div>

              {/* Submit Custom Research Request Widget */}
              <button
                onClick={handleCreateRequest}
                disabled={requestSubmitted}
                className={`rounded-xl border border-dashed p-4 text-right flex flex-col justify-between transition-all cursor-pointer h-full border-[#15803d]/30 ${
                  requestSubmitted ? 'bg-slate-50/50 opacity-80 cursor-default' : 'hover:bg-slate-50/70 bg-white'
                }`}
              >
                <div>
                  <div className="w-7 h-7 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0 mb-2">
                    {requestSubmitted ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <h4 className="font-display font-extrabold text-xs text-[#151c27]">
                    {requestSubmitted ? 'تم تسجيل طلب الإضافة' : 'طلب بحث/مشروع ميداني'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">
                    {requestSubmitted ? 'قيد التدقيق والاعتماد السريع مسبقاً' : 'قدم طلباً سريعاً للمشرف لإعداد بحث روحي للتقييم الإضافي.'}
                  </p>
                </div>
                <span className="text-[9px] text-slate-400 block mt-2 pt-2 border-t border-slate-100">فريق الدعم الفني</span>
              </button>

            </div>
          </section>

        </div>
      )}

      {/* SUB-TAB VIEW 2: Rankings & Rewards Center (Condensed & Beautiful) */}
      {subTab === 'ranking' && (
        <div className="space-y-6">

          {/* Approved Tech Service Levels and Grades Guide requested by user */}
          <section className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-blue-500/10 rounded-3xl p-5 border border-slate-200 shadow-xs text-right space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 border-b border-slate-150 pb-3">
              <div className="flex items-center gap-2 text-right">
                <span className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </span>
                <div>
                  <h3 className="font-display font-black text-sm text-[#151c27]">دليل مستويات الخدمة المعتمدة وعتبات النقاط والدرجات لكل تصنيف</h3>
                  <p className="text-[10px] text-slate-500 font-sans">تدرج في مراتب الشرف الخدمية بحسب النقاط الخاصة للتقييم الأكاديمي والعملي الميداني</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-black font-label animate-pulse shrink-0">
                ⭐ رصيدك التراكمي الفعلي: {grandTotalScore} نقطة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
              
              {/* Level 1 */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-150 shadow-2xs space-y-2 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-bl-lg text-[9px] font-bold">L1-L2</div>
                <div>
                  <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded-md font-bold block w-fit mb-1.5">مبتدئ</span>
                  <h4 className="font-display font-bold text-xs text-slate-800">تأسيسي وملاحظة</h4>
                  <p className="text-[10px] text-slate-450 font-sans leading-relaxed mt-1">حضور لجان المشاهدة والمحاكاة لملائكة الرعاية.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400">الدرجات المطلوبة</span>
                  <span className="font-bold text-slate-700">0 - 500 نقطة</span>
                </div>
              </div>

              {/* Level 2 */}
              <div className="bg-white p-3.5 rounded-2xl border border-blue-150 shadow-2xs space-y-2 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-bl-lg text-[9px] font-bold">L3</div>
                <div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold block w-fit mb-1.5">متمرس</span>
                  <h4 className="font-display font-bold text-xs text-blue-900">خادم نشط ميداني</h4>
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed mt-1">مرافقة الحالات وتعديل استمارات الحالة وتقارير الصرف الفني.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-blue-400">الدرجات المطلوبة</span>
                  <span className="font-bold text-blue-600">501 - 1200 نقطة</span>
                </div>
              </div>

              {/* Level 3 */}
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-150 shadow-2xs space-y-2 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-bl-lg text-[9px] font-bold">L4</div>
                <div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-750 px-2 py-0.5 rounded-md font-bold block w-fit mb-1.5">متميز</span>
                  <h4 className="font-display font-bold text-xs text-indigo-950">أخصائي متطور</h4>
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed mt-1">اجتياز لغة الإشارة والتعامل الفني السلوكي لغرفة الرعاية.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-indigo-400">الدرجات المطلوبة</span>
                  <span className="font-bold text-indigo-600">1201 - 2200 نقطة</span>
                </div>
              </div>

              {/* Level 4 */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-2 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 bg-amber-100 text-amber-750 px-2 py-0.5 rounded-bl-lg text-[9px] font-bold">L5</div>
                <div>
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold block w-fit mb-1.5">ذهبي بونص</span>
                  <h4 className="font-display font-bold text-xs text-amber-900">أخصائي معتمد ممتاز</h4>
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed mt-1">إبرام خطط دمج الرعاية، الحصول على بونص مالي وخصومات كبرى.</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-amber-500 font-bold">الدرجات المطلوبة</span>
                  <span className="font-bold text-amber-600">2201 - 3200 نقطة</span>
                </div>
              </div>

              {/* Level 5 */}
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white p-3.5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 bg-white/20 text-white px-2 py-0.5 rounded-bl-lg text-[9px] font-bold">الشرف</div>
                <div>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold block w-fit mb-1.5">سفير الخدمة</span>
                  <h4 className="font-display font-bold text-xs text-white">سفير الملائكة العام</h4>
                  <p className="text-[10px] text-amber-100 font-sans leading-relaxed mt-1">المتابعة الكلية للخدام، تكريم الأوائل بالمهرجان المعظم، ومنح خارجية.</p>
                </div>
                <div className="pt-2 border-t border-white/20 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/60">الدرجات المطلوبة</span>
                  <span className="font-bold text-yellow-200">3201+ نقطة</span>
                </div>
              </div>

            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Ranks and active Level Guide card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col justify-between text-right">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 text-[#151c27] font-display font-extrabold text-xs flex items-center gap-2 justify-start">
                <Star className="w-4 h-4 text-amber-550 text-amber-500 animate-pulse" />
                <span>نظام وترقيات مراتب الشرف وتصنيف خادم</span>
              </div>
              
              <div className="p-0 divide-y divide-slate-100 flex-grow text-xs">
                {RANK_LEVELS.map((rank) => {
                  const isActive = rank.isActive;
                  return (
                    <div 
                      key={rank.id}
                      className={`p-3 transition-colors flex items-center justify-between ${
                        isActive ? 'bg-[#dcfce7]/80 font-semibold' : 'bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-2xs"
                          style={{ backgroundColor: rank.bgClass }}
                        >
                          {isActive ? '★' : '☆'}
                        </div>
                        <div>
                          <p className="font-display font-bold text-[#151c27] flex items-center gap-1.5">
                            {rank.levelName}
                            {isActive && (
                              <span className="bg-[#15803d] text-white text-[9px] px-1.5 py-0.5 rounded-md font-label font-bold">
                                مستواك الفعلي
                              </span>
                            )}
                          </p>
                          <p className="font-sans text-[10px] text-slate-400">{rank.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#15803d] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                        {rank.pointsRange}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 text-[9px] text-slate-400 font-sans text-center">
                تتم الترقية تلقائياً بنظام الحصص بمجرد كسب وإضافة النقاط والامتحانات.
              </div>
            </div>

            {/* Section completion progress cards */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between text-right">
              <div>
                <h4 className="font-display text-sm font-bold text-[#151c27] mb-4 pb-1.5 border-b border-slate-150 flex items-center gap-1.5 justify-start">
                  <ListOrdered className="w-4 h-4 text-[#15803d]" />
                  <span>نسب إتمام الأقسام والبرامج الكرتونية</span>
                </h4>
                
                <div className="space-y-3">
                  {SECTION_COMPLETION.map((sec) => (
                    <div key={sec.name}>
                      <div className="flex justify-between text-[11px] font-label font-bold mb-1 text-[#151c27]">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] grayscale">📌</span>
                          {sec.name}
                        </span>
                        <span className="font-mono">{sec.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${sec.percentage}%`,
                            backgroundColor: sec.color
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-label text-slate-400 font-bold">التقدم التراكمي الشامل لكافة المسارات</span>
                <span className="font-display font-black text-sm text-[#15803d] bg-slate-100 px-2.5 py-1 rounded-lg">72% مكتمل</span>
              </div>
            </div>

          </div>

          {/* Combined Rewards Center section (Condensed and clear) */}
          <section className="space-y-3 bg-slate-50/50 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center gap-1.5 justify-start">
              <span className="p-1 w-6 h-6 bg-[#15803d]/10 text-[#15803d] rounded flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-display font-black text-sm text-[#151c27]">
                  مركز مكافآت وبونص الأوائل والمراكز المتصدرة
                </h4>
                <p className="text-[10px] text-slate-400 font-sans">
                  متاحة على رصيدك من النقاط التراكمية. يتم صرف الرموز تلقائياً.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* Prize 1 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">3000 نقطة مدمجة</span>
                    <span className="text-[10px] text-[#15803d] font-bold">المركز الأول</span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#151c27] flex items-center gap-1 justify-start">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>رحلة سبيشيال للقاهرة الكبرى</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-sans mt-1">رحلة طيران تفصيلية شامل الاستضافة ومزارات متميزة للخدام.</p>
                </div>
                <button
                  onClick={() => handleClaimReward('رحلة طيران معالم القاهرة الكبرى', 3000)}
                  className="mt-3 w-full py-1.5 bg-[#15803d] text-white hover:bg-[#166534] rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  صرف كوبون الحجز
                </button>
              </div>

              {/* Prize 2 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">2500 نقطة مدمجة</span>
                    <span className="text-[10px] text-[#006c49] font-bold">المركز الثاني</span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#151c27] flex items-center gap-1 justify-start">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رحلة مدنية الثلج الكبرى الترفيهية</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-sans mt-1">يوم مجاني فاخر كامل شامل المغامرات لتشجيع أداء الخدمة.</p>
                </div>
                <button
                  onClick={() => handleClaimReward('رحلة مدينة الثلج الكبرى', 2500)}
                  className="mt-3 w-full py-1.5 bg-[#15803d] text-white hover:bg-[#166534] rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  صرف الرمز الكوبوني
                </button>
              </div>

              {/* Prize 3 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">2000 نقطة مدمجة</span>
                    <span className="text-[10px] text-orange-650 font-bold">المركز الثالث</span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#151c27] flex items-center gap-1 justify-start">
                    <Utensils className="w-3.5 h-3.5 text-orange-600" />
                    <span>وجبة عشاء فاخرة لشخصين</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-sans mt-1">حجز مميز في مطعم راق كنسي بوسط العاصمة تقديراً لخدمتك.</p>
                </div>
                <button
                  onClick={() => handleClaimReward('وجبة عشاء لشخصين بوسط العاصمة', 2000)}
                  className="mt-3 w-full py-1.5 bg-[#15803d] text-white hover:bg-[#166534] rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  تأكيد وقفل دعوة الحجز
                </button>
              </div>

            </div>
          </section>

        </div>
      )}

    </div>
  );
}
