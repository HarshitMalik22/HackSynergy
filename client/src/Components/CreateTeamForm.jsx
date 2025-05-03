import React, { useState } from "react";
import { FaPlus, FaMinus, FaUserPlus } from "react-icons/fa";
import "./CreateTeamForm.css";

const CreateTeamForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    leaderEmail: "",
  });

  // Tech stack state
  const [techStack, setTechStack] = useState([{ id: Date.now(), value: "" }]);

  // Members state
  const [members, setMembers] = useState([]);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Tech stack handlers
  const handleTechChange = (id, value) => {
    setTechStack(techStack.map(ts => ts.id === id ? { ...ts, value } : ts));
  };

  const addTechField = () => {
    setTechStack([...techStack, { id: Date.now(), value: "" }]);
  };

  const removeTechField = (id) => {
    if (techStack.length > 1) {
      setTechStack(techStack.filter(ts => ts.id !== id));
    }
  };

  // Member handlers
  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      setMembers([...members, { id: Date.now(), email: newMemberEmail }]);
      setNewMemberEmail("");
      setShowMemberPopup(false);
    }
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.leaderEmail.trim() ||
      techStack.some(ts => !ts.value.trim()) ||
      members.length === 0
    ) {
      alert("Please fill all fields and add at least one member.");
      return;
    }
    if (onSubmit) {
      onSubmit({
        ...form,
        techStack: techStack.map(ts => ts.value),
        members: members.map(m => m.email),
      });
    }
  };

  return (
    <form className="create-team-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Team Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter team name"
        />
      </div>

      <div className="form-group">
        <label>Tech Stack</label>
        <div className="tech-stack-container">
          {techStack.map((ts, idx) => (
            <div key={ts.id} className="tech-stack-item">
              <input
                value={ts.value}
                onChange={e => handleTechChange(ts.id, e.target.value)}
                required
                placeholder={`Tech Stack #${idx + 1}`}
              />
              <button type="button" onClick={addTechField} title="Add Tech">
                <FaPlus />
              </button>
              {techStack.length > 1 && (
                <button type="button" onClick={() => removeTechField(ts.id)} title="Remove Tech">
                  <FaMinus />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Project Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Enter project description"
        />
      </div>

      <div className="form-group">
        <label htmlFor="leaderEmail">Team Leader Email</label>
        <input
          id="leaderEmail"
          name="leaderEmail"
          type="email"
          value={form.leaderEmail}
          onChange={handleChange}
          required
          placeholder="Enter team leader's email"
        />
      </div>

      <div className="form-group">
        <label>Team Members</label>
        <ul className="members-list">
          {members.map(m => (
            <li key={m.id} className="member-item">
              <span>{m.email}</span>
              <button type="button" onClick={() => removeMember(m.id)}>
                <FaMinus />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="add-member-btn"
          onClick={() => setShowMemberPopup(true)}
        >
          <FaUserPlus /> Add Member
        </button>
      </div>

      {showMemberPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Add Member Gmail</h4>
            <input
              type="email"
              value={newMemberEmail}
              onChange={e => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's Gmail"
              required
            />
            <div className="popup-buttons">
              <button type="button" onClick={handleAddMember}>Add</button>
              <button type="button" onClick={() => setShowMemberPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="modal-footer">
        <button
          type="button"
          className="cancel-button"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button type="submit" className="create-button">
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateTeamForm;