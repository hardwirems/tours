import { Image, Platform, StyleSheet } from 'react-native';

// ---------------------------------------------------------------------------
// WebImage — a web-first image.
//
// On web it renders a real, server-rendered <img>, so the picture is present in
// the static HTML: visible before (or without) hydration, preloadable, and
// lazy/priority-controllable. RN-Web's <Image source={{uri}}> instead paints a
// client-side background-image that only appears after the JS bundle mounts —
// which makes it invisible on de-hydrated content pages and delays LCP even on
// hydrated ones. On native it falls back to RN <Image>.
//
// It deliberately renders the SAME element type on the server and the client
// (always <img> on web), so hydration never swaps element types.
// ---------------------------------------------------------------------------

export function WebImage({
  src,
  alt,
  style,
  priority = false,
  objectPosition,
}: {
  src?: string;
  alt: string;
  style?: unknown;
  priority?: boolean; // hero / LCP image → eager load + fetchpriority="high"
  objectPosition?: string; // focal point, e.g. '50% 55%'
}) {
  if (!src) return null;
  if (Platform.OS !== 'web') {
    return <Image source={{ uri: src }} style={style as object} resizeMode="cover" accessibilityLabel={alt} />;
  }
  const flat = (StyleSheet.flatten(style as object) || {}) as Record<string, unknown>;
  // resizeMode is RN-only; the rest of these image styles are CSS-compatible.
  const { resizeMode, ...css } = flat;
  const imgStyle: Record<string, unknown> = {
    display: 'block',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    ...css,
  };
  if (!imgStyle.objectPosition) imgStyle.objectPosition = objectPosition ?? '50% 50%';
  return (
    // @ts-expect-error raw DOM <img> inside the RN tree (web only)
    <img
      src={src}
      alt={alt}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      // @ts-expect-error React serializes this to the lowercase fetchpriority attribute
      fetchpriority={priority ? 'high' : 'auto'}
      style={imgStyle}
    />
  );
}
