/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SUBJECTS } from '../data';
import { Subject, SubjectResource } from '../types';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Check, 
  Activity, 
  Play, 
  ArrowRight, 
  Plus, 
  FileText, 
  Volume2, 
  Video as VideoIcon, 
  Link2, 
  Sparkles, 
  Headphones, 
  X, 
  Clock, 
  Compass, 
  ArrowLeft,
  BookMarked,
  RotateCcw,
  SkipForward,
  Bookmark,
  Share2,
  FilePlus,
  Eye,
  Settings,
  Flame,
  CornerDownLeft,
  Heart,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface MaterialsViewProps {
  onNotify: (message: string) => void;
  onChangeTab?: (tab: 'registration' | 'materials' | 'exams' | 'dashboard' | 'practical' | 'discounts' | 'admin') => void;
}

// Map tag categories to beautiful color themes for cards
const CATEGORY_STYLES: { [key: string]: { bg: string; text: string; border: string; accent: string } } = {
  disability: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', accent: '#3b82f6' },
  spiritual: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', accent: '#15803d' },
  general: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', accent: '#10b981' },
  orbital: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', accent: '#8b5cf6' },
  humandev: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', accent: '#f59e0b' },
  contests: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', accent: '#ec4899' },
};

// Maps dynamic study materials to their correspond exams in the system
const SUBJECT_TO_EXAM_MAP: { [key: string]: string } = {
  'sign-language': 'active-5',
  'theology': 'active-love-exam',
  'first-aid-materials': 'active-1',
  'human-development': 'active-4'
};

export default function MaterialsView({ onNotify, onChangeTab }: MaterialsViewProps) {
  // Sync state with localStorage to persist any uploaded books or audios
  const [subjectList, setSubjectList] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('angels_subjects_list_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SUBJECTS;
      }
    }
    return SUBJECTS;
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('angels_subjects_list_v1', JSON.stringify(subjectList));
  }, [subjectList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'disability' | 'spiritual' | 'general' | 'orbital' | 'humandev' | 'contests'>('all');
  
  // Drill-down selection states
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [resourceFilter, setResourceFilter] = useState<'all' | 'pdf' | 'audio' | 'video' | 'link'>('all');

  // Media Play/Consumer States
  const [previewResource, setPreviewResource] = useState<{ resource: SubjectResource; subject: Subject } | null>(null);

  // Form Adding Resource States
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'pdf' | 'audio' | 'video' | 'link'>('pdf');
  const [newUrl, setNewUrl] = useState('');
  const [newSpec, setNewSpec] = useState(''); // pages count or playback mins
  const [newDesc, setNewDesc] = useState('');

  // Enhanced reader simulator features
  const [completedResourceIds, setCompletedResourceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('angels_completed_resource_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  const [pdfChapter, setPdfChapter] = useState(0);
  const [pdfFontSize, setPdfFontSize] = useState<number>(16);
  const [pdfTheme, setPdfTheme] = useState<'parchment' | 'paper' | 'dark'>('parchment');
  const [pdfNotes, setPdfNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  
  // PDF page lock state
  const [pdfPageTimer, setPdfPageTimer] = useState<number>(15); 
  const [pdfPageApproved, setPdfPageApproved] = useState<{ [pageIndex: number]: boolean }>({});

  // Reset page countdown when page index changes (3 seconds per line, approx 15 seconds)
  useEffect(() => {
    if (previewResource && previewResource.resource.type === 'pdf') {
      setPdfPageTimer(15);
    }
  }, [pdfChapter, previewResource]);

  // Handle PDF reading timer ticks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (previewResource && previewResource.resource.type === 'pdf' && pdfPageTimer > 0) {
      interval = setInterval(() => {
        setPdfPageTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pdfPageTimer, pdfChapter, previewResource]);

  // Audio simulator features
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(15); // percentage
  const [audioElapsedTime, setAudioElapsedTime] = useState(45); // seconds elapsed
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Video simulator features
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(25); // progress elapsed
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  // Load saved media playheads and restore on mount
  useEffect(() => {
    if (previewResource) {
      const saved = localStorage.getItem(`media_progress_v2_${previewResource.resource.id}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (previewResource.resource.type === 'audio') {
            setAudioElapsedTime(data.elapsedTime ?? 45);
            setAudioProgress(data.progress ?? 15);
          } else if (previewResource.resource.type === 'video') {
            setVideoDuration(data.videoDuration ?? 25);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        if (previewResource.resource.type === 'audio') {
          setAudioElapsedTime(45);
          setAudioProgress(15);
        } else if (previewResource.resource.type === 'video') {
          setVideoDuration(25);
        }
      }
    }
  }, [previewResource]);

  // Persist media progress as they seek, listen or watch
  useEffect(() => {
    if (previewResource) {
      const payload = previewResource.resource.type === 'audio'
        ? { elapsedTime: audioElapsedTime, progress: audioProgress }
        : { videoDuration: videoDuration };
      localStorage.setItem(`media_progress_v2_${previewResource.resource.id}`, JSON.stringify(payload));
    }
  }, [audioElapsedTime, audioProgress, videoDuration, previewResource]);

  // Media active listening/watching timer accumulator (seconds)
  const [activeMediaTimer, setActiveMediaTimer] = useState<number>(0);
  const REQUIRED_ACTIVE_SECONDS = 15; // Requires 15 seconds of watch/listen

  // Helper to award global points and save directly to localStorage to keep profile synced
  const awardGlobalPoints = (amount: number) => {
    const saved = localStorage.getItem('angels_user_profile_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextPoints = Math.round((parsed.points || 0) + amount);
        
        let nextLevel = parsed.level;
        let nextRank = parsed.rankOrder;
        if (nextPoints >= 3000) {
          nextLevel = 'خادم قائد - المستوى الرابع';
          nextRank = 'الترتيب الأول على الدفعة 🏆';
        } else if (nextPoints >= 2500) {
          nextLevel = 'الخادم المميز - المستوى الثالث';
          nextRank = 'الترتيب الثاني على الدفعة';
        } else if (nextPoints >= 1500) {
          nextLevel = 'خادم نشط - المستوى الثاني';
          nextRank = 'الترتيب الخامس على الدفعة';
        }

        const updated = {
          ...parsed,
          points: nextPoints,
          level: nextLevel,
          rankOrder: nextRank
        };
        localStorage.setItem('angels_user_profile_v1', JSON.stringify(updated));
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Reset media watching timer when preview resource changes
  useEffect(() => {
    setActiveMediaTimer(0);
  }, [previewResource]);

  // Filter main subjects based on category filter
  const filteredSubjects = subjectList.filter((subject) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      subject.title.toLowerCase().includes(q) || 
      (subject.description || '').toLowerCase().includes(q) ||
      (subject.tagText || '').toLowerCase().includes(q) ||
      (subject.resources || []).some(r => r.title.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
    const matchesFilter = activeFilter === 'all' || subject.tagType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Automatically recalculate Subject Progress based on completed resource percentages
  useEffect(() => {
    localStorage.setItem('angels_completed_resource_ids', JSON.stringify(completedResourceIds));
    
    // Auto sync current subjects list progress
    setSubjectList(prev => prev.map(s => {
      const parentOfResources = s.resources || [];
      if (parentOfResources.length > 0) {
        const completedOfThis = parentOfResources.filter(r => completedResourceIds.includes(r.id)).length;
        const calculatedProgress = Math.round((completedOfThis / parentOfResources.length) * 100);
        
        let nextStatus = s.statusText;
        if (calculatedProgress === 100) nextStatus = 'مكتمل بنجاح';
        else if (calculatedProgress >= 50) nextStatus = 'ممتاز';
        else nextStatus = 'في البداية';

        return {
          ...s,
          progress: calculatedProgress,
          statusText: nextStatus
        };
      }
      return s;
    }));
  }, [completedResourceIds]);

  // Update selectedSubject state when subjectList is updated, so client details remain in sync
  useEffect(() => {
    if (selectedSubject) {
      const match = subjectList.find(s => s.id === selectedSubject.id);
      if (match && match.progress !== selectedSubject.progress) {
        setSelectedSubject(match);
      }
    }
  }, [subjectList, selectedSubject]);

  // Simulate progress when they practice or study manually
  const handlePracticeQuickly = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop navigation to detail
    setSubjectList(prev => prev.map(s => {
      if (s.id === id) {
        const nextProgress = Math.min(s.progress + 10, 100);
        let nextStatus = s.statusText;
        if (nextProgress === 100) nextStatus = 'مكتمل بنجاح';
        else if (nextProgress >= 85) nextStatus = 'أوشكت على الانتهاء';
        else if (nextProgress >= 50) nextStatus = 'ممتاز';
        else nextStatus = 'في البداية';

        onNotify(`أحسنت! تقدمت بنسبة 10% إضافية في مادة ${s.title}`);
        return {
          ...s,
          progress: nextProgress,
          statusText: nextStatus
        };
      }
      return s;
    }));
  };

  // Safe handler to submit a newly added resource
  const handleAddNewResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    if (!newTitle.trim()) {
      onNotify('برجاء كتابة عنوان دقيق للمورد التعليمي.');
      return;
    }

    const createdResource: SubjectResource = {
      id: `res-added-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      url: newUrl.trim() || 'https://aistudio.google.com/uploaded/file_' + Math.floor(Math.random() * 1000),
      description: newDesc.trim() || 'لا يتوفر وصف سريع للملف العلمي الجديد.',
      duration: newSpec.trim() || (newType === 'pdf' ? '12 صفحة' : newType === 'link' ? 'رابط خارجي' : '10:00 دقائق')
    };

    // Append to subject
    setSubjectList(prev => prev.map(s => {
      if (s.id === selectedSubject.id) {
        const updatedResources = [...(s.resources || []), createdResource];
        const updatedProgress = Math.min(s.progress + 5, 100);
        
        // Return updated Subject
        const modified = {
          ...s,
          progress: updatedProgress,
          resources: updatedResources
        };
        
        setSelectedSubject(modified);
        return modified;
      }
      return s;
    }));

    onNotify(`تم بنجاح رفع وقبول "${newTitle}" وإدراجه كـ ${newType === 'pdf' ? 'كتيب PDF' : newType === 'audio' ? 'ملف صوتي' : newType === 'video' ? 'درس فيديو متاح' : 'رابط مرجعي'}.`);
    
    // Reset form fields
    setNewTitle('');
    setNewUrl('');
    setNewSpec('');
    setNewDesc('');
  };

  // Simulated tickers for audio & video playbacks, tracking watching/listening duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (audioPlaying) {
      timer = setInterval(() => {
        let isMinuteCompleted = false;
        setAudioElapsedTime(prev => {
          const next = prev + 1;
          if (next >= 240) {
            setAudioPlaying(false);
            onNotify('تم الاستماع للمادة الصوتية كاملة! رائع.');
            return 240;
          }
          if (next > 0 && next % 60 === 0) {
            isMinuteCompleted = true;
          }
          return next;
        });
        setAudioProgress(prev => (prev >= 100 ? 100 : prev + (100 / 240)));
        
        // Accumulate active media duration
        setActiveMediaTimer(prev => prev + 1);
        
        if (isMinuteCompleted) {
          awardGlobalPoints(1);
          onNotify('لقد استمعت للمحاضرة لمدة دقيقة كاملة! حصلت على +1 نقطة إنجاز ⭐');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [audioPlaying]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (videoPlaying) {
      timer = setInterval(() => {
        let isMinuteCompleted = false;
        setVideoDuration(prev => {
          const next = prev + 1.2;
          const prevMin = Math.floor((prev * 600) / 100 / 60);
          const nextMin = Math.floor((next * 600) / 100 / 60);
          if (nextMin > prevMin) {
            isMinuteCompleted = true;
          }
          if (next >= 100) {
            setVideoPlaying(false);
            onNotify('أكملت مشاهدة درس الفيديو التعليمي بالكامل.');
            return 100;
          }
          return next;
        });

        // Accumulate active media duration
        setActiveMediaTimer(prev => prev + 1);

        if (isMinuteCompleted) {
          awardGlobalPoints(1);
          onNotify('لقد شاهدت مقطع الفيديو لمدة دقيقة كاملة! حصلت على +1 نقطة إنجاز ⭐');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [videoPlaying]);

  // Load saved page and notes when previewResource opens
  useEffect(() => {
    if (previewResource && previewResource.resource.type === 'pdf') {
      const resId = previewResource.resource.id;
      
      // Load last page
      const savedPage = localStorage.getItem(`pdf_page_${resId}`);
      if (savedPage) {
        setPdfChapter(parseInt(savedPage));
      } else {
        setPdfChapter(0);
      }

      // Load saved notes
      const savedNotesJson = localStorage.getItem(`pdf_notes_${resId}`);
      if (savedNotesJson) {
        try {
          setSavedNotes(JSON.parse(savedNotesJson));
        } catch (e) {
          setSavedNotes([]);
        }
      } else {
        setSavedNotes([]);
      }
    }
  }, [previewResource]);

  // Save page whenever it changes
  useEffect(() => {
    if (previewResource && previewResource.resource.type === 'pdf') {
      localStorage.setItem(`pdf_page_${previewResource.resource.id}`, pdfChapter.toString());
    }
  }, [pdfChapter, previewResource]);

  // Handle saving personal PDF session notes
  const handleSaveNotes = () => {
    if (!pdfNotes.trim() || !previewResource) return;
    const newNote = pdfNotes.trim();
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem(`pdf_notes_${previewResource.resource.id}`, JSON.stringify(updated));
    setPdfNotes('');
    onNotify('تم حفظ وتوطيد ملخص الفكر، والتعليقات والخواطر بسجل مذكراتك للمادة بنجاح 📚');
  };

  // Reset category lists to default original data
  const handleRestoreDefaults = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة المواد الدراسية إلى الإعدادات الافتراضية؟ سيفقد هذا أي ملفات أو مناهج قمت بإضافتها.')) {
      localStorage.removeItem('angels_subjects_list_v1');
      setSubjectList(SUBJECTS);
      setSelectedSubject(null);
      setPreviewResource(null);
      onNotify('تمت إعادة تهيئة المكتبة والمواد الدراسية إلى القيم الأساسية للمنصة.');
    }
  };

  // Dynamic pages for the PDF Book reader (supports admin custom page preparation)
  const getDynamicPdfPages = () => {
    if (previewResource?.resource?.id) {
      const savedCustomPages = localStorage.getItem(`custom_pdf_pages_${previewResource.resource.id}`);
      if (savedCustomPages) {
        try {
          return JSON.parse(savedCustomPages);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        title: 'الصفحة الأولى: التأصيل التاريخي والمنهجي',
        paragraphs: [
          'يتناول هذا الجزء الركائز الأولى التي كُتبت لأجلها هذه المناهج المعززة، حيث تُبنى المساقات على فهم الاحتياجات الأساسية للمخدوم والتعاطف المشترك والنمو الذاتي المتوازن على صعيد المهارة والروح.',
          'إن الغاية الأساسية تكمن في جعل بيئة التعلم تفاعلية وسهلة الوصول، حيث يستطيع الدارس العادي والخدام ذوو الكفاءة مشاركة القيم الكنسية والشروحات الطبية العاجلة دون عوائق ترابطية.',
          'نقوم بفحص مستمر لمنظومات الرعاية الطبية والإنسانية لضمان تطبيق أعلى مبادئ الدقة والسلامة النفسية والوقاية في شتى المعسكرات والاجتماعات العلمية.'
        ]
      },
      {
        title: 'الصفحة الثانية: الأدوات والتطبيقات العملية',
        paragraphs: [
          'هنا نجد القواعد الاسترشادية للغة الجسد، ففي حين أن التعبير الحركي لغة تواصل ملموسة، فإن لغة العيون وتدرج مستوى طبقات الصدر والوقفات تلعب دور الـ 80% في إيصال المفهوم.',
          'تشير الدراسات إلى أن استخدام الرسوم البصرية المبسطة مع المتدرب يحفز الذاكرة الفورية بمعدل أربعة أضعاف مقارنة بالمحاضرات السردية الطويلة المستمرة لقاعات المناهج الصامتة.',
          'قم دائماً بتنويع نبرات المحاكاة وتأكد من إشراك الحضور في حل المعضلات المطروحة عبر فحص فجائي مشجع للنقاط والمكافآت السلوكية.'
        ]
      },
      {
        title: 'الصفحة الثالثة: التقييم المستمر ومعايير جودة الخدمة',
        paragraphs: [
          'يقوم المشرف الميداني بفحص دقيق لنسبة استجابة الدارسين، وتعد الموازنة بين التحضير النظري المسبق والالتزام السلوكي هي المقياس الحقيقي لنجاح الخريج.',
          'ينبغي الاستمرار في قراءة الملحقات والمراجع الإسقاطية والحرص على الاستماع للملفات الصوتية المرفقة لأنها توفر تجربة حسية فريدة تعين الذاكرة السمعية وتوسع آفاق الفهم.'
        ]
      }
    ];
  };

  const pdfChapterTexts = getDynamicPdfPages();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" id="materials_main_container">
      
      {/* If Subject is Selected, Render Expanded Subject Detail & Resource View */}
      {selectedSubject ? (
        <div className="space-y-8">
          
          {/* Breadcrumb Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#c3c5d7]/40 shadow-xs" id="detail_header_nav">
            <button
              onClick={() => {
                setSelectedSubject(null);
                setPreviewResource(null);
              }}
              className="flex items-center gap-2 text-xs font-label font-bold text-[#15803d] hover:text-[#166534] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4.5 h-4.5" />
              <span>العودة لمكتبة المواد الدراسية الرئيسية</span>
            </button>
            <div className="text-[#737686] text-xs font-sans">
              المادة الدراسية الحالية: <span className="font-bold text-[#151c27]">{selectedSubject.title}</span>
            </div>
          </div>

          {/* Large Dynamic Subject Showcase Banner */}
          <section className="bg-white rounded-3xl overflow-hidden border border-[#c3c5d7]/50 shadow-sm relative" id="subject_showcase_banner_details">
            <div className="h-60 md:h-64 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 z-10" />
              <img
                src={selectedSubject.bgImage}
                alt={selectedSubject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 z-20">
                <span className={`font-label text-xs font-extrabold px-3.5 py-1.5 rounded-full text-white shadow-sm ${
                  selectedSubject.tagType === 'disability' ? 'bg-blue-600' :
                  selectedSubject.tagType === 'spiritual' ? 'bg-indigo-600' :
                  selectedSubject.tagType === 'general' ? 'bg-emerald-600' :
                  selectedSubject.tagType === 'orbital' ? 'bg-purple-600' :
                  selectedSubject.tagType === 'humandev' ? 'bg-amber-600' : 'bg-pink-600'
                }`}>
                  {selectedSubject.tag}
                </span>
              </div>

              {/* Banner Info Placement */}
              <div className="absolute bottom-6 right-6 left-6 z-20 text-white">
                <h2 className="font-display text-2xl md:text-4xl font-black mb-2 tracking-tight">{selectedSubject.title}</h2>
                <p className="font-sans text-white/90 text-sm md:text-md max-w-3xl leading-relaxed mb-4">
                  {selectedSubject.description || 'لم يتم تسجيل ملخص للمادة. المسار التعليمي غني بالملفات المساعدة والمراجع المرئية والسمعية.'}
                </p>

                {/* Micro Progress Grid inside Banner */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md pt-2">
                  <div className="flex-grow">
                    <div className="flex justify-between text-xs font-label text-white/90 mb-1.5">
                      <span>إجمالي نقاط الإنجاز والاستيعاب للمادة</span>
                      <span className="font-bold">{selectedSubject.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${selectedSubject.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/15 px-4 py-2 rounded-xl border border-white/10 text-center shrink-0">
                    <span className="block font-display text-lg font-black leading-none">{selectedSubject.lessonsCount}</span>
                    <span className="font-sans text-[10px] text-white/80">مقرر وتدريب</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Interactive Consumer Preview Section (PDF/Audio/Video Player simulator) */}
          {previewResource && (
            <section className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 animate-in slide-in-from-top-6 duration-300" id="media_consume_preview_player">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-xl text-[#15803d]">
                    {previewResource.resource.type === 'pdf' ? <FileText className="w-6 h-6 text-red-400" /> :
                     previewResource.resource.type === 'audio' ? <Headphones className="w-6 h-6 text-blue-400" /> :
                     previewResource.resource.type === 'video' ? <VideoIcon className="w-6 h-6 text-emerald-400" /> :
                     <Link2 className="w-6 h-6 text-cyan-400" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider font-label">
                      {previewResource.resource.type === 'pdf' ? 'مستعرض الكتيبات الرقمي الذكي' : 
                       previewResource.resource.type === 'audio' ? 'مشغل المحاضرات الصوتي المحيطي' : 
                       previewResource.resource.type === 'video' ? 'شاشة العرض المرئي والمشاهدة' : 'رابط مرجعي خارجي'}
                    </span>
                    <h3 className="font-display font-bold text-lg md:text-xl text-white mt-0.5">{previewResource.resource.title}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewResource(null);
                    setAudioPlaying(false);
                    setVideoPlaying(false);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors font-bold cursor-pointer text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MEDIA TYPE SPECIFIC RENDERERS */}
              {previewResource.resource.type === 'pdf' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="pdf_simulator_layout">
                  {/* PDF Chapters & Pages Simulator (Readable component) */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Toolbar */}
                    <div className="bg-slate-800 p-3 rounded-xl flex flex-wrap justify-between items-center gap-2 text-xs">
                      <div className="flex gap-1.5 overflow-x-auto">
                        {pdfChapterTexts.map((chap, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPdfChapter(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                              pdfChapter === idx ? 'bg-[#15803d] text-white' : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {idx === 0 ? 'الصفحة الأولى' : idx === 1 ? 'الصفحة الثانية' : idx === 2 ? 'الصفحة الثالثة' : `الصفحة ${idx + 1}`}
                          </button>
                        ))}
                      </div>

                      {/* Font adjustment and theme */}
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <button 
                            type="button"
                            onClick={() => setPdfFontSize(prev => Math.min(prev + 2, 24))}
                            className="p-1 px-2.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold font-display"
                          >
                            A+
                          </button>
                          <button 
                            type="button"
                            onClick={() => setPdfFontSize(prev => Math.max(prev - 2, 12))}
                            className="p-1 px-2.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold font-display"
                          >
                            A-
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            type="button"
                            onClick={() => setPdfTheme('parchment')}
                            className={`w-5 h-5 rounded-full bg-[#fcf5e5] border-2 cursor-pointer ${pdfTheme === 'parchment' ? 'border-[#3b82f6]' : 'border-transparent'}`}
                            title="ورق كلاسيكي"
                          />
                          <button 
                            type="button"
                            onClick={() => setPdfTheme('paper')}
                            className={`w-5 h-5 rounded-full bg-white border-2 cursor-pointer ${pdfTheme === 'paper' ? 'border-[#3b82f6]' : 'border-transparent'}`}
                            title="أبيض ناصع"
                          />
                          <button 
                            type="button"
                            onClick={() => setPdfTheme('dark')}
                            className={`w-5 h-5 rounded-full bg-slate-800 border-2 cursor-pointer ${pdfTheme === 'dark' ? 'border-[#3b82f6]' : 'border-transparent'}`}
                            title="داكن مريح"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Book Text Area mimicking normal reading */}
                    <div 
                      className={`p-6 md:p-8 rounded-2xl shadow-inner transition-colors ${
                        pdfTheme === 'parchment' ? 'bg-[#faf4e6] text-[#423114]' :
                        pdfTheme === 'paper' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'
                      }`}
                      style={{ fontSize: `${pdfFontSize}px` }}
                      id="pdf_book_canvas"
                    >
                      <h4 className="font-display font-extrabold text-lg md:text-xl border-b border-black/10 pb-2 mb-4">
                        {pdfChapterTexts[pdfChapter].title}
                      </h4>
                      <div className="space-y-4 leading-relaxed font-sans font-light">
                        {pdfChapterTexts[pdfChapter].paragraphs.map((para, pIdx) => (
                          <p key={pIdx}>
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>

                     {/* Notice bar for page reading and points reward */}
                     <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-3 mb-2 text-xs">
                       {pdfPageApproved[pdfChapter] ? (
                         <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                           <span>✅ تم استيعاب هذه الصفحة بنجاح! نلت +1 نقطة.</span>
                         </span>
                       ) : pdfPageTimer > 0 ? (
                         <span className="text-amber-400 font-semibold animate-pulse">
                           ⏳ يرجى قراءة الصفحة بتركيز (بمعدل 3 ثوانٍ لكل سطر لحفظ واستيعاب المادة) - المتبقي: {pdfPageTimer} ثوانٍ...
                         </span>
                       ) : (
                         <button
                           type="button"
                           onClick={() => {
                             setPdfPageApproved(prev => ({ ...prev, [pdfChapter]: true }));
                             awardGlobalPoints(1);
                             onNotify('أحسنت! ربحت +1 نقطة لقراءة واستيعاب هذه الصفحة بالكامل.');
                           }}
                           className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-black rounded-lg cursor-pointer transition-all"
                         >
                           تأكيد قراءة واستيعاب الصفحة ونيل +1 نقطة ⭐
                        </button>
                       )}

                       <span className="text-slate-300 font-mono">
                         نقاط القراءة المكتسبة: {Object.keys(pdfPageApproved).length * 1} نقاط
                       </span>
                     </div>

                     {/* Page turning */}
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <button
                        type="button"
                        disabled={pdfChapter === 0}
                        onClick={() => setPdfChapter(prev => prev - 1)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-755 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>الصفحة السابقة</span>
                      </button>
                      <span className="font-display">الدليل الرقمي - المادة العلمية الكنسية - صفحة {pdfChapter + 1} من 3</span>
                      <button
                        type="button"
                        disabled={pdfChapter === pdfChapterTexts.length - 1 || !pdfPageApproved[pdfChapter]}
                        onClick={() => setPdfChapter(prev => prev + 1)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded disabled:opacity-30 cursor-pointer transition-all ${
                          !pdfPageApproved[pdfChapter] ? 'bg-slate-850 text-slate-500' : 'bg-slate-800 text-white hover:bg-slate-755'
                        }`}
                        title={!pdfPageApproved[pdfChapter] ? 'يجب تأكيد القراءة بانتهاء العداد أولاً للعبور' : ''}
                      >
                        <span>الصفحة التالية</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {pdfChapter === pdfChapterTexts.length - 1 && (
                      <div className="pt-4 text-center border-t border-slate-800 mt-4 flex items-center justify-center gap-3 flex-wrap">
                        <button
                          type="button"
                          disabled={!pdfPageApproved[0] || !pdfPageApproved[1] || !pdfPageApproved[2]}
                          onClick={() => {
                            if (!completedResourceIds.includes(previewResource.resource.id)) {
                              setCompletedResourceIds(prev => [...prev, previewResource.resource.id]);
                            }
                            // Close reader
                            setPreviewResource(null);
                            onNotify('✨ تهانينا! أكملت المادة المقروءة كاملة، وتم اعتماد الملف العلمي والدرجات بملفك الشخصي بنجاح!');
                          }}
                          className="px-6 py-3 bg-[#15803d] hover:bg-[#166534] disabled:opacity-40 text-white font-label text-xs font-bold rounded-xl transition-all disabled:cursor-not-allowed cursor-pointer shadow-lg inline-flex items-center gap-2 animate-pulse"
                        >
                          <span>إنهاء الكتاب واعتماده بنجاح بالملف الدراسي 🎓</span>
                        </button>

                        {onChangeTab && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!completedResourceIds.includes(previewResource.resource.id)) {
                                setCompletedResourceIds(prev => [...prev, previewResource.resource.id]);
                              }
                              const examId = SUBJECT_TO_EXAM_MAP[previewResource.subject.id] || 'active-1';
                              localStorage.setItem('angels_selected_exam_id', examId);
                              setPreviewResource(null);
                              onChangeTab('exams');
                            }}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-650 text-white font-label text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
                          >
                            <span>اذهب الي اختبار المادة مباشرتا ⚡</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes taking and Bookmarks Sidebar for PDF (Real interaction) */}
                  <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h5 className="font-display font-semibold text-sm text-yellow-400 flex items-center gap-2">
                      <BookMarked className="w-4 h-4" />
                      <span>سجل مذكرات الدراس والأفكار</span>
                    </h5>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed text-right">
                      دون ملخص الفكرة التي استخلصتها أثناء تصفح الكتاب أو الملف لتقييد العلم.
                    </p>
                    
                    <textarea
                      value={pdfNotes}
                      onChange={(e) => setPdfNotes(e.target.value)}
                      className="w-full h-24 p-3 bg-slate-900 rounded-xl text-xs text-white border border-slate-700 focus:ring-1 focus:ring-[#15803d] focus:outline-hidden font-sans resize-none text-right"
                      placeholder="اكتب فكرة رئيسية أو سؤال مهم هنا..."
                    />

                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-650 transition-colors text-xs font-bold text-white rounded-lg cursor-pointer"
                    >
                      حفظ الخاطرة والسجل الدراسي
                    </button>

                    {/* History list inside PDF side panel */}
                    <div className="space-y-2 pt-2 border-t border-slate-700/60">
                      <span className="text-[10px] font-label font-bold text-slate-400 block mb-1">الملاحظات المدونة خلال هذه الجلسة ({savedNotes.length})</span>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {savedNotes.length > 0 ? (
                           savedNotes.map((note, idx) => (
                             <div key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border-r-2 border-yellow-500 text-[11px] font-sans leading-relaxed">
                               {note}
                             </div>
                           ))
                        ) : (
                          <div className="text-center py-4 text-[10px] text-slate-500 font-sans italic">
                            لا تتوفر مذكرات محفوظة حتى الآن. اكتب ملاحظة بالأعلى.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AUDIO PLAYER SIMULATOR (Acoustics & Waves) */}
              {previewResource.resource.type === 'audio' && (
                <div className="flex flex-col md:flex-row items-center justify-around gap-8 p-4 bg-slate-900 rounded-2xl" id="audio_simulator_player">
                  {/* Vinyl spinning record simulation */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`relative w-40 h-40 rounded-full bg-slate-950 flex items-center justify-center border-4 border-slate-800 ${audioPlaying ? 'animate-spin duration-[10000ms]' : ''}`}>
                      <div className="absolute inset-2 border border-dashed border-slate-700 rounded-full" />
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <div className="w-6 h-6 rounded-full bg-[#15803d]/30 flex items-center justify-center text-slate-300">
                          <Volume2 className="w-4 h-4 text-blue-450" />
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-950" />
                    </div>
                    
                    {/* Interactive Play Status under spinning disc */}
                    <span className="font-label text-xs font-bold text-slate-400 mt-4 block">
                      {audioPlaying ? 'جاري بث المحاضرة الصوتية...' : 'تم إيقاف التشغيل مؤقتاً'}
                    </span>
                  </div>

                  {/* Playback Controls & Waveforms */}
                  <div className="flex-grow max-w-xl text-center md:text-right space-y-4">
                    <h4 className="font-display text-white text-lg font-bold">{previewResource.resource.title}</h4>
                    <p className="text-xs text-slate-300 font-sans max-w-lg leading-relaxed">
                      {previewResource.resource.description} / <span className="text-slate-400">مدة الملف: {previewResource.resource.duration}</span>
                    </p>

                    {/* Animated sound bars simulator */}
                    <div className="h-12 bg-slate-950/60 p-2 rounded-xl flex items-center justify-center gap-1.5 overflow-hidden">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        const baseHt = 12 + (idx % 4) * 8 + (idx % 3) * 6;
                        const finalHt = audioPlaying 
                          ? `${Math.max(4, Math.min(44, baseHt + Math.sin(audioElapsedTime + idx) * 12))}px`
                          : `${Math.max(4, baseHt * 0.35)}px`;
                        return (
                          <div 
                            key={idx} 
                            className={`w-1 rounded-full bg-[#15803d] transition-all duration-300`}
                            style={{ height: finalHt, opacity: audioPlaying ? 0.9 : 0.4 }}
                          />
                        );
                      })}
                    </div>

                    {/* Timeline representation */}
                    <div className="space-y-3">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const nextTime = Math.max(0, audioElapsedTime - 15);
                            setAudioElapsedTime(nextTime);
                            setAudioProgress(Math.round((nextTime / 240) * 100)); // Total 240s
                            onNotify('⏪ إرجاع المحتوى الصوتي 15 ثانية للخلف');
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-300 transition-colors"
                        >
                          ⏪ تراجع 15ث
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const nextTime = Math.min(240, audioElapsedTime + 15);
                            setAudioElapsedTime(nextTime);
                            setAudioProgress(Math.round((nextTime / 240) * 100));
                            onNotify('⏩ تقديم المحتوى الصوتي 15 ثانية للأمام');
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-300 transition-colors"
                        >
                          تقديم 15ث ⏩
                        </button>
                      </div>

                      {/* Seekable Slider bar for Audio */}
                      <input
                        type="range"
                        min="0"
                        max="240"
                        value={audioElapsedTime}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setAudioElapsedTime(val);
                          setAudioProgress(Math.round((val / 240) * 100));
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-hidden"
                      />

                      <div className="flex justify-between items-center text-[10px] font-display text-slate-400">
                        <span>{Math.floor(audioElapsedTime / 60)}:{(audioElapsedTime % 60).toString().padStart(2, '0')}</span>
                        <span>إجمالي المحاضرة: 4 دقائق تقريبا</span>
                      </div>
                    </div>

                    {/* Interactive keys */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                      <button
                        onClick={() => setAudioPlaying(!audioPlaying)}
                        className={`px-5 py-2.5 rounded-full font-label text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer ${
                          audioPlaying 
                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <span>{audioPlaying ? 'إيقاف مؤقت' : 'بدء الاستماع الصوتي'}</span>
                        <Play className="w-3.5 h-3.5" />
                      </button>

                      {/* Speed settings multiplier */}
                      <div className="flex items-center gap-2 border border-slate-700 rounded-full px-2.5 py-1 text-xs">
                        <span className="text-slate-400">السرعة:</span>
                        {[1.0, 1.25, 1.5].map((speedValue) => (
                          <button
                            key={speedValue}
                            onClick={() => {
                              setAudioSpeed(speedValue);
                              onNotify(`تم ضبط سرعة القراءة الصوتية لـ ${speedValue}x`);
                            }}
                            className={`px-2 py-0.5 rounded-sm font-display text-[10px] font-semibold transition-colors cursor-pointer ${
                              audioSpeed === speedValue ? 'bg-[#15803d] text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {speedValue}x
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setAudioProgress(100);
                            setAudioPlaying(false);
                            setAudioElapsedTime(240);
                            if (!completedResourceIds.includes(previewResource.resource.id)) {
                              setCompletedResourceIds(prev => [...prev, previewResource.resource.id]);
                            }
                            onNotify('تم الاستماع للمادة الصوتية كاملة وتسجيل وحساب نقاط الحضور بالملف الشخصي! 🎧');
                          }}
                          className="text-xs text-slate-400 hover:text-white underline cursor-pointer pr-2"
                        >
                          تعليم كمقروء ومستمع بالكامل
                        </button>

                        {onChangeTab && (
                          <button
                            onClick={() => {
                              setAudioProgress(100);
                              setAudioPlaying(false);
                              setAudioElapsedTime(240);
                              if (!completedResourceIds.includes(previewResource.resource.id)) {
                                setCompletedResourceIds(prev => [...prev, previewResource.resource.id]);
                              }
                              const examId = SUBJECT_TO_EXAM_MAP[previewResource.subject.id] || 'active-1';
                              localStorage.setItem('angels_selected_exam_id', examId);
                              setPreviewResource(null);
                              onChangeTab('exams');
                            }}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>اذهب الي اختبار المادة مباشرتا ⚡</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIDEO PLAYER THEATRE SIMULATOR */}
              {previewResource.resource.type === 'video' && (
                <div className="space-y-4" id="video_theatre_player">
                  <div className="aspect-video w-full max-w-3xl mx-auto rounded-2xl bg-black border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 group">
                    
                    {/* Video decorative status bar inside screen */}
                    <div className="flex justify-between items-center text-xs text-slate-400/90 bg-black/40 backdrop-blur-md p-2 rounded-lg relative z-20">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <span>بث مرئي مفرغ بجودة عالية ({selectedQuality})</span>
                      </span>
                      <span>سيرفر أصدقاء الملائكة المشفر</span>
                    </div>

                    {/* Simulated Content Frame */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 bg-slate-950/70 z-0 pointer-events-none" />
                      <div className="relative z-10 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-350 hover:scale-105 transition-transform duration-350 cursor-pointer text-yellow-400">
                          {videoPlaying ? <Flame className="w-7 h-7 text-emerald-450 animate-pulse" /> : <Play className="w-7 h-7 text-yellow-450 rotate-180" />}
                        </div>
                        <h4 className="font-display font-bold text-md text-white">{previewResource.resource.title}</h4>
                        <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto leading-relaxed">
                          {videoPlaying ? 'جاري بث المقطع والتوضيح المرئي... انتظر ثوانٍ للتحميل.' : 'تم الإيقاف المؤقت لتدفق الفيديو. انقر زر التشغيل بالأسفل.'}
                        </p>
                      </div>

                      {/* Simulated Arabic subtitles dynamically changing */}
                      {videoPlaying && (
                        <div className="absolute bottom-16 left-4 right-4 bg-black/70 py-1.5 px-4 rounded-md inline-block max-w-lg mx-auto text-xs font-sans text-yellow-300 relative z-20 transition-all">
                          {videoDuration < 30 ? '«... وهنا نبدأ ببيان تواصل اليدين ومخارج الكلمات للإعاقة السمعية...»' :
                           videoDuration < 70 ? '«... ونلاحظ الحركات المتكررة للرسغ لنطابق تشابه العروق الدموية أثناء الإرقاد...»' :
                           '«... بالتالي، نكون قد أحرزنا خطوة شاملة لحيازة المهارة والقبول. بالتوفيق ختاما...»'}
                        </div>
                      )}
                    </div>

                    {/* Custom HTML Simulated Control bar overlay with seek, rewind mechanisms */}
                    <div className="relative z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 space-y-3 mt-auto">
                      <div className="space-y-2">
                        <div className="flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const nextVal = Math.max(0, videoDuration - 5);
                              setVideoDuration(nextVal);
                              onNotify('⏪ إرجاع الفيديو 5% للخلف');
                            }}
                            className="px-3.5 py-1 bg-slate-855 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300"
                          >
                            ⏪ تراجع 5%
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const nextVal = Math.min(100, videoDuration + 5);
                              setVideoDuration(nextVal);
                              onNotify('⏩ تقديم الفيديو 5% للأمام');
                            }}
                            className="px-3.5 py-1 bg-slate-855 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300"
                          >
                            تقديم 5% ⏩
                          </button>
                        </div>

                        {/* Interactive Slide bar */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Math.round(videoDuration)}
                          onChange={(e) => {
                            setVideoDuration(parseInt(e.target.value));
                          }}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setVideoPlaying(!videoPlaying)}
                            className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded text-white text-xs font-semibold cursor-pointer"
                          >
                            {videoPlaying ? 'إيقاف الفيديو' : 'عرض المحتوى'}
                          </button>
                          
                          <div className="text-[10px] text-slate-400 font-display">
                            <span>07:15 من أصل 15:40 دقيقة</span>
                          </div>
                        </div>

                        {/* Quality Dropdown Simulation */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">الجودة:</span>
                          {['1080p', '720p', '480p'].map(q => (
                            <button
                              key={q}
                              onClick={() => {
                                setSelectedQuality(q);
                                onNotify(`تم تعديل دقة البث لـ ${q}`);
                              }}
                              className={`text-[9px] font-sans px-1.5 py-0.5 rounded ${selectedQuality === q ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Complete video button reward */}
                  <div className="text-center flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={() => {
                        setVideoDuration(100);
                        setVideoPlaying(false);
                        if (!completedResourceIds.includes(previewResource.resource.id)) {
                          setCompletedResourceIds(prev => [...prev, previewResource.resource.id]);
                        }
                        onNotify('أحسنت! أكملت المادة المرئية كاملة، وحصلت على تقدم بالدورة والدرجات! 🎬');
                      }}
                      className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>تسجيل فهم المقطع المرئي واجتياز الدرس 🎓</span>
                    </button>

                    {onChangeTab && (
                      <button
                        onClick={() => {
                          setVideoDuration(100);
                          setVideoPlaying(false);
                          if (!completedResourceIds.includes(previewResource.resource.id)) {
                            setCompletedResourceIds(prev => [...prev, previewResource.resource.id]);
                          }
                          const examId = SUBJECT_TO_EXAM_MAP[previewResource.subject.id] || 'active-1';
                          localStorage.setItem('angels_selected_exam_id', examId);
                          setPreviewResource(null);
                          onChangeTab('exams');
                        }}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>اذهب الي اختبار المادة مباشرتا ⚡</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* OUTLINK PORTAL VIEW */}
              {previewResource.resource.type === 'link' && (
                <div className="p-6 bg-slate-850 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4 max-w-xl mx-auto text-center" id="outlink_redirect_simulator">
                  <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 mx-auto">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-white text-lg font-bold">بوابة المراجع والموسوعات الخارجية</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    الرابط الملحق يحيلك إلى الموسوعات المعتمدة الآبائية والدراسات الشاملة ذات الصلة بمادة <strong>{previewResource.subject.title}</strong> للاطلاع والتحضير الفردي.
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded-lg text-xs text-cyan-400 font-mono select-all text-center break-all">
                    {previewResource.resource.url}
                  </div>
                  <div className="flex justify-center gap-3">
                    <a
                      href={previewResource.resource.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-bold text-white transition-colors"
                      onClick={() => onNotify('جاري نقلك للمرجع الخارجي للدراسة.')}
                    >
                      <span>زيارة وتصفح الموقع</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-135" />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(previewResource.resource.url);
                        onNotify('تم نسخ رابط البحث العلمي للحافظة للمشاركة.');
                      }}
                      className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200"
                    >
                      نسخ الرابط
                    </button>
                  </div>
                </div>
              )}

            </section>
          )}

          {/* Subject resources catalog and resource uploader split */}
          <div className="grid grid-cols-1 gap-8" id="subject_details_split_row">
            
            {/* Split COLUMN 1: Resources catalog list (Tabbed browser) */}
            <div className="bg-white rounded-2xl p-6 border border-[#c3c5d7]/50 shadow-xs space-y-6" id="resources_catalog_panel">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-[#151c27] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#15803d]" />
                  <span>المستندات والمواد العلمية المتاحة</span>
                </h3>
                <span className="font-label text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-sm">
                  {selectedSubject.resources ? selectedSubject.resources.length : 0} مادة مقررة
                </span>
              </div>

              {/* Resource Types selector tabs */}
              <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100" id="resource_type_selection_tabs">
                <button
                  onClick={() => setResourceFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-label font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    resourceFilter === 'all' ? 'bg-[#15803d] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setResourceFilter('pdf')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-label font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    resourceFilter === 'pdf' ? 'bg-red-650 bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-red-50/40'
                  }`}
                >
                  <FileText className="w-3 h-3 shrink-0" />
                  <span>كتب ومستندات PDF</span>
                </button>
                <button
                  onClick={() => setResourceFilter('audio')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-label font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    resourceFilter === 'audio' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/40'
                  }`}
                >
                  <Volume2 className="w-3 h-3 shrink-0" />
                  <span>ملفات للصوت والاستماع</span>
                </button>
                <button
                  onClick={() => setResourceFilter('video')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-label font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    resourceFilter === 'video' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/40'
                  }`}
                >
                  <VideoIcon className="w-3 h-3 shrink-0" />
                  <span>فيديوهات للشرح ومشاهدة</span>
                </button>
                <button
                  onClick={() => setResourceFilter('link')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-label font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    resourceFilter === 'link' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-cyan-50/40'
                  }`}
                >
                  <Link2 className="w-3 h-3 shrink-0" />
                  <span>روابط خارجية ومراجع</span>
                </button>
              </div>

              {/* Resource List Output */}
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1" id="subject_resources_list_container">
                {selectedSubject.resources && selectedSubject.resources.filter(r => resourceFilter === 'all' || r.type === resourceFilter).length > 0 ? (
                  selectedSubject.resources
                    .filter(r => resourceFilter === 'all' || r.type === resourceFilter)
                    .map((resource) => (
                      <div
                        key={resource.id}
                        className="p-4 rounded-xl border border-slate-150 relative overflow-hidden flex items-start gap-4 transition-all hover:bg-slate-50 hover:shadow-xs group"
                        id={`res_item_${resource.id}`}
                      >
                        {/* Type Icon indicator */}
                        <div className={`p-3 rounded-lg shrink-0 ${
                          resource.type === 'pdf' ? 'bg-red-50 text-red-650 text-red-600' :
                          resource.type === 'audio' ? 'bg-blue-50 text-blue-600' :
                          resource.type === 'video' ? 'bg-emerald-50 text-emerald-600' : 'bg-cyan-50 text-cyan-600'
                        }`}>
                          {resource.type === 'pdf' ? <FileText className="w-5 h-5" /> :
                           resource.type === 'audio' ? <Headphones className="w-5 h-5" /> :
                           resource.type === 'video' ? <VideoIcon className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                        </div>

                        {/* Title and Descriptions */}
                        <div className="flex-grow space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-[#151c27] leading-tight group-hover:text-[#15803d] transition-colors">{resource.title}</h4>
                            {completedResourceIds.includes(resource.id) ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>تمت القراءة والدراسة</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                <span>غير مقروء</span>
                              </span>
                            )}
                          </div>
                          
                          <p className="font-sans text-xs text-[#434654] leading-relaxed max-w-xl">{resource.description}</p>
                          <span className="inline-block text-[10px] font-label font-bold text-slate-400 bg-slate-150/50 px-2 py-0.5 rounded-sm">
                            {resource.type === 'pdf' ? `عدد الصفحات: ${resource.duration || 'متوفر للاطلاع'}` :
                             resource.type === 'audio' ? `مدة التسجيل: ${resource.duration || '12:00'}` :
                             resource.type === 'video' ? `مدة المقطع: ${resource.duration || '08:15'}` : 'مرجع إضافي للاستزادة'}
                          </span>
                        </div>

                        {/* Status badge (Calculated automatically, non-interactive) */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 self-center">
                          <div
                            className={`p-2 rounded-xl border flex items-center gap-1 text-[10px] font-bold ${
                              completedResourceIds.includes(resource.id)
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                            title={completedResourceIds.includes(resource.id) ? "منجز تلقائياً" : "غير منجز بعد"}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{completedResourceIds.includes(resource.id) ? "منجز تلقائياً" : "قيد الدراسة"}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setPreviewResource({ resource, subject: selectedSubject });
                              // Pre-fill simulator helpers
                              setAudioProgress(15);
                              setAudioElapsedTime(45);
                              setVideoDuration(25);
                              onNotify(`جاري فتح وعرض الحافظة لـ "${resource.title}" الآن.`);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-label font-extrabold transition-all text-white shrink-0 cursor-pointer ${
                              resource.type === 'pdf' ? 'bg-red-600 hover:bg-red-700' :
                              resource.type === 'audio' ? 'bg-blue-600 hover:bg-blue-700' :
                              resource.type === 'video' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-cyan-600 hover:bg-cyan-700'
                            }`}
                          >
                            {resource.type === 'pdf' ? 'تصفح وقراءة الكتيب' :
                             resource.type === 'audio' ? 'استماع وتسجيل الحضور' :
                             resource.type === 'video' ? 'مشاهدة الدرس الآن' : 'فتح البوابة المرجعية'}
                          </button>
                        </div>

                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 font-sans gap-3">
                    <FilePlus className="w-10 h-10 text-slate-300" />
                    <div>
                      <p className="text-sm font-semibold">لم تتوفر ملفات دراسية مطابقة بهذا التبويب حالياً.</p>
                      <p className="text-xs text-slate-400 mt-1">يمكنك رفع كتب PDF أو ملفات صوتية جديدة عبر الاستمارة المجاورة تالياً.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Render Primary List View - All Subjects grid categorized by 6 new areas */
        <div className="space-y-8 animate-in fade-in duration-400">
          
          {/* Welcome Dashboard Banner */}
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#c3c5d7]/50 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative overflow-hidden" id="materials_welcome_banner">
            <div className="absolute top-0 left-0 w-32 h-full bg-[#dcfce7]/40 rounded-r-3xl pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-black text-[#151c27] tracking-tight">المناهج والمواد العلمية والدراسية</h2>
              <p className="font-sans text-[#434654] text-sm md:text-md max-w-2xl leading-relaxed">
                مرحباً بك في المنصة الشاملة لكافة الفروع العلمية. تصفح المناهج حسب الفئة المناسبة والمستوى المطلوب، واقرأ كراسات PDF أو استمع للشروحات الصوتية بكل سهولة.
              </p>
            </div>

          </section>

          {/* Interactive Filtering and Advanced Search */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#c3c5d7]/40 shadow-xs space-y-4" id="catalog_filters_search_box">
            
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              
              {/* Search text input */}
              <div className="relative flex-grow max-w-md">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686]">
                  <Search className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pr-11 pl-4 rounded-xl border border-[#c3c5d7] bg-[#ffffff] focus:ring-1 focus:ring-[#15803d] focus:border-[#15803d] transition-all font-sans text-xs"
                  placeholder="ابحث عن مادة دراسية، مثلاً: إشارة، الإسعافات، الكفاءة..."
                  id="catalog_search_query_input"
                />
              </div>

              {/* Tag Category Filters Scrollbar (The 6 precise items) */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none" id="category_filtering_scroll_dock">
                {[
                  { id: 'all', label: '📚 الجميع', styleClass: 'bg-[#15803d] text-white shadow-xs' },
                  { id: 'disability', label: '♿ مواد الإعاقة', styleClass: 'bg-blue-600 text-white shadow-xs' },
                  { id: 'spiritual', label: '⛪ مواد روحية', styleClass: 'bg-indigo-600 text-white shadow-xs' },
                  { id: 'general', label: '🌱 مواد عامة', styleClass: 'bg-emerald-600 text-white shadow-xs' },
                  { id: 'orbital', label: '⚙️ مواد مهارية', styleClass: 'bg-purple-600 text-white shadow-xs' },
                  { id: 'humandev', label: '💡 مواد تنمية بشرية', styleClass: 'bg-amber-600 text-white shadow-xs' },
                  { id: 'contests', label: '🏆 مواد مسابقات', styleClass: 'bg-pink-600 text-white shadow-xs' }
                ].map((tagItem) => {
                  const isSelected = activeFilter === tagItem.id;
                  return (
                    <button
                      key={tagItem.id}
                      onClick={() => setActiveFilter(tagItem.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-label font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                        isSelected 
                          ? tagItem.styleClass
                          : 'bg-slate-50 text-[#434654] border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tagItem.label}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Section Description Row (ملخص مبسط لكل قسم بمجرد الاختيار) */}
          <div className="bg-[#15803d]/5 text-[#15803d] p-5 rounded-2xl border border-[#15803d]/15 text-right animate-in fade-in duration-300">
            <h4 className="font-display font-black text-xs flex items-center gap-1.5 mb-1.5 text-[#166534]">
              <Sparkles className="w-4 h-4 text-emerald-650 animate-pulse shrink-0" />
              <span>ملخص وتوجيه فئة الدروس النشطة:</span>
            </h4>
            <p className="font-sans text-[11px] leading-relaxed text-slate-700 font-medium">
              {activeFilter === 'all' && "📚 تصفّح كافة الفروع والمناهج الدراسية الشاملة المعتمدة ببوابة خُدام مؤسسة أصدقاء الملائكة."}
              {activeFilter === 'disability' && "♿ مواد الإعاقة: ترابط ريادي للتعامل النفسي والجسدي، وبحث مهارات لغة الإشارة والتواصل السامي للصم والبكم."}
              {activeFilter === 'spiritual' && "⛪ مواد روحية: شروحات كنسية رائدة من قداسة البابا شنودة والمراجع الطقسية الآبائية لبناء خادم ممتلئ ومثمر."}
              {activeFilter === 'general' && "🌱 مواد عامة: الإسعافات الأولية وتأمين المريض وإيقاف النزيف بالمعسورات لدعم السلامة والإصابات الطارئة."}
              {activeFilter === 'orbital' && "⚙️ مواد مهارية: أسس الإدارة السليمة، تقسيم المهام وتوزيع الخدام وتوجيه المجموعات الكشفية بنظام السيطرة."}
              {activeFilter === 'humandev' && "💡 تنمية بشرية: فن الخطابة الفعال، بناء لغة جسد جذابة وجاذبية لغوية لتوطين الفكرة بيسر واقتدار."}
              {activeFilter === 'contests' && "🏆 مسابقات: كنز الرحمة وموسوعات الأسئلة التفاعلية لحث روح التنافس الشريف وتقييد المعرفة في النفوس."}
            </p>
          </div>

          {/* Subjects Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="subjects_cards_grid">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => {
                const styles = CATEGORY_STYLES[subject.tagType] || CATEGORY_STYLES.general;
                return (
                  <div
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject)}
                    className="bg-white rounded-2xl border border-slate-150 overflow-hidden group hover:shadow-md hover:border-[#15803d]/40 transition-all duration-350 flex flex-col h-full cursor-pointer relative"
                    id={`subject_card_${subject.id}`}
                  >
                    
                    {/* Cover image relative section */}
                    <div className="h-44 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10" />
                      <img
                        src={subject.bgImage}
                        alt={subject.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <span className={`absolute top-4 right-4 z-20 font-label text-[10px] font-extrabold px-3 py-1 rounded-full text-white shadow-xs ${
                        subject.tagType === 'disability' ? 'bg-blue-600' :
                        subject.tagType === 'spiritual' ? 'bg-indigo-600' :
                        subject.tagType === 'general' ? 'bg-emerald-600' :
                        subject.tagType === 'orbital' ? 'bg-purple-600' :
                        subject.tagType === 'humandev' ? 'bg-amber-600' : 'bg-pink-600'
                      }`}>
                        {subject.tag}
                      </span>
                    </div>

                    {/* Description & contents */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-display font-extrabold text-md md:text-lg text-[#151c27] mb-1 group-hover:text-[#15803d] transition-all leading-snug">{subject.title}</h3>
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${subject.accentColor}10`, color: subject.accentColor }}
                          >
                            <GraduationCap className="w-4.5 h-4.5" />
                          </div>
                        </div>
                        <p className="font-sans text-xs text-[#434654] leading-relaxed line-clamp-2">
                          {subject.description || 'تصفح الكتب والمقررات الصوتية والفيديو واستمتع بالتأصيل العلمي.'}
                        </p>
                      </div>

                      {/* Info catalog bottom bar */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-center text-[10px] font-label font-bold text-slate-400">
                          <span>الدروس المتاحة: {subject.lessonsCount}</span>
                          <span className="text-[#006c49]">{subject.statusText}</span>
                        </div>

                        {/* Progress Bar slider */}
                        <div className="flex items-center gap-2.5">
                          <span className="font-display text-xs font-extrabold text-slate-700 shrink-0">{subject.progress}%</span>
                          <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${subject.progress}%`,
                                backgroundColor: subject.accentColor
                              }}
                            />
                          </div>
                        </div>

                        {/* Buttons panel */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubject(subject);
                            }}
                            className="w-full py-2 bg-slate-50 hover:bg-[#15803d]/5 text-[#15803d] font-label text-[10px] font-extrabold rounded-lg transition-colors border border-slate-200"
                          >
                            تصفح الملفات والمناهج
                          </button>
                          {SUBJECT_TO_EXAM_MAP[subject.id] ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (subject.progress < 100) {
                                  onNotify(`🔒 عذراً! يجب إنجاز كافة مناهج وكتيبات "${subject.title}" بنسبة 100% لتفعيل زر الانتقال للامتحان الموثق!`);
                                  return;
                                }
                                if (onChangeTab) {
                                  onChangeTab('exams');
                                  onNotify(`تم توجيهك إلى مركز الاختبارات لتقديم امتحان مادة "${subject.title}" 📝`);
                                } else {
                                  handlePracticeQuickly(subject.id, e);
                                }
                              }}
                              className={`w-full py-2 font-label text-[10px] font-extrabold rounded-lg transition-all border text-center cursor-pointer ${
                                subject.progress < 100
                                  ? 'bg-slate-100 border-slate-200 text-slate-450'
                                  : 'bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 border-emerald-200'
                              }`}
                              title={subject.progress < 100 ? "مغلق حتى تكتمل الدراسة 100%" : "الامتحان متاح الآن"}
                            >
                              {subject.progress < 100 ? '🔒 الامتحان (مغلق)' : 'الانتقال للامتحان الموثق 📝'}
                            </button>
                          ) : (
                            <span className="w-full py-2 bg-slate-50 border text-slate-400 font-label text-[9px] font-bold rounded-lg text-center leading-normal">
                              بدون امتحان 🔓
                            </span>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3" id="catalog_grid_empty_state">
                <Compass className="w-10 h-10 text-slate-350 mx-auto" />
                <h4 className="font-display font-bold text-md text-[#151c27]">لا تتوفر نتائج بحث مطابقة للمصطلح المدخل</h4>
                <p className="font-sans text-xs text-slate-400 max-w-sm mx-auto">
                  تأكد من كتابة أحرف الكلمة بشكل صحيح، أو أعد تعيين الفلاتر من التبويب الفرعي بالأعلى للتراجع عن التصفية.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="px-4 py-2 bg-[#15803d] text-white rounded-lg text-xs font-bold font-label"
                >
                  إعادة تصفير فلاتر تصفح المواد
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Banner showing multi-user activity counts */}
          <div className="bg-[#dcfce7]/55 rounded-2xl p-5 border border-[#c3c5d7]/45 flex flex-col md:flex-row items-center justify-between gap-4" id="catalog_dynamic_footer_banner">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-right">
                <span className="font-label text-xs font-bold text-[#151c27]">نشاط التعلم التعاوني متاح الآن</span>
                <p className="font-sans text-[11px] text-[#434654] mt-0.5">شارك في إثراء المحتوى الكنسي ورفع الكتب بصيغة PDF وتدوين الملاحظات اليدوية.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-[#c3c5d7]/35 text-center">
                <span className="font-display text-xs font-black block text-[#15803d]">45 كتاباً</span>
                <span className="text-[9px] font-sans text-slate-400 bg-transparent block">صيغ رقمية</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-[#c3c5d7]/35 text-center">
                <span className="font-display text-xs font-black block text-[#15803d]">112 محاضرة</span>
                <span className="text-[9px] font-sans text-slate-400 bg-transparent block">استماع مرتل</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
