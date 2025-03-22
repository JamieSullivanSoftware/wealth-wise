'use server';

import connectDB from '@/config/database';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';

const hasCategoryGotShares = (asset: ITransactionAssetData): boolean => {
  return (
    asset.category === CATEGORIES.crypto || asset.category === CATEGORIES.stocks
  );
};

export const addTransaction = async (formData: FormData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add a transaction');
  }

  const { user } = sessionUser;
  const amount = parseFloat(formData.get('amount')?.toString() || '0');
  const type = formData.get('type');
  const numShares = parseFloat(formData.get('num-shares')?.toString() || '0');
  const asset = await Asset.findById(formData.get('asset-id'));
  let updatedNumShares = 0;
  let updatedCost = 0;

  if (!asset) {
    throw new Error('Asset not found');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (hasCategoryGotShares(asset) && numShares) {
    if (type === TRANSACTION_TYPES.buy) {
      updatedNumShares = asset.numShares + numShares;
      updatedCost = asset.cost + amount;
    }

    if (type === TRANSACTION_TYPES.sell && asset.numShares > 0) {
      updatedNumShares = asset.numShares - numShares;
      updatedCost = asset.cost - amount;
    }
  }

  try {
    const updateAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numShares: updatedNumShares,
          cost: updatedCost,
        },
      }
    );

    const updateTransaction = new Transaction({
      user_id: user.id,
      asset_id: asset._id,
      amount,
      type,
    }).save();

    await Promise.all([updateAsset, updateTransaction]);
  } catch (error) {
    console.log(error);
    return new Response('Transaction not created', { status: 500 });
  }
};

export const deleteTransaction = async (id: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to delete a transaction');
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const asset = await Asset.findById(transaction.asset_id);
  if (!asset) {
    throw new Error('Asset not found');
  }

  const { amount, type } = transaction;
  const { numShares } = asset;
  let updatedNumShares = 0;
  let updatedCost = 0;

  if (hasCategoryGotShares(asset) && numShares) {
    if (type === TRANSACTION_TYPES.buy) {
      // TODO update to transaction shares
      updatedNumShares = asset.numShares - numShares;
      updatedCost = asset.cost - amount;
    }

    if (type === TRANSACTION_TYPES.sell && asset.numShares > 0) {
      updatedNumShares = asset.numShares + numShares;
      updatedCost = asset.cost + amount;
    }
  }

  try {
    const updateAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numShares: updatedNumShares,
          cost: updatedCost,
        },
      }
    );
    const deleteTransaction = Transaction.deleteOne({ _id: id });
    await Promise.all([updateAsset, deleteTransaction]);
  } catch (error) {
    console.log(error);
    return new Response('Transaction not deleted', { status: 500 });
  }
};

export const editTransaction = async (
  formData: FormData,
  oldAssetId: string
) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to edit a transaction');
  }

  const { user } = sessionUser;
  let amount = parseFloat(formData.get('amount')?.toString() || '0');
  const type = formData.get('type');
  const newAsset = await Asset.findById(formData.get('asset-id'));
  const oldAsset = await Asset.findById(oldAssetId);

  if (!newAsset || !oldAsset) {
    throw new Error('Asset not found');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (type === TRANSACTION_TYPES.sell) {
    amount = -amount;
  }

  const transactionData = {
    user_id: user.id,
    asset_id: newAsset._id,
    amount,
    type,
  };

  // If the type is buy then take away a share from found asset
  // If sell then add a share to the found asset

  // if (hasCategoryGotShares(oldAsset)) {
  //   if (type === TRANSACTION_TYPES.buy) {
  //     await Asset.updateOne({ _id: oldAsset._id }, { $inc: { numShares: -1 } });
  //   }
  // }

  // Get the new asset to update
  // If the type is buy then add a share to the new asset
  // If sell then take away a share from the new asset
  // Update the asset with the new data
  // Update the transaction with the new data

  // await Asset.updateOne(
  //   { _id: asset._id },
  //   { $inc: { cost: -amount, value: amount } }
  // );

  const newTransaction = new Transaction(transactionData);
  await newTransaction.save();
};
