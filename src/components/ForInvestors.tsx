import React from 'react';                                                    // Import React library for component creation
import { ArrowLeft, TrendingUp, Target, Zap, Users, Globe, DollarSign, Rocket, BarChart3, Lightbulb } from 'lucide-react'; // Import various icons from Lucide React icon library
import { useNavigate } from 'react-router-dom';                               // Import navigation hook from React Router

const ForInvestors: React.FC = () => {                                         // Define ForInvestors functional component with TypeScript typing
  const navigate = useNavigate();                                              // Initialize navigation hook for programmatic routing

  return (                                                                     // Return JSX for component rendering
    <div className="min-h-screen bg-gray-50">                                 {/* Main container with full screen height and light gray background */}
      <div className="container mx-auto px-4 py-8">                           {/* Centered container with horizontal padding and vertical spacing */}
        <div className="max-w-4xl mx-auto">                                   {/* Content wrapper with maximum width and center alignment */}
          {/* Header */}                                                       {/* Header section comment */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">             {/* White header card with rounded corners, shadow, padding and bottom margin */}
             <button                                                            {/* Navigation button element */}
               onClick={() => navigate('/')}                                    {/* Click handler to navigate to home page */}
               className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors" // Button styling with flex layout, blue color, hover effect and transition
            >
              <ArrowLeft className="w-5 h-5 mr-2" />                          {/* Left arrow icon with size and right margin */}
              Back to Home                                                     {/* Button text */}
            </button>                                                          {/* Close button element */}
            
            <div className="text-center">                                       {/* Center-aligned content container */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">For Investors</h1> {/* Main page title with large font, bold weight, dark color and bottom margin */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">           {/* Subtitle paragraph with large text, gray color, max width and center alignment */}
                Join us in revolutionizing professional education and training worldwide {/* Subtitle text content */}
              </p>                                                             {/* Close paragraph element */}
            </div>                                                             {/* Close center-aligned container */}
          </div>                                                               {/* Close header card */}

          {/* Investment Opportunity */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 mr-2" />
                <h2 className="text-3xl font-bold">Investment Opportunity</h2>
              </div>
              <p className="text-xl leading-relaxed max-w-3xl mx-auto">
                We are an innovative AI-powered educational technology startup seeking strategic 
                partners to scale our revolutionary training platform. Built with cutting-edge 
                technology and driven by a clear vision for the future of professional development.
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Current Status</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What We Have:</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Lightbulb className="w-6 h-6 text-yellow-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Unique Concept</h4>
                      <p className="text-gray-700">AI-powered, multi-level educational platform with user-generated content capabilities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Rocket className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Working MVP</h4>
                      <p className="text-gray-700">Fully functional Minimum Viable Product with core features implemented and tested</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="w-6 h-6 text-green-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Lean Team</h4>
                      <p className="text-gray-700">Efficient, AI-enhanced development team delivering maximum functionality with minimal resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Zap className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Modern Technology Stack</h4>
                      <p className="text-gray-700">Built with React, TypeScript, Supabase, and AI-powered development tools</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Growth Stage:</h3>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">Pre-Revenue</div>
                    <p className="text-gray-700">Early-stage startup with validated concept</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Current Users:</span>
                      <span className="font-semibold text-gray-900">Growing</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Revenue:</span>
                      <span className="font-semibold text-gray-900">$0 (Pre-monetization)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Development Stage:</span>
                      <span className="font-semibold text-green-600">MVP Complete</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Market Validation:</span>
                      <span className="font-semibold text-blue-600">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Opportunity */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Market Opportunity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">$366B</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global E-Learning Market</h3>
                <p className="text-gray-700 text-sm">Expected to reach $366B by 2026 with 9.1% CAGR</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">$13B</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Corporate Training Market</h3>
                <p className="text-gray-700 text-sm">Professional certification and skills training segment</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Transformation</h3>
                <p className="text-gray-700 text-sm">Of companies accelerating digital learning adoption</p>
              </div>
            </div>
          </div>

          {/* Why Invest */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Why Invest in Us</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-First Approach</h3>
                <p className="text-gray-700">
                  We're not just using AI as a feature – we're built from the ground up with AI-powered 
                  development, demonstrating unprecedented efficiency and innovation potential.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable Platform Model</h3>
                <p className="text-gray-700">
                  Our user-generated content model creates network effects, where more users generate 
                  more valuable content, increasing platform value exponentially.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Revenue Streams</h3>
                <p className="text-gray-700">
                  Subscription models, certification fees, enterprise licensing, and premium features 
                  provide diverse monetization opportunities.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Market Reach</h3>
                <p className="text-gray-700">
                  Professional training needs exist worldwide, providing immediate international 
                  expansion opportunities without geographical limitations.
                </p>
              </div>
            </div>
          </div>

          {/* Investment Invitation */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 mr-2" />
                <h2 className="text-3xl font-bold">Ready to Partner With Us?</h2>
              </div>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                We welcome discussions with investors, business angels, incubators, accelerators, 
                and venture capital funds who share our vision for transforming professional education.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-4">Perfect For:</h3>
                  <ul className="space-y-2">
                    <li>• Early-stage VCs focused on EdTech</li>
                    <li>• Angel investors in AI/Technology</li>
                    <li>• Accelerators and incubators</li>
                    <li>• Strategic corporate investors</li>
                    <li>• Impact investors in education</li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-4">What We Offer:</h3>
                  <ul className="space-y-2">
                    <li>• Proven MVP with real functionality</li>
                    <li>• Clear path to monetization</li>
                    <li>• Experienced AI-enhanced development</li>
                    <li>• Scalable technology platform</li>
                    <li>• Global market opportunity</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">Let's Talk!</h3>
                <p className="text-lg mb-4">
                  We're open to discussions about investment, partnership, and collaboration opportunities.
                </p>
                <div className="text-center">
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold"
                  >
                    Contact Us
                  </button>
                  <p className="text-sm mt-2 opacity-90">
                    Include your investment focus, ticket size, and how you can add value beyond capital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForInvestors;