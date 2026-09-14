import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { color, font, space, radius, layout, shadow } from '../lib/theme';

// ---------------------------------------------------------------------------
// SiteHeader — sticky top navigation for the web build. Wordmark (home),
// primary nav, and a coral "Browse tours" CTA. Collapses to an accessible
// menu below 900px (Escape to close, scroll lock, focus restore).
// Web-only; native uses the bottom tab bar.
// ---------------------------------------------------------------------------

const NAV = [
  { label: 'Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
] as const;

function Wordmark() {
  return (
    <Link href="/" asChild>
      <TouchableOpacity accessibilityRole="link" accessibilityLabel="Guanacaste Experiences, home" style={styles.brand}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>G</Text>
        </View>
        <Text style={styles.brandText}>
          Guanacaste<Text style={styles.brandTextLight}> Experiences</Text>
        </Text>
      </TouchableOpacity>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<View>(null);
  // Both the full nav and the hamburger are always rendered; a CSS media query
  // (see globals.css [data-nav]) decides which is visible at the current width.
  // Rendering the same DOM on server and client avoids a hydration mismatch
  // (React #418) and keeps the nav links crawlable at every viewport.

  // Close the menu whenever the route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Escape to close + lock background scroll while open (web).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (Platform.OS !== 'web') return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <View style={styles.header}>
      <View style={[styles.inner, { maxWidth: layout.maxWidth }]}>
        <Wordmark />

        {/* Desktop nav — hidden below 900px via CSS */}
        <View style={styles.navRow} dataSet={{ nav: 'desktop' }}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} asChild>
              <TouchableOpacity accessibilityRole="link" style={styles.navItem}>
                <Text style={[styles.navLabel, isActive(item.href) && styles.navLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
          <Link href="/tours" asChild>
            <TouchableOpacity accessibilityRole="link" style={styles.cta}>
              <Text style={styles.ctaText}>Browse tours</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Hamburger — hidden at/above 900px via CSS */}
        <View ref={triggerRef} collapsable={false} dataSet={{ nav: 'mobile' }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={styles.menuButton}
            onPress={() => setOpen((v) => !v)}
          >
            <View style={styles.bar} />
            <View style={styles.bar} />
            <View style={styles.bar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile menu overlay — only openable via the hamburger (mobile), and
          hidden on desktop by CSS as a belt-and-braces guard. */}
      {open ? (
        <View style={styles.overlay} dataSet={{ nav: 'mobile' }} accessibilityViewIsModal aria-modal role="dialog" aria-label="Menu">
          <TouchableOpacity style={styles.overlayScrim} accessibilityLabel="Close menu" onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Wordmark />
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close menu" style={styles.closeBtn} onPress={() => setOpen(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} asChild>
                  <TouchableOpacity accessibilityRole="link" style={styles.sheetItem}>
                    <Text style={[styles.sheetLabel, isActive(item.href) && styles.sheetLabelActive]}>{item.label}</Text>
                    <Text style={styles.sheetArrow}>→</Text>
                  </TouchableOpacity>
                </Link>
              ))}
              <Link href="/tours" asChild>
                <TouchableOpacity accessibilityRole="link" style={styles.sheetCta}>
                  <Text style={styles.sheetCtaText}>Browse all tours</Text>
                </TouchableOpacity>
              </Link>
            </ScrollView>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.surface,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    ...Platform.select({ web: { position: 'sticky' as 'absolute', top: 0, zIndex: 500 } }),
  },
  inner: {
    width: '100%', alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: layout.gutter, height: 66,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  brandMark: { width: 34, height: 34, borderRadius: radius.md, backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: color.sunLight, fontFamily: font.display, fontSize: 20, fontWeight: '600' },
  brandText: { color: color.primary, fontFamily: font.display, fontSize: 20, fontWeight: '600', letterSpacing: -0.2 },
  brandTextLight: { color: color.sky },

  navRow: { flexDirection: 'row', alignItems: 'center', gap: space[6] },
  navItem: { paddingVertical: space[2] },
  navLabel: { color: color.body, fontFamily: font.body, fontSize: 15, fontWeight: '600' },
  navLabelActive: { color: color.primary },
  cta: { backgroundColor: color.coral, paddingHorizontal: space[5], paddingVertical: 11, borderRadius: radius.pill, minHeight: 44, justifyContent: 'center' },
  ctaText: { color: '#fff', fontFamily: font.body, fontSize: 14, fontWeight: '700' },

  menuButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', gap: 5 },
  bar: { width: 22, height: 2, borderRadius: 2, backgroundColor: color.primary },

  overlay: { ...Platform.select({ web: { position: 'fixed' as 'absolute' } }), top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, flexDirection: 'row' },
  overlayScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,47,59,0.45)' },
  sheet: { marginLeft: 'auto', width: '82%', maxWidth: 360, height: '100%', backgroundColor: color.surface, paddingHorizontal: space[5], paddingTop: space[4], ...Platform.select({ web: { boxShadow: shadow.elevated } as object }) },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space[4] },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: color.primary, fontSize: 20, fontWeight: '600' },
  sheetItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space[4], borderBottomWidth: 1, borderBottomColor: color.border },
  sheetLabel: { color: color.ink, fontFamily: font.body, fontSize: 18, fontWeight: '600' },
  sheetLabelActive: { color: color.coral },
  sheetArrow: { color: color.muted, fontSize: 18 },
  sheetCta: { backgroundColor: color.coral, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: space[5] },
  sheetCtaText: { color: '#fff', fontFamily: font.body, fontSize: 16, fontWeight: '700' },
});
