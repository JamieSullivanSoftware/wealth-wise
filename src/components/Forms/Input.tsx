import clsx from 'clsx/lite';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import ErrorMessage from '../Common/ErrorMessage';

interface IProps {
  type?: string;
  name: string;
  id: string;
  classes?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: number | string | undefined;
  value?: number | string | undefined;
  maxValue?: number | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

const Input = ({
  type = 'text',
  name,
  id,
  classes = '',
  placeholder = 'e.g. Apple Stock',
  required = false,
  defaultValue,
  value,
  maxValue,
  onChange,
  onBlur,
  errorMessage,
}: IProps) => {
  const classNames = clsx(
    `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${classes}`
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      type === 'number' &&
      (e.code === 'Minus' || e.code === 'NumpadSubtract')
    ) {
      e.preventDefault();
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <>
      <input
        type={type}
        name={name}
        id={id}
        className={classNames}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        value={value}
        max={maxValue}
        onChange={onChange}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          handleKeyDown(e);
        }}
        onFocus={(e: FocusEvent<HTMLInputElement>) => {
          handleFocus(e);
        }}
        onBlur={onBlur}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </>
  );
};

export default Input;
