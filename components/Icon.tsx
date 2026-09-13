import { useEffect, useState, type ComponentProps } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ---------------------------------------------------------------------------
// Icon — hydration-safe wrapper around @expo/vector-icons Ionicons.
//
// Vector-icon fonts emit an empty element during the static (server) render but
// a glyph on the client, so hydration sees different content and React reports a
// mismatch (minified error #418). Rendering a same-size empty placeholder on the
// server AND the first client render keeps hydration exact; the real glyph swaps
// in after mount, with no layout shift because the box is already reserved.
// Icons here are decorative (always paired with visible text), so the one-frame
// delay carries no accessibility or SEO cost.
// ---------------------------------------------------------------------------
type IconProps = ComponentProps<typeof Ionicons>;

export function Icon({ size = 16, style, ...rest }: IconProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return <Ionicons size={size} style={style} {...rest} />;
}
