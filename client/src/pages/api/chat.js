// routes/chat.js
import express from 'express';
import { sendMessageToGemini, clearConversationHistory } from '../services/geminiClient.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message, sessionId = 'default' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const reply = await sendMessageToGemini(message, sessionId);
    res.json({ response: reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat/clear', (req, res) => {
  const { sessionId = 'default' } = req.body;
  clearConversationHistory(sessionId);
  res.json({ message: 'Session cleared' });
});

export default router;
