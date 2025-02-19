import React from 'react';
import {
  Box,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiBookOpen, FiCheck, FiTarget, FiTool } from 'react-icons/fi';

interface SubjectTip {
  category: string;
  tips: string[];
  icon: typeof FiBookOpen;
}

interface Subject {
  name: string;
  tips: SubjectTip[];
}

const subjectTipsData: Subject[] = [
  {
    name: 'Mathematics',
    tips: [
      {
        category: 'Problem Solving',
        icon: FiTool,
        tips: [
          'Break complex problems into smaller steps',
          'Practice similar problems with different numbers',
          'Draw diagrams when possible',
          'Check your work by working backwards',
        ],
      },
      {
        category: 'Concept Understanding',
        icon: FiBookOpen,
        tips: [
          'Create mind maps for related concepts',
          'Try to explain concepts in your own words',
          'Look for real-world applications',
          'Use online visualization tools',
        ],
      },
      {
        category: 'Exam Preparation',
        icon: FiTarget,
        tips: [
          'Time yourself while solving problems',
          'Review common mistake patterns',
          'Practice with past exam questions',
          'Create formula sheets for quick reference',
        ],
      },
    ],
  },
  {
    name: 'Physics',
    tips: [
      {
        category: 'Theory Understanding',
        icon: FiBookOpen,
        tips: [
          'Connect concepts to everyday phenomena',
          'Watch video demonstrations',
          'Create concept summaries',
          'Use analogies to understand complex ideas',
        ],
      },
      {
        category: 'Problem Solving',
        icon: FiTool,
        tips: [
          'List given information and unknowns',
          'Draw free body diagrams',
          'Write down relevant formulas',
          'Check units throughout calculations',
        ],
      },
      {
        category: 'Lab Work',
        icon: FiTarget,
        tips: [
          'Review procedures before experiments',
          'Take detailed observations',
          'Understand error analysis',
          'Practice data visualization',
        ],
      },
    ],
  },
  {
    name: 'Chemistry',
    tips: [
      {
        category: 'Memorization',
        icon: FiBookOpen,
        tips: [
          'Use mnemonics for periodic table trends',
          'Create flashcards for reactions',
          'Draw molecular structures',
          'Practice naming compounds',
        ],
      },
      {
        category: 'Lab Safety',
        icon: FiTool,
        tips: [
          'Always wear safety equipment',
          'Read chemical labels carefully',
          'Know emergency procedures',
          'Keep workspace clean and organized',
        ],
      },
      {
        category: 'Calculations',
        icon: FiTarget,
        tips: [
          'Double-check stoichiometry',
          'Use dimensional analysis',
          'Maintain a balanced equation',
          'Verify reasonable answers',
        ],
      },
    ],
  },
];

export default function SubjectTips() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Study Tips by Subject
      </Text>
      
      <Accordion allowMultiple>
        {subjectTipsData.map((subject) => (
          <AccordionItem key={subject.name} border="none" mb={2}>
            <AccordionButton
              bg={bgColor}
              _hover={{ bg: hoverBg }}
              borderRadius="md"
            >
              <Box flex="1" textAlign="left">
                <Text fontWeight="medium">{subject.name}</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            
            <AccordionPanel pb={4}>
              <VStack align="stretch" spacing={4}>
                {subject.tips.map((category) => (
                  <Box key={category.category}>
                    <HStack mb={2}>
                      <Icon as={category.icon} />
                      <Text fontWeight="medium">{category.category}</Text>
                    </HStack>
                    
                    <List spacing={2}>
                      {category.tips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FiCheck} color="green.500" />
                          {tip}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
