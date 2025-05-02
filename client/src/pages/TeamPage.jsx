import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/TeamsPage.css';
import axios from "axios";
const TeamsPage = () => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

  /*
  const [teams, setTeams] = useState([
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
    },
    {
      id: 3,
      name: 'Cloud Native',
      description: 'Cloud infrastructure and DevOps',
      members: 5,
      status: 'active',
      image: 'https://cdn.usegalileo.ai/sdxl10/d61750d0-85ef-4507-b2f1-2d27696f3659.png',
      skills: ['AWS', 'Kubernetes', 'Docker'],
      lastActive: new Date('2024-03-14')
    }
  ]);

  */
 
  const [teams,setTeams] = useState([]);

  useEffect(()=>{
    
    try{

      const response = axios.get("http://localhost:8080/api/teams/get-teams", {headers:
        {Authorization: `Bearer ${localStorage.getItem("token")}`}
      });

      if(response.status===201){
        setTeams(response.data.data);
      }

      
    }catch(err){
      console.error(err);
      return;
    }
  },[])
  const handleCreateTeam = (e) => {
    e.preventDefault();
    const newTeam = {
      id: teams.length + 1,
      name: teamName,
      description: 'New team description',
      members: 1,
      status: 'active',
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&size=200`,
      skills: [],
      lastActive: new Date()
    };
    setTeams([...teams, newTeam]);
    setShowCreateTeam(false);
    setTeamName('');
  };

  const handleJoinTeam = (teamId) => {
    // Implement join team logic
    console.log('Joining team:', teamId);
  };

  const filteredAndSortedTeams = teams
    .filter(team => {
      if (filterBy === 'all') return true;
      return team.status === filterBy;
    })
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.lastActive - a.lastActive;
        case 'members':
          return b.members - a.members;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="teams-page">
      <div className="teams-header">
        <h1>Hackathon Teams</h1>
        <p>Join a team or create your own to start building</p>
      </div>

      <div className="teams-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select 
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Teams</option>
            <option value="active">Active</option>
            <option value="recruiting">Recruiting</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="members">Most Members</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="teams-grid">
        <div className="team-card create-team" onClick={() => setShowCreateTeam(true)}>
          <div className="team-card-content">
            <div className="plus-icon">+</div>
            <h3>Create a new team</h3>
            <p>Start your own hackathon team</p>
          </div>
        </div>

        {filteredAndSortedTeams.map(team => (
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
              <button 
                className="join-button"
                onClick={() => handleJoinTeam(team.id)}
              >
                Join Team
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateTeam && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="create-team-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="modal-header">
              <h2>Create a new team</h2>
              <button className="close-button" onClick={() => setShowCreateTeam(false)}>×</button>
            </div>

            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label htmlFor="teamName">Team name</label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateTeam(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-button">
                  Create team
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeamsPage; 