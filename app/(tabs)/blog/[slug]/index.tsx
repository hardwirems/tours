import { SITE_URL } from '../../../../lib/constants';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Icon } from '../../../../components/Icon';
import { Seo } from '../../../../components/Seo';
import { SiteFooter } from '../../../../components/SiteFooter';
import { AffiliateDisclosure } from '../../../../components/AffiliateDisclosure';
import { ArticleRenderer, RichText } from '../../../../components/blog/ArticleRenderer';
import { useRouteParam } from '../../../../lib/useRouteParam';
import { color, font, space, radius, shadow, layout } from '../../../../lib/theme';
import {
  getPostBySlug, getRelatedPosts, readingTimeMinutes, wordCount, formatDate, tableOfContents,
  type BlogPost,
} from '../../../../lib/blog';
import { getAllPosts } from '../../../../lib/blog';
import { getTourBySlug } from '../../../../lib/tours';
import { getDestinationBySlug } from '../../../../lib/seo-content';

const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

function articleJsonLd(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const img = /^https?:/.test(post.hero.src) ? post.hero.src : `${SITE_URL}${post.hero.src}`;
  return [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      image: { '@type': 'ImageObject', url: img, caption: post.hero.alt },
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      author: { '@type': 'Organization', name: post.author.name, url: `${SITE_URL}/about/` },
      publisher: {
        '@type': 'Organization', name: 'Guanacaste Experiences', url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      isPartOf: { '@type': 'Blog', '@id': `${SITE_URL}/blog/#blog` },
      articleSection: post.category,
      keywords: post.tags.join(', '),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
}

function metaFor(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const img = /^https?:/.test(post.hero.src) ? post.hero.src : post.hero.src;
  return {
    title: post.metaTitle,
    description: post.description,
    openGraph: {
      title: post.title, description: post.description, type: 'article',
      url, siteName: 'Guanacaste Experiences', locale: 'en_US',
      images: [{ url: img, width: post.hero.width ?? 1200, height: post.hero.height ?? 675, alt: post.hero.alt }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [img] },
    alternates: { canonical: url },
    // Drafts (shown only on the preview build) must never be indexed anywhere.
    robots: post.draft ? { index: false, follow: true } : undefined,
  };
}

function RelatedTour({ slug }: { slug: string }) {
  const tour = getTourBySlug(slug);
  if (!tour) return null;
  return (
    <Link href={`/tours/${tour.slug}`} asChild>
      <TouchableOpacity accessibilityRole="link" href={`/tours/${tour.slug}`}
        style={StyleSheet.flatten([styles.relTour, cardShadow])} activeOpacity={0.92}>
        <Image source={{ uri: tour.images[0]?.src }} style={styles.relTourImg} resizeMode="cover"
          accessibilityLabel={tour.title} {...(Platform.OS === 'web' ? { alt: tour.title, loading: 'lazy' } as object : {})} />
        <View style={styles.relTourBody}>
          <Text style={styles.relTourTown}>{tour.towns?.[0] ?? 'Guanacaste'}</Text>
          <Text style={styles.relTourTitle} numberOfLines={2}>{tour.title}</Text>
          <Text style={styles.relTourPrice}>from ${tour.priceFrom}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function BlogArticle() {
  const slug = useRouteParam('slug');
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <>
        <Seo metadata={{ title: 'Article not found — Guanacaste Experiences', robots: { index: false, follow: true } }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Article not found</Text>
          <Link href="/blog" style={styles.notFoundLink}>Back to the blog</Link>
        </View>
      </>
    );
  }

  const toc = tableOfContents(post);
  const showToc = toc.length >= 3 && wordCount(post) > 900;
  const related = getRelatedPosts(post, 3);
  const usesAffiliate = post.cta.href.startsWith('/go/') || post.body.some((b) => b.type === 'cta' && b.href.startsWith('/go/'));

  return (
    <>
      <Seo metadata={metaFor(post)} jsonLd={articleJsonLd(post)} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: post.hero.src }} style={styles.heroImg} resizeMode="cover"
            accessibilityLabel={post.hero.alt}
            {...(Platform.OS === 'web' ? { alt: post.hero.alt, fetchpriority: 'high' } as object : {})} />
          <View style={styles.heroScrim} />
        </View>

        <View style={[styles.page, { maxWidth: 760 }]}>
          {/* Breadcrumb */}
          <View style={styles.crumb}>
            <Link href="/" style={styles.crumbLink}>Home</Link>
            <Text style={styles.crumbSep}>/</Text>
            <Link href="/blog" style={styles.crumbLink}>Blog</Link>
            <Text style={styles.crumbSep}>/</Text>
            <Text style={styles.crumbCurrent} numberOfLines={1}>{post.title}</Text>
          </View>

          <View style={styles.catPill}><Text style={styles.catPillText}>{post.category}</Text></View>
          <Text accessibilityRole="header" aria-level={1} style={styles.h1}>{post.title}</Text>

          {/* Byline */}
          <View style={styles.byline}>
            <Text style={styles.bylineAuthor}>{post.author.name}</Text>
            <Text style={styles.bylineSep}>·</Text>
            <Text style={styles.bylineText}>{formatDate(post.published)}</Text>
            {post.updated ? <><Text style={styles.bylineSep}>·</Text><Text style={styles.bylineText}>Updated {formatDate(post.updated)}</Text></> : null}
            <Text style={styles.bylineSep}>·</Text>
            <Text style={styles.bylineText}>{readingTimeMinutes(post)} min read</Text>
          </View>
          {post.hero.credit && post.hero.credit.attributionRequired ? (
            <Text style={styles.heroCredit}>Hero photo: {post.hero.credit.author} / {post.hero.credit.source} ({post.hero.credit.license})</Text>
          ) : null}

          {/* Table of contents */}
          {showToc ? (
            <View style={styles.toc}>
              <Text accessibilityRole="header" aria-level={2} style={styles.tocTitle}>In this guide</Text>
              {toc.map((t) => (
                <Link key={t.id} href={`#${t.id}`} style={[styles.tocLink, t.level === 3 && styles.tocLinkSub]}>{t.text}</Link>
              ))}
            </View>
          ) : null}

          {/* Body */}
          <ArticleRenderer blocks={post.body} />

          {/* Affiliate disclosure */}
          {usesAffiliate ? (
            <View style={styles.disclosureWrap}>
              <AffiliateDisclosure mini />
            </View>
          ) : null}

          {/* Sources */}
          {post.sources.length ? (
            <View style={styles.sources}>
              <Text accessibilityRole="header" aria-level={2} style={styles.sourcesTitle}>Sources</Text>
              <Text style={styles.sourcesNote}>Facts in this guide were checked against these references on the dates shown.</Text>
              <View style={styles.sourceList}>
                {post.sources.map((s, i) => (
                  <View key={i} style={styles.sourceItem}>
                    <Icon name="link-outline" size={14} color={color.sky} style={{ marginTop: 4 }} />
                    <Text style={styles.sourceText}>
                      <RichText text={`[${s.title}](${s.url})`} style={styles.sourceLinkText} />
                      <Text style={styles.sourceMeta}>  — {s.supports} (accessed {formatDate(s.accessed)})</Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Primary CTA */}
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Plan this trip</Text>
            <Text style={styles.ctaText}>Browse the tours that fit what you’ve just read — real operators, real prices, book direct.</Text>
            <Link href={post.cta.href} asChild>
              <TouchableOpacity accessibilityRole="link" href={post.cta.href}
                {...(post.cta.href.startsWith('/go/') ? { hrefAttrs: { rel: 'sponsored noopener' } } as object : {})}
                style={styles.ctaBtn}>
                <Text style={styles.ctaBtnText}>{post.cta.label}</Text>
                <Icon name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </Link>
          </View>

          {/* Related experiences */}
          {post.relatedTours.length ? (
            <View style={styles.relSection}>
              <Text accessibilityRole="header" aria-level={2} style={styles.relTitle}>Related experiences</Text>
              <View style={styles.relTourGrid}>
                {post.relatedTours.slice(0, 3).map((s) => <RelatedTour key={s} slug={s} />)}
              </View>
            </View>
          ) : null}

          {/* Related destinations */}
          {post.relatedDestinations.length ? (
            <View style={styles.destLinks}>
              {post.relatedDestinations.map((s) => {
                const d = getDestinationBySlug(s);
                if (!d) return null;
                return <Link key={s} href={`/destinations/${d.slug}`} style={styles.destLink}>Tours in {d.town} →</Link>;
              })}
            </View>
          ) : null}

          {/* Related articles */}
          {related.length ? (
            <View style={styles.relSection}>
              <Text accessibilityRole="header" aria-level={2} style={styles.relTitle}>Keep reading</Text>
              <View style={styles.relPostList}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} asChild>
                    <TouchableOpacity accessibilityRole="link" href={`/blog/${p.slug}`} style={styles.relPost} activeOpacity={0.9}>
                      <Image source={{ uri: p.hero.src }} style={styles.relPostImg} resizeMode="cover"
                        accessibilityLabel={p.hero.alt} {...(Platform.OS === 'web' ? { alt: p.hero.alt, loading: 'lazy' } as object : {})} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.relPostCat}>{p.category}</Text>
                        <Text style={styles.relPostTitle} numberOfLines={2}>{p.title}</Text>
                        <Text style={styles.relPostMeta}>{readingTimeMinutes(p)} min read</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </View>
          ) : null}
        </View>
        <SiteFooter />
      </ScrollView>
    </>
  );
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.ground },
  content: { flexGrow: 1, paddingBottom: space[12] },
  hero: { height: 380, backgroundColor: color.primary, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroScrim: { ...StyleSheet.absoluteFillObject, ...Platform.select({ web: { backgroundImage: 'linear-gradient(180deg, rgba(8,47,59,0) 60%, rgba(8,47,59,0.25) 100%)' } as object, default: {} }) },
  page: { width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter, paddingTop: space[6] },
  crumb: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginBottom: space[4], flexWrap: 'wrap' },
  crumbLink: { color: color.sky, fontFamily: font.body, fontSize: 13.5, fontWeight: '600' },
  crumbSep: { color: color.faint, fontSize: 13.5 },
  crumbCurrent: { color: color.muted, fontFamily: font.body, fontSize: 13.5, flexShrink: 1 },
  catPill: { alignSelf: 'flex-start', backgroundColor: color.skyLight, paddingHorizontal: space[3], paddingVertical: 5, borderRadius: radius.pill, marginBottom: space[3] },
  catPillText: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 36, lineHeight: 42, fontWeight: '600', letterSpacing: -0.5, marginBottom: space[4] },
  byline: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2] },
  bylineAuthor: { color: color.ink, fontFamily: font.body, fontSize: 14, fontWeight: '700' },
  bylineText: { color: color.muted, fontFamily: font.body, fontSize: 14 },
  bylineSep: { color: color.faint, fontSize: 14 },
  heroCredit: { color: color.faint, fontFamily: font.body, fontSize: 12, marginTop: space[2] },
  toc: { marginTop: space[6], padding: space[5], backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, gap: space[2] },
  tocTitle: { color: color.ink, fontFamily: font.body, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: space[1] },
  tocLink: { color: color.sky, fontFamily: font.body, fontSize: 15.5, lineHeight: 24, fontWeight: '600' },
  tocLinkSub: { paddingLeft: space[4], fontSize: 14.5, fontWeight: '500' },
  disclosureWrap: { marginTop: space[6] },
  sources: { marginTop: space[10], paddingTop: space[6], borderTopWidth: 1, borderTopColor: color.border, gap: space[2] },
  sourcesTitle: { color: color.ink, fontFamily: font.display, fontSize: 22, fontWeight: '600' },
  sourcesNote: { color: color.muted, fontFamily: font.body, fontSize: 14, lineHeight: 21 },
  sourceList: { gap: space[2], marginTop: space[2] },
  sourceItem: { flexDirection: 'row', gap: space[2], alignItems: 'flex-start' },
  sourceText: { flex: 1, fontFamily: font.body, fontSize: 14.5, lineHeight: 22 },
  sourceLinkText: { color: color.sky, fontWeight: '600' },
  sourceMeta: { color: color.muted },
  ctaCard: { marginTop: space[10], padding: space[6], backgroundColor: color.primary, borderRadius: radius.lg, gap: space[3], alignItems: 'flex-start' },
  ctaTitle: { color: '#fff', fontFamily: font.display, fontSize: 22, fontWeight: '600' },
  ctaText: { color: color.onDarkMuted, fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: color.coral, paddingHorizontal: space[6], paddingVertical: 13, borderRadius: radius.pill, minHeight: 48 },
  ctaBtnText: { color: '#fff', fontFamily: font.body, fontSize: 15, fontWeight: '700' },
  relSection: { marginTop: space[10] },
  relTitle: { color: color.ink, fontFamily: font.display, fontSize: 24, fontWeight: '600', letterSpacing: -0.3, marginBottom: space[5] },
  relTourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  relTour: { flexGrow: 1, flexBasis: 200, maxWidth: 240, backgroundColor: color.surface, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: color.border },
  relTourImg: { width: '100%', height: 120 },
  relTourBody: { padding: space[3], gap: 2 },
  relTourTown: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700' },
  relTourTitle: { color: color.ink, fontFamily: font.body, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  relTourPrice: { color: color.coral, fontFamily: font.body, fontSize: 13, fontWeight: '700', marginTop: 2 },
  destLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4], marginTop: space[5] },
  destLink: { color: color.coral, fontFamily: font.body, fontSize: 15, fontWeight: '700' },
  relPostList: { gap: space[3] },
  relPost: { flexDirection: 'row', gap: space[4], alignItems: 'center', backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: space[3] },
  relPostImg: { width: 96, height: 72, borderRadius: radius.sm, backgroundColor: color.surfaceAlt },
  relPostCat: { color: color.sky, fontFamily: font.body, fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  relPostTitle: { color: color.ink, fontFamily: font.body, fontSize: 16, lineHeight: 21, fontWeight: '700' },
  relPostMeta: { color: color.muted, fontFamily: font.body, fontSize: 12.5, marginTop: 2 },
  notFound: { flex: 1, backgroundColor: color.ground, alignItems: 'center', justifyContent: 'center', padding: space[6], gap: space[3], minHeight: 400 },
  notFoundText: { color: color.muted, fontFamily: font.body, fontSize: 18, fontWeight: '600' },
  notFoundLink: { color: color.coral, fontFamily: font.body, fontSize: 15, fontWeight: '700' },
});
