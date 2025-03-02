'use client';

import { useEffect, useState } from 'react';

import CategoryChart from '../Tables/CategoryChart';
import DashboardTabButtons from './DashboardTabButtons';
import NetworthSummary from './NetworthSummary';
import NetworthTable from '../Tables/NetworthTable';
import DateFilterButtons from './DateFilterButtons';
import { getNetWorth } from '@/utils/api';
import TablesContainer from '@/components/Containers/TablesContainer';
import NoResults from '../Common/NoResults';

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
    const fetchData = async () => await getNetWorth(activeFilter);
    setLoading(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  return (
    <>
      {/* Show above 768px */}
      <div className='hidden md:grid grid-cols-12'>
        <TablesContainer classes='flex flex-col col-span-8 rounded-s-xl border-r-0 dark:bg-dark-3'>
          {networth && networth.results?.length ? (
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
          ) : (
            <div className='flex flex-col justify-center min-h-[365px]'>
              <NoResults
                text='No Results Available'
                btnText='Add Data'
              />
            </div>
          )}
        </TablesContainer>
        <TablesContainer classes='col-span-4 rounded-e-xl dark:bg-dark-1 '>
          <div className='min-h-[365px]'>
            <CategoryChart
              totalNetworth={networth?.diffTotal}
              categories={categories}
            />
          </div>
        </TablesContainer>
      </div>

      {/* Show below 768px */}
      <div className='grid grid-cols-12 md:hidden'>
        <TablesContainer classes='flex flex-col col-span-12 rounded-xl border-r-1 dark:bg-dark-3 '>
          {networth && networth.results?.length ? (
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
                  totalNetworth={networth.diffTotal}
                  categories={categories}
                />
              )}
            </>
          ) : (
            <div className='flex flex-col justify-center min-h-[365px]'>
              <NoResults
                text='No Results Available'
                btnText='Add Data'
              />
            </div>
          )}
        </TablesContainer>
      </div>
    </>
  );
};

export default DashboardTopSection;
