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
  const [assetData, setAssetData] = useState<IAssetFormData>({
    _id: '',
    name: '',
    category: '',
    cost: '',
    value: '',
    numUnits: '',
    address: '',
    accountType: '',
    details: '',
    marketValue: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (asset) {
        await editAsset(assetData);
      } else {
        await addAsset(assetData);
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
    setAssetData({
      ...assetData,
      [id]: value,
    });
  };

  const handleOnSelectCategory = (category: string = '') => {
    setAssetData({
      ...assetData,
      category,
      cost: '',
      value: '',
      numUnits: '',
      address: '',
      accountType: '',
      details: '',
      marketValue: '',
    });
  };

  const handleOnSelectAccountType = (accountType: string = '') => {
    setAssetData({
      ...assetData,
      accountType: accountType as AccountType,
    });
  };

  const resetFormData = () => {
    setAssetData({
      _id: '',
      name: '',
      category: '',
      cost: '',
      value: '',
      numUnits: '',
      address: '',
      accountType: '',
      details: '',
      marketValue: '',
    });
  };

  useEffect(() => {
    if (isModalVisible && !asset) {
      resetFormData();
    }
    if (asset) {
      setAssetData({
        _id: asset?._id,
        name: asset?.name,
        category: asset?.category,
        cost: asset?.cost.toString(),
        value: asset?.value.toString(),
        numUnits: asset?.numUnits?.toString(),
        address: asset?.address,
        accountType: asset?.accountType as AccountType,
        marketValue: asset?.marketValue?.toString(),
        details: asset?.details,
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
          text='Name'
        />
        <Input
          name='name'
          id='name'
          placeholder='Asset name'
          maxLength={50}
          required
          value={assetData.name}
          onChange={handleOnChange}
        />
      </div>

      {/* Category - Not Editable */}
      {!asset && (
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
            value={assetData.category}
            onSelect={handleOnSelectCategory}
          />
        </div>
      )}

      {/* Number of Units and Price - (Stocks & Crypto) */}
      {isStocksOrCrypto(assetData.category) && (
        <>
          {!asset && (
            <div>
              <Label
                htmlFor='num-units'
                text={`Number of ${assetData.category === CATEGORIES.stocks ? 'Shares' : 'Coins'}`}
              />
              <Input
                type='number'
                name='num-units'
                id='numUnits'
                placeholder='5'
                required
                value={assetData.numUnits}
                onChange={handleOnChange}
              />
            </div>
          )}
          <div>
            <Label
              htmlFor='pricePerUnit'
              text={`Price per ${assetData.category === CATEGORIES.stocks ? 'Share' : 'Coin'}`}
            />
            <Input
              type='number'
              name='pricePerUnit'
              id='marketValue'
              placeholder='100'
              required
              value={assetData.marketValue}
              onChange={handleOnChange}
            />
          </div>
        </>
      )}

      {/* Purchase Price - Real Estate/Cars/Other */}
      {isRealEstateCarOrOther(assetData.category) && (
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
              value={assetData.cost}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <Label
              htmlFor='marketValue'
              text='Market Value'
            />
            <Input
              type='number'
              name='marketValue'
              id='marketValue'
              placeholder='50,000'
              required
              value={assetData.marketValue}
              onChange={handleOnChange}
            />
          </div>
          {assetData.category === CATEGORIES.realEstate && (
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
                value={assetData.address}
                onChange={handleOnChange}
              />
            </div>
          )}
          {(assetData.category === CATEGORIES.cars ||
            assetData.category === CATEGORIES.other) && (
            <div>
              <Label
                htmlFor='details'
                text='Details'
              />
              <textarea
                name='details'
                id='details'
                maxLength={100}
                rows={3}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white'
                placeholder={
                  assetData.category === CATEGORIES.cars
                    ? 'Car details...'
                    : 'Other details...'
                }
                value={assetData.details}
                onChange={handleOnChange}
              />
            </div>
          )}
        </>
      )}

      {/* Account Type - (Accounts) */}
      {isAccount(assetData.category) && (
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
              value={assetData.accountType}
              onSelect={handleOnSelectAccountType}
            />
          </div>
          {!asset && (
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
                value={assetData.value}
                onChange={handleOnChange}
              />
            </div>
          )}
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
