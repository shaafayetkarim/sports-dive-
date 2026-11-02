import type { Metadata } from 'next';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { getNavigation, isDemo } from '@/lib/shopify';
import { demoNavigation } from '@/lib/demo';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'Sports Dive | For the love of the game', template: '%s | Sports Dive' },
  description: 'Shop jackets, boots, turfs and backpacks at Sports Dive.',
  icons: { icon: '/icon.png' },
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
    <html lang="en">
      <body>
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
