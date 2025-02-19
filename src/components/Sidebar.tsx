import {
  Box,
  VStack,
  Button,
  useColorModeValue,
  Icon,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiTarget,
  FiBarChart2,
  FiSettings,
  FiMessageCircle,
  FiCalendar,
} from 'react-icons/fi';

interface NavItem {
  label: string;
  icon: any;
  to: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, to: '/' },
  { label: 'Goals', icon: FiTarget, to: '/goals' },
  { label: 'Calendar', icon: FiCalendar, to: '/calendar' },
  { label: 'Analytics', icon: FiBarChart2, to: '/analytics' },
  { label: 'Chat', icon: FiMessageCircle, to: '/chat' },
  { label: 'Settings', icon: FiSettings, to: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      pos="fixed"
      h="calc(100vh - 4rem)"
      top="4rem"
      left="0"
      w="64"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      py={6}
    >
      <VStack spacing={2} align="stretch" px={4}>
        {navItems.map((item) => (
          <Button
            key={item.to}
            as={RouterLink}
            to={item.to}
            variant={location.pathname === item.to ? 'solid' : 'ghost'}
            colorScheme={location.pathname === item.to ? 'blue' : undefined}
            justifyContent="flex-start"
            leftIcon={<Icon as={item.icon} boxSize={5} />}
            size="lg"
            w="full"
          >
            {item.label}
          </Button>
        ))}
      </VStack>
    </Box>
  );
}
