// Import Express.js framework for creating the web server
import express from 'express';
// Import CORS middleware to enable cross-origin requests
import cors from 'cors';

// Initialize Express application
const app = express();
// Enable CORS for all routes to allow requests from different origins
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Define the port number for the server to listen on
const PORT = 3003;

// Create an in-memory data store using Map to track user progress
// This will store user progress data in the format: userId -> (questionId -> answers)
const progress = new Map();

// Define a POST endpoint for saving user progress
app.post('/api/progress/save', (req, res) => {
  // Extract userId, questionId, and answers from the request body
  const { userId, questionId, answers } = req.body;
  // Check if this is the first progress entry for this user
  if (!progress.has(userId)) {
    // If user doesn't exist yet, create a new Map for their progress
    progress.set(userId, new Map());
  }
  // Save the answers for the specific question for this user
  progress.get(userId).set(questionId, answers);
  // Return success response
  res.json({ success: true });
});

// Define a GET endpoint to retrieve all progress for a specific user
app.get('/api/progress/:userId', (req, res) => {
  // Get the user's progress Map or create an empty Map if user not found
  const userProgress = progress.get(req.params.userId) || new Map();
  // Convert the Map to a plain JavaScript object and return as JSON
  res.json(Object.fromEntries(userProgress));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  // Log a message when the server starts successfully
  console.log(`Progress service running on port ${PORT}`);
});