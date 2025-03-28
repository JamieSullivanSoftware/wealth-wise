declare enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  APPRECIATION = 'APPRECIATION',
  DEPRECIATION = 'DEPRECIATION',
}

declare enum AccountType {
  CURRENT = 'Current',
  DEPOSIT = 'Deposit',
  BUSINESS = 'Business',
  STUDENT = 'Student',
}

declare interface ITransactionData {
  userId?: string;
  assetId?: IAsset | string;
  type?: TransactionType | string;
  amount?: number;
  pricePerUnit?: number;
  total?: number;
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
  numUnits?: number;
  address?: string;
  accountType?: AccountType | string;
}

declare interface IAsset extends IAssetData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
