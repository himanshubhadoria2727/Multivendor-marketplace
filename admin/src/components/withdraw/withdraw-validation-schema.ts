import * as yup from 'yup';

export const withdrawValidationSchema = yup.object().shape({
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters long'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[0-9]{5,6}$/, 'Invalid Pincode'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .min(50, 'Least withdrawal amount is 50')
    .required('Amount is required'),
  payment_method: yup.object().required('Payment method is required'),
  paypal_id: yup.string().when('payment_method', {
    is: 'paypal',
    then: yup.string().required('PayPal ID is required'),
  }),
  bank_name: yup.string().when('payment_method', {
    is: 'bank',
    then: yup.string().required('Bank name is required'),
  }),
  ifsc_code: yup.string().when('payment_method', {
    is: 'bank',
    then: yup
      .string()
      .required('IFSC code is required')
      .matches(/^[A-Za-z]{4}[0-9]{7}$/, 'Invalid IFSC code'),
  }),
  account_number: yup.string().when('payment_method', {
    is: 'bank',
    then: yup.string().required('Account number is required'),
  }),
  account_holder_name: yup.string().when('payment_method', {
    is: 'bank',
    then: yup.string().required('Account holder name is required'),
  }),
  details: yup.string().max(500, 'Details must be at most 500 characters'),
  note: yup.string().max(500, 'Note must be at most 500 characters'),
  country: yup.object().required('Country is required'),
});