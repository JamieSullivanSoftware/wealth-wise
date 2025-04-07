'use client';
import { useEffect, useState } from 'react';
import { faPlus, faSort } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import {
  currencyFormat,
  getEuropeanYear,
  getMonthDate,
  getTime,
} from '@/utils/string';
import { getAssetList, getTransactions } from '@/utils/api';
import Button from '../Common/Button';
import IconButton from '../Common/IconButton';
import Paginator from './Paginator';
import TransactionAmountInfo from './TransactionAmountInfo';
import TableHeader from './TableHeader';
import NoResults from '../Common/NoResults';
import Loader from '../Common/Loader';
import Modal from '../Common/Modal';
import TransactionForm from '../Forms/TransactionForm';
import TablesContainer from '../Containers/TablesContainer';
import { deleteTransaction } from '@/app/actions/transactions';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { CATEGORIES } from '@/constants';

interface IProps {
  showFullData?: boolean;
}

const TransactionsTable = ({ showFullData }: IProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = session && status === 'authenticated';
  const [sort, setSort] = useState<ISort>({
    by: 'createdAt',
    order: 'desc',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [paginatedTransactions, setPaginatedTransactions] =
    useState<IPaginatedTransactions | null>(null);
  const [assetList, setAssetList] = useState<IAssetListData[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<
    ITransactionTableData | undefined
  >(undefined);

  const showHeaderButtons =
    showFullData &&
    isAuthenticated &&
    paginatedTransactions &&
    paginatedTransactions.transactions.length > 0;
  const hasAssetList = assetList && assetList.length > 0;

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

  const handleOnDelete = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction);
      await fetchTransactions();
    }
  };

  const getQuantityString = (
    amount: number,
    numUnits: number,
    category: string
  ) => {
    switch (category) {
      case CATEGORIES.stocks:
        return `${numUnits} Share${numUnits === 1 ? '' : 's'}`;
      case CATEGORIES.crypto:
        return `${numUnits} Coin${numUnits === 1 ? '' : 's'}`;
      case CATEGORIES.accounts:
        return currencyFormat.format(amount);
      default:
        return '';
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    const transactionsData = getTransactions(limit, sort.by, sort.order, page);
    const assetListData = getAssetList();
    const [transactions, assetsList] = await Promise.all([
      transactionsData,
      assetListData,
    ]);
    setPaginatedTransactions(transactions);
    setAssetList(assetsList);
    setIsLoading(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [sort.by, sort.order, page, limit]);

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
      {showHeaderButtons && (
        <div className='flex justify-end items-center col-span-12 mb-4'>
          <Button
            text='Add'
            onClick={() => setShowAddModal(true)}
            icon={faPlus}
            iconSize='lg'
            classes='bg-black text-white dark:text-black dark:bg-gray-100 py-2 px-4'
          />
        </div>
      )}
      <TablesContainer
        classes={`gap-6 col-span-12 rounded-xl dark:bg-dark-4 h-full items-start ${showFullData ? 'px-4 py-6' : 'p-6'}`}
      >
        {assetList && (
          <>
            <Modal
              show={showAddModal}
              onClose={() => setShowAddModal(false)}
              heading='Add Transaction'
            >
              <TransactionForm
                assetList={assetList}
                onTransactionAdded={fetchTransactions}
                isModalVisible={showAddModal}
              />
            </Modal>
          </>
        )}
        <Modal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          heading='Delete Transaction'
        >
          <p className='text-gray-900 dark:text-white'>
            Are you sure you want to delete this transaction?
          </p>
          <div className='flex gap-4 justify-end items-center mt-5'>
            <Button
              text='Confirm'
              onClick={handleOnDelete}
              classes='rounded-md font-medium py-2 px-4 text-white bg-danger dark:bg-danger'
            />
            <Button
              text='Cancel'
              onClick={() => setShowDeleteModal(false)}
              classes='rounded-md font-medium py-2 px-4 bg-black text-white dark:text-black dark:bg-gray-100'
            />
          </div>
        </Modal>
        {showFullData && paginatedTransactions ? (
          paginatedTransactions.transactions.length > 0 ? (
            <>
              <div className='px-2'>
                <TableHeader title='Transactions' />
              </div>
              <div>
                <div className='grid grid-cols-12 gap-2 px-2 mb-2 font-medium text-black dark:text-white text-sm'>
                  <div className='hidden col-span-2 xsm:flex items-center'>
                    <Button
                      text='Date'
                      onClick={() => handleSort('createdAt')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'createdAt' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='flex items-center col-span-4 sm:col-span-3'>
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
                  <div className='flex sm:hidden justify-center items-center col-span-2 xsm:col-span-1'>
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
                  <div className='flex items-center col-span-4 sm:col-span-3 justify-end sm:justify-start'>
                    <Button
                      text='Asset'
                      onClick={() => handleSort('assetName')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'assetName' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>
                  <div className='hidden sm:flex justify-center items-center col-span-1'>
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
                  <div className='hidden sm:flex sm:col-span-2 justify-end items-center'>
                    <Button
                      text='Quantity'
                      onClick={() => handleSort('type')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`${sort.by === 'type' ? 'font-bold' : 'font-normal'} py-0 px-0`}
                    />
                  </div>

                  <div className='col-span-1' />
                </div>

                {paginatedTransactions.transactions.map(
                  (transaction: ITransactionTableData, i: number) => {
                    const {
                      asset,
                      amount,
                      type,
                      createdAt,
                      numUnits,
                      isFirst,
                    } = transaction;

                    return (
                      <div
                        key={i}
                        className='grid grid-cols-12 py-3 text-xs text-black dark:text-white xsm:text-sm gap-2 px-2 rounded-md'
                      >
                        <div className='col-span-2 hidden xsm:flex flex-wrap items-center'>
                          {getEuropeanYear(new Date(createdAt))}
                        </div>
                        <div className='flex flex-wrap items-center col-span-4 sm:col-span-3'>
                          <TransactionAmountInfo
                            amount={amount}
                            type={type}
                            isFullTable
                          />
                        </div>
                        <div className='col-span-2 flex flex-wrap justify-center items-center sm:hidden xsm:col-span-1'>
                          <span className='text-sm'>{type.toUpperCase()}</span>
                        </div>
                        <div className='col-span-4 sm:col-span-3 flex flex-wrap items-center justify-end sm:justify-start text-end'>
                          {asset.name}
                        </div>
                        <div className='hidden sm:flex flex-wrap justify-center items-center sm:col-span-1'>
                          <span className='text-sm'>{type.toUpperCase()}</span>
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-end items-center sm:col-span-2'>
                          <span className=''>
                            {getQuantityString(
                              amount,
                              numUnits,
                              asset.category
                            )}
                          </span>
                        </div>

                        {!isFirst && (
                          <div className='col-span-2 xsm:col-span-1 flex flex-wrap justify-end items-center gap-2.5'>
                            <IconButton
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setShowDeleteModal(true);
                              }}
                              icon={faTrashAlt}
                              iconSize='sm'
                              iconColor='#e52020'
                              classes='enabled:hover:opacity-50 enabled:dark:hover:opacity-75'
                            />
                          </div>
                        )}
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
                title='No Transactions Available'
                subtitle={
                  hasAssetList ? undefined : 'Please create an asset first'
                }
                btnText={hasAssetList ? 'Add Transaction' : 'Add Asset'}
                onClick={
                  hasAssetList
                    ? () => setShowAddModal(true)
                    : () => router.push('/assets')
                }
              />
            </div>
          )
        ) : (
          <>
            <TableHeader
              title='Transactions'
              btnText='Add'
              onBtnClick={
                paginatedTransactions &&
                paginatedTransactions.transactions.length > 0
                  ? () => setShowAddModal(true)
                  : undefined
              }
            />
            <div className='mt-8 2lg:mt-0'>
              {paginatedTransactions &&
              paginatedTransactions.transactions.length > 0 ? (
                paginatedTransactions.transactions.map(
                  (transaction: ITransactionTableData, i: number) => {
                    const { asset, amount, createdAt, type } = transaction;
                    const date = new Date(createdAt);

                    return (
                      <div
                        className='grid grid-cols-12 pb-9 text-xs text-black dark:text-white xsm:text-sm'
                        key={i}
                      >
                        <TransactionAmountInfo
                          amount={amount}
                          type={type}
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
                )
              ) : (
                <div className='flex flex-col justify-center min-h-[500px]'>
                  <NoResults
                    title='No Transactions Yet'
                    subtitle={
                      assetList && assetList.length === 0
                        ? 'Please create an asset first'
                        : undefined
                    }
                    btnText={
                      assetList && assetList.length > 0
                        ? 'Add Transaction'
                        : undefined
                    }
                    onClick={() => setShowAddModal(true)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </TablesContainer>
    </>
  );
};

export default TransactionsTable;
