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

export default function ProductView({ initialValues }: ProductFormProps) {
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
    useCreateProductMutation((res) => {
      console.log('Product created successfully.');
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    });
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();
  const onSubmit = async (values: ProductFormValues) => {
    console.log('submittion started');
    // event.preventDefault();
    values.slug = slugAutoSuggest;
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
    // values.status = 'publish'
    const inputValues = {
      language: router.locale,
      ...getProductInputValues(values, initialValues, isNewTranslation),
      type_id: values.type_id || '1',
      description: values.description || 'none',
    };

    try {
      console.log('initial values', inputValues);

      // if (
      //   !initialValues ||
      //   !initialValues.translated_languages.includes(router.locale!)
      // ) {
      console.log('initial values', inputValues);
      //@ts-ignore

      //cretateProduct(
      // {
      //   "language": "en",
      //   "description": "<p>askldklsa</p>",
      //   "video": [],
      //   "other_guidelines": "dkjanskldja",
      //   "organic_traffic": 8,
      //   "spam_score": 8,
      //   "tat": 77,
      //   "word_count": 77,
      //   "domain_rating": 8,
      //   "domain_authority": 88,
      //   "price": 37,
      //   "name": "https://sdkjas.com",
      //   "step1": "",
      //   "step2": "",
      //   "languages": "English",
      //   "countries": "GS",
      //   "link_type": "DoFollow",
      //   "link_validity": "1 Year",
      //   "link_counts": "1",
      //   "sponsored_marked": "Yes",
      //   "isLinkInsertion": false,
      //   "is_niche": false,
      //   "step3": "",
      //   "slug": "https://sdkjas.com",
      //   "status": "draft",
      //   "is_digital": true,
      //   "type_id": "1",
      //   "product_type": "simple",
      //   "categories": [
      //       1
      //   ],
      //   "quantity": 100,
      //   "digital_file": {},
      //   "variations": [],
      //   "variation_options": {
      //       "upsert": []
      //   },
      //   "min_price": null,
      //   "max_price": null,
      //   "shop_id": 54,
      //   "sku": "samplesku"
      // }
      //)
      //   createProduct({
      //     ...inputValues,
      //     ...(initialValues?.slug && { slug: initialValues.slug }),
      //     shop_id: shopId || initialValues?.shop_id,
      //     quantity: 100,
      //     sku: 'samplesku',
      //     type_id: values.type_id || '1',
      //   });
      // } else {
      var x = localStorage.getItem('webId'); //setItem
      var y = localStorage.getItem('shopId');
      //@ts-ignore
      updateProduct({
        ...inputValues,
        id: initialValues?.id! || x,
        shop_id: initialValues?.shop_id! || y,
        description: 'none',
      });
      // }
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
  const sanitizeUrl = (url: any) => {
    // Remove http:// or https:// from the beginning and any trailing slashes
    return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  };
  const handleBlur = (e: any) => {
    const sanitizedUrl = sanitizeUrl(e.target.value);
    setValue('name', sanitizedUrl); // Update the value in React Hook Form
  };

  console.log('productUrl', productUrl);
  

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

    const newInputValues = {
      video: [],
      other_guidelines: ' a',
      organic_traffic: 0,
      spam_score: 0,
      tat: 0,
      languages: 'English',
      word_count: 0,
      domain_rating: 0,
      domain_authority: 0,
      price: 0,
      slug: '',
      site_name: 'a ',
      domain_name: ' a',
      sale_price: 0, // Optional, can be omitted if not needed
      quantity: 0, // Optional, can be omitted if not needed
      countries: ' a',
      link_type: 'a ',
      niche_price: '0',
      link_insertion_price: '0',
      link_validity: 'a ',
      link_counts: 'a',
      sponsored_marked: 'a',
      description: 'none',
      categories: [],
      variations: [],
      in_stock: true, // Default value
      is_taxable: false, // Default value
      author_id: '', // Optional if not required
      digital_file: {},
      product_type: product_type,
      external_product_button_text: '',
      external_product_url: '',
      is_external: false,
      isLinkInsertion: false,
      is_niche: false,
      is_gamble: false,
      is_cbd: false,
      is_crypto: false,
      is_betting: false,
      is_vaping: false,
      is_rehab: false,
      manufacturer_id: '',
      max_price: null,
      min_price: null,
      variation_options: {
        upsert: [],
      },
      gallery: [],
      image: undefined, // Set to undefined or an object of AttachmentInput if available
      status: 'draft', // Assuming 'draft' is a valid ProductStatus
      height: '',
      length: '',
      width: '',
      in_flash_sale: false,
    };

    if (isValid) {
      if (currentStep === 1) {
        // Check if initialValues are available and translated_languages includes the current locale
        if (
          !initialValues ||
          !initialValues.translated_languages.includes(router.locale!)
        ) {
          // Create the product
          try {
            var rs = await createProduct({
              ...newInputValues,
              ...(initialValues?.slug && { slug: initialValues.slug }),
              shop_id: shopId || initialValues?.shop_id,
              quantity: 100,
              sku: 'samplesku',
              type_id: getValues('type').id || '1',
              name: getValues('name'),
              product_type: 'simple',
            });
            console.log('Product created successfully outside', rs);
          } catch (error) {
            console.error('Failed to create product:', error);
            // Optionally, display an error message to the user
            // setErrorMessage('Failed to create product. Please try again.');
          }
        } else {
          console.log('Initial values are valid, proceeding to the next step.');
          window.scrollTo({ top: 0, behavior: 'auto' });
          if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
          }
        }
      } else {
        console.log('Form is valid, proceeding to the next step.');
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (currentStep < steps.length) {
          setCurrentStep(currentStep + 1);
        }
      }
    } else {
      console.log('Form is not valid, stopping progression.');
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
          <div className="flex flex-col justify-center">
            
            <Card className="w-full flex-col justify-start gap-3 sm:justtify-center sm:w-1/3 md:w-full">
            <h3 className="text-lg font-semibold mb-3">Domain Info  </h3> 
            <div className="w-full flex justify-start gap-3 flex-row sm:justtify-center sm:w-1/3 md:w-full">
              <Input
                label="Website URL"
                {...register('name')}
                placeholder="eg-google.com"
                error={errors.name?.message}
                onChange={(e) => setValue('name', e.target.value)} // Let React Hook Form handle the input value
                onBlur={handleBlur} // Sanitize URL on blur
                disabled={true}
                variant="outline"
                className="mb-5 w-1/2 max-md:w-full"
              />
              <Input
                label="Site type"
                name="type"
                placeholder="From 1 to 100"
                value={initialValues?.type?.name}
                disabled
                variant="outline"
                className="mb-5 w-1/2 max-md:w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              </div>

              {/* First Row: Metrics */}
              <div className="w-full">
              <h3 className="text-lg font-semibold mb-3">Metrics</h3> 
                <div className="flex flex-wrap gap-3 justify-start md:justify-between">
                  <Input
                    label="Moz DA"
                    type="number"
                    placeholder="From 1 to 100"
                    value={initialValues?.domain_authority || ''}
                    disabled
                    variant="outline"
                    className="mb-5 w-[22%] max-md:w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <Input
                    label="Ahref DR"
                    type="number"
                    placeholder="From 1 to 100"
                    value={initialValues?.domain_rating || ''}
                    disabled
                    variant="outline"
                    className="mb-5 w-[22%] max-md:w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <Input
                    label="Ahref Traffic"
                    type="number"
                    placeholder="Enter organic traffic"
                    value={initialValues?.organic_traffic || ''}
                    disabled
                    variant="outline"
                    className="mb-5 w-[22%] max-md:w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <Input
                    label="Spam score"
                    type="number"
                    placeholder="Enter spam score"
                    value={initialValues?.spam_score || ''}
                    disabled
                    variant="outline"
                    className="mb-5 w-[22%] max-md:w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="w-full">
                <h3 className="text-lg font-semibold mb-3">Site Info</h3>
                <div className="flex flex-wrap gap-3 justify-start md:justify-between">
                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Language')}</Label>
                    <Input
                      name="languages"
                      placeholder="Select Language"
                      value={initialValues?.languages || ''}
                      disabled
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Country')}</Label>
                    <Input
                      name="countries"
                      placeholder="Select country"
                      value={initialValues?.countries || ''}
                      disabled
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Categories')}</Label>
                    <Input
                      name="categories"
                      value={
                        initialValues?.categories
                          ?.map((category: { name: string }) => category.name)
                          .join(', ') || ''
                      }
                      disabled
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Third Row: Link Info */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-3">Link Info</h3>
                <div className="flex flex-wrap gap-3 justify-start md:justify-between">
                  {/* Link Type */}
                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Link Type')}</Label>
                    <Input
                      name="link_type"
                      placeholder="Link Type"
                      value={initialValues?.link_type || ''}
                      disabled
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Link Validity */}
                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Link Validity')}</Label>
                    <Input
                      name="link_validity"
                      placeholder="Link Validity"
                      value={initialValues?.link_validity || ''}
                      disabled
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Link Counts */}
                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Link Counts')}</Label>
                    <Input
                      name="link_counts"
                      placeholder="Link Counts"
                      value={initialValues?.link_counts || ''}
                      disabled
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    value={initialValues?.word_count || ''}
                    placeholder="e.g. 600 Words"
                    variant="outline"
                    className="mb-5 w-60 md:w-[30%]"
                    disabled
                  />

                  {/* TAT */}
                  <Input
                    label="TAT"
                    value={initialValues?.tat || ''}
                    placeholder="e.g. 2 Days"
                    variant="outline"
                    className="mb-5 w-60 md:w-[30%]"
                    disabled
                  />

                  {/* Sponsored Marked */}
                  <div className="w-full md:w-[30%] mb-5">
                    <Label>{t('Sponsored Marked')}</Label>
                    <Input
                      name="sponsored_marked"
                      placeholder="Yes/No"
                      value={initialValues?.sponsored_marked || ''}
                      disabled
                    />
                  </div>
                </div>

                {/* Other Guidelines */}
                <div className="w-full">
                  <TextArea
                    placeholder={initialValues?.other_guidelines || ''}
                    label={t('Other Guidelines')}
                    variant="outline"
                    disabled
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
                {/* <div className="mb-4">
              <ProductTagInput control={control} setValue={setValue} />
            </div> */}
                <div className=" flex flex-row gap-20 justify-start p-4 mb-4">
                  {/* Added bottom margin for spacing */}
                  <div className="w-full md:w-1/2 mb-5">
                    <Label>{t('Guest Post price')}</Label>
                    <Input
                      name="sponsored_marked"
                      placeholder="Yes/No"
                      value={initialValues?.price || ''}
                      disabled
                    />
                  </div>
                  {initialValues?.isLinkInsertion === '1' ? (
                    <div className="w-1/2 full mb-5">
                      <Label>{t('Link Insertion price')}</Label>
                      <Input
                        name="sponsored_marked"
                        //   placeholder="Yes/No"
                        value={initialValues?.link_insertion_price || ''}
                        disabled
                      />
                    </div>
                  ) : (
                    'No Link Insertion'
                  )}
                </div>
                <div className="mb-4">
                  {/* Added bottom margin for spacing */}
                  {initialValues?.is_niche === 1 && (
                    <>
                      {(initialValues?.is_gamble === '1' ||
                        initialValues?.is_cbd === '1' ||
                        initialValues?.is_crypto === '1') && (
                        <div className="w-full">
                          <h3 className="text-lg font-semibold mb-3">
                            Niche Info
                          </h3>
                          <div className="flex flex-wrap gap-3 justify-start md:justify-between">
                            {/* Gamble Info */}
                            {initialValues?.is_gamble === '1' && (
                              <Input
                                label="Gamble"
                                value="Gambling Niche"
                                disabled
                                className="mb-5 w-60 md:w-[30%]"
                              />
                            )}

                            {/* CBD Info */}
                            {initialValues?.is_cbd === '1' && (
                              <Input
                                label="CBD"
                                value="CBD Niche"
                                disabled
                                className="mb-5 w-60 md:w-[30%]"
                              />
                            )}

                            {/* Crypto Info */}
                            {initialValues?.is_crypto === '1' && (
                              <Input
                                label="Crypto"
                                value="Crypto Niche"
                                disabled
                                className="mb-5 w-60 md:w-[30%]"
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
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

                  <TextArea
                    disabled
                    label={t('Site Description')}
                    name="description"
                    placeholder={initialValues?.description || ''}
                  />
                </div>
              </div>
            </Card>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
