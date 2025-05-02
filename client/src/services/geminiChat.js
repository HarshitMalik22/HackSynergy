/**
 * Client-side service for interacting with the Gemini API through the server
 */

/**
 * Sends a message to the Gemini API via the server endpoint
 * @param {string} message - The user's message
 * @param {string} [sessionId] - Optional session ID for maintaining conversation history
 * @returns {Promise<string>} - The AI response
 */
export async function sendMessageToGemini(message, sessionId = 'default') {
  try {
    // First try the relative URL with proxy
    const apiUrl = '/api/chat';
    
    // Create the request payload
    const payload = { 
      message,
      sessionId
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.response) {
      throw new Error('Invalid response format from server');
    }
    
    return data.response;
  } catch (error) {
    console.error('Error in client-side sendMessageToGemini:', error);
    
    // Try direct server connection as fallback with multiple ports
    try {
      // Try multiple ports, prioritizing the port we know the server is using (5006)
      const ports =  [8080];
      let directResponse = null;
      
      // Try each port until one works
      for (const port of ports) {
        try {
          console.log(`Trying direct connection to port ${port}...`);
          const response = await fetch(`http://localhost:${port}/api/chat`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              message,
              sessionId
            })
          });
          
          if (response.ok) {
            directResponse = response;
            console.log(`Connected successfully on port ${port}`);
            break;
          }
        } catch (err) {
          console.log(`Failed to connect on port ${port}: ${err.message}`);
        }
      }
      
      if (!directResponse) {
        throw new Error('Failed to connect to any server port');
      }
      
      // Parse the response from the successful port
      const directData = await directResponse.json();
      
      if (!directData || !directData.response) {
        throw new Error('Invalid response format from server');
      }
      
      return directData.response;
    } catch (fallbackError) {
      console.error('Fallback request also failed:', fallbackError);
      throw new Error(`Chat request failed: ${error.message}`);
    }
  }
}

/**
 * Clears the conversation history for a specific session
 * @param {string} sessionId - The session ID
 * @returns {Promise<void>}
 */
export async function clearConversationHistory(sessionId = 'default') {
  try {
    const response = await fetch('/api/chat/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to clear history: ${response.status}`);
    }
  } catch (error) {
    console.error('Error clearing conversation history:', error);
    throw error;
  }
}
