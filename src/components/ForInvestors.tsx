// Import React library for creating components
import React from 'react';
// Import various icons from lucide-react library for UI elements
import { ArrowLeft, TrendingUp, Target, Zap, Users, Globe, DollarSign, Rocket, BarChart3, Lightbulb } from 'lucide-react';
// Import useNavigate hook from react-router-dom for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define ForInvestors component as a functional component
const ForInvestors: React.FC = () => {
  // Initialize navigate function from useNavigate hook for routing
  const navigate = useNavigate();

  // Return JSX for rendering the component
  return (
    <div className="min-h-screen bg-gray-50"> {/* Main container with full screen height and light gray background */}
      <div className="container mx-auto px-4 py-8"> {/* Centered container with horizontal padding */}
        <div className="max-w-4xl mx-auto"> {/* Content wrapper with maximum width */}
          {/* Header section with navigation and title */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8"> {/* White card with shadow and margin */}
            <button
              onClick={() => navigate('/')} /* Navigate to home page when clicked */
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> {/* Left arrow icon */}
              Back to Home
            </button>
            
            <div className="text-center"> {/* Centered content container */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">For Investors</h1> {/* Main heading */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto"> {/* Subtitle with maximum width */}
                Join us in revolutionizing professional education and training worldwide
              </p>
            </div>
          </div>

          {/* Investment Opportunity section with gradient background */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8"> {/* Gradient background card with shadow */}
            <div className="text-center"> {/* Center-aligned content container */}
              <div className="flex items-center justify-center mb-4"> {/* Flex container for icon and heading */}
                <TrendingUp className="w-8 h-8 mr-2" /> {/* Trending up icon */}
                <h2 className="text-3xl font-bold">Investment Opportunity</h2> {/* Section heading */}
              </div>
              <p className="text-xl leading-relaxed max-w-3xl mx-auto"> {/* Description paragraph with maximum width */}
                We are an innovative AI-powered educational technology startup seeking strategic 
                partners to scale our revolutionary training platform. Built with cutting-edge 
                technology and driven by a clear vision for the future of professional development.
              </p>
            </div>
          </div>

          {/* Current Status section with company progress information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8"> {/* White card with shadow and margin */}
            <div className="flex items-center mb-6"> {/* Flex container for icon and heading */}
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" /> {/* Chart icon */}
              <h2 className="text-3xl font-bold text-gray-900">Current Status</h2> {/* Section heading */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* 2-column grid layout on medium screens */}
              <div> {/* First column */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What We Have:</h3> {/* Column heading */}
                <div className="space-y-4"> {/* Vertical spacing between items */}
                  <div className="flex items-start"> {/* Flex container for icon and content */}
                    <Lightbulb className="w-6 h-6 text-yellow-500 mr-3 mt-1" /> {/* Lightbulb icon */}
                    <div> {/* Content container */}
                      <h4 className="font-semibold text-gray-900">Unique Concept</h4> {/* Item heading */}
                      <p className="text-gray-700">AI-powered, multi-level educational platform with user-generated content capabilities</p> {/* Item description */}
                    </div>
                  </div>
                  
                  <div className="flex items-start"> {/* Flex container for icon and content */}
                    <Rocket className="w-6 h-6 text-blue-500 mr-3 mt-1" /> {/* Rocket icon */}
                    <div> {/* Content container */}
                      <h4 className="font-semibold text-gray-900">Working MVP</h4> {/* Item heading */}
                      <p className="text-gray-700">Fully functional Minimum Viable Product with core features implemented and tested</p> {/* Item description */}
                    </div>
                  </div>
                  
                  <div className="flex items-start"> {/* Flex container for icon and content */}
                    <Users className="w-6 h-6 text-green-500 mr-3 mt-1" /> {/* Users icon */}
                    <div> {/* Content container */}
                      <h4 className="font-semibold text-gray-900">Lean Team</h4> {/* Item heading */}
                      <p className="text-gray-700">Efficient, AI-enhanced development team delivering maximum functionality with minimal resources</p> {/* Item description */}
                    </div>
                  </div>
                  
                  <div className="flex items-start"> {/* Flex container for icon and content */}
                    <Zap className="w-6 h-6 text-purple-500 mr-3 mt-1" /> {/* Zap/lightning icon */}
                    <div> {/* Content container */}
                      <h4 className="font-semibold text-gray-900">Modern Technology Stack</h4> {/* Item heading */}
                      <p className="text-gray-700">Built with React, TypeScript, Supabase, and AI-powered development tools</p> {/* Item description */}
                    </div>
                  </div>
                </div>
              </div>
              
              <div> {/* Second column */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Growth Stage:</h3> {/* Column heading */}
                <div className="bg-blue-50 rounded-lg p-6"> {/* Light blue background card */}
                  <div className="text-center mb-4"> {/* Centered content with margin */}
                    <div className="text-3xl font-bold text-blue-600 mb-2">Pre-Revenue</div> {/* Large highlighted text */}
                    <p className="text-gray-700">Early-stage startup with validated concept</p> {/* Description text */}
                  </div>
                  
                  <div className="space-y-3"> {/* Vertical spacing between items */}
                    <div className="flex justify-between items-center"> {/* Flex container with space between */}
                      <span className="text-gray-700">Current Users:</span> {/* Label */}
                      <span className="font-semibold text-gray-900">Growing</span> {/* Value */}
                    </div>
                    <div className="flex justify-between items-center"> {/* Flex container with space between */}
                      <span className="text-gray-700">Revenue:</span> {/* Label */}
                      <span className="font-semibold text-gray-900">$0 (Pre-monetization)</span> {/* Value */}
                    </div>
                    <div className="flex justify-between items-center"> {/* Flex container with space between */}
                      <span className="text-gray-700">Development Stage:</span> {/* Label */}
                      <span className="font-semibold text-green-600">MVP Complete</span> {/* Value with green highlight */}
                    </div>
                    <div className="flex justify-between items-center"> {/* Flex container with space between */}
                      <span className="text-gray-700">Market Validation:</span> {/* Label */}
                      <span className="font-semibold text-blue-600">In Progress</span> {/* Value with blue highlight */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Opportunity section with market size statistics */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8"> {/* White card with shadow */}
            <div className="flex items-center mb-6"> {/* Flex container for icon and heading */}
              <Globe className="w-8 h-8 text-green-600 mr-3" /> {/* Globe icon */}
              <h2 className="text-3xl font-bold text-gray-900">Market Opportunity</h2> {/* Section heading */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* 3-column grid layout on medium screens */}
              <div className="text-center p-6 bg-green-50 rounded-lg"> {/* First market stat card with green background */}
                <div className="text-2xl font-bold text-green-600 mb-2">$366B</div> {/* Market size figure */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global E-Learning Market</h3> {/* Market segment title */}
                <p className="text-gray-700 text-sm">Expected to reach $366B by 2026 with 9.1% CAGR</p> {/* Market growth details */}
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg"> {/* Second market stat card with blue background */}
                <div className="text-2xl font-bold text-blue-600 mb-2">$13B</div> {/* Market size figure */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Corporate Training Market</h3> {/* Market segment title */}
                <p className="text-gray-700 text-sm">Professional certification and skills training segment</p> {/* Market segment details */}
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg"> {/* Third market stat card with purple background */}
                <div className="text-2xl font-bold text-purple-600 mb-2">85%</div> {/* Adoption percentage */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Transformation</h3> {/* Trend title */}
                <p className="text-gray-700 text-sm">Of companies accelerating digital learning adoption</p> {/* Trend details */}
              </div>
            </div>
          </div>

          {/* Why Invest section with investment benefits */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8"> {/* White card with shadow */}
            <div className="flex items-center mb-6"> {/* Flex container for icon and heading */}
              <Target className="w-8 h-8 text-purple-600 mr-3" /> {/* Target icon */}
              <h2 className="text-3xl font-bold text-gray-900">Why Invest in Us</h2> {/* Section heading */}
            </div>
            
            <div className="space-y-6"> {/* Vertical spacing between items */}
              <div className="border-l-4 border-blue-500 pl-6"> {/* Left border highlight with padding */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-First Approach</h3> {/* Benefit heading */}
                <p className="text-gray-700"> {/* Benefit description */}
                  We're not just using AI as a feature – we're built from the ground up with AI-powered 
                  development, demonstrating unprecedented efficiency and innovation potential.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6"> {/* Left border highlight with padding */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable Platform Model</h3> {/* Benefit heading */}
                <p className="text-gray-700"> {/* Benefit description */}
                  Our user-generated content model creates network effects, where more users generate 
                  more valuable content, increasing platform value exponentially.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6"> {/* Left border highlight with padding */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Revenue Streams</h3> {/* Benefit heading */}
                <p className="text-gray-700"> {/* Benefit description */}
                  Subscription models, certification fees, enterprise licensing, and premium features 
                  provide diverse monetization opportunities.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-6"> {/* Left border highlight with padding */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Market Reach</h3> {/* Benefit heading */}
                <p className="text-gray-700"> {/* Benefit description */}
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
              
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"> {/* Contact section with semi-transparent background */}
              <h3 className="text-2xl font-bold mb-4">Let's Talk!</h3> {/* Call-to-action heading */}
              <p className="text-lg mb-4"> {/* Description text */}
                We're open to discussions about investment, partnership, and collaboration opportunities.
              </p>
              <div className="text-center"> {/* Centered button container */}
                <button
                  onClick={() => window.location.href = '/contact'} /* Navigate to contact page when clicked */
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold"
                >
                  Contact Us
                </button>
                <p className="text-sm mt-2 opacity-90"> {/* Small instruction text with reduced opacity */}
                  Include your investment focus, ticket size, and how you can add value beyond capital.
                </p>
              </div>
            </div>
            </div>
          </div>
        </div> {/* End of max-width container */}
      </div> {/* End of centered container */}
    </div> {/* End of main container */}
  ); 
  // End of JSX return
}; 
// End of ForInvestors component

// Export the ForInvestors component as the default export
export default ForInvestors;