import React, { useState } from 'react'; // Import React and useState hook for state management
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
import { Check, X, HelpCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons from lucide-react library
import { questions } from '../data/questions'; // Import the list of questions from a data file
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

interface QuestionPageProps {
  questionNumber?: number; // Define an interface for component props with an optional questionNumber
}

const QuestionPage: React.FC<QuestionPageProps> = ({ questionNumber }) => { // Define the QuestionPage component
  const { id } = useParams(); // Extract the 'id' parameter from the URL
  const navigate = useNavigate(); // Initialize the navigate function for routing
  const currentQuestionId = questionNumber || Number(id) || 1; // Determine the current question ID, defaulting to 1 if not provided
  const question = questions[currentQuestionId - 1]; // Retrieve the current question from the questions array

  const [answers, setAnswers] = useState<string[]>(Array(question?.inputFields || 1).fill('')); // Initialize state for user answers, defaulting to an array of empty strings
  const [showAnswer, setShowAnswer] = useState(false); // State to control whether the correct answer is shown
  const [isChecked, setIsChecked] = useState(false); // State to track if the answer has been checked

  if (!question) { // If the question is not found, display an error message
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600">Question not found. Please select a question between 1 and {questions.length}.</p>
      </div>
    );
  }

  const handleAnswerChange = (index: number, value: string) => { // Function to handle changes in the answer input fields
    const newAnswers = [...answers]; // Create a copy of the current answers array
    newAnswers[index] = value; // Update the specific answer at the given index
    setAnswers(newAnswers); // Set the new answers array to state
    setIsChecked(false); // Reset the checked state
    setShowAnswer(false); // Hide the correct answer if it was shown
  };

  const checkAnswer = () => { // Function to check the user's answer
    setIsChecked(true); // Set the checked state to true
  };

  const toggleShowAnswer = () => { // Function to toggle the visibility of the correct answer
    setShowAnswer(!showAnswer); // Toggle the showAnswer state
  };

  const isAnswerCorrect = (answer: string, index: number) => { // Function to check if the user's answer is correct
    const trimmedAnswer = answer.toLowerCase().trim(); // Trim and lowercase the user's answer

    if (question.acceptableAnswers) { // If the question has acceptable answers
      return question.acceptableAnswers.some( // Check if any acceptable answer matches the user's answer
        acceptable => acceptable.toLowerCase().trim() === trimmedAnswer
      );
    }

    const correctAnswers = question.answer.split(';').map(a => a.trim()); // Split the correct answer string into an array
    return trimmedAnswer === correctAnswers[index]?.toLowerCase().trim(); // Compare the user's answer with the correct answer
  };

  const getAnswerStatus = (index: number) => { // Function to get the status of the user's answer (correct, incorrect, or neutral)
    if (!isChecked) return 'neutral'; // Return 'neutral' if the answer hasn't been checked
    return isAnswerCorrect(answers[index], index) ? 'correct' : 'incorrect'; // Return 'correct' or 'incorrect' based on the answer
  };

  const handleNavigation = (direction: 'prev' | 'next') => { // Function to handle navigation between questions
    const newQuestionId = direction === 'prev' ? currentQuestionId - 1 : currentQuestionId + 1; // Calculate the new question ID based on the direction
    if (newQuestionId >= 1 && newQuestionId <= questions.length) { // Ensure the new question ID is within valid range
      navigate(`/question/${newQuestionId}`); // Navigate to the new question
      setAnswers(Array(questions[newQuestionId - 1]?.inputFields || 1).fill('')); // Reset the answers array for the new question
      setShowAnswer(false); // Hide the correct answer
      setIsChecked(false); // Reset the checked state
    }
  };

  const getVisiblePages = () => { // Function to generate the visible page numbers for pagination
    const delta = 2; // Number of pages to show around the current page
    const range = []; // Array to store the visible page numbers
    const totalPages = questions.length; // Total number of questions

    for ( // Loop to generate the range of visible pages
      let i = Math.max(2, currentQuestionId - delta);
      i <= Math.min(totalPages - 1, currentQuestionId + delta);
      i++
    ) {
      range.push(i); // Add the page number to the range
    }

    if (currentQuestionId - delta > 2) { // Add ellipsis if there are pages before the current range
      range.unshift('...');
    }
    if (currentQuestionId + delta < totalPages - 1) { // Add ellipsis if there are pages after the current range
      range.push('...');
    }

    range.unshift(1); // Always include the first page
    if (totalPages !== 1) { // Always include the last page if there is more than one page
      range.push(totalPages);
    }

    return range; // Return the array of visible pages
  };

  return ( // Render the component
    <div className="bg-white rounded-lg shadow-lg p-6"> {/* Container for the question page */}
      <div className="mb-6"> {/* Container for the question content */}
        <h3 className="text-xl font-semibold mb-4"> {/* Question number and total questions */}
          Question {question.id} of {questions.length}
        </h3>
        <p className="text-lg mb-6">{question.question}</p> {/* Display the question text */}

        {question.inputFields ? ( // If the question has multiple input fields
          <div className="space-y-3"> {/* Container for the input fields */}
            {[...Array(question.inputFields)].map((_, index) => ( // Map over the number of input fields
              <div key={index} className="flex items-start"> {/* Container for each input field */}
                <span className="mr-3 mt-2 font-medium">{index + 1}.</span> {/* Input field label */}
                <div className="flex-1 relative"> {/* Container for the input and icon */}
                  <input
                    type="text"
                    className={`w-full border rounded-md p-2 pr-10 ${
                      isChecked
                        ? getAnswerStatus(index) === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`} // Apply styles based on the answer status
                    value={answers[index]} // Bind the input value to the corresponding answer
                    onChange={(e) => handleAnswerChange(index, e.target.value)} // Handle input changes
                    placeholder="Enter your answer" // Input placeholder
                  />
                  {isChecked && ( // Show an icon if the answer has been checked
                    <div className="absolute right-2 top-2">
                      {getAnswerStatus(index) === 'correct' ? ( // Show a checkmark for correct answers
                        <Check className="w-6 h-6 text-green-500" />
                      ) : ( // Show an X for incorrect answers
                        <X className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : ( // If the question has a single textarea
          <div className="relative"> {/* Container for the textarea */}
            <textarea
              className={`w-full border rounded-md p-2 ${
                isChecked
                  ? getAnswerStatus(0) === 'correct'
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`} // Apply styles based on the answer status
              rows={3} // Set the number of rows for the textarea
              value={answers[0]} // Bind the textarea value to the answer
              onChange={(e) => handleAnswerChange(0, e.target.value)} // Handle textarea changes
              placeholder="Enter your answer" // Textarea placeholder
            />
            {isChecked && ( // Show an icon if the answer has been checked
              <div className="absolute right-2 top-2">
                {getAnswerStatus(0) === 'correct' ? ( // Show a checkmark for correct answers
                  <Check className="w-6 h-6 text-green-500" />
                ) : ( // Show an X for incorrect answers
                  <X className="w-6 h-6 text-red-500" />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-4"> {/* Container for the action buttons */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          onClick={checkAnswer} // Handle the "Check Answer" button click
        >
          <HelpCircle className="w-5 h-5 mr-2" /> {/* Icon for the button */}
          Check Answer {/* Button text */}
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          onClick={toggleShowAnswer} // Handle the "Show Answer" button click
        >
          <Eye className="w-5 h-5 mr-2" /> {/* Icon for the button */}
          {showAnswer ? 'Hide Answer' : 'Show Answer'} {/* Toggle button text */}
        </button>
      </div>

      {showAnswer && ( // Show the correct answer if the "Show Answer" button is clicked
        <div className="mt-6 p-4 bg-blue-50 rounded-md"> {/* Container for the correct answer */}
          {question.acceptableAnswers ? ( // If the question has multiple acceptable answers
            <div>
              <p className="font-medium text-gray-800">Correct answers:</p> {/* Heading for correct answers */}
              <ul className="list-disc list-inside mt-2 text-gray-700"> {/* List of correct answers */}
                {question.acceptableAnswers.map((answer, index) => (
                  <li key={index}>{answer}</li> // Display each correct answer
                ))}
              </ul>
            </div>
          ) : ( // If the question has a single correct answer
            <p className="text-gray-800">
              <span className="font-medium">Correct Answer: </span> {/* Heading for the correct answer */}
              {question.answer} {/* Display the correct answer */}
            </p>
          )}
        </div>
      )}

      {/* Elegant Pagination */}
      <div className="mt-8 flex items-center justify-center space-x-2"> {/* Container for pagination */}
        <button
          onClick={() => handleNavigation('prev')} // Handle the "Previous" button click
          disabled={currentQuestionId === 1} // Disable the button if on the first question
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} /> {/* Icon for the button */}
        </button>

        {getVisiblePages().map((page, index) => ( // Map over the visible pages
          <React.Fragment key={index}>
            {typeof page === 'number' ? ( // If the page is a number, render a button
              <button
                onClick={() => navigate(`/question/${page}`)} // Handle page navigation
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  page === currentQuestionId
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`} // Apply styles based on the current page
              >
                {page} {/* Display the page number */}
              </button>
            ) : ( // If the page is an ellipsis, render a span
              <span className="px-2">...</span>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => handleNavigation('next')} // Handle the "Next" button click
          disabled={currentQuestionId === questions.length} // Disable the button if on the last question
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} /> {/* Icon for the button */}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage; // Export the QuestionPage component