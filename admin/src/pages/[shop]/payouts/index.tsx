import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  hasAccess,
  getAuthCredentials,
  adminOnly,
  adminAndOwnerOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { Order, SortOrder, Withdraw } from '@/types';
import LinkButton from '@/components/ui/link-button';
import { useOrdersQuery } from '@/data/order';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import UnifiedTransactionList from '@/components/payout/payout-list';
import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import ShopLayout from '@/components/layouts/shop';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Search from '@/components/common/search';
import { FaClock, FaPiggyBank, FaWallet } from 'react-icons/fa';
import { useShopQuery } from '@/data/shop';
import usePrice from '@/utils/use-price';
import { useWithdrawsQuery } from '@/data/withdraw';
import { useMeQuery } from '@/data/user';

type UnifiedTransaction = {
  id: string;
  type: 'withdraw' | 'order';
  amount: number;
  status: string;
  created_at: string;
};
export default function PayoutPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const {
    query: { shop },
  } = router;

  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id;

  const {
    withdraws,
    paginatorInfo: paginatorWithdraw,
    loading: loadingWithdraws,
    error: withdrawError,
  } = useWithdrawsQuery(
    { shop_id: shopId, limit: 10, page, orderBy, sortedBy },
    { enabled: Boolean(shopId) },
  );
  const totalWithdrawAmount = withdraws?.reduce((total: any, withdraw: { amount: any; }) => total + withdraw.amount, 0) || 0;

  const { price:  totalWithdraw} = usePrice({
    amount: totalWithdrawAmount!,
  });
  
  const {
    orders,
    paginatorInfo: paginatorOrder,
    loading: loadingOrders,
    error: orderError,
  } = useOrdersQuery(
    {
      shop_id: shopId,
      limit: 10,
      page,
      tracking_number: searchTerm,
      orderBy,
      sortedBy,
    },
    { enabled: Boolean(shopId) },
  );

  const { price: shopBalance } = usePrice({
    amount: me?.shops[0]?.balance?.current_balance!,
  });
  const totalOnHoldAmount = Array.isArray(withdraws)
  ? withdraws
      .filter(withdraw => withdraw.status === 'on_hold' && typeof withdraw.amount === 'number') // Filter and ensure amount is a number
      .reduce((sum, withdraw) => sum + withdraw.amount, 0) // Sum up the amount
  : 0; // Default to 0 if withdraws is not an array

console.log('Total amount on hold:', totalOnHoldAmount);
const { price: onHoldAmount } = usePrice({
  amount: totalOnHoldAmount,
});
  // Transform withdraws
  const transformedWithdraws: Withdraw[] =
    withdraws?.map(
      (withdraw: {
        payment_method: any;
        id: any;
        amount: any;
        status: any;
        created_at: any;
      }) => ({
        id: withdraw.id,
        type: 'withdraw' as const,
        amount: withdraw.amount,
        status: withdraw.status,
        created_at: withdraw.created_at,
        payment_method: withdraw.payment_method,
      }),
    ) || [];
  console.log('orders', orders);
  // Transform orders
  const transformedOrders: Order[] =
    orders?.map((order) => ({
      id: order.id,
      selectedForm: order?.products[0]?.pivot?.selectedForm,
      type: 'order' as const,
      amount: order.total, // Assuming 'total' is the amount field in orders
      status: order.order_status,
      created_at: order.created_at,
      payment_method: order.payment_gateway,

    })) || [];

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  if (loadingWithdraws || loadingOrders || fetchingShop) {
    return <Loader text={t('common:text-loading')} />;
  }

  if (withdrawError || orderError) {
    return (
      <ErrorMessage message={withdrawError?.message || orderError?.message} />
    );
  }

  // Create a unified paginator object
  const unifiedPaginatorInfo = {
    total: (paginatorWithdraw?.total || 0) + (paginatorOrder?.total || 0), // Combine totals from both
    currentPage: page,
    perPage: Math.max(
      paginatorWithdraw?.perPage || 10,
      paginatorOrder?.perPage || 10,
    ), // Use max of both for perPage
  };
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('Payouts')} />
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <Search onSearch={handleSearch} />
        </div>

        <LinkButton
          href={`/${shop}/withdraws/create`}
          className="h-12 w-full md:w-auto md:ms-auto"
        >
          <span>+ {t('form:button-label-add-withdraw')}</span>
        </LinkButton>
      </Card>

      {/* New Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center p-5">
          <div className="rounded-full bg-orange-100 p-4 mr-6">
            <FaClock className="h-7 w-7 text-orange-600" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">On Hold</p>
            <p className="text-2xl font-bold text-gray-900">{onHoldAmount}</p>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center p-5">
          <div className="rounded-full bg-green-100 p-4 mr-6">
            <FaWallet className="h-7 w-7 text-green-600" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">{shopBalance}</p>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center p-5">
          <div className="rounded-full bg-blue-100 p-4 mr-6">
            <FaPiggyBank className="h-7 w-7 text-blue-600" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Total Withdrawals</p>
            <p className="text-2xl font-bold text-gray-900">{totalWithdraw}</p>
          </div>
        </div>
      </Card>
    </div>

      <UnifiedTransactionList
        withdraws={transformedWithdraws}
        orders={transformedOrders}
        paginatorInfo={unifiedPaginatorInfo}
        onPagination={handlePagination}
      />
    </>
  );
}

PayoutPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
PayoutPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
