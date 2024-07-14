import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
// import { siteSettings } from '@/settings/site.settings';
// import usePrice from '@/utils/use-price';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { NoDataFound } from '@/components/icons/no-data-found';
import { CircularProgress } from '@mui/material';
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
const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [id, setId]=useState('');

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns`, {
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

const handleClick = (id:any) => {
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
        <TitleWithSort
          title={t('Domain Name')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { id, type }: { id: any; type: any }) => (
        <div className="flex items-center">
          <div className="flex flex-col">
            <a href={`https://${name}`} className="truncate font-large hover:underline text-blue-700 dark:text-blue-500 text-[16px] tracking-wider ">{name}</a>
            <span className='text-brand hover:underline' onClick={() => handleClick(id)}>Add to campaign</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('DA')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_authority'
          }
          isActive={sortingObj.column === 'domain_authority'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_authority',
      key: 'domain_authority',
      // align: alignLeft,
      width: 50,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_authority'),
      render: (domain_authority: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col ">
            <span className="truncate font-medium  text-brand bg-brand/10 px-4 py-1 rounded-lg">{domain_authority}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('DR')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'domain_rating'
          }
          isActive={sortingObj.column === 'domain_rating'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'domain_rating',
      key: 'domain_rating',
      // align: alignLeft,
      width: 50,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('domain_rating'),
      render: (domain_rating: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{domain_rating}</span>

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('SC')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'spam_score'
          }
          isActive={sortingObj.column === 'spam_score'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'spam_score',
      key: 'spam_score',
      // align: alignLeft,
      width: 50,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('spam_score'),
      render: (spam_score: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{spam_score}</span>

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Traffic')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'organic_traffic'
          }
          isActive={sortingObj.column === 'organic_traffic'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'organic_traffic',
      key: 'organic_traffic',
      // align: alignLeft,
      width: 60,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('organic_traffic'),
      render: (organic_traffic: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <span className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{organic_traffic}</span>

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Links')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'link_type'
          }
          isActive={sortingObj.column === 'link_type'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'link_type',
      key: 'link_type',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('link_type'),
      render: (link_type: string) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            {
              link_type==='Dofollow'?(
              <span className="truncate font-medium text-purple-500 bg-brand/10 px-4 py-1 rounded-lg">{link_type}</span>
              ):
              (
                <span className="truncate font-medium text-blue-500 bg-brand/10 px-4 py-1 rounded-lg">{link_type}</span>

              )
            }
          </div>
        </div>
      ),
    },
    {
      title: "Language",
      className: 'cursor-pointer',
      dataIndex: 'languages',
      key: 'languages',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('languages'),
      render: (languages: number) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <button className="truncate font-medium text-brand bg-brand/10 px-4 py-1 rounded-lg">{languages}</button>
          </div>
        </div>
      ),
    },
    {
      title: "GP",
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (price: number, { slug }: { slug: any }) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <button onClick={() => router.push(`/products/product_page/${slug}`)} className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition duration-300 hover:text-white hover:bg-brand border-brand py-1">Buy ${price}</button>
          </div>
        </div>
      ),
    },
    {
      title: "LI",
      className: 'cursor-pointer',
      dataIndex: 'isLinkInsertion',
      key: 'isLinkInsertion',
      // align: alignLeft,
      width: 70,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (isLinkInsertion: string, { price, type, slug }: { price: any; type: any, slug: any }) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            {isLinkInsertion === '1' ? (
              <button onClick={() => router.push(`/products/product_page/${slug}`)} className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition duration-300 hover:text-white hover:bg-brand border-brand py-1">Buy ${price}</button>
            ) : (
              <button className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition duration-300 hover:text-white hover:bg-brand border-brand py-1">N/A</button>
            )
            }
          </div>
        </div>
      ),
    },
    {
      title: "Grey Niche",
      className: 'cursor-pointer',
      dataIndex: 'is_niche',
      key: 'is_niche',
      // align: alignLeft,
      width: 80,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('price'),
      render: (is_niche: string) => (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            {is_niche === '1' ? (
              <button className="border justify-center w-[5rem] rounded-lg text-brand font-bold transition border-brand py-1">Available</button>

            ) : (
              <button className="border justify-center w-[5rem] rounded-lg text-brand font-bold border-brand py-1">N/A</button>
            )}
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
      <div className="flex justify-center items-center w-full h-64">
        <CircularProgress />
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
        scroll={{ x: 900 }}
      />
    )}
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
            {campaigns.map((campaign:any) => (
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
    <div className="flex mb-5 font items-center justify-center">
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
