import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Icon } from '../Icon';
import { track } from '../../lib/analytics';
import { DISCLOSURE } from '../../lib/transportation-content';
import { color, font, space, radius, shadow } from '../../lib/theme';

// ---------------------------------------------------------------------------
// Shared UI for the transportation section: affiliate disclosure, the
// destination "finder" (crawlable filter chips), hub choice cards, breadcrumbs.
// ---------------------------------------------------------------------------

export function TransferDisclosure() {
  return (
    <View style={ds.box} {...(Platform.OS === 'web' ? ({ role: 'note' } as object) : {})}>
      <Icon name="information-circle" size={16} color={color.primary} />
      <Text style={ds.text}>{DISCLOSURE}</Text>
    </View>
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; href?: string }[] }) {
  return (
    <View style={bc.row} {...(Platform.OS === 'web' ? ({ role: 'navigation', 'aria-label': 'Breadcrumb' } as object) : {})}>
      {trail.map((c, i) => (
        <View key={i} style={bc.item}>
          {i > 0 ? <Text style={bc.sep}>/</Text> : null}
          {c.href ? (
            <Link href={c.href} style={bc.link}>{c.name}</Link>
          ) : (
            <Text style={bc.current} numberOfLines={1} aria-current="page">{c.name}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

// Destination filter chips. Each chip is a real link (?zone=slug) so the finder
// works without JS and stays crawlable; the page filters client-side on mount.
export function TransportFinder({ zones, active }: { zones: { slug: string; label: string }[]; active: string }) {
  return (
    <View style={fn.wrap}>
      <Text style={fn.label} nativeID="finder-label">Where are you headed?</Text>
      <View style={fn.chips} accessibilityLabel="Filter transfers by destination">
        {zones.map((z) => {
          const isActive = z.slug === active;
          return (
            <Link key={z.slug} href={z.slug === 'all' ? '/transportation/airport-transfers/lir' : `/transportation/airport-transfers/lir?zone=${z.slug}`} asChild>
              <TouchableOpacity
                accessibilityRole="link"
                aria-current={isActive ? 'true' : undefined}
                style={StyleSheet.flatten([fn.chip, isActive && fn.chipActive])}
                onPress={() => track('select_destination', { category: 'airport_transfer', airport: 'LIR', destination: z.slug })}
                activeOpacity={0.85}
              >
                <Text style={StyleSheet.flatten([fn.chipText, isActive && fn.chipTextActive])}>{z.label}</Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

export function ChoiceCard({ href, icon, title, desc, cta, onPress }: { href: string; icon: string; title: string; desc: string; cta: string; onPress?: () => void }) {
  const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });
  return (
    <Link href={href} asChild>
      <TouchableOpacity accessibilityRole="link" accessibilityLabel={title} style={StyleSheet.flatten([cc.card, cardShadow])} onPress={onPress} activeOpacity={0.92}>
        <View style={cc.iconWrap}><Icon name={icon} size={22} color={color.primary} /></View>
        <Text style={cc.title}>{title}</Text>
        <Text style={cc.desc}>{desc}</Text>
        <Text style={cc.cta}>{cta} →</Text>
      </TouchableOpacity>
    </Link>
  );
}

const ds = StyleSheet.create({
  box: { flexDirection: 'row', gap: space[2], alignItems: 'flex-start', backgroundColor: color.surfaceAlt, borderWidth: 1, borderColor: color.border, borderRadius: radius.md, padding: space[3], marginTop: space[4] },
  text: { flex: 1, color: color.muted, fontFamily: font.body, fontSize: 12.5, lineHeight: 18 },
});
const bc = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2] },
  item: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  sep: { color: color.faint, fontFamily: font.body, fontSize: 13 },
  link: { color: color.sky, fontFamily: font.body, fontSize: 13, fontWeight: '600' },
  current: { color: color.muted, fontFamily: font.body, fontSize: 13, maxWidth: 280 },
});
const fn = StyleSheet.create({
  wrap: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: radius.lg, padding: space[4], gap: space[3] },
  label: { color: color.ink, fontFamily: font.body, fontSize: 15, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: { minHeight: 40, justifyContent: 'center', paddingHorizontal: space[4], borderRadius: radius.pill, borderWidth: 1, borderColor: color.border, backgroundColor: color.surface },
  chipActive: { backgroundColor: color.primary, borderColor: color.primary },
  chipText: { color: color.body, fontFamily: font.body, fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
const cc = StyleSheet.create({
  card: { flexGrow: 1, flexBasis: 280, maxWidth: 460, backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: space[5], gap: space[2] },
  iconWrap: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: color.skyLight, alignItems: 'center', justifyContent: 'center', marginBottom: space[1] },
  title: { color: color.ink, fontFamily: font.display, fontSize: 20, fontWeight: '600' },
  desc: { color: color.body, fontFamily: font.body, fontSize: 14.5, lineHeight: 21 },
  cta: { color: color.coral, fontFamily: font.body, fontSize: 14, fontWeight: '700', marginTop: space[1] },
});
