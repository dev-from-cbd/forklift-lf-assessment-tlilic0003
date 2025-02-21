// Imports the `express` framework, which is used to create and manage the server.
import express from 'express';

// Imports the `cors` middleware, which enables Cross-Origin Resource Sharing (CORS) for the server.
import cors from 'cors';

// Imports the `jsonwebtoken` library, which is used to generate and verify JSON Web Tokens (JWT).
import jwt from 'jsonwebtoken';

// Imports the `dotenv` library, which loads environment variables from a `.env` file into `process.env`.
import dotenv from 'dotenv';

// Loads environment variables from the `.env` file into `process.env`.
dotenv.config();

// Creates an instance of the Express application.
const app = express();

// Enables CORS for all routes, allowing requests from different origins.
app.use(cors());

// Adds middleware to parse incoming JSON payloads in requests.
app.use(express.json());

// Defines the port on which the server will listen for incoming requests.
const PORT = 3001;

// Defines a POST route `/api/auth/login` for handling user login requests.
app.post('/api/auth/login', (req, res) => {
  // Extracts the `username` and `password` fields from the request body.
  const { username, password } = req.body;

  // Checks if both `username` and `password` are provided in the request.
  if (username && password) {
    // Generates a JWT token using the `jsonwebtoken` library.
    // The token contains the `username` as payload and is signed with the secret key from the environment variable `JWT_SECRET`.
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');

    // Sends the generated token back to the client in a JSON response.
    res.json({ token });
  } else {
    // If either `username` or `password` is missing, responds with a 401 Unauthorized status and an error message.
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Starts the server and listens on the specified port (`PORT`).
app.listen(PORT, () => {
  // Logs a message to the console indicating that the server is running.
  console.log(`Auth service running on port ${PORT}`);
});ƒ