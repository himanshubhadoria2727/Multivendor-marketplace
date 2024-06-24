import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout, UpdateProfileInput } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import { ReactPhone } from '@/components/ui/forms/phone-input';
import Button from '@/components/ui/button';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useMe } from '@/data/user';
import pick from 'lodash/pick';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import Uploader from '@/components/ui/forms/uploader';
import * as yup from 'yup';
import Layout from '@/layouts/_layout';

const profileValidationSchema = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  profile: yup.object().shape({
    id: yup.string(),
    bio: yup.string(),
    contact: yup.string(),
    avatar: yup
      .object()
      .shape({
        id: yup.string(),
        thumbnail: yup.string(),
        original: yup.string(),
      })
      .optional()
      .nullable(),
  }),
});
const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { me } = useMe();
  const { mutate, isLoading } = useMutation(client.users.update, {
    onSuccess: () => {
      toast.success(<b>{t('text-profile-page-success-toast')}</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
    onError: (error) => {
      toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
        className: '-mt-10 xs:mt-0',
      });
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
  const onSubmit: SubmitHandler<UpdateProfileInput> = (data) => mutate(data);

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col p-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <h1 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white sm:mb-6">
        {t('text-profile-page-title')}
      </h1>
      <Form<UpdateProfileInput>
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: pick(me, [
            'id',
            'name',
            'profile.id',
            'profile.contact',
            'profile.bio',
            'profile.avatar',
          ]),
        }}
        validationSchema={profileValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, control, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              <Controller
                name="profile.avatar"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <div className="sm:col-span-2">
                    <span className="block cursor-pointer pb-2.5 font-normal text-gray-600 dark:text-gray-300">
                      {t('text-profile-avatar')}
                    </span>
                    <div className="text-xs">
                      <Uploader {...rest} multiple={false} />
                    </div>
                  </div>
                )}
              />
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:space-x-5 space-y-5 sm:space-y-0 items-center">
                <div className="flex-1">
                  <label className="block cursor-pointer font-bold pb-2.5 text-gray-600 dark:text-gray-300">
                    {t('Name')}
                  </label>
                  <Input
                    label={''} {...register('name')}
                    error={errors.name?.message}
                    className="border-gray-300 dark:border-gray-700" />
                </div>
                <div className="flex-1">
                  <label className="block cursor-pointer font-bold pb-2.5 text-gray-600 dark:text-gray-300">
                    {t('text-profile-contact')}
                  </label>
                  <Controller
                    name="profile.contact"
                    control={control}
                    render={({ field }) => (
                      <ReactPhone country="IND" {...field} />
                    )}
                  />
                  {errors.profile?.contact?.message && (
                    <span
                      role="alert"
                      className="block pt-2 text-xs text-red-600 dark:text-red-400"
                    >
                      {t('contact field is required')}
                    </span>
                  )}
                </div>
              </div>

              <Textarea
                label={t('text-profile-bio')}
                {...register('profile.bio')}
                error={errors.profile?.bio?.message && t('bio field is required')}
                className="sm:col-span-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </fieldset>


            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                onClick={() =>
                  reset({
                    id: me?.id,
                    name: '',
                    profile: {
                      id: me?.profile?.id,
                      avatar: null,
                      bio: '',
                      contact: '',
                    },
                  })
                }
                disabled={isLoading}
                variant="outline"
                className="flex-1 lg:flex-none border-gray-300 dark:border-gray-700"
              >
                {t('text-cancel')}
              </Button>
              <Button
                className="flex-1 lg:flex-none bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-200"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {t('text-save-changes')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </motion.div>
  );
};

ProfilePage.authorization = true;
ProfilePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default ProfilePage;
