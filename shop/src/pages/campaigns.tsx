import { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { useCampaigns } from '@/components/campaign/CampaignContext';
import { useWishlist } from '@/data/wishlist';
import TitleWithSort from '@/components/ui/title-with-sort'; // Import your sorting component here
import { SortOrder } from '@/types'; // Define SortOrder type if not already defined

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortingObj, setSortingObj] = useState<{ column: string; sort: SortOrder }>({ column: '', sort: SortOrder.Desc });

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
    // Implement delete functionality here
  };

  const handleDeleteAllCampaigns = () => {
    // Implement delete all functionality here
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    // Sorting logic based on sortingObj
    if (sortingObj.column === 'name') {
      return sortingObj.sort === SortOrder.Asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    // Add other columns' sorting logic similarly
    return 0;
  });

  // Find selected campaign object
  const selectedCampaign = selectedCampaignId ? campaigns.find(campaign => campaign.id === selectedCampaignId) : null;

  const onHeaderClick = (column: string) => ({
    onClick: () => {
      const newSortOrder = sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
      setSortingObj({ sort: newSortOrder, column });
    },
  });

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

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Campaigns"
          className="border p-2 w-full dark:border-brand dark:focus:border-brand focus:border-brand"
        />
      </div>

      {/* Campaign Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-dark-400">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th>
                <TitleWithSort
                  title="Campaign Name"
                  ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'}
                  isActive={sortingObj.column === 'name'}
                  
                />
              </th>
              <th>
                <TitleWithSort
                  title="Total Orders"
                  ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'totalOrder'}
                  isActive={sortingObj.column === 'totalOrder'}
                  
                />
              </th>
              <th>
                <TitleWithSort
                  title="Free to Use"
                  ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'freeToUse'}
                  isActive={sortingObj.column === 'freeToUse'}
                  
                />
              </th>
              <th>
                <TitleWithSort
                  title="Total Spending"
                  ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'totalSpending'}
                  isActive={sortingObj.column === 'totalSpending'}
                  
                />
              </th>
              <th>
                <TitleWithSort
                  title="Created At"
                  ascending={sortingObj.sort === SortOrder.Asc && sortingObj.column === 'createdAt'}
                  isActive={sortingObj.column === 'createdAt'}
                 
                />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-300 dark:divide-gray-700">
            {sortedCampaigns.length === 0 ? (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap" colSpan={6}>
                  No campaigns found
                </td>
              </tr>
            ) : (
              sortedCampaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-brand dark:text-white hover:text-brand-dark dark:hover:text-brand-dark"
                      onClick={() => handleCardClick(campaign.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6a1 1 0 011-1h.5a1 1 0 010 2H10a1 1 0 01-1-1zm1 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Open
                    </button>
                    <button
                      className="text-red-500 dark:text-red-700 hover:text-red-700 dark:hover:text-red-500 ml-2"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM3 10a7 7 0 1114 0 7 7 0 01-14 0zm9-4a1 1 0 10-2 0v6a1 1 0 102 0V6zm-4 0a1 1 0 112 0v6a1 1 0 11-2 0V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.totalOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.freeToUse}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.totalSpending}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{campaign.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {sortedCampaigns.length > 0 && (
          <div className="bg-white dark:bg-dark-300 dark:text-white p-4 mt-4 rounded shadow">
            Showing {sortedCampaigns.length} results
          </div>
        )}
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
                    <th className="border px-4 py-2">Total Orders</th>
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
