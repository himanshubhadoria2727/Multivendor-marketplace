import * as yup from 'yup';

export const contactUsFormSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  email: yup.string().email().required('Email is required.'),
  subject: yup.string().required('Subject is required.'),
  description: yup.string().required('Description is required.'),
});
export const ProductInputFieldSchemaLI = yup.object().shape({
  postUrl: yup.string().url().required('Post Url is required.'),
  ancor: yup.string().required('Ancor Text is required.'),
  link_url: yup.string().url().required('This field is required.'),
  instructions: yup.string().required('This field is required.'),
});
export const ProductInputFieldSchemaGL = yup.object().shape({
  title: yup.string().required('Post Url is required.'),
  ancor: yup.string().required('Ancor Text is required.'),
  link_url: yup.string().url().required('This field is required.'),
  content: yup.string().required('This field is required.'),
  instructions: yup.string().required('Description is required.'),
});
