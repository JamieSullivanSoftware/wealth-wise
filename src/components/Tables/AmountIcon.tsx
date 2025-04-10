import {
  faArrowDown,
  faArrowUp,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import type { SizeProp } from '@fortawesome/fontawesome-svg-core';

import Icon from '../Common/Icon';

interface IProps {
  amount?: number;
  isPositive?: boolean;
  isNegative?: boolean;
  iconSize?: SizeProp;
}

const AmountIcon = ({
  amount,
  isPositive,
  isNegative,
  iconSize = 'lg',
}: IProps) => {
  if ((amount && amount > 0) || isPositive) {
    return (
      <Icon
        icon={faArrowUp}
        size={iconSize}
      />
    );
  }
  if ((amount && amount < 0) || isNegative) {
    return (
      <Icon
        icon={faArrowDown}
        size={iconSize}
      />
    );
  }
  return (
    <Icon
      icon={faMinus}
      size={iconSize}
    />
  );
};

export default AmountIcon;
