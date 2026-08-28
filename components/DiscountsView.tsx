/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Search, 
  ShieldAlert, 
  Flame, 
  Plus, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  User,
  Activity,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Bookmark,
  Users
} from 'lucide-react';

interface DiscountBonusItem {
  id: string;
  servantName: string;
  type: 'bonus' | 'discount';
  amount: number;
  reason: string;
  date: string;
}

export interface BonusClaim {
  id: string;
  servantName: string;
  challengeTitle: string;
  pointsReward: number;
  proof: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface ProgramRule {
  id: string;
  name: string;
  points: number;
}

interface DiscountsViewProps {
  onNotify: (msg: string) => void;
}

export default function DiscountsView({ onNotify }: DiscountsViewProps) {
  // Master Sections:
  // 'rules-definition' (القسم الأول للتعريف بالبرنامج) 
  // 'scores-leaderboard' (القسم الثاني لدرجات المشارك شاشة لكل المشاركين)
  // 'challenges' (قسم التحديات والطلب والموافقة)
  const [masterTab, setMasterTab] = useState<'rules-definition' | 'scores-leaderboard' | 'challenges'>('rules-definition');
  
  // Rules Subtab: bonus or discount rules
  const [rulesSubTab, setRulesSubTab] = useState<'bonus' | 'discount'>('bonus');

  // Scores Subtab
  const [scoresSubTab, setScoresSubTab] = useState<'personal' | 'all-bonuses' | 'all-discounts'>('personal');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');
  
  // Shared databases stored in localStorage
  const [logs, setLogs] = useState<DiscountBonusItem[]>([]);
  const [claims, setClaims] = useState<BonusClaim[]>([]);
  
  // Custom Dynamic Rules loaded from localstorage
  const [bonusRules, setBonusRules] = useState<ProgramRule[]>([]);
  const [discountRules, setDiscountRules] = useState<ProgramRule[]>([]);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [claimProof, setClaimProof] = useState('');

  const currentServant = "ميلاد بشته";

  useEffect(() => {
    // 1. Logs Initialization or Retrieval
    const savedLogs = localStorage.getItem('angels_bonuses_discounts_logs_v1');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        initDefaultLogs();
      }
    } else {
      initDefaultLogs();
    }

    // 2. Claims Initialization or Retrieval
    const savedClaims = localStorage.getItem('angels_bonus_claims_v1');
    if (savedClaims) {
      try {
        setClaims(JSON.parse(savedClaims));
      } catch (e) {}
    } else {
      const initialClaims: BonusClaim[] = [
        {
          id: 'claim-1',
          servantName: 'ميلاد بشته',
          challengeTitle: 'تحدي النطق السليم ولغة الشفاه',
          pointsReward: 120,
          proof: 'قمت بتسجيل فيديو مدته 15 دقيقة مع الدارس مينا الذي يعاني من ضعف السمع وطبقنا إشارات الحروف بنجاح.',
          status: 'pending',
          date: '16 يونيو 2026'
        }
      ];
      localStorage.setItem('angels_bonus_claims_v1', JSON.stringify(initialClaims));
      setClaims(initialClaims);
    }

    // 3. Dynamic Rules Initialization or Retrieval
    const savedBonusRules = localStorage.getItem('angels_bonus_rules_v1');
    if (savedBonusRules) {
      try {
        setBonusRules(JSON.parse(savedBonusRules));
      } catch (e) {}
    } else {
      const initialBonusRules: ProgramRule[] = [
        { id: 'br-1', name: 'الحضور المبكر للقداس والخدمات', points: 5 },
        { id: 'br-2', name: 'الافتقاد الميداني الممتاز والمتابعة المباشرة', points: 10 },
        { id: 'br-3', name: 'الاهتمام الفردي بالمخدوم وتلبية تطلعاته', points: 10 },
        { id: 'br-4', name: 'التعاون النموذجي والمثالي مع بقية الخدام', points: 4 },
        { id: 'br-5', name: 'المساهمة في تنظيم الرحلات والأنشطة الترفيهية للأطفال', points: 15 },
        { id: 'br-6', name: 'إعداد مجسمات تعليمية مبتكرة لدعم الصم والبكم', points: 12 }
      ];
      localStorage.setItem('angels_bonus_rules_v1', JSON.stringify(initialBonusRules));
      setBonusRules(initialBonusRules);
    }

    const savedDiscountRules = localStorage.getItem('angels_discount_rules_v1');
    if (savedDiscountRules) {
      try {
        setDiscountRules(JSON.parse(savedDiscountRules));
      } catch (e) {}
    } else {
      const initialDiscountRules: ProgramRule[] = [
        { id: 'dr-1', name: 'غياب عن حضور الفعالية أو الاجتماع بدون إذن معتمد', points: 5 },
        { id: 'dr-2', name: 'عدم حل وتسليم المهمات والتقارير الميدانية', points: 10 },
        { id: 'dr-3', name: 'سلوك لا يليق بالملعب الميداني أو غياب لغة الاحترام', points: 20 },
        { id: 'dr-4', name: 'التأخر المتكرر عن مواعيد الحافلة أو المرجعية الكنسية', points: 8 }
      ];
      localStorage.setItem('angels_discount_rules_v1', JSON.stringify(initialDiscountRules));
      setDiscountRules(initialDiscountRules);
    }
  }, []);

  // Standard database trigger changes syncing from other sources or local reloads
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLogs = localStorage.getItem('angels_bonuses_discounts_logs_v1');
      if (savedLogs) setLogs(JSON.parse(savedLogs));

      const rulesB = localStorage.getItem('angels_bonus_rules_v1');
      if (rulesB) setBonusRules(JSON.parse(rulesB));

      const rulesD = localStorage.getItem('angels_discount_rules_v1');
      if (rulesD) setDiscountRules(JSON.parse(rulesD));

      const savedClaims = localStorage.getItem('angels_bonus_claims_v1');
      if (savedClaims) setClaims(JSON.parse(savedClaims));
    };

    window.addEventListener('storage', handleStorageChange);
    // Interval check as a fallback for internal state sharing within tabs
    const interval = setInterval(handleStorageChange, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const initDefaultLogs = () => {
    const defaultData: DiscountBonusItem[] = [
      {
        id: 'bd-1',
        servantName: 'ميلاد بشته',
        type: 'bonus',
        amount: 80,
        reason: 'حضور مبكر وتحضير متميز لفصول ذوي متلازمة داون للأميرة ساندرا',
        date: '15 يونيو 2026'
      },
      {
        id: 'bd-2',
        servantName: 'ميلاد بشته',
        type: 'bonus',
        amount: 50,
        reason: 'تفوق استثنائي في لغة الإشارة الموحدة لخدمة الصم وعلامات الوجه',
        date: '12 يونيو 2026'
      },
      {
        id: 'bd-3',
        servantName: 'ميلاد بشته',
        type: 'discount',
        amount: 20,
        reason: 'سلوك لا يليق بسبب التأخير ٣٠ دقيقة عن حضور كورس المحاكاة الميدانية',
        date: '11 يونيو 2026'
      },
      {
        id: 'bd-4',
        servantName: 'كيرلس يوسف غالي',
        type: 'bonus',
        amount: 100,
        reason: 'التعاون الجيد والمساهمة في بناء الأبجدية اليدوية لمناهج أصدقاء الملائكة',
        date: '14 يونيو 2026'
      },
      {
        id: 'bd-5',
        servantName: 'ماري جرجس خليل',
        type: 'bonus',
        amount: 120,
        reason: 'الافتقاد الممتاز والتحضير الفارق لدراسي منطقة حلوان للأسر الأولى بالرعاية',
        date: '15 يونيو 2026'
      },
      {
        id: 'bd-6',
        servantName: 'أحمد رامي سليمان',
        type: 'discount',
        amount: 10,
        reason: 'عدم حل وتسليم المهمات الدينية المحددة طوال فترة التقييم المالي والروحي',
        date: '13 يونيو 2026'
      },
      {
        id: 'bd-7',
        servantName: 'ميلاد بشته',
        type: 'discount',
        amount: 15,
        reason: 'الغياب بدون إذن مسبق عن حضور الافتقاد التأسيسي المنسق الأسبوع الماضي',
        date: '08 يونيو 2026'
      },
      {
        id: 'bd-8',
        servantName: 'سارة كميل بشاي',
        type: 'bonus',
        amount: 110,
        reason: 'الاهتمام بالمخدوم والتواصل العائلي المثمر لأطفال فصول داون الكلية',
        date: '16 يونيو 2026'
      },
      {
        id: 'bd-9',
        servantName: 'أحمد رامي سليمان',
        type: 'discount',
        amount: 25,
        reason: 'الغياب بدون عذر عن الفحص الميداني والتقييم الشهري الأول والوقائي',
        date: '09 يونيو 2026'
      }
    ];
    localStorage.setItem('angels_bonuses_discounts_logs_v1', JSON.stringify(defaultData));
    setLogs(defaultData);
  };

  const myLogs = logs.filter(item => item.servantName === currentServant);
  const myTotalBonuses = myLogs.filter(i => i.type === 'bonus').reduce((acc, curr) => acc + curr.amount, 0);
  const myTotalDiscounts = myLogs.filter(i => i.type === 'discount').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = myTotalBonuses - myTotalDiscounts;

  // Rich metadata list of challenges requested "تحديات كثيرة يمكن للخدام تأديتها"
  const activeChallenges = [
    {
      id: 'ch-1',
      title: 'تحدي الحضور المبكر السوبر ⏱️',
      pointsReward: 50,
      description: 'الالتزام بالحضور قبل الموعد بـ ٣٠ دقيقة طوال الأسبوع وبدء صلوات التحضير مع الأطفال.',
      difficulty: 'سهل',
      difficultyColor: 'bg-green-50 text-green-750',
      category: 'التزام وحضور'
    },
    {
      id: 'ch-2',
      title: 'بطل الافتقاد والمثابرة الميدانية 🏘️',
      pointsReward: 150,
      description: 'قم بزيارة ميدانية أو افتقاد منزلي لثلاثة أطفال منقطعون من زاوية الصم، مع كتابة المشاعر والحل المنسق وتوقيع ولي الأمر.',
      difficulty: 'متوسط',
      difficultyColor: 'bg-amber-50 text-amber-800',
      category: 'افتقاد شامل'
    },
    {
      id: 'ch-3',
      title: 'حافظ الأسبوع لكتاب البابا شنودة 📖',
      pointsReward: 200,
      description: 'كتابة ملخص تفصيلي من ٥ صفحات للباب الثاني في كتاب "المحبة" لقداسة البابا ومراجعته الروحية مع المرشد.',
      difficulty: 'متقدم',
      difficultyColor: 'bg-red-50 text-red-800',
      category: 'بحث روحي'
    },
    {
      id: 'ch-4',
      title: 'الافتفاض والمتابعة المثالية الفردية 💖',
      pointsReward: 100,
      description: 'متابعة فردية لمدة أسبوع مع طفل يعاني من تشتت الانتباه وتقديم ٣ وسائل تفاعلية بصرية ملموسة له.',
      difficulty: 'متوسط',
      difficultyColor: 'bg-amber-50 text-amber-800',
      category: 'الاهتمام بالمخدوم'
    },
    {
      id: 'ch-5',
      title: 'تحدي النطق السليم ولغة الشفاه 🗣️',
      pointsReward: 120,
      description: 'تطبيق دراسي ومحاكاة مع دارس صمم وتصوير فيديو تفاعلي نافع يسهم في حل عقبات الكلمات الأساسية.',
      difficulty: 'متوسط',
      difficultyColor: 'bg-amber-50 text-amber-800',
      category: 'مهارى وفني'
    },
    {
      id: 'ch-6',
      title: 'تحدي سفير الدمج والنشاط الصيفي 🎪',
      pointsReward: 180,
      description: 'تنفيذ وتنسيق حفل محبة صغير لعدد ٤ أطفال من متلازمة داون وتوثيق نشاطهم الجماعي والترفيهي.',
      difficulty: 'متقدم',
      difficultyColor: 'bg-red-50 text-red-800',
      category: 'ترفيهي وإنساني'
    },
    {
      id: 'ch-7',
      title: 'التعاون الإيجابي ومساعدة الخدام الجدد 🤝',
      pointsReward: 60,
      description: 'تحضير مادة علمية ومصادر مساعدة وتوصيلها لزميل خادم جديد بالمنهج لشرح آليات التحرك مع الصم والبكم.',
      difficulty: 'سهل',
      difficultyColor: 'bg-green-50 text-green-700',
      category: 'تعاون وعطاء'
    },
    {
      id: 'ch-8',
      title: 'رائد اللوحات البصرية لغرف التدريس 🎨',
      pointsReward: 130,
      description: 'تصميم ٣ لوحات فلاش ورقية ملونة وكبيرة لإبراز حروف الأبجدية اليدوية وتثبيتها بالفصول العملية.',
      difficulty: 'متوسط',
      difficultyColor: 'bg-amber-50 text-amber-850',
      category: 'وسائط بصرية'
    }
  ];

  // Logic for month aggregation and grouping of logs
  const getMonthName = (dateStr: string) => {
    if (!dateStr) return 'مدة غير محددة';
    // Matches expressions containing "يونيو" etc, otherwise parses month
    if (dateStr.includes('يونيو')) return 'يونيو 2026';
    if (dateStr.includes('مايو')) return 'مايو 2026';
    if (dateStr.includes('يوليو')) return 'يوليو 2026';
    return 'شهور سابقة أو أخرى';
  };

  const getMonthlyAggregateList = (items: DiscountBonusItem[]) => {
    const map: Record<string, { bonus: number, discount: number, list: DiscountBonusItem[] }> = {};
    items.forEach(it => {
      const month = getMonthName(it.date);
      if (!map[month]) {
        map[month] = { bonus: 0, discount: 0, list: [] };
      }
      if (it.type === 'bonus') map[month].bonus += it.amount;
      if (it.type === 'discount') map[month].discount += it.amount;
      map[month].list.push(it);
    });
    return map;
  };

  const myMonthlyAggregates = getMonthlyAggregateList(myLogs);

  // Standings / Participants score board
  // Calculate unique participants and key summary of what bonuses they collected
  const collectUniqueStandings = (allItems: DiscountBonusItem[]) => {
    const map: Record<string, { servantName: string, bonusTotal: number, discountTotal: number, bonusCount: number, discountCount: number, items: DiscountBonusItem[] }> = {};
    
    // To ensure all standard participants show up in list:
    const activeServants = ["ميلاد بشته", "كيرلس يوسف غالي", "ماري جرجس خليل", "أحمد رامي سليمان", "سارة كميل بشاي"];
    activeServants.forEach(s => {
      map[s] = { servantName: s, bonusTotal: 0, discountTotal: 0, bonusCount: 0, discountCount: 0, items: [] };
    });

    allItems.forEach(it => {
      // Avoid raw logs that are anonymous or custom if we want clean list, but accept any
      if (!map[it.servantName]) {
        map[it.servantName] = { servantName: it.servantName, bonusTotal: 0, discountTotal: 0, bonusCount: 0, discountCount: 0, items: [] };
      }
      if (it.type === 'bonus') {
        map[it.servantName].bonusTotal += it.amount;
        map[it.servantName].bonusCount += 1;
      } else {
        map[it.servantName].discountTotal += it.amount;
        map[it.servantName].discountCount += 1;
      }
      map[it.servantName].items.push(it);
    });
    return Object.values(map);
  };

  const participantsStandings = collectUniqueStandings(logs);

  return (
    <div className="space-y-6 text-right" id="discounts_and_bonuses_premium_root">
      
      {/* Top Main Page Hero Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden" id="bonuses_intro_panel">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-br-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>نظام البونص والالتزام الميداني الشامل 🌟</span>
            </div>
            <h2 className="font-display text-2xl font-black text-[#151c27] tracking-tight">مركز البونص ودفاتر الخصومات</h2>
            <p className="font-sans text-xs text-slate-500 max-w-3xl leading-relaxed">
              تتبع بكل شفافية بنود اللائحة الإرشادية لبرامج الإثابة والالتزام المساعد لمؤسسة أصدقاء الملائكة. 
              يتراكم بونص الدارسين في حسابهم لترقية رتبهم التفاعلية، بينما ترصد التنبيهات والخصومات لضمان العدالة وتفادي التقصير.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <User className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 font-bold">المشارك الفعلي</span>
              <span className="block text-[11px] font-black text-[#15803d]">{currentServant}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Snapshots & Balances (Visual Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="discounts_widgets_row">
        
        {/* Total Earned Bonuses Widget */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-2 left-2 rotate-12 scale-110 opacity-5 text-emerald-600">
            <Trophy className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-[11px] uppercase tracking-wider text-slate-400">مجموع المكافآت والبونص</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl text-emerald-600">+{myTotalBonuses}</h3>
            <p className="font-sans text-[10px] text-slate-400 mt-1">تمنح بناءً على تلبية التحديات والسلوك الإيجابي المتميز</p>
          </div>
        </div>

        {/* Total Deducted Discounts Widget */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-2 left-2 rotate-12 scale-110 opacity-5 text-red-600">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-[11px] uppercase tracking-wider text-slate-400">إجمالي الخصومات المسجلة</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl text-red-600">-{myTotalDiscounts}</h3>
            <p className="font-sans text-[10px] text-slate-400 mt-1">تخصم آلياً أو يدوياً بقرارات معتمدة من مشرف السرد المالي</p>
          </div>
        </div>

        {/* Net Dynamic Balance */}
        <div className="bg-gradient-to-br from-[#1c305c] to-blue-900 p-5 rounded-2xl text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-2 left-2 rotate-12 scale-110 opacity-15 text-white">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-[11px] uppercase tracking-wider text-blue-200">الصافي التراكمي للحساب</span>
            <div className="p-2 rounded-lg bg-white/10 text-yellow-300">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl text-yellow-300">
              {netBalance >= 0 ? `+${netBalance}` : `${netBalance}`} <span className="text-xs font-sans text-blue-100">نقطة</span>
            </h3>
            <p className="font-sans text-[10px] text-blue-200 mt-1">تنعكس هذه القيمة فوراً وبشكل تلقائي على ميزانية ملفك الرئيسي</p>
          </div>
        </div>

      </div>

      {/* MASTER SYSTEM PORTAL TABS */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Navigation Tabs Header as side-by-side colored squares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border-b border-slate-100" id="three_colored_master_sections_squares">
          
          {/* Square 1: Rules & Regulation definition */}
          <button 
            onClick={() => setMasterTab('rules-definition')}
            className={`p-5 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] border-2 ${
              masterTab === 'rules-definition' 
                ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300' 
                : 'bg-blue-50/50 hover:bg-blue-50 text-blue-900 border-blue-200'
            }`}
          >
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-white/5" />
            <div className="flex items-center justify-between w-full">
              <div className={`p-2 rounded-xl ${masterTab === 'rules-definition' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                <Layers className="w-5 h-5" />
              </div>
              {masterTab === 'rules-definition' && (
                <span className="bg-white text-blue-750 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-3xs">نشط حالياً</span>
              )}
            </div>
            <div className="space-y-1 mt-auto">
              <span className="block text-[9px] font-mono font-bold tracking-wider opacity-80">القسم الأول</span>
              <h4 className="font-display font-black text-xs">تعريف بالبرنامج ولائحة النقاط والخصومات السلوكية</h4>
              <p className={`text-[10px] truncate ${masterTab === 'rules-definition' ? 'text-blue-100' : 'text-slate-500'}`}>
                تصفح البنود المعتمدة والجزاءات الروحية
              </p>
            </div>
          </button>

          {/* Square 2: Standings and logs */}
          <button 
            onClick={() => {
              setMasterTab('scores-leaderboard');
              setScoresSubTab('personal');
            }}
            className={`p-5 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] border-2 ${
              masterTab === 'scores-leaderboard' 
                ? 'bg-indigo-650 bg-indigo-600 text-white border-indigo-750 shadow-md ring-2 ring-indigo-300' 
                : 'bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900 border-indigo-200'
            }`}
          >
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-white/5" />
            <div className="flex items-center justify-between w-full">
              <div className={`p-2 rounded-xl ${masterTab === 'scores-leaderboard' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                <Users className="w-5 h-5" />
              </div>
              {masterTab === 'scores-leaderboard' && (
                <span className="bg-white text-indigo-750 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-3xs">نشط حالياً</span>
              )}
            </div>
            <div className="space-y-1 mt-auto">
              <span className="block text-[9px] font-mono font-bold tracking-wider opacity-80">القسم الثاني</span>
              <h4 className="font-display font-black text-xs">درجات وسجل الخادم ولوحة الشرف لباقي المشاركين</h4>
              <p className={`text-[10px] truncate ${masterTab === 'scores-leaderboard' ? 'text-indigo-100' : 'text-slate-500'}`}>
                سجل النقاط الشخصية ومراكز المتنافسين
              </p>
            </div>
          </button>

          {/* Square 3: Challenges and claims */}
          <button 
            onClick={() => setMasterTab('challenges')}
            className={`p-5 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] border-2 ${
              masterTab === 'challenges' 
                ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300' 
                : 'bg-amber-50/50 hover:bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-white/5" />
            <div className="flex items-center justify-between w-full">
              <div className={`p-2 rounded-xl ${masterTab === 'challenges' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                <Flame className="w-5 h-5" />
              </div>
              {masterTab === 'challenges' && (
                <span className="bg-white text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-3xs">نشط حالياً</span>
              )}
            </div>
            <div className="space-y-1 mt-auto">
              <span className="block text-[9px] font-mono font-bold tracking-wider opacity-80">القسم الثالث</span>
              <h4 className="font-display font-black text-xs">تحديات الخدمة التفاعلية ونموذج تقديم رصيد بونص</h4>
              <p className={`text-[10px] truncate ${masterTab === 'challenges' ? 'text-amber-100' : 'text-slate-500'}`}>
                طلب ترقية النقاط وإرفاق إثبات التنفيذ
              </p>
            </div>
          </button>

        </div>

        {/* TAB CONTENTS */}
        <div className="p-6">
          
          {/* MASTER TAB 1: Rules Definition */}
          {masterTab === 'rules-definition' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
                <div>
                  <h3 className="font-display font-black text-sm text-slate-850">اللائحة الرسمية لبرنامج أصدقاء الملائكة</h3>
                  <p className="font-sans text-[10.5px] text-slate-400 mt-1">توضح هذه اللوائح الأرقام والقيم المقابلة لكل نشاط. البيانات مُحدثة وتعدل عبر غرفة الإدارة.</p>
                </div>

                {/* Sub toggle for rules tab */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setRulesSubTab('bonus')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rulesSubTab === 'bonus' ? 'bg-emerald-600 text-white shadow-3xs' : 'text-slate-650 hover:text-slate-800'
                    }`}
                  >
                    قائمة بنود البونص والتفوق (+)
                  </button>
                  <button 
                    onClick={() => setRulesSubTab('discount')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rulesSubTab === 'discount' ? 'bg-red-650 text-white shadow-3xs' : 'text-slate-650 hover:text-slate-800'
                    }`}
                  >
                    قائمة بنود الضبط والخصومات (-)
                  </button>
                </div>
              </div>

              {/* Grid representation of selected category rules */}
              {rulesSubTab === 'bonus' ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 font-sans leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>فلسفة مكافآت البونص:</strong> نسعى لتحفيز السلوك الفني والروحي الفارق داخل الفصول ومجتمعات الصم والبكم ومتلازمة داون. يمكن للخدام رفع مستوى درجاتهم والحصول على دروع معتمدة.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bonusRules.map((rule) => (
                      <div 
                        key={rule.id} 
                        className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:border-emerald-300 transition-colors"
                      >
                        <div className="space-y-1">
                          <h4 className="font-display font-black text-xs text-slate-850">{rule.name}</h4>
                          <span className="font-sans text-[9.5px] text-slate-400 block">مرمّز بالمعايير الكنسية للأولويات والدمج</span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1 bg-emerald-50 px-3 py-2 rounded-xl text-emerald-700 border border-emerald-100">
                          <span className="font-display font-black text-sm">+{rule.points}</span>
                          <span className="font-sans text-[8px] font-bold">بونص</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50/30 p-4 rounded-xl border border-red-100 text-[11px] text-red-800 font-sans leading-relaxed flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span><strong>قواعد الانضباط والخصومات:</strong> الغاية ليست معاقبة الخادم، بل تأكيد قيمة الأمانة الكاملة والجدية في خدمة ورعاية الطفل المسيحي من ذوي الاحتياجات الخاصة.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discountRules.map((rule) => (
                      <div 
                        key={rule.id} 
                        className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:border-red-350 transition-colors"
                      >
                        <div className="space-y-1">
                          <h4 className="font-display font-black text-xs text-slate-850">{rule.name}</h4>
                          <span className="font-sans text-[9.5px] text-slate-400 block">تطبق آلياً عند انتفاء الإعذار أو التقارير</span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1 bg-red-50 px-3 py-2 rounded-xl text-red-700 border border-red-100">
                          <span className="font-display font-black text-sm">-{rule.points}</span>
                          <span className="font-sans text-[8px] font-bold">خصم</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Notice */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-center">
                <p className="font-sans text-[10px] text-slate-400 font-medium leading-relaxed">
                  💡 <strong>ملاحظة هامة:</strong> يمكن لمتولي غرفة الإدارة والسيطرة إضافة بنود وتعديل الأرقام والنقاط المسجلة أعلاه بشكل فوري طبقاً لمتطلبات شهر التقييم بدقة مطلقة.
                </p>
              </div>

            </div>
          )}

          {/* MASTER TAB 2: Scores and Standings */}
          {masterTab === 'scores-leaderboard' && (
            <div className="space-y-6">
              
              {/* Internal toggle buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => setScoresSubTab('personal')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      scoresSubTab === 'personal' ? 'bg-[#15803d] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    أولاً: درجاتي ومكافآتي الشخصية (كشف تفصيلي شهري)
                  </button>

                  <button 
                    onClick={() => {
                      setScoresSubTab('all-bonuses');
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      scoresSubTab === 'all-bonuses' ? 'bg-[#15803d] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ثانياً: لوحة كافة المشاركين (البونص والتميز)
                  </button>

                  <button 
                    onClick={() => {
                      setScoresSubTab('all-discounts');
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      scoresSubTab === 'all-discounts' ? 'bg-red-650 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ثالثاً: لوحة كافة المشاركين (الخصم والملاحظات)
                  </button>
                </div>

                {/* Date Month Filter (Only for personal account logs) */}
                {scoresSubTab === 'personal' && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-sans text-[10.5px] text-slate-400 font-bold">فرز المخطط:</span>
                    <select 
                      value={selectedMonthFilter}
                      onChange={(e) => setSelectedMonthFilter(e.target.value)}
                      className="bg-white border border-slate-200 text-[10.5px] font-sans p-1.5 rounded-lg focus:ring-1 focus:ring-[#15803d]"
                    >
                      <option value="all">المدة الإجمالية كلها</option>
                      <option value="يونيو 2026">شهر يونيو 2026</option>
                      <option value="شهور سابقة">الشهور والمدد السابقة</option>
                    </select>
                  </div>
                )}

                {/* Collective search board filter */}
                {scoresSubTab !== 'personal' && (
                  <div className="relative shrink-0 w-full sm:w-64">
                    <Search className="absolute right-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="ابحث باسم الدارس أو الخادم..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pr-9 pl-3 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Render SUB-PORTAL 1: Personal scores grouped by month as requested */}
              {scoresSubTab === 'personal' && (
                <div className="space-y-6">
                  
                  {myLogs.length > 0 ? (
                    Object.entries(myMonthlyAggregates)
                      .filter(([monthName]) => selectedMonthFilter === 'all' || monthName === selectedMonthFilter)
                      .map(([monthName, monthData]) => (
                        <div key={monthName} className="bg-slate-50/40 p-5 rounded-2xl border border-slate-150 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-2.5 gap-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4.5 h-4.5 text-blue-600" />
                              <h4 className="font-display font-extrabold text-xs text-[#151c27]">{monthName}</h4>
                            </div>
                            
                            {/* Summary list */}
                            <div className="flex gap-2 flex-wrap text-[10px] font-sans">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold">
                                بونص المكتسب: +{monthData.bonus} نقطة
                              </span>
                              <span className="bg-red-50 text-red-800 border border-red-150 px-2.5 py-0.5 rounded-md font-bold">
                                خصومات المخالفة: -{monthData.discount} نقطة
                              </span>
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                                المجموع المساعد للشهور: {monthData.bonus - monthData.discount} نقطة
                              </span>
                            </div>
                          </div>

                          {/* Specific items listed for this month */}
                          <div className="space-y-2.5">
                            {monthData.list.map((logItem) => (
                              <div 
                                key={logItem.id} 
                                className={`p-3.5 rounded-xl border bg-white flex justify-between items-start gap-3.5 transition-all hover:translate-x-[-2px] ${
                                  logItem.type === 'bonus' ? 'border-[#bbf7d0]/75' : 'border-[#fecaca]/75'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className={`p-2 rounded-lg shrink-0 ${
                                    logItem.type === 'bonus' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                  }`}>
                                    {logItem.type === 'bonus' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-sans text-[9px] text-slate-400 font-bold">{logItem.date}</span>
                                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-label font-extrabold pb-0.5 ${
                                        logItem.type === 'bonus' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-750'
                                      }`}>
                                        {logItem.type === 'bonus' ? 'تمكين بونص' : 'خصم تربوي'}
                                      </span>
                                    </div>
                                    <p className="font-sans text-xs text-slate-700 mt-1.5 font-bold leading-normal">
                                      {logItem.reason}
                                    </p>
                                  </div>
                                </div>

                                <div className="shrink-0 font-display font-black text-sm text-left">
                                  <span className={logItem.type === 'bonus' ? 'text-emerald-600' : 'text-red-650'}>
                                    {logItem.type === 'bonus' ? `+${logItem.amount}` : `-${logItem.amount}`}
                                  </span>
                                  <span className="font-sans text-[8.5px] text-slate-450 mr-1 block">درجة</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-slate-400 font-sans text-center py-8 text-xs">لا توجد حركات درجات مسجلة لك حالياً في هذه الفترة.</p>
                  )}

                  {/* Claims Tracking */}
                  <div className="bg-amber-50/30 p-4 border border-amber-200 rounded-2xl">
                    <h5 className="font-display font-black text-xs text-amber-800 mb-3 flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      <span>تحديثات طلبات البونص والمنافسات المقدمة للجنة الإشرافية ({claims.length})</span>
                    </h5>
                    
                    {claims.length > 0 ? (
                      <div className="space-y-3">
                        {claims.map((claim) => (
                          <div key={claim.id} className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-sans text-[9px] text-slate-400">{claim.date}</span>
                                <h6 className="text-[11.5px] font-black font-display text-slate-800">{claim.challengeTitle}</h6>
                                
                                {claim.status === 'pending' && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[8.5px] font-bold">بانتظار موافقة الإدارة ⏳</span>}
                                {claim.status === 'approved' && <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[8.5px] font-bold font-display">تم القبول والإضافة للحساب ✅</span>}
                                {claim.status === 'rejected' && <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md text-[8.5px] font-bold font-sans">لم تتم الموافقة ❌</span>}
                              </div>
                              <p className="font-sans text-[11px] text-slate-500 mt-2">
                                <strong className="text-slate-700">بيان مستندات إثبات التنفيذ: </strong>
                                {claim.proof}
                              </p>
                            </div>
                            <span className="font-display font-black text-emerald-600 text-xs shrink-0 whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg">
                              +{claim.pointsReward} بونص
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 font-sans text-[11px] py-1 text-center">لا توجد طلبات تقديم حالية بانتظار المراجعة.</p>
                    )}
                  </div>

                </div>
              )}

              {/* Render SUB-PORTAL 2: All participants' positive bonuses screen */}
              {scoresSubTab === 'all-bonuses' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-150 text-[10.5px] text-emerald-805 leading-relaxed">
                    📜 تعرض اللائحة شاشة التنافسية للأفراد الحاصلين على الأوسمة الإضافية والبونص لتشجيع مبادئ الالتزام الإنجيلي.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participantsStandings
                      .filter(st => st.servantName.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((st) => (
                        <div key={st.servantName} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-300 transition-colors shadow-2xs">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-xs">
                                  {st.servantName.charAt(0)}
                                </div>
                                <h4 className="font-display font-black text-xs text-slate-800">{st.servantName}</h4>
                              </div>
                              <span className="font-display text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-150">
                                إجمالي البونص: +{st.bonusTotal} نقطة
                              </span>
                            </div>

                            <p className="font-sans text-[10px] text-slate-400">
                              عدد القيود الممنوحة الفعالة: <span className="font-bold text-slate-700">{st.bonusCount} إثابات</span>
                            </p>
                          </div>

                          {/* Render sub logs details of bonuses */}
                          <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 max-h-[140px] overflow-y-auto scrollbar-none">
                            {st.items.filter(item => item.type === 'bonus').map(item => (
                              <div key={item.id} className="bg-slate-50 p-2 rounded-lg text-[10px] font-sans flex justify-between items-start">
                                <div className="space-y-0.5 flex-1 pr-1">
                                  <p className="text-slate-600 font-bold leading-normal truncate">{item.reason}</p>
                                  <span className="text-[9px] text-slate-400 block">{item.date}</span>
                                </div>
                                <span className="text-emerald-605 font-bold shrink-0">+{item.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Render SUB-PORTAL 3: All participants' negative discounts screen */}
              {scoresSubTab === 'all-discounts' && (
                <div className="space-y-4">
                  <div className="bg-red-50/20 p-3.5 rounded-xl border border-red-150 text-[10.5px] text-red-800 leading-relaxed">
                    ⚠️ شاشة كشف رصيف الحسميات والانبضاط لضمان توجيه الدارسين لأولويات الكنيسة بقدسية وأمانة تامة.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participantsStandings
                      .filter(st => st.servantName.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((st) => (
                        <div key={st.servantName} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between hover:border-red-300 transition-colors shadow-2xs">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 font-black flex items-center justify-center text-xs">
                                  {st.servantName.charAt(0)}
                                </div>
                                <h4 className="font-display font-black text-xs text-slate-800">{st.servantName}</h4>
                              </div>
                              <span className="font-display text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-150">
                                إجمالي الخصميات: -{st.discountTotal} نقطة
                              </span>
                            </div>

                            <p className="font-sans text-[10px] text-slate-400">
                              عدد القيود الممنوحة الفعالة: <span className="font-bold text-slate-700">{st.discountCount} بنود خصم</span>
                            </p>
                          </div>

                          {/* Render sub logs details of discounts */}
                          <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 max-h-[140px] overflow-y-auto scrollbar-none">
                            {st.items.filter(item => item.type === 'discount').map(item => (
                              <div key={item.id} className="bg-slate-50 p-2 rounded-lg text-[10px] font-sans flex justify-between items-start">
                                <div className="space-y-0.5 flex-1 pr-1">
                                  <p className="text-slate-600 font-bold leading-normal truncate">{item.reason}</p>
                                  <span className="text-[9px] text-slate-400 block">{item.date}</span>
                                </div>
                                <span className="text-red-650 font-bold shrink-0">-{item.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MASTER TAB 3: Service Challenges */}
          {masterTab === 'challenges' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-4 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-center gap-4 text-right">
                <div className="p-3 bg-white rounded-xl text-amber-500 shrink-0 shadow-3xs">
                  <Flame className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-amber-900">سجل التحديات المتنوعة وطلب الموافقة الإدارية الرسمية</h4>
                  <p className="font-sans text-[11px] text-amber-700 mt-1 max-w-xl">
                    يمكن للخدام تأدية أحد التحديات المذكورة بالأسفل وكتابة إثبات التنفيذ. بمجرد تأكيده والموافقة عليه من خلال الإدمن في لوحة التحكم، ستحصل تلقائياً على جائزة البونص بالحساب!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                {activeChallenges.map((ch) => {
                  return (
                    <div 
                      key={ch.id} 
                      className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-2xs relative overflow-hidden transition-all hover:shadow-md hover:border-amber-300"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{ch.category}</span>
                          <span className={`font-sans text-[9px] px-2 py-0.5 rounded-md font-bold ${ch.difficultyColor}`}>صعوبة: {ch.difficulty}</span>
                        </div>
                        <div>
                          <h5 className="font-display font-black text-xs text-slate-900 leading-tight">{ch.title}</h5>
                          <p className="font-sans text-[11px] text-slate-500 mt-2 leading-relaxed">
                            {ch.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-display text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">+{ch.pointsReward} بونص</span>
                        <button 
                          onClick={() => {
                            setSelectedChallenge(ch);
                            setClaimProof('');
                            setIsSubmitModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[10px] font-label font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          تقديم طلب ربح
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Dynamic Pop-up Submit Claim Modal */}
      {isSubmitModalOpen && selectedChallenge && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-right space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-display font-black text-xs text-[#15803d]">تقديم مستند وإثبات تنفيذ تحدي بونص 📝</h4>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-sans text-xs font-bold"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] bg-amber-50 text-amber-650 px-2 py-0.5 rounded-md font-bold">التحدي المختار</span>
              <h5 className="font-display font-black text-xs text-slate-800">{selectedChallenge.title}</h5>
              <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">{selectedChallenge.description}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">اكتب كيفية الإنجاز والإثبات التفصيلي لوجه الأمانة:</label>
              <textarea 
                rows={3}
                required
                value={claimProof}
                onChange={(e) => setClaimProof(e.target.value)}
                placeholder="مثلاً: قمت بإعداد ملخص من 5 صفحات للباب الثاني وتلخيصه مع المرشد في اجتماع الأحد وحصلت على توقيعه..."
                className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!claimProof.trim()) {
                    onNotify('يرجى كتابة دليل أو شرح لتأكيد إنجاز التحدي وإلا لن يقبل.');
                    return;
                  }
                  
                  const newClaim: BonusClaim = {
                    id: `claim-${Date.now()}`,
                    servantName: currentServant,
                    challengeTitle: selectedChallenge.title,
                    pointsReward: selectedChallenge.pointsReward,
                    proof: claimProof,
                    status: 'pending',
                    date: '21 يونيو 2026'
                  };

                  const updatedClaims = [newClaim, ...claims];
                  setClaims(updatedClaims);
                  localStorage.setItem('angels_bonus_claims_v1', JSON.stringify(updatedClaims));
                  
                  setIsSubmitModalOpen(false);
                  onNotify(`تم تسجيل طلبك للحصول على ${selectedChallenge.pointsReward} نقطة بونص! بانتظار مراجعة وقرار الإدارة.`);
                }}
                className="flex-1 h-10 bg-[#15803d] hover:bg-[#15803d]/90 text-white font-label font-bold text-xs rounded-xl"
              >
                إرسال للتحقق والموافقة
              </button>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 font-label font-bold text-xs rounded-xl"
              >
                إلغاء الأمر
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
