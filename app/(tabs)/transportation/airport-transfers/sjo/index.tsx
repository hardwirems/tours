import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SITE_URL } from '../../../../../lib/constants';
import { Seo } from '../../../../../components/Seo';
import { SiteFooter } from '../../../../../components/SiteFooter';
import { Breadcrumbs, TransferDisclosure } from '../../../../../components/transportation/TransportUI';
import { TransferCard } from '../../../../../components/transportation/TransferCard';
import { TRANSFERS } from '../../../../../lib/transportation-data';
import { campaignId } from '../../../../../lib/analytics';
import { color, font, space, layout } from '../../../../../lib/theme';

const SJO = TRANSFERS.filter((t) => t.origin === 'SJO');

export const metadata = {
  title: 'San José (SJO) to Guanacaste — Transfers & Airport Guide',
  description:
    'San José airport (SJO) to Guanacaste is a 4–5 hour drive. When it makes sense, the transfer reality, and why Liberia (LIR) is usually the better airport.',
  openGraph: { title: 'San José (SJO) to Guanacaste', description: 'Honest guidance on SJO transfers to Guanacaste, and why LIR is usually the better choice.', type: 'website', url: `${SITE_URL}/transportation/airport-transfers/sjo/`, siteName: 'Guanacaste Experiences' },
  alternates: { canonical: `${SITE_URL}/transportation/airport-transfers/sjo/` },
};
export const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
    { '@type': 'ListItem', position: 3, name: 'Airport transfers', item: `${SITE_URL}/transportation/airport-transfers/` },
    { '@type': 'ListItem', position: 4, name: 'San José (SJO)', item: `${SITE_URL}/transportation/airport-transfers/sjo/` },
  ] },
];

export default function SjoTransfers() {
  const campaign = campaignId({ section: 'sjo', airport: 'SJO' });
  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation', href: '/transportation' }, { name: 'Airport transfers', href: '/transportation/airport-transfers' }, { name: 'San José (SJO)' }]} />
            <Text style={styles.eyebrow}>San José · SJO</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>San José (SJO) to Guanacaste</Text>
            <Text style={styles.lead}>
              Here’s the honest version: San José’s airport (SJO) is on the other side of the country from Guanacaste’s
              beaches — a <Text style={styles.b}>four to five hour drive</Text>. For a beach-focused trip, flying into
              Liberia (LIR) instead usually saves you most of a day.
            </Text>
          </View>

          <View style={styles.article}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>When SJO still makes sense</Text>
            <View style={styles.tips}>
              {['Your itinerary also covers the Central Valley, Arenal/La Fortuna from the south, or the Caribbean.',
                'Flight schedules or fares into SJO are dramatically better for your dates.',
                'You’re renting a car and planning to explore multiple regions anyway.'].map((t, i) => (
                <View key={i} style={styles.tipRow}><Text style={styles.bullet}>•</Text><Text style={styles.p}>{t}</Text></View>
              ))}
            </View>
            <Text style={[styles.p, { marginTop: space[3] }]}>If you do land at SJO but your destination is the Guanacaste coast, a private long-distance transfer or a domestic flight to Liberia are the two realistic options. We won’t list dozens of SJO→beach transfers we can’t verify — dedicated, high-review SJO-to-Guanacaste inventory is genuinely limited.</Text>
          </View>

          {SJO.length > 0 ? (
            <>
              <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Verified SJO-area options</Text>
              <View style={styles.grid}>{SJO.map((p) => <TransferCard key={p.code} product={p} campaign={campaign} />)}</View>
            </>
          ) : (
            <View style={styles.callout}>
              <Text style={styles.p}>We don’t currently have an SJO→Guanacaste transfer that clears our quality bar (rating and verified reviews). Rather than show a thin option, we recommend flying into <Link href="/transportation/airport-transfers/lir" style={styles.inlineLink}>Liberia (LIR)</Link> for the coast.</Text>
            </View>
          )}

          <View style={styles.article}>
            <Text style={styles.p}>
              Weighing your options? Our guide to <Link href="/blog/getting-around-guanacaste-transport" style={styles.inlineLink}>getting around Guanacaste</Link> compares airports, shuttles and rental cars, and our <Link href="/transportation/airport-transfers/lir" style={styles.inlineLink}>Liberia (LIR) transfers</Link> page has the full list for the coast.
            </Text>
          </View>

          <TransferDisclosure />
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
  header: { paddingTop: space[6], paddingBottom: space[5], gap: space[3] },
  eyebrow: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 32, fontWeight: '600', letterSpacing: -0.4 },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 700 },
  article: { marginTop: space[6], maxWidth: 720, gap: space[2] },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600', marginBottom: space[2] },
  tips: { gap: space[1] },
  tipRow: { flexDirection: 'row', gap: space[2], marginTop: space[1] },
  bullet: { color: color.coral, fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  p: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 15.5, lineHeight: 24 },
  b: { fontWeight: '700', color: color.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4], marginTop: space[3] },
  callout: { marginTop: space[4], backgroundColor: color.sunLight, borderWidth: 1, borderColor: color.sand, borderRadius: 14, padding: space[4], maxWidth: 720 },
  inlineLink: { color: color.sky, fontWeight: '700' },
});
