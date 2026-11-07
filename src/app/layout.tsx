import type { Metadata } from 'next';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { StructuredData } from '@/components/StructuredData';
import { getNavigation, isDemo } from '@/lib/shopify';
import { demoNavigation } from '@/lib/demo';
import { SITE_URL } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Sports Dive | Don't Break Up With Sports", template: '%s | Sports Dive' },
  description:
    "Don't Break Up With Sports. 100% authentic sportswear, football boots, turfs, jackets, and original imports from any brand around the world.",
  applicationName: 'Sports Dive',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Sports Dive | Don't Break Up With Sports",
    description:
      "Don't Break Up With Sports. 100% authentic sportswear, football boots, turfs, jackets, and custom imports.",
    url: SITE_URL,
    siteName: 'Sports Dive',
    images: [
      {
        url: '/brand/sports-dive.png',
        width: 434,
        height: 148,
        alt: 'Sports Dive Brand Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sports Dive | Don't Break Up With Sports",
    description:
      "Don't Break Up With Sports. 100% authentic sportswear, football boots, turfs, jackets, and custom imports.",
    images: ['/brand/sports-dive.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  let navigation;
  try {
    navigation = await getNavigation();
  } catch {
    navigation = {
      categories: demoNavigation.categories.map((c) => ({ ...c, image: null })),
      about: demoNavigation.about,
    };
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StructuredData />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <CartProvider>
          <Header navigation={navigation} />
          <SmoothScroll>
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            {isDemo() && (
              <div className="demo-notice">
                Demo catalogue · Sample USD prices and illustrations · Connect Shopify for your real
                products and checkout
              </div>
            )}
            <Footer navigation={navigation} />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
