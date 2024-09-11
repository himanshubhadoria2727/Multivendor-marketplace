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
import { Checkbox } from 'antd';

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
  const [statusFilter, setStatusFilter] = useState<string[]>([]); // Only one status filter
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
      order_status: statusFilter.length > 0 ? statusFilter : undefined, // Pass the selected status or undefined to fetch all
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

  if (loading || fetchingShop) return <Loader text={t('common:text-loading')} />;
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

  // Handle status checkbox change, ensuring only one checkbox is selected at a time
  function handleStatusChange(checkedValues: any) {
    if (checkedValues.length > 1) {
      // Only keep the most recently selected checkbox
      const latestCheckedValue = checkedValues[checkedValues.length - 1];
      setStatusFilter([latestCheckedValue]);
    } else {
      // If none or only one is selected, update the statusFilter as normal
      setStatusFilter(checkedValues);
    }
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
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-orders')} />
        </div>

        <div className="flex w-full flex-col items-center md:w-3/4">
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-tracking-number')}
              className="w-full md:w-1/2"
            />
          </div>
          <div className="flex flex-row mt-5 w-full ">
            <h4 className="mb-2 text-semibold mr-3">{t('Select Status')}</h4>
            <Checkbox.Group
              options={statusOptions}
              onChange={handleStatusChange}
              value={statusFilter}
              className="flex space-x-4"
            />
          </div>
        </div>
      </Card>
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
