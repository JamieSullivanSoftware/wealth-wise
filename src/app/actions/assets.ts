'use server';

import connectDB from '@/configdatabase';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Asset from '@/modelsAsset';
import Transaction from '@/modelsTransaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { isStocksOrCrypto } from '@/utils/misc';

export const addAsset = async (assetData: IAssetData) => {
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
    value: parseFloat(assetData.value?.toString() || '0'),
    marketValue: parseFloat(assetData.value?.toString() || '0'),
    numUnits: parseFloat(assetData.numUnits?.toString() || '0'),
    avgPricePerUnit: 0,
    address: assetData.address || '',
    accountType: assetData.accountType || '',
  };

  try {
    let asset = new Asset(data);

    // Transaction only added for stocks and crypto
    if (isStocksOrCrypto(data.category)) {
      const amount = data.numUnits * data.cost;
      data = {
        ...data,
        cost: amount,
        value: amount,
        marketValue: data.cost, // Market value is the current cost of the 1 unit
        avgPricePerUnit: amount / data.numUnits, // Avg price per unit
      };

      asset = new Asset(data);
      const newAsset = await asset.save();
      const transaction = {
        userId: user.id?.toString() || '',
        assetId: newAsset._id?.toString() || '',
        type: TRANSACTION_TYPES.buy as TransactionType,
        amount,
        numUnits: data.numUnits,
        pricePerUnit: data.cost,
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

export const editAsset = async (formData: IAssetData, id: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to edit an asset');
  }

  // const assetData = {
  //   name: formData.get('asset-name'),
  //   category: formData.get('category'),
  //   value: parseFloat(formData.get('value')?.toString() || '0'),
  //   detail: formData.get('detail'),
  // };

  // try {
  //   await Asset.updateOne({ _id: id }, { $set: assetData });
  // } catch (error) {
  //   console.log(error);
  //   return new Response('Asset not updated', { status: 500 });
  // }
};
