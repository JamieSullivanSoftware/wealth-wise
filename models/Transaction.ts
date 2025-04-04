import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assetId: {
      type: Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: false,
      default: '',
    },

    // Only for stocks/crypto
    // Number of units
    numUnits: {
      type: Number,
      required: false,
      default: 0,
    },
    // Price per unit
    pricePerUnit: {
      type: Number,
      required: false,
      default: 0,
    },

    // First transaction when creating an asset
    isFirst: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;
