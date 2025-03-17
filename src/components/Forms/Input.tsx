import clsx from 'clsx/lite';

interface IProps {
  type?: string;
  name: string;
  id: string;
  classes?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue: number | string | undefined;
}

const Input = ({
  type = 'text',
  name,
  id,
  classes = '',
  placeholder = 'e.g. Apple Stock',
  required = false,
  defaultValue,
}: IProps) => {
  const classNames = clsx(
    `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${classes}`
  );
  return (
    <input
      type={type}
      name={name}
      id={id}
      className={classNames}
      placeholder={placeholder}
      required={required}
      defaultValue={defaultValue}
    />
  );
};

export default Input;
