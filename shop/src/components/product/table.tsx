import { Product } from '@/types';
import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

interface TableProps {
  products: Product[];
}

const organicTrafficOptions = [
  { label: 'Less than 500', value: [0, 499] },
  { label: '500 - 1000', value: [500, 1000] },
  { label: '1000 - 2000', value: [1000, 2000] },
  { label: '2000 - 3000', value: [2000, 3000] },
  { label: '3000 - 5000', value: [3000, 5000] },
  { label: '5000 - 10000', value: [5000, 10000] },
  { label: '10000 - 50000', value: [10000, 50000] },
  { label: '50000 and above', value: [50000, Infinity] },
];

const ProductTable = ({ products }: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [domainAuthorityRange, setDomainAuthorityRange] = useState<number[]>([0, 100]);
  const [domainRatingRange, setDomainRatingRange] = useState<number[]>([0, 100]);
  const [trafficFilter, setTrafficFilter] = useState<number[]>([0, Infinity]);
  const itemsPerPage = 10;

  const clearFilters = () => {
    setSearchTerm('');
    setDomainAuthorityRange([0, 100]);
    setDomainRatingRange([0, 100]);
    setTrafficFilter([0, Infinity]);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomainAuthority = product.domain_authority >= domainAuthorityRange[0] && product.domain_authority <= domainAuthorityRange[1];
    const matchesDomainRating = product.domain_rating >= domainRatingRange[0] && product.domain_rating <= domainRatingRange[1];
    const matchesTraffic = product.organic_traffic >= trafficFilter[0] && product.organic_traffic <= trafficFilter[1];
    return matchesSearch && matchesDomainAuthority && matchesDomainRating && matchesTraffic;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleFilters = () => setShowFilters(prev => !prev);

  const handleDomainAuthorityChange = (event: Event, newValue: number | number[]) => {
    setDomainAuthorityRange(newValue as number[]);
  };

  const handleDomainRatingChange = (event: Event, newValue: number | number[]) => {
    setDomainRatingRange(newValue as number[]);
  };

  const handleTrafficFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedOption = event.target.value as string;
    if (selectedOption === "") {
      setTrafficFilter([]); // Reset the filter if "Select Traffic" is selected
    } else {
      const optionValue = JSON.parse(selectedOption) as number[];
      setTrafficFilter(optionValue);
    }
  };

  const anyFilterApplied =
    searchTerm !== '' ||
    domainAuthorityRange[0] !== 0 || domainAuthorityRange[1] !== 100 ||
    domainRatingRange[0] !== 0 || domainRatingRange[1] !== 100 ||
    trafficFilter[0] !== 0 || trafficFilter[1] !== Infinity;

  return (
    <div className="container mx-auto my-8">
      <div className="bg-white dark:bg-black p-4 mb-4 rounded shadow flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-1/2 p-2 border border-gray-300 dark:border-gray-700 rounded"
        />
        {anyFilterApplied &&
          <button
            onClick={clearFilters}
            className="ml-4 px-4 py-2 bg-gray-800 text-white rounded"
          >
            Clear Filters
          </button>
        }
        <button
          onClick={toggleFilters}
          className="ml-4 px-4 py-2 bg-gray-800 text-white rounded"
        >
          Filters
        </button>
      </div>
      {showFilters && (
        <div className="bg-white dark:bg-black p-4 mb-4 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Domain Authority (min: {domainAuthorityRange[0]}, max: {domainAuthorityRange[1]})</label>
              <Slider
                value={domainAuthorityRange}
                onChange={handleDomainAuthorityChange}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Domain Rating (min: {domainRatingRange[0]}, max: {domainRatingRange[1]})</label>
              <Slider
                value={domainRatingRange}
                onChange={handleDomainRatingChange}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Traffic</label>
              <select
                value={JSON.stringify(trafficFilter)}
                onChange={handleTrafficFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
              >
                <option value="" selected >Select Traffic</option>
                {organicTrafficOptions.map((option, index) => (
                  <option key={index} value={JSON.stringify(option.value)}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="py-4 px-4 border-b justify-start border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Domain Name</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">DA</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">DR</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Traffic</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Links</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">SC</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Languages</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Countries</th>
              <th className="py-4 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">GP</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={index} className="text-center">
                <td className="py-4 px-4 border-b justify-start border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.name}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.domain_authority}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.domain_rating}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.organic_traffic}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.link_type}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.spam_score}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.languages}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.countries}</td>
                <td className="py-4 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-900 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
