import AssetsTable from '../Tables/AssetsTable';
import TransactionsTable from '../Tables/TransactionsTable';
import TablesContainer from '@/components/Containers/TablesContainer';

interface IProps {
  transactions: IPaginatedTransactions;
  assets: IPaginatedAssets;
}

const DashboardBottomSection = ({ transactions, assets }: IProps) => {
  return (
    <>
      {/* Show above 1024px */}
      <div className='hidden 2lg:grid grid-cols-12 gap-4'>
        {assets.assets.length > 0 && (
          <TablesContainer classes='gap-8 col-span-8 rounded-xl dark:bg-dark-4'>
            <AssetsTable assets={assets} />
          </TablesContainer>
        )}
        {transactions.transactions.length > 0 && (
          <TablesContainer classes='gap-8 col-span-4 rounded-xl dark:bg-dark-4'>
            <TransactionsTable transactions={transactions} />
          </TablesContainer>
        )}
      </div>

      {/* Show below 1024px */}
      {assets.assets.length > 0 && (
        <div className='grid grid-cols-12 gap-4 2lg:hidden'>
          <TablesContainer classes='col-span-12 rounded-xl dark:bg-dark-4'>
            <AssetsTable assets={assets} />
          </TablesContainer>
        </div>
      )}
      {transactions.transactions.length > 0 && (
        <div className='grid grid-cols-12 gap-4 2lg:hidden'>
          <TablesContainer classes='col-span-12 rounded-xl dark:bg-dark-4'>
            <TransactionsTable transactions={transactions} />
          </TablesContainer>
        </div>
      )}
    </>
  );
};

export default DashboardBottomSection;
