import { SITE_URL } from '../lib/config';

export function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Sports Dive',
        alternateName: ['SportsDive', 'Sports Dive BD'],
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/brand/sports-dive.png`,
          contentUrl: `${SITE_URL}/brand/sports-dive.png`,
          caption: 'Sports Dive Brand Logo',
          width: 434,
          height: 148,
        },
        image: `${SITE_URL}/brand/sports-dive.png`,
        description:
          "Don't Break Up With Sports. 100% authentic original imports, football boots, turfs, jackets, and sportswear.",
        email: 'sportsdivebd@gmail.com',
        telephone: '+8801763572148',
        sameAs: [
          'https://facebook.com/sportsdive',
          'https://instagram.com/sportsdive',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+8801763572148',
          contactType: 'customer support',
          email: 'sportsdivebd@gmail.com',
          availableLanguage: ['English', 'Bengali'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Sports Dive',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        description:
          "Don't Break Up With Sports. Shop jackets, boots, turfs, and backpacks at Sports Dive.",
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        hasPart: [
          {
            '@type': 'WebPage',
            name: 'Our Products',
            description: 'Explore all authentic products in the Sports Dive line-up.',
            url: `${SITE_URL}/collections/all-products`,
          },
          {
            '@type': 'WebPage',
            name: 'Request an Import',
            description:
              'Request 100% authentic original imports from any brand around the world.',
            url: `${SITE_URL}/pages/contact`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#sitelinks`,
        name: 'Sports Dive Key Sitelinks',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'Our Products',
            description: 'Explore all products in the Sports Dive catalogue.',
            url: `${SITE_URL}/collections/all-products`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Request an Import',
            description:
              'Request 100% authentic original imports from any brand around the world.',
            url: `${SITE_URL}/pages/contact`,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
