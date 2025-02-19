import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

interface StreamingMessageProps {
  message: string;
  speed?: number;
}

export default function StreamingMessage({
  message = '',
  speed = 30,
}: StreamingMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    if (!message) {
      setDisplayedMessage('');
      setIsComplete(true);
      return;
    }

    let currentIndex = 0;
    const messageLength = message.length;

    const streamInterval = setInterval(() => {
      if (currentIndex < messageLength) {
        setDisplayedMessage(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(streamInterval);
      }
    }, speed);

    return () => clearInterval(streamInterval);
  }, [message, speed]);

  if (!message) {
    return null;
  }

  return (
    <Box
      className="markdown-body"
      bg={bgColor}
      p={4}
      borderRadius="lg"
      whiteSpace="pre-wrap"
    >
      {isComplete ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock
                  language={match[1]}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            p: ({ children }) => <Text mb={2}>{children}</Text>,
            h1: ({ children }) => (
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {children}
              </Text>
            ),
            h2: ({ children }) => (
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {children}
              </Text>
            ),
            h3: ({ children }) => (
              <Text fontSize="md" fontWeight="bold" mb={2}>
                {children}
              </Text>
            ),
            ul: ({ children }) => (
              <Box as="ul" pl={4} mb={2}>
                {children}
              </Box>
            ),
            ol: ({ children }) => (
              <Box as="ol" pl={4} mb={2}>
                {children}
              </Box>
            ),
            li: ({ children }) => <Box as="li" mb={1}>{children}</Box>,
          }}
        >
          {message}
        </ReactMarkdown>
      ) : (
        <Text>{displayedMessage}</Text>
      )}
    </Box>
  );
}
