import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the server root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  port: process.env.PORT || 8080,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:8080']
};

// Log the configuration for debugging (without sensitive values)
console.log('Server Configuration:', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  mongodbUri: config.mongodbUri ? '*** Configured ***' : 'Not configured',
  geminiApiKey: config.geminiApiKey ? '*** Configured ***' : 'Not configured',
  jwtSecret: config.jwtSecret ? '*** Configured ***' : 'Not configured'
});
