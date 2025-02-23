import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

interface LeaderboardUser {
  id: number;
  name: string;
  score: number;
  rank: number;
}

const mockUsers: LeaderboardUser[] = [
  { id: 1, name: 'Priyanshu Chawda', score: 2840, rank: 1 },
  { id: 2, name: 'Aditya Gayal', score: 2720, rank: 2 },
  { id: 3, name: 'Shruti Agarwal', score: 2650, rank: 3 },
  { id: 4, name: 'Aryan Babel', score: 2540, rank: 4 },
  { id: 5, name: 'Ariv Sharma', score: 2480, rank: 5 },
];

export default function Leaderboard() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const rowBgColor = useColorModeValue('gray.50', 'gray.600');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Card w="full" bg={bgColor}>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Leaderboard</Heading>
          
          {mockUsers.map((user) => (
            <HStack 
              key={user.id} 
              p={3} 
              bg={rowBgColor}
              borderRadius="lg"
              spacing={4}
            >
              <Text fontWeight="bold" minW="20px">
                #{user.rank}
              </Text>
              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="medium">{user.name}</Text>
                <Text fontSize="sm" color={subTextColor}>
                  {user.score} XP
                </Text>
              </VStack>
              {user.rank === 1 && (
                <Badge colorScheme="yellow">👑 Leader</Badge>
              )}
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
}