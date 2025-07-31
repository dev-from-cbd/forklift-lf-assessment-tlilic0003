// Import React library and useState hook for state management
import React, { useState } from 'react';
// Import icon components from Lucide React for UI elements
import { ArrowLeft, Send, Mail, User, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
// Import navigation hook from React Router for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define ContactForm functional component with TypeScript typing
const ContactForm: React.FC = () => {
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();
  // State hook for managing form data with initial values
  const [formData, setFormData] = useState({
    name: '',                    // User's name field
    email: '',                   // User's email field
    subject: '',                 // Message subject field
    message: '',                 // Message content field
    type: 'general'              // Message type with default value (general, investment, partnership, support)
  });
  // State hook for tracking loading status during form submission
  const [loading, setLoading] = useState(false);
  // State hook for tracking successful form submission
  const [success, setSuccess] = useState(false);
  // State hook for storing error messages
  const [error, setError] = useState('');

  // Async function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();          // Prevent default form submission behavior
    setLoading(true);           // Set loading state to true
    setError('');               // Clear any previous error messages

    try {
      // Send to Supabase Edge Function
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`; // Construct API URL using environment variable
      
      // Make POST request to send contact email
      const response = await fetch(apiUrl, {
        method: 'POST',                                                    // HTTP method
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, // Authorization header with Supabase key
          'Content-Type': 'application/json',                             // Content type header
        },
        body: JSON.stringify(formData)                                     // Convert form data to JSON string
      });

      // Parse response as JSON
      const result = await response.json();
      
      // Check if response is not ok or result indicates failure
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send message');        // Throw error with specific message
      }
      
      // Set success state to true
      setSuccess(true);
      // Reset form data to initial values
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (err) {
      // Set error message based on error type
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);          // Always set loading to false when done
    }
  };

  // Function to handle input changes in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,                // Spread existing form data
      [e.target.name]: e.target.value  // Update specific field based on input name
    });
  };

  // Conditional rendering: if form submission was successful, show success screen
  if (success) {
    return (
      // Full screen container with light gray background
      <div className="min-h-screen bg-gray-50">
        {/* Main container with responsive padding */}
        <div className="container mx-auto px-4 py-8">
          {/* Centered content wrapper with max width */}
          <div className="max-w-2xl mx-auto">
            {/* White card container with shadow */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Back to home button */}
              <button
                onClick={() => navigate('/')}                              // Navigate to home page on click
                className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />                     {/* Left arrow icon */}
                Back to Home                                               {/* Button text */}
              </button>
              
              {/* Success message content centered */}
              <div className="text-center">
                {/* Success icon container with green background */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />       {/* Green checkmark icon */}
                </div>
                {/* Success heading */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
                {/* Success description */}
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                {/* Action buttons container */}
                <div className="space-y-3">
                  {/* Send another message button */}
                  <button
                    onClick={() => setSuccess(false)}                      // Reset success state to show form again
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                  {/* Back to home button */}
                  <button
                    onClick={() => navigate('/')}                          // Navigate to home page
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

  // Main form rendering (when success is false)
  return (
    // Full screen container with light gray background
    <div className="min-h-screen bg-gray-50">
      {/* Main container with responsive padding */}
      <div className="container mx-auto px-4 py-8">
        {/* Centered content wrapper with max width */}
        <div className="max-w-2xl mx-auto">
          {/* White card container with shadow */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Back to home navigation button */}
            <button
              onClick={() => navigate('/')}                                // Navigate to home page on click
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />                       {/* Left arrow icon */}
              Back to Home                                                 {/* Button text */}
            </button>
            
            {/* Header section with title and description */}
            <div className="text-center mb-8">
              {/* Title with mail icon */}
              <div className="flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600 mr-2" />           {/* Mail icon */}
                <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1> {/* Page title */}
              </div>
              {/* Page description */}
              <p className="text-lg text-gray-600">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-6">          {/* Form with submit handler and spacing */}
              {/* Error message display (conditional rendering) */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />   {/* Alert icon */}
                  <span className="text-sm">{error}</span>                 {/* Error message text */}
                </div>
              )}

              {/* Message type selection dropdown */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type                                             {/* Field label */}
                </label>
                <select
                  id="type"                                                {/* Input ID for accessibility */}
                  name="type"                                              {/* Input name for form data */}
                  value={formData.type}                                    {/* Controlled input value */}
                  onChange={handleChange}                                  {/* Change handler */}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Inquiry</option>         {/* General inquiry option */}
                  <option value="investment">Investment Opportunity</option> {/* Investment option */}
                  <option value="partnership">Partnership</option>        {/* Partnership option */}
                  <option value="support">Technical Support</option>      {/* Support option */}
                  <option value="team">Join Our Team</option>             {/* Team option */}
                </select>
              </div>

              {/* Name and email fields in responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">     {/* Responsive grid layout */}
                {/* Name input field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name                                              {/* Field label */}
                  </label>
                  {/* Input container with icon */}
                  <div className="relative">
                    <input
                      type="text"                                          {/* Input type */}
                      id="name"                                            {/* Input ID for accessibility */}
                      name="name"                                          {/* Input name for form data */}
                      value={formData.name}                                {/* Controlled input value */}
                      onChange={handleChange}                              {/* Change handler */}
                      required                                             {/* Required field validation */}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"                       {/* Placeholder text */}
                    />
                    {/* User icon positioned absolutely inside input */}
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Email input field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address                                          {/* Field label */}
                  </label>
                  {/* Input container with icon */}
                  <div className="relative">
                    <input
                      type="email"                                         {/* Email input type with validation */}
                      id="email"                                           {/* Input ID for accessibility */}
                      name="email"                                         {/* Input name for form data */}
                      value={formData.email}                               {/* Controlled input value */}
                      onChange={handleChange}                              {/* Change handler */}
                      required                                             {/* Required field validation */}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"                      {/* Placeholder text */}
                    />
                    {/* Mail icon positioned absolutely inside input */}
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Subject input field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject                                                  {/* Field label */}
                </label>
                <input
                  type="text"                                              {/* Input type */}
                  id="subject"                                             {/* Input ID for accessibility */}
                  name="subject"                                           {/* Input name for form data */}
                  value={formData.subject}                                 {/* Controlled input value */}
                  onChange={handleChange}                                  {/* Change handler */}
                  required                                                 {/* Required field validation */}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your message"         {/* Placeholder text */}
                />
              </div>

              {/* Message textarea field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message                                                  {/* Field label */}
                </label>
                {/* Textarea container with icon */}
                <div className="relative">
                  <textarea
                    id="message"                                           {/* Textarea ID for accessibility */}
                    name="message"                                         {/* Textarea name for form data */}
                    value={formData.message}                               {/* Controlled textarea value */}
                    onChange={handleChange}                                {/* Change handler */}
                    required                                               {/* Required field validation */}
                    rows={6}                                               {/* Number of visible rows */}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us more about your inquiry..."       {/* Placeholder text */}
                  />
                  {/* Message icon positioned absolutely inside textarea */}
                  <MessageSquare className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Information section with expectations */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">What to expect:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We typically respond within 24-48 hours</li>
                  <li>• For investment inquiries, please include your background and investment focus</li>
                  <li>• For partnership opportunities, describe how we can work together</li>
                  <li>• For technical support, include as much detail as possible</li>
                </ul>
              </div>

              {/* Submit button with loading state */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Conditional rendering based on loading state */}
                {loading ? (
                  <>
                    {/* Loading spinner and text */}
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    {/* Send icon and text */}
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