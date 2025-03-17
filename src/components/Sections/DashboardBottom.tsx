import AssetsTable from '../Tables/AssetsTable';
import TransactionsTable from '../Tables/TransactionsTable';
interface IProps {
  transactions: IPaginatedTransactions;
  assets: IPaginatedAssets;
  assetList: IAssetListData[];
}

const DashboardBottomSection = ({
  transactions,
  assets,
  assetList,
}: IProps) => {
  return (
    <>
      {/* Show above 1024px */}
      <div className='hidden 2lg:grid grid-cols-12 gap-4'>
        <div className='col-span-8'>
          {assets.assets.length > 0 && <AssetsTable assets={assets} />}
        </div>
        <div className='col-span-4'>
          {transactions.transactions.length > 0 && (
            <TransactionsTable
              transactions={transactions}
              assetList={assetList}
            />
          )}
        </div>
      </div>

      {/* Show below 1024px */}
      {assets.assets.length > 0 && (
        <div className='grid grid-cols-12 gap-4 2lg:hidden'>
          <AssetsTable assets={assets} />
        </div>
      )}
      {transactions.transactions.length > 0 && (
        <div className='grid grid-cols-12 gap-4 2lg:hidden'>
          <TransactionsTable
            transactions={transactions}
            assetList={assetList}
          />
        </div>
      )}
    </>
  );
};

export default DashboardBottomSection;
