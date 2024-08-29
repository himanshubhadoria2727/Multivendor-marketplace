import { HomeIcon } from '@/components/icons/home-icon';
import { Routes } from '@/config/routes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const VisitStore = () => {
  const { t } = useTranslation();
  const { pathname, query } = useRouter();
  const slug = (pathname === 'goodblogger.co' && `goodblogger.co`) || 'goodblogger.co';

  return (
    <>
      <Link
        href={'http://goodblogger.co:3000'}
        target="_blank"
        className="inline-flex h-9 flex-shrink-0 items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-0 text-sm font-medium leading-none text-accent outline-none transition duration-300 ease-in-out hover:border-transparent hover:bg-accent-hover hover:text-white focus:shadow focus:outline-none"
        rel="noreferrer"
      >
        <HomeIcon />
        {t('text-visit-site')}
      </Link>
    </>
  );
};

export default VisitStore;
