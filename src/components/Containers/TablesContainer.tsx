import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  classes?: string;
}

const TablesContainer = ({ children, classes = '' }: IProps) => {
  return (
    <div
      className={`grid grid-cols-1 border border-stroke bg-white shadow-default dark:border-strokedark ${classes}`}
    >
      {children}
    </div>
  );
};

export default TablesContainer;
