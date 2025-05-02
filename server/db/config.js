import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the server root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  port: process.env.PORT || 5002,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hacksynergy',
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY
}; 

// Log the API key status (not the actual key) for debugging
console.log('Gemini API Key status:', process.env.GEMINI_API_KEY ? 'Found' : 'Not found');

// Make sure we're not using port 8080 which seems to be in use
if (config.port === 8080) {
  console.warn('Port 8080 is already in use, switching to port 5002');
  config.port = 5002;
}