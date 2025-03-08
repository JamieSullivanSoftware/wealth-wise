import PageHeader from '../Common/PageHeader';
import DashboardBottom from '../Sections/DashboardBottom';
import DashboardTop from '../Sections/DashboardTop';

interface IProps {
  transactions: IPaginatedTransactions;
  assets: IPaginatedAssets;
  assetList: IAssetListData[];
}

const Dashboard = ({ transactions, assets, assetList }: IProps) => {
  return (
    <>
      <PageHeader title='Dashboard' />
      <div className='grid grid-rows-auto grid-cols-1 gap-8 sm:gap-4'>
        <DashboardTop />
        <DashboardBottom
          transactions={transactions}
          assets={assets}
          assetList={assetList}
        />
      </div>
    </>
  );
};

export default Dashboard;
