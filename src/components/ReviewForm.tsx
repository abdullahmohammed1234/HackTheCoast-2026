'use client';

import { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  revieweeId: string;
  listingId: string;
  listingTitle: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ revieweeId, listingId, listingTitle, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [transactionType, setTransactionType] = useState<'purchase' | 'trade'>('purchase');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revieweeId,
          listingId,
          rating,
          comment,
          transactionType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit review');
        return;
      }

      // Reset form
      setRating(0);
      setComment('');
      setTransactionType('purchase');
      onSuccess?.();
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Rate your experience</h4>
        <p className="text-sm text-gray-600 mb-2">Listing: {listingTitle}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={rating} onRatingChange={setRating} />
          {rating > 0 && (
            <span className="text-sm text-gray-600">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionType"
                value="purchase"
                checked={transactionType === 'purchase'}
                onChange={() => setTransactionType('purchase')}
                className="mr-2"
              />
              <span className="text-sm">Purchase</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionType"
                value="trade"
                checked={transactionType === 'trade'}
                onChange={() => setTransactionType('trade')}
                className="mr-2"
              />
              <span className="text-sm">Trade</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Share details about your experience..."
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 characters</p>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || rating === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
