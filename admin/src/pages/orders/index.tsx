import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import OrderList from '@/components/order/order-list';
import { Fragment, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useOrdersQuery } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { MoreIcon } from '@/components/icons/more-icon';
import { useExportOrderQuery } from '@/data/export';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import PageHeading from '@/components/common/page-heading';
import Select from '@/components/ui/select/select';
import { ActionMeta } from 'react-select';

const statusOptions = [
  { value: '', label: 'All Statuses' }, // Option to show all orders
  { value: 'order-waiting-approval', label: 'Waiting for Approval' },
  { value: 'order-submitted', label: 'Submitted' },
  { value: 'order-accepted', label: 'Accepted' },
  { value: 'order-improvement', label: 'Improvement' },
  { value: 'order-completed', label: 'Completed' },
];

export default function Orders() {
  const router = useRouter();
  const { locale } = useRouter();
  const {
    query: { shop },
  } = router;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Add state for status filter
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

function handleStatusChange(newValue: unknown, actionMeta: ActionMeta<unknown>) {
  // Check if newValue is an object and contains the statusFilter property
  if (newValue && typeof newValue === 'object' && 'statusFilter' in newValue) {
    const statusFilter = (newValue as { statusFilter: string }).statusFilter;

    // Set the status filter and reset the page
    setStatusFilter(statusFilter);
    setPage(1);
  }
}

  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    {
      slug: shop as string,
    },
    {
      enabled: !!shop,
    }
  );
  const shopId = shopData?.id!;
  const { orders, loading, paginatorInfo, error } = useOrdersQuery({
    language: locale,
    limit: 20,
    page,
    orderBy,
    sortedBy,
    tracking_number: searchTerm,
    order_status: statusFilter, // Add status filter to the query
  });
  const { refetch } = useExportOrderQuery(
    {
      ...(shopId && { shop_id: shopId }),
    },
    { enabled: false }
  );

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleExportOrder() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'export-order');
      a.click();
    }
  }

  const filteredOrders = orders
    ?.filter((order) => order.children && order.children.length > 0) // Filter orders that have children
    ?.flatMap((order) => order.children) || []; // Flatten children into one array

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-orders')} />
        </div>

        <div className="flex w-full flex-row items-center md:w-1/2 space-x-4">
          <Search
            onSearch={handleSearch}
            className="w-full"
            placeholderText={t('form:input-placeholder-search-tracking-number')}
          />

          <select
            value={statusFilter}
            onChange={()=>handleStatusChange}
            className="form-select w-full md:w-auto"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`status:${option.label}`)} {/* Translate status labels */}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <OrderList
        orders={filteredOrders}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Orders.authenticate = {
  permissions: adminOnly,
};
Orders.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form', 'status'])), // Include 'status' namespace for translations
  },
});
