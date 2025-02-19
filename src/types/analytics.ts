export type DistractionType = 'phone' | 'web' | 'noise' | 'other';

export interface DistractionEvent {
  timestamp: Date;
  duration: number; // in seconds
  type: DistractionType;
}

export interface StudySession {
  id: string;
  startTime: Date;
  endTime: Date;
  subject: string;
  focusScore: number;
  distractions: DistractionEvent[];
}

export interface SubjectData {
  name: string;
  grade: number;
  previousGrade: number;
  studyTime: number; // in minutes
  tasksCompleted: number;
  totalTasks: number;
  strengths: string[];
  areasForImprovement: string[];
}

export interface StudyMetrics {
  weeklyStudyHours: number;
  previousWeekStudyHours: number;
  taskCompletionRate: number;
  previousTaskCompletionRate: number;
  averageGrade: number;
  previousAverageGrade: number;
  focusScore: number;
  previousFocusScore: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  category: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}
