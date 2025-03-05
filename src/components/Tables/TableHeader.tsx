'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Button from '../Common/Button';

interface Props {
  title?: string;
  btnText?: string;
  onBtnClick?: () => void;
}

const TableHeader = ({ title, btnText, onBtnClick }: Props) => {
  return (
    <div className='flex justify-between items-center'>
      {title && (
        <h4 className='text-sm xsm:text-lg font-medium text-black dark:text-gray-2'>
          {title}
        </h4>
      )}
      {btnText && onBtnClick && (
        <Button
          text={btnText}
          onClick={onBtnClick}
          icon={faPlus}
          iconSize='lg'
        />
      )}
    </div>
  );
};

export default TableHeader;
