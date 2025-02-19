import {
  Box,
  Grid,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  useToast,
  useDisclosure,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FiRepeat, FiBell, FiMoreVertical } from 'react-icons/fi';
import { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import DroppableDay from './DroppableDay';
import RecurringEventModal, { RecurringEventPattern } from './RecurringEventModal';
import ReminderModal, { ReminderSettings } from './ReminderModal';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'goal';
  priority?: 'low' | 'medium' | 'high';
  recurringPattern?: RecurringEventPattern;
  reminder?: ReminderSettings;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventMove?: (event: CalendarEvent, newDate: Date) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
}

export default function Calendar({
  events,
  onEventMove,
  onEventUpdate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.600');
  const toast = useToast();

  const {
    isOpen: isRecurringOpen,
    onOpen: onRecurringOpen,
    onClose: onRecurringClose,
  } = useDisclosure();

  const {
    isOpen: isReminderOpen,
    onOpen: onReminderOpen,
    onClose: onReminderClose,
  } = useDisclosure();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const getEventsForDay = useCallback(
    (date: Date) => {
      return events.filter((event) => {
        if (event.recurringPattern) {
          // Handle recurring events based on pattern
          const { frequency, interval, daysOfWeek, endDate, occurrences } =
            event.recurringPattern;
          const eventStartDate = new Date(event.date);
          const diffTime = Math.abs(date.getTime() - eventStartDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Check if event has ended
          if (endDate && date > endDate) return false;
          if (
            occurrences &&
            Math.floor(diffDays / (interval * (frequency === 'weekly' ? 7 : 1))) >=
              occurrences
          )
            return false;

          switch (frequency) {
            case 'daily':
              return diffDays % interval === 0;
            case 'weekly':
              return (
                diffDays % (interval * 7) === 0 &&
                (!daysOfWeek || daysOfWeek.includes(date.getDay()))
              );
            case 'monthly':
              return (
                date.getDate() === eventStartDate.getDate() &&
                (date.getMonth() - eventStartDate.getMonth() + 
                  12 * (date.getFullYear() - eventStartDate.getFullYear())) %
                  interval ===
                  0
              );
            default:
              return false;
          }
        }

        // Regular events
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    },
    [events]
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceDate = new Date(source.droppableId.split('day-')[1]);
    const destinationDate = new Date(destination.droppableId.split('day-')[1]);

    if (
      sourceDate.getTime() === destinationDate.getTime() &&
      source.index === destination.index
    ) {
      return;
    }

    const event = events.find((e) => e.id === draggableId);
    if (!event) return;

    if (onEventMove) {
      onEventMove(event, destinationDate);
      toast({
        title: 'Event moved',
        description: `${event.title} moved to ${destinationDate.toLocaleDateString()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRecurringSave = (pattern: RecurringEventPattern) => {
    if (selectedEvent && onEventUpdate) {
      onEventUpdate({
        ...selectedEvent,
        recurringPattern: pattern,
      });
      toast({
        title: 'Recurring pattern set',
        description: `${selectedEvent.title} will now repeat ${pattern.frequency}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReminderSave = (settings: ReminderSettings) => {
    if (selectedEvent && onEventUpdate) {
      onEventUpdate({
        ...selectedEvent,
        reminder: settings,
      });
      toast({
        title: 'Reminder set',
        description: `Reminder set for ${selectedEvent.title}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        bg={bgColor}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
        overflow="hidden"
      >
        <VStack spacing={0}>
          <HStack
            w="full"
            justify="space-between"
            p={4}
            bg={headerBg}
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <IconButton
              aria-label="Previous month"
              icon={<ChevronLeftIcon />}
              onClick={prevMonth}
              variant="ghost"
            />
            <Text fontSize="lg" fontWeight="bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <IconButton
              aria-label="Next month"
              icon={<ChevronRightIcon />}
              onClick={nextMonth}
              variant="ghost"
            />
          </HStack>

          <Grid templateColumns="repeat(7, 1fr)" w="full" gap={0}>
            {weekDays.map((day) => (
              <Box
                key={day}
                p={2}
                textAlign="center"
                borderBottom="1px solid"
                borderColor={borderColor}
                bg={headerBg}
              >
                <Text fontSize="sm" fontWeight="medium">
                  {day}
                </Text>
              </Box>
            ))}

            {Array.from({ length: 42 }, (_, i) => {
              const day = i - firstDayOfMonth + 1;
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const isCurrentMonth = day > 0 && day <= daysInMonth;
              const dayEvents = isCurrentMonth ? getEventsForDay(date) : [];

              return (
                <DroppableDay
                  key={i}
                  date={date}
                  events={dayEvents}
                  isCurrentMonth={isCurrentMonth}
                  onEventClick={handleEventClick}
                />
              );
            })}
          </Grid>
        </VStack>
      </Box>

      {selectedEvent && (
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<FiMoreVertical />}
            size="sm"
            position="fixed"
            bottom={4}
            right={4}
          >
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<FiRepeat />}
              onClick={() => {
                setSelectedEvent(selectedEvent);
                onRecurringOpen();
              }}
            >
              Set Recurring Pattern
            </MenuItem>
            <MenuItem
              icon={<FiBell />}
              onClick={() => {
                setSelectedEvent(selectedEvent);
                onReminderOpen();
              }}
            >
              Set Reminder
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      <RecurringEventModal
        isOpen={isRecurringOpen}
        onClose={onRecurringClose}
        onSave={handleRecurringSave}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={onReminderClose}
        onSave={handleReminderSave}
        initialSettings={selectedEvent?.reminder}
      />
    </DragDropContext>
  );
}
