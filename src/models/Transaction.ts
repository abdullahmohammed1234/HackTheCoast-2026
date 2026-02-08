import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITransaction extends Document {
  listingId: mongoose.Types.ObjectId;
  offerId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  finalPrice: number;
  type: 'sale' | 'purchase' | 'trade';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'disputed';
  meetupLocation?: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  meetupDate?: Date;
  completedAt?: Date;
  buyerReview?: {
    rating: number;
    comment: string;
  };
  sellerReview?: {
    rating: number;
    comment: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['sale', 'purchase', 'trade'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled', 'disputed'],
      default: 'pending',
    },
    meetupLocation: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    meetupDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    buyerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
    sellerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
TransactionSchema.index({ buyerId: 1, createdAt: -1 });
TransactionSchema.index({ sellerId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
