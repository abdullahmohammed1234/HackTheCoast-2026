import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IWishlistItem {
  listingId: mongoose.Types.ObjectId;
  createdAt?: Date;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [WishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
