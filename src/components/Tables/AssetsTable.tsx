'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { currencyFormat, getEuropeanYear } from '@/utils/string';
import Button from '../Common/Button';
import {
  faPencilAlt,
  faPlus,
  faSort,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
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
import { deleteAsset } from '@/app/actions/assets';
import IconButton from '../Common/IconButton';

interface IProps {
  showFullData?: boolean;
  setShouldRefetchNetworth?: (loading: boolean) => void;
  shouldRefetchNetworth?: boolean;
}

const AssetsTable = ({
  showFullData,
  setShouldRefetchNetworth,
  shouldRefetchNetworth,
}: IProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = session && status === 'authenticated';
  const [sort, setSort] = useState<ISort>({
    by: 'createdAt',
    order: 'desc',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [paginatedAssets, setPaginatedAssets] =
    useState<IPaginatedAssets | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<
    IAssetTableData | undefined
  >(undefined);

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

  const handleOnDelete = async () => {
    if (selectedAsset) {
      await deleteAsset(selectedAsset._id);
      await fetchAssets();
    }
  };

  const getDetailsString = (asset: IAssetTableData): string => {
    let details = '';

    switch (asset.category) {
      case CATEGORIES.accounts:
        details = `${asset.accountType} Account`;
        break;
      case CATEGORIES.crypto:
        details = `${asset.numUnits} Coin${asset.numUnits && asset.numUnits === 1 ? '' : 's'}`;
        break;
      case CATEGORIES.stocks:
        details = `${asset.numUnits} Share${asset.numUnits && asset.numUnits === 1 ? '' : 's'}`;
        break;
      case CATEGORIES.realEstate:
        details = asset.address || '';
        break;
      case CATEGORIES.cars:
      case CATEGORIES.other:
        details = asset.details || '';
        break;
      default:
        break;
    }

    return details.length > 40 ? truncateDetails(details) : details;
  };

  const truncateDetails = (details: string) => {
    return `${details.substring(0, 40)}...`;
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    const assets = await getAssets(limit, sort.by, sort.order, page);
    setPaginatedAssets(assets);
    setIsLoading(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
    setShowEditModal(false);
    if (!showFullData && setShouldRefetchNetworth && !shouldRefetchNetworth) {
      setShouldRefetchNetworth(true);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [sort.by, sort.order, page, limit]);

  useEffect(() => {
    if (shouldRefetchNetworth) {
      fetchAssets();
    }
  }, [shouldRefetchNetworth]);

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
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        heading='Add Asset'
      >
        <AssetForm
          onAssetAdded={fetchAssets}
          isModalVisible={showAddModal}
        />
      </Modal>
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        heading='Edit Asset'
      >
        <AssetForm
          onAssetAdded={fetchAssets}
          asset={selectedAsset}
          isModalVisible={showEditModal}
        />
      </Modal>
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        heading='Delete Asset'
      >
        <p className='text-gray-900 dark:text-white'>
          Are you sure you want to delete this asset?
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
        classes={`gap-6 col-span-12 rounded-xl dark:bg-dark-4 ${showFullData ? 'px-4 py-6' : 'p-6'}`}
      >
        {showFullData && paginatedAssets ? (
          paginatedAssets.assets.length > 0 ? (
            <>
              <TableHeader title='Assets' />
              <div>
                <div className='grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-black dark:text-white xsm:text-xs'>
                  <div className='col-span-3 sm:col-span-2 hidden xsm:flex items-center'>
                    <Button
                      text='Created'
                      onClick={() => handleSort('createdAt')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'createdAt' ? 'font-bold' : 'font-normal'}`}
                    />
                  </div>
                  <div className='flex items-center col-span-6 sm:col-span-2 xsm:col-span-5'>
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
                  <div className='hidden col-span-3 sm:flex justify-center items-center sm:col-span-1'>
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
                  <div className='flex justify-start sm:justify-end items-center col-span-4 sm:col-span-2 xsm:col-span-3'>
                    <Button
                      text='Gains/Loss'
                      onClick={() => handleSort('gainsLossPercentage')}
                      icon={faSort}
                      iconAlign='right'
                      hasBg={false}
                      iconSize='xs'
                      classes={`py-0 px-0 text-sm xsm:text-base ${sort.by === 'gainsLossPercentage' ? 'font-bold' : 'font-normal'}`}
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
                  <div className='col-span-2 xsm:col-span-1 ' />
                </div>
                {paginatedAssets.assets.map(
                  (asset: IAssetTableData, i: number) => {
                    const {
                      createdAt,
                      name,
                      category,
                      cost,
                      value,
                      gainsLossPercentage,
                    } = asset;
                    return (
                      <div
                        key={i}
                        className='grid grid-cols-12 gap-2 py-3 text-xs text-black dark:text-white xsm:text-sm px-2 rounded-md'
                      >
                        <div className='col-span-3 sm:col-span-2 hidden xsm:flex  flex-wrap items-center'>
                          {getEuropeanYear(new Date(createdAt))}
                        </div>
                        <div className='justify-center flex flex-col flex-wrap gap-2 col-span-6 sm:col-span-2 xsm:col-span-5'>
                          <span className='font-medium'>{name}</span>
                          {getDetailsString(asset) && (
                            <span className='font-light'>
                              {getDetailsString(asset)}
                            </span>
                          )}
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-center items-center sm:col-span-1'>
                          {category}
                        </div>
                        <div className='flex flex-wrap justify-start sm:justify-end items-center col-span-4 sm:col-span-2 xsm:col-span-3'>
                          <AssetsChange
                            gainsLossPercentage={gainsLossPercentage}
                          />
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-center items-center sm:justify-end sm:col-span-2'>
                          {currencyFormat.format(cost)}
                        </div>
                        <div className='hidden col-span-3 sm:flex flex-wrap justify-end items-center sm:col-span-2'>
                          {currencyFormat.format(value)}
                        </div>
                        <div className='col-span-2 xsm:col-span-1 flex flex-wrap justify-end items-center gap-2.5'>
                          <IconButton
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowEditModal(true);
                            }}
                            icon={faPencilAlt}
                            iconSize='sm'
                            iconColor='#197f4c'
                            classes='enabled:hover:opacity-50 enabled:dark:hover:opacity-75'
                          />
                          <IconButton
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowDeleteModal(true);
                            }}
                            icon={faTrashAlt}
                            iconSize='sm'
                            iconColor='#e52020'
                            classes='enabled:hover:opacity-50 enabled:dark:hover:opacity-75'
                          />
                        </div>
                      </div>
                    );
                  }
                )}
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
                subtitle={isAuthenticated ? undefined : 'Login to add data'}
                btnText='Add Asset'
                onClick={() => setShowAddModal(true)}
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
                  ? () => setShowAddModal(true)
                  : undefined
              }
            />
            <div className='mt-4 2lg:mt-0'>
              {paginatedAssets && paginatedAssets.assets.length > 0 && (
                <div className='grid grid-cols-12 text-xs font-medium text-black dark:text-white xsm:text-sm 2lg:hidden'>
                  <div className='col-span-6 xsm:col-span-3 flex items-center'>
                    Name
                  </div>
                  <div className='col-span-6 xsm:col-span-3 flex justify-end items-center xsm:justify-center'>
                    Change
                  </div>
                  <div className='col-span-3 hidden xsm:flex justify-center items-center 2lg:justify-end'>
                    Cost
                  </div>
                  <div className='hidden col-span-3 xsm:flex justify-end items-center'>
                    Value
                  </div>
                </div>
              )}
              {paginatedAssets && paginatedAssets.assets?.length > 0 ? (
                paginatedAssets.assets.map(
                  (asset: IAssetTableData, i: number) => (
                    <div
                      key={i}
                      className='grid grid-cols-12 py-4 text-xs text-black dark:text-white xsm:text-sm mb-0 2lg:mb-5'
                    >
                      <div className='col-span-6 xsm:col-span-3 flex flex-col gap-2 flex-wrap justify-center'>
                        <span className='font-medium'>{asset.name}</span>
                        <span className='font-light'>
                          {getDetailsString(asset)}
                        </span>
                      </div>
                      <div className='col-span-6 xsm:col-span-3 flex flex-wrap justify-end items-center xsm:justify-center'>
                        <AssetsChange
                          gainsLossPercentage={asset.gainsLossPercentage}
                        />
                      </div>
                      <div className='col-span-3 hidden xsm:flex flex-wrap justify-center items-center 2lg:justify-end'>
                        {currencyFormat.format(asset.cost)}
                      </div>
                      <div className='hidden col-span-3 xsm:flex flex-wrap justify-end items-center'>
                        {currencyFormat.format(asset.value)}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className='flex flex-col justify-center min-h-[500px]'>
                  <NoResults
                    title='No Assets Yet'
                    btnText='Add Asset'
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

export default AssetsTable;
