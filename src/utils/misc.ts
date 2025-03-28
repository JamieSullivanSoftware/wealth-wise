import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';

export const isStocksOrCrypto = (category: string): boolean => {
  return category === CATEGORIES.crypto || category === CATEGORIES.stocks;
};

export const isRealEstateCarOrOther = (category: string): boolean => {
  return (
    category === CATEGORIES.realEstate ||
    category === CATEGORIES.cars ||
    category === CATEGORIES.other
  );
};

export const isAccount = (category: string): boolean => {
  return category === CATEGORIES.accounts;
};

export const isBuyType = (type: string): boolean => {
  return type === TRANSACTION_TYPES.buy;
};
