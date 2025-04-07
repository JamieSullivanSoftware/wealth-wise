import { useSession } from 'next-auth/react';
import Button from './Button';

interface IProps {
  title: string;
  subtitle?: string;
  btnText?: string;
  onClick?: () => void;
}

const NoResults = ({ title, subtitle, btnText, onClick }: IProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = session && status === 'authenticated';

  return (
    <div className='grid grid-cols-1 gap-4 justify-items-center'>
      <div className='flex flex-col items-center gap-2'>
        <h3 className='text-lg sm:text-xl font-medium text-black dark:text-gray-1'>
          {title}
        </h3>
        {subtitle && (
          <h3 className='text-lg sm:text-base font-normal text-black dark:text-gray-1'>
            {subtitle}
          </h3>
        )}
      </div>
      {btnText && isAuthenticated && (
        <Button
          text={btnText}
          onClick={onClick}
          classes='bg-black text-white dark:text-black dark:bg-gray-100 py-2 px-4'
        />
      )}
    </div>
  );
};

export default NoResults;
