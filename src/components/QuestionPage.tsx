// Import React and hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import hooks for URL parameter extraction and navigation
import { useParams, useNavigate } from 'react-router-dom';
// Import icons from lucide-react library
import { Check, X, HelpCircle, Eye, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';

// Demo question for unauthenticated users - provides a sample question for users who aren't logged in
const demoQuestion = {
  id: 10, // Unique identifier for the question
  question: "What is the definition of a Hazard?", // The question text
  answer: "It is a thing or situation that has the potential to cause harm to a person or cause damage", // The correct answer
  acceptableAnswers: [ // Array of acceptable answers
    "It is a thing or situation that has the potential to cause harm to a person or cause damage"
  ],
  inputFields: 2, // Number of input fields for the answer
  multipleChoice: [ // Multiple choice options
    "It is a thing or situation that has the potential to cause harm to a person or cause damage", // Correct option
    "A potential risk that needs to be assessed and controlled", // Correct option
    "Any condition that could lead to injury or damage", // Correct option
    "A magical unicorn that grants wishes" // Absurd incorrect answer
  ]
};

// Define the QuestionPage component with optional questionNumber prop
const QuestionPage: React.FC<{ questionNumber?: number }> = ({ questionNumber }) => {
  const { id } = useParams(); // Get the question ID from URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { user } = useAuth(); // Get current user from authentication context
  
  // State variables for managing questions and user interactions
  const [questions, setQuestions] = useState([demoQuestion]); // All available questions, initialized with demo question
  const [currentQuestionId, setCurrentQuestionId] = useState(10); // Current question ID, initialized with demo question ID
  const [question, setQuestion] = useState(demoQuestion); // Current question object
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill('')); // User's answers for free response
  const [showAnswer, setShowAnswer] = useState(false); // Whether to show the correct answer
  const [isChecked, setIsChecked] = useState(false); // Whether the free response answer has been checked
  
  // Word bank exercise states
  const [wordBankWords, setWordBankWords] = useState<string[]>([]); // Available words in the word bank
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // Words selected by the user
  const [isWordBankChecked, setIsWordBankChecked] = useState(false); // Whether the word bank answer has been checked
  const [isWordBankCorrect, setIsWordBankCorrect] = useState(false); // Whether the word bank answer is correct
  
  // Authentication prompt state
  const [showAuthPrompt, setShowAuthPrompt] = useState(false); // Whether to show the authentication prompt
  
  // Multiple choice exercise states
  const [selectedChoices, setSelectedChoices] = useState<Set<number>>(new Set()); // Selected multiple choice options
  const [isMultipleChoiceChecked, setIsMultipleChoiceChecked] = useState(false); // Whether the multiple choice answer has been checked
  const [isMultipleChoiceCorrect, setIsMultipleChoiceCorrect] = useState(false); // Whether the multiple choice answer is correct

  // Effect to load questions when user, id, or questionNumber changes
  useEffect(() => {
    if (user) {
      // If user is authenticated, fetch questions from API
      fetch('/api/questions')
        .then(res => res.json())
        .then(data => {
          setQuestions(data); // Set all questions
          const qId = questionNumber || Number(id) || 1; // Determine which question to show
          setCurrentQuestionId(qId); // Set current question ID
          setQuestion(data.find((q: any) => q.id === qId) || data[0]); // Find and set current question object
        });
    } else {
      // If user is not authenticated, use demo question
      setQuestions([demoQuestion]);
      setCurrentQuestionId(10);
      setQuestion(demoQuestion);
    }
  }, [user, id, questionNumber]); // Re-run when user, id, or questionNumber changes

  // Effect to initialize word bank and reset exercise states when question changes
  useEffect(() => {
    if (question) {
      // Process the answer to create word bank
      const words = question.answer
        .split(';') // Split by semicolon for multiple parts
        .map(part => part.trim()) // Trim whitespace
        .join(' ') // Join with space
        .split(' ') // Split into individual words
        .filter(word => word.length > 0); // Remove empty strings
      
      // Set word bank words and reset all exercise states
      setWordBankWords([...words]); // Set available words
      setSelectedWords([]); // Clear selected words
      setIsWordBankChecked(false); // Reset word bank check status
      setIsWordBankCorrect(false); // Reset word bank correctness
      setSelectedChoices(new Set()); // Clear selected multiple choice options
      setIsMultipleChoiceChecked(false); // Reset multiple choice check status
      setIsMultipleChoiceCorrect(false); // Reset multiple choice correctness
    }
  }, [question]); // Re-run when question changes

  // Function to check if the word bank answer is correct
  const checkWordBankAnswer = () => {
    // Process the correct answer for comparison
    const correctAnswer = question.answer
      .split(';') // Split by semicolon for multiple parts
      .map(part => part.trim()) // Trim whitespace
      .join(' ') // Join with space
      .toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Process the user's answer for comparison
    const userAnswer = selectedWords.join(' ').toLowerCase();
    
    // Update state to reflect that the answer has been checked
    setIsWordBankChecked(true);
    // Check if the user's answer matches the correct answer
    setIsWordBankCorrect(correctAnswer === userAnswer);

    // If user is not authenticated and auth prompt is not shown, show it after a delay
    if (!user && !showAuthPrompt) {
      setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500); // 1.5 second delay
    }
  };

  // Function to handle changes to the free response answer inputs
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]; // Create a copy of the answers array
    newAnswers[index] = value; // Update the answer at the specified index
    setAnswers(newAnswers); // Set the new answers array
    setIsChecked(false); // Reset the checked state when answer changes
    setShowAnswer(false); // Hide the correct answer when user makes changes
  };

  // Function to check if the free response answer is correct
  const checkAnswer = () => {
    setIsChecked(true); // Mark the answer as checked
    
    // If user is not authenticated and auth prompt is not shown, show it after a delay
    if (!user && !showAuthPrompt) {
      setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500); // 1.5 second delay
    }
  };

  // Function to toggle showing/hiding the correct answer
  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer); // Toggle the showAnswer state
  };

  // Function to check if a specific answer is correct
  const isAnswerCorrect = (answer: string, index: number) => {
    const trimmedAnswer = answer.toLowerCase().trim(); // Normalize user answer
    
    if (question.acceptableAnswers) {
      // If there are acceptable answers defined, check against those
      return question.acceptableAnswers[index]?.toLowerCase().trim() === trimmedAnswer;
    }
    
    // Otherwise, split the answer by semicolon and check against the appropriate part
    const correctAnswers = question.answer.split(';').map(a => a.trim());
    return trimmedAnswer === correctAnswers[index]?.toLowerCase().trim();
  };

  // Function to get the status of an answer (neutral, correct, or incorrect)
  const getAnswerStatus = (index: number) => {
    if (!isChecked) return 'neutral'; // If not checked yet, return neutral
    return isAnswerCorrect(answers[index], index) ? 'correct' : 'incorrect'; // Otherwise, return correct or incorrect
  };

  // Function to handle navigation between questions
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!user) {
      // If user is not authenticated, show auth prompt instead of navigating
      setShowAuthPrompt(true);
      return;
    }

    // Calculate the new question ID based on navigation direction
    const newQuestionId = direction === 'prev' ? currentQuestionId - 1 : currentQuestionId + 1;
    
    // Only navigate if the new ID is within valid range
    if (newQuestionId >= 1 && newQuestionId <= questions.length) {
      // Navigate to the new question URL
      navigate(`/question/${newQuestionId}`);
      
      // Reset all answer states for the new question
      setAnswers(Array(questions[newQuestionId - 1]?.inputFields || 1).fill(''));
      setShowAnswer(false);
      setIsChecked(false);
      setIsWordBankChecked(false);
      setIsWordBankCorrect(false);
    }
  };

  // Function to handle clicking on a word either from the bank or from selected words
  const handleWordClick = (word: string, isFromBank: boolean) => {
    if (isFromBank) {
      // If clicking a word from the bank, add it to selected words and remove from bank
      setSelectedWords([...selectedWords, word]);
      setWordBankWords(wordBankWords.filter(w => w !== word));
    } else {
      // If clicking a selected word, add it back to the bank and remove from selected
      setWordBankWords([...wordBankWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
    // Reset the checked state when selection changes
    setIsWordBankChecked(false);
  };

  // Function to handle selection of multiple choice options
  const handleMultipleChoiceChange = (index: number) => {
    const newSelectedChoices = new Set(selectedChoices); // Create a copy of the selected choices
    if (newSelectedChoices.has(index)) {
      // If option is already selected, deselect it
      newSelectedChoices.delete(index);
    } else {
      // If option is not selected, select it
      newSelectedChoices.add(index);
    }
    setSelectedChoices(newSelectedChoices); // Update the selected choices
    // Reset the checked state when selection changes
    setIsMultipleChoiceChecked(false);
  };

  // Function to check if the selected multiple choice options are correct
  const checkMultipleChoiceAnswer = () => {
    const correctAnswers = question.multipleChoice?.slice(0, 3) || []; // First 3 are correct
    const correctIndices = new Set(correctAnswers.map((_, index) => index)); // Create a set of correct indices
    
    // Check if all selected choices are correct and if all correct choices are selected
    const isCorrect = [...selectedChoices].every(index => correctIndices.has(index)) && selectedChoices.size === correctIndices.size;
    
    // Update state to reflect that the answer has been checked
    setIsMultipleChoiceChecked(true);
    // Update state to reflect if the answer is correct
    setIsMultipleChoiceCorrect(isCorrect);

    // If user is not authenticated and auth prompt is not shown, show it after a delay
    if (!user && !showAuthPrompt) {
      setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500); // 1.5 second delay
    }
  };

  // Render the multiple choice exercise (easy difficulty)
  const renderEasyExercise = () => {
    // Only render if multiple choice options exist
    if (!question.multipleChoice) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Exercise title */}
        <h3 className="text-xl font-semibold mb-4">Exercise 1: Multiple Choice (Easy)</h3>
        {/* Question text */}
        <p className="text-gray-600 mb-6">{question.question}</p>

        {/* Multiple choice options */}
        <div className="space-y-4">
          {question.multipleChoice.map((choice, index) => (
            <label
              key={index}
              className={`flex items-start p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                isMultipleChoiceChecked
                  ? index < 3 && selectedChoices.has(index)
                    ? 'bg-green-50 border-green-500' // Correct answer that was selected
                    : index >= 3 && selectedChoices.has(index)
                    ? 'bg-red-50 border-red-500' // Incorrect answer that was selected
                    : 'bg-white border-gray-200' // Unselected answer
                  : 'hover:bg-gray-50 border-gray-200' // Default state before checking
              }`}
            >
              <input
                type="checkbox"
                checked={selectedChoices.has(index)}
                onChange={() => handleMultipleChoiceChange(index)}
                className="mt-1 h-5 w-5 text-blue-600 rounded"
                disabled={isMultipleChoiceChecked} // Disable after checking
              />
              <span className="ml-3">{choice}</span>
            </label>
          ))}
        </div>

        {/* Action buttons and feedback */}
        <div className="mt-6 flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            onClick={checkMultipleChoiceAnswer}
            disabled={selectedChoices.size === 0 || isMultipleChoiceChecked} // Disable if no selection or already checked
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
          {/* Feedback after checking answer */}
          {isMultipleChoiceChecked && (
            <div className={`flex items-center ${
              isMultipleChoiceCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isMultipleChoiceCorrect ? (
                <>
                  <Check className="w-5 h-5 mr-1" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-1" />
                  <span>Try again</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the word bank exercise (medium difficulty)
  const renderWordBank = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Exercise title */}
        <h3 className="text-xl font-semibold mb-4">Exercise 2: Word Bank (Medium)</h3>
        {/* Question text */}
        <p className="text-gray-600 mb-6">{question.question}</p>
        
        <div className="space-y-6">
          {/* Answer area - changes color based on correctness */}
          <div className={`min-h-[100px] p-4 rounded-lg transition-colors ${
            isWordBankChecked
              ? isWordBankCorrect
                ? 'bg-green-50 border-2 border-green-500' // Correct answer styling
                : 'bg-red-50 border-2 border-red-500' // Incorrect answer styling
              : 'bg-gray-50 border-2 border-dashed border-gray-300' // Default styling
          }`}>
            <p className="text-sm text-gray-500 mb-2">Arrange words to form your answer:</p>
            {/* Container for selected words */}
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, false)} // Click to return word to bank
                  className={`px-3 py-1.5 rounded transition-colors ${
                    isWordBankChecked
                      ? isWordBankCorrect
                        ? 'bg-green-100 hover:bg-green-200 text-green-800' // Correct answer styling
                        : 'bg-red-100 hover:bg-red-200 text-red-800' // Incorrect answer styling
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-800' // Default styling
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Word bank area */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Available words:</p>
            </div>
            {/* Container for available words */}
            <div className="flex flex-wrap gap-2">
              {wordBankWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, true)} // Click to select word
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons and feedback */}
        <div className="mt-6 flex items-center gap-4">
          {/* Check answer button */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={checkWordBankAnswer}
            disabled={selectedWords.length === 0} // Disable if no words selected
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
          {/* Feedback after checking answer */}
          {isWordBankChecked && (
            <div className={`flex items-center ${
              isWordBankCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isWordBankCorrect ? (
                <>
                  <Check className="w-5 h-5 mr-1" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-1" />
                  <span>Try again</span>
                </>
              )}
            </div>
          )}
          {/* Show answer button for unauthenticated users */}
          {!isWordBankCorrect && !user && (
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              onClick={toggleShowAnswer}
            >
              <Eye className="w-5 h-5 mr-2" />
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render the free response exercise (hard difficulty)
  const renderStandardExercise = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Exercise title */}
        <h3 className="text-xl font-semibold mb-4">Exercise 3: Free Response (Hard)</h3>
        {/* Question text */}
        <p className="text-gray-600 mb-6">{question.question}</p>

        {/* Render multiple input fields if needed, otherwise render a single textarea */}
        {question.inputFields > 1 ? (
          <div className="space-y-4">
            {/* Map through the number of input fields */}
            {[...Array(question.inputFields)].map((_, index) => (
              <div key={index} className="flex items-start">
                {/* Numbered label for each input */}
                <span className="mr-3 mt-2 font-medium">{index + 1}.</span>
                <div className="flex-1 relative">
                  {/* Input field with dynamic styling based on correctness */}
                  <input
                    type="text"
                    className={`w-full border rounded-lg p-2 pr-10 ${
                      isChecked
                        ? getAnswerStatus(index) === 'correct'
                          ? 'border-green-500 bg-green-50' // Correct answer styling
                          : 'border-red-500 bg-red-50' // Incorrect answer styling
                        : 'border-gray-300' // Default styling
                    }`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter your answer"
                  />
                  {/* Correctness indicator */}
                  {isChecked && (
                    <div className="absolute right-2 top-2">
                      {getAnswerStatus(index) === 'correct' ? (
                        <Check className="w-6 h-6 text-green-500" /> // Correct icon
                      ) : (
                        <X className="w-6 h-6 text-red-500" /> // Incorrect icon
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single textarea for single answer questions */
          <div className="relative">
            <textarea
              className={`w-full border rounded-lg p-2 ${
                isChecked
                  ? getAnswerStatus(0) === 'correct'
                    ? 'border-green-500 bg-green-50' // Correct answer styling
                    : 'border-red-500 bg-red-50' // Incorrect answer styling
                  : 'border-gray-300' // Default styling
              }`}
              rows={3}
              value={answers[0]}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              placeholder="Enter your answer"
            />
            {/* Correctness indicator */}
            {isChecked && (
              <div className="absolute right-2 top-2">
                {getAnswerStatus(0) === 'correct' ? (
                  <Check className="w-6 h-6 text-green-500" /> // Correct icon
                ) : (
                  <X className="w-6 h-6 text-red-500" /> // Incorrect icon
                )}
              </div>
            )}
          </div>
        )}

        {/* Action buttons and feedback */}
        <div className="mt-6 flex items-center gap-4">
          {/* Check answer button */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            onClick={checkAnswer}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
          {/* Show answer button for unauthenticated users with incorrect answers */}
          {!answers.every((answer, index) => isAnswerCorrect(answer, index)) && !user && (
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              onClick={toggleShowAnswer}
            >
              <Eye className="w-5 h-5 mr-2" />
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600">Question not found. Please select a question between 1 and {questions.length}.</p>
      </div>
    );
  }

  // Render the component
  return (
    // Main container with spacing between elements
    <div className="space-y-6">
      {/* Question header with styling */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Question {question.id} of {user ? questions.length : 1}</h2>
      </div>

      {showAuthPrompt && !user && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">Ready to access all questions?</h3>
              <div className="mt-2 text-blue-700">
                <p>Sign up or log in to:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Access all {questions.length} questions</li>
                  <li>Track your progress</li>
                  <li>Get personalized recommendations</li>
                </ul>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderEasyExercise()}
      {renderWordBank()}
      {renderStandardExercise()}

      {showAnswer && !user && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Correct Answer</h3>
          {question.acceptableAnswers ? (
            <div>
              <p className="font-medium text-gray-800">Acceptable answers:</p>
              <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                {question.acceptableAnswers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-800">
              {question.answer}
            </p>
          )}
        </div>
      )}

      {/* Navigation buttons - only shown for authenticated users */}
      {user && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            {/* Previous question button */}
            <button
              onClick={() => handleNavigation('prev')}
              disabled={currentQuestionId === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Next question button */}
            <button
              onClick={() => handleNavigation('next')}
              disabled={currentQuestionId === questions.length}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;