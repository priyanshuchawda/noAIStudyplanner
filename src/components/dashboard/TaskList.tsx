import React, { useCallback, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useColorModeValue,
  HStack,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { useTaskContext } from '../../store/TaskContext';
import { Task } from '../../types/task';
import CreateTaskModal from '../tasks/CreateTaskModal';

export default function TaskList() {
  const { state, dispatch } = useTaskContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(state.tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update task order
    items.forEach((task, index) => {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, order: index },
      });
    });
  }, [state.tasks, dispatch]);

  const handleStatusChange = useCallback((taskId: string, status: Task['status']) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, status },
      });
    }
  }, [state.tasks, dispatch]);

  const handleDeleteTask = useCallback((taskId: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: taskId,
    });
  }, [dispatch]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      default:
        return 'green';
    }
  };

  const sortedTasks = [...state.tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return (a.order || 0) - (b.order || 0);
  });

  const renderDraggableTask = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bg={bgColor}
          p={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={snapshot.isDragging ? 'lg' : 'none'}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="medium">{task.title}</Text>
              <Text fontSize="sm" color="gray.500">
                {task.description}
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
                <Badge colorScheme={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </HStack>
            </VStack>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem onClick={() => handleStatusChange(task.id, 'todo')}>
                  Mark as Todo
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                  Mark as In Progress
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                  Mark as Completed
                </MenuItem>
                <MenuItem onClick={() => handleDeleteTask(task.id)} color="red.500">
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      )}
    </Draggable>
  );

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Tasks
        </Text>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Task
        </Button>
      </HStack>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks" mode="standard" type="TASK">
          {(provided) => (
            <VStack
              {...provided.droppableProps}
              ref={provided.innerRef}
              spacing={3}
              align="stretch"
            >
              {sortedTasks.map((task, index) => renderDraggableTask(task, index))}
              {provided.placeholder}
            </VStack>
          )}
        </Droppable>
      </DragDropContext>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
}
