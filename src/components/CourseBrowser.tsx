// Import React library with hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import authentication context hook to access current user data
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client configuration for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React icon library for UI elements
import { 
  BookOpen,    // Icon for books/courses
  Users,       // Icon for user count/enrollments
  Clock,       // Icon for time/duration
  Star,        // Icon for ratings (currently unused)
  Search,      // Icon for search functionality
  Filter,      // Icon for filtering options
  Play,        // Icon for play/start course buttons
  CheckCircle, // Icon for completion/enrollment status
  Award,       // Icon for achievements/completed courses
  TrendingUp,  // Icon for progress/trending content
  Plus         // Icon for enrollment/add actions
} from 'lucide-react';

// TypeScript interface defining the structure of a Course object
interface Course {
  id: string;                    // Unique identifier for the course
  title: string;                 // Course title/name
  description: string;           // Detailed description of the course content
  category: string;              // Course category (e.g., 'forklift', 'safety', etc.)
  difficulty_level: string;      // Difficulty level ('beginner', 'intermediate', 'advanced')
  estimated_duration: number;    // Estimated time to complete the course in minutes
  is_published: boolean;         // Whether the course is published and available
  total_questions: number;       // Total number of questions in the course
  total_enrollments: number;     // Number of users enrolled in this course
  average_rating: number;        // Average rating given by users (currently unused)
  creator_name: string;          // Name of the course creator
  creator_email: string;         // Email of the course creator
  created_at: string;            // Timestamp when the course was created
}

// TypeScript interface defining the structure of a Course Enrollment object
interface Enrollment {
  id: string;                    // Unique identifier for the enrollment record
  course_id: string;             // ID of the course the user is enrolled in
  progress_percentage: number;   // User's progress through the course (0-100)
  is_completed: boolean;         // Whether the user has completed the course
  enrolled_at: string;           // Timestamp when the user enrolled in the course
}

// Main functional component for browsing and managing course enrollments
const CourseBrowser: React.FC = () => {
  // Get current authenticated user from auth context
  const { user } = useAuth();
  // State to store the list of available courses
  const [courses, setCourses] = useState<Course[]>([]);
  // State to store user's course enrollments
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  // State to manage loading status during data fetching
  const [loading, setLoading] = useState(true);
  // State to store the current search term for filtering courses
  const [searchTerm, setSearchTerm] = useState('');
  // State to store the selected category filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  // State to store the selected difficulty level filter
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  // State to store success/error messages to display to the user
  const [message, setMessage] = useState('');

  // Array of available course categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },      // Option to show all categories
    { value: 'general', label: 'General' },         // General knowledge courses
    { value: 'forklift', label: 'Forklift' },       // Forklift operation courses
    { value: 'safety', label: 'Safety' },           // Safety training courses
    { value: 'technology', label: 'Technology' },   // Technology-related courses
    { value: 'business', label: 'Business' },       // Business and management courses
    { value: 'health', label: 'Health' }            // Health and wellness courses
  ];

  // Array of available difficulty levels for filtering
  const difficulties = [
    { value: 'all', label: 'All Levels' },          // Option to show all difficulty levels
    { value: 'beginner', label: 'Beginner' },       // Beginner level courses
    { value: 'intermediate', label: 'Intermediate' }, // Intermediate level courses
    { value: 'advanced', label: 'Advanced' }        // Advanced level courses
  ];

  // Effect hook to fetch courses and enrollments when component mounts or user changes
  useEffect(() => {
    fetchCourses();        // Fetch all available courses
    if (user) {
      fetchEnrollments();  // Fetch user's enrollments if user is authenticated
    }
  }, [user]);              // Dependency array - re-run when user changes

  // Async function to fetch all published courses from the database
  const fetchCourses = async () => {
    try {
      setLoading(true);    // Set loading state to true while fetching
      // Query Supabase to get all published courses, ordered by creation date (newest first)
      const { data, error } = await supabase
        .from('courses')                           // From courses table
        .select('*')                               // Select all columns
        .eq('is_published', true)                  // Only published courses
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      if (error) throw error;                      // Throw error if query failed
      setCourses(data || []);                      // Set courses state with fetched data or empty array
    } catch (error) {
      console.error('Error fetching courses:', error); // Log error to console
      setMessage('Failed to load courses');            // Set error message for user
    } finally {
      setLoading(false);                               // Set loading to false regardless of success/failure
    }
  };

  // Async function to fetch current user's course enrollments
  const fetchEnrollments = async () => {
    if (!user) return;     // Exit early if no user is authenticated

    try {
      // Query Supabase to get all enrollments for the current user
      const { data, error } = await supabase
        .from('course_enrollments')  // From course_enrollments table
        .select('*')                 // Select all columns
        .eq('user_id', user.id);     // Where user_id matches current user's ID

      if (error) throw error;        // Throw error if query failed
      setEnrollments(data || []);    // Set enrollments state with fetched data or empty array
    } catch (error) {
      console.error('Error fetching enrollments:', error); // Log error to console
    }
  };

  // Async function to enroll the current user in a specific course
  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      setMessage('Please log in to enroll in courses'); // Show message if user not authenticated
      return;
    }

    try {
      // Insert new enrollment record into the database
      const { error } = await supabase
        .from('course_enrollments')  // Into course_enrollments table
        .insert({
          course_id: courseId,       // ID of the course to enroll in
          user_id: user.id           // ID of the current user
        });

      if (error) throw error;        // Throw error if insertion failed

      setMessage('Successfully enrolled in course!'); // Show success message
      fetchEnrollments();                              // Refresh enrollments to show new enrollment
    } catch (error) {
      console.error('Error enrolling in course:', error); // Log error to console
      setMessage('Failed to enroll in course');           // Show error message to user
    }
  };

  // Helper function to check if the current user is enrolled in a specific course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId); // Return true if enrollment exists
  };

  // Helper function to get the current user's progress percentage for a specific course
  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId); // Find enrollment for this course
    return enrollment?.progress_percentage || 0;                        // Return progress or 0 if not found
  };

  // Filter courses based on search term, category, and difficulty level
  const filteredCourses = courses.filter(course => {
    // Check if course title or description contains the search term (case-insensitive)
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Check if course category matches selected category (or 'all' is selected)
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    // Check if course difficulty matches selected difficulty (or 'all' is selected)
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
    
    // Return true only if all filters match
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      // Container with centered content and minimum height
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          {/* Animated spinning loader */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* Loading text */}
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Main component render - course browser interface
  return (
    // Main container with responsive max width and padding
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      {/* White card container with shadow for the header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Flex container for header content with space between items */}
        <div className="flex items-center justify-between">
          <div>
            {/* Main heading with icon and title */}
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {/* Book icon for courses */}
              <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
              Course Browser
            </h1>
            {/* Subtitle description */}
            <p className="text-gray-600 mt-2">Discover and enroll in educational courses</p>
          </div>
          
          {/* Right side statistics */}
          <div className="text-right">
            {/* Large number showing total courses */}
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            {/* Label for the statistic */}
            <div className="text-sm text-gray-500">Available Courses</div>
          </div>
        </div>

        {/* Conditional message display for success/error feedback */}
        {message && (
          // Dynamic styling based on message type (success = green, error = red)
          <div className={`mt-4 p-4 rounded-lg flex items-center ${
            message.includes('Successfully') 
              ? 'bg-green-50 text-green-700'   // Green styling for success messages
              : 'bg-red-50 text-red-700'       // Red styling for error messages
          }`}>
            {/* Conditional icon display */}
            {message.includes('Successfully') ? (
              // Check circle icon for success
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              // Empty div placeholder for error messages
              <div className="w-5 h-5 mr-2" />
            )}
            {/* Display the actual message text */}
            {message}
          </div>
        )}
      </div>

      {/* Filters Section */}
      {/* White card container for filter controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Grid layout for filter controls - responsive from 1 to 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input Field */}
          <div className="relative">
            {/* Search icon positioned absolutely inside the input */}
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {/* Text input for searching courses */}
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}                                    // Controlled input value
              onChange={(e) => setSearchTerm(e.target.value)}       // Update search term on change
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div>
            <select
              value={selectedCategory}                              // Controlled select value
              onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {/* Map through categories array to create option elements */}
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter Dropdown */}
          <div>
            <select
              value={selectedDifficulty}                              // Controlled select value
              onChange={(e) => setSelectedDifficulty(e.target.value)} // Update selected difficulty
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {/* Map through difficulties array to create option elements */}
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Results Counter */}
          <div className="flex items-center text-sm text-gray-600">
            {/* Filter icon */}
            <Filter className="w-4 h-4 mr-2" />
            {/* Display count of filtered courses vs total courses */}
            {filteredCourses.length} of {courses.length} courses
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section - only show if user is logged in and has enrollments */}
      {user && enrollments.length > 0 && (
        <div className="mb-8">
          {/* Section heading with trending icon */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            {/* Trending up icon to indicate progress/active courses */}
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            My Enrolled Courses
          </h2>
          {/* Grid layout for enrolled course cards - responsive 1 to 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Map through user's enrollments to display each enrolled course */}
            {enrollments.map(enrollment => {
              // Find the course data that matches this enrollment
              const course = courses.find(c => c.id === enrollment.course_id);
              // Skip rendering if course data not found
              if (!course) return null;

              return (
                // Course card with green left border to indicate enrollment
                <div key={enrollment.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-500">
                  <div className="p-6">
                    {/* Course title and completion status */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Course title with line clamping for overflow */}
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>
                      {/* Show award icon if course is completed */}
                      {enrollment.is_completed && (
                        <Award className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>

                    {/* Course description with line clamping */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress bar section */}
                    <div className="mb-4">
                      {/* Progress label and percentage */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        {/* Round progress percentage to nearest integer */}
                        <span>{Math.round(enrollment.progress_percentage)}%</span>
                      </div>
                      {/* Progress bar container */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {/* Progress bar fill with dynamic width based on progress */}
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Course metadata - duration and question count */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {/* Estimated duration with clock icon */}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.estimated_duration} min
                      </div>
                      {/* Total questions with book icon */}
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.total_questions} questions
                      </div>
                    </div>

                    {/* Continue learning button */}
                    <button
                      onClick={() => window.location.href = `/course/${course.id}`} // Navigate to course page
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {/* Play icon for continue action */}
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Courses Grid Section */}
      <div>
        {/* Section heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          {/* Book icon for all courses */}
          <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
          All Courses
        </h2>

        {/* Conditional rendering based on whether filtered courses exist */}
        {filteredCourses.length === 0 ? (
          // Empty state when no courses match the filters
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            {/* Large book icon for empty state */}
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            {/* Empty state heading */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            {/* Empty state description */}
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          // Grid of course cards when courses are available
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map through filtered courses to create course cards */}
            {filteredCourses.map((course) => {
              // Check if user is enrolled in this course
              const enrolled = isEnrolled(course.id);
              // Get user's progress for this course
              const progress = getEnrollmentProgress(course.id);

              return (
                // Individual course card with hover effect
                <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    {/* Course title and enrollment status */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Course title with line clamping */}
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>
                      {/* Show check circle if user is enrolled */}
                      {enrolled && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    {/* Course description with line clamping */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Course metadata row - duration, enrollments, questions */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {/* Estimated duration */}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.estimated_duration} min
                      </div>
                      {/* Total enrollments count */}
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.total_enrollments} enrolled
                      </div>
                      {/* Total questions count */}
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.total_questions} questions
                      </div>
                    </div>

                    {/* Course tags - difficulty and category */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Difficulty level badge with dynamic styling */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :    // Green for beginner
                        course.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : // Yellow for intermediate
                        'bg-red-100 text-red-800'                                                      // Red for advanced
                      }`}>
                        {course.difficulty_level}
                      </span>
                      {/* Category badge */}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {course.category}
                      </span>
                    </div>

                    {/* Progress bar for enrolled courses with progress */}
                    {enrolled && progress > 0 && (
                      <div className="mb-4">
                        {/* Progress label and percentage */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Your Progress</span>
                          {/* Round progress to nearest integer */}
                          <span>{Math.round(progress)}%</span>
                        </div>
                        {/* Progress bar container */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          {/* Progress bar fill with blue color for general courses */}
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Course creator information */}
                    <div className="text-xs text-gray-500 mb-4">
                      Created by {course.creator_name}
                    </div>
                  </div>

                  {/* Action button section with gray background */}
                  <div className="px-6 py-4 bg-gray-50">
                    {/* Conditional button based on enrollment status */}
                    {enrolled ? (
                      // Continue/Start course button for enrolled users
                      <button
                        onClick={() => window.location.href = `/course/${course.id}`} // Navigate to course
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {/* Play icon */}
                        <Play className="w-4 h-4 mr-2" />
                        {/* Dynamic text based on progress */}
                        {progress > 0 ? 'Continue' : 'Start'} Course
                      </button>
                    ) : (
                      // Enroll button for non-enrolled users
                      <button
                        onClick={() => enrollInCourse(course.id)}  // Enroll in course
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {/* Plus icon for enrollment */}
                        <Plus className="w-4 h-4 mr-2" />
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component as default export
export default CourseBrowser;