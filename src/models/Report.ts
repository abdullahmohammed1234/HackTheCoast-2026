import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reportedUserId?: mongoose.Types.ObjectId;
  reportedListingId?: mongoose.Types.ObjectId;
  reportType: 'user' | 'listing';
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: undefined,
    },
    reportedListingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      default: undefined,
    },
    reportType: {
      type: String,
      enum: ['user', 'listing'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'scam',
        'fake-listing',
        'harassment',
        'inappropriate-content',
        'spam',
        'misleading-price',
        'non-responsive',
        'other',
      ],
    },
    description: {
      type: String,
      default: '',
      maxLength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ReportSchema.index({ reporterId: 1, createdAt: -1 });
ReportSchema.index({ reportedUserId: 1 });
ReportSchema.index({ reportedListingId: 1 });
ReportSchema.index({ status: 1 });

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;
