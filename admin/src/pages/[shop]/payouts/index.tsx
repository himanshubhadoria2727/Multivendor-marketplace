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
import Button from '@/components/ui/button';
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
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>(
    'all',
  );
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
  const totalWithdrawAmount =
    withdraws?.reduce(
      (total: any, withdraw: { amount: any }) => total + withdraw.amount,
      0,
    ) || 0;
    const [initialTotalWithdraw, setInitialTotalWithdraw] = useState<number | null>(
      null,
    );
  
    useEffect(() => {
      // Set initialOrderCount only once when orders are fetched
      if (totalOnHoldAmount && initialTotalWithdraw === null) {
        setInitialTotalWithdraw(totalWithdrawAmount);
      }
    }, [totalWithdrawAmount, initialTotalWithdraw]);

  const { price: totalWithdraw } = usePrice({
    amount: initialTotalWithdraw!,
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
        .filter(
          (withdraw) =>
            withdraw.status === 'on_hold' &&
            typeof withdraw.amount === 'number',
        ) // Filter and ensure amount is a number
        .reduce((sum, withdraw) => sum + withdraw.amount, 0) // Sum up the amount
    : 0; // Default to 0 if withdraws is not an array

  console.log('Total amount on hold:', totalOnHoldAmount);
  const [initialOnHold, setInitialOnHold] = useState<number | null>(
    null,
  );

  useEffect(() => {
    // Set initialOrderCount only once when orders are fetched
    if (totalOnHoldAmount && initialOnHold === null) {
      setInitialOnHold(totalOnHoldAmount);
    }
  }, [totalOnHoldAmount, initialOnHold]);

  const { price: onHoldAmount } = usePrice({
    amount: initialOnHold,
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

  function handleFilterChange(type: 'all' | 'credit' | 'debit') {
    setFilterType(type);
  }

  // const filteredWithdraws = transformedWithdraws.filter((withdraw) => {
  //   if (filterType === 'credit') {
  //     return withdraw.amount > 0; // Assuming positive amounts are credits
  //   } else if (filterType === 'debit') {
  //     return withdraw.amount < 0; // Assuming negative amounts are debits
  //   }
  //   return true; // Show all
  // });

  const filteredWithdraws =
    filterType === 'debit' || filterType === 'all' ? transformedWithdraws : [];
  const filteredOrders =
    filterType === 'credit' || filterType === 'all' ? transformedOrders : [];

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
              <p className="text-sm font-medium text-gray-500">
                Available Balance
              </p>
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
              <p className="text-sm font-medium text-gray-500">
                Total Withdrawals
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalWithdraw}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="flex w-full hover:shadow-lg transition-shadow gap-5 duration-200 p-4">
        <div className="flex w-full items-center justify-between mb-4">
          <Search onSearch={handleSearch} />
        </div>

        <div className="flex flex-col md:flex-row md:justify-between w-full">
          <div className="flex justify-around space-x-0 md:space-x-4 w-full">
            <Button
              onClick={() => handleFilterChange('all')}
              className="btn flex-1 bg-blue-500 text-white text-center rounded-md px-2 py-2 hover:bg-blue-600 transition-colors"
            >
              All
            </Button>
            <Button
              onClick={() => handleFilterChange('credit')}
              className="btn flex-1 bg-green-500 text-white text-center rounded-md px-2 py-2 hover:bg-green-600 transition-colors"
            >
              Credits
            </Button>
            <Button
              onClick={() => handleFilterChange('debit')}
              className="btn flex-1 bg-red-500 text-white text-center rounded-md px-2 py-2   hover:bg-red-600 transition-colors"
            >
              Debits
            </Button>
          </div>
        </div>
      </Card>

      <UnifiedTransactionList
        withdraws={filteredWithdraws}
        orders={filteredOrders}
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
