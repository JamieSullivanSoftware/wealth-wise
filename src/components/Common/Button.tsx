'use client';

import { clsx } from 'clsx/lite';

import Icon from './Icon';

import type { SizeProp } from '@fortawesome/fontawesome-svg-core';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

interface Props {
  text: string;
  type?: BtnType;
  onClick?: () => void;
  btnSize?: BtnSize;
  icon?: IconDefinition;
  iconSize?: SizeProp;
  iconColor?: string;
  iconAlign?: BtnIconAlign;
  hasBg?: boolean;
  isPrimary?: boolean;
  classes?: string;
  isDisabled?: boolean;
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
  isPrimary,
  classes = '',
  isDisabled = false,
}: Props) => {
  const classNames = clsx(
    'rounded-md font-medium py-2 px-4',
    hasBg
      ? isPrimary
        ? 'text-white bg-primary enabled:hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-dark'
        : 'enabled:hover:bg-opacity-50 enabled:dark:hover:bg-opacity-75'
      : 'bg-transparent',
    btnSize === 'sm' && 'text-sm',
    btnSize === 'md' && 'text-base',
    btnSize === 'lg' && 'text-lg',
    icon && 'flex gap-2 justify-between items-center',
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
