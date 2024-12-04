import Card from '@/components/common/card';
import Search from '@/components/common/search';
import OrderList from '@/components/order/order-list';
import { LIMIT } from '@/utils/constants';
import { useMemo, useState, useEffect } from 'react';
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

// Assuming you have an API to fetch the order counts per status
import { useOrderStatusCountQuery } from '@/data/order';

const statusOptions = [
  { value: 'order-waiting-approval', label: 'Waiting for Approval' },
  { value: 'order-submitted', label: 'Submitted' },
  { value: 'order-accepted', label: 'Accepted' },
  { value: 'order-rejected', label: 'Rejected' },
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

  // Fetch the order status counts from the API

  const { orders, loading, paginatorInfo, error, orderCount } = useOrdersQuery(
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
  const [initialOrderCount, setInitialOrderCount] = useState<number | null>(
    null,
  );

  useEffect(() => {
    // Set initialOrderCount only once when orders are fetched
    if (orderCount && initialOrderCount === null) {
      setInitialOrderCount(orderCount);
    }
  }, [orderCount, initialOrderCount]);

  const { data: orderStatusCount } = useOrderStatusCountQuery();
  console.log('orderStatusCount', orderStatusCount);

  const statusCounts = useMemo(() => {
    // Use the fetched counts for statuses or default to 0
    if (orderStatusCount) {
      return orderStatusCount;
    }
    return statusOptions.reduce((acc: any, option) => {
      acc[option.value] = orders.filter(
        (order) => order.order_status === option.value,
      ).length;
      return acc;
    }, {});
  }, [orders, orderStatusCount]);

  const { refetch } = useExportOrderQuery(
    {
      ...(shopId && { shop_id: shopId }),
    },
    { enabled: false },
  );

  if (loading || fetchingShop || loading)
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
      <div className="mb-8 flex justify-between items-center">
        <div className="text-3xl font-bold tracking-tight text-gray-900">
          My orders
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg text-gray-600 font-medium">
            Total orders:
          </span>
          <span className="text-2xl font-semibold text-gray-900">
            {initialOrderCount}
          </span>
        </div>
      </div>
      {/* <Card className="mb-4 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-orders')} />
        </div>

        <div className="flex w-full flex-col items-center md:w-3/4">
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <Search
              onSearch={handleSearch}
              placeholderText={t(
                'form:input-placeholder-search-tracking-number'
              )}
              className="w-full md:w-1/2"
            />
          </div>
        </div>
      </Card> */}
      <div className="flex mt-2 w-full bg-gray-100 pb-4 overflow-x-auto">
        <div className="flex w-full">
          {statusOptions.map((option, index) => {
            const count = statusCounts[option.value] || 0; // Get count or default to 0
            const isSelected = statusFilter === option.value; // Check if the status is selected
            return (
              <div
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`flex-1 text-sm
                   min-w-[120px] cursor-pointer p-2 text-center content-center py-3 transition-colors border-[1.2px] ${
                  index === 0
                    ? 'rounded-l-md'
                    : index === statusOptions.length - 1
                    ? 'rounded-r-md'
                    : 'border-l-0'
                } ${
                  isSelected
                    ? 'bg-[#228CDB] text-white border-[#228CDB]'
                    : 'bg-white text-[#228CDB] border-[#228CDB]'
                } hover:bg-[#228CDB] hover:text-white`}
              >
                <div>
                  {option.label}
                  <span
                    className={`ml-2 text-sm font-medium transition-colors ${
                      isSelected ? 'text-white' : 'text-accent hover:text-white'
                    }`}
                  >
                    ({count})
                  </span>
                </div>
              </div>
            );
          })}
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
