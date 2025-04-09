declare type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';

declare type AccountType = 'Current' | 'Deposit' | 'Business' | 'Student';

declare interface ITransactionData {
  _id: string;
  userId?: string;
  assetId?: string;
  type?: TransactionType | string;
  amount?: string;
  numUnits?: string;
  pricePerUnit?: string;
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
  cost?: string;
  value?: string;
  marketValue?: string;
  numUnits?: string;
  avgPricePerUnit?: string;
  address?: string;
  details?: string;
  accountType?: AccountType | string;
}

declare interface IAsset extends IAssetData {
  createdAt: string;
  updatedAt: string;
}
