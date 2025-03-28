'use server';

import connectDB from '@/configdatabase';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Asset from '@/modelsAsset';
import Transaction from '@/modelsTransaction';
import { getSessionUser } from '@/utils/getSessionUser';

export const addAsset = async (assetData: IAssetData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add an asset');
  }

  const { user } = sessionUser;

  const data = {
    userId: user.id,
    name: assetData.name || '',
    category: assetData.category || '',
    numUnits: parseFloat(assetData.numUnits?.toString() || '0'),
    cost: parseFloat(assetData.cost?.toString() || '0'),
    value: parseFloat(assetData.value?.toString() || '0'),
    address: assetData.address || '',
    accountType: assetData.accountType || '',
  };

  try {
    const asset = new Asset(data);
    const newAsset = await asset.save();

    let transaction: ITransactionData = {
      userId: user.id?.toString() || '',
      assetId: newAsset._id?.toString() || '',
      type: TRANSACTION_TYPES.deposit as TransactionType,
      isFirst: true,
      amount: data.value,
      pricePerUnit: 0,
      total: data.value,
    };

    switch (data.category) {
      case CATEGORIES.cars:
      case CATEGORIES.realEstate:
      case CATEGORIES.other:
        const isAppreciation = data.value > data.cost;
        const type = isAppreciation
          ? TRANSACTION_TYPES.appreciation
          : TRANSACTION_TYPES.depreciation;
        transaction = {
          ...transaction,
          type: type as TransactionType,
          amount: data.value - data.cost,
          total: data.cost,
        };
        break;
      case CATEGORIES.crypto:
      case CATEGORIES.stocks:
        transaction = {
          ...transaction,
          type: TRANSACTION_TYPES.buy as TransactionType,
          amount: data.numUnits,
          pricePerUnit: data.cost,
          total: data.numUnits * data.cost,
        };
        break;
      default:
        break;
    }

    await new Transaction(transaction).save();
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
