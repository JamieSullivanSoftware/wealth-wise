'use client';
import { currencyFormat, getEuropeanYear } from '@/utils/string';
import Button from '../Common/Button';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { getAssets } from '@/utils/api';
import Paginator from './Paginator';
import TableHeader from './TableHeader';
import AssetsChange from './AssetsChange';
import NoResults from '../Common/NoResults';
import { CATEGORIES } from '@/constants';
import Loader from '../Common/Loader';
import { useFirstRender } from '@/hooks/useFirstRender';
import Modal from '../Common/Modal';
import NewAssetForm from '../Forms/NewAssetForm';

interface IProps {
  assets: IPaginatedAssets;
  showFullData?: boolean;
}

const AssetsTable = ({ assets, showFullData }: IProps) => {
  const isFirstRender = useFirstRender();
  const [sort, setSort] = useState<ISort>({
    by: 'updatedAt',
    order: 'desc',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [paginatedAssets, setPaginatedAssets] =
    useState<IPaginatedAssets>(assets);

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

  const refetchAssets = async () => {
    const assets = await getAssets(limit, sort.by, sort.order, page);
    setPaginatedAssets(assets);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      const assets = await getAssets(limit, sort.by, sort.order, page);
      setPaginatedAssets(assets);
    };
    if (!isFirstRender && showFullData) {
      setIsLoading(true);
      fetchAssets().finally(() => setIsLoading(false));
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
        heading='Add Asset'
      >
        <NewAssetForm onAssetAdded={refetchAssets} />
      </Modal>
      {showFullData ? (
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
                    className='grid grid-cols-12 py-3 text-xs text-black dark:text-white xsm:text-sm'
                    key={i}
                  >
                    <div className='col-span-3 sm:col-span-2 flex flex-wrap items-center'>
                      {getEuropeanYear(new Date(updatedAt))}
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
              text='No Assets yet'
              btnText='Add Asset'
            />
          </div>
        )
      ) : (
        <>
          <TableHeader
            title='Assets'
            btnText='Add'
            onBtnClick={() => handleToggleModal(true)}
          />
          <div className='mt-8 2lg:mt-0'>
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
            {paginatedAssets.assets.map((asset: IAssetData, i: number) => (
              <div
                className='grid grid-cols-12 py-4 text-xs text-black dark:text-white xsm:text-sm'
                key={i}
              >
                <div className='col-span-3 flex flex-col gap-2 flex-wrap'>
                  <span className='font-medium'>{asset.name}</span>
                  <span className='font-light'>
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
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default AssetsTable;
