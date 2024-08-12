import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
// import { siteSettings } from '@/settings/site.settings';
// import usePrice from '@/utils/use-price';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { NoDataFound } from '@/components/icons/no-data-found';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import DomainIcon from '@mui/icons-material/Domain';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LinkIcon from '@mui/icons-material/Link';
import {
  Product,
  MappedPaginatorInfo,
  ProductType,
  Shop,
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import TitleWithSort from '@/components/ui/title-with-sort';
import { useState, useEffect, SetStateAction } from 'react';
import { AUTH_TOKEN_KEY } from '@/data/client/token.utils';
import Cookies from 'js-cookie';
import Spinner, { SpinnerLoader } from '../ui/loader/spinner/spinner';
import Loader from '../ui/loaderAdmin/loader';
import { GuestPostIcon } from '../icons/custom/guest-post';
import { LinkIconCx } from '../icons/custom/Link-icon';
import { NicheIcon } from '../icons/custom/niche';


type Campaign = {
  id: number;
  name: string;
  created_at: string;
  product_count: number;
};

export type IProps = {
  loading: boolean;
  products: Product[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const ProductInventoryList = ({
  loading,
  products,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = products! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const {
    query: { },
  } = router;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
    sort: SortOrder.Desc,
    column: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignNames, setCampaignNames] = useState<string[]>([]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [id, setId] = useState('');

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
  const campaignOptions = campaigns.map((campaign) => (
    <option key={campaign.id} value={campaign.id}>
      {campaign.name}
    </option>
  ));

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
        setLoading(true);
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
        setLoading(true);
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
      setLoading(false);
      setIsModalOpen(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error adding product to campaign:', error);
    }
  };

  const handleClick = (id: any) => {
    setId(id);
    setIsModalOpen(true);
    fetchCampaigns();
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

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  let columns = [
    {
      title: (
        <div className='flex'>
          <TitleWithSort
            title={t('Domain Name')}
            ascending={
              sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
            }
            isActive={sortingObj.column === 'name'}
          />
          <div className="flex items-center">
            <Tooltip title="Domain name">
              <IconButton size="small" style={{}}>
                <DomainIcon style={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </div></div>

      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 150,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { id, type, isLinkInsertion, is_niche }: { id: any; type: any; isLinkInsertion: any; is_niche: any }) => (
        <div className="flex flex-col items-start text-dark-100 gap-[4px] dark:text-light-400">
          <div className="flex flex-col">
            <div className='flex'>
              <a href={`https://${name}`} className="truncate text-dark font-semibold hover:underline text-blue-700 dark:text-blue-500 text-[16px] max-sm:text-[14px] tracking-wider ">{name}</a>
              {/* <LinkIcon style={{ fontSize: 14 }} /> */}
            </div>
          </div>
          <div className='flex gap-1'>
            <Tooltip title="Guest post available">
              <span className="flex text-[10px] max-sm:text-[8px] text-dark-100 dark:text-light-400 max items-center rounded-2xl bg-blue-100 px-2 py-[3px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                < GuestPostIcon className="w-4 h-4 mr-1" />
                GP
              </span>
            </Tooltip>
            {isLinkInsertion && (
              <Tooltip title="Link Insertion allowed">
                <span className="flex text-[10px] max-sm:text-[8px] items-center text-dark-100 dark:text-light-400 rounded-2xl max-sm:text-[8px] bg-red-100 px-2 py-[3px] text-[10px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                  <LinkIconCx className="w-4 h-4 mr-1" />
                  LI
                </span>
              </Tooltip>
            )}
            {is_niche === '1' ? (
              <Tooltip title="Grey Niche links allowed">
                <span className="flex text-[10px] max-sm:text-[8px] items-center text-dark-100 dark:text-light-400 rounded-2xl max-sm:text-[8px] bg-green-100 px-2 py-[3px] text-[10px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                  <NicheIcon className="w-4 h-4 mr-1" />
                  Niche
                </span>
              </Tooltip>
            ) :
              (
                <Tooltip title="Grey Niche links not allowed">
                <span className="flex text-[10px] max-sm:text-[8px] items-center text-dark-100 dark:text-light-400 rounded-2xl max-sm:text-[8px] bg-green-100 px-2 py-[3px] text-[10px] font-semibold capitalize text-black dark:bg-dark-300 dark:text-brand-dark">
                  No niche allowed
                </span>
                </Tooltip>
              )
            }
          </div>
        </div>
      ),
    },
    {
      title: (
        <Tooltip title="Domain Authority">
          <div className='flex'>
            <TitleWithSort
              title={t('DA')}
              ascending={
                sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_authority'
              }
              isActive={sortingObj.column === 'domain_authority'}
            />
            <div className="flex items-center">
              <IconButton size="small" style={{}}>
                <StarIcon style={{ fontSize: 14 }} />
              </IconButton>
            </div></div>
        </Tooltip>
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_authority',
      key: 'domain_authority',
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_authority'),
      render: (domain_authority: number) => (
        <Tooltip title={'Verified by Moz'}>
          <div className="flex items-center gap-2 items-start text-dark-100 dark:text-light-400">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVNvetVv+xfwuxEuuqt3/X////z+/6/5vhmxe2o3fT5/f7M6/m54/ea2fSM1PKs4PXl9fx4y++f2vQMWunWAAAAhElEQVR4Ad3RxxXDMAwEUTCMJK7E5P57dc6mGxBu8/5tYTs75713fzJEmOblkcs8QQwPTAJWfyu/AkqfqO2qftMAUXRmLooRomyWxRihFBigagMkoFV9Y+kXvVgvvxjyBDDlMELLAmX7wgic0RIkOyNvC1nPh3xdr9brfufsgw842+mdAC4OBqWvVW0xAAAAAElFTkSuQmCC" alt="" width={16} height={16} />
            <span className="truncate font-medium rounded-lg">{domain_authority}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <Tooltip title="Domain Rating">
          <div className='flex'>
            <TitleWithSort
              title={t('DR')}
              ascending={
                sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_rating'
              }
              isActive={sortingObj.column === 'domain_rating'}
            />
            <div className="flex items-center">
              <IconButton size="small" style={{}}>
                <StarIcon style={{ fontSize: 14 }} />
              </IconButton>
            </div></div>
        </Tooltip>
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_rating',
      key: 'domain_rating',
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_rating'),
      render: (domain_rating: number) => (
        <Tooltip title={'Verified by Ahref'}>
          <div className="flex items-center gap-1 items-start text-dark-100 dark:text-light-400">
            <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
            <span className="truncate font-medium">{domain_rating}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <Tooltip title="Spam Score">
          <div className='flex'>
            <TitleWithSort
              title={t('SC')}
              ascending={
                sortingObj.sort === SortOrder.Asc && sortingObj.column === 'spam_score'
              }
              isActive={sortingObj.column === 'spam_score'}
            />
            <div className="flex items-center">
              <IconButton size="small" style={{}}>
                <StarIcon style={{ fontSize: 14 }} />
              </IconButton>
            </div></div>
        </Tooltip>
      ),
      className: 'cursor-pointer',
      dataIndex: 'spam_score',
      key: 'spam_score',
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('spam_score'),
      render: (spam_score: number) => (
        <Tooltip title={'Verified by Ahref'}>
          <div className="flex items-center gap-1 items-start text-dark-100 dark:text-light-400">
            <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
            <span className="truncate font-medium">{spam_score}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <Tooltip title="Organic Traffic">
          <div className='flex'>
            <TitleWithSort
              title={t('Traffic')}
              ascending={
                sortingObj.sort === SortOrder.Asc && sortingObj.column === 'organic_traffic'
              }
              isActive={sortingObj.column === 'organic_traffic'}
            />
            <div className="flex items-center">
              <IconButton size="small" style={{}}>
                <TrendingUpIcon style={{ fontSize: 14 }} />
              </IconButton>
            </div></div>
        </Tooltip>
      ),
      className: 'cursor-pointer max-sm:w-10',
      dataIndex: 'organic_traffic',
      key: 'organic_traffic',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('organic_traffic'),
      render: (organic_traffic: number) => (
        <Tooltip title={'Verified by Ahref'}>
          <div className="flex items-center gap-1 items-start text-dark-100 dark:text-light-400">
            <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
            <span className="truncate font-medium">{organic_traffic}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <Tooltip title="Link Type">
          <div className='flex'>
            <TitleWithSort
              title={t('Links')}
              ascending={
                sortingObj.sort === SortOrder.Asc && sortingObj.column === 'link_type'
              }
              isActive={sortingObj.column === 'link_type'}
            />
            <div className="flex items-center">
              <IconButton size="small" style={{}}>
                <LinkIcon style={{ fontSize: 14 }} />
              </IconButton>
            </div></div>
        </Tooltip>
      ),
      className: 'cursor-pointer',
      dataIndex: 'link_type',
      key: 'link_type',
      width: 80,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('link_type'),
      render: (link_type: string) => (
        <Tooltip title={'Verified by Ahref and Moz'}>
          <div className="flex items-center gap-2 items-start text-dark-100 dark:text-light-400">
            {
              link_type === 'Dofollow' ? (
                <>
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVNvetVv+xfwuxEuuqt3/X////z+/6/5vhmxe2o3fT5/f7M6/m54/ea2fSM1PKs4PXl9fx4y++f2vQMWunWAAAAhElEQVR4Ad3RxxXDMAwEUTCMJK7E5P57dc6mGxBu8/5tYTs75713fzJEmOblkcs8QQwPTAJWfyu/AkqfqO2qftMAUXRmLooRomyWxRihFBigagMkoFV9Y+kXvVgvvxjyBDDlMELLAmX7wgic0RIkOyNvC1nPh3xdr9brfufsgw842+mdAC4OBqWvVW0xAAAAAElFTkSuQmCC" alt="" width={16} height={16} />
                  <span className="truncate font-medium">{link_type}</span>
                </>
              ) : (
                <>
                  <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
                  <span className="truncate font-medium">{link_type}</span>
                </>
              )
            }
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <Tooltip title="Countries">
          <div className='flex'>
            <TitleWithSort
              title={t('Country')}
              ascending={
                sortingObj.sort === SortOrder.Asc && sortingObj.column === 'countries'
              }
              isActive={sortingObj.column === 'countries'}
            />
            <div className="flex items-center">
              <IconButton size="small" style={{}}>
                <PublicIcon style={{ fontSize: 13 }} />
              </IconButton>
            </div></div>
        </Tooltip>
      ),
      className: 'cursor-pointer',
      dataIndex: 'countries',
      key: 'countries',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('countries'),
      render: (countries: number) => (
        <Tooltip title={'Verified by Ahref'}>
          <div className="flex items-center items-start text-dark-100 dark:text-light-400">
            <div className="flex gap-1">
              <Image
                src={`https://flagsapi.com/${countries}/shiny/64.png`}
                width={16}
                height={16} alt={''} />
              {countries}
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <span>Language</span>
        </div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'languages',
      key: 'languages',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('languages'),
      render: (languages: string) => (
        <Tooltip title={'Verified by Moz'}>
          <div className="flex items-center gap-1 items-start text-dark-100 dark:text-light-400">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVNvetVv+xfwuxEuuqt3/X////z+/6/5vhmxe2o3fT5/f7M6/m54/ea2fSM1PKs4PXl9fx4y++f2vQMWunWAAAAhElEQVR4Ad3RxxXDMAwEUTCMJK7E5P57dc6mGxBu8/5tYTs75713fzJEmOblkcs8QQwPTAJWfyu/AkqfqO2qftMAUXRmLooRomyWxRihFBigagMkoFV9Y+kXvVgvvxjyBDDlMELLAmX7wgic0RIkOyNvC1nPh3xdr9brfufsgw842+mdAC4OBqWvVW0xAAAAAElFTkSuQmCC" alt="" width={16} height={16} />
            <span className="truncate font-medium">{languages}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <div className="flex justify-center items-center">
          <span>Buy Now</span>
        </div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (price: number, { slug ,id }: { slug: any,id:any }) => (
        <div className="flex items-center justify-center text-dark-100 dark:text-light-400">
          <div className="flex flex-col items-center gap-1 justify-center">
            <button onClick={() => router.push(`/products/product_page/${slug}`)} className="border items-start text-dark-100 dark:text-light-400 w-[5rem] rounded-lg text-brand font-medium transition duration-300 bg-brand text-light border-brand py-1">Buy ${price}</button>
            <p className='flex gap-1 text-dark-600 dark:text-light-400 bg-purple-100  dark:bg-dark-400 text-[11px] max-sm:text-[10px] px-2 border rounded-lg hover:underline' onClick={() => handleClick(id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi mt-[3px] bi-bookmark-plus-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z" />
            </svg>Add to campaign</p>
          </div>
        </div>
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }




  return (
    <>
      <div className="mb-6 m-3 overflow-hidden bg-white dark:bg-dark-100 rounded-lg shadow">
        {loading ? (
          <div className="flex items-start text-dark-100 dark:text-light-400 items-center w-full h-64">
            <Loader />
          </div>
        ) : (
          <Table
            /* @ts-ignore */
            columns={columns}
            emptyText={() => (
              <div className="flex flex-col items-center py-7">
                <NoDataFound className="w-52" />
                <div className="mb-1 pt-6 text-base font-semibold text-heading">
                  {t('No data found')}
                </div>
                <p className="text-[13px]">
                  {t('Sorry we couldn’t find any data')}
                </p>
              </div>
            )}
            data={products}
            rowKey="id"
            scroll={{ x: 1050 }}
          />
        )}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center items-start text-dark-100 dark:text-light-400 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-dark-300 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Add to Campaign</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Create a new campaign</label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={handleCampaignNameChange}
                  className="w-full bg-white dark:bg-dark-300 p-2 border border-gray-300 rounded mb-4"
                  placeholder="Campaign Name"
                />
                <label className="block text-sm font-medium mb-2">Or select from your campaigns</label>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <select
                  value={selectedCampaign}
                  onChange={handleCampaignSelectChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4 bg-[#F9F9F9] dark:bg-dark-200"
                >
                  <option value="" disabled>Select Campaign</option>
                  {campaignOptions}
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
                    onClick={() => handleAddProductToCampaign(id)}
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
          <div className="fixed bottom-16 md:bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
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

      {!!paginatorInfo?.total && (
        <div className="flex mb-5 font items-center justify-center items-start text-dark-100 dark:text-light-400">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </>

  );
};

export default ProductInventoryList;
