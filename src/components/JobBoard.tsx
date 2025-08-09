import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Award,
  Languages,
  Eye,
  Filter,
  Star,
  Building
} from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: any[];
  education: any[];
  certifications: any[];
  skills: string[];
  languages: string[];
  availability: string;
  salary_expectation: string;
  views_count: number;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

const JobBoard: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_resumes')
        .select('*')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackResumeView = async (resumeId: string) => {
    try {
      await supabase
        .from('resume_views')
        .insert({
          resume_id: resumeId,
          viewer_ip: 'unknown',
          viewer_user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error tracking resume view:', error);
    }
  };

  const viewResume = (resume: Resume) => {
    setSelectedResume(resume);
    trackResumeView(resume.id);
  };

  const locations = ['all', ...Array.from(new Set(resumes.map(r => r.location).filter(Boolean)))];
  const availabilities = ['all', 'full-time', 'part-time', 'contract', 'casual'];

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = selectedLocation === 'all' || resume.location === selectedLocation;
    const matchesAvailability = selectedAvailability === 'all' || resume.availability === selectedAvailability;
    
    return matchesSearch && matchesLocation && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
                    {resume.certifications.slice(0, 2).map((cert: any, index: number) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {cert.name}
                      </span>
                    ))}
                    {resume.certifications.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{resume.certifications.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {resume.languages && resume.languages.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Languages className="w-4 h-4 mr-2" />
                    {resume.languages.join(', ')}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </div>

              <button
                onClick={() => viewResume(resume)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                View Full Resume
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResumes.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Resume Detail Modal */}
      {selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold">{selectedResume.full_name}</h3>
              <button
                onClick={() => setSelectedResume(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
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