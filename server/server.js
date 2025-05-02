import express from "express";
import cors from "cors";
import connectToDB from "./db/db.js";
import { config } from "./db/config.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import { arcjetMiddleware } from "./middlewares/arcjetMiddleware.js";
import aj from "./config/arcjet.config.js";
import { sendMessageToGemini } from "./services/geminiChat.js";

const app = express();

// Connect to MongoDB but don't wait for it
connectToDB();

// Middlewares
// In development, allow all origins for easier testing
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APPLICATION ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);

app.get("/", arcjetMiddleware, (req, res) => {
  res.send("Hello World!");
});

// Handle preflight OPTIONS requests for CORS
app.options("/api/chat", cors());

// AI Chat endpoint - support both with and without /api prefix for compatibility
app.post(["/api/chat", "/chat"], async (req, res) => {
  console.log('Received chat request:', req.body);
  
  const { message, sessionId = 'default' } = req.body;
  if (!message) {
    console.log('Error: Message is required');
    return res.status(400).json({ error: "Message is required" });
  }
  
  try {
    console.log(`Sending message to chatbot for session ${sessionId}:`, message);
    const aiResponse = await sendMessageToGemini(message, sessionId);
    console.log('Received response from chatbot');
    res.json({ response: aiResponse });
  } catch (err) {
    console.error('Error in chat endpoint:', err);
    res.status(500).json({ error: err.message || "Failed to get response from chatbot" });
  }
});

// Add a chat history clearing endpoint
app.post(["/api/chat/clear", "/chat/clear"], async (req, res) => {
  const { sessionId = 'default' } = req.body;
  try {
    const { clearConversationHistory } = await import('./services/geminiChat.js');
    clearConversationHistory(sessionId);
    console.log(`Cleared conversation history for session ${sessionId}`);
    res.json({ success: true, message: `Chat history cleared for session ${sessionId}` });
  } catch (err) {
    console.error('Error clearing chat history:', err);
    res.status(500).json({ error: err.message || "Failed to clear chat history" });
  }
});

// Add a test endpoint to verify the server is running - support both with and without /api prefix
app.get(["/api/test", "/test"], (req, res) => {
  res.json({ status: "ok", message: "Server is running properly" });
});

// Define an array of ports to try in order
const PORTS = [8080, 5006, 3001, 4000, 5000];

// Function to try starting server on different ports
const startServer = (portIndex = 0) => {
  if (portIndex >= PORTS.length) {
    console.error('All ports are in use. Could not start server.');
    process.exit(1);
    return;
  }
  
  const PORT = PORTS[portIndex];
  
  app.listen(PORT)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying next port...`);
        startServer(portIndex + 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    })
    .on('listening', () => {
      console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
      console.log('API endpoints available at:');
      console.log('- GET  /                 - Hello World');
      console.log('- POST /api/chat         - AI Chat endpoint');
    });
};

// Start the server
startServer();
