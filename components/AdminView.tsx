/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Settings, 
  Plus, 
  BookOpen, 
  ClipboardList, 
  Users, 
  Trophy, 
  ShieldAlert, 
  Trash2, 
  Save, 
  CheckCircle, 
  Check, 
  Sparkles, 
  HelpCircle,
  FileText,
  Video,
  Mic,
  Link2,
  Activity
} from 'lucide-react';
import { SUBJECTS, ACTIVE_EXAMS_DATA, DEFAULT_PRACTICAL_SECTIONS, DEFAULT_FIELD_ALERTS, QUIZ_QUESTIONS } from '../data';

interface AdminViewProps {
  onNotify: (msg: string) => void;
  onRefreshGlobalData?: () => void;
}

export default function AdminView({ onNotify, onRefreshGlobalData }: AdminViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Admin view sections
  const [adminTab, setAdminTab] = useState<'materials' | 'exams' | 'points' | 'users' | 'practical' | 'claims'>('points');

  // Shared databases stored in localStorage
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [examsList, setExamsList] = useState<any[]>([]);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [claimsList, setClaimsList] = useState<any[]>([]);

  // Practical evaluation states
  const [practicalSections, setPracticalSections] = useState<any[]>([]);
  const [activeEditingSecId, setActiveEditingSecId] = useState<string>('visitation');

  // Alarm Alerts states
  const [fieldAlerts, setFieldAlerts] = useState<any[]>([]);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertDate, setNewAlertDate] = useState('');
  const [newAlertTime, setNewAlertTime] = useState('');
  const [newAlertLocation, setNewAlertLocation] = useState('');
  const [newAlertCategory, setNewAlertCategory] = useState<'liturgy' | 'trip' | 'conference' | 'camp' | 'festival' | 'general'>('liturgy');

  // Form states - Add Subject
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubTag, setNewSubTag] = useState('spiritual');
  
  // Form states - Add Resource to chosen subject
  const [chosenSubId, setChosenSubId] = useState('');
  const [newResTitle, setNewResTitle] = useState('');
  const [newResType, setNewResType] = useState<'pdf' | 'audio' | 'video' | 'link'>('pdf');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResDur, setNewResDur] = useState('');

  // Form states - Add Exam
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamCategory, setNewExamCategory] = useState('القسم الروحي');
  const [newExamDesc, setNewExamDesc] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(30);
  const [newExamPublishDate, setNewExamPublishDate] = useState('2026-06-01');
  const [newExamExpireDate, setNewExamExpireDate] = useState('2026-08-31');

  // Form states - Add Question to existing Exam
  const [chosenExamId, setChosenExamId] = useState('');
  const [newQText, setNewQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);

  // Form states - Give Bonus/Discount
  const [selectedServant, setSelectedServant] = useState('ميلاد بشته');
  const [allocationType, setAllocationType] = useState<'bonus' | 'discount'>('bonus');
  const [pointsAmount, setPointsAmount] = useState<number>(100);
  const [allocationReason, setAllocationReason] = useState('');

  // Program Rules Configuration states
  const [adminBonusRules, setAdminBonusRules] = useState<any[]>([]);
  const [adminDiscountRules, setAdminDiscountRules] = useState<any[]>([]);
  const [newRuleCategory, setNewRuleCategory] = useState<'bonus' | 'discount'>('bonus');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePoints, setNewRulePoints] = useState<number>(10);

  // --- NEW EDITING STATES FOR HIGH FIDELITY MANAGEMENT ---
  // 1. Edit Subject State
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editSubTitle, setEditSubTitle] = useState('');
  const [editSubDesc, setEditSubDesc] = useState('');
  const [editSubTag, setEditSubTag] = useState('spiritual');
  const [editSubBgImage, setEditSubBgImage] = useState('');

  // 2. Edit Lesson (Resource) State
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editingResourceSubId, setEditingResourceSubId] = useState<string | null>(null);
  const [editResTitle, setEditResTitle] = useState('');
  const [editResType, setEditResType] = useState<'pdf' | 'audio' | 'video' | 'link'>('pdf');
  const [editResUrl, setEditResUrl] = useState('');
  const [editResDesc, setEditResDesc] = useState('');
  const [editResDur, setEditResDur] = useState('');

  // 3. Edit Exam State
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editExamTitle, setEditExamTitle] = useState('');
  const [editExamCategory, setEditExamCategory] = useState('القسم الروحي');
  const [editExamDesc, setEditExamDesc] = useState('');
  const [editExamDuration, setEditExamDuration] = useState(30);
  const [editExamPublishDate, setEditExamPublishDate] = useState('2026-06-01');
  const [editExamExpireDate, setEditExamExpireDate] = useState('2026-08-31');

  // 4. Edit Question State
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionExamId, setEditingQuestionExamId] = useState<string | null>(null);
  const [editQText, setEditQText] = useState('');
  const [editOpt1, setEditOpt1] = useState('');
  const [editOpt2, setEditOpt2] = useState('');
  const [editOpt3, setEditOpt3] = useState('');
  const [editOpt4, setEditOpt4] = useState('');
  const [editCorrectIdx, setEditCorrectIdx] = useState(0);

  // 5. Edit Bonus/Discount Log State
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editLogServantName, setEditLogServantName] = useState('');
  const [editLogType, setEditLogType] = useState<'bonus' | 'discount'>('bonus');
  const [editLogAmount, setEditLogAmount] = useState<number>(100);
  const [editLogReason, setEditLogReason] = useState('');

  // --- NEW STATES FOR INTEGRATED HIGH-FIDELITY CRUD MANAGEMENT ---
  // A. Participant Management States
  const [customUsersList, setCustomUsersList] = useState<any[]>(() => {
    const saved = localStorage.getItem('angels_custom_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [editingCustomUserIdx, setEditingCustomUserIdx] = useState<number | null>(null);
  const [userFormFullName, setUserFormFullName] = useState('');
  const [userFormLevel, setUserFormLevel] = useState('الخادم المبتدئ - المستوى الأول');
  const [userFormService, setUserFormService] = useState('أصدقاء الملائكة (عام)');
  const [userFormPhone, setUserFormPhone] = useState('');

  // B. PDF Page-by-Page Book Preparation States
  const [prepPagesResourceId, setPrepPagesResourceId] = useState<string | null>(null);
  const [prepPages, setPrepPages] = useState<Array<{title: string, paragraphs: string[]}>>([]);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageText, setNewPageText] = useState('');

  // C. Google Sheets Questions Importer States
  const [importExamId, setImportExamId] = useState<string | null>(null);
  const [csvText, setCsvText] = useState('');

  // D. Rewards & Challenges States
  const [rewardsList, setRewardsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('angels_rewards_list_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'reward-1',
        title: 'رحلة سبيشيال طيران معالم القاهرة الكبرى',
        description: 'شاملة تذاكر الطيران، الإقامة المجانية، وتأشيرة الدخول للرحلات الكنسية المسجلة.',
        minPoints: 3000,
        centerText: 'المركز الأول',
        iconType: 'Compass'
      },
      {
        id: 'reward-2',
        title: 'رحلة ترفيهية لمدينة الثلج الكبرى',
        description: 'استمتع بيوم ترفيهي فاخر كلياً شامل كافة الأنشطة والمعدات لتطوير الروابط الأخوية.',
        minPoints: 2500,
        centerText: 'المركز الثاني',
        iconType: 'Gift'
      },
      {
        id: 'reward-3',
        title: 'عزومة عشاء فاخرة في مكان راقي وموثق',
        description: 'دعوة لشخصين تشمل وجبة عشاء فاخرة بوسط العاصمة الكبرى لتقدير إسهامك وجولتك الفنية.',
        minPoints: 2000,
        centerText: 'المركز الثالث والرابع',
        iconType: 'Utensils'
      }
    ];
  });
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [rewardFormTitle, setRewardFormTitle] = useState('');
  const [rewardFormDesc, setRewardFormDesc] = useState('');
  const [rewardFormPoints, setRewardFormPoints] = useState<number>(2000);
  const [rewardFormCenter, setRewardFormCenter] = useState('');
  const [rewardFormIcon, setRewardFormIcon] = useState<'Compass' | 'Gift' | 'Utensils' | 'Trophy'>('Gift');

  // E. Event Attendance States
  const [selectedAlertForAttendanceId, setSelectedAlertForAttendanceId] = useState<string | null>(null);

  // F. Practical Section Addition States
  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecIcon, setNewSecIcon] = useState('Compass');
  const [chosenMetricSecId, setChosenMetricSecId] = useState('');
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricMaxScore, setNewMetricMaxScore] = useState<number>(50);

  // Dynamic participants list (Including ALL custom registered users automatically)
  const getDynamicParticipants = () => {
    const defaultParticipants = [
      { name: 'ميلاد بشته', level: 'الخادم المميز - المستثني الثالث', currentService: 'أاصدقاء الملائكة (الصم والبكم)', phone: '01234567890' },
      { name: 'كيرلس يوسف غالي', level: 'الخادم المتدرب - المستوى الرابع', currentService: 'أاصدقاء الملائكة (متلازمة داون)', phone: '01278112233' },
      { name: 'ماري جرجس خليل', level: 'الخادم المميز - المستوى الثالث', currentService: 'أاصدقاء الملائكة (الصم والبكم)', phone: '01223498112' },
      { name: 'أحمد رامي سليمان', level: 'الخادم المبتدئ - المستوى الأول', currentService: 'أاصدقاء الملائكة (إعاقة حركية)', phone: '01112233445' },
      { name: 'sara_k', nameDisplay: 'سارة كميل بشاي', level: 'الخادم المتدرب - المستوى الثاني', currentService: 'أاصدقاء الملائكة (متلازمة داون)', phone: '01223344556' }
    ];
    
    let list: any[] = [
      { name: 'ميلاد بشته', level: 'الخادم المميز - المستثني الثالث', currentService: 'أصدقاء الملائكة (الصم والبكم)', phone: '01234567890' },
      { name: 'كيرلس يوسف غالي', level: 'الخادم المتدرب - المستوى الرابع', currentService: 'أصدقاء الملائكة (متلازمة داون)', phone: '01278112233' },
      { name: 'ماري جرجس خليل', level: 'الخادم المميز - المستوى الثالث', currentService: 'أصدقاء الملائكة (الصم والبكم)', phone: '01223498112' },
      { name: 'أحمد رامي سليمان', level: 'الخادم المبتدئ - المستوى الأول', currentService: 'أصدقاء الملائكة (إعاقة حركية)', phone: '01112233445' },
      { name: 'سارة كميل بشاي', level: 'الخادم المتدرب - المستوى الثاني', currentService: 'أصدقاء الملائكة (متلازمة داون)', phone: '01223344556' }
    ];

    // Read custom registered users from localStorage
    const saved = localStorage.getItem('angels_custom_users');
    if (saved) {
      try {
        const customUsers = JSON.parse(saved);
        customUsers.forEach((u: any) => {
          const name = u.fullName || u.username;
          if (name && name !== 'المدير العام للمنصة' && !list.some((dp: any) => dp.name === name)) {
            list.push({
              name: name,
              level: u.level || 'خادم مبتدئ - المستوى الأول',
              currentService: u.service || u.currentService || 'أصدقاء الملائكة (عام)',
              phone: u.phone || 'غير مسجل'
            });
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Read current logged in user from profile
    const activeProf = localStorage.getItem('angels_user_profile_v1') || sessionStorage.getItem('angels_user_profile_v1');
    if (activeProf) {
      try {
        const profile = JSON.parse(activeProf);
        const name = profile.fullName;
        if (name && name !== 'المدير العام للمنصة' && !list.some((dp: any) => dp.name === name)) {
          list.push({
            name: name,
            level: profile.level || 'خادم مبتدئ - المستوى الأول',
            currentService: profile.currentService || 'أصدقاء الملائكة (عام)',
            phone: profile.phone || 'غير مسجل'
          });
        }
      } catch (e) {}
    }

    return list;
  };

  const ALL_PARTICIPANTS = getDynamicParticipants();

  // Load backend variables
  useEffect(() => {
    // 1. Subjects
    const cachedSubs = localStorage.getItem('angels_subjects_list_v1');
    if (cachedSubs) {
      setSubjectsList(JSON.parse(cachedSubs));
    } else {
      localStorage.setItem('angels_subjects_list_v1', JSON.stringify(SUBJECTS));
      setSubjectsList(SUBJECTS);
    }

    // 2. Exams
    const cachedExams = localStorage.getItem('angels_exams_list_v2');
    if (cachedExams) {
      setExamsList(JSON.parse(cachedExams));
    } else {
      localStorage.setItem('angels_exams_list_v2', JSON.stringify(ACTIVE_EXAMS_DATA));
      setExamsList(ACTIVE_EXAMS_DATA);
    }

    // 2.5 Quiz Questions Bank
    const cachedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
    if (!cachedQuizQuestions) {
      localStorage.setItem('angels_quiz_questions_v1', JSON.stringify(QUIZ_QUESTIONS));
    }

    // 3. Scores & Logs (Discounts and Bonuses)
    const cachedLogs = localStorage.getItem('angels_bonuses_discounts_logs_v1');
    if (cachedLogs) {
      setAllLogs(JSON.parse(cachedLogs));
    } else {
      const initialLogs = [
        { id: 'bd-1', servantName: 'ميلاد بشته', type: 'bonus', amount: 120, reason: 'التميز في مسابقة كنز الرحمة وحفظ قاموس لغة الإشارة', date: 'منذ يومين' },
        { id: 'bd-2', servantName: 'كيرلس يوسف غالي', type: 'bonus', amount: 100, reason: 'الحضور المبكر للقداس الإلهي والتحضير الفعال لمادة الإعاقة', date: 'منذ ٤ أيام' },
        { id: 'bd-3', servantName: 'ماري جرجس خليل', type: 'discount', amount: 50, reason: 'تأخر متكرر عن موعد حافلة المخدمين الميدانية', date: 'منذ أسبوع' },
        { id: 'bd-4', servantName: 'أحمد رامي سليمان', type: 'bonus', amount: 150, reason: 'إعداد مجسم تعليمي مبتكر لدعم فئة الصم والبكم', date: 'منذ أسبوعين' },
        { id: 'bd-5', servantName: 'سارة كميل بشاي', type: 'discount', amount: 30, reason: 'عدم تسليم التقرير الميداني الخاص بمتلازمة داون في الوقت المحدد', date: 'منذ ٣ أسابيع' }
      ];
      localStorage.setItem('angels_bonuses_discounts_logs_v1', JSON.stringify(initialLogs));
      setAllLogs(initialLogs);
    }

    // 3.5 Load bonus claims submitted by servants
    const cachedClaims = localStorage.getItem('angels_bonus_claims_v1');
    if (cachedClaims) {
      setClaimsList(JSON.parse(cachedClaims));
    } else {
      setClaimsList([]);
    }

    // 4. Practical modules and evaluation metrics
    const cachedPractical = localStorage.getItem('angels_practical_evaluation_v2');
    if (cachedPractical) {
      setPracticalSections(JSON.parse(cachedPractical));
    } else {
      localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(DEFAULT_PRACTICAL_SECTIONS));
      setPracticalSections(DEFAULT_PRACTICAL_SECTIONS);
    }

    // 5. Field alerts & schedule calendar
    const cachedFieldAlerts = localStorage.getItem('angels_field_alerts_v2');
    if (cachedFieldAlerts) {
      setFieldAlerts(JSON.parse(cachedFieldAlerts));
    } else {
      localStorage.setItem('angels_field_alerts_v2', JSON.stringify(DEFAULT_FIELD_ALERTS));
      setFieldAlerts(DEFAULT_FIELD_ALERTS);
    }

    // 6. Program Custom Rules
    const savedRulesB = localStorage.getItem('angels_bonus_rules_v1');
    if (savedRulesB) {
      setAdminBonusRules(JSON.parse(savedRulesB));
    } else {
      const initialBonusRules = [
        { id: 'br-1', name: 'الحضور المبكر للقداس والخدمات', points: 5 },
        { id: 'br-2', name: 'الافتقاد الميداني الممتاز والمتابعة المباشرة', points: 10 },
        { id: 'br-3', name: 'الاهتمام الفردي بالمخدوم وتلبية تطلعاته', points: 10 },
        { id: 'br-4', name: 'التعاون النموذجي والمثالي مع بقية الخدام', points: 4 },
        { id: 'br-5', name: 'المساهمة في تنظيم الرحلات والأنشطة الترفيهية للأطفال', points: 15 },
        { id: 'br-6', name: 'إعداد مجسمات تعليمية مبتكرة لدعم الصم والبكم', points: 12 }
      ];
      setAdminBonusRules(initialBonusRules);
      localStorage.setItem('angels_bonus_rules_v1', JSON.stringify(initialBonusRules));
    }

    const savedRulesD = localStorage.getItem('angels_discount_rules_v1');
    if (savedRulesD) {
      setAdminDiscountRules(JSON.parse(savedRulesD));
    } else {
      const initialDiscountRules = [
        { id: 'dr-1', name: 'غياب عن حضور الفعالية أو الاجتماع بدون إذن معتمد', points: 5 },
        { id: 'dr-2', name: 'عدم حل وتسليم المهمات والتقارير الميدانية', points: 10 },
        { id: 'dr-3', name: 'سلوك لا يليق بالملعب الميداني أو غياب لغة الاحترام', points: 20 },
        { id: 'dr-4', name: 'التأخر المتكرر عن مواعيد الحافلة أو المرجعية الكنسية', points: 8 }
      ];
      setAdminDiscountRules(initialDiscountRules);
      localStorage.setItem('angels_discount_rules_v1', JSON.stringify(initialDiscountRules));
    }
  }, []);

  // Handle Admin Authorization
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      setIsAuthenticated(true);
      setPasswordError(false);
      onNotify('تم تسجيل الدخول بصلاحيات الإدارة والتحكم بنجاح!');
    } else {
      setPasswordError(true);
      setIsAuthenticated(false);
      onNotify('عذراً! الرقم السري غير صحيح. يرجى التأكد وإعادة المحاولة.');
    }
  };

  // 1. Add Subject Handler
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTitle || !newSubDesc) {
      onNotify('يرجى كتابة عنوان المادة والوصف التفصيلي أولاً.');
      return;
    }

    let tagLabel = 'مواد عامة';
    let accentColor = '#10b981';
    let icon = 'heart-pulse';
    let bgImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdB_etPZ1A9oee8MtdPs1xzbtuCBtdsI-BO4yvTbDgW73qQBBWneihh9KSfcMk6hI6SBE0LP-ji8ZIKUf3kEen9djEXgcBkjhxFvnBW1WJeUTLl470BeeGQDYnO_soWNJJewCOsyh8VfXeiWMLkjQXevQN4lnJcSfYt-jaMBT8M-Qk3A_0p6-6AvoL0xKNnd3fTfaRXZNaEB4yoYo9-nYHQGI3nWWMLbPTZAibEk5zeR7K2AFeKiCAr7aJzDvcdXz4NjgoVl2ODcrk';

    if (newSubTag === 'spiritual') {
      tagLabel = 'مواد روحية';
      accentColor = '#15803d';
      icon = 'church';
    } else if (newSubTag === 'disability') {
      tagLabel = 'مواد الإعاقة';
      accentColor = '#3b82f6';
      icon = 'accessible';
    } else if (newSubTag === 'orbital') {
      tagLabel = 'مواد مهارية';
      accentColor = '#8b5cf6';
      icon = 'network';
    } else if (newSubTag === 'humandev') {
      tagLabel = 'مواد تنمية بشرية';
      accentColor = '#f59e0b';
      icon = 'users';
    } else if (newSubTag === 'contests') {
      tagLabel = 'مواد مسابقات';
      accentColor = '#ec4899';
      icon = 'trophy';
    }

    const newSubItem = {
      id: `sub-${Date.now()}`,
      title: newSubTitle,
      lessonsCount: 0,
      progress: 0,
      tag: tagLabel,
      tagType: newSubTag,
      icon: icon,
      accentColor: accentColor,
      bgImage: bgImage,
      statusText: 'مضافة حديثاً',
      description: newSubDesc,
      resources: []
    };

    const updated = [newSubItem, ...subjectsList];
    setSubjectsList(updated);
    localStorage.setItem('angels_subjects_list_v1', JSON.stringify(updated));
    setNewSubTitle('');
    setNewSubDesc('');
    onNotify(`تم إضافة مادة "${newSubTitle}" بنجاح للطلاب!`);
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  // 2. Add Resource to selected subject
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenSubId) {
      onNotify('يرجى تحديد مادة دراسية لإجراء الإضافة.');
      return;
    }
    if (!newResTitle || !newResUrl) {
      onNotify('يرجى تعبئة عنوان الملف والرابط الإلكتروني.');
      return;
    }

    const newRes = {
      id: `res-${Date.now()}`,
      title: newResTitle,
      type: newResType,
      url: newResUrl,
      description: newResDesc || 'لا تتوفر ملاحظات إضافية لهذا الملف.',
      duration: newResDur || (newResType === 'pdf' ? '12 صفحة' : '10:00 دقائق')
    };

    const updated = subjectsList.map((sub: any) => {
      if (sub.id === chosenSubId) {
        return {
          ...sub,
          lessonsCount: sub.lessonsCount + 1,
          resources: [...sub.resources, newRes]
        };
      }
      return sub;
    });

    setSubjectsList(updated);
    localStorage.setItem('angels_subjects_list_v1', JSON.stringify(updated));
    setNewResTitle('');
    setNewResUrl('');
    setNewResDesc('');
    setNewResDur('');
    onNotify(`نم ترقية المحتوى التعليمي وإضافة الملف بنجاح!`);
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  // 3. Add Exam
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle || !newExamDesc) {
      onNotify('يرجى تعبئة بيانات عنوان الاختبار والوصف.');
      return;
    }

    const newExam = {
      id: `exam-${Date.now()}`,
      title: newExamTitle,
      description: newExamDesc,
      duration: newExamDuration,
      questionsCount: 0,
      category: newExamCategory,
      publishDate: newExamPublishDate,
      expireDate: newExamExpireDate
    };

    const updated = [newExam, ...examsList];
    setExamsList(updated);
    localStorage.setItem('angels_exams_list_v2', JSON.stringify(updated));
    setNewExamTitle('');
    setNewExamDesc('');
    onNotify(`تم تأسيس اختبار "${newExamTitle}"! يمكنك تفريع الأسئلة الآن.`);
  };

  // 4. Add custom question to quiz database
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenExamId) {
      onNotify('يرجى اختيار الاختبار الدراسي لإلحاق السؤال به.');
      return;
    }
    if (!newQText || !opt1 || !opt2 || !opt3 || !opt4) {
      onNotify('يرجى إدخال منطوق السؤال وكافة الخيارات الأربعة.');
      return;
    }

    const newQ = {
      id: `q-${Date.now()}`,
      questionText: newQText,
      options: [opt1, opt2, opt3, opt4],
      correctAnswerIndex: correctIdx
    };

    // Update locally stored quiz questions database
    const savedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
    let db: any = {};
    if (savedQuizQuestions) {
      try { db = JSON.parse(savedQuizQuestions); } catch (e) {}
    }
    
    if (!db[chosenExamId]) {
      db[chosenExamId] = [];
    }
    db[chosenExamId].push(newQ);
    localStorage.setItem('angels_quiz_questions_v1', JSON.stringify(db));

    // Also update questions count in local exams list representation
    const updatedExams = examsList.map((exam: any) => {
      if (exam.id === chosenExamId) {
        return {
          ...exam,
          questionsCount: (exam.questionsCount || 0) + 1
        };
      }
      return exam;
    });
    setExamsList(updatedExams);
    localStorage.setItem('angels_exams_list_v1', JSON.stringify(updatedExams));

    setNewQText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setCorrectIdx(0);
    onNotify('تم إضافة السؤال النموذجي وتعديل هيكلة الاختبار بنجاح!');
  };

  // 5. Allocation of Manual Bonus / Discount
  const handleAllocatePoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationReason) {
      onNotify('يرجى تحديد وتوصيف سبب وعلة هذا الرصد الإداري فورياً.');
      return;
    }

    const newLogItem = {
      id: `bd-${Date.now()}`,
      servantName: selectedServant,
      type: allocationType,
      amount: Number(pointsAmount),
      reason: allocationReason,
      date: 'اليوم (الإدارة المباشرة)'
    };

    // Store log
    const updatedLogs = [newLogItem, ...allLogs];
    setAllLogs(updatedLogs);
    localStorage.setItem('angels_bonuses_discounts_logs_v1', JSON.stringify(updatedLogs));

    // If target servant is the active participant "ميلاد بشته", sync directly to global profile state
    if (selectedServant === 'ميلاد بشته') {
      const activeProf = localStorage.getItem('angels_user_profile_v1');
      if (activeProf) {
        try {
          const profile = JSON.parse(activeProf);
          const currentPoints = profile.points || 2450;
          let newPoints = currentPoints;
          if (allocationType === 'bonus') {
            newPoints += Number(pointsAmount);
          } else {
            newPoints -= Number(pointsAmount);
          }
          profile.points = newPoints;
          localStorage.setItem('angels_user_profile_v1', JSON.stringify(profile));
        } catch (err) {}
      }
    }

    setAllocationReason('');
    setPointsAmount(100);
    onNotify(`تم تسجيل قيد ${allocationType === 'bonus' ? 'بونص وإثابة' : 'خصم وتنبيه'} بقيمة ${pointsAmount} نقطة لـ (${selectedServant})!`);
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  // --- NEW HIGH FIDELITY EDIT & DELETE HANDLERS ---
  
  // Subjects Handlers
  const handleStartEditSubject = (sub: any) => {
    setEditingSubjectId(sub.id);
    setEditSubTitle(sub.title);
    setEditSubDesc(sub.description);
    setEditSubTag(sub.tagType || 'spiritual');
    setEditSubBgImage(sub.bgImage || '');
  };

  const handleSaveEditSubject = () => {
    if (!editSubTitle || !editSubDesc) {
      onNotify('يرجى كتابة العنوان والوصف أولاً.');
      return;
    }

    let tagLabel = 'مواد عامة';
    let accentColor = '#10b981';
    let icon = 'heart-pulse';
    if (editSubTag === 'spiritual') {
      tagLabel = 'مواد روحية';
      accentColor = '#15803d';
      icon = 'church';
    } else if (editSubTag === 'disability') {
      tagLabel = 'مواد الإعاقة';
      accentColor = '#3b82f6';
      icon = 'accessible';
    } else if (editSubTag === 'orbital') {
      tagLabel = 'مواد مهارية';
      accentColor = '#8b5cf6';
      icon = 'network';
    } else if (editSubTag === 'humandev') {
      tagLabel = 'مواد تنمية بشرية';
      accentColor = '#f59e0b';
      icon = 'users';
    } else if (editSubTag === 'contests') {
      tagLabel = 'مواد مسابقات';
      accentColor = '#ec4899';
      icon = 'trophy';
    }

    const updated = subjectsList.map((sub: any) => {
      if (sub.id === editingSubjectId) {
        return {
          ...sub,
          title: editSubTitle,
          description: editSubDesc,
          tagType: editSubTag,
          tag: tagLabel,
          icon: icon,
          accentColor: accentColor,
          bgImage: editSubBgImage || sub.bgImage
        };
      }
      return sub;
    });

    setSubjectsList(updated);
    localStorage.setItem('angels_subjects_list_v1', JSON.stringify(updated));
    setEditingSubjectId(null);
    onNotify('تم تحديث بيانات المادة التعليمية والصورة بنجاح!');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleDeleteSubject = (subId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه المادة التعليمية نهائياً؟')) {
      const updated = subjectsList.filter((sub: any) => sub.id !== subId);
      setSubjectsList(updated);
      localStorage.setItem('angels_subjects_list_v1', JSON.stringify(updated));
      onNotify('تم حذف المادة بنجاح.');
      if (onRefreshGlobalData) onRefreshGlobalData();
    }
  };

  // Lessons/Resources Handlers
  const handleStartEditResource = (subId: string, res: any) => {
    setEditingResourceId(res.id);
    setEditingResourceSubId(subId);
    setEditResTitle(res.title);
    setEditResType(res.type || 'pdf');
    setEditResUrl(res.url);
    setEditResDesc(res.description || '');
    setEditResDur(res.duration || '');
  };

  const handleSaveEditResource = () => {
    if (!editResTitle || !editResUrl) {
      onNotify('يرجى تعبئة العنوان والرابط أولاً.');
      return;
    }

    const updated = subjectsList.map((sub: any) => {
      if (sub.id === editingResourceSubId) {
        const updatedResources = sub.resources.map((res: any) => {
          if (res.id === editingResourceId) {
            return {
              ...res,
              title: editResTitle,
              type: editResType,
              url: editResUrl,
              description: editResDesc,
              duration: editResDur || (editResType === 'pdf' ? '12 صفحة' : '10:00 دقائق')
            };
          }
          return res;
        });
        return {
          ...sub,
          resources: updatedResources
        };
      }
      return sub;
    });

    setSubjectsList(updated);
    localStorage.setItem('angels_subjects_list_v1', JSON.stringify(updated));
    setEditingResourceId(null);
    setEditingResourceSubId(null);
    onNotify('تم تحديث المحتوى العلمي للملف بنجاح!');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleDeleteResource = (subId: string, resId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الملف العلمي؟')) {
      const updated = subjectsList.map((sub: any) => {
        if (sub.id === subId) {
          return {
            ...sub,
            lessonsCount: Math.max(0, sub.lessonsCount - 1),
            resources: sub.resources.filter((res: any) => res.id !== resId)
          };
        }
        return sub;
      });
      setSubjectsList(updated);
      localStorage.setItem('angels_subjects_list_v1', JSON.stringify(updated));
      onNotify('تم حذف الملف بنجاح.');
      if (onRefreshGlobalData) onRefreshGlobalData();
    }
  };

  // Exams Handlers
  const handleStartEditExam = (exam: any) => {
    setEditingExamId(exam.id);
    setEditExamTitle(exam.title);
    setEditExamCategory(exam.category);
    setEditExamDesc(exam.description);
    setEditExamDuration(exam.duration);
    setEditExamPublishDate(exam.publishDate || '2026-06-01');
    setEditExamExpireDate(exam.expireDate || '2026-08-31');
  };

  const handleSaveEditExam = () => {
    if (!editExamTitle || !editExamDesc) {
      onNotify('يرجى تعبئة عنوان الاختبار والوصف.');
      return;
    }

    const updated = examsList.map((exam: any) => {
      if (exam.id === editingExamId) {
        return {
          ...exam,
          title: editExamTitle,
          category: editExamCategory,
          description: editExamDesc,
          duration: Number(editExamDuration),
          publishDate: editExamPublishDate,
          expireDate: editExamExpireDate
        };
      }
      return exam;
    });

    setExamsList(updated);
    localStorage.setItem('angels_exams_list_v2', JSON.stringify(updated));
    setEditingExamId(null);
    onNotify('تم تحديث الاختبار بنجاح!');
  };

  const handleDeleteExam = (examId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاختبار وجميع الأسئلة والنتائج المرتبطة به؟')) {
      const updated = examsList.filter((exam: any) => exam.id !== examId);
      setExamsList(updated);
      localStorage.setItem('angels_exams_list_v2', JSON.stringify(updated));
      
      // Also delete from quiz questions
      const savedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
      if (savedQuizQuestions) {
        try {
          const db = JSON.parse(savedQuizQuestions);
          delete db[examId];
          localStorage.setItem('angels_quiz_questions_v1', JSON.stringify(db));
        } catch (e) {}
      }
      onNotify('تم حذف الاختبار وبنك الأسئلة الخاص به بنجاح.');
    }
  };

  // Quiz Questions Handlers
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);

  const handleStartEditQuestion = (examId: string, q: any, qIdx: number) => {
    setEditingQuestionExamId(examId);
    setEditingQuestionIdx(qIdx);
    setEditQText(q.questionText);
    setEditOpt1(q.options[0] || '');
    setEditOpt2(q.options[1] || '');
    setEditOpt3(q.options[2] || '');
    setEditOpt4(q.options[3] || '');
    setEditCorrectIdx(q.correctAnswerIndex || 0);
  };

  const handleSaveEditQuestion = () => {
    if (!editingQuestionExamId || editingQuestionIdx === null) return;
    if (!editQText || !editOpt1 || !editOpt2 || !editOpt3 || !editOpt4) {
      onNotify('يرجى تعبئة منطوق السؤال وجميع الخيارات.');
      return;
    }

    const savedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
    let db: any = {};
    if (savedQuizQuestions) {
      try { db = JSON.parse(savedQuizQuestions); } catch (e) {}
    }

    if (!db[editingQuestionExamId]) {
      db[editingQuestionExamId] = [];
    }

    db[editingQuestionExamId][editingQuestionIdx] = {
      id: db[editingQuestionExamId][editingQuestionIdx]?.id || `q-${Date.now()}`,
      questionText: editQText,
      options: [editOpt1, editOpt2, editOpt3, editOpt4],
      correctAnswerIndex: editCorrectIdx
    };

    localStorage.setItem('angels_quiz_questions_v1', JSON.stringify(db));
    setEditingQuestionExamId(null);
    setEditingQuestionIdx(null);
    
    // Clear inputs
    setEditQText('');
    setEditOpt1('');
    setEditOpt2('');
    setEditOpt3('');
    setEditOpt4('');
    setEditCorrectIdx(0);
    
    onNotify('تم تعديل السؤال بنجاح وتوطينه في بنك الأسئلة!');
  };

  const handleDeleteQuestion = (examId: string, qIdx: number) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا السؤال من الاختبار نهائياً؟')) {
      const savedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
      let db: any = {};
      if (savedQuizQuestions) {
        try { db = JSON.parse(savedQuizQuestions); } catch (e) {}
      }

      if (db[examId]) {
        db[examId].splice(qIdx, 1);
        localStorage.setItem('angels_quiz_questions_v1', JSON.stringify(db));
      }

      // Decrement question count in exams list
      const updatedExams = examsList.map((exam: any) => {
        if (exam.id === examId) {
          return {
            ...exam,
            questionsCount: Math.max(0, (exam.questionsCount || 0) - 1)
          };
        }
        return exam;
      });
      setExamsList(updatedExams);
      localStorage.setItem('angels_exams_list_v2', JSON.stringify(updatedExams));

      onNotify('تم حذف السؤال وتحديث عدد أسئلة الاختبار.');
    }
  };

  // Points Logs Handlers (Discounts and Bonuses Logs)
  const handleStartEditLog = (log: any) => {
    setEditingLogId(log.id);
    setEditLogServantName(log.servantName);
    setEditLogType(log.type);
    setEditLogAmount(log.amount);
    setEditLogReason(log.reason);
  };

  const handleSaveEditLog = () => {
    if (!editLogReason || !editLogServantName) {
      onNotify('يرجى تعبئة اسم العضو وتوصيف السبب.');
      return;
    }

    const updated = allLogs.map((log: any) => {
      if (log.id === editingLogId) {
        return {
          ...log,
          servantName: editLogServantName,
          type: editLogType,
          amount: Number(editLogAmount),
          reason: editLogReason
        };
      }
      return log;
    });

    setAllLogs(updated);
    localStorage.setItem('angels_bonuses_discounts_logs_v1', JSON.stringify(updated));
    setEditingLogId(null);
    onNotify('تم تحديث قيد الخصم/البونص بنجاح!');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleDeleteLog = (logId: string) => {
    if (window.confirm('هل تريد حذف قيد الخصم/البونص هذا نهائياً من سجل العضو؟')) {
      const updated = allLogs.filter((log: any) => log.id !== logId);
      setAllLogs(updated);
      localStorage.setItem('angels_bonuses_discounts_logs_v1', JSON.stringify(updated));
      onNotify('تم حذف القيد الإداري بنجاح.');
      if (onRefreshGlobalData) onRefreshGlobalData();
    }
  };

  const handleUpdateItemScore = (sectionId: string, itemId: string, field: 'maxScore' | 'achievedScore', val: number) => {
    const updated = practicalSections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map((it: any) => {
            if (it.id === itemId) {
              return {
                ...it,
                [field]: Number(val)
              };
            }
            return it;
          })
        };
      }
      return sec;
    });
    setPracticalSections(updated);
  };

  const handleSavePracticalScores = () => {
    localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(practicalSections));
    
    // Sum and write dynamic fieldwork total score
    let totalAchieved = 0;
    practicalSections.forEach(sec => {
      sec.items.forEach(it => {
        totalAchieved += it.achievedScore;
      });
    });
    localStorage.setItem('angels_fieldwork_total_score_v2', totalAchieved.toString());
    
    onNotify('✓ تم تحديث وحفظ درجات التقييم الميداني وإعادة احتساب المجموع الكلي ومستوى الخدمة للدارس بنجاح!');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertDate || !newAlertTime || !newAlertLocation) {
      onNotify('يرجى ملء تفاصيل التنبيه الميداني المجدول أولاً.');
      return;
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: newAlertTitle,
      category: newAlertCategory,
      date: newAlertDate,
      time: newAlertTime,
      location: newAlertLocation
    };

    const updatedAlerts = [newAlert, ...fieldAlerts];
    setFieldAlerts(updatedAlerts);
    localStorage.setItem('angels_field_alerts_v2', JSON.stringify(updatedAlerts));
    
    setNewAlertTitle('');
    setNewAlertDate('');
    setNewAlertTime('');
    setNewAlertLocation('');
    onNotify(`✓ تم نشر وتعميم التنبيه الميداني المجدول: "${newAlertTitle}" وإرساله لجميع الهواتف.`);
  };

  const handleDeleteAlert = (id: string, title: string) => {
    const filtered = fieldAlerts.filter(a => a.id !== id);
    setFieldAlerts(filtered);
    localStorage.setItem('angels_field_alerts_v2', JSON.stringify(filtered));
    onNotify(`✕ تم حذف وإلغاء جدولة التنبيه: "${title}".`);
  };

  // --- NEW HANDLERS FOR ADMINISTRATIVE OPERATION EXTENSIONS ---
  // A. Custom User Profiles (CRUD)
  const handleAddOrEditCustomUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormFullName.trim() || !userFormPhone.trim()) {
      onNotify('يرجى كتابة الاسم ورقم الهاتف بالكامل.');
      return;
    }

    let updatedList = [...customUsersList];
    const newUser = {
      fullName: userFormFullName.trim(),
      username: userFormFullName.trim(),
      level: userFormLevel,
      currentService: userFormService,
      service: userFormService,
      phone: userFormPhone.trim()
    };

    if (editingCustomUserIdx !== null) {
      updatedList[editingCustomUserIdx] = newUser;
      onNotify(`✓ تم تحديث بيانات العضو "${userFormFullName}" بنجاح!`);
      setEditingCustomUserIdx(null);
    } else {
      updatedList = [newUser, ...updatedList];
      onNotify(`✓ تم تسجيل وإلحاق العضو الجديد "${userFormFullName}" بالدفعة!`);
    }

    setCustomUsersList(updatedList);
    localStorage.setItem('angels_custom_users', JSON.stringify(updatedList));
    setUserFormFullName('');
    setUserFormPhone('');
    setUserFormService('أصدقاء الملائكة (عام)');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleDeleteCustomUser = (idx: number, name: string) => {
    if (window.confirm(`هل أنت متأكد تماماً من حذف العضو "${name}" نهائياً من قاعدة بيانات الدفعة؟`)) {
      const updatedList = customUsersList.filter((_, i) => i !== idx);
      setCustomUsersList(updatedList);
      localStorage.setItem('angels_custom_users', JSON.stringify(updatedList));
      onNotify(`✕ تم إقصاء وحذف العضو "${name}" من جداول الدفعة.`);
      if (onRefreshGlobalData) onRefreshGlobalData();
    }
  };

  const handleStartEditCustomUser = (idx: number) => {
    const user = customUsersList[idx];
    setEditingCustomUserIdx(idx);
    setUserFormFullName(user.fullName || user.username || '');
    setUserFormLevel(user.level || 'الخادم المبتدئ - المستوى الأول');
    setUserFormService(user.service || user.currentService || 'أصدقاء الملائكة (عام)');
    setUserFormPhone(user.phone || '');
  };

  // B. Book Page-by-Page Prep
  const handleOpenBookPrep = (resId: string) => {
    setPrepPagesResourceId(resId);
    const saved = localStorage.getItem(`custom_pdf_pages_${resId}`);
    if (saved) {
      try {
        setPrepPages(JSON.parse(saved));
      } catch (e) {
        setPrepPages([]);
      }
    } else {
      setPrepPages([]);
    }
  };

  const handleSaveBookPrep = () => {
    if (!prepPagesResourceId) return;
    localStorage.setItem(`custom_pdf_pages_${prepPagesResourceId}`, JSON.stringify(prepPages));
    onNotify('✓ تم تخريد وحفظ صفحات الكتاب بنجاح للتصفح صفحة بصفحة!');
    setPrepPagesResourceId(null);
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleAddPrepPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageText.trim()) {
      onNotify('برجاء كتابة عنوان الصفحة والفقرة النصية أولاً.');
      return;
    }
    const newPage = {
      title: newPageTitle.trim(),
      paragraphs: [newPageText.trim()]
    };
    setPrepPages([...prepPages, newPage]);
    setNewPageTitle('');
    setNewPageText('');
    onNotify('✓ تم إلحاق الصفحة بمسودة الكتاب.');
  };

  const handleDeletePrepPage = (idx: number) => {
    setPrepPages(prepPages.filter((_, i) => i !== idx));
    onNotify('✕ تم حذف الصفحة من المسودة.');
  };

  // C. Sheets Importer (Simulator)
  const handleImportFromCSV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importExamId) return;
    if (!csvText.trim()) {
      onNotify('يرجى لصق بيانات الأسئلة أولاً.');
      return;
    }

    // Process sheet rows
    const lines = csvText.trim().split('\n');
    const parsedQuestions: any[] = [];

    lines.forEach((line) => {
      const parts = line.split(',');
      if (parts.length >= 6) {
        const qText = parts[0].trim();
        const opts = [parts[1].trim(), parts[2].trim(), parts[3].trim(), parts[4].trim()];
        const correct = Math.max(0, Math.min(3, parseInt(parts[5].trim()) - 1 || 0));
        parsedQuestions.push({
          id: `imported-q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          questionText: qText,
          options: opts,
          correctAnswerIdx: correct
        });
      }
    });

    if (parsedQuestions.length === 0) {
      // Create mockup questions if simple text pasted
      parsedQuestions.push({
        id: `imported-q-${Date.now()}-1`,
        questionText: csvText.trim().substr(0, 80) + '؟',
        options: ['الخيار الأول (المطروح)', 'الخيار الثاني (التلقائي)', 'الخيار الثالث', 'الخيار الرابع'],
        correctAnswerIdx: 0
      });
    }

    const savedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
    let db: any = {};
    if (savedQuizQuestions) {
      try { db = JSON.parse(savedQuizQuestions); } catch (e) {}
    }

    db[importExamId] = [...(db[importExamId] || []), ...parsedQuestions];
    localStorage.setItem('angels_quiz_questions_v1', JSON.stringify(db));

    // Update questions count
    const updatedExams = examsList.map((exam: any) => {
      if (exam.id === importExamId) {
        return {
          ...exam,
          questionsCount: (exam.questionsCount || 0) + parsedQuestions.length
        };
      }
      return exam;
    });
    setExamsList(updatedExams);
    localStorage.setItem('angels_exams_list_v2', JSON.stringify(updatedExams));

    onNotify(`✓ تم استيراد وربط عدد ${parsedQuestions.length} سؤال من جوجل شيت بنجاح!`);
    setImportExamId(null);
    setCsvText('');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  // D. Rewards & Challenges
  const handleAddOrEditReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardFormTitle.trim() || !rewardFormDesc.trim()) {
      onNotify('يرجى كتابة الاسم والوصف للمكافأة.');
      return;
    }

    let updated = [...rewardsList];
    const newReward = {
      id: editingRewardId || `reward-${Date.now()}`,
      title: rewardFormTitle.trim(),
      description: rewardFormDesc.trim(),
      minPoints: Number(rewardFormPoints),
      centerText: rewardFormCenter.trim() || `${rewardFormPoints} نقطة`,
      iconType: rewardFormIcon
    };

    if (editingRewardId) {
      updated = updated.map(r => r.id === editingRewardId ? newReward : r);
      onNotify(`✓ تم تعديل المكافأة التنافسية "${rewardFormTitle}" بنجاح!`);
      setEditingRewardId(null);
    } else {
      updated = [newReward, ...updated];
      onNotify(`✓ تم تأسيس وإضافة المكافأة التنافسية الجديدة: "${rewardFormTitle}"`);
    }

    setRewardsList(updated);
    localStorage.setItem('angels_rewards_list_v1', JSON.stringify(updated));
    setRewardFormTitle('');
    setRewardFormDesc('');
    setRewardFormCenter('');
  };

  const handleDeleteReward = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المكافأة "${title}" نهائياً من العروض التنافسية للدفعة؟`)) {
      const updated = rewardsList.filter(r => r.id !== id);
      setRewardsList(updated);
      localStorage.setItem('angels_rewards_list_v1', JSON.stringify(updated));
      onNotify(`✕ تم حذف وإلغاء مكافأة "${title}".`);
    }
  };

  const handleStartEditReward = (reward: any) => {
    setEditingRewardId(reward.id);
    setRewardFormTitle(reward.title);
    setRewardFormDesc(reward.description);
    setRewardFormPoints(reward.minPoints);
    setRewardFormCenter(reward.centerText || '');
    setRewardFormIcon(reward.iconType || 'Gift');
  };

  // E. Practical Evaluations & Criteria
  const handleAddPracticalSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecTitle.trim()) {
      onNotify('يرجى تحديد مسمى مميز للقسم الجديد.');
      return;
    }

    const newSection = {
      id: `sec-${Date.now()}`,
      title: newSecTitle.trim(),
      icon: newSecIcon,
      items: [
        { id: `item-${Date.now()}-1`, label: 'الحضور والانضباط السلوكي العام للخدمة', maxScore: 50, achievedScore: 45 },
        { id: `item-${Date.now()}-2`, label: 'المبادرة الذاتية والتعاطف الفعال والتواصل المباشر', maxScore: 50, achievedScore: 40 }
      ]
    };

    const updated = [...practicalSections, newSection];
    setPracticalSections(updated);
    localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(updated));
    setNewSecTitle('');
    onNotify(`✓ تم إضافة قسم تقييم ميداني جديد باسم: "${newSection.title}"`);
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleAddPracticalMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenMetricSecId || !newMetricLabel.trim()) {
      onNotify('يرجى ملء البند التقييمي وتحديد القسم أولاً.');
      return;
    }

    const updated = practicalSections.map(sec => {
      if (sec.id === chosenMetricSecId) {
        return {
          ...sec,
          items: [
            ...sec.items,
            {
              id: `item-${Date.now()}`,
              label: newMetricLabel.trim(),
              maxScore: Number(newMetricMaxScore),
              achievedScore: Math.round(Number(newMetricMaxScore) * 0.8)
            }
          ]
        };
      }
      return sec;
    });

    setPracticalSections(updated);
    localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(updated));
    setNewMetricLabel('');
    onNotify(`✓ تم إضافة بند التقييم الميداني "${newMetricLabel}" للقسم بنجاح!`);
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  const handleDeletePracticalSection = (secId: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم التقييم "${title}" بالكامل بما فيه من درجات وبنود؟`)) {
      const updated = practicalSections.filter(sec => sec.id !== secId);
      setPracticalSections(updated);
      localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(updated));
      onNotify(`✕ تم حذف القسم "${title}".`);
      if (onRefreshGlobalData) onRefreshGlobalData();
    }
  };

  const handleDeletePracticalItem = (secId: string, itemId: string, label: string) => {
    if (window.confirm(`هل أنت متأكد من حذف البند التقييمي "${label}" نهائياً؟`)) {
      const updated = practicalSections.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            items: sec.items.filter((it: any) => it.id !== itemId)
          };
        }
        return sec;
      });
      setPracticalSections(updated);
      localStorage.setItem('angels_practical_evaluation_v2', JSON.stringify(updated));
      onNotify(`✕ تم حذف البند التقييمي "${label}".`);
      if (onRefreshGlobalData) onRefreshGlobalData();
    }
  };

  // Helper clear action just in case admin wants to reset logs
  const handleResetLogs = () => {
    if (window.confirm('هل أنت متأكد تماماً من رغبتك في تصفير سجلات الإدارة والخصومات والبونص والرجوع للقيم الافتراضية؟')) {
      localStorage.removeItem('angels_bonuses_discounts_logs_v1');
      localStorage.removeItem('angels_user_profile_v1');
      localStorage.removeItem('angels_subjects_list_v1');
      localStorage.removeItem('angels_exams_list_v1');
      onNotify('تم إرجاع كافة قواعد البيانات والقوالب لوضع التأسيس بنجاح.');
      window.location.reload();
    }
  };


  // Screen 1: Password Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12" id="admin_auth_gate">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/95 shadow-xl text-center">
          <div className="w-16 h-16 bg-[#dcfce7] text-[#15803d] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          
          <h2 className="font-display text-xl font-black text-[#151c27]">بوابة الإدارة وغرفة التحكم والتميز</h2>
          <p className="font-sans text-xs text-slate-400 mt-2 leading-relaxed">
            يرجى إدخال الرقم السري المعتمد لمشرف ومطوّر مؤسسة خادمي أصدقاء الملائكة. الرقم السري الافتراضي هو <span className="font-mono font-bold text-red-650 bg-red-50 px-1 py-0.5 rounded-md">123456</span>
          </p>

          <form onSubmit={handleAuthSubmit} className="mt-8 space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="أدخل الرمز السري هنا..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-11 text-center font-mono text-lg rounded-xl border ${
                  passwordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50'
                } focus:ring-1 focus:ring-[#15803d] focus:border-[#15803d] outline-none transition-all`}
                required
              />
              {passwordError && (
                <p className="font-sans text-[10px] text-red-600 font-bold mt-2">✕ رمز العبور خاطئ! يرجى إعادة التحقق.</p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-[#15803d] hover:bg-[#15803d] text-white font-label font-extrabold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>إلغاء قفل بوابة التحكم</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[10px]">
            <span>مؤسسة أصدقاء الملائكة</span>
            <span>التحكم المالي والتربوي</span>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Main Administrative Control Room Unlocked
  return (
    <div className="space-y-8 text-right" id="admin_control_room_root">
      
      {/* Top Welcome Title Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden" id="admin_unlocked_banner">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#15803d]/20 rounded-br-full blend-overlay pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#15803d] text-blue-100 text-[10px] font-bold rounded-lg mb-3">
              <Unlock className="w-3.5 h-3.5" />
              <span>صلاحيات المدير العام متصلة</span>
            </div>
            <h2 className="font-display text-xl font-black tracking-tight flex items-center gap-2">
              <span>لوحة الإدارة الشاملة ووضع الاختبارات والمواد</span>
            </h2>
            <p className="font-sans text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
              مرحبًا بك في لوحة تحكم أصدقاء الملائكة. يمكنك الآن رصد الخصومات والبونص وتأسيس المناهج والمواد التدريبية، وإضافة فصول المحاضرات ومسائل الامتحانات وحفظ الاستمرارية.
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleResetLogs}
              className="px-3.5 py-2 whitespace-nowrap bg-red-650 bg-red-650/40 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all border border-red-500/25 cursor-pointer"
            >
              فرمتة البيانات الافتراضية
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              قفل اللوحة والخروج
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs under Admin Room */}
      <div className="flex overflow-x-auto pb-1 gap-1.5" id="admin_tab_dock">
        {[
          { id: 'points', label: 'رصد الخصومات والبونص الفوري', icon: Trophy },
          { id: 'claims', label: 'طلبات مراجعة البونص والمنافسات العامة', icon: Activity },
          { id: 'practical', label: 'إدارة التقييم الميداني والمهام المجدولة', icon: Activity },
          { id: 'materials', label: 'تخطيط وإضافة المواد العلمية', icon: BookOpen },
          { id: 'exams', label: 'تأسيس الاختبارات وبنك الأسئلة', icon: ClipboardList },
          { id: 'users', label: 'دليل خدام الدفعة والتقييمات', icon: Users }
        ].map((item) => {
          const ItemIcon = item.icon;
          const isSelected = adminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id as any)}
              className={`px-4.5 py-3 rounded-xl text-xs font-label font-black flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                isSelected 
                  ? 'bg-[#15803d] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ItemIcon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel 1: Manual Points Allocation Form */}
      {adminTab === 'points' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="panel_points_management">
          
          {/* Action Allocation Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs lg:col-span-2">
            {editingLogId ? (
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 mb-2">
                <h4 className="font-display font-black text-xs text-amber-850 mb-3 flex items-center gap-1.5 text-right">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>تعديل قيد الرصد المالي والإداري النشط</span>
                </h4>
                
                <div className="space-y-4 text-right">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">اسم الخادم الدارس:</label>
                      <select 
                        value={editLogServantName}
                        onChange={(e) => setEditLogServantName(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                      >
                        {ALL_PARTICIPANTS.map((serv) => (
                          <option key={serv.name} value={serv.name}>{serv.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">نوع الرصد:</label>
                      <div className="grid grid-cols-2 gap-2 h-11">
                        <button
                          type="button"
                          onClick={() => setEditLogType('bonus')}
                          className={`rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                            editLogType === 'bonus' 
                              ? 'bg-emerald-600 text-white border-emerald-600 font-black' 
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Trophy className="w-4 h-4" />
                          <span>إثابة وبونص (+)</span >
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditLogType('discount')}
                          className={`rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                            editLogType === 'discount' 
                              ? 'bg-red-650 text-white border-red-650 font-black' 
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>خصم ومخالفة (-)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">قيمة النقاط المستحقة:</label>
                      <input 
                        type="number"
                        value={editLogAmount}
                        onChange={(e) => setEditLogAmount(Number(e.target.value))}
                        className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-2">السبب والعلة بالتفصيل والتوثيق الميداني:</label>
                      <input 
                        type="text" 
                        value={editLogReason}
                        onChange={(e) => setEditLogReason(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveEditLog}
                      className="flex-grow h-11 bg-amber-600 hover:bg-amber-700 text-white font-label font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>حفظ التعديلات وتحديث سجل العضو</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingLogId(null)}
                      className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-label font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h4 className="font-display font-black text-xs text-[#15803d] mb-5 pb-3 border-b border-slate-100 uppercase tracking-widest">
                  رصد مخالفة أو بونص تشجيعي فوري
                </h4>

            <form onSubmit={handleAllocatePoints} className="space-y-5">
              
              {/* Select Servant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">اختر الخادم الدارس:</label>
                  <select 
                    value={selectedServant}
                    onChange={(e) => setSelectedServant(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  >
                    {ALL_PARTICIPANTS.map((serv) => (
                      <option key={serv.name} value={serv.name}>{serv.name} ({serv.level.split('-')[0]})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">نوع الرصد والمدونة المالية:</label>
                  <div className="grid grid-cols-2 gap-2 h-11">
                    <button
                      type="button"
                      onClick={() => setAllocationType('bonus')}
                      className={`rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                        allocationType === 'bonus' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-black' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                      <span>إثابة وبونص (+)</span >
                    </button>

                    <button
                      type="button"
                      onClick={() => setAllocationType('discount')}
                      className={`rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                        allocationType === 'discount' 
                          ? 'bg-red-50 text-red-700 border-red-300 font-black' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>خصم ومخالفة (-)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Points value */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">قيمة النقاط المستحقة:</label>
                  <select 
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(Number(e.target.value))}
                    className="w-full h-11 bg-slate-50 border border-slate-250 rounded-xl px-3 font-mono text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  >
                    <option value={30}>30 نقطة (مخالفة طفيفة)</option>
                    <option value={50}>50 نقطة (متوسطة)</option>
                    <option value={80}>80 نقطة (افتراضية)</option>
                    <option value={100}>100 نقطة (عالية / مكافأة عادية)</option>
                    <option value={150}>150 نقطة (مكافأة تميز عظيمة)</option>
                    <option value={200}>200 نقطة (حدث استثنائي)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-2">السبب والعلة بالتفصيل والتوثيق الميداني:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: غياب عن الافتقاد، أو التميز في حفظ قاموس لغة الإشارة..."
                    value={allocationReason}
                    onChange={(e) => setAllocationReason(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-[#15803d] hover:bg-[#15803d] text-white font-label font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>تنفيذ الرصد والتعديل الفوري لموازنة الدرجات</span>
                </button>
              </div>

            </form>
              </>
            )}
          </div>

          {/* Quick Logs list of All participants */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-display font-black text-xs text-slate-600 mb-4 pb-2 border-b border-slate-100">
                أحدث 5 رصود للأعضاء على المنصة
              </h4>

              <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-0.5">
                {allLogs.slice(0, 5).map((logItem, idx) => (
                  <div key={logItem.id || idx} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-start">
                    <div className="text-right">
                      <p className="font-display text-xs font-black text-slate-800">{logItem.servantName}</p>
                      <p className="font-sans text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">{logItem.reason}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <span className={`font-display font-bold text-xs ${
                        logItem.type === 'bonus' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {logItem.type === 'bonus' ? `+${logItem.amount}` : `-${logItem.amount}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100/60 font-sans text-[10px] text-slate-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>الرصود مباشرة المزامنة والربط فورية بالنتائج</span>
            </div>
          </div>

        </div>

        {/* Expanded Section: Full Control of discounts & bonuses log */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm mt-6">
          <h4 className="font-display font-black text-xs text-[#1c305c] mb-2 uppercase tracking-widest text-right">
            📊 كشف الحساب والتحكم الكامل في الخصومات والبونص الصادرة
          </h4>
          <p className="font-sans text-[11px] text-slate-400 mb-4 text-right">
            يمكنك هنا استعراض لائحة القيود الصادرة، مع إمكانية تعديل قيم النقاط وتوصيف السبب أو الحذف النهائي المباشر للقيد.
          </p>

          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <table className="w-full text-right font-sans text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-slate-600 font-bold">
                  <th className="p-3">اسم الخادم الدارس</th>
                  <th className="p-3">نوع الحركة</th>
                  <th className="p-3 text-center">النقاط الصادرة</th>
                  <th className="p-3 text-right">السبب / الملاحظة</th>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">لا توجد سجلات خصومات أو بونص مسجلة حالياً.</td>
                  </tr>
                ) : (
                  allLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{log.servantName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          log.type === 'bonus' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {log.type === 'bonus' ? 'بونص وإثابة' : 'خصم ومخالفة'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span className={log.type === 'bonus' ? 'text-emerald-600' : 'text-red-600'}>
                          {log.type === 'bonus' ? `+${log.amount}` : `-${log.amount}`}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 max-w-xs truncate text-right" title={log.reason}>{log.reason}</td>
                      <td className="p-3 text-slate-400 font-mono text-[10px] text-right">{log.date}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStartEditLog(log)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Rules Customizer Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm mt-6 space-y-6" id="panel_rules_configuration">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div>
              <h4 className="font-display font-black text-xs text-[#15803d] uppercase tracking-widest">إدارة وتحديث لائحة البونص والخصومات</h4>
              <p className="font-sans text-[11px] text-slate-400 mt-1">تتيح لك هذه اللوحة التحكم الفوري في القيم المسجلة للائحة، وإضافة بنود جديدة للتقييم.</p>
            </div>
            
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              <button 
                type="button"
                onClick={() => setNewRuleCategory('bonus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  newRuleCategory === 'bonus' ? 'bg-emerald-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                لائحة البونص (+)
              </button>
              <button 
                type="button"
                onClick={() => setNewRuleCategory('discount')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  newRuleCategory === 'discount' ? 'bg-red-650 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-850'
                }`}
              >
                لائحة الخصومات (-)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rules list with inputs for points */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="font-display font-black text-xs text-slate-705">البنود الحالية في لائحة {newRuleCategory === 'bonus' ? 'البونص والتميز' : 'الانضباط والخصومات'}:</h5>
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {(newRuleCategory === 'bonus' ? adminBonusRules : adminDiscountRules).map((rule, idx) => (
                  <div key={rule.id || idx} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-3">
                    <span className="font-sans text-xs font-bold text-slate-850 pr-1">{rule.name}</span>
                    <div className="flex items-center gap-2 text-right">
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg py-1 px-2.5">
                        <span className="font-sans text-[10px] text-slate-400 font-bold">النقاط:</span>
                        <input 
                          type="number" 
                          value={rule.points}
                          onChange={(e) => {
                            const newPoints = Number(e.target.value);
                            if (newRuleCategory === 'bonus') {
                              const updated = adminBonusRules.map(r => r.id === rule.id ? { ...r, points: newPoints } : r);
                              setAdminBonusRules(updated);
                              localStorage.setItem('angels_bonus_rules_v1', JSON.stringify(updated));
                            } else {
                              const updated = adminDiscountRules.map(r => r.id === rule.id ? { ...r, points: newPoints } : r);
                              setAdminDiscountRules(updated);
                              localStorage.setItem('angels_discount_rules_v1', JSON.stringify(updated));
                            }
                          }}
                          className="w-10 text-center font-mono text-xs font-extrabold text-slate-800 outline-none"
                        />
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => {
                          if (newRuleCategory === 'bonus') {
                            const updated = adminBonusRules.filter(r => r.id !== rule.id);
                            setAdminBonusRules(updated);
                            localStorage.setItem('angels_bonus_rules_v1', JSON.stringify(updated));
                          } else {
                            const updated = adminDiscountRules.filter(r => r.id !== rule.id);
                            setAdminDiscountRules(updated);
                            localStorage.setItem('angels_discount_rules_v1', JSON.stringify(updated));
                          }
                          onNotify('تم حذف البند من اللائحة بنجاح!');
                        }}
                        className="text-xs text-red-650 font-bold bg-white hover:bg-red-50 border border-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form to add a new rule */}
            <div className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200 space-y-4">
              <h5 className="font-display font-black text-xs text-slate-800">إضافة بند جديد للائحة:</h5>
              
              <div className="space-y-3 text-right">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5">بيان البند أو السلوك:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: الحضور النشط لدورات التعاطف..."
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5">النقاط الافتراضية للبند:</label>
                  <input 
                    type="number" 
                    placeholder="مثال: 15"
                    value={newRulePoints}
                    onChange={(e) => setNewRulePoints(Number(e.target.value))}
                    className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-mono text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    if (!newRuleName.trim()) {
                      onNotify('يرجى كتابة مسمى صحيح للبند أولاً.');
                      return;
                    }
                    const newRule = {
                      id: `${newRuleCategory === 'bonus' ? 'br' : 'dr'}-${Date.now()}`,
                      name: newRuleName,
                      points: newRulePoints || 5
                    };
                    if (newRuleCategory === 'bonus') {
                      const updated = [...adminBonusRules, newRule];
                      setAdminBonusRules(updated);
                      localStorage.setItem('angels_bonus_rules_v1', JSON.stringify(updated));
                    } else {
                      const updated = [...adminDiscountRules, newRule];
                      setAdminDiscountRules(updated);
                      localStorage.setItem('angels_discount_rules_v1', JSON.stringify(updated));
                    }
                    setNewRuleName('');
                    setNewRulePoints(10);
                    onNotify('تمت إضافة البند الجديد للائحة بنجاح وبشكل متكامل!');
                  }}
                  className="w-full h-10 bg-[#1c305c] hover:bg-blue-900 text-white font-label font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  تأكيد وإدراج باللائحة
                </button>
              </div>

            </div>

          </div>
        </div>
        </>
      )}

      {/* Panel 2: Materials management */}
      {adminTab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="panel_materials_manager">
          
          {/* Subpanel 1: Add general syllabus subject */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-display font-black text-xs text-[#15803d] pb-3 border-b border-slate-100 mb-4 uppercase tracking-wider">
              تأسيس مساق مادة تعليمية جديدة
            </h4>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2.5">اسم المادة التعليمية:</label>
                <input 
                  type="text" 
                  placeholder="مثال: لاهوت مقارن، آليات تنمية مهارات كنسية..."
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2.5">تصنيف المادة:</label>
                  <select
                    value={newSubTag}
                    onChange={(e) => setNewSubTag(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  >
                    <option value="spiritual">مواد روحية</option>
                    <option value="disability">مواد الإعاقة</option>
                    <option value="general">مواد عامة</option>
                    <option value="orbital">مواد مهارية</option>
                    <option value="humandev">مواد تنمية بشرية</option>
                    <option value="contests">مواد مسابقات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2.5">المستوى المستهدف:</label>
                  <div className="h-11 flex items-center justify-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400">
                    متاح لكافة المستويات
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2.5">الوصف التفصيلي والمنهاج الدراسي:</label>
                <textarea 
                  rows={3}
                  placeholder="حدد غايات المادة والدروس الروحية والمكتسبات..."
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#15803d] hover:bg-[#15803d] text-white font-label font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة المادة وتثبيتها بقائمة المناهج</span>
              </button>
            </form>
          </div>

          {/* Subpanel 2: Adding pdf/audio/video resource files directly */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-display font-black text-xs text-purple-700 pb-3 border-b border-slate-100 mb-4 uppercase tracking-wider">
              إضافة كتب ومحاضرات وصوتيات للمادة علمياً
            </h4>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2.5">اختر المادة الحاضنة للدرس:</label>
                <select 
                  value={chosenSubId}
                  onChange={(e) => setChosenSubId(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                >
                  <option value="">-- اضغط للاختيار --</option>
                  {subjectsList.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.title} ({sub.tag})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2.5">نوع الملف والوسيط العلمي:</label>
                  <select
                    value={newResType}
                    onChange={(e: any) => setNewResType(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  >
                    <option value="pdf">كتيب أو مرجع PDF للقرائة</option>
                    <option value="audio">عظة صوتية أو تسجيل للسماع</option>
                    <option value="video">عرض مرئي أو فيديو للمشاهدة</option>
                    <option value="link">رابط خارجي معلق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2.5">المقدار (مثلاً: 35 صفحة / 15:40 دقيقة):</label>
                  <input 
                    type="text" 
                    placeholder="التوقيت أو عدد الصفحات..."
                    value={newResDur}
                    onChange={(e) => setNewResDur(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2.5">عنوان الملف / الدرس:</label>
                <input 
                  type="text" 
                  placeholder="كتاب المحبة، عظة السيرة، شرح لغة الإشارة..."
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2.5">الرابط المباشر للتحميل / المشاهدة (URL):</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/source.pdf"
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-white font-label font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>رفع وتعبئة الملحق التعليمي فوراً</span>
              </button>
            </form>
          </div>

          {/* List of Scientific Materials and Management */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mt-6 lg:col-span-2">
            <h4 className="font-display font-black text-xs text-[#1c305c] mb-2 uppercase tracking-widest text-right">
              📚 أرشيف المواد العلمية والمناهج المتاحة
            </h4>
            <p className="font-sans text-[11px] text-slate-400 mb-6 text-right">
              استعرض المناهج النشطة حالياً، وعدّل مسمياتها وتصنيفاتها، غيّر روابط صور الأغلفة، أو تصفّح الملحقات والملفات الخاصة بكل مادة لتعديلها أو حذفها.
            </p>

            {/* Editing active subject form */}
            {editingSubjectId && (
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 mb-6 text-right space-y-4">
                <h5 className="font-display font-black text-xs text-amber-850 flex items-center gap-1.5 justify-end">
                  <Sparkles className="w-4 h-4 text-amber-650" />
                  <span>تعديل المادة التعليمية وتحديث غلاف الصورة</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">اسم المادة التعليمية:</label>
                    <input 
                      type="text" 
                      value={editSubTitle}
                      onChange={(e) => setEditSubTitle(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">تصنيف المادة:</label>
                    <select
                      value={editSubTag}
                      onChange={(e) => setEditSubTag(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <option value="spiritual">مواد روحية</option>
                      <option value="disability">مواد الإعاقة</option>
                      <option value="general">مواد عامة</option>
                      <option value="orbital">مواد مهارية</option>
                      <option value="humandev">مواد تنمية بشرية</option>
                      <option value="contests">مواد مسابقات</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">رابط صورة الغلاف (تغيير الصورة):</label>
                    <input 
                      type="text" 
                      value={editSubBgImage}
                      onChange={(e) => setEditSubBgImage(e.target.value)}
                      placeholder="رابط مباشر للصورة (URL)"
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">معاينة الغلاف الجديد:</label>
                    <div className="h-11 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-mono truncate px-4">
                      {editSubBgImage || 'لا يوجد غلاف محدد'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">الوصف التفصيلي والمنهاج:</label>
                  <textarea 
                    rows={2}
                    value={editSubDesc}
                    onChange={(e) => setEditSubDesc(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-xl p-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveEditSubject}
                    className="flex-grow h-11 bg-amber-600 hover:bg-amber-700 text-white font-label font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ المادة والغلاف المحدث</span>
                  </button>
                  <button
                    onClick={() => setEditingSubjectId(null)}
                    className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-label font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Editing active lesson resource file form */}
            {editingResourceId && (
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 mb-6 text-right space-y-4">
                <h5 className="font-display font-black text-xs text-purple-850 flex items-center gap-1.5 justify-end">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>تعديل بيانات الملف العلمي أو المحاضرة</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">عنوان الملف / الدرس:</label>
                    <input 
                      type="text" 
                      value={editResTitle}
                      onChange={(e) => setEditResTitle(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">نوع الملحق العلمي:</label>
                    <select
                      value={editResType}
                      onChange={(e) => setEditResType(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    >
                      <option value="pdf">كتيب أو مرجع PDF</option>
                      <option value="audio">تسجيل صوتي أو عظة</option>
                      <option value="video">عرض مرئي أو فيديو</option>
                      <option value="link">رابط خارجي</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">الرابط المباشر للملف (URL):</label>
                    <input 
                      type="text" 
                      value={editResUrl}
                      onChange={(e) => setEditResUrl(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">الحجم / المدة (مثال: 12 صفحة):</label>
                    <input 
                      type="text" 
                      value={editResDur}
                      onChange={(e) => setEditResDur(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveEditResource}
                    className="flex-grow h-11 bg-purple-700 hover:bg-purple-800 text-white font-label font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ تحديثات المحاضرة / الملف</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingResourceId(null);
                      setEditingResourceSubId(null);
                    }}
                    className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-label font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* List of active subjects and cards */}
            <div className="space-y-4">
              {subjectsList.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-bold border border-dashed border-slate-200 rounded-2xl">
                  لا توجد مساقات مسجلة حالياً في النظام.
                </div>
              ) : (
                subjectsList.map((sub: any) => (
                  <div key={sub.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all text-right space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      
                      {/* Left: actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEditSubject(sub)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          تعديل وبيانات الغلاف
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          حذف المادة
                        </button>
                      </div>

                      {/* Right: metadata */}
                      <div className="flex items-center gap-3">
                        <div>
                          <h5 className="font-display font-black text-xs text-slate-800">{sub.title}</h5>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: sub.accentColor || '#10b981' }}>
                              {sub.tag}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">ملفات ملحقة: {sub.resources?.length || 0}</span>
                          </div>
                        </div>

                        {/* Image preview thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden relative shrink-0 border border-slate-200">
                          {sub.bgImage ? (
                            <img src={sub.bgImage} alt={sub.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-400">لا صورة</div>
                          )}
                        </div>
                      </div>

                    </div>

                    <p className="font-sans text-xs text-slate-500 pb-2 border-b border-slate-100">{sub.description}</p>

                    {/* Resources list nested under each subject */}
                    <div className="space-y-2">
                      <h6 className="font-display font-black text-[10px] text-slate-450 uppercase tracking-wider mb-2">الملفات والمحاضرات العلمية المسجلة:</h6>
                      {(!sub.resources || sub.resources.length === 0) ? (
                        <p className="font-sans text-[11px] text-slate-400 italic">لا توجد محاضرات ملحقة مسجلة لهذه المادة بعد.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {sub.resources.map((res: any) => (
                            <div key={res.id} className="p-2.5 bg-white border border-slate-150 rounded-xl flex justify-between items-center text-right text-xs gap-3">
                              <div className="flex items-center gap-1 shrink-0">
                                {res.type === 'pdf' && (
                                  <button
                                    onClick={() => handleOpenBookPrep(res.id)}
                                    className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-1 rounded-md transition-all cursor-pointer"
                                  >
                                    📖 تجهيز الصفحات
                                  </button>
                                )}
                                <button
                                  onClick={() => handleStartEditResource(sub.id, res)}
                                  className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-1 rounded-md transition-all cursor-pointer"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(sub.id, res.id)}
                                  className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-1.5 py-1 rounded-md transition-all cursor-pointer"
                                >
                                  حذف
                                </button>
                              </div>
                              <div className="truncate text-right">
                                <span className="font-bold text-slate-700 block truncate" title={res.title}>{res.title}</span>
                                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{res.type.toUpperCase()} • {res.duration || 'غير محدد'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Book Preparation Workspace */}
          {prepPagesResourceId && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-3xl border border-blue-200 text-right space-y-6 lg:col-span-2 mt-6">
              <div className="flex justify-between items-center border-b border-blue-200 pb-3 flex-row-reverse">
                <div>
                  <h5 className="font-display font-black text-sm text-blue-900">📖 ورشة عمل وتجهيز صفحات الكتاب الإلكتروني التفاعلي</h5>
                  <p className="text-[11px] text-blue-700 mt-1">تتيح لك تخريد كتاب الـ PDF وعرضه كصفحات نصية مرقمة تُقرأ صفحة فصفحة بشكل أنيق داخل مشغل المناهج.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrepPagesResourceId(null)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold transition-all"
                >
                  إغلاق الورشة
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: list of pages prepared */}
                <div className="bg-white p-4 rounded-2xl border border-slate-250 flex flex-col justify-between space-y-4">
                  <div>
                    <h6 className="font-display font-black text-xs text-slate-800 border-b pb-2 mb-3">الصفحات والمسودات الحالية ({prepPages.length})</h6>
                    {prepPages.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">لا توجد صفحات مجهزة حالياً. يرجى استخدام النموذج لإضافة الصفحة الأولى.</p>
                    ) : (
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {prepPages.map((page, pIdx) => (
                          <div key={pIdx} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-right">
                            <button
                              type="button"
                              onClick={() => handleDeletePrepPage(pIdx)}
                              className="text-[10px] text-red-600 hover:bg-red-50 p-1.5 rounded font-sans font-bold"
                            >
                              حذف
                            </button>
                            <div className="truncate pr-2">
                              <span className="font-bold text-xs text-slate-800 block">صفحة {pIdx + 1}: {page.title}</span>
                              <span className="text-[9px] text-slate-400 block truncate">{page.paragraphs[0] || ""}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveBookPrep}
                    className="w-full py-2.5 bg-[#15803d] hover:bg-emerald-700 text-white rounded-xl font-label text-xs font-black transition-colors"
                  >
                    ✓ حفظ ونشر الكتاب بالصفحات ({prepPages.length})
                  </button>
                </div>

                {/* Right: add new page form */}
                <div className="md:col-span-2 bg-white p-4.5 rounded-2xl border border-slate-250 space-y-4 text-right">
                  <h6 className="font-display font-black text-xs text-slate-800 border-b pb-2">إضافة صفحة جديدة (+)</h6>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1.5">مسمى أو عنوان الصفحة / الفصل (مثال: المقدمة أو الفصل الأول):</label>
                    <input
                      type="text"
                      placeholder="عنوان الصفحة..."
                      value={newPageTitle}
                      onChange={(e) => setNewPageTitle(e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-right font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1.5">المحتوى النصي الكامل للصفحة (سيتم تجزئته وعرضه للقراءة):</label>
                    <textarea
                      rows={6}
                      placeholder="اكتب المحتوى النصي الكامل الذي يظهر عند فتح هذه الصفحة في التطبيق..."
                      value={newPageText}
                      onChange={(e) => setNewPageText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none text-right font-sans"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPrepPage}
                    className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    أدرج هذه الصفحة لبيانات الكتاب (+)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      {/* Panel 3: Establish exams and questions bank */}
      {adminTab === 'exams' && (
        <div className="space-y-6" id="panel_exams_bank_manager">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Create Exam */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-display font-black text-xs text-emerald-700 pb-3 border-b border-slate-100 mb-2 uppercase tracking-wider">
                إنشاء وتأسيس اختبار دراسي جديد
              </h4>

              <form onSubmit={handleAddExam} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">عنوان وعتبة الامتحان:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: اختبار تفسير العهد الجديد - الوحدة الأولى"
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 border-slate-200">التصنيف والمسار:</label>
                    <select
                      value={newExamCategory}
                      onChange={(e) => setNewExamCategory(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                    >
                      <option value="القسم الروحي">القسم الروحي</option>
                      <option value="مواد مهارية">مواد مهارية</option>
                      <option value="قسم الاعاقة">قسم الاعاقة</option>
                      <option value="القسم العام">القسم العام</option>
                      <option value="مسابقة كنز الرحمة">مسابقة كنز الرحمة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">المدة المسموحة (بالدقائق):</label>
                    <input 
                      type="number" 
                      value={newExamDuration}
                      onChange={(e) => setNewExamDuration(Number(e.target.value))}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-mono text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">تاريخ نشر الامتحان الافتتاحي:</label>
                    <input 
                      type="date" 
                      value={newExamPublishDate}
                      onChange={(e) => setNewExamPublishDate(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">تاريخ انتهاء الامتحان الصلاحي:</label>
                    <input 
                      type="date" 
                      value={newExamExpireDate}
                      onChange={(e) => setNewExamExpireDate(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">الوصف التعليمي والضوابط:</label>
                  <textarea 
                    rows={2}
                    placeholder="اكتب تعليمات الدخول ودرجة النجاح المقترحة للخادم الدارس..."
                    value={newExamDesc}
                    onChange={(e) => setNewExamDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-label font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>تسجيل الامتحان في لوحة الاختبارات والنتائج</span>
                </button>
              </form>
            </div>

            {/* Add question to existing exam */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-display font-black text-xs text-amber-600 pb-3 border-b border-slate-100 mb-2 uppercase tracking-wider">
                تفريع وإضافة أسئلة اختيار من متعدد
              </h4>

              <form onSubmit={handleAddQuestion} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">اختر الاختبار المعني بالمقرر:</label>
                  <select
                    value={chosenExamId}
                    onChange={(e) => setChosenExamId(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                    required
                  >
                    <option value="">-- تصفح الامتحانات المتاحة --</option>
                    {examsList.map((exam: any) => (
                      <option key={exam.id} value={exam.id}>{exam.title} ({exam.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">منطوق وسياق السؤال الحواري:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: متى كتب الرسول إلى كنيسة رومية لخدمة كذا؟"
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                    required
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الأول (1):</label>
                    <input type="text" value={opt1} onChange={(e) => setOpt1(e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 font-sans text-[11px] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الثاني (2):</label>
                    <input type="text" value={opt2} onChange={(e) => setOpt2(e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 font-sans text-[11px] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الثالث (3):</label>
                    <input type="text" value={opt3} onChange={(e) => setOpt3(e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 font-sans text-[11px] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الرابع (4):</label>
                    <input type="text" value={opt4} onChange={(e) => setOpt4(e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 font-sans text-[11px] outline-none" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">رقم الخيار الصحيح والمطابق (إجابة نموذجية):</label>
                  <select
                    value={correctIdx}
                    onChange={(e) => setCorrectIdx(Number(e.target.value))}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-[#15803d] outline-none"
                  >
                    <option value={0}>الخيار الأول هو الصحيح</option>
                    <option value={1}>الخيار الثاني هو الصحيح</option>
                    <option value={2}>الخيار الثالث هو الصحيح</option>
                    <option value={3}>الخيار الرابع هو الصحيح</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-label font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حقن السؤال النموذجي وتوسعة بنك الأسئلة</span>
                </button>
              </form>
            </div>

          </div>

          {/* Expanded Section: Exams & Courses Control Center */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-display font-black text-xs text-[#1c305c] pb-3 border-b border-slate-100 mb-2 uppercase tracking-wider text-right">
              📝 بنك الأسئلة والتحكم الشامل في الاختبارات والدورات التدريبية
            </h4>
            <p className="font-sans text-[11px] text-slate-400 text-right">
              تصفح الاختبارات المسجلة للتحكم في معاييرها، وتعديل الأسئلة أو حذفها، وبناء بنوك أسئلة ذاتية التقييم لدورات مؤسستنا التدريبية.
            </p>

            {/* Editing Exam Inline Form */}
            {editingExamId && (
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 text-right space-y-4">
                <h5 className="font-display font-black text-xs text-amber-850 flex items-center gap-1.5 justify-end">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>تعديل معايير وضوابط الامتحان المحدّد</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">عنوان وعتبة الامتحان:</label>
                    <input 
                      type="text" 
                      value={editExamTitle}
                      onChange={(e) => setEditExamTitle(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">التصنيف والمسار:</label>
                    <select
                      value={editExamCategory}
                      onChange={(e) => setEditExamCategory(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <option value="القسم الروحي">القسم الروحي</option>
                      <option value="مواد مهارية">مواد مهارية</option>
                      <option value="قسم الاعاقة">قسم الاعاقة</option>
                      <option value="القسم العام">القسم العام</option>
                      <option value="مسابقة كنز الرحمة">مسابقة كنز الرحمة</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">المدة المسموحة (دقائق):</label>
                    <input 
                      type="number" 
                      value={editExamDuration}
                      onChange={(e) => setEditExamDuration(Number(e.target.value))}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">تاريخ النشر البادئ:</label>
                    <input 
                      type="date" 
                      value={editExamPublishDate}
                      onChange={(e) => setEditExamPublishDate(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">تاريخ انتهاء الامتحان:</label>
                    <input 
                      type="date" 
                      value={editExamExpireDate}
                      onChange={(e) => setEditExamExpireDate(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">الوصف والتعليمات:</label>
                  <textarea 
                    rows={2}
                    value={editExamDesc}
                    onChange={(e) => setEditExamDesc(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-xl p-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveEditExam}
                    className="flex-grow h-11 bg-amber-600 hover:bg-amber-700 text-white font-label font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ التغييرات وتعميم المعايير</span>
                  </button>
                  <button
                    onClick={() => setEditingExamId(null)}
                    className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-label font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Exams list & Direct Date Modification Table */}
            <div className="overflow-x-auto border border-slate-150 rounded-2xl">
              <table className="w-full text-right text-xs divide-y divide-slate-150 font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold">
                    <th className="p-3">اسم الامتحان</th>
                    <th className="p-3">المسار / التصنيف</th>
                    <th className="p-3 text-center">المدة (دقائق)</th>
                    <th className="p-3 text-center">عدد الأسئلة</th>
                    <th className="p-3">تاريخ النشر</th>
                    <th className="p-3">تاريخ انتهاء الصلاحية</th>
                    <th className="p-3 text-center">إجراءات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examsList.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-black text-slate-800">{ex.title}</td>
                      <td className="p-3 text-slate-500 font-medium">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
                          {ex.category}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">{ex.duration} د</td>
                      <td className="p-3 text-center font-mono font-black text-purple-700">{ex.questionsCount || 0} أسئلة</td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={ex.publishDate || '2026-06-01'}
                          onChange={(e) => {
                            const updatedExams = examsList.map(item => {
                              if (item.id === ex.id) {
                                return { ...item, publishDate: e.target.value };
                              }
                              return item;
                            });
                            setExamsList(updatedExams);
                            localStorage.setItem('angels_exams_list_v2', JSON.stringify(updatedExams));
                          }}
                          className="border border-slate-200 rounded px-2 py-1 font-mono text-[11px] bg-slate-50 focus:bg-white"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={ex.expireDate || '2026-08-31'}
                          onChange={(e) => {
                            const updatedExams = examsList.map(item => {
                              if (item.id === ex.id) {
                                return { ...item, expireDate: e.target.value };
                              }
                              return item;
                            });
                            setExamsList(updatedExams);
                            localStorage.setItem('angels_exams_list_v2', JSON.stringify(updatedExams));
                          }}
                          className="border border-slate-200 rounded px-2 py-1 font-mono text-[11px] bg-slate-50 focus:bg-white"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStartEditExam(ex)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteExam(ex.id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Google Sheets CSV Question Importer */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-3xl border border-emerald-200 space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2 flex-row-reverse">
                <span className="font-display font-black text-xs text-emerald-800">📊 استيراد وربط الأسئلة من Google Sheets / جدول بيانات</span>
                <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">ربط مباشر وسريع</span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">
                انسخ صفوف جدول البيانات من Google Sheets بالصيغة الآتية ثم الصقها بالأسفل لاستيراد دفعة أسئلة مجهزة تلقائياً وتلقينها للامتحان:
                <br />
                <code className="text-emerald-700 bg-white font-mono p-1 rounded border inline-block mt-1 text-[9px] dir-ltr text-left">
                  السؤال,الخيار1,الخيار2,الخيار3,الخيار4,رقم الإجابة الصحيحة (1-4)
                </code>
              </p>

              <form onSubmit={handleImportFromCSV} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">حدد الامتحان المُراد الاستيراد إليه:</label>
                    <select
                      value={importExamId || ''}
                      onChange={(e) => setImportExamId(e.target.value || null)}
                      className="w-full h-10 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                      required
                    >
                      <option value="">-- اضغط للاختيار --</option>
                      {examsList.map((exam: any) => (
                        <option key={exam.id} value={exam.id}>{exam.title} ({exam.category})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <p className="text-[9.5px] text-slate-400 italic">كل سطر في المربع بالأسفل يمثل سؤالاً مستقلاً بكافة خياراته.</p>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="السؤال الأول؟,الخيار أ,الخيار ب,الخيار ج,الخيار د,1&#10;السؤال الثاني؟,خيار1,خيار2,خيار3,خيار4,3"
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-xl p-3 font-mono text-xs focus:ring-1 focus:ring-emerald-500 outline-none resize-none text-right font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!importExamId}
                  className="w-full h-10 bg-[#15803d] hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  📥 معالجة واستيراد الأسئلة فوراً (+)
                </button>
              </form>
            </div>

            {/* Interactive Question Bank Explorer */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="w-full sm:w-72">
                  <select
                    value={editingQuestionExamId || ''}
                    onChange={(e) => {
                      setEditingQuestionExamId(e.target.value || null);
                      setEditingQuestionIdx(null); // Clear editing states on switch
                    }}
                    className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  >
                    <option value="">-- اختر امتحاناً لاستعراض أسئلته وتعديلها --</option>
                    {examsList.map((exam: any) => (
                      <option key={exam.id} value={exam.id}>{exam.title} ({exam.questionsCount || 0} أسئلة)</option>
                    ))}
                  </select>
                </div>
                <div className="rtl shrink-0 text-right">
                  <h5 className="font-display font-black text-xs text-[#1c305c]">🔍 مستكشف ومحرّر بنك الأسئلة الموضعي</h5>
                  <p className="font-sans text-[10px] text-slate-400 mt-1">اختر مساق امتحان من القائمة لعرض كامل أسئلته أو تعديل محتواها أو حذفها نهائياً.</p>
                </div>
              </div>

              {/* Editing active question form */}
              {editingQuestionExamId && editingQuestionIdx !== null && (
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-4 text-right">
                  <h6 className="font-display font-black text-xs text-amber-850 flex items-center gap-1.5 justify-end">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>تعديل بيانات وصيغة السؤال رقم {editingQuestionIdx + 1}</span>
                  </h6>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">منطوق وصيغة السؤال:</label>
                    <input 
                      type="text" 
                      value={editQText}
                      onChange={(e) => setEditQText(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-250 rounded-xl px-4 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الأول (1):</label>
                      <input type="text" value={editOpt1} onChange={(e) => setEditOpt1(e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-sans text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الثاني (2):</label>
                      <input type="text" value={editOpt2} onChange={(e) => setEditOpt2(e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-sans text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الثالث (3):</label>
                      <input type="text" value={editOpt3} onChange={(e) => setEditOpt3(e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-sans text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">الخيار الرابع (4):</label>
                      <input type="text" value={editOpt4} onChange={(e) => setEditOpt4(e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-sans text-xs outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">الإجابة النموذجية الصحيحة:</label>
                      <select
                        value={editCorrectIdx}
                        onChange={(e) => setEditCorrectIdx(Number(e.target.value))}
                        className="w-full h-11 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                      >
                        <option value={0}>الخيار الأول هو الصحيح</option>
                        <option value={1}>الخيار الثاني هو الصحيح</option>
                        <option value={2}>الخيار الثالث هو الصحيح</option>
                        <option value={3}>الخيار الرابع هو الصحيح</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        onClick={handleSaveEditQuestion}
                        className="flex-grow h-11 bg-amber-650 hover:bg-amber-700 text-white font-label font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>تطبيق تعديل السؤال</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingQuestionExamId(null);
                          setEditingQuestionIdx(null);
                        }}
                        className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-label font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions list for selected exam */}
              {editingQuestionExamId && (
                <div className="space-y-3.5 pt-2">
                  {(() => {
                    const savedQuizQuestions = localStorage.getItem('angels_quiz_questions_v1');
                    let db: any = {};
                    if (savedQuizQuestions) {
                      try { db = JSON.parse(savedQuizQuestions); } catch (e) {}
                    }
                    const questions = db[editingQuestionExamId] || [];
                    if (questions.length === 0) {
                      return <p className="text-center text-slate-400 font-bold py-4 text-xs">لا توجد أسئلة مسجلة في هذا الامتحان بعد، أضف أسئلة باستخدام نموذج الإضافة المرفق بالأعلى.</p>;
                    }
                    return questions.map((q: any, idx: number) => (
                      <div key={q.id || idx} className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-start text-right text-xs gap-3">
                        <div className="flex items-center gap-1 shrink-0 pt-1">
                          <button
                            onClick={() => handleStartEditQuestion(editingQuestionExamId, q, idx)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            تعديل السؤال
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(editingQuestionExamId, idx)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                        <div className="space-y-2 flex-grow text-right">
                          <span className="font-bold text-slate-800 text-xs block">
                            س {idx + 1}: {q.questionText}
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {q.options.map((opt: string, optIdx: number) => (
                              <div 
                                key={optIdx} 
                                className={`p-1.5 rounded-lg border text-right ${
                                  optIdx === q.correctAnswerIndex 
                                    ? 'bg-emerald-55/60 border-emerald-300 text-emerald-800 font-bold' 
                                    : 'bg-slate-50/50 border-slate-100 text-slate-500'
                                }`}
                              >
                                {opt} {optIdx === q.correctAnswerIndex && '✔️'}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Panel: Managing Practical Metrics & Alerts */}
      {adminTab === 'practical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="panel_practical_management">
          
          {/* Section A: Criteria Editor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-display font-black text-xs text-[#15803d]">
                  إدارة درجات عناصر التقييم الميداني السبع (للخادم ميلاد بشته)
                </h4>
                <span className="text-[10px] bg-emerald-50 text-[#15803d] px-2 py-0.5 rounded-md font-bold">لوحة القياس والتحكم</span>
              </div>
              
              <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed mb-4">
                حدد البند الميداني من الأسفل، ثم قم بتعيير الدرجة العظمى المسموحة للنشاط، والدرجة الحالية المحققة والمنصفة للخادم. سيتم جمع وحساب المستوى العام للخدمة تلقائياً وعرضه بالرصيد.
              </p>

              {/* Sidebar/dropdown for selecting category item and delete option */}
              <div className="space-y-3 mb-4 text-right">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {practicalSections.map((sec) => (
                    <div key={sec.id} className="relative group">
                      <button
                        type="button"
                        onClick={() => setActiveEditingSecId(sec.id)}
                        className={`w-full p-2 rounded-xl text-[10px] font-bold text-center border transition-all ${
                          activeEditingSecId === sec.id
                            ? 'bg-emerald-500 text-white border-transparent'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sec.title}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Section actions: Delete active section and Add new section form */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (practicalSections.length <= 1) {
                          onNotify('لا يمكن حذف كافة بنود التقييم الميداني، يجب إبقاء قسم واحد على الأقل.');
                          return;
                        }
                        const secToDelete = practicalSections.find(s => s.id === activeEditingSecId);
                        if (!secToDelete) return;
                        if (window.confirm(`هل أنت متأكد من حذف قسم التقييم "${secToDelete.title}" بالكامل؟`)) {
                          const updated = practicalSections.filter(s => s.id !== activeEditingSecId);
                          setPracticalSections(updated);
                          localStorage.setItem('angels_practical_sections_v1', JSON.stringify(updated));
                          setActiveEditingSecId(updated[0].id);
                          onNotify('تم حذف قسم التقييم بالكامل بنجاح!');
                        }
                      }}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      حذف القسم المحدّد 🗑️
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-grow sm:flex-initial">
                    <input
                      type="text"
                      placeholder="اسم قسم تقييم جديد..."
                      id="newSecTitleInput"
                      className="h-8 bg-white border border-slate-200 rounded-lg px-2 text-[10px] font-sans focus:outline-none w-36"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newSecTitleInput') as HTMLInputElement;
                        const title = input?.value?.trim();
                        if (!title) {
                          onNotify('يرجى كتابة عنوان صحيح للقسم أولاً.');
                          return;
                        }
                        const newSec = {
                          id: `psec-${Date.now()}`,
                          title: title,
                          items: []
                        };
                        const updated = [...practicalSections, newSec];
                        setPracticalSections(updated);
                        localStorage.setItem('angels_practical_sections_v1', JSON.stringify(updated));
                        setActiveEditingSecId(newSec.id);
                        if (input) input.value = '';
                        onNotify('تم تأسيس قسم التقييم الجديد بنجاح! يمكنك الآن إضافة معايير فرعية له.');
                      }}
                      className="h-8 px-2.5 bg-[#15803d] hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      + إنشاء قسم جديد
                    </button>
                  </div>
                </div>
              </div>

              {/* Form editing variables in chosen section */}
              {practicalSections.filter(sec => sec.id === activeEditingSecId).map((sec) => (
                <div key={sec.id} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right">
                  <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-1.5 font-bold text-[#15803d] flex-row-reverse">
                    <span>تعديل البنود الفرعية لـ: {sec.title}</span>
                    <span className="text-[9px] text-slate-400 font-normal">معايير مخصصة</span>
                  </div>

                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {sec.items.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic text-center py-4">لا توجد معايير فرعية في هذا القسم بعد. أضف معياراً باستخدام النموذج بالأسفل.</p>
                    ) : (
                      sec.items.map((it: any) => (
                        <div key={it.id} className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                          <div className="rtl">
                            <p className="font-display font-black text-xs text-slate-800">{it.label}</p>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`هل متأكد من حذف معيار "${it.label}"؟`)) {
                                  const updatedItems = sec.items.filter((item: any) => item.id !== it.id);
                                  const updatedSecs = practicalSections.map(s => s.id === sec.id ? { ...s, items: updatedItems } : s);
                                  setPracticalSections(updatedSecs);
                                  localStorage.setItem('angels_practical_sections_v1', JSON.stringify(updatedSecs));
                                  onNotify('تم حذف المعيار الفرعي بنجاح!');
                                }
                              }}
                              className="text-red-650 hover:bg-red-50 px-1 rounded text-[9px] font-bold mt-1 transition-all inline-block"
                            >
                              حذف المعيار 🗑️
                            </button>
                          </div>

                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16">
                              <label className="block text-[8px] font-bold text-slate-400 mb-0.5">العظمى</label>
                              <input 
                                type="number" 
                                value={it.maxScore} 
                                onChange={(e) => handleUpdateItemScore(sec.id, it.id, 'maxScore', Number(e.target.value))}
                                className="w-full h-8 text-center bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold"
                              />
                            </div>
                            
                            <div className="w-16">
                              <label className="block text-[8px] font-bold text-slate-400 mb-0.5">المحققة</label>
                              <input 
                                type="number" 
                                value={it.achievedScore} 
                                onChange={(e) => handleUpdateItemScore(sec.id, it.id, 'achievedScore', Number(e.target.value))}
                                className="w-full h-8 text-center bg-[#dcfce7] border border-emerald-200 rounded font-mono text-xs font-bold text-[#151c27]"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add new sub-item/criterion to active section */}
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="عنوان المعيار الجديد (مثال: الالتزام بالوقت)..."
                      id="newItemLabelInput"
                      className="flex-grow h-8 bg-white border border-slate-250 rounded-lg px-2.5 text-[11px] font-sans focus:outline-none text-right"
                    />
                    <input
                      type="number"
                      placeholder="الدرجة"
                      defaultValue={10}
                      id="newItemMaxScoreInput"
                      className="w-14 h-8 bg-white border border-slate-250 rounded-lg text-center text-[11px] font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const labelInput = document.getElementById('newItemLabelInput') as HTMLInputElement;
                        const maxInput = document.getElementById('newItemMaxScoreInput') as HTMLInputElement;
                        const label = labelInput?.value?.trim();
                        const maxScore = Number(maxInput?.value) || 10;
                        if (!label) {
                          onNotify('يرجى تحديد عنوان صحيح للمعيار الجديد.');
                          return;
                        }
                        const newItem = {
                          id: `pitem-${Date.now()}`,
                          label: label,
                          maxScore: maxScore,
                          achievedScore: maxScore
                        };
                        const updatedItems = [...sec.items, newItem];
                        const updatedSecs = practicalSections.map(s => s.id === sec.id ? { ...s, items: updatedItems } : s);
                        setPracticalSections(updatedSecs);
                        localStorage.setItem('angels_practical_sections_v1', JSON.stringify(updatedSecs));
                        if (labelInput) labelInput.value = '';
                        onNotify(`تمت إضافة معيار "${label}" بنجاح!`);
                      }}
                      className="h-8 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap"
                    >
                      + معيار فرعي
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={handleSavePracticalScores}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-[#15803d] text-white rounded-xl text-xs font-bold font-label transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وتوزيع هذه الدرجات وتعديل رصيد الخادم</span>
            </button>
          </div>

          {/* Section B: Alerts & Scheduled Notices Manager */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-display font-black text-xs text-[#15803d]">
                  إدارة التنبيهات الميدانية الملقائية والمهام الخدمية بالتواريخ
                </h4>
                <span className="text-[10px] bg-blue-50 text-[#15803d] px-2 py-0.5 rounded-md font-bold">بث التنبيهات</span>
              </div>

              {/* Form to insert new alert item */}
              <form onSubmit={handleAddAlert} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">عنوان الفعالية/التنبيه:</label>
                  <input 
                    type="text" 
                    placeholder="مثل: قداس الأحد الثالث، رحلة ترفيهية للأطفال، إلخ..."
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    className="w-full h-9 bg-white border border-slate-350 rounded-lg px-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#15803d]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">التاريخ:</label>
                    <input 
                      type="date" 
                      value={newAlertDate}
                      onChange={(e) => setNewAlertDate(e.target.value)}
                      className="w-full h-9 bg-white border border-slate-350 rounded-lg px-2 text-xs font-sans focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">الوقت:</label>
                    <input 
                      type="text" 
                      placeholder="مثال: 07:00 ص"
                      value={newAlertTime}
                      onChange={(e) => setNewAlertTime(e.target.value)}
                      className="w-full h-9 bg-white border border-slate-350 rounded-lg px-2 text-xs font-sans focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">الموقع/المكان:</label>
                    <input 
                      type="text" 
                      placeholder="مثل: كنيسة الملاك"
                      value={newAlertLocation}
                      onChange={(e) => setNewAlertLocation(e.target.value)}
                      className="w-full h-9 bg-white border border-slate-350 rounded-lg px-2 text-xs font-sans focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">فئة التنبيه:</label>
                    <select
                      value={newAlertCategory}
                      onChange={(e) => setNewAlertCategory(e.target.value as any)}
                      className="w-full h-9 bg-white border border-slate-350 rounded-lg px-2 text-xs font-sans focus:outline-none"
                    >
                      <option value="liturgy">🕌 قداس إلهي وطقوس</option>
                      <option value="trip">🚌 رحلة خارجية</option>
                      <option value="conference">📝 مؤتمر للخدام</option>
                      <option value="festival">🎡 مهرجان سنوي</option>
                      <option value="general">⚙️ لقاء عام واجتماع</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-lg font-bold text-[10px] cursor-pointer"
                >
                  نشر وجدولة هذا التنبيه العملي لجميع الخدام (+)
                </button>
              </form>

              {/* List of active scheduled alerts with delete button */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                <span className="text-[10px] text-slate-400 font-bold block">التنبيهات المجدولة حالياً ({fieldAlerts.length}):</span>
                {fieldAlerts.map((al) => (
                  <div key={al.id} className="bg-slate-50 border p-2.5 rounded-lg flex items-center justify-between text-right">
                    <div>
                      <p className="font-display font-black text-[11px] text-[#151c27]">{al.title}</p>
                      <p className="text-[9px] text-[#15803d] font-sans font-medium">البلد والموقع: {al.location} | {al.date} {al.time}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAlert(al.id, al.title)}
                      className="p-1.5 bg-red-100/60 text-red-700 hover:bg-red-200 rounded transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Event Attendance Overrides */}
              <div className="pt-4 border-t border-slate-150 mt-4 space-y-3 text-right">
                <span className="text-[10px] text-slate-800 font-black block">📆 لوحة حضور وغياب المشاركين للفعاليات والقداسات:</span>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={selectedAlertForAttendanceId || ''}
                    onChange={(e) => setSelectedAlertForAttendanceId(e.target.value || null)}
                    className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-[10px] font-sans focus:outline-none text-right"
                  >
                    <option value="">-- اختر الفعالية لرصد الحضور --</option>
                    {fieldAlerts.map(al => (
                      <option key={al.id} value={al.id}>{al.title} ({al.date})</option>
                    ))}
                  </select>

                  {selectedAlertForAttendanceId && (
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                      {ALL_PARTICIPANTS.map((serv) => {
                        const stateKey = `angels_attendance_${selectedAlertForAttendanceId}_${serv.name}`;
                        const currentStatus = localStorage.getItem(stateKey) || 'none'; // 'attended', 'apologized', 'absent'

                        return (
                          <div key={serv.name} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[10px] gap-2">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  localStorage.setItem(stateKey, 'attended');
                                  onNotify(`تم تسجيل الخادم "${serv.name}" كـ حاضر في الفعالية.`);
                                  // trigger re-render
                                  setSelectedAlertForAttendanceId(selectedAlertForAttendanceId);
                                }}
                                className={`px-2 py-1 rounded font-bold text-[9px] transition-all cursor-pointer ${
                                  currentStatus === 'attended'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                حاضر
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  localStorage.setItem(stateKey, 'apologized');
                                  onNotify(`تم تسجيل الخادم "${serv.name}" كـ معتذر عن الفعالية.`);
                                  // trigger re-render
                                  setSelectedAlertForAttendanceId(selectedAlertForAttendanceId);
                                }}
                                className={`px-2 py-1 rounded font-bold text-[9px] transition-all cursor-pointer ${
                                  currentStatus === 'apologized'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                معتذر
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  localStorage.setItem(stateKey, 'absent');
                                  onNotify(`تم تسجيل الخادم "${serv.name}" كـ غائب عن الفعالية.`);
                                  // trigger re-render
                                  setSelectedAlertForAttendanceId(selectedAlertForAttendanceId);
                                }}
                                className={`px-2 py-1 rounded font-bold text-[9px] transition-all cursor-pointer ${
                                  currentStatus === 'absent'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                غائب
                              </button>
                            </div>
                            <span className="font-bold text-slate-800 text-right truncate pr-1">{serv.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="text-[9.5px] text-slate-450 text-center font-sans mt-3">
              💡 بمجرد إضافة تنبيه تلقائي، تظهر الإشعارات عند تسجيل دخول الخدام لغرفة التدريب والتقييم.
            </div>
          </div>

        </div>
      )}

      {/* Panel 4: Participants summary */}
      {adminTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6" id="panel_servants_evaluations">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-display font-black text-sm text-[#111622]">أرشيف وجداول خدام الدفعة الرابعة (مؤسسة أصدقاء الملائكة)</h4>
            <span className="font-sans text-[10px] bg-blue-50 text-[#15803d] px-2.5 py-0.5 rounded-lg font-bold">{ALL_PARTICIPANTS.length} مشاركين نشطين</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column A: Add/Edit User Form */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-right space-y-4 h-fit">
              <div className="border-b pb-2">
                <h5 className="font-display font-black text-xs text-[#1c305c]">
                  {editingCustomUserIdx !== null ? '✏️ تعديل بيانات العضو المضاف' : '➕ تسجيل وإلحاق خادم جديد'}
                </h5>
                <p className="text-[10px] text-slate-400 mt-1">تتيح لك هذه اللوحة توسيع وإضافة خدام جدد للتطبيق وتصفحهم فورياً.</p>
              </div>

              <form onSubmit={handleAddOrEditCustomUser} className="space-y-3.5 text-right">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">الاسم الرباعي الكامل لل خادم:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ميلاد بشته خليل..."
                    value={userFormFullName}
                    onChange={(e) => setUserFormFullName(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">رقم الهاتف الدولي:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 01223344556..."
                    value={userFormPhone}
                    onChange={(e) => setUserFormPhone(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-250 rounded-xl px-3 font-mono text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-left"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">الخدمة المكلف بها حالياً:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: خدمة الصم والبكم..."
                    value={userFormService}
                    onChange={(e) => setUserFormService(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-250 rounded-xl px-3 font-sans text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">الرتبة والمستوى الدراسي الكنسي:</label>
                  <select
                    value={userFormLevel}
                    onChange={(e) => setUserFormLevel(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-250 rounded-xl px-2 font-sans text-xs focus:outline-none"
                  >
                    <option value="الخادم المبتدئ - المستوى الأول">الخادم المبتدئ - المستوى الأول</option>
                    <option value="الخادم المتدرب - المستوى الثاني">الخادم المتدرب - المستوى الثاني</option>
                    <option value="الخادم المميز - المستوى الثالث">الخادم المميز - المستوى الثالث</option>
                    <option value="الخادم المميز - المستثني الثالث">الخادم المميز - المستثني الثالث</option>
                    <option value="الخادم المتدرب - المستوى الرابع">الخادم المتدرب - المستوى الرابع</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-grow h-10 bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {editingCustomUserIdx !== null ? '✓ تطبيق وتعديل العضو' : 'سجل العضو الآن (+)'}
                  </button>
                  {editingCustomUserIdx !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomUserIdx(null);
                        setUserFormFullName('');
                        setUserFormPhone('');
                        setUserFormService('أصدقاء الملائكة (عام)');
                      }}
                      className="px-3.5 h-10 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Column B: Participants List with CRUD actions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Custom registered users section */}
              <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-200 text-right space-y-2">
                <span className="text-xs font-black text-slate-700 block">👥 الخدام المسجلين يدوياً عبر لوحة الإدارة ({customUsersList.length})</span>
                {customUsersList.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic py-3 text-center">لا توجد سجلات لخدام تم إلحاقهم يدوياً حالياً. استخدم النموذج المرفق لإضافة الأول.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {customUsersList.map((usr, uIdx) => (
                      <div key={uIdx} className="bg-white p-3 rounded-2xl border border-slate-150 flex items-center justify-between text-right gap-2">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditCustomUser(uIdx)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomUser(uIdx, usr.fullName || usr.username)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                        <div className="truncate flex-grow text-right">
                          <span className="font-bold text-slate-800 text-xs block truncate">{usr.fullName || usr.username}</span>
                          <span className="text-[9.5px] text-slate-400 block font-mono">{usr.phone} | {usr.currentService || usr.service}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main table showcasing all blended participants */}
              <div className="overflow-x-auto border border-slate-150 rounded-2xl bg-white">
                <table className="w-full text-right font-sans text-[11px] text-slate-600 divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50/70 text-[#111622] font-semibold text-xs">
                      <th className="p-3">الاسم رباعي</th>
                      <th className="p-3">الرتبة والترتيب الحالي</th>
                      <th className="p-3">الخدمة المكلف بها</th>
                      <th className="p-3">رقم الهاتف</th>
                      <th className="p-3 text-left">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ALL_PARTICIPANTS.map((serv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{serv.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#dcfce7] text-[#15803d]">
                            {serv.level}
                          </span>
                        </td>
                        <td className="p-3 font-medium">{serv.currentService}</td>
                        <td className="p-3 font-mono text-slate-400">{serv.phone}</td>
                        <td className="p-3 text-left">
                          <span className="text-emerald-650 font-extrabold inline-flex items-center gap-1.5 text-[10px]">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <span>منضبط ومتميز</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel 5: Claims Approval Panel */}
      {adminTab === 'claims' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6" id="panel_bonus_claims_approvals">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-right">
            <div>
              <h4 className="font-display font-black text-sm text-[#111622]">طلبات الحصول على البونص والمنافسات المعلقة</h4>
              <p className="font-sans text-[11px] text-slate-400 mt-1">تتيح لك هذه اللوحة الموافقة الفورية أو الرفض للطلبات المرسلة من الخدام وإضافتها لكشف الحساب تلقائياً.</p>
            </div>
            <span className="font-sans text-[10px] bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-lg font-bold">مراجعة الإدارة</span>
          </div>

          {claimsList.length > 0 ? (
            <div className="space-y-4">
              {claimsList.map((claim: any) => (
                <div key={claim.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2 flex-1 text-right">
                    <div className="flex items-center gap-2 flex-wrap justify-start">
                      <span className="font-sans text-[10px] text-slate-400">{claim.date}</span>
                      <span className="font-display font-black text-xs text-slate-800">الخادم: {claim.servantName}</span>
                      <span className="bg-[#15803d]/10 text-[#15803d] px-2 py-0.5 rounded-md text-[9px] font-bold">{claim.challengeTitle}</span>
                      
                      {claim.status === 'pending' && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[9px] font-bold">بانتظار القرار ⏳</span>}
                      {claim.status === 'approved' && <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[9px] font-bold">مقبول ومضاف ✅</span>}
                      {claim.status === 'rejected' && <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md text-[9px] font-bold">مرفوض ❌</span>}
                    </div>
                    
                    <p className="font-sans text-xs text-slate-700 font-medium">
                      <strong className="text-slate-900">بيان الخادم للإثبات: </strong>
                      {claim.proof}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0 self-stretch md:self-center justify-end items-center">
                    <span className="font-display font-black text-emerald-600 text-xs bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 whitespace-nowrap">
                      +{claim.pointsReward} درجة
                    </span>

                    {claim.status === 'pending' && (
                      <div className="flex gap-1.5 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            // 1. Update claim status to approved
                            const updatedClaims = claimsList.map((c: any) => 
                              c.id === claim.id ? { ...c, status: 'approved' } : c
                            );
                            setClaimsList(updatedClaims);
                            localStorage.setItem('angels_bonus_claims_v1', JSON.stringify(updatedClaims));

                            // 2. Add approved item to angels_bonuses_discounts_logs_v1
                            const newLog = {
                              id: `approved-claim-${claim.id}`,
                              servantName: claim.servantName,
                              type: 'bonus',
                              amount: claim.pointsReward,
                              reason: `موافقة على تحدي: ${claim.challengeTitle} (${claim.proof})`,
                              date: claim.date || 'اليوم'
                            };

                            const cachedLogs = localStorage.getItem('angels_bonuses_discounts_logs_v1');
                            let currentLogs = [];
                            if (cachedLogs) {
                              try { currentLogs = JSON.parse(cachedLogs); } catch (e) {}
                            }
                            const updatedLogs = [newLog, ...currentLogs];
                            localStorage.setItem('angels_bonuses_discounts_logs_v1', JSON.stringify(updatedLogs));

                            // 3. Update points of the servant in their profile if matches currentServant
                            const savedProfileStr = localStorage.getItem('angels_user_profile_v1');
                            if (savedProfileStr) {
                              try {
                                const profileObj = JSON.parse(savedProfileStr);
                                if (profileObj.fullName === claim.servantName || claim.servantName === "ميلاد بشته") {
                                  profileObj.points = (profileObj.points || 0) + claim.pointsReward;
                                  localStorage.setItem('angels_user_profile_v1', JSON.stringify(profileObj));
                                }
                              } catch(err) {}
                            }

                            onNotify(`✅ تم قبول طلب الخادم "${claim.servantName}" بنجاح وإضافة ${claim.pointsReward} نقطة لرصيده!`);
                            if (onRefreshGlobalData) onRefreshGlobalData();
                          }}
                          className="flex-1 sm:flex-initial h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          موافقة بالتصديق
                        </button>
                        <button
                          onClick={() => {
                            const updatedClaims = claimsList.map((c: any) => 
                              c.id === claim.id ? { ...c, status: 'rejected' } : c
                            );
                            setClaimsList(updatedClaims);
                            localStorage.setItem('angels_bonus_claims_v1', JSON.stringify(updatedClaims));
                            onNotify(`✕ تم رفض الطلب المقدم من الخادم "${claim.servantName}".`);
                            if (onRefreshGlobalData) onRefreshGlobalData();
                          }}
                          className="flex-1 sm:flex-initial h-8 px-3 text-red-650 bg-red-50 hover:bg-red-100 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          عدم الموافقة
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-sans text-xs">
              لا توجد طلبات تقديم بونص حالياً في الأرشيف للمراجعة والتدقيق.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
