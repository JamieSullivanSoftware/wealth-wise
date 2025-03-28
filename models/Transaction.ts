import { TRANSACTION_TYPES } from '@/constants';
import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    asset_id: {
      type: Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },

    // Number of shares/coins, deposit amount, or market value change
    amount: {
      type: Number,
      required: true,
    },
    // Price per unit (only for stocks/crypto)
    pricePerUnit: {
      type: Number,
      required: false,
      default: 0,
    },
    // Total transaction cost
    total: {
      type: Number,
      required: true,
    },

    // First transaction when creating an asset
    isFirst: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;
