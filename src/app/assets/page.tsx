import type { Metadata } from 'next';

import Layout from '@/components/Layout/Layout';
import AssetsTable from '@/components/Tables/AssetsTable';
import { getAssets } from '@/utils/api';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Assets() {
  const assets = await getAssets();

  return (
    <Layout>
      <div className='grid grid-cols-12 mt-8 mb-22 mx-4'>
        <AssetsTable
          assets={assets}
          showFullData
        />
      </div>
    </Layout>
  );
}
