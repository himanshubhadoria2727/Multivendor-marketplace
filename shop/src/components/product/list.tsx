import type { Product } from '@/types';
import { motion } from 'framer-motion';
import cn from 'classnames';
import Button from '@/components/ui/button';
import ProductCard from '@/components/product/productCard';
import ProductCardLoader from '@/components/product/product-loader';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import ItemNotFound from '@/components/ui/item-not-found';
import rangeMap from '@/lib/range-map';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import { useTranslation } from 'next-i18next';
import Spinner from '../ui/loader/spinner/spinner';
import Loader from '../ui/loaderAdmin/loader';

interface ListProps {
  products: Product[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  limit?: number;
}


export default function List({
  products,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading,
  limit = 15,
}: ListProps) {
  const { isGridCompact } = useGridSwitcher();
  const { t } = useTranslation('common');
  if (!isLoading && !products.length) {
    return (
      <ItemNotFound
        title={t('text-no-products-found')}
        message={t('text-no-products-found-message')}
        className="px-4 pt-5 pb-10 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
      />
    );
  }
  return (
    <div className="w-full   ">
  <motion.div
    variants={staggerTransition(0.025)}
    className={cn(
      'flex flex-col ',
      {
        'md:flex-col': !isGridCompact,

      }

    )}
  >
    {isLoading && !products.length
      ? rangeMap(limit, (i) => (
          <Loader/>
        ))
      : products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
        
        }
        <hr className="mt-auto border-t border-gray-300" />
  </motion.div>

  {hasNextPage && (
    <div className="mt-8 grid place-content-center md:mt-10">
      <Button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        isLoading={isLoadingMore}
      >
        {t('text-loadmore')}
      </Button>
    </div>
  )}
</div>

    
  );
}
