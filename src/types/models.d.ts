declare type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';

declare type AccountType = 'Current' | 'Deposit' | 'Business' | 'Student';

declare interface ITransactionData {
  _id: string;
  userId?: string;
  assetId?: string;
  type?: TransactionType | string;
  amount?: number;
  numUnits?: number;
  pricePerUnit?: number;
  isFirst?: boolean;
}

declare interface ITransaction extends ITransactionData {
  createdAt: string;
  updatedAt: string;
}

declare interface IAssetData {
  _id: string;
  userId?: string;
  name?: string;
  category?: string;
  cost?: number;
  value?: number;
  marketValue?: number;
  numUnits?: number;
  avgPricePerUnit?: number;
  address?: string;
  details?: string;
  accountType?: AccountType | string;
}

declare interface IAsset extends IAssetData {
  createdAt: string;
  updatedAt: string;
}
