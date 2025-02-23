import React from 'react';
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';

interface SubjectStats {
  subject: string;
  hoursSpent: number;
  previousHours: number;
  averageScore: number;
  previousScore: number;
  tasksCompleted: number;
  previousTasks: number;
  strengthLevel: 'Weak' | 'Moderate' | 'Strong';
}

const mockSubjects: SubjectStats[] = [
  {
    subject: 'Mathematics',
    hoursSpent: 25,
    previousHours: 20,
    averageScore: 88,
    previousScore: 82,
    tasksCompleted: 15,
    previousTasks: 12,
    strengthLevel: 'Strong',
  },
  {
    subject: 'Physics',
    hoursSpent: 18,
    previousHours: 15,
    averageScore: 75,
    previousScore: 70,
    tasksCompleted: 10,
    previousTasks: 8,
    strengthLevel: 'Moderate',
  },
  {
    subject: 'Chemistry',
    hoursSpent: 12,
    previousHours: 14,
    averageScore: 65,
    previousScore: 68,
    tasksCompleted: 8,
    previousTasks: 10,
    strengthLevel: 'Weak',
  },
];

export default function SubjectBreakdown() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getStrengthColor = (strength: SubjectStats['strengthLevel']) => {
    switch (strength) {
      case 'Strong': return 'green';
      case 'Moderate': return 'yellow';
      case 'Weak': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={6}>
        <Heading size="md">Subject Performance</Heading>
        
        {mockSubjects.map((subject) => (
          <Card key={subject.subject} w="full" bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="lg" fontWeight="bold">{subject.subject}</Text>
                  <Badge colorScheme={getStrengthColor(subject.strengthLevel)}>
                    {subject.strengthLevel}
                  </Badge>
                </HStack>

                <Progress 
                  value={subject.averageScore} 
                  w="full"
                  colorScheme={getStrengthColor(subject.strengthLevel)}
                  size="sm"
                />

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                  <Stat>
                    <StatLabel>Hours Spent</StatLabel>
                    <StatNumber>{subject.hoursSpent}h</StatNumber>
                    <StatHelpText>
                      <StatArrow 
                        type={subject.hoursSpent >= subject.previousHours ? 'increase' : 'decrease'} 
                      />
                      {Math.abs(((subject.hoursSpent - subject.previousHours) / subject.previousHours * 100)).toFixed(0)}%
                    </StatHelpText>
                  </Stat>

                  <Stat>
                    <StatLabel>Average Score</StatLabel>
                    <StatNumber>{subject.averageScore}%</StatNumber>
                    <StatHelpText>
                      <StatArrow 
                        type={subject.averageScore >= subject.previousScore ? 'increase' : 'decrease'} 
                      />
                      {Math.abs(subject.averageScore - subject.previousScore)}%
                    </StatHelpText>
                  </Stat>

                  <Stat>
                    <StatLabel>Tasks Completed</StatLabel>
                    <StatNumber>{subject.tasksCompleted}</StatNumber>
                    <StatHelpText>
                      <StatArrow 
                        type={subject.tasksCompleted >= subject.previousTasks ? 'increase' : 'decrease'} 
                      />
                      {Math.abs(((subject.tasksCompleted - subject.previousTasks) / subject.previousTasks * 100)).toFixed(0)}%
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
}