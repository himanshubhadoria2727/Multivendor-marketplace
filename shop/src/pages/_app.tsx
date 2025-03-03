import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';
import { validateEnvironmentVariables } from '@/config/validate-environment-variables';
import { CartProvider } from '@/components/cart/lib/cart.context';
import { ModalProvider } from '@/components/modal-views/context';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SearchView from '@/components/search/search-view';
import DefaultSeo from '@/layouts/_default-seo';
import { SearchProvider } from '@/components/search/search.context';
import { CampaignProvider } from '@/components/campaign/CampaignContext'; // Adjust the import path if necessary

// base css file
import '@/assets/css/scrollbar.css';
import '@/assets/css/swiper-carousel.css';
import '@/assets/css/pagination.css';
import '@/assets/css/globals.css';
//firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getDirection } from '@/lib/constants';
import Maintenance from '@/components/maintenance/layout';
const PrivateRoute = dynamic(() => import('@/layouts/_private-route'), {
  ssr: false,
});

validateEnvironmentVariables();

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const { locale } = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);
  const dir = getDirection(locale);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  const authenticationRequired = Component.authorization ?? false;
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SearchProvider>
            <CartProvider>
              <ModalProvider>
                <CampaignProvider> 
                  <AnimatePresence initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                    <><PrivateRoute>
                      <DefaultSeo />
                      <Maintenance>
                        {authenticationRequired ? (
                          <PrivateRoute>{getLayout(<Component {...pageProps} />)}</PrivateRoute>
                        ) : (
                          getLayout(<Component {...pageProps} />)
                        )}
                      </Maintenance>
                      <SearchView />
                      <ModalsContainer />
                      <DrawersContainer />
                      <Toaster containerClassName="!top-16 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
                      </PrivateRoute>
                    </>
                  </AnimatePresence>
                </CampaignProvider>
              </ModalProvider>
            </CartProvider>
          </SearchProvider>
        </ThemeProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default appWithTranslation(CustomApp);
