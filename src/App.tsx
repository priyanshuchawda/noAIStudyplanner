import { ChakraProvider } from '@chakra-ui/react';
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
import createTheme from './theme';

function App() {
  return (
    <ThemeProvider>
      <ChakraProvider theme={createTheme('blue')}>
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
                </Route>
              </Routes>
            </Router>
          </ChatProvider>
        </TaskProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default App;
