import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { shopify, isDemo } from '@/lib/shopify';
import * as Q from '@/lib/queries';
import type { Cart } from '@/lib/types';
const COOKIE = 'sportswear_cart';
type InternalCart = Cart & { id: string };
function publicCart(cart: InternalCart | null) {
  if (!cart) return null;
  const { id: _id, ...safe } = cart;
  return safe;
}
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store, private' } });
export async function GET() {
  try {
    if (isDemo()) return json({ cart: null, demo: true });
    const jar = await cookies();
    const id = jar.get(COOKIE)?.value;
    const cart = id
      ? (await shopify<{ cart: InternalCart | null }>(Q.GET_CART, { id })).cart
      : null;
    if (id && !cart) jar.delete(COOKIE);
    return json({ cart: publicCart(cart) });
  } catch {
    return json({ error: 'We could not load your bag. Please try again.' }, 502);
  }
}
export async function POST(req: NextRequest) {
  if (
    ![`http://${req.headers.get('host')}`, `https://${req.headers.get('host')}`].includes(
      req.headers.get('origin') || '',
    )
  )
    return json(
      { error: 'This request could not be verified. Refresh the page and try again.' },
      403,
    );
  if (!req.headers.get('content-type')?.includes('application/json'))
    return json({ error: 'Invalid request format.' }, 415);
  if (Number(req.headers.get('content-length') || 0) > 4096)
    return json({ error: 'Request is too large.' }, 413);
  if (isDemo())
    return json(
      {
        error:
          'This is a preview catalogue. Add your Shopify credentials locally to enable a real shopping bag and checkout.',
      },
      400,
    );
  try {
    const text = await req.text();
    if (text.length > 4096) return json({ error: 'Request is too large.' }, 413);
    let b: Record<string, unknown>;
    try {
      b = JSON.parse(text);
    } catch {
      return json({ error: 'Invalid request format.' }, 400);
    }
    if (!b || typeof b !== 'object') return json({ error: 'Invalid request.' }, 400);
    const jar = await cookies();
    let id = jar.get(COOKIE)?.value;
    async function expired() {
      jar.delete(COOKIE);
      return json({ error: 'Your bag has expired. Please add your items again.', cart: null }, 409);
    }
    if (b.action === 'checkout') {
      if (!id) return expired();
      const r = await shopify<{ cart: { checkoutUrl: string; totalQuantity: number } | null }>(
        Q.CHECKOUT,
        { id },
      );
      if (!r.cart || !r.cart.totalQuantity) return expired();
      const checkout = new URL(r.cart.checkoutUrl);
      if (checkout.protocol !== 'https:') throw new Error('Invalid checkout');
      return json({ checkoutUrl: checkout.href });
    }
    if (!['add', 'update', 'remove'].includes(String(b.action)))
      return json({ error: 'Invalid bag action.' }, 400);
    if (
      b.action !== 'remove' &&
      (!Number.isInteger(b.quantity) || Number(b.quantity) < 1 || Number(b.quantity) > 99)
    )
      return json({ error: 'Quantity must be a whole number from 1 to 99.' }, 400);
    if (
      b.action === 'add' &&
      (typeof b.variantId !== 'string' || !b.variantId.startsWith('gid://shopify/ProductVariant/'))
    )
      return json({ error: 'Please choose a valid product option.' }, 400);
    if (b.action !== 'add' && (typeof b.lineId !== 'string' || !id)) return expired();
    // Read before mutation to catch expired carts. Never retry a mutation automatically.
    if (id) {
      const current = (await shopify<{ cart: InternalCart | null }>(Q.GET_CART, { id })).cart;
      if (!current) {
        if (b.action === 'add') id = undefined;
        else return expired();
      } else {
        if (
          b.action === 'add' &&
          current.lines.nodes.length >= 100 &&
          !current.lines.nodes.some((l) => l.merchandise.id === b.variantId)
        )
          return json(
            { error: 'Your bag has reached its item limit. Remove an item before adding another.' },
            400,
          );
        if (b.action === 'add') {
          const existing = current.lines.nodes.find((l) => l.merchandise.id === b.variantId);
          if (existing && existing.quantity + Number(b.quantity) > 99)
            return json({ error: 'You can add up to 99 of each variant.' }, 400);
        }
        if (b.action !== 'add' && !current.lines.nodes.some((l) => l.id === b.lineId))
          return json(
            {
              error: 'This item is no longer in your bag. Your bag has been refreshed.',
              cart: publicCart(current),
            },
            409,
          );
      }
    }
    let query: string, variables: Record<string, unknown>, key: string;
    if (b.action === 'add') {
      const lines = [{ merchandiseId: b.variantId, quantity: b.quantity }];
      query = id ? Q.ADD_LINES : Q.CREATE_CART;
      variables = id ? { cartId: id, lines } : { input: { lines } };
      key = id ? 'cartLinesAdd' : 'cartCreate';
    } else if (b.action === 'update') {
      query = Q.UPDATE_LINES;
      variables = { cartId: id, lines: [{ id: b.lineId, quantity: b.quantity }] };
      key = 'cartLinesUpdate';
    } else {
      query = Q.REMOVE_LINES;
      variables = { cartId: id, lineIds: [b.lineId] };
      key = 'cartLinesRemove';
    }
    const data = await shopify<
      Record<string, { cart: InternalCart | null; userErrors: { message: string }[] }>
    >(query, variables);
    const result = data[key];
    if (result.userErrors.length) {
      let current = result.cart;
      if (!current && id)
        try {
          current = (await shopify<{ cart: InternalCart | null }>(Q.GET_CART, { id })).cart;
        } catch {}
      return json(
        { error: result.userErrors.map((e) => e.message).join(' '), cart: publicCart(current) },
        400,
      );
    }
    if (!result.cart) return expired();
    jar.set(COOKIE, result.cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 10,
    });
    return json({ cart: publicCart(result.cart) });
  } catch {
    return json(
      { error: 'We could not confirm that change. Refresh your bag before trying again.' },
      502,
    );
  }
}
