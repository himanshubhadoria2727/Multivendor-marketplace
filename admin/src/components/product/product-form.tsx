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
import { useEffect, useMemo, useState } from 'react';
import ProductAuthorInput from '@/components/product/product-author-input';
import ProductManufacturerInput from '@/components/product/product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
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
import Select from "react-select";
import SelectInput from '../ui/select-input';
import { ValidationError } from 'yup';
import { useCountriesQuery } from '@/data/countries';
import ProductNicheOptions from './product-niche-option';


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

  // const [countries, setCountries] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState({});

  // useEffect(() => {
  //   fetch(
  //     "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("api response   "+ JSON.stringify(data))
  //       setCountries(data.countries);
  //       setSelectedCountry(data.userSelectValue.label.toString());
  //     });
  // }, []);

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
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const upload_max_filesize = options?.server_info?.upload_max_filesize / 1024;

  const { mutate: createProduct, isLoading: creating } = useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } = useUpdateProductMutation();

  const onSubmit = async (values: ProductFormValues) => {
    console.log("HI nandu");
    console.log(values.languages);
    values.languages=values.languages.label;
    values.countries = values.countries.value;
    values.link_type= values.link_type.label;
    const inputValues = {
      language: router.locale,

      ...getProductInputValues(values, initialValues, isNewTranslation),
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        //@ts-ignore
        createProduct({
          ...inputValues,
          ...(initialValues?.slug && { slug: initialValues.slug }),
          shop_id: shopId || initialValues?.shop_id,quantity:100, sku:"samplesku",
        });
      } else {
        //@ts-ignore
        updateProduct({
          ...inputValues,
          id: initialValues.id!,
          shop_id: initialValues.shop_id!,
        });
      }
    } catch (error) {
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

  const featuredImageInformation = (
    <span>
      {t('form:featured-image-help-text')} <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{upload_max_filesize} MB </span>
    </span>
  );

  const galleryImageInformation = (
    <span>
      {t('form:gallery-help-text')} <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{upload_max_filesize} MB </span>
    </span>
  );

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
          <Description
            title={t('form:item-description')}
            details={`${initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
              } ${t('form:product-description-help-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <div className="my-5 flex flex-wrap sm:my-8 justify-center">
            <Card className="w-full flex justify-start gap-2 flex-wrap sm:justtify-center sm:w-8/12 md:w-full">

              <Input
                label={`Site domain`}
                {...register('name')}
                placeholder='eg-google.com'
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5 w-64 max-md:w-full"
              />

              {isSlugEditable ? (
                <div className="relative mb-5">
                  <Input
                    label={`Site slug`}
                    {...register('slug')}
                    error={t(errors.slug?.message!)}
                    variant="outline"
                    disabled={isSlugDisable}
                  />
                  <button
                    className="absolute top-[27px] right-px z-10 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                    type="button"
                    title={t('common:text-edit')}
                    onClick={() => setIsSlugDisable(false)}
                  >
                    <EditIcon width={14} />
                  </button>
                </div>
              ) : (
                <Input
                  label={`Site slug`}
                  {...register('slug')}
                  value={slugAutoSuggest}
                  variant="outline"
                  className="mb-5 w-64 max-md:w-full"
                  disabled
                />
              )}
              <Input
                label={`Site name`}
                {...register('domain_name')}
                error={t(errors.domain_name?.message!)}
                placeholder='eg-google'
                variant="outline"
                className="mb-5 w-64 max-md:w-full"
              />
              <Input
                label={"Domain Authority"}
                type="number"
                {...register('domain_authority')}
                placeholder='From 1 to 100'
                error={t(errors.domain_authority?.message!)}
                variant="outline"
                className="mb-5 w-64 max-md:w-full"
              />
              <Input
                label={"Domain rating"}
                type='number'
                {...register('domain_rating')}
                placeholder='From 1 to 100'
                error={t(errors.domain_rating?.message!)}
                variant="outline"
                className="mb-5 w-64 max-md:w-full"
              />
              <Input
                label={"Organic traffic"}
                type='number'
                {...register('organic_traffic')}
                placeholder='Enter organic traffic'
                error={t(errors.organic_traffic?.message!)}
                variant="outline"
                className="mb-5 w-64 max-md:w-full"
              />
              <Input
                label={"Spam score"}
                type='number'
                {...register('spam_score')}
                placeholder='Enter spam score'
                error={t(errors.spam_score?.message!)}
                variant="outline"
                className="mb-5 w-64 max-md:w-full"
              />

              <div className="mb-5 w-64 max-md:w-full">
              <Label>{t('Language')}</Label>
                <SelectInput
                  name="languages"
                  placeholder='Select Language'
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
                    { value: 'pt', label: 'Portuguese' }
                  ]}
                  error={t(errors.languages?.message!)}
                />
              </div>

              <div className="mb-5 w-64 max-md:w-full">
                <Label>{t('Link type')}</Label>
                <SelectInput
                  name="link_type"
                  placeholder='Select link type'
                  control={control}
                  options={[
                    { value: 'nofollow', label: 'Nofollow' },
                    { value: 'dofollow', label: 'Dofollow' },
                  ]
                  }
                  error={t(errors.link_type?.message!)}
                />
              </div>
              <div className="mb-5 w-64 max-md:w-full">
                <Label>{t('Select Country')}</Label>
                <SelectInput
                  name="countries"
                  placeholder='Select country'
                  control={control}
                  options={allCountries?.map((country:any) => ({
                    label: country.name.common,
                    value: country.cca3,
                  }))}
                  error={t(errors.countries?.message!)}
                />
              </div>
              <div className="relative mb-5">
                {options?.useAi && (
                  <OpenAIButton
                    title="Generate Description With AI"
                    onClick={handleGenerateDescription}
                  />
                )}
                <RichTextEditor
                  title={t('form:input-label-description')}
                  control={control}
                  name="description"
                  error={t(errors?.description?.message)}
                />
              </div>
              <div>
                <Label>{t('form:input-label-status')}</Label>
                {!isEmpty(statusList)
                  ? statusList?.map((status: any, index: number) => (
                    <Radio
                      key={index}
                      {...register('status')}
                      label={t(status?.label)}
                      id={status?.id}
                      value={status?.value}
                      className="mb-2"
                      disabled={
                        permission &&
                          initialValues?.status === ProductStatus?.Draft
                          ? true
                          : false
                      }
                    />
                  ))
                  : ''}
                {errors.status?.message && (
                  <p className="my-2 text-xs text-red-500">
                    {t(errors?.status?.message!)}
                  </p>
                )}
              </div>
            </Card>
          </div>
          {/* <div className="my-5 w-full flex flex-col border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-title-product-type')}
              details={t('form:form-description-product-type')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
            />

						<ProductTypeInput />
					</div> */}

          <ProductSimpleForm initialValues={initialValues} />
          <ProductNicheOptions initialValues={initialValues}/>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-0 sm:my-8">
            <Description
              title={t('form:type-and-category')}
              details={t('form:type-and-category-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductGroupInput
                control={control}
                error={t((errors?.type as any)?.message)}
              />
              <ProductCategoryInput control={control} setValue={setValue} />
              {/* <ProductAuthorInput control={control} /> */}
              {/* <ProductManufacturerInput control={control} setValue={setValue} /> */}
              <ProductTagInput control={control} setValue={setValue} />
            </Card>
          </div>

          {/* Simple Type */}
          {/* {product_type?.value === ProductType.Simple && (
          )} */}

          {/* Variation Type */}
          {/* {product_type?.value === ProductType.Variable && (
            <ProductVariableForm
              shopId={shopId}
              initialValues={initialValues}
              settings={options}
            />
          )} */}

          <StickyFooterPanel>
            <div className="flex items-center">
              {initialValues && (
                <Button
                  variant="outline"
                  onClick={router.back}
                  className="me-4"
                  type="button"
                >
                  {t('form:button-label-back')}
                </Button>
              )}
              <div className="ml-auto">
                {/* {showPreviewButton && (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_SHOP_URL}/products/preview/${router.query.productSlug}`}
                    target="_blank"
                    className="inline-flex h-12 flex-shrink-0 items-center justify-center rounded border !border-accent bg-transparent px-5 py-0 text-sm font-semibold leading-none !text-accent outline-none transition duration-300 ease-in-out me-4 hover:border-accent hover:bg-accent hover:!text-white focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700 md:text-base"
                  >
                    <EyeIcon className="w-4 h-4 me-2" />
                    {t('form:button-label-preview-product-on-shop')}
                  </Link>
                )} */}
                <Button
                  loading={updating || creating}
                  disabled={updating || creating}
                  size="medium"
                  className="text-sm md:text-base"
                >
                  {initialValues ? (
                    <>
                      <UpdateIcon className="w-5 h-5 shrink-0 ltr:mr-2 rtl:pl-2" />
                      <span className="sm:hidden">
                        {t('form:button-label-update')}
                      </span>
                      <span className="hidden sm:block">
                        {t('form:button-label-update-product')}
                      </span>
                    </>
                  ) : (
                    t('form:button-label-add-product')
                  )}
                </Button>
              </div>
            </div>
          </StickyFooterPanel>
        </form>
      </FormProvider>
    </>
  );
}
