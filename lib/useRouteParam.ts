import { useLocalSearchParams } from 'expo-router';

// ---------------------------------------------------------------------------
// useRouteParam — resolve a dynamic-route param that stays identical across the
// static server render and the first client render.
//
// Expo Router's static export leaves useLocalSearchParams() empty on the very
// first client render. A [slug] page therefore resolves "no record" for one
// frame and renders a different tree than the server HTML, which React reports
// as a hydration mismatch (minified error #418). Falling back to the URL's last
// path segment (available synchronously on the web) keeps that first client
// render identical to the server, eliminating the mismatch. On native, or once
// the router has populated params, the real param is used.
// ---------------------------------------------------------------------------
export function useRouteParam(key: string): string | undefined {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const fromParam = params[key];
  const value = Array.isArray(fromParam) ? fromParam[0] : fromParam;
  if (value) return value;
  if (typeof window !== 'undefined') {
    const seg = window.location.pathname.replace(/\/+$/, '').split('/').pop();
    return seg ? decodeURIComponent(seg) : undefined;
  }
  return undefined;
}
