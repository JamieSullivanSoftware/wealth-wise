import Label from './Label';
import Input from './Input';
import Select from './Select';
import { ACCOUNT_TYPES, CATEGORIES } from '@/constants';
import Button from '../Common/Button';
import { addAsset, editAsset } from '@/app/actions/assets';
import { useEffect, useState } from 'react';
import {
  isAccount,
  isRealEstateCarOrOther,
  isStocksOrCrypto,
} from '@/utils/misc';

interface IProps {
  onAssetAdded: () => void;
  asset?: IAssetData;
}

const AssetForm = ({ onAssetAdded, asset }: IProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    asset?.category || ''
  );
  const [selectedAccountType, setSelectedAccountType] = useState<string>(
    asset?.accountType || ''
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

  const handleOnSelectCategory = (category: string = '') => {
    setSelectedCategory(category);
  };

  const handleOnSelectAccountType = (accountType: string = '') => {
    setSelectedCategory(accountType);
  };

  useEffect(() => {
    if (asset) {
      handleOnSelectCategory(asset.category);
      handleOnSelectAccountType(asset.accountType);
    }
  }, [asset]);

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
          placeholder='Apple Stock'
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
          onSelect={handleOnSelectCategory}
        />
      </div>

      {/* Number of Units/Shares and Price - (Stocks & Crypto) */}
      {isStocksOrCrypto(selectedCategory) && (
        <>
          <div>
            <Label
              htmlFor='num-units'
              text={`Number of ${selectedCategory === CATEGORIES.stocks ? 'Shares' : 'Units'}`}
            />
            <Input
              type='number'
              name='num-units'
              id='num-units'
              placeholder='5'
              required
            />
          </div>
          <div>
            <Label
              htmlFor='price-per-unit'
              text={`Price per ${selectedCategory === CATEGORIES.stocks ? 'Share' : 'Unit'}`}
            />
            <Input
              type='number'
              name='price-per-unit'
              id='price-per-unit'
              placeholder='100'
              required
            />
          </div>
        </>
      )}

      {/* Purchase Price - Real Estate/Cars/Other */}
      {isRealEstateCarOrOther(selectedCategory) && (
        <>
          <div>
            <Label
              htmlFor='cost'
              text='Purchase Price'
            />
            <Input
              type='number'
              name='cost'
              id='cost'
              placeholder='50,000'
              required
            />
          </div>
          <div>
            <Label
              htmlFor='value'
              text='Latest Market Value'
            />
            <Input
              type='number'
              name='value'
              id='value'
              placeholder='50,000'
              required
            />
          </div>
          {selectedCategory === CATEGORIES.realEstate && (
            <div>
              <Label
                htmlFor='address'
                text='Address'
              />
              <textarea
                name='address'
                id='address'
                maxLength={100}
                rows={3}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white'
                placeholder='Address of the property...'
              />
            </div>
          )}
        </>
      )}

      {/* Account and Balance - (Accounts) */}
      {isAccount(selectedCategory) && (
        <>
          <div>
            <Label
              htmlFor='account-type'
              text='Account Type'
            />
            <Select
              name='account-type'
              id='account-type'
              placeholder='Select account type'
              options={Object.values(ACCOUNT_TYPES).map((type: string) => ({
                value: type,
                label: type,
              }))}
              value={selectedAccountType}
              onSelect={handleOnSelectAccountType}
            />
          </div>
          <div>
            <Label
              htmlFor='account-balance'
              text='Account Balance'
            />
            <Input
              type='number'
              name='account-balance'
              id='account-balance'
              placeholder='1000'
              required
            />
          </div>
        </>
      )}

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
