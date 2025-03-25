import Label from './Label';
import Input from './Input';
import Select from './Select';
import { CATEGORIES } from '@/constants';
import Button from '../Common/Button';
import { addAsset, editAsset } from '@/app/actions/assets';
import { useEffect, useState } from 'react';
import { hasCategoryGotShares } from '@/utils/misc';

interface IProps {
  onAssetAdded: () => void;
  asset?: IAssetData;
}

const AssetForm = ({ onAssetAdded, asset }: IProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    asset?.category || ''
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (asset) {
        await editAsset(formData, asset._id);
      } else {
        await addAsset(formData);
      }
      await onAssetAdded();
    } catch (error) {
      console.error('Failed to submit asset:', error);
    }
  };

  const handleOnSelect = (category: string = '') => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (asset?.category) {
      setSelectedCategory(asset.category);
    }
  }, [asset?.category]);

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
          defaultValue={asset?.name}
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
            label: category,
          }))}
          value={selectedCategory}
          onSelect={handleOnSelect}
        />
      </div>

      {/* Number of Shares & Cost Only Show on Add Modal */}
      {!asset && (
        <>
          {hasCategoryGotShares(selectedCategory) && (
            <div>
              <Label
                htmlFor='num-shares'
                text='Number of Shares'
              />
              <Input
                type='number'
                name='num-shares'
                id='num-shares'
                placeholder='5'
                required
              />
            </div>
          )}
          <div>
            <Label
              htmlFor='cost'
              text='Cost'
            />
            <Input
              type='number'
              name='cost'
              id='cost'
              placeholder='1000'
              required
            />
          </div>
        </>
      )}

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
          placeholder='1000'
          required
          defaultValue={asset?.value}
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
          defaultValue={asset?.detail}
        />
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        classes='w-full text-center py-2 px-4'
        text={asset ? 'Confirm' : 'Add Asset'}
        isPrimary
      />
    </form>
  );
};

export default AssetForm;
