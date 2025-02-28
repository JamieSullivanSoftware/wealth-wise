import {
  faArrowDown,
  faArrowUp,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx/lite';
import Icon from '../Common/Icon';

interface IProps {
  diffPercentage: number;
}

const AssetsChange = ({ diffPercentage }: IProps) => {
  const classNames = clsx(
    'rounded-md flex gap-2 items-center justify-center font-medium text-xm border bg-gray-1 border-stroke dark:border-0 p-2 min-w-24',
    diffPercentage > 0 &&
      'text-mid-green dark:bg-dark-green dark:text-light-green',
    diffPercentage < 0 && 'text-mid-red dark:bg-dark-red dark:text-light-red',
    diffPercentage === 0 && 'text-black dark:bg-gray-2 dark:text-black'
  );

  const ChangeIcon = () => {
    if (diffPercentage > 0) {
      return (
        <Icon
          icon={faArrowUp}
          size='lg'
        />
      );
    }
    if (diffPercentage < 0) {
      return (
        <Icon
          icon={faArrowDown}
          size='lg'
        />
      );
    }
    return (
      <Icon
        icon={faMinus}
        size='lg'
      />
    );
  };

  return (
    <div className={classNames}>
      <span>
        <ChangeIcon />
      </span>
      <span>{`${diffPercentage.toFixed(1)}%`}</span>
    </div>
  );
};

export default AssetsChange;
