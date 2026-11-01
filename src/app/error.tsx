'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty-state error-page">
      <p className="eyebrow">A QUICK TIMEOUT</p>
      <h1>We couldn’t load this page.</h1>
      <p>Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        TRY AGAIN ↗
      </button>
      <Link className="text-link" href="/">
        Back to home
      </Link>
    </section>
  );
}
