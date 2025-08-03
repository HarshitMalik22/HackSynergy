import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import DashBoardLayout from './Components/DashBoardLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import ProjectBoard from './pages/ProjectBoard.jsx';
import TeammateMatching from './pages/TeammateMatching.jsx';
import HackathonPage from './pages/HackathonPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import VideoCall from './pages/VideoCall.jsx';
import Chatbot from './Components/Chatbot.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import JoinedTeams from './pages/JoinedTeams.jsx';
import './styles/theme.css';
import './styles/modern-ui.css';
import './App.css';

const AuthenticatedRoute = ({ children }) => {
  return <DashBoardLayout>{children}</DashBoardLayout>;
};

function App() {
  return (
    <ThemeProvider>
      <Chatbot />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/joined-teams" element={<JoinedTeams />} />

          {/* Protected routes - wrapped with DashboardLayout */}
          <Route path="/" element={<HomePage/>}/>
          <Route path="/teams" element={<AuthenticatedRoute><TeamPage /></AuthenticatedRoute>} />
          <Route path="/project-board" element={<AuthenticatedRoute><ProjectBoard /></AuthenticatedRoute>} />
          <Route path="/find-teammates" element={<AuthenticatedRoute><TeammateMatching /></AuthenticatedRoute>} />
          <Route path="/events" element={<AuthenticatedRoute><HackathonPage /></AuthenticatedRoute>} />
          <Route path="/video-call" element={<AuthenticatedRoute><VideoCall /></AuthenticatedRoute>} />
          <Route path="/profile" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 