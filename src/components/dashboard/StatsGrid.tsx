import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiClock, FiCheckCircle, FiTarget, FiTrendingUp } from 'react-icons/fi';

const stats = [
  {
    label: 'Study Hours',
    value: '32.5',
    change: '+12%',
    changeType: 'increase',
    icon: FiClock,
    helpText: 'This week',
  },
  {
    label: 'Tasks Completed',
    value: '24',
    change: '+8%',
    changeType: 'increase',
    icon: FiCheckCircle,
    helpText: 'This week',
  },
  {
    label: 'Goals Achieved',
    value: '5',
    change: '+2',
    changeType: 'increase',
    icon: FiTarget,
    helpText: 'This month',
  },
  {
    label: 'Productivity Score',
    value: '85',
    change: '+5%',
    changeType: 'increase',
    icon: FiTrendingUp,
    helpText: 'vs. last week',
  },
];

export default function StatsGrid() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
      {stats.map((stat) => (
        <Box
          key={stat.label}
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Stat>
            <Box display="flex" alignItems="center" mb={2}>
              <Icon
                as={stat.icon}
                w={6}
                h={6}
                mr={2}
                color={iconColor}
              />
              <StatLabel fontSize="sm" fontWeight="medium">
                {stat.label}
              </StatLabel>
            </Box>
            <StatNumber fontSize="2xl" fontWeight="bold">
              {stat.value}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={stat.changeType as 'increase' | 'decrease'} />
              {stat.change} {stat.helpText}
            </StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
}
