import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from '@/types';
import GeneralLayout from '@/layouts/_general-layout';
import PageHeading from '@/components/ui/page-heading';
import GeneralContainer from '@/layouts/_general-container';
import { licensingData } from '@/data/static/licensing-setting';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';

const LicensingPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Seo
        title="Product Licensing"
        description="
GoodBlogger is a backlink providing website that helps boost SEO by acquiring quality inbound links, enhancing search engine rankings, and improving website indexing for better visibility."
        url={routes.licensing}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title={t('text-license-page-title')}
          // subtitle={t('text-license-page-subtitle')}
        />
        <GeneralContainer>
          {/* {licensingData?.map((item) => (
            <div
              key={item.id}
              className="order-list-enable mb-8 last:mb-0 lg:mb-10"
            >
              <h3 className="mb-4 text-sm font-medium text-dark dark:text-light lg:mb-5">
                {t(item.title)}
              </h3>
              <div
                className="space-y-5 leading-6"
                dangerouslySetInnerHTML={{
                  __html: t(item.description),
                }}
              />
            </div>
          ))} */}
        </GeneralContainer>
      </div>
    </>
  );
};

LicensingPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default LicensingPage;
