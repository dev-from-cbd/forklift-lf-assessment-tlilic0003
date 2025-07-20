import React from 'react';
import { ArrowLeft, Users, Zap, Code, Heart, Rocket, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Team: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built by AI enthusiasts, powered by innovation, driven by passion
              </p>
            </div>
          </div>

          {/* Current Team */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Current Team</h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">AI-Powered Development</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                This project is being developed by an AI enthusiast using cutting-edge tools like 
                <span className="font-semibold text-purple-600"> Bolt.new</span>, demonstrating 
                the incredible potential of AI-assisted development. We're proving that with the 
                right vision, modern tools, and determination, small teams can create powerful, 
                scalable solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Code className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Technical Excellence</h3>
                </div>
                <p className="text-gray-700">
                  Our development approach combines human creativity with AI capabilities, 
                  resulting in rapid prototyping and high-quality code production.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Passion-Driven</h3>
                </div>
                <p className="text-gray-700">
                  Every feature is built with genuine care for user experience and 
                  educational impact, not just technical achievement.
                </p>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 mr-2" />
                <h2 className="text-3xl font-bold">Join Our Team!</h2>
              </div>
              <p className="text-xl leading-relaxed max-w-3xl mx-auto">
                Are you an AI enthusiast looking to build your portfolio and gain real-world 
                startup experience? We welcome passionate individuals who want to be part of 
                something innovative and impactful!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">What We Offer:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Real startup experience with cutting-edge technology</span>
                  </li>
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Opportunity to work with AI-powered development tools</span>
                  </li>
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Portfolio-building projects with real impact</span>
                  </li>
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Flexible, remote-friendly collaboration</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">We're Looking For:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>AI enthusiasts and early adopters</span>
                  </li>
                  <li className="flex items-start">
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Developers interested in modern web technologies</span>
                  </li>
                  <li className="flex items-start">
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>UX/UI designers with a passion for education</span>
                  </li>
                  <li className="flex items-start">
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Marketing and business development minds</span>
                  </li>
                  <li className="flex items-start">
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Educational content creators and subject matter experts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Culture & Values */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Culture & Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation First</h3>
                <p className="text-gray-700">
                  We embrace new technologies and aren't afraid to experiment with 
                  cutting-edge tools and methodologies.
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Spirit</h3>
                <p className="text-gray-700">
                  We believe in the power of diverse perspectives and collaborative 
                  problem-solving to create better solutions.
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Impact Driven</h3>
                <p className="text-gray-700">
                  Every decision we make is guided by our mission to improve 
                  education and professional development globally.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Ready to join us on this exciting journey? We'd love to hear from you!
              </p>
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-gray-800 font-semibold">
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Contact us here
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  Include your background, interests, and how you'd like to contribute to our mission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;