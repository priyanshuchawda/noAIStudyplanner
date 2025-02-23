import React from 'react';
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';

const mockData = {
  bestTimeToStudy: '9:00 AM - 11:00 AM',
  bestSubjects: ['Mathematics', 'Physics'],
  productiveWeekDays: ['Monday', 'Wednesday'],
  weeklyProgress: {
    studyHours: 25,
    previousWeek: 20,
    tasksCompleted: 15,
    previousTasks: 12,
    retention: 85,
    previousRetention: 80,
  },
};

export default function ProductivityInsights() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Card bg={cardBg}>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Heading size="md">Productivity Insights</Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Card variant="outline">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text fontWeight="bold">Best Study Time</Text>
                  <HStack spacing={4}>
                    <CircularProgress value={85} color="green.400" size="60px">
                      <CircularProgressLabel>85%</CircularProgressLabel>
                    </CircularProgress>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color={textColor}>{mockData.bestTimeToStudy}</Text>
                      <Text fontSize="xs" color="green.500">Highest Focus Period</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            <Card variant="outline">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text fontWeight="bold">Most Productive Days</Text>
                  <HStack spacing={2}>
                    {mockData.productiveWeekDays.map(day => (
                      <Box
                        key={day}
                        px={3}
                        py={1}
                        bg="blue.100"
                        color="blue.700"
                        borderRadius="full"
                        fontSize="sm"
                      >
                        {day}
                      </Box>
                    ))}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Stat>
              <StatLabel>Study Hours</StatLabel>
              <StatNumber>{mockData.weeklyProgress.studyHours}h</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {((mockData.weeklyProgress.studyHours - mockData.weeklyProgress.previousWeek) / mockData.weeklyProgress.previousWeek * 100).toFixed(0)}%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Tasks Completed</StatLabel>
              <StatNumber>{mockData.weeklyProgress.tasksCompleted}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {((mockData.weeklyProgress.tasksCompleted - mockData.weeklyProgress.previousTasks) / mockData.weeklyProgress.previousTasks * 100).toFixed(0)}%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Retention Rate</StatLabel>
              <StatNumber>{mockData.weeklyProgress.retention}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {mockData.weeklyProgress.retention - mockData.weeklyProgress.previousRetention}%
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          <Card variant="outline">
            <CardBody>
              <VStack align="start" spacing={3}>
                <Text fontWeight="bold">Best Performing Subjects</Text>
                <HStack spacing={3}>
                  {mockData.bestSubjects.map(subject => (
                    <Box
                      key={subject}
                      px={4}
                      py={2}
                      bg="purple.100"
                      color="purple.700"
                      borderRadius="lg"
                      fontSize="sm"
                    >
                      {subject}
                    </Box>
                  ))}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </CardBody>
    </Card>
  );
}