// Import React and hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React icon library
import { 
  BookOpen,  // Icon for books/courses
  Users,     // Icon for user count
  Clock,     // Icon for time/duration
  Star,      // Icon for ratings
  Search,    // Icon for search functionality
  Filter,    // Icon for filtering
  Play,      // Icon for play/start actions
  CheckCircle, // Icon for completion status
  Award,     // Icon for achievements
  TrendingUp, // Icon for progress/trending
  Plus       // Icon for add/enroll actions
} from 'lucide-react';

// Interface defining the structure of a course object
interface Course {
  id: string;                    // Unique identifier for the course
  title: string;                 // Course title/name
  description: string;           // Course description text
  category: string;              // Course category (e.g., 'forklift', 'safety')
  difficulty_level: string;      // Difficulty level (beginner, intermediate, advanced)
  estimated_duration: number;    // Estimated completion time in minutes
  is_published: boolean;         // Whether the course is published and visible
  total_questions: number;       // Total number of questions in the course
  total_enrollments: number;     // Number of users enrolled in the course
  average_rating: number;        // Average rating from user reviews
  creator_name: string;          // Name of the course creator
  creator_email: string;         // Email of the course creator
  created_at: string;            // Timestamp when the course was created
}

// Interface defining the structure of a user's course enrollment
interface Enrollment {
  id: string;                    // Unique identifier for the enrollment
  course_id: string;             // ID of the enrolled course
  progress_percentage: number;   // User's progress percentage (0-100)
  is_completed: boolean;         // Whether the user has completed the course
  enrolled_at: string;           // Timestamp when the user enrolled
}

// Main CourseBrowser functional component
const CourseBrowser: React.FC = () => {
  // Get current authenticated user from auth context
  const { user } = useAuth();
  // State for storing all available courses
  const [courses, setCourses] = useState<Course[]>([]);
  // State for storing user's course enrollments
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for search input value
  const [searchTerm, setSearchTerm] = useState('');
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  // State for selected difficulty filter
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  // State for displaying success/error messages
  const [message, setMessage] = useState('');

  // Array of available course categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },      // Option to show all categories
    { value: 'general', label: 'General' },          // General courses
    { value: 'forklift', label: 'Forklift' },        // Forklift-specific courses
    { value: 'safety', label: 'Safety' },            // Safety training courses
    { value: 'technology', label: 'Technology' },    // Technology-related courses
    { value: 'business', label: 'Business' },        // Business training courses
    { value: 'health', label: 'Health' }             // Health and wellness courses
  ];

  // Array of available difficulty levels for filtering
  const difficulties = [
    { value: 'all', label: 'All Levels' },           // Option to show all difficulty levels
    { value: 'beginner', label: 'Beginner' },        // Beginner level courses
    { value: 'intermediate', label: 'Intermediate' }, // Intermediate level courses
    { value: 'advanced', label: 'Advanced' }         // Advanced level courses
  ];

  // Effect hook to fetch data when component mounts or user changes
  useEffect(() => {
    fetchCourses();        // Always fetch available courses
    if (user) {            // Only fetch enrollments if user is authenticated
      fetchEnrollments();
    }
  }, [user]);              // Re-run effect when user authentication state changes

  // Async function to fetch all published courses from database
  const fetchCourses = async () => {
    try {
      setLoading(true);                    // Show loading indicator
      const { data, error } = await supabase
        .from('courses')                   // Query the courses table
        .select('*')                       // Select all columns
        .eq('is_published', true)          // Only get published courses
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      if (error) throw error;              // Throw error if query failed
      setCourses(data || []);              // Update courses state with fetched data
    } catch (error) {
      console.error('Error fetching courses:', error); // Log error to console
      setMessage('Failed to load courses');           // Show error message to user
    } finally {
      setLoading(false);                 // Hide loading indicator regardless of outcome
    }
  };

  // Async function to fetch user's course enrollments
  const fetchEnrollments = async () => {
    if (!user) return;                   // Exit early if no user is authenticated

    try {
      const { data, error } = await supabase
        .from('course_enrollments')      // Query the course_enrollments table
        .select('*')                     // Select all columns
        .eq('user_id', user.id);         // Filter by current user's ID

      if (error) throw error;            // Throw error if query failed
      setEnrollments(data || []);        // Update enrollments state with fetched data
    } catch (error) {
      console.error('Error fetching enrollments:', error); // Log error to console
    }
  };

  // Async function to enroll user in a specific course
  const enrollInCourse = async (courseId: string) => {
    if (!user) {                         // Check if user is authenticated
      setMessage('Please log in to enroll in courses'); // Show login prompt
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')      // Insert into course_enrollments table
        .insert({
          course_id: courseId,           // ID of the course to enroll in
          user_id: user.id               // Current user's ID
        });

      if (error) throw error;            // Throw error if insertion failed

      setMessage('Successfully enrolled in course!'); // Show success message
      fetchEnrollments();                // Refresh enrollments to show new enrollment
    } catch (error) {
      console.error('Error enrolling in course:', error); // Log error to console
      setMessage('Failed to enroll in course');          // Show error message to user
    }
  };

  // Helper function to check if user is enrolled in a specific course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId); // Check if any enrollment matches the course ID
  };

  // Helper function to get user's progress percentage for a specific course
  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId); // Find enrollment for the course
    return enrollment?.progress_percentage || 0;                        // Return progress or 0 if not enrolled
  };

  // Filter courses based on search term, category, and difficulty level
  const filteredCourses = courses.filter(course => {
    // Check if course title or description contains search term (case-insensitive)
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Check if course matches selected category (or 'all' is selected)
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    // Check if course matches selected difficulty (or 'all' is selected)
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
    
    // Return true only if all filter conditions are met
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]"> {/* Center loading content */}
        <div className="text-center">                                      {/* Center text alignment */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div> {/* Spinning loader */}
          <p className="text-gray-600">Loading courses...</p>              {/* Loading message */}
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-7xl mx-auto p-6"> {/* Main container with max width and padding */}
      {/* Header section with title and course count */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6"> {/* White card container */}
        <div className="flex items-center justify-between">        {/* Flex container for header content */}
          <div>                                                   {/* Left side - title and description */}
            <h1 className="text-3xl font-bold text-gray-900 flex items-center"> {/* Main page title */}
              <BookOpen className="w-8 h-8 mr-3 text-blue-600" />              {/* Book icon */}
              Course Browser                                                      {/* Page title text */}
            </h1>
            <p className="text-gray-600 mt-2">Discover and enroll in educational courses</p> {/* Page description */}
          </div>
          
          <div className="text-right">                           {/* Right side - course statistics */}
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div> {/* Total course count */}
            <div className="text-sm text-gray-500">Available Courses</div>            {/* Label for course count */}
          </div>
        </div>

        {/* Conditional message display for success/error feedback */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center ${
            message.includes('Successfully') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {/* Conditional icon display */}
             {message.includes('Successfully') ? (
               <CheckCircle className="w-5 h-5 mr-2" />
             ) : (
               <div className="w-5 h-5 mr-2" />
             )}
             {message}
          </div>
        )}
      </div>

      {/* Filters section for search and category/difficulty selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6"> {/* White card container for filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Responsive grid layout */}
          <div className="relative"> {/* Search input container with relative positioning */}
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> {/* Search icon positioned inside input */}
            <input
               type="text"
               placeholder="Search courses..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
          </div>

          <div> {/* Category filter container */}
            <select
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             >
              {/* Map through categories array to create options */}
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                   {category.label}
                 </option>
              ))}
            </select>
          </div>

          <div> {/* Difficulty filter container */}
            <select
               value={selectedDifficulty}
               onChange={(e) => setSelectedDifficulty(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             >
              {/* Map through difficulties array to create options */}
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                   {difficulty.label}
                 </option>
              ))}
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600"> {/* Filter results counter */}
            <Filter className="w-4 h-4 mr-2" />                      {/* Filter icon */}
            {filteredCourses.length} of {courses.length} courses      {/* Display filtered vs total count */}
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      {/* Only show if user is logged in and has enrollments */}
       {user && enrollments.length > 0 && (
         <div className="mb-8"> {/* Section container with bottom margin */}
           <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"> {/* Section heading */}
             <TrendingUp className="w-6 h-6 mr-2 text-green-600" /> {/* Trending up icon */}
             My Enrolled Courses {/* Section title */}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> {/* Responsive grid for enrolled courses */}
             {/* Map through user's enrollments */}
             {enrollments.map(enrollment => {
               const course = courses.find(c => c.id === enrollment.course_id); {/* Find corresponding course */}
               if (!course) return null; {/* Skip if course not found */}

               return (
                 <div key={enrollment.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-500"> {/* Enrolled course card with green left border */}
                   <div className="p-6"> {/* Card content padding */}
                     <div className="flex items-start justify-between mb-4"> {/* Header with title and completion badge */}
                       <h3 className="text-lg font-semibold text-gray-900 line-clamp-2"> {/* Course title with line clamp */}
                         {course.title} {/* Display course title */}
                       </h3>
                       {/* Show award icon if course is completed */}
                       {enrollment.is_completed && (
                         <Award className="w-6 h-6 text-yellow-500" />
                       )}
                     </div>

                     {/* Course description with line clamp */}
                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                       {course.description}
                     </p>

                     {/* Progress section */}
                     <div className="mb-4">
                       {/* Progress header */}
                       <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                         <span>Progress</span>
                         <span>{Math.round(enrollment.progress_percentage)}%</span>
                       </div>
                       {/* Progress bar background */}
                       <div className="w-full bg-gray-200 rounded-full h-2">
                         <div
                           className="bg-green-500 h-2 rounded-full transition-all duration-300"
                           style={{ width: `${enrollment.progress_percentage}%` }}
                         ></div>
                       </div>
                     </div>

                     {/* Course metadata */}
                     <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                       {/* Duration info */}
                       <div className="flex items-center">
                         <Clock className="w-4 h-4 mr-1" />
                         {course.estimated_duration} min
                       </div>
                       {/* Questions info */}
                       <div className="flex items-center">
                         <BookOpen className="w-4 h-4 mr-1" />
                         {course.total_questions} questions
                       </div>
                     </div>

                     <button
                       onClick={() => window.location.href = `/course/${course.id}`}
                       className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                     >
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

      {/* All Courses Grid */}
      <div> {/* All courses section container */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"> {/* All courses heading */}
          <BookOpen className="w-6 h-6 mr-2 text-blue-600" /> {/* Book icon */}
          All Courses {/* Section title */}
        </h2>

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const progress = getEnrollmentProgress(course.id);

              return (
                <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>
                      {enrolled && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                      )}
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
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.total_questions} questions
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.difficulty_level}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {course.category}
                      </span>
                    </div>

                    {enrolled && progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Your Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mb-4">
                      Created by {course.creator_name}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50">
                    {enrolled ? (
                      <button
                        onClick={() => window.location.href = `/course/${course.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {progress > 0 ? 'Continue' : 'Start'} Course
                      </button>
                    ) : (
                      <button
                        onClick={() => enrollInCourse(course.id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
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

export default CourseBrowser;