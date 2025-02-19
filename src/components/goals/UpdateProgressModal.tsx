import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  VStack,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
}

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProgress: (id: string, progress: number) => void;
  goal: Goal;
}

export default function UpdateProgressModal({
  isOpen,
  onClose,
  onUpdateProgress,
  goal,
}: UpdateProgressModalProps) {
  const toast = useToast();
  const [progress, setProgress] = useState(goal.progress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProgress(goal.id, progress);
    toast({
      title: 'Progress updated.',
      description: 'Your goal progress has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const progressPercent = (progress / goal.target) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Update Progress</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontWeight="medium">{goal.title}</Text>
            <Progress
              value={progressPercent}
              size="lg"
              width="100%"
              borderRadius="full"
            />
            <FormControl>
              <FormLabel>Current Progress</FormLabel>
              <NumberInput
                min={0}
                max={goal.target}
                value={progress}
                onChange={(value) => setProgress(parseInt(value))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {progress} / {goal.target} {goal.unit}
              </Text>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
            Update Progress
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
