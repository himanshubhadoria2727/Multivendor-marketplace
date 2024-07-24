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
import { SpinnerLoader } from '../ui/loader/spinner/spinner';


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
const [id, setId]=useState('');

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
      const processedCampaigns = data.campaigns.map((campaign:any) => {
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
          <Tooltip title="This column shows the domain names">
            <IconButton size="small" style={{}}>
              <DomainIcon style={{fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </div></div>

      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { id, type }: { id: any; type: any }) => (
        <div className="flex flex-col items-start">
          <div className="flex flex-col">
            <div className='flex'>
              <a href={`https://${name}`} className="truncate text-dark font-semibold hover:underline text-blue-700 dark:text-blue-500 text-[16px] max-sm:text-[13px] tracking-wider ">{name}</a>
              <LinkIcon style={{fontSize: 14 }} />
            </div>
          </div>
          <p className='text-blue-600 bg-blue-100 text-[12px] max-sm:text-[10px] px-3 border rounded-lg hover:underline' onClick={() => handleClick(id)}>Add to campaign</p>
        </div>
      ),
    },
    {
      title: (
        <div className='flex'>
          <TitleWithSort
          title={t('DA')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_authority'
          }
          isActive={sortingObj.column === 'domain_authority'}
        />
        <div className="flex items-center">
          <Tooltip title="Domain Authority">
            <IconButton size="small" style={{}}>
              <StarIcon style={{fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </div></div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_authority',
      key: 'domain_authority',
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_authority'),
      render: (domain_authority: number) => (
        <div className="flex items-center gap-2 items-start">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVNvetVv+xfwuxEuuqt3/X////z+/6/5vhmxe2o3fT5/f7M6/m54/ea2fSM1PKs4PXl9fx4y++f2vQMWunWAAAAhElEQVR4Ad3RxxXDMAwEUTCMJK7E5P57dc6mGxBu8/5tYTs75713fzJEmOblkcs8QQwPTAJWfyu/AkqfqO2qftMAUXRmLooRomyWxRihFBigagMkoFV9Y+kXvVgvvxjyBDDlMELLAmX7wgic0RIkOyNvC1nPh3xdr9brfufsgw842+mdAC4OBqWvVW0xAAAAAElFTkSuQmCC" alt="" width={16} height={16}/>
          <span className="truncate font-medium rounded-lg">{domain_authority}</span>
        </div>
      ),
    },
    {
      title: (
        <div className='flex'>
          <TitleWithSort
          title={t('DR')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_rating'
          }
          isActive={sortingObj.column === 'domain_rating'}
        />
        <div className="flex items-center">
          <Tooltip title="Domain Rating">
            <IconButton size="small" style={{}}>
              <StarIcon style={{fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </div></div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_rating',
      key: 'domain_rating',
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_rating'),
      render: (domain_rating: number) => (
        <div className="flex items-center gap-1 items-start">
          <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
          <span className="truncate font-medium">{domain_rating}</span>
        </div>
      ),
    },
    {
      title: (
        <div className='flex'>
          <TitleWithSort
          title={t('SC')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'spam_score'
          }
          isActive={sortingObj.column === 'spam_score'}
        />
        <div className="flex items-center">
          <Tooltip title="Spam Score">
            <IconButton size="small" style={{}}>
              <StarIcon style={{fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </div></div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'spam_score',
      key: 'spam_score',
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('spam_score'),
      render: (spam_score: number) => (
        <div className="flex items-center gap-1 items-start">
          <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
          <span className="truncate font-medium">{spam_score}</span>
        </div>
      ),
    },
    {
      title: (
        <div className='flex'>
          <TitleWithSort
          title={t('Traffic')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'organic_traffic'
          }
          isActive={sortingObj.column === 'organic_traffic'}
        />
        <div className="flex items-center">
          <Tooltip title="Organic Traffic">
            <IconButton size="small" style={{}}>
              <TrendingUpIcon style={{fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </div></div>
      ),
      className: 'cursor-pointer max-sm:w-10',
      dataIndex: 'organic_traffic',
      key: 'organic_traffic',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('organic_traffic'),
      render: (organic_traffic: number) => (
        <div className="flex items-center gap-1 items-start">
          <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt="" />
          <span className="truncate font-medium">{organic_traffic}</span>
        </div>
      ),
    },
    {
      title: (
        <div className='flex'>
          <TitleWithSort
          title={t('Links')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'link_type'
          }
          isActive={sortingObj.column === 'link_type'}
        />
        <div className="flex items-center">
          <Tooltip title="Link Type">
            <IconButton size="small" style={{}}>
              <LinkIcon style={{fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </div></div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'link_type',
      key: 'link_type',
      width: 80,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('link_type'),
      render: (link_type: string) => (
        <div className="flex items-center gap-2 items-start">
          {
            link_type === 'Dofollow' ? (
              <>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVNvetVv+xfwuxEuuqt3/X////z+/6/5vhmxe2o3fT5/f7M6/m54/ea2fSM1PKs4PXl9fx4y++f2vQMWunWAAAAhElEQVR4Ad3RxxXDMAwEUTCMJK7E5P57dc6mGxBu8/5tYTs75713fzJEmOblkcs8QQwPTAJWfyu/AkqfqO2qftMAUXRmLooRomyWxRihFBigagMkoFV9Y+kXvVgvvxjyBDDlMELLAmX7wgic0RIkOyNvC1nPh3xdr9brfufsgw842+mdAC4OBqWvVW0xAAAAAElFTkSuQmCC" alt="" width={16} height={16}/>
                <span className="truncate font-medium">{link_type}</span>
              </>
            ) : (
              <>
                <img src="https://static.ahrefs.com/static/assets/conference-icon-UWOS37EX.svg" alt=""/>
                <span className="truncate font-medium">{link_type}</span>
              </>
            )
          }
        </div>
      ),
    },
    {
      title: (
          <div className='flex'>
            <TitleWithSort
            title={t('Country')}
            ascending={
              sortingObj.sort === SortOrder.Asc && sortingObj.column === 'countries'
            }
            isActive={sortingObj.column === 'countries'}
          />
        <div className="flex items-center">
          <Tooltip title="This column shows the country flags and names">
            <IconButton size="small" style={{}}>
              <PublicIcon style={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </div></div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'countries',
      key: 'countries',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('countries'),
      render: (countries: number) => (
        <div className="flex items-center items-start">
          <div className="flex flex-col">
            <button className="flex gap-1 truncate font-medium rounded-lg">
              <Image
                src={`https://flagsapi.com/${countries}/shiny/64.png`}
                width={16}
                height={16} alt={''} />
              {countries}
            </button>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <span>Grey Niche</span>
        </div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'is_niche',
      key: 'is_niche',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (is_niche: string) => (
        <div className="flex items-center items-start">
          <div className="flex flex-col">
            {is_niche === '1' ? (
              <button className="border items-start w-[5rem] rounded-lg text-brand font-bold transition border-brand py-1">Available</button>
            ) : (
              <button className="border items-start w-[5rem] rounded-lg text-brand font-bold border-brand py-1">N/A</button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <span>Buy Now</span>
        </div>
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (price: number, { slug }: { slug: any }) => (
        <div className="flex items-center items-start">
          <div className="flex flex-col">
            <button onClick={() => router.push(`/products/product_page/${slug}`)} className="border items-start w-[5rem] rounded-lg text-brand font-medium transition duration-300 bg-brand text-light border-brand py-1">Buy ${price}</button>
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
          <div className="flex items-start items-center w-full h-64">
            <Spinner />
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
          <div className="fixed inset-0 z-50 flex justify-center items-center items-start bg-black bg-opacity-50">
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
                    className="w-full bg-white dark:bg-dark-300 p-2 border border-gray-300 rounded mb-4"
                  >
                    {campaigns.map((campaign: any) => (
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
        <div className="flex mb-5 font items-center justify-center items-start">
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
