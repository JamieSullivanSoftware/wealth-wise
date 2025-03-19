import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  classes?: string;
}

const TablesContainer = ({ children, classes = '' }: IProps) => {
  return (
    <div
      className={`grid grid-cols-1 px-4 py-6 sm:px-6 sm:py-8 border border-stroke bg-white shadow-default dark:border-strokedark ${classes}`}
    >
      {children}
    </div>
  );
};

export default TablesContainer;
