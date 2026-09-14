import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SITE_URL } from '../../../../../../lib/constants';
import { useRouteParam } from '../../../../../../lib/useRouteParam';
import { Seo } from '../../../../../../components/Seo';
import { SiteFooter } from '../../../../../../components/SiteFooter';
import { Breadcrumbs, TransferDisclosure } from '../../../../../../components/transportation/TransportUI';
import { TransferCard } from '../../../../../../components/transportation/TransferCard';
import { TRANSFERS, TRANSFERS_CHECKED_AT } from '../../../../../../lib/transportation-data';
import { ROUTES } from '../../../../../../lib/transportation-content';
import { campaignId } from '../../../../../../lib/analytics';
import { color, font, space, layout } from '../../../../../../lib/theme';

export function generateStaticParams() { return ROUTES.map((r) => ({ destination: r.slug })); }

function paras(text: string, drive: string) {
  // render **bold** + {drive} substitution
  const s = text.replace('{drive}', drive);
  return s.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') ? <Text key={i} style={styles.b}>{chunk.slice(2, -2)}</Text> : <Text key={i}>{chunk}</Text>);
}

export default function RoutePage() {
  const slug = useRouteParam('destination');
  const route = ROUTES.find((r) => r.slug === slug);

  if (!route) {
    return (
      <>
        <Seo metadata={{ title: 'Route not found — Guanacaste Experiences', robots: { index: false, follow: true } }} />
        <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
          <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Route not found</Text>
            <Link href="/transportation/airport-transfers/lir" style={styles.inlineLink}>See all Liberia Airport transfers →</Link>
          </View>
          <SiteFooter />
        </ScrollView>
      </>
    );
  }

  const url = `${SITE_URL}/transportation/airport-transfers/lir/${route.slug}/`;
  const specific = TRANSFERS.filter((t) => t.origin === 'LIR' && t.zone === route.slug);
  const flexible = TRANSFERS.filter((t) => t.origin === 'LIR' && t.zone === 'guanacaste').slice(0, 6);
  const campaign = campaignId({ section: 'lir', airport: 'LIR', destination: route.slug });

  const metadata = {
    title: route.title,
    description: route.description,
    openGraph: { title: route.h1, description: route.description, type: 'website', url, siteName: 'Guanacaste Experiences' },
    alternates: { canonical: url },
  };
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
      { '@type': 'ListItem', position: 3, name: 'Airport transfers', item: `${SITE_URL}/transportation/airport-transfers/` },
      { '@type': 'ListItem', position: 4, name: 'Liberia (LIR)', item: `${SITE_URL}/transportation/airport-transfers/lir/` },
      { '@type': 'ListItem', position: 5, name: route.short, item: url },
    ] },
    ...(specific.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', name: route.h1, numberOfItems: specific.length, itemListElement: specific.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title })) }] : []),
  ];

  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation', href: '/transportation' }, { name: 'Airport transfers', href: '/transportation/airport-transfers' }, { name: 'Liberia (LIR)', href: '/transportation/airport-transfers/lir' }, { name: route.short }]} />
            <Text style={styles.eyebrow}>Liberia Airport (LIR) → {route.short}</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>{route.h1}</Text>
            {route.intro.map((t, i) => <Text key={i} style={styles.lead}>{paras(t, route.driveFromLIR)}</Text>)}
          </View>

          {specific.length > 0 ? (
            <>
              <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Transfers to {route.short}</Text>
              <View style={styles.grid}>{specific.map((p, i) => <TransferCard key={p.code} product={p} campaign={campaign} eager={i < 2} />)}</View>
            </>
          ) : null}

          <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Flexible transfers (any Guanacaste hotel)</Text>
          <Text style={styles.note}>These private transfers drop you at the address you provide, so they work for {route.short} too.</Text>
          <View style={styles.grid}>{flexible.map((p) => <TransferCard key={p.code} product={p} campaign={campaign} />)}</View>

          <TransferDisclosure />

          <View style={styles.article}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Good to know</Text>
            {route.tips.map((t, i) => (
              <View key={i} style={styles.tipRow}><Text style={styles.bullet}>•</Text><Text style={styles.p}>{t}</Text></View>
            ))}
            <Text style={[styles.p, { marginTop: space[4] }]}>
              {route.destSlug ? <>See more to do nearby in our <Link href={`/destinations/${route.destSlug}`} style={styles.inlineLink}>{route.short} destination guide</Link>, or </> : null}
              compare <Link href="/transportation/airport-transfers/lir" style={styles.inlineLink}>all Liberia Airport transfers</Link>.
            </Text>
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
  h1: { color: color.ink, fontFamily: font.display, fontSize: 32, fontWeight: '600', letterSpacing: -0.4 },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 700 },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600', marginTop: space[6], marginBottom: space[3] },
  note: { color: color.muted, fontFamily: font.body, fontSize: 14, marginBottom: space[3], maxWidth: 640 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  article: { marginTop: space[8], maxWidth: 720, gap: space[2] },
  tipRow: { flexDirection: 'row', gap: space[2], marginTop: space[2] },
  bullet: { color: color.coral, fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  p: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 15.5, lineHeight: 24 },
  b: { fontWeight: '700', color: color.ink },
  inlineLink: { color: color.sky, fontWeight: '700' },
  freshness: { color: color.faint, fontFamily: font.body, fontSize: 12.5, marginTop: space[8] },
});
