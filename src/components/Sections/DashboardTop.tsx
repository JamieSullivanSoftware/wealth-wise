'use client';
import { useEffect, useState } from 'react';

import CategoryChart from '../Tables/CategoryChart';
import DashboardTabButtons from './DashboardTabButtons';
import NetworthSummary from './NetworthSummary';
import NetworthTable from '../Tables/NetworthTable';
import DateFilterButtons from './DateFilterButtons';
import { getNetWorth } from '@/utils/api';
import TablesContainer from '@/components/Containers/TablesContainer';

const DashboardTopSection = () => {
  const [networth, setNetworth] = useState<INetworth | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalNetworth, setTotalNetworth] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('Chart');
  const [activeFilter, setActiveFilter] = useState<DateFilter>('week');

  const handleTabClick = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  const handleFilterClick = (filter: DateFilter) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => await getNetWorth(activeFilter);

    fetchData()
      .then((networth) => {
        const total =
          networth.results.length > 0
            ? networth.results[networth.results.length - 1].total
            : 0;
        setNetworth(networth);
        setTotalNetworth(total);
        setCategories(networth.categories);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeFilter]);

  return (
    <>
      {/* Show above 768px */}
      <div className='hidden md:grid grid-cols-12'>
        <TablesContainer classes='flex flex-col col-span-8 rounded-s-xl border-r-0 dark:bg-dark-3 p-6'>
          {networth && networth.results?.length && (
            <>
              <NetworthSummary
                diffPercentage={networth.diffPercentage}
                diffTotal={networth.diffTotal}
                totalNetworth={totalNetworth}
              />
              <DateFilterButtons
                activeFilter={activeFilter}
                handleClick={handleFilterClick}
              />
              <div className='min-h-[365px]'>
                <NetworthTable
                  isLoading={isLoading}
                  data={networth.results}
                  totalNetworth={totalNetworth}
                  activeFilter={activeFilter}
                />
              </div>
            </>
          )}
        </TablesContainer>
        <TablesContainer classes='col-span-4 rounded-e-xl dark:bg-dark-1 p-6'>
          <div className='min-h-[365px]'>
            <CategoryChart
              networthDiffTotal={networth?.diffTotal}
              categories={categories}
            />
          </div>
        </TablesContainer>
      </div>

      {/* Show below 768px */}
      <div className='grid grid-cols-12 md:hidden'>
        <TablesContainer classes='flex flex-col col-span-12 rounded-xl border-r-1 dark:bg-dark-3 p-6'>
          {networth && networth.results?.length && (
            <>
              <NetworthSummary
                diffPercentage={networth.diffPercentage}
                diffTotal={networth.diffTotal}
                totalNetworth={totalNetworth}
              />
              <DashboardTabButtons
                handleTabClick={handleTabClick}
                tabs={['Chart', 'Categories']}
                activeTab={activeTab}
              />
              {activeTab === 'Chart' && (
                <>
                  <div className='min-h-[365px]'>
                    <NetworthTable
                      isLoading={isLoading}
                      data={networth.results}
                      totalNetworth={totalNetworth}
                      activeFilter={activeFilter}
                    />
                  </div>
                  <DateFilterButtons
                    activeFilter={activeFilter}
                    handleClick={handleFilterClick}
                  />
                </>
              )}
              {activeTab === 'Categories' && (
                <CategoryChart
                  networthDiffTotal={networth.diffTotal}
                  categories={categories}
                />
              )}
            </>
          )}
        </TablesContainer>
      </div>
    </>
  );
};

export default DashboardTopSection;
