import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Squid Game Colors
const SQUID_PINK = '#FF357A';
const SQUID_GREEN = '#00FFB0';
const SQUID_BLACK = '#18181B';
const SQUID_WHITE = '#fff';

// Mock user data
const initialUserData = {
  name: 'John Doe',
  role: 'Full Stack Developer',
  bio: 'Experienced full stack developer with over 5 years of practice. Specialized in web development and cloud architecture.',
  github: 'https://github.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  contact: {
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    location: 'New York, NY',
    languages: ['English', 'Spanish']
  },
  skills: {
    technical: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker', 'TypeScript', 'GraphQL'],
    soft: ['Team Leadership', 'Project Management', 'Communication', 'Problem Solving'],
    tools: ['VS Code', 'Git', 'Jira', 'Figma', 'Postman']
  },
  domain: [
    { name: 'Web Development', icon: '💻' },
    { name: 'Cloud Architecture', icon: '☁️' },
    { name: 'DevOps', icon: '🔄' }
  ],
  experience: [
    {
      company: 'Tech Solutions Inc.',
      role: 'Senior Developer',
      period: '2020 - Present',
      description: 'Leading development of enterprise applications.'
    },
    {
      company: 'Digital Innovations Co.',
      role: 'Full Stack Developer',
      period: '2018 - 2020',
      description: 'Developed and maintained multiple web applications.'
    }
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'M.S. Computer Science',
      year: '2018'
    },
    {
      school: 'Tech Institute',
      degree: 'B.S. Software Engineering',
      year: '2016'
    }
  ],
  reviews: [
    {
      author: 'Jane Smith',
      rating: 5,
      text: 'Excellent developer, delivered the project on time.'
    },
    {
      author: 'Mike Johnson',
      rating: 5,
      text: 'Great communication and technical skills.'
    }
  ]
};

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-semibold transition-all ${
      active 
        ? 'border-b-2 text-blue-400 border-blue-400' 
        : 'text-gray-400 hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

const EditableField = ({ value, onSave, type = 'text', placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="bg-black/60 border border-gray-700 rounded px-3 py-1 text-white"
          placeholder={placeholder}
        />
        <button
          onClick={handleSave}
          className="p-1 rounded bg-green-600 text-white hover:bg-green-700"
        >
          ✓
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>{value}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 rounded hover:bg-gray-700/50"
      >
        ✎
      </button>
    </div>
  );
};

const SkillSection = ({ title, skills, onAdd, onRemove }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      const category = title.toLowerCase().replace(' ', '_');
      onAdd(category, newSkill.trim());
      setNewSkill('');
    }
  };

  const handleRemove = (skill) => {
    const category = title.toLowerCase().replace(' ', '_');
    onRemove(category, skill);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <h4 className="text-lg font-semibold" style={{ color: SQUID_WHITE }}>{title}</h4>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}`}
            className="bg-black/60 border-2 border-gray-700 rounded px-3 py-1 text-white text-sm focus:border-pink-500 focus:outline-none transition-colors min-w-[200px]"
          />
          <button
            type="submit"
            className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newSkill.trim()}
          >
            Add
          </button>
        </form>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={skill}
            className="group flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border-2 text-sm"
            style={{
              borderColor: index % 2 === 0 ? SQUID_PINK : SQUID_GREEN,
              boxShadow: `0 0 8px 1px ${index % 2 === 0 ? SQUID_PINK : SQUID_GREEN}`
            }}
          >
            <span className="text-white">{skill}</span>
            <button
              type="button"
              onClick={() => handleRemove(skill)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
              aria-label="Remove skill"
            >
              ×
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-gray-500 text-sm italic">No {title.toLowerCase()} added yet</p>
        )}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [userData, setUserData] = useState({
    ...initialUserData,
    skills: {
      technical_skills: initialUserData.skills.technical || [],
      soft_skills: initialUserData.skills.soft || [],
      tools: initialUserData.skills.tools || []
    }
  });
  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleAddSkill = (category, skill) => {
    if (!userData.skills[category].includes(skill)) {
      setUserData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill]
        }
      }));
    }
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setUserData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleContactEdit = (field, value) => {
    setUserData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4" style={{ color: SQUID_WHITE }}>About</h3>
              <p className="text-gray-300">{userData.bio}</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold mb-6" style={{ color: SQUID_WHITE }}>Skills</h3>
              <SkillSection
                title="Technical Skills"
                skills={userData.skills.technical_skills}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
              />
              <SkillSection
                title="Soft Skills"
                skills={userData.skills.soft_skills}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
              />
              <SkillSection
                title="Tools"
                skills={userData.skills.tools}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
              />
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4" style={{ color: SQUID_WHITE }}>Domain</h3>
              <div className="flex flex-wrap gap-4">
                {userData.domain.map((spec, index) => (
                  <div
                    key={spec.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border-2"
                    style={{
                      borderColor: index % 2 === 0 ? SQUID_PINK : SQUID_GREEN,
                      boxShadow: `0 0 16px 2px ${index % 2 === 0 ? SQUID_PINK : SQUID_GREEN}`
                    }}
                  >
                    <span>{spec.icon}</span>
                    <span className="text-white">{spec.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'EXPERIENCE':
        return (
          <div className="space-y-6">
            {userData.experience.map((exp, index) => (
              <motion.div
                key={exp.company}
                className="p-6 rounded-xl bg-black/60 border-2"
                style={{
                  borderColor: index % 2 === 0 ? SQUID_PINK : SQUID_GREEN,
                  boxShadow: `0 0 16px 2px ${index % 2 === 0 ? SQUID_PINK : SQUID_GREEN}`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2" style={{ color: SQUID_WHITE }}>{exp.company}</h3>
                <p className="text-gray-300">{exp.role}</p>
                <p className="text-sm text-gray-400">{exp.period}</p>
                <p className="mt-2 text-gray-300">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        );
      case 'EDUCATION':
        return (
          <div className="space-y-6">
            {userData.education.map((edu, index) => (
              <motion.div
                key={edu.school}
                className="p-6 rounded-xl bg-black/60 border-2"
                style={{
                  borderColor: index % 2 === 0 ? SQUID_PINK : SQUID_GREEN,
                  boxShadow: `0 0 16px 2px ${index % 2 === 0 ? SQUID_PINK : SQUID_GREEN}`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2" style={{ color: SQUID_WHITE }}>{edu.school}</h3>
                <p className="text-gray-300">{edu.degree}</p>
                <p className="text-sm text-gray-400">{edu.year}</p>
              </motion.div>
            ))}
          </div>
        );
      case 'REVIEWS':
        return (
          <div className="space-y-6">
            {userData.reviews.map((review, index) => (
              <motion.div
                key={review.author}
                className="p-6 rounded-xl bg-black/60 border-2"
                style={{
                  borderColor: index % 2 === 0 ? SQUID_PINK : SQUID_GREEN,
                  boxShadow: `0 0 16px 2px ${index % 2 === 0 ? SQUID_PINK : SQUID_GREEN}`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                  <span className="text-gray-400">{'★'.repeat(5 - review.rating)}</span>
                </div>
                <p className="text-gray-300 mb-2">{review.text}</p>
                <p className="text-sm text-gray-400">- {review.author}</p>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: SQUID_BLACK }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Contact Information */}
          <div className="lg:w-1/4">
            <motion.div
              className="bg-black/80 backdrop-blur rounded-2xl p-6 shadow-glass border-2 border-pink-500/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-green-500 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: SQUID_PINK }}>JD</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: SQUID_WHITE }}>{userData.name}</h1>
                <p className="text-lg mb-4" style={{ color: SQUID_GREEN }}>{userData.role}</p>
                <div className="flex gap-4">
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black/60 border-2 border-pink-500 text-white hover:bg-pink-900/40 transition"
                    style={{ boxShadow: `0 0 16px 2px ${SQUID_PINK}` }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black/60 border-2 border-green-500 text-white hover:bg-green-900/40 transition"
                    style={{ boxShadow: `0 0 16px 2px ${SQUID_GREEN}` }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <EditableField
                    value={userData.contact.email}
                    onSave={(value) => handleContactEdit('email', value)}
                    type="email"
                    placeholder="Enter email"
                  />
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <EditableField
                    value={userData.contact.phone}
                    onSave={(value) => handleContactEdit('phone', value)}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <EditableField
                    value={userData.contact.location}
                    onSave={(value) => handleContactEdit('location', value)}
                    placeholder="Enter location"
                  />
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                  <span>{userData.contact.languages.join(', ')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-black/80 backdrop-blur rounded-2xl shadow-glass border-2 border-pink-500/30">
              {/* Tabs */}
              <div className="border-b border-gray-800">
                <div className="flex overflow-x-auto">
                  <TabButton
                    active={activeTab === 'OVERVIEW'}
                    onClick={() => setActiveTab('OVERVIEW')}
                  >
                    OVERVIEW
                  </TabButton>
                  <TabButton
                    active={activeTab === 'EXPERIENCE'}
                    onClick={() => setActiveTab('EXPERIENCE')}
                  >
                    EXPERIENCE
                  </TabButton>
                  <TabButton
                    active={activeTab === 'EDUCATION'}
                    onClick={() => setActiveTab('EDUCATION')}
                  >
                    EDUCATION
                  </TabButton>
                  <TabButton
                    active={activeTab === 'REVIEWS'}
                    onClick={() => setActiveTab('REVIEWS')}
                  >
                    REVIEWS
                  </TabButton>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 