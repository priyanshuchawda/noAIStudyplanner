import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
  Container,
  Heading,
  Card,
  CardBody,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, SearchIcon, StarIcon } from '@chakra-ui/icons';
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../store/AuthContext';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

const StudyNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newTag, setNewTag] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science'];

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      subject: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isStarred: false,
    };
    setCurrentNote(newNote);
    onOpen();
  };

  const saveNote = async () => {
    if (!currentNote || !currentNote.title || !currentNote.subject) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please fill in the title and subject',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const updatedNote = {
      ...currentNote,
      updatedAt: new Date().toISOString(),
    };

    if (user) {
      try {
        const noteRef = doc(db, 'profiles', user.uid);
        if (notes.find(note => note.id === currentNote.id)) {
          // Update existing note
          const updatedNotes = notes.map(note =>
            note.id === currentNote.id ? updatedNote : note
          );
          await updateDoc(noteRef, { notes: updatedNotes });
          setNotes(updatedNotes);
        } else {
          // Add new note
          await updateDoc(noteRef, {
            notes: arrayUnion(updatedNote),
          });
          setNotes([...notes, updatedNote]);
        }

        toast({
          title: 'Note Saved',
          status: 'success',
          duration: 2000,
        });
        onClose();
      } catch (error) {
        console.error('Error saving note:', error);
        toast({
          title: 'Error Saving Note',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      const noteToDelete = notes.find(note => note.id === noteId);
      if (noteToDelete) {
        const noteRef = doc(db, 'profiles', user.uid);
        await updateDoc(noteRef, {
          notes: arrayRemove(noteToDelete),
        });
        setNotes(notes.filter(note => note.id !== noteId));
        toast({
          title: 'Note Deleted',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error Deleting Note',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const toggleStar = async (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
    );
    setNotes(updatedNotes);

    if (user) {
      try {
        await updateDoc(doc(db, 'profiles', user.uid), {
          notes: updatedNotes,
        });
      } catch (error) {
        console.error('Error updating star status:', error);
      }
    }
  };

  const addTag = () => {
    if (newTag && currentNote && !currentNote.tags.includes(newTag)) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        tags: currentNote.tags.filter(t => t !== tag),
      });
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <Card w="full" bg={cardBg}>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" justify="space-between">
                <Heading size="lg">Study Notes</Heading>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={createNewNote}
                >
                  New Note
                </Button>
              </HStack>

              <HStack w="full" spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.500' />
                  </InputLeftElement>
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Select
                  placeholder="Filter by subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </Select>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <VStack w="full" spacing={4} align="stretch">
          {filteredNotes.map(note => (
            <Card key={note.id} bg={cardBg}>
              <CardBody>
                <HStack justify="space-between">
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <IconButton
                        aria-label="Star note"
                        icon={<StarIcon />}
                        size="sm"
                        colorScheme={note.isStarred ? 'yellow' : 'gray'}
                        onClick={() => toggleStar(note.id)}
                      />
                      <Heading size="md">{note.title}</Heading>
                    </HStack>
                    <Text color="gray.500">{note.subject}</Text>
                    <Text noOfLines={3}>{note.content}</Text>
                    <HStack>
                      {note.tags.map(tag => (
                        <Tag key={tag} size="sm" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                  </VStack>
                  <VStack>
                    <IconButton
                      aria-label="Edit note"
                      icon={<EditIcon />}
                      onClick={() => {
                        setCurrentNote(note);
                        onOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete note"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => deleteNote(note.id)}
                    />
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {currentNote?.id ? 'Edit Note' : 'New Note'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Input
                  placeholder="Title"
                  value={currentNote?.title || ''}
                  onChange={(e) => setCurrentNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
                <Select
                  placeholder="Select subject"
                  value={currentNote?.subject || ''}
                  onChange={(e) => setCurrentNote(prev => prev ? { ...prev, subject: e.target.value } : null)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </Select>
                <Textarea
                  placeholder="Note content..."
                  value={currentNote?.content || ''}
                  onChange={(e) => setCurrentNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                  rows={10}
                />
                <HStack w="full">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button onClick={addTag}>Add Tag</Button>
                </HStack>
                <HStack wrap="wrap">
                  {currentNote?.tags.map(tag => (
                    <Tag key={tag} size="md" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => removeTag(tag)} />
                    </Tag>
                  ))}
                </HStack>
                <Button colorScheme="blue" onClick={saveNote} w="full">
                  Save Note
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default StudyNotes;
