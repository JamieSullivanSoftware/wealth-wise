'use client';

import { clsx } from 'clsx/lite';

import Icon from './Icon';

import type { SizeProp } from '@fortawesome/fontawesome-svg-core';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

interface Props {
  type?: BtnType;
  onClick?: () => void;
  btnSize?: BtnSize;
  icon: IconDefinition;
  iconSize?: SizeProp;
  iconColor?: string;
  classes?: string;
  isDisabled?: boolean;
}

const Button = ({
  type = 'button',
  onClick,
  icon,
  iconSize,
  iconColor,
  classes = '',
  isDisabled = false,
}: Props) => {
  const classNames = clsx(
    'enabled:hover:bg-opacity-50 enabled:dark:hover:bg-opacity-75',
    classes,
    isDisabled && 'opacity-50 cursor-not-allowed'
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames}
      disabled={isDisabled}
    >
      <Icon
        icon={icon}
        size={iconSize}
        color={iconColor}
      />
    </button>
  );
};

export default Button;
