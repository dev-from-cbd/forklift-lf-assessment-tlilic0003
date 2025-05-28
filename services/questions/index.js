// Import the express library, which is a web framework for Node.js.
import express from 'express';
// Import the cors library, which is a middleware to enable Cross-Origin Resource Sharing.
import cors from 'cors';
// Import the questions data from the specified path. The .js extension is used for ES modules.
import { questions } from '../../src/data/questions.js';

// Create an instance of an Express application.
const app = express();
// Enable CORS for all routes, allowing requests from different origins.
app.use(cors());
// Use the express.json() middleware to parse incoming requests with JSON payloads.
app.use(express.json());

// Define the port number on which the server will listen.
const PORT = 3002;

// Define a GET endpoint for '/api/questions'.
app.get('/api/questions', (req, res) => {
  // Respond with the entire list of questions in JSON format.
  res.json(questions);
});

// Define a GET endpoint for '/api/questions/:id' to retrieve a specific question by its ID.
app.get('/api/questions/:id', (req, res) => {
  // Find a question in the 'questions' array whose ID matches the 'id' parameter from the request URL.
  // parseInt is used to convert the 'id' parameter (which is a string) to an integer for comparison.
  const question = questions.find(q => q.id === parseInt(req.params.id));
  // If a question with the given ID is found...
  if (question) {
    // Respond with the found question object in JSON format.
    res.json(question);
  } else {
    // If no question is found, respond with a 404 Not Found status and an error message in JSON format.
    res.status(404).json({ error: 'Question not found' });
  }
});

// Start the server and make it listen for incoming requests on the specified PORT.
app.listen(PORT, () => {
  // Log a message to the console indicating that the server is running and on which port.
  console.log(`Questions service running on port ${PORT}`);
});