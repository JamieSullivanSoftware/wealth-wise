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
  const [formData, setFormData] = useState<ITransactionData>({
    assetId: '',
    type: '',
    amount: undefined,
    numUnits: undefined,
    pricePerUnit: undefined,
  });
  const [amountLabel, setAmountLabel] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<IAssetListData | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (transaction) {
        // await editTransaction(formData, transaction._id);
      } else {
        await addTransaction(formData);
      }

      onTransactionAdded();
    } catch (error) {
      console.error('Failed to submit transaction:', error);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleOnAssetSelect = (assetId: string) => {
    const asset = assetList.find(
      (asset: IAssetListData) => asset._id === assetId
    );
    if (asset) {
      setSelectedAsset(asset);
      setFormData({
        ...formData,
        assetId: asset._id,
      });
    }
  };

  const handleOnTypeSelect = (type: string) => {
    setFormData({
      ...formData,
      type,
    });
  };

  const resetFormData = () => {
    setSelectedAsset(null);
    setFormData({
      assetId: '',
      type: '',
      amount: undefined,
      numUnits: undefined,
      pricePerUnit: undefined,
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
      if (transaction) {
        setSelectedAsset(transaction.asset);
        setFormData({
          assetId: transaction.asset._id,
          type: transaction.type,
          amount: transaction.amount,
          numUnits: transaction.numUnits,
          pricePerUnit: transaction.pricePerUnit,
        });
      } else {
        resetFormData();
      }
    }
  }, [transaction, isModalVisible]);

  useEffect(() => {
    if (isStocksOrCrypto(selectedAsset?.category)) {
      setAmountLabel(
        `Number of ${
          selectedAsset?.category === CATEGORIES.stocks ? 'Shares' : 'Units'
        }`
      );
    }
    if (isAccount(selectedAsset?.category)) {
      setAmountLabel('Amount');
    }
  }, [selectedAsset]);

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
              id='assetId'
              placeholder='Select asset'
              options={assetList
                .filter(
                  (asset: IAssetListData) =>
                    !isRealEstateCarOrOther(asset.category)
                )
                .map((asset: IAssetListData) => ({
                  value: asset._id,
                  label: asset.name,
                }))}
              value={formData.assetId}
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
                value={formData.type}
                onSelect={handleOnTypeSelect}
              />
            </div>
          )}
        </>
      )}

      {/* Amount - Can Edit */}
      {selectedAsset?.category && (
        <div>
          <Label
            htmlFor='amount'
            text={amountLabel}
          />
          <Input
            type='number'
            name='amount'
            id='amount'
            placeholder='100'
            required
            value={formData.amount}
            onChange={handleOnChange}
          />
        </div>
      )}

      {/* Unit Price - (Stocks & Crypto) - Can Edit */}
      {isStocksOrCrypto(selectedAsset?.category) && (
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
            value={formData.pricePerUnit}
            onChange={handleOnChange}
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
