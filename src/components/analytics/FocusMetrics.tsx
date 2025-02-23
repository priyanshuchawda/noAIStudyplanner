import React from 'react';
import {
  Container,
  Card,
  CardBody,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { 
  FiActivity, 
  FiClock, 
  FiTrendingUp, 
  FiSun
} from 'react-icons/fi';

const MOCK_FOCUS_DATA = {
  averageFocusScore: 85,
  totalFocusedHours: 42,
  bestTimeOfDay: 'Morning',
  productiveHours: [
    { hour: '9 AM', score: 95 },
    { hour: '10 AM', score: 90 },
    { hour: '11 AM', score: 85 },
    { hour: '2 PM', score: 75 },
    { hour: '3 PM', score: 70 },
    { hour: '4 PM', score: 65 },
  ],
  weeklyFocusTrend: [
    { day: 'Mon', score: 82 },
    { day: 'Tue', score: 88 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 90 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 70 },
    { day: 'Sun', score: 78 },
  ]
};

const FocusMetrics: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiActivity} boxSize={6} color="purple.500" />
                  <StatLabel>Focus Score</StatLabel>
                </HStack>
                <StatNumber>{MOCK_FOCUS_DATA.averageFocusScore}%</StatNumber>
                <StatHelpText>Average focus level</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiClock} boxSize={6} color="blue.500" />
                  <StatLabel>Focused Hours</StatLabel>
                </HStack>
                <StatNumber>{MOCK_FOCUS_DATA.totalFocusedHours}h</StatNumber>
                <StatHelpText>This month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiSun} boxSize={6} color="orange.500" />
                  <StatLabel>Peak Performance</StatLabel>
                </HStack>
                <StatNumber>{MOCK_FOCUS_DATA.bestTimeOfDay}</StatNumber>
                <StatHelpText>Most productive time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiTrendingUp} boxSize={6} color="green.500" />
                  <StatLabel>Weekly Trend</StatLabel>
                </HStack>
                <StatNumber>+5%</StatNumber>
                <StatHelpText>Focus improvement</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>Daily Productive Hours</Heading>
              <SimpleGrid columns={3} spacing={4}>
                {MOCK_FOCUS_DATA.productiveHours.map((hour) => (
                  <VStack key={hour.hour}>
                    <CircularProgress 
                      value={hour.score} 
                      color="purple.400"
                      size="80px"
                    >
                      <CircularProgressLabel>{hour.score}%</CircularProgressLabel>
                    </CircularProgress>
                    <Text color={textColor}>{hour.hour}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>Weekly Focus Trend</Heading>
              <SimpleGrid columns={7} spacing={4}>
                {MOCK_FOCUS_DATA.weeklyFocusTrend.map((day) => (
                  <VStack key={day.day}>
                    <CircularProgress 
                      value={day.score} 
                      color="blue.400"
                      size="80px"
                    >
                      <CircularProgressLabel>{day.score}%</CircularProgressLabel>
                    </CircularProgress>
                    <Text color={textColor}>{day.day}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default FocusMetrics;
