import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  Text,
  HStack,
  useColorModeValue,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { FiPlay, FiPause, FiRefreshCw, FiSkipForward } from 'react-icons/fi';

type TimerMode = 'work' | 'break';

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const toast = useToast();

  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const total = mode === 'work' ? workTime : breakTime;
    return ((total - time) / total) * 100;
  };

  const resetTimer = useCallback(() => {
    setTime(mode === 'work' ? workTime : breakTime);
    setIsActive(false);
  }, [mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const switchMode = () => {
    setMode(mode === 'work' ? 'break' : 'work');
    setTime(mode === 'work' ? breakTime : workTime);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      toast({
        title: `${mode === 'work' ? 'Work' : 'Break'} session completed!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, mode]);

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={6}>
        <Text fontSize="xl" fontWeight="bold">
          {mode === 'work' ? 'Work Session' : 'Break Time'}
        </Text>
        <Box position="relative">
          <CircularProgress
            value={calculateProgress()}
            size="200px"
            thickness="4px"
            color={mode === 'work' ? 'blue.400' : 'green.400'}
          >
            <CircularProgressLabel fontSize="3xl" fontWeight="bold">
              {formatTime(time)}
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
        <HStack spacing={4}>
          <IconButton
            aria-label="Reset timer"
            icon={<FiRefreshCw />}
            onClick={resetTimer}
            variant="ghost"
          />
          <IconButton
            aria-label={isActive ? 'Pause timer' : 'Start timer'}
            icon={isActive ? <FiPause /> : <FiPlay />}
            onClick={toggleTimer}
            colorScheme={mode === 'work' ? 'blue' : 'green'}
            size="lg"
          />
          <IconButton
            aria-label="Switch mode"
            icon={<FiSkipForward />}
            onClick={switchMode}
            variant="ghost"
          />
        </HStack>
        <Text fontSize="sm" color="gray.500">
          {mode === 'work'
            ? 'Focus on your work! Take a break soon.'
            : 'Time to recharge! New work session coming up.'}
        </Text>
      </VStack>
    </Box>
  );
}
