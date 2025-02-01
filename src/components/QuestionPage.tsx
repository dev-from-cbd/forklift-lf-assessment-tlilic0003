import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { questions } from '../data/questions';

interface QuestionPageProps {
  questionNumber?: number;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ questionNumber }) => {
  const { id } = useParams();
  const currentQuestionId = questionNumber || Number(id) || 1;
  const question = questions[currentQuestionId - 1];
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill(''));

  if (!question) {
    return <div>Question not found</div>;
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
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
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2"
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Enter your answer"
                />
              </div>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
            value={answers[0]}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            placeholder="Enter your answer"
          />
        )}
      </div>

      <div className="mt-6">
        <button
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        
        {showAnswer && (
          <div className="mt-3 p-4 bg-blue-50 rounded-md">
            <p className="text-gray-800">
              <span className="font-medium">Correct Answer: </span>
              {question.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;