// Import React and hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import authentication context for user management
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React for UI elements
import { 
  Plus,        // Icon for adding new items
  Save,        // Icon for saving data
  Eye,         // Icon for published/visible items
  EyeOff,      // Icon for draft/hidden items
  Trash2,      // Icon for deleting items
  BookOpen,    // Icon for courses and learning
  Users,       // Icon for user enrollment count
  Clock,       // Icon for time/duration
  Star,        // Icon for ratings or favorites
  Edit3,       // Icon for editing content
  CheckCircle, // Icon for success messages
  AlertCircle, // Icon for error messages
  ArrowLeft,   // Icon for navigation back
  ArrowRight   // Icon for navigation forward
} from 'lucide-react';

// Interface defining the structure of a course object
interface Course {
  id: string;                    // Unique identifier for the course
  title: string;                 // Course title/name
  description: string;           // Detailed description of the course
  category: string;              // Course category (e.g., 'forklift', 'safety')
  difficulty_level: string;      // Difficulty level ('beginner', 'intermediate', 'advanced')
  estimated_duration: number;    // Estimated time to complete in minutes
  is_published: boolean;         // Whether the course is published or in draft
  total_questions: number;       // Total number of questions in the course
  total_enrollments: number;     // Number of users enrolled in the course
  created_at: string;            // Timestamp when the course was created
}

// Interface defining the structure of a question object
interface Question {
  id?: string;                        // Optional unique identifier for existing questions
  question_number: number;            // Sequential number of the question in the course
  question_text: string;              // The actual question text
  correct_answer: string;             // The primary correct answer
  acceptable_answers: string[];       // Array of acceptable alternative answers
  explanation: string;                // Explanation provided after answering
  difficulty_level: string;           // Question difficulty ('easy', 'medium', 'hard')
  question_type: string;              // Type of question ('text', 'multiple_choice', 'word_bank')
  multiple_choice_options: string[];  // Options for multiple choice questions
  word_bank_words: string[];          // Words available for word bank questions
  points: number;                     // Points awarded for correct answer
}

// Main CourseCreator functional component
const CourseCreator: React.FC = () => {
  // Get current authenticated user from auth context
  const { user } = useAuth();
  // State for storing list of user's courses
  const [courses, setCourses] = useState<Course[]>([]);
  // State for currently selected course being edited
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // State for storing questions of the selected course
  const [questions, setQuestions] = useState<Question[]>([]);
  // State for controlling which view is currently displayed
  const [currentView, setCurrentView] = useState<'courses' | 'edit-course' | 'edit-questions'>('courses');
  // State for loading indicator during data fetching
  const [loading, setLoading] = useState(true);
  // State for saving indicator during data operations
  const [saving, setSaving] = useState(false);
  // State for displaying success/error messages to user
  const [message, setMessage] = useState('');

  // Course form state - manages form data for creating/editing courses
  const [courseForm, setCourseForm] = useState({
    title: '',                    // Course title input
    description: '',              // Course description input
    category: 'general',          // Selected category (default: general)
    difficulty_level: 'beginner', // Selected difficulty level (default: beginner)
    estimated_duration: 60,       // Duration in minutes (default: 60)
    is_published: false           // Publication status (default: draft)
  });

  // Question form state - manages form data for creating/editing questions
  const [questionForm, setQuestionForm] = useState<Question>({
    question_number: 1,                           // Sequential question number
    question_text: '',                            // Question text input
    correct_answer: '',                           // Primary correct answer
    acceptable_answers: [''],                     // Array of acceptable answers (starts with one empty)
    explanation: '',                              // Explanation text for the answer
    difficulty_level: 'medium',                   // Question difficulty (default: medium)
    question_type: 'text',                        // Type of question (default: text)
    multiple_choice_options: ['', '', '', ''],    // Four options for multiple choice questions
    word_bank_words: [''],                        // Words for word bank questions (starts with one empty)
    points: 1                                     // Points awarded for correct answer (default: 1)
  });

  // Effect hook to fetch user's courses when component mounts or user changes
  useEffect(() => {
    fetchUserCourses(); // Load courses for the current user
  }, [user]); // Dependency array - re-run when user changes

  // Async function to fetch all courses created by the current user
  const fetchUserCourses = async () => {
    // Exit early if no user is authenticated
    if (!user) return;

    try {
      // Set loading state to show spinner
      setLoading(true);
      // Query Supabase for courses where creator_id matches current user
      const { data, error } = await supabase
        .from('courses')           // From courses table
        .select('*')               // Select all columns
        .eq('creator_id', user.id) // Where creator_id equals current user's id
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      // Throw error if query failed
      if (error) throw error;
      // Update courses state with fetched data (or empty array if null)
      setCourses(data || []);
    } catch (error) {
      // Log error to console for debugging
      console.error('Error fetching courses:', error);
      // Show error message to user
      setMessage('Failed to load courses');
    } finally {
      // Always turn off loading state when done
      setLoading(false);
    }
  };

  // Async function to fetch all questions for a specific course
  const fetchCourseQuestions = async (courseId: string) => {
    try {
      // Query Supabase for questions belonging to the specified course
      const { data, error } = await supabase
        .from('course_questions')     // From course_questions table
        .select('*')                  // Select all columns
        .eq('course_id', courseId)    // Where course_id matches the provided courseId
        .order('question_number', { ascending: true }); // Order by question number, ascending

      // Throw error if query failed
      if (error) throw error;
      // Update questions state with fetched data (or empty array if null)
      setQuestions(data || []);
    } catch (error) {
      // Log error to console for debugging
      console.error('Error fetching questions:', error);
      // Show error message to user
      setMessage('Failed to load questions');
    }
  };

  // Async function to create a new course in the database
  const createCourse = async () => {
    // Exit early if no user is authenticated
    if (!user) return;

    try {
      // Set saving state to show loading indicator
      setSaving(true);
      // Insert new course into Supabase database
      const { data, error } = await supabase
        .from('courses')                    // Insert into courses table
        .insert({
          ...courseForm,                    // Spread all form data
          creator_id: user.id,              // Add current user's ID as creator
          creator_name: user.email?.split('@')[0] || 'User', // Extract username from email
          creator_email: user.email         // Add creator's email
        })
        .select()                         // Return the inserted record
        .single();                        // Expect single record back

      // Throw error if insertion failed
      if (error) throw error;

      // Show success message to user
      setMessage('Course created successfully!');
      // Reset form to initial state
      setCourseForm({
        title: '',                        // Clear title
        description: '',                  // Clear description
        category: 'general',              // Reset to default category
        difficulty_level: 'beginner',     // Reset to default difficulty
        estimated_duration: 60,           // Reset to default duration
        is_published: false               // Reset to draft status
      });
      // Refresh the courses list to show new course
      fetchUserCourses();
      // Navigate back to courses list view
      setCurrentView('courses');
    } catch (error) {
      // Log error to console for debugging
      console.error('Error creating course:', error);
      // Show error message to user
      setMessage('Failed to create course');
    } finally {
      // Always turn off saving state when done
      setSaving(false);
    }
  };

  // Async function to update an existing course in the database
  const updateCourse = async () => {
    // Exit early if no course is selected for editing
    if (!selectedCourse) return;

    try {
      // Set saving state to show loading indicator
      setSaving(true);
      // Update course record in Supabase database
      const { error } = await supabase
        .from('courses')                  // Update in courses table
        .update(courseForm)               // Set new values from form
        .eq('id', selectedCourse.id);     // Where id matches selected course

      // Throw error if update failed
      if (error) throw error;

      // Show success message to user
      setMessage('Course updated successfully!');
      // Refresh the courses list to show updated data
      fetchUserCourses();
      // Navigate back to courses list view
      setCurrentView('courses');
    } catch (error) {
      // Log error to console for debugging
      console.error('Error updating course:', error);
      // Show error message to user
      setMessage('Failed to update course');
    } finally {
      // Always turn off saving state when done
      setSaving(false);
    }
  };

  // Async function to delete a course from the database
  const deleteCourse = async (courseId: string) => {
    // Show confirmation dialog before deletion
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return; // Exit if user cancels
    }

    try {
      // Delete course record from Supabase database
      const { error } = await supabase
        .from('courses')              // Delete from courses table
        .delete()                     // Perform delete operation
        .eq('id', courseId);          // Where id matches provided courseId

      // Throw error if deletion failed
      if (error) throw error;

      // Show success message to user
      setMessage('Course deleted successfully!');
      // Refresh the courses list to remove deleted course
      fetchUserCourses();
    } catch (error) {
      // Log error to console for debugging
      console.error('Error deleting course:', error);
      // Show error message to user
      setMessage('Failed to delete course');
    }
  };

  // Async function to save a question (create new or update existing)
  const saveQuestion = async () => {
    // Exit early if no course is selected
    if (!selectedCourse) return;

    try {
      // Set saving state to show loading indicator
      setSaving(true);
      
      // Check if this is an existing question (has ID) or new question
      if (questionForm.id) {
        // Update existing question in database
        const { error } = await supabase
          .from('course_questions')     // Update in course_questions table
          .update({
            ...questionForm,            // Spread all form data
            course_id: selectedCourse.id // Ensure course_id is set
          })
          .eq('id', questionForm.id);   // Where id matches question being edited

        // Throw error if update failed
        if (error) throw error;
      } else {
        // Create new question in database
        const { error } = await supabase
          .from('course_questions')     // Insert into course_questions table
          .insert({
            ...questionForm,            // Spread all form data
            course_id: selectedCourse.id // Associate with selected course
          });

        // Throw error if insertion failed
        if (error) throw error;
      }

      // Show success message to user
      setMessage('Question saved successfully!');
      // Refresh questions list to show updated data
      fetchCourseQuestions(selectedCourse.id);
      // Reset form to initial state
      resetQuestionForm();
    } catch (error) {
      // Log error to console for debugging
      console.error('Error saving question:', error);
      // Show error message to user
      setMessage('Failed to save question');
    } finally {
      // Always turn off saving state when done
      setSaving(false);
    }
  };

  // Async function to delete a question from the database
  const deleteQuestion = async (questionId: string) => {
    // Show confirmation dialog before deletion
    if (!confirm('Are you sure you want to delete this question?')) {
      return; // Exit if user cancels
    }

    try {
      // Delete question record from Supabase database
      const { error } = await supabase
        .from('course_questions')     // Delete from course_questions table
        .delete()                     // Perform delete operation
        .eq('id', questionId);        // Where id matches provided questionId

      // Throw error if deletion failed
      if (error) throw error;

      // Show success message to user
      setMessage('Question deleted successfully!');
      // Refresh questions list if a course is selected
      if (selectedCourse) {
        fetchCourseQuestions(selectedCourse.id);
      }
    } catch (error) {
      // Log error to console for debugging
      console.error('Error deleting question:', error);
      // Show error message to user
      setMessage('Failed to delete question');
    }
  };

  // Function to reset question form to initial state
  const resetQuestionForm = () => {
    // Calculate next question number based on existing questions
    const nextQuestionNumber = questions.length + 1;
    // Reset form with default values
    setQuestionForm({
      question_number: nextQuestionNumber,    // Auto-increment question number
      question_text: '',                     // Clear question text
      correct_answer: '',                    // Clear correct answer
      acceptable_answers: [''],              // Reset to single empty acceptable answer
      explanation: '',                       // Clear explanation
      difficulty_level: 'medium',            // Set default difficulty
      question_type: 'text',                 // Set default question type
      multiple_choice_options: ['', '', '', ''], // Reset multiple choice options
      word_bank_words: [''],                 // Reset word bank to single empty word
      points: 1                              // Set default points value
    });
  };

  // Function to load a question into the form for editing
  const editQuestion = (question: Question) => {
    // Set form state to the selected question's data
    setQuestionForm(question);
  };

  // Function to add a new empty acceptable answer field
  const addAcceptableAnswer = () => {
    // Update form by adding empty string to acceptable answers array
    setQuestionForm({
      ...questionForm,                       // Spread existing form data
      acceptable_answers: [...questionForm.acceptable_answers, ''] // Add empty string to array
    });
  };

  // Function to update a specific acceptable answer at given index
  const updateAcceptableAnswer = (index: number, value: string) => {
    // Create copy of acceptable answers array
    const newAnswers = [...questionForm.acceptable_answers];
    // Update the answer at specified index
    newAnswers[index] = value;
    // Update form state with modified array
    setQuestionForm({
      ...questionForm,                       // Spread existing form data
      acceptable_answers: newAnswers         // Set updated answers array
    });
  };

  // Function to remove an acceptable answer at given index
  const removeAcceptableAnswer = (index: number) => {
    // Only allow removal if more than one answer exists
    if (questionForm.acceptable_answers.length > 1) {
      // Filter out the answer at specified index
      const newAnswers = questionForm.acceptable_answers.filter((_, i) => i !== index);
      // Update form state with filtered array
      setQuestionForm({
        ...questionForm,                     // Spread existing form data
        acceptable_answers: newAnswers       // Set filtered answers array
      });
    }
  };

  // Function to update a multiple choice option at given index
  const updateMultipleChoiceOption = (index: number, value: string) => {
    // Create copy of multiple choice options array
    const newOptions = [...questionForm.multiple_choice_options];
    // Update the option at specified index
    newOptions[index] = value;
    // Update form state with modified array
    setQuestionForm({
      ...questionForm,                       // Spread existing form data
      multiple_choice_options: newOptions    // Set updated options array
    });
  };

  // Function to add a new empty word to word bank
  const addWordBankWord = () => {
    // Update form by adding empty string to word bank array
    setQuestionForm({
      ...questionForm,                       // Spread existing form data
      word_bank_words: [...questionForm.word_bank_words, ''] // Add empty string to array
    });
  };

  // Function to update a word bank word at given index
  const updateWordBankWord = (index: number, value: string) => {
    // Create copy of word bank words array
    const newWords = [...questionForm.word_bank_words];
    // Update the word at specified index
    newWords[index] = value;
    // Update form state with modified array
    setQuestionForm({
      ...questionForm,                       // Spread existing form data
      word_bank_words: newWords              // Set updated words array
    });
  };

  // Function to remove a word bank word at given index
  const removeWordBankWord = (index: number) => {
    // Only allow removal if more than one word exists
    if (questionForm.word_bank_words.length > 1) {
      // Filter out the word at specified index
      const newWords = questionForm.word_bank_words.filter((_, i) => i !== index);
      // Update form state with filtered array
      setQuestionForm({
        ...questionForm,
        word_bank_words: newWords
      });
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
              Course Creator
            </h1>
            <p className="text-gray-600 mt-2">Create and manage your educational courses</p>
          </div>
          
          {currentView !== 'courses' && (
            <button
              onClick={() => {
                setCurrentView('courses');
                setSelectedCourse(null);
                resetQuestionForm();
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </button>
          )}
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message.includes('successfully') ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}
      </div>

      {/* Courses List View */}
      {currentView === 'courses' && (
        <div className="space-y-6">
          {/* Create New Course Button */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => {
                setCourseForm({
                  title: '',
                  description: '',
                  category: 'general',
                  difficulty_level: 'beginner',
                  estimated_duration: 60,
                  is_published: false
                });
                setCurrentView('edit-course');
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

          {courses.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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