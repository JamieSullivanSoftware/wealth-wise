'use server';

import connectDB from '@/config/database';
import { TRANSACTION_TYPES } from '@/constants';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { hasCategoryGotShares, isBuyType } from '@/utils/misc';

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
      updatedAssetCost: updatedCost,
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

  const transactionFormData = {
    amount: parseFloat(formData.get('amount')?.toString() || '0'),
    type: formData.get('type')?.toString() || '',
    numShares: parseFloat(formData.get('num-shares')?.toString() || '0'),
  };

  if (transactionFormData.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const originalTransaction = await Transaction.findById(id);
  if (!originalTransaction) {
    throw new Error('Transaction not found');
  }

  const asset = await Asset.findById(originalTransaction.asset_id);
  if (!asset) {
    throw new Error('Asset not found');
  }

  try {
    // Use form type if it has changed, otherwise use the original type
    const type =
      transactionFormData.type !== originalTransaction.type
        ? transactionFormData.type
        : originalTransaction.type;

    // Invert the cost and shares if the type is sell
    const cost = isBuyType(type)
      ? transactionFormData.amount
      : -transactionFormData.amount;
    const numShares = isBuyType(type)
      ? transactionFormData.numShares
      : -transactionFormData.numShares;

    // Calculate the original cost and shares in the associated asset
    const originalAssetCost = isBuyType(originalTransaction.type)
      ? asset.cost - originalTransaction.amount
      : asset.cost + originalTransaction.amount;
    const originalAssetShares = isBuyType(originalTransaction.type)
      ? asset.numShares - originalTransaction.numShares
      : asset.numShares + originalTransaction.numShares;

    const updateData = {
      amount: transactionFormData.amount,
      type: transactionFormData.type,
      numShares: originalAssetShares + numShares,
      updatedAssetCost: originalAssetCost + cost,
    };

    const updatedAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numShares: updateData.numShares,
          cost: updateData.updatedAssetCost,
        },
      }
    );

    const updatedTransaction = Transaction.updateOne(
      { _id: id },
      { $set: updateData }
    );
    await Promise.all([updatedAsset, updatedTransaction]);
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
