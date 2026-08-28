import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Compass, 
  Lightbulb, 
  Info, 
  Award, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Plus, 
  X, 
  BookOpen, 
  ClipboardList, 
  HelpCircle, 
  ChevronLeft, 
  Heart,
  Smile,
  CheckCircle,
  Eye,
  Hand,
  PenTool,
  Scissors
} from 'lucide-react';

interface TaskStep {
  id: number;
  text: string;
}

interface EducationalTask {
  id: string;
  familyId: 'angels' | 'stars' | 'butterflies' | 'knights' | 'heroes';
  familyName: string;
  domain: string; // e.g. مهام إدراكية, تنمية مهارات, تعديل سلوك, مهارات اجتماعية, مهارات حسية, منسيات, دروس روحية, أعمال فنية, مهارات حركية, أكاديمي
  skillName: string;
  goal: string;
  tools: string[];
  steps: TaskStep[];
  assistanceGraduation: string[];
  notes: string;
  reinforcements: string[];
  isCustom?: boolean;
}

interface SessionLog {
  id: string;
  taskId: string;
  taskTitle: string;
  servantName: string;
  childName: string;
  date: string;
  assistanceLevel: string;
  notes: string;
}

const PRE_SEEDED_TASKS: EducationalTask[] = [
  {
    id: 'sparrow-imitation',
    familyId: 'angels',
    familyName: 'اسرة الملايكة',
    domain: 'مهارات حركية',
    skillName: 'تقليد حركة العصفور الطيران 🐦',
    goal: 'أن يقلد الطفل حركة العصفور أثناء الطيران برفع الذراعين وتحريكهما للأعلى وللأسفل.',
    tools: ['صورة أو لعبة عصفور مجسمة', 'مساحة غرفية آمنة وخالية من العوائق للحركة'],
    steps: [
      { id: 1, text: 'اجذب انتباه الطفل البصري والسمعي إلى العصفور (سواء صورة أو لعبة مجسمة).' },
      { id: 2, text: 'قل للطفل بنبرة مرحة وجذابة: "ده عصفور جميل بيطير فوق!".' },
      { id: 3, text: 'اعرض الحركة ببطء أمام الطفل مع الابتسام والتشجيع المستمر.' },
      { id: 4, text: 'ارفع ذراعيك للأعلى ببطء مثل جناح العصفور أثناء الصعود.' },
      { id: 5, text: 'أنزل ذراعيك للأسفل برفق لتمثيل حركة جناح العصفور المنخفض.' },
      { id: 6, text: 'كرر الحركة عدة مرات متتالية ببطء حتى يلاحظها الطفل بوضوح ويستوعبها.' },
      { id: 7, text: 'اطلب من الطفل بلطف أن يحاول أن يفعل مثل العصفور الطائر.' },
      { id: 8, text: 'ساعده جسدياً ومباشرة إذا احتاج (ارفع ذراعيه معه بالتوجيه اللطيف).' },
      { id: 9, text: 'شجعه بعبارات رنانة ونشطة وهو يحاول تقليد الحركة بمفرده.' },
      { id: 10, text: 'مدحه بقوة وقدم له التعزيز الفوري المفضل عند نجاحه في المحاولة.' }
    ],
    assistanceGraduation: [
      'في البداية: مساعدة جسدية كاملة (تحريك ذراعيه معاً بلطف وأمان).',
      'ثم مساعدة جزئية (توجيه كوعيه وذراعيه برفق دون حمل كامل).',
      'ثم مساعدة لفظية أو إشارية (القول للطفل "طير يا بطل يا عصفور" مع الإشارة بيدك).',
      'أخيراً: يقلد الطفل الحركة بشكل مستقل تماماً وبمجرد سماع الأمر البصري.'
    ],
    notes: 'اجعل النشاط ممتعاً ومبهجاً وقصيراً (دقائق قليلة جداً لتفادي الإجهاد) وتكرر على فترات متباعدة خلال اليوم.',
    reinforcements: ['التصفيق الحار والمشجع', 'كلمات تشجيعية (أحسنت يا بطل!، شاطر جداً)', 'لعبة صغيرة محببة له', 'عناق دافئ أو ابتسامة مشرقة']
  },
  {
    id: 'color-matching',
    familyId: 'angels',
    familyName: 'اسرة الملايكة',
    domain: 'مهارات إدراكية',
    skillName: 'التمييز البصري ومطابقة الألوان الأساسية 🔴🔵',
    goal: 'أن يطابق الطفل الكرات الحمراء والزرقاء في السلال المتوافقة مع ألوانها بنسبة 80%.',
    tools: ['كرات بلاستيكية حمراء وزرقاء زاهية', 'سلتان صغيرتان (حمراء وزرقاء بالكامل)'],
    steps: [
      { id: 1, text: 'ضع السلتين والكرات الملونة بوضوح في مجال رؤية الطفل المباشر.' },
      { id: 2, text: 'امسك كرة حمراء، واجعل الطفل يركز نظره عليها، ثم ضعها في السلة الحمراء.' },
      { id: 3, text: 'قل بصوت واضح وبسيط: "أحمر مع أحمر... ده زي ده!".' },
      { id: 4, text: 'كرر نفس الخطوة مع الكرة الزرقاء واقرنها بالسلة الزرقاء بذات الهدوء.' },
      { id: 5, text: 'أعط الطفل كرة حمراء في يده واطلب منه وضعها في السلة المطابقة.' },
      { id: 6, text: 'إذا تردد، وجه يده اليمنى بلطف شديد نحو السلة الحمراء.' },
      { id: 7, text: 'كرر العملية بالتبادل المستمر بين اللونين الأحمر والأزرق لتثبيت المفهوم.' },
      { id: 8, text: 'قلل المساعدة الجسدية بالتدريج واعتمد على الإشارة بالإصبع أو توجيه العينين.' },
      { id: 9, text: 'أثنِ على محاولاته الصحيحة فوراً بهتافات حماسية.' },
      { id: 10, text: 'دعه يحتفظ بالكرة ويلعب بها لفترة وجيزة كنوع من المكافأة واللعب الحسي.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية كاملة: مسك يد الطفل ووضع الكرة الحمراء في السلة الحمراء.',
      'مساعدة جزئية: لمس معصم الطفل وتوجيه حركته نحو السلة الصحيحة.',
      'مساعدة بصرية: الإشارة بالإصبع نحو السلة الصحيحة عند إمساكه بالكرة.',
      'الاستقلالية: المطابقة الذاتية للون دون تلميح أو توجيه خارجي.'
    ],
    notes: 'لا تستخدم أكثر من لونين في البداية لتجنب تشتت تركيز الطفل، وتأكد من ثبات درجات اللون المستخدمة.',
    reinforcements: ['ستيكرز لاصقة نجوم ملونة', 'صفقة البطل السريعة', 'هز اليدين بانتصار', 'إعطاءه بالونة من نفس اللون المفضل']
  },
  {
    id: 'emotions-cards',
    familyId: 'stars',
    familyName: 'اسرة النجوم',
    domain: 'تعديل سلوك',
    skillName: 'التعبير عن الغضب والمشاعر بالصلصال 🎨',
    goal: 'أن يعبر الطفل عن مشاعره ويفرغ طاقة الغضب من خلال الضغط على الصلصال وتشكيله بدلاً من الصراخ.',
    tools: ['صلصال طبيعي آمن ومرن جداً', 'كروت تعبيرية مرسومة (وجوه غاضبة، سعيدة، حزينة)'],
    steps: [
      { id: 1, text: 'عند ملاحظة بداية نوبة الغضب أو الضيق لدى الطفل، خذه إلى ركن الهدوء المخصص.' },
      { id: 2, text: 'اجلس بمستواه البصري وقدم له قطعة صلصال ناعمة ومرنة ذات حجم كافٍ.' },
      { id: 3, text: 'امسك قطعة صلصال واضغط عليها بقوة أمام عينه لتوضيح التعبير.' },
      { id: 4, text: 'قل بصوت هادئ ومحبب: "أنا زعلان... هضغط على الصلصال بقوة عشان أرتاح".' },
      { id: 5, text: 'ضع قطعة الصلصال في يد الطفل وشجعه على الضغط والاعتصار بأصابعه.' },
      { id: 6, text: 'ساعده جسدياً بالضغط الخفيف على يده لمساعدته على تفريغ الشحنة الانفعالية.' },
      { id: 7, text: 'امتدح جهده في الضغط وقل له: "برافو يا بطل... الصلصال بيمتص الغضب والزعل!".' },
      { id: 8, text: 'اعرض عليه كرت الوجه السعيد بعد أن يهدأ، واطلب منه تشكيل وجه مبتسم بالصلصال.' },
      { id: 9, text: 'ساعده في فرد الصلصال بالنشابة البلاستيكية كنشاط تفريغي وتأهيلي إضافي.' },
      { id: 10, text: 'اغسلوا أيديكم معاً بنبرة احتفالية لإنهاء الموقف السلوكي بنجاح.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية: وضع الصلصال بيد الطفل والضغط معاً لمساعدته في البداية.',
      'مساعدة لفظية وتذكيرية: عند الغضب، قل له "فين الصلصال السحري؟ دعه يساعدك".',
      'مساعدة بصرية: الإشارة إلى صندوق الصلصال الملون الموضوع في متناول يده.',
      'المبادرة الذاتية: ذهاب الطفل تلقائياً للصلصال وتفريغ غضبه بشكل آمن ودون توجيه.'
    ],
    notes: 'احرص على أن يكون الصلصال رطباً وسهل التشكيل ليناسب مهارات عضلات اليد الضعيفة، وتجنب الصلصال القاسي.',
    reinforcements: ['كلمات مدح وربت دافئ على الكتف', 'الحصول على كوب ماء بارد منعش', 'الحصول على نجمة ذهبية على لوحة السلوك']
  },
  {
    id: 'hand-washing',
    familyId: 'stars',
    familyName: 'اسرة النجوم',
    domain: 'تنمية مهارات',
    skillName: 'روتين غسيل اليدين بالخطوات المصورة 🧼',
    goal: 'أن يغسل الطفل يديه بشكل مستقل بالماء والصابون باتباع 5 خطوات مصورة متتالية.',
    tools: ['بطاقات مصورة لخطوات غسيل اليدين معلقة بجوار الحوض', 'موزع صابون رغوي سهل الضغط'],
    steps: [
      { id: 1, text: 'اصطحب الطفل إلى الحوض عند موعد غسيل اليدين (مثل قبل تناول الوجبات).' },
      { id: 2, text: 'أشر إلى الخطوة الأولى باللوحة المصورة: "فتح صنبور الماء برفق".' },
      { id: 3, text: 'ساعد الطفل في بل يديه بالماء الفاتر بوضعهما تحت مجرى الصنبور.' },
      { id: 4, text: 'أشر للخطوة الثانية باللوحة: "الضغط على الصابون والحصول على الرغوة".' },
      { id: 5, text: 'ساعده في ضغط الموزع، وتوجيه يديه لفرك راحة الكفين معاً ببطء.' },
      { id: 6, text: 'وجهه لتخليل الأصابع وفرك ظهر اليدين بالاستعانة بالمحاكاة الحية.' },
      { id: 7, text: 'أشر للخطوة الثالثة: "شطف اليدين بالماء جيداً وإزالة الرغوة بالكامل".' },
      { id: 8, text: 'أشر للخطوة الرابعة: "إغلاق صنبور المياه بالكامل لمنع الهدر والمحافظة عليه".' },
      { id: 9, text: 'أشر للخطوة الخامسة والأخيرة: "تجفيف اليدين بالفوطة النظيفة جيداً برفق".' },
      { id: 10, text: 'انظر ليديه وقل بسعادة: "الله! يديك نظيفة وريحتها جميلة جداً يا بطل!".' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية كاملة: غسل يديه بيدك تحت الماء خطوة بخطوة وتدليكهما.',
      'مساعدة جسدية جزئية: توجيه كوعيه ودفعهما بلطف للأمام نحو المياه والصابون.',
      'مساعدة بصرية وإشارية: الإشراف والإشارة للبطاقات التوضيحية عند الانتقال لكل خطوة.',
      'الاستقلالية التامة: أداء المهمة بالكامل بمجرد تذكير لفظي خفيف "اغسل يديك".'
    ],
    notes: 'تأكد من ملاءمة ارتفاع الحوض لطول الطفل، واستخدم صابوناً برائحة منعشة يحبها ليتحفز على تكرار النشاط.',
    reinforcements: ['التصفيق الحماسي واحتضان الطفل', 'رسم ابتسامة بسيطة على ظهر كفه بالقلم الجاف الآمن', 'إعطاءه ستيكر كارتوني مفضل']
  },
  {
    id: 'collaborative-art',
    familyId: 'butterflies',
    familyName: 'اسرة الفراشات',
    domain: 'أعمال فنية',
    skillName: 'لوحة البصمات التعاونية الملونة 🎨',
    goal: 'أن تشترك الطفلة مع زميلتها في تزيين لوحة شجرة ببصمات الأصابع بالتناوب والصبر لـ 10 أدوار.',
    tools: ['لوحة كرتونية مرسوم عليها جذع شجرة فروعها فارغة', 'ألوان مائية آمنة وصديقة للأطفال وصالحة للغسيل'],
    steps: [
      { id: 1, text: 'اجلس الطفلتين متجاورتين ومتقاربتين أمام طاولة العمل الفني واللوحة مفرودة.' },
      { id: 2, text: 'اغمس إصبعك في اللون المائي واطبع بصمة على اللوحة لتوضيح طبيعة العمل.' },
      { id: 3, text: 'دع كل طفلة تختار لونها المفضل الذي يمثلها بالعمل التعاوني.' },
      { id: 4, text: 'امسك يد الطفلة الأولى وساعدها في غمس إصبعها ثم الطباعة على فروع الشجرة.' },
      { id: 5, text: 'قل بصوت مرتج وبشوش: "برافو! ده دور مريم... والآن ننتظر دور رانيا الجميل!".' },
      { id: 6, text: 'وجه الطفلة الثانية لأداء دورها بنفس الطريقة لطباعة بصمتها باللون الآخر.' },
      { id: 7, text: 'شجع الطفلتين على الصبر وتبادل النظر وتثبيت مفهوم التناوب والمشاركة.' },
      { id: 8, text: 'كرر التناوب عدة مرات مع تقليل التدخل التوجيهي باليد تدريجياً.' },
      { id: 9, text: 'دعهما يشاركن في تنظيف وتجفيف أصابعهما بالمناديل المبللة بمرح.' },
      { id: 10, text: 'علق اللوحة في صدر الغرفة واكتب اسمي الطفلتين عليها كعمل جماعي مبهر.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية كاملة: مسك اليد بالتناوب وتحريكها بدقة نحو اللون واللوحة والحد التوجيهي.',
      'مساعدة لفظية وبصرية: الإشارة بالإصبع وقول "دورك يا رانيا... تفضلي ضعي البصمة هنا".',
      'مساعدة رمزية: وضع كارت صغير يمثل الدور أمام الطفلة النشطة حالياً لتذكيرها بانتظار الدور.',
      'الاستقلالية التامة: قيام الطفلتين بالتبادل والتعاون الحركي لإنتاج اللوحة المشتركة.'
    ],
    notes: 'ركز على مفاهيم "المشاركة، الانتظار، والصبر" والتفاعل البصري الإيجابي أكثر من دقة الرسمة الفنية ذاتها.',
    reinforcements: ['تعليق اللوحة بمكان بارز بمدخل الكنيسة', 'منحهما لقب "فراشات الفن والتعاون"', 'قطعة حلوى مشتركة يتشاركان في فتحها']
  },
  {
    id: 'eye-contact-greeting',
    familyId: 'butterflies',
    familyName: 'اسرة الفراشات',
    domain: 'مهارات اجتماعية',
    skillName: 'تحية السلام والتواصل البصري الودود 👋',
    goal: 'أن تنظر الطفلة في عيني الطرف الآخر وتبتسم وتصافحه باليد عند إلقاء تحية اللقاء بنسبة نجاح 90%.',
    tools: ['كروت تعبيرية للمصافحة والسلام', 'مرآة كبيرة للتدريب الذاتي والمحاكاة'],
    steps: [
      { id: 1, text: 'قف بمواجهة الطفلة على مسافة قريبة ومناسبة (حوالي خطوة واحدة).' },
      { id: 2, text: 'انزل ليكون مستواك البصري متوافقاً تماماً مع مستوى نظر الطفلة.' },
      { id: 3, text: 'انظر في عينيها بابتسامة دافئة وودودة للغاية لجذب انتباهها الطبيعي.' },
      { id: 4, text: 'امدد يدك اليمنى للمصافحة بوضوح وقل بصوت رنان: "سلام وبركة يا فراشتنا!".' },
      { id: 5, text: 'إذا لم تستجب، امسك يدها اليمنى بلطف وساعدها في مدها ومصافحة يدك.' },
      { id: 6, text: 'شجعها على تثبيت نظرها في عينك لمدة ثانيتين على الأقل أثناء السلام.' },
      { id: 7, text: 'كرر التدريب باستخدام تبادل الأدوار ودعها هي تبادر بمد يدها لك.' },
      { id: 8, text: 'استخدم المرآة لترى نفسها وهي تبتسم وتسلم، مما يزيد من ثقتها وتأثيرها البصري.' },
      { id: 9, text: 'شجع الطفلة على تطبيق التحية مع باقي الخدام والزملاء المتواجدين بالغرفة.' },
      { id: 10, text: 'احتفل بالنجاح بضمة دافئة وكلمات مبهجة تشعرها بالأمان والانتماء.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية: الإمساك بلطف بكف يد الطفلة ورفعها للسلام ومساعدتها على توجيه بصرها.',
      'مساعدة بصرية: استخدام إشارة خفيفة باليد الأخرى وتأشير العين لتذكيرها بالتواصل البصري.',
      'مساعدة لفظية فقط: تذكيرها بالقول "كيف نسلم على توني مريم يا جميلة؟".',
      'الاستقلال والاعتياد: المبادرة الطبيعية والمصافحة السريعة والمبتسمة للجميع.'
    ],
    notes: 'تجنب إجبار الطفلة بعنف على النظر إذا كانت تشعر بالخوف أو الخجل، بل ابنِ جسر الثقة بالتدريج والود والابتسام.',
    reinforcements: ['بسكويت شوكولاتة صغير ومفضل', 'ختم وردة جميلة على ظهر اليد', 'سوار يد ملون ولطيف كهدية للسلام الودود']
  },
  {
    id: 'sign-of-cross',
    familyId: 'knights',
    familyName: 'اسرة الفرسان',
    domain: 'دروس روحية',
    skillName: 'رسم إشارة الصليب والترتيب الحركي ⛪',
    goal: 'أن يرسم المخدوم إشارة الصليب بشكل صحيح مرتب حركياً (الجبهة، البطن، الكتف الأيسر، الكتف الأيمن) مع النطق.',
    tools: ['صور توضيحية لخطوات رسم الصليب بالترتيب والأرقام', 'صليب خشبي صغير ممسك باليد البديلة'],
    steps: [
      { id: 1, text: 'اجلس أمام المخدوم بوقفة مستقيمة أو قف خلف ظهره لتفادي انعكاس الاتجاه البصري.' },
      { id: 2, text: 'ساعده في جمع أصابعه الثلاثة الأولى ليده اليمنى معاً كرمز للثالوث القدوس.' },
      { id: 3, text: 'ارفع يده المجمعة وضعها بلطف على جبهته وقل بوضوح وثبات: "باسم الآب...".' },
      { id: 4, text: 'انزل بيده برفق ممسكاً بها وضعها على بطنه وقل: "والابن...".' },
      { id: 5, text: 'انتقل بيده نحو كتفه الأيسر أولاً بمسار أفقي ناعم وقل: "والروح القدس...".' },
      { id: 6, text: 'تحرك بيده أفقياً نحو كتفه الأيمن لتكملة الصليب وقل: "الإله الواحد...".' },
      { id: 7, text: 'ضم كفيه معاً في وضع الصلاة واختم بالقول: "آمين".' },
      { id: 8, text: 'كرر التدريب ببطء شديد وتناغم حركي ولفظي لتطوير الذاكرة العضلية لدى الفارس.' },
      { id: 9, text: 'أشر إلى اللوحة المصورة التي توضح اتجاهات الأسهم وحركة الأصابع بدقة.' },
      { id: 10, text: 'دع المخدوم يحاول التكرار بمفرده مع تصحيح المسار الخاطئ بلطف وصبر دون زجر.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية كاملة: تحريك يده اليمنى المجمعة ورسم الصليب من وراء ظهره لتوجيه الاتجاهات الصحيحة.',
      'مساعدة جسدية جزئية: لمس كتف المخدوم وكوعه لتوجيه مسار الحركة والترتيب الذاتي.',
      'مساعدة بصرية: القيام برسم الصليب ببطء أمام الطفل ليقلدك (كالمجال والمحاكاة).',
      'الاستقلالية: رسم الصليب بنطق الكلمات عند بدء الصلاة أو دخول الكنيسة وبشكل ذاتي.'
    ],
    notes: 'يعتبر الوقوف خلف المخدوم طريقة مثالية لتعليم الاتجاهات الصحيحة وتلافي خطأ البدء بالكتف الأيمن الناتج عن الانعكاس البصري.',
    reinforcements: ['إهداؤه صليب جلدي صغير يعلق بالرقبة', 'كتابة اسمه في لوحة فرسان الكنيسة المتميزين', 'بونص نقاط تقييم الحضور']
  },
  {
    id: 'shoe-lacing',
    familyId: 'knights',
    familyName: 'اسرة الفرسان',
    domain: 'تنمية مهارات',
    skillName: 'ربط رباط الحذاء بطريقة آذان الأرنب 👟',
    goal: 'أن يربط المخدوم حذاءه الرياضي بمفرده باتباع 6 خطوات حركية متسلسلة ودقيقة.',
    tools: ['مجسم خشبي تعليمي لحذاء كبير الحجم برباط سميك ومزدوج اللون (أحمر وأصفر)'],
    steps: [
      { id: 1, text: 'ضع مجسم الحذاء التعليمي أمام المخدوم وثبته جيداً لمنع حركته العشوائية.' },
      { id: 2, text: 'امسك طرفي الرباط (الملونين لتسهيل تتبع الفروق البصرية).' },
      { id: 3, text: 'اصنع العقدة الأساسية الأولى: قاطع الرباطين، مرر أحدهما من تحت الآخر، واسحبهما بقوة.' },
      { id: 4, text: 'اصنع حلقة أولى بالرباط الأحمر وثبتها بأصابعك: "هذه أذن الأرنب الأولى!".' },
      { id: 5, text: 'اصنع حلقة ثانية بالرباط الأصفر وثبتها باليد الأخرى: "وهذه أذن الأرنب الثانية!".' },
      { id: 6, text: 'قاطع الحلقتين (الأذنين) معاً بلطف في المنتصف لتكوين شكل حرف X.' },
      { id: 7, text: 'مرر الأذن الصفراء من الفراغ السفلي المتكون تحت الأذن الحمراء.' },
      { id: 8, text: 'امسك الحلقتين (الآذان) واسحبهما معاً بقوة للجانبين لإحكام ربط الحذاء بالكامل.' },
      { id: 9, text: 'كرر الخطوات ببطء تزامناً مع رواية قصة "الأرنب السريع" المحببة للفرسان.' },
      { id: 10, text: 'دع المخدوم يجرب في مجسمه، ثم انقل التجربة لحذائه الشخصي المرتدى.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية كاملة: الإمساك بأصابع المخدوم ومساعدته في تشكيل الحلقات وسحبها معاً.',
      'مساعدة جزئية: عقد العقدة الأولى وترك المخدوم يكمل تشكيل الحلقات والسحب النهائي.',
      'مساعدة بصرية: أداء كل خطوة أمام المخدوم في مجسم موازٍ ومجاور وتركه يقلد الحركة فوراً.',
      'الاستقلال التام: ربط الحذاء بشكل كامل دون الحاجة لأي توجيه خارجي وبسرعة مناسبة.'
    ],
    notes: 'استخدام أربطة ذات لونين مختلفين (مثلاً نصف أحمر ونصف أصفر) يقلل من الارتباك البصري ويسهل فهم الخطوات.',
    reinforcements: ['الحصول على لقب "الفارس المستقل"', 'وضع ستيكر حذاء ذهبي بملفه الشامل', 'مدحه أمام بقية فرسان الدفعة']
  },
  {
    id: 'buying-simulation',
    familyId: 'heroes',
    familyName: 'اسرة الابطال',
    domain: 'أكاديمي',
    skillName: 'شراء سلعة وحساب الباقي النقدي 🪙🛒',
    goal: 'أن يقوم البطل بمحاكاة شراء سلعة بقيمة معينة وحساب الباقي من ورقة نقدية فئة 20 جنيهاً بشكل صحيح.',
    tools: ['سوبرماركت مصغر تمثيلي بالخدمة به منتجات مسعرة', 'عملات ورقية ومعدنية تمثيلية وآمنة'],
    steps: [
      { id: 1, text: 'اشرح للبطل فكرة الشراء: "معانا 20 جنيه وعايزين نشتري علبة عصير جميلة بـ 12 جنيه".' },
      { id: 2, text: 'اصطحب البطل إلى طاولة البائع (الخادم الآخر المتطوع للتثبيت).' },
      { id: 3, text: 'اطلب من البطل اختيار السلعة وقراءة ملصق السعر الملصق عليها بتركيز.' },
      { id: 4, text: 'قل للبطل: "كم سعر العصير؟" ليدرك القيمة الرقمية المكتوبة بوضوح.' },
      { id: 5, text: 'وجه البطل لتقديم الورقة النقدية فئة الـ 20 جنيهاً للبائع بلطف.' },
      { id: 6, text: 'ساعده في التفكير الحسابي: "الحساب 12 جنيه، سيعود لنا الباقي وهو: 20 ناقص 12".' },
      { id: 7, text: 'استخدم خط الأعداد أو الكرات الحسابية لحساب الباقي الذهني وهو (8 جنيهات).' },
      { id: 8, text: 'استلم المبلغ الباقي من البائع، واطلب من البطل عد النقود المستلمة للتأكيد.' },
      { id: 9, text: 'امتدح ذكاء البطل وأسلوبه المهذب والراقي في التعامل والشراء.' },
      { id: 10, text: 'شجعه على نقل التجربة إلى السوبرماركت الحقيقي القريب من منزله بمساعدة أسرته.' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية وحسابية كاملة: إدارة الحساب والعد المشترك ممسكاً بيده لتسليم واستلام النقود.',
      'مساعدة تلميحية وحسابية جزئية: تذكير المخدوم بعملية الطرح البسيطة ومراجعة العد بالعينين.',
      'توجيه لفظي فقط: حثه على السؤال "كم الباقي يا عمو؟" ومراجعة ورقة الحساب والعد.',
      'الاستقلال التام: تنفيذ المعاملة المالية بالكامل واحتساب القيمة وإرجاع الباقي بمفرده.'
    ],
    notes: 'الأنشطة الحسابية الواقعية تدعم الثقة بالنفس وتؤهل الأبطال للدمج الاجتماعي والاعتماد الذاتي الفعلي في شؤون الحياة.',
    reinforcements: ['تناول السلعة المشتراة (مثل العصير أو البسكويت) كجائزة تفاعلية', 'الحصول على ميدالية البطل الذكي المذهبة', 'نقاط بونص مضافة للمحفظة']
  },
  {
    id: 'bed-making',
    familyId: 'heroes',
    familyName: 'اسرة الابطال',
    domain: 'تنمية مهارات',
    skillName: 'ترتيب سرير النوم والملابس 🛏️',
    goal: 'أن يرتب البطل سريره الخاص ويطوي غطاء النوم والوسادة بشكل أنيق ومستقل كل صباح.',
    tools: ['سرير مخصص بغرفة التأهيل أو مجسم تمثيلي', 'ملاءة سرير وغطاء ناعم ووسادة'],
    steps: [
      { id: 1, text: 'ابدأ بعرض السرير في حالة غير مرتبة بعد الاستيقاظ مباشرة.' },
      { id: 2, text: 'امسك الوسادة معاً واطلب من البطل نفضها بلطف لإعادة رونقها وسويتها.' },
      { id: 3, text: 'ضع الوسادة في مكانها المخصص بأعلى السرير بشكل مستقيم ومنسق.' },
      { id: 4, text: 'امسك طرف ملاءة السرير وساعد البطل في شد الأطراف جيداً لإزالة التجاعيد.' },
      { id: 5, text: 'قم بثني أطراف الملاءة الزائدة تحت المرتبة بشكل آمن ومحكم وثابت.' },
      { id: 6, text: 'امسك طرفي غطاء النوم (اللحاف أو البطانية) بالاشتراك والتعاون.' },
      { id: 7, text: 'قم بطي الغطاء بشكل متناظر: ثني النصف الأول على النصف الثاني برفق.' },
      { id: 8, text: 'قم بطيه مرة أخرى ليصبح في شكل مستطيل صغير وأنيق يسهل وضعه.' },
      { id: 9, text: 'ضع الغطاء المطوي بنظام فوق السرير بشكل جمالي ومنظم.' },
      { id: 10, text: 'شاهد النتيجة الرائعة مع البطل وقل بفخر: "الغرفة الآن جميلة ومرتبة كالأبطال!".' }
    ],
    assistanceGraduation: [
      'مساعدة جسدية كاملة: الإمساك المشترك والتحريك الفعلي لكل خطوة ومسار الطي والشد والترتيب.',
      'مساعدة جزئية: القيام بمهام الشد والطي المتبادلة وترك المخدوم يثبت الملاءة والوسادة.',
      'توجيه لفظي وإرشادي: الوقوف بجانب السرير وتوجيه الإرشادات اللفظية خطوة تلو الأخرى.',
      'الاستقلال التام: ترتيب السرير بالكامل فور الاستيقاظ كعادة وسلوك معتمد.'
    ],
    notes: 'الاستقلالية في ترتيب الأغراض الشخصية تنعكس إيجابياً على انتظام سلوك البطل وهدوئه الذهني ونظامه العام.',
    reinforcements: ['الحصول على لقب "البطل المنظم والنظيف"', 'الحصول على كوب عصير برتقال فريش ولذيذ', 'ساعة لعب حرة إضافية بالملعب']
  }
];

export default function EducationalTasksView({ onNotify }: { onNotify: (msg: string) => void }) {
  const [activeFamily, setActiveFamily] = useState<'angels' | 'stars' | 'butterflies' | 'knights' | 'heroes'>('angels');
  const [activeDomain, setActiveDomain] = useState<string>('الجميع');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom tasks loaded from localStorage to satisfy dynamic adding
  const [tasks, setTasks] = useState<EducationalTask[]>(() => {
    const saved = localStorage.getItem('angels_educational_tasks_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return PRE_SEEDED_TASKS;
  });

  // Save tasks to local storage on change
  useEffect(() => {
    localStorage.setItem('angels_educational_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  // Session logs for tracking servo-makhdum activities
  const [logs, setLogs] = useState<SessionLog[]>(() => {
    const saved = localStorage.getItem('angels_session_logs_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'log-1',
        taskId: 'sparrow-imitation',
        taskTitle: 'تقليد حركة العصفور الطيران 🐦',
        servantName: 'الخادم فادي',
        childName: 'المخدوم كيرلس',
        date: '2026-06-24',
        assistanceLevel: 'مساعدة جزئية',
        notes: 'كيرلس كان متحمساً للغاية عند رؤية لعبة العصفور المجسمة. استطاع تحريك ذراعيه لأعلى وأسفل بمجرد تلميس كوعيه بلطف، وبدأ يبتسم بصوت عالٍ. نشاط ممتاز ومثمر.'
      },
      {
        id: 'log-2',
        taskId: 'sign-of-cross',
        taskTitle: 'رسم إشارة الصليب والترتيب الحركي ⛪',
        servantName: 'الخادم مينا',
        childName: 'المخدوم يوحنا',
        date: '2026-06-25',
        assistanceLevel: 'مساعدة جسدية كاملة',
        notes: 'قمنا بالتمرين من وراء ظهر يوحنا لمنع الانعكاس البصري. استوعب البداية عند الجبهة والنزول للبطن، ونحتاج لتكرار الكتف الأيسر لتفادي اللخبطة. مجهود طاهر وممتاز.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('angels_session_logs_v1', JSON.stringify(logs));
  }, [logs]);

  // Selected Task for viewing full detailed sheet
  const [selectedTaskId, setSelectedTaskId] = useState<string>('sparrow-imitation');
  
  // Interactive Step Checklist to let servants practice or tick steps off
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  // Form states for creating custom tasks
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState('مهارات إدراكية');
  const [newSkillName, setNewSkillName] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newTools, setNewTools] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [newAssistance, setNewAssistance] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newReinforcements, setNewReinforcements] = useState('');

  // Logging session form states
  const [showLogForm, setShowLogForm] = useState(false);
  const [logChildName, setLogChildName] = useState('');
  const [logServantName, setLogServantName] = useState('');
  const [logAssistanceLevel, setLogAssistanceLevel] = useState('مساعدة جزئية');
  const [logNotes, setLogNotes] = useState('');

  const families = [
    { id: 'angels', name: '👼 اسرة الملايكة', desc: 'الحضانة والتدخل المبكر' },
    { id: 'stars', name: '⭐ اسرة النجوم', desc: 'اضطرابات التواصل والتوحد' },
    { id: 'butterflies', name: '🦋 اسرة الفراشات', desc: 'الفتيات والتنمية الاجتماعية' },
    { id: 'knights', name: '⚔️ اسرة الفرسان', desc: 'البنين وبناء الاعتماد الذاتي' },
    { id: 'heroes', name: '🏆 اسرة الابطال', desc: 'الشباب والإعداد والتأهيل المهني' }
  ] as const;

  const domains = [
    'الجميع',
    'مهارات إدراكية',
    'تنمية مهارات',
    'تعديل سلوك',
    'مهارات اجتماعية',
    'مهارات حسية',
    'منسيات',
    'دروس روحية',
    'أعمال فنية',
    'مهارات حركية',
    'أكاديمي'
  ];

  // Filters calculation
  const filteredTasks = tasks.filter(task => {
    const matchFamily = task.familyId === activeFamily;
    const matchDomain = activeDomain === 'الجميع' || task.domain === activeDomain;
    const matchSearch = task.skillName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        task.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        task.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFamily && matchDomain && matchSearch;
  });

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || filteredTasks[0] || tasks[0];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newGoal.trim()) {
      onNotify('⚠️ يرجى ملء اسم المهارة والهدف الرئيسي لإمكانية النشر.');
      return;
    }

    const stepsArray = newSteps.split('\n')
      .map((line, idx) => ({ id: idx + 1, text: line.trim() }))
      .filter(step => step.text.length > 0);

    const toolsArray = newTools.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const assistanceArray = newAssistance.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const reinforcementsArray = newReinforcements.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const defaultSteps = stepsArray.length > 0 ? stepsArray : [
      { id: 1, text: 'اجذب انتباه الطفل وعرفه بموضع التدريب.' },
      { id: 2, text: 'قم بعمل النشاط بنفسك ببطء ودقة.' },
      { id: 3, text: 'شجع الطفل على البدء وقدم المساعدة المطلوبة.' },
      { id: 4, text: 'امتدحه وقدم له المكافأة السلوكية فور الانتهاء.' }
    ];

    const currentFamilyName = families.find(f => f.id === activeFamily)?.name || 'اسرة الملايكة';

    const newTask: EducationalTask = {
      id: `custom-${Date.now()}`,
      familyId: activeFamily,
      familyName: currentFamilyName,
      domain: newDomain,
      skillName: newSkillName,
      goal: newGoal,
      tools: toolsArray.length > 0 ? toolsArray : ['أدوات الغرفة العادية والتحفيز الذاتي'],
      steps: defaultSteps,
      assistanceGraduation: assistanceArray.length > 0 ? assistanceArray : [
        'مساعدة جسدية كاملة في المراحل الأولى.',
        'مساعدة جزئية خفيفة عند الاستجابة.',
        'مساعدة لفظية وتذكيرية بالكلمة والصورة.',
        'أداء مستقل تام.'
      ],
      notes: newNotes || 'احرص على بث روح الألفة والابتسام الدائم مع المخدوم لتوفير بيئة نفسية داعمة ومريحة.',
      reinforcements: reinforcementsArray.length > 0 ? reinforcementsArray : ['الابتسام الحاضر والتصفيق', 'ستيكرز مبهجة وملونة'],
      isCustom: true
    };

    setTasks(prev => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    setShowAddForm(false);
    
    // Reset form states
    setNewSkillName('');
    setNewGoal('');
    setNewTools('');
    setNewSteps('');
    setNewAssistance('');
    setNewNotes('');
    setNewReinforcements('');

    onNotify(`✨ تم تسجيل وإيداع المهمة التعليمية الجديدة [${newTask.skillName}] بنجاح ببنك معلومات ${currentFamilyName}!`);
  };

  const handleAddSessionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logChildName.trim() || !logServantName.trim() || !logNotes.trim()) {
      onNotify('⚠️ يرجى تعبئة اسم المخدوم، اسم الخادم، ومذكرة المتابعة السلوكية لتسجيل القيد.');
      return;
    }

    const newLog: SessionLog = {
      id: `log-${Date.now()}`,
      taskId: selectedTask.id,
      taskTitle: selectedTask.skillName,
      servantName: logServantName,
      childName: logChildName,
      date: new Date().toISOString().split('T')[0],
      assistanceLevel: logAssistanceLevel,
      notes: logNotes
    };

    setLogs(prev => [newLog, ...prev]);
    setShowLogForm(false);
    setLogChildName('');
    setLogNotes('');
    
    onNotify(`📝 تم حفظ وإدراج تقرير الحصة وجدول المتابعة بنجاح لـ (${logChildName}) بملف النشاط الميداني.`);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه المهمة المخصصة نهائياً؟')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      onNotify('🗑️ تم إزالة المهمة التعليمية المخصصة بنجاح.');
      if (selectedTaskId === taskId) {
        setSelectedTaskId('sparrow-imitation');
      }
    }
  };

  const toggleStepCompleted = (stepId: number) => {
    const key = `${selectedTask.id}-${stepId}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Pre-calculate how many steps are checked for the selected task
  const totalStepsCount = selectedTask?.steps?.length || 0;
  const completedStepsCount = selectedTask?.steps?.filter(s => completedSteps[`${selectedTask.id}-${s.id}`]).length || 0;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-500" dir="rtl" id="educational-tasks-section">
      
      {/* Informative Header card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-emerald-700/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold inline-block mb-2 border border-emerald-400/30 font-mono">
              DEVELOPMENTAL DIRECTORY
            </span>
            <h3 className="font-display text-xl md:text-2xl font-extrabold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span>دليل المهام والبرامج التعليمية السلوكية لذوي الإعاقة</span>
            </h3>
            <p className="font-sans text-xs md:text-sm text-slate-150 mt-1 max-w-3xl leading-relaxed">
              مرجع تربوي شامل مخصص لقادة وأسر الخدمة يوضح بالتحليل التفصيلي وخطوات التدريج العلمي والتعزيز السلوكي كيفية تدريب أبنائنا من ذوي القدرات والهمم على الاستقلالية والتفاعل والاندماج بالمجتمع والكنيسة.
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-label font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:scale-102 transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة تعليمية جديدة ➕</span>
          </button>
        </div>
      </div>

      {/* 5 Families (القوائم الخمس) - Main Row Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="families-navigator">
        {families.map(family => {
          const isActive = activeFamily === family.id;
          return (
            <button
              key={family.id}
              onClick={() => {
                setActiveFamily(family.id);
                setActiveDomain('الجميع');
                // Auto-select first task in that family if any
                const firstTask = tasks.find(t => t.familyId === family.id);
                if (firstTask) {
                  setSelectedTaskId(firstTask.id);
                }
              }}
              className={`p-3.5 rounded-2xl text-right transition-all flex flex-col justify-between border cursor-pointer ${
                isActive 
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-lg scale-[1.02] ring-2 ring-emerald-500/20' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-emerald-800 border-slate-200'
              }`}
            >
              <h4 className="font-display font-black text-xs md:text-sm mb-1">{family.name}</h4>
              <p className={`text-[10px] font-sans ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                {family.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Domain Filters & Search bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs">
        {/* Horizontal domains scrollbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-500 ml-2 shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            المجال:
          </span>
          {domains.map(d => {
            const isSel = activeDomain === d;
            return (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSel 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-150'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <input
            type="text"
            placeholder="البحث باسم المهارة أو الهدف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
          />
        </div>
      </div>

      {/* Main split grid: Tasks index on the right, Selected task sheet on the left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RIGHT PANEL: List of Tasks within filtered criteria */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="font-display font-bold text-xs text-slate-700">المهام التعليمية المقررة ({filteredTasks.length})</span>
            <span className="text-[10px] bg-white text-slate-500 px-2 py-0.5 rounded font-mono font-bold">INDEX</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      // Clear checklist of previous task so we can start fresh or view
                    }}
                    className={`p-4 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-emerald-50/55 border-emerald-300 shadow-sm ring-1 ring-emerald-500/10' 
                        : 'bg-white border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {task.domain}
                      </span>
                      {task.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="text-slate-300 hover:text-rose-600 p-0.5 rounded-full transition-colors"
                          title="حذف المهمة المخصصة"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className={`font-display font-extrabold text-xs mb-1 group-hover:text-emerald-700 transition-colors ${
                      isSelected ? 'text-emerald-950 font-black' : 'text-slate-800'
                    }`}>
                      {task.skillName}
                    </h4>

                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {task.goal}
                    </p>

                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white border rounded-xl p-8 text-center text-slate-500 font-sans text-xs">
                <Compass className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                لا يوجد مهام مطابقة تحت هذا التبويب حالياً.
              </div>
            )}
          </div>

          {/* Practical Session logs panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h5 className="font-display font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                <span>سجل المتابعة اليومية للأبناء</span>
              </h5>
              <button
                onClick={() => {
                  if (!selectedTask) {
                    onNotify('⚠️ يرجى اختيار مهمة لربط التقرير بها أولاً.');
                    return;
                  }
                  setShowLogForm(true);
                }}
                className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded cursor-pointer transition-colors"
              >
                تسجيل حصة جديدة ✏️
              </button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {logs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border text-[11px] leading-relaxed relative">
                  <div className="flex justify-between items-center mb-1 font-semibold text-slate-700">
                    <span>مخدوم: {log.childName}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{log.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1 font-semibold">
                    المهارة: {log.taskTitle}
                  </p>
                  <div className="bg-white p-2 rounded border text-slate-600 text-[10px] italic">
                    "{log.notes}"
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-slate-400">
                    <span>مستوى الإثابة: {log.assistanceLevel}</span>
                    <span>الخادم: {log.servantName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT PANEL: High Fidelity Pedagogical Task Details Sheet (Matches the visual format requested) */}
        <div className="lg:col-span-8">
          {selectedTask ? (
            <div className="bg-white rounded-2xl border border-slate-250 shadow-sm overflow-hidden" id="task-details-sheet">
              
              {/* Infographic Header styling */}
              <div className="bg-slate-50 p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Purple Domain on left */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">DOMAIN:</span>
                  <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>المجال: {selectedTask.domain}</span>
                  </span>
                </div>

                {/* Amber Skill on right */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">SKILL:</span>
                  <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>المهارة: {selectedTask.skillName}</span>
                  </span>
                </div>

              </div>

              <div className="p-6 space-y-6">
                
                {/* Green Goal Banner */}
                <div className="bg-emerald-50 border-r-4 border-emerald-600 rounded-xl p-4 flex items-start gap-3">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shrink-0 mt-0.5">
                    الهدف التربوي
                  </span>
                  <p className="font-display font-extrabold text-sm text-emerald-950 leading-relaxed">
                    أن يقوم المخدوم بـ: <span className="text-slate-800 font-medium">{selectedTask.goal}</span>
                  </p>
                </div>

                {/* Tools needed (الأدوات) */}
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <h4 className="font-display font-bold text-xs text-sky-950 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>الأدوات والوسائل التعليمية المطلوبة للنشاط:</span>
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-700 font-sans space-y-1.5 pr-1">
                    {selectedTask.tools.map((tool, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Task Steps analysis (طريقة التنفيذ - تحليل المهمة 1-10) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-display font-black text-sm text-[#151c27] flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>طريقة التنفيذ بالتفصيل العلمي السلوكي (تحليل الخطوات المنهجي):</span>
                    </h4>

                    {/* Steps Checklist Progress Tracker */}
                    <div className="text-left font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      تطبيق تفاعلي: {progressPercent}% ({completedStepsCount}/{totalStepsCount})
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                    💡 <span className="font-semibold">تنبيه للخادم:</span> تفاعل مع البطاقات التالية خطوة بخطوة أثناء ممارسة الدرس مع المخدوم. انقر على أي خطوة لتعليمها كـ "مُنجزة" لضمان ثبات التسلسل والتركيز.
                  </p>

                  {/* 1 to 10 steps grid resembling image layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="task-steps-grid">
                    {selectedTask.steps.map((step) => {
                      const isStepDone = !!completedSteps[`${selectedTask.id}-${step.id}`];
                      return (
                        <div
                          key={step.id}
                          onClick={() => toggleStepCompleted(step.id)}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden flex gap-3 items-start select-none ${
                            isStepDone
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {/* Number Badge mimicking image */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-black font-mono shadow-xs ${
                            isStepDone ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                          }`}>
                            {step.id}
                          </div>

                          <div className="flex-grow">
                            <p className={`text-xs leading-relaxed ${isStepDone ? 'line-through opacity-80' : ''}`}>
                              {step.text}
                            </p>
                          </div>

                          {/* Quick check icon */}
                          <div className="shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={isStepDone}
                              onChange={() => {}} // Handled by div click
                              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Graduated Assistance Hierarchy, Notes and Reinforcements (3 Columns matching bottom part of image) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  
                  {/* Column 1: التدرج في المساعدة (Graduated Assistance) in Purple styling */}
                  <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4">
                    <h5 className="font-display font-bold text-xs text-purple-950 mb-3 flex items-center gap-1.5 border-b border-purple-100 pb-1.5">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>التدرج العلمي في المساعدة:</span>
                    </h5>
                    <ol className="list-decimal list-inside text-[11px] text-purple-950 font-sans space-y-2 pr-1">
                      {selectedTask.assistanceGraduation.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Column 2: ملاحظات هامة (Key Notes) in Green/Teal styling */}
                  <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4">
                    <h5 className="font-display font-bold text-xs text-teal-950 mb-3 flex items-center gap-1.5 border-b border-teal-100 pb-1.5">
                      <Info className="w-4 h-4 text-teal-600" />
                      <span>ملاحظة هامة للتنفيذ:</span>
                    </h5>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-teal-200 text-[11px] text-slate-700 leading-relaxed font-sans">
                      {selectedTask.notes}
                    </div>
                    <div className="text-[10px] text-teal-800 font-bold mt-2 text-center">
                      ⏱️ التكرار والاستمرارية هما سر النجاح!
                    </div>
                  </div>

                  {/* Column 3: تعزيزات مقترحة (Suggested Reinforcements) in Yellow/Amber styling */}
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                    <h5 className="font-display font-bold text-xs text-amber-950 mb-3 flex items-center gap-1.5 border-b border-amber-100 pb-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>تعزيزات ومكافآت مقترحة:</span>
                    </h5>
                    <ul className="list-disc list-inside text-[11px] text-slate-800 font-sans space-y-2 pr-1">
                      {selectedTask.reinforcements.map((reward, idx) => (
                        <li key={idx} className="leading-relaxed font-semibold">
                          {reward}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Interactive Practice Reset & Log Trigger button */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                  <button
                    onClick={() => {
                      // Reset checklist
                      const updated = { ...completedSteps };
                      selectedTask.steps.forEach(s => {
                        delete updated[`${selectedTask.id}-${s.id}`];
                      });
                      setCompletedSteps(updated);
                      onNotify('🧹 تم إعادة تصفير خطوات التدريب للمهمة الحالية للبدء من جديد.');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    إعادة تصفير خطوات المتابعة للبدء مجدداً
                  </button>

                  <button
                    onClick={() => {
                      setLogChildName('');
                      setLogNotes(`تم اليوم ممارسة وتطبيق خطوات مهارة [${selectedTask.skillName}] مع المخدوم. استجاب لخطوة (${completedStepsCount}/${totalStepsCount}) بمستوى فاعلية ممتاز ونحتاج لمتابعة التكرار.`);
                      setShowLogForm(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>اعتماد هذه الحصة بملف المتابعة 📊</span>
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border p-12 text-center text-slate-500 font-sans">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              يرجى اختيار مهارة أو مهمة لغرض استعراض بطاقة التحليل والتعليم المنهجي.
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: ADD NEW EDUCATIONAL TASK FORM (إضافة مهمة تعليمية جديدة) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl text-right flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white p-4 flex justify-between items-center">
              <h4 className="font-display font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>إضافة مهمة وبرنامج تعليمي جديد لذوي الهمم</span>
              </h4>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateTask} className="p-6 space-y-4 overflow-y-auto flex-grow text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    أختر تصنيف المجال الدراسي للمهمة:
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {domains.filter(d => d !== 'الجميع').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    اسم المهارة التعليمية (مثال: تقليد حركة العصفور):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="اكتب عنواناً رئيساً واضحاً للمهارة..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  الهدف التربوي العام والنهائي للمهمة (Goal):
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="أن يقلد الطفل حركة العصفور أو يطابق الكرات بدقة..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الأدوات والوسائل المطلوبة (كل أداة في سطر منفصل):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="صورة أو لعبة عصفور&#10;مساحة غرفية آمنة"
                    value={newTools}
                    onChange={(e) => setNewTools(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    التعزيزات والمكافآت السلوكية المقترحة (كل مكافأة في سطر):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="التصفيق الفوري&#10;كلمات التشجيع الدافئة&#10;ستيكرز لاصق ملون"
                    value={newReinforcements}
                    onChange={(e) => setNewReinforcements(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  طريقة التنفيذ - خطوات تحليل المهمة (كل خطوة في سطر منفصل بالتتابع من 1 لـ 10):
                </label>
                <textarea
                  rows={4}
                  placeholder="1. اجذب انتباه الطفل للعبة العصفور.&#10;2. ارفع ذراعيك لأعلى لتمثيل الطيران.&#10;3. كرر التمرين ببطء..."
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    التدرج السلوكي في المساعدة (كل مرحلة في سطر):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="مساعدة جسدية كاملة باليد&#10;مساعدة جزئية خفيفة بتوجيه الكوع&#10;استقلالية تامة"
                    value={newAssistance}
                    onChange={(e) => setNewAssistance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    ملاحظات عامة وتنبيهات للخادم للتنفيذ الآمن:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="اجعل التمرين قصيراً ومرحاً لعدم إجهاد المخدوم..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer shadow-md transition-all"
                >
                  حفظ ونشر المهمة التعليمية 🚀
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WRITE DAILY SESSION LOG FOR CHILD (تسجيل تقرير حصة مخدوم) */}
      {selectedTask && showLogForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl text-right flex flex-col">
            
            <div className="bg-emerald-700 text-white p-4 flex justify-between items-center">
              <h4 className="font-display font-bold text-sm">تسجيل حصة متابعة ميدانية مخصصة</h4>
              <button 
                onClick={() => setShowLogForm(false)}
                className="text-white bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSessionLog} className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">موضوع النشاط الحالي:</span>
                <span className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg block font-semibold text-slate-800">
                  {selectedTask.skillName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم الخادم المتابع:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الخادم فادي"
                    value={logServantName}
                    onChange={(e) => setLogServantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم الطفل المخدوم:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: البطل يوسف"
                    value={logChildName}
                    onChange={(e) => setLogChildName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">مستوى المساعدة الذي استجاب عنده:</label>
                <select
                  value={logAssistanceLevel}
                  onChange={(e) => setLogAssistanceLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                >
                  <option value="مساعدة جسدية كاملة">مساعدة جسدية كاملة 🤝</option>
                  <option value="مساعدة جزئية">مساعدة جزئية ✋</option>
                  <option value="مساعدة لفظية أو بصرية">مساعدة لفظية أو بصرية 🗣️</option>
                  <option value="استقلال كامل">استقلال كامل وتام ✓</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ملاحظات ودرجة الاستجابة اليوم للنشاط:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب بالتفصيل مدى استجابة البطل للخطوات وتفاعله مع المكافأة..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 text-right leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  اعتماد وحفظ الحصة 💾
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
