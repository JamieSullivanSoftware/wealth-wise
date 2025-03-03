import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

import Loader from '../Common/Loader';
import { getEuropeanYear, largeCurrencyFormat } from '@/utils/string';

const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface IProps {
  isLoading: boolean;
  data: INetworthResult[];
  totalNetworth: number;
  activeFilter: DateFilter;
}

const NetworthTable = ({
  isLoading,
  data,
  totalNetworth,
  activeFilter,
}: IProps) => {
  const maxValue = (totalNetworth / 100) * 10 + totalNetworth;
  const series = [
    {
      name: 'networth',
      data: data.map((item: INetworthResult) => item.total),
    },
  ];

  const getDateLabel = (date: string) => {
    const formattedDate = new Date(date.split('/').reverse().join('/'));

    switch (activeFilter) {
      case 'all':
        return Intl.DateTimeFormat('en', { year: 'numeric' }).format(
          formattedDate
        );
      case 'year':
        return `${Intl.DateTimeFormat('en', { month: 'short' }).format(formattedDate)} ${formattedDate.getFullYear().toString().substring(2)}`;
      case 'month':
        return getEuropeanYear(formattedDate);
      case 'week':
        return `${new Intl.DateTimeFormat('en', { weekday: 'short' }).format(formattedDate)} ${formattedDate.getDate()}`;
      default:
        return '';
    }
  };

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
      show: true,
    },
    labels: data
      .map((item: INetworthResult) => getDateLabel(item.date))
      .filter(Boolean) as string[],
    fill: {
      colors: ['#2CE48A'],
    },
    plotOptions: {
      bar: {
        borderRadiusApplication: 'end',
        borderRadius: 8,
        columnWidth: '35%',
        colors: {
          backgroundBarColors: ['#2CE48A'],
          backgroundBarOpacity: 0.08,
          backgroundBarRadius: 8,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: { show: false },
    },
    yaxis: {
      opposite: true,
      min: 0,
      max: maxValue,
      labels: {
        show: true,
        align: 'right',
        minWidth: 100,
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-yaxis-label',
        },
        formatter: (value: number) => largeCurrencyFormat.format(value),
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
    },
  };

  return isLoading ? (
    <Loader isTransparent />
  ) : (
    <div id='chartOne'>
      <ApexChart
        options={options}
        series={series}
        type='bar'
        height={350}
        width={'100%'}
      />
    </div>
  );
};

export default NetworthTable;
