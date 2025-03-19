declare type DashboardTab = 'Chart' | 'Categories';

declare type DateFilter = 'week' | 'month' | 'year' | 'all' | string | null;

declare interface ILink {
  href: string;
  text: string;
}
