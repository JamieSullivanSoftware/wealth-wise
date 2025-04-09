'use client';
import Label from './Label';
import Input from './Input';
import Select from './Select';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Button from '../Common/Button';
import { addTransaction } from '@/app/actions/transactions';
import { ChangeEvent, useEffect, useState } from 'react';
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
  const [transactionData, setTransactionData] = useState<ITransactionData>({
    _id: '',
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
            required
            value={transactionData.amount}
            onChange={handleOnChange}
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
              required
              value={transactionData.numUnits}
              onChange={handleOnChange}
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
              required
              value={transactionData.pricePerUnit}
              onChange={handleOnChange}
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
