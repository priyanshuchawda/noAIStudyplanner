import React from 'react';
import {
  Box,
  VStack,
  Text,
  Progress,
  useColorModeValue,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiClock, FiActivity, FiTrendingUp } from 'react-icons/fi';

interface FocusMetricsProps {
  totalFocusTime: number;
  averageFocusScore: number;
  improvementRate: number;
}

export default function FocusMetrics({
  totalFocusTime,
  averageFocusScore,
  improvementRate,
}: FocusMetricsProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Focus Metrics
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box p={4} borderRadius="md" borderWidth="1px">
            <VStack align="start">
              <Icon as={FiClock} color="blue.500" boxSize={6} />
              <Text fontSize="sm" color="gray.500">
                Total Focus Time
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {totalFocusTime}h
              </Text>
            </VStack>
          </Box>

          <Box p={4} borderRadius="md" borderWidth="1px">
            <VStack align="start">
              <Icon as={FiActivity} color="purple.500" boxSize={6} />
              <Text fontSize="sm" color="gray.500">
                Average Focus Score
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {averageFocusScore}%
              </Text>
            </VStack>
          </Box>

          <Box p={4} borderRadius="md" borderWidth="1px">
            <VStack align="start">
              <Icon as={FiTrendingUp} color="green.500" boxSize={6} />
              <Text fontSize="sm" color="gray.500">
                Improvement Rate
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {improvementRate}%
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>

        <Progress value={averageFocusScore} colorScheme="blue" size="sm" />
      </VStack>
    </Box>
  );
}
