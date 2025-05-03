import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/Events.css';
import DashboardLayout from '../Components/DashBoardLayout';


// Use a consistent API URL that matches the server port
const API_URL = 'http://localhost:8080/api';

// Fallback ports to try if main port fails
const FALLBACK_PORTS = [5006, 3001, 5005, 4000, 5000];

const HACKATHON_TYPES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'Blockchain',
  'UI/UX Design',
  'Game Development',
  'Robotics',
  'IoT',
  'AR/VR',
  'Full Stack Development'
];

const HackathonPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    mode: 'all',
    type: null
  });
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    tags: []
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Try main port first
        try {
          const response = await axios.get(`${API_URL}/hackathons`);
          setEvents(response.data);
          setError(null);
          return; // Success, exit function
        } catch (mainErr) {
          console.log(`Error connecting to main port, trying fallbacks...`);
          
          // Try fallback ports
          for (const port of FALLBACK_PORTS) {
            try {
              const fallbackUrl = `http://localhost:${port}/api`;
              console.log(`Trying port ${port}...`);
              const response = await axios.get(`${fallbackUrl}/hackathons`);
              setEvents(response.data);
              setError(null);
              console.log(`Successfully connected to port ${port}`);
              return; // Success, exit function
            } catch (fallbackErr) {
              console.log(`Failed to connect to port ${port}`);
            }
          }
          
          // If we get here, all ports failed
          throw new Error('Could not connect to any server port');
        }
      } catch (err) {
        setError('Failed to fetch hackathons. Please try again later.');
        console.error('Error fetching hackathons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in:', signInForm);
  };

  const filteredEvents = events.filter(event => {
    if (filters.mode !== 'all' && event.mode !== filters.mode) return false;
    if (filters.type && !event.tags?.includes(filters.type)) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      mode: 'all',
      type: null
    });
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.description) {
      const event = {
        id: events.length + 1,
        ...newEvent,
        tags: typeof newEvent.tags === 'string' ? newEvent.tags.split(',').map(tag => tag.trim()) : newEvent.tags
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: '',
        image: '',
        tags: []
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h2 className="text-2xl font-bold">Loading hackathons...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Left Sidebar */}
        
        <div className="w-64 min-h-screen bg-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            {(filters.mode !== 'all' || filters.type) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Hackathon Type</h3>
            <div className="space-y-3">
              {HACKATHON_TYPES.map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type === type}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === type ? null : type
                    }))}
                    className="form-checkbox text-purple-600 rounded-sm bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{filteredEvents.length} Hackathons</h1>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={`${event.id}-${index}`}
                className="bg-gray-800 rounded-lg overflow-hidden relative group"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  key={`bookmark-${event.id}`}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-900 bg-opacity-50 hover:bg-opacity-75"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>

                <div className="aspect-w-16 aspect-h-9">
                  <img
                    key={`img-${event.id}`}
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{event.title}</h3>
                  <div className="text-gray-400 text-sm mb-4">
                    {event.source || 'Devfolio'}, {event.mode === 'online' ? 'Virtual Event' : event.location}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <div>{event.startDate} - {event.endDate}</div>
                    <div className={event.registrationType === 'Themed' ? 'text-purple-400' : 'text-green-400'}>
                      {event.registrationType || 'Open'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Prize Pool</div>
                      <div className="font-bold">₹{event.prizeAmount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Mode</div>
                      <div className="font-medium capitalize">{event.mode || 'Online'}</div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      key={`learn-more-${event.id}`}
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      key={`create-team-${event.id}`}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2"
                      onClick={() => setShowSignIn(true)}
                    >
                      <span>Create Team</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <dialog id="create-event-modal" className="modal">
        <h2>Create New Event</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateEvent();
            document.getElementById('create-event-modal').close();
          }}
        >
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={newEvent.image}
              onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={newEvent.tags}
              onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
              placeholder="e.g., Hackathon, Virtual, Workshop"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              Create Event
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => document.getElementById('create-event-modal').close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <button
                onClick={() => setShowSignIn(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 text-center ${!isSignUp ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'}`}
                onClick={() => setIsSignUp(false)}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-2 text-center ${isSignUp ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-400">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-400 hover:text-purple-300"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonPage; 