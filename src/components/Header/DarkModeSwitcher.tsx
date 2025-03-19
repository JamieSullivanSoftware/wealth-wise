import { useEffect, useState } from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import useColorMode from '@/hooks/useColorMode';
import Icon from '../Common/Icon';

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(colorMode === 'dark');
  }, [colorMode]);

  return (
    <label
      className={`relative hidden m-0 sm:block h-7.5 w-14 rounded-full ${
        isDarkMode ? 'bg-primary' : 'bg-stroke'
      }`}
    >
      <input
        type='checkbox'
        onChange={() => {
          if (typeof setColorMode === 'function') {
            setColorMode(colorMode === 'light' ? 'dark' : 'light');
          }
        }}
        className='dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0'
      />
      <span
        className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
          isDarkMode && '!right-[3px] !translate-x-full'
        }`}
      >
        <span>
          {isDarkMode ? <Icon icon={faMoon} /> : <Icon icon={faSun} />}
        </span>
      </span>
    </label>
  );
};

export default DarkModeSwitcher;
