import { clsx } from 'clsx/lite';
import AmountIcon from './AmountIcon';

interface IProps {
  diffPercentage: number;
}

const AssetsChange = ({ diffPercentage }: IProps) => {
  const classNames = clsx(
    'rounded-md flex gap-2 items-center justify-center font-medium text-xm border bg-gray-1 border-stroke dark:border-0 p-2 min-w-18 xsm:min-w-24',
    diffPercentage > 0 &&
      'text-mid-green dark:bg-dark-green dark:text-light-green',
    diffPercentage < 0 && 'text-mid-red dark:bg-dark-red dark:text-light-red',
    diffPercentage === 0 && 'text-black dark:bg-gray-2'
  );

  return (
    <div className={classNames}>
      <span>
        <AmountIcon amount={diffPercentage} />
      </span>
      <span>{`${diffPercentage.toFixed(1)}%`}</span>
    </div>
  );
};

export default AssetsChange;
