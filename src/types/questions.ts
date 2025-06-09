export interface Question {
  id: number;
  question: string;
  answer: string;
  inputFields?: number;
  acceptableAnswers?: string[];
  prefilledAnswers?: { [key: number]: string };
  displayFormat?: 'hierarchy';
  multipleChoice?: string[]; // Added for Easy mode
}