'use client';
import { useEffect, useState } from 'react';
import { faSort } from '@fortawesome/free-solid-svg-icons';

import {
  currencyFormat,
  getEuropeanYear,
  getMonthDate,
  getTime,
} from '@/utils/string';
import { getAssetList, getTransactions } from '@/utils/api';
import Button from '../Common/Button';
import Paginator from './Paginator';
import TransactionAmountInfo from './TransactionAmountInfo';
import TableHeader from './TableHeader';
import NoResults from '../Common/NoResults';
import { useFirstRender } from '@/hooks/useFirstRender';
import Loader from '../Common/Loader';
import Modal from '../Common/Modal';
import TransactionForm from '../Forms/TransactionForm';
import TablesContainer from '../Containers/TablesContainer';

interface IProps {
  showFullData?: boolean;
}

const TransactionsTable = ({ showFullData }: IProps) => {
  const isFirstRender = useFirstRender();
  const [sort, setSort] = useState<ISort>({
    by: 'updatedAt',
    order: 'desc',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [paginatedTransactions, setPaginatedTransactions] =
    useState<IPaginatedTransactions | null>(null);
  const [assetList, setAssetList] = useState<IAssetListData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditDisabled, setIsEditDisabled] = useState<boolean>(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(false);
  const [selectedTransactions, setSelectedTransactions] = useState<
    ITransactionData[]
  >([]);

  const handleSort = (sortBy: TransactionSortBy) => {
    let orderBy = 'desc';
    if (sortBy === sort.by && sort.order === 'desc') {
      orderBy = 'asc';
    }
    setSort({
      by: sortBy,
      order: orderBy,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (limit: string) => {
    const numLimit = Number(limit);
    if (isNaN(Number(numLimit))) {
      return;
    }
    setPage(1);
    setLimit(numLimit);
  };

  const handleToggleModal = (show: boolean) => {
    setShowModal(show);
  };

  const handleOnSelect = (_id: string) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(_id)) {
        return prevSelectedIds.filter((id) => id !== _id);
      } else {
        return [...prevSelectedIds, _id];
      }
    });
  };

  const handleOnEdit = () => {
    const id = selectedIds[0];
    const transaction = paginatedTransactions?.transactions.find(
      (transaction) => transaction._id === id
    );
    if (transaction) {
      setSelectedTransactions([transaction]);
    }
  };

  const refetchTransactions = async () => {
    const transactions = await getTransactions(
      limit,
      sort.by,
      sort.order,
      page
    );
    setPaginatedTransactions(transactions);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      const transactionsData = getTransactions(
        limit,
        sort.by,
        sort.order,
        page
      );
      const assetListData = getAssetList();
      const [transactions, assetsList] = await Promise.all([
        transactionsData,
        assetListData,
      ]);
      setPaginatedTransactions(transactions);
      setAssetList(assetsList);
    };

    fetchTransactions().finally(() => setIsLoading(false));
  }, [sort, sort.by, sort.order, page, limit, showFullData, isFirstRender]);

  useEffect(() => {
    if (selectedIds.length === 1) {
      setIsEditDisabled(true);
    } else {
      setIsEditDisabled(false);
    }
    if (selectedIds.length >= 1) {
      setIsDeleteDisabled(true);
    } else {
      setIsDeleteDisabled(false);
    }
  }, [selectedIds]);

  useEffect(() => {
    if (selectedTransactions.length === 1) {
      setShowModal(true);
    }
  }, [selectedTransactions]);

  if (isLoading) {
    return (
      <div className='grid col-span-12'>
        <Loader
          isFullScreen
          isTransparent
        />
      </div>
    );
  }

  return (
    <>
      {showFullData && (
        <div className='flex justify-end gap-4 col-span-12 mb-4 '>
          <Button
            text='Edit'
            onClick={handleOnEdit}
            isDisabled={!isEditDisabled}
          />
          <Button
            text='Delete'
            onClick={() => console.log('Edit')}
            classes='bg-danger dark:bg-danger dark:text-white'
            hasBg
            isDisabled={!isDeleteDisabled}
          />
        </div>
      )}
      <TablesContainer
        classes={`gap-6 col-span-12 rounded-xl dark:bg-dark-4 h-full items-start ${showFullData ? 'px-4 py-6' : 'p-6'}`}
      >
        {assetList && (
          <Modal
            show={showModal}
            onClose={() => handleToggleModal(false)}
            heading='Add Transaction'
          >
            <TransactionForm
              assetList={assetList}
              onTransactionAdded={refetchTransactions}
              transaction={
                selectedTransactions.length === 1
                  ? selectedTransactions[0]
                  : undefined
              }
            />
          </Modal>
        )}
        {showFullData && paginatedTransactions ? (
          paginatedTransactions.transactions.length > 0 ? (
            <>
              <div className='px-2'>
                <TableHeader title='Transactions' />
              </div>
              <div>
                <div className='grid grid-cols-12 px-2 mb-2 text-xs font-medium text-black dark:text-white xsm:text-sm'>
                  <div className='col-span-4 sm:col-span-2 flex items-center'>
                    <Button
                      text='Date'
                      onClick={() => handleSort('updatedAt')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'updatedAt' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='col-span-6 flex sm:col-span-3 items-center'>
                    <Button
                      text='Amount'
                      onClick={() => handleSort('amount')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'amount' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='col-span-2 flex sm:col-span-1 justify-end sm:justify-center items-center'>
                    <Button
                      text='Type'
                      onClick={() => handleSort('type')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'type' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='hidden col-span-3 sm:col-span-2 sm:flex justify-end sm:justify-center items-center'>
                    <Button
                      text='Category'
                      onClick={() => handleSort('assetCategory')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'assetCategory' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='hidden col-span-3 sm:flex justify-end items-center sm:col-span-2'>
                    <Button
                      text='Asset Name'
                      onClick={() => handleSort('assetName')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'assetName' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='hidden col-span-3 sm:flex justify-end items-center sm:col-span-2'>
                    <Button
                      text='Asset Total'
                      onClick={() => handleSort('assetTotal')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'assetTotal' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                </div>

                {paginatedTransactions.transactions.map(
                  (transaction: ITransactionData, i: number) => {
                    const { _id, asset, amount, type, assetTotal, updatedAt } =
                      transaction;

                    return (
                      <div
                        key={i}
                        className='grid grid-cols-12 py-3 text-xs text-black dark:text-white xsm:text-sm  hover:bg-gray-1 dark:hover:bg-opacity-10 cursor-pointer px-2 rounded-md'
                        onClick={() => handleOnSelect(_id)}
                      >
                        <div className='col-span-4 sm:col-span-2 flex flex-wrap items-center'>
                          <span>
                            <input
                              readOnly
                              type='checkbox'
                              className='mt-1 mr-4'
                              checked={selectedIds.includes(_id)}
                            />
                          </span>
                          <span>{getEuropeanYear(new Date(updatedAt))}</span>
                        </div>
                        <div className='col-span-6 flex flex-wrap items-center sm:col-span-3'>
                          <TransactionAmountInfo
                            amount={amount}
                            isFullTable
                          />
                        </div>
                        <div className='font-medium col-span-2 flex flex-wrap justify-end sm:justify-center items-center sm:col-span-1'>
                          {type.toUpperCase()}
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-end sm:justify-center items-center sm:col-span-2'>
                          {asset.category}
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-end items-center sm:col-span-2'>
                          {asset.name}
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-end items-center sm:col-span-2'>
                          {currencyFormat.format(assetTotal)}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <Paginator
                totalCount={paginatedTransactions.totalCount}
                totalPages={paginatedTransactions.totalPages}
                currentPage={paginatedTransactions.currentPage}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          ) : (
            <div className='flex flex-col justify-center min-h-[500px]'>
              <NoResults
                text='No Transactions yet'
                btnText='Add Transaction'
              />
            </div>
          )
        ) : (
          <>
            <TableHeader
              title='Transactions'
              btnText='Add'
              onBtnClick={() => handleToggleModal(true)}
            />
            <div className='mt-8 2lg:mt-0'>
              {paginatedTransactions &&
                paginatedTransactions.transactions.map(
                  (transaction: ITransactionData, i: number) => {
                    const { asset, amount, updatedAt } = transaction;
                    const date = new Date(updatedAt);

                    return (
                      <div
                        className='grid grid-cols-12 pb-9 text-xs text-black dark:text-white xsm:text-sm'
                        key={i}
                      >
                        <TransactionAmountInfo
                          amount={amount}
                          assetName={asset.name}
                        />
                        <div className='hidden col-span-3 justify-center items-center xsm:flex 2lg:hidden'>
                          {asset?.name}
                        </div>
                        <div className='hidden col-span-3 justify-center items-center xsm:flex 2lg:hidden'>
                          {asset?.category}
                        </div>
                        <div className='hidden gap-1 col-span-3 justify-end items-center xsm:flex 2lg:hidden'>
                          {getEuropeanYear(date)}
                        </div>
                        <div className='gap-1 col-span-2 flex flex-col justify-center items-end xsm:hidden 2lg:flex'>
                          <p>{getMonthDate(date)}</p>
                          <p>{getTime(date)}</p>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </>
        )}
      </TablesContainer>
    </>
  );
};

export default TransactionsTable;
