import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { withdrawValidationSchema } from './withdraw-validation-schema';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import { animateScroll } from 'react-scroll';
import { Withdraw } from '@/types';
import { useShopQuery } from '@/data/shop';
import { useCreateWithdrawMutation } from '@/data/withdraw';
import Label from '@/components/ui/label';
import usePrice from '@/utils/use-price';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { useMeQuery } from '@/data/user';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { useCountriesQuery } from '@/data/countries';
import { Controller } from 'react-hook-form';
import Select from '../ui/select/select';
import { toast } from 'react-toastify';

type FormValues = {
  amount: number;
  payment_method: 'paypal' | 'bank';
  details: string;
  note: string;
  country: object[];
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  account_holder_name: string;
  paypal_id: string;
  address: string;
  pincode: string;
};

type IProps = {
  initialValues?: Withdraw | null;
};

export default function CreateOrUpdateWithdrawForm({ initialValues }: IProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;
  const { data: myData } = useMeQuery();

  const { price: shopBalance } = usePrice({
    amount: myData?.shops[0]?.balance?.current_balance! || 0,
  });
  const { data: allCountries, error, isLoading } = useCountriesQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(withdrawValidationSchema),
  });

  const { mutate: createWithdraw, isLoading: creating } =
    useCreateWithdrawMutation();

  const onSubmit = (values: FormValues) => {
    const input = {
      amount: +values.amount,
      shop_id: Number(shopId),
      details: values.details,
      payment_method: values.payment_method?.value,
      country: values.country?.value,
      note: values.note,
      bank_name:
        values.payment_method.value === 'bank' ? values.bank_name : undefined,
      ifsc_code:
        values.payment_method.value === 'bank' ? values.ifsc_code : undefined,
      account_number:
        values.payment_method.value === 'bank'
          ? values.account_number
          : undefined,
      account_holder_name:
        values.payment_method.value === 'bank'
          ? values.account_holder_name
          : undefined,
      paypal_id:
        values.payment_method.value === 'paypal' ? values.paypal_id : undefined,
      address: values.address,
      pincode: values.pincode,
    };
    console.log('input data', input);

    createWithdraw(
      { ...input },
      {
        onError: (error: any) => {
          const { data, status } = error?.response;
          if (status === 500) {
            setErrorMessage(error?.response?.data?.message);
            animateScroll.scrollToTop();
          } else if (status === 422) {
            const errorMessage: any = Object.values(data).flat();
            toast.error(errorMessage[0]);
          } else {
            toast.error(t(`common:${error?.response?.data.message}`));
          }
        },
      },
    );
  };

  // Watch payment method to conditionally render fields
  const paymentMethod = watch('payment_method')?.value;

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t('form:error-insufficient-balance')}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap w-full my-5 sm:my-8">
          {/* <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:withdraw-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          /> */}

          <Card className="w-full sm:w-8/12 md:w-full">
            <Label>{t('Address')}</Label>
            <Input
              {...register('address')}
              placeholder="Enter your address"
              error={t(errors.address?.message!)}
              variant="outline"
              className="mb-5"
            />

            <div className="flex flex-row justify-between max-md:flex-wrap">
              <div className="w-[45%] max-md:w-full mb-5">
                <Label>{t('Select Country')}</Label>

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      placeholder="Select country"
                      control={control}
                      className="mb-5"
                      options={allCountries?.map((country: any) => ({
                        label: country.name.common,
                        value: country.cca2,
                      }))}
                      error={t(errors.country?.values?.message!)} // Display the error message
                    />
                  )}
                />
                {errors.country && (
                  <ValidationError message={t(errors.country?.message)} />
                )}
              </div>
              <div className="flex flex-col max-md:w-full w-[45%]">
                <Label className="">{t('pincode')}</Label>
                <Input
                  {...register('pincode')}
                  placeholder="Enter your pincode"
                  error={t(errors.pincode?.message!)}
                  variant="outline"
                  className="mb-5 w-full"
                />
              </div>
            </div>
            <Label>
              {t('form:input-label-amount')}
              <span className="ml-0.5 text-red-500">*</span>
              <span className="text-xs text-body">
                ({t('common:text-available-balance')}:
                <span className="font-bold text-accent">{shopBalance}</span>)
              </span>
            </Label>
            <Input
              {...register('amount')}
              error={t(errors.amount?.message!)}
              placeholder="Enter amount"
              variant="outline"
              className="mb-5"
            />
            <div className="w-[45%] max-md:w-full mb-5">
              <Label>
                {t('form:input-label-payment-method')}
                <span className="ml-0.5 text-red-500">*</span>
              </Label>
              <SelectInput
                name="payment_method"
                placeholder="Select payment method"
                control={control}
                options={[
                  { value: 'paypal', label: t('Paypal') },
                  { value: 'bank', label: t('Bank transfer') },
                ]}
                error={t(errors.payment_method?.message!)} // Display errors correctly
                className="mb-5 border rounded-md p-2 w-full"
              />
              {errors.payment_method && (
                <ValidationError message={t(errors.payment_method?.message)} />
              )}
            </div>
            {/* Conditional rendering for PayPal */}
            {paymentMethod === 'paypal' && (
              <>
                <Label>{t('Paypal id:')}</Label>
                <Input
                  {...register('paypal_id')}
                  error={t(errors.paypal_id?.message!)}
                  placeholder="Enter your paypal id"
                  variant="outline"
                  className="mb-5"
                  required
                />
              </>
            )}

            {/* Conditional rendering for Bank details */}
            {paymentMethod === 'bank' && (
              <>
                <Label>{t('form:input-label-bank-name')}</Label>
                <Input
                  {...register('bank_name')}
                  error={t(errors.bank_name?.message!)}
                  placeholder="Enter your bank name"
                  variant="outline"
                  className="mb-5"
                  required
                />
                <Label>{t('IFSC code')}</Label>
                <Input
                  {...register('ifsc_code')}
                  error={t(errors.ifsc_code?.message!)}
                  placeholder="Enter your IFSC code"
                  variant="outline"
                  className="mb-5"
                  required
                />
                <Label>{t('form:input-label-account-number')}</Label>
                <Input
                  {...register('account_number')}
                  error={t(errors.account_number?.message!)}
                  placeholder="Enter your account number"
                  variant="outline"
                  className="mb-5"
                  required
                />
                <Label>{t('form:input-label-account-holder-name')}</Label>
                <Input
                  {...register('account_holder_name')}
                  error={t(errors.account_holder_name?.message!)}
                  placeholder="Enter your account holder name"
                  variant="outline"
                  className="mb-5"
                  required
                />
              </>
            )}

            <TextArea
              label={t('form:input-label-details')}
              {...register('details')}
              variant="outline"
              className="mb-5"
            />
            <TextArea
              label={t('form:input-label-note')}
              {...register('note')}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        <StickyFooterPanel className="z-0">
          <div className="text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="text-sm me-4 md:text-base"
                type="button"
              >
                {t('form:button-label-back')}
              </Button>
            )}
            <Button
              loading={creating}
              disabled={creating}
              className="text-sm md:text-base"
            >
              {initialValues
                ? t('form:button-label-update-withdraw')
                : t('form:button-label-add-withdraw')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
