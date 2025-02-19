import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: 'Mon', hours: 6.5 },
  { date: 'Tue', hours: 5.2 },
  { date: 'Wed', hours: 7.8 },
  { date: 'Thu', hours: 6.9 },
  { date: 'Fri', hours: 8.1 },
  { date: 'Sat', hours: 4.5 },
  { date: 'Sun', hours: 5.5 },
];

export default function StudyTimeChart() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tooltipBg = useColorModeValue('white', 'gray.700');
  const tooltipBorder = useColorModeValue('gray.200', 'gray.600');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={tooltipBg}
          p={2}
          border="1px solid"
          borderColor={tooltipBorder}
          borderRadius="md"
        >
          <Box fontWeight="bold">{label}</Box>
          <Box color="blue.500">{payload[0].value} hours</Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
      height="400px"
    >
      <Heading size="md" mb={4}>
        Study Time This Week
      </Heading>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3182CE" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: useColorModeValue('gray.600', 'gray.400') }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: useColorModeValue('gray.600', 'gray.400') }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#3182CE"
            fill="url(#colorHours)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
