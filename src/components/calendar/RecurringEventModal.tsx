import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState } from 'react';

export interface RecurringEventPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
  occurrences?: number;
}

interface RecurringEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pattern: RecurringEventPattern) => void;
}

export default function RecurringEventModal({
  isOpen,
  onClose,
  onSave,
}: RecurringEventModalProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  const [interval, setInterval] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [endType, setEndType] = useState<'date' | 'occurrences'>('occurrences');
  const [endDate, setEndDate] = useState('');
  const [occurrences, setOccurrences] = useState(10);

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleSave = () => {
    const pattern: RecurringEventPattern = {
      frequency,
      interval,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      endDate: endType === 'date' ? new Date(endDate) : undefined,
      occurrences: endType === 'occurrences' ? occurrences : undefined,
    };
    onSave(pattern);
    onClose();
  };

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Recurring Pattern</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Frequency</FormLabel>
              <Select
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Repeat every</FormLabel>
              <NumberInput
                min={1}
                max={99}
                value={interval}
                onChange={(_, value) => setInterval(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {frequency === 'weekly' && (
              <FormControl>
                <FormLabel>Repeat on</FormLabel>
                <HStack spacing={2} flexWrap="wrap">
                  {weekdays.map((day, index) => (
                    <Checkbox
                      key={day}
                      isChecked={daysOfWeek.includes(index)}
                      onChange={() => toggleDay(index)}
                    >
                      {day.slice(0, 3)}
                    </Checkbox>
                  ))}
                </HStack>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>End</FormLabel>
              <Select
                value={endType}
                onChange={(e) =>
                  setEndType(e.target.value as 'date' | 'occurrences')
                }
              >
                <option value="occurrences">After</option>
                <option value="date">On date</option>
              </Select>
            </FormControl>

            {endType === 'date' ? (
              <FormControl>
                <FormLabel>End date</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            ) : (
              <FormControl>
                <FormLabel>Number of occurrences</FormLabel>
                <NumberInput
                  min={1}
                  max={999}
                  value={occurrences}
                  onChange={(_, value) => setOccurrences(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save Pattern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
