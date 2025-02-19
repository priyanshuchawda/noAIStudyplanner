import React from 'react';
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { FiRepeat, FiBell } from 'react-icons/fi';
import DraggableEvent from './DraggableEvent';
import { CalendarEvent } from './Calendar';
import { isSameDay } from 'date-fns';

interface DroppableDayProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onEventClick?: (event: CalendarEvent) => void;
}

const DroppableDay: React.FC<DroppableDayProps> = ({
  date,
  events = [],
  isCurrentMonth = false,
  onEventClick = () => {},
}) => {
  const isToday = isSameDay(date, new Date());
  const dayBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const bg = isCurrentMonth ? dayBg : useColorModeValue('gray.100', 'gray.700');

  const dayId = `day-${date.toISOString().split('T')[0]}`;

  return (
    <Box
      p={2}
      borderBottom="1px solid"
      borderRight="1px solid"
      borderColor={borderColor}
      opacity={isCurrentMonth ? 1 : 0.3}
      minH="100px"
      position="relative"
    >
      <Text fontSize="sm" mb={2}>
        {date.getDate()}
      </Text>

      <Droppable droppableId={dayId}>
        {(provided, snapshot) => (
          <VStack
            ref={provided.innerRef}
            align="stretch"
            spacing={1}
            minH="60px"
            bg={snapshot.isDraggingOver ? 'gray.50' : bg}
            _dark={{
              bg: snapshot.isDraggingOver ? 'gray.600' : bg,
            }}
            borderRadius="md"
            transition="background-color 0.2s"
            {...provided.droppableProps}
          >
            {events.map((event, index) => (
              <Box key={event.id} onClick={() => onEventClick?.(event)}>
                <DraggableEvent event={event} index={index} />
              </Box>
            ))}
            {provided.placeholder}
          </VStack>
        )}
      </Droppable>

      {events.length > 2 && (
        <Popover>
          <PopoverTrigger>
            <Text
              fontSize="xs"
              color="blue.500"
              cursor="pointer"
              mt={1}
              _hover={{ textDecoration: 'underline' }}
            >
              +{events.length - 2} more
            </Text>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>All Events</PopoverHeader>
            <PopoverBody>
              <VStack align="stretch" spacing={2}>
                {events.map((event) => (
                  <Box
                    key={event.id}
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                    cursor="pointer"
                    onClick={() => onEventClick?.(event)}
                    _hover={{ bg: 'gray.50' }}
                    _dark={{ _hover: { bg: 'gray.600' } }}
                  >
                    <Text fontWeight="bold">{event.title}</Text>
                    <HStack spacing={2} mt={1}>
                      <Badge>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      {event.recurringPattern && (
                        <FiRepeat title="Recurring event" />
                      )}
                      {event.reminder && <FiBell title="Has reminder" />}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Box>
  );
};

export default DroppableDay;
