import type { Metadata } from 'next';

import Layout from '@/components/Layout/Layout';
import TransactionsTable from '@/components/Tables/TransactionsTable';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Transactions() {
  return (
    <Layout>
      <div className='grid grid-cols-12 mt-8 mb-22 mx-4'>
        <TransactionsTable showFullData />
      </div>
    </Layout>
  );
}
