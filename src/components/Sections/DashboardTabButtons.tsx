import PillButton from '../Common/PillButton';

interface IProps {
  handleTabClick?: (tab: DashboardTab) => void;
  tabs?: DashboardTab[];
  activeTab?: string;
}

const DashboardTabButtons = ({ handleTabClick, tabs, activeTab }: IProps) => {
  return (
    <div className='flex md:hidden gap-2 mt-2 mb-4'>
      {tabs?.map((tab: DashboardTab) => (
        <PillButton
          key={tab}
          text={tab}
          onClick={() => {
            handleTabClick?.(tab);
          }}
          isActive={activeTab === tab}
        />
      ))}
    </div>
  );
};

export default DashboardTabButtons;
