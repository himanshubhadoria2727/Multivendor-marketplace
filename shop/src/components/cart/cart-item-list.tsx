import cn from 'classnames';
import toast from 'react-hot-toast';
import { useCart } from '@/components/cart/lib/cart.context';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import { useTranslation } from 'next-i18next';

export default function CartItemList({ className }: { className?: string }) {
  const { t } = useTranslation('common');
  const { items, clearItemFromCart, verifiedResponse } = useCart();
  function handleClearItemFromCart(id: number | string) {
    clearItemFromCart(id);
    toast.success(<b>{t('text-remove-item-from-cart-message')}</b>);
  }
  return (
    <ul role="list" className={cn('-my-6 w-full', className)}>
      {items.map((item) => {
        console.log(item)
        const notAvailable = verifiedResponse?.unavailable_products?.find(
          (id) => id === item.id,
        );
        return (
          <li
            key={item.id}
            className="relative ml-2 flex border-b border-light-300 last-of-type:border-b-0 dark:border-dark-500 max-md:ml-0"
          >
            <div className='w-full pl-2 pr-2 rounded-lg border-2 mb-3 border-brand'>
            <button
              type="button"
              className="absolute -left-8 top-1/2 -mt-3.5 flex-shrink-0 p-2 font-medium text-dark-900 hover:text-dark dark:text-dark-800 dark:hover:text-light-900 xs:-left-10"
              onClick={() => handleClearItemFromCart(item.id)}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
            <CartItem item={item} notAvailable={!!notAvailable} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
