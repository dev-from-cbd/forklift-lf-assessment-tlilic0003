// Defines the Question interface for type safety
// Each question will have these properties
interface Question {
  // Unique identifier for the question
  id: number;
  
  // The actual question text to be displayed
  question: string;
  
  // The correct answer to the question
  answer: string;
  
  // Optional: Number of input fields needed for this question
  inputFields?: number;
  
  // Optional: Array of acceptable alternative answers
  acceptableAnswers?: string[];
  
  // Optional: Prefilled answers keyed by input field index
  prefilledAnswers?: { [key: number]: string };
  
  // Optional: Special display format (currently only 'hierarchy' is supported)
  displayFormat?: 'hierarchy';
  
  // Optional: Array of multiple choice options (added for Easy mode)
  multipleChoice?: string[];
}