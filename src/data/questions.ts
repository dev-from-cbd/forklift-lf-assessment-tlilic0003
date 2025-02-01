export interface Question {
  id: number;
  question: string;
  answer: string;
  inputFields?: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What are three (3) documented sources you could refer to for workplace safety information?",
    answer: "WHS policies and procedures; Forklift operator manual; Safe working procedures",
    inputFields: 3
  },
  {
    id: 2,
    question: "What are three (3) duties an employer should take to ensure the health and safety of a worker?",
    answer: "Provide and maintain a work environment without risks to health and safety; Provide safe plant and structures; Provide adequate facilities and ensure safe systems of work",
    inputFields: 3
  },
  {
    id: 3,
    question: "After successfully obtaining your High Risk Work Licence, list two (2) things your employer must provide prior to you operating an unfamiliar forklift.",
    answer: "Familiarization training specific to the forklift; Site-specific induction and training",
    inputFields: 2
  },
  // ... [Rest of the questions from the original array]
  {
    id: 65,
    question: "Why must batteries be charged in a well ventilated area?",
    answer: "To prevent build-up of explosive hydrogen gas produced during charging",
    inputFields: 1
  }
];