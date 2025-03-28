import { CATEGORIES } from '@/constants';
import { Schema, model, models } from 'mongoose';

export const AssetSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      required: true,
    },

    // Total cost basis or purchase price
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
    // Current market/appraised value
    value: {
      type: Number,
      required: true,
      default: 0,
    },

    // Fields for stocks/crypto
    numShares: {
      type: Number,
      required: false,
      default: 0,
    },
    avgPricePerShare: {
      type: Number,
      required: false,
      default: 0,
    },

    // Fields for real estate & car
    depreciation: {
      type: Number,
      required: false,
      default: 0,
    },

    // For accounts, "Checking", "Savings"
    accountType: {
      type: String,
      required: false,
      default: null,
    },
    balance: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Asset = models.Asset || model('Asset', AssetSchema);

export default Asset;
