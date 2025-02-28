import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx/lite';

import Icon from '../Common/Icon';
import { currencyFormat } from '@/utils/string';
import AmountIcon from './AmountIcon';

interface IProps {
  amount: number;
  assetName?: string;
  isFullTable?: boolean;
}

const TransactionAmountInfo = ({ amount, assetName, isFullTable }: IProps) => {
  const iconClassNames = clsx(
    'rounded-md flex items-center justify-center text-xl border border-stroke bg-gray-1 dark:border-0',
    amount > 0 && 'text-mid-green dark:bg-dark-green dark:text-light-green',
    amount < 0 && 'text-mid-red dark:bg-dark-red dark:text-light-red',
    amount === 0 && 'text-black dark:bg-gray-2',
    isFullTable ? 'h-10 min-w-10' : 'h-10 min-w-10 2lg:h-12 2lg:min-w-12'
  );
  const fontClassNames = clsx(
    'font-medium',
    amount > 0 && 'text-mid-green dark:text-light-green',
    amount < 0 && 'text-mid-red dark:text-light-red',
    amount === 0 && 'text-black dark:text-white'
  );

  return (
    <>
      <div className='col-span-3 2xsm:col-span-2 xsm:col-span-1 flex items-center 2lg:col-span-3 2lg:justify-start'>
        {
          <div className={iconClassNames}>
            <span className='hidden xsm:flex 2lg:hidden'>
              <AmountIcon amount={amount} />
            </span>
            <span className='flex xsm:hidden 2lg:flex'>
              <AmountIcon
                amount={amount}
                iconSize={isFullTable ? 'sm' : 'lg'}
              />
            </span>
          </div>
        }
      </div>
      <div className='gap-1 text-xs col-span-7 2xsm:col-span-8 xsm:col-start-2 xsm:col-span-2 flex flex-col xsm:flex-row justify-center xsm:text-sm xsm:items-center xsm:justify-start 2lg:col-span-6 2lg:flex-col 2lg:items-start'>
        <span className={fontClassNames}>{currencyFormat.format(amount)}</span>
        {assetName && (
          <span className='flex xsm:hidden col-span-3 2lg:flex'>
            {assetName}
          </span>
        )}
      </div>
    </>
  );
};

export default TransactionAmountInfo;
