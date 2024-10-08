import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import Card from '@/components/common/card';
import ValidationError from '@/components/ui/form-validation-error';
import { ProductType } from '@/types';
import { useTranslation } from 'next-i18next';

const productType = [
  { name: 'Guest Link', value: 'guest_link' },
  { name: 'Link Insertion', value: 'link_insertion' },
];

const ProductTypeInput = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  return (
    <Card className="w-full sm:w-8/12 md:w-2/3">
      <div className="mb-5">
        <Label>{t('form:form-title-product-type')}</Label>
        <SelectInput
          name="product_type"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          isMulti
          options={productType}
        />
        <ValidationError message={t(errors.product_type?.message)} />
        
      </div>
    </Card>
  );
};

export default ProductTypeInput;
