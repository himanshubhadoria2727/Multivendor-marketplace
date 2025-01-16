import { useRouter } from 'next/router';
import { useMe } from '@/data/user';
import LoginUserForm from '@/components/auth/login-form';
import { useTranslation } from 'next-i18next';
import { PageLoader } from '@/components/ui/loader/spinner/spinner';
import lottieAnimation from 'lottieAnimation.json'; // Path to the JSON file
import Lottie from 'lottie-react';

function UnAuthorizedView() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className="relative grid h-screen grid-cols-1 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-white to-indigo-500 dark:from-gray-800 dark:via-gray-900 dark:to-black px-4 py-5 md:grid-cols-2 md:px-8 lg:px-16">
      {/* Left Side: Image/Animation */}
      <div className="hidden md:flex flex-col items-center justify-center">
        {/* Example animation or image */}
        <Lottie animationData={lottieAnimation} loop autoplay />
      </div>

      {/* Right Side: Login Form */}
      <div className="relative mx-auto mb-20 w-full max-w-[445px] overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 dark:shadow-lg lg:max-w-[478px]">
        <LoginUserForm />
      </div>
    </div>
  );
}

export default function PrivateRoute({
  children,
}: React.PropsWithChildren<{}>) {
  const { t } = useTranslation('common');
  const { me, isAuthorized } = useMe();
  const isUser = !!me;

  if (!isUser && !isAuthorized) {
    return <UnAuthorizedView />;
  }

  if (isUser && isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="relative grid h-screen w-full place-content-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <PageLoader />
    </div>
  );
}

