import * as yup from 'yup';

export const contactUsFormSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  email: yup.string().email().required('Email is required.'),
  subject: yup.string().required('Subject is required.'),
  description: yup.string().required('Description is required.'),
});
export const ProductInputFieldSchema = yup.object().shape({
  postUrl: yup.string().url().required('Post Url is required.'),
  before_ancor: yup.string().required('This field is required.'),
  ancor: yup.string().required('Ancor Text is required.'),
  after_ancor: yup.string().required('This field is required.'),
  description: yup.string().required('Description is required.'),
});
