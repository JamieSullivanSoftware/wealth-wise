'use client';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

import CategoryInfo from '../Common/CategoryInfo';
import { CATEGORIES } from '@/constants';
import { toCamelCase } from '@/utils/string';
import TableHeader from './TableHeader';

const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface Props {
  categories?: ICategory[];
  totalNetworth?: number;
}

const CategoryChart = ({ categories = [], totalNetworth = 0 }: Props) => {
  const categoryColors: ICategories = {
    accounts: '#3E76E0',
    cars: '#67bc8c',
    crypto: '#77CAF9',
    other: '#EB4B63',
    realEstate: '#B564ED',
    stocks: '#d37d4c',
  };

  const getPercentageValue = (total: number) => {
    if (totalNetworth > 0) {
      return (total / totalNetworth) * 100;
    }
    return 0;
  };

  const getPercentageString = (total: number) => {
    return `${getPercentageValue(total).toFixed(2)}%`;
  };

  const series =
    categories.length > 0
      ? categories.map((category: ICategory) => {
          return Number(getPercentageValue(category.total).toFixed(2));
        })
      : [100];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: categories.length > 0,
    },
    labels: categories.map((category: ICategory) => category.name),
    fill: {
      colors:
        categories.length > 0
          ? categories.map((category: ICategory) => {
              const key = toCamelCase(category.name) as keyof ICategories;
              return categoryColors[key];
            })
          : ['#a4a6a8'],
    },
  };

  return (
    <div className='grid grid-cols-1 gap-4 items-center justify-between'>
      <div className='hidden md:block'>
        <TableHeader title='Categories' />
      </div>
      <div className='min-h-[280px]'>
        <ApexChart
          options={options}
          series={series}
          type='donut'
          height={280}
          width={'100%'}
        />
      </div>
      <div className='grid grid-rows-auto grid-cols-3 gap-6 justify-items-center'>
        {Object.values(CATEGORIES).map((v: string, i: number) => {
          const foundCategory = categories.find((c: ICategory) => c.name === v);
          const category: ICategory = foundCategory
            ? foundCategory
            : {
                name: v,
                total: 0,
              };
          return (
            <CategoryInfo
              key={i}
              name={category.name}
              total={getPercentageString(category.total)}
              colourKey={Object.keys(categoryColors)[i]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
