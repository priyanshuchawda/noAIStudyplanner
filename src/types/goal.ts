export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  progress: number; // 0-100
  category: 'academic' | 'skill' | 'project';
  status: 'active' | 'completed' | 'abandoned';
  milestones?: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  completedAt?: Date;
}

export interface GoalPrediction {
  id: string;
  title: string;
  currentProgress: number;
  predictedCompletion: Date;
  confidence: number;
  trend: 'improving' | 'steady' | 'declining';
  requiredDailyProgress: number;
}
