export type Money = { amount: string; currencyCode: string };
export type Image = { url: string; altText: string | null };
export type PageInfo = { hasNextPage: boolean; endCursor: string | null };
export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  selectedOptions: { name: string; value: string }[];
};
export type TaxonomyCategory = { id: string; name: string };
export type Metafield = {
  key: string;
  namespace: string;
  value: string;
  type: string;
  reference?: { fields: { key: string; value: string }[] } | null;
  references?: { nodes: { fields: { key: string; value: string }[] }[] } | null;
} | null;
export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  category?: TaxonomyCategory | null;
  metafields?: Metafield[];
  availableForSale: boolean;
  featuredImage: Image | null;
  images: { nodes: Image[] };
  options: { name: string; optionValues: { name: string }[] }[];
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  variants: { nodes: Variant[]; pageInfo: PageInfo };
};
export type Filter = {
  id: string;
  label: string;
  type: string;
  values: { id: string; label: string; count: number; input: string }[];
};
export type ProductConnection = { nodes: Product[]; pageInfo: PageInfo; filters?: Filter[] };
export type Category = { title: string; handle: string; image: Image | null };
export type NavLink = { title: string; href: string };
export type Navigation = { categories: Category[]; about: NavLink[] };
export type StorePage = { title: string; body: string };
export type Cart = {
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      merchandise: {
        id: string;
        title: string;
        product: { title: string; handle: string };
        image: Image | null;
      };
      cost: { totalAmount: Money };
    }[];
  };
};
export const money = (m: Money) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: m.currencyCode }).format(
    Number(m.amount),
  );
