import { useState, useEffect, SetStateAction } from 'react';
import type { Product } from '@/types';
import Router, { useRouter } from 'next/router';
import { useModalAction } from '@/components/modal-views/context';
import routes from '@/config/routes';
import usePrice from '@/lib/hooks/use-price';
import { CheckIconWithBg } from '@/components/icons/check-icon-with-bg';
import { InformationIcon } from '../icons/information-icon';
import { PeopleIcon } from '../icons/people-icon'; 
import { StarIcon } from '../icons/star-icon';
import { UserIconAlt } from '../icons/user-icon-alt';
import { HelpIcon } from '../icons/help-icon';
import { LangIcon } from '../icons/lang-icon';
import { LinkIcon } from '../icons/link-icon';
import { GlobalIcon } from '../icons/featured/global-icon';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import { isFree } from '@/lib/is-free';
import { useTranslation } from 'next-i18next';



type Campaign = {
  id: number;
  name: string;
  created_at: string;
  product_count: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignNames, setCampaignNames] = useState<string[]>([]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const router = useRouter();
  const { id, name, slug, image, shop, is_external, is_niche, isLinkInsertion } = product ?? {};
  const { isGridCompact } = useGridSwitcher();
  const { price, basePrice } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
  });
  const { t } = useTranslation('common');
  const isFreeItem = isFree(product?.sale_price ?? product?.price);

    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/campaigns', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        const campaignNames = data.campaigns.map((campaign: { name: any }) => campaign.name);
        setCampaignNames(campaignNames);
        setCampaigns(data.campaigns);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setIsLoading(false);
      }
    };


  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleAddProductToCampaign = async (productId: string) => {
    const token = localStorage.getItem('token');

    if (newCampaignName && campaignNames.includes(newCampaignName)) {
      setValidationError('Campaign with the same name already present');
      return;
    }

    try {
      let response;
      if (newCampaignName) {
        const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (newCampaignName.trim() === '' || !domainPattern.test(newCampaignName)) {
        setValidationError('Enter a valid campaign name');
        setNewCampaignName('');
        return;
        }
        response = await fetch('http://127.0.0.1:8000/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCampaignName,
            product_ids: [productId],
          }),
        });
      } else if (selectedCampaign) {
        response = await fetch(`http://127.0.0.1:8000/campaigns/${selectedCampaign}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_ids: [productId],
          }),
        });
      } else {
        setValidationError('Select a campaign or create a new one');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error adding product to campaign');
      }

      setValidationError('');
      setSelectedCampaign('');
      setNewCampaignName('');
      setIsModalOpen(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error adding product to campaign:', error);
    }
  };

  const handleClick = () => {
    setIsModalOpen(true);
    fetchCampaigns();
  };

  const handleNavigation = () => {
    router.push(`/products/product_page/${product?.slug}`);
  };

  const handleCampaignNameChange = (e: { target: { value: SetStateAction<string> } }) => {
    setNewCampaignName(e.target.value);
    if (e.target.value) {
      setSelectedCampaign('');
    }
  };

  const handleCampaignSelectChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSelectedCampaign(e.target.value);
    if (e.target.value) {
      setNewCampaignName('');
    }
    setValidationError('');
  };

  return (
    <div className="maincard flex flex-col sm:flex-row items-center justify-center pt-3.5 dark:text-brand-dark p-5 rounded-l border-transparent bg-[#F9F9F9] dark:bg-dark-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:hover:shadow-[#787676]">
  
      {/* Left Column: Name and Domain Details */}
      <div className="flex flex-col w-full sm:w-4/5">
  
        {/* Top Row: Tags */}
          <div className="mb-2 flex gap-2 p-1 flex-wrap justify-center sm:justify-start">
            <span className="flex text-xs items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
              <CheckIconWithBg className="w-4 h-4 mr-1" />
              Guest Post
            </span>
            {isLinkInsertion && (
              <span className="flex items-center rounded-2xl bg-light-300 px-3 py-1 text-xs font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
                <CheckIconWithBg className="w-4 h-4 mr-1" />
                Link Insertion
              </span>
            )}
            {is_niche && (
                <span className="flex items-center rounded-2xl bg-light-300 px-3 py-1 text-xs font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
                  <CheckIconWithBg className="w-4 h-4 mr-1" />
                  Grey Niche
                </span>
              )}
          </div>
      
  
        {/* Bottom Row: Site Name, Domain Details */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start">
          <div className="flex flex-col w-full md:w-1/3 items-center md:items-start justify-center md:justify-start mb-4 md:mb-0">
            <h3 title={name} className="mb-0.5 text-xl truncate pl-2 font-medium text-blue-500 dark:text-blue-500 hover:underline text-left">
              <a href={`https://${name}`} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </h3>
            <h3 className="font-medium text-lg pl-2 hover:text-brand dark:text-dark-800 dark:hover:text-brand text-left">
              {shop?.name}
            </h3>
            <div className="flex flex-col mt-2 ml-0 p-1">
              <span className="mt-2 w-fit bg-light-300 rounded-2xl px-3 py-1 font-semibold capitalize text-xs text-brand dark:bg-dark-300 dark:text-brand-dark text-center">
                News, Media & Updates
              </span>
              
            </div>
          </div>
          <div className=" w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <span className="flex m-2 capitalize justify-start text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
              <UserIconAlt className="w-4 h-4 mr-1" />
              Domain Authority
              <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
                {product?.domain_authority}
              </p>
            </span>
            <span className="flex m-2 capitalize justify-start text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
              <StarIcon className="w-4 h-4 mr-1" />
              Domain Rating
              <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
                {product?.domain_rating}
              </p>
            </span>
            <span className="flex m-2 capitalize justify-start text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
              <PeopleIcon className="w-4 h-4 mr-1" />
              Organic Traffic
              <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
                {product?.organic_traffic}
              </p>
            </span>
            <span className="flex m-2 capitalize justify-start text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
              <HelpIcon className="w-4 h-4 mr-1" />
              Spam Score
              <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
                {product?.spam_score}
              </p>
            </span>
            <span className="flex m-2 capitalize justify-start text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
              <LangIcon className="w-4 h-4 mr-1" />
              Language
              <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
                {product?.languages}
              </p>
            </span>
            <span className="flex m-2 capitalize justify-start text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
              <LinkIcon className="w-4 h-4 mr-1" />
              Links
              <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
                {product?.link_type}
              </p>
            </span>
          </div>
          {/* Countries Section */}
      <div className="flex justify-start m-2 capitalize text-sm text-[#919494] dark:text-[#E4DFDF] items-center">
        <GlobalIcon className="w-4 h-4 mr-1" />
        Countries
        <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize  text-brand dark:bg-dark-300 dark:text-brand-dark">
          {product?.countries}
        </p>
      </div>
        </div>
      </div>
  
      {/* Right Column: Price and Buy Section */}
    <div className="Price_Buy flex flex-col w-full sm:w-1/3 justify-center items-center sm:pl-0">
      <span className="mt-2 rounded-l bg-light-00 px-4 py-2 !important-text-lg font-bold uppercase text-2xl text-brand dark:text-brand-dark">
        {isFreeItem ? 'Free' : price}
      </span>
      {!isFreeItem && basePrice && (
        <del className="text-xs md:text-sm font-medium text-dark-900 dark:text-dark-700">
          {basePrice}
        </del>
      )}
      <div className="flex flex-col mt-2">
        <button
          onClick={handleNavigation}
          className="flex justify-center rounded-lg w-full px-8 py-2 text-xl font-semibold text-white bg-brand dark:bg-brand dark:text-white mt-2"
        >
          Buy
        </button>
        <div className="mt-2 text-center flex items-center gap-2">
          <span
            onClick={handleClick}
            className="block text-base text-brand font-semibold cursor-pointer hover:underline"
          >
            Add to Campaign
          </span>
        </div>
      </div>

      </div>
  
      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Add to Campaign</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Create a new campaign</label>
              <input
                type="text"
                value={newCampaignName}
                onChange={handleCampaignNameChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Campaign Name"
              />
              <label className="block text-sm font-medium mb-2">Or select from your campaigns</label>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <select
                  value={selectedCampaign}
                  onChange={handleCampaignSelectChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddProductToCampaign(product.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
              {validationError && <div className="text-red-500 mt-2">{validationError}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
          <span>Product added successfully</span>
          <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
