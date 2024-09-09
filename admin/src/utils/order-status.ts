import { PaymentStatus } from '@/types';

export const ORDER_STATUS = [
  { name: 'text-order-pending', status: 'order-pending', serial: 1   },
  // { name: 'text-order-processing', status: 'order-processing', serial: 2 },
  { name: 'Waiting for approval', status: 'order-waiting-approval', serial: 2 },
  { name: 'Accepted', status: 'order-accepted', serial: 3 },
  { name: 'Submitted', status: 'order-submitted', serial: 4 },
  { name: 'Improvement', status: 'order-improvement', serial: 4 },
  { name: 'Completed', status: 'order-completed', serial: 5 },
  { name: 'Rejected', status: 'order-rejected', serial:5 },
  /** #### Pixer Only  */ 
  // { name: 'text-order-at-local-facility', status: 'order-at-local-facility', serial: 3, },
  // { name: 'text-order-out-for-delivery', status: 'order-out-for-delivery', serial: 4, },
  // { name: 'text-order-cancelled', status: 'order-cancelled', serial: 6 },
  // { name: 'text-order-refunded', status: 'order-refunded', serial: 6 },
  // { name: 'text-order-failed', status: 'order-failed', serial: 6 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {
  if ([PaymentStatus.SUCCESS, PaymentStatus.COD].includes(paymentStatus)) {
    console.log('order Status',orderStatus)

    return currentStatusIndex > 4
      ? [...orderStatus.slice(0, 4), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 6);
  }

  return currentStatusIndex > 4
    ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 5);
};
