'use client';
import { useState } from 'react';

import PageHeader from '../Common/PageHeader';
import DashboardBottom from '../Sections/DashboardBottom';
import DashboardTop from '../Sections/DashboardTop';

const Dashboard = () => {
  const [shouldRefetchNetworth, setShouldRefetchNetworth] =
    useState<boolean>(true);

  return (
    <>
      <PageHeader title='Dashboard' />
      <div className='grid grid-rows-auto grid-cols-1 gap-8 sm:gap-4'>
        <DashboardTop
          shouldRefetchNetworth={shouldRefetchNetworth}
          setShouldRefetchNetworth={(loading: boolean) => {
            setShouldRefetchNetworth(loading);
          }}
        />
        <DashboardBottom
          shouldRefetchNetworth={shouldRefetchNetworth}
          setShouldRefetchNetworth={(loading: boolean) => {
            setShouldRefetchNetworth(loading);
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
