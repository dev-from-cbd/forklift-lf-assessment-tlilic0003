// Import React and necessary hooks for component state and side effects
import React, { useState, useEffect } from 'react';
// Import useParams hook to access URL parameters
import { useParams } from 'react-router-dom';
// Import Lucide icons for UI elements
import { Check, X, HelpCircle, Eye, ChevronLeft, ChevronRight, Shuffle, AlertCircle } from 'lucide-react';
// Import questions data from local data file
import { questions } from '../data/questions';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define interface for QuestionPage component props
interface QuestionPageProps {
  questionNumber?: number; // Optional prop to directly specify question number
}

// Define QuestionPage component with typed props
const QuestionPage: React.FC<QuestionPageProps> = ({ questionNumber }) => {
  // Get question ID from URL parameters
  const { id } = useParams();
  // Initialize navigate function for routing
  const navigate = useNavigate();
  // Determine current question ID from props or URL params, defaulting to 1
  const currentQuestionId = questionNumber || Number(id) || 1;
  // Get the current question object from questions array
  const question = questions[currentQuestionId - 1];
  
  // State for storing user's answers as an array of strings
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill(''));
  // State for toggling answer visibility
  const [showAnswer, setShowAnswer] = useState(false);
  // State for tracking if answer has been checked
  const [isChecked, setIsChecked] = useState(false);
  // State for storing shuffled words for word bank exercise
  const [wordBankWords, setWordBankWords] = useState<string[]>([]);
  // State for storing words selected by user from word bank
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // State for tracking if word bank answer has been checked
  const [isWordBankChecked, setIsWordBankChecked] = useState(false);
  // State for tracking if word bank answer is correct
  const [isWordBankCorrect, setIsWordBankCorrect] = useState(false);

  // Effect hook to initialize word bank when question changes
  useEffect(() => {
    if (question) {
      // Process the answer string into individual words
      const words = question.answer
        .split(';') // Split by semicolons
        .map(part => part.trim()) // Trim whitespace
        .join(' ') // Join with spaces
        .split(' ') // Split into individual words
        .filter(word => word.length > 0); // Remove empty strings
      
      // Shuffle the words randomly
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      // Update state with shuffled words
      setWordBankWords(shuffled);
      // Reset selected words
      setSelectedWords([]);
      // Reset check states
      setIsWordBankChecked(false);
      setIsWordBankCorrect(false);
    }
  }, [question]); // Re-run when question changes

  // Function to check if word bank answer is correct
  const checkWordBankAnswer = () => {
    // Format correct answer for comparison
    const correctAnswer = question.answer
      .split(';')
      .map(part => part.trim())
      .join(' ')
      .toLowerCase();

    // Format user's answer for comparison
    const userAnswer = selectedWords.join(' ').toLowerCase();
    // Set checked state to true
    setIsWordBankChecked(true);
    // Compare answers and set correctness state
    setIsWordBankCorrect(correctAnswer === userAnswer);
  };

  // Handler for when user changes an answer in the input fields
  const handleAnswerChange = (index: number, value: string) => {
    // Create a copy of the answers array
    const newAnswers = [...answers];
    // Update the value at the specified index
    newAnswers[index] = value;
    // Update state with new answers
    setAnswers(newAnswers);
    // Reset check state
    setIsChecked(false);
    // Hide answer
    setShowAnswer(false);
  };

  // Function to check if user's answers are correct
  const checkAnswer = () => {
    // Set checked state to true
    setIsChecked(true);
  };

  // Function to toggle answer visibility
  const toggleShowAnswer = () => {
    // Toggle show answer state
    setShowAnswer(!showAnswer);
  };

  // Function to check if a specific answer is correct
  const isAnswerCorrect = (answer: string, index: number) => {
    // Normalize user's answer for comparison
    const trimmedAnswer = answer.toLowerCase().trim();
    
    // If question has acceptable answers array, use it for comparison
    if (question.acceptableAnswers) {
      return question.acceptableAnswers[index]?.toLowerCase().trim() === trimmedAnswer;
    }
    
    // Otherwise, split the answer string by semicolons and compare
    const correctAnswers = question.answer.split(';').map(a => a.trim());
    return trimmedAnswer === correctAnswers[index]?.toLowerCase().trim();
  };

  // Function to get the status of an answer (neutral, correct, incorrect)
  const getAnswerStatus = (index: number) => {
    // If not checked yet, return neutral
    if (!isChecked) return 'neutral';
    // Otherwise, return correct or incorrect based on answer
    return isAnswerCorrect(answers[index], index) ? 'correct' : 'incorrect';
  };

  // Handler for navigating to previous or next question
  const handleNavigation = (direction: 'prev' | 'next') => {
    // Calculate new question ID based on direction
    const newQuestionId = direction === 'prev' ? currentQuestionId - 1 : currentQuestionId + 1;
    // Check if new ID is within valid range
    if (newQuestionId >= 1 && newQuestionId <= questions.length) {
      // Navigate to new question
      navigate(`/question/${newQuestionId}`);
      // Reset answers array for new question
      setAnswers(Array(questions[newQuestionId - 1]?.inputFields || 1).fill(''));
      // Reset UI states
      setShowAnswer(false);
      setIsChecked(false);
      setIsWordBankChecked(false);
      setIsWordBankCorrect(false);
    }
  };

  // Handler for when user clicks a word in word bank or selected area
  const handleWordClick = (word: string, isFromBank: boolean) => {
    if (isFromBank) {
      // If clicking from word bank, move to selected words
      setSelectedWords([...selectedWords, word]);
      setWordBankWords(wordBankWords.filter(w => w !== word));
    } else {
      // If clicking from selected words, move back to word bank
      setWordBankWords([...wordBankWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
    // Reset check state
    setIsWordBankChecked(false);
  };

  // Function to shuffle the word bank
  const shuffleWordBank = () => {
    // Randomize word bank order
    setWordBankWords([...wordBankWords].sort(() => Math.random() - 0.5));
  };

  // Function to render the word bank exercise UI
  const renderWordBank = () => {
    return (
      // Container for word bank exercise
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Exercise title */}
        <h3 className="text-xl font-semibold mb-4">Exercise 1: Word Bank</h3>
        {/* Question text */}
        <p className="text-gray-600 mb-6">{question.question}</p>
        
        <div className="space-y-6">
          {/* Selected words area with dynamic styling based on check state */}
          <div className={`min-h-[100px] p-4 rounded-lg transition-colors ${
            isWordBankChecked
              ? isWordBankCorrect
                ? 'bg-green-50 border-2 border-green-500' // Correct answer styling
                : 'bg-red-50 border-2 border-red-500' // Incorrect answer styling
              : 'bg-gray-50 border-2 border-dashed border-gray-300' // Neutral styling
          }`}>
            {/* Instruction text */}
            <p className="text-sm text-gray-500 mb-2">Arrange words to form your answer:</p>
            {/* Container for selected words */}
            <div className="flex flex-wrap gap-2">
              {/* Map through selected words and render buttons */}
              {selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, false)}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    isWordBankChecked
                      ? isWordBankCorrect
                        ? 'bg-green-100 hover:bg-green-200 text-green-800' // Correct styling
                        : 'bg-red-100 hover:bg-red-200 text-red-800' // Incorrect styling
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-800' // Neutral styling
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Word bank area */}
          <div className="p-4 bg-gray-50 rounded-lg">
            {/* Header with title and shuffle button */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Available words:</p>
              {/* Only show shuffle button if more than one word */}
              {wordBankWords.length > 1 && (
                <button
                  onClick={shuffleWordBank}
                  className="flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Words
                </button>
              )}
            </div>
            {/* Container for word bank words */}
            <div className="flex flex-wrap gap-2">
              {/* Map through word bank words and render buttons */}
              {wordBankWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, true)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons and feedback area */}
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
          {/* Feedback message when checked */}
          {isWordBankChecked && (
            <div className={`flex items-center ${
              isWordBankCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isWordBankCorrect ? (
                // Correct answer feedback
                <>
                  <Check className="w-5 h-5 mr-1" />
                  <span>Correct!</span>
                </>
              ) : (
                // Incorrect answer feedback
                <>
                  <AlertCircle className="w-5 h-5 mr-1" />
                  <span>Try again</span>
                </>
              )}
            </div>
          )}
          {/* Show/hide answer button */}
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center ml-auto"
            onClick={toggleShowAnswer}
          >
            <Eye className="w-5 h-5 mr-2" />
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      </div>
    );
  };

  // Function to render the standard free response exercise UI
  const renderStandardExercise = () => {
    return (
      // Container for standard exercise
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Exercise title */}
        <h3 className="text-xl font-semibold mb-4">Exercise 2: Free Response</h3>
        {/* Question text */}
        <p className="text-gray-600 mb-6">{question.question}</p>

        {/* Render multiple input fields if needed, otherwise render single textarea */}
        {question.inputFields > 1 ? (
          <div className="space-y-4">
            {/* Map through number of input fields and render each */}
            {[...Array(question.inputFields)].map((_, index) => (
              <div key={index} className="flex items-start">
                {/* Numbered label */}
                <span className="mr-3 mt-2 font-medium">{index + 1}.</span>
                <div className="flex-1 relative">
                  {/* Input field with dynamic styling based on check state */}
                  <input
                    type="text"
                    className={`w-full border rounded-lg p-2 pr-10 ${
                      isChecked
                        ? getAnswerStatus(index) === 'correct'
                          ? 'border-green-500 bg-green-50' // Correct styling
                          : 'border-red-500 bg-red-50' // Incorrect styling
                        : 'border-gray-300' // Neutral styling
                    }`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter your answer"
                  />
                  {/* Feedback icon when checked */}
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
          // Single textarea for single answer questions
          <div className="relative">
            <textarea
              className={`w-full border rounded-lg p-2 ${
                isChecked
                  ? getAnswerStatus(0) === 'correct'
                    ? 'border-green-500 bg-green-50' // Correct styling
                    : 'border-red-500 bg-red-50' // Incorrect styling
                  : 'border-gray-300' // Neutral styling
              }`}
              rows={3}
              value={answers[0]}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              placeholder="Enter your answer"
            />
            {/* Feedback icon when checked */}
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

        {/* Action buttons */}
        <div className="mt-6 flex items-center gap-4">
          {/* Check answer button */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            onClick={checkAnswer}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
          {/* Show/hide answer button */}
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center ml-auto"
            onClick={toggleShowAnswer}
          >
            <Eye className="w-5 h-5 mr-2" />
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      </div>
    );
  };

  // Render error message if question not found
  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600">Question not found. Please select a question between 1 and {questions.length}.</p>
      </div>
    );
  }

  // Function to calculate which page numbers to show in pagination
  const getVisiblePages = () => {
    const totalPages = questions.length;
    const currentPage = currentQuestionId;
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l: number;
    
    // Always include first page
    range.push(1);
    
    // Add pages around current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    
    // Always include last page if there's more than one page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    // Add dots for page gaps
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          // If gap is exactly 1 page, show that page
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          // If gap is more than 1 page, show dots
          rangeWithDots.push('...');
        }
      }
      // Add current page to result
      rangeWithDots.push(i);
      l = i;
    }
    
    return rangeWithDots;
  };

  // Main component render
  return (
    <div className="space-y-6">
      {/* Header showing question number */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Question {question.id} of {questions.length}</h2>
      </div>

      {/* Render both exercise types */}
      {renderWordBank()}
      {renderStandardExercise()}

      {/* Show answer section if enabled */}
      {showAnswer && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Correct Answer</h3>
          {question.acceptableAnswers ? (
            // If question has multiple acceptable answers, show as list
            <div>
              <p className="font-medium text-gray-800">Acceptable answers:</p>
              <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                {question.acceptableAnswers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          ) : (
            // Otherwise show single answer
            <p className="text-gray-800">
              {question.answer}
            </p>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => handleNavigation('prev')}
            disabled={currentQuestionId === 1} // Disable if on first question
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Page number buttons */}
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                // Render page number button
                <button
                  onClick={() => navigate(`/question/${page}`)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    page === currentQuestionId
                      ? 'bg-blue-600 text-white' // Current page styling
                      : 'hover:bg-gray-100' // Other page styling
                  }`}
                >
                  {page}
                </button>
              ) : (
                // Render dots for page gaps
                <span className="px-2">...</span>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <button
            onClick={() => handleNavigation('next')}
            disabled={currentQuestionId === questions.length} // Disable if on last question
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the QuestionPage component as default
export default QuestionPage;