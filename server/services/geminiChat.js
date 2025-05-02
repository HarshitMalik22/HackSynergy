import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const chatHistories = {};

export const sendMessageToGemini = async (message, sessionId = 'default') => {
  if (!API_KEY) throw new Error('GEMINI_API_KEY is not defined in .env');

  const chatHistory = chatHistories[sessionId] || [];

  chatHistory.push({
    author: 'user',
    content: message
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const payload = {
    prompt: {
      messages: chatHistory
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  const reply = data?.candidates?.[0]?.content;

  if (!reply) {
    console.error('Invalid response from PaLM:', reply);
    throw new Error('Failed to get valid response from chat-bison-001');
  }

  chatHistory.push({
    author: 'model',
    content: reply
  });

  chatHistories[sessionId] = chatHistory;

  return reply;
};

export const clearConversationHistory = (sessionId = 'default') => {
  delete chatHistories[sessionId];
};
