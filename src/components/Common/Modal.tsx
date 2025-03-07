interface IProps {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  heading: string;
}

const Modal = ({ children, show, onClose, heading }: IProps) => {
  return (
    <div
      className={`${show ? 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20' : 'hidden'}`}
    >
      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-700'>
        <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 w-96'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {heading}
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
          >
            <svg
              className='w-3 h-3'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 14'
            >
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
              />
            </svg>
            <span className='sr-only'>Close modal</span>
          </button>
        </div>

        <div className='p-4 md:p-5'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
