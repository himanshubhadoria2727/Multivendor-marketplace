import { Category, Product, SortOrder } from '@/types';
import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import ProductFilter from '../filters/product-filter';
import Card from '@/components/common/card';
import PageHeading from '../ui/page-heading';
import Search from '../common/search';
import { ArrowUp } from '../icons/arrow-up';
import { ArrowDown } from '../icons/arrow-down';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useProductsQuery } from '@/data/product';
import PageHeadingForFilter from '../ui/page-heading-filter';
import ProductInventoryList from './product-list';
import { useRouter } from 'next/router';
import Loader from '../ui/loaderAdmin/loader';
import ErrorMessage from '../ui/error-message';
import { organic_traffic } from '../filters/options';
import CategoryFilter from './category-filter';
import { clearAllFilters } from '@/utils/clearFilterProducts';
import { Alert } from '@mui/material';
import CountdownTimer from '../ui/countdown-timer';
import { useAtom } from 'jotai';
import { checkIsMaintenanceModeComing, RESPONSIVE_WIDTH } from '@/lib/constants';
import { useSettings } from '@/data/settings';
import { CheckMark } from '../icons/checkmark';
import useAuth from '../auth/use-auth';
import { is } from 'date-fns/locale';
import { useMe } from '@/data/user';

interface TableProps {
  loading: boolean
}

interface ProductTypeOptions {
  name: string;
  slug: string;
}

export default function ProductTable() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [productType, setProductType] = useState('');
  const [countries, setcountries] = useState('');
  const [link_Type, setLinkType] = useState('');
  const [price, setPrice] = useState('');
  const [organic_traffic, setOrganicTraffic] = useState('');
  const [domain_authority, setDA] = useState('');
  const [domain_rating, setDR] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [isLinkInsertion, setLinkInsertion] = useState('');
  const { locale } = useRouter();
  const [visible, setVisible] = useState(false);
  const [underMaintenanceIsComing] = useAtom(checkIsMaintenanceModeComing);
  const { settings } = useSettings();
  const { isAuthorized } = useMe();



  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const { products, paginatorInfo, loading, error } = useProductsQuery({
    language: locale,
    name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
    product_type: productType,
    price: price,
    domain_authority: domain_authority,
    domain_rating: domain_rating,
    categories: category,
    organic_traffic: organic_traffic,
    isLinkInsertion: isLinkInsertion,
    link_type: link_Type,
    countries: countries,
    status: 'publish',
  });
  console.log(loading);
  console.log("shop side products", products)
  if (loading) return <Loader text={t('Loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }
    return (
      <>
        {/* {width >= RESPONSIVE_WIDTH && underMaintenanceIsComing? ( */}
        {isAuthorized? (
        <div
            className="flex flex-row m-3 p-2 pr-6 pl-4 bg-light max-sm:justify-center border rounded-lg content-center shadow-sm mb-0 justify-between dark:bg-dark-300"
          >

            <div className='text-base flex gap-2  max-sm:text-sm text-brand font-semibold'><CheckMark />You are good to go!</div>
            <div className='text-blue-600 [&>p]:bg-blue-200 max-sm:text-sm max-sm:hidden [&>p]:text-blue-600'>Adding 200+ websites every week !</div>
          </div>
        ):(
          null
        )
        }
        {/* <CategoryFilter
        onAllProductFilter={(status) => {
          setStatus(status);
          setPage(1);
        }}
        onCategoryFilter={(categorySlug: string) => {
          setStatus('');
          setCategory(categorySlug);
          setPage(1);
        }}
      /> */}

        <Card className="m-3 mb-0 border-l-2 border-r-2 border-brand/90 flex dark:bg-dark-300 flex-col">
          <div className="flex w-full flex-col items-center md:flex-row">
            <div className="mb-4 md:mb-0 md:w-1/4">
              <PageHeadingForFilter className='max-sm:text-[13px] text-dark-100 dark:text-light-200' title={t('Explore all sites')} />
            </div>
            <div className='flex w-full flex-row max-sm:flex max-sm:gap-6  '>

              <div className="flex max-sm:w-full max-sm:flex-col max-sm:w-full items-center ms-auto md:w-2/4">
                <Search inputClassName="bg-white dark:bg-dark-400 h-19 max-sm:h-8 text-sm" onSearch={handleSearch} placeholderText="Search all sites ...." />
              </div>

              <button
                className="mt-5 max-sm:mt-1 flex items-center whitespace-nowrap text-base font-semibold text-brand md:mt-0 md:ms-5 text-sm"
                onClick={toggleVisible}
              >
                {t('Filters ')}{' '}
                {visible ? (
                  <ArrowUp className="ms-2" />
                ) : (
                  <ArrowDown className="ms-2" />
                )}
              </button>
            </div>
          </div>

          <div className={`flex w-full transition ${visible ? 'block' : 'hidden'}`}>
            <div className="flex w-full h-full flex-col border-t border-gray-200 md:mt-3 md:flex-row md:items-center">
              <ProductFilter

                className="w-full text-sm"
                onProductTypeFilter={(productType: ProductTypeOptions) => {
                  setProductType(productType?.slug!);
                  setPage(1);
                }}
                onCountryFilter={(countries: ProductTypeOptions) => {
                  setcountries(countries?.slug!);
                  setPage(1);
                }}
                onLinkTypeFilter={(link_Type: ProductTypeOptions) => {
                  setLinkType(link_Type?.slug!);
                  setPage(1);
                }}
                onTrafficFilter={(organic_traffic: ProductTypeOptions) => {
                  setOrganicTraffic(organic_traffic?.slug!);
                  setPage(1);
                }}
                onPriceFilter={(price: ProductTypeOptions) => {
                  setPrice(price?.slug!);
                  setPage(1);
                }}
                onDAFilter={(domain_authority: ProductTypeOptions) => {
                  setDA(domain_authority?.slug!);
                  setPage(1);
                }}
                onDRFilter={(domain_rating: ProductTypeOptions) => {
                  setDR(domain_rating?.slug!);
                  setPage(1);
                }}
                onLIFilter={(isLinkInsertion: ProductTypeOptions) => {
                  setLinkInsertion(isLinkInsertion?.slug!);
                  setPage(1);
                }}
                onCategoryFilter={(categories: ProductTypeOptions) => {
                  setCategory(categories?.slug!);
                  setPage(1);
                }}
                enableDR
                enablePrice
                enableLinkType
                enableCountry
                enableDA
                enableLI
                enableCategory
                enableTrafficFilter
                enableProductType
              />
            </div>
          </div>
        </Card>

        {loading ? (
          <Loader text={t('common:Loading')} />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <ProductInventoryList
            loading={loading}
            products={products}
            paginatorInfo={paginatorInfo}
            onPagination={handlePagination}
            onOrder={setOrder}
            onSort={setColumn}
          />
        )}
      </>
    );
  }

