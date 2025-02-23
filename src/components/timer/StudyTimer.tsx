import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  useToast,
  Select,
  Container,
  Heading,
  Card,
  CardBody,
  IconButton,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { FiPlay, FiPause } from 'react-icons/fi';
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../store/AuthContext';

interface TimerSession {
  duration: number;
  subject: string;
  timestamp: string;
  completed: boolean;
}

const StudyTimer: React.FC = () => {
  const [time, setTime] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const toast = useToast();
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science'];
  const timerPresets = [
    { label: '25 minutes', value: 25 * 60 },
    { label: '45 minutes', value: 45 * 60 },
    { label: '60 minutes', value: 60 * 60 },
  ];

  const handleTimerComplete = useCallback(async () => {
    setIsActive(false);
    const newSession: TimerSession = {
      duration: 25 * 60 - time,
      subject,
      timestamp: new Date().toISOString(),
      completed: true,
    };

    setSessions((prev) => [...prev, newSession]);

    if (user) {
      try {
        await updateDoc(doc(db, 'profiles', user.uid), {
          studySessions: arrayUnion(newSession),
        });
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }

    toast({
      title: 'Study Session Complete!',
      description: `You've completed a ${formatTime(25 * 60 - time)} study session for ${subject}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play();
  }, [time, subject, user, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, handleTimerComplete]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!subject) {
      toast({
        title: 'Select a Subject',
        description: 'Please select a subject before starting the timer',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
  };

  const handlePresetChange = (value: number) => {
    setIsActive(false);
    setTime(value);
  };

  const calculateTotalStudyTime = useCallback(() => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  }, [sessions]);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Card w="full" bg={cardBg}>
          <CardBody>
            <VStack spacing={6}>
              <Heading size="lg">Study Timer</Heading>
              
              <HStack spacing={4} w="full">
                <Select
                  placeholder="Select Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </Select>
                
                <Select
                  value={time}
                  onChange={(e) => handlePresetChange(Number(e.target.value))}
                >
                  {timerPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </Select>
              </HStack>

              <Box
                w="full"
                h="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Text fontSize="6xl" fontWeight="bold">
                  {formatTime(time)}
                </Text>
                <Progress
                  value={(time / (25 * 60)) * 100}
                  size="sm"
                  colorScheme="blue"
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                />
              </Box>

              <HStack spacing={4}>
                <IconButton
                  aria-label={isActive ? 'Pause Timer' : 'Start Timer'}
                  icon={isActive ? <FiPause /> : <FiPlay />}
                  onClick={toggleTimer}
                  colorScheme={isActive ? 'red' : 'green'}
                  size="lg"
                />
                <IconButton
                  aria-label="Reset Timer"
                  icon={<RepeatIcon />}
                  onClick={resetTimer}
                  size="lg"
                />
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card w="full" bg={cardBg}>
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Study Statistics</Heading>
              <HStack spacing={8} w="full" justify="center">
                <Stat>
                  <StatLabel>Total Sessions</StatLabel>
                  <StatNumber>{sessions.length}</StatNumber>
                  <StatHelpText>Completed Sessions</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Total Study Time</StatLabel>
                  <StatNumber>{formatTime(calculateTotalStudyTime())}</StatNumber>
                  <StatHelpText>Hours of Focus</StatHelpText>
                </Stat>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card w="full" bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Recent Sessions</Heading>
              {sessions.slice(-5).reverse().map((session, index) => (
                <HStack key={index} justify="space-between" p={2} borderRadius="md" borderWidth={1}>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{session.subject}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(session.timestamp).toLocaleString()}
                    </Text>
                  </VStack>
                  <Badge colorScheme="green">
                    {formatTime(session.duration)}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default StudyTimer;
