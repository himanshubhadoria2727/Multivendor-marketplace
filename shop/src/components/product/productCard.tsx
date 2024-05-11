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
    <motion.div variants={fadeInBottomWithScaleX()} title={name}>
     
      <div className="flex items-start justify-between pt-3.5 dark:bg-dark-300 dark:text-brand-dark p-5 border rounded-3xl border-transparent bg-offwhite dark:bg-dark-300 shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative flex h-16 w-16 flex-shrink-0 overflow-hidden 4xl:h-9 4xl:w-9">
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
        </div>
        <div className="-mt-[-2]  flex flex-col justify-center  truncate ltr:mr-auto ltr:pl-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
          <h3
            title={name}
            className="mb-0.5 truncate font-medium text-dark-100 dark:text-light"
          >
            <AnchorLink href={routes.productUrl(slug)}>{name}</AnchorLink>
          </h3>
          <AnchorLink
            href={routes.shopUrl(shop?.slug)}
            className="font-medium text-light-base hover:text-brand dark:text-dark-800 dark:hover:text-brand"
          >
            {shop?.name}
          </AnchorLink>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end pl-2.5">
          <span className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-brand dark:bg-dark-300 dark:text-brand-dark">
            {isFreeItem ? t('text-free') : price}
          </span>
          {!isFreeItem && basePrice && (
            <del className="px-1 text-13px font-medium text-dark-900 dark:text-dark-700">
              {basePrice}
            </del>
          )}
        </div>
      </div>
      
    </motion.div>
  );
}


