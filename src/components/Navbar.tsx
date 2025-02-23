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
  Text,
  Spinner,
  Tooltip,
  Badge,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, BellIcon, AddIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notificationBgHover = useColorModeValue('gray.100', 'gray.700');

  // Mock notifications - replace with real data later
  const notifications = [
    { id: 1, title: 'Study session completed', message: 'Great job! You completed your study goal.' },
    { id: 2, title: 'New task reminder', message: 'Don\'t forget to review your notes.' },
    { id: 3, title: 'Weekly progress', message: 'Check out your study progress for this week.' },
  ];

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
          <HStack spacing={8}>
            <Heading size="md" color={useColorModeValue('blue.600', 'blue.200')}>
              StudyPlanner
            </Heading>
            {user && (
              <HStack spacing={2}>
                <Tooltip label="Quick Timer">
                  <IconButton
                    as={RouterLink}
                    to="/timer"
                    aria-label="Study Timer"
                    icon={<FiClock />}
                    variant="ghost"
                    colorScheme="blue"
                  />
                </Tooltip>
                <Tooltip label="Add Note">
                  <IconButton
                    as={RouterLink}
                    to="/notes"
                    aria-label="Add Note"
                    icon={<AddIcon />}
                    variant="ghost"
                    colorScheme="green"
                  />
                </Tooltip>
                <Tooltip label="View Progress">
                  <IconButton
                    as={RouterLink}
                    to="/progress"
                    aria-label="Progress"
                    icon={<FiTrendingUp />}
                    variant="ghost"
                    colorScheme="purple"
                  />
                </Tooltip>
              </HStack>
            )}
          </HStack>
          
          <HStack spacing={4}>
            {user && (
              <Popover isOpen={isOpen} onClose={onClose}>
                <PopoverTrigger>
                  <IconButton
                    aria-label="Notifications"
                    icon={
                      <>
                        <BellIcon />
                        <Badge
                          position="absolute"
                          top="-1"
                          right="-1"
                          colorScheme="red"
                          borderRadius="full"
                        >
                          {notifications.length}
                        </Badge>
                      </>
                    }
                    variant="ghost"
                    fontSize="20px"
                    onClick={onOpen}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight="semibold">Notifications</PopoverHeader>
                  <PopoverBody>
                    <VStack align="stretch" spacing={3}>
                      {notifications.map((notification) => (
                        <Box 
                          key={notification.id} 
                          p={2} 
                          _hover={{ bg: notificationBgHover }}
                          borderRadius="md"
                          cursor="pointer"
                        >
                          <Text fontWeight="medium">{notification.title}</Text>
                          <Text fontSize="sm" color="gray.500">{notification.message}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
            
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
            
            {loading ? (
              <Spinner size="sm" />
            ) : user ? (
              <Menu>
                <MenuButton>
                  <HStack>
                    <Avatar
                      size="sm"
                      src={user.photoURL || undefined}
                      name={user.displayName || 'User'}
                    />
                    <Text display={{ base: 'none', md: 'block' }}>
                      {user.displayName}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                  <MenuItem as={RouterLink} to="/notes">My Notes</MenuItem>
                  <MenuItem as={RouterLink} to="/progress">My Progress</MenuItem>
                  <MenuItem onClick={logout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                leftIcon={<FcGoogle />}
                onClick={signInWithGoogle}
                variant="outline"
                colorScheme="gray"
              >
                Sign in with Google
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
