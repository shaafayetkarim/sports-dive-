import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="empty-state error-page">
      <p className="eyebrow">OUT OF PLAY</p>
      <h1>This page isn’t available.</h1>
      <p>The product or collection may have moved, or isn’t published yet.</p>
      <Link className="button" href="/collections/all-products">
        EXPLORE PRODUCTS ↗
      </Link>
      <Link className="text-link" href="/">
        Back to home
      </Link>
    </section>
  );
}
