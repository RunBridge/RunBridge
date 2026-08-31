import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

import { canonicalUrl, routeToFile, siteConfig } from '../site/config.mjs';
import { publicRoutes } from '../site/pages.mjs';
import { renderCompatibilityHub, renderHomePage, renderPage } from '../site/templates.mjs';
import { validateCompatibilityRecords, validateSite } from '../scripts/validate-site.mjs';

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test('route helpers create canonical URLs and generated file paths', () => {
  assert.equal(canonicalUrl('/compatibility/'), 'https://runbridge.dev/compatibility/');
  assert.equal(routeToFile('/'), 'index.html');
  assert.equal(routeToFile('/guides/quick-start/'), 'guides/quick-start/index.html');
  assert.equal(routeToFile('/updater.html'), 'updater.html');
  assert.equal(canonicalUrl('/updater.html'), 'https://runbridge.dev/updater.html');
});

test('shared page shell is crawlable, semantic, and tracker free', () => {
  const html = renderPage({
    route: '/example/',
    title: 'Example page | RunBridge',
    description: 'A sufficiently useful example description for the RunBridge page shell.',
    h1: 'Example page',
    body: '<p>Visible example content.</p>',
    schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Example page' }],
  });

  assert.match(html, /<link rel="canonical" href="https:\/\/runbridge\.dev\/example\/">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<h1>Example page<\/h1>/);
  assert.doesNotMatch(html, /googletagmanager|jsdelivr|marked\.min\.js/i);
  assert.equal(jsonLdBlocks(html)[0]['@type'], 'WebPage');
});

test('validator reports broken internal links', async () => {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'runbridge-site-test-'));
  await mkdir(path.join(rootDir, 'example'), { recursive: true });
  await writeFile(path.join(rootDir, 'example', 'index.html'), `<!doctype html>
    <html lang="en"><head><title>Example | RunBridge</title>
    <meta name="description" content="A complete example description for validation.">
    <link rel="canonical" href="https://runbridge.dev/example/"></head>
    <body><main><h1>Example</h1><a href="/missing/">Missing</a></main></body></html>`);

  const errors = await validateSite({ rootDir, routes: ['/example/'], checkSitemap: false });
  assert.ok(errors.some((error) => error.includes('Broken internal link') && error.includes('/missing/')));
});

test('validator resolves document-relative links from the current route', async () => {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'runbridge-relative-link-test-'));
  await mkdir(path.join(rootDir, 'guides', 'support-and-policies'), { recursive: true });
  await writeFile(path.join(rootDir, 'guides', 'support-and-policies', 'index.html'), `<!doctype html>
    <html lang="en"><head><title>Policies | RunBridge</title>
    <meta name="description" content="A complete example description for validation.">
    <link rel="canonical" href="https://runbridge.dev/guides/support-and-policies/"></head>
    <body><main><h1>Policies</h1><a href="terms.html">Terms</a></main></body></html>`);

  const errors = await validateSite({ rootDir, routes: ['/guides/support-and-policies/'], checkSitemap: false });
  assert.ok(errors.some((error) => error.includes('Broken internal link') && error.includes('terms.html')));
});

test('compatibility validation enforces unique slugs and known statuses', () => {
  const invalid = [
    { slug: 'dup', manufacturer: 'Acme', model: 'One', status: 'compatible' },
    { slug: 'dup', manufacturer: 'Acme', model: 'Two', status: 'reported' },
    { slug: 'bad status', manufacturer: 'Beta', model: 'X', status: 'compatible' },
    { slug: 'invented-state', manufacturer: 'Gamma', model: 'Y', status: 'maybe' },
    { slug: 'no-brand', manufacturer: '', model: '', status: 'reported' },
  ];
  const errors = validateCompatibilityRecords(invalid);
  assert.ok(errors.some((error) => error.includes('Duplicate compatibility slug')));
  assert.ok(errors.some((error) => error.includes('Invalid compatibility slug')));
  assert.ok(errors.some((error) => error.includes('Invalid compatibility status')));
  assert.ok(errors.some((error) => error.includes('Missing manufacturer or model')));
});

test('compatibility hub distinguishes RunBridge-tested from customer-confirmed treadmills', () => {
  const hub = renderCompatibilityHub([
    { slug: 'acme-tested', manufacturer: 'Acme', model: 'Tested', status: 'compatible' },
    { slug: 'beta-confirmed', manufacturer: 'Beta', model: 'Confirmed', status: 'reported' },
    { slug: 'gamma-no', manufacturer: 'Gamma', model: 'Nope', status: 'incompatible' },
  ]);

  assert.match(hub, /data-status="compatible">RunBridge tested</);
  assert.match(hub, /data-status="reported">Customer confirmed</);
  assert.match(hub, /data-status="incompatible">Not compatible</);
  // A customer-confirmed treadmill is never badged as RunBridge tested.
  assert.doesNotMatch(hub, /data-status="reported">RunBridge tested</);
  // The evidence-source distinction is visible on the page.
  assert.match(hub, /has not independently tested it/i);
  // Incompatible treadmills sit in their own group, not under a manufacturer.
  assert.match(hub, /<h2>Not compatible<\/h2>/);
});

test('compatibility snapshot lists every treadmill on the hub', async () => {
  const records = JSON.parse(await readFile(new URL('../site/compatibility.json', import.meta.url), 'utf8'));
  assert.deepEqual(validateCompatibilityRecords(records), []);
  const hub = renderCompatibilityHub(records);
  assert.ok(records.length > 0);

  for (const record of records) {
    const name = `${record.manufacturer} ${record.model}${record.variant ? ` ${record.variant}` : ''}`;
    assert.ok(hub.includes(`>${name}</span>`), `hub should list ${name}`);
  }
  // No per-model detail routes are generated any more.
  assert.doesNotMatch(hub, /href="\/compatibility\/[a-z0-9-]+\/"/);
  assert.ok(!records.some((record) => record.manufacturer === 'Kayoba'));
  assert.doesNotMatch(hub, /Kayoba/i);
});

test('homepage renders four visible Etsy reviews mirrored by Product schema', () => {
  const html = renderHomePage();
  assert.equal((html.match(/class="customer-review"/g) ?? []).length, 4);
  for (const reviewer of ['Rhys Jacob', 'Evan', 'Thilo', 'Solvej']) assert.match(html, new RegExp(reviewer));
  const product = jsonLdBlocks(html).find((block) => block['@type'] === 'Product');
  assert.ok(Array.isArray(product.review));
  assert.equal(product.review.length, 4);
  assert.deepEqual(product.review.map((review) => review.author.name), ['Evan', 'Thilo', 'Solvej', 'Rhys Jacob']);
});

test('homepage purchase choices link to the configured Etsy listings and match the schema offers', () => {
  const html = renderHomePage();
  const { assembledEtsyUrl, diyEtsyUrl } = siteConfig;

  assert.notEqual(assembledEtsyUrl, diyEtsyUrl, 'assembled and DIY listings must be distinct');
  assert.ok(html.includes(`href="${assembledEtsyUrl}"`), 'assembled purchase button links to assembledEtsyUrl');
  assert.ok(html.includes(`href="${diyEtsyUrl}"`), 'DIY purchase button links to diyEtsyUrl');

  const product = jsonLdBlocks(html).find((block) => block['@type'] === 'Product');
  const offerUrlByName = Object.fromEntries(product.offers.map((offer) => [offer.name, offer.url]));
  assert.equal(offerUrlByName['Assembled RunBridge'], assembledEtsyUrl);
  assert.equal(offerUrlByName['RunBridge DIY kit'], diyEtsyUrl);
});

test('shared social metadata accurately describes the portrait product image', () => {
  const html = renderHomePage();
  assert.match(html, /<meta property="og:image:width" content="800">/);
  assert.match(html, /<meta property="og:image:height" content="1200">/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
});

test('default link color meets WCAG AA contrast on the darkest card background', async () => {
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const linkHex = css.match(/--link:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(linkHex, 'Expected a dedicated link color token');

  const luminance = (hex) => {
    const values = hex.match(/[0-9a-f]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
    const linear = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const foreground = luminance(linkHex);
  const background = luminance('#0b1120');
  const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  assert.ok(contrast >= 4.5, `Expected at least 4.5:1 contrast; received ${contrast.toFixed(2)}:1`);
});

test('log extractor renders device and error text without interpreting HTML', async () => {
  const html = await readFile(new URL('../extractor.html', import.meta.url), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'Expected inline extractor script');

  const elements = new Map();
  const element = () => ({
    textContent: '',
    innerHTML: '',
    value: '',
    disabled: false,
    classList: { add() {}, remove() {} },
    addEventListener() {},
    click() {},
  });
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
  };
  const context = vm.createContext({ document, navigator: { serial: {} }, console, setTimeout, clearTimeout, Date, Blob, URL, TextEncoder, TextDecoder });
  vm.runInContext(`${script}\nsetStatus('warn', 'RunBridge detected', '<img src=x onerror=alert(1)>');`, context);

  assert.equal(elements.get('statusBody').textContent, '<img src=x onerror=alert(1)>');
  assert.equal(elements.get('statusBody').innerHTML, '');
});

test('generated compatibility guide applies matched store badge hooks', async () => {
  const { buildSite } = await import('../scripts/build-site.mjs');
  const outputDir = await mkdtemp(path.join(tmpdir(), 'runbridge-badge-test-'));
  await buildSite({ outputDir });
  const html = await readFile(path.join(outputDir, routeToFile('/guides/check-compatibility/')), 'utf8');
  assert.match(html, /class="store-badges"/);
  assert.match(html, /class="store-badge-google"[^>]+height="58"/);
  assert.match(html, /class="store-badge-apple"[^>]+height="40"/);
});

test('public route manifest covers the acquisition funnel and crawlable documentation', () => {
  const requiredRoutes = [
    '/',
    '/compatibility/',
    '/runbridge-companion/',
    '/garmin-treadmill-accuracy/',
    '/connect-treadmill-to-garmin/',
    '/runna-garmin-treadmill/',
    '/garmin-treadmill-foot-pod/',
    '/guides/',
    '/guides/quick-start/',
    '/guides/troubleshooting/',
    '/guides/check-compatibility/',
    '/guides/led-states/',
    '/guides/support-and-policies/',
  ];
  for (const route of requiredRoutes) assert.ok(publicRoutes.includes(route), `Missing ${route}`);
});

test('article metadata targets distinct search intent without thin titles', async () => {
  const { contentPages } = await import('../site/pages.mjs');
  const pages = contentPages.filter((page) => page.kind === 'article');
  assert.equal(pages.length, 4);
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length);
  assert.ok(pages.some((page) => page.route === '/garmin-treadmill-accuracy/' && /pace|distance/i.test(page.description)));
  assert.ok(pages.some((page) => page.route === '/runna-garmin-treadmill/' && /independent/i.test(page.description)));
});

test('static build emits crawlable funnel and documentation pages', async () => {
  const { buildSite } = await import('../scripts/build-site.mjs');
  const outputDir = await mkdtemp(path.join(tmpdir(), 'runbridge-build-test-'));
  const result = await buildSite({ outputDir });

  for (const route of [
    '/', '/compatibility/', '/runbridge-companion/',
    '/garmin-treadmill-accuracy/', '/guides/', '/guides/quick-start/',
  ]) {
    const html = await readFile(path.join(outputDir, routeToFile(route)), 'utf8');
    assert.match(html, /<main id="main-content">/);
    assert.doesNotMatch(html, /marked\.min\.js|googletagmanager/i);
  }

  const sitemap = await readFile(path.join(outputDir, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/runbridge\.dev\/compatibility\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/runbridge\.dev\/garmin-treadmill-accuracy\/<\/loc>/);
  assert.doesNotMatch(sitemap, /compatibility\/[a-z0-9-]+\//);

  const legacyDocs = await readFile(path.join(outputDir, 'docs.html'), 'utf8');
  assert.match(legacyDocs, /\/guides\/quick-start\//);
  assert.match(legacyDocs, /<meta name="robots" content="noindex,follow">/);
  assert.match(legacyDocs, /location\.replace/);
  assert.doesNotMatch(legacyDocs, /<ul>|Quick start<\/a>|Primary navigation/);
  assert.doesNotMatch(legacyDocs, /fetch\(|marked\.min\.js|jsdelivr/i);

  const privacy = await readFile(path.join(outputDir, 'privacy', 'index.html'), 'utf8');
  assert.match(privacy, /<link rel="canonical" href="https:\/\/runbridge\.dev\/privacy\/"/);
  assert.match(privacy, /<main id="main-content">/);
  assert.match(privacy, /<nav class="nav-links" aria-label="Primary navigation">/);

  const validationErrors = await validateSite({ outputDir, rootDir: outputDir, routes: result.routes.filter((route) => !route.endsWith('.html')) });
  assert.deepEqual(validationErrors, []);
});
