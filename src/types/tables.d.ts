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
  marketValue?: number;
  numUnits?: number;
  avgPricePerUnit?: number;
  address?: string;
  accountType?: string;
  details?: string;
  gainsLossPercentage: number;
  totalCostBasis?: number;
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
  asset: ITransactionAssetData;
  amount: number;
  type: TransactionType;
  numUnits: number;
  pricePerUnit: number;
  isFirst: boolean;
  createdAt: Date;
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
  | 'gainsLossPercentage';

declare type TransactionSortBy =
  | 'createdAt'
  | 'amount'
  | 'type'
  | 'assetName'
  | 'assetCategory';
