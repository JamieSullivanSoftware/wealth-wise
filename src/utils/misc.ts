import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';

export const hasCategoryGotShares = (category: string): boolean => {
  return category === CATEGORIES.crypto || category === CATEGORIES.stocks;
};

export const isBuyType = (type: string): boolean => {
  return type === TRANSACTION_TYPES.buy;
};
