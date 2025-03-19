import { Schema, model, models } from 'mongoose';

export const AssetSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    numShares: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Asset = models.Asset || model('Asset', AssetSchema);

export default Asset;
