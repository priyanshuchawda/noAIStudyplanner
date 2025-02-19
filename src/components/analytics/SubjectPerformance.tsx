import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Progress,
  List,
  ListItem,
  ListIcon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { SubjectData } from '../../types/analytics';

interface SubjectPerformanceProps {
  subjects: SubjectData[];
}

export default function SubjectPerformance({ subjects }: SubjectPerformanceProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'green';
    if (grade >= 80) return 'blue';
    if (grade >= 70) return 'yellow';
    return 'red';
  };

  const getImprovementBadge = (current: number, previous: number) => {
    const difference = current - previous;
    return (
      <Badge
        colorScheme={difference >= 0 ? 'green' : 'red'}
        ml={2}
      >
        {difference >= 0 ? '+' : ''}{difference.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      {subjects.map((subject) => (
        <Box
          key={subject.name}
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {subject.name}
              </Text>
              <Text fontSize="2xl" color={`${getGradeColor(subject.grade)}.500`}>
                {subject.grade}%
                {getImprovementBadge(subject.grade, subject.previousGrade)}
              </Text>
            </Box>

            <Progress
              value={subject.grade}
              colorScheme={getGradeColor(subject.grade)}
              size="sm"
            />

            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Study Time
                </Text>
                <Text fontWeight="bold">
                  {Math.round(subject.studyTime / 60)}h {subject.studyTime % 60}m
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Tasks Completed
                </Text>
                <Text fontWeight="bold">
                  {subject.tasksCompleted}/{subject.totalTasks}
                </Text>
              </Box>
            </SimpleGrid>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Strengths
              </Text>
              <List spacing={1}>
                {subject.strengths.map((strength, index) => (
                  <ListItem key={index}>
                    <ListIcon as={FiCheck} color="green.500" />
                    {strength}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Areas for Improvement
              </Text>
              <List spacing={1}>
                {subject.areasForImprovement.map((area, index) => (
                  <ListItem key={index}>
                    <ListIcon as={FiAlertTriangle} color="orange.500" />
                    {area}
                  </ListItem>
                ))}
              </List>
            </Box>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
