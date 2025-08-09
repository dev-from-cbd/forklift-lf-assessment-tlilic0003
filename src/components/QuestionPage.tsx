import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, HelpCircle, Eye, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Demo question for unauthenticated users
const demoQuestion = {
  id: 10,
  question: "What is the definition of a Hazard?",
  answer: "It is a thing or situation that has the potential to cause harm to a person or cause damage",
  acceptableAnswers: [
    "It is a thing or situation that has the potential to cause harm to a person or cause damage"
  ],
  inputFields: 2,
  multipleChoice: [
    "It is a thing or situation that has the potential to cause harm to a person or cause damage",
    "A potential risk that needs to be assessed and controlled",
    "Any condition that could lead to injury or damage",
    "A magical unicorn that grants wishes" // Absurd incorrect answer
  ]
};

const QuestionPage: React.FC<{ questionNumber?: number }> = ({ questionNumber }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([demoQuestion]);
  const [currentQuestionId, setCurrentQuestionId] = useState(10);
  const [question, setQuestion] = useState(demoQuestion);
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill(''));
  const [showAnswer, setShowAnswer] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [wordBankWords, setWordBankWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isWordBankChecked, setIsWordBankChecked] = useState(false);
  const [isWordBankCorrect, setIsWordBankCorrect] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<Set<number>>(new Set());
  const [isMultipleChoiceChecked, setIsMultipleChoiceChecked] = useState(false);
  const [isMultipleChoiceCorrect, setIsMultipleChoiceCorrect] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/questions')
        .then(res => res.json())
        .then(data => {
          setQuestions(data);
          const qId = questionNumber || Number(id) || 1;
          setCurrentQuestionId(qId);
          setQuestion(data.find((q: any) => q.id === qId) || data[0]);
        });
    } else {
      setQuestions([demoQuestion]);
      setCurrentQuestionId(10);
      setQuestion(demoQuestion);
    }
  }, [user, id, questionNumber]);

  useEffect(() => {
    if (question) {
      const words = question.answer
        .split(';')
        .map(part => part.trim())
        .join(' ')
        .split(' ')
        .filter(word => word.length > 0);
      
      setWordBankWords([...words]);
      setSelectedWords([]);
      setIsWordBankChecked(false);
      setIsWordBankCorrect(false);
      setSelectedChoices(new Set());
      setIsMultipleChoiceChecked(false);
      setIsMultipleChoiceCorrect(false);
    }
  }, [question]);

  const checkWordBankAnswer = () => {
    const correctAnswer = question.answer
      .split(';')
      .map(part => part.trim())
      .join(' ')
      .toLowerCase();

    const userAnswer = selectedWords.join(' ').toLowerCase();
    setIsWordBankChecked(true);
    setIsWordBankCorrect(correctAnswer === userAnswer);

    if (!user && !showAuthPrompt) {
      setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setIsChecked(false);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    setIsChecked(true);
    
    if (!user && !showAuthPrompt) {
      setTimeout(() => {
        setShowAuthPrompt(true);
      }, 1500);
    }
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const isAnswerCorrect = (answer: string, index: number) => {
    const trimmedAnswer = answer.toLowerCase().trim();
    
    if (question.acceptableAnswers) {
      return question.acceptableAnswers[index]?.toLowerCase().trim() === trimmedAnswer;
    }
    
    const correctAnswers = question.answer.split(';').map(a => a.trim());
    return trimmedAnswer === correctAnswers[index]?.toLowerCase().trim();
  };

  const getAnswerStatus = (index: number) => {
    if (!isChecked) return 'neutral';
    return isAnswerCorrect(answers[index], index) ? 'correct' : 'incorrect';
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    const newQuestionId = direction === 'prev' ? currentQuestionId - 1 : currentQuestionId + 1;
    if (newQuestionId >= 1 && newQuestionId <= questions.length) {
      navigate(`/question/${newQuestionId}`);
      setAnswers(Array(questions[newQuestionId - 1]?.inputFields || 1).fill(''));
      setShowAnswer(false);
      setIsChecked(false);
      setIsWordBankChecked(false);
      setIsWordBankCorrect(false);
    }
  };

  const handleWordClick = (word: string, isFromBank: boolean) => {
    if (isFromBank) {
      setSelectedWords([...selectedWords, word]);
      setWordBankWords(wordBankWords.filter(w => w !== word));
    } else {
      setWordBankWords([...wordBankWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
    setIsWordBankChecked(false);
  };

  const handleMultipleChoiceChange = (index: number) => {
    const newSelectedChoices = new Set(selectedChoices);
    if (newSelectedChoices.has(index)) {
      newSelectedChoices.delete(index);
    } else {
      newSelectedChoices.add(index);
    }
    setSelectedChoices(newSelectedChoices);
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