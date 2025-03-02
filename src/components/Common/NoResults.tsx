import Button from './Button';

interface IProps {
  text: string;
  btnText?: string;
}

const NoResults = ({ text, btnText }: IProps) => (
  <div className='grid grid-cols-1 gap-8 justify-items-center'>
    <h3 className='text-lg sm:text-2xl font-medium text-black dark:text-gray-1'>
      {text}
    </h3>
    {btnText && (
      <Button
        text={btnText}
        onClick={() => {
          console.log('Add');
        }}
      />
    )}
  </div>
);

export default NoResults;
