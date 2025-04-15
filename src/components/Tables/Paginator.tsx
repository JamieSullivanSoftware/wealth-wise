import { clsx } from 'clsx/lite';

import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Icon from '../Common/Icon';
import DropdownList from '../Common/DropdownList';

interface IProps {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (limit: string) => void;
}

const Paginator = ({
  totalCount,
  totalPages,
  currentPage,
  limit,
  onPageChange,
  onLimitChange,
}: IProps) => {
  const baseClasses = clsx(
    'relative hidden items-center px-4 py-2 text-sm border border-stroke  dark:border-strokedark focus:z-20 focus:outline-offset-0 md:inline-flex'
  );
  const textClasses = clsx(
    'bg-white text-black dark:bg-transparent dark:text-white'
  );
  const hoverClasses = clsx('hover:bg-gray-1 dark:hover:bg-gray-4');

  const maxVisible = 5;
  const jumpAmount = 3;

  const getPageNumbers = () => {
    let pages = [];
    if (totalPages <= maxVisible) {
      pages = Array.from(
        { length: totalPages },
        (v: undefined, i: number) => i + 1
      );
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        ];
      }
    }
    return pages;
  };

  const ShowResults = () => (
    <div>
      <p className='text-xs xsm:text-sm text-black dark:text-white'>
        {`Showing ${currentPage === 1 ? 1 : (currentPage - 1) * limit} to ${currentPage * limit} of ${totalCount} results`}
      </p>
    </div>
  );

  return (
    <div className='flex items-center justify-between text-white px-2'>
      {/* md - below 768px */}
      <div className='flex flex-col flex-1 items-center justify-center md:hidden'>
        <div className='flex flex-1 justify-between items-center w-full mb-6'>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`rounded-md border border-stroke  dark:border-strokedark focus:z-20 focus:outline-offset-0  px-3.5 py-1.5 ${currentPage > 1 ? `${textClasses} ${hoverClasses}` : 'text-gray-3 dark:text-gray-4 cursor-default'}`}
          >
            <Icon icon={faAngleLeft} />
          </button>
          <DropdownList
            heading={`Show ${limit}`}
            labels={['5', '10', '20']}
            onClick={onLimitChange}
          />
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`rounded-md border border-stroke  dark:border-strokedark focus:z-20 focus:outline-offset-0  px-3.5 py-1.5 ${currentPage < totalPages ? `${textClasses} ${hoverClasses}` : 'text-gray-3 dark:text-gray-4 cursor-default'}`}
          >
            <Icon icon={faAngleRight} />
          </button>
        </div>
        <ShowResults />
      </div>
      {/* md - above 768px */}
      <div className='hidden md:flex md:flex-1 sm:items-center md:justify-between'>
        <ShowResults />
        <div className='flex justify-between items-center gap-4'>
          <DropdownList
            heading={`Show ${limit} results`}
            labels={['5', '10', '20']}
            onClick={onLimitChange}
          />
          <nav
            className='inline-flex -space-x-px rounded-md shadow-xs'
            aria-label='Pagination'
          >
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className={`rounded-l-md ${baseClasses} ${currentPage > 1 ? `${textClasses} ${hoverClasses}` : 'text-gray-3 dark:text-gray-4 cursor-default'}`}
            >
              <Icon icon={faAngleLeft} />
            </button>

            {getPageNumbers().map((page: string | number, i: number) => {
              return page === '...' ? (
                <button
                  key={i}
                  onClick={() =>
                    onPageChange(
                      i === 1
                        ? currentPage - jumpAmount
                        : currentPage + jumpAmount
                    )
                  }
                  className={`${baseClasses} ${textClasses} ${hoverClasses}`}
                >
                  ...
                </button>
              ) : (
                <button
                  key={i}
                  disabled={currentPage === page}
                  onClick={() => onPageChange(Number(page))}
                  className={`${currentPage === page ? 'bg-primary text-white dark:bg-white dark:text-black cursor-default' : `${textClasses} ${hoverClasses}`} ${baseClasses}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className={`rounded-r-md ${baseClasses} ${currentPage < totalPages ? `${textClasses} ${hoverClasses}` : 'text-gray-4 cursor-default'}`}
            >
              <Icon icon={faAngleRight} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Paginator;
