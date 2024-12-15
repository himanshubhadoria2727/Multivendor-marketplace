import CreateOrUpdateProductForm from '@/components/product/product-form';
import ProductView from '@/components/product/view';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useProductQuery } from '@/data/product';
import { Config } from '@/config';
import shop from '@/components/layouts/shop';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';

import Link from '@/components/ui/link';
import Card from '@/components/common/card';
import { EditFillIcon } from '@/components/icons/edit';
import { formatSlug } from '@/utils/use-slug';
import { DoubleCheckIcon } from '@/components/icons/double-check-icon';

export default function viewPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: query?.shop as string,
  });
  const shopId = shopData?.id!;
  const {
    product,
    isLoading: loading,
    error,
  } = useProductQuery({
    slug: query.productSlug as string,
  });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }
  return (
    <>
      <Card className="mb-5 rounded-lg flex items-center justify-between px-3 py-2 gap-4">
        {/* Site Name */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Site:</span>
          <span className="text-lg font-semibold text-blue-600">
            {product?.name}
          </span>
          <EditFillIcon
            onClick={() =>
              router.replace(
                Routes?.product?.editWithoutLang(
                  formatSlug(product?.slug),
                  shopId,
                ),
              )
            }
            className="cursor-pointer"
          />
        </div>

        {/* Verify Section */}
        {product?.status === 'draft' && (
          <div onClick={() =>
            router.replace(
              `${Routes?.product?.editWithoutLang(formatSlug(product?.slug), shopId)}?verification=false`
            )
          } className="flex cursor-pointer items-center px-3 py-2 border bg-yellow-100 rounded-lg gap-3">
            <span className="text-lg font-semibold text-yellow-600">
              Verify
            </span>
            <DoubleCheckIcon  className="text-yellow-600" />
          </div>
        )}

        {/* Status Section */}
        <div className="flex items-center border px-3 py-2 bg-accent/20 rounded-lg gap-3">
          <span className="text-base text-gray-500">Status:</span>
          <span
            className={`text-base font-semibold ${
              product?.status === 'draft' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {product?.status === 'draft' ? 'Verification Pending' : 'Published'}
          </span>
        </div>

        
      </Card>

      <ProductView initialValues={product} />
    </>
  );
}
viewPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
viewPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
