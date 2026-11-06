import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { getPage } from '@/lib/shopify';
import { ContactForm } from '@/components/ContactForm';

const FOUNDERS = [
  {
    name: 'Autish Chakma (Anzo)',
    role: 'Co-Founder',
    email: null,
    image: '/Founders/autish-chakma.jpg',
  },
  {
    name: 'Sadman Ahmed',
    role: 'Co-Founder',
    email: 'ahmed.sadman03@gmail.com',
    image: '/Founders/sadman-ahmed.jpg',
  },
  {
    name: 'Sifat Mahbub',
    role: 'Co-Founder',
    email: 'sifatmahbub18@gmail.com',
    image: '/Founders/sifat-mahbub.jpg',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (handle === 'about' || handle === 'our-story') {
    return {
      title: 'Our Story — Sports Dive',
      description: 'NEVER BREAK UP WITH SPORTS. Born from football. Built on authenticity. Driven by passion.',
    };
  }
  if (['returns', 'return-policy', 'return-and-exchange', 'returns-exchanges'].includes(handle)) {
    return {
      title: 'Return & Exchange Policy — Sports Dive',
      description:
        'Please review our policy carefully before placing your order. Different conditions apply depending on whether an item is from our in-house line, warehouse stock, or imported specifically per your request.',
    };
  }
  if (['contact', 'contact-us', 'get-in-touch'].includes(handle)) {
    return {
      title: 'Contact Us — Sports Dive',
      description:
        'Get in touch with the Sports Dive team. Contact us via Shopify messaging, email, or our contact form.',
    };
  }
  const page = await getPage(handle);
  return { title: page?.title || 'Page not found' };
}

export default async function ContentPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!/^[a-z0-9-]{1,150}$/.test(handle)) notFound();

  if (handle === 'about' || handle === 'our-story') {
    return (
      <article className="content-page story-page">
        <p className="eyebrow">SPORTS DIVE / OUR STORY</p>
        <h1 className="story-title">NEVER BREAK UP WITH SPORTS.</h1>
        <p className="story-lead">Born from football. Built on authenticity. Driven by passion.</p>

        <div className="story-body">
          <p>
            In 2015, it started with a single pair of football boots and one uncompromising vision: bring the world’s best to Bangladesh.
          </p>
          <p>
            Since day one, we’ve laced up the real ones—supplying 100% genuine boots to inter-school competitors, intra-school dreamers, and underground football players battling on dusty grounds and late-night turfs. As their game grew, our reach grew beyond the touchline. From grassroots ballers and Dhaka club professionals to the Bangladesh National Team, our journey became woven into theirs.
          </p>
          <p>
            For over eleven years, SportsDive has stood on a single promise in a market full of compromises: 100% authenticity. From the world’s biggest sporting brands to the feet of Bangladesh’s finest athletes, every pair we’ve sourced carries a story of grit and pride.
          </p>
          <p>
            Now, that journey enters a new chapter.
          </p>
          <p>
            We are stepping beyond the white lines—uniting football heritage, contemporary streetwear, sneakers, and a culture shaped by the way we live, ride, and move.
          </p>
          <p>
            Eleven years in the making. We’ve spent over a decade bringing the world to Bangladesh. Now, it’s time to build something of our own.
          </p>
          <p className="story-standout">
            This is SportsDive.
          </p>
          <p className="story-standout story-closing">
            The next chapter begins now.
          </p>
        </div>

        <section className="story-founders">
          <div className="story-founders-header">
            <h2>THE FOUNDERS</h2>
          </div>
          <div className="founders-grid">
            {FOUNDERS.map((founder) => (
              <div key={founder.name} className="founder-card">
                <div className="founder-image-wrap">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    loading="lazy"
                    className="founder-image"
                  />
                </div>
                <div className="founder-meta">
                  <h3 className="founder-name">{founder.name}</h3>
                  <p className="founder-role">{founder.role}</p>
                  {founder.email && (
                    <a href={`mailto:${founder.email}`} className="founder-email">
                      {founder.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    );
  }

  if (['returns', 'return-policy', 'return-and-exchange', 'returns-exchanges'].includes(handle)) {
    return (
      <article className="content-page policy-page">
        <p className="eyebrow">SPORTS DIVE / CUSTOMER CARE</p>
        <h1 className="policy-title">Return &amp; Exchange Policy</h1>
        <div className="policy-intro">
          <p>
            Please review our policy carefully before placing your order. Different conditions apply depending on whether an item is from our in-house line, warehouse stock, or imported specifically per your request.
          </p>
        </div>

        <div className="policy-accordion">
          <details className="policy-accordion-item" open>
            <summary className="policy-accordion-summary">
              <h2>In-Person Inspection at Delivery</h2>
            </summary>
            <div className="policy-accordion-content">
              <p className="policy-subtitle">
                To ensure complete transparency and quick resolution, all orders must be inspected before finalizing delivery.
              </p>
              <div className="policy-accordion-body">
                <div className="policy-item">
                  <h3>Check on Arrival</h3>
                  <p>Inspect the product’s physical condition, size, and design in front of the delivery rider.</p>
                </div>
                <div className="policy-item">
                  <h3>On-the-Spot Issues</h3>
                  <p>If the item is damaged, defective, or incorrect:</p>
                  <ul className="policy-sublist">
                    <li>Tell the rider to contact our team immediately while they are present.</li>
                    <li>Hold off on completing payment until our team provides an approved solution.</li>
                  </ul>
                </div>
                <div className="policy-item">
                  <h3>Acceptance Finality</h3>
                  <p>Once an order is accepted and the rider departs, all sales become final, and items cannot be returned or exchanged.</p>
                </div>
              </div>
            </div>
          </details>

          <details className="policy-accordion-item">
            <summary className="policy-accordion-summary">
              <h2>SportsDive Clothing Line</h2>
            </summary>
            <div className="policy-accordion-content">
              <p className="policy-subtitle">
                Items designed and produced directly under our own brand.
              </p>
              <div className="policy-accordion-body">
                <div className="policy-item">
                  <h3>Inspection Required</h3>
                  <p>Verify condition, quality, and fit upon delivery while the rider waits.</p>
                </div>
                <div className="policy-item">
                  <h3>Final Sale Upon Handover</h3>
                  <p>Once the delivery is accepted, returns and exchanges are strictly unavailable.</p>
                </div>
                <div className="policy-item">
                  <h3>Defects at Handover</h3>
                  <p>If any manufacturing flaw is found at the moment of delivery, report it immediately before the rider leaves.</p>
                </div>
              </div>
            </div>
          </details>

          <details className="policy-accordion-item">
            <summary className="policy-accordion-summary">
              <h2>Ready-Stock Items</h2>
            </summary>
            <div className="policy-accordion-content">
              <p className="policy-subtitle">
                Off-the-shelf items fulfilled directly from our existing warehouse inventory.
              </p>
              <div className="policy-accordion-body">
                <div className="policy-item">
                  <h3>Final Sale Condition</h3>
                  <p>Once accepted at delivery, all sales are final.</p>
                </div>
                <div className="policy-item">
                  <h3>No Post-Delivery Swaps</h3>
                  <p>We cannot process returns, exchanges, or refunds for size or preference changes after the rider departs.</p>
                </div>
                <div className="policy-item">
                  <h3>Mismatch Handling</h3>
                  <p>Confirm the correct product and specifications are present before accepting the package.</p>
                </div>
              </div>
            </div>
          </details>

          <details className="policy-accordion-item">
            <summary className="policy-accordion-summary">
              <h2>Custom Pre-Orders</h2>
            </summary>
            <div className="policy-accordion-content">
              <p className="policy-subtitle">
                Items sourced, imported, or custom-ordered exclusively for you per your specifications.
              </p>
              <div className="policy-accordion-body">
                <div className="policy-item">
                  <h3>Custom Procurement</h3>
                  <p>Pre-ordered goods are brought in exclusively based on your request. Cancellations, refunds, or exchanges for sizing and fit are not accepted once confirmed.</p>
                </div>
                <div className="policy-item">
                  <h3>Size Verification Responsibility</h3>
                  <p>Customers must double-check measurements prior to ordering, as we cannot exchange items for incorrect fit choices.</p>
                </div>
                <div className="policy-item">
                  <h3>Sizing Consultation</h3>
                  <p>For preorder sizing questions or fit concerns, consult with our team through email or WhatsApp before placing your order.</p>
                </div>
                <div className="policy-item">
                  <h3>Merchant Fulfillment Errors</h3>
                  <p>If we deliver an item differing from your confirmed order details:</p>
                  <ul className="policy-sublist">
                    <li>We will arrange a return and priority replacement or an exchange at no extra cost.</li>
                    <li>You must report the mismatch immediately at delivery while the rider is present.</li>
                  </ul>
                </div>
              </div>
            </div>
          </details>

          <details className="policy-accordion-item">
            <summary className="policy-accordion-summary">
              <h2>Sizing Assistance</h2>
            </summary>
            <div className="policy-accordion-content">
              <p className="policy-subtitle">
                To prevent fit issues before ordering:
              </p>
              <div className="policy-accordion-body">
                <div className="policy-item">
                  <h3>Size Charts</h3>
                  <p>Consult our detailed size guides available on each product page.</p>
                </div>
                <div className="policy-item">
                  <h3>Direct Consultation</h3>
                  <p>Reach out to our support team via email or WhatsApp with your measurements prior to placing an order for personalized guidance.</p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </article>
    );
  }

  if (['contact', 'contact-us', 'get-in-touch'].includes(handle)) {
    return (
      <article className="content-page contact-page">
        <p className="eyebrow">SPORTS DIVE / GET IN TOUCH</p>
        <h1 className="contact-title">We’re on your team.</h1>
        <p className="contact-lead">
          Have a question about our collections, sizing, pre-orders, or delivery? Reach out to us directly on WhatsApp or email.
        </p>
        <ContactForm />
      </article>
    );
  }

  const page = await getPage(handle);
  if (!page) notFound();
  const html = sanitizeHtml(page.body, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  });
  return (
    <article className="content-page">
      <p className="eyebrow">SPORTS DIVE</p>
      <h1>{page.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
