import React, { useState } from 'react';
import { Book, CheckCircle2, ChevronDown, ChevronUp, Forklift } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What are three (3) documented sources you could refer to for workplace safety information?",
    answer: "WHS policies and procedures; Forklift operator manual; Safe working procedures"
  },
  {
    id: 2,
    question: "What should you do before operating a forklift?",
    answer: "Conduct pre-operational checks; Ensure you have a valid licence; Check the work area for hazards"
  },
  {
    id: 3,
    question: "What is the minimum distance to keep from other vehicles when operating a forklift?",
    answer: "At least three truck lengths (approximately 9 meters)"
  },
  {
    id: 4,
    question: "What should you do if you notice a fault with the forklift?",
    answer: "Stop operations immediately; Report the fault to your supervisor; Tag out the equipment if necessary"
  },
  {
    id: 5,
    question: "What is the purpose of Load Rating Plates on a forklift?",
    answer: "They show the maximum weight that can be safely lifted at different load centers"
  }
];

function App() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (id: number) => {
    setOpenQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="bg-blue-900 text-white py-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1504276048855-f3d60e69632f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Forklift size={48} className="mr-4" />
            <h1 className="text-4xl font-bold">Forklift Training & Assessment</h1>
          </div>
          <h2 className="text-2xl text-center">TLILIC0003 High Risk Licence</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Book className="text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Course Overview</h2>
            </div>
            <p className="text-gray-600 mb-4">
              This comprehensive forklift training course prepares operators for the TLILIC0003 licence. 
              Learn essential safety procedures, operational techniques, and regulatory requirements.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2" />
              <span>Nationally Recognized Training</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Practice Questions</h2>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="border rounded-lg">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <span className="font-medium">Question {q.id}: {q.question}</span>
                    {openQuestions.includes(q.id) ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>
                  {openQuestions.includes(q.id) && (
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <p className="text-gray-700">
                        <span className="font-medium">Answer: </span>
                        {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Forklift Training & Assessment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;