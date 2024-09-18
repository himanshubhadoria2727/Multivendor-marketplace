const StatusColor = (status: string) => {
  let bg_class = '';

  if (
    status?.toLowerCase() === 'order-pending' ||
    status?.toLowerCase() === 'pending' ||
    status?.toLowerCase() === 'payment-pending'
  ) {
    bg_class = 'bg-status-pending bg-opacity-10 text-status-pending';
  } else if (
    status?.toLowerCase() === 'waiting for approval' ||
    status?.toLowerCase() === 'order-waiting-approval'
  ) {
    bg_class = 'bg-yellow-200 bg-opacity-10 text-yellow-600'; // Customize color for "Waiting for approval"
  } else if (
    status?.toLowerCase() === 'accepted' ||
    status?.toLowerCase() === 'order-accepted'
  ) {
    bg_class = 'bg-green-200 bg-opacity-10 text-green-600'; // Customize color for "Accepted"
  } else if (
    status?.toLowerCase() === 'improvement' ||
    status?.toLowerCase() === 'order-improvement'
  ) {
    bg_class = 'bg-blue-200 bg-opacity-10 text-blue-600'; // Customize color for "Improvement"
  } else if (
    status?.toLowerCase() === 'submitted' ||
    status?.toLowerCase() === 'order-submitted'
  ) {
    bg_class = 'bg-teal-200 bg-opacity-10 text-teal-600'; // Customize color for "Submitted"
  } else if (
    status?.toLowerCase() === 'order-completed' ||
    status?.toLowerCase() === 'approved' ||
    status?.toLowerCase() === 'payment-success'
  ) {
    bg_class = 'bg-status-complete bg-opacity-10 text-status-complete';
  } else if (
    status?.toLowerCase() === 'order-rejected' ||
    status?.toLowerCase() === 'rejected' ||
    status?.toLowerCase() === 'payment-reversal'
  ) {
    bg_class = 'bg-status-canceled bg-opacity-10 text-status-canceled';
  } else if (
    status?.toLowerCase() === 'order-failed' ||
    status?.toLowerCase() === 'payment-failed'
  ) {
    bg_class = 'bg-status-failed bg-opacity-10 text-status-failed';
  } else if (status?.toLowerCase() === 'order-at-local-facility') {
    bg_class =
      'bg-status-out-for-delivery bg-opacity-10 text-status-out-for-delivery';
  } else if (status?.toLowerCase() === 'order-out-for-delivery') {
    bg_class =
      'bg-status-out-for-delivery bg-opacity-10 text-status-out-for-delivery';
  } else if (
    status?.toLowerCase() === 'order-refunded' ||
    status?.toLowerCase() === 'refunded' ||
    status?.toLowerCase() === 'payment-refunded'
  ) {
    bg_class = 'bg-rose-400 bg-opacity-10 text-status-pending';
  } else {
    bg_class = 'bg-accent bg-opacity-10 !text-accent';
  }

  return bg_class;
};

export default StatusColor;
