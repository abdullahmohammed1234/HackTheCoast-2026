import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPriceAlert extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  isActive: boolean;
  notifiedAt: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const PriceAlertSchema = new Schema<IPriceAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    category: {
      type: String,
      default: 'all',
    },
    location: {
      type: String,
      default: 'all',
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    maxPrice: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notifiedAt: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

PriceAlertSchema.index({ userId: 1, category: 1, location: 1, minPrice: 1, maxPrice: 1 });

const PriceAlert: Model<IPriceAlert> = mongoose.models.PriceAlert || mongoose.model<IPriceAlert>('PriceAlert', PriceAlertSchema);

export default PriceAlert;
