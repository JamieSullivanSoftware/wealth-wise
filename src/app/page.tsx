import Layout from '@/components/Layout/Layout';
import DashboardContainer from '@/components/Containers/DashboardContainer';
import { getAssets, getTransactions } from '@/utils/api';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Home() {
  // Wait 1 second to access local storage theme
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const transactionsData = getTransactions(5);
  const assetsData = getAssets(5);

  const [transactions, assets] = await Promise.all([
    transactionsData,
    assetsData,
  ]);

  return (
    <>
      <Layout>
        <DashboardContainer
          transactions={transactions}
          assets={assets}
        />
      </Layout>
    </>
  );
}
