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
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  deadline: string;
}

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateGoal: (goal: Goal) => void;
  goal: Goal;
}

export default function EditGoalModal({
  isOpen,
  onClose,
  onUpdateGoal,
  goal,
}: EditGoalModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState<Goal>(goal);

  useEffect(() => {
    setFormData(goal);
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoal(formData);
    toast({
      title: 'Goal updated.',
      description: 'Your goal has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Edit Goal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Goal Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter goal title"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter goal description"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Progress</FormLabel>
              <NumberInput
                min={0}
                max={formData.target}
                value={formData.progress}
                onChange={(value) => handleNumberChange('progress', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Target Value</FormLabel>
              <NumberInput
                min={1}
                value={formData.target}
                onChange={(value) => handleNumberChange('target', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Unit</FormLabel>
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., pages, hours, projects"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Deadline</FormLabel>
              <Input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
