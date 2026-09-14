# Guanacaste Experiences — Digital PR & Link-Building Campaign

_Prepared 2026-09-14. **Preparation only** — no outreach, accounts, form submissions, or
external contact until the prospect list and messages are approved._

> **Honesty note on tools.** Ahrefs, Semrush, Majestic, Moz, and Google/Bing Search
> Console are **not connected to this environment**, so this plan does **not** contain
> exact referring-domain counts, DR/DA, or lost-link data — those require tools you own.
> Everything below is either (a) verifiable from the repo/public web (sourced) or
> (b) clearly labelled as an assumption or a task requiring your tools. No backlink
> numbers, contacts, or relationships are invented.

---

## 1. Baseline audit (what's verifiable now)

**Site maturity.** guanacasteexperiences.com is a **young site** — the blog (4 posts),
the transportation section, and this flagship asset all launched in September 2026. Its
backlink profile is therefore **nascent**; the goal is to build the first tranche of
authoritative, relevant links, not to recover a large existing profile.

**Pages worth promoting (link-worthy or improvable):**
| Page | Why it can earn links |
|---|---|
| `/blog/lir-vs-sjo-airport-guide/` (**new flagship**) | Reference-grade airport decision + drive-time matrix; the kind of table publishers cite |
| `/transportation/airport-transfers/lir/` | Genuinely useful finder + verified data; strong for hotels/planners |
| `/blog/getting-around-guanacaste-transport/` | Evergreen "how to get around" explainer |
| `/blog/best-time-to-visit-guanacaste/` | Evergreen "when to visit"; expandable into a month-by-month calendar (asset #2 below) |
| `/blog/rincon-de-la-vieja-volcano-guide/` | Sourced national-park guide; conservation-org relevance |

**Pages NOT to promote** (thin, transactional, or noindex): individual `/tours/*`
affiliate pages, `/compare`, `/dashboard`, and the noindex rental drafts
(`/transportation/{e-bike,scooter,atv,side-by-side,rental-cars}`).

**Action for you (requires your tools):** in GSC/Ahrefs, export current referring
domains, lost links, and unlinked brand mentions ("Guanacaste Experiences"). This plan
gives you the process; the data pull is a 15-minute task on your side.

## 2. Competitor backlink-gap analysis (framework + verified competitors)

The **gap method** (do this in Ahrefs/Semrush "Link Intersect"): list domains that link
to ≥2 competitors below but **not** to you — those are your warmest prospects.

**Verified competitors** (from live search, Sept 2026):
- Authority CR travel blogs: **Two Weeks in Costa Rica** (twoweeksincostarica.com — note: they sell their own LIR–Tamarindo shuttle), **My Tan Feet** (mytanfeet.com), **The Barefoot Nomad**, **Costa Rica Travel Life** (costaricatravellife.com), **Rough Guides** (Guanacaste section).
- Transfer/airport: **LIR Shuttle** (lirshuttle.com), **liberiacrairport.com** (airport-info site with a blog), **Tropical Tours Shuttles**, **Tamarindo Shuttle**.
- Reference/guide sites: **costa-rica-guide.com**, **costarica.org**.

**Interpretation:** several of these rank for exactly our transfer/airport intents, so
their linking domains (travel roundups, hotel "getting here" pages, forum resource
lists) are the target pool. The flagship airport guide is deliberately more complete
(all destinations, both airports, one table) than any single competitor page — that
differentiation is the pitch.

_Sources: [Rough Guides – Guanacaste](https://www.roughguides.com/articles/best-guanacaste-costa-rica-tours/), [My Tan Feet – Tamarindo](https://mytanfeet.com/activities/things-to-do-in-tamarindo/), [Two Weeks in Costa Rica – LIR→Tamarindo shuttle](https://www.twoweeksincostarica.com/product/lir-tamarindo-private-shuttle/), [liberiacrairport.com – LIR→Tamarindo guide](https://www.liberiacrairport.com/post/the-ultimate-guide-to-your-lir-to-tamarindo-shuttle-everything-you-need-for-a-smooth-ride)._

## 3. Linkable-asset plan (scored)

Scoring 1–5 each (higher = better), summed. Effort/update-burden are inverted (5 = low).

| Asset | Link potential | Search demand | Originality | Traveler value | Low effort | Low update burden | Partnership | Conversion fit | **Total** |
|---|---|---|---|---|---|---|---|---|---|
| **1. LIR vs SJO airport decision guide** ✅ built | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | **36** |
| **2. Month-by-month Guanacaste calendar** | 5 | 5 | 4 | 5 | 3 | 3 | 4 | 3 | **32** |
| **3. Guanacaste beach finder (filterable)** | 5 | 4 | 5 | 5 | 2 | 3 | 3 | 4 | **31** |
| Responsible wildlife-viewing guide (w/ conservation partner) | 4 | 3 | 5 | 4 | 3 | 4 | 5 | 2 | 30 |
| Family travel planning guide | 4 | 4 | 3 | 5 | 4 | 4 | 3 | 3 | 30 |
| Accessible Guanacaste guide | 4 | 3 | 5 | 4 | 2 | 3 | 4 | 2 | 27 |
| Interactive transportation planner/map (embeddable) | 5 | 3 | 5 | 4 | 1 | 3 | 3 | 4 | 28 |
| Original photography library | 3 | 2 | 4 | 3 | 2 | 4 | 4 | 2 | 24 |
| Expert quote library | 3 | 2 | 4 | 3 | 3 | 3 | 5 | 2 | 25 |
| Emergency/practical hub | 3 | 3 | 3 | 5 | 3 | 2 | 3 | 2 | 24 |
| Original travel-data study | 4 | 2 | 5 | 3 | 1 | 3 | 3 | 2 | 23 |

**Top 3 to pursue:** (1) Airport decision guide — **built now**; (2) Month-by-month
calendar — highest evergreen citation value, build next from the existing "best time"
post + IMN/ICT/SINAC sources; (3) Beach finder — highest originality, biggest build
(needs verified per-beach data + a filter UI; do not make accessibility claims without
verification).

## 4. Flagship asset — DELIVERED

**`/blog/lir-vs-sjo-airport-guide/`** — "Which Airport for Guanacaste? LIR vs. SJO,
Destination by Destination." Implemented in the repo (`content/blog/lir-vs-sjo-airport-guide.ts`):
- Original **destination × airport × approximate-drive-time matrix** (the citeable centerpiece), clearly labelled as approximate ranges with a "confirm with your operator" caveat — no invented precise figures.
- Decision framework by trip type; honest "when SJO makes sense"; arrival-day practicalities.
- Internal links to the LIR/SJO transfer pages (conversion) + related blog guides; sources cited (ICT, LIR airport, SINAC).
- Passes the blog quality gate (281 checks); indexable, in sitemap + RSS, `BlogPosting` + `BreadcrumbList` schema, 162-char meta, design-system consistent, mobile-ready.
- **Status:** built and validated; **not yet deployed** — deploy is your call (same production command as the rest of the site).

## 5. Verified prospect database (real orgs; contacts to be verified before outreach)

**Ground rules:** every organisation below is real and verified to exist. **Individual
contact names/emails are intentionally NOT filled in** — I won't fabricate them, and the
rules forbid outreach until you approve. For each, the "contact" step is: find the
editor/marketing contact on their site's contact/masthead page and verify it's current
**before** any message is sent. Reaching the full target counts (20/30/20/10) requires
the Link-Intersect export from your tools (§2) to add the domains that already link to
competitors; this is the **verified core** to start from.

### Tier 1 — relationship / editorial (highest relevance)
| Organisation | Site | Category | Why they might link / angle | Recommended asset | Suggested target URL |
|---|---|---|---|---|---|
| Guanacaste Chamber of Tourism (CATURGA) | via ict.go.cr chambers list | Tourism org | Regional member-resource pages; independent local guide | Airport guide + transport hub | `/transportation/` |
| The Leatherback Trust | leatherbacktrust.org | Conservation | Responsible wildlife-viewing collaboration (Playa Grande/Las Baulas) | Responsible wildlife guide (co-created) | `/blog/rincon-de-la-vieja-volcano-guide/` |
| Verdiazul | (verify current site) | Conservation | Turtle-nesting responsible-visit education | Wildlife guide | Wildlife guide URL |
| Two Weeks in Costa Rica | twoweeksincostarica.com | Authority blog | Factual addition / unlinked-mention / expert quote (they cover LIR routes) | Airport guide | `/blog/lir-vs-sjo-airport-guide/` |
| My Tan Feet | mytanfeet.com | Authority blog | Resource mention in their transport/Tamarindo posts | Airport guide | `/blog/lir-vs-sjo-airport-guide/` |
| International Living — Costa Rica | internationalliving.com | Expat media | Practical arrival/transport resource for movers | Airport guide + getting-around | `/blog/getting-around-guanacaste-transport/` |
| ExpatDen — Costa Rica | expatden.com | Expat media | Same | Getting-around guide | `/blog/getting-around-guanacaste-transport/` |

### Tier 2 — resource-page / partner / content
| Organisation | Site | Category | Angle | Asset |
|---|---|---|---|---|
| liberiacrairport.com | liberiacrairport.com | Airport-info | Complement their route posts with the full airport matrix | Airport guide |
| Blue Water Properties of CR | bluewaterpropertiesofcostarica.com | Rental/relocation | "Getting here" resource for their guest/relocation pages | Airport + getting-around |
| Coastal Realty Costa Rica | coastalrealtycostarica.com | Rental/relocation | Same | Getting-around |
| Costa Homes Connect | costahomesconnect.com | Relocation | Same | Getting-around |
| costa-rica-guide.com | costa-rica-guide.com | Guide site | Factual correction/addition on airports | Airport guide |
| Guanacaste hotels/resorts (RIU, Westin Conchal, JW Marriott, boutique villas) | (individual) | Hospitality | Co-branded arrival/transport guide for their "how to get here" pages | Airport guide + LIR transfers |
| Tamarindo surf schools (Witch's Rock, Iguana Surf — verify) | (individual) | Activity partner | Visitor-resource link | Airport guide |
| Nosara wellness/retreats (verify specific venues) | (individual) | Wellness | Guest travel-planning resource | Airport + getting-around |
| Costa Rica destination-wedding planners (verify specific firms) | (individual) | Weddings | Guest-arrival guide (co-branded) | Airport guide |

### Tier 3 — digital PR / journalist platforms (verified active, Sept 2026)
| Platform | URL | Notes |
|---|---|---|
| Qwoted | qwoted.com | Closest to old HARO; travel queries appear |
| Featured.com | featured.com | Now owns the HARO brand (acq. Apr 2025) |
| Source of Sources | sosrcs.com | Free; Peter Shankman (HARO founder) |
| Help a B2B Writer | helpab2bwriter.com | Use only for genuinely B2B/travel-trade queries |
| #journorequest | X / Bluesky | Monitor for Costa Rica / Central America travel requests |

### Tier 4 — broken-link / unlinked-mention (process; requires your tools)
- **Unlinked mentions:** set a Google Alert + a monthly search for "Guanacaste Experiences" and reclaim any mention that isn't linked.
- **Broken links:** in Ahrefs, run "Broken Backlinks" on competitors + search resource pages ("Guanacaste travel resources", "Costa Rica transportation links") for dead links you can replace with a live equivalent.

_Sources: [ICT chambers list](https://www.ict.go.cr/en/links/chambers-and-associations-of-tourism/1-camara-nacional-de-turismo-canatur.html), [The Leatherback Trust](https://earthwatch.org/expeditions/costa-rican-sea-turtles), [HARO alternatives 2026](https://everything-pr.com/haro-earned-media-placements), [International Living – Tamarindo](https://internationalliving.com/playa-tamarindo-a-place-where-families-thrive/)._

## 6. Prospect scoring (100-point model)

| Factor | Weight | Notes |
|---|---|---|
| Topical relevance | 25 | Costa Rica / Guanacaste / travel / transport / conservation |
| Editorial credibility | 20 | Real editorial standards; not a link farm |
| Real audience / referral potential | 20 | Would reach travelers planning a Guanacaste trip |
| Geographic relevance | 10 | CR / North America audience for CR |
| Contextual fit for our asset | 10 | Is there a natural page/section to link from? |
| Indexation & content freshness | 8 | Indexed, updated, maintained |
| Outbound-link quality | 7 | Links to reputable sites, not spam |

**Do not** use DR/DA as a gate. **Tiering:** ≥80 = Tier 1, 65–79 = Tier 2, 50–64 = Tier 3,
<50 = drop. Score each prospect before it enters outreach.

## 7. Outreach templates

Rules for all: reference their real work, offer something useful, one request, no false
praise, no "existing relationship" pretence, no backlink demand, no SEO jargon,
substantially personalise before sending, ≤120 words. Two follow-ups max, then stop.
**No money/free tours/gifts for a followed editorial link.** Sponsored content →
`rel="sponsored"`.

**A) Hotels & resorts**
> Subject: A "getting here" resource for your [Hotel] guests
> Hi [Name] — I run guanacasteexperiences.com, an independent Guanacaste guide. I just published a fact-checked airport guide with approximate drive times from Liberia (LIR) and San José (SJO) to each beach, including [their area]: [URL]. If it's useful for your "how to get here" page, you're welcome to link to it — no obligation either way. Happy to tailor a version noting your exact drive time. — [You]

**B) Travel advisors**
> Subject: Up-to-date Guanacaste airport/transfer reference for clients
> Hi [Name] — for clients weighing LIR vs SJO, I keep a plain-English guide with a destination-by-destination drive-time table: [URL]. Sharing in case it saves you a repeated explanation. I update it as routes change. — [You]

**C) Journalists (via Qwoted/Featured/SoS — respond to a live query only)**
> Re: [their query]. Independent Guanacaste guide here. [2–3 sentence, specific, verifiable answer with a figure and its source.] Happy to provide the drive-time table or original detail if useful: [URL]. Attributable to [You/role]. — [You]

**D) Bloggers / publishers (factual addition)**
> Subject: Small correction + a resource for your [post title]
> Hi [Name] — enjoyed [specific detail]. One note: [verifiable correction, with source]. If helpful, our airport guide has the full drive-time matrix your readers might want: [URL]. Either way, thanks for the piece. — [You]

**E) Conservation organisations (collaboration, not a link ask)**
> Subject: Responsible wildlife-viewing guide — would you review it?
> Hi [Name] — we're building a responsible turtle/wildlife-viewing guide for visitors and want it to reflect [Org]'s guidance accurately. Could someone review a draft for accuracy? We'll credit [Org] and link to your work; no ask beyond getting it right. — [You]

**F) Wedding planners** — as (A), framed around guest arrival logistics.
**G) Broken-link** — "you link to [dead URL] on [page]; here's a live equivalent: [URL]."
**H) Unlinked mention** — "thanks for mentioning us in [piece]; if it fits, we're at [URL]."
**I) Original photography** — offer a specific, relevant original image under clear terms, optional credit.
**J) Expert commentary** — as (C).
**K) Collaborative resource** — as (E), for hotels/advisors co-creating a guide.
**L) Spanish-language (CR media)** — Spanish version of (D)/(A); e.g.:
> Asunto: Guía de aeropuertos de Guanacaste (LIR vs SJO)
> Hola [Nombre]: soy de guanacasteexperiences.com, una guía independiente de Guanacaste. Publicamos una guía con tiempos aproximados de traslado desde Liberia (LIR) y San José (SJO) a cada playa: [URL]. Por si le sirve como recurso para sus lectores. — [Tú]

## 8. 90-day campaign calendar

**Weeks 1–4 — Foundation + flagship (no mass outreach).**
- W1: Pull GSC/Ahrefs data (referring domains, lost links, unlinked mentions, Link Intersect). Deploy the flagship. Set Google Alert for the brand.
- W2: Score the verified prospects (§5); verify 10 Tier-1 contacts. Register on Qwoted + Source of Sources; start monitoring #journorequest.
- W3: First **10** hyper-personalised Tier-1 sends (hotels in our covered zones + 2 authority blogs). Begin conservation-collab conversation (1 org).
- W4: Answer 3–5 journalist queries. Reclaim any unlinked mentions found. Measure W3 response rate.

**Weeks 5–8 — Expand + partnerships.**
- Batch 2: 15 Tier-2 resource-page/relocation/rental prospects. Follow-up #1 to non-responders from W3. Begin **month-by-month calendar** (asset #2) using IMN/ICT/SINAC. Spanish-language batch to 5 CR outlets.

**Weeks 9–12 — Digital PR + reclamation + iterate.**
- Publish the calendar; pitch it seasonally (see angles below). Broken-link batch (10). Follow-up #2 (final) to earlier non-responders. Monthly link-verification + reporting. Decide on beach finder (asset #3) for the next quarter.

**Seasonal angles (verify all dates/facts first):** dry-season arrival logistics
(Dec–Apr peak); green-season value + waterfall/turtle-nesting windows (source: SINAC);
"which airport" spikes around holiday booking periods. Never state an event date or
wildlife window without an authoritative source.

## 9. Technical SEO changes made (this cycle)

- Built `/blog/lir-vs-sjo-airport-guide/` (flagship) — descriptive URL, focused title/meta/H1/intro, internal links both to transfer pages and from related posts, sources, `BlogPosting`+`BreadcrumbList` schema, OG/Twitter meta, optimised WebP hero (2400/800), lazy-loaded, in sitemap + RSS, indexable, no-registration.
- Added contextual "Flying in?" links from destination pages → transfer routes (prior cycle) and the flagship → transfer pages; transfer routes already link back to destination guides. Bidirectional internal linking.
- Extended `automation/validate.mjs` to recognise `/transportation/*` internal + commercial links (prevents false "broken link" gate failures on cross-links).

## 10. Measurement dashboard (spec)

Track monthly, per campaign; **do not** judge success by link count or DR alone.
- **Links:** new qualified referring domains; earned editorial links (with placement quality: in-content vs footer vs sidebar; followed vs nofollow/sponsored); links lost/inactive.
- **Outreach:** sends, response rate, positive-reply rate, links per campaign, time & (near-zero) cost per earned link.
- **Traffic & conversion (GA4 + your `/go` click tracking):** referral sessions, engaged referral sessions, **Viator affiliate `click_viator_booking` events attributable to referral sources**, assisted conversions where trackable.
- **Rankings:** non-branded queries (e.g., "LIR vs SJO", "Liberia airport transfers", "getting around Guanacaste"); organic traffic to the linkable assets.
- **Hygiene:** unlinked mentions found/reclaimed; inactive Viator products flagged by the transfer refresh job; new competitor links (Link Intersect delta).

## 11. Risks & policy checks

- **Compliant with Google spam/linking policy:** no bought links, PBNs, automation, mass guest posts, spam comments, reciprocal schemes, exact-match anchor manipulation, expired-domain plays, fake identities, scholarship schemes, or AI-blasted outreach. Every send is manual and personalised.
- **Anchor text:** primarily branded, bare-URL, editorial-title, and natural-descriptive — never keyword-stuffed exact match, never forced on publishers.
- **Sponsored/paid:** if any compensation is ever involved, require `rel="sponsored"`; never trade money/tours/gifts for a followed editorial link.
- **Content honesty:** all asset facts sourced (ICT/IMN/SINAC/airport); drive times labelled approximate; no scraped/copyrighted Viator content or images.
- **Reputational:** we represent ourselves as an independent guide — never imply an existing relationship or operate under a fake persona.

## 12. Items requiring your approval

1. **Deploy the flagship** airport guide to production (or preview first).
2. **The prospect list** (§5) once you've verified contacts + added Link-Intersect domains.
3. **Every outreach message** before it's sent (I'll draft; you approve; you or an approved teammate send — I do not send).
4. **Any conservation/hotel collaboration** terms.
5. **Registering** on Qwoted/Featured/SoS (account creation is yours to do).
6. Green-light to **build asset #2** (month-by-month calendar).

## 13. First 7 days — exact next actions

1. **(You)** Pull GSC + Ahrefs: referring domains, lost links, unlinked "Guanacaste Experiences" mentions, and a Link-Intersect vs the §2 competitors. Send me the exports and I'll fold real domains into the prospect DB.
2. **(You/me)** Approve + **deploy the flagship** (`git checkout main` is current at the guide; run the production deploy command). I'll verify it live.
3. **(You)** Set a Google Alert for "Guanacaste Experiences"; create accounts on Qwoted + Source of Sources.
4. **(Me)** Verify + score the first 10 Tier-1 prospects and draft their personalised messages for your review.
5. **(Me)** Draft the responsible-wildlife-viewing collaboration note to one conservation org (The Leatherback Trust) for your approval.
6. **(You)** Start monitoring #journorequest / your chosen journalist platform; forward me any Costa Rica query and I'll draft a sourced, attributable answer.
7. **(Me, on your go-ahead)** Begin asset #2 (month-by-month calendar) outline with IMN/ICT/SINAC sources.

_No emails, forms, accounts, or external contact will happen until you approve the list and the messages._
