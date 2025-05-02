/**
 * Gemini API integration for HackSynergy chatbot with fallback mechanisms
 */
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
console.log('Gemini API Key status:', API_KEY ? 'Found' : 'Missing');

// Basic conversation storage per session
const conversations = {};

// Development fallback responses when API is unavailable
const DEV_FALLBACK_RESPONSES = [
  "I can help you find hackathons that match your interests and skills.",
  "Are you looking for a team to join for your next hackathon?",
  "HackSynergy can help you organize your hackathon preparation and find team members.",
  "Would you like me to explain how to use the different features of this platform?",
  "I can provide tips on how to prepare for your upcoming hackathon."
];

/**
 * Main function to send a message to Gemini API with multiple fallback options
 * @param {string} message - User message
 * @param {string} sessionId - Session identifier
 * @returns {Promise<string>} - AI response
 */
export const sendMessageToGemini = async (message, sessionId = 'default') => {
  try {
    console.log(`Processing message: "${message}" (Session ID: ${sessionId})`);
    
    // Verify API key
    if (!API_KEY) {
      console.log('No API key found - using development fallback response');
      return getDevFallbackResponse(message);
    }

    // Get conversation history for context
    const conversationHistory = conversations[sessionId] || [];
    const historyText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    // Prepare the API request
    const url = `${GEMINI_API_URL}?key=${API_KEY}`;
    const payload = {
      contents: [{
        parts: [{
          text: `Context: You are a helpful assistant for HackSynergy, a platform for hackathons and team collaboration.
Previous conversation:
${historyText}

Current message: ${message}

Please provide a helpful response focusing on hackathons, team collaboration, and project management.`
        }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('Invalid response from Gemini:', data);
      throw new Error('Failed to get valid response from Gemini');
    }

    // Add to conversation history
    addToConversationHistory(sessionId, message, reply);

    return reply;
  } catch (error) {
    console.error('Error in sendMessageToGemini:', error);
    return getDevFallbackResponse(message);
  }
};

/**
 * Helper function to add conversation to history
 */
function addToConversationHistory(sessionId, userMessage, aiResponse) {
  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }
  
  conversations[sessionId].push(
    { role: 'user', text: userMessage },
    { role: 'ai', text: aiResponse }
  );
  
  // Keep history to a reasonable size
  if (conversations[sessionId].length > 20) {
    conversations[sessionId] = conversations[sessionId].slice(-20);
  }
}

/**
 * Helper function to generate contextually relevant responses
 * when API is unavailable
 */
function getDevFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Simple pattern matching for development fallback
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your HackSynergy assistant. How can I help you today?";
  }
  
  if (lowerMessage.includes('hackathon')) {
    return "HackSynergy can help you find and manage hackathons. You can browse upcoming events, create teams, and track your progress.";
  }
  
  if (lowerMessage.includes('team') || lowerMessage.includes('member')) {
    return "You can form or join teams for hackathons through our platform. Would you like to create a new team or find an existing one to join?";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return "I can help you with hackathon-related questions, team management, and project organization. What would you like to know?";
  }
  
  // Return a random fallback response for other queries
  return DEV_FALLBACK_RESPONSES[Math.floor(Math.random() * DEV_FALLBACK_RESPONSES.length)];
}

/**
 * Clear conversation history
 * @param {string} sessionId - Session ID to clear
 */
export const clearConversationHistory = (sessionId = 'default') => {
  console.log(`Clearing conversation for session ${sessionId}`);
  delete conversations[sessionId];
  return { success: true };
};
