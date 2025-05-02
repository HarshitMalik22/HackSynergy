import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/TeammateMatching.css';
import Connections from '../Components/Connections';
import { useNavigate } from 'react-router-dom';

const SQUID_PINK = '#FF357A';
const SQUID_GREEN = '#00FFB0';
const SQUID_BLACK = '#18181B';
const SQUID_WHITE = '#fff';

const TeammateMatching = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showMeetingPanel, setShowMeetingPanel] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState(null);
  const [showConnections, setShowConnections] = useState(false);
  const navigate = useNavigate();

  // Mock data for teammates
  const teammates = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      availability: 'Full-time',
      avatar: 'https://i.pravatar.cc/150?img=1',
      timezone: 'EST',
      bio: 'Passionate about building scalable web applications and open-source contributions.'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'CSS', 'User Research'],
      availability: 'Part-time',
      avatar: 'https://i.pravatar.cc/150?img=2',
      timezone: 'PST',
      bio: 'Creating beautiful and intuitive user experiences with a focus on accessibility.'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Data Scientist',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      availability: 'Full-time',
      avatar: 'https://i.pravatar.cc/150?img=3',
      timezone: 'CST',
      bio: 'Data-driven problem solver with expertise in ML and statistical analysis.'
    }
  ];

  // Available skills for filtering
  const availableSkills = [
    'React', 'Node.js', 'Python', 'AWS', 'Figma', 'Adobe XD', 'CSS',
    'User Research', 'Machine Learning', 'SQL', 'TensorFlow', 'JavaScript',
    'TypeScript', 'Docker', 'Kubernetes', 'GraphQL'
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredTeammates = teammates.filter(teammate => {
    const matchesSearch = teammate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teammate.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 ||
                         selectedSkills.some(skill => teammate.skills.includes(skill));
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: SQUID_PINK }}>
          Find Teammates
        </h1>
        <p className="text-gray-300 text-lg">
          Connect with talented developers, designers, and tech enthusiasts for your next hackathon project.
        </p>
        <button
          onClick={() => setShowConnections(true)}
          className="mt-4 px-6 py-2 rounded-xl font-semibold text-white transition-all"
          style={{
            background: `linear-gradient(135deg, ${SQUID_PINK}, ${SQUID_GREEN})`,
            boxShadow: `0 4px 12px ${SQUID_PINK}33`
          }}
        >
          Show Connections
        </button>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-black/40 backdrop-blur rounded-2xl p-6 border-2 border-pink-500/30 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>
        </div>

          {/* Skills Filter */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: SQUID_GREEN }}>Filter by Skills</h3>
            <div className="flex flex-wrap gap-2">
          {availableSkills.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-pink-500 text-white border-2 border-pink-400'
                      : 'bg-black/60 text-gray-300 border-2 border-gray-700 hover:border-pink-500'
                  }`}
            >
              {skill}
            </button>
          ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teammate Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTeammates.map(teammate => (
            <motion.div
              key={teammate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
                className="bg-black/40 backdrop-blur rounded-2xl p-6 border-2 border-pink-500/30 shadow-lg hover:border-pink-500 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={teammate.avatar}
                    alt={teammate.name}
                    className="w-16 h-16 rounded-full border-2"
                    style={{ borderColor: SQUID_PINK }}
                  />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: SQUID_WHITE }}>{teammate.name}</h3>
                    <p className="text-sm font-medium mb-2" style={{ color: SQUID_PINK }}>{teammate.role}</p>
                    <p className="text-gray-300 text-sm mb-4">{teammate.bio}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                  {teammate.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${SQUID_GREEN}22`,
                      color: SQUID_GREEN,
                          border: `1px solid ${SQUID_GREEN}44`
                        }}
                      >
                        {skill}
                      </span>
                  ))}
                </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Availability:</span>
                      <span className="font-medium" style={{ color: SQUID_GREEN }}>{teammate.availability}</span>
                </div>
                    <span className="text-gray-400">{teammate.timezone}</span>
              </div>

                <button
                  onClick={() => {
                    setSelectedTeammate(teammate);
                    setShowMeetingPanel(true);
                  }}
                  className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${SQUID_PINK}, ${SQUID_GREEN})`,
                    boxShadow: `0 4px 12px ${SQUID_PINK}33`
                  }}
                >
                  Connect
                </button>
                {/* New options below Connect */}
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 px-3 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                    title="Voice Call"
                    onClick={() => alert(`Voice call with ${teammate.name}`)}
                  >
                    <span role="img" aria-label="Voice Call">📞</span> Voice Call
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition"
                    title="Video Call"
                    onClick={() => navigate('/video-call')}
                  >
                    <span role="img" aria-label="Video Call">🎥</span> Video Call
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-800 transition"
                    title="Message"
                    onClick={() => alert(`Message to ${teammate.name}`)}
                  >
                    <span role="img" aria-label="Message">💬</span> Message
                  </button>
                </div>
                </div>
              </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </div>

      {/* Meeting Panel */}
      <AnimatePresence>
        {showMeetingPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border-2 border-pink-500/30"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{ color: SQUID_PINK }}>
                  Connect with {selectedTeammate?.name}
                </h3>
                <button
                  onClick={() => setShowMeetingPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea
                    className="w-full bg-black/60 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                    rows="4"
                    placeholder="Write a message to introduce yourself..."
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowMeetingPanel(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${SQUID_PINK}, ${SQUID_GREEN})`,
                      boxShadow: `0 4px 12px ${SQUID_PINK}33`
                    }}
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connections Modal */}
      <AnimatePresence>
        {showConnections && (
          <Connections onClose={() => setShowConnections(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeammateMatching; 