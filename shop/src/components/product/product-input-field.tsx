import { CreateOrderInput, CreateProductInput, Product } from '@/types';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import { useProduct } from '@/data/product';
import Button from '@/components/ui/button';
import { ProductInputFieldSchemaGL, ProductInputFieldSchemaLI, contactUsFormSchema } from '@/components/contact-us/schema';
import { Form } from '@/components/ui/forms/form';
import { useTranslation } from 'next-i18next';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import Spinner from '../ui/loader/spinner/spinner';
import { useEffect, useState } from 'react';
import ProductNicheOptions from './product-niche-options';
import React from 'react';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';
import Label from '../ui/forms/label';
import Uploader from '../ui/forms/uploader';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/data/client/token.utils';


type ProductInputFormProps = {
  product: Product;
  onSubmit: SubmitHandler<CreateProductInput>;
  reset: CreateProductInput | null;
  isLoading: boolean;
  campaignname?: string | string[] | undefined;
};

const ProductInputField: React.FC<ProductInputFormProps> = ({
  product,
  onSubmit,
  reset,
  isLoading,
  campaignname,
}) => {
  const { t } = useTranslation('common');
  // const { data } = useModalState();
  // const { product } = useProduct(slug);
  // const content = useSanitizeContent({
  //   description: product?.description as string,
  // });
  const [selectedNiche, setSelectedNiche] = useState('none');
  const handleNicheChange = (value: string) => {
    {
      value == 'none' ? (
        setTotalPrice(product.price)
      ) :
        setTotalPrice(+product.price + +product.niche_price);
    }
    console.log(value)
    setSelectedNiche(value);
  };
  const [formValid, setFormValid] = useState(false); // State to track form validity
  const [selectedForm, setSelectedForm] = useState('guest_post'); // State to track selected form
  const [totalPrice, setTotalPrice] = useState(product.price)

  const handleDivClick = (formName: string) => {
    setSelectedForm(formName);
  };
  const handleFormSubmit = (data: CreateProductInput) => {
    const formData = {
      ...data,
      selectedForm,
      selectedNiche,
      totalPrice,
    };
    onSubmit(formData);
    console.log(formData);
    setFormValid(true); // Reset form validity after submission
  };
  console.log(product)

  const handleFormValidityChange = (isValid: boolean) => {
    setFormValid(isValid);
  };
  const {
    name,
    is_niche,
    price,
    isLinkInsertion,
    is_gamble,
    is_cbd,
    is_crypto,
  } = product ?? {};


  return (
    <div className="flex max-w-full p-6 shadow-md rounded-md flex-col bg-light text-left dark:bg-dark-250 xs:max-w-[430px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[960px] xl:max-w-[1200px] 2xl:max-w-[1266px] 3xl:max-w-[1460px]">
      <div className="pb-7 xs:pb-8 lg:pb-10">
        <div className='flex mb-5 text-align justify-between p-3 bg-brand/20 rounded-lg'>
          <span className='text-2xl max-sm:text-sm max-md:text-lg flex text-gray-500 font-semibold'>Publish on <p className='pl-2 text-brand'>{name}</p></span>
          <span className='text-lg max-sm:text-xs max-md:text-xs flex text-white bg-brand/80 p-2 rounded-lg font-semibold'>Price ${price}</span>
        </div>
        <div className="flex mb-6 justify-center w-full">
          <div
            className={`cursor-pointer flex w-80 text-white rounded-md transition duration-300 hover:bg-brand justify-center bg-brand dark:text-white text-lg font-semibold p-2  ${selectedForm === 'guest_post' ? 'bg-brand/100' : 'bg-brand/50  && dark:bg-brand/30'}`}
            onClick={() => handleDivClick('guest_post')}
          >
            Guest Post
          </div>
          <div
            className={`cursor-pointer flex w-80 text-white rounded-md transition duration-300 justify-center bg-brand text-lg font-semibold p-2 ml-2 
    ${selectedForm === 'link_insertion' ? 'bg-brand/100' : 'cursor-not-allowed bg-brand/50 dark:bg-brand/30'} 
    ${isLinkInsertion !== '1' && 'cursor-not-allowed opacity-100'}`}
            onClick={isLinkInsertion === '1' ? () => handleDivClick('link_insertion') : undefined}
          >
            Link Insertion
          </div>

        </div>

        {selectedForm === 'guest_post' && (
          <Form<CreateProductInput>
            onSubmit={handleFormSubmit}
            validationSchema={ProductInputFieldSchemaGL}          >
            {({ register, control, formState: { errors } }) => (
              <>
                <fieldset className="mb-6 list gap-5 sm:grid-cols-2">
                  <Input
                    label={t('Title of your article:')}
                    type="url"
                    placeholder="Enter your post url"
                    {...register('title')}
                    error={errors.title?.message}
                  />
                  <Input
                    label={t('Ancor text/Keyword:')}
                    type="text"
                    placeholder="Enter your text here"
                    {...register('ancor')}
                    error={errors.ancor?.message}
                    className="mt-10 mb-10"
                  />
                  <Input
                    label={t('Landing Page/Link URL:')}
                    type="text"
                    placeholder="Enter your anchor text"
                    defaultValue={campaignname !== undefined?`https://${campaignname}`:'https://'}
                    {...register('link_url')}
                    error={errors.link_url?.message}
                    className="mt-10 mb-10"
                    readOnly={campaignname !== undefined} // Disable if campaignname is defined
                  />
                  <Controller
                    name="file"
                    control={control}
                    render={({ field: { ref, ...rest } }) => (
                      <div className="sm:col-span-2 mb-5">
                        <Label className='text-lg text-brand font-semibold mb-3'>{"Upload your article details file(optional):"}</Label>
                        <div className="text-xs">
                          <Uploader {...rest} multiple={false} />
                        </div>
                      </div>
                    )}
                  />
                  <div className="relative mb-5">
                    <Label className='text-lg text-brand font-semibold mb-3'>{"Article content:"}</Label>
                    <RichTextEditor
                      editorClassName='h-60 pb-10 mb-10 max-sm:border-none max-sm:mb-[7rem] xs:max-w-[370px] sm:max-w-[470px] md:max-w-[570px] lg:max-w-[850px] xl:max-w-[1050px] 2xl:max-w-[1150px] 3xl:max-w-[1350px]'
                      control={control}
                      placeholder='My amazing content'
                      className='mb'
                      name="content"
                      error={t(errors?.content?.message)}
                    />
                  </div>
                  <div className="relative mb-5 ">
                    <Label className='text-lg text-brand font-semibold mb-3'>{"Special Instructions:"}</Label>
                    <RichTextEditor
                      editorClassName='h-60 pb-10 mb-10 max-sm:border-none max-sm:mb-[7rem]  xs:max-w-[370px] sm:max-w-[470px] md:max-w-[570px] lg:max-w-[850px] xl:max-w-[1050px] 2xl:max-w-[1150px] 3xl:max-w-[1350px]'
                      control={control}
                      placeholder='Describe your requirement'
                      className=''
                      name="instructions"
                      error={t(errors?.instructions?.message)}
                    />
                  </div>
                  <ProductNicheOptions product={product} onChange={handleNicheChange} />
                </fieldset>
                <div className="flex w-full justify-center space-y-4">
                  <div className='w-80 space-y-4'>
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex-1 p-3 dark:bg-dark bg-gray-100 rounded mb-3">
                        {selectedForm === 'guest_post' ? (
                          <span className="font-semibold dark:bg-dark text-base">Service Type: Guest Posting</span>
                        ) :
                          null}
                      </div>
                      <div className="flex-1 p-3 dark:bg-dark bg-gray-100 rounded">
                        <span className="font-semibold dark:bg-dark text-base">Total Amount: ${totalPrice}</span>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <Button
                        type="submit"
                        className="mb text-base w-full"
                        isLoading={false}
                        disabled={false}
                      >
                        Save and next
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}

        {selectedForm === 'link_insertion' && (
          <Form<CreateProductInput>
            onSubmit={handleFormSubmit}
            validationSchema={ProductInputFieldSchemaLI}
          >
            {({ register, control, formState: { errors } }) => (
              <>
                <fieldset className="mb-6 list gap-5 sm:grid-cols-2">
                  <Input
                    label={t('Post Url:')}
                    type="url"
                    placeholder="Enter your post url"
                    {...register('postUrl')}
                    error={errors.postUrl?.message}

                  />
                  <Input
                    label={t('Keyword/Anchor Text:')}
                    type="text"
                    placeholder="Enter your ancor text here"
                    {...register('ancor')}
                    error={errors.ancor?.message}
                    className="mt-10 mb-10"
                  />
                  <Input
                    label={t('Landing Page/Link URL:')}
                    type="text"
                    placeholder="Enter your anchor text"
                    defaultValue={campaignname !== undefined?`https://${campaignname}`:'https://'}
                    {...register('link_url')}
                    error={errors.link_url?.message}
                    className="mt-10 mb-10"
                    readOnly={campaignname !== undefined} // Disable if campaignname is defined
                  />
                  {/* <Input
                    label={t('Special instructions')}
                    type="text"
                    placeholder="Enter your text here"
                    {...register('instructions')}
                    error={errors.instructions?.message}
                    className="mt-10 mb-10"
                  /> */}
                  <div className="relative mb-5">
                    <Label className='text-lg text-brand font-semibold mb-3'>{"Special Instructions:"}</Label>
                    <RichTextEditor
                      editorClassName='h-60 pb-10 mb-10 max-sm:border-none max-sm:mb-[7rem]  xs:max-w-[370px] sm:max-w-[470px] md:max-w-[570px] lg:max-w-[850px] xl:max-w-[1050px] 2xl:max-w-[1150px] 3xl:max-w-[1350px]'
                      control={control}
                      placeholder='Your requirements'
                      className='mb'
                      name="instructions"
                      error={t(errors?.instructions?.message)}
                    />
                  </div>
                  <ProductNicheOptions product={product} onChange={handleNicheChange} />
                </fieldset>
                <div className="flex w-full justify-center space-y-4">
                  <div className='w-80 space-y-4'>
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex-1 p-3 dark:bg-dark bg-gray-100 rounded mb-3">
                        {selectedForm === 'link_insertion' ? (
                          <span className="font-semibold dark:bg-dark text-base">Service Type: Link Insertion</span>
                        ) :
                          null}
                      </div>
                      <div className="flex-1 p-3 dark:bg-dark bg-gray-100 rounded">
                        <span className="font-semibold dark:bg-dark text-base">Total Amount: ${totalPrice}</span>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <Button
                        type="submit"
                        className="mb text-base w-full"
                        isLoading={false}
                        disabled={false}
                      >
                        Save and next
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}
      </div>
    </div >
  );
};


export default ProductInputField;
