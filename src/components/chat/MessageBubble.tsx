import {
  Box,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Message } from '../../store/ChatContext';
import StreamingMessage from './StreamingMessage';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'ai';
}

export default function MessageBubble({ message, sender }: MessageBubbleProps) {
  const userBgColor = useColorModeValue('blue.500', 'blue.200');
  const userTextColor = useColorModeValue('white', 'gray.800');
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  const isUser = sender === 'user';
  const timestamp = new Date(message.timestamp);
  const timeString = timestamp.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <VStack
      align={isUser ? 'flex-end' : 'flex-start'}
      spacing={1}
      maxW="70%"
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
    >
      <Box
        bg={isUser ? userBgColor : 'transparent'}
        color={isUser ? userTextColor : 'inherit'}
        p={isUser ? 3 : 0}
        borderRadius="lg"
        width="100%"
      >
        {isUser ? (
          <Text>{message}</Text>
        ) : (
          <StreamingMessage message={message || ''} />
        )}
      </Box>
      <Text fontSize="xs" color={timeColor}>
        {timeString}
      </Text>
    </VStack>
  );
}
