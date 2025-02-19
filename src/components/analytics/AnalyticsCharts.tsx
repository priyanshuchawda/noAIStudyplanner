import {
  Box,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  deadline: string;
}

interface AnalyticsChartsProps {
  tasks: Task[];
  goals: Goal[];
  studySessionsData: {
    date: string;
    duration: number;
    focusScore: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsCharts({
  tasks,
  goals,
  studySessionsData,
}: AnalyticsChartsProps) {
  const [timeRange, setTimeRange] = useState('week');
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  const calculateTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => new Date(t.dueDate) < new Date() && !t.completed
    ).length;
    
    return {
      total,
      completed,
      overdue,
      completionRate: total ? (completed / total) * 100 : 0,
    };
  };

  const calculateGoalProgress = () => {
    return goals.map((goal) => ({
      name: goal.title,
      value: (goal.progress / goal.target) * 100,
    }));
  };

  const calculateProductivityTrend = () => {
    return studySessionsData.map((session) => ({
      date: new Date(session.date).toLocaleDateString(),
      duration: session.duration / 60, // Convert to hours
      focusScore: session.focusScore,
    }));
  };

  const calculateCategoryDistribution = () => {
    const distribution = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const taskStats = calculateTaskStats();
  const goalProgress = calculateGoalProgress();
  const productivityTrend = calculateProductivityTrend();
  const categoryDistribution = calculateCategoryDistribution();

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      {/* Task Completion Stats */}
      <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <Stat>
            <StatLabel>Task Completion Rate</StatLabel>
            <StatNumber>{taskStats.completionRate.toFixed(1)}%</StatNumber>
            <Progress
              value={taskStats.completionRate}
              size="sm"
              colorScheme="green"
              mt={2}
            />
            <StatHelpText>
              <HStack spacing={4}>
                <Text>{taskStats.completed} Completed</Text>
                <Text>{taskStats.overdue} Overdue</Text>
              </HStack>
            </StatHelpText>
          </Stat>
        </Box>
      </GridItem>

      {/* Study Time Trend */}
      <GridItem colSpan={{ base: 12, lg: 9 }}>
        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          h="full"
        >
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="medium">
                Productivity Trend
              </Text>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                w="150px"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </Select>
            </HStack>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="duration"
                    stroke="#8884d8"
                    name="Study Hours"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="focusScore"
                    stroke="#82ca9d"
                    name="Focus Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </VStack>
        </Box>
      </GridItem>

      {/* Goal Progress */}
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          h="full"
        >
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            Goal Progress
          </Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </GridItem>

      {/* Category Distribution */}
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          h="full"
        >
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            Task Categories
          </Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </GridItem>
    </Grid>
  );
}
