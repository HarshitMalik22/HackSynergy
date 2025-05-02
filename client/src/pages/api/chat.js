export async function sendMessageToGemini(message, sessionId = 'default') {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from server');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
}
