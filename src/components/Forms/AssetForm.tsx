import Label from './Label';
import Input from './Input';
import Select from './Select';
import { ACCOUNT_TYPES, CATEGORIES } from '@/constants';
import Button from '../Common/Button';
import { addAsset, editAsset } from '@/app/actions/assets';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  isAccount,
  isRealEstateCarOrOther,
  isStocksOrCrypto,
} from '@/utils/misc';

interface IProps {
  onAssetAdded: () => void;
  asset?: IAssetTableData;
  isModalVisible?: boolean;
}

const AssetForm = ({ onAssetAdded, asset, isModalVisible }: IProps) => {
  const [formData, setFormData] = useState<IAssetData>({
    name: '',
    category: '',
    numUnits: 0,
    cost: 0,
    value: 0,
    address: '',
    accountType: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (asset) {
        await editAsset(formData, asset._id);
      } else {
        await addAsset(formData);
      }

      onAssetAdded();
    } catch (error) {
      console.error('Failed to submit asset:', error);
    }
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleOnSelectCategory = (category: string = '') => {
    setFormData({
      ...formData,
      category,
    });
  };

  const handleOnSelectAccountType = (accountType: string = '') => {
    setFormData({
      ...formData,
      accountType: accountType as AccountType,
    });
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      category: '',
      numUnits: 0,
      cost: 0,
      value: 0,
      address: '',
      accountType: '',
    });
  };

  useEffect(() => {
    if (isModalVisible && !asset) {
      resetFormData();
    }
    if (asset) {
      setFormData({
        name: asset?.name,
        category: asset?.category,
        numUnits: asset?.numUnits,
        cost: asset?.cost,
        value: asset?.value,
        address: asset?.address,
        accountType: asset?.accountType as AccountType,
      });
    }
  }, [asset, isModalVisible]);

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      {/* Asset Name */}
      <div>
        <Label
          htmlFor='name'
          text='Asset Name'
        />
        <Input
          name='name'
          id='name'
          placeholder='Apple Stock'
          required
          value={formData.name}
          onChange={handleOnChange}
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
          value={formData.category}
          onSelect={handleOnSelectCategory}
        />
      </div>

      {/* Number of Units/Shares and Price - (Stocks & Crypto) */}
      {isStocksOrCrypto(formData.category) && (
        <>
          <div>
            <Label
              htmlFor='num-units'
              text={`Number of ${formData.category === CATEGORIES.stocks ? 'Shares' : 'Units'}`}
            />
            <Input
              type='number'
              name='num-units'
              id='numUnits'
              placeholder='5'
              required
              value={formData.numUnits}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <Label
              htmlFor='cost'
              text={`Price per ${formData.category === CATEGORIES.stocks ? 'Share' : 'Unit'}`}
            />
            <Input
              type='number'
              name='cost'
              id='cost'
              placeholder='100'
              required
              value={formData.cost}
              onChange={handleOnChange}
            />
          </div>
        </>
      )}

      {/* Purchase Price - Real Estate/Cars/Other */}
      {isRealEstateCarOrOther(formData.category) && (
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
              value={formData.cost}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <Label
              htmlFor='value'
              text='Market Value'
            />
            <Input
              type='number'
              name='value'
              id='value'
              placeholder='50,000'
              required
              value={formData.value}
              onChange={handleOnChange}
            />
          </div>
          {formData.category === CATEGORIES.realEstate && (
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
                value={formData.address}
                onChange={handleOnChange}
              />
            </div>
          )}
        </>
      )}

      {/* Account and Balance - (Accounts) */}
      {isAccount(formData.category) && (
        <>
          <div>
            <Label
              htmlFor='account-type'
              text='Account Type'
            />
            <Select
              name='account-type'
              id='accountType'
              placeholder='Select account type'
              options={Object.values(ACCOUNT_TYPES).map((type: string) => ({
                value: type,
                label: type,
              }))}
              value={formData.accountType}
              onSelect={handleOnSelectAccountType}
            />
          </div>
          <div>
            <Label
              htmlFor='value'
              text='Account Balance'
            />
            <Input
              type='number'
              name='value'
              id='value'
              placeholder='1000'
              required
              value={formData.value}
              onChange={handleOnChange}
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
