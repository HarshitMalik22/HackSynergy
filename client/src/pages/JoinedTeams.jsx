import React from 'react';
import '../styles/JoinedTeams.css'
import DashBoardLayout from '../Components/DashBoardLayout';

const joinedTeams = [
  {
    id: 1,
    name: 'Web3 Innovators',
    description: 'Building decentralized solutions',
    members: 4,
    status: 'active',
    image: 'https://cdn.usegalileo.ai/sdxl10/9d70e499-cd3a-4183-ace5-63d85cc89cae.png',
    skills: ['Blockchain', 'Smart Contracts', 'Web3'],
    lastActive: new Date('2024-03-15')
  },
  {
    id: 2,
    name: 'AI Explorers',
    description: 'Developing ML-powered applications',
    members: 3,
    status: 'active',
    image: 'https://cdn.usegalileo.ai/sdxl10/2a362653-1ef6-4220-806a-709875332915.png',
    skills: ['Machine Learning', 'Python', 'TensorFlow'],
    lastActive: new Date('2024-03-16')
  }
];

const JoinedTeams = () => (
  <DashBoardLayout>
    <div className="teams-page">
      <div className="teams-header">
        <h1>Joined Teams</h1>
        <p>These are the teams you have joined.</p>
      </div>
      <div className="teams-grid">
        {joinedTeams.length === 0 ? (
          <div className="text-gray-400 text-lg">You haven't joined any teams yet.</div>
        ) : (
          joinedTeams.map(team => (
            <div key={team.id} className="team-card">
              <img 
                src={team.image}
                alt={`${team.name} workspace`}
                className="team-image"
              />
              <div className="team-info">
                <h3>{team.name}</h3>
                <p>{team.description}</p>
                <div className="team-skills">
                  {team.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="team-stats">
                  <span>{team.members} members</span>
                  <span className={`status-${team.status}`}>{team.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </DashBoardLayout>
);

export default JoinedTeams;
