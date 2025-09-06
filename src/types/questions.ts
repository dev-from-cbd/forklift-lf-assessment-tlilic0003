// Export the Question interface to be used throughout the application
export interface Question {
  // Unique identifier for each question
  id: number;
  // The actual question text that will be displayed to the user
  question: string;
  // The correct answer to the question
  answer: string;
  // Optional: Number of input fields to display for this question (for multi-part answers)
  inputFields?: number;
  // Optional: Array of acceptable alternative answers that will be considered correct
  acceptableAnswers?: string[];
  // Optional: Pre-filled answers for specific input fields, keyed by field index
  prefilledAnswers?: { [key: number]: string };
  // Optional: Display format for the question, currently only supports 'hierarchy'
  displayFormat?: 'hierarchy';
  // Optional: Array of choices for multiple choice questions (used in Easy mode)
  multipleChoice?: string[];
}