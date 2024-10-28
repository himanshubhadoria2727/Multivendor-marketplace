import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from './product-validation-schema';
import ProductVariableForm from './product-variable-form';
import ProductSimpleForm from './product-simple-form';
import ProductGroupInput from './product-group-input';
import ProductCategoryInput from './product-category-input';
import ProductTypeInput from './product-type-input';
import { ProductType, Product, ProductStatus } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from './product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import { useEffect, useMemo, useState, useRef } from 'react';
import ProductAuthorInput from '@/components/product/product-author-input';
import ProductManufacturerInput from '@/components/product/product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
import { FaCircle } from 'react-icons/fa';
import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { split, join, isEmpty } from 'lodash';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { useSettingsQuery } from '@/data/settings';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useCallback } from 'react';
import OpenAIButton from '@/components/openAI/openAI.button';
import { ItemProps } from '@/types';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import Link from '@/components/ui/link';
import { EyeIcon } from '../icons/category/eyes-icon';
import { UpdateIcon } from '../icons/update';
import { ProductDescriptionSuggestion } from '@/components/product/product-ai-prompt';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';
import TooltipLabel from '@/components/ui/tooltip-label';
import Select from 'react-select';
import SelectInput from '../ui/select-input';
// import { ValidationError } from 'yup';
import { useCountriesQuery } from '@/data/countries';
import ProductNicheOptions from './product-niche-option';
import WebsiteVerification from './verifyWebsite';
import { toast } from 'react-toastify';
import ValidationError from '@/components/ui/form-validation-error';
import { Dialog } from '@headlessui/react';

type ProductFormProps = {
  initialValues?: Product | null;
};

export default function CreateOrUpdateProductForm({
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  let statusList = [
    {
      label: 'form:input-label-under-review',
      id: 'under_review',
      value: ProductStatus.UnderReview,
    },
    {
      label: 'form:input-label-draft',
      id: 'draft',
      value: ProductStatus.Draft,
    },
  ];

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    },
  );
  const shopId = shopData?.id!;
  const isNewTranslation = router?.query?.action === 'translate';
  const showPreviewButton =
    router?.query?.action === 'edit' && Boolean(initialValues?.slug);
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const methods = useForm<ProductFormValues>({
    // @ts-ignore
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    // @ts-ignore
    defaultValues: getProductDefaultValues(initialValues!, isNewTranslation),
  });
  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    getFieldState,
    getValues,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const upload_max_filesize = options?.server_info?.upload_max_filesize / 1024;

  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();
  const onSubmit = async (values: ProductFormValues) => {
    console.log('submittion started');
    // event.preventDefault();
    values.languages = values.languages?.label;
    values.countries = values.countries?.value;
    values.link_type = values.link_type?.label;
    values.link_validity = values.link_validity?.label;
    values.link_counts = values.link_counts?.value;
    values.sponsored_marked = values.sponsored_marked?.label;
    try {
      if (initialValues?.status !== 'publish') {
        if (verificationResult === true) {
          values.status = 'publish';
        } else {
          values.status = 'draft';
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    
    const inputValues = {
      language: router.locale,
      ...getProductInputValues(values, initialValues, isNewTranslation),
      type_id: values.type_id || '1',
      description: values.description || 'none',
    };

    try {
      console.log('initial values', inputValues);

      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        console.log('initial values', inputValues);
        //@ts-ignore
        createProduct({
          ...inputValues,
          ...(initialValues?.slug && { slug: initialValues.slug }),
          shop_id: shopId || initialValues?.shop_id,
          quantity: 100,
          sku: 'samplesku',
          type_id: values.type_id || '1',
        });
      } else {
        //@ts-ignore
        updateProduct({
          ...inputValues,
          id: initialValues.id!,
          shop_id: initialValues.shop_id!,
          description: 'none',
        });
      }
    } catch (error) {
      console.log('something went wrong');
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };
  const product_type = watch('product_type');
  const is_digital = watch('is_digital');
  const is_external = watch('is_external');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'video',
  });
  const productName = watch('name');

  const autoSuggestionList = useMemo(() => {
    return ProductDescriptionSuggestion({ name: productName ?? '' });
  }, [productName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: productName,
      set_value: setValue,
      key: 'description',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [productName]);

  const { data: allCountries, error, isLoading } = useCountriesQuery();
  const slugAutoSuggest = formatSlug(watch('name'));
  if (Boolean(options?.isProductReview)) {
    if (permission) {
      if (initialValues?.status !== ProductStatus?.Draft) {
        statusList = [
          {
            label: 'form:input-label-published',
            id: 'published',
            value: ProductStatus.Publish,
          },
          {
            label: 'form:input-label-approved',
            id: 'approved',
            value: ProductStatus.Approved,
          },
          {
            label: 'form:input-label-rejected',
            id: 'rejected',
            value: ProductStatus.Rejected,
          },
          {
            label: 'form:input-label-soft-disabled',
            id: 'unpublish',
            value: ProductStatus.UnPublish,
          },
        ];
      } else {
        statusList = [
          {
            label: 'form:input-label-draft',
            id: 'draft',
            value: ProductStatus.Draft,
          },
        ];
      }
    } else {
      if (
        initialValues?.status === ProductStatus.Publish ||
        initialValues?.status === ProductStatus.Approved ||
        initialValues?.status === ProductStatus.UnPublish
      ) {
        {
          statusList = [
            {
              label: 'form:input-label-published',
              id: 'published',
              value: ProductStatus.Publish,
            },
            {
              label: 'form:input-label-unpublish',
              id: 'unpublish',
              value: ProductStatus.UnPublish,
            },
          ];
        }
      }
    }
  } else {
    statusList = [
      {
        label: 'form:input-label-published',
        id: 'published',
        value: ProductStatus.Publish,
      },
      {
        label: 'form:input-label-draft',
        id: 'draft',
        value: ProductStatus.Draft,
      },
    ];
  }

  // const featuredImageInformation = (
  //   <span>
  //     {t('form:featured-image-help-text')} <br />
  //     {t('form:size-help-text')} &nbsp;
  //     <span className="font-bold">{upload_max_filesize} MB </span>
  //   </span>
  // );

  // const galleryImageInformation = (
  //   <span>
  //     {t('form:gallery-help-text')} <br />
  //     {t('form:size-help-text')} &nbsp;
  //     <span className="font-bold">{upload_max_filesize} MB </span>
  //   </span>
  // );

  const [productUrl, setProductUrl] = useState('');
  const [verificationResult, setVerificationResult] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isInputLocked, setIsInputLocked] = useState(false);

  const handleVerificationComplete = (isVerified: any, message: any) => {
    if (isVerified) {
      setVerificationResult(true);
      setIsInputLocked(true);
    } else {
      setIsInputLocked(false);
    }

    // Use a callback to log the updated state
    setVerificationMessage(message);
    console.log('verification', isVerified ? true : verificationResult);
  };

  useEffect(() => {
    console.log('isInputLocked changed:', isInputLocked);
  }, [isInputLocked]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  function generateMetaContent(storageType = 'local') {
    const metaName = 'goodblogger-verification';
    const storage = storageType === 'local' ? localStorage : sessionStorage;

    // Check if content is already stored
    let storedContent = storage.getItem(metaName);

    if (!storedContent) {
      // Generate random UUID-like content
      storedContent = generateRandomUUID();

      // Store the generated content in the specified storage
      storage.setItem(metaName, storedContent);

      // Create or update the meta tag with the new content
      let metaTag = document.querySelector(`meta[name="${metaName}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', metaName);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', storedContent);
    }

    return storedContent;
  }

  function generateRandomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  const steps = [
    {
      title: 'Add domain',
      component: (
        <Card className="w-full flex justify-start gap-3 flex-wrap sm:justtify-center sm:w-1/3 md:w-full">
          <Input
            label={`Website URL`}
            {...register('name')}
            placeholder="eg-google.com"
            error={t(errors.name?.message!)}
            onChange={(e) => setProductUrl(e.target.value)}
            disabled={isInputLocked}
            variant="outline"
            className="mb-5 w-full max-md:w-full"
          />
          <ProductGroupInput
            control={control}
            error={t(errors?.type?.message)}
          />
        </Card>
      ),
      fields: ['name', 'product_type'],
    },
    {
      title: 'Add details',
      component: (
        <Card className="w-full flex flex-col gap-5">
          {/* First Row: Metrics */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-3">Metrics</h3>
            <div className="flex flex-wrap gap-3 justify-start md:justify-between">
              <Input
                label="Site slug"
                {...register('slug')}
                value={slugAutoSuggest}
                variant="outline"
                className="mb-5 w-[22%] max-md:w-full"
                disabled
              />
              <Input
                label="Site name"
                {...register('domain_name')}
                error={t(errors.domain_name?.message!)}
                placeholder="e.g. google"
                variant="outline"
                className="mb-5 w-[22%] max-md:w-full"
              />
              <Input
                label="Moz DA"
                type="number"
                {...register('domain_authority')}
                placeholder="From 1 to 100"
                error={t(errors.domain_authority?.message!)}
                variant="outline"
                className="mb-5 w-[22%] max-md:w-full"
              />
              <Input
                label="Ahref DR"
                type="number"
                {...register('domain_rating')}
                placeholder="From 1 to 100"
                error={t(errors.domain_rating?.message!)}
                variant="outline"
                className="mb-5 w-[22%] max-md:w-full"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-start md:justify-start space-x-10">
              <Input
                label="Ahref Traffic"
                type="number"
                {...register('organic_traffic')}
                placeholder="Enter organic traffic"
                error={t(errors.organic_traffic?.message!)}
                variant="outline"
                className="mb-5 w-[22%] max-md:w-full"
              />

              <Input
                label={'Spam score'}
                type="number"
                {...register('spam_score')}
                placeholder="Enter spam score"
                error={t(errors.spam_score?.message!)}
                variant="outline"
                className="mb-5 w-[22%] max-md:w-full"
              />
            </div>
          </div>

          {/* Second Row: Site Info */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-3">Site Info</h3>
            <div className="flex flex-wrap gap-3 justify-start md:justify-between">
              <div className="w-full md:w-[30%] mb-5">
                <Label>{t('Language')}</Label>
                <SelectInput
                  name="languages"
                  placeholder="Select Language"
                  control={control}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'hi', label: 'Hindi' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' },
                    { value: 'it', label: 'Italian' },
                    { value: 'ja', label: 'Japanese' },
                    { value: 'ru', label: 'Russian' },
                    { value: 'zh', label: 'Chinese' },
                    { value: 'ar', label: 'Arabic' },
                    { value: 'pt', label: 'Portuguese' },
                  ]}
                  error={t(errors.languages?.message!)}
                />
                <ValidationError message={t(error!)} />
              </div>

              <div className="w-full md:w-[30%] mb-5">
                <Label>{t('Select Country')}</Label>
                <SelectInput
                  name="countries"
                  placeholder="Select country"
                  control={control}
                  options={allCountries?.map((country: any) => ({
                    label: country.name.common,
                    value: country.cca2,
                  }))}
                  error={t(errors.countries?.message!)}
                />
                <ValidationError message={t(error!)} />
              </div>

              {/* Product Category Input */}
              <div className="w-full md:w-[30%] mb-5">
                <ProductCategoryInput control={control} setValue={setValue} />
              </div>
            </div>
          </div>

          {/* Third Row: Link Info */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-3">Link Info</h3>
            <div className="flex flex-wrap gap-3 justify-start md:justify-between">
              <div className="w-full md:w-[30%] mb-5">
                <Label>{t('Link Type')}</Label>
                <SelectInput
                  name="link_type"
                  placeholder="Select Link Type"
                  control={control}
                  options={[
                    { value: 'dofollow', label: 'DoFollow' },
                    { value: 'nofollow', label: 'NoFollow' },
                  ]}
                  error={t(errors.link_type?.message!)}
                />
              </div>

              <div className="w-full md:w-[30%] mb-5">
                <Label>{t('Link Validity')}</Label>
                <SelectInput
                  name="link_validity"
                  placeholder="Select Link Validity"
                  control={control}
                  options={[
                    { value: '1year', label: '1 Year' },
                    { value: '2year', label: '2 Years' },
                    { value: 'permanent', label: 'Permanent' },
                  ]}
                  error={t(errors?.link_validity?.message!)}
                />
              </div>

              <div className="w-full md:w-[30%] mb-5">
                <Label>{t('Link Counts')}</Label>
                <SelectInput
                  name="link_counts"
                  placeholder="Select Link Count"
                  control={control}
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                  ]}
                  error={t(errors?.link_counts?.message!)}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-3">
              Publication Guidelines
            </h3>
            <div className="flex flex-wrap gap-3 justify-start md:justify-between">
              {/* Word Count */}
              <Input
                label="Word count"
                {...register('word_count')}
                placeholder="e.g. 600 Words"
                variant="outline"
                className="mb-5 w-60 md:w-[30%]"
                error={t(errors.word_count?.message!)}
              />

              {/* TAT */}
              <Input
                label="TAT"
                {...register('tat')}
                placeholder="e.g. 2 Days"
                variant="outline"
                className="mb-5 w-60 md:w-[30%]"
                error={t(errors.tat?.message!)}
              />

              {/* Sponsored Marked */}
              <div className="w-full md:w-[30%] mb-5">
                <Label>{t('Sponsored Marked')}</Label>
                <SelectInput
                  name="sponsored_marked"
                  placeholder="Yes/No"
                  control={control}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                  error={t(errors.sponsored_marked?.message!)}
                />
              </div>
            </div>

            {/* Other Guidelines */}
            <div className="w-full">
              <TextArea
                placeholder="Enter other guidelines"
                label={t('Other Guidelines')}
                {...register('other_guidelines')}
                variant="outline"
                className="mb-5"
                error={t(errors.other_guidelines?.message!)}
              />
            </div>
          </div>

          {/* Additional Fields: Tags, Description */}
          <div className="w-full mb-6">
            {/* Added bottom margin for spacing */}
            <h3 className="text-lg font-semibold mb-4">
              {/* Increased bottom margin for better spacing */}
              Pricing
            </h3>
            <div className="mb-4">
              {/* Added bottom margin to separate from other components */}
              <ProductTagInput control={control} setValue={setValue} />
            </div>
            <div className="mb-4">
              {/* Added bottom margin for spacing */}
              <ProductSimpleForm initialValues={initialValues} />
            </div>
            <div className="mb-4">
              {/* Added bottom margin for spacing */}
              <ProductNicheOptions initialValues={initialValues} />
            </div>
            {/* AI and Rich Text Editor */}
            <div className="relative mb-5">
              {options?.useAi && (
                <OpenAIButton
                  title="Generate Description With AI"
                  onClick={handleGenerateDescription}
                  className="mb-3" // Added margin bottom for spacing
                />
              )}

              <RichTextEditor
                title={t('form:input-label-description')}
                control={control}
                name="description"
                error={t(errors?.description?.message)}
              />
            </div>
          </div>
        </Card>
      ),
      fields: [
        'slug',
        'domain_name',
        'domain_authority',
        'domain_rating',
        'organic_traffic',
        'languages',
        'countries',
        'categories',
        'link_type',
        'link_validity',
        'link_counts',
        'word_count',
        'tat',
        'sponsored_marked',
        'other_guidelines',
        'tags',
        'price',
        'isLinkInsertion',
        'preview_url',
        'is_niche',
        'is_gamble',
        'is_cbd',
        'is_crypto',
        'niche_price',
        'description',
      ],
    },
    {
      title: 'Verify and Add site',
      component: (
        <Card>
          {initialValues?.status !== 'publish' ? (
            <>
              {verificationResult === false ? (
                <Alert className="w-full mb-5" message={undefined}>
                  Your website will be in draft until it's verified
                </Alert>
              ) : null}
              {verificationResult === false ? (
                <div className="w-full mb-5 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                  <span className="flex sm:inline md:text-sm max-sm:text-xs">
                    Add this meta tag in your website to get verified: &lt;meta
                    name=&quot;goodblogger-verification&quot; content=&quot;
                    {generateMetaContent('local')}&quot;/&gt;
                  </span>
                </div>
              ) : null}
              <WebsiteVerification
                websiteUrl={productUrl || initialValues?.name}
                metaName="goodblogger-verification"
                metaContent={generateMetaContent('local')} // Use 'session' for sessionStorage
                onVerificationComplete={handleVerificationComplete}
              />
              {verificationResult === true && (
                <Alert className="mt-5 w-1/3" message={undefined}>
                  You are Verified, proceed to publish
                </Alert>
              )}
            </>
          ) : (
            <Alert className="mt-5 w-full" message={undefined}>
              You have reached the last step, update your site
            </Alert>
          )}

          {/* <button onClick={handleAddProduct} disabled={!verificationResult}>
                Add Product
              </button> */}
          {/* <div>{verificationMessage}</div> */}
          <StickyFooterPanel>
            <div className="flex items-center justify-between mt-5">
              {initialValues && (
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="me-4"
                  type="button"
                >
                  Back
                </Button>
              )}
              <div className="ml-auto">
                <Button
                  loading={updating || creating}
                  disabled={updating || creating}
                  size="medium"
                  className="text-sm md:text-base"
                >
                  {initialValues ? (
                    <>
                      <UpdateIcon className="w-5 h-5 mr-2" />
                      <span className="sm:hidden">Update</span>
                      <span className="hidden sm:block">Update Site</span>
                    </>
                  ) : (
                    'Add Site'
                  )}
                </Button>
              </div>
            </div>
          </StickyFooterPanel>
        </Card>
      ),
    },
  ];

  const handleNextStep = async () => {
    let isValid = true;
    const invalidFields = []; // To store the names of invalid fields

    for (let i = 1; i <= currentStep; i++) {
      const stepFields = steps[i - 1].fields;

      console.log(`Validating step ${i} with fields:`, stepFields); // Log fields for each step

      // Get the values for the current step's fields
      const stepValues = getValues(stepFields);
      console.log(`Values for step ${i}:`, stepValues); // Log values for the current step

      // Validate the current step
      const stepIsValid = await trigger(stepFields);

      if (!stepIsValid) {
        // Collect names of invalid fields
        stepFields.forEach((field) => {
          const { invalid, error } = getFieldState(field);
          if (invalid) {
            invalidFields.push({
              field,
              message: error?.message || 'Invalid field',
            });
          }
        });

        console.log(`Step ${i} is not valid.`); // Log invalid step
        isValid = false;
        break;
      } else {
        console.log(`Step ${i} is valid.`); // Log valid step
      }
    }

    if (isValid) {
      console.log('Form is valid, proceeding to the next step.');
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      console.log('Form is not valid, stopping progression.');
      // Log all invalid fields and their messages
      console.log('Invalid fields:', invalidFields);
      // Optionally, set an error message to display to the user
      // setErrorMessage('Please complete the required fields before proceeding.');
    }
  };

  const handlePreviousStep = () => {
    window.scrollTo({ top: 0, behavior: 'auto' }); // Add your existing logic to handle the previous step
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col min-h-screen p-4">
            {/* Step Titles and Progress Bar */}
            <div className="mb-6">
              {/* Step Titles */}
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex-1 text-center text-gray-700 font-medium"
                  >
                    <span className="text-sm">{step.title}</span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="relative flex items-center">
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${(currentStep / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-box">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={currentStep === index + 1 ? 'block' : 'hidden'}
                >
                  <Controller
                    name={`step${index + 1}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <div>
                        {step.component}
                        {errors[`step${index + 1}`] && (
                          <span className="text-red-500 text-xs">
                            This field is required
                          </span>
                        )}
                      </div>
                    )}
                    rules={{ required: true }} // Adjust validation rules as needed
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between relative top-5">
              {currentStep > 1 && (
                <div
                  onClick={handlePreviousStep}
                  className="flex-shrink-0 px-4 cursor-pointer py-2 border border-[#24b47e] rounded-lg bg-transparent hover:bg-[#24b47e] hover:text-white text-[#24b47e] transition duration-300 ease-in-out"
                >
                  Previous Step
                </div>
              )}
              {currentStep < steps.length && (
                <div
                  onClick={handleNextStep}
                  className="flex-shrink-0 px-4 cursor-pointer py-2 border border-[#24b47e] rounded-lg bg-transparent hover:bg-[#24b47e] hover:text-white text-[#24b47e] transition duration-300 ease-in-out"
                >
                  Next Step
                </div>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
