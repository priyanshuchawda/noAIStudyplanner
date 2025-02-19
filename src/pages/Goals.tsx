import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Progress,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import CreateGoalModal from '../components/goals/CreateGoalModal';
import EditGoalModal from '../components/goals/EditGoalModal';
import UpdateProgressModal from '../components/goals/UpdateProgressModal';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  deadline: string;
}

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Complete Calculus Course',
    description: 'Finish all chapters and practice exercises',
    progress: 65,
    target: 100,
    unit: 'chapters',
    deadline: '2024-03-15',
  },
  {
    id: '2',
    title: 'Read Physics Textbook',
    description: 'Cover fundamental concepts and theories',
    progress: 30,
    target: 500,
    unit: 'pages',
    deadline: '2024-03-20',
  },
  {
    id: '3',
    title: 'Programming Projects',
    description: 'Complete 5 personal projects',
    progress: 2,
    target: 5,
    unit: 'projects',
    deadline: '2024-04-01',
  },
];

function GoalCard({ goal, onEdit, onUpdateProgress, onDelete }: { 
  goal: Goal; 
  onEdit: (goal: Goal) => void;
  onUpdateProgress: (goal: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const progressPercent = (goal.progress / goal.target) * 100;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md">{goal.title}</Heading>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<SettingsIcon />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem onClick={() => onEdit(goal)}>Edit Goal</MenuItem>
            <MenuItem onClick={() => onUpdateProgress(goal)}>
              Update Progress
            </MenuItem>
            <MenuItem color="red.500" onClick={() => onDelete(goal.id)}>
              Delete Goal
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <Text color="gray.500" mb={4}>
        {goal.description}
      </Text>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="medium">
            Progress
          </Text>
          <Text fontSize="sm" color="gray.500">
            {goal.progress} / {goal.target} {goal.unit}
          </Text>
        </HStack>
        <Progress
          value={progressPercent}
          size="sm"
          colorScheme="blue"
          borderRadius="full"
        />
        <Text fontSize="sm" color="gray.500">
          Deadline: {new Date(goal.deadline).toLocaleDateString()}
        </Text>
      </VStack>
    </Box>
  );
}

export default function Goals() {
  const createGoalModal = useDisclosure();
  const editGoalModal = useDisclosure();
  const progressModal = useDisclosure();
  
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleCreateGoal = (newGoal: Goal) => {
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    editGoalModal.onOpen();
  };

  const handleUpdateProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    progressModal.onOpen();
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const handleSaveEdit = (updatedGoal: Goal) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
  };

  const handleSaveProgress = (id: string, progress: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, progress } : goal
      )
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Goals</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={createGoalModal.onOpen}>
          Add New Goal
        </Button>
      </HStack>

      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        {goals.map((goal) => (
          <GridItem key={goal.id} colSpan={{ base: 12, md: 6, lg: 4 }}>
            <GoalCard
              goal={goal}
              onEdit={handleEditGoal}
              onUpdateProgress={handleUpdateProgress}
              onDelete={handleDeleteGoal}
            />
          </GridItem>
        ))}
      </Grid>

      <CreateGoalModal
        isOpen={createGoalModal.isOpen}
        onClose={createGoalModal.onClose}
        onCreateGoal={handleCreateGoal}
      />

      {selectedGoal && (
        <>
          <EditGoalModal
            isOpen={editGoalModal.isOpen}
            onClose={editGoalModal.onClose}
            onUpdateGoal={handleSaveEdit}
            goal={selectedGoal}
          />
          <UpdateProgressModal
            isOpen={progressModal.isOpen}
            onClose={progressModal.onClose}
            onUpdateProgress={handleSaveProgress}
            goal={selectedGoal}
          />
        </>
      )}
    </VStack>
  );
}
