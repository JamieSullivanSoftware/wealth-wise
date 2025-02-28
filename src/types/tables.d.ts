declare interface IPaginatedData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

declare interface IPaginatedAssets extends IPaginatedData {
  assets: IAssetData[];
}

declare interface IPaginatedTransactions extends IPaginatedData {
  transactions: ITransactionData[];
}

declare interface IAssetData {
  _id: string;
  updatedAt: Date;
  name: string;
  category: string;
  numShares: number;
  cost: number;
  value: number;
  diffPercentage: number;
}

declare interface ITransationAssetData {
  _id: string;
  name: string;
  category: string;
}

declare interface ITransactionData {
  _id: string;
  amount: number;
  type: TransactionType;
  updatedAt: Date;
  asset: ITransationAssetData;
  assetTotal: number;
}

declare interface ISort {
  by: AssetSortBy | TransactionSortBy;
  order: string;
}

declare type AssetSortBy =
  | 'updatedAt'
  | 'name'
  | 'category'
  | 'numShares'
  | 'cost'
  | 'value'
  | 'diffPercentage';

declare type TransactionSortBy =
  | 'updatedAt'
  | 'amount'
  | 'type'
  | 'assetName'
  | 'assetCategory'
  | 'assetTotal';
