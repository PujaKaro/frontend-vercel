import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const BookingReviewForm = ({ booking, onReviewSubmitted }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a review message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the testimonial document with all necessary fields
      const testimonialData = {
        userId: currentUser?.uid || booking.userId,
        userName: currentUser?.displayName || booking.userName || 'Anonymous User',
        userEmail: currentUser?.email || booking.userEmail,
        userImage: currentUser?.photoURL || null,
        bookingId: booking.id,
        pujaId: booking.pujaId,
        pujaName: booking.pujaName,
        rating: rating,
        message: message,
        status: 'pending', // Needs admin approval before displaying on site
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add to testimonials collection
      const docRef = await addDoc(collection(db, 'testimonials'), testimonialData);

      // Update the booking to mark as reviewed
      await updateDoc(doc(db, 'bookings', booking.id), {
        hasReview: true,
        reviewId: docRef.id,
        reviewedAt: serverTimestamp()
      });

      toast.success('Thank you for your feedback! Your testimonial will be reviewed by our team.');
      
      // If there's a callback function, call it
      if (typeof onReviewSubmitted === 'function') {
        onReviewSubmitted(docRef.id);
      }
      
      // Reset form
      setRating(5);
      setMessage('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>
      <p className="text-gray-600 mb-6">
        Thank you for using our service. Please share your experience with {booking.pujaName}.
        Your feedback helps us improve and helps others choose the right puja services.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-gray-700 font-medium mb-2">How would you rate your experience?</p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
                onMouseLeave={handleRatingLeave}
                className="text-2xl mr-1 focus:outline-none"
              >
                <FontAwesomeIcon 
                  icon={(hoverRating || rating) >= value ? fasStar : farStar} 
                  className={(hoverRating || rating) >= value ? "text-yellow-400" : "text-gray-300"} 
                />
              </button>
            ))}
            <span className="ml-2 text-gray-600">{rating} out of 5</span>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="review-message" className="block text-gray-700 font-medium mb-2">
            Your Review
          </label>
          <textarea
            id="review-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your experience with this puja service..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingReviewForm; 