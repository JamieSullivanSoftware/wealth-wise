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
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;
