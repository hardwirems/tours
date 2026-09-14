import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SITE_URL } from '../../../../lib/constants';
import { Seo } from '../../../../components/Seo';
import { SiteFooter } from '../../../../components/SiteFooter';
import { Breadcrumbs, ChoiceCard, TransferDisclosure } from '../../../../components/transportation/TransportUI';
import { ROUTES } from '../../../../lib/transportation-content';
import { color, font, space, layout } from '../../../../lib/theme';

export const metadata = {
  title: 'Guanacaste Airport Transfers — Liberia (LIR) & San José (SJO)',
  description:
    'Which airport for Guanacaste — Liberia (LIR) or San José (SJO)? An honest comparison plus private airport transfer options booked through Viator.',
  openGraph: { title: 'Guanacaste Airport Transfers', description: 'LIR vs SJO for Guanacaste, and private transfer options.', type: 'website', url: `${SITE_URL}/transportation/airport-transfers/`, siteName: 'Guanacaste Experiences' },
  alternates: { canonical: `${SITE_URL}/transportation/airport-transfers/` },
};
export const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
    { '@type': 'ListItem', position: 3, name: 'Airport transfers', item: `${SITE_URL}/transportation/airport-transfers/` },
  ] },
];

export default function AirportTransfersOverview() {
  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation', href: '/transportation' }, { name: 'Airport transfers' }]} />
            <Text style={styles.eyebrow}>Getting to Guanacaste</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Guanacaste airport transfers</Text>
            <Text style={styles.lead}>
              Costa Rica has two international airports that matter for Guanacaste: Liberia (LIR) in the northwest,
              and San José (SJO) near the capital. For almost every Guanacaste beach, Liberia is the practical choice.
            </Text>
          </View>

          <View style={styles.choices}>
            <ChoiceCard href="/transportation/airport-transfers/lir" icon="airplane" title="Liberia (LIR)" desc="The closest airport to Guanacaste’s beaches — 25 minutes to about 1¼ hours to most towns. Private transfers to Tamarindo, Papagayo, Flamingo and more." cta="See LIR transfers" />
            <ChoiceCard href="/transportation/airport-transfers/sjo" icon="information-circle" title="San José (SJO)" desc="Costa Rica’s main hub, but four to five hours from the Guanacaste coast. When it makes sense — and when to avoid it." cta="Read the SJO guide" />
          </View>

          <View style={styles.article}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Which airport should you choose?</Text>
            <Text style={styles.p}>If your trip is centred on Guanacaste’s beaches, fly into <Text style={styles.b}>Liberia (LIR)</Text>. It can save you the better part of a day versus landing in San José and driving across the country. Choose <Text style={styles.b}>San José (SJO)</Text> only if your itinerary also takes in the Central Valley, Arenal from the south, or the Caribbean — or if flight prices and schedules strongly favour it.</Text>
            <Text style={styles.p}>Not sure a transfer is even the right call? Our guide to <Link href="/blog/getting-around-guanacaste-transport" style={styles.inlineLink}>getting around Guanacaste</Link> weighs transfers, shuttles and rental cars.</Text>

            <Text accessibilityRole="header" aria-level={2} style={[styles.h2, { marginTop: space[6] }]}>Popular Liberia (LIR) routes</Text>
            <View style={styles.routeLinks}>
              {ROUTES.map((r) => <Link key={r.slug} href={`/transportation/airport-transfers/lir/${r.slug}`} style={styles.routeLink}>LIR → {r.short}</Link>)}
            </View>
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
  header: { paddingTop: space[6], paddingBottom: space[6], gap: space[3] },
  eyebrow: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 34, fontWeight: '600', letterSpacing: -0.4 },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 680 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  article: { marginTop: space[8], maxWidth: 720, gap: space[2] },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 25, fontWeight: '600', marginBottom: space[1] },
  p: { color: color.body, fontFamily: font.body, fontSize: 15.5, lineHeight: 24 },
  b: { fontWeight: '700', color: color.ink },
  inlineLink: { color: color.sky, fontWeight: '700' },
  routeLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginTop: space[2] },
  routeLink: { color: color.sky, fontFamily: font.body, fontSize: 14.5, fontWeight: '600', backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: 999, paddingHorizontal: space[4], paddingVertical: 9 },
});
