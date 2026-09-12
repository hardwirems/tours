import Head from 'expo-router/head';
import { SITE_URL } from '../lib/constants';

// ---------------------------------------------------------------------------
// <Seo> — renders SEO metadata into the document <head> for Expo Router's
// static web export. This replaces the Next.js-style `export const metadata`
// pattern, which Expo Router does NOT read. Pass the same metadata/jsonLd
// shapes the pages already define.
// ---------------------------------------------------------------------------

type OgImage = { url?: string; width?: number; height?: number; alt?: string };

export type SeoMeta = {
  title?: string;
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    locale?: string;
    url?: string;
    siteName?: string;
    images?: OgImage[];
  };
  twitter?: { card?: string; title?: string; description?: string; images?: string[] | string };
  alternates?: { canonical?: string };
  robots?: { index?: boolean; follow?: boolean };
};

function abs(u?: string): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
}

export function Seo({ metadata = {}, jsonLd }: { metadata?: SeoMeta; jsonLd?: unknown }) {
  const og = metadata.openGraph ?? {};
  const tw = metadata.twitter ?? {};
  const canonical = abs(metadata.alternates?.canonical);
  const r = metadata.robots;
  const robotsContent = `${r?.index === false ? 'noindex' : 'index'},${r?.follow === false ? 'nofollow' : 'follow'}`;
  const ogImg = og.images?.[0];
  const ogImgUrl = abs(ogImg?.url);
  const twImgRaw = Array.isArray(tw.images) ? tw.images[0] : tw.images;
  const twImg = abs(twImgRaw) ?? ogImgUrl;
  const ogUrl = abs(og.url) ?? canonical;

  return (
    <Head>
      {metadata.title ? <title>{metadata.title}</title> : null}
      {metadata.description ? <meta name="description" content={metadata.description} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:type" content={og.type ?? 'website'} />
      <meta property="og:site_name" content={og.siteName ?? 'Guanacaste Tours'} />
      <meta property="og:title" content={og.title ?? metadata.title ?? ''} />
      <meta property="og:description" content={og.description ?? metadata.description ?? ''} />
      {ogUrl ? <meta property="og:url" content={ogUrl} /> : null}
      {og.locale ? <meta property="og:locale" content={og.locale} /> : null}
      {ogImgUrl ? <meta property="og:image" content={ogImgUrl} /> : null}
      {ogImg?.width ? <meta property="og:image:width" content={String(ogImg.width)} /> : null}
      {ogImg?.height ? <meta property="og:image:height" content={String(ogImg.height)} /> : null}
      {ogImg?.alt ? <meta property="og:image:alt" content={ogImg.alt} /> : null}

      {/* Twitter */}
      <meta name="twitter:card" content={tw.card ?? 'summary_large_image'} />
      <meta name="twitter:title" content={tw.title ?? metadata.title ?? ''} />
      <meta name="twitter:description" content={tw.description ?? metadata.description ?? ''} />
      {twImg ? <meta name="twitter:image" content={twImg} /> : null}

      {/* Structured data. Escape "<" so a stray "</script>" in data can't break out. */}
      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>
      ) : null}
    </Head>
  );
}
