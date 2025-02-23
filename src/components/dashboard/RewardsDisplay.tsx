import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Heading,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import { useRewards } from '../../store/RewardsContext';

export default function RewardsDisplay() {
  const { state } = useRewards();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Your Achievements</Heading>
            <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
              {state.totalPoints} Points
            </Badge>
          </HStack>

          <Box>
            <HStack justify="space-between" mb={2}>
              <Text>Current Streak</Text>
              <Text fontWeight="bold">{state.currentStreak} days</Text>
            </HStack>
            <Progress
              value={(state.currentStreak / 7) * 100}
              colorScheme="green"
              size="sm"
              borderRadius="full"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              {7 - (state.currentStreak % 7)} days until next reward
            </Text>
          </Box>

          <SimpleGrid columns={2} spacing={4}>
            {state.rewardsEarned.map((reward) => (
              <Tooltip key={reward.id} label={reward.description}>
                <Box
                  p={3}
                  bg={useColorModeValue('gray.50', 'gray.600')}
                  borderRadius="md"
                  cursor="pointer"
                >
                  <VStack>
                    <Text fontSize="2xl">{reward.icon}</Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {reward.title}
                    </Text>
                    <Badge colorScheme="green">+{reward.points} pts</Badge>
                  </VStack>
                </Box>
              </Tooltip>
            ))}
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
}