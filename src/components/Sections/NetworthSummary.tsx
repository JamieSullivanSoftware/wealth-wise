import {
  faArrowDown,
  faArrowUp,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

import Icon from '../Common/Icon';
import { currencyFormat } from '@/utils/string';

interface IProps {
  diffPercentage?: number;
  diffTotal: number;
  totalNetworth: number;
}

const NetworthSummary = ({
  diffPercentage,
  diffTotal,
  totalNetworth,
}: IProps) => {
  const getIcon = (total: number) => {
    if (total < 0) {
      return faArrowDown;
    }
    if (total > 0) {
      return faArrowUp;
    }
    return faMinus;
  };

  return (
    <>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-start sm:justify-between'>
        <h3 className='text-xl font-medium text-black dark:text-gray-3'>
          Total Net Worth
        </h3>
        <div
          className={`py-2 px-4 rounded-md flex items-center justify-center text-md font-medium border border-stroke dark:border-0 ${diffTotal > 0 && 'bg-gray-1 text-mid-green dark:bg-dark-green dark:text-light-green'} ${diffTotal < 0 && 'dark:bg-dark-red dark:text-light-red'} ${diffTotal === 0 && 'bg-gray-1 text-black '}`}
        >
          <Icon
            icon={getIcon(diffTotal)}
            size='lg'
          />
          <span className='ml-4'>{currencyFormat.format(diffTotal)}</span>
          {diffPercentage && <span className='ml-4'>({diffPercentage}%)</span>}
        </div>
      </div>
      <h4 className='text-5xl font-medium text-black dark:text-white mt-4 mb-6'>
        {currencyFormat.format(totalNetworth)}
      </h4>
    </>
  );
};

export default NetworthSummary;
