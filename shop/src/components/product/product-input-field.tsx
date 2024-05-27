import { CreateOrderInput, CreateProductInput } from '@/types';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import { useProduct } from '@/data/product';
import Button from '@/components/ui/button';
import { ProductInputFieldSchema, contactUsFormSchema } from '@/components/contact-us/schema';
import { Form } from '@/components/ui/forms/form';
import { useTranslation } from 'next-i18next';
import type { SubmitHandler } from 'react-hook-form';
import Spinner from '../ui/loader/spinner/spinner';
import { useState } from 'react';

import RichTextEditor from '../ui/wysiwyg-editor';

type ProductInputFormProps = {
  onSubmit: SubmitHandler<CreateProductInput>;
  reset: CreateProductInput | null;
  isLoading: boolean;
};

const ProductInputField: React.FC<ProductInputFormProps> = ({
  onSubmit,
  reset,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  // const { data } = useModalState();
  // const { product } = useProduct(slug);
  // const content = useSanitizeContent({
  //   description: product?.description as string,
  // });

  const [formValid, setFormValid] = useState(false); // State to track form validity
  const [selectedForm, setSelectedForm] = useState('link_insertion'); // State to track selected form

  const handleDivClick = (formName: string) => {
    setSelectedForm(formName);
  };
   const formName=selectedForm;
  const handleFormSubmit = (data: CreateProductInput) => {
    const formData = {
      ...data, 
      formName
    };
    onSubmit(formData);
    console.log(formData);
    setFormValid(true); // Reset form validity after submission
  };
  

  const handleFormValidityChange = (isValid: boolean) => {
    setFormValid(isValid);
  };

  if ( isLoading) return <Spinner />;

  return (
    <div className="flex max-w-full p-6 rounded-md flex-col bg-light text-left dark:bg-dark-250 xs:max-w-[430px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[960px] xl:max-w-[1200px] 2xl:max-w-[1266px] 3xl:max-w-[1460px]">
      <div className="pb-7 xs:pb-8 lg:pb-10">
        <div className="flex mb-6 justify-center w-full">
          <div
            className={`cursor-pointer flex w-80 text-white rounded-md transition duration-300 hover:bg-brand justify-center bg-brand dark:text-white  text-lg font-semibold p-2  ${selectedForm === 'link_insertion' ? 'bg-brand/100' : 'bg-brand/50 && dark:bg-brand/30'}`}
            onClick={() => handleDivClick('link_insertion')}
          >
            Link Insertion
          </div>
          <div
            className={`cursor-pointer flex w-80 text-white rounded-md transition duration-300 hover:bg-brand justify-center bg-brand dark:text-white text-lg font-semibold p-2  ml-2 ${selectedForm === 'guest_post' ? 'bg-brand/100' : 'bg-brand/50  && dark:bg-brand/30'}`}
            onClick={() => handleDivClick('guest_post')}
          >
            Guest Post
          </div>
        </div>


        {selectedForm === 'link_insertion' && (
          <Form<CreateProductInput>
            onSubmit={handleFormSubmit}
            validationSchema={ProductInputFieldSchema}
          >
            {({ register,control, formState:{errors} }) => (
              <>
                <fieldset className="mb-6 list gap-5 sm:grid-cols-2">
                  <Input
                    label={t('postUrl-input-field')}
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
                    placeholder="Enter your link url here"
                    {...register('link_url')}
                    error={errors.link_url?.message}
                    className="mt-10 mb-10"
                  />
                  <Input
                    label={t('Special instructions')}
                    type="text"
                    placeholder="Enter your text here"
                    {...register('instructions')}
                    error={errors.instructions?.message}
                    className="mt-10 mb-10"
                  />
                  {/* <div className="relative mb-5">
                <RichTextEditor
                  title={t('form:input-label-description')}
                  control={control}
                  name="description"
                  error={t(errors?.description?.message)}
                />
              </div> */}
                </fieldset>

                <Button
                  type="submit"
                  className="mb-1 w-full flex-1 sm:flex-none md:w-auto"
                  isLoading={false}
                  disabled={false}
                >
                  {t('Add to cart')}
                </Button>
              </>
            )}
          </Form>
        )}

        {selectedForm === 'guest_post' && (
          <Form<CreateProductInput>
            onSubmit={handleFormSubmit}
          >
            {({ register, control, formState: { errors } }) => (
              <>
                <fieldset className="mb-6 list gap-5 sm:grid-cols-2">
                  <Input
                    label={t('Title of your article:')}
                    type="url"
                    placeholder="Enter your post url"
                    {...register('postUrl')}
                    error={errors.postUrl?.message}
                  />
                  <Input
                    label={t('Ancor text/Keyword:')}
                    type="text"
                    placeholder="Enter your text here"
                    {...register('another_field')}
                    error={errors.another_field?.message}
                    className="mt-10 mb-10"
                  />
                  <Input
                    label={t('Landing Page/Link URL:')}
                    type="text"
                    placeholder="Enter your ancor text"
                    {...register('another_ancor')}
                    error={errors.another_ancor?.message}
                    className="mt-10 mb-10"
                  />
                  <Input
                    label={t('Article Content:')}
                    type="text"
                    placeholder="Enter your text here"
                    {...register('more_after_ancor')}
                    error={errors.more_after_ancor?.message}
                    className="mt-10 mb-10"
                  />
                </fieldset>
                <Button
                  type="submit"
                  className="mb-1 w-full flex-1 sm:flex-none md:w-auto"
                  isLoading={false}
                  disabled={false}
                >
                  {t('Add to cart')}
                </Button>

              </>
            )}
          </Form>
        )}
      </div>
    </div>
  );
};


export default ProductInputField;