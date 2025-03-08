import Label from './Label';
import Input from './Input';
import Select from './Select';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Button from '../Common/Button';

const NewTransactionForm = () => {
  return (
    <form
      className='space-y-6'
      action='#'
    >
      {/* Amount */}
      <div>
        <Label
          htmlFor='amount'
          text='Amount'
        />
        <Input
          type='number'
          name='amount'
          id='amount'
          placeholder='e.g. 150.00'
          required
        />
      </div>

      {/* Asset */}
      <div>
        <Label
          htmlFor='asset'
          text='Asset'
        />
        <Select
          name='asset'
          id='asset'
          placeholder='Select asset'
          options={Object.values(CATEGORIES).map((category: string) => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1),
          }))}
        />
      </div>

      {/* Type */}
      <div>
        <Label
          htmlFor='type'
          text='Transaction Type'
        />
        <Select
          name='type'
          id='type'
          placeholder='Select type'
          options={Object.values(TRANSACTION_TYPES).map((type: string) => ({
            value: type,
            label: type,
          }))}
        />
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        classes='w-full  text-center'
        text='Add Transaction'
        onClick={() => {}}
        isPrimary
      />
    </form>
  );
};

export default NewTransactionForm;
