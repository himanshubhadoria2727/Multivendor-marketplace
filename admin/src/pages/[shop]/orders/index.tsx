import Card from '@/components/common/card';
import Search from '@/components/common/search';
import OrderList from '@/components/order/order-list';
import { LIMIT } from '@/utils/constants';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import { useRouter } from 'next/router';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useOrdersQuery } from '@/data/order';
import { SortOrder } from '@/types';
import { useShopQuery } from '@/data/shop';
import { useExportOrderQuery } from '@/data/export';
import { useMeQuery } from '@/data/user';
import { Routes } from '@/config/routes';
import PageHeading from '@/components/common/page-heading';

const statusOptions = [
  { value: 'order-waiting-approval', label: 'Waiting for Approval' },
  { value: 'order-submitted', label: 'Submitted' },
  { value: 'order-accepted', label: 'Accepted' },
  { value: 'order-improvement', label: 'Improvement' },
  { value: 'order-completed', label: 'Completed' },
];

export default function Orders() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { locale } = useRouter();
  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Only one status filter
  const [page, setPage] = useState(1);

  const { orders, loading, paginatorInfo, error } = useOrdersQuery(
    {
      language: locale,
      limit: LIMIT,
      page,
      tracking_number: searchTerm,
      orderBy,
      sortedBy,
      shop_id: shopId,
      order_status: statusFilter || undefined,
    },
    {
      enabled: Boolean(shopId),
    },
  );

  const { refetch } = useExportOrderQuery(
    {
      ...(shopId && { shop_id: shopId }),
    },
    { enabled: false },
  );

  if (loading || fetchingShop)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error?.message} />;

  async function handleExportOrder() {
    const { data } = await refetch();
    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'export-order');
      a.click();
    }
  }

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  function handleStatusChange(value: string) {
    setStatusFilter((prev) => (prev === value ? '' : value)); // Toggle selection
    setPage(1); // Reset to page 1 on filter change
  }

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <Card className="mb-4 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-orders')} />
        </div>

        <div className="flex w-full flex-col items-center md:w-3/4">
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <Search
              onSearch={handleSearch}
              placeholderText={t(
                'form:input-placeholder-search-tracking-number',
              )}
              className="w-full md:w-1/2"
            />
          </div>
        </div>
      </Card>
      <div className="flex mt-2 w-full bg-gray-100 pb-4 overflow-x-auto">
        <div className="flex w-full space-x-2">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`flex-1 min-w-[120px] cursor-pointer p-2 m-1 text-center content-center py-3 rounded-md transition-colors ${
                statusFilter === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <OrderList
        orders={orders}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Orders.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
Orders.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
