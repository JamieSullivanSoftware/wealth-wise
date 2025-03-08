'use server';

import connectDB from '@/config/database';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';

async function addTransaction(formData: FormData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add a transaction');
  }

  const { user } = sessionUser;
  let amount = parseFloat(formData.get('amount')?.toString() || '0');
  const type = formData.get('type');
  const asset = await Asset.findById(formData.get('asset-id'));

  if (!asset) {
    throw new Error('Asset not found');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (type === TRANSACTION_TYPES.sell) {
    amount = -amount;
  }

  // Update the number of shares for the asset
  if (
    (asset.category === CATEGORIES.crypto ||
      asset.category === CATEGORIES.stocks) &&
    type === TRANSACTION_TYPES.sell
  ) {
    if (type === TRANSACTION_TYPES.buy) {
      await Asset.updateOne({ _id: asset._id }, { $inc: { numShares: 1 } });
    }

    if (type === TRANSACTION_TYPES.sell && asset.numShares > 0) {
      await Asset.updateOne({ _id: asset._id }, { $inc: { numShares: -1 } });
    } else {
      throw new Error('Asset does not have any shares to sell');
    }
  }

  await Asset.updateOne(
    { _id: asset._id },
    { $inc: { cost: -amount, value: amount } }
  );

  const transactionData = {
    user_id: user.id,
    asset_id: asset._id,
    amount,
    type,
  };

  const newTransaction = new Transaction(transactionData);
  await newTransaction.save();
}

export default addTransaction;
