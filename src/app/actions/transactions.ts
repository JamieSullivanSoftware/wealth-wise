'use server';

import connectDB from '@/config/database';
import { TRANSACTION_TYPES } from '@/constants';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { isStocksOrCrypto, isBuyType } from '@/utils/misc';

export const addTransaction = async (transactionData: ITransactionData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add a transaction');
  }

  const { user } = sessionUser;

  let transaction = {
    userId: user.id || '',
    assetId: transactionData.assetId || '',
    type: transactionData.type || '',
    amount: parseFloat(transactionData.amount?.toString() || '0'),
    pricePerUnit: parseFloat(transactionData.pricePerUnit?.toString() || '0'),
    total: 0,
  };

  const asset = await Asset.findById(transaction.assetId);
  if (!asset) {
    throw new Error('Asset not found');
  }
  let assetCost = asset.cost;
  let assetValue = asset.value;
  let assetNumUnits = asset.numUnits;

  if (transactionData.pricePerUnit && transactionData.pricePerUnit <= 0) {
    throw new Error('Price must be greater than 0');
  }

  try {
    switch (transaction.type) {
      case TRANSACTION_TYPES.buy:
        assetCost += transaction.amount * transaction.pricePerUnit;
        assetValue += transaction.amount * transaction.pricePerUnit;
        assetNumUnits += transaction.amount;
        transaction.total = transaction.amount * transaction.pricePerUnit;
        break;
      case TRANSACTION_TYPES.sell:
        assetCost -= transaction.amount * transaction.pricePerUnit;
        assetValue -= transaction.amount * transaction.pricePerUnit;
        assetNumUnits -= transaction.amount;
        transaction.total = -transaction.amount * transaction.pricePerUnit;
        break;
      case TRANSACTION_TYPES.deposit:
      case TRANSACTION_TYPES.appreciation:
        assetValue += transaction.amount;
        transaction.total = transaction.amount;
        break;
      case TRANSACTION_TYPES.withdraw:
      case TRANSACTION_TYPES.depreciation:
        assetValue -= transaction.amount;
        transaction.total = -transaction.amount;
        break;
      default:
        break;
    }

    const newTransaction = await new Transaction(transaction).save();
    const updateAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numUnits: assetNumUnits,
          value: assetValue,
          cost: assetCost,
        },
      }
    );

    await Promise.all([updateAsset, newTransaction]);
  } catch (error) {
    console.log(error);
    return new Response('Transaction not created', { status: 500 });
  }
};

export const deleteTransaction = async (id: string) => {
  // await connectDB();
  // const sessionUser = await getSessionUser();
  // if (!sessionUser) {
  //   throw new Error('You must be logged in to delete a transaction');
  // }
  // try {
  //   const transaction = await Transaction.findById(id);
  //   if (!transaction) {
  //     throw new Error('Transaction not found');
  //   }
  //   const asset = await Asset.findById(transaction.assetId);
  //   if (!asset) {
  //     throw new Error('Asset not found');
  //   }
  //   const { amount, type, numShares } = transaction;
  //   const { updatedNumShares, updatedCost } = calculateUpdatedSharesAndCost(
  //     asset,
  //     amount,
  //     numShares,
  //     type
  //   );
  //   const updateAsset = Asset.updateOne(
  //     { _id: asset._id },
  //     {
  //       $set: {
  //         numShares: updatedNumShares,
  //         cost: updatedCost,
  //       },
  //     }
  //   );
  //   const deleteTransaction = Transaction.deleteOne({ _id: id });
  //   await Promise.all([updateAsset, deleteTransaction]);
  // } catch (error) {
  //   console.log(error);
  //   return new Response('Transaction not deleted', { status: 500 });
  // }
};

export const editTransaction = async (formData: FormData, id: string) => {
  // await connectDB();
  // const sessionUser = await getSessionUser();
  // if (!sessionUser) {
  //   throw new Error('You must be logged in to edit a transaction');
  // }
  // const transactionFormData = {
  //   amount: parseFloat(formData.get('amount')?.toString() || '0'),
  //   type: formData.get('type')?.toString() || '',
  //   numShares: parseFloat(formData.get('num-shares')?.toString() || '0'),
  // };
  // if (transactionFormData.amount <= 0) {
  //   throw new Error('Amount must be greater than 0');
  // }
  // const originalTransaction = await Transaction.findById(id);
  // if (!originalTransaction) {
  //   throw new Error('Transaction not found');
  // }
  // const asset = await Asset.findById(originalTransaction.assetId);
  // if (!asset) {
  //   throw new Error('Asset not found');
  // }
  // try {
  //   // Use form type if it has changed, otherwise use the original type
  //   const type =
  //     transactionFormData.type !== originalTransaction.type
  //       ? transactionFormData.type
  //       : originalTransaction.type;
  //   // Invert the cost and shares if the type is sell
  //   const cost = isBuyType(type)
  //     ? transactionFormData.amount
  //     : -transactionFormData.amount;
  //   const numShares = isBuyType(type)
  //     ? transactionFormData.numShares
  //     : -transactionFormData.numShares;
  //   // Calculate the original cost and shares in the associated asset
  //   const originalAssetCost = isBuyType(originalTransaction.type)
  //     ? asset.cost - originalTransaction.amount
  //     : asset.cost + originalTransaction.amount;
  //   const originalAssetShares = isBuyType(originalTransaction.type)
  //     ? asset.numShares - originalTransaction.numShares
  //     : asset.numShares + originalTransaction.numShares;
  //   const updateData = {
  //     amount: transactionFormData.amount,
  //     type: transactionFormData.type,
  //     numShares: originalAssetShares + numShares,
  //   };
  //   const updatedAsset = Asset.updateOne(
  //     { _id: asset._id },
  //     {
  //       $set: {
  //         numShares: updateData.numShares,
  //         cost: originalAssetCost + cost,
  //       },
  //     }
  //   );
  //   const updatedTransaction = Transaction.updateOne(
  //     { _id: id },
  //     { $set: updateData }
  //   );
  //   await Promise.all([updatedAsset, updatedTransaction]);
  // } catch (error) {
  //   console.log(error);
  //   return new Response('Transaction not updated', { status: 500 });
  // }
};

const calculateUpdatedSharesAndCost = (
  asset: IAssetTableData,
  amount: number,
  numShares: number,
  type: string
) => {
  // let updatedNumShares = 0;
  // let updatedCost = 0;
  // if (isStocksOrCrypto(asset.category)) {
  //   if (type === TRANSACTION_TYPES.buy) {
  //     updatedNumShares = asset.numShares + numShares;
  //     updatedCost = asset.cost + amount;
  //   }
  //   if (type === TRANSACTION_TYPES.sell && asset.numShares > 0) {
  //     updatedNumShares = asset.numShares - numShares;
  //     updatedCost = asset.cost - amount;
  //   }
  // }
  // return { updatedNumShares, updatedCost };
};
