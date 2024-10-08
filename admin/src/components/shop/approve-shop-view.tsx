import { Form } from '@/components/ui/form/form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';
import { useApproveShopMutation } from '@/data/shop';

type FormValues = {
  admin_commission_rate: number;
};

const ApproveShopView = () => {
  const { t } = useTranslation();
  const { mutate: approveShopMutation, isLoading: loading } =
    useApproveShopMutation();

  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction();

  function onSubmit({ admin_commission_rate }: FormValues) {
    approveShopMutation({
      id: shopId as string,
      admin_commission_rate: Number(admin_commission_rate),
    });
    closeModal();
  }

  return (
    <Form<FormValues> onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
          <Input
            label={t('form:input-label-admin-commission-rate')}
            {...register('admin_commission_rate', {
              required: 'You must need to set your commission rate',
            })}
            defaultValue="20"
            variant="outline"
            className="mb-4"
            error={t(errors.admin_commission_rate?.message!)}
          />
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="ms-auto"
          >
            {t('form:button-label-submit')}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default ApproveShopView;
