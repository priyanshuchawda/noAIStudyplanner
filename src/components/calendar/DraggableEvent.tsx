import { Box, Text, Badge, useColorModeValue } from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { CalendarEvent } from './Calendar';

interface DraggableEventProps {
  event: CalendarEvent;
  index: number;
}

export default function DraggableEvent({ event, index }: DraggableEventProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const priorityColors = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  };

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bg={bgColor}
          p={2}
          mb={2}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
          boxShadow={snapshot.isDragging ? 'lg' : 'sm'}
          opacity={snapshot.isDragging ? 0.8 : 1}
          cursor="grab"
          _active={{ cursor: 'grabbing' }}
        >
          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
            {event.title}
          </Text>
          <Badge
            colorScheme={
              event.type === 'task'
                ? priorityColors[event.priority || 'medium']
                : 'blue'
            }
            size="sm"
            mt={1}
          >
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
        </Box>
      )}
    </Draggable>
  );
}
