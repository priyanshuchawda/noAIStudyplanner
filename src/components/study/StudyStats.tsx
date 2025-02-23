import React, { useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Progress,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CircularProgress,
  CircularProgressLabel,
  Heading,
} from '@chakra-ui/react';
import { FiClock, FiBook, FiTrendingUp, FiAward } from 'react-icons/fi';
import StudyHistory from './StudyHistory';
import FocusMetrics from '../analytics/FocusMetrics';
import GoalPredictions from '../analytics/GoalPredictions';

// Mock data
const MOCK_DATA = {
  totalStudyTime: 1250, // 20 hours and 50 minutes
  subjectsStudied: 5,
  currentStreak: 7,
  completionRate: 85,
  weeklyProgress: [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 3.5 },
    { day: 'Wed', hours: 5 },
    { day: 'Thu', hours: 2 },
    { day: 'Fri', hours: 4.5 },
    { day: 'Sat', hours: 1 },
    { day: 'Sun', hours: 0.8 },
  ],
  subjectBreakdown: [
    { subject: 'Mathematics', hours: 8, progress: 75 },
    { subject: 'Physics', hours: 6, progress: 60 },
    { subject: 'Chemistry', hours: 4, progress: 45 },
    { subject: 'Biology', hours: 3, progress: 30 },
    { subject: 'Computer Science', hours: 5, progress: 55 },
  ]
};

// Mock data for goals
const MOCK_GOAL_PREDICTIONS = [
  {
    id: '1',
    title: 'Complete Calculus Course',
    currentProgress: 65,
    predictedCompletion: new Date('2024-02-15'),
    confidence: 85,
    trend: 'improving' as const,
    requiredDailyProgress: 2.5
  },
  {
    id: '2',
    title: 'Physics Final Exam Prep',
    currentProgress: 45,
    predictedCompletion: new Date('2024-03-01'),
    confidence: 70,
    trend: 'steady' as const,
    requiredDailyProgress: 3.0
  },
  {
    id: '3',
    title: 'Chemistry Lab Reports',
    currentProgress: 30,
    predictedCompletion: new Date('2024-02-28'),
    confidence: 55,
    trend: 'declining' as const,
    requiredDailyProgress: 4.5
  }
];

const StudyStats: React.FC = () => {
  const [mockData] = useState(MOCK_DATA);
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiClock} boxSize={6} color="blue.500" />
                  <StatLabel>Total Study Time</StatLabel>
                </HStack>
                <StatNumber>{Math.floor(mockData.totalStudyTime / 60)}h {mockData.totalStudyTime % 60}m</StatNumber>
                <StatHelpText>This month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiBook} boxSize={6} color="green.500" />
                  <StatLabel>Subjects Covered</StatLabel>
                </HStack>
                <StatNumber>{mockData.subjectsStudied}</StatNumber>
                <StatHelpText>Active subjects</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiTrendingUp} boxSize={6} color="purple.500" />
                  <StatLabel>Current Streak</StatLabel>
                </HStack>
                <StatNumber>{mockData.currentStreak} days</StatNumber>
                <StatHelpText>Keep it up!</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiAward} boxSize={6} color="orange.500" />
                  <StatLabel>Completion Rate</StatLabel>
                </HStack>
                <VStack align="start" spacing={2}>
                  <StatNumber>{mockData.completionRate}%</StatNumber>
                  <Progress 
                    value={mockData.completionRate} 
                    w="100%" 
                    colorScheme={mockData.completionRate >= 70 ? "green" : mockData.completionRate >= 40 ? "orange" : "red"}
                    borderRadius="full"
                  />
                </VStack>
                <StatHelpText>Task completion</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Tabs variant="soft-rounded" colorScheme="blue" w="full">
          <TabList>
            <Tab>Weekly Overview</Tab>
            <Tab>Subject Breakdown</Tab>
            <Tab>Session History</Tab>
            <Tab>Focus Metrics</Tab>
            <Tab>Goal Predictions</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Card bg={cardBg} p={6}>
                <Heading size="md" mb={6}>Weekly Study Hours</Heading>
                <SimpleGrid columns={{ base: 2, md: 7 }} spacing={4}>
                  {mockData.weeklyProgress.map((day) => (
                    <VStack key={day.day}>
                      <CircularProgress 
                        value={(day.hours / 8) * 100} 
                        color="blue.400"
                        size="80px"
                      >
                        <CircularProgressLabel>{day.hours}h</CircularProgressLabel>
                      </CircularProgress>
                      <Text color={textColor}>{day.day}</Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card bg={cardBg} p={6}>
                <Heading size="md" mb={6}>Subject Progress</Heading>
                <VStack spacing={6} align="stretch">
                  {mockData.subjectBreakdown.map((subject) => (
                    <Box key={subject.subject}>
                      <HStack justify="space-between" mb={2}>
                        <Text color={textColor}>{subject.subject}</Text>
                        <Text color={textColor} fontWeight="bold">{subject.hours}h</Text>
                      </HStack>
                      <Progress 
                        value={subject.progress} 
                        colorScheme="blue" 
                        size="sm" 
                        borderRadius="full"
                      />
                    </Box>
                  ))}
                </VStack>
              </Card>
            </TabPanel>

            <TabPanel p={0} pt={4}>
              <StudyHistory />
            </TabPanel>

            <TabPanel p={0} pt={4}>
              <FocusMetrics />
            </TabPanel>

            <TabPanel p={0} pt={4}>
              <GoalPredictions predictions={MOCK_GOAL_PREDICTIONS} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default StudyStats;