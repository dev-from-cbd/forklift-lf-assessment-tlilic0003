// Import React and necessary hooks for component state and side effects
import React, { useState, useEffect } from 'react';
// Import authentication context to access user information
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import Lucide React icons for UI elements
import { 
  Plus, // For adding new items
  Save, // For saving changes
  Eye, // For published status
  EyeOff, // For draft status
  Trash2, // For delete actions
  BookOpen, // For course and question related UI
  Users, // For enrollment count
  Clock, // For duration display
  Star, // For ratings or importance
  Edit3, // For edit actions
  CheckCircle, // For success indicators
  AlertCircle, // For warning/error indicators
  ArrowLeft, // For navigation back
  ArrowRight // For navigation forward
} from 'lucide-react';

// Interface defining the structure of a Course object
interface Course {
  id: string; // Unique identifier for the course
  title: string; // Title of the course
  description: string; // Description of what the course covers
  category: string; // Category the course belongs to (e.g., 'general', 'forklift')
  difficulty_level: string; // Difficulty level (e.g., 'beginner', 'intermediate', 'advanced')
  estimated_duration: number; // Estimated time to complete in minutes
  is_published: boolean; // Whether the course is visible to users
  total_questions: number; // Total number of questions in the course
  total_enrollments: number; // Number of users enrolled in the course
  created_at: string; // Timestamp when the course was created
}

// Interface defining the structure of a Question object
interface Question {
  id?: string; // Optional unique identifier (not required for new questions)
  question_number: number; // Order/position of the question in the course
  question_text: string; // The actual question being asked
  correct_answer: string; // The primary correct answer
  acceptable_answers: string[]; // Alternative answers that are also considered correct
  explanation: string; // Explanation of why the answer is correct
  difficulty_level: string; // Difficulty level of the question
  question_type: string; // Type of question (e.g., 'text', 'multiple-choice')
  multiple_choice_options: string[]; // Options for multiple choice questions
  word_bank_words: string[]; // Words provided for fill-in-the-blank questions
  points: number; // Points awarded for correctly answering this question
}

// Main CourseCreator component for managing educational courses
const CourseCreator: React.FC = () => {
  // Get current authenticated user from AuthContext
  const { user } = useAuth();
  // State for storing the list of courses created by the user
  const [courses, setCourses] = useState<Course[]>([]);
  // State for the currently selected course (for editing)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // State for storing questions of the selected course
  const [questions, setQuestions] = useState<Question[]>([]);
  // State for controlling which view is currently displayed
  const [currentView, setCurrentView] = useState<'courses' | 'edit-course' | 'edit-questions'>('courses');
  // State for tracking data loading status
  const [loading, setLoading] = useState(true);
  // State for tracking save operations status
  const [saving, setSaving] = useState(false);
  // State for feedback messages to the user
  const [message, setMessage] = useState('');

  // State for the course creation/editing form
  const [courseForm, setCourseForm] = useState({
    title: '', // Course title input
    description: '', // Course description input
    category: 'general', // Default category selection
    difficulty_level: 'beginner', // Default difficulty level
    estimated_duration: 60, // Default duration in minutes
    is_published: false // Default to unpublished (draft) state
  });

  // State for the question creation/editing form
  const [questionForm, setQuestionForm] = useState<Question>({
    question_number: 1, // Default to first question
    question_text: '', // The question text input
    correct_answer: '', // The correct answer input
    acceptable_answers: [''], // Alternative acceptable answers (starts with one empty field)
    explanation: '', // Explanation for the answer
    difficulty_level: 'medium', // Default difficulty level for questions
    question_type: 'text', // Default question type
    multiple_choice_options: ['', '', '', ''], // Four empty options for multiple choice
    word_bank_words: [''], // Words for word bank (starts with one empty field)
    points: 1 // Default point value
  });

  // Load user's courses when component mounts or user changes
  useEffect(() => {
    fetchUserCourses();
  }, [user]); // Re-run when user changes

  // Function to fetch all courses created by the current user
  const fetchUserCourses = async () => {
    if (!user) return; // Exit if no user is authenticated

    try {
      setLoading(true); // Set loading state to show spinner
      // Query Supabase for courses where creator_id matches current user
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false }); // Sort by newest first

      if (error) throw error; // Handle any database errors
      setCourses(data || []); // Update courses state with fetched data
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage('Failed to load courses'); // Set error message for user
    } finally {
      setLoading(false); // Turn off loading state regardless of outcome
    }
  };

  // Function to fetch all questions for a specific course
  const fetchCourseQuestions = async (courseId: string) => {
    try {
      // Query Supabase for questions that belong to the selected course
      const { data, error } = await supabase
        .from('course_questions')
        .select('*')
        .eq('course_id', courseId)
        .order('question_number', { ascending: true }); // Sort by question number

      if (error) throw error; // Handle any database errors
      setQuestions(data || []); // Update questions state with fetched data
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage('Failed to load questions'); // Set error message for user
    }
  };

  // Function to create a new course in the database
  const createCourse = async () => {
    if (!user) return; // Exit if no user is authenticated

    try {
      setSaving(true); // Set saving state to show loading indicator
      // Insert new course into Supabase with form data and creator information
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseForm, // All form fields (title, description, etc.)
          creator_id: user.id, // Link course to current user
          creator_name: user.email?.split('@')[0] || 'User', // Extract name from email
          creator_email: user.email // Store creator's email
        })
        .select() // Return the created record
        .single(); // Expect a single record

      if (error) throw error; // Handle any database errors

      setMessage('Course created successfully!'); // Success message
      // Reset form to default values
      setCourseForm({
        title: '',
        description: '',
        category: 'general',
        difficulty_level: 'beginner',
        estimated_duration: 60,
        is_published: false
      });
      fetchUserCourses(); // Refresh the courses list
      setCurrentView('courses'); // Return to courses list view
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('Failed to create course'); // Error message for user
    } finally {
      setSaving(false); // Turn off saving state regardless of outcome
    }
  };

  // Function to update an existing course in the database
  const updateCourse = async () => {
    if (!selectedCourse) return; // Exit if no course is selected

    try {
      setSaving(true); // Set saving state to show loading indicator
      // Update the course in Supabase with new form data
      const { error } = await supabase
        .from('courses')
        .update(courseForm) // Update with current form values
        .eq('id', selectedCourse.id); // Match by course ID

      if (error) throw error; // Handle any database errors

      setMessage('Course updated successfully!'); // Success message
      fetchUserCourses(); // Refresh the courses list
      setCurrentView('courses'); // Return to courses list view
    } catch (error) {
      console.error('Error updating course:', error);
      setMessage('Failed to update course'); // Error message for user
    } finally {
      setSaving(false); // Turn off saving state regardless of outcome
    }
  };

  // Function to delete a course from the database
  const deleteCourse = async (courseId: string) => {
    // Confirm with the user before proceeding with deletion
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return; // Exit if user cancels
    }

    try {
      // Delete the course from Supabase
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId); // Match by course ID

      if (error) throw error; // Handle any database errors

      setMessage('Course deleted successfully!'); // Success message
      fetchUserCourses(); // Refresh the courses list
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage('Failed to delete course'); // Error message for user
    }
  };

  // Function to save a question (create new or update existing)
  const saveQuestion = async () => {
    if (!selectedCourse) return; // Exit if no course is selected

    try {
      setSaving(true); // Set saving state to show loading indicator
      
      if (questionForm.id) {
        // Update existing question if ID exists
        const { error } = await supabase
          .from('course_questions')
          .update({
            ...questionForm, // All form fields
            course_id: selectedCourse.id // Link to current course
          })
          .eq('id', questionForm.id); // Match by question ID

        if (error) throw error; // Handle any database errors
      } else {
        // Create new question if no ID exists
        const { error } = await supabase
          .from('course_questions')
          .insert({
            ...questionForm, // All form fields
            course_id: selectedCourse.id // Link to current course
          });

        if (error) throw error; // Handle any database errors
      }

      setMessage('Question saved successfully!'); // Success message
      fetchCourseQuestions(selectedCourse.id); // Refresh questions list
      resetQuestionForm(); // Reset form for next question
    } catch (error) {
      console.error('Error saving question:', error);
      setMessage('Failed to save question'); // Error message for user
    } finally {
      setSaving(false); // Turn off saving state regardless of outcome
    }
  };

  // Function to delete a question from the database
  const deleteQuestion = async (questionId: string) => {
    // Confirm with the user before proceeding with deletion
    if (!confirm('Are you sure you want to delete this question?')) {
      return; // Exit if user cancels
    }

    try {
      // Delete the question from Supabase
      const { error } = await supabase
        .from('course_questions')
        .delete()
        .eq('id', questionId); // Match by question ID

      if (error) throw error; // Handle any database errors

      setMessage('Question deleted successfully!'); // Success message
      // Refresh questions list if a course is selected
      if (selectedCourse) {
        fetchCourseQuestions(selectedCourse.id);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessage('Failed to delete question'); // Error message for user
    }
  };

  // Function to reset the question form to default values
  const resetQuestionForm = () => {
    // Calculate the next question number based on existing questions
    const nextQuestionNumber = questions.length + 1;
    // Reset all form fields to defaults
    setQuestionForm({
      question_number: nextQuestionNumber, // Set to next available number
      question_text: '', // Clear question text
      correct_answer: '', // Clear correct answer
      acceptable_answers: [''], // Reset to one empty field
      explanation: '', // Clear explanation
      difficulty_level: 'medium', // Reset to default difficulty
      question_type: 'text', // Reset to default type
      multiple_choice_options: ['', '', '', ''], // Reset to four empty options
      word_bank_words: [''], // Reset to one empty word
      points: 1 // Reset to default point value
    });
  };

  // Function to load a question into the form for editing
  const editQuestion = (question: Question) => {
    setQuestionForm(question); // Set form state to the selected question's data
  };

  // Function to add a new empty field for an acceptable answer
  const addAcceptableAnswer = () => {
    setQuestionForm({
      ...questionForm, // Keep existing form data
      acceptable_answers: [...questionForm.acceptable_answers, ''] // Add empty string to array
    });
  };

  // Function to update a specific acceptable answer at the given index
  const updateAcceptableAnswer = (index: number, value: string) => {
    const newAnswers = [...questionForm.acceptable_answers]; // Copy current answers array
    newAnswers[index] = value; // Update the value at the specified index
    setQuestionForm({
      ...questionForm, // Keep existing form data
      acceptable_answers: newAnswers // Update with modified array
    });
  };

  // Function to remove an acceptable answer at the given index
  const removeAcceptableAnswer = (index: number) => {
    // Only allow removal if there's more than one answer (keep at least one field)
    if (questionForm.acceptable_answers.length > 1) {
      // Filter out the answer at the specified index
      const newAnswers = questionForm.acceptable_answers.filter((_, i) => i !== index);
      setQuestionForm({
        ...questionForm, // Keep existing form data
        acceptable_answers: newAnswers // Update with filtered array
      });
    }
  };

  // Function to update a specific multiple choice option at the given index
  const updateMultipleChoiceOption = (index: number, value: string) => {
    const newOptions = [...questionForm.multiple_choice_options]; // Copy current options array
    newOptions[index] = value; // Update the value at the specified index
    setQuestionForm({
      ...questionForm, // Keep existing form data
      multiple_choice_options: newOptions // Update with modified array
    });
  };

  // Function to add a new empty field for a word bank word
  const addWordBankWord = () => {
    setQuestionForm({
      ...questionForm, // Keep existing form data
      word_bank_words: [...questionForm.word_bank_words, ''] // Add empty string to array
    });
  };

  // Function to update a specific word bank word at the given index
  const updateWordBankWord = (index: number, value: string) => {
    const newWords = [...questionForm.word_bank_words]; // Copy current words array
    newWords[index] = value; // Update the value at the specified index
    setQuestionForm({
      ...questionForm, // Keep existing form data
      word_bank_words: newWords // Update with modified array
    });
  };

  // Function to remove a word bank word at the given index
  const removeWordBankWord = (index: number) => {
    // Only allow removal if there's more than one word (keep at least one field)
    if (questionForm.word_bank_words.length > 1) {
      // Filter out the word at the specified index
      const newWords = questionForm.word_bank_words.filter((_, i) => i !== index);
      setQuestionForm({
        ...questionForm, // Keep existing form data
        word_bank_words: newWords // Update with filtered array
      });
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-6xl mx-auto p-6"> {/* Main container with max width and padding */
      {/* Header section with title and navigation */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            {/* Main title with icon */}
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
              Course Creator
            </h1>
            {/* Subtitle explaining purpose */}
            <p className="text-gray-600 mt-2">Create and manage your educational courses</p>
          </div>
          
          {/* Back button - only shown when not on the main courses view */}
          {currentView !== 'courses' && (
            <button
              onClick={() => {
                setCurrentView('courses'); // Return to courses list
                setSelectedCourse(null); // Clear selected course
                resetQuestionForm(); // Reset question form
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </button>
          )}
        </div>

        {/* Feedback message - only shown when there is a message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700' // Green styling for success messages
              : 'bg-red-50 text-red-700' // Red styling for error messages
          }`}>
            {/* Icon based on message type */}
            {message.includes('successfully') ? (
              <CheckCircle className="w-5 h-5 mr-2" /> // Success icon
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" /> // Error icon
            )}
            {message} {/* Display the message text */}
          </div>
        )}
      </div>

      {/* Courses List View - Main view showing all user's courses */}
      {currentView === 'courses' && (
        <div className="space-y-6">
          {/* Create New Course Button */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => {
                setCourseForm({ // Initialize empty course form
                  title: '',
                  description: '',
                  category: 'general',
                  difficulty_level: 'beginner',
                  estimated_duration: 60,
                  is_published: false
                });
                setCurrentView('edit-course'); // Switch to course edit view
              }}
              className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Course
            </button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {course.is_published ? (
                        <Eye className="w-5 h-5 text-green-500" title="Published" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" title="Draft" />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.estimated_duration} min
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.total_enrollments} enrolled
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.difficulty_level}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.total_questions} questions
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setCourseForm({
                        title: course.title,
                        description: course.description,
                        category: course.category,
                        difficulty_level: course.difficulty_level,
                        estimated_duration: course.estimated_duration,
                        is_published: course.is_published
                      });
                      setCurrentView('edit-course');
                    }}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      fetchCourseQuestions(course.id);
                      setCurrentView('edit-questions');
                    }}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Questions
                  </button>

                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state when no courses exist */}
          {courses.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" /> {/* Empty courses icon */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course to get started!</p>
              <button
                onClick={() => setCurrentView('edit-course')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      )}

      {/* Course Edit View */}
      {currentView === 'edit-course' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCourse ? 'Edit Course' : 'Create New Course'}
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your course"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="forklift">Forklift</option>
                  <option value="safety">Safety</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={courseForm.difficulty_level}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={courseForm.estimated_duration}
                  onChange={(e) => setCourseForm({ ...courseForm, estimated_duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={courseForm.is_published}
                onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                Publish course (make it visible to other users)
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={selectedCourse ? updateCourse : createCourse}
                disabled={saving}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : selectedCourse ? 'Update Course' : 'Create Course'}
              </button>

              <button
                onClick={() => setCurrentView('courses')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Edit View */}
      {currentView === 'edit-questions' && selectedCourse && (
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
            <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{questions.length} questions</span>
              <span>•</span>
              <span>{selectedCourse.estimated_duration} minutes</span>
              <span>•</span>
              <span className="capitalize">{selectedCourse.difficulty_level}</span>
            </div>
          </div>

          {/* Question Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">
              {questionForm.id ? 'Edit Question' : 'Add New Question'}
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Number
                  </label>
                  <input
                    type="number"
                    value={questionForm.question_number}
                    onChange={(e) => setQuestionForm({ ...questionForm, question_number: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={questionForm.correct_answer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the correct answer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acceptable Answers (alternatives)
                </label>
                {questionForm.acceptable_answers.map((answer, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => updateAcceptableAnswer(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alternative answer"
                    />
                    {questionForm.acceptable_answers.length > 1 && (
                      <button
                        onClick={() => removeAcceptableAnswer(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addAcceptableAnswer}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Alternative
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation
                </label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explain why this is the correct answer"
                />
              </div>

              {/* Multiple Choice Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiple Choice Options (for Easy mode)
                </label>
                {questionForm.multiple_choice_options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateMultipleChoiceOption(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Word Bank Words */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word Bank Words (for Medium mode)
                </label>
                {questionForm.word_bank_words.map((word, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={word}
                      onChange={(e) => updateWordBankWord(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Word"
                    />
                    {questionForm.word_bank_words.length > 1 && (
                      <button
                        onClick={() => removeWordBankWord(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addWordBankWord}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Word
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={saveQuestion}
                  disabled={saving}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : questionForm.id ? 'Update Question' : 'Add Question'}
                </button>

                {questionForm.id && (
                  <button
                    onClick={resetQuestionForm}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Course Questions</h3>

            {questions.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No questions added yet. Create your first question above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            Q{question.question_number}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            {question.points} {question.points === 1 ? 'point' : 'points'}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{question.question_text}</h4>
                        <p className="text-sm text-green-600 mb-2">
                          <strong>Answer:</strong> {question.correct_answer}
                        </p>
                        {question.explanation && (
                          <p className="text-sm text-gray-600">{question.explanation}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => editQuestion(question)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCreator;