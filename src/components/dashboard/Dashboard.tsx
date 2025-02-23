import { type Challenge } from '../../types/task';

interface ProgressMetrics {
  weeklyStudyHours: number;
  previousWeekStudyHours: number;
  taskCompletionRate: number;
  previousTaskCompletionRate: number;
  averageGrade: number;
  previousAverageGrade: number;
  focusScore: number;
  previousFocusScore: number;
}

export default function Dashboard() {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  const [challenges, setChallenges] = React.useState<Challenge[]>([
    { id: 1, title: 'Study 2 hours', reward: 100, completed: false },
    { id: 2, title: 'Complete 3 tasks', reward: 150, completed: true },
    { id: 3, title: 'Maintain 90% focus', reward: 200, completed: false },
  ]);

  const progressMetrics: ProgressMetrics = {
    weeklyStudyHours: 25,
    previousWeekStudyHours: 20,
    taskCompletionRate: 85,
    previousTaskCompletionRate: 75,
    averageGrade: 88,
    previousAverageGrade: 85,
    focusScore: 92,
    previousFocusScore: 88,
  };

  // ...existing code...