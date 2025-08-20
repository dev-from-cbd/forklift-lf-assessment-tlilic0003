import React, { useState, useEffect } from 'react';                           // Import React library and hooks for state management and side effects
import { supabase } from '../config/supabase';                               // Import Supabase client for database operations
import {                                                                     // Import various icons from Lucide React icon library
  Search,                                                                    // Search icon for search functionality
  MapPin,                                                                    // Location pin icon for location display
  Briefcase,                                                                 // Briefcase icon for job/work related elements
  DollarSign,                                                                // Dollar sign icon for salary information
  Calendar,                                                                  // Calendar icon for date-related information
  User,                                                                      // User icon for profile/user related elements
  Mail,                                                                      // Mail icon for email contact
  Phone,                                                                     // Phone icon for phone contact
  Award,                                                                     // Award icon for certifications
  Languages,                                                                 // Languages icon for language skills
  Eye,                                                                       // Eye icon for view count
  Filter,                                                                    // Filter icon for filtering functionality
  Star,                                                                      // Star icon for ratings or favorites
  Building                                                                   // Building icon for company/organization
} from 'lucide-react';                                                       // Close import statement

interface Resume {                                                            // TypeScript interface defining the structure of a resume object
  id: string;                                                                // Unique identifier for the resume
  title: string;                                                             // Job title or position the candidate is seeking
  full_name: string;                                                         // Full name of the candidate
  email: string;                                                             // Email address for contact
  phone: string;                                                             // Phone number for contact
  location: string;                                                          // Geographic location of the candidate
  summary: string;                                                           // Brief summary or description of the candidate
  experience: any[];                                                         // Array of work experience objects
  education: any[];                                                          // Array of education objects
  certifications: any[];                                                     // Array of certification objects
  skills: string[];                                                          // Array of skill strings
  languages: string[];                                                       // Array of language strings
  availability: string;                                                      // Work availability (full-time, part-time, etc.)
  salary_expectation: string;                                                // Expected salary range
  views_count: number;                                                       // Number of times the resume has been viewed
  contact_count: number;                                                     // Number of times the candidate has been contacted
  created_at: string;                                                        // Timestamp when the resume was created
  updated_at: string;                                                        // Timestamp when the resume was last updated
}                                                                            // Close interface definition

const JobBoard: React.FC = () => {                                           // Define JobBoard functional component with TypeScript typing
  const [resumes, setResumes] = useState<Resume[]>([]);                      // State to store array of resume objects
  const [loading, setLoading] = useState(true);                             // State to track loading status
  const [searchTerm, setSearchTerm] = useState('');                         // State to store search input value
  const [selectedLocation, setSelectedLocation] = useState('all');          // State to store selected location filter
  const [selectedAvailability, setSelectedAvailability] = useState('all');  // State to store selected availability filter
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null); // State to store currently selected resume for detailed view

  useEffect(() => {                                                          // React hook to run side effects when component mounts
    fetchResumes();                                                          // Call function to fetch resumes from database
  }, []);                                                                    // Empty dependency array means this runs only once on mount

  const fetchResumes = async () => {                                         // Async function to fetch resumes from Supabase database
    try {                                                                    // Try block for error handling
      setLoading(true);                                                      // Set loading state to true while fetching data
      const { data, error } = await supabase                                // Destructure response from Supabase query
        .from('user_resumes')                                               // Query the user_resumes table
        .select('*')                                                         // Select all columns
        .eq('is_published', true)                                           // Filter for only published resumes
        .order('updated_at', { ascending: false });                        // Order by updated_at in descending order (newest first)

      if (error) throw error;                                                // Throw error if query failed
      setResumes(data || []);                                                // Set resumes state with fetched data or empty array
    } catch (error) {                                                        // Catch block for error handling
      console.error('Error fetching resumes:', error);                      // Log error to console
    } finally {                                                              // Finally block always executes
      setLoading(false);                                                     // Set loading state to false when done
    }                                                                        // Close try-catch-finally block
  };                                                                         // Close fetchResumes function

  const trackResumeView = async (resumeId: string) => {                      // Async function to track when a resume is viewed
    try {                                                                    // Try block for error handling
      await supabase                                                         // Await Supabase database operation
        .from('resume_views')                                               // Insert into resume_views table
        .insert({                                                           // Insert new record with view data
          resume_id: resumeId,                                              // ID of the resume being viewed
          viewer_ip: 'unknown',                                             // IP address (set to unknown for privacy)
          viewer_user_agent: navigator.userAgent                           // Browser user agent string
        });                                                                 // Close insert object
    } catch (error) {                                                        // Catch block for error handling
      console.error('Error tracking resume view:', error);                  // Log error to console
    }                                                                        // Close try-catch block
  };                                                                         // Close trackResumeView function

  const viewResume = (resume: Resume) => {                                   // Function to view a specific resume in detail
    setSelectedResume(resume);                                               // Set the selected resume for modal display
    trackResumeView(resume.id);                                              // Track that this resume was viewed
  };                                                                         // Close viewResume function

  const closeModal = () => {                                                 // Function to close the resume detail modal
    setSelectedResume(null);                                                 // Clear the selected resume to close modal
  };                                                                         // Close closeModal function

  const locations = ['all', ...Array.from(new Set(resumes.map(r => r.location).filter(Boolean)))]; // Create array of unique locations for filter dropdown
  const availabilities = ['all', 'full-time', 'part-time', 'contract', 'casual']; // Available work availability options for filtering

  const filteredResumes = resumes.filter(resume => {                        // Filter resumes based on search criteria
    const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if title matches search term
                         resume.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if name matches search term
                         resume.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())); // Check if any skill matches search term
    const matchesLocation = selectedLocation === 'all' || resume.location === selectedLocation; // Check if location filter matches
    const matchesAvailability = selectedAvailability === 'all' || resume.availability === selectedAvailability; // Check if availability filter matches
    
    return matchesSearch && matchesLocation && matchesAvailability;         // Return true if all filters match
  });                                                                        // Close filter function

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job seekers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-blue-600" />
              Job Board - Find Talent
            </h1>
            <p className="text-gray-600 mt-2">Browse qualified forklift operators and industrial workers</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{resumes.length}</div>
            <div className="text-sm text-gray-500">Available Candidates</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availabilities.map(availability => (
                <option key={availability} value={availability}>
                  {availability === 'all' ? 'All Availability' : availability.charAt(0).toUpperCase() + availability.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredResumes.length} of {resumes.length} candidates
          </div>
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResumes.map((resume) => (
          <div key={resume.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
             <div className="p-6">
               <div className="flex items-start justify-between mb-4">
                 <div className="flex-1">
                   <h3 className="text-xl font-semibold text-gray-900 mb-1">{resume.title}</h3>
                   <p className="text-lg text-blue-600 font-medium">{resume.full_name}</p>
                 </div>
                 <div className="flex items-center text-sm text-gray-500">
                   <Eye className="w-4 h-4 mr-1" />
                   {resume.views_count}
                 </div>
               </div>

              <div className="space-y-2 mb-4">
                 {resume.location && (
                   <div className="flex items-center text-sm text-gray-600">
                     <MapPin className="w-4 h-4 mr-2" />
                     {resume.location}
                   </div>
                 )}
                 <div className="flex items-center text-sm text-gray-600">
                   <Briefcase className="w-4 h-4 mr-2" />
                   {resume.availability}
                 </div>
                 {resume.salary_expectation && (
                   <div className="flex items-center text-sm text-gray-600">
                     <DollarSign className="w-4 h-4 mr-2" />
                     {resume.salary_expectation}
                   </div>
                 )}
               </div>

              {resume.summary && (
                 <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resume.summary}</p>
               )}

              {resume.skills && resume.skills.length > 0 && (
                 <div className="mb-4">
                   <h4 className="text-sm font-medium text-gray-900 mb-2">Key Skills:</h4>
                   <div className="flex flex-wrap gap-1">
                     {resume.skills.slice(0, 4).map((skill, index) => (
                       <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                         {skill}
                       </span>
                     ))}
                     {resume.skills.length > 4 && (
                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                         +{resume.skills.length - 4} more
                       </span>
                     )}
                   </div>
                 </div>
               )}

              {resume.certifications && resume.certifications.length > 0 && (
                 <div className="mb-4">
                   <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications:</h4>
                   <div className="flex flex-wrap gap-1">
                     {resume.certifications.slice(0, 2).map((cert: any, index: number) => ( // Map through first 2 certifications
                       <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"> {/* Certification badge with styling */}
                         <Award className="w-3 h-3 mr-1" /> {/* Award icon */}
                         {cert.name} {/* Certification name */}
                       </span>
                     ))}
                     {resume.certifications.length > 2 && ( // Show more indicator if more than 2 certifications
                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                         +{resume.certifications.length - 2} more {/* Count of additional certifications */}
                       </span>
                     )}
                   </div>
                 </div>
               )}

              {resume.languages && resume.languages.length > 0 && ( // Conditional rendering if languages exist
                 <div className="mb-4"> {/* Languages section container */}
                   <div className="flex items-center text-sm text-gray-600"> {/* Languages display row */}
                     <Languages className="w-4 h-4 mr-2" /> {/* Languages icon */}
                     {resume.languages.join(', ')} {/* Join languages array with commas */}
                   </div>
                 </div>
               )}

              <div className="text-xs text-gray-500 mb-4"> {/* Last updated timestamp section */}
                 Updated {new Date(resume.updated_at).toLocaleDateString()} {/* Format and display last update date */}
               </div>

              <button // View resume button
                 onClick={() => viewResume(resume)} // Click handler to open resume modal
                 className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" // Full width button with blue styling and hover effects
               >
                 <User className="w-4 h-4 mr-2" /> {/* User icon */}
                 View Full Resume {/* Button text */}
               </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResumes.length === 0 && ( // Show empty state when no resumes match filters
         <div className="bg-white rounded-lg shadow-lg p-12 text-center"> {/* Empty state container with white background, shadow, padding and centered text */}
           <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" /> {/* Large briefcase icon in gray, centered with bottom margin */}
           <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3> {/* Empty state heading */}
           <p className="text-gray-600">Try adjusting your search or filter criteria</p> {/* Empty state description */}
         </div>
       )}

      {/* Resume Detail Modal */} {/* Comment for modal section */}
       {selectedResume && ( // Conditional rendering when a resume is selected for detailed view
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Modal overlay covering full screen with semi-transparent background */}
           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"> {/* Modal content container with white background, rounded corners, max width and height */}
             <div className="flex items-center justify-between p-6 border-b"> {/* Modal header with flex layout, padding and bottom border */}
               <h3 className="text-2xl font-bold">{selectedResume.full_name}</h3> {/* Modal title showing candidate name */}
               <button // Close modal button
                 onClick={() => setSelectedResume(null)} // Click handler to close modal by clearing selected resume
                 className="p-2 hover:bg-gray-100 rounded-full" // Close button styling with padding, hover effect and rounded shape
               >
                 × {/* Close icon (multiplication symbol) */}
               </button>
             </div>
            
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Contact & Basic Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`mailto:${selectedResume.email}`} className="text-blue-600 hover:underline">
                          {selectedResume.email}
                        </a>
                      </div>
                      {selectedResume.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <a href={`tel:${selectedResume.phone}`} className="text-blue-600 hover:underline">
                            {selectedResume.phone}
                          </a>
                        </div>
                      )}
                      {selectedResume.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          {selectedResume.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        {selectedResume.availability}
                      </div>
                      {selectedResume.salary_expectation && (
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                          {selectedResume.salary_expectation}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedResume.skills && selectedResume.skills.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedResume.languages && selectedResume.languages.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.languages.map((language, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Experience & Education */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{selectedResume.title}</h4>
                    {selectedResume.summary && (
                      <p className="text-gray-700 mb-4">{selectedResume.summary}</p>
                    )}
                  </div>

                  {selectedResume.experience && selectedResume.experience.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Work Experience</h4>
                      <div className="space-y-4">
                        {selectedResume.experience.map((exp: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-semibold">{exp.position}</h5>
                            <p className="text-blue-600">{exp.company}</p>
                            <p className="text-sm text-gray-500 mb-2">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                            {exp.description && (
                              <p className="text-gray-700 text-sm">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedResume.education && selectedResume.education.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Education</h4>
                      <div className="space-y-4">
                        {selectedResume.education.map((edu: any, index: number) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4">
                            <h5 className="font-semibold">{edu.degree}</h5>
                            <p className="text-green-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">
                              {edu.field} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedResume.certifications && selectedResume.certifications.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Certifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedResume.certifications.map((cert: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Award className="w-5 h-5 text-yellow-500 mr-2" />
                              <h5 className="font-semibold">{cert.name}</h5>
                            </div>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                            <p className="text-xs text-gray-500">
                              Issued: {cert.issueDate}
                              {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                            </p>
                            {cert.credentialId && (
                              <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Profile views: {selectedResume.views_count}</p>
                  <p>Last updated: {new Date(selectedResume.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={`mailto:${selectedResume.email}?subject=Job Opportunity - ${selectedResume.title}`}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Candidate
                  </a>
                  <button
                    onClick={() => setSelectedResume(null)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;