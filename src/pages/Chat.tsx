import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Text,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { FiSend, FiPlus } from 'react-icons/fi';
import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import { useChatContext, generateResponse } from '../store/ChatContext';

export default function Chat() {
  const { state, dispatch } = useChatContext();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.activeConversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!state.activeConversation) {
      // Create a new conversation if none is active
      dispatch({
        type: 'CREATE_CONVERSATION',
        payload: {
          title: 'New Conversation',
          type: 'study',
        },
      });
    }

    // Send user message
    dispatch({
      type: 'SEND_MESSAGE',
      payload: {
        content: message,
        sender: 'user',
      },
    });

    setMessage('');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Get AI response
      const aiResponse = await generateResponse(
        message,
        state.activeConversation?.type || 'study'
      );

      // Send AI response
      dispatch({
        type: 'SEND_MESSAGE',
        payload: {
          content: aiResponse,
          sender: 'ai',
        },
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      dispatch({
        type: 'SEND_MESSAGE',
        payload: {
          content: 'Sorry, I encountered an error while processing your request.',
          sender: 'ai',
        },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <Flex h="calc(100vh - 80px)">
      {/* Sidebar */}
      <Box w="300px" borderRight="1px" borderColor={borderColor} p={4}>
        <VStack spacing={4} align="stretch">
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={() =>
              dispatch({
                type: 'CREATE_CONVERSATION',
                payload: {
                  title: 'New Conversation',
                  type: 'study',
                },
              })
            }
          >
            New Chat
          </Button>
          <Divider />
          <ConversationList
            conversations={state.conversations}
            activeId={state.activeConversation?.id || null}
            onSelect={(id) => dispatch({ type: 'LOAD_CONVERSATION', payload: id })}
          />
        </VStack>
      </Box>

      {/* Chat Area */}
      <Flex flex={1} direction="column" bg={bgColor}>
        {state.activeConversation ? (
          <>
            {/* Messages */}
            <VStack
              flex={1}
              spacing={4}
              p={4}
              overflowY="auto"
              align="stretch"
            >
              {state.activeConversation.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.content}
                  sender={msg.sender}
                />
              ))}
              {state.isLoading && (
                <Box alignSelf="flex-start">
                  <Spinner size="sm" mr={2} />
                  <Text display="inline">Thinking...</Text>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input Area */}
            <Box p={4} borderTop="1px" borderColor={borderColor}>
              <HStack spacing={2}>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={state.isLoading}
                />
                <IconButton
                  aria-label="Send message"
                  icon={<FiSend />}
                  colorScheme="blue"
                  onClick={handleSendMessage}
                  isLoading={state.isLoading}
                />
              </HStack>
            </Box>
          </>
        ) : (
          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={8}
            textAlign="center"
          >
            <Text fontSize="xl" mb={4}>
              Welcome to Study Assistant Chat
            </Text>
            <Text color="gray.500">
              Start a new conversation or select an existing one.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
