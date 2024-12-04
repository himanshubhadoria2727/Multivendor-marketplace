import Input from '@/components/ui/input';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { Config } from '@/config';
import { useRouter } from 'next/router';

type IProps = {
  initialValues: any;
};

export default function ProductNicheOptions({ initialValues }: IProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const isTranslateProduct = locale !== Config.defaultLanguage;

  const is_niche = watch('is_niche');
  const is_gamble = watch('is_gamble');
  const is_cbd = watch('is_cbd');
  const is_crypto = watch('is_crypto');
  const is_vaping = watch('is_vaping');
  const is_betting = watch('is_betting');
  const is_rehab = watch('is_rehab');

  // Pre-select checkboxes based on initialValues prop
  useEffect(() => {
    if (initialValues) {
      // Set 'is_niche' value based on initialValues or default
      setValue('is_niche', initialValues.is_niche === '1' ? true : false);

      // Set 'is_gamble', 'is_cbd', 'is_crypto' values based on initialValues or default
      setValue('is_gamble', initialValues.is_gamble === '1' ? true : false);
      setValue('is_cbd', initialValues.is_cbd === '1' ? true : false);
      setValue('is_crypto', initialValues.is_crypto === '1' ? true : false);
      setValue('is_betting', initialValues.is_betting === '1' ? true : false);
      setValue('is_rehab', initialValues.is_rehab === '1' ? true : false);
      setValue('is_vaping', initialValues.is_vaping === '1' ? true : false);

      // Set niche_price if it exists
      if (initialValues.niche_price) {
        setValue('niche_price', initialValues.niche_price);
      }
    }
  }, [initialValues, setValue]);

  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <Description
        title={t('Add forbidden categories')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 flex flex-wrap justify-start gap-3 md:w-full">
        <Checkbox
          {...register('is_niche')}
          id="is_niche"
          label={t('Forbidden categories allowed?')}
          checked={is_niche} // Controlled by watch
          className="mb-5 font-semibold text-black-900 max-md:w-80 w-64"
        />

        {is_niche && (
          <div>
            <Checkbox
              {...register('is_gamble')}
              id="is_gamble"
              label={t('Casino Link')}
              checked={is_gamble} // Controlled by watch
              className="mb-5 font-semibold max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_cbd')}
              id="is_cbd"
              label={t('CBD/Marijuana Link')}
              checked={is_cbd} // Controlled by watch
              className="mb-5 font-semibold text-black-900 max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_crypto')}
              id="is_crypto"
              label={t('Cryptocurrency Link')}
              checked={is_crypto} // Controlled by watch
              className="mb-5 font-semibold max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_betting')}
              id="is_betting"
              label={t('Betting Link')}
              checked={is_betting} // Controlled by watch
              className="mb-5 font-semibold max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_rehab')}
              id="is_rehab"
              label={t('Rehabilitation Link')}
              checked={is_rehab} // Controlled by watch
              className="mb-5 font-semibold max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_vaping')}
              id="is_vaping"
              label={t('Vaping Link')}
              checked={is_vaping} // Controlled by watch
              className="mb-5 font-semibold max-md:w-80 w-64"
            />
            <Input
              label={t('Set niche Price')}
              type="number"
              {...register('niche_price', {
                required: is_niche ? t('Price is required') : false,
              })}
              placeholder={t('Enter niche price')}
              error={errors.niche_price ? t(errors.niche_price.message) : ''}
              variant="outline"
              disabled={!is_niche}
              className="mb-5 w-64 max-md:w-full"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
