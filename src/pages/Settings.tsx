import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Text,
  useColorMode,
  Button,
  HStack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { useTheme } from '../store/ThemeContext';

const themeColors = [
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
  { label: 'Green', value: 'green' },
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Teal', value: 'teal' },
];

export default function Settings() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { primaryColor, setPrimaryColor } = useTheme();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Settings</Heading>

      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="md">Appearance</Heading>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Dark Mode</FormLabel>
            <Switch
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
              colorScheme={primaryColor}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Theme Color</FormLabel>
            <Select
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            >
              {themeColors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Heading size="md">Notifications</Heading>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Email Notifications</FormLabel>
            <Switch colorScheme={primaryColor} />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Push Notifications</FormLabel>
            <Switch colorScheme={primaryColor} />
          </FormControl>

          <Divider />

          <Heading size="md">Study Preferences</Heading>
          <FormControl>
            <FormLabel>Default Study Session Duration</FormLabel>
            <Select defaultValue="25">
              <option value="15">15 minutes</option>
              <option value="25">25 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Break Duration</FormLabel>
            <Select defaultValue="5">
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
            </Select>
          </FormControl>

          <Divider />

          <Heading size="md">Account</Heading>
          <Text color="gray.500">Connected as example@email.com</Text>
          <HStack spacing={4}>
            <Button variant="outline" colorScheme={primaryColor}>
              Change Password
            </Button>
            <Button colorScheme="red" variant="ghost">
              Sign Out
            </Button>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}
