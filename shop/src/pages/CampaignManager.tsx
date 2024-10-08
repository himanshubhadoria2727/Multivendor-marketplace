    import { useEffect, useState } from 'react';
import { SortOrder } from '@/types';
import AnchorLink from '@/components/ui/links/anchor-link';
import { BsBarChartLine, BsBox, BsCalendar, BsCart, BsCartCheck, BsCartCheckFill, BsClipboard, BsEye, BsMegaphone, BsPlus } from 'react-icons/bs'; // Import icons for sorting
import { Button } from '@mui/material';
import Spinner from '@/components/ui/loader/spinner/spinner';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/data/client/token.utils';
import Search from '@/components/common/search';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/ui/loaderAdmin/loader';

type Campaign = {
    id: string;
    name: string;
    created_at: string;
    product_count: number;
    order_count: number;
};

interface CampaignManagerProps {
    onCampaignClick: (id: string, name: string) => void;
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ onCampaignClick }) => {
    const { t } = useTranslation('common');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [validationError, setValidationError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortingObj, setSortingObj] = useState<{ column: string; sort: SortOrder }>({ column: '', sort: SortOrder.Desc });
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const token = Cookies.get(AUTH_TOKEN_KEY);
    useEffect(() => {
        const fetchCampaigns = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const processedCampaigns = data.campaigns.map((campaign: any) => {
                return {
                    ...campaign,
                    name: campaign.name.replace(/^https?:\/\//, ''),
                };
            });

            setCampaigns(processedCampaigns);
            setIsLoading(false);

        };

        fetchCampaigns();
    }, []);

    const handleAddCampaign = async () => {
        const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (newCampaignName.trim() === '' || !domainPattern.test(newCampaignName)) {
            setValidationError('Enter a valid campaign name');
            setNewCampaignName('');
            return;
        }
        await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newCampaignName }),
        });

        setNewCampaignName('');
        setIsModalOpen(false);
        setValidationError('');

        // Refresh campaigns
        const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        const processedCampaigns = data.campaigns.map((campaign: any) => {
            return {
                ...campaign,
                name: campaign.name.replace(/^https?:\/\//, ''),
            };
        });

        setCampaigns(processedCampaigns);
    };

    function handleSearch({ searchText }: { searchText: string }) {
        setSearchTerm(searchText);
    }

    const onHeaderClick = (column: string) => ({
        onClick: () => {
            const newSortOrder =
                sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
            setSortingObj({ sort: newSortOrder, column });
        },
    });

    const sortedCampaigns = [...campaigns].sort((a, b) => {
        switch (sortingObj.column) {
            case 'name':
                return sortingObj.sort === SortOrder.Asc
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            case 'totalProducts':
                return sortingObj.sort === SortOrder.Asc
                    ? (a.product_count || 0) - (b.product_count || 0)
                    : (b.product_count || 0) - (a.product_count || 0);
            case 'totalOrders':
                return sortingObj.sort === SortOrder.Asc
                    ? (a.order_count || 0) - (b.order_count || 0)
                    : (b.order_count || 0) - (a.order_count || 0);
            case 'createdAt':
                return sortingObj.sort === SortOrder.Asc
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

            default:
                return 0;
        }
    });

    const filteredCampaigns = sortedCampaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 dark:bg-dark-200 dark:text-white">

            <div className="flex justify-between items-center mb-4 bg-white dark:bg-dark-300 dark:text-white p-4 rounded-lg gap-2 shadow">
                <h1 className="text-xl text-brand dark:text-white font-bold flex gap-1">
                    <BsMegaphone/>
                    {t('Campaigns')}</h1>
                <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
                    <Search inputClassName='bg-white dark:bg-dark-400' onSearch={handleSearch} placeholderText='Search all campaigns ....' />
                </div>
                <button
                    className="bg-brand hover:bg-brand-dark text-white text-3xl font-bold p-1.5 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    onClick={() => setIsModalOpen(true)}
                >
                    <BsPlus />
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
                        {validationError && (
                            <p className="text-red-500 text-sm mb-2">{validationError}</p>
                        )}
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

            {/* Campaign Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <Loader />
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 dark:bg-dark-400 ">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    View
                                </th>
                                <th
                                    onClick={onHeaderClick('name').onClick}
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                >
                                    Name <span className="ml-1">{sortingObj.column === 'name' && sortingObj.sort === SortOrder.Asc ? "⇅" : "⇵"}</span>
                                </th>
                                <th
                                    onClick={onHeaderClick('totalOrders').onClick}
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-1">
                                        <BsCartCheck />
                                        Total Orders
                                        <span className="ml-1">
                                            {sortingObj.column === 'totalOrders' && sortingObj.sort === SortOrder.Asc ? "⇅" : "⇵"}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    onClick={onHeaderClick('totalProducts').onClick}
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-1">
                                        <BsBox />
                                        Total Sites
                                        <span className="ml-1">
                                            {sortingObj.column === 'totalProducts' && sortingObj.sort === SortOrder.Asc ? "⇅" : "⇵"}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    onClick={onHeaderClick('createdAt').onClick}
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-1">
                                    <BsCalendar/>
                                    Created at <span className="ml-1">{sortingObj.column === 'createdAt' && sortingObj.sort === SortOrder.Asc ? "⇅" : "⇵"}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-300 dark:divide-gray-700">
                            {sortedCampaigns.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-[15px]" colSpan={5}>
                                        No campaigns found
                                    </td>
                                </tr>
                            ) : (
                                searchTerm ? (filteredCampaigns.length === 0 ? (
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-[15px]" colSpan={5}>
                                            No campaigns found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCampaigns.map(campaign => (

                                        <tr key={campaign.id} className="hover:bg-gray-100 dark:hover:bg-dark-400">
                                            <td className="px-1.5 py-2 whitespace-nowrap">
                                                <Button onClick={() => onCampaignClick(campaign.id, campaign.name)} className="transition-transform transform hover:scale-125">
                                                    <BsEye className="text-xl text-brand hover:text-brand-dark dark:hover:text-brand-dark " />
                                                </Button>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px]">{campaign.name}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px] text-brand">{campaign.order_count}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px]">{campaign.product_count}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px]">{new Date(campaign.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )) :
                                    (sortedCampaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-gray-100 dark:hover:bg-dark-400">
                                            <td className="px-1.5 py-2 whitespace-nowrap">
                                                <Button onClick={() => onCampaignClick(campaign.id, campaign.name)} className="transition-transform transform hover:scale-125">
                                                    <BsEye className="text-xl text-brand hover:text-brand-dark dark:hover:text-brand-dark " />
                                                </Button>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px]">{campaign.name}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px] text-brand">{campaign.order_count}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px]">{campaign.product_count}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-[15px]">{new Date(campaign.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )))
                            )}
                        </tbody>
                    </table>
                )}

                {sortedCampaigns.length > 0 && (
                    <div className="bg-white dark:bg-dark-300 dark:text-white p-4 mt-4 rounded-lg shadow">
                        Showing {sortedCampaigns.length} results
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignManager;
