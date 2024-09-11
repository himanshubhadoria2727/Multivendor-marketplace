import Card from '@/components/common/card';
import { DownloadIcon } from '@/components/icons/download-icon';
import Layout from '@/components/layouts/admin';
import OrderStatusProgressBox from '@/components/order/order-status-progress-box';
import OrderViewHeader from '@/components/order/order-view-header';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import ValidationError from '@/components/ui/form-validation-error';
import Loader from '@/components/ui/loader/loader';
import SelectInput from '@/components/ui/select-input';
import { Table } from '@/components/ui/table';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useCart } from '@/contexts/quick-cart/cart.context';
import {
  useDownloadInvoiceMutation,
  useOrderQuery,
  useUpdateOrderMutation,
} from '@/data/order';
import { NoDataFound } from '@/components/icons/no-data-found';
import { siteSettings } from '@/settings/site.settings';
import { Attachment, OrderStatus, PaymentStatus } from '@/types';
import { formatAddress } from '@/utils/format-address';
import { formatString } from '@/utils/format-string';
import { useIsRTL } from '@/utils/locals';
import { ORDER_STATUS } from '@/utils/order-status';
import usePrice from '@/utils/use-price';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowDown } from '@/components/icons/arrow-down';
import { useFormatPhoneNumber } from '@/utils/format-phone-number';
import DetailsModal from '../orderDetails';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import AdminLayout from '@/components/layouts/admin';

type FormValues = {
  order_status: any;
};
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});

  const handleOpenModal = (item:any) => {
    // Assume record.details contains the necessary details
    setModalDetails(item.pivot);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalDetails({});
  };
  const handleUpdateStatus = (updated_status: string) => {
    updateOrder({
      id: order?.id as string,
      order_status: updated_status as string,
    });
  };

  const handleSubmittedLink = (updated_status: string,url:string) => {
    updateOrder({
      id: order?.id as string,
      order_status: updated_status as string,
      url:url,
    });
  };

  const [liveLink,setLiveLink]= useState('');

  useEffect(() => {
    resetCart();
    // @ts-ignore
    resetCheckout();
  }, [resetCart, resetCheckout]);

  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const {
    order,
    isLoading: loading,
    error,
  } = useOrderQuery({ id: query.orderId as string, language: locale! });
  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: query.orderId as string,
      isRTL,
      language: locale!,
    },
    { enabled: false }
  );

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: order?.order_status ?? '' },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      id: order?.id as string,
      order_status: order_status?.status as string,
    });
  };
  const { price: subtotal } = usePrice(
    order && {
      amount: order?.amount!,
    }
  );

  const { price: total } = usePrice(
    order && {
      amount: order?.paid_total!,
    }
  );
  const { price: discount } = usePrice(
    order && {
      amount: order?.discount! ?? 0,
    }
  );
  const { price: delivery_fee } = usePrice(
    order && {
      amount: order?.delivery_fee!,
    }
  );
  const { price: sales_tax } = usePrice(
    order && {
      amount: order?.sales_tax!,
    }
  );
  const { price: sub_total } = usePrice({ amount: order?.amount! });
  const { price: shipping_charge } = usePrice({
    amount: order?.delivery_fee ?? 0,
  });
  const { price: wallet_total } = usePrice({
    amount: order?.wallet_point?.amount!,
  });

  const amountPayable: number =
    order?.payment_status !== PaymentStatus.SUCCESS
      ? order?.paid_total! - order?.wallet_point?.amount!
      : 0;

  const { price: amountDue } = usePrice({ amount: amountPayable });

  const totalItem = order?.products.reduce(
    // @ts-ignore
    (initial = 0, p) => initial + parseInt(p?.pivot?.order_quantity!),
    0
  );

  const phoneNumber = useFormatPhoneNumber({
    customer_contact: order?.customer_contact as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleDownloadInvoice() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'order-invoice');
      a.click();
    }
  }

  const columns = [
    {
      title: t('table:table-item-products'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: string, item: any) => (
        <div>
          <span>{name}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span>
        </div>
      ),
    },
    {
      title: t('View details'),
      key: 'action',
      align: alignRight,
      render: (text: any, pivot: any) => (
        <Button onClick={() => handleOpenModal(pivot)}><p className='text-xs'>Details</p></Button>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      render: function Render(pivot: any, item: any) {
        // const { price } = usePrice({
        //   amount: parseFloat(item.pivot.subtotal),
        // });
        return <span>${item.pivot.unit_price}</span>;
      },
    },
  ];

  // TODO : this area need to be checked in Pixer

  return (
    <div>
      <Card>
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <OrderViewHeader order={order} wrapperClassName="px-8 py-4" />
        </div>

        <div className="flex w-full mb-5">
          <Button
            onClick={handleDownloadInvoice}
            className="bg-blue-500 ltr:ml-auto rtl:mr-auto"
          >
            <DownloadIcon className="h-4 w-4 me-3" />
            {t('common:text-download')} {t('common:text-invoice')}
          </Button>
        </div>

        <div className="flex flex-col items-center lg:flex-row">
          <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
            {t('form:input-label-order-id')} - {order?.tracking_number}
          </h3>
          <Button
            className="h-8 w-25"
            onClick={() => handleOpenModal(order?.products[0])}
          >
            View Details
          </Button>
          <DetailsModal
            open={isModalVisible}
            onClose={handleCloseModal}
            details={modalDetails}
          />
          {order?.order_status === OrderStatus.WAITING && (
            <Button
              onClick={() => handleUpdateStatus('order-accepted')}
              className="mb-5 bg-blue-500 ltr:ml-auto rtl:mr-auto"
            >
              {t('Approve')}
            </Button>
          )}
        </div>

        <div className="my-5 flex items-center justify-center lg:my-10">
          <OrderStatusProgressBox
            orderStatus={order?.order_status as OrderStatus}
            paymentStatus={order?.payment_status as PaymentStatus}
          />
        </div>

        <div className="mb-10">
          <div className="flex flex-col space-y-2 border-t-4 border-double border-border-200 px-4 py-4">
            <div className="flex items-center justify-between font-semibold text-black">
              <span>{t('Site name')}</span>
              <span>{order?.products[0]?.name}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-black">
              <span>{t('Service type')}</span>
              {order?.products[0]?.isLinkInsertion==true?(
                <span>Link Insertion</span>
              ) : (
                <span>Guest Posting</span>
              )}
            </div>
            {/* Conditionally render input and button based on order_status */}
            {order?.order_status === 'order-accepted' || order?.order_status === 'order-improvement' ?(
              <div className='mt-4'>
                <span className='flex mt-4'>
                <Label className='text-base text-green-700 underline'>
                Please submit the live link below
              </Label>
              <span className='ml-2 mt-1'><ArrowDown/></span>
                </span>
              <div className="flex w-full content-baseline items-center gap-4">
                  <Input
                    name='url'
                    className="w-full"
                    value={liveLink}
                    onChange={(event) => setLiveLink(event.target.value)}
                    // label="Provide the submission"
                    />
                  <Button
                    className="w-30 mt-2 bg-blue-500"
                    onClick={() => handleSubmittedLink('order-submitted',liveLink)}
                  >
                    Submit
                  </Button>
                </div></div>
            ):('')}
            {order?.order_status === 'order-completed' || order?.order_status === 'order-submitted' || order?.order_status === 'order-submitted'? (
              <div className='mt-4'>
                <span className='flex mt-4'>
                <Label className='text-base text-green-700 underline'>
                Live link
              </Label>
              <span className='ml-2 mt-1'><ArrowDown/></span>
                </span>
              <div className="flex w-full content-baseline items-center gap-4">
                  <Input
                    name='url'
                    className="w-80"
                    value={order?.url}
                    // onChange={(event) => setLiveLink(event.target.value)}
                    // label="Provide the submission"
                    />
                  {/* <Button
                    className="w-30 mt-2 bg-blue-500"
                    onClick={() => handleSubmittedLink('order-submitted',liveLink)}
                  >
                    Submit
                  </Button> */}
                </div></div>
            ):('')}
          </div>
        </div>
      </Card>
    </div>
  );
}
OrderDetailsPage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
