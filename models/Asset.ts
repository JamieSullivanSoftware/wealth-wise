import { Schema, model, models } from 'mongoose';

export const AssetSchema = new Schema(
  {
    userId: {
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
      required: true,
    },

    // Total cost basis or purchase price
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
    // Total value
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    // Current market value
    marketValue: {
      type: Number,
      required: true,
      default: 0,
    },

    // For stocks/crypto
    numUnits: {
      type: Number,
      required: false,
      default: 0,
    },
    // Average price per unit
    avgPricePerUnit: {
      type: Number,
      required: false,
      default: 0,
    },

    // For real estate
    address: {
      type: String,
      required: false,
      default: null,
    },

    // For accounts
    accountType: {
      type: String,
      required: false,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Asset = models.Asset || model('Asset', AssetSchema);

export default Asset;
