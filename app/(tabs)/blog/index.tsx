import { SITE_URL } from '../../../lib/constants';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Icon } from '../../../components/Icon';
import { Seo } from '../../../components/Seo';
import { SiteFooter } from '../../../components/SiteFooter';
import { color, font, space, radius, shadow, layout } from '../../../lib/theme';
import {
  getAllPosts, getFeaturedPost, getActiveCategories, readingTimeMinutes, formatDate, type BlogPost,
} from '../../../lib/blog';

export const metadata = {
  title: 'Guanacaste Travel Blog — Planning Guides & Local Insight',
  description:
    'Practical, well-researched guides to travelling in Guanacaste, Costa Rica: when to visit, what to do, where to stay near the action, and how to plan tours and day trips.',
  openGraph: {
    title: 'Guanacaste Travel Blog',
    description: 'Practical, well-researched guides to travelling in Guanacaste, Costa Rica.',
    type: 'website',
    url: `${SITE_URL}/blog/`,
    siteName: 'Guanacaste Experiences',
    images: [{ url: '/images/og-home.jpg', width: 1200, height: 630, alt: 'Guanacaste, Costa Rica' }],
  },
  alternates: { canonical: `${SITE_URL}/blog/` },
};

const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

function jsonLd(posts: BlogPost[]) {
  return [
    {
      '@context': 'https://schema.org', '@type': 'Blog',
      '@id': `${SITE_URL}/blog/#blog`,
      name: 'Guanacaste Experiences Travel Blog',
      url: `${SITE_URL}/blog/`,
      publisher: { '@type': 'Organization', name: 'Guanacaste Experiences', url: SITE_URL },
      blogPost: posts.slice(0, 10).map((p) => ({
        '@type': 'BlogPosting', headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}/`, datePublished: p.published,
        dateModified: p.updated ?? p.published,
      })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog/` },
      ],
    },
  ];
}

function Meta({ post, light }: { post: BlogPost; light?: boolean }) {
  const c = light ? 'rgba(255,255,255,0.85)' : color.muted;
  return (
    <View style={styles.metaRow}>
      <Text style={[styles.metaText, { color: c }]}>{formatDate(post.published)}</Text>
      <Text style={[styles.metaDot, { color: c }]}>·</Text>
      <Text style={[styles.metaText, { color: c }]}>{readingTimeMinutes(post)} min read</Text>
    </View>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} asChild>
      <TouchableOpacity
        accessibilityRole="link"
        accessibilityLabel={`${post.title} — ${readingTimeMinutes(post)} minute read`}
        href={`/blog/${post.slug}`}
        style={StyleSheet.flatten([styles.card, cardShadow])}
        activeOpacity={0.92}
      >
        <View style={styles.cardImgWrap}>
          <Image source={{ uri: post.hero.src }} style={styles.cardImg} resizeMode="cover"
            accessibilityLabel={post.hero.alt} {...(Platform.OS === 'web' ? { alt: post.hero.alt, loading: 'lazy' } as object : {})} />
          <View style={styles.catBadge}><Text style={styles.catBadgeText}>{post.category}</Text></View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>{post.title}</Text>
          <Text style={styles.cardExcerpt} numberOfLines={2}>{post.excerpt}</Text>
          <Meta post={post} />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const rest = posts.filter((p) => p.slug !== featured?.slug);
  const categories = getActiveCategories();

  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd(posts)} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.crumb}>
              <Link href="/" style={styles.crumbLink}>Home</Link>
              <Text style={styles.crumbSep}>/</Text>
              <Text style={styles.crumbCurrent}>Blog</Text>
            </View>
            <Text style={styles.eyebrow}>Guanacaste travel journal</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Guanacaste, planned properly</Text>
            <Text style={styles.lead}>
              Clear, well-sourced guides to help you decide when to go, what to do, and how to make the most
              of your time in Guanacaste and the wider Nicoya Peninsula — written to help you plan, not to sell.
            </Text>
          </View>

          {posts.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="book-outline" size={40} color={color.muted} />
              <Text style={styles.emptyTitle}>The first guides are on the way</Text>
              <Text style={styles.emptyText}>
                We’re researching and writing practical Guanacaste travel guides. In the meantime, browse the
                experiences by activity or destination.
              </Text>
              <View style={styles.emptyActions}>
                <Link href="/tours" asChild><TouchableOpacity accessibilityRole="link" href="/tours" style={styles.emptyBtn}><Text style={styles.emptyBtnText}>Browse all tours</Text></TouchableOpacity></Link>
                <Link href="/destinations" asChild><TouchableOpacity accessibilityRole="link" href="/destinations" style={styles.emptyBtnGhost}><Text style={styles.emptyBtnGhostText}>Explore destinations</Text></TouchableOpacity></Link>
              </View>
            </View>
          ) : (
            <>
              {/* Featured */}
              {featured ? (
                <Link href={`/blog/${featured.slug}`} asChild>
                  <TouchableOpacity accessibilityRole="link" accessibilityLabel={`Featured: ${featured.title}`}
                    href={`/blog/${featured.slug}`} style={StyleSheet.flatten([styles.featured, cardShadow])} activeOpacity={0.94}>
                    <View style={styles.featuredImgWrap}>
                      <Image source={{ uri: featured.hero.src }} style={styles.featuredImg} resizeMode="cover"
                        accessibilityLabel={featured.hero.alt} {...(Platform.OS === 'web' ? { alt: featured.hero.alt } as object : {})} />
                      <View style={styles.featuredScrim} />
                      <View style={styles.featuredOverlay}>
                        <View style={styles.featuredTag}><Text style={styles.featuredTagText}>Featured · {featured.category}</Text></View>
                        <Text style={styles.featuredTitle}>{featured.title}</Text>
                        <Text style={styles.featuredExcerpt} numberOfLines={2}>{featured.excerpt}</Text>
                        <Meta post={featured} light />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              ) : null}

              {/* Categories */}
              {categories.length > 1 ? (
                <View style={styles.catRow}>
                  <Text style={styles.catLabel}>Topics:</Text>
                  {categories.map((c) => (
                    <View key={c.category} style={styles.catChip}>
                      <Text style={styles.catChipText}>{c.category}</Text>
                      <Text style={styles.catChipCount}>{c.count}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Recent */}
              {rest.length > 0 ? (
                <View style={styles.section}>
                  <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Latest guides</Text>
                  <View style={styles.grid}>
                    {rest.map((p) => <ArticleCard key={p.slug} post={p} />)}
                  </View>
                </View>
              ) : null}

              {/* Tie back to experiences */}
              <View style={styles.tieback}>
                <Text style={styles.tiebackText}>Ready to book what you’ve been reading about?</Text>
                <Link href="/tours" asChild>
                  <TouchableOpacity accessibilityRole="link" href="/tours" style={styles.tiebackBtn}>
                    <Text style={styles.tiebackBtnText}>Browse all Guanacaste tours</Text>
                    <Icon name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </Link>
              </View>
            </>
          )}
        </View>
        <SiteFooter />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.ground },
  content: { flexGrow: 1, paddingBottom: space[12] },
  page: { width: '100%', alignSelf: 'center' },
  header: { paddingHorizontal: layout.gutter, paddingTop: space[6], paddingBottom: space[6] },
  crumb: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginBottom: space[4] },
  crumbLink: { color: color.sky, fontFamily: font.body, fontSize: 13.5, fontWeight: '600' },
  crumbSep: { color: color.faint, fontSize: 13.5 },
  crumbCurrent: { color: color.muted, fontFamily: font.body, fontSize: 13.5 },
  eyebrow: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: space[2] },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 40, lineHeight: 46, fontWeight: '600', letterSpacing: -0.5, marginBottom: space[3] },
  lead: { color: color.body, fontFamily: font.body, fontSize: 17, lineHeight: 27, maxWidth: 660 },

  empty: { alignItems: 'center', gap: space[3], paddingHorizontal: layout.gutter, paddingVertical: space[16], maxWidth: 520, alignSelf: 'center' },
  emptyTitle: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600', textAlign: 'center' },
  emptyText: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, textAlign: 'center' },
  emptyActions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3], justifyContent: 'center', marginTop: space[2] },
  emptyBtn: { backgroundColor: color.coral, paddingHorizontal: space[6], paddingVertical: 13, borderRadius: radius.pill, minHeight: 48, justifyContent: 'center' },
  emptyBtnText: { color: '#fff', fontFamily: font.body, fontSize: 15, fontWeight: '700' },
  emptyBtnGhost: { borderWidth: 1, borderColor: color.border, paddingHorizontal: space[6], paddingVertical: 13, borderRadius: radius.pill, minHeight: 48, justifyContent: 'center' },
  emptyBtnGhostText: { color: color.primary, fontFamily: font.body, fontSize: 15, fontWeight: '700' },

  featured: { marginHorizontal: layout.gutter, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: color.primary, marginBottom: space[6] },
  featuredImgWrap: { minHeight: 340, justifyContent: 'flex-end' },
  featuredImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  featuredScrim: { ...StyleSheet.absoluteFillObject, ...Platform.select({ web: { backgroundImage: 'linear-gradient(180deg, rgba(8,47,59,0.1) 30%, rgba(8,47,59,0.88) 100%)' } as object, default: { backgroundColor: 'rgba(8,47,59,0.55)' } }) },
  featuredOverlay: { padding: space[6], gap: space[2] },
  featuredTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(232,168,73,0.9)', paddingHorizontal: space[3], paddingVertical: 4, borderRadius: radius.pill },
  featuredTagText: { color: '#3a2a08', fontFamily: font.body, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  featuredTitle: { color: '#fff', fontFamily: font.display, fontSize: 30, lineHeight: 36, fontWeight: '600', letterSpacing: -0.4, maxWidth: 640 },
  featuredExcerpt: { color: 'rgba(255,255,255,0.9)', fontFamily: font.body, fontSize: 16, lineHeight: 24, maxWidth: 600 },

  catRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2], paddingHorizontal: layout.gutter, marginBottom: space[6] },
  catLabel: { color: color.muted, fontFamily: font.body, fontSize: 13.5, fontWeight: '600', marginRight: space[1] },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: space[3] },
  catChipText: { color: color.body, fontFamily: font.body, fontSize: 13.5, fontWeight: '600' },
  catChipCount: { color: color.muted, fontFamily: font.body, fontSize: 12, fontWeight: '700' },

  section: { paddingHorizontal: layout.gutter },
  sectionTitle: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600', letterSpacing: -0.3, marginBottom: space[5] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[5] },

  card: { flexGrow: 1, flexBasis: 300, maxWidth: 380, backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: color.border },
  cardImgWrap: { height: 190, backgroundColor: color.surfaceAlt, position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  catBadge: { position: 'absolute', top: space[3], left: space[3], backgroundColor: 'rgba(11,65,85,0.92)', paddingHorizontal: space[2], paddingVertical: 3, borderRadius: radius.sm },
  catBadgeText: { color: '#fff', fontFamily: font.body, fontSize: 11, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase' },
  cardBody: { padding: space[4], gap: space[2] },
  cardTitle: { color: color.ink, fontFamily: font.body, fontSize: 18, lineHeight: 24, fontWeight: '700' },
  cardExcerpt: { color: color.body, fontFamily: font.body, fontSize: 14.5, lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginTop: space[1] },
  metaText: { fontFamily: font.body, fontSize: 12.5, fontWeight: '600' },
  metaDot: { fontSize: 12.5 },

  tieback: { marginTop: space[10], marginHorizontal: layout.gutter, padding: space[6], backgroundColor: color.surfaceAlt, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, alignItems: 'center', gap: space[3] },
  tiebackText: { color: color.ink, fontFamily: font.display, fontSize: 20, fontWeight: '600', textAlign: 'center' },
  tiebackBtn: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.coral, paddingHorizontal: space[6], paddingVertical: 13, borderRadius: radius.pill, minHeight: 48 },
  tiebackBtnText: { color: '#fff', fontFamily: font.body, fontSize: 15, fontWeight: '700' },
});
