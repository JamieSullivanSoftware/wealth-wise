import {
  faArrowDown,
  faArrowUp,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import type { SizeProp } from '@fortawesome/fontawesome-svg-core';

import Icon from '../Common/Icon';

interface IProps {
  amount: number;
  iconSize?: SizeProp;
}

const AmountIcon = ({ amount, iconSize = 'lg' }: IProps) => {
  if (amount > 0) {
    return (
      <Icon
        icon={faArrowUp}
        size={iconSize}
      />
    );
  }
  if (amount < 0) {
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
