declare type TransactionType = 'Buy' | 'Sell';

declare interface ITransaction {
  _id: string;
  type: TransactionType;
  user_id: string;
  asset_id: IAsset;
  amount: number;
  createdAt: string;
  updateAt: string;
}

declare interface IAsset {
  _id: string;
  user_id: string;
  category: string;
  name: string;
  cost: number;
  value: number;
  numShares: number;
  createdAt: string;
  updatedAt: string;
}
