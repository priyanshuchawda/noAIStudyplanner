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
  Switch,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

export interface ReminderSettings {
  enabled: boolean;
  type: 'email' | 'notification' | 'both';
  timing: number; // minutes before event
  message?: string;
  notifyOnComplete?: boolean;
}

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ReminderSettings) => void;
  initialSettings?: ReminderSettings;
}

export default function ReminderModal({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}: ReminderModalProps) {
  const [enabled, setEnabled] = useState(initialSettings?.enabled ?? true);
  const [type, setType] = useState<'email' | 'notification' | 'both'>(
    initialSettings?.type ?? 'notification'
  );
  const [timing, setTiming] = useState(initialSettings?.timing ?? 15);
  const [message, setMessage] = useState(initialSettings?.message ?? '');
  const [notifyOnComplete, setNotifyOnComplete] = useState(
    initialSettings?.notifyOnComplete ?? false
  );

  const handleSave = () => {
    const settings: ReminderSettings = {
      enabled,
      type,
      timing,
      message,
      notifyOnComplete,
    };
    onSave(settings);
    onClose();
  };

  const timingOptions = [
    { value: 5, label: '5 minutes before' },
    { value: 10, label: '10 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 120, label: '2 hours before' },
    { value: 1440, label: '1 day before' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Enable Reminder</FormLabel>
              <Switch
                isChecked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
            </FormControl>

            {enabled && (
              <>
                <FormControl>
                  <FormLabel>Reminder Type</FormLabel>
                  <Select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as 'email' | 'notification' | 'both')
                    }
                  >
                    <option value="notification">Notification</option>
                    <option value="email">Email</option>
                    <option value="both">Both</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>When to Remind</FormLabel>
                  <Select
                    value={timing}
                    onChange={(e) => setTiming(Number(e.target.value))}
                  >
                    {timingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Custom Message (Optional)</FormLabel>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter a custom reminder message"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Notify when completed</FormLabel>
                  <Switch
                    isChecked={notifyOnComplete}
                    onChange={(e) => setNotifyOnComplete(e.target.checked)}
                  />
                </FormControl>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save Reminder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
