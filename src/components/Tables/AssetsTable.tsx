'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { currencyFormat, getEuropeanYear } from '@/utils/string';
import Button from '../Common/Button';
import { faPlus, faSort } from '@fortawesome/free-solid-svg-icons';
import { getAssets } from '@/utils/api';
import Paginator from './Paginator';
import TableHeader from './TableHeader';
import AssetsChange from './AssetsChange';
import NoResults from '../Common/NoResults';
import { CATEGORIES } from '@/constants';
import Loader from '../Common/Loader';
import Modal from '../Common/Modal';
import AssetForm from '../Forms/AssetForm';
import TablesContainer from '../Containers/TablesContainer';
import { deleteAssets } from '@/app/actions/addAsset';

interface IProps {
  showFullData?: boolean;
}

const AssetsTable = ({ showFullData }: IProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = session && status === 'authenticated';
  const [sort, setSort] = useState<ISort>({
    by: 'updatedAt',
    order: 'desc',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [paginatedAssets, setPaginatedAssets] =
    useState<IPaginatedAssets | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditDisabled, setIsEditDisabled] = useState<boolean>(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(false);

  const showHeaderButtons =
    showFullData &&
    isAuthenticated &&
    paginatedAssets &&
    paginatedAssets.assets.length > 0;

  const handleSort = (sortBy: AssetSortBy) => {
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

  const refetchAssets = async () => {
    const assets = await getAssets(limit, sort.by, sort.order, page);
    setPaginatedAssets(assets);
    setShowModal(false);
  };

  const handleOnDelete = async () => {
    await deleteAssets(selectedIds);
    await refetchAssets();
  };

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      const assets = await getAssets(limit, sort.by, sort.order, page);
      setPaginatedAssets(assets);
    };

    fetchAssets().finally(() => setIsLoading(false));
  }, [sort.by, sort.order, page, limit]);

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
        <div className='flex justify-between items-center col-span-12 mb-4'>
          <div>
            <Button
              text='Add'
              onClick={() => handleToggleModal(true)}
              icon={faPlus}
              iconSize='lg'
              classes='bg-black text-white dark:text-black dark:bg-gray-100'
            />
          </div>
          <div className='flex gap-4'>
            <Button
              text='Edit'
              onClick={() => console.log('Edit')}
              classes='bg-black text-white dark:text-black dark:bg-gray-100'
              isDisabled={!isEditDisabled}
            />
            <Button
              text='Delete'
              onClick={handleOnDelete}
              classes='text-white bg-danger dark:bg-danger'
              hasBg
              isDisabled={!isDeleteDisabled}
            />
          </div>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => handleToggleModal(false)}
        heading='Add Asset'
      >
        <AssetForm onAssetAdded={refetchAssets} />
      </Modal>
      <TablesContainer
        classes={`gap-6 col-span-12 rounded-xl dark:bg-dark-4 ${showFullData ? 'px-4 py-6' : 'p-6'}`}
      >
        {showFullData && paginatedAssets ? (
          paginatedAssets.assets.length > 0 ? (
            <>
              <TableHeader title='Assets' />
              <div>
                <div className='grid grid-cols-12 mb-2 text-xs font-medium text-black dark:text-white xsm:text-xs'>
                  <div className='col-span-3 sm:col-span-2 flex items-center'>
                    <Button
                      text='Date'
                      onClick={() => handleSort('updatedAt')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'updatedAt' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                  <div className='col-span-6 flex sm:col-span-2 items-center'>
                    <Button
                      text='Name'
                      onClick={() => handleSort('name')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'name' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                  <div className='hidden col-span-3 sm:flex justify-center items-center sm:col-span-2'>
                    <Button
                      text='Category'
                      onClick={() => handleSort('category')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'category' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                  <div className='col-span-3 flex justify-end items-center sm:col-span-2'>
                    <Button
                      text='Change'
                      onClick={() => handleSort('diffPercentage')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'diffPercentage' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                  <div className='hidden col-span-3 sm:flex justify-center items-center sm:justify-end sm:col-span-2'>
                    <Button
                      text='Cost'
                      onClick={() => handleSort('cost')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'cost' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                  <div className='hidden col-span-3 sm:flex justify-end items-center sm:col-span-2'>
                    <Button
                      text='Value'
                      onClick={() => handleSort('value')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'value' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                </div>
                {paginatedAssets.assets.map((asset: IAssetData, i: number) => {
                  const {
                    _id,
                    updatedAt,
                    name,
                    category,
                    cost,
                    value,
                    diffPercentage,
                    detail,
                    numShares,
                  } = asset;
                  return (
                    <div
                      key={i}
                      className='grid grid-cols-12 py-3 text-xs text-black dark:text-white xsm:text-sm hover:bg-gray-1 dark:hover:bg-opacity-10 cursor-pointer px-2 rounded-md'
                      onClick={() => handleOnSelect(_id)}
                    >
                      <div className='col-span-3 sm:col-span-2 flex flex-wrap items-center'>
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
                      <div className='justify-center col-span-6 flex flex-col flex-wrap gap-2 sm:justify-start sm:col-span-2'>
                        <span className='font-medium'>{name}</span>
                        <span className='font-light'>
                          {category === CATEGORIES.stocks ||
                          category === CATEGORIES.crypto
                            ? `${numShares} Share${numShares > 1 ? 's' : ''}`
                            : detail}
                        </span>
                      </div>
                      <div className='hidden col-span-3 sm:flex flex-wrap justify-center items-center sm:col-span-2'>
                        {category}
                      </div>
                      <div className='col-span-3 flex flex-wrap justify-end items-center sm:col-span-2'>
                        <AssetsChange diffPercentage={diffPercentage} />
                      </div>
                      <div className='hidden col-span-3 sm:flex flex-wrap justify-center items-center sm:justify-end sm:col-span-2'>
                        {currencyFormat.format(cost)}
                      </div>
                      <div className='hidden col-span-3 sm:flex flex-wrap justify-end items-center sm:col-span-2'>
                        {currencyFormat.format(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Paginator
                totalCount={paginatedAssets.totalCount}
                totalPages={paginatedAssets.totalPages}
                currentPage={paginatedAssets.currentPage}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          ) : (
            <div className='flex flex-col justify-center min-h-[500px]'>
              <NoResults
                title='No Assets Available'
                btnText='Add Asset'
                onClick={() => handleToggleModal(true)}
              />
            </div>
          )
        ) : (
          <>
            <TableHeader
              title='Assets'
              btnText='Add'
              onBtnClick={
                paginatedAssets && paginatedAssets.assets.length > 0
                  ? () => handleToggleModal(true)
                  : undefined
              }
            />
            <div className='mt-8 2lg:mt-0'>
              {paginatedAssets && paginatedAssets.assets.length > 0 && (
                <div className='grid grid-cols-12 text-xs font-medium text-black dark:text-white xsm:text-sm'>
                  <div className='col-span-3 flex items-center'>Name</div>
                  <div className='col-span-3 flex justify-center 2lg:justify-end items-center'>
                    Change
                  </div>
                  <div className='col-span-3 flex justify-center items-center 2lg:justify-end'>
                    Cost
                  </div>
                  <div className='col-span-3 flex justify-end items-center'>
                    Value
                  </div>
                </div>
              )}
              {paginatedAssets && paginatedAssets.assets?.length > 0 ? (
                paginatedAssets.assets.map((asset: IAssetData, i: number) => (
                  <div
                    key={i}
                    className='grid grid-cols-12 py-4 text-xs text-black dark:text-white xsm:text-sm'
                  >
                    <div className='col-span-3 flex flex-col gap-2 flex-wrap'>
                      <span className='font-medium'>{asset.name}</span>
                      <span className='font-light overflow-hidden whitespace-nowrap text-ellipsis 2xsm:inline-block hidden 2lg:w-[180px] md:w-[200px] xsm:w-[140px] 2xsm:w-[90px]'>
                        {asset.category === CATEGORIES.stocks ||
                        asset.category === CATEGORIES.crypto
                          ? `${asset.numShares} Share${asset.numShares > 1 ? 's' : ''}`
                          : `${asset.detail}`}
                      </span>
                    </div>
                    <div className='col-span-3 flex flex-wrap justify-center 2lg:justify-end items-center'>
                      <AssetsChange diffPercentage={asset.diffPercentage} />
                    </div>
                    <div className='col-span-3 flex flex-wrap justify-center items-center 2lg:justify-end'>
                      {currencyFormat.format(asset.cost)}
                    </div>
                    <div className='col-span-3 flex flex-wrap justify-end items-center'>
                      {currencyFormat.format(asset.value)}
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex flex-col justify-center min-h-[500px]'>
                  <NoResults
                    title='No Assets Yet'
                    btnText='Add Asset'
                    onClick={() => handleToggleModal(true)}
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

export default AssetsTable;
