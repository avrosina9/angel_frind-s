/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Subject,
  ActiveExam,
  UpcomingExam,
  ScoreHistoryItem,
  RankLevel,
  SkillChecklistItem,
  QuizQuestion,
  PracticalSection,
  FieldAlertTask,
} from './types';

import brandLogo from './assets/images/regenerated_image_1781800682461.png';
import personPortrait from './assets/images/pope_shenouda_portrait_1781782224273.jpg';

export const USER_PROFILE = {
  name: 'ميلاد بشته',
  fullName: 'ميلاد بشته عبد الشهيدبشاى',
  age: '24 سنة',
  phone: '01234567890',
  address: 'القاهرة، حدائق الأهرام، البوابة الثانية',
  currentService: 'أصدقاء الملائكة لذوي القدرات الخاصة (الصم والبكم)',
  role: 'متدرب - المستوى الرابع',
  levelLabel: 'Level 4 Trainee',
  performance: 'أداء ممتاز',
  points: 2450,
  studyHours: 124,
  completedExams: 14,
  averageResult: 88.5,
  avatarUrl: personPortrait,
  logoUrl: brandLogo,
  level: 'الخادم المميز - المستوى الثالث',
  rankOrder: 'الترتيب الثاني على الدفعة',
};

export const SUBJECTS: Subject[] = [
  {
    id: 'sign-language',
    title: 'مبادئ لغة الإشارة للتواصل',
    lessonsCount: 12,
    progress: 75,
    tag: 'مواد الإعاقة',
    tagType: 'disability',
    icon: 'accessible',
    accentColor: '#3b82f6',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBioXyHAS47CwNh4MR1stnKeSq5lRG2-3XpjYXWxASWKsB8LcxxbrJlJVr2Nav9tqQ8Dw4txFudqE-EPXKi20WJaVI-Xrs_W5ppG6f05MQE_rot1_n9rVQoDa1P5pAJ2R0-X3QOiQSONqBhhyf0tErKvRLtn-ckPy8PHH9Vl1eV01RqcMGHGuCuqUGQ1S7zlGy_obFBsHB2XkAc-IdoVeuYqS1f3TzWvDHhsu67n-YPRm6137Tx7ISYwld8TnSspdCTVbJsWFtJX1W9',
    statusText: 'ممتاز',
    description: 'تعلم أساسيات التعبير الإشاري والأبجدية الإشارية لخدمة كنسية شاملة لجميع الفئات وتسهيل الافتقاد.',
    resources: [
      {
        id: 'res-sl-1',
        title: 'كتاب القاموس الإشاري العربي الموحد',
        type: 'pdf',
        url: 'https://example.com/books/sign_language_arabic.pdf',
        description: 'دليل مصور شامل لأهم الكلمات والجمل الشائعة والمفردات الكنسية بلغة الإشارة.',
        duration: '45 صفحة'
      },
      {
        id: 'res-sl-2',
        title: 'شرح صوتي: فنيات التعامل العملي مع الصم',
        type: 'audio',
        url: 'https://example.com/audio/sign_methods.mp3',
        description: 'شرح صوتي مسجل من أحد المستشارين لبيان تكتيكات لغة الجسد وعلامات الوجه التعبيرية.',
        duration: '15:20'
      },
      {
        id: 'res-sl-3',
        title: 'فيديو عملي: الحروف الهجائية الإشارية كاملة',
        type: 'video',
        url: 'https://example.com/video/hands_alphabet.mp4',
        description: 'مشاهدة تطبيقية تفاعلية لحركات أصابع ومفاصل اليد لمطابقة الحروف الأبجدية بيسر ووضوح.',
        duration: '08:45'
      }
    ]
  },
  {
    id: 'theology',
    title: 'تفسير الرسائل اللاهوتية والطقسية الكبرى',
    lessonsCount: 16,
    progress: 90,
    tag: 'مواد روحية',
    tagType: 'spiritual',
    icon: 'church',
    accentColor: '#15803d',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgIAFOAbuhfTwJy9f-UpmtKrT5sniem5gz4LkiVfVKliZhn_MnPq3ZuvCKKRt3_7W802kN3dED-Ve52MZS1GAR2enwqMvpLskvaqI30A1sknLBGFlX4kv-u5H520FfagAVItYxnlwtCpobcEfLnAIKk24m_J29jO5XA6xIuvFJKodV-UxikECL_M6hp0c0iwlUmw7cAkIIizmKAWH_pPLFpDzteOGwX3xzhTHwGkOXS4SMsW24nUjihZE1Pcau97lmg-cudqYCU-mc',
    statusText: 'أوشكت على الانتهاء',
    description: 'شروح تفصيلية ونقاط نظرية لآباء الكنيسة الأوائل لخدمة روحية معمقة ومثمرة لمجتمع المتدربين والشركاء.',
    resources: [
      {
        id: 'res-love-1',
        title: 'كتاب المحبة - قداسة البابا شنوده الثالث',
        type: 'pdf',
        url: 'https://example.com/books/book_of_love_pope.pdf',
        description: 'مؤلَّف روحي قيم لقداسة البابا شنودة الثالث في تبيان ماهية المحبة، بذل الذات والاتصال الوجداني للمخدومين.',
        duration: '180 صفحة'
      },
      {
        id: 'res-th-1',
        title: 'كتاب شرح رسالة العبرانيين الروحية وبراهين الكهنوت',
        type: 'pdf',
        url: 'https://example.com/books/hebrews_commentary.pdf',
        description: 'مرجع لاهوتي كامل غني بالشواهد والتفاسير الآبائية العميقة والموثقة قانوناً.',
        duration: '120 صفحة'
      },
      {
        id: 'res-th-2',
        title: 'عظة صوتية: قوانين الآباء والمحبة الأخوية في الخدمة',
        type: 'audio',
        url: 'https://example.com/audio/holy_love.mp3',
        description: 'عظة صوتية هادفة تحث على روح العمل المشترك والروابط الاجتماعية الكنسية والتنمية الوجدانية.',
        duration: '22:15'
      },
      {
        id: 'res-th-3',
        title: 'رابط خارجي متاح: مكتبة الآباء والباحثين الذهبية',
        type: 'link',
        url: 'https://orthodox-patristics.org/library',
        description: 'الوصول المباشر لقواعد البيانات والموسوعات اللاهوتية للدراسات الكنسية المقارنة.',
        duration: 'رابط خارجي'
      }
    ]
  },
  {
    id: 'first-aid-materials',
    title: 'الإسعافات الأولية وتأمين المريض',
    lessonsCount: 10,
    progress: 50,
    tag: 'مواد عامة',
    tagType: 'general',
    icon: 'heart-pulse',
    accentColor: '#10b981',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdB_etPZ1A9oee8MtdPs1xzbtuCBtdsI-BO4yvTbDgW73qQBBWneihh9KSfcMk6hI6SBE0LP-ji8ZIKUf3kEen9djEXgcBkjhxFvnBW1WJeUTLl470BeeGQDYnO_soWNJJewCOsyh8VfXeiWMLkjQXevQN4lnJcSfYt-jaMBT8M-Qk3A_0p6-6AvoL0xKNnd3fTfaRXZNaEB4yoYo9-nYHQGI3nWWMLbPTZAibEk5zeR7K2AFeKiCAr7aJzDvcdXz4NjgoVl2ODcrk',
    statusText: 'ممتاز',
    description: 'الخطوات الفنية الموثقة لإنقاذ الأرواح وتدبير الأزمات الصحية بالمدارس والمؤتمرات وحصص النادي الصيفي.',
    resources: [
      {
        id: 'res-fa-1',
        title: 'كتاب حقيبة المتدرب للإسعافات الأولية والصدمات',
        type: 'pdf',
        url: 'https://example.com/books/first_aid_manual.pdf',
        description: 'المقرر الإرنست الفني الشامل المعتمد من لجنة تدريب أصدقاء الملائكة للرعاية الطبية العاجلة.',
        duration: '54 صفحة'
      },
      {
        id: 'res-fa-2',
        title: 'فيديو توضيحي: الإنعاش القلبي الرئوي للأطفال والبالغين',
        type: 'video',
        url: 'https://example.com/video/cpr_adult.mp4',
        description: 'فيديو مصور لشرح طريقة ترتيب الضغط وتوزيع التنفس الاصطناعي على المجسم الطبي الافتراضي والدمى.',
        duration: '11:40'
      }
    ]
  },
  {
    id: 'orbital-curriculum',
    title: 'التنظيم الكنسي والمخططات المهارية والميدانية',
    lessonsCount: 8,
    progress: 40,
    tag: 'مواد مهارية',
    tagType: 'orbital',
    icon: 'network',
    accentColor: '#8b5cf6',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKCJtj5Qsxp83ukD-s8Hf--tKC7Su_I2WCEOrABVYvsdaONesLH5OxUPLQcI_uRt67p4q4xNTNelonom_vPa_JEx4EdqSStTFGGBLhYiup4TLfuSLobJt68I2C67ETjYhgCe_-ozIqF33jhoOwmzbCU6QMThtCDgNHXASYjbA60ozjQVugNeSMuM9sP5gS7M_BoHwS4R9NxpuHEmhxnP54RFgN3Myyq_cDXlkh0LaRmSjQ7S-l4_ep2Qzyeb0ELDL7GE3jGu07yU_R',
    statusText: 'في البداية',
    description: 'تحليل البنى التنظيمية وتأطير المسار الإداري وتوزيع جداول الرعاية للمشاريع الخدمية الكبرى.',
    resources: [
      {
        id: 'res-or-1',
        title: 'دليل تخطيط المحاضرات الروحية وتنظيم المجموعات الصفية',
        type: 'pdf',
        url: 'https://example.com/books/lecture_planning.pdf',
        description: 'نماذج تخطيط دقيقة توزع مسارات الأنشطة وتساعد الخادم في توجيه التفاعل والأسئلة وحفظ الوقت.',
        duration: '28 صفحة'
      },
      {
        id: 'res-or-2',
        title: 'شرح صوتي: فقه القيادة والعمل المهاري الجماعي',
        type: 'audio',
        url: 'https://example.com/audio/leadership_flow.mp3',
        description: 'تسجيل لإدارة الأزمات في الفصول وحل التعارضات الفدائية بين المتدربين بكفاءة.',
        duration: '14:35'
      }
    ]
  },
  {
    id: 'human-development',
    title: 'تنمية الكفاءة والتحدث أمام الجمهور',
    lessonsCount: 14,
    progress: 60,
    tag: 'مواد تنمية بشرية',
    tagType: 'humandev',
    icon: 'users',
    accentColor: '#f59e0b',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN4SMBtWxtHRvkoyb_pcYnZHEljAO1Y7b83NN2a6sQtEMQZdwvAXonrlNsHHgN06lYjyFCCcslxcFhohFCQOxjGp_wD19XCUo-AHQ4j_j8O41B8KYWEn4q16Byn2jaO2LiL8qk9ATh4AGMJa8JB-BCn2bz9gI0OkKPcq99PIX1HSN8WjqmcvrEx5A1mJILFDAh2p4VJiT-6nyZjj5bETUKfZxSe0FKIi3cOGWYcTvaf0w5i_TSeejGrZMzYeY_Ztl3tCl1ToX2Rs4U',
    statusText: 'ممتاز',
    description: 'بناء الثقة الذاتية، لغة الجسد المتقنة، وتكتيكات إيصال القيم بأساليب التنمية البشرية والجمل الجذابة الشاملة.',
    resources: [
      {
        id: 'res-hd-1',
        title: 'تسجيل تدريبي: لغة الجسد الكنسية وجذب انتباه الدارسين',
        type: 'audio',
        url: 'https://example.com/audio/public_speaking_tips.mp3',
        description: 'عشرات النصائح التثقيفية لتوظيف طبقات الصوت المناسبة وتوزيع نظرات العين لربط القاعة.',
        duration: '18:40'
      },
      {
        id: 'res-hd-2',
        title: 'رابط خارجي: دورة مهارات الذكاء الاجتماعي والإيماني المتقدمة',
        type: 'link',
        url: 'https://example.com/courses/social_intelligence',
        description: 'صفحة التسجيل وحجز المقاعد المجانية للأبحاث التربوية والحلول الفردية السلوكية.',
        duration: 'موقع خارجي'
      }
    ]
  },
  {
    id: 'contests-prep',
    title: 'مسابقة كنز الرحمة والأنشطة الثقافية',
    lessonsCount: 20,
    progress: 30,
    tag: 'مواد مسابقات',
    tagType: 'contests',
    icon: 'trophy',
    accentColor: '#ec4899',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo3_Phd4K22NyxAN9-aoWZ-i0vxdkRZx2TAROoKhOhAa7qDf99M6cIEMYYrrWxWJ6LngyDM0ZLyikSDwDmjOENNeOGas76WJDnPjkqOsqHDtghOgnBSuL9eCmTaiSokZQzGCxDsTYSrP21LO_Ial0FRYgX3yiMFnk4MQhTpwBH8qrrhPKP04oB9l4jd36CZpb3-rk-bIyVt13M_Kos9g11kwpBlXPU5r4ivktDaX4iMmMNAS3CoitdMqPcdo3a5ebIGNXSUzbQ_UFl',
    statusText: 'في البداية',
    description: 'توجيهات ومراجعات مسابقة كنز الرحمة الساقية لعام 2026 وأهم حصيلة للأسئلة الثنائية للمتوفين الأبرار والخدام الجدد.',
    resources: [
      {
        id: 'res-cp-1',
        title: 'ملف المراجعة شامل: كنز الرحمة والأسئلة الكنسية المتوقعة',
        type: 'pdf',
        url: 'https://example.com/books/mercy_treasure_questions.pdf',
        description: 'ملحق مراجعة غني بعشرات الأسئلة المجابة لدعم المتسابقين في حجز المراتب الأولى.',
        duration: '35 صفحة'
      }
    ]
  }
];

export const SPECIAL_SUBJECT = {
  title: 'الفيزياء: الميكانيكا',
  description: 'اكتشف قوانين الحركة والجاذبية من خلال تجارب تفاعلية ودروس مرئية مبسطة.',
  tag: 'درس جديد متاح',
};

export const ACTIVE_EXAMS_DATA: ActiveExam[] = [
  {
    id: 'active-love-exam',
    title: 'اختبار كتاب المحبة - قداسة البابا شنوده الثالث',
    description: 'اختبار تقييمي شامل يتضمن 30 سؤالاً على كتاب المحبة لفضيلة قداسة البابا شنوده الثالث، لتقييم الحصيلة المعرفية.',
    duration: 45,
    questionsCount: 30,
    category: 'القسم الروحي',
  },
  {
    id: 'active-1',
    title: 'التمريض الأساسي - الوحدة الرابعة',
    description: 'هذا الاختبار يغطي مفاهيم العناية المتقدمة والإسعافات الأولية. مدة الاختبار 45 دقيقة.',
    duration: 45,
    questionsCount: 20,
    category: 'القسم العام',
  },
  {
    id: 'active-2',
    title: 'تفسير العهد الجديد',
    description: 'اختبار تقييمي لمسار دراسة تفسير العهد الجديد والرسائل اللاهوتية الكنسية مخصص للخدام المميزين.',
    duration: 30,
    questionsCount: 15,
    category: 'القسم الروحي',
  },
  {
    id: 'active-3',
    title: 'تاريخ الكنيسة المعاصر',
    description: 'امتحان شامل لنشأة وتاريخ الكنيسة المعاصر وتأثيرها الاجتماعي عبر القرون.',
    duration: 45,
    questionsCount: 20,
    category: 'القسم الروحي',
  },
  {
    id: 'active-4',
    title: 'المهارات القيادية والعمل الجماعي',
    description: 'تقييم الجوانب النظرية ومبادئ القيادة والتوجيه وإدارة الفريق في الأنشطة الميدانية.',
    duration: 30,
    questionsCount: 10,
    category: 'مواد مهارية',
  },
  {
    id: 'active-5',
    title: 'مبادئ لغة الإشارة والتعامل مع الإعاقة',
    description: 'اختبار تمهيدي للمهارات الأساسية المطلوبة للتواصل الفعال مع الأشخاص ذوي الإعاقة السمعية والبصرية.',
    duration: 45,
    questionsCount: 15,
    category: 'قسم الاعاقة',
  },
];

export const UPCOMING_EXAMS: UpcomingExam[] = [
  {
    id: 'upcoming-1',
    title: 'جدول الإحصاء الحيوي',
    platform: 'Google Sheets',
    time: 'غداً 10:00 ص',
    icon: 'table_chart',
    platformIconBg: 'bg-green-100 text-green-700',
  },
];

export const SCORE_HISTORY: ScoreHistoryItem[] = [
  {
    id: 'score-1',
    subjectName: 'علم التشريح - المستوى الأول',
    date: '12 أكتوبر 2026',
    maxScore: 100,
    achievedScore: 95,
    status: 'passed',
    category: 'القسم العام',
  },
  {
    id: 'score-2',
    subjectName: 'تطبيقات جوجل التعليمية',
    date: '05 أكتوبر 2026',
    maxScore: 100,
    achievedScore: 82,
    status: 'passed',
    category: 'القسم العام',
  },
  {
    id: 'score-3',
    subjectName: 'التواصل الفعال مع المرضى',
    date: '28 سبتمبر 2026',
    maxScore: 100,
    achievedScore: 74,
    status: 'passed',
    category: 'مواد مهارية',
  },
  {
    id: 'score-4',
    subjectName: 'العقيدة الأرثوذكسية',
    date: '12 يونيو 2026',
    maxScore: 100,
    achievedScore: 95,
    status: 'passed',
    category: 'القسم الروحي',
  },
  {
    id: 'score-5',
    subjectName: 'طقوس الكنيسة',
    date: '05 يونيو 2026',
    maxScore: 50,
    achievedScore: 42,
    status: 'passed',
    category: 'القسم الروحي',
  },
  {
    id: 'score-6',
    subjectName: 'الإرشاد الروحي',
    date: '28 مايو 2026',
    maxScore: 80,
    achievedScore: 35,
    status: 'failed',
    category: 'القسم الروحي',
  },
];

export const RANK_LEVELS: RankLevel[] = [
  {
    id: 'rank-leader',
    levelName: 'مستوى القائد',
    englishName: 'Leader',
    pointsRange: '3001 - 4000',
    description: 'رتبة الشرف القصوى للخدمة الاستثنائية والريادة والمسؤولية الشاملة.',
    badgeClass: 'level-badge-leader',
    bgClass: '#00B0F0',
    iconName: 'stars',
  },
  {
    id: 'rank-distinguished',
    levelName: 'الخادم المميز',
    englishName: 'Distinguished',
    pointsRange: '2001 - 3000',
    description: 'أداء استثنائي مستمر والتزام تام بكافة الأنشطة والمهام العملية والتحضيرات الدراسية.',
    badgeClass: 'level-badge-distinguished',
    bgClass: '#00B050',
    iconName: 'verified',
    isActive: true,
  },
  {
    id: 'rank-trainee',
    levelName: 'الخادم المتدرب',
    englishName: 'Trainee',
    pointsRange: '1001 - 2000',
    description: 'مستوى تطوير المهارات والمشاركة النشطة في الأبحاث والمحاكاة الميدانية الأساسية.',
    badgeClass: 'level-badge-trainee',
    bgClass: '#FFFF00',
    iconName: 'school',
  },
  {
    id: 'rank-beginner',
    levelName: 'الخادم المبتدئ',
    englishName: 'Beginner',
    pointsRange: '0 - 1000',
    description: 'مرحلة البداية والتأسيس والانخراط الأولي في المناهج والصفوف التمهيدية.',
    badgeClass: 'level-badge-beginner',
    bgClass: '#FF0000',
    iconName: 'pacing',
  },
];

export const SKILL_CHECKLIST: SkillChecklistItem[] = [
  {
    id: 'chk-1',
    label: 'التحضير المسبق للدروس والمناهج الأساسية',
    status: 'evaluated',
    statusText: 'تم التقييم',
    checked: true,
  },
  {
    id: 'chk-2',
    label: 'التفاعل الإيجابي مع الطلاب أثناء المحاكاة',
    status: 'review',
    statusText: 'قيد المراجعة',
    checked: false,
  },
  {
    id: 'chk-3',
    label: 'الالتزام التام بالزي الرسمي والمظهر الوقور',
    status: 'completed',
    statusText: 'مكتمل',
    checked: true,
  },
  {
    id: 'chk-4',
    label: 'تسليم التقارير الميدانية والمشروع في الموعد المختار',
    status: 'required',
    statusText: 'مطلوب',
    checked: false,
  },
];

export const SECTION_COMPLETION = [
  { name: 'القسم الروحي', percentage: 85, color: '#15803d', icon: 'auto_awesome' },
  { name: 'مواد مهارية', percentage: 60, color: '#006c49', icon: 'psychology' },
  { name: 'قسم الاعاقة', percentage: 45, color: '#f9a825', icon: 'accessible' },
  { name: 'القسم العام', percentage: 90, color: '#ba1a1a', icon: 'public' },
  { name: 'مسابقة كنز الرحمة', percentage: 30, color: '#8e24aa', icon: 'volunteer_activism' },
];

export const EVALUATION_NOTES = {
  header: 'ملاحظات التقييم والمشرف الميداني',
  note: 'المتدرب يظهر التزاماً كبيراً في الجانب النظري، والدروس الروحية، والمهارات الميدانية، ولكنه يحتاج إلى مزيد من التركيز في "الافتقاد" والالتزام الكامل للحضور المبكر في الأنشطة والفعاليات الخارجية.',
};

export const QUIZ_QUESTIONS: { [key: string]: QuizQuestion[] } = {
  'active-love-exam': [
    { id: 'q1', questionText: 'ما هي صلة الاتصال الكبرى التي يُقاس بها عمق الفكر التدريبي وفق كتاب المحبة لقداسة البابا شنوده؟', options: ['كسب التباهي الذاتي', 'بذل الذات والتفاني في الخدمة الإنسانية والروحية للضعفاء', 'المطالبة بالوقوف المنفرد للدرجات', 'إنهاء المقررات الكنسية السردية فقط'], correctAnswerIndex: 1 },
    { id: 'q2', questionText: 'يحدد قداسة البابا شنوده في الباب الأول أن أصل كل عمل مالي أو صالح نابع بالأساس من فضيلة؟', options: ['المحبة الكاملة النقية وعلاقتها بالله', 'التحضير السردي الجاف والشكلي', 'تنظيم المجموعات الميدانية الكلاسيكية', 'تسليم التقارير الأكاديمية البحتة'], correctAnswerIndex: 0 },
    { id: 'q3', questionText: 'المحبة التي تطلب منفعها الذاتية أو شروطها وتتأثر بالخصومة والاضطرابات تسمى بالحب؟', options: ['الحب الباذل الدائم', 'الحب النفعي المشروط الزائل', 'الحب الروحي المتنامي', 'الحب الأخوي السماوي'], correctAnswerIndex: 1 },
    { id: 'q4', questionText: 'ما هي الغاية الكبرى لخدمة "أصدقاء الملائكة" لذوي الاحتياجات الخاصة كترجمة لفضيلة الحب الباذل؟', options: ['الدعاية الفردية والمكاسب الأرضية للخدام', 'تصدير درجات الحضور الشفهي', 'رعاية الأطفال بحنو وبشاشة وتسهيل دمجهم كملائكة مختارين', 'استرداد الهوية الكلاسيكية للنادي الساقي'], correctAnswerIndex: 2 },
    { id: 'q5', questionText: 'يقول قداسة البابا شنودة الثالث في مؤلَّفه أن حجر الأساس ومفتاح العبور لقلوب الآخرين يكمن في? ', options: ['اللطف والترفق والقول البشوش المتضع', 'استعراض المعرفة الجافة المكتسبة', 'الغرور وحب الذات والتصدر الإداري', 'صنع الفجوات والخصام الطويل'], correctAnswerIndex: 0 },
    { id: 'q6', questionText: 'ما هو "التذلل الاختياري" الذي تدرج البابا شنودة الثالث في شرحه كأرقى مظاهر المحبة؟', options: ['الانسحاب الكلي من الحقل الخدمي', 'بذل الذات والتضحية في رعاية المخدومين كبرواز للمحبة', 'الحب المشروط في أوقات الهدايا والاستحقاق', 'استخدام المبررات التربوية للإهانة والغياب'], correctAnswerIndex: 1 },
    { id: 'q7', questionText: 'وفق الإثباتات التي صاغها البابا شنوده، فإن المحبة الفائقة لجميع الناس لا يمكن تفعيلها دون؟', options: ['التمرس بالألعاب الرياضية والصوتية', 'حب الله الخالق أولاً الذي يملأ الوجدان بنبعه الأصيل', 'الحصول على الترتيب والدرجات التنافسية فقط', 'الالتزام الشكلي باللوائح دون مشاركة قلبية'], correctAnswerIndex: 1 },
    { id: 'q8', questionText: 'ما هو الفيروس الخطير والعدو الأول الذي يجهض ثمار المحبة في نفوس الخدام ويفسد نقاء خدمتهم؟', options: ['حب الذات والأنا المتضخمة بطلب المظاهر والامتيازات', 'الافتقاد المبكر للمتغيبين', 'التفاني في لغة الإشارة', 'قراءة المراجع وتلخيص الأفكار'], correctAnswerIndex: 0 },
    { id: 'q9', questionText: 'أي من الكلمات والعبارات الآتية تصف "قانون الاحتمال وطول الأناة" في الفكر البابوي للمحبة الروحية؟', options: ['الاحتمال بصبر وفرح متطلع ورعاية المخدوم بابتسامة دافئة', 'التذمر الدائم أمام المشرفين والمنفيّين', 'التأخر عن حضور المواعيد والغياب بدون حجة', 'تسجيل نقاط البونص بشكل يدوي مكرر'], correctAnswerIndex: 0 },
    { id: 'q10', questionText: 'المحبة العملية الحقيقية وفق النص الإنجيلي المذكور بكتاب المحبة لا تكون بالكلام أو باللسان بل؟', options: ['بالقول الفخم السردي والخطب القيادية', 'بالعمل والحق وتجسيد البذل ميدانياً', 'بالاعتراض المستمر على درجات التقييم', 'بالتصاميم الرقمية الزاهية البحتة'], correctAnswerIndex: 1 },
    { id: 'q11', questionText: 'شعار "المحبة لا تسقط أبداً" يشير بشكل لاهوتي وروحي ووجداني إلى أن المحبة الصادقة؟', options: ['تتحرك بانتظام وفق الدائرة المدارية العارضة', 'نابعة مستمرة ومتصلة من طبيعة الله الأزلي المحب', 'تتعطل بقرارات الخصام والتوقيتات الجافة', 'تنتهي بمجرد تخرج الخادم وحصوله على المكافأة الكبرى'], correctAnswerIndex: 1 },
    { id: 'q12', questionText: 'ما هو موقف الخادم المتضع حيال خدمته لأطفال "أصدقاء الملائكة" لذوي القدرات السمعية والبصرية؟', options: ['يعتبر نفسه الأكبر منصباً وخبرة بوسط القاعة', 'يرى نفسه دائماً المتضع المحظوظ لخدمة كوكبة بريئة ممثلة لله', 'يتجنب التواصل الفعلي ويركز في التوثيق الشفهي والمحاسبي', 'يطالب بالتعديل الدائم لصورته ليتصدر الإعلانات الدبلوماسية'], correctAnswerIndex: 1 },
    { id: 'q13', questionText: 'المحبة تترفق وتتأنى ولا تحسد ولا تفاخر ولا تنتفخ؛ هذه الفضائل مجتمعة تثبت بالعمق قران المحبة وفضيلة؟', options: ['الاتضاع الحقيقي وبغض الذات', 'التباهي بنتيجة الرصد المالي', 'السماح للخدام بنيل البونص يدويا دون سبب', 'استعراض النبرة المدارية'], correctAnswerIndex: 0 },
    { id: 'q14', questionText: 'عندما تخدم طفلاً معاقاً، كيف تترجم طبقات صوتك ونبرة الافتقاد معاني كتاب المحبة للبابا شنودة؟', options: ['تلتزم بنبرة الأستاذية والتصحيح الرياضي المستمر لمخارج الحروف', 'تتحرك بحنان وصبر ولطف وتفهم لملامح الوجه التعبيرية بحنو دافق', 'تصيح بوجهه لتسيطر على هدوئه', 'تتجنب نبرة الوجه وتتركه للأجهزة الرقمية التلقائية'], correctAnswerIndex: 1 },
    { id: 'q15', questionText: 'يصف البابا شنوده المحبة المسيحية الروحية بأنها كالنهر الجاري الذي لا يمكن أن يحده؟', options: ['التمييز الفئوي أو الغرض الأرضي المحدود', 'حجم القاموس الإشاري الموحد', 'جدول نقاط الخصومات التربوية', 'برنامج طيران القاهرة الكبرى المخصص للناجحين'], correctAnswerIndex: 0 },
    { id: 'q16', questionText: 'الغضب وسرعة الانفعال بداخل الفصول التدريبية والميدانية هما انعكاس مباشر وناتج عن؟', options: ['نقاء المحبة وبذل الذات المنشود', 'ضعف في فضيلة السعة والترفق والاحتمال الروحاني', 'التحضير المنهجي الشامل للمساقات', 'ارتفاع درجات التقييم العملي للمتدرب'], correctAnswerIndex: 1 },
    { id: 'q17', questionText: 'كيف يرى قداسة البابا المحبة تجاه المغفرة لمن أساء إلينا وجهادها المستمر لدى قلوب الخدام؟', options: ['لا يصح الغفران لمن لا يلتزم بالزي الكنسي الرسمي', 'المغفرة هي ذروة الحب التي تحول المشاعر السلبية لطاقة غفران وحنو حقيقي بقوة الله', 'تمنع المغفرة عودة الدارس للصفوف التأسيسية', 'تنحصر المغفرة فقط بقرارات المفتش الروحي الخارجي'], correctAnswerIndex: 1 },
    { id: 'q18', questionText: 'ما المعنى العميق لجملة "المحبة تحتمل كل شيء" الواردة في رسالة كورنثوس الأولى ويؤكدها كتاب المحبة؟', options: ['تحمل منقصات الآخرين بدافع الحب الصادق والتشجيع دون تململ داخلي', 'أهمية الخضوع لعقوبة الخصم دون إدراك السبب الموثق', 'نقل محاميل الدارسين بالإجبار الميداني', 'قبول المناهج الدراسية دون تلخيصها'], correctAnswerIndex: 0 },
    { id: 'q19', questionText: 'وفق فضائل المحبة، أي من الدوافع التالية يجعل الخادم يفرح بنجاح وترقي زميله بالخدمة؟', options: ['المحبة النقية المشتركة الخالية من الغيرة والحسد والطلب الشخصي للذات', 'الخوف من رصد غياب بدون إذن يخصم من نقاطه', 'توقع اقتسام رمز جائزة رحلة مدينة الثلج الكبرى يدوياً', 'المصلحة الحسابية المؤقتة للفصل الدارسي'], correctAnswerIndex: 0 },
    { id: 'q20', questionText: 'يعلمنا البابا شنوده أن النفس التي تخلو من المحبة الروحية الحكيمة، تعيسة وتتحول عبادتها لـ؟', options: ['نشاط إيماني مثمر ومعين', 'ممارسات جسدية وطقسية شكلية جافة خاوية من الروح والنعمة', 'مسارات إدارية ومدارية مهارية فائقة الكفاءة', 'نظام رصد الكتروني معقد بنقاط تلقائية'], correctAnswerIndex: 1 },
    { id: 'q21', questionText: 'المحبة لا تظن السوء، بمعنى أن الخادم الروحي الحقيقي عندما يرى موقفاً غامضاً؟', options: ['يسارع بالحكم السلبي ورصد الخصومات والملاحظات القاسية', 'يلتمس عذراً لأخيه بصدق ونقاء تفكير وطمأنينة قلبية', 'يتطرق للشكاوى الميدانية وينقلها لصفحة المشرف فوراً', 'يتجاهل الموضع ويطالب بالترتيب الفردي'], correctAnswerIndex: 1 },
    { id: 'q22', questionText: 'أي من التعبيرات يمثل توازن المحبة والصبر والترفق مع الأطفال ذوي متلازمة داون بمجتمع أصدقاء الملائكة؟', options: ['التململ السريع من بطء الاستجابة والمطالبة بتبديل الفصول الحركية', 'الإنصات العميق بأذن صاغية وبسمة ممتد بالحب وبذل الذات المستمر بمثابرة لاهوتية', 'إعطاء درجات تجميلية وهمية دون محاكاة للتخلص من الوقت الموحد', 'عزلهم عن المساق والتركيز على الخدام المتدربين بكفاءة فردية'], correctAnswerIndex: 1 },
    { id: 'q23', questionText: 'المحبة تسر بالحق ولا تسر بالإثم؛ تدل هذه الصفة على أن الحب الحقيقي ممتزج بالكامل بفهم؟', options: ['العدالة والقداسة والصدق السماوي دون تحيز للأخطاء', 'النقاط المالية والحلول الاختزالية للمخالفات', 'الترقي الطائفي السريع بوسط الدفعة', 'الاحتياجات الكلاسيكية المدارية والرمزية لجائزة أوائل الدفعات'], correctAnswerIndex: 0 },
    { id: 'q24', questionText: 'يقول قداسة البابا شنوده أن ثمرة محبتنا الصادقة لله الخالق تنعكس بشكل ملموس في حياتنا من خلال؟', options: ['المحبة الباذلة التي نقدمها للآخرين لاسيما الضعفاء والمرضى والمهمشين', 'كثرة التنقلات والديكورات الخدمية الشكلية بحفل الافتتاح', 'جمع درجات النقاط بأية وسيلة كانت والمطالبة اليدوية بالاستثناء', 'المشاركات الرياضية البعيدة عن الروح الكنسية الموثقة قديماً'], correctAnswerIndex: 0 },
    { id: 'q25', questionText: 'المحبة الروحية الدائمة كالبذرة الصالحة؛ متى نمت في وجدان الخادم فإن ثمارها تكون؟', options: ['السلام الداخلي، التعاطف، المغفرة والالتزام المبتسم لخدمة الآخرين', 'القلق المستمر من الخصومات واللوائح الرصديّة', 'المطالبة المستقرة بالجول الذهبية لتذاكر الحجز والتنقل', 'حب الشهرة واختراع الألقاب للمتحدث والجمهور'], correctAnswerIndex: 0 },
    { id: 'q26', questionText: 'ما المعنى الروحي الذي يوضحه كتاب المحبة للبابا شنوده حيال عبارة "المحبة لا تتفاخر"؟', options: ['التحدث المستمر عن الإنجازات والدرجات الفردية لاستعراض العضلات العلمية', 'الاتضاع والصمت وخدمة الآخرين بتواضع وسرية دون ضجيج أو رغبة في العظمة', 'المطالبة بالجلوس بصدور الطاولات والواجهات الإدارية', 'كتابة الاسم رباعياً وتوزيعه بالبطاقة التعريفية بحروف ذهبية'], correctAnswerIndex: 1 },
    { id: 'q27', questionText: 'المحبة تبني؛ ما معنى البناء في الإرشاد الكنسي والاجتماعي كما يطرحه الباحث المتميز؟', options: ['بناء الجدران والهياكل الصفية بالمسابقة الحركية', 'بناء ثقة المخدوم ومساندة ضعفه وحماية كرامته وتطوير إحساسه بالتآخي الروحي', 'رصد الغيابات والمخالفات المانحة للخصومات لردع المتدربين بقسوة', 'بناء الجداول الرقمية وتعديل صيغ الرصد في ملفات الإحصاء'], correctAnswerIndex: 1 },
    { id: 'q28', questionText: 'عندما تدعو مخدوماً لزيارة كنسية وتجد غيابه بدون إذن مسبق، فإن رد الفعل المقترن بالمحبة والترفق هو؟', options: ['تطبيق الخصم الحسابي المانستير وحرمانه كلياً من مجموع الدرجات', 'الافتقاد الدافئ والاطمئنان عليه بصدر رحب والتماس عذر صادق لغيابه', 'توبيخه في حضور المشرف الميداني أمام حشد الخدام الجدد والشركاء', 'قطع التواصل به بالكامل والتركيز على الأوائل بمجال التمريض والخدمة'], correctAnswerIndex: 1 },
    { id: 'q29', questionText: 'المحبة الحقيقية الخالصة كما يشير البابا شنوده هي التي تقود الإنسان بلا نزاع إلى السجود و؟', options: ['الذود عن المكتسبات بوسط الاجتماع', 'الصلاة الحارة الصادقة بدموع متجردة لأجل نماء وسلامة وبنيان الكنيسة والمستضعفين', 'المنافسة المحسوسة لحصد المكافآت وعرض رموز الميكانيكا الطائرة لترفيهك الفردي', 'التصفيق الكنسي المستمر في قاعات الاحتفالات الكبرى'], correctAnswerIndex: 1 },
    { id: 'q30', questionText: 'الخاتمة الكبرى لكتاب المحبة تلخص الدرس الإرشادي الكامل لكل الخدام بالقول أن "حياة المحبة هي..."؟', options: ['مقرر نظري سردي ينتهي بانتهاء الامتحان ثلاثي الأبعاد والدرجات المؤرخة', 'حياة الفرح والملكوت الحقيقي المعاش على الأرض وبوابة اللقاء الإلهي الأبدي السعيد', 'مجموعة لوائح إحصائية تصدر من المؤسسة لفلترة المتدربين وحذفهم', 'الحديث المنفرد أمام الجمهور بالساحة لفرض الكفاءات البشرية المتميزة'], correctAnswerIndex: 1 }
  ],
  'active-1': [
    {
      id: 'q1',
      questionText: 'ما هي الخطوة الأولى والأساسية في كفاءة الإسعافات الأولية وتأمين المصاب؟',
      options: [
        'البدء بالتدليك القلبي فوراً دون فحم المجرى الهوائي',
        'تأمين سلامة المكان المحيط بالمصاب قبل الاقتراب وتقديم المساعدة',
        'نقل المصاب بسرعة فائقة إلى مكان آخر دون تثبيت العمود الفقريّ',
        'إعطاء المصاب سوائل دافئة بالفم لتنشيط الدورة الدموية',
      ],
      correctAnswerIndex: 1,
    },
    {
      id: 'q2',
      questionText: 'في مرحلة الإنعاش القلبي الرئوي (CPR)، ما هي النسبة الصحيحة للضغطات الصدرية مقارنة بالتنفس الاصطناعي؟',
      options: ['15 ضغطة مقابل نفس واحد', '30 ضغطة مقابل نفسين', '20 ضغطة مقابل 3 أنفاس', '10 ضغطات مقابل نفسين'],
      correctAnswerIndex: 1,
    },
    {
      id: 'q3',
      questionText: 'كيف يتم التعامل الأولي الصحيح مع الحروق الحرارية البسيطة من الدرجة الأولى؟',
      options: [
        'دهن الجلد بمعجون الأسنان أو الزيوت الطبيعية فوراً لتخفيف الحرارة',
        'وضع ماء بارد جاري معتدل الحرارة لمدة 10 إلى 15 دقيقة لتخفيض التورم',
        'استعمال الثلج المباشر على الحرق لتبريده بأسرع وقت',
        'ثقب الفقاعات المائية المتكونة للحد من تجمع السوائل',
      ],
      correctAnswerIndex: 1,
    }
  ],
  'active-2': [
    {
      id: 'q1',
      questionText: 'من هو كاتب إنجيل لوقا وسفر أعمال الرسل ومرافق بولس الرسول الطبيب؟',
      options: ['لوقا البشير', 'مرقس الرسول', 'يوحنا الإنجيلي', 'متى البشير'],
      correctAnswerIndex: 0,
    },
    {
      id: 'q2',
      questionText: 'إلى من كُتبت الرسالة الشهيرة الموجهة للعبرانيين لشرح المفهوم الروحي للكهنوت في العهد الجديد؟',
      options: ['المؤمنين من أصل يهودي', 'كنيسة غلاطية', 'كنيسة رومية', 'الأمم اليونانية'],
      correctAnswerIndex: 0,
    }
  ]
};

export const DEFAULT_PRACTICAL_SECTIONS: PracticalSection[] = [
  {
    id: 'visitation',
    title: 'بند الافتقاد والرعاية',
    icon: 'Compass',
    items: [
      { id: 'vis-phone', label: 'الاتصال التليفوني بالمخدومين', maxScore: 20, achievedScore: 18 },
      { id: 'vis-home', label: 'الزيارة المنزلية والاطلاع العملي', maxScore: 30, achievedScore: 25 },
      { id: 'vis-book', label: 'كتاب الافتقاد وتسليم التقرير الشهري', maxScore: 20, achievedScore: 16 }
    ]
  },
  {
    id: 'attendance',
    title: 'بند حضور وتفاعل الأطفال',
    icon: 'Users',
    items: [
      { id: 'att-response', label: 'تجاوب وتفاعل المخدوم بالإجابة والاندماج', maxScore: 35, achievedScore: 30 },
      { id: 'att-bus', label: 'تنظيم ومتابعة دورة السيارة لتنقل الأطفال', maxScore: 25, achievedScore: 20 }
    ]
  },
  {
    id: 'prep',
    title: 'بند الفقرات والدروس الميدانية',
    icon: 'BookOpen',
    items: [
      { id: 'prep-discuss', label: 'التحضير المسبق ومناقشة الدرس مع القادة', maxScore: 30, achievedScore: 25 },
      { id: 'prep-presentation', label: 'أسلوب العرض الحركي والإشاري المتميز', maxScore: 30, achievedScore: 24 },
      { id: 'prep-media', label: 'توظيف وسائل الإيضاح اللمسية والسمعية', maxScore: 20, achievedScore: 18 }
    ]
  },
  {
    id: 'conduct',
    title: 'بند السلوك العام للخادم',
    icon: 'Activity',
    items: [
      { id: 'cond-commitment', label: 'الالتزام التام بالتعليمات والوقت والزي', maxScore: 25, achievedScore: 22 },
      { id: 'cond-cooperation', label: 'التعاون والمشاركة الفاعلة مع باقي الخدام', maxScore: 25, achievedScore: 23 },
      { id: 'cond-belonging', label: 'الانتماء والشغف بنجاح رسالة المؤسسة', maxScore: 25, achievedScore: 25 },
      { id: 'cond-sacrifice', label: 'روح التضحية وبذل الوجدان في أوقات الأزمات', maxScore: 25, achievedScore: 20 }
    ]
  },
  {
    id: 'activities',
    title: 'بند الفعاليات والنشاط الخارجي',
    icon: 'Calendar',
    items: [
      { id: 'act-liturgy', label: 'القداس الإلهي والصلوات الطقسية', maxScore: 40, achievedScore: 35 },
      { id: 'act-trips', label: 'الرحلات الترفيهية والتأهيلية المفتوحة', maxScore: 20, achievedScore: 18 },
      { id: 'act-conferences', label: 'المؤتمرات التربوية الداخلية للأسر', maxScore: 20, achievedScore: 17 },
      { id: 'act-camps', label: 'المعسكرات التدريبية الطويلة', maxScore: 20, achievedScore: 15 },
      { id: 'act-festival', label: 'المهرجان الكنسي السنوي لأصدقاء الملائكة', maxScore: 20, achievedScore: 18 },
      { id: 'act-outings', label: 'الخروجات والأنشطة الاجتماعية البسيطة', maxScore: 20, achievedScore: 17 },
      { id: 'act-gatherings', label: 'الملتقيات العلمية وتنسيق المعارف والشركاء', maxScore: 20, achievedScore: 15 },
      { id: 'act-spiritual', label: 'الأيام الروحية والمغلقة وتطوير الإيمان', maxScore: 25, achievedScore: 22 }
    ]
  },
  {
    id: 'leaders',
    title: 'بند تقييم القادة والمشرفين',
    icon: 'Award',
    items: [
      { id: 'lead-self', label: 'التقييم الذاتي (استمارة الملاحظة الفردية)', maxScore: 15, achievedScore: 14 },
      { id: 'lead-family', label: 'تقييم قائد الأسرة الميداني المباشر', maxScore: 20, achievedScore: 18 },
      { id: 'lead-supervisor', label: 'تقييم مشرف الأسرة المتابع للأنشطة', maxScore: 20, achievedScore: 17 },
      { id: 'lead-general-sup', label: 'تقييم ومتابعة المشرف العام وإبداء الرأي', maxScore: 25, achievedScore: 22 },
      { id: 'lead-general-leader', label: 'تقييم القائد العام للمؤسسة وبوابة الترشيح', maxScore: 25, achievedScore: 21 }
    ]
  },
  {
    id: 'subservices',
    title: 'بند تقييم الخدمات الفرعية والتكامل',
    icon: 'Sparkles',
    items: [
      { id: 'srv-medical', label: 'الخدمة الطبية (تأمين الحالات، الإنعاش، الصيدلية)', maxScore: 20, achievedScore: 18 },
      { id: 'srv-recreational', label: 'الخدمة الترفيهية والمسرح وتبسيط الأنشطة', maxScore: 20, achievedScore: 19 },
      { id: 'srv-qualitative', label: 'الخدمة النوعية (التأهيل السلوكي والتطبيقي للأسر)', maxScore: 20, achievedScore: 16 },
      { id: 'srv-humanitarian', label: 'الخدمة الإنسانية وحرية الدمج وتوفير الاحتياجات', maxScore: 20, achievedScore: 18 },
      { id: 'srv-exhibitions', label: 'خدمة المعارض الميدانية وأنشطة الأداء اليدوي', maxScore: 20, achievedScore: 15 },
      { id: 'srv-educational', label: 'الخدمة التعليمية وفصول محو الأمية والتعليم الإشاري', maxScore: 25, achievedScore: 22 }
    ]
  }
];

export const DEFAULT_FIELD_ALERTS: FieldAlertTask[] = [
  {
    id: 'alert-1',
    title: 'القداس الإلهي لشهر يونيه',
    date: '2026-06-24',
    time: '07:00 ص',
    location: 'كنيسة رئيس الملائكة ميخائيل (طريق الملاك)',
    category: 'liturgy'
  },
  {
    id: 'alert-2',
    title: 'الرحلة الصيفية لمدينة الألعاب والترفيه',
    date: '2026-06-30',
    time: '08:00 ص',
    location: 'مدينة الثلج والملاعب المغلقة بمول مصر',
    category: 'trip'
  },
  {
    id: 'alert-3',
    title: 'المؤتمر التحضيري التكاملي للأنشطة',
    date: '2026-07-15',
    time: '05:00 م',
    location: 'بيت دير الأنبا بيشوي للمؤتمرات والندوات',
    category: 'conference'
  },
  {
    id: 'alert-4',
    title: 'المهرجان الوطني لإبداعات ملائكة الرعاية',
    date: '2026-08-20',
    time: '09:00 ص',
    location: 'مسرح الأنبا رويس بالكاتدرائية المرقسية بالعباسية',
    category: 'festival'
  }
];
