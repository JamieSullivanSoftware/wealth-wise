interface IProps {
  errorMessage: string;
}

const ErrorMessage = ({ errorMessage }: IProps) => {
  return <div className='mt-2 text-sm text-light-red'>{errorMessage}</div>;
};

export default ErrorMessage;
