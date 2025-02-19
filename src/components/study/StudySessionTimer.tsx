import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Progress,
  useColorModeValue,
  Icon,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { FiPlay, FiPause, FiSkipForward, FiRefreshCcw } from 'react-icons/fi';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'work' | 'break';
  cycles: number;
}

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds
const CYCLES_BEFORE_LONG_BREAK = 4;

export default function StudySessionTimer() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: Math.floor(WORK_TIME / 60),
    seconds: 0,
    isRunning: false,
    mode: 'work',
    cycles: 0,
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const resetTimer = useCallback(() => {
    const timeInSeconds = timer.mode === 'work' ? WORK_TIME : 
      (timer.cycles % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK_TIME : BREAK_TIME);
    setTimer(prev => ({
      ...prev,
      minutes: Math.floor(timeInSeconds / 60),
      seconds: 0,
      isRunning: false,
    }));
  }, [timer.mode, timer.cycles]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const skipPhase = () => {
    const newMode = timer.mode === 'work' ? 'break' : 'work';
    const newCycles = timer.mode === 'break' ? timer.cycles + 1 : timer.cycles;
    
    setTimer(prev => ({
      ...prev,
      mode: newMode,
      cycles: newCycles,
      isRunning: false,
    }));
    
    resetTimer();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        if (timer.minutes === 0 && timer.seconds === 0) {
          // Time's up
          const notification = timer.mode === 'work' 
            ? "Time for a break!" 
            : "Break's over! Time to work!";
          
          toast({
            title: notification,
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          
          skipPhase();
        } else {
          setTimer(prev => {
            const totalSeconds = prev.minutes * 60 + prev.seconds - 1;
            return {
              ...prev,
              minutes: Math.floor(totalSeconds / 60),
              seconds: totalSeconds % 60,
            };
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.minutes, timer.seconds, toast]);

  const progress = () => {
    const currentTime = timer.minutes * 60 + timer.seconds;
    const totalTime = timer.mode === 'work' ? WORK_TIME : 
      (timer.cycles % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK_TIME : BREAK_TIME);
    return ((totalTime - currentTime) / totalTime) * 100;
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={4}>
        <HStack justify="space-between" width="100%">
          <Text fontSize="lg" fontWeight="bold">
            Pomodoro Timer
          </Text>
          <Badge
            colorScheme={timer.mode === 'work' ? 'green' : 'blue'}
          >
            {timer.mode === 'work' ? 'Work Time' : 'Break Time'}
          </Badge>
        </HStack>

        <Text fontSize="4xl" fontWeight="bold">
          {String(timer.minutes).padStart(2, '0')}:
          {String(timer.seconds).padStart(2, '0')}
        </Text>

        <Progress
          value={progress()}
          width="100%"
          colorScheme={timer.mode === 'work' ? 'green' : 'blue'}
          size="sm"
          borderRadius="full"
        />

        <HStack spacing={4}>
          <Button
            onClick={toggleTimer}
            colorScheme={timer.isRunning ? 'red' : 'green'}
            leftIcon={<Icon as={timer.isRunning ? FiPause : FiPlay} />}
          >
            {timer.isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={skipPhase}
            colorScheme="gray"
            leftIcon={<Icon as={FiSkipForward} />}
          >
            Skip
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="ghost"
            leftIcon={<Icon as={FiRefreshCcw} />}
          >
            Reset
          </Button>
        </HStack>

        <Text fontSize="sm" color="gray.500">
          Completed Cycles: {timer.cycles}
        </Text>
      </VStack>
    </Box>
  );
}
