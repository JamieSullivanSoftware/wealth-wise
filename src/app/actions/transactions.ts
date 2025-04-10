'use server';

import connectDB from '@/config/database';
import { TRANSACTION_TYPES } from '@/constants';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { isStocksOrCrypto } from '@/utils/misc';

export const addTransaction = async (transactionData: ITransactionFormData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add a transaction');
  }

  const { user } = sessionUser;

  try {
    const asset = await Asset.findById(transactionData.assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    const transaction = {
      userId: user.id || '',
      assetId: transactionData.assetId || '',
      type: transactionData.type || '',
      amount: parseFloat(transactionData.amount?.toString() || '0'),
      numUnits: parseFloat(transactionData.numUnits?.toString() || '0'),
      pricePerUnit: parseFloat(transactionData.pricePerUnit?.toString() || '0'),
    };

    if (!transactionData.pricePerUnit && transaction.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (transactionData.pricePerUnit && transaction.pricePerUnit <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (isStocksOrCrypto(asset.category)) {
      const unitAmount = transaction.numUnits * transaction.pricePerUnit;

      switch (transaction.type) {
        case TRANSACTION_TYPES.buy:
          asset.totalCostBasis += unitAmount;
          asset.numUnits += transaction.numUnits;
          asset.cost += unitAmount;
          asset.marketValue = transaction.pricePerUnit;
          asset.value = asset.numUnits * asset.marketValue;
          asset.avgPricePerUnit = asset.totalCostBasis / asset.numUnits;
          transaction.amount = unitAmount;
          break;
        case TRANSACTION_TYPES.sell:
          asset.numUnits -= transaction.numUnits;
          asset.cost -= unitAmount;
          asset.marketValue = transaction.pricePerUnit;
          asset.value = asset.numUnits * asset.marketValue;
          asset.avgPricePerUnit = asset.totalCostBasis / asset.numUnits;
          transaction.amount = unitAmount;
          break;
        default:
          break;
      }
    } else {
      // Account transactions
      if (transaction.type === TRANSACTION_TYPES.deposit) {
        asset.value += transaction.amount;
      }
      if (transaction.type === TRANSACTION_TYPES.withdraw) {
        asset.value -= transaction.amount;
      }
    }

    const newTransaction = new Transaction(transaction).save();
    const updateAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numUnits: asset.numUnits,
          value: asset.value,
          cost: asset.cost,
          marketValue: asset.marketValue,
          avgPricePerUnit: asset.avgPricePerUnit,
          totalCostBasis: asset.totalCostBasis,
        },
      }
    );
    await Promise.all([newTransaction, updateAsset]);
  } catch (error) {
    console.log(error);
    return new Response('Transaction not created', { status: 500 });
  }
};

export const deleteTransaction = async (transaction: ITransactionTableData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to delete a transaction');
  }

  try {
    const asset = await Asset.findById(transaction.asset._id);
    if (!asset) {
      throw new Error('Asset for transaction not found');
    }

    if (isStocksOrCrypto(asset.category)) {
      const unitAmount = transaction.numUnits * transaction.pricePerUnit;

      switch (transaction.type) {
        case TRANSACTION_TYPES.buy:
          asset.totalCostBasis -= unitAmount;
          asset.numUnits -= transaction.numUnits;
          asset.cost -= unitAmount;
          asset.marketValue = transaction.pricePerUnit;
          asset.value = asset.numUnits * asset.marketValue;
          asset.avgPricePerUnit = asset.totalCostBasis / asset.numUnits;
          transaction.amount = unitAmount;
          break;
        case TRANSACTION_TYPES.sell:
          asset.numUnits += transaction.numUnits;
          asset.cost += unitAmount;
          asset.marketValue = transaction.pricePerUnit;
          asset.value = asset.numUnits * asset.marketValue;
          asset.avgPricePerUnit = asset.totalCostBasis / asset.numUnits;
          transaction.amount = unitAmount;
          break;
        default:
          break;
      }
    } else {
      // Account transactions
      if (transaction.type === TRANSACTION_TYPES.deposit) {
        asset.value -= transaction.amount;
      }
      if (transaction.type === TRANSACTION_TYPES.withdraw) {
        asset.value += transaction.amount;
      }
    }

    const updateAsset = Asset.updateOne(
      { _id: asset._id },
      {
        $set: {
          numUnits: asset.numUnits,
          value: asset.value,
          cost: asset.cost,
          marketValue: asset.marketValue,
          avgPricePerUnit: asset.avgPricePerUnit,
          totalCostBasis: asset.totalCostBasis,
        },
      }
    );
    const deleteTransaction = Transaction.deleteOne({
      _id: transaction._id,
    });

    await Promise.all([updateAsset, deleteTransaction]);
  } catch (error) {
    console.log(error);
    return new Response('Transaction not deleted', { status: 500 });
  }
};
