import { Box, Container, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} display="flex" flexDir="column">
      <Navbar />
      <Flex flex="1" overflow="hidden">
        <Box
          w="250px"
          p={4}
          borderRight="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          h="calc(100vh - 72px)"
          position="sticky"
          top="72px"
        >
          <Sidebar />
        </Box>
        <Box flex="1" p={4} overflowY="auto">
          <Container maxW="container.xl" h="full">
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Box>
  );
}
