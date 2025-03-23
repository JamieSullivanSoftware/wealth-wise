import type { ChangeEvent } from 'react';

interface IProps {
  name: string;
  id: string;
  placeholder: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: number | string | undefined;
  onSelect?: (value: string) => void;
}

const Select = ({
  name,
  id,
  placeholder,
  options,
  required,
  defaultValue,
  onSelect,
}: IProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onSelect) {
      onSelect(e.target.value);
    }
  };

  return (
    <select
      name={name}
      id={id}
      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white cursor-pointer'
      required={required}
      value={defaultValue}
      onChange={handleChange}
    >
      <option value=''>{placeholder}</option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
