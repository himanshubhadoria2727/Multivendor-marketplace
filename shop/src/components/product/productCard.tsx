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

export default function ProductCard({ product }: { product: Product }) {
  const { name, slug, image, shop, is_external } = product ?? {};
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
  return (
    <div className="flex h-56 items-start pt-3.5 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-l border-transparent bg-[#F9F9F9] dark:bg-dark-200 shadow-lg hover:shadow-2xl transition-shadow duration-300  dark:hover:shadow-[#787676]">
      {/* <div className="relative flex h-36 w-36 flex-shrink-0 overflow-hidden 4xl:h-9 4xl:w-9">
          <Image
            alt={shop?.name}
            quality={100}
            fill
            src={shop?.logo?.thumbnail ?? placeholder}
            className="rounded-full bg-light-500 object-cover dark:bg-dark-400"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          />
        </div> */}
      <div className=" flex-col flex-wrap  w-2/5 items-center justify-center ltr:pl-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
        <div className="mb-2 flex flex-shrink-0  items-center gap-4 p-1">
          <span className="flex  text-xs items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
            <CheckIconWithBg className=" w-4 h-4 mr-1" />
            Guest Post
          </span>
          <span className="flex items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize  text-xs text-brand dark:bg-dark-300 dark:text-brand-dark ">
            <CheckIconWithBg className="w-4 h-4 mr-1" />
            Grey Niche
          </span>
        </div>
        <h3
          title={name}
          className="mb-0.5 text-lg truncate pl-2 font-medium text-dark-100 dark:text-light"
        >
          <AnchorLink href={routes.productUrl(slug)}>{name}</AnchorLink>
        </h3>
        <AnchorLink
          href={routes.shopUrl(shop?.slug)}
          className="font-medium text-base pl-2 hover:text-brand dark:text-dark-800 dark:hover:text-brand"
        >
          {shop?.name}
        </AnchorLink>
        <div className="flex  flex-col mt-2 ml-0 flex flex-shrink-0   p-1">
          <span className="mt-2 w-fit bg-light-300 rounded-2xl px-3 py-1  font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
            News,Media & Updates
          </span>
          <span className="flex  mt-2 text-lg text-[#05AAFB] ">
            <InformationIcon className=" w-4 h-4 mr-1 mt-1.5" />
            View site Info
          </span>
        </div>
      </div>
      <div className=" flex w-3/5 flex-wrap  border-r border-dark border-dotted">
        <div className=" flex-wrap">
          <span className="flex m-8 capitalize  text-sm text-[#919494]  dark:text-brand-dark">
            <UserIconAlt className=" w-4 h-4 mr-1 " />
            Domain Authority
            <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
              27
            </p>
          </span>
          <span className="flex m-8 capitalize  text-sm text-[#919494] dark:text-brand-dark">
            <StarIcon className=" w-4 h-4 mr-1 " />
            Domain Rating
            <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
              27
            </p>
          </span>
          <span className="flex m-8 capitalize  text-sm text-[#919494]  dark:text-brand-dark">
            <PeopleIcon className=" w-4 h-4 mr-1 " />
            Organic Traffic
            <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
              1527
            </p>
          </span>
        </div>
        <div className="flex-wrap">
          <span className="flex m-8 capitalize  text-sm text-[#919494]  dark:text-brand-dark">
            <HelpIcon className=" w-4 h-4 mr-1 " />
            Spam Score
            <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
              27
            </p>
          </span>
          <span className="flex m-8 capitalize  text-sm text-[#919494] dark:text-brand-dark">
            <LangIcon className=" w-4 h-4 mr-1 " />
            Language
            <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
              English,French
            </p>
          </span>
          <span className="flex m-8 capitalize  text-sm text-[#919494]  dark:text-brand-dark">
            <LinkIcon className=" w-4 h-4 mr-1 " />
            Links
            <p className="text-xs ml-1 items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
              27
            </p>
          </span>
        </div>
        <div className="flex-wrap">
          <span className="flex m-8 mb-1 capitalize  text-sm text-[#919494]  dark:text-brand-dark">
            <GlobalIcon className=" w-4 h-4 mr-1 " />
            Countries
          </span>
          <span className='text-xs ml-8  items-center rounded-2xl bg-light-300 px-3 py-1 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark'>
            India , Pakistan
          </span>
        </div>
      </div>

      <div className="flex  w-1/5  flex-col items-center  pl-6">
        <span className="mt-2 rounded-l bg-light-00 px-8 py-3 !important-text-lg font-bold uppercase text-4xl text-brand dark:bg-dark-300 dark:text-brand-dark">
          {isFreeItem ? t('text-free') : price}
        </span>
        {/* {!isFreeItem && basePrice && (
            <del className="px-1 text-20px font-medium text-dark-900 dark:text-dark-700">
              {basePrice}
            </del>
          )} */}
        <button className=" flex mt-8  rounded-lg bg-light-500 px-16 py-3 text-xl font-semibold text-white text-brand bg-[#24B47E] dark:bg-[#24B47E]-600 dark:text-white  ">
          Buy
        </button>
      </div>
    </div>
  );
}
