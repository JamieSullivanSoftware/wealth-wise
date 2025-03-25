'use server';

import connectDB from '@/configdatabase';
import { TRANSACTION_TYPES } from '@/constants';
import Asset from '@/modelsAsset';
import Transaction from '@/modelsTransaction';
import { getSessionUser } from '@/utils/getSessionUser';

export const addAsset = async (formData: FormData) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add an asset');
  }

  const { user } = sessionUser;

  const assetData = {
    user_id: user.id,
    name: formData.get('asset-name'),
    category: formData.get('category'),
    numShares: parseFloat(formData.get('num-shares')?.toString() || '0'),
    cost: parseFloat(formData.get('cost')?.toString() || '0'),
    value: parseFloat(formData.get('value')?.toString() || '0'),
    detail: formData.get('detail'),
  };

  try {
    const asset = new Asset(assetData);
    const newAsset = await asset.save();

    const transaction = {
      user_id: user.id,
      asset_id: newAsset._id,
      amount: assetData.cost,
      type: TRANSACTION_TYPES.buy,
      updatedAssetCost: assetData.cost,
      numShares: assetData.numShares,
      isFirst: true,
    };
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
      asset_id: id,
    });
    const deleteAsset = await Asset.deleteOne({ _id: id });

    await Promise.all([deleteAsset, deleteTransactions]);
  } catch (error) {
    console.log(error);
    return new Response('Assets not deleted', { status: 500 });
  }
};

export const editAsset = async (formData: FormData, id: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to edit an asset');
  }

  const assetData = {
    name: formData.get('asset-name'),
    category: formData.get('category'),
    value: parseFloat(formData.get('value')?.toString() || '0'),
    detail: formData.get('detail'),
  };

  try {
    await Asset.updateOne({ _id: id }, { $set: assetData });
  } catch (error) {
    console.log(error);
    return new Response('Asset not updated', { status: 500 });
  }
};
