

const routes = {
  home: '/',
  authors: '/authors',
  explore: '/explore',
  dashboard: '/dashboard',
  campaign :'/campaigns',
  popularProducts: '/popular-products',
  about: '/about-us',
  contact: '/contact-us',
  purchases: '/purchases',
  order: '/order',
  wishlists: '/wishlists',
  reports: '/reports',
  questions: '/questions',
  profile: '/profile',
  profileh:'/profileh',
  checkout: '/checkout',
  help: '/help',
  licensing: '/licensing',
  refund: '/refund',
  terms: '/terms',
  privacy: '/privacy',
  password: '/password',
  feed: '/feed',
  wallet: '/wallet',
  followedShop: '/followed-authors',
  orderUrl: (tracking_number: string) =>
    `/orders/${encodeURIComponent(tracking_number)}`,
  productUrl: (slug: string) => `/products/${slug}`,
  tagUrl: (slug: string) => `/products/tags/${slug}`,
  shopUrl: (slug: string) => `/authors/${slug}`,
  product: (slug: string) => {
    return `/products/${encodeURIComponent(slug)}`;
  },
  cards: '/cards',
};
export default routes;
