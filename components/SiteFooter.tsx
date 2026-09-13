import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { CATEGORIES } from '../lib/tours';
import { DESTINATIONS } from '../lib/seo-content';
import { color, font, space, radius, layout } from '../lib/theme';

// ---------------------------------------------------------------------------
// SiteFooter — shared footer with grouped nav, affiliate disclosure, and the
// commercial relationship stated plainly. Rendered at the end of page scroll.
// ---------------------------------------------------------------------------

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.col}>
      {/* Footer group labels are styled text, not page headings, so they don't
          clutter the document's heading outline. */}
      <Text style={styles.colTitle}>{title}</Text>
      {children}
    </View>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity accessibilityRole="link" style={styles.linkRow}>
        <Text style={styles.link}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <View style={styles.footer}>
      <View style={[styles.inner, { maxWidth: layout.maxWidth }]}>
        <View style={styles.brandCol}>
          <Text style={styles.brand}>Guanacaste Experiences</Text>
          <Text style={styles.tagline}>
            An independent guide to the best tours and excursions in Guanacaste, Costa Rica.
          </Text>
        </View>

        <View style={styles.cols}>
          <Col title="Experiences">
            {Object.entries(CATEGORIES).map(([k, l]) => (
              <FooterLink key={k} href={`/categories/${k}`} label={l} />
            ))}
          </Col>
          <Col title="Destinations">
            {DESTINATIONS.map((d) => (
              <FooterLink key={d.slug} href={`/destinations/${d.slug}`} label={d.town} />
            ))}
          </Col>
          <Col title="Guanacaste Experiences">
            <FooterLink href="/tours" label="All tours" />
            <FooterLink href="/destinations" label="Destinations" />
            <FooterLink href="/about" label="About us" />
          </Col>
        </View>
      </View>

      <View style={[styles.disclosureWrap, { maxWidth: layout.maxWidth }]}>
        <Text style={styles.disclosure}>
          Guanacaste Experiences is an independent guide. We do not operate tours ourselves — bookings
          are completed by trusted partners such as GetYourGuide and Viator, each with their own secure
          checkout and cancellation terms. We may earn a commission when you book through our links, at
          no extra cost to you.
        </Text>
        <Text style={styles.copyright}>© {year} Guanacaste Experiences. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: color.primaryDeep, paddingTop: space[10], marginTop: space[12] },
  inner: {
    width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter,
    flexDirection: 'row', flexWrap: 'wrap', gap: space[8], justifyContent: 'space-between',
  },
  brandCol: { flexGrow: 1, flexBasis: 260, maxWidth: 340 },
  brand: { color: '#fff', fontFamily: font.display, fontSize: 22, fontWeight: '600', marginBottom: space[3] },
  tagline: { color: color.onDarkMuted, fontFamily: font.body, fontSize: 14, lineHeight: 21 },
  cols: { flexDirection: 'row', flexWrap: 'wrap', gap: space[8], flexGrow: 2 },
  col: { minWidth: 150 },
  colTitle: { color: color.sun, fontFamily: font.body, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: space[3] },
  linkRow: { paddingVertical: 5 },
  link: { color: '#E6EDEF', fontFamily: font.body, fontSize: 14, fontWeight: '500' },
  disclosureWrap: {
    width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter,
    marginTop: space[10], paddingTop: space[5], paddingBottom: space[6],
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.14)',
  },
  disclosure: { color: color.onDarkMuted, fontFamily: font.body, fontSize: 12.5, lineHeight: 19, maxWidth: 760, marginBottom: space[4] },
  copyright: { color: 'rgba(255,255,255,0.55)', fontFamily: font.body, fontSize: 12.5 },
});
