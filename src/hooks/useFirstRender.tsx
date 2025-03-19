import { useRef } from 'react';

export const useFirstRender = () => {
  const ref = useRef(true);
  const isFirstRender = ref.current;
  ref.current = false;
  return isFirstRender;
};
