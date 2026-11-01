'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import type { Cart } from '@/lib/types';
type Context = {
  cart: Cart | null;
  busy: boolean;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  run: (body: Record<string, unknown>) => Promise<boolean>;
};
const Context = createContext<Context | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  const lock = useRef(false),
    revision = useRef(0);
  const refresh = useCallback(async () => {
    const start = revision.current;
    setLoading(true);
    try {
      const r = await fetch('/api/cart', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not load your bag.');
      if (start === revision.current) {
        setCart(d.cart);
        setError('');
      }
    } catch (e) {
      if (start === revision.current)
        setError(e instanceof Error ? e.message : 'Could not load your bag.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const sync = () => {
      if (!lock.current) void refresh();
    };
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, [refresh]);
  async function run(body: Record<string, unknown>) {
    if (lock.current || loading) return false;
    lock.current = true;
    revision.current++;
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.cart !== undefined) setCart(d.cart);
        throw new Error(d.error || 'Request failed');
      }
      if (d.checkoutUrl) {
        const url = new URL(d.checkoutUrl);
        if (url.protocol !== 'https:')
          throw new Error('Checkout is unavailable. Please try again.');
        window.location.assign(url.href);
        return true;
      }
      setCart(d.cart);
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not update your bag. Please refresh it before trying again.',
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Context.Provider value={{ cart, busy, loading, error, refresh, run }}>
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const c = useContext(Context);
  if (!c) throw new Error('Missing CartProvider');
  return c;
}
