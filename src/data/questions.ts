import { encrypt } from '../utils/encryption';
import type { Question } from '../types/questions';

// Define the Question interface
export interface Question {
  id: number;
  question: string;
  answer: string;
  inputFields?: number;
  acceptableAnswers?: string[];
  prefilledAnswers?: { [key: number]: string };
  displayFormat?: 'hierarchy';
}

// Original questions array
const originalQuestions: Question[] = [
  {
    id: 1,
    question: "What safety feature on the Order Picking Forklift must be closed at all times when operating?",
    answer: "Handrail",
    acceptableAnswers: [
      "Handrail"
    ],
    inputFields: 1
  },
  // ... rest of the questions array
];

// Encrypt the questions
export const encryptedQuestions = encrypt(originalQuestions);

// Export the encrypted questions
export const questions = originalQuestions; // During development we use unencrypted version