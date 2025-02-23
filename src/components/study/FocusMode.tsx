import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Progress,
  useColorModeValue,
  IconButton,
  Badge,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FiVolume2, FiVolumeX, FiPause, FiPlay } from 'react-icons/fi';

export default function FocusMode() {
  const [isActive, setIsActive] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [focusTime, setFocusTime] = React.useState(0);
  const [distractions, setDistractions] = React.useState(0);

  React.useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        setFocusTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleDistraction = () => {
    setDistractions(prev => prev + 1);
  };

  const focusScore = Math.max(0, 100 - (distractions * 5));

  return (
    <Card>
      <CardBody>
        <VStack spacing={4}>
          <HStack justify="space-between" w="full">
            <Text fontSize="lg" fontWeight="bold">Focus Mode</Text>
            <Badge colorScheme={isActive ? 'green' : 'gray'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </HStack>

          <Progress 
            value={focusScore} 
            size="lg" 
            colorScheme={focusScore > 70 ? 'green' : focusScore > 40 ? 'yellow' : 'red'} 
            w="full" 
          />

          <HStack spacing={4}>
            <VStack align="start">
              <Text color={useColorModeValue('gray.600', 'gray.400')}>Focus Score</Text>
              <Text fontSize="2xl" fontWeight="bold">{focusScore}%</Text>
            </VStack>
            <VStack align="start">
              <Text color={useColorModeValue('gray.600', 'gray.400')}>Time Focused</Text>
              <Text fontSize="2xl" fontWeight="bold">
                {Math.floor(focusTime / 60)}:{(focusTime % 60).toString().padStart(2, '0')}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={4}>
            <Button
              leftIcon={isActive ? <FiPause /> : <FiPlay />}
              colorScheme={isActive ? 'red' : 'green'}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Pause' : 'Start Focus'}
            </Button>
            <IconButton
              aria-label="Toggle sound"
              icon={isMuted ? <FiVolumeX /> : <FiVolume2 />}
              onClick={() => setIsMuted(!isMuted)}
            />
            {isActive && (
              <Button colorScheme="orange" variant="ghost" onClick={handleDistraction}>
                Report Distraction
              </Button>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}