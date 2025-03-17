import type { Metadata } from 'next';

import Layout from '@/components/Layout/Layout';
import TransactionsTable from '@/components/Tables/TransactionsTable';
import { getAssetList, getTransactions } from '@/utils/api';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Transactions() {
  const transactionsData = getTransactions();
  const assetListData = getAssetList();
  const [transactions, assetList] = await Promise.all([
    transactionsData,
    assetListData,
  ]);

  return (
    <Layout>
      <div className='grid grid-cols-12 mt-8 mb-22 mx-4'>
        <TransactionsTable
          transactions={transactions}
          showFullData
          assetList={assetList}
        />
      </div>
    </Layout>
  );
}
