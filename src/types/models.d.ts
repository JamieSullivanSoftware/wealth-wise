declare type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';

declare type AccountType = 'Current' | 'Deposit' | 'Business' | 'Student';

declare interface ITransactionData {
  userId?: string;
  assetId?: IAsset | string;
  type?: TransactionType | string;
  amount?: number;
  numUnits?: number;
  pricePerUnit?: number;
  isFirst?: boolean;
}

declare interface ITransaction extends ITransactionData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

declare interface IAssetData {
  userId?: string;
  name?: string;
  category?: string;
  cost?: number;
  value?: number;
  marketValue?: number;
  numUnits?: number;
  avgPricePerUnit?: number;
  address?: string;
  accountType?: AccountType | string;
}

declare interface IAsset extends IAssetData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
