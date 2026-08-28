/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubjectResource {
  id: string;
  title: string;
  type: 'pdf' | 'audio' | 'video' | 'link';
  url: string; // Mock or actual url
  description?: string;
  duration?: string; // e.g., "15:40" or "45 صفحة"
}

export interface Subject {
  id: string;
  title: string;
  lessonsCount: number;
  progress: number;
  tag: string; // The category name in Arabic, e.g., 'مواد الإعاقة'
  tagType: 'disability' | 'spiritual' | 'general' | 'orbital' | 'humandev' | 'contests';
  icon: string;
  bgImage: string;
  statusText: string; // e.g., 'ممتاز'
  description?: string;
  accentColor: string;
  resources: SubjectResource[];
}

export interface ActiveExam {
  id: string;
  title: string;
  description: string;
  duration: number; // in mins
  questionsCount: number;
  category: string;
  publishDate?: string;
  expireDate?: string;
}

export interface UpcomingExam {
  id: string;
  title: string;
  platform: string;
  time: string;
  icon: 'table_chart' | 'stars';
  platformIconBg: string;
}

export interface ScoreHistoryItem {
  id: string;
  subjectName: string;
  date: string;
  maxScore: number;
  achievedScore: number;
  status: 'passed' | 'failed';
  category: string;
}

export interface RankLevel {
  id: string;
  levelName: string;
  englishName: string;
  pointsRange: string;
  description: string;
  badgeClass: string;
  bgClass: string;
  iconName: string;
  isActive?: boolean;
}

export interface SkillChecklistItem {
  id: string;
  label: string;
  status: 'evaluated' | 'review' | 'completed' | 'required';
  statusText: string;
  checked: boolean;
}

export interface PracticalMetricItem {
  id: string;
  label: string;
  maxScore: number;
  achievedScore: number;
}

export interface PracticalSection {
  id: string;
  title: string;
  icon: string; // lucide icon identifier
  items: PracticalMetricItem[];
}

export interface FieldAlertTask {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'liturgy' | 'trip' | 'conference' | 'camp' | 'festival' | 'general';
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface UserProfile {
  fullName: string;
  fullName_clean?: string;
  age: string;
  phone: string;
  address: string;
  currentService: string;
  avatarUrl: string;
  logoUrl?: string;
  level: string; // The selected or calculated level out of 4 levels
  rankOrder: string; // The rank/order, e.g. "الأول" or "الخامس"
  points: number;
  completedExams: number;
  averageResult: number;
  password?: string;
  email?: string;
  username?: string;
  serviceOutside?: string;
  whatsapp?: string;
  disableDashboardAccess?: boolean;
  createdAt?: string; // Account registration date
}

