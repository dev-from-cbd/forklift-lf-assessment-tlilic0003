import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { 
  Plus, 
  Save, 
  Eye, 
  EyeOff, 
  Trash2, 
  BookOpen, 
  Users, 
  Clock,
  Star,
  Edit3,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_duration: number;
  is_published: boolean;
  total_questions: number;
  total_enrollments: number;
  created_at: string;
}

interface Question {
  id?: string;
  question_number: number;
  question_text: string;
  correct_answer: string;
  acceptable_answers: string[];
  explanation: string;
  difficulty_level: string;
  question_type: string;
  multiple_choice_options: string[];
  word_bank_words: string[];
  points: number;
}

const CourseCreator: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentView, setCurrentView] = useState<'courses' | 'edit-course' | 'edit-questions'>('courses');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty_level: 'beginner',
    estimated_duration: 60,
    is_published: false
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState<Question>({
    question_number: 1,
    question_text: '',
    correct_answer: '',
    acceptable_answers: [''],
    explanation: '',
    difficulty_level: 'medium',
    question_type: 'text',
    multiple_choice_options: ['', '', '', ''],
    word_bank_words: [''],
    points: 1
  });

  useEffect(() => {
    fetchUserCourses();
  }, [user]);

  const fetchUserCourses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseQuestions = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_questions')
        .select('*')
        .eq('course_id', courseId)
        .order('question_number', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage('Failed to load questions');
    }
  };

  const createCourse = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseForm,
          creator_id: user.id,
          creator_name: user.email?.split('@')[0] || 'User',
          creator_email: user.email
        })
        .select()
        .single();

      if (error) throw error;

      setMessage('Course created successfully!');
      setCourseForm({
        title: '',
        description: '',
        category: 'general',
        difficulty_level: 'beginner',
        estimated_duration: 60,
        is_published: false
      });
      fetchUserCourses();
      setCurrentView('courses');
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const updateCourse = async () => {
    if (!selectedCourse) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('courses')
        .update(courseForm)
        .eq('id', selectedCourse.id);

      if (error) throw error;

      setMessage('Course updated successfully!');
      fetchUserCourses();
      setCurrentView('courses');
    } catch (error) {
      console.error('Error updating course:', error);
      setMessage('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setMessage('Course deleted successfully!');
      fetchUserCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage('Failed to delete course');
    }
  };

  const saveQuestion = async () => {
    if (!selectedCourse) return;

    try {
      setSaving(true);
      
      if (questionForm.id) {
        // Update existing question
        const { error } = await supabase
          .from('course_questions')
          .update({
            ...questionForm,
            course_id: selectedCourse.id
          })
          .eq('id', questionForm.id);

        if (error) throw error;
      } else {
        // Create new question
        const { error } = await supabase
          .from('course_questions')
          .insert({
            ...questionForm,
            course_id: selectedCourse.id
          });

        if (error) throw error;
      }

      setMessage('Question saved successfully!');
      fetchCourseQuestions(selectedCourse.id);
      resetQuestionForm();
    } catch (error) {
      console.error('Error saving question:', error);
      setMessage('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('course_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      setMessage('Question deleted successfully!');
      if (selectedCourse) {
        fetchCourseQuestions(selectedCourse.id);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setMessage('Failed to delete question');
    }
  };

  const resetQuestionForm = () => {
    const nextQuestionNumber = questions.length + 1;
    setQuestionForm({
      question_number: nextQuestionNumber,
      question_text: '',
      correct_answer: '',
      acceptable_answers: [''],
      explanation: '',
      difficulty_level: 'medium',
      question_type: 'text',
      multiple_choice_options: ['', '', '', ''],
      word_bank_words: [''],
      points: 1
    });
  };

  const editQuestion = (question: Question) => {
    setQuestionForm(question);
  };

  const addAcceptableAnswer = () => {
    setQuestionForm({
      ...questionForm,
      acceptable_answers: [...questionForm.acceptable_answers, '']
    });
  };

  const updateAcceptableAnswer = (index: number, value: string) => {
    const newAnswers = [...questionForm.acceptable_answers];
    newAnswers[index] = value;
    setQuestionForm({
      ...questionForm,
      acceptable_answers: newAnswers
    });
  };

  const removeAcceptableAnswer = (index: number) => {
    if (questionForm.acceptable_answers.length > 1) {
      const newAnswers = questionForm.acceptable_answers.filter((_, i) => i !== index);
      setQuestionForm({
        ...questionForm,
        acceptable_answers: newAnswers
      });
    }
  };

  const updateMultipleChoiceOption = (index: number, value: string) => {
    const newOptions = [...questionForm.multiple_choice_options];
    newOptions[index] = value;
    setQuestionForm({
      ...questionForm,
      multiple_choice_options: newOptions
    });
  };

  const addWordBankWord = () => {
    setQuestionForm({
      ...questionForm,
      word_bank_words: [...questionForm.word_bank_words, '']
    });
  };

  const updateWordBankWord = (index: number, value: string) => {
    const newWords = [...questionForm.word_bank_words];
    newWords[index] = value;
    setQuestionForm({
      ...questionForm,
      word_bank_words: newWords
    });
  };

  const removeWordBankWord = (index: number) => {
    if (questionForm.word_bank_words.length > 1) {
      const newWords = questionForm.word_bank_words.filter((_, i) => i !== index);
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