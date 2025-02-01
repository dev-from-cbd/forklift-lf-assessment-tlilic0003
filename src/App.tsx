import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Forklift, ChevronLeft, ChevronRight } from 'lucide-react';
import QuestionPage from './components/QuestionPage';
import { questions } from './data/questions';

function App() {
  const navigate = useNavigate();
  const totalPages = questions.length;

  const handleNavigation = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      navigate(`/question/${pageNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="bg-blue-900 text-white py-12"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1620472926326-0fc8946c880d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <Forklift size={40} className="mr-3" />
            <h1 className="text-3xl font-bold">Forklift Training & Assessment</h1>
          </div>
          <h2 className="text-xl text-center">TLILIC0003 High Risk Licence</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<QuestionPage questionNumber={1} />} />
            <Route path="/question/:id" element={<QuestionPage />} />
          </Routes>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => handleNavigation(Number(window.location.pathname.split('/').pop() || 1) - 1)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="mr-2" size={20} />
              Previous
            </button>
            <span className="text-gray-600">
              Question {window.location.pathname.split('/').pop() || 1} of {totalPages}
            </span>
            <button
              onClick={() => handleNavigation(Number(window.location.pathname.split('/').pop() || 1) + 1)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Forklift Training & Assessment</p>
        </div>
      </footer>
    </div>
  );
}

export default App;