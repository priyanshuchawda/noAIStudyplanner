import React from 'react';
import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiClock,
  FiTarget,
  FiActivity,
} from 'react-icons/fi';

interface StudyMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
  icon: typeof FiTrendingUp;
  description: string;
}

interface ProgressInsightsProps {
  metrics: {
    weeklyStudyHours: number;
    previousWeekStudyHours: number;
    taskCompletionRate: number;
    previousTaskCompletionRate: number;
    averageGrade: number;
    previousAverageGrade: number;
    focusScore: number;
    previousFocusScore: number;
  };
}

export default function ProgressInsights({ metrics }: ProgressInsightsProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const studyMetrics: StudyMetric[] = [
    {
      label: 'Weekly ㅤ Study ㅤ Hours',
      value: metrics.weeklyStudyHours,
      change: metrics.weeklyStudyHours - metrics.previousWeekStudyHours,
      unit: 'hr',
      icon: FiClock,
      description: 'Total time spent studying this week',
    },
    {
      label: 'Task Completed',
      value: metrics.taskCompletionRate,
      change: metrics.taskCompletionRate - metrics.previousTaskCompletionRate,
      unit: '%',
      icon: FiTarget,
      description: 'Percentage of completed tasks',
    },
    {
      label: 'Average Grade',
      value: metrics.averageGrade,
      change: metrics.averageGrade - metrics.previousAverageGrade,
      unit: '%',
      icon: FiTrendingUp,
      description: 'Average grade across all subjects',
    },
    {
      label: 'Focus Score',
      value: metrics.focusScore,
      change: metrics.focusScore - metrics.previousFocusScore,
      unit: '%',
      icon: FiActivity,
      description: 'Overall focus and productivity score',
    },
  ];

  const getColorScheme = (value: number, metric: string) => {
    if (metric === 'Focus Score' || metric === 'Task Completion') {
      if (value >= 80) return 'green';
      if (value >= 60) return 'yellow';
      return 'red';
    }
    return 'blue';
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Progress Insights
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {studyMetrics.map((metric) => (
          <Tooltip key={metric.label} label={metric.description}>
            <Box
              p={4}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
            >
              <VStack spacing={2} align="start">
                <Icon as={metric.icon} />
                <Stat>
                  <StatLabel>{metric.label}</StatLabel>
                  <StatNumber>
                    {metric.value}
                    {metric.unit}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow
                      type={metric.change >= 0 ? 'increase' : 'decrease'}
                    />
                    {Math.abs(metric.change)}
                    {metric.unit}
                  </StatHelpText>
                </Stat>
                <CircularProgress
                  value={metric.value}
                  color={getColorScheme(metric.value, metric.label) + '.400'}
                  size="60px"
                >
                  <CircularProgressLabel>
                    {metric.value}%
                  </CircularProgressLabel>
                </CircularProgress>
              </VStack>
            </Box>
          </Tooltip>
        ))}
      </SimpleGrid>
    </Box>
  );
}
