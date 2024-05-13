import { CreateProductInput } from '@/types';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import { useProduct } from '@/data/product';
import Button from '@/components/ui/button';
import { ProductInputFieldSchema, contactUsFormSchema } from '@/components/contact-us/schema';
import { Form } from '@/components/ui/forms/form';
import { useTranslation } from 'next-i18next';
import type { SubmitHandler } from 'react-hook-form';
import AddToCart from '../cart/add-to-cart';
import FreeDownloadButton from './free-download-button';
import Link from 'next/link';
import AnchorLink from '../ui/links/anchor-link';
import routes from '@/config/routes';
import { useModalState } from '../modal-views/context';
import Spinner from '../ui/loader/spinner/spinner';
import { isFree } from '@/lib/is-free';
import FavoriteButton from '../favorite/favorite-button';
import ProductPopupLoader from './product-popup-loader';
import { useSanitizeContent } from '@/lib/sanitize-content';
import { useState } from 'react';

type ProductInputFormProps = {
  onSubmit: SubmitHandler<CreateProductInput>;
  reset: CreateProductInput | null;
  isLoading: boolean;
  href:string;
};

const ProductInputField: React.FC<ProductInputFormProps> = ({
  onSubmit,
  reset,
  isLoading,
  href
}) => {
  const { t } = useTranslation('common');
  const { data } = useModalState();
  const { product } = useProduct(data.slug);
  const content = useSanitizeContent({
    description: product?.description as string,
  });
  
  const [formValid, setFormValid] = useState(false); // State to track form validity

  // Function to handle form submission and update form validity
  const handleFormSubmit = (data: CreateProductInput) => {
    onSubmit(data)
    console.log(data)
    setFormValid(true); // Reset form validity after submission
  };

  // Function to handle form validity change
  const handleFormValidityChange = (isValid: boolean) => {
    setFormValid(isValid);
  };
  
  if (!product && isLoading) return <Spinner />;
  // if (!product) return <div>{t('text-not-found')}</div>;
  const {
    id,
    name,
    description,
    slug,
    image,
    shop,
    updated_at,
    created_at,
    gallery,
    orders_count,
    total_downloads,
    tags,
    domain_name,
    preview_url,
    type,
    price,
    sale_price,
    is_external,
    external_product_url,
    external_product_button_text,
  } = product ?? {};
  const isFreeItem = isFree(sale_price ?? price);
  return (
    <div className="flex max-w-full flex-col bg-light text-left dark:bg-dark-250 xs:max-w-[430px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[960px] xl:max-w-[1200px] 2xl:max-w-[1266px] 3xl:max-w-[1460px]">
      <div className="-mx-2.5 flex flex-wrap items-center bg-light-300 py-3 ltr:pl-4 ltr:pr-16 rtl:pr-4 rtl:pl-16 dark:bg-dark-100 md:py-4 ltr:md:pl-6 rtl:md:pr-6 lg:-mx-4 lg:py-5 ltr:xl:pl-8 rtl:xl:pr-8">
        <h2
          title={name}
          className="truncate px-2.5 py-1 text-base font-medium text-dark dark:text-light md:text-lg ltr:lg:pl-4 ltr:lg:pr-5 rtl:lg:pr-4 rtl:lg:pl-5 3xl:text-xl"
        >
          <AnchorLink
            href={routes.productUrl(slug)}
            className="transition-colors hover:text-brand"
          >
            {name}
          </AnchorLink>
        </h2>
        <div className="flex flex-shrink-0 items-center px-2.5 py-1">
          <div className="relative flex h-5 w-5 flex-shrink-0 md:h-6 md:w-6">
          </div>
          <h3
            title={name}
            className="text-13px font-medium text-dark-600 ltr:pl-2 rtl:pr-2 dark:text-light-800 ltr:md:pl-2.5 rtl:md:pr-2.5"
          >
            <AnchorLink
              href={routes.shopUrl(shop?.slug)}
              className="hover:text-accent transition-colors"
            >
              {shop?.name}
            </AnchorLink>
          </h3>

          <FavoriteButton productId={product?.id} />
        </div>
      </div>
      <div className="flex flex-col p-4 rtl:space-x-reverse md:p-6 lg:flex-row lg:space-x-7 xl:space-x-8 xl:p-8 3xl:space-x-10">
        <div className="flex shrink-0 flex-col justify-between text-13px lg:w-[400px] xl:w-[520px] 3xl:w-[555px]">
          <div className="pb-7 xs:pb-8 lg:pb-10">
            <Form<CreateProductInput>
              onSubmit={handleFormSubmit}
              validationSchema={ProductInputFieldSchema}
              resetFields={reset}
              onFormValidityChange={handleFormValidityChange}
            >
              {({ register, formState: { errors } }) => (
                <>
                  <fieldset className="mb-6 list gap-5 sm:grid-cols-2">
                    <Input
                      label={t('postUrl-input-field')}
                      type='url'
                      placeholder='Enter your post url'
                      {...register('postUrl')}
                      error={errors.postUrl?.message}
                    />
                    <Input
                      label={t('Content before ancor text')}
                      type="text"
                      placeholder='Enter your text here'
                      {...register('before_ancor_text')}
                      error={errors.before_ancor_text?.message}
                      className='mt-2.5'
                    />
                    <Input
                      label={t('ancorText-input-field')}
                      type="text"
                      placeholder='Enter your ancor text'
                      {...register('ancorText')}
                      error={errors.ancorText?.message}
                      className='mt-2.5'
                    />
                    <Input 
                      label={t('Content after ancor text')}
                      type="text"
                      placeholder='Enter your text here'
                      {...register('after_ancor_text')}
                      error={errors.after_ancor_text?.message}
                      className='mt-2.5'
                    />
                    {/* <Input
              label={t('contact-us-subject-field')}
              {...register('subject')}
              error={errors.subject?.message}
              className="sm:col-span-2"
            />
            <Textarea
              label={t('contact-us-message-field')}
              {...register('description')}
              error={errors.description?.message}
              className="sm:col-span-2"
            /> */}
                  </fieldset>
                  {is_external ? (
              <Link
                href={external_product_url}
                target="_blank"
                className="transition-fill-colors pointer-events-auto relative mt-2.5 flex min-h-[46px] w-full flex-1 cursor-pointer items-center justify-center gap-2 rounded bg-brand py-3 px-4 font-semibold text-white opacity-100 duration-200 hover:bg-brand-dark focus:bg-brand-dark xs:mt-0 sm:h-12 md:px-5"
              >
                {external_product_button_text}
              </Link>
            ) : !isFreeItem ? (
              <Link href={"/checkout"}>
              <button
                type='submit' // Form submission handled here
                className="mt-2.5 w-full flex-1 xs:mt-0" // Add appropriate classes for styling
                disabled={!formValid}
              >
                <AddToCart
                  item={product}
                  toastClassName="-mt-10 xs:mt-0"
                  className="mt-2.5 w-full flex-1 xs:mt-0"
                />
              </button>
              
              </Link>
            ) : (
              <FreeDownloadButton
                productId={id}
                productSlug={slug}
                productName={name}
                className="mt-2.5 w-full flex-1 xs:mt-0"
              />
            )}

            {Boolean(preview_url) && (
              <a
                href={preview_url}
                rel="noreferrer"
                target="_blank"
                className="transition-fill-colors flex min-h-[46px] w-full flex-1 items-center justify-center gap-2 rounded border border-light-500 bg-transparent py-3 px-4 font-semibold text-dark duration-200 hover:bg-light-400 hover:text-brand focus:bg-light-500 dark:border-dark-600 dark:text-light dark:hover:bg-dark-600 dark:focus:bg-dark-600 sm:h-12 md:px-5"
              >
                {t('text-live-preview')}
              </a>
            )}
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInputField;
