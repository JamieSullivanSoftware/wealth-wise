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
  createdAt: Date;
  name: string;
  category: string;
  numShares: number;
  cost: number;
  value: number;
  numShares: number;
  detail: string;
  diffPercentage: number;
}

declare interface IAssetListData {
  _id: string;
  name: string;
  category: string;
}

declare interface ITransactionAssetData {
  _id: string;
  name: string;
  category: string;
}

declare interface ITransactionData {
  _id: string;
  amount: number;
  type: TransactionType;
  createdAt: Date;
  asset: ITransactionAssetData;
  numShares: number;
  isFirst: boolean;
}

declare interface ISort {
  by: AssetSortBy | TransactionSortBy;
  order: string;
}

declare type AssetSortBy =
  | 'createdAt'
  | 'name'
  | 'category'
  | 'numShares'
  | 'cost'
  | 'value'
  | 'diffPercentage';

declare type TransactionSortBy =
  | 'createdAt'
  | 'amount'
  | 'type'
  | 'assetName'
  | 'assetCategory';
