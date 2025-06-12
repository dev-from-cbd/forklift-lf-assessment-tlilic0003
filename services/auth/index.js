// Import required modules
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Define server port
const PORT = 3001;

// Login route handler
app.post('/api/auth/login', (req, res) => {
  // Simple authentication for demo
  const { username, password } = req.body;
  // Check if credentials exist
  if (username && password) {
    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');
    // Return token in response
    res.json({ token });
  } else {
    // Return error for invalid credentials
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});