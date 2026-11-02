import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { getPage } from '@/lib/shopify';

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
