import routes from '@/config/routes';
import { useContactUs } from '@/data/contact';
import type { CreateContactUsInput, CreateProductInput, NextPageWithLayout } from '@/types';
import { isEmpty } from 'lodash';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import ProductInputField from './product-input-field';
import { generateCartItem } from '../cart/lib/generate-cart-item';
import router, { useRouter } from 'next/router';
import { useCart } from '../cart/lib/cart.context';

const ProductInputDisplay: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  let [reset, setReset] = useState<CreateProductInput | null>(null);
  const { mutate, isLoading, isSuccess } = useContactUs();
  const { addItemToCart } = useCart();
  const router = useRouter();
  const onSubmit: SubmitHandler<CreateProductInput> = (data) => {
    // addItemToCart(generateCartItem(data), 1);
    // router.push('/checkout')
  };
  useEffect(() => {
    if (isSuccess) {
      setReset({
        postUrl: '',
        before_ancor: '',
        ancor: '',
        after_ancor: '',
      });
    }
  }, [isSuccess]);

  return (
    <>
     
            <ProductInputField
              onSubmit={onSubmit}
              reset={reset}
              isLoading={isLoading}
            />
    </>
  );
};


export default ProductInputDisplay;
