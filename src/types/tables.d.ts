declare interface IPaginatedData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

declare interface IPaginatedAssets extends IPaginatedData {
  assets: IAssetTableData[];
}

declare interface IPaginatedTransactions extends IPaginatedData {
  transactions: ITransactionTableData[];
}

declare interface IAssetTableData {
  _id: string;
  createdAt: Date;
  name: string;
  category: string;
  cost: number;
  value: number;
  numUnits?: number;
  avgPricePerUnit?: number;
  address?: string;
  accountType?: string;
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

declare interface ITransactionTableData {
  _id: string;
  amount: number;
  type: TransactionType;
  createdAt: Date;
  asset: ITransactionAssetData;
  numShares: number;
  pricePerShare: number;
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
