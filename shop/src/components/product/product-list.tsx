import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
// import { siteSettings } from '@/settings/site.settings';
// import usePrice from '@/utils/use-price';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { NoDataFound } from '@/components/icons/no-data-found';
import { CircularProgress } from '@mui/material';
import {
  Product,
  MappedPaginatorInfo,
  ProductType,
  Shop,
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
// import { Routes } from '@/config/routes';
// import LanguageSwitcher from '@/components/ui/lang-action/action';

export type IProps = {
  loading: boolean;
  products: Product[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const ProductInventoryList = ({
  loading,
  products,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = products! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const {
    query: { shop },
  } = router;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  let columns = [
    {
      title: (
        <TitleWithSort
          title={t('Domain Name')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { image, type }: { image: any; type: any }) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <a href={`https://${name}`} className="truncate font-large hover:underline text-blue-700 dark:text-blue-500 text-[16px] tracking-wider ">{name}</a>
            <span className='text-brand hover:underline'>Add to campaign</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('DA')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_authority'
          }
          isActive={sortingObj.column === 'domain_authority'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_authority',
      key: 'domain_authority',
      // align: alignLeft,
      width: 50,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_authority'),
      render: (domain_authority: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col ">
            <span className="truncate font-medium  text-brand bg-brand/10 px-4 py-1 rounded-lg">{domain_authority}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('DR')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_rating'
          }
          isActive={sortingObj.column === 'domain_rating'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_rating',
      key: 'domain_rating',
      // align: alignLeft,
      width: 50,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_rating'),
      render: (domain_rating: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{domain_rating}</span>

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('SC')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'spam_score'
          }
          isActive={sortingObj.column === 'spam_score'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'spam_score',
      key: 'spam_score',
      // align: alignLeft,
      width: 50,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('spam_score'),
      render: (spam_score: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{spam_score}</span>

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Traffic')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'organic_traffic'
          }
          isActive={sortingObj.column === 'organic_traffic'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'organic_traffic',
      key: 'organic_traffic',
      // align: alignLeft,
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('organic_traffic'),
      render: (organic_traffic: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{organic_traffic}</span>

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Links')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'link_type'
          }
          isActive={sortingObj.column === 'link_type'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'link_type',
      key: 'link_type',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('link_type'),
      render: (link_type: string) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            {
              link_type==='Dofollow'?(
              <span className="truncate font-medium text-purple-500 bg-brand/10 px-4 py-1 rounded-lg">{link_type}</span>
              ):
              (
                <span className="truncate font-medium text-blue-500 bg-brand/10 px-4 py-1 rounded-lg">{link_type}</span>

              )
            }
          </div>
        </div>
      ),
    },
    {
      title: "Language",
      className: 'cursor-pointer',
      dataIndex: 'languages',
      key: 'languages',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('languages'),
      render: (languages: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <button className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{languages}</button>
          </div>
        </div>
      ),
    },
    {
      title: "GP",
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (price: number, { slug }: { slug: any }) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <button onClick={() => router.push(`/products/product_page/${slug}`)} className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition duration-300 hover:text-white hover:bg-brand border-brand py-1">Buy ${price}</button>
          </div>
        </div>
      ),
    },
    {
      title: "LI",
      className: 'cursor-pointer',
      dataIndex: 'isLinkInsertion',
      key: 'isLinkInsertion',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (isLinkInsertion: string, { price, type, slug }: { price: any; type: any, slug: any }) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            {isLinkInsertion === '1' ? (
              <button onClick={() => router.push(`/products/product_page/${slug}`)} className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition duration-300 hover:text-white hover:bg-brand border-brand py-1">Buy ${price}</button>
            ) : (
              <button className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition duration-300 hover:text-white hover:bg-brand border-brand py-1">N/A</button>
            )
            }
          </div>
        </div>
      ),
    },
    {
      title: "Grey Niche",
      className: 'cursor-pointer',
      dataIndex: 'is_niche',
      key: 'is_niche',
      // align: alignLeft,
      width: 80,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (is_niche: string) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            {is_niche === '1' ? (
              <button className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition border-brand py-1">Available</button>

            ) : (
              <button className="border justify-center w-[5rem] rounded-lg text-brand font-bold border-brand py-1">N/A</button>
            )}
          </div>
        </div>
      ),
    },

  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

  return (
    <>
  <div className="mb-6 m-3 overflow-hidden bg-white dark:bg-dark-100 rounded-lg shadow">
    {loading ? (
      <div className="flex justify-center items-center w-full h-64">
        <CircularProgress />
      </div>
    ) : (
      <Table
        /* @ts-ignore */
        columns={columns}
        emptyText={() => (
          <div className="flex flex-col items-center py-7">
            <NoDataFound className="w-52" />
            <div className="mb-1 pt-6 text-base font-semibold text-heading">
              {t('No data found')}
            </div>
            <p className="text-[13px]">
              {t('Sorry we couldn’t find any data')}
            </p>
          </div>
        )}
        data={products}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    )}
  </div>

  {!!paginatorInfo?.total && (
    <div className="flex mb-5 font items-center justify-center">
      <Pagination
        total={paginatorInfo.total}
        current={paginatorInfo.currentPage}
        pageSize={paginatorInfo.perPage}
        onChange={onPagination}
        showLessItems
      />
    </div>
  )}
</>

  );
};

export default ProductInventoryList;
