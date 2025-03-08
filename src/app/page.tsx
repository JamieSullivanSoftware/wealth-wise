import Layout from '@/components/Layout/Layout';
import DashboardContainer from '@/components/Containers/DashboardContainer';
import { getAssetList, getAssets, getTransactions } from '@/utils/api';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Home() {
  const transactionsData = getTransactions(5);
  const assetsData = getAssets(5);
  const assetListData = getAssetList();

  const [transactions, assets, assetsList] = await Promise.all([
    transactionsData,
    assetsData,
    assetListData,
  ]);

  return (
    <>
      <Layout>
        <DashboardContainer
          transactions={transactions}
          assets={assets}
          assetList={assetsList}
        />
      </Layout>
    </>
  );
}
