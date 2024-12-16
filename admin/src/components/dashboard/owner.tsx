import { useEffect, useState } from 'react';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import {
  useAnalyticsQuery,
  useProductByCategoryQuery,
  useTopRatedProductsQuery,
} from '@/data/dashboard';
import {
  adminOnly,
  adminAndOwnerOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import usePrice from '@/utils/use-price';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { EaringIcon } from '../icons/summary/earning';
import { ShoppingIcon } from '../icons/summary/shopping';
import { ChecklistIcon } from '../icons/summary/checklist';
import { BasketIcon } from '../icons/summary/basket';
import Button from '@/components/ui/button';
import { motion } from 'framer-motion';
import PageHeading from '@/components/common/page-heading';
import { useProductsQuery } from '@/data/product';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { useWithdrawsQuery } from '@/data/withdraw';
import { HandIcon } from '@heroicons/react/solid';
import { FlutterwaveIcon } from '@/components/icons/payment-gateways/flutterwave';

import Card from '../common/card';
const ShopList = dynamic(() => import('@/components/dashboard/shops/shops'));

// TODO : this vendor root page code portion need to be checked in pixer.

// import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';

// const tabList = [
//   {
//     title: 'common:sidebar-nav-item-my-shops',
//     children: 'ShopList',
//   },
// ];

const Message = dynamic(() => import('@/components/dashboard/shops/message'));
const StoreNotices = dynamic(
  () => import('@/components/dashboard/shops/store-notices'),
);
const OrderStatusWidget = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-order-by-status'),
);
const ProductCountByCategory = dynamic(
  () =>
    import(
      '@/components/dashboard/widgets/table/widget-product-count-by-category'
    ),
);

const TopRatedProducts = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-top-rate-product'),
);

const MAP_PAGE_LIST: Record<string, any> = {
  ShopList: ShopList,
};

const OwnerShopLayout = () => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data, isLoading: loading } = useAnalyticsQuery();
  const [activeTimeFrame, setActiveTimeFrame] = useState(1);
  const [orderDataRange, setOrderDataRange] = useState(
    data?.todayTotalOrderByStatus,
  );
  const { data: me } = useMeQuery();
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;
  const { products } = useProductsQuery({
    language: locale,
    limit: 20,
    shop_id: shopId,
  });
  const {
    data: productByCategory,
    isLoading: productByCategoryLoading,
    error: productByCategoryError,
  } = useProductByCategoryQuery({ limit: 10, language: locale });

  const {
    data: topRatedProducts,
    isLoading: topRatedProductsLoading,
    error: topRatedProductsError,
  } = useTopRatedProductsQuery({ limit: 10, language: locale });

  const { price: total_revenue } = usePrice(
    data && {
      amount: data?.totalRevenue!,
    },
  );
  console.log('total_revenue', data?.totalRevenue);
  const { price: total_refund } = usePrice(
    data && {
      amount: data?.totalRefunds!,
    },
  );

  const { price: todays_revenue } = usePrice(
    data && {
      amount: data?.todaysRevenue!,
    },
  );
  const { query } = router;

  const classNames = {
    basic:
      'lg:text-[1.375rem] font-semibold border-b-2 border-solid border-transparent lg:pb-5 pb-3 -mb-0.5',
    selected: 'text-accent hover:text-accent-hover border-current',
    normal: 'hover:text-black/80',
  };
  let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  if (!!data?.totalYearSaleByMonth?.length) {
    salesByYear = data.totalYearSaleByMonth.map((item: any) =>
      item.total.toFixed(2),
    );
  }
  console.log(salesByYear);

  // Get the current month index (0 for January, 11 for December)
  const currentMonthIndex = new Date().getMonth();

  // Extract the sales for the current month
  const monthlyRevenue = salesByYear[currentMonthIndex] || 0; // Default to 0 if no sales data for the month

  // Ensure monthlyRevenue is a number before using toFixed
  const revenueAmount = Number(monthlyRevenue); // Convert to number and then format
  revenueAmount.toFixed(0);
  console.log('revenueAmount', revenueAmount);
  const { price: monthly_revenue } = usePrice(
    data && {
      amount: revenueAmount!,
    },
  );

  const { withdraws, paginatorInfo, error } = useWithdrawsQuery(
    {
      shop_id: shopId,
    },
    {
      enabled: Boolean(shopId),
    },
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
  const { price: onHoldAmount } = usePrice({
    amount: totalOnHoldAmount,
  });

  console.log('monthly_revenue', monthly_revenue);

  const timeFrame = [
    { name: t('text-today'), day: 1 },
    { name: t('text-weekly'), day: 7 },
    { name: t('text-monthly'), day: 30 },
    { name: t('text-yearly'), day: 365 },
  ];

  useEffect(() => {
    switch (activeTimeFrame) {
      case 1:
        setOrderDataRange(data?.todayTotalOrderByStatus);
        break;
      case 7:
        setOrderDataRange(data?.weeklyTotalOrderByStatus);
        break;
      case 30:
        setOrderDataRange(data?.todayTotalOrderByStatus);
        break;
      case 365:
        setOrderDataRange(data?.yearlyTotalOrderByStatus);
        break;

      default:
        setOrderDataRange(orderDataRange);
        break;
    }
  });

  return (
    <>
      <div className="flex mb-8 rounded-lg bg-light p-4 justify-space-between md:p-8">
        <div className="flex text-heading font-semibold">
          <span className="text-3xl max-md:text-sm mr-3">Hello</span>{' '}
          <div className="flex max-md:text-sm flex-row text-3xl text-accent">
            {me?.name}{' '}
            <span
              className="text-3xl max-md:text-sm ml-2 inline-block"
              style={{ transform: 'rotate(20deg)' }}
            >
              👋
            </span>{' '}
          </div>
        </div>
        <div className="ml-auto">
          <Button
            onClick={() => router.push(`${shopId}/products/create`)}
            size="medium"
            className="text-sm md:text-base max-md:h-6"
          >Add site +</Button>
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-light p-5 md:p-8">
        <div className="mb-7 flex items-center justify-between">
          <PageHeading title={t('text-summary')} />
        </div>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="sticker-card-title-rev"
            // subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#047857"
            price={total_revenue}
          />
          <StickerCard
            titleTransKey="sticker-card-title-onhold"
            // subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={onHoldAmount}
          />
          <StickerCard
            titleTransKey="sticker-card-title-total-sites"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={products.length}
          />
          <StickerCard
            titleTransKey="sticker-card-title-month-rev"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={monthly_revenue}
          />
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-light p-5 md:p-8">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <PageHeading title={t('text-order-status')} />
          <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame
              ? timeFrame.map((time) => (
                  <div key={time.day} className="relative">
                    <Button
                      className={cn(
                        '!focus:ring-0  relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
                        time.day === activeTimeFrame ? 'text-accent' : '',
                      )}
                      type="button"
                      onClick={() => setActiveTimeFrame(time.day)}
                      variant="custom"
                    >
                      {time.name}
                    </Button>
                    {time.day === activeTimeFrame ? (
                      <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div>
        <OrderStatusWidget
          order={orderDataRange}
          timeFrame={activeTimeFrame}
          allowedStatus={['pending', 'processing', 'complete', 'cancel']}
        />
      </div>

      {hasAccess(adminAndOwnerOnly, permissions) && (
        <div className="mb-8 flex w-full flex-wrap md:flex-nowrap">
          <ColumnChart
            widgetTitle={t('Completed orders')}
            colors={['#6073D4']}
            series={salesByYear}
            categories={[
              t('common:january'),
              t('common:february'),
              t('common:march'),
              t('common:april'),
              t('common:may'),
              t('common:june'),
              t('common:july'),
              t('common:august'),
              t('common:september'),
              t('common:october'),
              t('common:november'),
              t('common:december'),
            ]}
          />
        </div>
      )}

      {/* <div className="grid gap-8 xl:grid-cols-12">
        <TopRatedProducts
          products={topRatedProducts}
          title={'text-most-rated-products'}
          className="xl:col-span-5 2xl:me-20"
        />
        <ProductCountByCategory
          products={productByCategory}
          title={'text-most-category-products'}
          className="xl:col-span-7 2xl:ltr:-ml-20 2xl:rtl:-mr-20"
        />
      </div> */}
    </>
  );
};

const OwnerDashboard = () => {
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  return permission ? null : <OwnerShopLayout />;
};

export default OwnerDashboard;
