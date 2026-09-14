import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SITE_URL } from '../../../lib/constants';
import { Seo } from '../../../components/Seo';
import { SiteFooter } from '../../../components/SiteFooter';
import { Breadcrumbs, ChoiceCard, TransferDisclosure } from '../../../components/transportation/TransportUI';
import { ROUTES } from '../../../lib/transportation-content';
import { track } from '../../../lib/analytics';
import { color, font, space, radius, layout } from '../../../lib/theme';

export const metadata = {
  title: 'Guanacaste Transportation: Airport Transfers & Rentals',
  description:
    'How to get around Guanacaste, Costa Rica: private airport transfers from Liberia (LIR), and honest guidance on local transport like golf carts and rental cars.',
  openGraph: { title: 'Transportation in Guanacaste', description: 'Airport transfers and getting around Guanacaste, Costa Rica.', type: 'website', url: `${SITE_URL}/transportation/`, siteName: 'Guanacaste Experiences' },
  alternates: { canonical: `${SITE_URL}/transportation/` },
};

export const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
  ] },
];

export default function TransportationHub() {
  useEffect(() => { track('view_transportation_hub', { section: 'hub' }); }, []);
  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation' }]} />
            <Text style={styles.eyebrow}>Getting around · Guanacaste, Costa Rica</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Transportation in Guanacaste</Text>
            <Text style={styles.lead}>
              Two things travelers ask most: how to get from the airport to the beach, and how to get around once
              you’re there. Start with an airport transfer, or read our honest take on local transport.
            </Text>
          </View>

          <View style={styles.choices}>
            <ChoiceCard
              href="/transportation/airport-transfers/lir"
              icon="airplane" title="Airport transfers"
              desc="Private, door-to-door transfers from Liberia Airport (LIR) to Tamarindo, Papagayo, Flamingo and beyond — booked through Viator."
              cta="Find your transfer"
              onPress={() => track('select_transport_type', { section: 'hub', type: 'airport_transfer' })}
            />
            <ChoiceCard
              href="/transportation/getting-around"
              icon="car" title="Getting around locally"
              desc="Golf carts, scooters, rental cars and more — what’s worth it, what to know, and what’s actually bookable."
              cta="See local options"
              onPress={() => track('select_transport_type', { section: 'hub', type: 'local' })}
            />
          </View>

          <View style={styles.routesBlock}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Popular airport routes</Text>
            <View style={styles.routeLinks}>
              {ROUTES.map((r) => (
                <Link key={r.slug} href={`/transportation/airport-transfers/lir/${r.slug}`} style={styles.routeLink}>
                  LIR → {r.short}
                </Link>
              ))}
              <Link href="/transportation/airport-transfers/sjo" style={styles.routeLink}>From San José (SJO)?</Link>
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
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 660 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  routesBlock: { marginTop: space[8], gap: space[3] },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600' },
  routeLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  routeLink: { color: color.sky, fontFamily: font.body, fontSize: 14.5, fontWeight: '600', backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: radius.pill, paddingHorizontal: space[4], paddingVertical: 9 },
});
