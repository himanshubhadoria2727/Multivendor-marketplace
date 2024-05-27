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


export default function ProductTable({ product }: { product: Product }) {
    const { id, name, slug, image, shop, is_external, } =
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
        <div className="maincard flex h-20 flex-col sm:flex-row  items-center justify-center dark:bg-dark-200 dark:text-brand-dark border-transparent bg-[#F9F9F9] dark:bg-dark-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:hover:shadow-[#787676]">
            <div className='w-full h-2/3 flex border-2 justify-between border-black'>
                <span className="flex w-[27%] justify-center text-lg text-[#919494]  dark:text-[#E4DFDF]">
                    <p><AnchorLink className='text-blue-500	 hover:underline' href={`https://${name}`} target='_blank'>{name}</AnchorLink></p>
                </span>
                <span className='w-[40%] flex justify-between'>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <p className="text-xs ml-3 items-center justify-center rounded-2xl bg-light-300 px-3 py-4 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
                            {product?.domain_authority}
                        </p>
                    </span>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <p className="text-xs ml-3 items-center justify-center rounded-2xl bg-light-300 px-3 py-4 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
                            {product?.domain_rating}
                        </p>
                    </span>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <p className="text-xs ml-3 items-center justify-center rounded-2xl bg-light-300 px-3 py-4 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
                            {product?.organic_traffic}
                        </p>
                    </span>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <p className="text-xs ml-3 items-center justify-center rounded-2xl bg-light-300 px-3 py-4 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
                            {product?.spam_score}
                        </p>
                    </span>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <p className="text-xs ml-3 items-center justify-center rounded-2xl bg-light-300 px-3 py-4 text-13px font-semibold capitalize text-sm text-brand dark:bg-dark-300 dark:text-brand-dark">
                            {product?.link_type}
                        </p>
                    </span>
                </span>
                <span className='flex w-[27%] justify-between'>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <button onClick={handleNavigation} className=" flex m-2  rounded-lg bg-light-500 px-2 py-2 text-sm font-semibold text-white text-brand bg-brand/500 dark:bg-white-600 dark:text-white  ">
                            Rs/-{product.price}
                        </button>
                    </span>
                    <span className="flex  text-lg text-[#919494]  dark:text-[#E4DFDF]">
                        <button onClick={handleNavigation} className=" flex m-1  rounded-lg bg-light-500 px-2 py-2 text-sm font-semibold text-white text-brand bg-[#38A271] dark:bg-white-600 dark:text-white  ">
                            Buy
                        </button>
                    </span>
                    <span className="flex  text-sm text-[#919494]  dark:text-[#E4DFDF]">
                        <button onClick={handleNavigation} className=" flex m-1  rounded-lg bg-light-500 px-2 py-2 text-sm font-semibold text-white text-brand bg-[#38A271] dark:bg-white-600 dark:text-white  ">
                            Buy
                        </button>
                    </span>
                </span>
            </div>
        </div>

    );
}
