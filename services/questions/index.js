import express from 'express';
import cors from 'cors';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;

// Read encrypted questions from file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questionsPath = path.join(__dirname, '../../src/data/questions.ts');
const questionsFile = fs.readFileSync(questionsPath, 'utf8');

// Extract the encrypted questions string
const encryptedQuestionsMatch = questionsFile.match(/export const encryptedQuestions = ["'](.+)["']/);
const encryptedQuestions = encryptedQuestionsMatch ? encryptedQuestionsMatch[1] : '';

const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-key-123';

const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

app.get('/api/questions', (req, res) => {
  const questions = decrypt(encryptedQuestions);
  res.json(questions);
});

app.get('/api/questions/:id', (req, res) => {
  const questions = decrypt(encryptedQuestions);
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (question) {
    res.json(question);
  }// Import the express library to create and manage the server
import express from 'express';
// Import the cors library to enable Cross-Origin Resource Sharing
import cors from 'cors';
// Import the CryptoJS library for encryption and decryption operations
import CryptoJS from 'crypto-js';
// Import the dotenv library to load environment variables from a .env file
import dotenv from 'dotenv';

// Load environment variables from the .env file into process.env
dotenv.config();

// Create an instance of an Express application
const app = express();
// Enable CORS for all routes, allowing requests from other origins
app.use(cors());
// Use the express.json middleware to parse incoming JSON requests
app.use(express.json());

// Define the port number for the server to listen on
const PORT = 3002;

// Comment indicating that we're reading encrypted questions from a file
// Read encrypted questions from file
// Import the fs module for file system operations
import fs from 'fs';
// Import the path module for working with file and directory paths
import path from 'path';
// Import fileURLToPath to convert file URL to path
import { fileURLToPath } from 'url';
// Import dirname to get directory name from a path
import { dirname } from 'path';

// Get the current file's path from the import.meta.url
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current file
const __dirname = dirname(__filename);

// Create the path to the questions.ts file by joining the current directory with the relative path
const questionsPath = path.join(__dirname, '../../src/data/questions.ts');
// Read the contents of the questions.ts file as a UTF-8 string
const questionsFile = fs.readFileSync(questionsPath, 'utf8');

// Comment indicating extraction of encrypted questions string
// Extract the encrypted questions string
// Use regex to find and extract the encrypted questions string from the file content
const encryptedQuestionsMatch = questionsFile.match(/export const encryptedQuestions = ["'](.+)["']/);
// Get the encrypted questions string from the regex match, or use empty string if no match
const encryptedQuestions = encryptedQuestionsMatch ? encryptedQuestionsMatch[1] : '';

// Get the encryption key from environment variables or use a default key
const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-key-123';

// Define a function to decrypt encrypted data using AES decryption
const decrypt = (encryptedData) => {
  // Decrypt the data using CryptoJS AES with the encryption key
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  // Parse the decrypted bytes as JSON and return the result
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Define a GET route to retrieve all questions
app.get('/api/questions', (req, res) => {
  // Decrypt the encrypted questions data
  const questions = decrypt(encryptedQuestions);
  // Send the decrypted questions as JSON response
  res.json(questions);
});

// Define a GET route to retrieve a specific question by ID
app.get('/api/questions/:id', (req, res) => {
  // Decrypt the encrypted questions data
  const questions = decrypt(encryptedQuestions);
  // Find the question with the matching ID (convert string parameter to integer)
  const question = questions.find(q => q.id === parseInt(req.params.id));
  // Check if the question was found
  if (question) {
    // If found, send the question as JSON response
    res.json(question);
  } else {
    // If not found, send a 404 status with an error message
    res.status(404).json({ error: 'Question not found' });
  }
});

// Start the server and have it listen on the specified PORT
app.listen(PORT, () => {
  // Log a message to the console once the server is running
  console.log(`Questions service running on port ${PORT}`);
}); else {
    res.status(404).json({ error: 'Question not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Questions service running on port ${PORT}`);
});