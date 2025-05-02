/**
 * Gemini API integration for HackSynergy chatbot with fallback mechanisms
 */
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
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
    
    // Try multiple model endpoints to ensure compatibility
    const endpoints = [
      // Most recent model format
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      // Alternate model format
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent',
      // Legacy model format
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
    ];
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Gemini API endpoint: ${endpoint}`);
        
        const url = `${endpoint}?key=${API_KEY}`;
        
        // Request body based on current model formats
        const requestBody = {
          contents: [{
            parts: [{ text: message }]
          }]
        };
        
        // Make the request
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        // If successful, process the response
        if (response.ok) {
          const data = await response.json();
          console.log('Successful response from Gemini API');
          
          // Extract text from response
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (aiText) {
            // Store in conversation history
            addToConversationHistory(sessionId, message, aiText);
            return aiText;
          }
        } else {
          console.log(`Endpoint ${endpoint} returned status ${response.status}`);
        }
      } catch (endpointError) {
        console.log(`Error with endpoint ${endpoint}:`, endpointError.message);
        // Continue to next endpoint
      }
    }
    
    // If all endpoints fail, fall back to development mode
    console.log('All Gemini API endpoints failed - using development fallback');
    const fallbackResponse = getDevFallbackResponse(message);
    addToConversationHistory(sessionId, message, fallbackResponse);
    return fallbackResponse;
    
  } catch (error) {
    // Handle all errors gracefully
    console.error('Error in Gemini chat service:', error);
    return "I'm currently experiencing technical difficulties. The team is working on resolving this. Please try again later.";
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
    return "I can help you navigate HackSynergy. You can find hackathons, create or join teams, manage your profile, and track your progress.";
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
