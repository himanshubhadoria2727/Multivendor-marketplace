import usePrice from '@/lib/hooks/use-price';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import type { Item } from '@/components/cart/lib/cart.utils';
import placeholder from '@/assets/images/placeholders/product.svg';

export default function CartItem({
  item,
  notAvailable,
}: {
  item: Item;
  notAvailable?: boolean;
}) {
  console.log("item :", item);
  const { name, image, slug, price, shop, quantity, formData} = item;
  const { price: itemPrice } = usePrice({
    amount: price,
  });
  return (
    <div className="flex flex-col w-full items-start gap-2 py-3">
      {/* <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 bg-light-300 dark:border-0 dark:bg-dark-500 xs:w-32">
        <Image
          alt={name}
          fill
          src={image ?? placeholder}
          className="object-cover"
        />
      </div> */}
      <div className='w-full justify-between pb-2 flex'>
        {notAvailable && (
          <span className="mb-1 inline-block rounded-2xl text-xs font-semibold text-red-500">
            Not Available
          </span>
        )}
        <span className='flex max-sm:flex-wrap '>
          <h3 className='text-base font-semibold max-sm:text-sm'>Publishing on</h3>
          <h3 className="truncate font-semibold max-sm:text-sm text-brand dark:text-brand pl-3 text-base dark:text-light">
            <AnchorLink
              href={`https://${name}`} target='_blank'
              className="transition-colors max-sm:text-sm hover:text-brand-dark">
              {name}
            </AnchorLink>
          </h3>
        </span>
        {/* <p className="mt-1 mb-2.5">
          <AnchorLink
            href={routes.shopUrl(shop?.slug)}
            className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
          >
            {shop?.name}
          </AnchorLink>
        </p> */}
        <p className="flex items-center gap-1"><p className='font-semibold max-sm:text-sm'>Price:</p>
          <span className="rounded-2xl bg-light-300 p-1.5 font-semibold uppercase max-sm:text-xs leading-none text-brand-dark dark:bg-dark-500">
            ${formData.totalPrice}
          </span>
          {/* <span className="text-light-base dark:text-dark-base">
            X {quantity}
          </span> */}
        </p>
      </div>
      <div className='flex w-full pt-2 border-t-2 flex-col'>
        <div className='flex pb-2'>
          {formData.selectedForm === 'guest_post' ? (
            <h3 className='w-full flex justify-between text-base font-semibold max-sm:text-sm '>
              Service type: <p className='text-brand max-sm:text-sm ml-4'>Guest Post</p>
            </h3>
          ) :
            (
              <h3 className='w-full flex justify-between text-base font-semibold max-sm:text-sm'>
                Service type: <p className='text-brand max-sm:text-sm'>Link Insertion</p>
              </h3>
            )
          }
        </div>
        {formData.selectedNiche&&(
          <span className='flex'>
            {formData.selectedNiche === 'gamble' ? (
              <h3 className='w-full flex justify-between text-base font-semibold flex max-sm:text-sm'>
                Niche type: <p className='text-brand ml-4 max-sm:text-sm'>Casino/Betting/Gambling Link</p>
              </h3>
            ) : formData.selectedNiche === 'cbd' ? (
              <h3 className='w-full flex justify-between text-base font-semibold flex max-sm:text-sm'>
                Niche type: <p className='text-brand ml-4 max-sm:text-sm'>CBD Link</p>
              </h3>
            ) : formData.selectedNiche === 'business' ? (
              <h3 className='w-full flex justify-between text-base font-semibold flex max-sm:text-sm'>
                Niche type: <p className='text-brand ml-4 max-sm:text-sm'>Cryptocurrency Link</p>
              </h3>
            ) :
              null
            }
          </span>
        )}
      </div>
    </div>
  );
}
