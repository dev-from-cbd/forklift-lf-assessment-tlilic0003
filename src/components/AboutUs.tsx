import React from 'react';
import { ArrowLeft, Target, Users, Zap, Globe, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionizing professional training through innovative AI-powered educational platforms
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We are transforming the landscape of professional training and certification by creating 
              cutting-edge educational platforms that make learning accessible, engaging, and effective. 
              Our flagship project focuses on forklift operator training (TLILIC0004), but our vision 
              extends far beyond a single certification.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that quality education should be available to everyone, everywhere. Through 
              innovative technology and user-centric design, we're building the future of professional 
              development and skills training.
            </p>
          </div>

          {/* What We Do */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Zap className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <BookOpen className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Learning</h3>
                    <p className="text-gray-700">
                      Multi-level difficulty systems with Easy, Medium, and Hard modes featuring 
                      multiple choice, word banks, and free response exercises.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Generated Content</h3>
                    <p className="text-gray-700">
                      Empowering educators and professionals to create and share their own 
                      training courses and assessments.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Globe className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Accessibility</h3>
                    <p className="text-gray-700">
                      Mobile-responsive design ensuring learning can happen anywhere, 
                      anytime, on any device.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="w-6 h-6 text-yellow-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Certification Ready</h3>
                    <p className="text-gray-700">
                      Comprehensive training programs designed to prepare learners for 
                      official certifications and real-world applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Vision</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg leading-relaxed mb-6">
                We envision a world where professional training is not limited by geography, 
                resources, or traditional educational barriers. Our platform represents the 
                first step toward creating a comprehensive ecosystem of professional development 
                tools that adapt to individual learning styles and career goals.
              </p>
              <p className="text-lg leading-relaxed">
                From forklift operators to healthcare professionals, from technical specialists 
                to creative professionals – we're building the infrastructure that will power 
                the next generation of workforce development.
              </p>
            </div>
          </div>

          {/* Technology Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Built with Modern Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered</h3>
                <p className="text-gray-700">
                  Leveraging artificial intelligence to create adaptive learning experiences 
                  and intelligent content generation.
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloud-Native</h3>
                <p className="text-gray-700">
                  Built on modern cloud infrastructure ensuring scalability, reliability, 
                  and global accessibility.
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Open Innovation</h3>
                <p className="text-gray-700">
                  Developed using cutting-edge tools like Bolt.new, demonstrating the 
                  power of AI-assisted development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;