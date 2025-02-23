import {
  Box,
  Text,
  Progress,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { FiTarget, FiTrendingUp, FiCalendar } from 'react-icons/fi';

interface GoalPrediction {
  id: string;
  title: string;
  currentProgress: number;
  predictedCompletion: Date;
  confidence: number;
  trend: 'improving' | 'steady' | 'declining';
  requiredDailyProgress: number;
}

interface GoalPredictionsProps {
  predictions: GoalPrediction[];
}

export default function GoalPredictions({ predictions }: GoalPredictionsProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'green';
      case 'steady':
        return 'blue';
      case 'declining':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'green';
    if (confidence >= 60) return 'yellow';
    return 'red';
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
          <HStack>
            <Icon as={FiTarget} color="purple.500" />
            <Text fontSize="lg" fontWeight="medium">
              Goal Predictions
            </Text>
          </HStack>
          <Tooltip label="Predictions are based on your historical progress and current study patterns">
            <InfoIcon color="gray.500" />
          </Tooltip>
        </HStack>

        {predictions.map((prediction) => (
          <Box key={prediction.id} p={3} borderRadius="md" borderWidth="1px">
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="medium">{prediction.title}</Text>
                <HStack spacing={2}>
                  <Badge colorScheme={getTrendColor(prediction.trend)}>
                    <Icon as={FiTrendingUp} mr={1} />
                    {prediction.trend}
                  </Badge>
                  <Badge
                    colorScheme={getConfidenceColor(prediction.confidence)}
                  >
                    {prediction.confidence}% confident
                  </Badge>
                </HStack>
              </HStack>

              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" color="gray.500">
                    Current Progress
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {prediction.currentProgress}%
                  </Text>
                </HStack>
                <Progress
                  value={prediction.currentProgress}
                  colorScheme={getTrendColor(prediction.trend)}
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              <VStack spacing={1} align="stretch">
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiCalendar} color="gray.500" />
                    <Text fontSize="sm" color="gray.500">
                      Predicted Completion
                    </Text>
                  </HStack>
                  <Text fontSize="sm">
                    {prediction.predictedCompletion.toLocaleDateString()}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    Required Daily Progress
                  </Text>
                  <Text fontSize="sm">
                    {prediction.requiredDailyProgress.toFixed(1)}%
                  </Text>
                </HStack>
              </VStack>

              {prediction.trend === 'declining' && (
                <Text fontSize="sm" color="red.500">
                  ⚠️ You might need to increase your study time to meet this goal
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
