# HackSynergy Server

This is the backend server for the HackSynergy application.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5002
   MONGODB_URI=mongodb://localhost:27017/hacksynergy
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Get a Gemini API Key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key and paste it in your `.env` file

4. Start the server:
   ```
   npm start
   ```

## AI Chatbot Feature

The AI chatbot uses Google's Gemini API. To make it work properly:

1. Make sure you have a valid Gemini API key in your `.env` file
2. If you don't have an API key, the chatbot will work in fallback mode with predefined responses

## Troubleshooting

If you encounter issues with the AI chatbot:

1. Check if your Gemini API key is correctly set in the `.env` file
2. Make sure you have an active internet connection
3. Check the server logs for any error messages
4. Ensure you're not exceeding API rate limits
