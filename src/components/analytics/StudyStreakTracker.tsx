import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';

interface StreakDay {
  date: Date;
  minutesStudied: number;
  completed: boolean;
}

interface StudyStreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  streakDays: StreakDay[];
}

export default function StudyStreakTracker({
  currentStreak,
  longestStreak,
  streakDays,
}: StudyStreakTrackerProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const fireColor = useColorModeValue('orange.500', 'orange.300');
  const dayBgColor = useColorModeValue('gray.100', 'gray.600');
  const completedColor = useColorModeValue('green.500', 'green.300');

  const last30Days = streakDays.slice(-30);

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
            Study Streak
          </Text>
          <HStack>
            <FaFire color={fireColor} />
            <Text fontWeight="bold" fontSize="xl">
              {currentStreak}
            </Text>
            <Text color="gray.500" fontSize="sm">
              days
            </Text>
          </HStack>
        </HStack>

        <HStack spacing={2} justify="space-between">
          <Text color="gray.500" fontSize="sm">
            Longest Streak: {longestStreak} days
          </Text>
        </HStack>

        <Box>
          <Text mb={2} fontSize="sm" color="gray.500">
            Last 30 Days
          </Text>
          <HStack spacing={1} flexWrap="wrap">
            {last30Days.map((day, index) => (
              <Tooltip
                key={index}
                label={`${new Date(day.date).toLocaleDateString()}: ${
                  day.minutesStudied
                } minutes studied`}
              >
                <Box
                  w="20px"
                  h="20px"
                  bg={day.completed ? completedColor : dayBgColor}
                  borderRadius="sm"
                  cursor="pointer"
                  opacity={day.completed ? 1 : 0.5}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'scale(1.1)',
                  }}
                />
              </Tooltip>
            ))}
          </HStack>
        </Box>

        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" color="gray.500">
            Achievements
          </Text>
          <HStack spacing={2}>
            {currentStreak >= 7 && (
              <Tooltip label="7-day streak achieved!">
                <Box
                  p={2}
                  borderRadius="full"
                  bg="yellow.400"
                  color="white"
                >
                  🔥
                </Box>
              </Tooltip>
            )}
            {currentStreak >= 30 && (
              <Tooltip label="30-day streak achieved!">
                <Box
                  p={2}
                  borderRadius="full"
                  bg="purple.400"
                  color="white"
                >
                  ⚡
                </Box>
              </Tooltip>
            )}
            {longestStreak >= 100 && (
              <Tooltip label="100-day streak reached!">
                <Box
                  p={2}
                  borderRadius="full"
                  bg="red.400"
                  color="white"
                >
                  💫
                </Box>
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
