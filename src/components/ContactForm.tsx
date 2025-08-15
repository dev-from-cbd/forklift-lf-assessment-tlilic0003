// Import React library and useState hook for state management
import React, { useState } from 'react';
// Import various icons from lucide-react for UI elements
import { ArrowLeft, Send, Mail, User, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define ContactForm functional component with TypeScript typing
const ContactForm: React.FC = () => {
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();
  // Initialize form data state with default values for all form fields
  const [formData, setFormData] = useState({
    name: '', // User's name field
    email: '', // User's email address field
    subject: '', // Message subject field
    message: '', // Main message content field
    type: 'general' // Message type selector (general, investment, partnership, support)
  });
  // State to track loading status during form submission
  const [loading, setLoading] = useState(false);
  // State to track successful form submission
  const [success, setSuccess] = useState(false);
  // State to store error messages if submission fails
  const [error, setError] = useState('');

  // Async function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Set loading state to true to show loading indicator
    setLoading(true);
    // Clear any previous error messages
    setError('');

    try {
      // Construct API URL for Supabase Edge Function to send contact email
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      
      // Make POST request to send contact form data
      const response = await fetch(apiUrl, {
        method: 'POST', // HTTP method for sending data
        headers: {
          // Authorization header with Supabase anonymous key
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          // Content type header for JSON data
          'Content-Type': 'application/json',
        },
        // Convert form data to JSON string for request body
        body: JSON.stringify(formData)
      });

      // Parse response as JSON
      const result = await response.json();
      
      // Check if response is not ok or result indicates failure
      if (!response.ok || !result.success) {
        // Throw error with message from response or default message
        throw new Error(result.error || 'Failed to send message');
      }
      
      // Set success state to true to show success message
      setSuccess(true);
      // Reset form data to initial empty state
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (err) {
      // Set error message from caught error or default message
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      // Always set loading to false when request completes
      setLoading(false);
    }
  };

  // Function to handle input changes for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Update form data state with new value while preserving other fields
    setFormData({
      ...formData, // Spread existing form data
      [e.target.name]: e.target.value // Update specific field based on input name
    });
  };

  // Conditional rendering: show success page if form was submitted successfully
  if (success) {
    return (
      // Success page container with full screen height and light gray background
      <div className="min-h-screen bg-gray-50">
        {/* Main container with responsive padding and centering */}
        <div className="container mx-auto px-4 py-8">
          {/* Content wrapper with maximum width constraint */}
          <div className="max-w-2xl mx-auto">
            {/* White card container with rounded corners and shadow */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Back to home navigation button */}
              <button
                onClick={() => navigate('/')} // Navigate to home page on click
                className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
              >
                {/* Left arrow icon */}
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              
              {/* Success message content container with center alignment */}
              <div className="text-center">
                {/* Success icon container with green background */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  {/* Check circle icon indicating success */}
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                {/* Success message heading */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
                {/* Success message description */}
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                {/* Action buttons container */}
                <div className="space-y-3">
                  {/* Button to send another message */}
                  <button
                    onClick={() => setSuccess(false)} // Reset success state to show form again
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                  {/* Button to navigate back to home */}
                  <button
                    onClick={() => navigate('/')} // Navigate to home page
                    className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main contact form page rendering
  return (
    // Main page container with full screen height and light gray background
    <div className="min-h-screen bg-gray-50">
      {/* Container with responsive padding and centering */}
      <div className="container mx-auto px-4 py-8">
        {/* Content wrapper with maximum width constraint */}
        <div className="max-w-2xl mx-auto">
          {/* White card container with rounded corners and shadow */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Back to home navigation button */}
            <button
              onClick={() => navigate('/')} // Navigate to home page on click
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              {/* Left arrow icon */}
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            {/* Header section with title and description */}
            <div className="text-center mb-8">
              {/* Title container with icon and heading */}
              <div className="flex items-center justify-center mb-4">
                {/* Mail icon */}
                <Mail className="w-8 h-8 text-blue-600 mr-2" />
                {/* Page title */}
                <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
              </div>
              {/* Page description */}
              <p className="text-lg text-gray-600">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact form with submit handler and spacing between fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message display - only shown when error exists */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                  {/* Alert circle icon for error indication */}
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {/* Error message text */}
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Message type selection field */}
              <div>
                {/* Label for message type dropdown */}
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                {/* Dropdown select for message type */}
                <select
                  id="type" // HTML id for accessibility
                  name="type" // Form field name
                  value={formData.type} // Current selected value from state
                  onChange={handleChange} // Handle selection changes
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {/* Option for general inquiries */}
                  <option value="general">General Inquiry</option>
                  {/* Option for investment opportunities */}
                  <option value="investment">Investment Opportunity</option>
                  {/* Option for partnership requests */}
                  <option value="partnership">Partnership</option>
                  {/* Option for technical support */}
                  <option value="support">Technical Support</option>
                  {/* Option for job applications */}
                  <option value="team">Join Our Team</option>
                </select>
              </div>

              {/* Grid layout for name and email fields - responsive columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name input field container */}
                <div>
                  {/* Label for name input */}
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  {/* Relative container for input with icon */}
                  <div className="relative">
                    {/* Name text input field */}
                    <input
                      type="text" // Input type for text
                      id="name" // HTML id for accessibility
                      name="name" // Form field name
                      value={formData.name} // Current value from state
                      onChange={handleChange} // Handle input changes
                      required // Make field required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name" // Placeholder text
                    />
                    {/* User icon positioned absolutely inside input */}
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Email input field container */}
                <div>
                  {/* Label for email input */}
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {/* Relative container for input with icon */}
                  <div className="relative">
                    {/* Email input field with validation */}
                    <input
                      type="email" // Input type for email validation
                      id="email" // HTML id for accessibility
                      name="email" // Form field name
                      value={formData.email} // Current value from state
                      onChange={handleChange} // Handle input changes
                      required // Make field required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email" // Placeholder text
                    />
                    {/* Mail icon positioned absolutely inside input */}
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Subject input field container */}
              <div>
                {/* Label for subject input */}
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                {/* Subject text input field */}
                <input
                  type="text" // Input type for text
                  id="subject" // HTML id for accessibility
                  name="subject" // Form field name
                  value={formData.subject} // Current value from state
                  onChange={handleChange} // Handle input changes
                  required // Make field required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your message" // Placeholder text
                />
              </div>

              {/* Message textarea field container */}
              <div>
                {/* Label for message textarea */}
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                {/* Relative container for textarea with icon */}
                <div className="relative">
                  {/* Message textarea field */}
                  <textarea
                    id="message" // HTML id for accessibility
                    name="message" // Form field name
                    value={formData.message} // Current value from state
                    onChange={handleChange} // Handle input changes
                    required // Make field required
                    rows={6} // Number of visible text lines
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us more about your inquiry..." // Placeholder text
                  />
                  {/* Message square icon positioned absolutely inside textarea */}
                  <MessageSquare className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Information box with expectations and guidelines */}
              <div className="bg-blue-50 p-4 rounded-lg">
                {/* Information box heading */}
                <h3 className="text-sm font-medium text-blue-900 mb-2">What to expect:</h3>
                {/* List of expectations and guidelines */}
                <ul className="text-sm text-blue-800 space-y-1">
                  {/* Response time expectation */}
                  <li>• We typically respond within 24-48 hours</li>
                  {/* Investment inquiry guidelines */}
                  <li>• For investment inquiries, please include your background and investment focus</li>
                  {/* Partnership opportunity guidelines */}
                  <li>• For partnership opportunities, describe how we can work together</li>
                  {/* Technical support guidelines */}
                  <li>• For technical support, include as much detail as possible</li>
                </ul>
              </div>

              {/* Submit button with loading state and conditional content */}
              <button
                type="submit" // Button type for form submission
                disabled={loading} // Disable button during loading
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Conditional rendering based on loading state */}
                {loading ? (
                  // Loading state content
                  <>
                    {/* Spinning loader icon */}
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  // Normal state content
                  <>
                    {/* Send icon */}
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export ContactForm component as default export
export default ContactForm;