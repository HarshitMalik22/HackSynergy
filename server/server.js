import express from "express";
import cors from "cors";
import connectToDB from "./db/db.js";
import { config } from "./db/config.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import { arcjetMiddleware } from "./middlewares/arcjetMiddleware.js";
import { sendMessageToGemini, clearConversationHistory } from "./services/geminiChat.js";

const app = express();

// Connect to MongoDB
connectToDB();

// CORS middleware (allow all for development)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);

// Home route with arcjet middleware
app.get("/", arcjetMiddleware, (req, res) => {
  res.send("Hello World!");
});

// Handle preflight
app.options("/api/chat", cors());

// AI Chat endpoint - support both with and without /api prefix for compatibility
app.post(["/api/chat", "/chat"], async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'No message provided'
      });
    }
    
    console.log(`Received chat request: ${message}`);
    
    // Get response from Gemini (will handle errors internally)
    const response = await sendMessageToGemini(message, sessionId);
    
    console.log(`Sending response: ${response.substring(0, 50)}...`);
    
    // Always return a 200 response with the AI's response
    // The geminiChat service now handles errors gracefully
    return res.json({ response });
  } catch (error) {
    // This is a fallback in case of unexpected errors
    console.error('Error in chat endpoint:', error);
    return res.status(200).json({
      response: "I'm sorry, I encountered an unexpected error. Please try again with a different question."
    });
  }
});

// Chat history clear endpoint
app.post(['/api/chat/clear', '/chat/clear'], async (req, res) => {
  const { sessionId = 'default' } = req.body;
  try {
    clearConversationHistory(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

// Health check endpoint
app.get(["/api/test", "/test"], (req, res) => {
  res.json({ status: "ok", message: "Server is running properly" });
});

// PORT fallbacks
const PORTS = 8080;

const startServer = (portIndex = 0) => {
  if (portIndex >= PORTS.length) {
    console.error("All ports are in use.");
    process.exit(1);
    return;
  }

  const PORT = PORTS[portIndex];

  app.listen(PORT)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} in use. Trying next...`);
        startServer(portIndex + 1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    })
    .on('listening', () => {
      console.log(`✅ Server is running on port ${PORT} in ${config.nodeEnv} mode`);
      console.log("🌐 Endpoints:");
      console.log("  - GET  /              ➜ Hello World");
      console.log("  - POST /api/chat      ➜ AI Chat");
      console.log("  - POST /api/chat/clear➜ Clear Chat History");
    });
};

startServer();
