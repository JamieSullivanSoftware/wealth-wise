'use client';
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';

import Label from './Label';
import Input from './Input';
import Select from './Select';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Button from '../Common/Button';
import { addTransaction } from '@/app/actions/transactions';
import {
  isAccount,
  isRealEstateCarOrOther,
  isStocksOrCrypto,
} from '@/utils/misc';

interface IProps {
  assetList: IAssetListData[];
  onTransactionAdded: () => void;
  transaction?: ITransactionTableData;
  isModalVisible?: boolean;
}

const TransactionForm = ({
  assetList,
  onTransactionAdded,
  transaction,
  isModalVisible,
}: IProps) => {
  const [transactionData, setTransactionData] = useState<ITransactionFormData>({
    _id: '',
    assetId: '',
    type: '',
    amount: '',
    numUnits: '',
    pricePerUnit: '',
  });
  const [errors, setErrors] = useState<ITransactionFormErrors>({
    assetId: '',
    type: '',
    amount: '',
    numUnits: '',
    pricePerUnit: '',
  });

  const [selectedAsset, setSelectedAsset] = useState<IAssetListData | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasErrors()) {
      return;
    }

    try {
      await addTransaction(transactionData);
      onTransactionAdded();
    } catch (error) {
      console.error('Failed to submit transaction:', error);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTransactionData({
      ...transactionData,
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

  const handleOnAssetSelect = (assetId: string) => {
    const asset = assetList.find(
      (asset: IAssetListData) => asset._id === assetId
    );
    if (asset) {
      setSelectedAsset(asset);
      setTransactionData({
        ...transactionData,
        assetId: asset._id,
        type: '',
        amount: '',
        numUnits: '',
        pricePerUnit: '',
      });
      setErrors(() => ({
        ...errors,
        assetId: '',
        type: '',
        amount: '',
        numUnits: '',
        pricePerUnit: '',
      }));
    }
  };

  const handleOnTypeSelect = (type: string) => {
    setTransactionData({
      ...transactionData,
      type,
    });
  };

  const resetFormData = () => {
    setSelectedAsset(null);
    setTransactionData({
      _id: '',
      assetId: '',
      type: '',
      amount: '',
      numUnits: '',
      pricePerUnit: '',
    });
  };

  const getTypeOptions = () => {
    if (isStocksOrCrypto(selectedAsset?.category)) {
      return Object.values(TRANSACTION_TYPES).filter(
        (type: string) =>
          type === TRANSACTION_TYPES.buy || type === TRANSACTION_TYPES.sell
      );
    }
    if (isAccount(selectedAsset?.category)) {
      return Object.values(TRANSACTION_TYPES).filter(
        (type: string) =>
          type === TRANSACTION_TYPES.deposit ||
          type === TRANSACTION_TYPES.withdraw
      );
    }
    return [];
  };

  const hasErrors = () => {
    const errorsCopy = Object.assign(errors);

    if (!selectedAsset) {
      errorsCopy.assetId = 'Asset is required';
      setErrors({ ...errorsCopy });
      return true;
    }

    errorsCopy.type = !transactionData.type
      ? 'Transaction type is required'
      : '';

    switch (selectedAsset?.category) {
      case CATEGORIES.accounts:
        const assetValue = selectedAsset.value || 0;
        const transactionAmount = transactionData.amount
          ? parseFloat(transactionData.amount)
          : 0;

        errorsCopy.amount = transactionAmount <= 0 ? 'Amount is required' : '';

        if (
          transactionAmount > assetValue &&
          transactionData.type === TRANSACTION_TYPES.withdraw
        ) {
          errorsCopy.amount = 'Withdraw amount cannot exceed balance';
        }
        break;
      case CATEGORIES.stocks:
      case CATEGORIES.crypto:
        const unitsLabel =
          selectedAsset.category === CATEGORIES.stocks ? 'share' : 'coin';
        const assetNumUnits = selectedAsset.numUnits || 0;
        const transactionNumUnits = transactionData.numUnits
          ? parseFloat(transactionData.numUnits)
          : 0;
        const transactionPricePerUnit = transactionData.pricePerUnit
          ? parseFloat(transactionData.pricePerUnit)
          : 0;

        errorsCopy.pricePerUnit =
          transactionPricePerUnit <= 0 ? 'Price per unit is required' : '';
        errorsCopy.numUnits =
          transactionNumUnits <= 0
            ? `Number of ${unitsLabel}s is required`
            : '';

        if (
          transactionData.type === TRANSACTION_TYPES.sell &&
          transactionNumUnits > assetNumUnits
        ) {
          errorsCopy.numUnits = `Number of ${unitsLabel} cannot exceed available ${unitsLabel}`;
        }
        break;
      default:
    }

    setErrors({ ...errorsCopy });
    return Object.keys(errorsCopy).some(
      (key: string) => errorsCopy[key].length > 0
    );
  };

  useEffect(() => {
    if (isModalVisible) {
      resetFormData();
    }
  }, [isModalVisible]);

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      {/* Asset & Type */}

      <div>
        <Label
          htmlFor='asset'
          text='Asset'
        />
        <Select
          name='asset-id'
          id='assetId'
          placeholder='Select asset'
          options={assetList
            .filter(
              (asset: IAssetListData) => !isRealEstateCarOrOther(asset.category)
            )
            .map((asset: IAssetListData) => ({
              value: asset._id,
              label: asset.name,
            }))}
          value={transactionData.assetId}
          onSelect={handleOnAssetSelect}
          onBlur={handleOnBlur}
          errorMessage={errors.assetId}
        />
      </div>
      {selectedAsset?.category && (
        <div>
          <Label
            htmlFor='type'
            text='Transaction Type'
          />
          <Select
            name='type'
            id='type'
            placeholder='Select type'
            options={getTypeOptions().map((type: string) => ({
              value: type,
              label: type,
            }))}
            value={transactionData.type}
            onSelect={handleOnTypeSelect}
            onBlur={handleOnBlur}
            errorMessage={errors.type}
          />
        </div>
      )}

      {/* Amount */}
      {isAccount(selectedAsset?.category) && (
        <div>
          <Label
            htmlFor='amount'
            text='Amount'
          />
          <Input
            type='number'
            name='amount'
            id='amount'
            placeholder='1000'
            value={transactionData.amount}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            errorMessage={errors.amount}
          />
        </div>
      )}

      {/* Unit Num/Price - (Stocks & Crypto) */}
      {isStocksOrCrypto(selectedAsset?.category) && (
        <>
          <div>
            <Label
              htmlFor='numUnits'
              text={`Number of ${
                selectedAsset?.category === CATEGORIES.stocks
                  ? 'Shares'
                  : 'Coins'
              }`}
            />
            <Input
              type='number'
              name='numUnits'
              id='numUnits'
              placeholder='5'
              value={transactionData.numUnits}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              errorMessage={errors.numUnits}
            />
          </div>
          <div>
            <Label
              htmlFor='price-per-unit'
              text={`Price per ${selectedAsset?.category === CATEGORIES.stocks ? 'Share' : 'Unit'}`}
            />
            <Input
              type='number'
              name='price-per-unit'
              id='pricePerUnit'
              placeholder='100'
              value={transactionData.pricePerUnit}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              errorMessage={errors.pricePerUnit}
            />
          </div>
        </>
      )}

      {/* Submit Button */}
      <Button
        type='submit'
        classes='w-full text-center py-2 px-4'
        text={transaction ? 'Confirm' : 'Add Transaction'}
        isPrimary
      />
    </form>
  );
};

export default TransactionForm;
