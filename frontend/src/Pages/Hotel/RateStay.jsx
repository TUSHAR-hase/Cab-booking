import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RateStay() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const submitRating = async () => {
        try {
            setSubmitting(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel-ratings/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId, rating, review })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit rating');
            }

            navigate('/rating-thank-you');
        } catch (err) {
            setError(err.message || 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8 border-2 border-red-600">
                <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">Rate Your Stay</h1>

                {/* Star Rating */}
                <div className="flex justify-center mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-4xl mx-1 focus:outline-none transition-colors ${star <= rating ? 'text-red-500' : 'text-gray-500'
                                }`}
                            aria-label={`Rate ${star} star`}
                        >
                            {star <= rating ? '★' : '☆'}
                        </button>
                    ))}
                </div>

                {/* Review Textarea */}
                <div className="mb-6">
                    <label htmlFor="review" className="block text-red-400 mb-2">
                        Optional Review
                    </label>
                    <textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows="4"
                        placeholder="How was your experience?"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 text-red-400 text-sm">{error}</div>
                )}

                {/* Submit Button */}
                <button
                    onClick={submitRating}
                    disabled={rating === 0 || submitting}
                    className={`w-full py-3 px-4 rounded-md font-bold transition-colors ${rating === 0 || submitting
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                        }`}
                >
                    {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
            </div>
        </div>
    );
}