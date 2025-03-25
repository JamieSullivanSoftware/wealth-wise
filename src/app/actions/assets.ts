'use server';

import connectDB from '@/configdatabase';
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
    numShares: parseFloat(formData.get('numShares')?.toString() || '0'),
    cost: parseFloat(formData.get('cost')?.toString() || '0'),
    value: parseFloat(formData.get('value')?.toString() || '0'),
    detail: formData.get('detail'),
  };

  try {
    const newAsset = new Asset(assetData);
    await newAsset.save();
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
