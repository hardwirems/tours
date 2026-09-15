import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';
import { CF_BEACON_TOKEN, GSC_VERIFICATION, GA_MEASUREMENT_ID } from '../lib/constants';

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

        {/* Blog RSS feed autodiscovery */}
        <link rel="alternate" type="application/rss+xml" title="Guanacaste Experiences — Travel Blog" href="/blog-rss.xml" />

        {/* Fonts — Fraunces (display) + DM Sans (body). Loaded OFF the critical path:
            an inline injector attaches the stylesheet with media="print", then flips it
            to "all" once it loads, so the font CSS never render-blocks (display=swap keeps
            text visible in the fallback meanwhile). <noscript> preserves no-JS/crawlers. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var u='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap';var l=document.createElement('link');l.rel='stylesheet';l.href=u;l.media='print';l.onload=function(){this.media='all';};document.head.appendChild(l);})();",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap"
          />
        </noscript>

        <ScrollViewStyleReset />

        {/* Google Analytics 4 (gtag.js). Consent Mode + config run immediately (tiny,
            inline); the ~70KB gtag.js download is deferred off the critical path —
            loaded on the first user interaction, or 3s after load — so it never
            competes with the LCP hero for bandwidth. Queued calls flush when it loads. */}
        {GA_MEASUREMENT_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html:
                `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
                `var _c='denied';try{if(localStorage.getItem('cookie_consent')==='granted')_c='granted';}catch(e){}` +
                `gtag('consent','default',{analytics_storage:_c,ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});` +
                `gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');` +
                `var _gl=0;function _loadGA(){if(_gl)return;_gl=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';document.head.appendChild(s);}` +
                `['scroll','click','keydown','touchstart','pointerdown'].forEach(function(e){addEventListener(e,_loadGA,{once:true,passive:true});});` +
                `addEventListener('load',function(){setTimeout(_loadGA,3000);});`,
            }}
          />
        ) : null}

        {/* Cloudflare Web Analytics — privacy-first, no cookies. */}
        {CF_BEACON_TOKEN ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_BEACON_TOKEN}"}`}
          />
        ) : null}
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        {/* Move keyboard focus into the main content when the skip link is used,
            so the next Tab continues inside the content rather than the header. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a.skip-link');if(!a)return;var m=document.getElementById('main');if(m){m.setAttribute('tabindex','-1');m.focus({preventScroll:false});}});",
          }}
        />
        {/* Booking-click conversions (GA4 key event `click_viator_booking`). One
            listener for every outbound /go/ link on every page — hydrated or not —
            reading the data-* attributes set by bookingDataSet() (lib/analytics.ts).
            A normal click waits (max ~1.2s) for the event to send before navigating,
            so the conversion isn't lost when the page unloads; new-tab clicks send
            without delay. Listens in the CAPTURE phase: RN-Web pressables stop click
            propagation, so a bubbling listener never sees clicks on booking buttons.
            No personal data. Consent is enforced by GA4 Consent Mode. */}
        {GA_MEASUREMENT_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){" +
                "function link(t){return t&&t.closest?t.closest('a[href^=\"/go/\"]'):null;}" +
                "function params(a){var d=a.dataset||{},p={link_path:(a.getAttribute('href')||'').split('?')[0],page_path:location.pathname};" +
                "if(d.itemId)p.item_id=d.itemId;if(d.itemName)p.item_name=d.itemName;if(d.itemCategory)p.item_category=d.itemCategory;" +
                "if(d.itemList)p.item_list_id=d.itemList;if(d.placement)p.placement=d.placement;if(d.price)p.price=Number(d.price);" +
                "if(d.estCommission){p.value=Number(d.estCommission);p.currency='USD';}return p;}" +
                "function send(a,cb){if(typeof window.gtag!=='function'){if(cb)cb();return;}" +
                "if(typeof window._loadGA==='function')window._loadGA();" +
                "var p=params(a);if(cb){p.event_callback=cb;p.event_timeout=1200;}window.gtag('event','click_viator_booking',p);}" +
                "document.addEventListener('click',function(e){var a=link(e.target);if(!a)return;" +
                "if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'){send(a);return;}" +
                "e.preventDefault();var href=a.href,done=false;function go(){if(done)return;done=true;window.location.href=href;}" +
                "send(a,go);setTimeout(go,1200);},true);" +
                "document.addEventListener('auxclick',function(e){if(e.button!==1)return;var a=link(e.target);if(a)send(a);},true);" +
                "})();",
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
