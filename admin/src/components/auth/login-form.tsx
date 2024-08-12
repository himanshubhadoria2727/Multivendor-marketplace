import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Link from '@/components/ui/link';
import Form from '@/components/ui/forms/form';
import { Routes } from '@/config/routes';
import { useLogin } from '@/data/user';
import type { LoginInput, SocialLoginInput } from '@/types';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Router from 'next/router';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { userClient } from '@/data/client/user';
import type { UserCredential } from 'firebase/auth';
import { signInWithGooglePopup } from 'firebase.utils';
import { useModalAction } from '../ui/modal/modal.context';
import useAuth from '@/components/auth/use-auth';

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
});

const LoginForm = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: login, isLoading, error } = useLogin();
  const { authorize } = useAuth();
  const { mutate: socialLogin, isLoading: socialLoginLoading } = useMutation(userClient.socail_login, {
    onSuccess: (data) => {
      if (!data.token) {
        toast.error(<b>{t('text-wrong-user-name-and-pass')}</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      console.log('login data', data);
      authorize(data.token);
      setAuthCredentials(data?.token, data?.permissions, data?.role);
      Router.push('/')
    },
  });

  const logGoogleUser = async () => {
    try {
      const response: UserCredential = await signInWithGooglePopup();
      const token = response._tokenResponse.oauthAccessToken; // Extracting the ID token
      console.log(response)
      // Assuming SocialLoginInput requires access_token and provider
      const socialLoginData: SocialLoginInput = {
        oauthAccessToken: token,
        userName:response.user.displayName,
        provider: 'google', // Ensure this matches the expected provider in your backenda
      };

      // Perform social login using mutate function
      socialLogin(socialLoginData);
      console.log('socialLoginData', socialLoginData)
    } catch (error) {
      console.error('Error during Google Sign-In', error);
      toast.error(t('text-something-went-wrong'));
    }
  };


  function onSubmit({ email, password }: LoginInput) {
    login(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          if (data?.token) {
            if (hasAccess(allowedRoles, data?.permissions)) {
              setAuthCredentials(data?.token, data?.permissions, data?.role);

              Router.push(Routes.dashboard);


            }
            else setErrorMessage('form:error-enough-permission');
          } else {
            setErrorMessage('form:error-credential-wrong');
          }
        },
        onError: () => { },
      }
    );
  }

  return (
    <>
      <Form<LoginInput> validationSchema={loginFormSchema} onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors?.email?.message!)}
            />
            <PasswordInput
              label={t('form:input-label-password')}
              forgotPassHelpText={t('form:input-forgot-password-label')}
              {...register('password')}
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-4"
              forgotPageLink={Routes.forgotPassword}
            />
            <Button className="w-full" loading={isLoading} disabled={isLoading}>
              {t('form:button-label-login')}
            </Button>
          </>
        )}
      </Form>
      <Button
              onClick={logGoogleUser}
              loading={socialLoginLoading}
              disabled={socialLoginLoading}
              className="flex items-center justify-center w-full px-4 py-2 mt-5 text-sm font-medium text-black bg-white border border-gray-300 rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 lg:!mt-7"
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
              <p className='text-black'>Sign in with Google</p>
            </Button>
            <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
              <hr className="w-full" />
              <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
                {t('common:text-or')}
              </span>
            </div>

            <div className="text-center text-sm text-body sm:text-base">
              {t('form:text-no-account')}{' '}
              <Link
                href={Routes.register}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {t('form:link-register-shop-owner')}
              </Link>
            </div>
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
};

export default LoginForm;

{
  /* {errorMsg ? (
          <Alert
            message={t(errorMsg)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMsg('')}
          />
        ) : null} */
}
