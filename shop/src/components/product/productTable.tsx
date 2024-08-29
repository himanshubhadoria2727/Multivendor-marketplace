import { Product, SortOrder } from '@/types';
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

interface TableProps {
    abc: Product[];
}
interface ProductTypeOptions {
    name: string;
    slug: string;
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
// const shopId = shopData?.id!;
// const [searchTerm, setSearchTerm] = useState('');
// const [page, setPage] = useState(1);
// const [orderBy, setOrder] = useState('created_at');
// const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
// const [type, setType] = useState('');
// const [category, setCategory] = useState('');


const ProductTable = ({ abc }: TableProps) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [orderBy, setOrder] = useState('created_at');
    const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [productType, setProductType] = useState('');
    const { locale } = useRouter();
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => {
      setVisible((v) => !v);
    };
  
    const {products, paginatorInfo, loading, error } = useProductsQuery({
      language: locale,
      name: searchTerm,
      limit: 20,
      page,
      orderBy,
      sortedBy,
      categories: category,
      product_type: productType,
      type,
    });
  
    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message={error.message} />;
  
    function handleSearch({ searchText }: { searchText: string }) {
      setSearchTerm(searchText);
      setPage(1);
    }
  
    function handlePagination(current: any) {
      setPage(current);
    }
    
    return (<>
        <Card className="m-3 mb-0 flex dark:bg-dark flex-col">
            <div className="flex w-full flex-col items-center md:flex-row">
                <div className="mb-4 md:mb-0 md:w-1/4">
                <PageHeadingForFilter title={t('Explore all sites')} />
                </div>

                <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
                    <Search onSearch={handleSearch} placeholderText='Search all sites ....' />
                </div>

                <button
                    className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-brand md:mt-0 md:ms-5"
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

            <div
                className={`flex w-full transition ${visible ? 'visible h-auto' : 'invisible h-0'}`}
            > 
                <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
                    <ProductFilter
                        className="w-full"
                    //   type={type}
                    //   onCategoryFilter={(category: Category) => {
                    //     setCategory(category?.slug!);
                    //     setPage(1);
                    //   }}
                    //   onTypeFilter={(type: Type) => {
                    //     setType(type?.slug!);
                    //     setPage(1);
                    //   }}
                      onProductTypeFilter={(productType: ProductTypeOptions) => {
                        setProductType(productType?.slug!);
                        setPage(1);
                      }}
                    //   enableCategory
                    //   enableType
                      enableProductType
                    />
                </div>
            </div>
        </Card>

        <ProductInventoryList
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn} 
        loading={false}      
        />
    </>
    );
};

export default ProductTable;
