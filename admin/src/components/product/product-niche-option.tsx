import Input from '@/components/ui/input';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import FileInput from '@/components/ui/file-input';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import Alert from '@/components/ui/alert';
import Radio from '../ui/radio/radio';

type IProps = {
  initialValues: any;
};

export default function ProductNicheOptions({ initialValues }: IProps) {
  const {
    register,
    control,
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


  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <Description
        title={t('Select Grey Niche options')}
        // details={`${initialValues
        //   ? t('form:item-description-edit')
        //   : t('form:item-description-add')
        //   } ${t('form:form-description-simple-product-info')}`}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 flex flex-wrap justify-start gap-3 md:w-full">

        <Checkbox
          {...register('is_niche')}
          id="is_niche"
          label={t('Grey Niche allowed?')}
          disabled={Boolean(is_niche) && !is_niche}
          className="mb-5 font-semibold text-black-900 max-md:w-80 w-64"
        />

        {is_niche ? (
          <div>
            <Checkbox
              {...register('is_gamble')}
              id="is_gamble"
              label={t('Casino/Betting/Gambling Link')}
              disabled={Boolean(is_gamble) && !is_gamble}
              className="mb-5 font-semibold  max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_cbd')}
              id="is_cbd"
              label={t('CBD Link')}
              disabled={Boolean(is_cbd) && !is_cbd}
              className="mb-5 font-semibold text-black-900 max-md:w-80 w-64"
            />
            <Checkbox
              {...register('is_crypto')}
              id="is_crypto"
              label={t('Cryptocurrency Link')}
              disabled={Boolean(is_crypto) && !is_crypto}
              className="mb-5 font-semibold max-md:w-80 w-64"
            />
          </div>
        ) : (
          null)}
      </Card>
    </div>
  );
}
