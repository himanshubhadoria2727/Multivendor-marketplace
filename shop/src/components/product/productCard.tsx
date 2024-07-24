import { useState, useEffect, SetStateAction } from 'react';
import type { Product } from '@/types';
import Router, { useRouter } from 'next/router';
import { useModalAction } from '@/components/modal-views/context';
import routes from '@/config/routes';
import usePrice from '@/lib/hooks/use-price';
import { CheckIconWithBg } from '@/components/icons/check-icon-with-bg';
import { NicheIcon } from '../icons/custom/niche';
import { GuestPostIcon } from '../icons/custom/guest-post';
import { Authority } from '../icons/custom/authorityicon';
import { RatingIcon } from '../icons/custom/ratings';
import { TrafficIcon } from '../icons/custom/traffic';
import { LinkIconCx } from '../icons/custom/Link-icon';
import { GraphTraffic } from '../icons/custom/trafficgraph';
import { SpamIcon } from '../icons/custom/Spam';
import { LanguageICon } from '../icons/custom/language';
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
import { AUTH_TOKEN_KEY } from '@/data/client/token.utils';
import Cookies from 'js-cookie';



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
  const { id, name, slug, image, shop, preview_url, is_external, is_niche, isLinkInsertion } = product ?? {};
  const { isGridCompact } = useGridSwitcher();
  const { price, basePrice } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
  });
  const { t } = useTranslation('common');
  const isFreeItem = isFree(product?.sale_price ?? product?.price);

  const fetchCampaigns = async () => {
    try {
      const token = Cookies.get(AUTH_TOKEN_KEY);
      const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      const processedCampaigns = data.campaigns.map((campaign: any) => {
        return {
          ...campaign,
          name: campaign.name.replace(/^https?:\/\//, ''),
        };
      });
      setCampaignNames(processedCampaigns);
      setCampaigns(processedCampaigns);
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
    const token = Cookies.get(AUTH_TOKEN_KEY);

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
        response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns`, {
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
        response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns/${selectedCampaign}/products`, {
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

  const IconLabels = [
    { icon: Authority, label: "DA", value: product?.domain_authority },
    { icon: RatingIcon, label: "DR", value: product?.domain_rating },
    { icon: TrafficIcon, label: "Traffic", value: product?.organic_traffic }
  ];

  const IconLabels2 = [
    { icon: SpamIcon, label: "Spam", value: product?.spam_score },
    { icon: LanguageICon, label: "Lang", value: product?.languages },
    { icon: LinkIconCx, label: "Links", value: product?.link_type }
  ];
  return (
    <div className="maincard flex flex-col sm:flex-row border-t items-center justify-center pt-[0.1rem] dark:text-brand-dark p-4 md:pr-0   bg-light dark:bg-dark-200   ">

      {/* Left Column: Name and Domain Details */}
      <div className="flex flex-col w-full sm:w-4/5 ">

        {/* Top Row: Tags */}
        {/* <div className="mb-2 flex gap-3 p-1 flex-wrap max-sm:gap-4 justify-center sm:justify-start">
          <span className="flex text-[10px] max-sm:text-[15px] max items-center rounded-2xl bg-light-300 px-2 py-[3px] font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            <CheckIconWithBg className="w-4 h-4 mr-1" />
            Guest Post
          </span>
          {isLinkInsertion && (
            <span className="flex items-center rounded-2xl max-sm:text-[15px] bg-light-300 px-2 py-[3px] text-[10px] font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
              <CheckIconWithBg className="w-4 h-4 mr-1" />
              Link Insertion
            </span>
          )}

        </div> */}


        {/* Bottom Row: Site Name, Domain Details */}
        <div className="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start">
          <div className="flex flex-col w-full md:w-1/3 mt-5 items-center md:items-start justify-center md:justify-start mb-4 md:mb-0">
            <div className='flex flex-col justify-center items-center md:items-start'>
              <div className='flex gap-1 mr-2'>
                <img
                  src={`https://flagsapi.com/${product?.countries}/shiny/16.png`} alt={''}
                  width='24'
                  height='24'
                  className=''
                />
                {product?.countries}
              </div>
              <h3 title={name} className="mb-0.5 text-lg max-sm:text-2xl truncate pl-2 font-medium text-black-500 font-extrabold dark:text-blue-500 hover:underline text-center">
                <a href={`https://${name}`} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </h3>
              <div className="flex ml-0 p-1 items-center md:items-start">
                <h3 className="font-medium text-[10px] text-dark-700 pl-2 hover:text-brand dark:text-light-200 text-center md:text-left">
                  {shop?.name}
                </h3>
                <span className='mb-0.5 text-[10px] truncate pl-2 font-medium text-blue-500 dark:text-blue-500 hover:underline text-center'>
                  <a href={preview_url} target="_blank" rel="noopener noreferrer">View posts</a>
                </span>
              </div>


            </div>

            <div className="flex gap-2 ml-0 p-1 items-center md:items-start">
              <div className="flex gap-2 ml-0 p-1 items-center md:items-start">
                <span className="flex text-[10px] text-dark-700 dark:text-light-200 max-sm:text-[15px] max items-center rounded-2xl bg-blue-100 px-2 py-[3px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                  < GuestPostIcon className="w-4 h-4 mr-1" />
                  GP
                </span>
                {isLinkInsertion && (
                  <span className="flex items-center text-dark-700 dark:text-light-200 rounded-2xl max-sm:text-[15px] bg-blue-100 px-2 py-[3px] text-[10px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                    <LinkIconCx className="w-4 h-4 mr-1" />
                    LI
                  </span>
                )}


              </div>
              <div className="flex gap-2 ml-0 p-1 items-center md:items-start">
                {is_niche === '1' ? (
                  <span className="flex items-center text-dark-700 dark:text-light-200 rounded-2xl max-sm:text-[15px] bg-blue-100 px-2 py-[3px] text-[10px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                    <NicheIcon className="w-4 h-4 mr-1" />
                    Niche
                  </span>
                ) :
                  (
                    <span className="flex items-center text-dark-700 dark:text-light-200 rounded-2xl max-sm:text-[15px] bg-blue-100 px-2 py-[3px] text-[10px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                      No niche allowed
                    </span>
                  )
                }
              </div>
            </div>
          </div>
          <div className="w-full item-start justify-start flex md:ml-24 md:mt-12 items-center gap-12">
            <div className="w-full justify-start md:w-1/2">
              {IconLabels.map(({ icon: Icon, label, value }, index) => (
                <div key={index} className="flex justify-between items-center p-1 text-[12px] text-black dark:text-[#E4DFDF]">
                  <div className="flex items-center text-black dark:text-light-200 capitalize font-semibold space-x-1">
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{label}</span>
                  </div>
                  <span className="text-[12px] items-center font-semibold capitalize text-brand dark:text-brand ml-1">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full md:w-1/2">
              {IconLabels2.map(({ icon: Icon, label, value }, index) => (
                <div key={index} className="flex justify-between items-center p-1 text-[12px] text-black dark:text-[#E4DFDF]">
                  <div className="flex items-center text-black dark:text-light-200 capitalize font-semibold space-x-1">
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{label}</span>
                  </div>
                  <span className="text-[12px] items-center font-semibold capitalize text-brand dark:text-brand ml-1">
                    {value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Right Column: Price and Buy Section */}
      <div className="flex flex-col w-full h-ful  sm:w-1/4 justify-center items-center sm:pl-0">
        <span className="rounded-lg px-4 py-2 !important-text-xs  font-bold uppercase text-2xl text-brand dark:text-brand-dark">
          {isFreeItem ? 'Free' : price}
        </span>
        {!isFreeItem && basePrice && (
          <span className="text-[10px] md:text-sm font-medium text-dark-900 dark:text-dark-700">
            {basePrice}
          </span>
        )}
        <div className="flex flex-col">
          <button
            onClick={handleNavigation}
            className="flex justify-center rounded-lg w-full px-6x py-2 text-base  text-white bg-brand dark:bg-brand dark:text-white"
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
          <div className="bg-[#F9F9F9] dark:bg-dark-200 p-6 rounded-lg shadow-lg">
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
                  className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded"
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
        <div className="fixed bottom-16 md:bottom-4 right-4 bg-green-500 text-white p-4 rounded  flex items-center">
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
