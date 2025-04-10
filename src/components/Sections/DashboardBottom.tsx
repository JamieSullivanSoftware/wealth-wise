import AssetsTable from '../Tables/AssetsTable';
import TransactionsTable from '../Tables/TransactionsTable';

interface IProps {
  shouldRefetchNetworth: boolean;
  setShouldRefetchNetworth?: (loading: boolean) => void;
}

const DashboardBottomSection = ({
  shouldRefetchNetworth,
  setShouldRefetchNetworth,
}: IProps) => {
  return (
    <>
      {/* Show above 1024px */}
      <div className='hidden 2lg:grid grid-cols-12 gap-4'>
        <div className='col-span-8'>
          <AssetsTable
            shouldRefetchNetworth={shouldRefetchNetworth}
            setShouldRefetchNetworth={setShouldRefetchNetworth}
          />
        </div>
        <div className='col-span-4'>
          <TransactionsTable
            shouldRefetchNetworth={shouldRefetchNetworth}
            setShouldRefetchNetworth={setShouldRefetchNetworth}
          />
        </div>
      </div>

      {/* Show below 1024px */}
      <div className='grid grid-cols-12 gap-4 2lg:hidden'>
        <AssetsTable
          shouldRefetchNetworth={shouldRefetchNetworth}
          setShouldRefetchNetworth={setShouldRefetchNetworth}
        />
      </div>
      <div className='grid grid-cols-12 gap-4 2lg:hidden'>
        <TransactionsTable
          shouldRefetchNetworth={shouldRefetchNetworth}
          setShouldRefetchNetworth={setShouldRefetchNetworth}
        />
      </div>
    </>
  );
};

export default DashboardBottomSection;
