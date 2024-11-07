import Input from '@/components/ui/input';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { useEffect } from 'react';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import Alert from '@/components/ui/alert';

type IProps = {
  initialValues: any
};

export default function ProductSimpleForm({ initialValues }: IProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const isTranslateProduct = locale !== Config.defaultLanguage;

  // Watch states of checkboxes
  const is_digital = watch('is_digital');
  const is_external = watch('is_external');
  const isLinkInsertion = watch('isLinkInsertion');

  // Pre-fill values based on initialValues prop if available
  useEffect(() => {
    if (initialValues) {
      setValue('is_digital', initialValues.is_digital === '1');
      setValue('is_external', initialValues.is_external === '1');
      setValue('isLinkInsertion', initialValues.isLinkInsertion === '1');
      if (initialValues.price) {
        setValue('price', initialValues.price);
      }
      if (initialValues.link_insertion_price) {
        setValue('link_insertion_price', initialValues.link_insertion_price);
      }
    }
  }, [initialValues, setValue]);
  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      {/* <Description
        title={t('form:form-title-simple-product-info')}
        details={`${
          initialValues
            ? t('form:item-description-edit')
            : t('form:item-description-add')
        } ${t('form:form-description-simple-product-info')}`}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      /> */}

      <div className="w-full sm:w-8/12 flex flex-wrap justify-start gap-3 md:w-full">
        <Input
          label={`${t("Guest Link Price")}*`}
          {...register('price')}
          placeholder='Enter price'
          type="number"
          error={t(errors.price?.message!)}
          variant="outline"
          className="mb-5 w-80 max-md:w-80"
        />
         <Checkbox
          {...register('isLinkInsertion')}
          id="isLinkInsertion"
          label={t('Allowing Link Insertion')}
          checked={isLinkInsertion}
          className="mb-5 max-md:w-80 w-64"
        />

        {/* Conditionally render 'Link Insertion Price' input if 'isLinkInsertion' is checked */}
        {isLinkInsertion && (
          <Input
            label={`${t("Link Insertion Price")}*`}
            {...register('link_insertion_price', { required: isLinkInsertion })}
            placeholder="Enter price"
            type="number"
            error={t(errors.link_insertion_price?.message!)}
            variant="outline"
            className="mb-5 w-80 max-md:w-80"
          />
        )}
        {/* <Input
          label={t('form:input-label-sale-price')}
          type="number"
          {...register('sale_price')}
          placeholder='Enter sale price'
          error={t(errors.sale_price?.message!)}
          variant="outline"
          className="mb-5 max-md:w-80 w-80"
        /> */}

        {/* {!is_external && (
          <Input
            label={`${t('form:input-label-quantity')}*`}
            type="number"
            {...register('quantity')}
            placeholder='Enter Quaniity'
            error={t(errors.quantity?.message!)}
            variant="outline"
            className="mb-5 max-md:w-80 w-64"
            // Need discussion
            disabled={isTranslateProduct}
          />
        )}

        <Input
          label={`${t('form:input-label-sku')}*`}
          {...register('sku')}
          note={
            Config.enableMultiLang
              ? `${t('form:input-note-multilang-sku')}`
              : ''
          }
          error={t(errors.sku?.message!)}
          variant="outline"
          className="mb-5 max-md:w-80 w-64"
          disabled={isTranslateProduct}
        /> */}

        {/* <Input
          label={`${t('form:input-label-preview-url')}`}
          {...register('preview_url')}
          placeholder='Enter example url'
          error={t(errors.preview_url?.message!)}
          variant="outline"
          className="mb-5 max-md:w-80 w-80"
        /> */}

        {/* <Checkbox
          {...register('is_external')}
          id="is_external"
          label={t('form:input-label-is-external')}
          disabled={Boolean(is_digital)}
          className="mb-5 max-md:w-80 w-64"
        /> */}

        {/* {true ? (
          <>
            <Label>{t('form:input-label-digital-file')}</Label>
            <FileInput
              name="digital_file_input"
              control={control}
              multiple={false}
              acceptFile={true}
              defaultValue={{}}
            />
            <Alert
              message={t('form:info-about-digital-product')}
              variant="info"
              closeable={false}
              className="mt-5 mb-5"
            />
            <input type="hidden" {...register(`digital_file`)} />
            {
              // @ts-ignore
              errors.digital_file_input && (
                <p className="my-2 text-xs text-red-500 text-start">
                  {
                    // @ts-ignore
                    t('form:error-digital-file-is-required')
                  }
                </p>
              )
            }
          </>
        ) : null} */}

        {/* {is_external ? (
          <div>
            <Input
              label={t('form:input-label-external-product-url')}
              {...register('external_product_url')}
              error={t(errors.external_product_url?.message!)}
              variant="outline"
              className="mb-5 max-md:w-80w-64"
              required
            />
            <Input
              label={t('form:input-label-external-product-button-text')}
              {...register('external_product_button_text')}
              error={t(errors.external_product_button_text?.message!)}
              variant="outline"
              className="mb-5 max-md:w-80 w-64"
              required
            />
          </div>
        ) : (
          <>
            <Label>{t('form:input-label-digital-file')}</Label>
            <FileInput
              name="digital_file_input"
              control={control}
              multiple={false}
              acceptFile={true}
              defaultValue={{}}
            />
            <input type="hidden" {...register(`digital_file`)} />
            {errors.digital_file_input && (
              <p className="my-2 text-xs text-red-500 text-start">
                {t(errors.digital_file_input?.message!)}
              </p>
            )}
          </>
        )} */}
      </div>
    </div>
  );
}
