interface IProps {
  htmlFor: string;
  text: string;
}

const Label = ({ htmlFor, text }: IProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
    >
      {text}
    </label>
  );
};

export default Label;
