import React, { useEffect, useState } from 'react';
import { getProductReviews, createReview } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ReviewSection = ({ productId, onReviewUpdate }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ rating: 0, comment: '', title: '' });
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductReviews(productId, { limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
        setReviews(res.data.reviews);
        if (res.data.reviews.length > 0) {
          const totalRating = res.data.reviews.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating(totalRating / res.data.reviews.length);
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setError('Could not load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId, refresh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit a review.');
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      toast.error('Please select a rating between 1 and 5.');
      return;
    }
    if (form.comment.length < 10) {
      toast.error('Comment must be at least 10 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await createReview(productId, form);
      toast.success('Review submitted!');
      setForm({ rating: 0, comment: '', title: '' });
      setRefresh(prev => !prev);
      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, totalStars = 5) => {
    return [...Array(totalStars)].map((_, i) =>
      i < rating ? (
        <StarSolid key={i} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarOutline key={i} className="h-5 w-5 text-yellow-400/30" />
      )
    );
  };

  return (
    <div className="mt-12 bg-gray-900/80 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Customer Reviews</h2>

      {/* Average Rating and Review Count */}
      {reviews.length > 0 && (
        <div className="flex items-center mb-6">
          <div className="flex items-center mr-3">
            <span className="text-3xl font-bold text-white mr-2">{averageRating.toFixed(1)}</span>
            <div className="flex">{renderStars(averageRating)}</div>
          </div>
          <span className="text-indigo-200/60">({reviews.length} reviews)</span>
        </div>
      )}

      {loading ? (
        <div className="text-indigo-200">Loading reviews...</div>
      ) : error ? (
        <div className="text-rose-400">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-indigo-200">No reviews yet. Be the first to review!</div>
      ) : (
        <ul className="space-y-6 mb-8">
          {reviews.map((review) => (
            <li key={review._id} className="bg-gray-800/80 rounded-lg p-4 border border-indigo-500/10 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{review.user?.name || 'Anonymous'}</span>
                  <span className="text-indigo-200/40 text-sm">• {new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              {review.title && <h4 className="font-bold text-white text-lg mb-1">{review.title}</h4>}
              <p className="text-indigo-200/90 leading-relaxed">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-indigo-500/20 pt-6 mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-indigo-200 mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none hover:scale-110 transition-transform"
                  >
                    {form.rating >= star ? (
                      <StarSolid className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarOutline className="h-8 w-8 text-yellow-400/30 hover:text-yellow-400/60" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="review-title" className="block text-indigo-200 mb-2">Review Title</label>
              <input
                id="review-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                maxLength={100}
                className="w-full rounded-lg px-4 py-2 bg-gray-800 text-white border border-indigo-500/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors placeholder-indigo-200/40"
                placeholder="Summarize your experience in a few words"
              />
            </div>
            <div>
              <label htmlFor="review-comment" className="block text-indigo-200 mb-2">Your Review</label>
              <textarea
                id="review-comment"
                name="comment"
                value={form.comment}
                onChange={handleInputChange}
                minLength={10}
                maxLength={500}
                required
                className="w-full rounded-lg px-4 py-2 bg-gray-800 text-white border border-indigo-500/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y placeholder-indigo-200/40"
                placeholder="Share your thoughts on the product (at least 10 characters)"
                rows={5}
              />
              <div className="text-xs text-indigo-200/60 mt-1">
                {form.comment.length}/500 characters
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="text-indigo-200 p-4 bg-gray-800/50 rounded-lg text-center">
            Please <Link to="/auth/login" className="text-indigo-400 hover:underline">log in</Link> to write a review.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
