import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

interface StudyPattern {
  subject: string;
  timeSpent: number;
  efficiency: number;
  recommendations: string[];
}

interface StudyPatternInsightsProps {
  patterns: StudyPattern[];
}

export default function StudyPatternInsights({
  patterns,
}: StudyPatternInsightsProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'green';
    if (efficiency >= 60) return 'orange';
    return 'red';
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
    >
      <Text fontSize="lg" fontWeight="medium" mb={4}>
        Study Pattern Insights
      </Text>

      <Accordion allowMultiple>
        {patterns.map((pattern, index) => (
          <AccordionItem key={index} border="none">
            <AccordionButton px={0}>
              <Box flex="1">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium">{pattern.subject}</Text>
                  <HStack spacing={2}>
                    <Badge>{formatTime(pattern.timeSpent)}</Badge>
                    <Badge
                      colorScheme={getEfficiencyColor(pattern.efficiency)}
                    >
                      {pattern.efficiency}% Efficient
                    </Badge>
                    <AccordionIcon />
                  </HStack>
                </HStack>
                <Progress
                  value={pattern.efficiency}
                  colorScheme={getEfficiencyColor(pattern.efficiency)}
                  size="sm"
                  mt={2}
                />
              </Box>
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <VStack align="stretch" spacing={2}>
                <Text fontWeight="medium" color="gray.500" fontSize="sm">
                  Recommendations:
                </Text>
                {pattern.recommendations.map((rec, idx) => (
                  <Text key={idx} fontSize="sm">
                    • {rec}
                  </Text>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
