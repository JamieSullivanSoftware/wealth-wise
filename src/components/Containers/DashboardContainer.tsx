import PageHeader from '../Common/PageHeader';
import DashboardBottom from '../Sections/DashboardBottom';
import DashboardTop from '../Sections/DashboardTop';

const Dashboard = () => {
  return (
    <>
      <PageHeader title='Dashboard' />
      <div className='grid grid-rows-auto grid-cols-1 gap-8 sm:gap-4'>
        <DashboardTop />
        <DashboardBottom />
      </div>
    </>
  );
};

export default Dashboard;
