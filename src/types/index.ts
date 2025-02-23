export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  duration: number;
}

export interface DashboardStats {
  totalHours: number;
  currentStreak: number;
  tasksCompleted: number;
  productivityScore: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    darkMode: boolean;
    dashboardLayout: string[];
  };
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'streak' | 'achievement' | 'milestone';
  icon: string;
  unlockedAt?: string;
}

export interface UserRewards {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  rewardsEarned: Reward[];
}
