import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { SITE_URL } from '../../../../../lib/constants';
import { Seo } from '../../../../../components/Seo';
import { SiteFooter } from '../../../../../components/SiteFooter';
import { Breadcrumbs, TransportFinder, TransferDisclosure } from '../../../../../components/transportation/TransportUI';
import { TransferCard } from '../../../../../components/transportation/TransferCard';
import { TRANSFERS, TRANSFERS_CHECKED_AT } from '../../../../../lib/transportation-data';
import { LIR_FAQ } from '../../../../../lib/transportation-content';
import { track, campaignId } from '../../../../../lib/analytics';
import { color, font, space, radius, layout } from '../../../../../lib/theme';

const LIR = TRANSFERS.filter((t) => t.origin === 'LIR');
const ZONE_LABELS: Record<string, string> = {
  'papagayo-coco': 'Papagayo & Coco', 'flamingo-conchal': 'Flamingo & Conchal', tamarindo: 'Tamarindo',
  'la-fortuna': 'La Fortuna', 'liberia-riu': 'Liberia & RIU', guanacaste: 'Flexible / any hotel',
};
const presentZones = [...new Set(LIR.map((t) => t.zone))];
const CHIPS = [{ slug: 'all', label: `All (${LIR.length})` }, ...presentZones.map((z) => ({ slug: z, label: `${ZONE_LABELS[z] ?? z} (${LIR.filter((t) => t.zone === z).length})` }))];

export const metadata = {
  title: 'Liberia Airport (LIR) Transfers — Private Transport to Guanacaste',
  description:
    'Private airport transfers from Liberia (LIR) to Guanacaste — Tamarindo, Papagayo, Flamingo and more. Verified Viator options, pickup tips and FAQs.',
  openGraph: { title: 'Liberia Airport (LIR) Transfers', description: 'Private transfers from Liberia Airport to Guanacaste beaches, via Viator.', type: 'website', url: `${SITE_URL}/transportation/airport-transfers/lir/`, siteName: 'Guanacaste Experiences' },
  alternates: { canonical: `${SITE_URL}/transportation/airport-transfers/lir/` },
};

export const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
    { '@type': 'ListItem', position: 3, name: 'Airport transfers', item: `${SITE_URL}/transportation/airport-transfers/` },
    { '@type': 'ListItem', position: 4, name: 'Liberia (LIR)', item: `${SITE_URL}/transportation/airport-transfers/lir/` },
  ] },
  { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Liberia Airport (LIR) private transfers', numberOfItems: LIR.length,
    itemListElement: LIR.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title })) },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: LIR_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
];

export default function LirTransfers() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); track('view_viator_product', { section: 'lir', airport: 'LIR', count: LIR.length }); track('select_airport', { airport: 'LIR' }); }, []);
  const params = useLocalSearchParams<{ zone?: string }>();
  const activeZone = mounted && typeof params.zone === 'string' && presentZones.includes(params.zone) ? params.zone : 'all';
  const shown = activeZone === 'all' ? LIR : LIR.filter((t) => t.zone === activeZone);
  const campaign = campaignId({ section: 'lir', airport: 'LIR', destination: activeZone === 'all' ? undefined : activeZone });

  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation', href: '/transportation' }, { name: 'Airport transfers', href: '/transportation/airport-transfers' }, { name: 'Liberia (LIR)' }]} />
            <Text style={styles.eyebrow}>Liberia International Airport · LIR</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Liberia Airport (LIR) transfers</Text>
            <Text style={styles.lead}>
              Liberia (LIR) is the practical gateway to Guanacaste — most beaches are 25 minutes to about 1¼ hours away,
              versus four to five hours from San José. Below are private, door-to-door transfers booked through Viator.
              We show the route, service and verified ratings; live prices and availability are on Viator.
            </Text>
          </View>

          <TransportFinder zones={CHIPS} active={activeZone} />

          <Text accessibilityRole="header" aria-level={2} style={styles.resultHead}>
            {activeZone === 'all' ? `${LIR.length} private transfers` : `${shown.length} transfer${shown.length === 1 ? '' : 's'} · ${ZONE_LABELS[activeZone] ?? activeZone}`}
          </Text>

          {shown.length === 0 ? (
            <Text style={styles.empty}>No transfers match this filter yet. <Link href="/transportation/airport-transfers/lir" style={styles.inlineLink}>Show all transfers</Link>.</Text>
          ) : (
            <View style={styles.grid}>
              {shown.map((p, i) => <TransferCard key={p.code} product={p} campaign={campaign} eager={i < 3} />)}
            </View>
          )}

          <TransferDisclosure />

          {/* Original planning guidance */}
          <View style={styles.article}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Planning your Liberia airport transfer</Text>
            <Text accessibilityRole="header" aria-level={3} style={styles.h3}>Private vs. shared</Text>
            <Text style={styles.p}>The Guanacaste airport transfers we verified are <Text style={styles.b}>private</Text> — the vehicle is yours, with no other stops. That’s worth a lot after an overnight flight, with family, or when your arrival time may shift. True shared shuttles exist on some routes but are limited here, so we don’t pad the list with options we can’t verify.</Text>
            <Text accessibilityRole="header" aria-level={3} style={styles.h3}>Pickup, luggage & late arrivals</Text>
            <Text style={styles.p}>Drivers typically meet you in the arrivals area with a sign showing your name — have your hotel or villa name and address handy. Confirm the luggage allowance if you’re travelling with surfboards, golf clubs or extra bags. Most private operators monitor flights and adjust for delays, but wait-time policies differ, so check the operator’s terms on Viator before you book.</Text>
            <Text accessibilityRole="header" aria-level={3} style={styles.h3}>Families, car seats & accessibility</Text>
            <Text style={styles.p}>If you need a child car seat or step-free/accessible transport, ask the operator at the time of booking and reconfirm closer to travel — availability varies and is never guaranteed. Never assume a seat will be waiting.</Text>
            <Text accessibilityRole="header" aria-level={3} style={styles.h3}>How long is the drive?</Text>
            <Text style={styles.p}>Roughly: Papagayo, Playas del Coco and Hermosa are 25–40 minutes; Tamarindo and Flamingo/Conchal about 1 to 1¼ hours; La Fortuna (Arenal) is a longer 2¾–3½ hours. These are approximate and depend on traffic, weather and your exact hotel — each listing’s own duration is the most reliable guide.</Text>
            <Text style={styles.p}>New to the region? Our guide to <Link href="/blog/getting-around-guanacaste-transport" style={styles.inlineLink}>getting around Guanacaste</Link> covers rental cars, shuttles and when you can skip a car entirely.</Text>
          </View>

          {/* FAQ (visible; matches FAQPage schema above) */}
          <View style={styles.article}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Frequently asked questions</Text>
            {LIR_FAQ.map((f, i) => (
              <View key={i} style={styles.faqItem}>
                <Text accessibilityRole="header" aria-level={3} style={styles.faqQ}>{f.q}</Text>
                <Text style={styles.p}>{f.a}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.freshness}>Inventory and ratings checked {TRANSFERS_CHECKED_AT}. Prices and availability are confirmed on Viator.</Text>
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
  h1: { color: color.ink, fontFamily: font.display, fontSize: 34, fontWeight: '600', letterSpacing: -0.4 },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 680 },
  resultHead: { color: color.ink, fontFamily: font.body, fontSize: 15, fontWeight: '700', marginTop: space[5], marginBottom: space[3] },
  empty: { color: color.muted, fontFamily: font.body, fontSize: 15, paddingVertical: space[6] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  inlineLink: { color: color.sky, fontWeight: '700' },
  article: { marginTop: space[8], maxWidth: 720, gap: space[2] },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 25, fontWeight: '600', marginBottom: space[1] },
  h3: { color: color.ink, fontFamily: font.body, fontSize: 17, fontWeight: '700', marginTop: space[4] },
  p: { color: color.body, fontFamily: font.body, fontSize: 15.5, lineHeight: 24 },
  b: { fontWeight: '700', color: color.ink },
  faqItem: { marginTop: space[4], gap: space[1] },
  faqQ: { color: color.ink, fontFamily: font.body, fontSize: 16, fontWeight: '700' },
  freshness: { color: color.faint, fontFamily: font.body, fontSize: 12.5, marginTop: space[8] },
});
