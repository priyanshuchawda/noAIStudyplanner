import {
  Box,
  Flex,
  Button,
  useColorMode,
  Heading,
  IconButton,
  useColorModeValue,
  Container,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, BellIcon } from '@chakra-ui/icons';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      py={4}
      px={8}
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
      position="sticky"
      top={0}
      zIndex={1000}
      h="72px"
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Heading size="md" color={useColorModeValue('blue.600', 'blue.200')}>
            ProductivityHub
          </Heading>
          <HStack spacing={4}>
            <IconButton
              aria-label="Notifications"
              icon={<BellIcon />}
              variant="ghost"
              fontSize="20px"
            />
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                p={0}
              >
                <Avatar size="sm" name="User Name" />
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
