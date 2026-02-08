import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { INotificationPreferences, defaultNotificationPreferences } from '@/types/notifications';

export interface IUser {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  bio?: string;
  badges: string[];
  rating: number;
  reviewCount: number;
  followersCount: number;
  followingCount: number;
  totalSales: number;
  sustainableListings: number;
  // Gamification fields
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: Date;
  achievements: string[];
  impactStats: {
    itemsReused: number;
    wasteSaved: number;
    co2Prevented: number;
    waterSaved: number;
    energySaved: number;
  };
  notificationPreferences: INotificationPreferences;
  createdAt: Date;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserAvailableMethods>;

export interface IUserAvailableMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxLength: 500,
    },
    badges: {
      type: [String],
      default: [],
      enum: ['Top Seller', 'Sustainable Hero', 'Quick Responder', 'Trusted Trader', 'Community Star'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },
    sustainableListings: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Gamification fields
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    achievements: {
      type: [String],
      default: [],
    },
    impactStats: {
      itemsReused: { type: Number, default: 0 },
      wasteSaved: { type: Number, default: 0 },
      co2Prevented: { type: Number, default: 0 },
      waterSaved: { type: Number, default: 0 },
      energySaved: { type: Number, default: 0 },
    },
    notificationPreferences: {
      type: Object,
      default: defaultNotificationPreferences,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: UserModel = mongoose.models.User || mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;
