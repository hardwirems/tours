# Scope — Light-HTML content pages (killing the JS tax on the blog)

_Prepared 2026-09-14. **Scoping only — no code changes in this document.** Measurements are
from the current `dist/` export of the live site._

## 1. The problem, measured

Every page on the site — the flagship blog post included — loads **one 2.0 MB JavaScript
bundle** (`/_expo/static/js/web/index-*.js`). There is **no code-splitting**: that single file
contains the whole app (all routes, all tour data, the React Native Web runtime, expo-router).

That one bundle is the direct cause of every JS finding PageSpeed flagged on content pages:

| PSI finding (mobile) | Root cause |
|---|---|
| Reduce unused JavaScript — 239 KiB | A blog page ships the tours/compare/dashboard/finder code it never uses |
| Reduce JS execution — 1.9 s | Parsing + executing 2 MB |
| Minimize main-thread work — 3.0 s | Hydrating the entire app onto a page that's already fully rendered |
| Avoid long main-thread tasks — 8–9 | Same |
| Legacy JavaScript — 11 KiB | Metro transpile targets |

**These are not tuning problems. They're an architecture problem:** a content page is being
rendered by a mobile-app runtime it doesn't need.

## 2. Why content pages are the opening (also measured)

The good news is that the export already does the hard part. On the flagship blog page:

- **The article HTML is fully server-rendered.** The body text, headings, table, FAQ, and
  breadcrumbs are all in the static HTML — the browser paints the page before any JS runs.
- **All styling is in the HTML too.** `<style id="react-native-stylesheet">` carries ~26 KB of
  atomic CSS (379 `css-*` classes). Layout does **not** depend on the JS bundle.
- **Navigation already works without JS.** All nav links and in-article links render as real
  `<a href>` tags (46 anchors on the page). Click-through works with the bundle removed.

So on a content page, the 2 MB bundle is powering almost nothing. The **only** things that
genuinely need JS are:

1. **The mobile menu drawer** — a hamburger toggle. (Note: the drawer markup is conditionally
   rendered, so it is *not* in the SSR DOM today — see §4.)
2. **The cookie-consent banner** — sets `localStorage` + updates GA consent mode.
3. Cosmetic active-nav highlighting.

All three can be served by **~2–3 KB of vanilla JavaScript** instead of 2 MB of app runtime.

## 3. Three options

### Option A — De-hydrate content routes _(recommended)_
Keep authoring exactly as-is (Expo/RNW components, `ArticleRenderer`). After `expo export`, run a
post-processor over the content HTML that:
- removes the `<script src=".../index-*.js">` bundle tag, and
- injects a tiny vanilla runtime that wires the mobile menu, consent banner, and skip-link.

Everything already in the HTML (content, styles, links) stays. The page keeps its exact look and
loses ~2 MB of parse/execute.

- **Impact:** content pages drop to **near-zero app JS**. TBT, JS-execution, main-thread, long
  tasks, and unused-JS effectively resolve on those pages. LCP/FCP already improved last round.
- **Effort:** **Medium.** One HTML-transform build step + one small vanilla script + a header
  refactor (§4) + cross-page testing.
- **Risk:** **Low and reversible** — authoring is unchanged; if anything regresses, stop running
  the transform and you're back to today. Main risk is missing a piece of interactivity (mitigated
  by the route inventory in §6 and JS-disabled testing in §7).
- **Trade-off:** de-hydrated pages become **MPA-style** — an in-site link click is a full page
  load, not a client-side SPA transition. For a search-entry content site with pages this light,
  that's a good trade (and search visitors — who land on one article — never notice). Pages that
  stay hydrated (tours, finder) keep SPA behavior. This mixed model is normal and fine.

### Option B — Separate lightweight generator for content pages
Build a standalone static generator (like the existing `scripts/build-blog.mjs`) that renders the
blog `Block[]` model to HTML with its own minimal template + CSS, bypassing RNW entirely.
- **Impact:** same near-zero JS, smallest possible output.
- **Effort:** **High.** Reimplements `ArticleRenderer` in a second rendering path.
- **Risk:** **Higher, ongoing** — two renderers to keep visually in sync; the blog would drift from
  the site's RNW design system over time.
- **Verdict:** only if Option A hits a real wall. Not recommended as the first move.

### Option C — Code-split / per-route bundles
Configure Metro/Expo Router for async route chunks so a blog page loads only blog code.
- **Impact:** **Partial.** Cuts "unused JS," but still ships React + RNW core + expo-router and
  **still hydrates** every page → TBT improves but does not collapse. Content pages keep paying the
  RN tax.
- **Effort:** **Medium**, and more fragile (build-config-dependent, can regress on Expo upgrades).
- **Verdict:** a reasonable **complement for the pages we keep hydrated** (tours, compare, the LIR
  finder), not a substitute for Option A on content pages.

## 4. One prerequisite refactor (for Option A)

The mobile menu overlay in `components/SiteHeader.tsx` is conditionally rendered
(`{open ? <overlay/> : null}`), so it's absent from the static DOM. Two clean ways to handle it:

- **Preferred:** refactor the header so the overlay markup is **always in the DOM** and toggled by
  a CSS class (`hidden` / `aria-expanded`), instead of by React state. Then the vanilla runtime
  just toggles a class + scroll-lock + Escape. This is a small, self-contained change that also
  makes the header work identically hydrated or not.
- **Alternative:** have the vanilla runtime build the drawer markup on first open. Works, but
  duplicates the drawer's markup in JS — avoid if the refactor is easy.

The consent banner (`components/ConsentBanner.tsx`) gets a matching ~1 KB vanilla port (read/write
`localStorage.cookie_consent`, call the existing `gtag('consent','update',…)`).

## 5. Recommended plan (Option A, phased)

**Phase 1 — Blog + About (where search traffic and the flagship live).** Highest ROI, lowest risk:
these are pure articles whose links are already anchors. De-hydrate them first, measure, confirm.

**Phase 2 — Extend to the other pure-content routes** (home, destinations, categories,
transportation hub + getting-around) once Phase 1 is proven. These need one extra step: convert
tour/destination **card taps from `router.push` to real `<a href>`** so they navigate without JS
(some already do; a few use an `onPress` handler).

**Keep hydrated (do not de-hydrate):** `/tours` (filters), `/compare`, `/dashboard`, and
`/transportation/airport-transfers/lir` (the finder) — these have real client state. Option C can
trim those later if their TBT still matters.

**Build wiring:** add the transform as a step in `build:web` after `expo export`, driven by an
allow-list of route globs (so a route only goes light when we've verified it). Fully mechanical and
CI-checkable.

## 6. Route inventory (interactivity signals, measured)

| Route | Signals | Plan |
|---|---|---|
| `/blog`, `/blog/*` | article only | **De-hydrate — Phase 1** |
| `/about` | content | **De-hydrate — Phase 1** |
| `/` (home) | 0 | De-hydrate — Phase 2 |
| `/destinations` | 0 | De-hydrate — Phase 2 |
| `/destinations/[place]` | 1 (`router.push` on cards) | De-hydrate — Phase 2 (convert cards→anchors) |
| `/categories/[category]` | 1 (same) | De-hydrate — Phase 2 (convert cards→anchors) |
| `/transportation`, `/transportation/getting-around` | 0–1 | De-hydrate — Phase 2 |
| `/tours` | 3 (filters) | **Keep hydrated** |
| `/transportation/airport-transfers/lir` | 5 (finder) | **Keep hydrated** |
| `/compare`, `/dashboard` | interactive | **Keep hydrated** |

## 7. How we verify (no guessing)

- **JS-disabled pass:** load each de-hydrated route with JavaScript off — content, styling, nav,
  in-article links, skip-link must all work. (They should, since all are in the SSR HTML.)
- **Menu + consent:** with the vanilla runtime, confirm the mobile drawer opens/closes (tap,
  Escape, scrim), scroll locks, and consent choice persists + flips GA consent.
- **Visual parity:** screenshot each de-hydrated page before/after; must be pixel-identical (same
  HTML + CSS, just no hydration).
- **Re-run PSI** on `/blog/lir-vs-sjo-airport-guide/`: expect the five JS findings in §1 to clear
  and mobile Performance to jump into the 90s.
- **Gate:** extend `automation/validate.mjs --dist` to assert de-hydrated routes ship **no**
  `index-*.js` bundle tag, and hydrated routes still do — so a future build can't silently
  regress either way.

## 8. Expected outcome (honest)

- **Content pages:** app JS 2 MB → ~2–3 KB. TBT → near-zero; JS-execution/main-thread/long-tasks
  effectively gone; "unused JS" resolved. Combined with last round's LCP/image/font work, mobile
  Performance on the blog should land in the **90s**.
- **Interactive pages:** unchanged this phase (still the honest weak spot); Option C is the lever
  there later.
- **No SEO/content/visual change:** identical HTML and design; this only removes runtime the page
  didn't need. Client-side SPA nav still happens when arriving from an already-hydrated page.

## 9. Effort & sequencing

- **Phase 1 (blog + about):** ~½–1 day — header CSS-toggle refactor, vanilla runtime (menu +
  consent + skip-link), the export transform + allow-list, validator gate, JS-off + parity testing.
- **Phase 2 (home/destinations/categories/transport hub):** ~½–1 day — mostly the card→anchor
  conversions + widening the allow-list + retesting.
- Deploys are yours (same production command); I build + validate + hand off a preview each phase.

## 10. Decision points for you

1. **Go / no-go on Option A**, Phase 1 first (blog + about).
2. OK to make the **small SiteHeader refactor** (menu overlay always-in-DOM, CSS-toggled)?
3. Accept the **MPA trade-off** on de-hydrated pages (full reload on in-site link clicks)?
4. Want **Option C (code-split)** scoped separately for the interactive pages, or leave those as-is
   for now?
