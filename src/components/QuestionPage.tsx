import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, X, HelpCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { questions } from '../data/questions';
import { useNavigate } from 'react-router-dom';

interface QuestionPageProps {
  questionNumber?: number;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ questionNumber }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentQuestionId = questionNumber || Number(id) || 1;
  const question = questions[currentQuestionId - 1];
  
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill(''));
  const [showAnswer, setShowAnswer] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600">Question not found. Please select a question between 1 and {questions.length}.</p>
      </div>
    );
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setIsChecked(false);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    setIsChecked(true);
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
    const newQuestionId = direction === 'prev' ? currentQuestionId - 1 : currentQuestionId + 1;
    if (newQuestionId >= 1 && newQuestionId <= questions.length) {
      navigate(`/question/${newQuestionId}`);
      setAnswers(Array(questions[newQuestionId - 1]?.inputFields || 1).fill(''));
      setShowAnswer(false);
      setIsChecked(false);
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const totalPages = questions.length;
    
    for (
      let i = Math.max(2, currentQuestionId - delta);
      i <= Math.min(totalPages - 1, currentQuestionId + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentQuestionId - delta > 2) {
      range.unshift('...');
    }
    if (currentQuestionId + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  const renderHierarchyQuestion = () => {
    const totalPositions = 6;
    return (
      <div className="space-y-2 border rounded-lg p-4">
        {[...Array(totalPositions)].map((_, position) => {
          const actualPosition = position + 1;
          const isPrefilled = question.prefilledAnswers?.[actualPosition];
          const inputIndex = !isPrefilled ? 
            (actualPosition <= 3 ? actualPosition - 1 : actualPosition - 2) : 
            null;

          return (
            <div key={position} className="flex items-center border-b last:border-b-0 p-2">
              <span className="mr-3 font-medium w-8">{actualPosition}.</span>
              {isPrefilled ? (
                <input
                  type="text"
                  className="w-full p-2 bg-gray-100 border rounded"
                  value={isPrefilled}
                  disabled
                />
              ) : (
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className={`w-full p-2 border rounded ${
                      isChecked
                        ? getAnswerStatus(inputIndex!) === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    value={answers[inputIndex!] || ''}
                    onChange={(e) => handleAnswerChange(inputIndex!, e.target.value)}
                    placeholder="Enter your answer"
                  />
                  {isChecked && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {getAnswerStatus(inputIndex!) === 'correct' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStandardQuestion = () => {
    return question.inputFields > 1 ? (
      <div className="space-y-3">
        {[...Array(question.inputFields)].map((_, index) => (
          <div key={index} className="flex items-start">
            <span className="mr-3 mt-2 font-medium">{index + 1}.</span>
            <div className="flex-1 relative">
              <input
                type="text"
                className={`w-full border rounded-md p-2 pr-10 ${
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
          className={`w-full border rounded-md p-2 ${
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
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Question {question.id} of {questions.length}
        </h3>
        <p className="text-lg mb-6 whitespace-pre-line">{question.question}</p>
        
        {question.displayFormat === 'hierarchy' ? renderHierarchyQuestion() : renderStandardQuestion()}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          onClick={checkAnswer}
        >
          <HelpCircle className="w-5 h-5 mr-2" />
          Check Answer
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          onClick={toggleShowAnswer}
        >
          <Eye className="w-5 h-5 mr-2" />
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
      
      {showAnswer && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          {question.acceptableAnswers ? (
            <div>
              <p className="font-medium text-gray-800">Correct answers:</p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {question.acceptableAnswers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-800">
              <span className="font-medium">Correct Answer: </span>
              {question.answer}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center space-x-2">
        <button
          onClick={() => handleNavigation('prev')}
          disabled={currentQuestionId === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => navigate(`/question/${page}`)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  page === currentQuestionId
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className="px-2">...</span>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => handleNavigation('next')}
          disabled={currentQuestionId === questions.length}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;