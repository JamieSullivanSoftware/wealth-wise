'use server';

import connectDB from '@/configdatabase';
import { TRANSACTION_TYPES } from '@/constants';
import Asset from '@/modelsAsset';
import Transaction from '@/modelsTransaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { isRealEstateCarOrOther, isStocksOrCrypto } from '@/utils/misc';

export const addAsset = async (assetData: IAssetFormData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add an asset');
  }

  const { user } = sessionUser;

  let data = {
    userId: user.id,
    name: assetData.name || '',
    category: assetData.category || '',
    cost: parseFloat(assetData.cost?.toString() || '0'),
    value: isRealEstateCarOrOther(assetData.category)
      ? parseFloat(assetData.marketValue?.toString() || '0')
      : parseFloat(assetData.value?.toString() || '0'),
    marketValue: parseFloat(assetData.marketValue?.toString() || '0'),
    numUnits: parseFloat(assetData.numUnits?.toString() || '0'),
    avgPricePerUnit: 0,
    totalCostBasis: 0,
    address: assetData.address || '',
    accountType: assetData.accountType || '',
    details: assetData.details || '',
  };

  try {
    let asset = new Asset(data);

    // First transaction only added for stocks and crypto
    if (isStocksOrCrypto(data.category)) {
      const amount = data.numUnits * data.marketValue;
      data = {
        ...data,
        cost: amount,
        totalCostBasis: amount,
        value: amount,
        marketValue: data.marketValue, // Market value is the current value of 1 unit
        avgPricePerUnit: data.marketValue, // Avg price per unit
      };

      asset = new Asset(data);
      const newAsset = await asset.save();
      const transaction = {
        userId: user.id?.toString() || '',
        assetId: newAsset._id?.toString() || '',
        type: TRANSACTION_TYPES.buy as TransactionType,
        amount,
        numUnits: data.numUnits,
        pricePerUnit: data.marketValue,
        isFirst: true,
      };

      await new Transaction(transaction).save();
      return;
    }

    await asset.save();
  } catch (error) {
    console.log(error);
    return new Response('Asset not saved', { status: 500 });
  }
};

export const deleteAsset = async (id: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to delete an asset');
  }

  try {
    const asset = await Asset.findById(id);
    if (!asset) {
      throw new Error('Asset not found');
    }

    const deleteTransactions = await Transaction.deleteMany({
      assetId: id,
    });
    const deleteAsset = await Asset.deleteOne({ _id: id });

    await Promise.all([deleteAsset, deleteTransactions]);
  } catch (error) {
    console.log(error);
    return new Response('Assets not deleted', { status: 500 });
  }
};

export const editAsset = async (assetData: IAssetFormData) => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to edit an asset');
  }

  const { user } = sessionUser;

  const data = {
    userId: user.id,
    name: assetData.name || '',
    category: assetData.category || '',
    cost: parseFloat(assetData.cost?.toString() || '0'),
    value: parseFloat(assetData.value?.toString() || '0'),
    marketValue: parseFloat(assetData.marketValue?.toString() || '0'),
    numUnits: parseFloat(assetData.numUnits?.toString() || '0'),
    address: assetData.address || '',
    accountType: assetData.accountType || '',
    details: assetData.details || '',
  };

  try {
    if (isStocksOrCrypto(data.category)) {
      data.value = data.marketValue * data.numUnits;
    }

    if (isRealEstateCarOrOther(data.category)) {
      data.value = data.marketValue;
    }

    await Asset.updateOne({ _id: assetData._id }, { $set: data });
  } catch (error) {
    console.log(error);
    return new Response('Asset not updated', { status: 500 });
  }
};
