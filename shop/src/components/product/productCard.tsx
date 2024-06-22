import type { Product } from '@/types';
import Router from 'next/router';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useModalAction } from '@/components/modal-views/context';
import routes from '@/config/routes';
import usePrice from '@/lib/hooks/use-price';
import { PreviewIcon } from '@/components/icons/preview-icon';
import { DetailsIcon } from '@/components/icons/details-icon';
import { CheckIconWithBg } from '@/components/icons/check-icon-with-bg';
import { InformationIcon } from '../icons/information-icon';
import { PeopleIcon } from '../icons/people-icon';
import { StarIcon } from '../icons/star-icon';
import { UserIconAlt } from '../icons/user-icon-alt';
import { HelpIcon } from '../icons/help-icon';
import { LangIcon } from '../icons/lang-icon';
import { LinkIcon } from '../icons/link-icon';
import { GlobalIcon } from '../icons/featured/global-icon';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import { fadeInBottomWithScaleX } from '@/lib/framer-motion/fade-in-bottom';
import { isFree } from '@/lib/is-free';
import { useTranslation } from 'next-i18next';
import { ExternalIcon } from '@/components/icons/external-icon';
import router from 'next/router';

export default function ProductCard({ product }: { product: Product }) {
  const { id, name, slug, image, shop, is_external, is_niche, isLinkInsertion } =
    product ?? {};
  const { openModal } = useModalAction();
  const { isGridCompact } = useGridSwitcher();
  const { price, basePrice } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
  });
  const goToDetailsPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    Router.push(routes.productUrl(slug));
  };
  const { t } = useTranslation('common');
  const isFreeItem = isFree(product?.sale_price ?? product?.price);

  const handleNavigation = () => {
    router.push(`/products/product_page/${product?.slug}`); // Replace '/target-page' with your target route
  };

  return (
    <div className="maincard flex flex-col md:flex-row items-center justify-center p-3.5 dark:bg-dark-200 dark:text-brand-dark bg-[#F9F9F9] shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:hover:shadow-[#787676] rounded-lg">
      <div className="nameDetails flex flex-col w-full md:w-1/4 items-center justify-center p-2.5 text-center md:text-left">
        <div className="mb-2 flex flex-wrap justify-center md:justify-start items-center gap-2">
          <span className="flex text-xs items-center rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            <CheckIconWithBg className="w-4 h-4 mr-1" />
            Guest Post
          </span>
          {isLinkInsertion && (
            <span className="flex items-center rounded-2xl bg-light-300 px-3 py-1 text-xs font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
              <CheckIconWithBg className="w-4 h-4 mr-1" />
              Link Insertion
            </span>
          )}
        </div>
        <h3
          title={name}
          className="mb-0.5 text-lg truncate font-medium text-blue-500 dark:text-blue-500 hover:underline"
        >
          <AnchorLink href={`https://${name}`} target="_blank">
            {name}
          </AnchorLink>
        </h3>
        <h3 className="font-medium text-base hover:text-brand dark:text-dark-800 dark:hover:text-brand">
          {shop?.name}
        </h3>
        <div className="flex flex-col mt-2 items-center md:items-start">
          <span className="mt-2 bg-light-300 rounded-2xl px-3 py-1 font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
            News, Media & Updates
          </span>
          {is_niche && (
            <span className="flex items-center mt-2 rounded-2xl bg-light-300 px-3 py-1 text-xs font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
              <CheckIconWithBg className="w-4 h-4 mr-1" />
              Grey Niche
            </span>
          )}
        </div>
      </div>
      <div className="Domain_Details grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-1/2 p-2.5 dark:border-[#A9A7A7]">
        <div className="flex items-center text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <UserIconAlt className="w-4 h-4 mr-1" />
          Domain authority
          <p className="ml-1 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            {product?.domain_authority}
          </p>
        </div>
        <div className="flex items-center text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <StarIcon className="w-4 h-4 mr-1" />
          Domain Rating
          <p className="ml-1 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            {product?.domain_rating}
          </p>
        </div>
        <div className="flex items-center text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <PeopleIcon className="w-4 h-4 mr-1" />
          Organic Traffic
          <p className="ml-1 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            {product?.organic_traffic}
          </p>
        </div>
        <div className="flex items-center text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <HelpIcon className="w-4 h-4 mr-1" />
          Spam Score
          <p className="ml-1 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            {product?.spam_score}
          </p>
        </div>
        <div className="flex items-center text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <LangIcon className="w-4 h-4 mr-1" />
          Language
          <p className="ml-1 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
            {product?.languages}
          </p>
        </div>
        <div className="flex items-center text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <LangIcon className="w-4 h-4 mr-1" />
          Links
          <p className="ml-1 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
          {product?.link_type}
          </p>
        </div>
      </div>
      <div className="Country_Details flex flex-col justify-center items-center w-full md:w-1/6 p-2.5 dark:border-[#A9A7A7]">
        <span className="flex m-4 text-xs md:text-sm text-[#919494] dark:text-[#E4DFDF]">
          <GlobalIcon className="w-4 h-4 mr-1" />
          Countries
        </span>
        <span className="text-xs ml-4 rounded-2xl bg-light-300 px-3 py-1 font-semibold capitalize text-brand dark:bg-dark-300 dark:text-brand-dark">
          {product?.countries}
        </span>
      </div>
      <div className="Price_Buy flex flex-col justify-center items-center w-full md:w-1/6 p-2.5">
        <span className="mt-2 text-lg md:text-xl font-bold uppercase text-brand dark:text-brand-dark">
          {isFreeItem ? t('text-free') : price}
        </span>
        {!isFreeItem && basePrice && (
          <del className="text-sm md:text-lg font-medium text-dark-900 dark:text-dark-700">
            {basePrice}
          </del>
        )}
        <button onClick={handleNavigation} className="flex mt-4 rounded-lg px-8 py-3 text-sm md:text-lg font-semibold text-white bg-brand dark:bg-brand-dark">
          Buy
        </button>
      </div>
    </div>
  );
}
