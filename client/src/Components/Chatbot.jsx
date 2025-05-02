// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsg = { sender: 'user', text: userMessage };
    setMessages(prevMsgs => [...prevMsgs, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      if (res.ok && data?.response) {
        setMessages(prevMsgs => [...prevMsgs, { sender: 'ai', text: data.response }]);
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (err) {
      console.error('❌ Error:', err.message);
      setMessages(prevMsgs => [
        ...prevMsgs,
        { sender: 'ai', text: 'Sorry, something went wrong with the AI service.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!open && (
        <button className="chatbot-arrow-btn" onClick={() => setOpen(true)}>
          <span>&#8592;</span>
        </button>
      )}

      <div className={`chatbot-panel${open ? ' open' : ''}`}>
        <div className="chatbot-header">
          <span>AI Assistant</span>
          <button className="chatbot-close-btn" onClick={() => setOpen(false)}>&times;</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-input-row">
          <textarea
            className="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={loading}
          />
          <button 
            className="chatbot-send-btn" 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
          >
            {loading ? <div className="loading-spinner"></div> : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
