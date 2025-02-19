import React from 'react';
import { VStack, Heading } from '@chakra-ui/react';
import Calendar from '../components/calendar/Calendar';
import { useTaskContext } from '../store/TaskContext';
import { Task } from '../types/task';

export default function CalendarPage() {
  const { state } = useTaskContext();

  // Convert tasks to calendar events
  const taskEvents = state.tasks.map((task: Task) => ({
    id: task.id,
    title: task.title,
    date: new Date(task.dueDate),
    type: 'task' as const,
    priority: task.priority,
  }));

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Calendar</Heading>
      <Calendar events={taskEvents} />
    </VStack>
  );
}
