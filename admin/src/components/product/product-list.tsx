import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import Badge from '@/components/ui/badge/badge';
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
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';

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

const ProductList = ({
  products,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = products! ?? {};
  const router = useRouter();
  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
    sort: SortOrder.Desc,
    column: null,
  });
  console.log('products', products);
  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
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
    // {
    //   title: t('table:table-item-id'),
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft,
    //   width: 130,
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'center',
      width: 130,
      render: (slug: string, record: Product) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          // deleteModalView="DELETE_PRODUCT"
          routes={Routes?.product}
          enablePreviewMode={true}
          // isShop={Boolean(shop)}
          shopSlug={(shop as string) ?? ''}
        />
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-product')}
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
      width: 220,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { image, type }: { image: any; type: any }) => (
        <div className="flex items-center">
          {/* <div className="relative aspect-square h-10 w-10 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5">
            <Image
              src={image?.thumbnail ?? siteSettings.product.placeholder}
              alt={name}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div> */}
          <div className="flex flex-col">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate whitespace-nowrap pt-1 pb-0.5 text-[13px] text-body/80">
              {type?.name}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('Link type')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'link_type'
    //       }
    //       isActive={sortingObj.column === 'link_type'}
    //     />
    //   ),
    //   dataIndex: 'link_type',
    //   key: 'link_type',
    //   width: 150,
    //   align: alignLeft,
    //   render: (link_type: string) => (
    //     <span className="truncate whitespace-nowrap capitalize">
    //       {link_type}
    //     </span>
    //   ),
    // },
    {
      title: (
        <TitleWithSort
          title={t('DA')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'domain_authority'
          }
          isActive={sortingObj.column === 'domain_authority'}
        />
      ),
      dataIndex: 'domain_authority',
      key: 'domain_authority',
      width: 100,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_authority'),
      render: (domain_authority: string) => (
        <span className="truncate whitespace-nowrap text-green-600 capitalize bg-green-100 px-2 py-1 rounded">
          {domain_authority}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('DR')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'domain_rating'
          }
          isActive={sortingObj.column === 'domain_rating'}
        />
      ),
      dataIndex: 'domain_rating',
      key: 'domain_rating',
      width: 100,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_rating'),
      render: (domain_rating: string) => (
        <span className="truncate whitespace-nowrap text-green-600 capitalize bg-green-100 px-2 py-1 rounded">
          {domain_rating}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Ahref traffic')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'organic_traffic'
          }
          isActive={sortingObj.column === 'organic_traffic'}
        />
      ),
      dataIndex: 'organic_traffic',
      key: 'organic_traffic',
      width: 130,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('organic_traffic'),
      render: (organic_traffic: string) => (
        <span className="truncate whitespace-nowrap text-green-600 capitalize bg-green-100 px-2 py-1 rounded">
          {organic_traffic}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Created at')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: alignLeft,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (created_at: string) => (
        <span className="truncate whitespace-nowrap capitalize">
          {new Date(created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: t('table:table-item-shop'),
      dataIndex: 'shop',
      key: 'shop',
      width: 170,
      align: alignLeft,
      ellipsis: true,
      render: (shop: Shop) => (
        <div className="flex items-center font-medium">
          <div className="relative aspect-square h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-200/80 bg-gray-100 me-2">
            <Image
              src={shop?.logo?.thumbnail ?? siteSettings.product.placeholder}
              alt={shop?.name ?? 'Shop Name'}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div>
          <span className="truncate">{shop?.name}</span>
        </div>
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('Price')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      align: alignLeft,
      width: 150,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number, record: Product) {
        const { price: max_price } = usePrice({
          amount: record?.max_price as number,
        });
        const { price: min_price } = usePrice({
          amount: record?.min_price as number,
        });

        const { price } = usePrice({
          amount: value,
        });

        const renderPrice =
          record?.product_type === ProductType.Variable
            ? `${min_price} - ${max_price}`
            : price;

        return (
          <span className="whitespace-nowrap" title={renderPrice}>
            {renderPrice}
          </span>
        );
      },
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-quantity')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === 'quantity'
    //       }
    //       isActive={sortingObj.column === 'quantity'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'quantity',
    //   key: 'quantity',
    //   align: 'center',
    //   width: 170,
    //   onHeaderCell: () => onHeaderClick('quantity'),
    //   render: (quantity: number) => {
    //     if (quantity < 1) {
    //       return (
    //         <Badge
    //           text={t('common:text-out-of-stock')}
    //           color="bg-status-failed/10 text-status-failed"
    //           className="capitalize"
    //         />
    //       );
    //     }
    //     return <span>{quantity}</span>;
    //   },
    // },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 120,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${
            record?.quantity > 0 && record?.quantity < 10
              ? 'flex-col items-baseline space-y-2 3xl:flex-row 3xl:space-x-2 3xl:space-y-0 rtl:3xl:space-x-reverse'
              : 'items-center space-x-2 rtl:space-x-reverse'
          }`}
        >
          <Badge
            text={status}
            color={
              status.toLocaleLowerCase() === 'draft'
                ? 'bg-yellow-400/10 text-yellow-500'
                : 'bg-accent bg-opacity-10 !text-accent'
            }
            className="capitalize"
          />
          {/* {record?.quantity > 0 && record?.quantity < 10 && (
            <Badge
              text={t('common:text-low-quantity')}
              color="bg-status-failed/10 text-status-failed"
              animate={true}
              className="capitalize"
            />
          )} */}
        </div>
      ),
    },
      // {
      //   title: t('table:table-item-actions'),
      //   dataIndex: 'slug',
      //   key: 'actions',
      //   align: 'center',
      //   width: 100,
      //   render: (slug: string, record: Product) => (
      //     <LanguageSwitcher
      //       slug={slug}
      //       record={record}
      //       deleteModalView="DELETE_PRODUCT"
      //       routes={Routes?.product}
      //       // enablePreviewMode={true}
      //       isShop={Boolean(shop)}
      //       shopSlug={(shop as string) ?? ''}
      //     />
      //   ),
      // },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
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
          scroll={{ x: 800 }}
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

export default ProductList;
