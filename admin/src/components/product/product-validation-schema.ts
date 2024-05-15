import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

export const productValidationSchema = yup.object().shape({
  name: yup
    .string().required('Website name is required'),
  sku: yup.string().nullable().required('form:error-sku-required'),
  price: yup
    .number()
    .typeError('form:error-price-must-number')
    .min(0)
    .required('form:error-price-required'),
  domain_authority: yup
    .number()
    .typeError('Domian authority must be a number')
    .min(0)
    .max(100)
    .required('Domain authority is required'),
  quantity: yup.number().when('boundary', {
    is: (value: boolean) => value,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError('form:error-quantity-must-number')
        .positive('form:error-quantity-must-positive')
        .integer('form:error-quantity-must-integer')
        .required('form:error-quantity-required'),
  }),
  domain_name: yup.string().required('form:error-domain-name-required'),
  domain_rating: yup.string().required('Domain rating is a required'),
  organic_traffic: yup.string().required('Organic traffic is a required'),
  spam_score: yup.string().required('Spam score is a required'),
  languages: yup.string().required('Languauge is required'),
  // countries: yup.object().shape({
  //   value: yup.string().required('Country value is required'),
  //   label: yup.string().required('Country label is required'),
  // }).required('Country is required'),
  type: yup.object().nullable().required('form:error-type-required'),
  status: yup.string().nullable().required('form:error-status-required'),
  variation_options: yup.array().of(
    yup.object().shape({
      price: yup
        .number()
        .typeError('form:error-price-must-number')
        .positive('form:error-price-must-positive')
        .required('form:error-price-required'),
      sale_price: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .lessThan(yup.ref('price'), 'Sale Price should be less than ${less}')
        .positive('form:error-sale-price-must-positive')
        .nullable(),
      domain_authority:yup
        .number()
        .typeError('Authority must be a number')
        .positive('form:error-price-must-positive')
        .required('form:error-price-required'),
      // domain_rating: yup
      //   .number()
      //   .typeError('Domain rating must be a number')
      //   .positive('form:error-price-must-positive')
      //   .required('form:error-price-required'),
      // organic_traffic: yup
      //   .number()
      //   .typeError('Organic Traffic must be a number')
      //   .positive('form:error-price-must-positive')
      //   .required('form:error-price-required'),
      // spam_score:yup
      // .number()
      //   .typeError('Spam score must be a number')
      //   .positive('form:error-price-must-positive')
      //   .required('form:error-price-required'),
      // countries:yup
      // .string()
      //   .required("this is require"),
      quantity: yup
        .number()
        .typeError('form:error-quantity-must-number')
        .positive('form:error-quantity-must-positive')
        .integer('form:error-quantity-must-integer')
        .required('form:error-quantity-required'),
      sku: yup.string().required('form:error-sku-required'),
      is_digital: yup.boolean(),
      digital_file_input: yup.object().when('is_digital', {
        is: true,
        then: () =>
          yup
            .object()
            .shape({
              id: yup.string().required(),
            })
            .required('Degigtal File is required'),
        otherwise: () =>
          yup
            .object()
            .shape({
              id: yup.string().notRequired(),
              original: yup.string().notRequired(),
            })
            .notRequired()
            .nullable(),
      }),
    }),
  ),
  is_digital: yup.boolean(),
  digital_file_input: yup.object().when('is_digital', {
    is: true,
    then: () =>
      yup.object().shape({
        id: yup.string().required(),
      }),
    otherwise: () =>
      yup
        .object()
        .shape({
          id: yup.string().notRequired(),
          original: yup.string().notRequired(),
        })
        .notRequired()
        .nullable(),
  }),
  video: yup.array().of(
    yup.object().shape({
      url: yup.string().required('Video URL is required'),
    }),
  ),
  description: yup
    .string()
    .max(
      MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR,
      'form:error-description-maximum-title',
    ),
  // image: yup
  //   .mixed()
  //   .nullable()
  //   .required('A file is required')
  //   .test(
  //     'FILE_SIZE',
  //     'Uploaded file is too big.',
  //     (value) => !value || (value && value.size <= 1024 * 1024)
  //   )
  //   .test(
  //     'FILE_FORMAT',
  //     'Uploaded file has unsupported format.',
  //     (value) =>
  //       !value || (value && SUPPORTED_IMAGE_FORMATS.includes(value?.type))
  //   ),
});
