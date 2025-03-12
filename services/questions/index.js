// Import the Express framework for building the server
import express from "express";

// Import CORS middleware to allow cross-origin requests
import cors from "cors";

// Import the questions dataset from the specified file
import { questions } from "../../src/data/questions.js";

// Create an instance of an Express application
const app = express();

// Enable CORS to allow requests from different origins
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// Define the port number the server will listen on
const PORT = 3002;

// Define a route to retrieve all questions
app.get("/api/questions", (req, res) => {
  res.json(questions); // Respond with the questions array in JSON format
});

// Define a route to retrieve a specific question by its ID
app.get("/api/questions/:id", (req, res) => {
  // Find the question that matches the requested ID
  const question = questions.find((q) => q.id === parseInt(req.params.id));

  // If the question is found, return it as JSON
  if (question) {
    res.json(question);
  } else {
    // If not found, return a 404 error with a message
    res.status(404).json({ error: "Question not found" });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Questions service running on port ${PORT}`); // Log server startup message
});
