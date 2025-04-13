declare type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';

declare type AccountType = 'Current' | 'Deposit' | 'Business' | 'Student';

declare interface ITransactionFormData {
  _id: string;
  userId?: string;
  assetId?: string;
  type?: TransactionType | string;
  amount?: string;
  numUnits?: string;
  pricePerUnit?: string;
  isFirst?: boolean;
}

declare interface IAssetFormData {
  _id: string;
  userId?: string;
  name?: string;
  category?: string;
  cost?: string;
  value?: string;
  marketValue?: string;
  numUnits?: string;
  avgPricePerUnit?: string;
  address?: string;
  details?: string;
  accountType?: AccountType | string;
}

declare interface IAssetFormErrors {
  name?: string;
  category?: string;
  cost?: string;
  value?: string;
  marketValue?: string;
  numUnits?: string;
  accountType?: AccountType | string;
}

declare interface ITransactionFormErrors {
  assetId: '';
  type: '';
  amount: '';
  numUnits: '';
  pricePerUnit: '';
}

declare type IFormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;
