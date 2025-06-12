// Import Express framework for creating the server
import express from 'express';
// Import CORS middleware for enabling cross-origin requests
import cors from 'cors';

// Create an Express application
const app = express();
// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Define the port number for the server
const PORT = 3003;

// Create a Map to store user progress data
const progress = new Map();

// POST endpoint to save user progress
app.post('/api/progress/save', (req, res) => {
  // Extract userId, questionId and answers from request body
  const { userId, questionId, answers } = req.body;
  
  // If user doesn't exist in progress map, create a new entry
  if (!progress.has(userId)) {
    progress.set(userId, new Map());
  }
  
  // Save the answers for the specific question
  progress.get(userId).set(questionId, answers);
  // Return success response
  res.json({ success: true });
});

// GET endpoint to retrieve user progress
app.get('/api/progress/:userId', (req, res) => {
  // Get progress for the requested user or empty Map if not found
  const userProgress = progress.get(req.params.userId) || new Map();
  // Convert Map to object and return as JSON
  res.json(Object.fromEntries(userProgress));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Progress service running on port ${PORT}`);
});