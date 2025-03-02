'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DarkModeSwitcher from './DarkModeSwitcher';
import User from './User';
import HamburgerButton from './HamburgerButton';
import { getProviders, signIn, useSession } from 'next-auth/react';
import ProfileImage from './ProfileImage';
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
    <header className='sticky top-0 z-999 bg-white drop-shadow-1 dark:bg-dark-3 dark:drop-shadow-none'>
      <div className='flex flex-grow items-center shadow-2 px-4 py-4 md:px-6 2xl:px-11'>
        <div className='flex items-center justify-between w-full 2lg:hidden'>
          <HamburgerButton
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Link
            className='text-md font-medium rounded-md bg-black text-white hover:bg-opacity-50 dark:text-black dark:bg-gray-1 dark:hover:bg-opacity-75'
            href='/'
          >
            {session?.user?.image && (
              <ProfileImage imgUrl={session.user.image} />
            )}
          </Link>
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
