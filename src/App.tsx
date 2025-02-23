import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import { TaskProvider } from './store/TaskContext';
import { ThemeProvider } from './store/ThemeContext';
import { ChatProvider } from './store/ChatContext';
import { AuthProvider } from './store/AuthContext';
import createTheme from './theme';
import StudentProfile from './components/profile/StudentProfile';
import StudyTimer from './components/timer/StudyTimer';
import StudyNotes from './components/notes/StudyNotes';
import ProgressTracker from './components/progress/ProgressTracker';
import FlashcardsStudy from './components/study/FlashcardsStudy';
import SubjectBreakdown from './components/analytics/SubjectBreakdown';
import FocusMode from './components/study/FocusMode';
import ProductivityInsights from './components/analytics/ProductivityInsights';
import StudyStreakCalendar from './components/analytics/StudyStreakCalendar';
import StudyStats from './components/study/StudyStats';

function App() {
  return (
    <ThemeProvider>
      <ChakraProvider theme={createTheme('blue')}>
        <ColorModeScript initialColorMode="light" />
        <AuthProvider>
          <TaskProvider>
            <ChatProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="goals" element={<Goals />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="timer" element={<StudyTimer />} />
                    <Route path="notes" element={<StudyNotes />} />
                    <Route path="progress" element={<ProgressTracker />} />
                    <Route path="flashcards" element={<FlashcardsStudy />} />
                    <Route path="focus" element={<FocusMode />} />
                    <Route path="subjects" element={<SubjectBreakdown />} />
                    <Route path="productivity" element={<ProductivityInsights />} />
                    <Route path="stats" element={<StudyStats />} />
                    <Route path="streak" element={<StudyStreakCalendar />} />
                  </Route>
                </Routes>
              </Router>
            </ChatProvider>
          </TaskProvider>
        </AuthProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default App;
