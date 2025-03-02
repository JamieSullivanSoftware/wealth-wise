interface IProps {
  isFullScreen?: boolean;
  isTransparent?: boolean;
}

const Loader = ({ isFullScreen, isTransparent }: IProps) => {
  return (
    <div
      className={`flex ${isFullScreen ? 'h-screen' : 'h-full'}  items-center justify-center ${isTransparent ? ' ' : 'bg-white dark:bg-dark-4'}`}
    >
      <div className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
    </div>
  );
};

export default Loader;
