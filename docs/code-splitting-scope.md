# Scope — Option C (code-splitting) for the interactive pages

_Prepared 2026-09-14. **Scoping only — no code changes here.** Measurements are from the
current `dist/` bundle (`index-*.js`)._

## TL;DR

You asked me to scope code-splitting the interactive pages. I did — **but the measurements say
the bigger remaining win is not code-splitting.** It's **de-hydrating the 81 static tour-detail
pages** (`/tours/<slug>`), which today ship the full 2 MB bundle for no interactive reason. That's
the same proven pattern as the blog/home/about work, on **20× more pages** than the genuinely
interactive set. Code-splitting should come after, and even then a **data split** beats generic
route-splitting. Recommended order below.

## What's actually in the bundle (measured)

One `index-*.js`: **2,057 KiB raw / 539 KiB gzipped** (transfer), loaded on every *hydrated* page.

| Slice | Size | Notes |
|---|---|---|
| Shared framework core (React + React-DOM + React-Native-Web + expo-router runtime) | ~majority | Loads on **every** hydrated page; code-splitting can't remove it |
| **TOURS dataset** (`lib/tours.ts`) | **241 KiB raw (~11%)** | All 83 tours + 520 image URLs + copy/reviews, compiled into the JS |
| All route screens (tours, compare, dashboard, finder, detail, …) | the rest | The only part route-level splitting can defer |
| Icons (`@expo/vector-icons`) | small | Only 3 refs — **not** a culprit |

**Consequence:** the shared core is a high floor. Splitting route screens shaves the top, not the
floor — so the ceiling on code-splitting is modest.

## The pages, re-classified by real interactivity (measured)

| Route(s) | Count | Interactive? | Best treatment |
|---|---|---|---|
| **`/tours/<slug>` (detail)** | **81** | **No** (0 state; Book button already navigates via `/go/`) | **De-hydrate — Phase 1c** |
| `/tours` (index) | 1 | Yes — search/category filters | Data-split, then maybe code-split |
| `/compare` | 1 | Yes — comparison UI | Code-split candidate |
| `/dashboard` | 1 | Yes — charts/state | Code-split candidate |
| `/transportation/airport-transfers/lir` (finder) | 1 | Yes — filters | Data-split, then maybe code-split |

So "the interactive pages" are **~4**. The heavy-but-static set is **81**. That gap is the whole
argument.

## Recommended sequence

### Phase 1c (do first) — de-hydrate the 81 tour-detail pages
They're static articles with exactly two JS touchpoints, both already-solved patterns:
1. **Tour images** → `WebImage` (the component built in Phase 1) so they're real server-rendered
   `<img>` and survive without the bundle.
2. **"Book" / booking CTA** → a real `<a href="/go/<affiliate>/<slug>" rel="sponsored noopener">`
   instead of an `onPress` that sets `window.location.href`. This already resolves to `/go/` on web
   (see `tours/[slug]/index.tsx:129`), so it's a mechanical swap that also makes the affiliate link
   work with JS off and reads correctly to crawlers.

Then add `/tours/<slug>` to the `dehydrate.mjs` allow-list.
- **Impact:** removes the 2 MB bundle from **81 SEO/LCP-critical pages** — the same jump you saw on
  the blog. This is the single highest-ROI performance move left.
- **Effort:** ~½ day. **Risk:** low/reversible (same mechanism; the Book-link change is an
  improvement in its own right). Verify with the JS-off + booking-click test.

### Phase 2 — split the TOURS dataset out of the bundle (helps the interactive residue)
The 241 KiB dataset is compiled into the bundle that the interactive pages load, even though
`/dashboard` and the finder don't need tour data at all, and `/tours`/`/compare` need only a slim
list (title, price, rating, image, slug), not full copy/reviews.
- Emit a **slim tours JSON** at build (the fields the list/compare views use) and **fetch** it at
  runtime instead of importing the full array; keep full per-tour data on the (now de-hydrated)
  detail pages where it's already baked into static HTML.
- **Impact:** cuts a measurable chunk off what the interactive pages download and parse —
  independent of async-route fragility.
- **Effort:** ~½–1 day. **Risk:** low-medium (a data-loading refactor of the list/compare screens;
  needs a loading state).

### Phase 3 (Option C proper) — route code-splitting, only if still worth it
Expo Router 57 supports async routes (the `asyncRoutes` plugin option exists), so route screens can
build into separate chunks loaded on demand.
- **Ceiling:** it defers route-specific screen code but **keeps the shared framework core** on
  every hydrated page, so TBT/JS-execution improve **modestly, not dramatically**.
- **Risk:** async routes + full static export (SSG) is historically **fragile** — extra chunk
  requests, hydration/edge-case bugs, and it can regress on Expo SDK upgrades. It also adds
  round-trips on slow connections.
- **Verdict:** do a **time-boxed spike** (enable `asyncRoutes: { web: true }`, export, measure the
  4 interactive pages' bundle + TBT, check nothing breaks) **before** committing. Only proceed if
  the spike shows a real, stable win over Phase 2 alone. If it's shaky, stop — the interactive
  pages are few and lower-traffic, and Phases 1c + 2 already capture most of the value.

## Expected outcome (honest)
- **After 1c:** the entire content + tour-detail surface (the vast majority of pages and search
  traffic) ships ~2 KB of JS. This is where the real performance ceiling lift is.
- **After 2:** the ~4 interactive pages get lighter and parse less.
- **After 3 (if pursued):** a further modest TBT trim on those 4 pages — with real regression risk,
  hence the spike gate.
- **The floor stays:** any page that must stay interactive still ships the framework core (~1.2 MB
  raw / ~350–450 KiB gz, estimated). Getting *below* that would mean not shipping React-Native-Web
  for those pages at all — a much larger rewrite, out of scope.

## Effort / risk summary
| Phase | Effort | Risk | Pages helped | Priority |
|---|---|---|---|---|
| 1c — de-hydrate tour detail | ~½ day | Low, reversible | **81** | **Highest** |
| 2 — split tours data | ~½–1 day | Low-med | ~4 interactive | High |
| 3 — async route code-split | ~1 day + spike | Med, upgrade-fragile | ~4 interactive | Optional (spike-gated) |

## Decision points for you
1. Green-light **Phase 1c** (de-hydrate the 81 tour-detail pages) — my recommended next build.
2. OK to change the tour **Book button to a real `/go/` anchor** (needed for 1c; also a standalone
   improvement)?
3. Want **Phase 2** (tours-data split) after 1c?
4. Should I run the **Phase 3 spike** (async routes) to get a real number before deciding, or park
   Option C entirely for now?
