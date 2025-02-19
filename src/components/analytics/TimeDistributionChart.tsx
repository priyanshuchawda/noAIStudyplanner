import {
  Box,
  Text,
  useColorModeValue,
  Select,
  HStack,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

interface TimeData {
  hour: string;
  tasks: number;
  goals: number;
}

interface TimeDistributionChartProps {
  data: TimeData[];
}

export default function TimeDistributionChart({
  data,
}: TimeDistributionChartProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week'>('day');
  const chartColor = useColorModeValue('blue.500', 'blue.200');
  const gridColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={4}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="medium">
          Time Distribution
        </Text>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'day' | 'week')}
          w="120px"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
        </Select>
      </HStack>

      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" name="Tasks" fill={chartColor} />
            <Bar dataKey="goals" name="Goals" fill="orange" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
