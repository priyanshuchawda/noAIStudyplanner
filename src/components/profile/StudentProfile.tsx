import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  Heading,
  IconButton,
  Container,
  HStack,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Progress,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useClipboard,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, WarningIcon, CopyIcon, CalendarIcon, StarIcon, TimeIcon, SettingsIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuth } from '../../store/AuthContext';
import { db, storage } from '../../config/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface StudySession {
  id: string;
  date: string;
  duration: number;
  subject: string;
  topics: string[];
  rating: number;
}

interface StudentProfile {
  fullName: string;
  email: string;
  grade: string;
  school: string;
  subjects: string[];
  studyGoals: string;
  phoneNumber: string;
  dateOfBirth: string;
  preferredStudyTime: string;
  weeklyStudyHours: number;
  notificationsEnabled: boolean;
  profilePicture: string | null;
  bio: string;
  learningStyle: string;
  studyStreak: number;
  targetScore: number;
  languages: string[];
  availability: {
    [key: string]: boolean;
  };
  completionPercentage?: number;
  achievements: Achievement[];
  interests: string[];
  studySessions: StudySession[];
  totalStudyHours: number;
  badges: string[];
  skills: { name: string; level: number }[];
  socialLinks: { platform: string; url: string }[];
  preferredSubjects: string[];
  studyReminders: boolean;
  lastActive: string;
  timeZone: string;
  theme: string;
  publicProfile: boolean;
}

const StudentProfile: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.700');
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { hasCopied, onCopy } = useClipboard(user?.uid || '');
  const [activeTab, setActiveTab] = useState(0);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: '',
    title: '',
    date: '',
    description: '',
  });
  const [newStudySession, setNewStudySession] = useState<StudySession>({
    id: '',
    date: '',
    duration: 0,
    subject: '',
    topics: [],
    rating: 0,
  });

  const [profile, setProfile] = useState<StudentProfile>({
    fullName: '',
    email: '',
    grade: '',
    school: '',
    subjects: [],
    studyGoals: '',
    phoneNumber: '',
    dateOfBirth: '',
    preferredStudyTime: '',
    weeklyStudyHours: 10,
    notificationsEnabled: true,
    profilePicture: null,
    bio: '',
    learningStyle: 'visual',
    studyStreak: 0,
    targetScore: 90,
    languages: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    achievements: [],
    interests: [],
    studySessions: [],
    totalStudyHours: 0,
    badges: [],
    skills: [],
    socialLinks: [],
    preferredSubjects: [],
    studyReminders: true,
    lastActive: new Date().toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: 'light',
    publicProfile: false,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      updateLastActive();
    }
  }, [user]);

  const updateLastActive = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'profiles', user.uid), {
        lastActive: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  };

  const calculateCompletionPercentage = (profile: StudentProfile) => {
    const requiredFields = [
      'fullName',
      'email',
      'grade',
      'school',
      'subjects',
      'studyGoals',
      'learningStyle',
      'bio',
      'skills',
      'preferredSubjects',
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = profile[field as keyof StudentProfile];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const calculateStudyStats = useCallback(() => {
    const totalHours = profile.studySessions.reduce((acc, session) => acc + session.duration, 0);
    const averageRating = profile.studySessions.reduce((acc, session) => acc + session.rating, 0) / 
      (profile.studySessions.length || 1);
    const subjectDistribution = profile.studySessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
      return acc;
    }, {} as { [key: string]: number });

    return { totalHours, averageRating, subjectDistribution };
  }, [profile.studySessions]);

  const handleAddStudySession = async () => {
    if (!user) return;
    try {
      const sessionId = Date.now().toString();
      const newSession = { ...newStudySession, id: sessionId };
      
      await updateDoc(doc(db, 'profiles', user.uid), {
        studySessions: arrayUnion(newSession),
        totalStudyHours: profile.totalStudyHours + newSession.duration,
      });

      setProfile(prev => ({
        ...prev,
        studySessions: [...prev.studySessions, newSession],
        totalStudyHours: prev.totalStudyHours + newSession.duration,
      }));

      setNewStudySession({
        id: '',
        date: '',
        duration: 0,
        subject: '',
        topics: [],
        rating: 0,
      });

      toast({
        title: 'Study session added',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding study session:', error);
      toast({
        title: 'Error adding study session',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddAchievement = async () => {
    if (!user) return;
    try {
      const achievementId = Date.now().toString();
      const achievement = { ...newAchievement, id: achievementId };
      
      await updateDoc(doc(db, 'profiles', user.uid), {
        achievements: arrayUnion(achievement),
      });

      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement],
      }));

      setNewAchievement({
        id: '',
        title: '',
        date: '',
        description: '',
      });

      toast({
        title: 'Achievement added',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding achievement:', error);
      toast({
        title: 'Error adding achievement',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddSkill = async (skillName: string, level: number) => {
    if (!user) return;
    try {
      const newSkill = { name: skillName, level };
      await updateDoc(doc(db, 'profiles', user.uid), {
        skills: arrayUnion(newSkill),
      });

      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));

      toast({
        title: 'Skill added',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Error adding skill',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRemoveSkill = async (skillName: string) => {
    if (!user) return;
    try {
      const updatedSkills = profile.skills.filter(skill => skill.name !== skillName);
      await updateDoc(doc(db, 'profiles', user.uid), {
        skills: updatedSkills,
      });

      setProfile(prev => ({
        ...prev,
        skills: updatedSkills,
      }));

      toast({
        title: 'Skill removed',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: 'Error removing skill',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as StudentProfile;
        setProfile(prevProfile => ({
          ...prevProfile,
          ...data,
          completionPercentage: calculateCompletionPercentage(data),
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error loading profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: name === 'subjects' ? value.split(',').map(s => s.trim()) : value,
    }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name.startsWith('availability.')) {
      const day = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: checked,
        },
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        setLoading(true);
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setProfile(prev => ({
          ...prev,
          profilePicture: url,
        }));
        toast({
          title: 'Profile picture updated',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error uploading image',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: 'Please sign in to save your profile',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const completionPercentage = calculateCompletionPercentage(profile);
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        completionPercentage,
        updatedAt: new Date().toISOString(),
      });
      setProfile(prev => ({
        ...prev,
        completionPercentage,
      }));
      toast({
        title: 'Profile saved successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error saving profile',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
  };

  const grades = ['9th', '10th', '11th', '12th'];
  const studyTimes = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const learningStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Other'];
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (!user) {
    return (
      <Box p={4}>
        <Alert status="warning">
          <AlertIcon />
          Please sign in to access and edit your profile.
        </Alert>
      </Box>
    );
  }

  const ProfilePreview = () => (
    <Card bg={cardBg} shadow="lg" p={6}>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4}>
            <Avatar size="xl" src={profile.profilePicture || undefined} name={profile.fullName} />
            <Box>
              <Heading size="lg">{profile.fullName}</Heading>
              <Text color="gray.500">{profile.email}</Text>
              <Badge colorScheme="green">{profile.grade} Grade</Badge>
            </Box>
          </HStack>

          <Progress
            value={profile.completionPercentage}
            colorScheme={profile.completionPercentage === 100 ? 'green' : 'blue'}
            size="sm"
            borderRadius="full"
          />
          <Text fontSize="sm" color="gray.500">
            Profile Completion: {profile.completionPercentage}%
          </Text>

          <Divider />

          <Box>
            <Heading size="md" mb={2}>Academic Information</Heading>
            <Text><strong>School:</strong> {profile.school}</Text>
            <Text><strong>Subjects:</strong> {profile.subjects.join(', ')}</Text>
            <Text><strong>Target Score:</strong> {profile.targetScore}%</Text>
          </Box>

          <Box>
            <Heading size="md" mb={2}>Study Preferences</Heading>
            <Text><strong>Learning Style:</strong> {profile.learningStyle}</Text>
            <Text><strong>Preferred Study Time:</strong> {profile.preferredStudyTime}</Text>
            <Text><strong>Study Streak:</strong> {profile.studyStreak} days</Text>
          </Box>

          <Box>
            <Heading size="md" mb={2}>Achievements</Heading>
            <Flex wrap="wrap" gap={2}>
              {profile.achievements.map((achievement, index) => (
                <Tag key={index} colorScheme="green" size="md">
                  <TagLabel>{achievement.title}</TagLabel>
                </Tag>
              ))}
            </Flex>
          </Box>

          <Box>
            <Heading size="md" mb={2}>Interests</Heading>
            <Flex wrap="wrap" gap={2}>
              {profile.interests.map((interest, index) => (
                <Tag key={index} colorScheme="blue" size="md">
                  <TagLabel>{interest}</TagLabel>
                </Tag>
              ))}
            </Flex>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );

  const StudyStatsSection = () => {
    const stats = calculateStudyStats();
    return (
      <Box>
        <Heading size="md" mb={4}>Study Statistics</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem>
            <Card>
              <CardBody>
                <VStack>
                  <CircularProgress value={(stats.totalHours / 100) * 100} color="green.400">
                    <CircularProgressLabel>{stats.totalHours}h</CircularProgressLabel>
                  </CircularProgress>
                  <Text>Total Study Hours</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <VStack>
                  <CircularProgress value={stats.averageRating * 20} color="blue.400">
                    <CircularProgressLabel>{stats.averageRating.toFixed(1)}</CircularProgressLabel>
                  </CircularProgress>
                  <Text>Average Session Rating</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <VStack>
                  <CircularProgress value={profile.studyStreak * 5} color="purple.400">
                    <CircularProgressLabel>{profile.studyStreak}</CircularProgressLabel>
                  </CircularProgress>
                  <Text>Study Streak (days)</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <HStack w="full" justify="space-between">
          <Heading size="lg">Student Profile</Heading>
          <HStack>
            <Tooltip label="Share Profile">
              <IconButton
                aria-label="Share Profile"
                icon={<ExternalLinkIcon />}
                onClick={onModalOpen}
              />
            </Tooltip>
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              colorScheme={previewMode ? 'blue' : 'gray'}
            >
              {previewMode ? 'Edit Profile' : 'Preview Profile'}
            </Button>
          </HStack>
        </HStack>

        {profile.completionPercentage !== undefined && (
          <Box w="full">
            <Progress
              value={profile.completionPercentage}
              colorScheme={profile.completionPercentage === 100 ? 'green' : 'blue'}
              size="sm"
              borderRadius="full"
            />
            <Text mt={2} fontSize="sm" color="gray.500">
              Profile Completion: {profile.completionPercentage}%
            </Text>
          </Box>
        )}

        <Tabs isFitted variant="enclosed" index={activeTab} onChange={setActiveTab}>
          <TabList mb="1em">
            <Tab>Profile</Tab>
            <Tab>Study Stats</Tab>
            <Tab>Achievements</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {previewMode ? (
                <ProfilePreview />
              ) : (
                <Card bg={cardBg} shadow="lg" w="full">
                  <CardBody>
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={6} align="stretch">
                        {/* Profile Picture */}
                        <FormControl>
                          <FormLabel>Profile Picture</FormLabel>
                          <HStack>
                            <Avatar
                              size="xl"
                              src={profile.profilePicture || undefined}
                              name={profile.fullName}
                            />
                            <Box>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                id="profile-picture-input"
                                disabled={loading}
                              />
                              <Button
                                as="label"
                                htmlFor="profile-picture-input"
                                cursor="pointer"
                                leftIcon={<AddIcon />}
                                isLoading={loading}
                              >
                                Upload Photo
                              </Button>
                            </Box>
                          </HStack>
                        </FormControl>

                        {/* Basic Information */}
                        <Box>
                          <Heading size="md" mb={4}>Basic Information</Heading>
                          <Stack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Full Name</FormLabel>
                              <Input
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                              />
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel>Email</FormLabel>
                              <Input
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleChange}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Phone Number</FormLabel>
                              <Input
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Date of Birth</FormLabel>
                              <Input
                                name="dateOfBirth"
                                type="date"
                                value={profile.dateOfBirth}
                                onChange={handleChange}
                              />
                            </FormControl>
                          </Stack>
                        </Box>

                        {/* Academic Information */}
                        <Box>
                          <Heading size="md" mb={4}>Academic Information</Heading>
                          <Stack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Grade</FormLabel>
                              <Select
                                name="grade"
                                value={profile.grade}
                                onChange={handleChange}
                              >
                                <option value="">Select Grade</option>
                                {grades.map(grade => (
                                  <option key={grade} value={grade}>
                                    {grade}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel>School</FormLabel>
                              <Input
                                name="school"
                                value={profile.school}
                                onChange={handleChange}
                              />
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel>Subjects</FormLabel>
                              <Input
                                name="subjects"
                                value={profile.subjects.join(', ')}
                                onChange={handleChange}
                                placeholder="Enter subjects separated by commas"
                              />
                            </FormControl>
                          </Stack>
                        </Box>

                        {/* Study Preferences */}
                        <Box>
                          <Heading size="md" mb={4}>Study Preferences</Heading>
                          <Stack spacing={4}>
                            <FormControl>
                              <FormLabel>Learning Style</FormLabel>
                              <Select
                                name="learningStyle"
                                value={profile.learningStyle}
                                onChange={handleChange}
                              >
                                {learningStyles.map(style => (
                                  <option key={style} value={style.toLowerCase()}>
                                    {style}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Preferred Study Time</FormLabel>
                              <Select
                                name="preferredStudyTime"
                                value={profile.preferredStudyTime}
                                onChange={handleChange}
                              >
                                <option value="">Select Time</option>
                                {studyTimes.map(time => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Target Score (%)</FormLabel>
                              <Slider
                                value={profile.targetScore}
                                onChange={(value) => 
                                  setProfile(prev => ({ ...prev, targetScore: value }))
                                }
                                min={0}
                                max={100}
                                step={5}
                              >
                                <SliderTrack>
                                  <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb boxSize={6}>
                                  <Box color="blue.500" as={CheckIcon} />
                                </SliderThumb>
                                <SliderMark
                                  value={profile.targetScore}
                                  textAlign="center"
                                  bg="blue.500"
                                  color="white"
                                  mt="-10"
                                  ml="-5"
                                  w="12"
                                  fontSize="sm"
                                  borderRadius="md"
                                >
                                  {profile.targetScore}%
                                </SliderMark>
                              </Slider>
                            </FormControl>
                          </Stack>
                        </Box>

                        {/* Weekly Availability */}
                        <Box>
                          <Heading size="md" mb={4}>Weekly Availability</Heading>
                          <Stack spacing={4}>
                            {weekDays.map((day) => (
                              <FormControl key={day}>
                                <FormLabel>{day.charAt(0).toUpperCase() + day.slice(1)}</FormLabel>
                                <Switch
                                  name={`availability.${day}`}
                                  isChecked={profile.availability[day]}
                                  onChange={handleSwitchChange}
                                />
                              </FormControl>
                            ))}
                          </Stack>
                        </Box>

                        {/* Additional Information */}
                        <Box>
                          <Heading size="md" mb={4}>Additional Information</Heading>
                          <Stack spacing={4}>
                            <FormControl>
                              <FormLabel>Bio</FormLabel>
                              <Textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself"
                                rows={3}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Study Goals</FormLabel>
                              <Textarea
                                name="studyGoals"
                                value={profile.studyGoals}
                                onChange={handleChange}
                                placeholder="What are your academic goals?"
                                rows={3}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Notifications</FormLabel>
                              <Switch
                                name="notificationsEnabled"
                                isChecked={profile.notificationsEnabled}
                                onChange={handleSwitchChange}
                              />
                              <Text fontSize="sm" color="gray.500" mt={1}>
                                Enable study reminders and notifications
                              </Text>
                            </FormControl>
                          </Stack>
                        </Box>

                        <Button
                          type="submit"
                          colorScheme="blue"
                          size="lg"
                          isLoading={loading}
                          loadingText="Saving..."
                        >
                          Save Profile
                        </Button>
                      </VStack>
                    </form>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            <TabPanel>
              <StudyStatsSection />
              <Box mt={8}>
                <Heading size="md" mb={4}>Recent Study Sessions</Heading>
                <VStack spacing={4}>
                  {profile.studySessions.slice(-5).map(session => (
                    <Card key={session.id} w="full">
                      <CardBody>
                        <HStack justify="space-between">
                          <VStack align="start">
                            <Text fontWeight="bold">{session.subject}</Text>
                            <Text fontSize="sm">{session.topics.join(', ')}</Text>
                          </VStack>
                          <VStack align="end">
                            <Text>{new Date(session.date).toLocaleDateString()}</Text>
                            <Text>{session.duration} hours</Text>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6}>
                <Box w="full">
                  <Heading size="md" mb={4}>Add New Achievement</Heading>
                  <VStack spacing={4}>
                    <Input
                      placeholder="Achievement Title"
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={newAchievement.date}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Achievement Description"
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Button
                      colorScheme="green"
                      leftIcon={<AddIcon />}
                      onClick={handleAddAchievement}
                    >
                      Add Achievement
                    </Button>
                  </VStack>
                </Box>

                <Box w="full">
                  <Heading size="md" mb={4}>Achievements</Heading>
                  <VStack spacing={4}>
                    {profile.achievements.map(achievement => (
                      <Card key={achievement.id} w="full">
                        <CardBody>
                          <VStack align="start">
                            <HStack justify="space-between" w="full">
                              <Heading size="sm">{achievement.title}</Heading>
                              <Text fontSize="sm">{new Date(achievement.date).toLocaleDateString()}</Text>
                            </HStack>
                            <Text>{achievement.description}</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6}>
                <Card w="full">
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Heading size="md">Profile Settings</Heading>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">Public Profile</FormLabel>
                        <Switch
                          isChecked={profile.publicProfile}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            publicProfile: e.target.checked,
                          }))}
                        />
                      </FormControl>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">Study Reminders</FormLabel>
                        <Switch
                          isChecked={profile.studyReminders}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            studyReminders: e.target.checked,
                          }))}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Theme</FormLabel>
                        <Select
                          value={profile.theme}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            theme: e.target.value,
                          }))}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Time Zone</FormLabel>
                        <Select
                          value={profile.timeZone}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            timeZone: e.target.value,
                          }))}
                        >
                          {Intl.supportedValuesOf('timeZone').map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                <Card w="full">
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Heading size="md">Profile ID</Heading>
                      <HStack>
                        <Input value={user?.uid} isReadOnly />
                        <Button onClick={onCopy} ml={2}>
                          {hasCopied ? 'Copied!' : 'Copy'}
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Share Profile Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>Share your profile link with others:</Text>
              <HStack>
                <Input value={`${window.location.origin}/profile/${user?.uid}`} isReadOnly />
                <IconButton
                  aria-label="Copy link"
                  icon={<CopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.uid}`);
                    toast({
                      title: 'Link copied!',
                      status: 'success',
                      duration: 2000,
                    });
                  }}
                />
              </HStack>
              {profile.publicProfile ? (
                <Alert status="info">
                  <AlertIcon />
                  Your profile is public and can be viewed by anyone with the link.
                </Alert>
              ) : (
                <Alert status="warning">
                  <AlertIcon />
                  Your profile is private. Enable public profile in settings to share.
                </Alert>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default StudentProfile;
