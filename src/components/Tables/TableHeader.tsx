'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Button from '../Common/Button';

interface Props {
  title?: string;
  btnText?: string;
}

const TableHeader = ({ title, btnText }: Props) => {
  return (
    <div className='flex justify-between items-center'>
      {title && (
        <h4 className='text-sm xsm:text-lg font-medium text-black dark:text-gray-2'>
          {title}
        </h4>
      )}
      {btnText && (
        <Button
          text={btnText}
          onClick={() => {
            console.log('Add');
          }}
          icon={faPlus}
          iconSize='lg'
        />
      )}
    </div>
  );
};

export default TableHeader;
