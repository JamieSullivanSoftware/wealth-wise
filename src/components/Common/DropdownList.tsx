'use client';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import Icon from './Icon';
import { useState } from 'react';

interface IProps {
  heading: string;
  labels: string[];
  onClick: (label: string) => void;
}

const DropdownList = ({ heading, labels, onClick }: IProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div className='relative inline-block text-left'>
      <div>
        <button
          type='button'
          className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-transparent px-3 py-2 text-sm border border-stroke dark:border-strokedark text-black dark:text-white shadow-xs  hover:bg-gray-1 dark:hover:bg-gray-4'
          onClick={() => setIsActive((prevState: boolean) => !prevState)}
        >
          {heading}
          <Icon icon={isActive ? faAngleUp : faAngleDown} />
        </button>
      </div>

      {isActive && (
        <div
          className='absolute right-0 z-10 mt-2 w-full rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden '
          role='menu'
          tabIndex={-1}
        >
          <div>
            {labels.map((label: string, i: number) => (
              <button
                key={i}
                tabIndex={-1}
                type='button'
                onClick={() => {
                  setIsActive(false);
                  onClick(label);
                }}
                className='block w-full px-4 py-2 text-sm text-black'
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownList;
