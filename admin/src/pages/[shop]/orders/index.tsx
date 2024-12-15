import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useOrdersQuery } from '@/data/order';
import { useOrderStatusCountQuery } from '@/data/order'; // To fetch counts per status
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import OrderList from '@/components/order/order-list';
import { LIMIT } from '@/utils/constants';
import ShopLayout from '@/components/layouts/shop';
import { getAuthCredentials, hasAccess, adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import { useShopQuery } from '@/data/shop';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

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
  const { query: { shop } } = router;
  const { t } = useTranslation();
  const { locale } = useRouter();

  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Start with no filter
  const [page, setPage] = useState(1);
  const [initialOrderCount, setInitialOrderCount] = useState<number | null>(null);

  const { data: shopData, isLoading: fetchingShop } = useShopQuery({ slug: shop as string });
  const shopId = shopData?.id!;
  
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
    }
  );

  // Fetch order status counts
  const { data: orderStatusCount } = useOrderStatusCountQuery();

  useEffect(() => {
    // Set total order count initially
    if (orderCount && initialOrderCount === null) {
      setInitialOrderCount(orderCount);

      // Set the default status filter dynamically based on counts
      if (orderStatusCount && Object.keys(orderStatusCount).length > 0) {
        // Find the first status with a non-zero count
        const firstNonZeroStatus = statusOptions.find(
          (option) => orderStatusCount[option.value] > 0
        );
        if (firstNonZeroStatus) {
          setStatusFilter(firstNonZeroStatus.value); // Set the filter to the first non-zero count status
        }
      }
    }
  }, [orderCount, initialOrderCount, orderStatusCount]);

  const statusCounts = useMemo(() => {
    if (orderStatusCount) {
      return orderStatusCount;
    }
    return statusOptions.reduce((acc: any, option) => {
      acc[option.value] = orders.filter((order) => order.order_status === option.value).length;
      return acc;
    }, {});
  }, [orders, orderStatusCount]);

  function handleStatusChange(value: string) {
    setStatusFilter((prev) => (prev === value ? '' : value)); // Toggle selection
    setPage(1); // Reset to page 1 on filter change
  }

  if (
    !hasAccess(adminOwnerAndStaffOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id !== shopId
  ) {
    router.replace(Routes.dashboard);
  }

  if (loading || fetchingShop) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div className="text-3xl font-bold tracking-tight text-gray-900">
          My Orders
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg text-gray-600 font-medium">Total Orders:</span>
          <span className="text-2xl font-semibold text-gray-900">{initialOrderCount}</span>
        </div>
      </div>

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
                  min-w-[120px] cursor-pointer p-2 text-center py-3 transition-colors border-[1.2px] ${
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
        onPagination={setPage}
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
