import React from 'react';
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Heading,
} from '@chakra-ui/react';
import TaskList from '../components/dashboard/TaskList';
import StatsGrid from '../components/dashboard/StatsGrid';
import StudySessionTimer from '../components/study/StudySessionTimer';
import SubjectTips from '../components/study/SubjectTips';
import ProgressInsights from '../components/analytics/ProgressInsights';

export default function Dashboard() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Mock data for progress insights
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
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Heading size="md" mb={4}>
              Current Study Session
            </Heading>
            <StudySessionTimer />
          </Box>

          <Box>
            <Heading size="md" mb={4}>
              Progress Overview
            </Heading>
            <ProgressInsights metrics={progressMetrics} />
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Box
            gridColumn={{ base: '1', md: '1 / -1', lg: '1 / 3' }}
          >
            <Heading size="md" mb={4}>
              Tasks & Assignments
            </Heading>
            <Box
              p={4}
              bg={bgColor}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              height="400px"
              overflowY="auto"
            >
              <TaskList />
            </Box>
          </Box>

          <Box>
            <Heading size="md" mb={4}>
              Study Tips
            </Heading>
            <SubjectTips />
          </Box>
        </SimpleGrid>

        <Box>
          <Heading size="md" mb={4}>
            Performance Statistics
          </Heading>
          <StatsGrid />
        </Box>
      </VStack>
    </Box>
  );
}
