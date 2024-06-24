import { useState } from 'react';
import { useModalAction } from '@/components/modal-views/context';

const CampaignModalContent = ({ productId }: { productId: string }) => {
  const { closeModal } = useModalAction();
  const [campaignName, setCampaignName] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const existingCampaigns = [
    'Campaign 1',
    'Campaign 2',
    'Campaign 3',
  ]; // This should come from your state or API

  const handleCreateCampaign = () => {
    // Handle the creation of a new campaign
    console.log('Create campaign:', campaignName);
    closeModal();
  };

  const handleSelectCampaign = () => {
    // Handle selecting an existing campaign
    console.log('Selected campaign:', selectedCampaign);
    closeModal();
  };

  return (
    <div className="campaign-modal-content p-6">
      <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
      <input
        type="text"
        placeholder="Campaign Name"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleCreateCampaign}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Create
      </button>
      <div className="text-center mb-4">OR</div>
      <h3 className="text-md font-semibold mb-2">Choose from your campaigns</h3>
      <select
        value={selectedCampaign}
        onChange={(e) => setSelectedCampaign(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>Select Campaign</option>
        {existingCampaigns.map((campaign) => (
          <option key={campaign} value={campaign}>
            {campaign}
          </option>
        ))}
      </select>
      <button
        onClick={handleSelectCampaign}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Select
      </button>
    </div>
  );
};

export default CampaignModalContent;
