// Import the encryption utility function from the encryption utility file
import { encrypt } from '../utils/encryption';
// Import the Question type definition from the questions types file
import type { Question } from '../types/questions';

// The Question interface is imported from '../types/questions' and has the following structure:
// - id: Unique identifier for each question
// - question: The actual question text that will be displayed to the user
// - answer: The correct answer to the question
// - inputFields?: Number of input fields to display for this question (for multi-part answers)
// - acceptableAnswers?: Array of acceptable alternative answers that will be considered correct
// - prefilledAnswers?: Pre-filled answers for specific input fields, keyed by field index
// - displayFormat?: Display format for the question, currently only supports 'hierarchy'

// Define the original array of questions with their properties
const originalQuestions: Question[] = [
  {
    // First question with ID 1
    id: 1,
    // The question text about forklift safety feature
    question: "What safety feature on the Order Picking Forklift must be closed at all times when operating?",
    // The correct answer to the question
    answer: "Handrail",
    // Array of acceptable answers (in this case, only one)
    acceptableAnswers: [
      "Handrail"
    ],
    // Number of input fields to display for this question
    inputFields: 1
  },
  // ... rest of the questions array (additional questions would be listed here)
];

// Create and export an encrypted version of the questions array for production use
export const encryptedQuestions = encrypt(originalQuestions);

// Export the original unencrypted questions array for development purposes
export const questions = originalQuestions; // During development we use unencrypted version