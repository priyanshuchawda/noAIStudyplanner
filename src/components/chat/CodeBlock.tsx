import { Box, Button, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const { hasCopied, onCopy } = useClipboard(code);
  const isDark = useColorModeValue(false, true);

  return (
    <Box position="relative" my={4}>
      <Button
        size="xs"
        position="absolute"
        top={2}
        right={2}
        onClick={onCopy}
        zIndex={1}
      >
        {hasCopied ? 'Copied!' : 'Copy'}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          padding: '2rem 1rem 1rem 1rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}
