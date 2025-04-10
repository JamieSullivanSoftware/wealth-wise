import AssetsTable from '../Tables/AssetsTable';
import TransactionsTable from '../Tables/TransactionsTable';

interface IProps {
  setShouldRefetchNetworth?: (loading: boolean) => void;
}

const DashboardBottomSection = ({ setShouldRefetchNetworth }: IProps) => {
  return (
    <>
      {/* Show above 1024px */}
      <div className='hidden 2lg:grid grid-cols-12 gap-4'>
        <div className='col-span-8'>
          <AssetsTable setShouldRefetchNetworth={setShouldRefetchNetworth} />
        </div>
        <div className='col-span-4'>
          <TransactionsTable
            setShouldRefetchNetworth={setShouldRefetchNetworth}
          />
        </div>
      </div>

      {/* Show below 1024px */}
      <div className='grid grid-cols-12 gap-4 2lg:hidden'>
        <AssetsTable setShouldRefetchNetworth={setShouldRefetchNetworth} />
      </div>
      <div className='grid grid-cols-12 gap-4 2lg:hidden'>
        <TransactionsTable
          setShouldRefetchNetworth={setShouldRefetchNetworth}
        />
      </div>
    </>
  );
};

export default DashboardBottomSection;
