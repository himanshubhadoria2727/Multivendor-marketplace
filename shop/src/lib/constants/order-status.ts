import { PaymentStatus } from '@/types';

// export const ORDER_STATUS = [
//   { name: 'Order Pending', status: 'order-pending', serial: 1 },
//   { name: 'Order Processing', status: 'order-processing', serial: 2 },
//   {
//     name: 'Order At Local Facility',
//     status: 'order-at-local-facility',
//     serial: 3,
//   },
//   {
//     name: 'Order Out For Delivery',
//     status: 'order-out-for-delivery',
//     serial: 4,
//   },
//   { name: 'Order Completed', status: 'order-completed', serial: 5 },
//   { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
//   { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
//   { name: 'Order Failed', status: 'order-failed', serial: 5 },
// ];

export const ORDER_STATUS = [
  { name: 'Order Pending', status: 'order-pending', serial: 1 },
  { name: 'Waiting for publisher approval', status: 'order-waiting-approval', serial: 2 },
  { name: 'Accepted by publisher', status: 'order-accepted', serial: 3 },
  { name: 'Submitted For approval from advertiser', status: 'order-submitted', serial: 4 },
  { name: 'Improvement', status: 'order-improvement', serial: 4 },
  { name: 'Order Completed', status: 'order-completed', serial: 5 },
  { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
  { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
  { name: 'Order Failed', status: 'order-failed', serial: 5 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {
  if ([PaymentStatus.SUCCESS].includes(paymentStatus)) {
    return currentStatusIndex > 1
      ? [...orderStatus.slice(0, 3), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 2);
  }

  return currentStatusIndex > 1
    ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 2);
};
