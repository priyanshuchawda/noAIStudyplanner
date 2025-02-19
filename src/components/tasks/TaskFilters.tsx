import {
  HStack,
  Select,
  Input,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiX } from 'react-icons/fi';

interface TaskFiltersProps {
  filters: {
    search: string;
    priority: string;
    sortBy: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onClearFilters: () => void;
}

export default function TaskFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: TaskFiltersProps) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack spacing={4}>
      <Input
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        width="300px"
        borderColor={borderColor}
      />
      <Select
        value={filters.priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
        width="150px"
        borderColor={borderColor}
      >
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </Select>
      <Select
        value={filters.sortBy}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
        width="200px"
        borderColor={borderColor}
      >
        <option value="dueDate">Sort by Due Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="progress">Sort by Progress</option>
        <option value="title">Sort by Title</option>
      </Select>
      {(filters.search || filters.priority || filters.sortBy !== 'dueDate') && (
        <IconButton
          aria-label="Clear filters"
          icon={<FiX />}
          onClick={onClearFilters}
          variant="ghost"
        />
      )}
    </HStack>
  );
}
