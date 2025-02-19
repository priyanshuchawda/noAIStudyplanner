export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  order?: number;
  tags?: string[];
  subject?: string;
  estimatedTime?: number; // in minutes
}

export interface TaskProgress {
  taskId: string;
  startTime: Date;
  endTime?: Date;
  timeSpent: number; // in minutes
  completed: boolean;
  notes?: string;
}
