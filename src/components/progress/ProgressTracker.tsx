import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Progress,
  Card,
  CardBody,
  Select,
  Button,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../store/AuthContext';

interface SubjectProgress {
  subject: string;
  totalTopics: number;
  completedTopics: number;
  targetScore: number;
  currentScore: number;
  lastTestDate: string;
}

const ProgressTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectProgress[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');

  const subjectList = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science'];

  const [newProgress, setNewProgress] = useState<SubjectProgress>({
    subject: '',
    totalTopics: 0,
    completedTopics: 0,
    targetScore: 0,
    currentScore: 0,
    lastTestDate: new Date().toISOString(),
  });

  const calculateOverallProgress = () => {
    if (subjects.length === 0) return 0;
    const totalProgress = subjects.reduce((acc, subject) => {
      return acc + (subject.completedTopics / subject.totalTopics) * 100;
    }, 0);
    return totalProgress / subjects.length;
  };

  const calculateAverageScore = () => {
    if (subjects.length === 0) return 0;
    const totalScore = subjects.reduce((acc, subject) => acc + subject.currentScore, 0);
    return totalScore / subjects.length;
  };

  const handleAddProgress = async () => {
    if (!newProgress.subject || newProgress.totalTopics === 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const updatedSubjects = [...subjects, newProgress];
    setSubjects(updatedSubjects);

    if (user) {
      try {
        await updateDoc(doc(db, 'profiles', user.uid), {
          subjectProgress: updatedSubjects,
        });
        toast({
          title: 'Progress Added',
          status: 'success',
          duration: 2000,
        });
        onClose();
      } catch (error) {
        console.error('Error saving progress:', error);
        toast({
          title: 'Error Saving Progress',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const updateTopicProgress = async (subjectName: string, increment: boolean) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.subject === subjectName) {
        const completedTopics = increment
          ? Math.min(subject.completedTopics + 1, subject.totalTopics)
          : Math.max(subject.completedTopics - 1, 0);
        return { ...subject, completedTopics };
      }
      return subject;
    });

    setSubjects(updatedSubjects);

    if (user) {
      try {
        await updateDoc(doc(db, 'profiles', user.uid), {
          subjectProgress: updatedSubjects,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <Card w="full" bg={cardBg}>
          <CardBody>
            <VStack spacing={6}>
              <HStack w="full" justify="space-between">
                <Heading size="lg">Progress Tracker</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                  Add Subject
                </Button>
              </HStack>

              <Grid templateColumns="repeat(3, 1fr)" gap={6} w="full">
                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Overall Progress</StatLabel>
                        <StatNumber>{calculateOverallProgress().toFixed(1)}%</StatNumber>
                        <StatHelpText>Across all subjects</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Average Score</StatLabel>
                        <StatNumber>{calculateAverageScore().toFixed(1)}</StatNumber>
                        <StatHelpText>Current performance</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Total Subjects</StatLabel>
                        <StatNumber>{subjects.length}</StatNumber>
                        <StatHelpText>Being tracked</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        <VStack w="full" spacing={4} align="stretch">
          {subjects.map((subject) => (
            <Card key={subject.subject} bg={cardBg}>
              <CardBody>
                <VStack spacing={4}>
                  <HStack w="full" justify="space-between">
                    <Heading size="md">{subject.subject}</Heading>
                    <HStack>
                      <Button
                        size="sm"
                        onClick={() => updateTopicProgress(subject.subject, false)}
                      >
                        -
                      </Button>
                      <Text>
                        {subject.completedTopics} / {subject.totalTopics} Topics
                      </Text>
                      <Button
                        size="sm"
                        onClick={() => updateTopicProgress(subject.subject, true)}
                      >
                        +
                      </Button>
                    </HStack>
                  </HStack>

                  <Progress
                    value={(subject.completedTopics / subject.totalTopics) * 100}
                    w="full"
                    colorScheme="blue"
                    hasStripe
                  />

                  <HStack w="full" justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">Target Score</Text>
                      <Text fontWeight="bold">{subject.targetScore}</Text>
                    </Box>
                    <CircularProgress
                      value={subject.currentScore}
                      max={100}
                      color="green.400"
                      size="60px"
                    >
                      <CircularProgressLabel>
                        {subject.currentScore}
                      </CircularProgressLabel>
                    </CircularProgress>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Subject Progress</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    placeholder="Select subject"
                    value={newProgress.subject}
                    onChange={(e) => setNewProgress({ ...newProgress, subject: e.target.value })}
                  >
                    {subjectList.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Total Topics</FormLabel>
                  <NumberInput
                    min={1}
                    value={newProgress.totalTopics}
                    onChange={(value) => setNewProgress({ ...newProgress, totalTopics: parseInt(value) })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Target Score</FormLabel>
                  <NumberInput
                    min={0}
                    max={100}
                    value={newProgress.targetScore}
                    onChange={(value) => setNewProgress({ ...newProgress, targetScore: parseInt(value) })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Current Score</FormLabel>
                  <NumberInput
                    min={0}
                    max={100}
                    value={newProgress.currentScore}
                    onChange={(value) => setNewProgress({ ...newProgress, currentScore: parseInt(value) })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <Button colorScheme="blue" onClick={handleAddProgress} w="full">
                  Add Progress
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default ProgressTracker;
