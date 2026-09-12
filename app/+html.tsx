import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';
import { CF_BEACON_TOKEN, GSC_VERIFICATION } from '../lib/constants';

// ---------------------------------------------------------------------------
// Root HTML document for the static web export. Per-page <title>/meta/canonical
// are injected by components/Seo.tsx (react-helmet). This file holds the global
// head: charset/viewport, optional Search Console tag, and the Cloudflare Web
// Analytics beacon. Both analytics/verification tags render only when their
// token is set in lib/constants.ts.
// ---------------------------------------------------------------------------

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {GSC_VERIFICATION ? (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        ) : null}

        <ScrollViewStyleReset />

        {/* Cloudflare Web Analytics — privacy-first, no cookies. */}
        {CF_BEACON_TOKEN ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_BEACON_TOKEN}"}`}
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
