'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

import Button from '../Common/Button';

interface Props {
  title?: string;
  btnText?: string;
  onBtnClick?: () => void;
}

const TableHeader = ({ title, btnText, onBtnClick }: Props) => {
  const { data: session, status } = useSession();
  const isAuthenticated = session && status === 'authenticated';

  return (
    <div className='flex justify-between items-center'>
      {title && (
        <h4 className='text-sm xsm:text-lg font-medium text-black dark:text-gray-2'>
          {title}
        </h4>
      )}
      {btnText && onBtnClick && isAuthenticated && (
        <Button
          text={btnText}
          onClick={onBtnClick}
          icon={faPlus}
          iconSize='lg'
          classes='bg-black text-white dark:text-black dark:bg-gray-100'
        />
      )}
    </div>
  );
};

export default TableHeader;
