// Import React library with useState and useEffect hooks
import React, { useState, useEffect } from 'react';
// Import routing hooks for navigation and URL parameters
import { useParams, useNavigate } from 'react-router-dom';
// Import various icons from lucide-react for UI elements
import { Check, X, HelpCircle, Eye, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';

// Demo question for unauthenticated users
const demoQuestion = {
  // Unique identifier for the demo question
  id: 10,
  // The question text displayed to users
  question: "What is the definition of a Hazard?",
  // The correct answer for the question
  answer: "It is a thing or situation that has the potential to cause harm to a person or cause damage",
  // Array of acceptable answer variations
  acceptableAnswers: [
    "It is a thing or situation that has the potential to cause harm to a person or cause damage"
  ],
  // Number of input fields for this question
  inputFields: 2,
  // Multiple choice options for the question
  multipleChoice: [
    "It is a thing or situation that has the potential to cause harm to a person or cause damage",
    "A potential risk that needs to be assessed and controlled",
    "Any condition that could lead to injury or damage",
    "A magical unicorn that grants wishes" // Absurd incorrect answer
  ]
};

// Define QuestionPage functional component with optional questionNumber prop
const QuestionPage: React.FC<{ questionNumber?: number }> = ({ questionNumber }) => {
  // Extract id parameter from URL
  const { id } = useParams();
  // Get navigation function for programmatic routing
  const navigate = useNavigate();
  // Get current user from authentication context
  const { user } = useAuth();
  // State for storing all questions, initialized with demo question
  const [questions, setQuestions] = useState([demoQuestion]);
  // State for tracking current question ID
  const [currentQuestionId, setCurrentQuestionId] = useState(10);
  // State for storing current question object
  const [question, setQuestion] = useState(demoQuestion);
  // State for user's text input answers
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill(''));
  // State to control visibility of correct answer
  const [showAnswer, setShowAnswer] = useState(false);
  // State to track if answer has been checked
  const [isChecked, setIsChecked] = useState(false);
  // State for word bank exercise words
  const [wordBankWords, setWordBankWords] = useState<string[]>([]);
  // State for words selected by user in word bank
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // State to track if word bank answer has been checked
  const [isWordBankChecked, setIsWordBankChecked] = useState(false);
  // State to track if word bank answer is correct
  const [isWordBankCorrect, setIsWordBankCorrect] = useState(false);
  // State to control authentication prompt visibility
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  // State for multiple choice selections using Set for unique values
  const [selectedChoices, setSelectedChoices] = useState<Set<number>>(new Set());
  // State to track if multiple choice answer has been checked
  const [isMultipleChoiceChecked, setIsMultipleChoiceChecked] = useState(false);
  // State to track if multiple choice answer is correct
  const [isMultipleChoiceCorrect, setIsMultipleChoiceCorrect] = useState(false);

  // Effect hook to fetch questions based on user authentication status
  useEffect(() => {
    // If user is authenticated, fetch questions from API
    if (user) {
      // Make API call to get questions
      fetch('/api/questions')
        // Parse JSON response
        .then(res => res.json())
        // Process the fetched data
        .then(data => {
          // Update questions state with fetched data
          setQuestions(data);
          // Determine question ID from props, URL param, or default to 1
          const qId = questionNumber || Number(id) || 1;
          // Set current question ID
          setCurrentQuestionId(qId);
          // Find and set the specific question or use first one as fallback
          setQuestion(data.find((q: any) => q.id === qId) || data[0]);
        });
    } else {
      // If user not authenticated, use demo question
      setQuestions([demoQuestion]);
      // Set demo question ID
      setCurrentQuestionId(10);
      // Set demo question as current
      setQuestion(demoQuestion);
    }
    // Re-run effect when user, id, or questionNumber changes
  }, [user, id, questionNumber]);

  // Effect hook to reset question state when question changes
  useEffect(() => {
    // Only process if question exists
    if (question) {
      // Parse answer to extract individual words for word bank
      const words = question.answer
        // Split by semicolon to separate answer parts
        .split(';')
        // Remove whitespace from each part
        .map(part => part.trim())
        // Join parts with space
        .join(' ')
        // Split into individual words
        .split(' ')
        // Filter out empty strings
        .filter(word => word.length > 0);
      
      // Set word bank words from parsed answer
      setWordBankWords([...words]);
      // Clear previously selected words
      setSelectedWords([]);
      // Reset word bank check status
      setIsWordBankChecked(false);
      // Reset word bank correctness status
      setIsWordBankCorrect(false);
      // Clear multiple choice selections
      setSelectedChoices(new Set());
      // Reset multiple choice check status
      setIsMultipleChoiceChecked(false);
      // Reset multiple choice correctness status
      setIsMultipleChoiceCorrect(false);
    }
    // Re-run effect when question changes
  }, [question]);

  // Function to check word bank answer correctness
  const checkWordBankAnswer = () => {
    // Process correct answer: split, trim, join, and convert to lowercase
    const correctAnswer = question.answer
      // Split by semicolon to separate answer parts
      .split(';')
      // Remove whitespace from each part
      .map(part => part.trim())
      // Join parts with space
      .join(' ')
      // Convert to lowercase for comparison
      .toLowerCase();

    // Join user's selected words and convert to lowercase
    const userAnswer = selectedWords.join(' ').toLowerCase();
    // Mark word bank as checked
    setIsWordBankChecked(true);
    // Set correctness based on exact match
    setIsWordBankCorrect(correctAnswer === userAnswer);

    // Show authentication prompt for non-authenticated users after delay
    if (!user && !showAuthPrompt) {
      // Set timeout to show auth prompt after 1.5 seconds
      setTimeout(() => {
        // Display authentication prompt
        setShowAuthPrompt(true);
      }, 1500);
    }
  };

  // Function to handle changes in text input answers
  const handleAnswerChange = (index: number, value: string) => {
    // Create a copy of current answers array
    const newAnswers = [...answers];
    // Update the specific answer at given index
    newAnswers[index] = value;
    // Update answers state
    setAnswers(newAnswers);
    // Reset checked status when answer changes
    setIsChecked(false);
    // Hide answer when user is typing
    setShowAnswer(false);
  };

  // Function to check user's text input answers
  const checkAnswer = () => {
    // Mark answers as checked
    setIsChecked(true);
    
    // Show authentication prompt for non-authenticated users after delay
    if (!user && !showAuthPrompt) {
      // Set timeout to show auth prompt after 1.5 seconds
      setTimeout(() => {
        // Display authentication prompt
        setShowAuthPrompt(true);
      }, 1500);
    }
  };

  // Function to toggle visibility of correct answer
  const toggleShowAnswer = () => {
    // Toggle show answer state
    setShowAnswer(!showAnswer);
  };

  // Function to check if a specific answer is correct
  const isAnswerCorrect = (answer: string, index: number) => {
    // Convert answer to lowercase and trim whitespace
    const trimmedAnswer = answer.toLowerCase().trim();
    
    // Check against acceptable answers if they exist
    if (question.acceptableAnswers) {
      // Compare with acceptable answer at same index
      return question.acceptableAnswers[index]?.toLowerCase().trim() === trimmedAnswer;
    }
    
    // Split main answer by semicolon and trim each part
    const correctAnswers = question.answer.split(';').map(a => a.trim());
    // Compare with correct answer at same index
    return trimmedAnswer === correctAnswers[index]?.toLowerCase().trim();
  };

  // Function to get visual status of answer (correct/incorrect/neutral)
  const getAnswerStatus = (index: number) => {
    // Return neutral if not checked yet
    if (!isChecked) return 'neutral';
    // Return correct or incorrect based on answer validation
    return isAnswerCorrect(answers[index], index) ? 'correct' : 'incorrect';
  };

  // Function to handle navigation between questions
  const handleNavigation = (direction: 'prev' | 'next') => {
    // Show auth prompt if user not authenticated
    if (!user) {
      // Display authentication prompt
      setShowAuthPrompt(true);
      return;
    }

    // Calculate new question ID based on direction
    const newQuestionId = direction === 'prev' ? currentQuestionId - 1 : currentQuestionId + 1;
    // Check if new question ID is within valid range
    if (newQuestionId >= 1 && newQuestionId <= questions.length) {
      navigate(`/question/${newQuestionId}`);
      setAnswers(Array(questions[newQuestionId - 1]?.inputFields || 1).fill(''));
      setShowAnswer(false);
      setIsChecked(false);
      setIsWordBankChecked(false);
      setIsWordBankCorrect(false);
    }
  };

  // Function to handle word selection in word bank exercise
  const handleWordClick = (word: string, isFromBank: boolean) => {
    // If word is clicked from word bank (moving to selected)
    if (isFromBank) {
      // Add word to selected words
      setSelectedWords([...selectedWords, word]);
      // Remove word from available word bank
      setWordBankWords(wordBankWords.filter(w => w !== word));
    } else {
      // If word is clicked from selected (moving back to bank)
      // Add word back to word bank
      setWordBankWords([...wordBankWords, word]);
      // Remove word from selected words
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
    // Reset check status when selection changes
    setIsWordBankChecked(false);
  };

  // Function to handle multiple choice selection changes
  const handleMultipleChoiceChange = (index: number) => {
    // Create a copy of current selections
    const newSelectedChoices = new Set(selectedChoices);
    // Toggle selection: remove if already selected, add if not
    if (newSelectedChoices.has(index)) {
      // Remove from selection
      newSelectedChoices.delete(index);
    } else {
      // Add to selection
      newSelectedChoices.add(index);
    }
    // Update selected choices state
    setSelectedChoices(newSelectedChoices);
    // Reset check status when selection changes
    setIsMultipleChoiceChecked(false);
  };

  const checkMultipleChoiceAnswer = () => {
    const correctAnswers = question.multipleChoice?.slice(0, 3) || []; // First 3 are correct
    const isCorrect = selectedChoices.size === correctAnswers.length &&
      Array.from(selectedChoices).every(index => index < correctAnswers.length);
    
    setIsMultipleChoiceChecked(true);
    setIsMultipleChoiceCorrect(isCorrect);

    if (!user && !showAuthPrompt) {
      setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500);
    }
  };

  const renderEasyExercise = () => {
    if (!question.multipleChoice) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Exercise 1: Multiple Choice (Easy)</h3>
        <p className="text-gray-600 mb-6">{question.question}</p>

        <div className="space-y-4">
          {question.multipleChoice.map((choice, index) => (
            <label
              key={index}
              className={`flex items-start p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                isMultipleChoiceChecked
                  ? index < 3 && selectedChoices.has(index)
                    ? 'bg-green-50 border-green-500'
                    : index >= 3 && selectedChoices.has(index)
                    ? 'bg-red-50 border-red-500'
                    : 'bg-white border-gray-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedChoices.has(index)}
                onChange={() => handleMultipleChoiceChange(index)}
                className="mt-1 h-5 w-5 text-blue-600 rounded"
                disabled={isMultipleChoiceChecked}
              />
              <span className="ml-3">{choice}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            onClick={checkMultipleChoiceAnswer}
            disabled={selectedChoices.size === 0 || isMultipleChoiceChecked}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
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

  const renderWordBank = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Exercise 2: Word Bank (Medium)</h3>
        <p className="text-gray-600 mb-6">{question.question}</p>
        
        <div className="space-y-6">
          <div className={`min-h-[100px] p-4 rounded-lg transition-colors ${
            isWordBankChecked
              ? isWordBankCorrect
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
              : 'bg-gray-50 border-2 border-dashed border-gray-300'
          }`}>
            <p className="text-sm text-gray-500 mb-2">Arrange words to form your answer:</p>
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, false)}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    isWordBankChecked
                      ? isWordBankCorrect
                        ? 'bg-green-100 hover:bg-green-200 text-green-800'
                        : 'bg-red-100 hover:bg-red-200 text-red-800'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Available words:</p>
            </div>
            <div className="flex flex-wrap gap-2">
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

        <div className="mt-6 flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={checkWordBankAnswer}
            disabled={selectedWords.length === 0}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
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

  const renderStandardExercise = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Exercise 3: Free Response (Hard)</h3>
        <p className="text-gray-600 mb-6">{question.question}</p>

        {question.inputFields > 1 ? (
          <div className="space-y-4">
            {[...Array(question.inputFields)].map((_, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-3 mt-2 font-medium">{index + 1}.</span>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className={`w-full border rounded-lg p-2 pr-10 ${
                      isChecked
                        ? getAnswerStatus(index) === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter your answer"
                  />
                  {isChecked && (
                    <div className="absolute right-2 top-2">
                      {getAnswerStatus(index) === 'correct' ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <X className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <textarea
              className={`w-full border rounded-lg p-2 ${
                isChecked
                  ? getAnswerStatus(0) === 'correct'
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              rows={3}
              value={answers[0]}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              placeholder="Enter your answer"
            />
            {isChecked && (
              <div className="absolute right-2 top-2">
                {getAnswerStatus(0) === 'correct' ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <X className="w-6 h-6 text-red-500" />
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            onClick={checkAnswer}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Check Answer
          </button>
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

  return (
    <div className="space-y-6">
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

      {user && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handleNavigation('prev')}
              disabled={currentQuestionId === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
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