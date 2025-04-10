'use client';

import { ReactNode, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

interface IProps {
  children: ReactNode;
}

const Layout = ({ children }: IProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className='flex'>
        <Sidebar sidebarOpen={sidebarOpen} />
        <div className='relative flex flex-1 flex-col 2lg:ml-72.5'>
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main>
            <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 min-h-dvh'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
