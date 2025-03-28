'use client';
import Label from './Label';
import Input from './Input';
import Select from './Select';
import { ACCOUNT_TYPES, CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Button from '../Common/Button';
import { addTransaction, editTransaction } from '@/app/actions/transactions';
import { useEffect, useState } from 'react';
import {
  isAccount,
  isRealEstateCarOrOther,
  isStocksOrCrypto,
} from '@/utils/misc';

interface IProps {
  assetList: IAssetListData[];
  onTransactionAdded: () => void;
  transaction?: ITransactionTableData;
}

const TransactionForm = ({
  assetList,
  onTransactionAdded,
  transaction,
}: IProps) => {
  const [selectedAsset, setSelectedAsset] = useState<IAssetListData | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<string>(
    transaction?.type || ''
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (transaction) {
        await editTransaction(formData, transaction._id);
      } else {
        await addTransaction(formData);
      }
      await onTransactionAdded();
    } catch (error) {
      console.error('Failed to submit transaction:', error);
    }
  };

  const handleOnAssetSelect = (assetId: string) => {
    const asset = assetList.find(
      (asset: IAssetListData) => asset._id === assetId
    );
    if (asset) {
      setSelectedAsset(asset);
    }
  };

  const handleOnTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const getTypeOptions = () => {
    if (isStocksOrCrypto(selectedAsset?.category)) {
      return Object.values(TRANSACTION_TYPES).filter(
        (type: string) =>
          type === TRANSACTION_TYPES.buy || type === TRANSACTION_TYPES.sell
      );
    }
    if (isRealEstateCarOrOther(selectedAsset?.category)) {
      return Object.values(TRANSACTION_TYPES).filter(
        (type: string) =>
          type === TRANSACTION_TYPES.appreciation ||
          type === TRANSACTION_TYPES.depreciation
      );
    }
    if (isAccount(selectedAsset?.category)) {
      return Object.keys(TRANSACTION_TYPES).filter(
        (type: string) =>
          type === TRANSACTION_TYPES.deposit ||
          type === TRANSACTION_TYPES.withdraw
      );
    }
    return [];
  };

  useEffect(() => {
    if (transaction) {
      setSelectedType(transaction.type);
      setSelectedAsset(transaction.asset);
    }
  }, [transaction]);

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      {/* Asset & Type - Cannot Edit */}
      {!transaction && (
        <>
          <div>
            <Label
              htmlFor='asset'
              text='Asset'
            />
            <Select
              name='asset-id'
              id='asset-id'
              placeholder='Select asset'
              options={assetList.map((asset: IAssetListData) => ({
                value: asset._id,
                label: asset.name,
              }))}
              value={selectedAsset?._id}
              onSelect={handleOnAssetSelect}
            />
          </div>
          {(isStocksOrCrypto(selectedAsset?.category) ||
            isAccount(selectedAsset?.category)) && (
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
                value={selectedType}
                onSelect={handleOnTypeSelect}
              />
            </div>
          )}
        </>
      )}

      {/* Number of Units/Shares and Price - (Stocks & Crypto) - Can Edit */}
      {isStocksOrCrypto(selectedAsset?.category) && (
        <>
          <div>
            <Label
              htmlFor='num-units'
              text={`Number of ${selectedAsset?.category === CATEGORIES.stocks ? 'Shares' : 'Units'}`}
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
              text={`Price per ${selectedAsset?.category === CATEGORIES.stocks ? 'Share' : 'Unit'}`}
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

      {/* Market Value - Real Estate/Cars/Other - Can Edit */}
      {isRealEstateCarOrOther(selectedAsset?.category) && (
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
      )}

      {/* Account Balance Amount - (Accounts) */}
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
          />
        </div>
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
