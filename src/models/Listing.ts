import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number | null;
  isFree: boolean;
  isTrade: boolean;
  category: string;
  location: string;
  condition: string;
  availableDate: Date;
  imageUrl: string;
  imageUrls: string[];
  userId: mongoose.Types.ObjectId;
  bundleId?: mongoose.Types.ObjectId;
  isMoveOutBundle: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: null,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isTrade: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      enum: ['Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'],
    },
    location: {
      type: String,
      required: true,
      enum: ['Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird', 'Other'],
    },
    availableDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bundleId: {
      type: Schema.Types.ObjectId,
      ref: 'Bundle',
      default: undefined,
    },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'used'],
      default: 'good',
    },
    isMoveOutBundle: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Listing: Model<IListing> = mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

export default Listing;
