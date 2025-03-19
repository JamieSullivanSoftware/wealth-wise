'use client';

import { clsx } from 'clsx/lite';

import Icon from './Icon';

import type { SizeProp } from '@fortawesome/fontawesome-svg-core';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

interface Props {
  text: string;
  type?: BtnType;
  onClick: () => void;
  btnSize?: BtnSize;
  icon?: IconDefinition;
  iconSize?: SizeProp;
  iconColor?: string;
  iconAlign?: BtnIconAlign;
  hasBg?: boolean;
  classes?: string;
}

const Button = ({
  text,
  type = 'button',
  onClick,
  btnSize = 'md',
  icon,
  iconSize,
  iconAlign,
  hasBg = true,
  classes = '',
}: Props) => {
  const classNames = clsx(
    'rounded-md font-medium',
    hasBg
      ? 'bg-black text-white hover:bg-opacity-50 dark:text-black dark:bg-gray-1 dark:hover:bg-opacity-75 py-2 px-4'
      : 'bg-transparent',
    btnSize === 'sm' && 'text-sm',
    btnSize === 'md' && 'text-base',
    btnSize === 'lg' && 'text-lg',
    icon && 'flex gap-2 justify-between items-center',
    classes
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames}
    >
      {icon && iconAlign !== 'right' && (
        <Icon
          icon={icon}
          size={iconSize}
        />
      )}
      {text}
      {icon && iconAlign === 'right' && (
        <Icon
          icon={icon}
          size={iconSize}
        />
      )}
    </button>
  );
};

export default Button;
