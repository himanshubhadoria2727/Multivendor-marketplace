import Card from '@/components/common/card';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import Loader from '@/components/ui/loader/loader';
import ValidationError from '@/components/ui/form-validation-error';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SelectInput from '@/components/ui/select-input';
import ShopLayout from '@/components/layouts/shop';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import {
  useDownloadInvoiceMutation,
  useUpdateOrderMutation,
} from '@/data/order';
import { useOrderQuery } from '@/data/order';
import { Attachment, OrderStatus, PaymentStatus } from '@/types';
import { DownloadIcon } from '@/components/icons/download-icon';
import OrderViewHeader from '@/components/order/order-view-header';
import { ORDER_STATUS } from '@/utils/order-status';
import OrderStatusProgressBox from '@/components/order/order-status-progress-box';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import { useFormatPhoneNumber } from '@/utils/format-phone-number';
import { useState } from 'react';
import DetailsModal from '../orderDetails';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { ArrowDown } from '@/components/icons/arrow-down';
import { url } from 'inspector';
import TextArea from '@/components/ui/text-area';

type FormValues = {
  order_status: any;
};
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { locale, query } = useRouter();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: query?.shop as string,
  });
  const shopId = shopData?.id!;
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const {
    order,
    isLoading: loading,
    error,
  } = useOrderQuery({ id: query.orderId as string, language: locale! });
  console.log('order is amdmin', order);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});

  const handleOpenModal = (item: any) => {
    console.log('item', item);
    // Assume record.details contains the necessary details
    setModalDetails(item?.pivot);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalDetails({});
  };
  console.log('query', query.orderId);
  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: query.orderId as string,
      language: locale!,
      isRTL,
    },
    { enabled: false },
  );

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: order?.order_status ?? '' },
  });

  async function handleDownloadInvoice() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'order-invoice');
      a.click();
    }
  }

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      id: order?.id as string,
      order_status: order_status?.status as string,
    });
  };
  const handleUpdateStatus = (updated_status: string) => {
    updateOrder({
      id: order?.id as string,
      order_status: updated_status as string,
    });
  };

  const handleSubmittedLink = (updated_status: string, url: string) => {
    updateOrder({
      id: order?.id as string,
      order_status: updated_status as string,
      url: url,
    });
  };
  const [liveLink, setLiveLink] = useState('');

  const { price: subtotal } = usePrice(
    order && {
      amount: order?.amount!,
    },
  );
  const { price: total } = usePrice(
    order && {
      amount: order?.paid_total!,
    },
  );
  const { price: discount } = usePrice(
    order && {
      amount: order?.discount!,
    },
  );
  const { price: delivery_fee } = usePrice(
    order && {
      amount: order?.delivery_fee!,
    },
  );
  const { price: sales_tax } = usePrice(
    order && {
      amount: order?.sales_tax!,
    },
  );

  const phoneNumber = useFormatPhoneNumber({
    customer_contact: order?.customer_contact as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

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
        <Button onClick={() => handleOpenModal(pivot)}>View Details</Button>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'pivot',
      key: 'pivot',
      align: alignRight,
      render: function Render(pivot: any) {
        const { price } = usePrice({
          amount: Number(pivot?.subtotal),
        });
        return <span>{price}</span>;
      },
    },
  ];

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <div>
      <Card>
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <OrderViewHeader order={order} wrapperClassName="px-8 py-4" />
        </div>

        <div className="flex max-md:flex-col">
          <div className="flex w-full max-md:w-full">
            {/* Conditionally render input and button based on order_status */}
            {order?.order_status === 'order-accepted' ||
            order?.order_status === 'order-improvement' ? (
              <div className="flex flex-col w-full mt-4">
                <span className="flex flex-row mt-4">
                  <Label className="text-base text-green-700 underline">
                    Please submit the live link below
                  </Label>
                  <span className="ml-2 mt-1">
                    <ArrowDown />
                  </span>
                </span>
                <div className="flex w-full content-baseline items-center gap-4">
                  <Input
                    name="url"
                    className="w-full "
                    value={liveLink}
                    onChange={(event) => setLiveLink(event.target.value)}
                    // label="Provide the submission"
                  />
                  <Button
                    className="w-30 mt-2 bg-blue-500"
                    onClick={() =>
                      handleSubmittedLink('order-submitted', liveLink)
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            ) : (
              ''
            )}
            {order?.order_status === 'order-completed' ||
            order?.order_status === 'order-submitted' ||
            order?.order_status === 'order-submitted' ? (
              <div className="flex flex-col w-full mt-4">
                <span className="flex flex-row mt-4">
                  <Label className="text-base text-green-700 underline">
                    Live link
                  </Label>
                  <span className="ml-2 mt-1">
                    <ArrowDown />
                  </span>
                </span>
                {/* <div className="flex w-[48%] content-baseline items-center gap-4"> */}
                  <Input
                    name="url"
                    className="w-full md:w-200%"
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
                {/* </div> */}
              </div>
            ) : (
              ''
            )}
          </div>
          {order?.order_status === OrderStatus.WAITING && (
            <Button
              onClick={() => handleUpdateStatus('order-accepted')}
              className="mb-5 bg-blue-500 ltr:ml-auto flex-start rtl:mr-auto"
            >
              {t('Approve')}
            </Button>
          )}
          <div className="flex flex-col relative w-full mt-10 max-md:mt-5 mb-5">
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleDownloadInvoice();
              }}
              className="bg-blue-500 ltr:ml-auto rtl:mr-auto"
            >
              <DownloadIcon className="h-4 w-4 me-3" />
              {t('common:text-download')} {t('common:text-invoice')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center lg:flex-row">
          {/* <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
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
          /> */}
        </div>

        <div className="my-5 flex items-center justify-center lg:my-10">
          <OrderStatusProgressBox
            orderStatus={order?.order_status as OrderStatus}
            paymentStatus={order?.payment_status as PaymentStatus}
          />
        </div>

        <div className="mb-10">
          <div className="flex flex-col space-y-2 border-t-4 border-double border-border-200 px-4 py-4">
            {/* <div className="flex items-center justify-between font-semibold text-black">
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
            </div> */}
            <div className="space-y-4">
              {order?.products[0]?.pivot?.title && (
                <div>
                  <Label className="text-base text-accent-700">Title</Label>
                  <Input
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.title}
                    name={''}
                  />
                </div>
              )}

              {order?.products[0]?.pivot?.ancor && (
                <div>
                  <Label className="text-base text-accent-700">Anchor</Label>
                  <Input
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.ancor}
                    name={''}
                  />
                </div>
              )}

              {order?.products[0]?.pivot?.postUrl && (
                <div>
                  <Label className="text-base text-accent-700">Post URL</Label>
                  <Input
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.postUrl}
                    name={''}
                  />
                </div>
              )}

              {order?.products[0]?.pivot?.link_url && (
                <div>
                  <Label className="text-base text-accent-700">Link URL</Label>
                  <Input
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.link_url}
                    name={''}
                  />
                </div>
              )}

              {order?.products[0]?.pivot?.content && (
                <div>
                  <Label className="text-base text-accent-700">Content</Label>
                  <TextArea
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.content}
                    name={''}
                  />
                </div>
              )}
              {order?.products[0]?.pivot?.selectedNiche && (
                <div>
                  <Label className="text-base text-accent-700">
                    Select Niche
                  </Label>
                  <Input
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.selectedNiche}
                    name={''}
                  />
                </div>
              )}

              {order?.products[0]?.pivot?.selectedForm && (
                <div>
                  <Label className="text-base text-accent-700">
                    Select Service
                  </Label>
                  <Input
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.selectedForm}
                    name={''}
                  />
                </div>
              )}
              {order?.products[0]?.pivot?.instructions && (
                <div>
                  <Label className="text-base text-accent-700">
                    Instructions
                  </Label>
                  <TextArea
                    className="w-full mt-2"
                    value={order?.products[0]?.pivot?.instructions}
                    name={''}
                  />
                </div>
              )}
              {order?.products[0]?.pivot?.file && (
                <div>
                  <Label className="text-base text-accent-700">
                    Attached File
                  </Label>
                  <div className="mt-2 flex items-center space-x-4">
                    {/* Display file name */}
                    <span>{order?.products[0]?.pivot?.file}</span>

                    {/* Button to download file */}
                    <a
                      href={order?.products[0]?.pivot?.file} // URL of the file
                      download={order?.products[0]?.pivot?.file} // Name of the file
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
OrderDetailsPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
OrderDetailsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
