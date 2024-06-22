import { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';;
import { useCampaigns } from '@/components/campaign/CampaignContext';


type Campaign = {
  id: number;
  name: string;
  totalOrder: string;
  freeToUse: string;
  totalSpending: string;
  createdAt: string;
};

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const CampaignManager: React.FC = () => {
  const { campaigns, addCampaign } = useCampaigns();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [validationError, setValidationError] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleAddCampaign = () => {
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (newCampaignName.trim() === '' || !domainPattern.test(newCampaignName)) {
      setValidationError('Enter a valid campaign name');
      return;
    }
    addCampaign(newCampaignName);
    setNewCampaignName('');
    setIsModalOpen(false);
    setValidationError('');
  };

  const handleCardClick = (id: number) => {
    setSelectedCampaignId(id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleDeleteCampaign = (id: number) => {
    // Implement delete campaign logic here
  };

  const handleDeleteAllCampaigns = () => {
    // Implement delete all campaigns logic here
  };

  const selectedCampaign = campaigns.find(campaign => campaign.id === selectedCampaignId);

  return (
    <div className="p-4 dark:bg-dark-200 dark:text-white">
      <div className="flex justify-between items-center mb-4 bg-white dark:bg-dark-300 dark:text-white p-4 rounded shadow">
        <h1 className="text-2xl text-brand dark:text-white font-bold">Campaigns</h1>
        <button
          className="bg-brand dark:bg-brand-dark text-white font-bold px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Campaign
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-dark-300 dark:text-white p-4 rounded shadow-lg w-96 z-60">
            <h2 className="text-lg font-bold mb-4">Add Campaign</h2>
            <h3 className="text-md font-semibold mb-2">Create New Campaign</h3>
            <input
              type="text"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              className="border dark:border-gray-600 p-2 w-full mb-2 bg-white dark:bg-dark-100 dark:text-white"
              placeholder="Enter Domain (example.com)"
            />
            {validationError && <p className="text-red-500 text-sm mb-2">{validationError}</p>}
            <div className="flex justify-end">
              <button
                className="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded mr-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setValidationError('');
                }}
              >
                Cancel
              </button>
              <button
                className="bg-brand dark:bg-brand-dark text-white px-4 py-2 rounded"
                onClick={handleAddCampaign}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white dark:bg-dark-300 dark:text-white shadow-md rounded p-4 cursor-pointer relative"
          >
            <h3 className="text-lg font-bold text-center mb-4">{campaign.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="font-semibold">Total Order:</p>
              <p>{campaign.totalOrder}</p>
              <p className="font-semibold">Free to Use:</p>
              <p>{campaign.freeToUse}</p>
              <p className="font-semibold">Total Spending:</p>
              <p>{campaign.totalSpending}</p>
              <p className="font-semibold">Created At:</p>
              <p>{campaign.createdAt}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-brand dark:bg-brand-dark text-white px-4 py-2 rounded mr-2"
                onClick={() => handleCardClick(campaign.id)}
              >
                Open
              </button>
              <button
                className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteCampaign(campaign.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedCampaign && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-dark-300 dark:text-white rounded shadow-lg max-w-full overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">Campaign Details</h2>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 dark:bg-dark-400">
                    <th className="border px-4 py-2">Actions</th>
                    <th className="border px-4 py-2">Campaign Name</th>
                    <th className="border px-4 py-2">Total Order</th>
                    <th className="border px-4 py-2">Free to Use</th>
                    <th className="border px-4 py-2">Total Spending</th>
                    <th className="border px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">
                      {/* Add actions buttons */}
                    </td>
                    <td className="border px-4 py-2">{selectedCampaign.name}</td>
                    <td className="border px-4 py-2">{selectedCampaign.totalOrder}</td>
                    <td className="border px-4 py-2">{selectedCampaign.freeToUse}</td>
                    <td className="border px-4 py-2">{selectedCampaign.totalSpending}</td>
                    <td className="border px-4 py-2">{selectedCampaign.createdAt}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded mr-2"
                  onClick={handleCloseDetailModal}
                >
                  Close
                </button>
                {/* Additional buttons for actions */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Campaigns Button */}
      <div className="fixed bottom-4 left-4">
        <button
          className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded"
          onClick={handleDeleteAllCampaigns}
        >
          Delete All Campaigns
        </button>
      </div>
    </div>
  );
};

const CampaignPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Campaign"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.campaign}
      />
      <CampaignManager />
    </>
  );
};

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
