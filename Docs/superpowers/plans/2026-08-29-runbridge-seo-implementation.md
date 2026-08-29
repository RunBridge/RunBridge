# RunBridge Search, Compatibility, and Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a crawlable, privacy-first RunBridge product site, compatibility database, Companion funnel, and Garmin treadmill knowledge resource without changing deployment or device workflows.

**Architecture:** A small Node 24 static generator reads centralized configuration, Markdown, HTML partials, and compatibility JSON, then writes complete HTML output to the repository root for the existing static host. Generated marketing and documentation pages contain no runtime content dependency or analytics; existing support tools retain only their functional JavaScript.

**Tech Stack:** Static HTML/CSS, Node.js 24 standard library, `marked@17.0.5` as a pinned build-time dependency, Node test runner, JSON-LD.

**Spec:** `Docs/superpowers/specs/2026-08-29-runbridge-seo-design.md`

## Global Constraints

- Do not commit or push any implementation changes.
- Preserve the existing RunBridge visual identity and static-hosting architecture.
- Do not add analytics, cookies, trackers, a CMS, or a runtime application framework.
- Do not invent compatibility, Garmin support, technical behavior, reviews, prices, partnerships, or measurements.
- Present treadmill-reported speed/distance as treadmill-reported, not guaranteed physically calibrated.
- Current visible prices are assembled `$49` and DIY `$20`.
- Current production firmware reference is `4.0.1`.
- Preserve `/updater.html`, `/extractor.html`, `/analyzer.html`, legal/compliance pages, raw Markdown links, firmware workflows, and existing deep links.
- Generated search-critical content must exist in raw HTML without client-side rendering.
- Customer-field-history pages must state that no reported issue is weaker evidence than a direct test or explicit confirmation.
- No model page for `Kayoba / Unknown`; no positive page for the explicitly incompatible Peloton and Woodway records.

## File Structure

### Build and validation

- Create `package.json` — pinned dependency and build/test/validate scripts.
- Create `pnpm-lock.yaml` — reproducible dependency lock.
- Create `site/config.mjs` — origin, prices, store/app URLs, organization, navigation, route helpers.
- Create `site/pages.mjs` — metadata and content source for acquisition, article, and documentation pages.
- Create `site/templates.mjs` — escaping, shared shell, breadcrumbs, cards, structured data, compatibility page rendering.
- Create `site/compatibility.json` — public compatibility evidence snapshot.
- Create `scripts/build-site.mjs` — render generated routes and sitemap.
- Create `scripts/validate-site.mjs` — metadata, link, route, JSON-LD, privacy, and crawlability checks.
- Create `tests/site.test.mjs` — Node tests for generator contracts and generated output.

### Content sources

- Create `site/content/home.html` — homepage conversion body.
- Create `site/content/runbridge-companion.md`.
- Create `site/content/garmin-treadmill-accuracy.md`.
- Create `site/content/connect-treadmill-to-garmin.md`.
- Create `site/content/runna-garmin-treadmill.md`.
- Create `site/content/garmin-treadmill-foot-pod.md`.
- Modify `Docs/QuickStart.md`, `Docs/Troubleshooting.md`, `Docs/Compatibility.md`, `Docs/LED-States.md`, and `Docs/Support-and-Policies.md` only for factual corrections and clean-route links.
- Modify `README.md` to correct firmware, pricing/availability, Companion, and public route references.

### Generated routes

- Modify `index.html` from generated homepage output.
- Create `compatibility/index.html`.
- Create model directories and `index.html` for the thirteen approved named models.
- Create `runbridge-companion/index.html`.
- Create the four educational route directories and `index.html` files.
- Create `docs/index.html` and the five crawlable documentation route pages.
- Modify `docs.html` into the static legacy documentation index/router.
- Modify `sitemap.xml` from generated canonical routes.

### Existing shared/public files

- Modify `style.css` for shared layout, conversion components, compatibility states, breadcrumbs, focus, mobile navigation, responsive content, and reduced motion.
- Modify all public HTML pages containing GA4 to remove it.
- Modify `privacy/index.html` for current iOS/Android availability and tracker-free website behavior.
- Modify secondary-page metadata where needed without changing their functional bodies.
- Create optimized product/logo assets while preserving source images.

---

### Task 1: Static Generator Contract and Failing Tests

**Files:**
- Create: `package.json`
- Create: `site/config.mjs`
- Create: `site/pages.mjs`
- Create: `site/templates.mjs`
- Create: `scripts/build-site.mjs`
- Create: `scripts/validate-site.mjs`
- Create: `tests/site.test.mjs`

**Interfaces:**
- Produces: `buildSite({ rootDir }): Promise<{ routes: string[] }>` from `scripts/build-site.mjs`.
- Produces: `validateSite({ rootDir }): Promise<string[]>` returning an array of validation errors.
- Produces: `renderPage(page, context): string`, `renderCompatibilityPage(record, context): string`, and `escapeHtml(value): string` from `site/templates.mjs`.
- Consumes later: `site/pages.mjs` exports `pages`; `site/config.mjs` exports `siteConfig`, `canonicalUrl(route)`, and `routeToFile(route)`.

- [ ] **Step 1: Add the pinned package contract**

Create `package.json` with `type: module`, `marked: 17.0.5`, and scripts using `node scripts/build-site.mjs`, `node scripts/validate-site.mjs`, and `node --test tests/*.test.mjs`.

- [ ] **Step 2: Write failing generator contract tests**

Add tests that assert:

```js
assert.equal(canonicalUrl('/compatibility/'), 'https://runbridge.dev/compatibility/');
assert.equal(routeToFile('/guides/quick-start/'), 'guides/quick-start/index.html');
assert.match(renderPage(fixturePage, fixtureContext), /<link rel="canonical"/);
assert.match(renderPage(fixturePage, fixtureContext), /<main id="main-content">/);
assert.doesNotMatch(renderPage(fixturePage, fixtureContext), /googletagmanager|jsdelivr|marked\.min\.js/i);
assert.deepEqual(JSON.parse(extractJsonLd(html))[0]['@type'], 'WebPage');
```

Add a validation fixture with a broken internal link and assert that `validateSite` reports it.

- [ ] **Step 3: Run the tests and verify the intended failure**

Run the bundled Node executable with `--test tests/site.test.mjs`. Expected: module-not-found or missing-export failures for the new generator interfaces.

- [ ] **Step 4: Implement minimal configuration and templates**

Implement URL normalization, filesystem-route mapping, safe HTML escaping, the shared document shell, canonical/social metadata, skip link, global navigation, breadcrumb markup/JSON-LD, and footer.

- [ ] **Step 5: Implement build and validation entry points**

The build reads page sources, renders into memory, validates required metadata before writes, writes only declared generated routes, and regenerates the sitemap. The validator scans generated files for required metadata, one H1, parseable JSON-LD, forbidden remote scripts, missing local targets, duplicate routes, and missing sitemap entries.

- [ ] **Step 6: Run Task 1 tests**

Expected: all generator contract tests pass. Review `git diff --check`; do not commit.

### Task 2: Compatibility Evidence Data and Generated Model Pages

**Files:**
- Create: `site/compatibility.json`
- Modify: `site/templates.mjs`
- Modify: `scripts/build-site.mjs`
- Modify: `scripts/validate-site.mjs`
- Modify: `tests/site.test.mjs`
- Generate: `compatibility/index.html`
- Generate: `compatibility/*/index.html` for approved named records

**Interfaces:**
- Compatibility record fields: `slug`, `manufacturer`, `model`, `variant`, `classification`, `publicStatus`, `summary`, `recordedDate`, `source`, `firmware`, `evidence`, `setup`, `limitations`, `related`, `detailPage`.
- Allowed classifications: `runbridge_tested`, `customer_confirmed`, `customer_field_history`, `confirmed_working`, `firmware_evidence`, `expected_ftms`, `unsupported`, `unknown`.
- `renderCompatibilityPage(record, context)` emits visible evidence labels and `WebPage` plus `BreadcrumbList` JSON-LD.

- [ ] **Step 1: Write failing compatibility validation tests**

Tests reject duplicate slugs, missing evidence, unsupported free-form classifications, a `customer_field_history` record without firmware `4.0.1`, and any positive detail page for an explicit incompatible record.

- [ ] **Step 2: Add the inventory-backed evidence snapshot**

Add records for:

- AssaultRunner Pro — `runbridge_tested`.
- Spirit XT685 — `customer_confirmed`, lab and customer evidence.
- Horizon 7.4 AT — `customer_confirmed`, model-specific firmware behavior.
- Darwin TM30 — `customer_confirmed`.
- Technogym Excite Run 700 Unity — `customer_confirmed`.
- Domyos T900D — `confirmed_working` from existing public documentation.
- BowFlex T9, Domyos Run500, Horizon T202-26, Horizon TreadXP, Odin T620, Sole F80, and Sole F85 — `customer_field_history` on 4.0.1.
- Kayoba Unknown — aggregate-only, `detailPage: false`.
- Peloton Tread+ Cross Training and Woodway 4Front 2016 — `unsupported`, hub-only.

Normalize public spelling while retaining source text in evidence notes. One Sole F80 page covers the unspecified and 2026 variant records.

- [ ] **Step 3: Generate the compatibility hub and model pages**

The hub groups tested/confirmed, customer field history, and known incompatible records. Every positive page contains status, evidence strength, firmware relevance, known setup/limitations only when recorded, Companion CTA, treadmill-reported accuracy qualification, purchase CTA, and related pages.

- [ ] **Step 4: Run compatibility tests and raw-output checks**

Assert all thirteen model routes exist, unsupported records have no positive detail pages, `Kayoba / Unknown` has no route, and each raw HTML file contains its manufacturer/model and evidence label.

### Task 3: Crawlable Documentation and Legacy Deep Links

**Files:**
- Modify: `Docs/QuickStart.md`
- Modify: `Docs/Troubleshooting.md`
- Modify: `Docs/Compatibility.md`
- Modify: `Docs/LED-States.md`
- Modify: `Docs/Support-and-Policies.md`
- Modify: `site/pages.mjs`
- Modify: `scripts/build-site.mjs`
- Modify: `tests/site.test.mjs`
- Generate: `docs/index.html`
- Generate: `docs/quick-start/index.html`
- Generate: `docs/troubleshooting/index.html`
- Generate: `docs/check-compatibility/index.html`
- Generate: `docs/led-states/index.html`
- Generate: `docs/support-and-policies/index.html`
- Modify: `docs.html`

**Interfaces:**
- Documentation metadata entries map one source Markdown file to one canonical route.
- Legacy query map: `QuickStart`, `Troubleshooting`, `Compatibility`, `LED-States`, and `Support-and-Policies` to clean routes.

- [ ] **Step 1: Write failing crawlability and legacy-map tests**

Assert each generated doc raw file contains one H1 and meaningful body text, none contains `Loading documentation`, `fetch(`, jsDelivr, or `marked.min.js`, and every legacy query key resolves to a declared clean route.

- [ ] **Step 2: Correct documentation sources**

Use treadmill-reported wording, current Companion availability, current clean internal links, current firmware reference, and current privacy statements. Preserve useful technical history and support guidance.

- [ ] **Step 3: Generate crawlable documentation pages**

Use shared navigation, breadcrumbs, `TechArticle` or `WebPage` JSON-LD, related documentation, compatibility and product return links, and mobile-friendly tables/lists.

- [ ] **Step 4: Replace the runtime Markdown viewer**

Make `docs.html` a normal documentation index. Add a minimal inline query router that uses `location.replace(cleanRoute)` only for recognized legacy keys. Include all clean links in raw HTML and a `noscript` explanation.

- [ ] **Step 5: Run documentation tests**

Expected: raw crawlability, legacy mapping, JSON-LD, canonical, and internal link checks pass.

### Task 4: Companion and Educational Acquisition Pages

**Files:**
- Create: `site/content/runbridge-companion.md`
- Create: `site/content/garmin-treadmill-accuracy.md`
- Create: `site/content/connect-treadmill-to-garmin.md`
- Create: `site/content/runna-garmin-treadmill.md`
- Create: `site/content/garmin-treadmill-foot-pod.md`
- Modify: `site/pages.mjs`
- Modify: `tests/site.test.mjs`
- Generate: corresponding route `index.html` files

**Interfaces:**
- Article metadata includes `route`, `title`, `description`, `type`, `contentSource`, `published`, `modified`, `related`, and `schemaType`.
- Companion page uses `SoftwareApplication`; educational pages use `Article`; all use `BreadcrumbList`.

- [ ] **Step 1: Write failing intent and accuracy tests**

Assert required routes exist and raw content includes:

- accuracy page: wrist estimation, calibration limits, intervals, treadmill calibration qualification;
- connection page: FTMS, Bluetooth alone is insufficient, Foot Pod or Running Speed/Cadence sensor requirement;
- Runna page: structured workouts and explicit independence/no-affiliation language;
- alternatives page: wrist estimation, calibration, foot pods, belt sensors, and FTMS bridge categories without competitor prices;
- Companion page: iOS and Android, local results, user-controlled belt, no automatic upload, and both store links.

- [ ] **Step 2: Author evidence-backed content**

Keep each page useful before introducing RunBridge. Use descriptive cross-links to compatibility, Companion, relevant documentation, related articles, and purchase. Avoid unsupported Garmin menu/model claims and competitor specifications.

- [ ] **Step 3: Generate pages and structured data**

Ensure visible page content supports every Article, SoftwareApplication, BreadcrumbList, and FAQ property emitted.

- [ ] **Step 4: Run article and internal-link tests**

Expected: all intent phrases, independence language, raw HTML, structured data, and orphan-page checks pass.

### Task 5: Homepage, Privacy, Metadata, Performance, and Accessibility

**Files:**
- Create: `site/content/home.html`
- Modify: `site/templates.mjs`
- Modify: `site/pages.mjs`
- Modify: `style.css`
- Modify: `privacy/index.html`
- Modify: `terms.html`
- Modify: `updater.html`
- Modify: `extractor.html`
- Modify: `analyzer.html`
- Modify: `compliance/index.html`
- Modify: `compliance/declaration/index.html`
- Modify: `compliance/regulatory/index.html`
- Modify: `README.md`
- Generate: `index.html`
- Create: optimized product/logo assets
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Homepage configured prices are the sole Product Offer price source.
- Homepage visible review and JSON-LD review are emitted together from one configuration value or both omitted.
- All public pages share a tracker-free invariant.

- [ ] **Step 1: Write failing homepage/privacy tests**

Assert the homepage contains the approved hero, three primary actions, `$49`, `$20`, treadmill-reported qualification, Companion links, compatibility links, privacy claims, and visible review/JSON-LD parity. Assert every public HTML page lacks `G-TH1G0W27XH`, `googletagmanager`, and `gtag(`. Assert Product return policy does not say free return shipping.

- [ ] **Step 2: Build the conversion-focused homepage**

Implement hero, problem explanation, three-step bridge flow, compatibility snapshot, Companion funnel, privacy/no-subscription trust section, purchase cards, visible repository review when exact parity is maintained, and educational-resource links.

- [ ] **Step 3: Remove GA4 and correct stale factual content**

Remove GA loader/configuration from every public HTML page. Update privacy to current iOS/Android availability and no website analytics. Correct README firmware and public route references. Correct all prices and return structured data.

- [ ] **Step 4: Apply shared accessibility/mobile styling**

Add skip link, strong `:focus-visible`, compact responsive navigation, readable article widths, evidence badges, breadcrumbs, responsive table containment, intrinsic image sizing, accessible store links, and reduced-motion behavior. Maintain contrast and existing blue/dark identity.

- [ ] **Step 5: Optimize images**

Create smaller web-ready product/logo assets from the existing originals, preserving originals for documentation/manufacturing uses. Record dimensions in HTML, eagerly load only the hero image, and lazy-load below-fold images.

- [ ] **Step 6: Run homepage, privacy, and accessibility-static tests**

Expected: all pricing, tracking-removal, raw content, structured-data parity, image dimension, and semantic checks pass.

### Task 6: Sitemap, Full Validation, and Browser Verification

**Files:**
- Modify: `scripts/build-site.mjs`
- Modify: `scripts/validate-site.mjs`
- Modify: `tests/site.test.mjs`
- Generate: `sitemap.xml`
- Verify: `robots.txt` and all public/generated pages

**Interfaces:**
- Sitemap contains canonical public URLs only.
- Validator returns no errors for the completed tree.

- [ ] **Step 1: Add final sitemap/robots tests**

Assert every canonical generated route appears exactly once in `sitemap.xml`, no `docs.html?page=` URL appears, `robots.txt` allows `/` and references the production sitemap, and tool/legal routes remain included where appropriate.

- [ ] **Step 2: Run the complete build and automated suite**

Run build, validation, Node tests, `git diff --check`, and a filtered search for GA4/jsDelivr/runtime Markdown. Save only concise command summaries for final reporting.

- [ ] **Step 3: Start a local static server**

Serve the repository root on a loopback port using the available Python runtime. Do not open a public listener.

- [ ] **Step 4: Perform desktop browser checks**

Inspect homepage, compatibility hub, all model pages, Companion, all articles, all docs, updater, extractor, analyzer, terms, privacy, compliance, sitemap, and robots. Check page titles, canonical URLs, H1s, navigation, major CTAs, and console errors.

- [ ] **Step 5: Perform 390 px mobile checks**

Inspect homepage, compatibility hub, one lab-tested model, one customer-field-history model, Companion, one article, docs index, and troubleshooting. Check horizontal overflow, navigation height, focus/tap targets, table containment, and layout shifts.

- [ ] **Step 6: Run Lighthouse or the closest available equivalent**

Run the available local browser audit against the homepage plus one article. Report actual scores/findings or state precisely which audit mechanism was unavailable and provide the browser/performance evidence used instead.

- [ ] **Step 7: Verify external destinations**

Confirm Etsy, App Store, and Google Play links resolve. Do not submit forms or make purchases.

- [ ] **Step 8: Review final scope and status**

Run `git status --short` and review the diff. Confirm no unrelated files changed, no commits were created after the user prohibition, and nothing was pushed. Prepare the final deliverable grouped by SEO, compatibility, content, conversion, documentation, performance, accessibility, search intents, URLs, evidence, verification, remaining opportunities, and expected qualitative impact.
