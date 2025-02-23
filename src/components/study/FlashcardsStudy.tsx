import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiRotateCw } from 'react-icons/fi';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  subject: string;
  lastReviewed?: Date;
  confidence: 1 | 2 | 3 | 4 | 5;
}

const mockFlashcards: Flashcard[] = [
  { id: 1, question: "What is Newton's First Law?", answer: "An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.", subject: "Physics", confidence: 3 },
  { id: 2, question: "What is a derivative?", answer: "The rate of change of a function with respect to a variable.", subject: "Mathematics", confidence: 4 },
  { id: 3, question: "What is photosynthesis?", answer: "The process by which plants convert light energy into chemical energy.", subject: "Biology", confidence: 2 },
];

export default function FlashcardsStudy() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [studiedCards, setStudiedCards] = React.useState<Set<number>>(new Set());

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardColor = useColorModeValue('gray.800', 'white');

  const currentCard = mockFlashcards[currentIndex];
  const progress = (studiedCards.size / mockFlashcards.length) * 100;

  const handleNext = () => {
    setStudiedCards(prev => new Set(prev.add(currentCard.id)));
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % mockFlashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + mockFlashcards.length) % mockFlashcards.length);
  };

  return (
    <Box p={4}>
      <VStack spacing={6}>
        <HStack justify="space-between" w="full">
          <Heading size="md">Flashcards</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            {currentIndex + 1} / {mockFlashcards.length}
          </Text>
        </HStack>

        <Progress value={progress} w="full" colorScheme="green" />

        <Card
          w="full"
          h="300px"
          bg={cardBg}
          color={cardColor}
          cursor="pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          position="relative"
          transform={`rotateY(${isFlipped ? '180deg' : '0'})`}
          transition="transform 0.6s"
          transformStyle="preserve-3d"
        >
          <CardBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={8}
            textAlign="center"
            backfaceVisibility="hidden"
          >
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="medium">
                {isFlipped ? currentCard.answer : currentCard.question}
              </Text>
              <Badge colorScheme="blue">{currentCard.subject}</Badge>
            </VStack>
          </CardBody>
        </Card>

        <HStack spacing={4}>
          <IconButton
            aria-label="Previous card"
            icon={<FiChevronLeft />}
            onClick={handlePrevious}
          />
          <Button
            rightIcon={<FiRotateCw />}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            Flip Card
          </Button>
          <IconButton
            aria-label="Next card"
            icon={<FiChevronRight />}
            onClick={handleNext}
          />
        </HStack>
      </VStack>
    </Box>
  );
}