import { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import CampaignDetails from '../CampaignDetails';
import { useRouter } from 'next/router';

const CampaignDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <p>Loading...</p>;
  }

  return <CampaignDetails id={id as string} />;
};

CampaignDetailsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};  

export default CampaignDetailsPage;
