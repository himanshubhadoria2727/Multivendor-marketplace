import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

export const productValidationSchema = yup.object().shape({
  name: yup
    .string().url('Please enter a valid URL').required('Website name is required'),
  // sku: yup.string().nullable().required('form:error-sku-required'),
  price: yup
    .number()
    .typeError('form:error-price-must-number')
    .min(0)
    .max(9999)
    .required('form:error-price-required'),
  domain_authority: yup
    .number()
    .typeError('Domian authority must be a number')
    .min(0)
    .max(100)
    .required('Domain authority is required'),
  domain_rating: yup
    .number()
    .typeError('Domian Rating must be a number')
    .min(0)
    .max(100)
    .required('Domain rating is required'),

  word_count: yup
    .number()
    .typeError('Word count must be a number')
    .integer('Word count must be an integer')
    .min(1, 'Word count must be at least 1')
    .required('Word count is required'),

  tat: yup
    .number()
    .typeError('Tat must be a number')
    .integer('Tat must be an integer')
    .min(1, 'Tat must be at least 1')
    .required('Tat is required'),

  spam_score: yup
    .number()
    .typeError('Spam score must be a number')
    .min(0)
    .max(100)
    .required('Spam score is required'),
  organic_traffic: yup
    .number()
    .typeError('Organic traffic must be a number')
    .min(0)
    .required('Organic traffic is required'),
  // quantity: yup.number().when('boundary', {
  //   is: (value: boolean) => value,
  //   then: (schema) => schema.notRequired(),
  //   otherwise: (schema) =>
  //     schema
  //       .transform((value) => (isNaN(value) ? undefined : value))
  //       .typeError('form:error-quantity-must-number')
  //       .positive('form:error-quantity-must-positive')
  //       .integer('form:error-quantity-must-integer')
  //       .required('form:error-quantity-required'),
  // }),
  other_guidelines: yup.string().required('Other guidelines are required'),
  domain_name: yup.string().required('form:error-domain-name-required'),
  verify_domain: yup.string().nullable('form:error-domain-name-required'),
  // niche_price: yup.number().required('Niche price is a required'),
  type: yup.object().nullable('form:error-type-required'),
  // status: yup.string().nullable().required('form:error-status-required'),
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
      domain_authority: yup
        .number()
        .typeError('Authority must be a number')
        .positive('must be positive')
        .max(100)
        .required('Domain authority is required'),
      domain_rating: yup
        .number()
        .typeError('Domain rating must be a number')
        .positive('must be positive')
        .max(100)
        .required('Domain rating is required'),
      niche_price: yup
        .number()
        .typeError('Niche price must be a number')
        .positive('must be positive')
        .required('Niche price is required'),
      organic_traffic: yup
        .number()
        .typeError('Organic Traffic must be a number')
        .positive('must be positive')
        .required('form:error-price-required'),
      spam_score: yup
        .number()
        .typeError('Spam score must be a number')
        .positive('must be positive')
        .max(100)
        .required('Spam score is required'),
      word_count: yup
        .number()
        .typeError('Word count must be a number')
        .positive('must be positive')
        .max(1000)
        .required('Word count is required'),
      tat: yup
        .number()
        .typeError('Tat must be a number')
        .positive('must be positive')
        .max(100)
        .required('Tat is required'),
      countries: yup
        .object()
        .shape({
          value: yup.string().required('Country value is required'),
          label: yup.string().required('Country label is required'),
        })
        .required('Country is required'),
      link_validity: yup
        .object()
        .shape({
          value: yup.string().required('Validity value is required'),
          label: yup.string().required('Validity label is required'),
        })
        .required('Country is required'),
      link_counts: yup
        .object()
        .shape({
          value: yup.string().required('Link value is required'),
          label: yup.string().required('Link label is required'),
        })
        .required('Country is required'),
      sponsored_marked: yup
        .object()
        .shape({
          value: yup.string().required('Sponsered value is required'),
          label: yup.string().required('Spons label is required'),
        })
        .required('Country is required'),
      languages: yup
        .object()
        .shape({
          value: yup.string().required('Language value is required'),
          label: yup.string().required('Language label is required'),
        })
        .required('Language is required'),
      link_type: yup
        .object()
        .shape({
          value: yup.string().required('Language value is required'),
          label: yup.string().required('Language label is required'),
        })
        .required('Language is required'),
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
      // Adding your additional fields below
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
