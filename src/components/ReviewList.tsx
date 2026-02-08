'use client';

import StarRating from './StarRating';

interface Review {
  _id: string;
  reviewerId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  transactionType: 'purchase' | 'trade';
  createdAt: string;
  listingId?: {
    _id: string;
    title: string;
    imageUrl?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto mb-3 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <p>No reviews yet</p>
        <p className="text-sm">Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div>
            <StarRating rating={averageRating} readonly />
            <p className="text-sm text-gray-600 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.reviewerId.avatar ? (
                  <img
                    src={review.reviewerId.avatar}
                    alt={review.reviewerId.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {review.reviewerId.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{review.reviewerId.name}</h4>
                  <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-xs text-gray-500 capitalize">
                    ({review.transactionType})
                  </span>
                </div>

                {review.comment && (
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                )}

                {review.listingId && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c2.997 0 5.437.68 7.165 1.783a.75.75 0 01.496.568l2.31 3.088a.75.75 0 01-.36 1.115 8.012 8.012 0 01-6.912 2.615.75.75 0 01-.585-.133A5.49 5.49 0 019.75 16.5a8.02 8.02 0 01-4.406-1.348.75.75 0 01-.585.133 5.49 5.49 0 01-2.667-4.607 8.012 8.012 0 01-6.912-2.615.75.75 0 01.36-1.115l2.31-3.088a.75.75 0 01.496-.568z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Re: {review.listingId.title}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
