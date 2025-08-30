// Import React library for creating components
import React from 'react';
// Import specific icons from lucide-react icon library
import { ArrowLeft, Users, Zap, Code, Heart, Rocket, Plus } from 'lucide-react';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define Team component as a functional component with TypeScript
const Team: React.FC = () => {
  // Initialize navigation hook for routing
  const navigate = useNavigate();

  // Return JSX for the Team component
  return (
    // Main container with full screen height and light gray background
    <div className="min-h-screen bg-gray-50">
      {/* Container with responsive margins and padding */}
      <div className="container mx-auto px-4 py-8">
        {/* Content wrapper with maximum width constraint */}
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {/* Header section with white background and shadow */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Back to home navigation button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              {/* Left arrow icon */}
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            {/* Centered header content */}
            <div className="text-center">
              {/* Main page title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
              {/* Page subtitle/description */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built by AI enthusiasts, powered by innovation, driven by passion
              </p>
            </div>
          </div>

          {/* Current Team */}
          {/* Current Team section container */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Section header with icon and title */}
            <div className="flex items-center mb-6">
              {/* Users icon */}
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              {/* Section title */}
              <h2 className="text-3xl font-bold text-gray-900">Current Team</h2>
            </div>
            
            {/* AI-powered development highlight box */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              {/* AI development subsection header */}
              <div className="flex items-center mb-4">
                {/* Lightning bolt icon */}
                <Zap className="w-6 h-6 text-purple-600 mr-2" />
                {/* Subsection title */}
                <h3 className="text-xl font-semibold text-gray-900">AI-Powered Development</h3>
              </div>
              {/* Description of AI-powered development approach */}
              <p className="text-lg text-gray-700 leading-relaxed">
                This project is being developed by an AI enthusiast using cutting-edge tools like 
                {/* Highlighted tool name */}
                <span className="font-semibold text-purple-600"> Bolt.new</span>, demonstrating 
                the incredible potential of AI-assisted development. We're proving that with the 
                right vision, modern tools, and determination, small teams can create powerful, 
                scalable solutions.
              </p>
            </div>

            {/* Two-column grid for feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Excellence card */}
              <div className="bg-gray-50 rounded-lg p-6">
                {/* Card header with icon and title */}
                <div className="flex items-center mb-4">
                  {/* Code icon */}
                  <Code className="w-6 h-6 text-green-600 mr-2" />
                  {/* Card title */}
                  <h3 className="text-xl font-semibold text-gray-900">Technical Excellence</h3>
                </div>
                {/* Card description */}
                <p className="text-gray-700">
                  Our development approach combines human creativity with AI capabilities, 
                  resulting in rapid prototyping and high-quality code production.
                </p>
              </div>
              
              {/* Passion-Driven card */}
              <div className="bg-gray-50 rounded-lg p-6">
                {/* Card header with icon and title */}
                <div className="flex items-center mb-4">
                  {/* Heart icon */}
                  <Heart className="w-6 h-6 text-red-600 mr-2" />
                  {/* Card title */}
                  <h3 className="text-xl font-semibold text-gray-900">Passion-Driven</h3>
                </div>
                {/* Card description */}
                <p className="text-gray-700">
                  Every feature is built with genuine care for user experience and 
                  educational impact, not just technical achievement.
                </p>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          {/* Join Us section with gradient background */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
            {/* Centered header content */}
            <div className="text-center mb-8">
              {/* Header with icon and title */}
              <div className="flex items-center justify-center mb-4">
                {/* Plus icon */}
                <Plus className="w-8 h-8 mr-2" />
                {/* Section title */}
                <h2 className="text-3xl font-bold">Join Our Team!</h2>
              </div>
              {/* Section description */}
              <p className="text-xl leading-relaxed max-w-3xl mx-auto">
                Are you an AI enthusiast looking to build your portfolio and gain real-world 
                startup experience? We welcome passionate individuals who want to be part of 
                something innovative and impactful!
              </p>
            </div>

            {/* Two-column grid for offers and requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* What We Offer column */}
              <div>
                {/* Column title */}
                <h3 className="text-2xl font-bold mb-4">What We Offer:</h3>
                {/* List of offerings */}
                <ul className="space-y-3">
                  {/* Startup experience offer */}
                  <li className="flex items-start">
                    {/* Rocket icon */}
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Real startup experience with cutting-edge technology</span>
                  </li>
                  {/* AI tools offer */}
                  <li className="flex items-start">
                    {/* Rocket icon */}
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Opportunity to work with AI-powered development tools</span>
                  </li>
                  {/* Portfolio building offer */}
                  <li className="flex items-start">
                    {/* Rocket icon */}
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Portfolio-building projects with real impact</span>
                  </li>
                  {/* Remote work offer */}
                  <li className="flex items-start">
                    {/* Rocket icon */}
                    <Rocket className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Flexible, remote-friendly collaboration</span>
                  </li>
                </ul>
              </div>
              
              {/* We're Looking For column */}
              <div>
                {/* Column title */}
                <h3 className="text-2xl font-bold mb-4">We're Looking For:</h3>
                {/* List of requirements */}
                <ul className="space-y-3">
                  {/* AI enthusiasts requirement */}
                  <li className="flex items-start">
                    {/* Plus icon */}
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>AI enthusiasts and early adopters</span>
                  </li>
                  {/* Developers requirement */}
                  <li className="flex items-start">
                    {/* Plus icon */}
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Developers interested in modern web technologies</span>
                  </li>
                  {/* Designers requirement */}
                  <li className="flex items-start">
                    {/* Plus icon */}
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>UX/UI designers with a passion for education</span>
                  </li>
                  {/* Marketing requirement */}
                  <li className="flex items-start">
                    {/* Plus icon */}
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Marketing and business development minds</span>
                  </li>
                  {/* Content creators requirement */}
                  <li className="flex items-start">
                    {/* Plus icon */}
                    <Plus className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Educational content creators and subject matter experts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Culture & Values */}
          {/* Culture & Values section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Section title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Culture & Values</h2>
            
            {/* Three-column grid for value cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Innovation First value card */}
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                {/* Icon container with blue background */}
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Lightning bolt icon */}
                  <Zap className="w-6 h-6 text-white" />
                </div>
                {/* Value title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation First</h3>
                {/* Value description */}
                <p className="text-gray-700">
                  We embrace new technologies and aren't afraid to experiment with 
                  cutting-edge tools and methodologies.
                </p>
              </div>
              
              {/* Collaborative Spirit value card */}
              <div className="text-center p-6 bg-green-50 rounded-lg">
                {/* Icon container with green background */}
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Users icon */}
                  <Users className="w-6 h-6 text-white" />
                </div>
                {/* Value title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Spirit</h3>
                {/* Value description */}
                <p className="text-gray-700">
                  We believe in the power of diverse perspectives and collaborative 
                  problem-solving to create better solutions.
                </p>
              </div>
              
              {/* Impact Driven value card */}
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                {/* Icon container with purple background */}
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Heart icon */}
                  <Heart className="w-6 h-6 text-white" />
                </div>
                {/* Value title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Impact Driven</h3>
                {/* Value description */}
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
            {/* End of value cards grid */}
            </div>
          {/* End of Culture & Values section */}
          </div>
        {/* End of main content container */}
        </div>
      {/* End of page container */}
      </div>
    {/* End of main wrapper */}
     </div>
    // End of component return
    );
}; // End of Team component

export default Team;