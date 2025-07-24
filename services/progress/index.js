import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3003;

const progress = new Map();

app.post('/api/progress/save', (req, res) => {
  const { userId, questionId, answers } = req.body;
  if (!progress.has(userId)) {
    progress.set(userId, new Map());
  }
  progress.get(userId).set(questionId, answers);
  res.json({ success: true });
});

app.get('/api/progress/:userId', (req, res) => {
  const userProgress = progress.get(req.params.userId) || new Map();
  res.json(Object.fromEntries(userProgress));
});
// Import the express library to create and manage the server
import express from 'express';
// Import the cors library to enable Cross-Origin Resource Sharing
import cors from 'cors';
// Import the jsonwebtoken library to handle JWT for authentication
import jwt from 'jsonwebtoken';
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
const PORT = 3001;

// Define a POST route for user login at /api/auth/login
app.post('/api/auth/login', (req, res) => {
  // This is a simple authentication for demonstration purposes
  // Destructure username and password from the request body
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (username && password) {
    // If they are, create a JWT token signed with the username and a secret key
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');
    // Send the generated token back to the client in JSON format
    res.json({ token });
  } else {
    // If credentials are not valid, send a 401 Unauthorized status with an error message
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start the server and have it listen on the specified PORT
app.listen(PORT, () => {
  // Log a message to the console once the server is running
  console.log(`Auth service running on port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`Progress service running on port ${PORT}`);
});