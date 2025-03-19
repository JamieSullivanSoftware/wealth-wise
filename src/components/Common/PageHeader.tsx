interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => {
  return (
    <h2 className='text-3xl mt-4 mb-8 font-medium text-black dark:text-gray-2'>
      {title}
    </h2>
  );
};

export default PageHeader;
