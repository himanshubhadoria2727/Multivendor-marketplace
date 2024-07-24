import { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { BsArrowLeftCircle, BsArrowRightCircle, BsCalendar, BsCart4, BsCash, BsInfo, BsTagFill, BsTrash } from 'react-icons/bs'; // Import trash icon for deletion
import { SortOrder } from '@/types';
import Spinner from '@/components/ui/loader/spinner/spinner';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/data/client/token.utils';
import Search from '@/components/common/search';

type Product = {
  id: number;
  name: string;
  created_at: string;
  price: number;
  status: string;
  pivot: {
    product_id: any;
    order_id: number | null;
    campaign_id: any;
  };
};

type CampaignDetailsProps = {
  id: string;
  name: string | null; // Allow name to be nullable
  onBack: () => void;
};

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ id, name, onBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortingObj, setSortingObj] = useState<{ column: string; sort: SortOrder }>({ column: '', sort: SortOrder.Desc });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [campaignname, setcampaignname] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (id) {
        const token = Cookies.get(AUTH_TOKEN_KEY)
        const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns/${id}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProducts(data.products);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortingObj.column) {
      case 'name':
        return sortingObj.sort === SortOrder.Asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      case 'createdAt':
        return sortingObj.sort === SortOrder.Asc ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price':
        return sortingObj.sort === SortOrder.Asc ? a.price - b.price : b.price - a.price;
      default:
        return 0;
    }
  });

  const onHeaderClick = (column: string) => ({
    onClick: () => {
      const newSortOrder = sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;
      setSortingObj({ sort: newSortOrder, column });
    },
  });
  const handleNavigation = (slug: string) => {
    router.push({
      pathname: `/products/product_page/${slug}`,
      query: { name },
    });
  };

  const orderNavigation = (id: number | null) => {
    router.push({
      pathname: `/order`,
      query: { id },
    });
  };

  const confirmDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const token = Cookies.get(AUTH_TOKEN_KEY);
    await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/campaigns/${productToDelete.pivot.campaign_id}/products/${productToDelete.pivot.product_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove the product from the list
    setProducts(products.filter(product => product.pivot.product_id !== productToDelete.pivot.product_id));
    setShowModal(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const handleBackClick = () => {
    onBack(); // Call the onBack function passed as prop
  };
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }


  return (
    <div className="p-4 dark:bg-dark-200 dark:text-white">
      <button
          className="rounded-full shadow-lg transition-transform transform hover:scale-105"
          onClick={handleBackClick}
        >
          <BsArrowLeftCircle className="text-2xl text-brand hover:text-brand-dark" />
        </button>
      <div className="flex justify-between items-center mb-4 bg-white dark:bg-dark-300 dark:text-white p-4 rounded-lg shadow gap-2">
        <h1 className="text-xl text-brand dark:text-white font-bold flex gap-1"><BsTagFill />{name}</h1>
        <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
          <Search inputClassName='bg-white dark:bg-dark-400' onSearch={handleSearch} placeholderText='Search all products ....' />
        </div>
      </div>


      {/* Products Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <Spinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-dark-400">
              <tr>

                <th
                  onClick={() => onHeaderClick('name').onClick()}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                >
                  Product Name <span className="ml-1">{sortingObj.column === 'name' && sortingObj.sort === SortOrder.Asc ? '⇅' : '⇵'}</span>
                </th>
                <th
                  onClick={() => onHeaderClick('createdAt').onClick()}
                  className="cursor-pointer px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                >
                  <div className="flex items-center text-center  gap-1">
                    <BsCalendar />
                    Created At <span className="ml-1">{sortingObj.column === 'createdAt' && sortingObj.sort === SortOrder.Asc ? '⇅' : '⇵'}</span>
                  </div>
                </th>
                <th
                  onClick={() => onHeaderClick('price').onClick()}
                  className="cursor-pointer px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                >
                  <div className="flex items-center text-center  gap-1">
                    <BsCash />
                    Price <span className="ml-1">{sortingObj.column === 'price' && sortingObj.sort === SortOrder.Asc ? '⇅' : '⇵'}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  <div className="flex items-center text-center gap-1">
                    <BsInfo />
                    Status
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  <div className="flex gap-1">
                    <BsCart4 />
                    Place Order
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-300 dark:divide-gray-700">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap" colSpan={6}>
                    No products found
                  </td>
                </tr>
              ) : (
                sortedProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-2 whitespace-nowrap">{product.name}</td>
                    <td className="px-9 py-2 whitespace-nowrap ">{new Date(product.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-2 whitespace-nowrap">{product.price}</td>
                    <td className="px-8 py-2 whitespace-nowrap">{product.status}</td>
                    {product.pivot.order_id ? (
                      <td className="px-10 py-2 whitespace-nowrap">
                        <div className='flex gap-2 cursor-pointer transition-transform transform hover:scale-105' onClick={() => orderNavigation(product.pivot.order_id)}>
                        <span className="text-base text-yellow-400 hover:text-yellow-500">View </span>
                        <button
                          className="rounded-full "
                          onClick={() => orderNavigation(product.pivot.order_id)}
                        >
                          <BsArrowRightCircle className=" text-yellow-400 text-xl hover:text-yellow-500" />
                        </button>
                        </div>
                      </td>
                    ) : (
                      <td className="px-10 py-2 whitespace-nowrap ">
                        <div className='flex gap-2 cursor-pointer transition-transform transform hover:scale-105' onClick={() => handleNavigation(product.name)}>
                        <span className="text-base text-brand hover:text-brand-dark ">Buy </span>
                        <button
                          className="rounded-full"
                          onClick={() => handleNavigation(product.name)}
                        >
                          <BsArrowRightCircle className="text-xl text-brand hover:text-brand-dark" />
                        </button>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-2 whitespace-nowrap text-center">
                      <button
                        onClick={() => confirmDeleteProduct(product)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <BsTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {sortedProducts.length > 0 && (
          <div className="bg-white dark:bg-dark-300 dark:text-white p-4 mt-4 rounded-lg shadow">
            Showing {sortedProducts.length} results
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-75">
          <div className="bg-white dark:bg-dark-200 p-6 rounded shadow-lg border border-black dark:border-white">
            <p className="text-lg text-gray-800 dark:text-white mb-4">Are you sure you want to delete {productToDelete.name}?</p>
            <div className="flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 mr-2 rounded"
              >
                No
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
