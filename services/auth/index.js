// Import Express.js framework for creating the web server
import express from 'express';
// Import CORS middleware to enable cross-origin requests
import cors from 'cors';
// Import JSON Web Token library for authentication
import jwt from 'jsonwebtoken';
// Import dotenv for loading environment variables from .env file
import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

// Initialize Express application
const app = express();
// Enable CORS for all routes to allow requests from different origins
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Define the port number for the server to listen on
const PORT = 3001;

// Define a POST endpoint for user login
app.post('/api/auth/login', (req, res) => {
  // Simple authentication logic (for demonstration purposes only)
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (username && password) {
    // Create a JWT token with the username as payload
    // Use JWT_SECRET from environment variables or fallback to 'secret'
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');
    // Return the token in the response
    res.json({ token });
  } else {
    // Return 401 Unauthorized status with error message if credentials are missing
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  // Log a message when the server starts successfully
  console.log(`Auth service running on port ${PORT}`);
});