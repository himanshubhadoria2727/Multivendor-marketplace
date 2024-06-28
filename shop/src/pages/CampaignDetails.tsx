import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BsTrash } from 'react-icons/bs'; // Import trash icon for deletion
import { SortOrder } from '@/types';

type Product = {
  id: number;
  name: string;
  created_at: string;
  price: number;
};

type CampaignDetailsProps = {
  id: string;
};

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ id }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortingObj, setSortingObj] = useState<{ column: string; sort: SortOrder }>({ column: '', sort: SortOrder.Desc });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/campaigns/${id}/products`, {
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

  const handleDeleteProduct = async (productId: number) => {
    const token = localStorage.getItem('token');
    await fetch(`http://127.0.0.1:8000/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove the product from the list
    setProducts(products.filter(product => product.id !== productId));
  };

  return (
    <div className="p-4 dark:bg-dark-200 dark:text-white">
      <div className="flex justify-between items-center mb-4 bg-white dark:bg-dark-300 dark:text-white p-4 rounded shadow">
        <h1 className="text-2xl text-brand dark:text-white font-bold">Campaign Details</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Campaigns"
            className="border p-2 w-full text-sm focus:border-green-500 focus:outline-none bg-white text-black dark:bg-dark-100 dark:text-white dark:focus:border-green-500 rounded-l"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                >
                  Created At <span className="ml-1">{sortingObj.column === 'createdAt' && sortingObj.sort === SortOrder.Asc ? '⇅' : '⇵'}</span>
                </th>
                <th
                  onClick={() => onHeaderClick('price').onClick()}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                >
                  Price <span className="ml-1">{sortingObj.column === 'price' && sortingObj.sort === SortOrder.Asc ? '⇅' : '⇵'}</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(product.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Active</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="bg-brand text-white px-4 py-2 rounded">Place Order</button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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
          <div className="bg-white dark:bg-dark-300 dark:text-white p-4 mt-4 rounded shadow">
            Showing {sortedProducts.length} results
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
