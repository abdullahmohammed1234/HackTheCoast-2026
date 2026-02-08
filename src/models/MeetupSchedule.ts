import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IMeetupSchedule extends Document {
  transactionId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  proposedDates: {
    date: Date;
    startTime: string;
    endTime: string;
    proposedBy: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  finalMeetupDate?: Date;
  finalStartTime?: string;
  finalEndTime?: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    locationType: 'indoor' | 'outdoor' | 'public';
    safetyNotes?: string;
  };
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetupScheduleSchema = new Schema<IMeetupSchedule>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
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
    proposedDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        proposedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    finalMeetupDate: {
      type: Date,
    },
    finalStartTime: {
      type: String,
    },
    finalEndTime: {
      type: String,
    },
    location: {
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
      locationType: {
        type: String,
        enum: ['indoor', 'outdoor', 'public'],
        required: true,
      },
      safetyNotes: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MeetupScheduleSchema.index({ transactionId: 1 });
MeetupScheduleSchema.index({ buyerId: 1, status: 1 });
MeetupScheduleSchema.index({ sellerId: 1, status: 1 });

const MeetupSchedule: Model<IMeetupSchedule> = mongoose.models.MeetupSchedule || mongoose.model<IMeetupSchedule>('MeetupSchedule', MeetupScheduleSchema);

export default MeetupSchedule;
