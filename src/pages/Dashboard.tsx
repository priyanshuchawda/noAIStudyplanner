import React from 'react';
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Heading,
  HStack,
  Button,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Text,
} from '@chakra-ui/react';
import TaskList from '../components/dashboard/TaskList';
import StudySessionTimer from '../components/study/StudySessionTimer';
import SubjectTips from '../components/study/SubjectTips';
import ProgressInsights from '../components/analytics/ProgressInsights';
import Leaderboard from '../components/dashboard/Leaderboard';
import { FiAward, FiTrendingUp } from 'react-icons/fi';

interface Challenge {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
}

export default function Dashboard() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const rowBgColor = useColorModeValue('gray.50', 'gray.700');

  const [challenges] = React.useState<Challenge[]>([
    { id: 1, title: 'Study 2 hours', reward: 100, completed: false },
    { id: 2, title: 'Complete 3 tasks', reward: 150, completed: true },
    { id: 3, title: 'Maintain 90% focus', reward: 200, completed: false },
  ]);

  const progressMetrics = {
    weeklyStudyHours: 25,
    previousWeekStudyHours: 20,
    taskCompletionRate: 85,
    previousTaskCompletionRate: 75,
    averageGrade: 88,
    previousAverageGrade: 85,
    focusScore: 92,
    previousFocusScore: 88,
  };

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Left Column */}
        <VStack spacing={6}>
          <Card w="full" bg={bgColor}>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Heading size="md">Daily Challenges</Heading>
                  <Badge colorScheme="purple">3 Active</Badge>
                </HStack>
                <VStack align="stretch" w="full" spacing={3}>
                  {challenges.map(challenge => (
                    <HStack 
                      key={challenge.id} 
                      p={3} 
                      bg={rowBgColor}
                      borderRadius="md"
                      justify="space-between"
                    >
                      <VStack align="start" spacing={0}>
                        <Text>{challenge.title}</Text>
                        <Badge colorScheme="green">+{challenge.reward} XP</Badge>
                      </VStack>
                      <Badge 
                        colorScheme={challenge.completed ? 'green' : 'gray'}
                      >
                        {challenge.completed ? 'Completed' : 'In Progress'}
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
          
          <Card w="full" bg={bgColor}>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Current Session</Heading>
                <StudySessionTimer />
              </VStack>
            </CardBody>
          </Card>

          <TaskList />
        </VStack>

        {/* Middle Column */}
        <VStack spacing={6}>
          <Card w="full" bg={bgColor}>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Heading size="md">Your Progress</Heading>
                  <Button size="sm" rightIcon={<FiTrendingUp />} colorScheme="blue" variant="ghost">
                    View Details
                  </Button>
                </HStack>
                <SimpleGrid columns={2} spacing={4} w="full">
                  <Stat>
                    <StatLabel>Weekly XP</StatLabel>
                    <StatNumber>2,450</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      23% vs last week
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Current Rank</StatLabel>
                    <StatNumber>#12</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      Up 3 positions
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          <ProgressInsights metrics={progressMetrics} />
          <SubjectTips />
        </VStack>

        {/* Right Column */}
        <VStack spacing={6}>
          <Leaderboard />
          
          <Card w="full" bg={bgColor}>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Heading size="md">Your Achievements</Heading>
                  <Button size="sm" rightIcon={<FiAward />} colorScheme="yellow" variant="ghost">
                    View All
                  </Button>
                </HStack>
                <SimpleGrid columns={2} spacing={4}>
                  <Box p={4} bg={useColorModeValue('yellow.50', 'yellow.900')} borderRadius="lg" textAlign="center">
                    <VStack>
                      <Badge colorScheme="yellow" p={2} borderRadius="full">
                        🏆 Study Champion
                      </Badge>
                      <Text fontSize="sm">Completed 100 hours</Text>
                    </VStack>
                  </Box>
                  <Box p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg" textAlign="center">
                    <VStack>
                      <Badge colorScheme="purple" p={2} borderRadius="full">
                        ⚡ Focus Master
                      </Badge>
                      <Text fontSize="sm">90% focus score</Text>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}
