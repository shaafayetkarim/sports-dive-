import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { getPage } from '@/lib/shopify';
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const page = await getPage((await params).handle);
  return { title: page?.title || 'Page not found' };
}
export default async function ContentPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!/^[a-z0-9-]{1,150}$/.test(handle)) notFound();
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
