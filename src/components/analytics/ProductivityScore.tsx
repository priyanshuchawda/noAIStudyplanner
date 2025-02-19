import {
  Box,
  Text,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  HStack,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

interface ProductivityMetrics {
  score: number;
  tasksCompleted: number;
  goalsAchieved: number;
  studyTime: number;
  breakTime: number;
}

interface ProductivityScoreProps {
  metrics: ProductivityMetrics;
}

export default function ProductivityScore({ metrics }: ProductivityScoreProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="medium">
            Productivity Score
          </Text>
          <Tooltip
            label="Score is calculated based on tasks completed, goals achieved, and study time"
            placement="top"
          >
            <InfoIcon color={textColor} />
          </Tooltip>
        </HStack>

        <Box textAlign="center">
          <CircularProgress
            value={metrics.score}
            size="120px"
            thickness="8px"
            color={
              metrics.score >= 80
                ? 'green.400'
                : metrics.score >= 60
                ? 'orange.400'
                : 'red.400'
            }
          >
            <CircularProgressLabel>
              <Text fontSize="2xl" fontWeight="bold">
                {metrics.score}
              </Text>
              <Text fontSize="sm" color={textColor}>
                /100
              </Text>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text color={textColor}>Tasks Completed</Text>
            <Text fontWeight="medium">{metrics.tasksCompleted}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color={textColor}>Goals Achieved</Text>
            <Text fontWeight="medium">{metrics.goalsAchieved}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color={textColor}>Study Time</Text>
            <Text fontWeight="medium">{formatTime(metrics.studyTime)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color={textColor}>Break Time</Text>
            <Text fontWeight="medium">{formatTime(metrics.breakTime)}</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
