import React, { useState } from 'react';
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Select,
  HStack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { FiMoreVertical, FiCalendar } from 'react-icons/fi';

// Mock data
const MOCK_SESSIONS = [
  {
    id: 1,
    subject: 'Mathematics',
    topic: 'Calculus',
    duration: 120,
    date: '2024-01-15',
    efficiency: 'high',
    notes: 'Covered derivatives and integrals'
  },
  {
    id: 2,
    subject: 'Physics',
    topic: 'Mechanics',
    duration: 90,
    date: '2024-01-14',
    efficiency: 'medium',
    notes: 'Force and motion practice problems'
  },
  {
    id: 3,
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    duration: 60,
    date: '2024-01-14',
    efficiency: 'low',
    notes: 'Nomenclature basics'
  },
  {
    id: 4,
    subject: 'Computer Science',
    topic: 'Data Structures',
    duration: 150,
    date: '2024-01-13',
    efficiency: 'high',
    notes: 'Binary trees implementation'
  },
  {
    id: 5,
    subject: 'Mathematics',
    topic: 'Linear Algebra',
    duration: 105,
    date: '2024-01-13',
    efficiency: 'medium',
    notes: 'Matrix operations'
  }
];

const StudyHistory: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const cardBg = useColorModeValue('white', 'gray.700');
  const tableBg = useColorModeValue('gray.50', 'gray.800');

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'high': return 'green';
      case 'medium': return 'yellow';
      case 'low': return 'red';
      default: return 'gray';
    }
  };

  const filteredSessions = filter === 'all' 
    ? MOCK_SESSIONS 
    : MOCK_SESSIONS.filter(session => session.subject === filter);

  return (
    <Container maxW="container.xl" py={8}>
      <Card bg={cardBg}>
        <CardBody>
          <HStack justify="space-between" mb={6}>
            <Heading size="md">Study Session History</Heading>
            <Select 
              maxW="200px"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Computer Science">Computer Science</option>
            </Select>
          </HStack>

          <TableContainer>
            <Table variant="simple">
              <Thead bg={tableBg}>
                <Tr>
                  <Th>Date</Th>
                  <Th>Subject</Th>
                  <Th>Topic</Th>
                  <Th>Duration</Th>
                  <Th>Efficiency</Th>
                  <Th>Notes</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSessions.map((session) => (
                  <Tr key={session.id}>
                    <Td>
                      <HStack>
                        <Icon as={FiCalendar} color="gray.500" />
                        <Text>{new Date(session.date).toLocaleDateString()}</Text>
                      </HStack>
                    </Td>
                    <Td>{session.subject}</Td>
                    <Td>{session.topic}</Td>
                    <Td>{Math.floor(session.duration / 60)}h {session.duration % 60}m</Td>
                    <Td>
                      <Badge colorScheme={getEfficiencyColor(session.efficiency)}>
                        {session.efficiency}
                      </Badge>
                    </Td>
                    <Td maxW="200px" isTruncated>{session.notes}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem>View Details</MenuItem>
                          <MenuItem>Edit Session</MenuItem>
                          <MenuItem>Delete</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Container>
  );
};

export default StudyHistory;