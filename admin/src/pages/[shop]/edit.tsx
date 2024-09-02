import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopForm from '@/components/shop/shop-form';
import ShopLayout from '@/components/layouts/shop';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import ProfileUpdateForm from '@/components/auth/profile-update-form';
import ChangePasswordForm from '@/components/auth/change-password-from';
import EmailUpdateForm from '@/components/auth/email-update-form';
import { useShopQuery } from '@/data/shop';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import { useState } from 'react';

export default function UpdateShopPage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { query } = useRouter();
  const { shop } = query;
  const { t } = useTranslation();
  const {
    data,
    isLoading: loading,
    error,
  } = useShopQuery({
    slug: shop as string,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Profile Update', component: <ProfileUpdateForm me={data} /> },
    { title: 'Publisher Information', component: <ShopForm initialValues={data} /> },
    { title: 'Email Update', component: <EmailUpdateForm me={data} /> },
    { title: 'Change Password', component: <ChangePasswordForm /> },
  ];

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(data?.id) &&
    me?.managed_shop?.id !== data?.id
  ) {
    router.replace(Routes.dashboard);
    return null;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-2xl font-bold text-heading">
          {t('form:form-title-profile-settings')}
        </h1>
      </div>

      <div className="flex space-x-4 mb-6 mt-6">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              index === currentStep
                ? 'bg-primary shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            onClick={() => setCurrentStep(index)}
          >
            {t(`${step.title.replace(' ', ' ')}`)}
          </button>
        ))}
      </div>

      <div className="mt-5">{steps[currentStep].component}</div>
    </div>
  );
}

UpdateShopPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
UpdateShopPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});