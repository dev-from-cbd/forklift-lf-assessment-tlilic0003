import { encrypt } from '../utils/encryption';

// Import Question type from types directory
import type { Question } from '../types/questions';

// Define the Question interface that extends the base Question type
// This specifies the structure of question objects in our application
export interface Question {
  id: number; // Unique identifier for the question
  question: string; // The question text
  answer: string; // The correct answer to the question
  inputFields?: number; // Optional number of input fields needed for the answer
  acceptableAnswers?: string[]; // Optional array of acceptable answer variations
  prefilledAnswers?: { [key: number]: string }; // Optional dictionary of prefilled answers
  displayFormat?: 'hierarchy'; // Optional display format specification
}

// Array containing all the original questions
// This is the unencrypted version used during development
const originalQuestions: Question[] = [
  {
    id: 1, // Question ID
    question: "What safety feature on the Order Picking Forklift must be closed at all times when operating?",
    answer: "Handrail", // Correct answer
    acceptableAnswers: [ // Alternative acceptable answers
      "Handrail"
    ],
    inputFields: 1 // Number of input fields required
  },
  // ... rest of the questions would follow the same structure
];

// Encrypt the questions for production use
// This would use the encryption utility to secure the questions
export const encryptedQuestions = encrypt(originalQuestions);

// Export the questions array
// During development we use the unencrypted version for easier debugging
export const questions = originalQuestions;