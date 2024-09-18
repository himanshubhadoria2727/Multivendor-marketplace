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
import AdminLayout from '@/components/layouts/admin';

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
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
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
    }
  );

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  // Handle status checkbox change
  function handleStatusChange(checkedValues: any) {
    if (checkedValues.length > 1) {
      const latestCheckedValue = checkedValues[checkedValues.length - 1];
      setStatusFilter([latestCheckedValue]);
    } else {
      setStatusFilter(checkedValues);
    }
    setPage(1); // Reset to page 1 on filter change
  }

  // Filter orders that have children and only include children that match the status filter
  const filteredOrders = orders
    ?.flatMap((order) => order.children || []) // Flatten children orders
    ?.filter((child) => !statusFilter.length || statusFilter.includes(child.order_status)) || []; // Filter by child status

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
          <div className="flex flex-row mt-5 w-full">
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
  permissions: adminOwnerAndStaffOnly,
};
Orders.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
