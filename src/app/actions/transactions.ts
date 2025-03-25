'use server';

import connectDB from '@/config/database';
import { TRANSACTION_TYPES } from '@/constants';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { hasCategoryGotShares } from '@/utils/misc';

export const addTransaction = async (formData: FormData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add a transaction');
  }

  const { user } = sessionUser;

  const addData = {
    amount: parseFloat(formData.get('amount')?.toString() || '0'),
    type: formData.get('type')?.toString() || '',
    numShares: parseFloat(formData.get('num-shares')?.toString() || '0'),
  };

  const asset = await Asset.findById(formData.get('asset-id'));
  if (!asset) {
    throw new Error('Asset not found');
  }

  if (addData.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const { updatedNumShares, updatedCost } = calculateUpdatedSharesAndCost(
    asset,
    addData.amount,
    addData.numShares,
    addData.type
  );

  try {
    const updatedAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numShares: updatedNumShares,
          cost: updatedCost,
        },
      }
    );

    const transaction = new Transaction({
      user_id: user.id,
      asset_id: asset._id,
      amount: addData.amount,
      type: addData.type,
      updatedCost,
      numShares: addData.numShares,
    }).save();

    await Promise.all([updatedAsset, transaction]);
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

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const asset = await Asset.findById(transaction.asset_id);
    if (!asset) {
      throw new Error('Asset not found');
    }

    const { amount, type, numShares } = transaction;
    const { updatedNumShares, updatedCost } = calculateUpdatedSharesAndCost(
      asset,
      amount,
      numShares,
      type
    );

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

export const editTransaction = async (formData: FormData, id: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    throw new Error('You must be logged in to edit a transaction');
  }

  const updateData = {
    amount: parseFloat(formData.get('amount')?.toString() || '0'),
    type: formData.get('type')?.toString() || '',
    numShares: parseFloat(formData.get('num-shares')?.toString() || '0'),
  };

  if (updateData.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const asset = await Asset.findById(transaction.asset_id);
  if (!asset) {
    throw new Error('Asset not found');
  }

  try {
    const { amount } = transaction;
    const { updatedNumShares, updatedCost } = calculateUpdatedSharesAndCost(
      asset,
      amount,
      updateData.numShares,
      updateData.type
    );

    const updateAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numShares: updatedNumShares,
          cost: updatedCost,
        },
      }
    );
    const updateTransaction = Transaction.updateOne(
      { _id: id },
      { $set: updateData }
    );
    await Promise.all([updateAsset, updateTransaction]);
  } catch (error) {
    console.log(error);
    return new Response('Transaction not updated', { status: 500 });
  }
};

const calculateUpdatedSharesAndCost = (
  asset: IAssetData,
  amount: number,
  numShares: number,
  type: string
) => {
  let updatedNumShares = 0;
  let updatedCost = 0;
  if (hasCategoryGotShares(asset.category)) {
    if (type === TRANSACTION_TYPES.buy) {
      updatedNumShares = asset.numShares + numShares;
      updatedCost = asset.cost + amount;
    }
    if (type === TRANSACTION_TYPES.sell && asset.numShares > 0) {
      updatedNumShares = asset.numShares - numShares;
      updatedCost = asset.cost - amount;
    }
  }
  return { updatedNumShares, updatedCost };
};
