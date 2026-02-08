import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IReview extends Document {
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  transactionType: 'purchase' | 'trade';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revieweeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      maxLength: 1000,
    },
    transactionType: {
      type: String,
      enum: ['purchase', 'trade'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews for the same listing
ReviewSchema.index({ reviewerId: 1, listingId: 1 }, { unique: true });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
