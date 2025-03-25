'use client';
import Label from './Label';
import Input from './Input';
import Select from './Select';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import Button from '../Common/Button';
import { addTransaction, editTransaction } from '@/app/actions/transactions';
import { useEffect, useState } from 'react';
import { hasCategoryGotShares } from '@/utils/misc';

interface IProps {
  assetList: IAssetListData[];
  onTransactionAdded: () => void;
  transaction?: ITransactionData;
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

  useEffect(() => {
    if (transaction) {
      setSelectedType(transaction.type);
      setSelectedAsset(transaction.asset);
    }
  }, [transaction?.type, transaction?.asset]);

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      {/* Amount */}
      <div>
        <Label
          htmlFor='amount'
          text='Amount'
        />
        <Input
          type='number'
          name='amount'
          id='amount'
          placeholder='e.g. 150.00'
          required
          defaultValue={transaction?.amount}
        />
      </div>

      {/* Asset - Only Show on Add Modal */}
      {!transaction && (
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
      )}

      {/* Asset & Number of Shares Only Show on Add Modal */}
      {selectedAsset && hasCategoryGotShares(selectedAsset.category) && (
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
            defaultValue={transaction?.numShares}
          />
        </div>
      )}

      {/* Type */}
      <div>
        <Label
          htmlFor='type'
          text='Transaction Type'
        />
        <Select
          name='type'
          id='type'
          placeholder='Select type'
          options={Object.values(TRANSACTION_TYPES).map((type: string) => ({
            value: type,
            label: type,
          }))}
          value={selectedType}
          onSelect={handleOnTypeSelect}
        />
      </div>

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
