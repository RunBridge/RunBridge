# RunBridge Search, Compatibility, and Conversion Design

**Date:** 2026-08-29  
**Status:** Approved design  
**Repository:** `C:\Users\bemil\OneDrive\Documents\Arduino\RunBridge`  
**Production site:** `https://runbridge.dev`

## Purpose

Transform the existing RunBridge static website from a single product-oriented landing page with client-rendered documentation into a lightweight combination of:

- product site;
- crawlable treadmill compatibility database; and
- authoritative Garmin treadmill knowledge resource.

The work targets discovery and qualified conversion. A visitor should be able to arrive through a Garmin treadmill problem query, understand the measurement problem, determine whether their treadmill is a plausible RunBridge candidate, test it with RunBridge Companion, and purchase RunBridge when appropriate.

This is an incremental improvement to the existing site, not a visual or technical rewrite. The existing brand, static hosting, support tools, legal pages, and device workflows remain intact.

## Product and Content Accuracy Constraints

All public claims must be supported by repository evidence or by current first-party product/store pages inspected during this task.

- RunBridge relays treadmill-reported speed and distance. It does not guarantee that the treadmill itself is physically calibrated.
- RunBridge may calculate session distance from speed when native treadmill distance is unavailable, as supported by current Companion behavior.
- RunBridge cadence is estimated from pace/speed and is not direct step measurement.
- Bluetooth alone does not establish FTMS compatibility.
- Expected FTMS compatibility must never be presented as tested compatibility.
- Garmin model-family compatibility must not be generalized beyond verified evidence. Generic guidance may say that a Garmin watch must support a Foot Pod or Running Speed/Cadence sensor.
- RunBridge is independent and is not affiliated with Garmin, Runna, treadmill manufacturers, or other products mentioned for educational comparison.
- No invented testimonials, customer totals, review scores, partnerships, certifications, performance measurements, or competitor specifications may be added.
- Current visible prices are $49 for the assembled device and $20 for the DIY kit. Structured data and visible copy must match those prices.
- Version 4.0.1 is the current production firmware reference. Older versions remain historical/support information.

## Audit Findings and Priorities

### P0

1. `docs.html` fetches Markdown in the browser and renders it through `marked.js` from jsDelivr. Raw HTML contains no document content beyond a loading message.
2. All query-string documentation views canonicalize to `docs.html`, while the sitemap lists the individual query-string URLs.
3. Homepage pricing conflicts with Product JSON-LD and the comparison table.
4. Product JSON-LD declares free returns while customer terms assign return-shipping cost to the buyer.
5. Product rating and review structured data are not matched by equivalent visible content.
6. The privacy page says Android is future work even though RunBridge Companion is live on Google Play.
7. Homepage compatibility and Garmin-family claims are broader than verified repository evidence.

### P1

1. No crawlable pages target the primary Garmin treadmill problem queries.
2. Compatibility is a short section rather than a searchable, internally linked resource.
3. RunBridge Companion is buried inside a pre-purchase warning instead of serving as the central low-friction acquisition step.
4. The homepage does not offer a strong above-the-fold compatibility or purchase journey.
5. Important secondary pages lack consistent metadata, social presentation, breadcrumbs, and structured data.
6. Documentation pages are not independently crawlable or shareable.

### P2

1. The product image is approximately 2.36 MB and the logo is approximately 1.06 MB.
2. Mobile navigation consumes excessive vertical space.
3. Focus presentation, responsive tables, image sizing, and reusable semantic layout require polishing.
4. The repository README still names firmware 3.2.5 as current.

### P3

1. Future compatibility submissions need durable provenance before they can safely generate public model pages.
2. Search Console and privacy-preserving aggregate measurement can be evaluated after the new architecture is deployed.
3. Additional model pages should be created only as verified evidence accumulates.

## Architecture Decision

Use dependency-light static generation while continuing to deploy plain files from the repository root.

A small Node-based build system will:

- read page metadata, Markdown documents, and structured compatibility records;
- render complete static HTML through shared templates;
- generate sitemap entries;
- validate the full site before generated files are accepted; and
- commit generated HTML so GitHub Pages can serve it without a server-side build.

The Markdown parser is a pinned build-time dependency. It is not shipped to browsers. Public acquisition and documentation pages require no runtime JavaScript. Existing updater, extractor, and analyzer pages retain the JavaScript required for their device/support functions.

This approach is preferred over hand-maintained HTML because metadata, navigation, compatibility facts, and structured data otherwise become duplicated and drift. A larger static-site generator is unnecessary for the defined scope.

## Source and Generated Structure

The implementation plan will map exact filenames after inspecting the final repository state, but responsibilities are fixed as follows:

- A shared site configuration contains the production origin, brand information, current prices, store URLs, Companion URLs, and global navigation.
- A page manifest contains the canonical route, title, description, page type, social image, and content source for every generated page.
- Existing customer Markdown under `Docs/` remains the source for customer documentation after factual corrections.
- New educational articles use Markdown content sources with explicit page metadata.
- A single compatibility data file contains every model record and its evidence classification.
- Shared templates render the document shell, navigation, footer, breadcrumbs, callouts, related links, purchase controls, and JSON-LD.
- Generated route directories contain committed `index.html` files.
- A build script produces generated HTML and the XML sitemap.
- A validation script checks sources and generated output without network access.

Generated output must never overwrite the firmware updater, extractor, analyzer, terms, privacy, compliance, verification, branding, or raw Markdown source files unless a task explicitly owns that file.

## Public URL Design

### Product and acquisition

- `/`
- `/compatibility/`
- `/runbridge-companion/`
- `/garmin-treadmill-accuracy/`
- `/connect-treadmill-to-garmin/`
- `/runna-garmin-treadmill/`
- `/garmin-treadmill-foot-pod/`

### Initial compatibility pages

- `/compatibility/assault-runner-pro/`
- `/compatibility/spirit-xt685/`
- `/compatibility/domyos-t900d/`
- `/compatibility/horizon-7-4-at/`

No Technogym MyRun page will be generated because the repository does not contain sufficient model-specific evidence.

### Documentation

- `/docs/`
- `/docs/quick-start/`
- `/docs/troubleshooting/`
- `/docs/check-compatibility/`
- `/docs/led-states/`
- `/docs/support-and-policies/`

Existing functional URLs remain in place:

- `/updater.html`
- `/extractor.html`
- `/analyzer.html`
- `/terms.html`
- `/privacy/`
- `/compliance/`
- `/compliance/declaration/`
- `/compliance/regulatory/`

`docs.html` becomes a crawlable documentation index and legacy router. Existing links such as `docs.html?page=Troubleshooting` map to their clean replacements with a minimal inline redirect. The raw HTML also contains normal links to all replacement pages so it remains usable without JavaScript. Existing Markdown URLs remain available for repository and support use.

## Compatibility Data Model

Each record contains only fields supported by available evidence:

- stable slug;
- manufacturer;
- model;
- public status label;
- evidence classification;
- short factual summary;
- evidence notes and repository source references;
- known firmware relevance;
- known FTMS behavior;
- setup notes;
- known limitations;
- verification date when recorded;
- Companion testing call to action; and
- related model/page slugs.

Allowed evidence classifications are:

- `runbridge_tested` — directly tested in RunBridge development;
- `confirmed_working` — explicitly confirmed by existing project records, without inventing a more specific provenance;
- `firmware_evidence` — firmware history documents model-specific behavior or a compatibility correction, but the page does not claim first-party testing;
- `expected_ftms` — expected from observed standards behavior and always labeled untested;
- `unsupported` — verified not to provide the required behavior;
- `unknown` — evidence is insufficient.

The generator displays a plain-language explanation beside every status. Records with `expected_ftms`, `unsupported`, or `unknown` are permitted only when their evidence notes support publication. The build fails when a record lacks evidence notes or uses free-form status text outside the allowed vocabulary.

Initial records use these claims:

- **AssaultRunner Pro:** `runbridge_tested`; primary development treadmill.
- **Spirit XT685:** `confirmed_working`; extensive XT685/Spirit firmware behavior and compatibility corrections are documented.
- **Domyos T900D:** `confirmed_working`; existing public documentation confirms the model, while the page explicitly states that detailed console, firmware, and testing provenance were not recorded.
- **Horizon 7.4 AT:** `firmware_evidence`; firmware history documents alternating FTMS packets, Garmin pace-source flipping, distance drift, and the relevant fixes. The page does not call it RunBridge-tested.

## Homepage Design

The homepage remains concise and visually consistent with the existing dark blue RunBridge identity.

### Hero

Primary message:

> Your treadmill already knows its speed. Let your Garmin know it too.

Supporting copy explains that RunBridge takes speed and distance reported by a compatible Bluetooth FTMS treadmill and presents it to a Garmin watch as a Foot Pod or Running Speed/Cadence sensor. It immediately qualifies that RunBridge reflects treadmill-reported data and cannot correct a miscalibrated treadmill.

Primary actions:

- Check My Treadmill
- Test With RunBridge Companion
- Get RunBridge

Price and purchase availability are visible without requiring a long scroll.

### Supporting sections

1. Why Garmin indoor pace and distance can differ from treadmill-reported values.
2. A simple treadmill to RunBridge to Garmin explanation.
3. Compatibility overview with explicit evidence labels.
4. Companion as a free local compatibility test.
5. Privacy and ownership: local Bluetooth communication, no subscription, no unnecessary cloud account, and no automatic Companion upload.
6. Consistent assembled and DIY purchase choices.
7. A compact visible customer review only if it exactly matches the existing repository review content; otherwise review and rating markup are removed.
8. Educational links for accuracy, connection, Runna workouts, and foot-pod alternatives.

The current competitor price/specification table is removed because those facts drift and are not necessary to explain RunBridge. The foot-pod alternatives article compares solution categories instead.

## Educational Content Design

Every article is educational first and promotional second. Each has one H1, a concise answer near the beginning, an explanatory body, compatibility/Companion next steps, related reading, and a restrained purchase call to action.

### Garmin treadmill accuracy

Targets wrong pace, inaccurate distance, calibration, mismatch, and interval behavior. Explains wrist estimation, the limits of post-run calibration, pace transitions, external sensor categories, and treadmill-reported data without promising physical belt accuracy.

### Connect treadmill to Garmin

Explains FTMS and Garmin sensor expectations in approachable terms, why Bluetooth branding is insufficient, and where RunBridge translates FTMS into the sensor profile the watch accepts.

### Runna, Garmin, and treadmill workouts

Explains the measurement challenge during structured indoor workouts and pace changes. It states that RunBridge is independent and not affiliated with or endorsed by Runna.

### Garmin treadmill foot-pod alternatives

Compares Garmin wrist estimation, calibration, running foot pods, belt/treadmill sensors, and an FTMS bridge as categories. It avoids unsupported external pricing or specifications.

## RunBridge Companion Funnel

The Companion page and homepage explain only capabilities verified by the iOS and Android repositories and current listings:

- scans for nearby Bluetooth treadmills;
- identifies or lets the user confirm manufacturer and model;
- checks FTMS, Treadmill Data, and live notifications;
- guides a brief movement check while the user controls the treadmill;
- evaluates native distance or speed-derived distance capability;
- displays compatibility classification, confidence, reasons, limitations, and a next step;
- saves results locally; and
- shares diagnostics only when the user chooses.

The page includes current App Store and Google Play links. A successful test leads naturally to the purchase section. Inconclusive or failed results lead to documentation/support rather than an aggressive purchase prompt.

## Technical SEO and Structured Data

Every important generated page includes:

- unique title;
- unique meta description;
- absolute canonical URL;
- Open Graph title, description, URL, type, and image;
- Twitter card metadata;
- one H1 and ordered H2/H3 hierarchy;
- semantic header, nav, main, article/section, and footer landmarks;
- descriptive internal links;
- breadcrumbs where useful; and
- appropriate JSON-LD matching visible content.

Structured-data policy:

- Homepage: `Product` and `Organization`; review/rating only when visible and identical.
- Educational pages: `Article` and `BreadcrumbList`.
- Compatibility pages: `WebPage` and `BreadcrumbList`; no invented Product compatibility property.
- Companion page: `SoftwareApplication` and `BreadcrumbList`, matching visible app availability and price.
- FAQ: `FAQPage` only when the exact questions and answers are visible on that page.
- Documentation: `TechArticle` or `WebPage` and `BreadcrumbList` where the visible content supports it.

The sitemap contains canonical public URLs only. `robots.txt` continues to allow crawling and points to the sitemap.

## Privacy and Analytics

Remove every Google Analytics/GA4 loader and inline configuration block from the public site.

The implementation adds no replacement analytics, tracking pixel, advertising tracker, fingerprinting, session replay, cookie, or consent banner. The privacy policy is corrected to describe both currently available Companion platforms and to state accurately that the website uses no analytics or advertising trackers after this change.

Future aggregate measurement is a separate decision and must prefer a privacy-preserving approach with explicit approval.

## Performance Design

- Remove the runtime Markdown renderer and its jsDelivr request.
- Remove GA4 and its Google Tag Manager request.
- Use system fonts.
- Optimize large product/logo assets while preserving acceptable visual quality and existing source assets where required.
- Supply intrinsic image dimensions.
- Use eager loading only for the primary above-the-fold product image.
- Lazy-load below-the-fold images.
- Avoid a runtime application framework.
- Keep acquisition and documentation pages functional without JavaScript.
- Preserve support-tool JavaScript and Web Serial behavior.

## Accessibility and Mobile Design

- Add a visible-on-focus skip link.
- Preserve native link/button semantics.
- Provide explicit accessible names for icon/image links.
- Use visible `:focus-visible` indicators.
- Keep heading order consistent.
- Ensure text/background contrast is suitable for normal and muted copy.
- Provide responsive horizontal containment or stacked presentation for wide tables.
- Reduce mobile header height and keep navigation keyboard operable.
- Add `prefers-reduced-motion` handling for any nonessential motion.
- Preserve useful alt text and make decorative images empty-alt where appropriate.

## Build and Failure Behavior

The build validates source records before replacing generated output. It fails without accepting output when it finds:

- duplicate route or compatibility slug;
- absent title, description, canonical route, or H1;
- invalid compatibility classification;
- missing compatibility evidence notes;
- broken internal link or referenced asset;
- malformed JSON-LD;
- mismatch between visible prices and configured prices;
- missing canonical route in the sitemap;
- noncanonical query URL in the sitemap; or
- generated acquisition/documentation content that depends on a remote runtime script.

Generated files are identifiable and are updated only by the build. Tool and policy pages are validated but not regenerated unless explicitly included in the relevant task.

## Verification Strategy

### Automated

1. Run the static build.
2. Run source and generated-output validation.
3. Assert important phrases and H1 content exist in raw generated HTML.
4. Parse every JSON-LD block as JSON.
5. Validate required metadata and canonical URLs.
6. Validate compatibility record status/evidence rules.
7. Validate internal links and referenced assets.
8. Validate sitemap and robots content.
9. Verify that public content pages contain no GA4, Google Tag Manager, jsDelivr, or runtime Markdown renderer.
10. Smoke-check existing updater, extractor, analyzer, terms, privacy, compliance, and legacy documentation routes.

### Browser

1. Serve the repository through its normal local static workflow.
2. Inspect all major generated routes at desktop width.
3. Inspect homepage, compatibility hub, a model page, Companion page, an educational article, and documentation at 390 px width.
4. Check browser console errors.
5. Exercise global navigation and legacy documentation links.
6. Confirm external Etsy, App Store, and Google Play destinations.
7. Run Lighthouse or the closest available performance/accessibility equivalent and report the actual result.

### Repository safety

1. Preserve all pre-existing unrelated worktree changes.
2. Review the final diff for scope.
3. Confirm generated output matches sources.
4. Do not push. A push to the deployment branch is outside this task.

## Completion Boundary

This task implements the approved P0 and P1 work plus directly supporting P2 performance/accessibility corrections. It does not create a compatibility-submission backend, adopt a CMS, add analytics, publish unsupported treadmill pages, rewrite firmware/support tools, or deploy the site.

Remaining opportunities will be reported as a short prioritized list rather than expanding the implementation indefinitely.
