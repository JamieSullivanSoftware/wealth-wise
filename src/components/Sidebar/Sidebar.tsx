import Link from 'next/link';
import Image from 'next/image';

import useLocalStorage from '@/hooks/useLocalStorage';
import { MENU_ITEMS } from '@/constants';
import SidebarItem from './SidebarItem';
import { IMenuItem } from '@/types/menu';
import { signOut, useSession } from 'next-auth/react';

interface ISidebarProps {
  sidebarOpen: boolean;
}

const Sidebar = ({ sidebarOpen }: ISidebarProps) => {
  const { data: session } = useSession();
  const [pageName, setPageName] = useLocalStorage('selectedMenu', 'dashboard');

  return (
    <aside
      className={`fixed left-0 top-0 z-10 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-dark-3  2lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex items-center pl-8 pt-4'>
        <Link href='/'>
          <Image
            width={176}
            height={32}
            src={'/images/logo/logo.svg'}
            alt='Logo'
            priority
          />
        </Link>
      </div>
      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear mt-4'>
        <nav className='px-4 py-4 2lg:px-6'>
          <ul className='flex flex-col gap-1.5'>
            {MENU_ITEMS.map((item: IMenuItem, i: number) => {
              if (item.route === '/logout') {
                return session ? (
                  <SidebarItem
                    key={i}
                    item={item}
                    onClick={signOut}
                  />
                ) : null;
              }

              return (
                <SidebarItem
                  key={i}
                  item={item}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
