'use server';

import connectDB from '@/configdatabase';
import Asset from '@/modelsAsset';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function addAsset(formData: FormData) {
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
    numShares: formData.get('num-shares'),
    cost: formData.get('cost'),
    value: formData.get('value'),
    detail: formData.get('detail'),
  };

  const newAsset = new Asset(assetData);
  await newAsset.save();

  revalidatePath('/', 'layout');
  redirect('/');
}

export default addAsset;
