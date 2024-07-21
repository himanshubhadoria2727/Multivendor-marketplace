import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import CampaignManager from './CampaignManager';
import CampaignDetails from './CampaignDetails';

const CampaignPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState<string | null>(null);


  const handleCampaignClick = (id: string,name:string) => {
    setSelectedCampaignId(id);
    setSelectedCampaignName(name);

  };

  const handleBackClick = () => {
    setSelectedCampaignId(null);
    setSelectedCampaignName(" ");
    router.push(routes.campaign); 
  };

  return (
    <>
      <Seo
        title="Campaign"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.campaign}
      />
      {selectedCampaignId ? (
        <CampaignDetails id={selectedCampaignId} name={selectedCampaignName} onBack={handleBackClick} />
      ) : (
        <CampaignManager onCampaignClick={handleCampaignClick} />
      )}
    </>
  );
};

CampaignPage.authorization = true;
CampaignPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default CampaignPage;
