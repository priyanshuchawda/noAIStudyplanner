import {
  VStack,
  Box,
  Text,
  Icon,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FiBook, FiClock, FiCalendar } from 'react-icons/fi';
import { Conversation } from '../../store/ChatContext';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const queryTypeIcons = {
  study: FiBook,
  homework: FiCalendar,
  timeManagement: FiClock,
};

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <VStack spacing={2} align="stretch">
      {conversations.map((conversation) => (
        <Box
          key={conversation.id}
          p={3}
          borderRadius="md"
          cursor="pointer"
          bg={conversation.id === activeId ? activeBg : 'transparent'}
          borderWidth="1px"
          borderColor={borderColor}
          _hover={{ bg: conversation.id === activeId ? activeBg : hoverBg }}
          onClick={() => onSelect(conversation.id)}
        >
          <HStack spacing={3}>
            <Icon
              as={queryTypeIcons[conversation.type]}
              color={conversation.id === activeId ? 'blue.500' : 'gray.500'}
            />
            <VStack spacing={0} align="start">
              <Text fontWeight="medium" fontSize="sm">
                {conversation.title || 'New Conversation'}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(conversation.lastUpdated).toLocaleDateString()}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ))}
      {conversations.length === 0 && (
        <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
          No conversations yet
        </Text>
      )}
    </VStack>
  );
}
