import express from "express";
import cors from "cors";
import { sendMessageToGemini, clearConversationHistory } from "./services/geminiChat.js";

const app = express();
app.use(cors());
app.use(express.json());

// AI Chat endpoint
app.post(["/api/chat", "/chat"], async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    const response = await sendMessageToGemini(message, sessionId);
    return res.json({ response });
  } catch (error) {
    return res.status(200).json({ response: "I'm sorry, I encountered an unexpected error. Please try again with a different question." });
  }
});

// Chat history clear endpoint
app.post(["/api/chat/clear", "/chat/clear"], async (req, res) => {
  const { sessionId = 'default' } = req.body;
  try {
    clearConversationHistory(sessionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

