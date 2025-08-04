import express from "express";
import cors from "cors";
import connectToDB from "./db/db.js";
import dotenv from "dotenv";
dotenv.config();
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
// Debug: Log all registered routes
const printRoutes = (routes, prefix = '') => {
  routes.forEach(route => {
    if (route.route) {
      // Routes registered directly on app
      const methods = Object.keys(route.route.methods).join(',').toUpperCase();
      console.log(`${methods.padEnd(6)} ${prefix}${route.route.path}`);
    } else if (route.name === 'router') {
      // Nested routes (router instances)
      route.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          console.log(`${methods.padEnd(6)} ${prefix}${handler.route.path}`);
        } else if (handler.name === 'router') {
          // Handle nested routers if needed
          printRoutes(handler.handle.stack, `${prefix}${route.path}/`);
        }
      });
    }
  });
};

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);

// Log all registered routes
console.log('\n=== Registered Routes ===');
printRoutes(app._router.stack);
console.log('========================\n');

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

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log("🌐 Endpoints:");
  console.log("  - GET  /              ➜ Hello World");
  console.log("  - GET  /api/hackathons➜ Get Hackathons");
  console.log("  - POST /api/chat      ➜ AI Chat");
  console.log("  - POST /api/chat/clear➜ Clear Chat History");
});
