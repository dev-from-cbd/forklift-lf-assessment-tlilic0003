// Import React library for component creation
import React from 'react';
// Import icon components from lucide-react library for UI elements
import { ArrowLeft, Target, Users, Zap, Globe, Award, BookOpen } from 'lucide-react';
// Import navigation hook from react-router-dom for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define the AboutUs functional component with TypeScript typing
const AboutUs: React.FC = () => {
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();

  // Render the component
  return (
    // Main container with full screen height and light gray background
    <div className="min-h-screen bg-gray-50">
      {/* Container with responsive padding and centering */}
      <div className="container mx-auto px-4 py-8">
        {/* Content wrapper with maximum width constraint */}
        <div className="max-w-4xl mx-auto">
          {/* Header section with white background and shadow */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Back to home navigation button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              {/* Left arrow icon for back navigation */}
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            {/* Centered header content */}
            <div className="text-center">
              {/* Main page title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
              {/* Page subtitle describing the company mission */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionizing professional training through innovative AI-powered educational platforms
              </p>
            </div>
          </div>

          {/* Mission Section with white background and shadow */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Section header with icon and title */}
            <div className="flex items-center mb-6">
              {/* Target icon representing mission and goals */}
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              {/* Section title */}
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            {/* First paragraph describing the company's transformation goals */}
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We are transforming the landscape of professional training and certification by creating 
              cutting-edge educational platforms that make learning accessible, engaging, and effective. 
              Our flagship project focuses on forklift operator training (TLILIC0004), but our vision 
              extends far beyond a single certification.
            </p>
            {/* Second paragraph about accessibility and future vision */}
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that quality education should be available to everyone, everywhere. Through 
              innovative technology and user-centric design, we're building the future of professional 
              development and skills training.
            </p>
          </div>

          {/* What We Do section with white background and shadow */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Section header with lightning bolt icon and title */}
            <div className="flex items-center mb-6">
              {/* Lightning bolt icon representing energy and innovation */}
              <Zap className="w-8 h-8 text-green-600 mr-3" />
              {/* Section title */}
              <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
            </div>
            
            {/* Two-column grid layout for features, responsive on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column with feature items */}
              <div className="space-y-6">
                {/* Interactive Learning feature */}
                <div className="flex items-start">
                  {/* Book icon for learning */}
                  <BookOpen className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    {/* Feature title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Learning</h3>
                    {/* Feature description */}
                    <p className="text-gray-700">
                      Multi-level difficulty systems with Easy, Medium, and Hard modes featuring 
                      multiple choice, word banks, and free response exercises.
                    </p>
                  </div>
                </div>
                
                {/* User-Generated Content feature */}
                <div className="flex items-start">
                  {/* Users icon for community content */}
                  <Users className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    {/* Feature title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Generated Content</h3>
                    {/* Feature description */}
                    <p className="text-gray-700">
                      Empowering educators and professionals to create and share their own 
                      training courses and assessments.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right column with feature items */}
              <div className="space-y-6">
                {/* Global Accessibility feature */}
                <div className="flex items-start">
                  {/* Globe icon for global reach */}
                  <Globe className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <div>
                    {/* Feature title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Accessibility</h3>
                    {/* Feature description */}
                    <p className="text-gray-700">
                      Mobile-responsive design ensuring learning can happen anywhere, 
                      anytime, on any device.
                    </p>
                  </div>
                </div>
                
                {/* Certification Ready feature */}
                <div className="flex items-start">
                  {/* Award icon for certification */}
                  <Award className="w-6 h-6 text-yellow-500 mr-3 mt-1" />
                  <div>
                    {/* Feature title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Certification Ready</h3>
                    {/* Feature description */}
                    <p className="text-gray-700">
                      Comprehensive training programs designed to prepare learners for 
                      official certifications and real-world applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Section with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            {/* Section title centered with white text */}
            <h2 className="text-3xl font-bold mb-6 text-center">Our Vision</h2>
            {/* Content container with maximum width and center alignment */}
            <div className="max-w-3xl mx-auto text-center">
              {/* First paragraph about breaking educational barriers */}
              <p className="text-lg leading-relaxed mb-6">
                We envision a world where professional training is not limited by geography, 
                resources, or traditional educational barriers. Our platform represents the 
                first step toward creating a comprehensive ecosystem of professional development 
                tools that adapt to individual learning styles and career goals.
              </p>
              {/* Second paragraph about diverse professional applications */}
              <p className="text-lg leading-relaxed">
                From forklift operators to healthcare professionals, from technical specialists 
                to creative professionals – we're building the infrastructure that will power 
                the next generation of workforce development.
              </p>
            </div>
          </div>

          {/* Technology Section with white background */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            {/* Section title centered */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Built with Modern Technology</h2>
            {/* Three-column grid layout for technology features, responsive on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI-Powered technology card */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                {/* Technology feature title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered</h3>
                {/* Technology feature description */}
                <p className="text-gray-700">
                  Leveraging artificial intelligence to create adaptive learning experiences 
                  and intelligent content generation.
                </p>
              </div>
              {/* Cloud-Native technology card */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                {/* Technology feature title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloud-Native</h3>
                {/* Technology feature description */}
                <p className="text-gray-700">
                  Built on modern cloud infrastructure ensuring scalability, reliability, 
                  and global accessibility.
                </p>
              </div>
              {/* Open Innovation technology card */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                {/* Technology feature title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Open Innovation</h3>
                {/* Technology feature description */}
                <p className="text-gray-700">
                  Developed using cutting-edge tools like Bolt.new, demonstrating the 
                  power of AI-assisted development.
                </p>
              </div>
            </div>
          </div>
        {/* End of content wrapper */}
        </div>
      {/* End of container */}
      </div>
    {/* End of main container */}
    </div>
  );
};

// Export the AboutUs component as the default export
export default AboutUs;