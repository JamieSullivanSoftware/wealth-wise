import Label from './Label';
import Input from './Input';
import Select from './Select';
import { CATEGORIES } from '@/constants';
import Button from '../Common/Button';
import { addAsset } from '@/app/actions/assets';

interface IProps {
  onAssetAdded: () => void;
}

const AssetForm = ({ onAssetAdded }: IProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await addAsset(formData);
      await onAssetAdded();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      {/* Asset Name */}
      <div>
        <Label
          htmlFor='asset-name'
          text='Asset Name'
        />
        <Input
          name='asset-name'
          id='asset-name'
          placeholder='e.g. Apple Stock'
          required
        />
      </div>

      {/* Category */}
      <div>
        <Label
          htmlFor='category'
          text='Category'
        />
        <Select
          name='category'
          id='category'
          placeholder='Select a category'
          options={Object.values(CATEGORIES).map((category: string) => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1),
          }))}
        />
      </div>

      {/* Number of Shares */}
      <div>
        <Label
          htmlFor='num-shares'
          text='Number of Shares/Units'
        />
        <Input
          type='number'
          name='num-shares'
          id='num-shares'
          placeholder='e.g. 10'
          required
        />
      </div>

      {/* Cost */}
      <div>
        <Label
          htmlFor='cost'
          text='Cost'
        />
        <Input
          type='number'
          name='cost'
          id='cost'
          placeholder='e.g. 150.00'
          required
        />
      </div>

      {/* Value */}
      <div>
        <Label
          htmlFor='value'
          text='Value'
        />
        <Input
          type='number'
          name='value'
          id='value'
          placeholder='e.g. 2000.00'
          required
        />
      </div>

      {/* Details*/}
      <div>
        <Label
          htmlFor='detail'
          text='Detail (Optional)'
        />
        <textarea
          name='detail'
          id='detail'
          maxLength={100}
          rows={3}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white'
          placeholder='Additional asset details...'
        />
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        classes='w-full  text-center'
        text='Add Asset'
        isPrimary
      />
    </form>
  );
};

export default AssetForm;
