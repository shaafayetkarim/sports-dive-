import type { Product, Navigation, StorePage } from './types';
import { CATEGORIES, ABOUT_LINKS } from './config';

const jacketItems = [
  { title: 'Sideline Jacket', handle: 'sideline-jacket', price: 89, compare: 109, image: '/demo/jackets-0.svg' },
  { title: 'Training Shell', handle: 'training-shell', price: 99, compare: null, image: '/demo/jackets-1.svg' },
  { title: 'Matchday Parka', handle: 'matchday-parka', price: 129, compare: 149, image: '/demo/jackets-0.svg' },
  { title: 'Windrunner Jacket', handle: 'windrunner-jacket', price: 79, compare: null, image: '/demo/jackets-1.svg' },
];

export const demoProducts: Product[] = jacketItems.map((item, i) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  const image = {
    url: item.image,
    altText: `Illustration of ${item.title} — demo product`,
  };
  const price = { amount: String(item.price), currencyCode: 'USD' };
  const compareAtPrice = item.compare ? { amount: String(item.compare), currencyCode: 'USD' } : null;
  const variants = ['Navy', 'White'].flatMap((colour) =>
    sizes.map((size, j) => ({
      id: `demo-jacket-${i}-${colour}-${size}`,
      title: `${colour} / ${size}`,
      availableForSale: !(i === 1 && j === sizes.length - 1),
      price,
      compareAtPrice,
      image,
      selectedOptions: [
        { name: 'Colour', value: colour },
        { name: 'Size', value: size },
      ],
    })),
  );
  return {
    id: `demo-jacket-${i}`,
    handle: item.handle,
    title: item.title,
    description:
      'A premium Sports Dive jacket engineered for training, warmup, and sideline performance with lightweight water resistance.',
    productType: 'Jackets',
    availableForSale: true,
    featuredImage: image,
    images: { nodes: [image] },
    options: [
      { name: 'Colour', optionValues: [{ name: 'Navy' }, { name: 'White' }] },
      { name: 'Size', optionValues: sizes.map((name) => ({ name })) },
    ],
    priceRange: { minVariantPrice: price },
    compareAtPriceRange: {
      minVariantPrice: compareAtPrice || { ...price, amount: '0' },
    },
    variants: { nodes: variants, pageInfo: { hasNextPage: false, endCursor: null } },
  };
});

export const demoNavigation: Navigation = {
  categories: CATEGORIES.map((c) => ({
    ...c,
    image: {
      url: `/demo/${c.handle}-0.svg`,
      altText: `Illustration of ${c.title} — demo product`,
    },
  })),
  about: ABOUT_LINKS,
};

export const demoPages: Record<string, StorePage> = {
  about: {
    title: 'NEVER BREAK UP WITH SPORTS.',
    body: '<p><strong>Born from football. Built on authenticity. Driven by passion.</strong></p><p>In 2015, it started with a single pair of football boots and one uncompromising vision: bring the world’s best to Bangladesh.</p><p>Since day one, we’ve laced up the real ones—supplying 100% genuine boots to inter-school competitors, intra-school dreamers, and underground football players battling on dusty grounds and late-night turfs. As their game grew, our reach grew beyond the touchline. From grassroots ballers and Dhaka club professionals to the Bangladesh National Team, our journey became woven into theirs.</p><p>For over eleven years, SportsDive has stood on a single promise in a market full of compromises: 100% authenticity. From the world’s biggest sporting brands to the feet of Bangladesh’s finest athletes, every pair we’ve sourced carries a story of grit and pride.</p><p>Today, that journey enters a new chapter.</p><p>We are stepping beyond the white lines—uniting football heritage, contemporary streetwear, sneakers, and a culture shaped by the way we live, ride, and move.</p><p>Eleven years in the making. We’ve spent over a decade bringing the world to Bangladesh. Now, it’s time to build something of our own.</p><p><strong>This is SportsDive.</strong></p><p><strong>The next chapter begins now.</strong></p>',
  },
  originals: {
    title: '100% Authentic Originals',
    body: '<h2>We import originals from any brand around the world 100 percent authentic.</h2><p>Looking for boots, turfs, or backpacks from Nike, Adidas, Puma, Mizuno, or any other global brand? We source 100% genuine products directly from official brand stores and authorized dealers worldwide.</p><p><a href="/pages/contact">Request an import &rarr;</a></p>',
  },
  shipping: {
    title: 'Shipping & delivery',
    body: '<p>This is a demo page. Add your shipping locations, charges, dispatch times and delivery estimates in Shopify Pages before launch.</p>',
  },
  returns: {
    title: 'Return & Exchange Policy',
    body: '<p>Please review our policy carefully before placing your order. Different conditions apply depending on whether an item is from our in-house line, warehouse stock, or imported specifically per your request.</p><h3>In-Person Inspection at Delivery</h3><p>To ensure complete transparency and quick resolution, all orders must be inspected before finalizing delivery.</p><p><strong>Check on Arrival:</strong> Inspect the product’s physical condition, size, and design in front of the delivery rider.</p><p><strong>On-the-Spot Issues:</strong> If the item is damaged, defective, or incorrect:</p><ul><li>Tell the rider to contact our team immediately while they are present.</li><li>Hold off on completing payment until our team provides an approved solution.</li></ul><p><strong>Acceptance Finality:</strong> Once an order is accepted and the rider departs, all sales become final, and items cannot be returned or exchanged.</p><h3>SportsDive Clothing Line</h3><p>Items designed and produced directly under our own brand.</p><p><strong>Inspection Required:</strong> Verify condition, quality, and fit upon delivery while the rider waits.</p><p><strong>Final Sale Upon Handover:</strong> Once the delivery is accepted, returns and exchanges are strictly unavailable.</p><p><strong>Defects at Handover:</strong> If any manufacturing flaw is found at the moment of delivery, report it immediately before the rider leaves.</p><h3>Ready-Stock Items</h3><p>Off-the-shelf items fulfilled directly from our existing warehouse inventory.</p><p><strong>Final Sale Condition:</strong> Once accepted at delivery, all sales are final.</p><p><strong>No Post-Delivery Swaps:</strong> We cannot process returns, exchanges, or refunds for size or preference changes after the rider departs.</p><p><strong>Mismatch Handling:</strong> Confirm the correct product and specifications are present before accepting the package.</p><h3>Custom Pre-Orders</h3><p>Items sourced, imported, or custom-ordered exclusively for you per your specifications.</p><p><strong>Custom Procurement:</strong> Pre-ordered goods are brought in exclusively based on your request. Cancellations, refunds, or exchanges for sizing and fit are not accepted once confirmed.</p><p><strong>Size Verification Responsibility:</strong> Customers must double-check measurements prior to ordering, as we cannot exchange items for incorrect fit choices.</p><p><strong>Sizing Consultation:</strong> For preorder sizing questions or fit concerns, consult with our team through email or WhatsApp before placing your order.</p><p><strong>Merchant Fulfillment Errors:</strong> If we deliver an item differing from your confirmed order details:</p><ul><li>We will arrange a return and priority replacement or an exchange at no extra cost.</li><li>You must report the mismatch immediately at delivery while the rider is present.</li></ul><h3>Sizing Assistance</h3><p>To prevent fit issues before ordering:</p><p><strong>Size Charts:</strong> Consult our detailed size guides available on each product page.</p><p><strong>Direct Consultation:</strong> Reach out to our support team via email or WhatsApp with your measurements prior to placing an order for personalized guidance.</p>',
  },
  contact: {
    title: 'Get in touch',
    body: '<p>This is a demo page. Add your store email, support hours and contact details in Shopify Pages before launch.</p>',
  },
};
