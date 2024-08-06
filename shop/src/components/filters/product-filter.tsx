import { useState, useEffect } from 'react';
import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { LinkType, ProductType } from '@/types';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';
import useCountries from './useCountry';
import { domain_authority, isLinkInsertion, linkType, organic_traffic, price } from './options';
import { useCategories } from '@/data/category';
import Loader from '../ui/loaderAdmin/loader';

type Props = {
  onProductTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onCountryFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onLinkTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onTrafficFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onPriceFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onDAFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onDRFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onNicheFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onLIFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onCategoryFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
  enableLinkType?: boolean;
  enableTrafficFilter?: boolean;
  enableDA?: boolean;
  enableDR?: boolean;
  enableLI?: boolean;
  enableNiche?: boolean;
  enableProductType?: boolean;
  enableCountry?: boolean;
  enableCategory?: boolean;
  enablePrice?: boolean;
};

export default function ProductFilter({
  onProductTypeFilter,
  onCountryFilter,
  onDAFilter,
  onCategoryFilter,
  onDRFilter,
  onTrafficFilter,
  onPriceFilter,
  onNicheFilter,
  onLIFilter,
  onLinkTypeFilter,
  className,
  enableCountry,
  enableLinkType,
  enableDA,
  enableLI,
  enableTrafficFilter,
  enablePrice,
  enableNiche,
  enableDR,
  enableCategory,
  enableProductType,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { countries, loading: manufactureLoading } = useCountries();
  const { categories } = useCategories();
  const productType = [
    { name: 'simple', slug: ProductType.Simple },
    { name: 'variable', slug: ProductType.Variable },
  ];

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedDA, setSelectedDA] = useState(null);
  const [selectedDR, setSelectedDR] = useState(null);
  const [selectedTraffic, setSelectedTraffic] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLinkType, setSelectedLinkType] = useState(null);
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [selectedLI, setSelectedLI] = useState(null);
  const [selectedCategory, setCategory] = useState(null);

  const clearAllFilters = () => {
    setSelectedPrice(null);
    setSelectedDA(null);
    setSelectedDR(null);
    setSelectedTraffic(null);
    setSelectedCountry(null);
    setSelectedLinkType(null);
    setSelectedNiche(null);
    setSelectedLI(null);
    setCategory(null);

    const defaultActionMeta = { action: 'clear' } as ActionMeta<unknown>;

    if (onPriceFilter) onPriceFilter(null, defaultActionMeta);
    if (onDAFilter) onDAFilter(null, defaultActionMeta);
    if (onDRFilter) onDRFilter(null, defaultActionMeta);
    if (onTrafficFilter) onTrafficFilter(null, defaultActionMeta);
    if (onCountryFilter) onCountryFilter(null, defaultActionMeta);
    if (onLinkTypeFilter) onLinkTypeFilter(null, defaultActionMeta);
    if (onNicheFilter) onNicheFilter(null, defaultActionMeta);
    if (onLIFilter) onLIFilter(null, defaultActionMeta);
    if (onCategoryFilter) onCategoryFilter(null, defaultActionMeta);
  };

  const isAnyFilterApplied = [
    selectedPrice,
    selectedDA,
    selectedDR,
    selectedTraffic,
    selectedCountry,
    selectedLinkType,
    selectedNiche,
    selectedCategory,
    selectedLI,
    selectedCategory
  ].some(filter => filter !== null);
  useEffect(() => {
    if (!isAnyFilterApplied && document.getElementById('clear-filters-button')) {
      document.getElementById('clear-filters-button').style.display = 'none';
    } else if (isAnyFilterApplied && document.getElementById('clear-filters-button')) {
      document.getElementById('clear-filters-button').style.display = 'block';
    }
  }, [isAnyFilterApplied]);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 gap-4 w-full', className)}>
      {enablePrice && (
        <div className="w-full">
          <Label>{t('Price')}</Label>
          <Select
            options={price}
            value={selectedPrice}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by price')}
            onChange={(newValue, actionMeta) => {
              setSelectedPrice(newValue);
              if (onPriceFilter) onPriceFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableDA && (
        <div className="w-full">
          <Label>{t('Domain Authority')}</Label>
          <Select
            options={domain_authority}
            value={selectedDA}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by DA')}
            onChange={(newValue, actionMeta) => {
              setSelectedDA(newValue);
              if (onDAFilter) onDAFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableDR && (
        <div className="w-full">
          <Label>{t('Domain Rating')}</Label>
          <Select
            options={domain_authority}
            value={selectedDR}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by DR')}
            onChange={(newValue, actionMeta) => {
              setSelectedDR(newValue);
              if (onDRFilter) onDRFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableTrafficFilter && (
        <div className="w-full">
          <Label>{t('Traffic')}</Label>
          <Select
            options={organic_traffic}
            value={selectedTraffic}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by traffic')}
            onChange={(newValue, actionMeta) => {
              setSelectedTraffic(newValue);
              if (onTrafficFilter) onTrafficFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableCountry && (
        <div className="w-full">
          <Label>{t('Countries')}</Label>
          <Select
            options={countries}
            value={selectedCountry}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by countries')}
            onChange={(newValue, actionMeta) => {
              setSelectedCountry(newValue);
              if (onCountryFilter) onCountryFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableLinkType && (
        <div className="w-full">
          <Label>{t('Link type')}</Label>
          <Select
            options={linkType}
            value={selectedLinkType}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by Link type')}
            onChange={(newValue, actionMeta) => {
              setSelectedLinkType(newValue);
              if (onLinkTypeFilter) onLinkTypeFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableNiche && (
        <div className="w-full">
          <Label>{t('Addon Links')}</Label>
          <Select
            options={linkType}
            value={selectedNiche}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by Link type')}
            onChange={(newValue, actionMeta) => {
              setSelectedNiche(newValue);
              if (onNicheFilter) onNicheFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableCategory && (
        <div className="w-full">
          <Label>{t('Categories')}</Label>
          <Select
            options={categories}
            value={selectedCategory}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by Categories')}
            onChange={(newValue, actionMeta) => {
              setCategory(newValue);
              if (onCategoryFilter) onCategoryFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {enableLI && (
        <div className="w-full">
          <Label>{t('Link Insertion')}</Label>
          <Select
            options={isLinkInsertion}
            value={selectedLI}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('Filter by link insertion')}
            onChange={(newValue, actionMeta) => {
              setSelectedLI(newValue);
              if (onLIFilter) onLIFilter(newValue, actionMeta);
            }}
            isClearable={true}
          />
        </div>
      )}
      {isAnyFilterApplied && (
        <div className="w-full">
          <button id="clear-filters-button" onClick={clearAllFilters} className="bg-brand hover:bg-brand/80 md:mt-2 active:bg-brand text-white font-semibold py-1 px-3 rounded">
            {t('Clear All Filters')}
          </button>
        </div>
      )}
    </div>
  );
}
