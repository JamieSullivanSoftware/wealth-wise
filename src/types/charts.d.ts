declare interface ICategories {
  accounts: string;
  stocks: string;
  crypto: string;
  realEstate: string;
  cars: string;
  other: string;
}

declare interface ICategory {
  name: string;
  total: number;
}

declare interface INetworthResult {
  date: string;
  total: number;
}

declare interface INetworth {
  diffPercentage?: number;
  diffTotal: number;
  results: INetworthResult[];
}
