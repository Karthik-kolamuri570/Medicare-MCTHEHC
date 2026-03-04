import { useState, useRef, useCallback } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './../../styles/ReviewModal.css';

/**
 * ReviewModal – Post-consultation rating component
 * Supports continuous star rating (0.1 precision) via mouse position tracking
 */
function ReviewModal({ appointmentId, doctorId, doctorName, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const starsRef = useRef(null);

  // Calculate rating from mouse or touch position relative to stars container
  const getRatingFromEvent = useCallback((e) => {
    if (!starsRef.current) return 0;
    const rect = starsRef.current.getBoundingClientRect();
    
    // Support both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const withinStar = (x - starIndex * starWidth) / starWidth;

    // Round to 1 decimal place
    const raw = starIndex + withinStar;
    const rounded = Math.round(Math.max(0.1, Math.min(5, raw)) * 10) / 10;
    return rounded;
  }, []);

  const handleMouseMove = useCallback((e) => {
    setHoverRating(getRatingFromEvent(e));
  }, [getRatingFromEvent]);

  const handleClick = useCallback((e) => {
    const val = getRatingFromEvent(e);
    setRating(val);
  }, [getRatingFromEvent]);

  // Touch handlers for mobile swipe support
  const handleTouchMove = useCallback((e) => {
    // Prevent scrolling while rating
    if (e.cancelable) e.preventDefault();
    setHoverRating(getRatingFromEvent(e));
  }, [getRatingFromEvent]);

  const handleTouchEnd = useCallback((e) => {
    // If we have a hover rating from the move, set it as the final rating
    // e.touches is empty on end, so we rely on the last hoverRating
    if (hoverRating > 0) {
      setRating(hoverRating);
    }
    setHoverRating(0);
  }, [hoverRating]);

  const handleMouseLeave = useCallback(() => {
    setHoverRating(0);
  }, []);

  const displayRating = hoverRating || rating;

  // Get label text based on rating value
  const getRatingLabel = (r) => {
    if (r === 0) return 'Tap the stars to rate';
    if (r <= 1) return 'Poor';
    if (r <= 2) return 'Below Average';
    if (r <= 3) return 'Average';
    if (r <= 4) return 'Good';
    if (r <= 4.5) return 'Very Good';
    return 'Excellent';
  };

  // Get color based on rating
  const getRatingColor = (r) => {
    if (r === 0) return '#64748b';
    if (r <= 1.5) return '#ef4444';
    if (r <= 2.5) return '#f97316';
    if (r <= 3.5) return '#eab308';
    if (r <= 4.5) return '#22c55e';
    return '#10b981';
  };

  // Build the star fill for a given star index (0-4)
  const getStarFill = (starIdx) => {
    const fillAmount = Math.max(0, Math.min(1, displayRating - starIdx));
    return fillAmount * 100;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/api/patient/review', {
        appointmentId,
        doctorId,
        rating,
        message
      });
      if (res.data?.success) {
        setSubmitted(true);
        toast.success('Thank you for your review! ⭐');
        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rv-overlay">
        <div className="rv-modal rv-modal-success">
          <div className="rv-success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>Your feedback helps improve healthcare quality.</p>
          <div className="rv-submitted-rating">
            <span className="rv-big-rating">{rating.toFixed(1)}</span>
            <span className="rv-out-of">/5</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rv-overlay">
      <div className="rv-modal">
        {/* Header */}
        <div className="rv-header">
          <div className="rv-icon-wrap">
            <span className="rv-icon">⭐</span>
          </div>
          <h2 className="rv-title">Rate Your Consultation</h2>
          <p className="rv-subtitle">
            How was your experience with{' '}
            <strong>{doctorName ? `Dr. ${doctorName}` : 'your doctor'}</strong>?
          </p>
        </div>

        {/* Star Rating */}
        <div className="rv-rating-section">
          <div
            className="rv-stars-container"
            ref={starsRef}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="slider"
            aria-label="Rating"
            aria-valuenow={rating}
            aria-valuemin={0}
            aria-valuemax={5}
          >
            {[0, 1, 2, 3, 4].map((idx) => {
              const fill = getStarFill(idx);
              const gradientId = `star-grad-${idx}`;
              return (
                <svg
                  key={idx}
                  className="rv-star"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id={gradientId}>
                      <stop
                        offset={`${fill}%`}
                        stopColor={getRatingColor(displayRating)}
                      />
                      <stop
                        offset={`${fill}%`}
                        stopColor="#e2e8f0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={`url(#${gradientId})`}
                    stroke={displayRating > idx ? getRatingColor(displayRating) : '#cbd5e1'}
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              );
            })}
          </div>

          {/* Rating Display */}
          <div className="rv-rating-display">
            <span
              className="rv-rating-number"
              style={{ color: getRatingColor(displayRating) }}
            >
              {displayRating > 0 ? displayRating.toFixed(1) : '—'}
            </span>
            <span className="rv-rating-max">/ 5</span>
          </div>
          <p
            className="rv-rating-label"
            style={{ color: getRatingColor(displayRating) }}
          >
            {getRatingLabel(displayRating)}
          </p>
        </div>

        {/* Message Box */}
        <div className="rv-message-section">
          <label className="rv-message-label" htmlFor="rv-message">
            Share your experience <span className="rv-optional">(optional)</span>
          </label>
          <textarea
            id="rv-message"
            className="rv-textarea"
            placeholder="Tell us about your consultation experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            rows={4}
          />
          <div className="rv-char-count">{message.length}/500</div>
        </div>

        {/* Actions */}
        <div className="rv-actions">
          <button
            className="rv-btn rv-btn-submit"
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
          >
            {submitting ? (
              <span className="rv-spinner" />
            ) : (
              <>Submit Review</>
            )}
          </button>
          <button
            className="rv-btn rv-btn-skip"
            onClick={onClose}
            disabled={submitting}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
