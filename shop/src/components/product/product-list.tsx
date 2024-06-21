import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
// import { siteSettings } from '@/settings/site.settings';
// import usePrice from '@/utils/use-price';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { NoDataFound } from '@/components/icons/no-data-found';
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
          title={t('table:table-item-title')}
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
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { image, type }: { image: any; type: any }) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{name}</span>
            
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
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_authority'),
      render: (domain_authority:number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{domain_authority}</span>
            
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
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_rating'),
      render: (domain_rating: number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{domain_rating}</span>
            
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
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('organic_traffic'),
      render: (organic_traffic: number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{organic_traffic}</span>
            
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
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('spam_score'),
      render: (spam_score: number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{spam_score}</span>
            
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
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('link_type'),
      render: (link_type: number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{link_type}</span>
            
          </div>
        </div>
      ),
    },
    {
      title: "Countries",
      className: 'cursor-pointer',
      dataIndex: 'countries',
      key: 'countries',
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('countries'),
      render: (countries: number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="truncate font-medium">{countries}</span>
            
          </div>
        </div>
      ),
    },
    {
      title: "Guest Post",
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (countries: number) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <button className="border rounded-lg hover:text-white hover:bg-brand border-brand px-4 py-2">Buy ${countries}</button>
            
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
      <div className="mb-6 m-3 overflow-hidden rounded shadow">
        <Table
          /* @ts-ignore */
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={products}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
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
