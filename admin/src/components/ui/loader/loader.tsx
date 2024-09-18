import { twMerge } from 'tailwind-merge';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Lottie from 'lottie-react';
import lottieLoader from 'lottieLoader.json'; // Path to the JSON file

interface Props {
  className?: string;
  text?: string;
  showText?: boolean;
}

const Loader = ({ className, showText = true, text = 'Loading...' }: Props) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge(
        cn('w-full flex flex-col items-center justify-center', className),
      )}
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <Lottie animationData={lottieLoader} loop autoplay />
      {/* {showText && (
        <h3 className="text-lg font-semibold text-body italic">
          {t(text)}
        </h3>
      )} */}
    </div>
  );
};

export default Loader;
