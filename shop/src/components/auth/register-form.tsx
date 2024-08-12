import * as yup from 'yup';
import type { SubmitHandler } from 'react-hook-form';
import type { RegisterUserInput, SocialLoginInput } from '@/types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import { useModalAction } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';
import client from '@/data/client';
import Button from '@/components/ui/button';
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import { useState } from 'react';
import useAuth from './use-auth';
import { useTranslation } from 'next-i18next';
import { setAuthCredentials } from '@/data/client/token.utils';
import { UserCredential } from 'firebase/auth';
import { signInWithGooglePopup } from 'firebase.utils';

const registerUserValidationSchema = yup.object().shape({
  name: yup.string().max(20).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function RegisterUserForm() {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth();
  let [serverError, setServerError] = useState<RegisterUserInput | null>(null);
  const { mutate } = useMutation(client.users.register, {
    onSuccess: (res) => {
      if (!res.token) {
        toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      authorize(res.token);
      closeModal();
    },
    onError: (err: any) => {
      setServerError(err.response.data);
    },
  });

  const { mutate: socialLogin, isLoading: socialLoginLoading } = useMutation(client.users.socail_login, {
    onSuccess: (data) => {
      if (!data.token) {
        toast.error(<b>{t('text-wrong-user-name-and-pass')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      console.log('login data', data);
      authorize(data.token);
      setAuthCredentials(data.token, data.permissions);
      closeModal();
    },
  });

  const logGoogleUser = async () => {
    try {
      const response: UserCredential = await signInWithGooglePopup();
      const token = await response._tokenResponse.oauthAccessToken; // Extracting the ID token
      console.log(response)
      // Assuming SocialLoginInput requires access_token and provider
      const socialLoginData: SocialLoginInput = {
        oauthAccessToken: token,
        provider: 'google', // Ensure this matches the expected provider in your backend
      };

      // Perform social login using mutate function
      socialLogin(socialLoginData);
      console.log('socialLoginData', socialLoginData)
    } catch (error) {
      console.error('Error during Google Sign-In', error);
      toast.error(t('text-something-went-wrong'));
    }
  };
  const onSubmit: SubmitHandler<RegisterUserInput> = (data) => {
    mutate(data);
  };

  return (
    <div className="bg-light px-6 pt-10 pb-8 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {t('text-welcome-back')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {t('text-create-an-account')}{' '}
              <button
                onClick={() => openModal('LOGIN_VIEW')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                {t('text-login')}
              </button>
            </div>
          </div>

          <Form<RegisterUserInput>
            onSubmit={onSubmit}
            validationSchema={registerUserValidationSchema}
            serverError={serverError}
            className="space-y-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  label="contact-us-name-field"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="contact-us-email-field"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Password
                  label="text-auth-password"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                >
                  {t('text-register')}
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
      <Button
        onClick={logGoogleUser}
        isLoading={socialLoginLoading}
        disabled={socialLoginLoading}
        className="flex items-center justify-center w-full px-4 py-2 mt-5 text-sm font-medium text-black-900 bg-white border border-gray-300 rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 lg:!mt-7"
      >
        <svg
          className="w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="800px"
          height="800px"
        >
          <path
            fill="#4285F4"
            d="M24 9.5c3.2 0 5.9 1.1 8.1 3.1l6-6C34.4 3.5 29.5 1.5 24 1.5 14.8 1.5 7.2 7.9 4.5 16.2l7.8 6.1C14.1 15.8 18.6 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.5 24c0-1.7-.2-3.5-.5-5H24v10h12.9C35.5 33.5 30 36.5 24 36.5c-5.4 0-10-3.2-12.2-7.9l-7.8 6.1C8.1 41.1 15.6 46.5 24 46.5c12.7 0 22.5-10.3 22.5-22.5z"
          />
          <path
            fill="#FBBC05"
            d="M11.8 28.6C11.2 26.9 11 25 11 23s.2-3.9.8-5.6l-7.8-6.1C2.5 15.2 1.5 18.5 1.5 23s1 7.8 2.8 11.7l7.5-6.1z"
          />
          <path
            fill="#EA4335"
            d="M24 46.5c5.9 0 11.2-2 15.1-5.4l-7.3-6.3c-2.1 1.4-4.7 2.2-7.8 2.2-5.4 0-10-3.2-12.2-7.9l-7.8 6.1C8.1 41.1 15.6 46.5 24 46.5z"
          />
          <path fill="none" d="M1.5 1.5h45v45h-45z" />
        </svg>
        Sign up with Google
      </Button>

    </div>
  );
}
