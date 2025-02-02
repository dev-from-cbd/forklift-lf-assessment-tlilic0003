import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, X, HelpCircle, Eye } from 'lucide-react';
import { questions } from '../data/questions';

interface QuestionPageProps {
  questionNumber?: number;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ questionNumber }) => {
  const { id } = useParams();
  const currentQuestionId = questionNumber || Number(id) || 1;
  const question = questions[currentQuestionId - 1];
  
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill(''));
  const [showAnswer, setShowAnswer] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  if (!question) {
    return <div>Question not found</div>;
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

  const isAnswerCorrect = (answer: string, correctAnswer: string) => {
    return answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  const getAnswerStatus = (index: number) => {
    if (!isChecked) return 'neutral';
    
    if (question.inputFields) {
      const correctAnswers = question.answer.split(';').map(a => a.trim());
      return isAnswerCorrect(answers[index], correctAnswers[index]) ? 'correct' : 'incorrect';
    }
    
    return isAnswerCorrect(answers[index], question.answer) ? 'correct' : 'incorrect';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {question.id}. {question.question}
        </h3>
        
        {question.inputFields ? (
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
        )}
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
          <p className="text-gray-800">
            <span className="font-medium">Correct Answer: </span>
            {question.answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;