import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Plus, 
  Search, 
  Filter,
  ThumbsUp,
  Calendar,
  Award,
  Building,
  Users,
  CheckCircle
} from 'lucide-react';

interface TrainingCenter {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  specializations: string[];
  certifications: string[];
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  review_text: string;
  pros: string;
  cons: string;
  course_taken: string;
  completion_date: string;
  would_recommend: boolean;
  helpful_votes: number;
  created_at: string;
  user_email: string;
}

const TrainingCenterReviews: React.FC = () => {
  const { user } = useAuth();
  const [centers, setCenters] = useState<TrainingCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<TrainingCenter | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    review_text: '',
    pros: '',
    cons: '',
    course_taken: '',
    completion_date: '',
    would_recommend: true
  });

  useEffect(() => {
    fetchTrainingCenters();
  }, []);

  const fetchTrainingCenters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_centers')
        .select('*')
        .order('average_rating', { ascending: false });

      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Error fetching training centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (centerId: string) => {
    try {
      const { data, error } = await supabase
        .from('center_reviews')
        .select(`
          *,
          user_id
        `)
        .eq('center_id', centerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails for reviews
      const reviewsWithEmails = await Promise.all(
        (data || []).map(async (review) => {
          const { data: userData } = await supabase.auth.admin.getUserById(review.user_id);
          return {
            ...review,
            user_email: userData.user?.email || 'Anonymous'
          };
        })
      );

      setReviews(reviewsWithEmails);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!user || !selectedCenter) return;

    try {
      const { error } = await supabase
        .from('center_reviews')
        .insert({
          center_id: selectedCenter.id,
          user_id: user.id,
          ...reviewForm
        });

      if (error) throw error;

      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        title: '',
        review_text: '',
        pros: '',
        cons: '',
        course_taken: '',
        completion_date: '',
        would_recommend: true
      });
      fetchReviews(selectedCenter.id);
      fetchTrainingCenters(); // Refresh to update ratings
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const cities = ['all', ...Array.from(new Set(centers.map(c => c.city)))];

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || center.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training centers...</p>
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
              <Building className="w-8 h-8 mr-3 text-blue-600" />
              Training Center Reviews
            </h1>
            <p className="text-gray-600 mt-2">Find and review forklift training centers</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{centers.length}</div>
            <div className="text-sm text-gray-500">Training Centers</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredCenters.length} of {centers.length} centers
          </div>
        </div>
      </div>

      {/* Training Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCenters.map((center) => (
          <div key={center.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{center.name}</h3>
                    {center.is_verified && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" title="Verified" />
                    )}
                  </div>
                  <div className="flex items-center mb-2">
                    {renderStars(Math.round(center.average_rating))}
                    <span className="ml-2 text-sm text-gray-600">
                      {center.average_rating.toFixed(1)} ({center.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{center.description}</p>

              <div className="space-y-2 mb-4">
                {center.city && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {center.city}
                  </div>
                )}
                {center.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {center.phone}
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {center.email}
                  </div>
                )}
                {center.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>

              {center.specializations && center.specializations.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-2">
                    {center.specializations.map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {center.certifications && center.certifications.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {center.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedCenter(center);
                    fetchReviews(center.id);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Reviews
                </button>

                {user && (
                  <button
                    onClick={() => {
                      setSelectedCenter(center);
                      setShowReviewForm(true);
                    }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {(selectedCenter && !showReviewForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Reviews for {selectedCenter.name}</h3>
              <button
                onClick={() => setSelectedCenter(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Be the first to review this training center!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="ml-2 font-semibold">{review.title}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            By {review.user_email.split('@')[0]} • {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {review.would_recommend && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Recommends
                          </span>
                        )}
                      </div>

                      <p className="text-gray-800 mb-4">{review.review_text}</p>

                      {review.course_taken && (
                        <div className="mb-2">
                          <span className="font-medium">Course taken:</span> {review.course_taken}
                        </div>
                      )}

                      {review.pros && (
                        <div className="mb-2">
                          <span className="font-medium text-green-600">Pros:</span> {review.pros}
                        </div>
                      )}

                      {review.cons && (
                        <div className="mb-2">
                          <span className="font-medium text-red-600">Cons:</span> {review.cons}
                        </div>
                      )}

                      <div className="flex items-center mt-4">
                        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful_votes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && selectedCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Write Review for {selectedCenter.name}</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            i < reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={reviewForm.review_text}
                    onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your detailed experience..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pros</label>
                    <textarea
                      value={reviewForm.pros}
                      onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What did you like?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cons</label>
                    <textarea
                      value={reviewForm.cons}
                      onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What could be improved?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Taken</label>
                  <input
                    type="text"
                    value={reviewForm.course_taken}
                    onChange={(e) => setReviewForm({ ...reviewForm, course_taken: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., TLILIC0004 Forklift License"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
                  <input
                    type="date"
                    value={reviewForm.completion_date}
                    onChange={(e) => setReviewForm({ ...reviewForm, completion_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommend"
                    checked={reviewForm.would_recommend}
                    onChange={(e) => setReviewForm({ ...reviewForm, would_recommend: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recommend" className="ml-2 block text-sm text-gray-900">
                    I would recommend this training center
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={!reviewForm.title || !reviewForm.review_text}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingCenterReviews;