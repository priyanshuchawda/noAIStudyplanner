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
import { useState } from 'react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: any) => void;
}

export default function CreateGoalModal({
  isOpen,
  onClose,
  onCreateGoal,
}: CreateGoalModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: 100,
    unit: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal = {
      id: Date.now().toString(),
      ...formData,
      progress: 0,
    };

    onCreateGoal(newGoal);
    toast({
      title: 'Goal created.',
      description: 'Your new goal has been created successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
    setFormData({
      title: '',
      description: '',
      target: 100,
      unit: '',
      deadline: '',
    });
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

  const handleNumberChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      target: parseInt(value) || 0,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Create New Goal</ModalHeader>
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
              <FormLabel>Target Value</FormLabel>
              <NumberInput
                min={1}
                value={formData.target}
                onChange={handleNumberChange}
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
            Create Goal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
