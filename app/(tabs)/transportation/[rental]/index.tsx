import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SITE_URL } from '../../../../lib/constants';
import { useRouteParam } from '../../../../lib/useRouteParam';
import { Seo } from '../../../../components/Seo';
import { SiteFooter } from '../../../../components/SiteFooter';
import { Icon } from '../../../../components/Icon';
import { Breadcrumbs, TransferDisclosure } from '../../../../components/transportation/TransportUI';
import { RentalCard } from '../../../../components/transportation/RentalCard';
import { LOCAL_RENTALS } from '../../../../lib/transportation-data';
import { LOCAL_CATEGORIES } from '../../../../lib/transportation-content';
import { campaignId } from '../../../../lib/analytics';
import { color, font, space, radius, layout } from '../../../../lib/theme';

// Local rental categories. Gap categories (no qualifying Viator inventory) are
// rendered as NOINDEX informational drafts — reachable, honest, but excluded from
// the sitemap and site navigation until a verified booking source is approved.
export function generateStaticParams() { return LOCAL_CATEGORIES.map((c) => ({ rental: c.slug })); }

export default function RentalCategory() {
  const slug = useRouteParam('rental');
  const cat = LOCAL_CATEGORIES.find((c) => c.slug === slug);

  if (!cat) {
    return (
      <>
        <Seo metadata={{ title: 'Not found — Guanacaste Experiences', robots: { index: false, follow: true } }} />
        <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
          <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Page not found</Text>
            <Link href="/transportation/getting-around" style={styles.inlineLink}>Back to getting around Guanacaste →</Link>
          </View>
          <SiteFooter />
        </ScrollView>
      </>
    );
  }

  const url = `${SITE_URL}/transportation/${cat.slug}/`;
  const indexable = cat.hasQualifyingInventory;
  const campaign = campaignId({ section: 'local', category: cat.slug });
  const metadata = {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: url },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: { title: cat.h1, description: cat.description, type: 'website', url, siteName: 'Guanacaste Experiences' },
  };
  const jsonLd = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
    { '@type': 'ListItem', position: 3, name: 'Getting around', item: `${SITE_URL}/transportation/getting-around/` },
    { '@type': 'ListItem', position: 4, name: cat.name, item: url },
  ] }];

  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation', href: '/transportation' }, { name: 'Getting around', href: '/transportation/getting-around' }, { name: cat.name }]} />
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>{cat.h1}</Text>
            {cat.intro.map((t, i) => <Text key={i} style={styles.lead}>{t}</Text>)}
          </View>

          <View style={StyleSheet.flatten([styles.status, indexable ? styles.statusGood : styles.statusMuted])}>
            <Icon name={indexable ? 'checkmark-circle' : 'information-circle'} size={16} color={indexable ? color.success : color.primary} />
            <Text style={styles.statusText}>{cat.viatorStatus}</Text>
          </View>

          {indexable && LOCAL_RENTALS.length > 0 ? (
            <>
              <View style={styles.grid}>{LOCAL_RENTALS.filter((r) => r.category === 'golf-cart').map((r) => <RentalCard key={r.code} product={r} campaign={campaign} />)}</View>
              <TransferDisclosure />
            </>
          ) : null}

          <View style={styles.article}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>What to know before you rent</Text>
            {cat.whatToKnow.map((t, i) => (
              <View key={i} style={styles.tipRow}><Text style={styles.bullet}>•</Text><Text style={styles.p}>{t}</Text></View>
            ))}
            <Text style={[styles.p, { marginTop: space[4] }]}>
              See the full picture in our guide to <Link href="/blog/getting-around-guanacaste-transport" style={styles.inlineLink}>getting around Guanacaste</Link>, or
              go back to <Link href="/transportation/getting-around" style={styles.inlineLink}>all local transport options</Link>.
            </Text>
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.ground },
  content: { flexGrow: 1, paddingBottom: space[12] },
  page: { width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter },
  header: { paddingTop: space[6], paddingBottom: space[4], gap: space[3] },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 32, fontWeight: '600', letterSpacing: -0.4 },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 700 },
  status: { flexDirection: 'row', gap: space[2], alignItems: 'flex-start', borderRadius: radius.md, padding: space[3], maxWidth: 720, marginBottom: space[2] },
  statusGood: { backgroundColor: '#E8F5EF', borderWidth: 1, borderColor: '#BFE6D6' },
  statusMuted: { backgroundColor: color.surfaceAlt, borderWidth: 1, borderColor: color.border },
  statusText: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 14, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4], marginTop: space[3] },
  article: { marginTop: space[6], maxWidth: 720, gap: space[1] },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600', marginBottom: space[2] },
  tipRow: { flexDirection: 'row', gap: space[2], marginTop: space[2] },
  bullet: { color: color.coral, fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  p: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 15.5, lineHeight: 24 },
  inlineLink: { color: color.sky, fontWeight: '700' },
});
