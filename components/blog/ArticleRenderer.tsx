import { Fragment } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'react-native';
import { Link } from 'expo-router';
import { Icon } from '../Icon';
import { color, font, type as ty, space, radius } from '../../lib/theme';
import { slugifyHeading, type Block, type Inline } from '../../lib/blog';

// ---------------------------------------------------------------------------
// ArticleRenderer — renders a BlogPost's typed content blocks with the site's
// design tokens. One renderer = consistent typography, spacing and colour for
// every article (hand-written or automation-generated).
// ---------------------------------------------------------------------------

const webCard = Platform.select({ web: { boxShadow: '0 1px 2px rgba(16,33,31,0.04), 0 8px 20px -14px rgba(16,33,31,0.16)' } as object, default: {} });

// --- Inline parser: [label](url) links + **bold**, nothing else. -----------
type Span = { t: 'text'; v: string } | { t: 'bold'; v: string } | { t: 'link'; v: string; href: string };

function parseInline(input: Inline): Span[] {
  const spans: Span[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    if (m.index > last) spans.push({ t: 'text', v: input.slice(last, m.index) });
    if (m[1] !== undefined) spans.push({ t: 'link', v: m[1], href: m[2] });
    else spans.push({ t: 'bold', v: m[3] });
    last = m.index + m[0].length;
  }
  if (last < input.length) spans.push({ t: 'text', v: input.slice(last) });
  return spans;
}

function InlineLink({ label, href }: { label: string; href: string }) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <Text
        accessibilityRole="link"
        // @ts-expect-error RN Web extension: renders a real <a>
        href={href}
        hrefAttrs={{ target: '_blank', rel: 'noopener noreferrer nofollow' }}
        style={styles.link}
      >
        {label}
      </Text>
    );
  }
  return (
    <Link href={href} style={styles.link}>
      {label}
    </Link>
  );
}

export function RichText({ text, style }: { text: Inline; style?: object }) {
  const spans = parseInline(text);
  return (
    <Text style={[styles.p, style]}>
      {spans.map((s, i) => {
        if (s.t === 'bold') return <Text key={i} style={styles.bold}>{s.v}</Text>;
        if (s.t === 'link') return <InlineLink key={i} label={s.v} href={s.href} />;
        return <Fragment key={i}>{s.v}</Fragment>;
      })}
    </Text>
  );
}

function CalloutBlock({ block }: { block: Extract<Block, { type: 'callout' }> }) {
  const cfgs = {
    tip: { bg: color.skyLight, bd: color.sky, ic: 'bulb-outline' as const, fg: color.primary },
    note: { bg: color.surfaceAlt, bd: color.border, ic: 'information-circle-outline' as const, fg: color.body },
    warning: { bg: color.sunLight, bd: color.sun, ic: 'alert-circle-outline' as const, fg: '#8B6914' },
  };
  // Fall back to `note` for any unknown variant — a bad value must never crash the
  // whole article render (which would blank the page, H1 and all).
  const cfg = cfgs[block.variant] ?? cfgs.note;
  return (
    <View style={[styles.callout, { backgroundColor: cfg.bg, borderColor: cfg.bd }]}>
      <Icon name={cfg.ic} size={18} color={cfg.bd} />
      <View style={{ flex: 1 }}>
        {block.title ? <Text style={[styles.calloutTitle, { color: cfg.fg }]}>{block.title}</Text> : null}
        <RichText text={block.text} style={styles.calloutText} />
      </View>
    </View>
  );
}

function TableBlock({ block }: { block: Extract<Block, { type: 'table' }> }) {
  return (
    <View style={styles.tableWrap}>
      {block.caption ? <Text style={styles.tableCaption}>{block.caption}</Text> : null}
      <View style={styles.tableScroll}>
        <View style={styles.table}>
          <View style={[styles.tr, styles.trHead]}>
            {block.headers.map((h, i) => (
              <View key={i} style={[styles.th, i === 0 && styles.cellFirst]}><Text style={styles.thText}>{h}</Text></View>
            ))}
          </View>
          {block.rows.map((row, r) => (
            <View key={r} style={[styles.tr, r % 2 === 1 && styles.trAlt]}>
              {row.map((cell, c) => (
                <View key={c} style={[styles.td, c === 0 && styles.cellFirst]}><RichText text={cell} style={styles.tdText} /></View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ImageBlock({ block }: { block: Extract<Block, { type: 'image' }> }) {
  return (
    <View style={styles.figure}>
      <Image
        source={{ uri: block.src }}
        style={styles.figureImg}
        resizeMode="cover"
        accessibilityLabel={block.alt}
        {...(Platform.OS === 'web' ? { alt: block.alt, loading: 'lazy' } as object : {})}
      />
      {block.caption || (block.credit && block.credit.attributionRequired) ? (
        <Text style={styles.caption}>
          {block.caption ? <RichText text={block.caption} style={styles.captionText} /> : null}
          {block.credit && block.credit.attributionRequired ? (
            <Text style={styles.creditText}>
              {block.caption ? '  ' : ''}Photo: {block.credit.author} / {block.credit.source} ({block.credit.license})
            </Text>
          ) : null}
        </Text>
      ) : null}
    </View>
  );
}

function CtaBlock({ block }: { block: Extract<Block, { type: 'cta' }> }) {
  const internal = block.href.startsWith('/');
  const Btn = (
    <View accessibilityRole={internal ? 'link' : 'link'} style={[styles.ctaBtn, webCard]}>
      <Text style={styles.ctaLabel}>{block.label}</Text>
      <Icon name="arrow-forward" size={16} color="#fff" />
    </View>
  );
  return (
    <View style={styles.ctaBlock}>
      {internal ? <Link href={block.href} asChild><View>{Btn}</View></Link> : (
        // @ts-expect-error RN Web href
        <View accessibilityRole="link" href={block.href} hrefAttrs={{ rel: 'sponsored noopener' }}>{Btn}</View>
      )}
      {block.note ? <Text style={styles.ctaNote}>{block.note}</Text> : null}
    </View>
  );
}

export function ArticleRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <View style={styles.prose}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return <Text key={i} accessibilityRole="header" aria-level={2} nativeID={b.id ?? slugifyHeading(b.text)} style={styles.h2}>{b.text}</Text>;
          case 'h3':
            return <Text key={i} accessibilityRole="header" aria-level={3} nativeID={b.id ?? slugifyHeading(b.text)} style={styles.h3}>{b.text}</Text>;
          case 'p':
            return <RichText key={i} text={b.text} />;
          case 'ul':
            return (
              <View key={i} style={styles.list}>
                {b.items.map((it, j) => (
                  <View key={j} style={styles.li}><Icon name="ellipse" size={6} color={color.sky} style={styles.bulletDot} /><RichText text={it} style={styles.liText} /></View>
                ))}
              </View>
            );
          case 'ol':
            return (
              <View key={i} style={styles.list}>
                {b.items.map((it, j) => (
                  <View key={j} style={styles.li}><Text style={styles.olNum}>{j + 1}.</Text><RichText text={it} style={styles.liText} /></View>
                ))}
              </View>
            );
          case 'table': return <TableBlock key={i} block={b} />;
          case 'image': return <ImageBlock key={i} block={b} />;
          case 'callout': return <CalloutBlock key={i} block={b} />;
          case 'quote':
            return (
              <View key={i} style={styles.quote}>
                <Text style={styles.quoteText}>{b.text}</Text>
                {b.cite ? <Text style={styles.quoteCite}>— {b.cite}</Text> : null}
              </View>
            );
          case 'cta': return <CtaBlock key={i} block={b} />;
          case 'faq':
            return (
              <View key={i} style={styles.faq}>
                {b.items.map((it, j) => (
                  <View key={j} style={styles.faqItem}>
                    <Text accessibilityRole="header" aria-level={3} style={styles.faqQ}>{it.q}</Text>
                    <RichText text={it.a} style={styles.faqA} />
                  </View>
                ))}
              </View>
            );
          default: return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  prose: { gap: space[4] },
  p: { color: color.body, fontFamily: font.body, fontSize: 17, lineHeight: 28 },
  bold: { fontWeight: '700', color: color.ink },
  link: { color: color.coral, fontWeight: '600', ...Platform.select({ web: { textDecorationLine: 'underline', textDecorationColor: 'rgba(198,67,47,0.35)' } as object }) },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 27, lineHeight: 33, fontWeight: '600', letterSpacing: -0.3, marginTop: space[6] },
  h3: { color: color.ink, fontFamily: font.body, fontSize: 20, lineHeight: 27, fontWeight: '700', marginTop: space[4] },
  list: { gap: space[2], paddingLeft: space[1] },
  li: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  bulletDot: { marginTop: 10 },
  olNum: { color: color.sky, fontFamily: font.body, fontSize: 17, fontWeight: '700', minWidth: 20 },
  liText: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 17, lineHeight: 27 },
  callout: { flexDirection: 'row', gap: space[3], padding: space[4], borderRadius: radius.md, borderWidth: 1, alignItems: 'flex-start' },
  calloutTitle: { fontFamily: font.body, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: space[1] },
  calloutText: { fontSize: 15.5, lineHeight: 24 },
  tableWrap: { gap: space[2] },
  tableCaption: { color: color.muted, fontFamily: font.body, fontSize: 13.5, fontStyle: 'italic' },
  tableScroll: { ...Platform.select({ web: { overflowX: 'auto' } as object }), borderWidth: 1, borderColor: color.border, borderRadius: radius.md },
  table: { minWidth: 480 },
  tr: { flexDirection: 'row' },
  trHead: { backgroundColor: color.surfaceAlt },
  trAlt: { backgroundColor: color.ground },
  th: { flex: 1, paddingVertical: space[3], paddingHorizontal: space[3], borderBottomWidth: 1, borderBottomColor: color.border },
  thText: { color: color.muted, fontFamily: font.body, fontSize: 12.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  td: { flex: 1, paddingVertical: space[3], paddingHorizontal: space[3], borderBottomWidth: 1, borderBottomColor: color.border },
  tdText: { fontSize: 15, lineHeight: 22 },
  cellFirst: { flex: 1.3 },
  figure: { gap: space[2] },
  figureImg: { width: '100%', height: 360, borderRadius: radius.lg, backgroundColor: color.surfaceAlt },
  caption: { flexDirection: 'row', flexWrap: 'wrap' },
  captionText: { color: color.muted, fontFamily: font.body, fontSize: 13.5, lineHeight: 20 },
  creditText: { color: color.faint, fontFamily: font.body, fontSize: 12.5, lineHeight: 20 },
  quote: { borderLeftWidth: 3, borderLeftColor: color.sun, paddingLeft: space[4], gap: space[1] },
  quoteText: { color: color.ink, fontFamily: font.display, fontSize: 20, lineHeight: 29, fontStyle: 'italic' },
  quoteCite: { color: color.muted, fontFamily: font.body, fontSize: 14 },
  ctaBlock: { gap: space[2], alignItems: 'flex-start', marginVertical: space[2] },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.coral, paddingHorizontal: space[6], paddingVertical: 13, borderRadius: radius.pill, minHeight: 48 },
  ctaLabel: { color: '#fff', fontFamily: font.body, fontSize: 15, fontWeight: '700' },
  ctaNote: { color: color.muted, fontFamily: font.body, fontSize: 13.5 },
  faq: { gap: space[4] },
  faqItem: { gap: space[1] },
  faqQ: { color: color.ink, fontFamily: font.body, fontSize: 17, fontWeight: '700' },
  faqA: { fontSize: 16, lineHeight: 25 },
});
