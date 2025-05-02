import React from 'react';
import { useNavigate } from 'react-router-dom';

const mockConnections = [
  { id: 1, name: 'Priya Singh', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 2, name: 'John Doe', role: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?img=5' },
];

const Connections = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border-2 border-pink-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-pink-400">Your Connections</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul>
          {mockConnections.map(conn => (
            <li key={conn.id} className="flex items-center gap-4 mb-4">
              <img src={conn.avatar} alt={conn.name} className="w-10 h-10 rounded-full border-2 border-pink-400" />
              <div className="flex-1">
                <div className="font-semibold text-white">{conn.name}</div>
                <div className="text-sm text-gray-400">{conn.role}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 px-2 py-1 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition text-xs"
                    title="Voice Call"
                    onClick={() => alert(`Voice call with ${conn.name}`)}
                  >
                    <span role="img" aria-label="Voice Call">📞</span> Voice Call
                  </button>
                  <button
                    className="flex-1 px-2 py-1 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition text-xs"
                    title="Video Call"
                    onClick={() => navigate('/video-call')}
                  >
                    <span role="img" aria-label="Video Call">🎥</span> Video Call
                  </button>
                  <button
                    className="flex-1 px-2 py-1 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-800 transition text-xs"
                    title="Message"
                    onClick={() => alert(`Message to ${conn.name}`)}
                  >
                    <span role="img" aria-label="Message">💬</span> Message
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Connections;
