import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from '@chakra-ui/react';
import { StudySession, SubjectData } from '../types/analytics';
import { GoalPrediction } from '../types/goal';
import FocusMetrics from '../components/analytics/FocusMetrics';
import SubjectPerformance from '../components/analytics/SubjectPerformance';
import GoalPredictions from '../components/analytics/GoalPredictions';
import ProgressInsights from '../components/analytics/ProgressInsights';

const mockSessions: StudySession[] = [
  {
    id: '1',
    startTime: new Date('2024-02-19T10:00:00'),
    endTime: new Date('2024-02-19T12:00:00'),
    subject: 'Mathematics',
    focusScore: 85,
    distractions: [],
  },
  {
    id: '2',
    startTime: new Date('2024-02-19T14:00:00'),
    endTime: new Date('2024-02-19T16:00:00'),
    subject: 'Physics',
    focusScore: 90,
    distractions: [],
  },
];

const mockSubjectPerformance: SubjectData[] = [
  {
    name: 'Mathematics',
    grade: 85,
    previousGrade: 80,
    studyTime: 480,
    tasksCompleted: 15,
    totalTasks: 20,
    strengths: ['Algebra', 'Geometry'],
    areasForImprovement: ['Calculus'],
  },
  {
    name: 'Physics',
    grade: 78,
    previousGrade: 75,
    studyTime: 360,
    tasksCompleted: 12,
    totalTasks: 15,
    strengths: ['Mechanics'],
    areasForImprovement: ['Thermodynamics', 'Optics'],
  },
];

const mockGoalPredictions: GoalPrediction[] = [
  {
    id: '1',
    title: 'Master Calculus',
    currentProgress: 65,
    predictedCompletion: new Date('2024-03-15'),
    confidence: 80,
    trend: 'improving',
    requiredDailyProgress: 2.5,
  },
  {
    id: '2',
    title: 'Complete Physics Project',
    currentProgress: 45,
    predictedCompletion: new Date('2024-03-30'),
    confidence: 70,
    trend: 'steady',
    requiredDailyProgress: 3.0,
  },
];

export default function Analytics() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const calculateMetrics = () => {
    const totalFocusTime = mockSessions.reduce(
      (total, session) =>
        total +
        (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60 * 60),
      0
    );

    const averageFocusScore =
      mockSessions.reduce((sum, session) => sum + session.focusScore, 0) /
      mockSessions.length;

    const improvementRate = 15; // Mock improvement rate

    return {
      totalFocusTime: Math.round(totalFocusTime),
      averageFocusScore: Math.round(averageFocusScore),
      improvementRate,
    };
  };

  const metrics = calculateMetrics();

  return (
    <Container maxW="container.xl" py={6}>
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb={4}>
          <Tab>Overview</Tab>
          <Tab>Subject Performance</Tab>
          <Tab>Goals</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box
                p={6}
                bg={bgColor}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <FocusMetrics
                  totalFocusTime={metrics.totalFocusTime}
                  averageFocusScore={metrics.averageFocusScore}
                  improvementRate={metrics.improvementRate}
                />
              </Box>
              <Box
                p={6}
                bg={bgColor}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <ProgressInsights metrics={{
                  weeklyStudyHours: metrics.totalFocusTime,
                  previousWeekStudyHours: metrics.totalFocusTime - 5,
                  taskCompletionRate: 85,
                  previousTaskCompletionRate: 75,
                  averageGrade: 88,
                  previousAverageGrade: 85,
                  focusScore: metrics.averageFocusScore,
                  previousFocusScore: metrics.averageFocusScore - 5,
                }} />
              </Box>
            </SimpleGrid>
          </TabPanel>

          <TabPanel p={0}>
            <Box
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <SubjectPerformance subjects={mockSubjectPerformance} />
            </Box>
          </TabPanel>

          <TabPanel p={0}>
            <Box
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <GoalPredictions predictions={mockGoalPredictions} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
