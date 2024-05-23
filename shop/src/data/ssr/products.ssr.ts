import invariant from 'tiny-invariant';
import client from '@/data/client';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { Product } from '@/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// This function gets called at build time
type ParsedQueryParams = {
  productId:string;
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  const { data } = await client.products.all({ limit: 100 });
  const paths = data?.flatMap((product) =>
    locales?.map((locale) => ({
      params: { productSlug: product.slug, productId:product.id },
      locale,
    }))
  );
  return {
    paths,
    fallback: 'blocking',
  };
};

type PageProps = {
  product: Product;
};

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const { productSlug, productId } = params!; //* we know it's required because of getStaticPaths
  try {
    const product = await client.products.get({
      name:productId,
      slug: productSlug,
      language: locale,
    });
    return {
      props: {
        product,
        ...(await serverSideTranslations(locale!, ['common'])),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};
