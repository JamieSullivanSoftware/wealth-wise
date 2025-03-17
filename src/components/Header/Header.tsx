'use client';

import { useEffect, useState } from 'react';
import DarkModeSwitcher from './DarkModeSwitcher';
import User from './User';
import HamburgerButton from './HamburgerButton';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Button from '../Common/Button';

import type { Providers } from '@/types/auth';

interface IProps {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: IProps) => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Providers>(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  return (
    <header
      className='sticky top-0 z-10
     bg-white drop-shadow-1 dark:bg-dark-3 dark:drop-shadow-none'
    >
      <div className='flex flex-grow items-center shadow-2 px-4 py-4 md:px-6 2xl:px-11'>
        <div className='flex items-center 2lg:hidden'>
          <HamburgerButton
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        <div className='flex w-full items-center justify-end gap-12 2lg:justify-between'>
          <DarkModeSwitcher />

          {session ? (
            <User session={session} />
          ) : (
            providers &&
            Object.values(providers).map((provider) => (
              <Button
                key={provider.id}
                text='Sign in'
                onClick={() => signIn(provider.id)}
              />
            ))
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
