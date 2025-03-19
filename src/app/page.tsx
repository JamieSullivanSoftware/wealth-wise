import Layout from '@/components/Layout/Layout';
import DashboardContainer from '@/components/Containers/DashboardContainer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wealth Wise',
  description: 'This is Wealth Wise',
};

export default async function Home() {
  return (
    <Layout>
      <DashboardContainer />
    </Layout>
  );
}
