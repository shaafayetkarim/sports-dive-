export const CATEGORIES = [
  { title: 'Jackets', handle: 'jackets' },
  { title: 'Boots', handle: 'boots' },
  { title: 'Turfs', handle: 'turfs' },
  { title: 'Backpacks', handle: 'backpacks' },
];
export const ABOUT_LINKS = [
  { title: 'Our story', href: '/pages/about' },
  { title: 'Shipping & delivery', href: '/pages/shipping' },
  { title: 'Returns & exchanges', href: '/pages/returns' },
  { title: 'Contact', href: '/pages/contact' },
];
export const SORTS = {
  featured: { key: 'COLLECTION_DEFAULT', reverse: false },
  newest: { key: 'CREATED', reverse: true },
  bestsellers: { key: 'BEST_SELLING', reverse: false },
  'price-asc': { key: 'PRICE', reverse: false },
  'price-desc': { key: 'PRICE', reverse: true },
  'title-asc': { key: 'TITLE', reverse: false },
};
export type Sort = keyof typeof SORTS;

export const VIDEOS = {
  hero: process.env.NEXT_PUBLIC_SHOPIFY_HERO_VIDEO_URL || '/hero.mp4',
  a: process.env.NEXT_PUBLIC_SHOPIFY_VIDEO_A_URL || '/a.mp4',
  b: process.env.NEXT_PUBLIC_SHOPIFY_VIDEO_B_URL || '/b.MP4',
};
