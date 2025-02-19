import { Box, Text, Stack, useColorModeValue, CircularProgress, Center } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';

interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
}

export default function StreakWidget({ currentStreak, bestStreak }: StreakWidgetProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const progress = (currentStreak / bestStreak) * 100;

  return (
    <Box p={6} borderRadius="lg" boxShadow="sm" bg={bgColor}>
      <Stack spacing={4}>
        <Center position="relative">
          <CircularProgress
            value={progress}
            size="120px"
            thickness="8px"
            color="orange.400"
          />
          <Center
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <TimeIcon color="orange.400" boxSize={8} />
          </Center>
        </Center>
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold">
            {currentStreak}
          </Text>
          <Text color="gray.500">Day Streak</Text>
        </Box>
        <Text fontSize="sm" color="gray.500">
          Best: {bestStreak} days
        </Text>
      </Stack>
    </Box>
  );
}
