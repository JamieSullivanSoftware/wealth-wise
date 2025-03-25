import { CATEGORIES } from '@/constants';

export const hasCategoryGotShares = (category: string): boolean => {
  return category === CATEGORIES.crypto || category === CATEGORIES.stocks;
};
