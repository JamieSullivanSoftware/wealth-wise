import Label from './Label';
import Input from './Input';
import Select from './Select';
import { ACCOUNT_TYPES, CATEGORIES } from '@/constants';
import Button from '../Common/Button';
import { addAsset, editAsset } from '@/app/actions/assets';
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
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
  const [errors, setErrors] = useState<IAssetFormErrors>({
    name: '',
    category: '',
    cost: '',
    value: '',
    numUnits: '',
    accountType: '',
    marketValue: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasErrors()) {
      return;
    }

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

  const handleOnChange = (e: ChangeEvent<IFormElement>) => {
    const { id, value } = e.target;
    setAssetData({
      ...assetData,
      [id]: value,
    });
  };

  const handleOnBlur = (e: FocusEvent<IFormElement>) => {
    e.preventDefault();
    const { id } = e.target;
    setErrors(() => ({
      ...errors,
      [id]: '',
    }));
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
    setErrors(() => ({
      ...errors,
      category: '',
      cost: '',
      value: '',
      numUnits: '',
      address: '',
      accountType: '',
      details: '',
      marketValue: '',
    }));
  };

  const handleOnSelectAccountType = (accountType: string = '') => {
    setAssetData({
      ...assetData,
      accountType: accountType as AccountType,
    });
    setErrors(() => ({
      ...errors,
      accountType: '',
    }));
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

  const hasErrors = () => {
    const errorsCopy = Object.assign(errors);
    errorsCopy.name = !assetData.name ? 'Name is required' : '';
    errorsCopy.category = !assetData.category ? 'Category is required' : '';

    switch (assetData.category) {
      case CATEGORIES.accounts:
        errorsCopy.accountType = !assetData.accountType
          ? 'Account type is required'
          : '';
        errorsCopy.value =
          !assetData.value || parseFloat(assetData.value) <= 0
            ? 'Account balance is required'
            : '';
        break;
      case CATEGORIES.stocks:
      case CATEGORIES.crypto:
        const unitsLabel =
          assetData.category === CATEGORIES.stocks ? 'share' : 'coin';
        errorsCopy.numUnits =
          !assetData.numUnits || parseFloat(assetData.numUnits) <= 0
            ? `Number of ${unitsLabel}s is required`
            : '';
        errorsCopy.marketValue =
          !assetData.marketValue || parseFloat(assetData.marketValue) <= 0
            ? `Price per ${unitsLabel} is required`
            : '';
        break;
      case CATEGORIES.cars:
      case CATEGORIES.realEstate:
      case CATEGORIES.other:
        errorsCopy.cost =
          !assetData.cost || parseFloat(assetData.cost) <= 0
            ? 'Purchase price is required'
            : '';
        errorsCopy.marketValue =
          !assetData.marketValue || parseFloat(assetData.marketValue) <= 0
            ? 'Market value is required'
            : '';
        break;
      default:
    }

    setErrors({ ...errorsCopy });
    return Object.keys(errorsCopy).some(
      (key: string) => errorsCopy[key].length > 0
    );
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
          maxValue={50}
          value={assetData.name}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          errorMessage={errors.name}
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
            onBlur={handleOnBlur}
            errorMessage={errors.category}
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
                value={assetData.numUnits}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                errorMessage={errors.numUnits}
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
              value={assetData.marketValue}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              errorMessage={errors.marketValue}
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
              value={assetData.cost}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              errorMessage={errors.cost}
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
              value={assetData.marketValue}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              errorMessage={errors.marketValue}
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
                onBlur={handleOnBlur}
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
                onBlur={handleOnBlur}
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
              onBlur={handleOnBlur}
              errorMessage={errors.accountType}
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
                value={assetData.value}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                errorMessage={errors.value}
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
