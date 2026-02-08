import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBlock extends Document {
  blockerId: mongoose.Types.ObjectId;
  blockedId: mongoose.Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    blockerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blockedId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      default: '',
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate blocks
BlockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

const Block: Model<IBlock> = mongoose.models.Block || mongoose.model<IBlock>('Block', BlockSchema);

export default Block;
