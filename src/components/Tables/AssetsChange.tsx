import { clsx } from 'clsx/lite';
import AmountIcon from './AmountIcon';

interface IProps {
  gainsLossPercentage: number;
}

const AssetsChange = ({ gainsLossPercentage }: IProps) => {
  const classNames = clsx(
    'rounded-md flex gap-2 items-center justify-center font-medium text-xm border bg-gray-1 border-stroke dark:border-0 p-2 min-w-18 xsm:min-w-24',
    gainsLossPercentage > 0 &&
      'text-mid-green dark:bg-dark-green dark:text-light-green',
    gainsLossPercentage < 0 &&
      'text-mid-red dark:bg-dark-red dark:text-light-red',
    gainsLossPercentage === 0 && 'text-black dark:bg-gray-2'
  );

  return (
    <div className={classNames}>
      <span>
        <AmountIcon amount={gainsLossPercentage} />
      </span>
      <span>{`${gainsLossPercentage.toFixed(1)}%`}</span>
    </div>
  );
};

export default AssetsChange;
