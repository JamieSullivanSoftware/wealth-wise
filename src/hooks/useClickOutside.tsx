import { RefObject, useEffect } from 'react';

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent) => void
): void {
  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      if (!ref?.current || ref?.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, [ref?.current]);
}

export default useOnClickOutside;
