import { ContactInfo } from '@/components/contact-us/contact-info';
import ContactForm from '@/components/contact-us/form';
import { LocationIcon } from '@/components/icons/contact/location-icon';
import { MailIcon } from '@/components/icons/contact/mail-icon';
import { PhoneIcon } from '@/components/icons/contact/phone-icon';
import * as socialIcons from '@/components/icons/social';
import Link from '@/components/ui/link';
import PageHeading from '@/components/ui/page-heading';
import routes from '@/config/routes';
import { useContactUs } from '@/data/contact';
import { useSettings } from '@/data/settings';
import GeneralLayout from '@/layouts/_general-layout';
import Seo from '@/layouts/_seo';
import { getIcon } from '@/lib/get-icon';
import type { CreateContactUsInput, CreateProductInput, NextPageWithLayout } from '@/types';
import { isEmpty } from 'lodash';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import ProductInputField from './product-input-field';

const ProductInputDisplay: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  let [reset, setReset] = useState<CreateProductInput | null>(null);
  const { mutate, isLoading, isSuccess } = useContactUs();
  const onSubmit: SubmitHandler<CreateProductInput> = (data) => {
    
  };
  useEffect(() => {
    if (isSuccess) {
      setReset({
        postUrl: '',
        before_ancor_text: '',
        ancorText: '',
        after_ancor_text: '',
      });
    }
  }, [isSuccess]);

  return (
    <>
     
            <ProductInputField
              onSubmit={onSubmit}
              reset={reset}
              isLoading={isLoading}
              href="/checkout"
            />
    </>
  );
};


export default ProductInputDisplay;
