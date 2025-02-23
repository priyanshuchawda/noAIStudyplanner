import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Tooltip,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
} from '@chakra-ui/react';

interface DayStreak {
  date: string;
  minutesStudied: number;
  completed: boolean;
}

const mockStreakData: DayStreak[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  minutesStudied: Math.floor(Math.random() * 180) + 30,
  completed: Math.random() > 0.3,
}));

export default function StudyStreakCalendar() {
  const activeColor = useColorModeValue('green.400', 'green.200');
  const inactiveColor = useColorModeValue('gray.100', 'gray.600');
  const currentStreak = mockStreakData.reduce((acc, day) => 
    day.completed ? acc + 1 : 0, 0);

  return (
    <Card>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">Study Streak</Text>
            <Badge colorScheme="green" fontSize="md" px={3} py={1}>
              {currentStreak} Days 🔥
            </Badge>
          </HStack>

          <HStack spacing={2} justify="space-between">
            {mockStreakData.map((day, i) => (
              <Tooltip 
                key={day.date} 
                label={`${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
${day.minutesStudied} minutes studied`}
              >
                <VStack spacing={1}>
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="md"
                    bg={day.completed ? activeColor : inactiveColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ transform: 'scale(1.1)' }}
                  >
                    <Text color={day.completed ? 'white' : 'gray.500'} fontWeight="bold">
                      {new Date(day.date).getDate()}
                    </Text>
                  </Box>
                  <Box 
                    h="3px" 
                    w="full" 
                    bg={day.completed ? activeColor : inactiveColor} 
                    borderRadius="full"
                  />
                </VStack>
              </Tooltip>
            ))}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}