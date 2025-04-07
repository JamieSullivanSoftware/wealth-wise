import AssetsTable from '../Tables/AssetsTable';
import TransactionsTable from '../Tables/TransactionsTable';

const DashboardBottomSection = () => {
  return (
    <>
      {/* Show above 1024px */}
      <div className='hidden 2lg:grid grid-cols-12 gap-4'>
        <div className='col-span-8'>
          <AssetsTable />
        </div>
        <div className='col-span-4'>
          <TransactionsTable />
        </div>
      </div>

      {/* Show below 1024px */}
      <div className='grid grid-cols-12 gap-4 2lg:hidden'>
        <AssetsTable />
      </div>
      <div className='grid grid-cols-12 gap-4 2lg:hidden'>
        <TransactionsTable />
      </div>
    </>
  );
};

export default DashboardBottomSection;
