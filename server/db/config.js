import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the server root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  port: 8080,
  mongodbUri: 'mongodb://localhost:27017/hacksynergy',
  nodeEnv: 'development',
  geminiApiKey: process.env.GEMINI_API_KEY
};

// Log the configuration for debugging
console.log('Server Configuration:', {
  port: config.port,
  mongodbUri: config.mongodbUri,
  nodeEnv: config.nodeEnv,
  geminiApiKey: config.geminiApiKey ? 'Found' : 'Not found'
});