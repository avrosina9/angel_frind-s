/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ACTIVE_EXAMS_DATA, UPCOMING_EXAMS, SCORE_HISTORY, USER_PROFILE } from '../data';
import { ActiveExam, ScoreHistoryItem, UserProfile } from '../types';
import EducationalTasksView from './EducationalTasksView';
import { 
  Trophy, 
  BookOpen, 
  GraduationCap, 
  Compass, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Bookmark, 
  ChevronLeft, 
  Timer, 
  Share2, 
  TrendingUp, 
  BookMarked,
  MessageSquare,
  Smartphone,
  Check,
  Send,
  X,
  Bell,
  AlertCircle
} from 'lucide-react';

interface ExamsViewProps {
  onStartExam: (exam: ActiveExam) => void;
  scoreHistoryState: ScoreHistoryItem[];
  onNotify: (message: string) => void;
  onChangeTab?: (tab: 'materials' | 'exams' | 'dashboard' | 'practical' | 'achievements' | 'registration' | 'discounts' | 'admin') => void;
}

export default function ExamsView({ 
  onStartExam, 
  scoreHistoryState, 
  onNotify,
  onChangeTab 
}: ExamsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('الجميع');
  const [subTab, setSubTab] = useState<'exams' | 'tasks'>('exams');
  const categoriesList = ['الجميع', 'القسم الروحي', 'مواد مهارية', 'قسم الاعاقة', 'القسم العام', 'مسابقة كنز الرحمة'];

  // Auto-start exam if selected in study materials
  useEffect(() => {
    const selectedId = localStorage.getItem('angels_selected_exam_id');
    if (selectedId) {
      const savedExams = localStorage.getItem('angels_exams_list_v2');
      if (savedExams) {
        try {
          const list = JSON.parse(savedExams);
          const targetExam = list.find((e: any) => e.id === selectedId);
          if (targetExam) {
            onStartExam(targetExam);
          }
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.removeItem('angels_selected_exam_id');
    }
  }, [onStartExam]);

  // Dynamic Vital Stats Calculation based on solved exams from scoreHistoryState
  const calculateCategoryStats = (categoryName: string) => {
    const items = scoreHistoryState.filter(item => {
      if (categoryName === 'الجميع') return true;
      return item.category === categoryName || 
             (categoryName === 'القسم العام' && item.category?.includes('عام')) ||
             (categoryName === 'قسم الاعاقة' && item.category?.includes('اعاقة')) ||
             (categoryName === 'مواد مهارية' && item.category?.includes('مهار'));
    });

    if (items.length === 0) {
      return { percentage: 'قيد الدراسة 📚', status: 'جاري البدء', color: 'bg-amber-50 text-amber-800' };
    }
    const sum = items.reduce((acc, curr) => acc + curr.achievedScore, 0);
    const avg = Math.round(sum / items.length);
    
    let status = 'مقبول';
    let color = 'bg-slate-50 text-slate-700';
    if (avg >= 90) {
      status = 'ممتاز جداً 🌟';
      color = 'bg-emerald-100 text-emerald-800';
    } else if (avg >= 80) {
      status = 'جيد جداً 👍';
      color = 'bg-emerald-50 text-emerald-700';
    } else if (avg >= 65) {
      status = 'جيد 🤝';
      color = 'bg-sky-50 text-sky-700';
    } else if (avg >= 50) {
      status = 'مقبول / ناجح ✅';
      color = 'bg-indigo-50 text-indigo-700';
    } else {
      status = 'يحتاج لإعادة ⚠️';
      color = 'bg-rose-50 text-rose-800';
    }

    return { percentage: `${avg}%`, status, color };
  };

  const spiritualStats = calculateCategoryStats('القسم الروحي');
  const spiritualStatsFixed = calculateCategoryStats('القسم الروحي');
  const skillStats = calculateCategoryStats('مواد مهارية');
  const disabilityStats = calculateCategoryStats('قسم الاعاقة');
  const generalStats = calculateCategoryStats('القسم العام');
  const contestStats = calculateCategoryStats('مسابقة كنز الرحمة');

  // Dynamic state list synced with localStorage for Exams
  const [examsList, setExamsList] = useState<ActiveExam[]>(() => {
    const saved = localStorage.getItem('angels_exams_list_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ACTIVE_EXAMS_DATA.map((exam, idx) => ({
      ...exam,
      publishDate: exam.publishDate || '2026-06-01',
      expireDate: exam.expireDate || '2026-08-31'
    }));
  });

  useEffect(() => {
    localStorage.setItem('angels_exams_list_v2', JSON.stringify(examsList));
  }, [examsList]);

  // Current logged in user profile descriptor
  const [sessionUser, setSessionUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('angels_user_profile_v1');
    return saved ? JSON.parse(saved) : USER_PROFILE;
  });

  // WhatsApp reminder toggle states
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('angels_whatsapp_reminders');
    return saved !== 'false';
  });

  // Guide Chat state variables
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', sender: 'advisor', text: 'سلام بركة ونعمة يا ابني الحبيب! أنا متواجد لمساعدتك وإرشادك طوال مسيرتك الخدمية بمؤسسة أصدقاء الملائكة. ⛪', time: '10:00 ص' },
    { id: '2', sender: 'advisor', text: 'بخصوص التحضيرات، يفضل أن تقوم بقراءة المراجعة السريعة ومجموع المحاضرات لمدة 15 ثانية على الأقل، وسيوجهك التطبيق فورياً لدخول الاختبار لتأكيد معلوماتك الحيوية.', time: '10:01 ص' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Load study materials progress from localStorage
  const getSubjectProgress = (category: string): number => {
    const saved = localStorage.getItem('angels_subjects_list_v1');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        let targetTagType = '';
        if (category === 'القسم الروحي') targetTagType = 'spiritual';
        else if (category === 'مواد مهارية') targetTagType = 'orbital';
        else if (category === 'قسم الاعاقة') targetTagType = 'disability';
        else if (category === 'القسم العام') targetTagType = 'general';
        else if (category === 'مسابقة كنز الرحمة') targetTagType = 'contests';

        const match = list.find((s: any) => s.tagType === targetTagType);
        return match ? match.progress : 0;
      } catch (e) {}
    }
    return 30; // Starter threshold
  };

  // Check if an exam is solved
  const getExamSolutionStatus = (examId: string) => {
    // Match by exam title in the history
    const matchedExam = examsList.find(e => e.id === examId);
    if (!matchedExam) return null;
    return scoreHistoryState.find(h => h.subjectName === matchedExam.title);
  };

  // Helper date checker inside simulated 2026 current times
  const getExamDateStatus = (exam: ActiveExam) => {
    const todayStr = '2026-06-25'; // Fixed simulated operational date representing 2026 app lifecycle
    const pub = exam.publishDate || '2026-06-01';
    const exp = exam.expireDate || '2026-08-31';

    if (todayStr < pub) {
      return { status: 'not-published', message: `🔒 مقفل: متاح للنشر بدءاً من ${pub}` };
    }
    if (todayStr > exp) {
      return { status: 'expired', message: `❌ معطل: انتهت صلاحية التقديم بتاريخ ${exp}` };
    }
    return { status: 'active', message: `🗓️ متاح ومنشور حتى ${exp}` };
  };

  // Filter current active exams based on tab choice
  const displayedExams = activeCategory === 'الجميع'
    ? examsList
    : examsList.filter(
        (exam) => exam.category === activeCategory
      );

  // Dynamic calculations for solved/unsolved exams in activeCategory
  const solvedExamsInCategory = displayedExams.filter(e => getExamSolutionStatus(e.id) !== undefined);
  const unsolvedExamsInCategory = displayedExams.filter(e => getExamSolutionStatus(e.id) === undefined);

  // All active exams overall solved vs unsolved count
  const allSolvedExams = examsList.filter(e => getExamSolutionStatus(e.id) !== undefined);
  const allUnsolvedExams = examsList.filter(e => getExamSolutionStatus(e.id) === undefined);

  // Toggle WhatsApp reminds
  const handleToggleWhatsApp = () => {
    const nextVal = !whatsappEnabled;
    setWhatsappEnabled(nextVal);
    localStorage.setItem('angels_whatsapp_reminders', String(nextVal));
    if (nextVal) {
      onNotify('🟢 تم تفعيل التذكير التلقائي بالامتحانات عبر الواتساب بنجاح. ستصلك رسالة تذكيرية كل يومين.');
    } else {
      onNotify('🔴 تم إيقاف منبه الواتساب مؤقتاً.');
    }
  };

  // Send interactive mock WhatsApp message
  const handleSendTrialWhatsApp = () => {
    const phoneNum = sessionUser.phone || '01234567890';
    const unsolvedTitles = allUnsolvedExams.map(e => `[${e.title}]`).slice(0, 3).join('، ');
    const displayTitles = unsolvedTitles ? `وهي: ${unsolvedTitles}` : 'لا يوجد مهام معلقة في حسابك';
    
    onNotify(`💬 تم إرسال رسالة تذكير تلقائية بنجاح من الرقم المعتمد (01222785777) إلى رقم الواتساب الخاص بك (${phoneNum}):\n"أهلاً بك يا ${sessionUser.fullName}! نود تذكيرك بوجود [${allUnsolvedExams.length}] اختبارات معلقة بالمنصة، ${displayTitles}. يرجى حلها للحفاظ على التقييم وبونص النشاط الميداني."`);
  };

  // Send a custom chat message to the counselor/advisor
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: chatMessage,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setIsTyping(true);

    // Simulate instant supportive guide feedback
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
         `باركك الرب يا ابني الحبيب! سؤالك معبر جداً عن وعيك الروحي. سأقوم بمراجعة ${activeCategory} معك ومتابعة نشاطك بالقداس والافتقاد. واصل الدراسة والحل! ✨`,
         `مرحباً بني، بجهودك الطاهر وعزيمتك ستكمل كافة كراسات الدراسة والاختبارات بنجاح. أنا دائماً بجانبك لتبسيط لغة الإشارة وطرق رعاية ملاكنا الصغير. 🌱`,
         `أنا فخور بنشاطك يا خادم الرب المتميز! درجاتك ممتازة، بخصوص الملاحظات الميدانية لا تقلق سنعالجها سوياً في معسكر التأهيل القادم. 🕊️`
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      
      setChatHistory(prev => [...prev, {
        id: String(Date.now() + 1),
        sender: 'advisor',
        text: randomReply,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* Tab Switcher: Exams vs Educational Tasks */}
      <div className="flex bg-slate-100 rounded-xl p-1 max-w-md mx-auto shadow-xs border border-slate-200">
        <button
          onClick={() => {
            setSubTab('exams');
            onNotify('📋 تم الانتقال إلى مركز الاختبارات والتقييمات الفعلي.');
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'exams'
              ? 'bg-[#15803d] text-white shadow-sm'
              : 'text-slate-600 hover:text-emerald-800'
          }`}
        >
          <span>📋 بنك الاختبارات والتقييمات</span>
        </button>
        <button
          onClick={() => {
            setSubTab('tasks');
            onNotify('♿ تم الانتقال إلى دليل المهام التعليمية لذوي الاحتياجات الخاصة.');
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'tasks'
              ? 'bg-[#15803d] text-white shadow-sm'
              : 'text-slate-600 hover:text-emerald-800'
          }`}
        >
          <span>♿ المهام والبرامج التعليمية</span>
        </button>
      </div>

      {subTab === 'tasks' ? (
        <EducationalTasksView onNotify={onNotify} />
      ) : (
        <>
          {/* Category Navigation - High Fidelity tabs matching screenshots */}
          <div className="bg-white rounded-xl border border-[#c3c5d7]/40 p-1 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex gap-1 md:gap-4 justify-between">
          {categoriesList.map((category) => {
            const isActive = activeCategory === category;
            let emoji = "💎";
            if (category === 'الجميع') emoji = "📋";
            else if (category === 'القسم الروحي') emoji = "⛪";
            else if (category === 'مواد مهارية') emoji = "⚙️";
            else if (category === 'قسم الاعاقة') emoji = "♿";
            else if (category === 'القسم العام') emoji = "🌍";
            else if (category === 'مسابقة كنز الرحمة') emoji = "🏆";
            return (
              <button
                key={category}
                id={`cat-btn-${category}`}
                onClick={() => setActiveCategory(category)}
                className={`px-4 md:px-6 py-3 rounded-lg text-xs md:text-sm font-label font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#15803d] text-white shadow-sm'
                    : 'text-[#434654] hover:text-[#15803d] hover:bg-slate-50'
                }`}
              >
                <span className="text-sm">{emoji}</span>
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Welcome & Stats Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-2xl border border-[#c3c5d7]/50 shadow-sm" id="welcome-stats-row">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#151c27] mb-2">مركز الاختبارات والمهام</h2>
          <p className="font-sans text-md text-[#434654] max-w-[620px]">
            تابع تقدمك التدريجي والمعرفي، خض الاختبارات التقييمية لمسارك الحالي، وراجع درجات تحصيلك العلمي بدقة.
          </p>
        </div>

        {/* User Level Header Badge Widget */}
        <div className="bg-slate-50 border border-[#c3c5d7] rounded-xl p-4 flex items-center gap-4 shadow-sm self-start lg:self-center shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#15803d]">
            <img src={sessionUser.avatarUrl} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="text-right">
            <span className="bg-yellow-400 text-black px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block mb-1 font-label shadow-sm">
              {sessionUser.level || 'خادم متميز'}
            </span>
            <p className="font-display font-bold text-md text-[#151c27]">{sessionUser.fullName}</p>
            <div className="flex items-center gap-1 text-xs text-[#15803d] font-bold mt-0.5">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>{sessionUser.points || 2450} نقطة تقييم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active & Solved vs Remaining Counters Panel */}
      <div className="bg-emerald-50 border border-emerald-200/60 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4" id="exams-summary-counters">
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
            {examsList.length}
          </div>
          <div>
            <h5 className="font-display font-bold text-xs text-slate-800">إجمالي الاختبارات المقررة</h5>
            <span className="text-[10px] text-slate-500">مجموع المقررات والمسابقات التربوية والروحية بالمنصة</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border-r-4 border-sky-500">
          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-black shrink-0">
            {allSolvedExams.length}
          </div>
          <div>
            <h5 className="font-display font-bold text-xs text-sky-800">الاختبارات التي تم حلها وحفظها</h5>
            <span className="text-[10px] text-sky-600 font-bold">الدرجة المحسوبة مرصودة (العدد: {allSolvedExams.length})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border-r-4 border-amber-400">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black shrink-0">
            {allUnsolvedExams.length}
          </div>
          <div>
            <h5 className="font-display font-bold text-xs text-amber-800">الاختبارات المتبقية التي لم تحل</h5>
            <span className="text-[10px] text-amber-600 font-bold">بانتظار قراءتك وجهادك (العدد: {allUnsolvedExams.length})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Exam Cards & Stats Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Selected Exams List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-display text-lg font-bold text-[#151c27] flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#15803d]" />
            مجلد الاختبارات الفعلي - {activeCategory}
          </h3>

          {displayedExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="exams-cards-grid">
              {displayedExams.map((exam) => {
                const solution = getExamSolutionStatus(exam.id);
                const isSolved = solution !== undefined;
                const dStatus = getExamDateStatus(exam);
                
                return (
                  <div
                    key={exam.id}
                    id={`exam-card-${exam.id}`}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-all flex flex-col justify-between ${
                      isSolved ? 'border-sky-300 ring-2 ring-sky-100' : 'border-[#c3c5d7]/50'
                    }`}
                  >
                    {/* Visual Card Header */}
                    <div className={`h-28 relative flex items-center justify-between px-5 py-4 ${
                      isSolved ? 'bg-sky-50' : 'bg-slate-50'
                    }`}>
                      <div className="text-right">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-xs mb-1.5 inline-block ${
                          isSolved ? 'bg-sky-500 text-white' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSolved ? '✓ تم الحل مسبقاً' : '⏳ لم يُحل بعد'}
                        </span>
                        <h4 className="font-display font-bold text-xs text-[#151c27] line-clamp-2">{exam.title}</h4>
                      </div>
                      
                      {/* Big Icon, colored dynamically: Blue under solve, Yellow under unsolved */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        isSolved ? 'bg-sky-600 text-white shadow-md' : 'bg-amber-400 text-slate-900 shadow-xs'
                      }`}>
                        {isSolved ? <CheckCircle className="w-6 h-6" /> : <Bookmark className="w-5 h-5" />}
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-[#434654] font-sans leading-relaxed mb-4 line-clamp-2">
                          {exam.description}
                        </p>

                        {/* Date limits & alerts */}
                        <div className="bg-indigo-50/50 rounded-xl p-2.5 border border-indigo-100 mb-4 text-right space-y-1">
                          <p className="font-sans text-[10px] font-semibold text-indigo-950 flex items-center gap-1.5 justify-end">
                            <span>{dStatus.message}</span>
                            <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                          </p>
                          <div className="flex justify-between text-[9px] text-[#737686] font-mono">
                            <span>انتهاء: {exam.expireDate}</span>
                            <span>بدء: {exam.publishDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-label border-t border-slate-100 pt-3">
                          <span className="text-[#434654] flex items-center gap-1">
                            <HelpCircle className="w-4 h-4 text-slate-400" />
                            {exam.questionsCount || 5} أسئلة تقييمية
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isSolved ? 'bg-sky-100 text-sky-800' : 'bg-slate-150 text-slate-700 bg-slate-100'
                          }`}>
                            {isSolved ? `النتيجة: ${solution?.achievedScore} / ${solution?.maxScore}` : 'التقييم: 50 درجة'}
                          </span>
                        </div>

                        {(() => {
                          const progress = getSubjectProgress(exam.category);
                          const isLocked = progress === 0;

                          if (isLocked) {
                            return (
                              <div className="space-y-2 pt-1">
                                <span className="text-[10px] font-bold text-rose-600 block text-center leading-relaxed">
                                  🔒 مغلق: يرجى مطالعة وفهم كراسات المادة أولاً
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onNotify('💡 تم توجيهك فوراً لمطالعة كراسات المادة العلمية لتنشيط الامتحان وتفعيله.');
                                    onChangeTab?.('materials');
                                  }}
                                  className="w-full bg-slate-100 hover:bg-amber-50 text-amber-800 py-3 rounded-xl font-label text-xs font-bold flex items-center justify-center gap-1 border border-amber-300/40 transition-colors"
                                >
                                  قم بالدراسة حتى تفتح المهمة 🔒
                                </button>
                              </div>
                            );
                          }

                          const isRestrictedByDate = dStatus.status !== 'active';

                          return (
                            <div className="space-y-2 pt-1">
                              <span className="text-[10px] font-bold text-emerald-600 block text-center leading-relaxed">
                                🔓 متاح للأعضاء المستوفين الفوز بالبونص
                              </span>
                              <button
                                onClick={() => {
                                  if (isRestrictedByDate) {
                                    onNotify(`⚠️ عفواً، لا يمكن بدء هذا الامتحان حالياً نظراً لحدود النشر الزمنية: ${dStatus.message}`);
                                    return;
                                  }
                                  onStartExam(exam);
                                }}
                                className={`w-full py-3 rounded-xl font-label text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1 cursor-pointer ${
                                  isRestrictedByDate 
                                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                    : isSolved 
                                      ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                                      : 'bg-[#15803d] hover:bg-[#166534] text-white'
                                }`}
                                disabled={false} // Allow clicking for helpful toast popup if clicked, rather than a hard lock
                              >
                                {isRestrictedByDate ? 'انتهت الصلاحية أو غير منشور 🔒' : isSolved ? 'خوض الامتحان مجدداً لتحسين الدرجة' : 'بدء الاختبار الآن'}
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-8 text-center text-[#434654] font-sans">
              <Compass className="w-8 h-8 text-[#737686] mx-auto mb-3" />
              لا تتوفر اختبارات تقييمية نشطة لـ <strong className="text-[#151c27]">{activeCategory}</strong> في الوقت الحالي. مراجعتك مستمرة.
            </div>
          )}
        </div>

        {/* Sidebar Widgets: Vital stats, WhatsApp remeinder, and Oral Exam scheduled */}
        <div className="space-y-6">
          
          {/* Automatic WhatsApp Reminder Panel */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm border-emerald-300/70" id="whatsapp-reminders-box">
            <div className="flex justify-between items-center mb-4 border-b border-emerald-50 pb-2">
              <h4 className="font-display font-black text-sm text-[#151c27] flex items-center gap-1.5">
                <Smartphone className="text-emerald-500 w-4 h-4" />
                <span>إشعار الواتساب التلقائي</span>
              </h4>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                whatsappEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {whatsappEnabled ? 'مفعل 🟢' : 'معطل 🔴'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              إضافة تذكير آلي مبرمج يرسل تنبيهاً لرقم هاتفك <strong className="font-mono text-emerald-700">{sessionUser.phone || '01234567890'}</strong> من رقم الخدمة المعتمد <strong className="font-mono text-emerald-700">01222785777</strong> كل يومين للتذكير بالاختبارات المتبقية التي لم تحل، وتتوقف الرسائل فوراً بمجرد إكمال حل المهام.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleToggleWhatsApp}
                className={`w-full py-2.5 rounded-xl font-label text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  whatsappEnabled 
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300/40' 
                    : 'bg-emerald-600 hover:bg-emerald-750 hover:bg-emerald-700 text-white'
                }`}
              >
                {whatsappEnabled ? 'إيقاف منبه الواتساب مؤقتاً ' : 'تفعيل المنبه المجدول عبر WhatsApp ✓'}
              </button>

              <button
                type="button"
                onClick={handleSendTrialWhatsApp}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                📨 إرسال رسالة تذكير تجريبية الآن
              </button>
            </div>
          </div>

          {/* VITAL STATISTICS TABLES (تفعيل جداول الإحصائيات الحيوية) */}
          <div className="bg-white border border-[#c3c5d7]/60 rounded-2xl p-5 shadow-sm" id="vital-stats-tables-box">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h4 className="font-display font-bold text-sm text-[#151c27] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>جدول الإحصائيات الحيوية 📊</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">للحديثين</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-2 font-bold text-slate-700 text-right">الفئة ومستوى التحصيل المادة</th>
                    <th className="p-2 font-bold text-slate-700">درجة الفهم</th>
                    <th className="p-2 font-bold text-slate-700">التقييم الحيوي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <tr>
                    <td className="p-2 text-slate-800 text-right font-medium">الاستيعاب والفهم الروحي</td>
                    <td className="p-2 text-emerald-700 font-bold">{spiritualStatsFixed.percentage}</td>
                    <td className="p-2"><span className={`${spiritualStatsFixed.color} px-2 py-0.5 rounded text-[9px] font-bold`}>{spiritualStatsFixed.status}</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-800 text-right font-medium">التمكين والتحصيل المهاراتي</td>
                    <td className="p-2 text-sky-700 font-bold">{skillStats.percentage}</td>
                    <td className="p-2"><span className={`${skillStats.color} px-2 py-0.5 rounded text-[9px] font-bold`}>{skillStats.status}</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-800 text-right font-medium">الدمج وفهم لغة الإشارة</td>
                    <td className="p-2 text-indigo-700 font-bold">{disabilityStats.percentage}</td>
                    <td className="p-2"><span className={`${disabilityStats.color} px-2 py-0.5 rounded text-[9px] font-bold`}>{disabilityStats.status}</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-800 text-right font-medium">الإسعافات والسلامة العامة</td>
                    <td className="p-2 text-amber-700 font-bold">{generalStats.percentage}</td>
                    <td className="p-2"><span className={`${generalStats.color} px-2 py-0.5 rounded text-[9px] font-bold`}>{generalStats.status}</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-800 text-right font-medium">مسابقة كنز الرحمة والأنشطة</td>
                    <td className="p-2 text-purple-700 font-bold">{contestStats.percentage}</td>
                    <td className="p-2"><span className={`${contestStats.color} px-2 py-0.5 rounded text-[9px] font-bold`}>{contestStats.status}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming scheduled list */}
          <div className="bg-white border border-[#c3c5d7]/60 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h4 className="font-display font-bold text-sm text-[#151c27]">الاختبارات الشفهية والمقابلات</h4>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {UPCOMING_EXAMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${item.platformIconBg} flex items-center justify-center shrink-0`}>
                      <span className="text-xs font-extrabold">{item.icon === 'stars' ? '★' : '📊'}</span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs text-[#151c27]">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">{item.platform} • {item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* History Scores Table Section with High Fidelity and Exact Match */}
      <div className="bg-white rounded-2xl border border-[#c3c5d7]/60 overflow-hidden shadow-sm" id="scores-history-panel">
        <div className="bg-[#dcfce7] p-4 font-display font-extrabold text-[#15803d] text-md flex items-center justify-between">
          <span>بيان الدرجات المكتسبة والموثقة - {activeCategory}</span>
          <BookOpen className="w-5 h-5" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#c3c5d7]/40 font-label text-xs font-bold text-[#151c27]">
                <th className="p-4">اسم المادة / الاختبار الرئيسي</th>
                <th className="p-4">تاريخ الإكمال</th>
                <th className="p-4">الدرجة النهائية</th>
                <th className="p-4">الدرجة المحققة</th>
                <th className="p-4">التقييم الفعلي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-sm">
              {scoreHistoryState.filter(item => activeCategory === 'الجميع' || item.category === activeCategory).length > 0 ? (
                scoreHistoryState.filter(item => activeCategory === 'الجميع' || item.category === activeCategory).map((item, index) => {
                  const percent = Math.round((item.achievedScore / item.maxScore) * 100);
                  const isPassed = percent >= 50;
                  return (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="p-4 font-semibold text-[#151c27] text-right pr-6">{item.subjectName}</td>
                      <td className="p-4 text-slate-500">{item.date}</td>
                      <td className="p-4 font-semibold">{item.maxScore}</td>
                      <td className={`p-4 font-extrabold ${isPassed ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                        {item.achievedScore}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-[10px] font-bold font-label ${
                          isPassed ? 'bg-[#6ffbbe] text-[#00714d]' : 'bg-[#ffdad6] text-[#93000a]'
                        }`}>
                          {isPassed ? 'ناجح' : 'لم ينجح'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                    لا تتوفر درجات سابقة مرصودة لفئة {activeCategory}. سارع بتجريب اختبارك الأول لتوطين علاماتك!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Resource Callout Box in Green ( تحتاج مساعدة في التحضير؟ ) */}
      <section className="relative bg-[#15803d] rounded-3xl p-6 md:p-10 overflow-hidden flex flex-col md:flex-row items-center gap-8 text-white shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 md:w-1/2 text-right">
          <h3 className="font-display font-extrabold text-2xl md:text-3xl mb-4 text-[#ffffff]">تحتاج مساعدة في التحضير؟</h3>
          <p className="font-sans text-md mb-6 opacity-90 leading-relaxed text-slate-105">
            قم بزيارة مكتبة الموارد الخاصة بنا للحصول على أدلة دراسية ميسرة وفيديوهات توضيحية شاملة ونماذج مراجعات كنسية لمساعدتك في الحصول على التقييم الأقصى.
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                onNotify('💡 تم توجيهك فوراً لمطالعة كراسات المادة العلمية ومقاطع التدريب.');
                onChangeTab?.('materials');
              }}
              className="bg-white text-[#15803d] px-5 py-3 rounded-xl font-label text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              استكشف المواد الدراسية ✓
            </button>
            <button 
              onClick={() => {
                setShowChatModal(true);
                onNotify('💬 تم فتح نافذة المحادثة الفورية مع مرشد وأدمن المنصة.');
              }}
              className="border border-white/40 text-white bg-white/5 px-5 py-3 rounded-xl font-label text-xs hover:bg-white/10 transition-colors cursor-pointer"
            >
              تواصل مع مرشد 💬
            </button>
          </div>
        </div>

        <div className="relative z-10 md:w-1/2 flex justify-center">
          <div className="w-56 h-56 md:w-64 md:h-64 relative">
            <img 
              className="w-full h-full object-contain filter drop-shadow-2xl" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo3_Phd4K22NyxAN9-aoWZ-i0vxdkRZx2TAROoKhOhAa7qDf99M6cIEMYYrrWxWJ6LngyDM0ZLyikSDwDmjOENNeOGas76WJDnPjkqOsqHDtghOgnBSuL9eCmTaiSokZQzGCxDsTYSrP21LO_Ial0FRYgX3yiMFnk4MQhTpwBH8qrrhPKP04oB9l4jd36CZpb3-rk-bIyVt13M_Kos9g11kwpBlXPU5r4ivktDaX4iMmMNAS3CoitdMqPcdo3a5ebIGNXSUzbQ_UFl"
              alt="Isometric Illustration of 3D objects"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

        </>
      )}

      {/* Guide & Admin Counselor Live Chat Modal Popup (تواصل مع المرشد) */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl text-right flex flex-col h-[520px]">
            
            {/* Modal Header */}
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-400 overflow-hidden relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-white animate-ping" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">مرشد المنصة الرئيسي 🕊️</h4>
                  <span className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5fff7f]" />
                    <span>نشط الآن للاستشارات الفورية</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowChatModal(false)}
                className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body messages area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#0d1627] text-xs">
              {chatHistory.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                    <span className="text-[9px] text-slate-500 mb-0.5">{isUser ? 'أنت' : 'المرشد الروحي'} • {msg.time}</span>
                    <div className={`p-3 max-w-[85%] rounded-2xl font-sans ${
                      isUser 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-slate-400 mb-0.5">جاري الرد...</span>
                  <div className="bg-slate-800 text-slate-400 px-4 py-2 rounded-xl italic">
                    المرشد يكتب الآن... ✏️
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input form area */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="اكتب رسالتك أو استفسارك هنا للمرشد..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
