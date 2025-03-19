import type { Metadata } from 'next';

import Layout from '@/components/Layout/Layout';
import TablesContainer from '@/components/Containers/TablesContainer';
import TransactionsTable from '@/components/Tables/TransactionsTable';
import { getTransactions } from '@/utils/api';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Transactions() {
  const transactions = await getTransactions();

  return (
    <Layout>
      <div className='grid grid-cols-12 mt-8 mb-22 mx-4'>
        <TablesContainer classes='gap-6 col-span-12 rounded-xl dark:bg-dark-4'>
          <TransactionsTable
            transactions={transactions}
            showFullData
          />
        </TablesContainer>
      </div>
    </Layout>
  );
}
