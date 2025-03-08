'use server';

import connectDB from '@/configdatabase';
import Asset from '@/modelsAsset';
import Transaction from '@/modelsTransaction';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function addTransaction(formData: FormData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new Error('You must be logged in to add a transaction');
  }

  const asset = await Asset.findById(formData.get('asset-id'));

  const { user } = sessionUser;

  const transactionData = {
    user_id: user.id,
    asset_id: formData.get('asset-id'),
    amount: formData.get('amount'),
  };

  const newTransaction = new Transaction(transactionData);
  await newTransaction.save();

  revalidatePath('/', 'layout');
  redirect('/');
}

export default addTransaction;
