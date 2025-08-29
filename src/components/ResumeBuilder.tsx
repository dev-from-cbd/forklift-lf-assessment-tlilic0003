// Import React core library with hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import authentication context to access user data
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React icon library
import { 
  User,         // User profile icon
  Mail,         // Email icon
  Phone,        // Phone icon
  MapPin,       // Location pin icon
  Briefcase,    // Work experience icon
  GraduationCap, // Education icon
  Award,        // Certification/award icon
  Languages,    // Languages icon
  DollarSign,   // Salary/money icon
  Eye,          // Visible/published icon
  EyeOff,       // Hidden/draft icon
  Save,         // Save action icon
  Plus,         // Add/create icon
  Trash2,       // Delete action icon
  Calendar,     // Date/calendar icon
  Building,     // Company/building icon
  FileText,     // Document/resume icon
  Star,         // Skills/rating icon
  Globe         // Global/web icon
} from 'lucide-react';

// Interface defining the structure for work experience entries
interface Experience {
  company: string;      // Name of the company/employer
  position: string;     // Job title/position held
  startDate: string;    // Employment start date
  endDate: string;      // Employment end date
  current: boolean;     // Flag indicating if currently employed here
  description: string;  // Detailed description of responsibilities and achievements
}

// Interface defining the structure for education entries
interface Education {
  institution: string;  // Name of educational institution
  degree: string;       // Type of degree obtained
  field: string;        // Field of study/major
  startDate: string;    // Education start date
  endDate: string;      // Education end date
  current: boolean;     // Flag indicating if currently studying
}

// Interface defining the structure for certification entries
interface Certification {
  name: string;         // Name of the certification
  issuer: string;       // Organization that issued the certification
  issueDate: string;    // Date when certification was issued
  expiryDate: string;   // Date when certification expires
  credentialId: string; // Unique identifier or certificate number
}

// Interface defining the complete structure for a user's resume
interface Resume {
  id?: string;                        // Optional unique identifier for the resume
  title: string;                      // Job title or professional headline
  full_name: string;                  // User's full name
  email: string;                      // Contact email address
  phone: string;                      // Contact phone number
  location: string;                   // Geographic location (city, state)
  summary: string;                    // Professional summary or objective
  experience: Experience[];           // Array of work experience entries
  education: Education[];             // Array of education entries
  certifications: Certification[];    // Array of certification entries
  skills: string[];                   // Array of professional skills
  languages: string[];                // Array of spoken languages
  availability: string;               // Work availability (full-time, part-time, etc.)
  salary_expectation: string;         // Expected salary range
  is_published: boolean;              // Flag indicating if resume is publicly visible
  views_count: number;                // Number of times resume has been viewed
  contact_count: number;              // Number of times employers have contacted user
}

// Main ResumeBuilder functional component
const ResumeBuilder: React.FC = () => {
  // Get current authenticated user from auth context
  const { user } = useAuth();
  // State to store the complete resume data with initial default values
  const [resume, setResume] = useState<Resume>({
    title: '',                          // Initialize with empty job title
    full_name: '',                      // Initialize with empty full name
    email: user?.email || '',           // Pre-fill with user's email from auth context
    phone: '',                          // Initialize with empty phone number
    location: '',                       // Initialize with empty location
    summary: '',                        // Initialize with empty professional summary
    experience: [],                     // Initialize with empty work experience array
    education: [],                      // Initialize with empty education array
    certifications: [],                 // Initialize with empty certifications array
    skills: [],                         // Initialize with empty skills array
    languages: [],                      // Initialize with empty languages array
    availability: 'full-time',          // Default to full-time availability
    salary_expectation: '',             // Initialize with empty salary expectation
    is_published: false,                // Default to unpublished/draft state
    views_count: 0,                     // Initialize view count to zero
    contact_count: 0                    // Initialize contact count to zero
  });
  // State to track if resume data is being loaded from database
  const [loading, setLoading] = useState(true);
  // State to track if resume is currently being saved to database
  const [saving, setSaving] = useState(false);
  // State to store user feedback messages (success/error)
  const [message, setMessage] = useState('');
  // State to track which tab is currently active in the form
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'skills'>('basic');

  // Effect hook to fetch resume data when user is available
  useEffect(() => {
    // Only fetch resume if user is authenticated
    if (user) {
      fetchResume();
    }
  }, [user]); // Re-run effect when user changes

  // Async function to fetch existing resume data from database
  const fetchResume = async () => {
    try {
      // Set loading state to true while fetching data
      setLoading(true);
      // Query Supabase for user's resume data
      const { data, error } = await supabase
        .from('user_resumes')           // From user_resumes table
        .select('*')                    // Select all columns
        .eq('user_id', user?.id)        // Where user_id matches current user
        .single();                      // Expect single result

      // Handle errors (ignore PGRST116 which means no rows found)
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If resume data exists, update state with fetched data
      if (data) {
        setResume({
          ...data,                                    // Spread all fetched data
          experience: data.experience || [],         // Ensure experience is array
          education: data.education || [],           // Ensure education is array
          certifications: data.certifications || [], // Ensure certifications is array
          skills: data.skills || [],                 // Ensure skills is array
          languages: data.languages || []            // Ensure languages is array
        });
      }
    } catch (error) {
      // Log any errors that occur during fetch
      console.error('Error fetching resume:', error);
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  // Async function to save resume data to database
  const saveResume = async () => {
    // Exit early if no user is authenticated
    if (!user) return;

    try {
      // Set saving state to true to show loading indicator
      setSaving(true);
      // Prepare resume data object for database insertion/update
      const resumeData = {
        user_id: user.id,                           // Associate with current user
        title: resume.title,                        // Job title
        full_name: resume.full_name,                // Full name
        email: resume.email,                        // Email address
        phone: resume.phone,                        // Phone number
        location: resume.location,                  // Location
        summary: resume.summary,                    // Professional summary
        experience: resume.experience,              // Work experience array
        education: resume.education,                // Education array
        certifications: resume.certifications,      // Certifications array
        skills: resume.skills,                      // Skills array
        languages: resume.languages,                // Languages array
        availability: resume.availability,          // Work availability
        salary_expectation: resume.salary_expectation, // Salary expectation
        is_published: resume.is_published           // Publication status
      };

      // Check if this is an update (existing resume) or insert (new resume)
      if (resume.id) {
        // Update existing resume in database
        const { error } = await supabase
          .from('user_resumes')                     // Target user_resumes table
          .update(resumeData)                       // Update with new data
          .eq('id', resume.id);                     // Where id matches current resume
        if (error) throw error;                     // Throw error if update fails
      } else {
        // Insert new resume into database
        const { data, error } = await supabase
          .from('user_resumes')                     // Target user_resumes table
          .insert(resumeData)                       // Insert new resume data
          .select()                                 // Return inserted data
          .single();                                // Expect single result
        if (error) throw error;                     // Throw error if insert fails
        setResume({ ...resume, id: data.id });     // Update local state with new ID
      }

      // Show success message to user
      setMessage('Resume saved successfully!');
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      // Log error and show failure message
      console.error('Error saving resume:', error);
      setMessage('Failed to save resume');
    } finally {
      // Always reset saving state when done
      setSaving(false);
    }
  };

  // Function to add a new empty experience entry to the resume
  const addExperience = () => {
    setResume({
      ...resume,                                    // Keep all existing resume data
      experience: [
        ...resume.experience,                       // Keep all existing experience entries
        {
          company: '',                              // Initialize with empty company name
          position: '',                             // Initialize with empty position
          startDate: '',                            // Initialize with empty start date
          endDate: '',                              // Initialize with empty end date
          current: false,                           // Default to not current job
          description: ''                           // Initialize with empty description
        }
      ]
    });
  };

  // Function to update a specific field of an experience entry
  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    // Create a copy of the experience array to avoid direct mutation
    const newExperience = [...resume.experience];
    // Update the specific field of the experience entry at given index
    newExperience[index] = { ...newExperience[index], [field]: value };
    // Update the resume state with the modified experience array
    setResume({ ...resume, experience: newExperience });
  };

  // Function to remove an experience entry at a specific index
  const removeExperience = (index: number) => {
    setResume({
      ...resume,                                    // Keep all existing resume data
      // Filter out the experience entry at the specified index
      experience: resume.experience.filter((_, i) => i !== index)
    });
  };

  // Function to add a new empty education entry to the resume
  const addEducation = () => {
    setResume({
      ...resume,                                    // Keep all existing resume data
      education: [
        ...resume.education,                        // Keep all existing education entries
        {
          institution: '',                          // Initialize with empty institution name
          degree: '',                               // Initialize with empty degree
          field: '',                                // Initialize with empty field of study
          startDate: '',                            // Initialize with empty start date
          endDate: '',                              // Initialize with empty end date
          current: false                            // Default to not currently studying
        }
      ]
    });
  };

  // Function to update a specific field of an education entry
  const updateEducation = (index: number, field: keyof Education, value: any) => {
    // Create a copy of the education array to avoid direct mutation
    const newEducation = [...resume.education];
    // Update the specific field of the education entry at given index
    newEducation[index] = { ...newEducation[index], [field]: value };
    // Update the resume state with the modified education array
    setResume({ ...resume, education: newEducation });
  };

  // Function to remove an education entry at a specific index
  const removeEducation = (index: number) => {
    setResume({
      ...resume,                                    // Keep all existing resume data
      // Filter out the education entry at the specified index
      education: resume.education.filter((_, i) => i !== index)
    });
  };

  // Function to add a new empty certification entry to the resume
  const addCertification = () => {
    setResume({
      ...resume,                                    // Keep all existing resume data
      certifications: [
        ...resume.certifications,                   // Keep all existing certification entries
        {
          name: '',                                 // Initialize with empty certification name
          issuer: '',                               // Initialize with empty issuer organization
          issueDate: '',                            // Initialize with empty issue date
          expiryDate: '',                           // Initialize with empty expiry date
          credentialId: ''                          // Initialize with empty credential ID
        }
      ]
    });
  };

  // Function to update a specific field of a certification entry
  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    // Create a copy of the certifications array to avoid direct mutation
    const newCertifications = [...resume.certifications];
    // Update the specific field of the certification entry at given index
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    // Update the resume state with the modified certifications array
    setResume({ ...resume, certifications: newCertifications });
  };

  // Function to remove a certification entry at a specific index
  const removeCertification = (index: number) => {
    setResume({
      ...resume,                                    // Keep all existing resume data
      // Filter out the certification entry at the specified index
      certifications: resume.certifications.filter((_, i) => i !== index)
    });
  };

  // Function to add a new skill to the resume
  const addSkill = (skill: string) => {
    // Check if skill is not empty and not already in the skills array
    if (skill && !resume.skills.includes(skill)) {
      setResume({
        ...resume,                              // Keep all existing resume data
        skills: [...resume.skills, skill]      // Add the new skill to the skills array
      });
    }
  };

  // Function to remove a skill by its value
  const removeSkill = (skill: string) => {
    setResume({
      ...resume,                                      // Keep all existing resume data
      // Filter out the skill that matches the provided value
      skills: resume.skills.filter(s => s !== skill)
    });
  };

  // Show loading spinner while fetching resume data
  if (loading) {
    return (
      // Main loading container with centered content
      <div className="flex items-center justify-center min-h-[400px]">
        {/* Loading content wrapper */}
        <div className="text-center">
          {/* Animated spinning loader */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* Loading message */}
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  // Main component render - resume builder interface
  return (
    // Main container with max width and padding
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      {/* Main header container with white background and shadow */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Header content with space between left and right sections */}
        <div className="flex items-center justify-between">
          {/* Left section - title and description */}
          <div>
            {/* Main title with icon */}
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {/* File text icon */}
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Resume Builder
            </h1>
            {/* Subtitle description */}
            <p className="text-gray-600 mt-2">Create your professional resume for forklift and industrial jobs</p>
          </div>
          
          {/* Right section - stats, publish toggle, and save button */}
          <div className="flex items-center space-x-4">
            {/* Profile views counter */}
            <div className="text-right">
              {/* Views count number */}
              <div className="text-2xl font-bold text-blue-600">{resume.views_count}</div>
              {/* Views label */}
              <div className="text-sm text-gray-500">Profile Views</div>
            </div>
            {/* Published/Draft toggle section */}
            <div className="flex items-center">
              {/* Checkbox for publish status */}
              <input
                type="checkbox"
                id="published"
                checked={resume.is_published}
                onChange={(e) => setResume({ ...resume, is_published: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              {/* Label with conditional icon and text based on publish status */}
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                {resume.is_published ? (
                  // Published state with eye icon
                  <span className="flex items-center text-green-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Published
                  </span>
                ) : (
                  // Draft state with eye-off icon
                  <span className="flex items-center text-gray-600">
                    <EyeOff className="w-4 h-4 mr-1" />
                    Draft
                  </span>
                )}
              </label>
            </div>
            {/* Save resume button */}
            <button
              onClick={saveResume}
              disabled={saving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {/* Save icon */}
              <Save className="w-5 h-5 mr-2" />
              {/* Button text with conditional content based on saving state */}
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </div>

        {/* Conditional message display for save status */}
        {message && (
          // Message container with conditional styling based on message type
          <div className={`mt-4 p-4 rounded-lg flex items-center ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700'   // Success styling
              : 'bg-red-50 text-red-700'       // Error styling
          }`}>
            {/* Conditional icon based on message type */}
            {message.includes('successfully') ? (
              // Success icon
              <Save className="w-5 h-5 mr-2" />
            ) : (
              // Placeholder for error icon
              <div className="w-5 h-5 mr-2" />
            )}
            {/* Message text */}
            {message}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      {/* Navigation tabs container with white background and shadow */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        {/* Tab navigation border container */}
        <div className="border-b border-gray-200">
          {/* Navigation flex container */}
          <nav className="flex space-x-8 px-6">
            {/* Tab configuration array with id, label, and icon */}
            {[
              { id: 'basic', label: 'Basic Info', icon: User },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'skills', label: 'Skills & Languages', icon: Star }
            ].map(tab => {
              // Extract icon component from tab configuration
              const Icon = tab.icon;
              return (
                // Individual tab button
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'        // Active tab styling
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'  // Inactive tab styling
                  }`}
                >
                  {/* Tab icon */}
                  <Icon className="w-4 h-4 mr-2" />
                  {/* Tab label */}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content container */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {/* Conditional rendering of basic info form when basic tab is active */}
          {activeTab === 'basic' && (
            // Form container with vertical spacing
            <div className="space-y-6">
              {/* Job title input field */}
              <div>
                {/* Job title label */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                {/* Job title input */}
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Certified Forklift Operator"
                />
              </div>

              {/* Personal information grid - responsive 2 columns on medium screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full name field */}
                <div>
                  {/* Full name label */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {/* Full name input */}
                  <input
                    type="text"
                    value={resume.full_name}
                    onChange={(e) => setResume({ ...resume, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email field */}
                <div>
                  {/* Email label */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {/* Email input */}
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => setResume({ ...resume, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone field */}
                <div>
                  {/* Phone label */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {/* Phone input */}
                  <input
                    type="tel"
                    value={resume.phone}
                    onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+61 xxx xxx xxx"
                  />
                </div>

                {/* Location field */}
                <div>
                  {/* Location label */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {/* Location input */}
                  <input
                    type="text"
                    value={resume.location}
                    onChange={(e) => setResume({ ...resume, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State"
                  />
                </div>
              </div>

              {/* Professional summary field */}
              <div>
                {/* Professional summary label */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                {/* Professional summary textarea */}
                <textarea
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief summary of your experience and skills..."
                />
              </div>

              {/* Availability and salary grid - responsive 2 columns on medium screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Availability field */}
                <div>
                  {/* Availability label */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  {/* Availability select dropdown */}
                  <select
                    value={resume.availability}
                    onChange={(e) => setResume({ ...resume, availability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                {/* Salary expectation field */}
                <div>
                  {/* Salary expectation label */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Expectation</label>
                  {/* Salary expectation input */}
                  <input
                    type="text"
                    value={resume.salary_expectation}
                    onChange={(e) => setResume({ ...resume, salary_expectation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., $60,000 - $70,000 per year"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {/* Conditional rendering of experience form when experience tab is active */}
          {activeTab === 'experience' && (
            // Experience tab container with vertical spacing
            <div className="space-y-6">
              {/* Experience section header with title and add button */}
              <div className="flex items-center justify-between">
                {/* Experience section title */}
                <h3 className="text-lg font-semibold">Work Experience</h3>
                {/* Add experience button */}
                <button
                  onClick={addExperience}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {/* Plus icon */}
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </button>
              </div>

              {resume.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Job title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">I currently work here</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}

              {resume.experience.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No work experience added yet</p>
                  <p className="text-sm">Click "Add Experience" to get started</p>
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Education & Certifications</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={addEducation}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </button>
                  <button
                    onClick={addCertification}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </button>
                </div>
              </div>

              {/* Education Section */}
              <div>
                <h4 className="text-md font-medium mb-4">Education</h4>
                {resume.education.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-medium">Education {index + 1}</h5>
                      <button
                        onClick={() => removeEducation(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="School/University name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Degree type"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(index, 'field', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Major/Field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">Currently studying</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications Section */}
              <div>
                <h4 className="text-md font-medium mb-4">Certifications</h4>
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-medium">Certification {index + 1}</h5>
                      <button
                        onClick={() => removeCertification(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., TLILIC0004"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Certification authority"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                        <input
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="date"
                          value={cert.expiryDate}
                          onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Certificate number or ID"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addSkill(target.value);
                        target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Languages</h3>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Add a language and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        const language = target.value;
                        if (language && !resume.languages.includes(language)) {
                          setResume({
                            ...resume,
                            languages: [...resume.languages, language]
                          });
                        }
                        target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {language}
                      <button
                        onClick={() => setResume({
                          ...resume,
                          languages: resume.languages.filter(l => l !== language)
                        })}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;