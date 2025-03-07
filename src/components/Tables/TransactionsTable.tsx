'use client';
import { useEffect, useState } from 'react';
import { faSort } from '@fortawesome/free-solid-svg-icons';

import {
  currencyFormat,
  getEuropeanYear,
  getMonthDate,
  getTime,
} from '@/utils/string';
import { getTransactions } from '@/utils/api';
import Button from '../Common/Button';
import Paginator from './Paginator';
import TransactionAmountInfo from './TransactionAmountInfo';
import TableHeader from './TableHeader';
import NoResults from '../Common/NoResults';
import { useFirstRender } from '@/hooks/useFirstRender';
import Loader from '../Common/Loader';
import Modal from '../Common/Modal';

interface IProps {
  transactions: IPaginatedTransactions;
  showFullData?: boolean;
}

const TransactionsTable = ({ transactions, showFullData }: IProps) => {
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
    useState<IPaginatedTransactions>(transactions);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getTransactions(
        limit,
        sort.by,
        sort.order,
        page
      );
      setPaginatedTransactions(transactions);
    };
    if (!isFirstRender && showFullData) {
      setIsLoading(true);
      fetchTransactions().finally(() => setIsLoading(false));
    }
  }, [sort, sort.by, sort.order, page, limit, showFullData, isFirstRender]);

  if (isLoading) {
    return <Loader isFullScreen />;
  }

  return (
    <>
      <Modal
        show={showModal}
        onClose={() => handleToggleModal(false)}
        heading='Add Transaction'
      >
        <div>Transactions</div>
      </Modal>
      {showFullData ? (
        paginatedTransactions.transactions.length > 0 ? (
          <>
            <TableHeader title='Transactions' />
            <div>
              <div className='grid grid-cols-12 mb-2 text-xs font-medium text-black dark:text-white xsm:text-sm'>
                <div className='col-span-3 sm:col-span-2 flex items-center'>
                  <Button
                    text='Date'
                    onClick={() => handleSort('updatedAt')}
                    icon={faSort}
                    iconAlign='right'
                    hasBg={false}
                    iconSize='xs'
                    classes={
                      sort.by === 'updatedAt' ? 'font-bold' : 'font-normal'
                    }
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
                    classes={sort.by === 'amount' ? 'font-bold' : 'font-normal'}
                  />
                </div>
                <div className='col-span-3 flex sm:col-span-1 justify-end sm:justify-center items-center'>
                  <Button
                    text='Type'
                    onClick={() => handleSort('type')}
                    icon={faSort}
                    iconAlign='right'
                    hasBg={false}
                    iconSize='xs'
                    classes={sort.by === 'type' ? 'font-bold' : 'font-normal'}
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
                    classes={
                      sort.by === 'assetCategory' ? 'font-bold' : 'font-normal'
                    }
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
                    classes={
                      sort.by === 'assetName' ? 'font-bold' : 'font-normal'
                    }
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
                    classes={
                      sort.by === 'assetTotal' ? 'font-bold' : 'font-normal'
                    }
                  />
                </div>
              </div>

              {paginatedTransactions.transactions.map(
                (transaction: ITransactionData, i: number) => {
                  const { asset, amount, type, assetTotal, updatedAt } =
                    transaction;

                  return (
                    <div
                      className='grid grid-cols-12 py-3 text-xs text-black dark:text-white xsm:text-sm'
                      key={i}
                    >
                      <div className='col-span-3 sm:col-span-2 flex flex-wrap items-center'>
                        {getEuropeanYear(new Date(updatedAt))}
                      </div>
                      <div className='col-span-6 flex flex-wrap items-center sm:col-span-3'>
                        <TransactionAmountInfo
                          amount={amount}
                          isFullTable
                        />
                      </div>
                      <div className='font-medium col-span-3 flex flex-wrap justify-end sm:justify-center items-center sm:col-span-1'>
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
            {paginatedTransactions.transactions.map(
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
    </>
  );
};

export default TransactionsTable;
