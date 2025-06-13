// Import required modules
import express from 'express'; // Express framework for creating the server
import cors from 'cors'; // CORS middleware for enabling cross-origin requests
import CryptoJS from 'crypto-js'; // Library for encryption/decryption
import dotenv from 'dotenv'; // Module for loading environment variables

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
// Enable CORS for all routes
app.use(cors());
// Enable JSON body parsing for incoming requests
app.use(express.json());

// Define the port number for the server
const PORT = 3002;

// Import file system and path modules for file operations
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define path to questions data file
const questionsPath = path.join(__dirname, '../../src/data/questions.ts');
// Read questions file content
const questionsFile = fs.readFileSync(questionsPath, 'utf8');

// Extract encrypted questions string using regex
const encryptedQuestionsMatch = questionsFile.match(/export const encryptedQuestions = ["'](.+)["']/);
// Get encrypted questions or use empty string as fallback
const encryptedQuestions = encryptedQuestionsMatch ? encryptedQuestionsMatch[1] : '';

// Get encryption key from environment variables or use default
const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-key-123';

// Decryption function
const decrypt = (encryptedData) => {
  // Decrypt data using AES algorithm
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  // Parse decrypted data to JSON
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Route to get all questions
app.get('/api/questions', (req, res) => {
  // Decrypt questions
  const questions = decrypt(encryptedQuestions);
  // Send questions as JSON response
  res.json(questions);
});

// Route to get specific question by ID
app.get('/api/questions/:id', (req, res) => {
  // Decrypt questions
  const questions = decrypt(encryptedQuestions);
  // Find question with matching ID
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (question) {
    // Send found question
    res.json(question);
  } else {
    // Send 404 if question not found
    res.status(404).json({ error: 'Question not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Questions service running on port ${PORT}`);
});