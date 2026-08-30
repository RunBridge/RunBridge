import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { canonicalUrl, routeToFile } from '../site/config.mjs';
import { publicRoutes } from '../site/pages.mjs';
import { renderCompatibilityHub, renderCompatibilityPage, renderHomePage, renderPage } from '../site/templates.mjs';
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

test('compatibility validation enforces evidence and classification rules', () => {
  const invalid = [
    { slug: 'duplicate', classification: 'customer_field_history', firmware: '3.2.5', evidence: '' },
    { slug: 'duplicate', classification: 'invented_status', evidence: 'Unsupported classification.' },
    { slug: 'unsupported-positive', classification: 'unsupported', evidence: 'Explicit no.', detailPage: true },
  ];
  const errors = validateCompatibilityRecords(invalid);
  assert.ok(errors.some((error) => error.includes('Duplicate compatibility slug')));
  assert.ok(errors.some((error) => error.includes('requires firmware 4.0.1')));
  assert.ok(errors.some((error) => error.includes('Invalid compatibility classification')));
  assert.ok(errors.some((error) => error.includes('Unsupported record cannot have a positive detail page')));
});

test('compatibility page visibly distinguishes customer field history from testing', () => {
  const html = renderCompatibilityPage({
    slug: 'bowflex-t9',
    manufacturer: 'BowFlex',
    model: 'T9',
    classification: 'customer_field_history',
    publicStatus: 'Customer field history — no issue reported',
    summary: 'A customer deployment is recorded for this treadmill.',
    recordedDate: '2026-07-18',
    source: 'Customer',
    firmware: '4.0.1',
    evidence: 'Customer deployment with no reported compatibility failure.',
    setup: [],
    limitations: ['This is not a direct RunBridge lab test or explicit customer confirmation.'],
    related: [],
    detailPage: true,
  }, { allRecords: [] });

  assert.match(html, /BowFlex T9/);
  assert.match(html, /Customer field history/);
  assert.match(html, /not a direct RunBridge lab test/i);
  assert.match(html, /RunBridge Companion/);
  assert.doesNotMatch(html, /Tested by RunBridge/);
});

test('compatibility evidence snapshot publishes a positive model route per detail record', async () => {
  const records = JSON.parse(await readFile(new URL('../site/compatibility.json', import.meta.url), 'utf8'));
  assert.deepEqual(validateCompatibilityRecords(records), []);
  const detailRecords = records.filter((record) => record.detailPage);
  const hub = renderCompatibilityHub(records);

  // The hub links every detail record and never links a non-detail record.
  assert.ok(detailRecords.length > 0);
  for (const record of detailRecords) {
    assert.ok(hub.includes(`href="/compatibility/${record.slug}/"`), `hub should link ${record.slug}`);
  }
  for (const record of records.filter((record) => !record.detailPage)) {
    assert.ok(!hub.includes(`href="/compatibility/${record.slug}/"`), `hub should not link ${record.slug}`);
  }

  assert.ok(detailRecords.some((record) => record.slug === 'technogym-excite-run-700-unity'));
  assert.ok(detailRecords.some((record) => record.slug === 'domyos-t900d'));
  assert.ok(!detailRecords.some((record) => record.model === 'Unknown'));
  assert.ok(!detailRecords.some((record) => record.classification === 'unsupported'));
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

test('static build emits crawlable funnel, model and documentation pages', async () => {
  const { buildSite } = await import('../scripts/build-site.mjs');
  const outputDir = await mkdtemp(path.join(tmpdir(), 'runbridge-build-test-'));
  const result = await buildSite({ outputDir });

  const records = JSON.parse(await readFile(new URL('../site/compatibility.json', import.meta.url), 'utf8'));
  const detailRecords = records.filter((record) => record.detailPage);
  assert.ok(detailRecords.length > 0);
  assert.equal(result.compatibilityPages, detailRecords.length);
  for (const record of detailRecords) {
    const modelHtml = await readFile(path.join(outputDir, routeToFile(`/compatibility/${record.slug}/`)), 'utf8');
    assert.match(modelHtml, /<main id="main-content">/, `built page for ${record.slug}`);
  }
  for (const route of [
    '/', '/compatibility/', '/compatibility/spirit-xt685/', '/runbridge-companion/',
    '/garmin-treadmill-accuracy/', '/guides/', '/guides/quick-start/',
  ]) {
    const html = await readFile(path.join(outputDir, routeToFile(route)), 'utf8');
    assert.match(html, /<main id="main-content">/);
    assert.doesNotMatch(html, /marked\.min\.js|googletagmanager/i);
  }

  const sitemap = await readFile(path.join(outputDir, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/runbridge\.dev\/compatibility\/spirit-xt685\//);
  assert.match(sitemap, /https:\/\/runbridge\.dev\/garmin-treadmill-accuracy\//);

  const legacyDocs = await readFile(path.join(outputDir, 'docs.html'), 'utf8');
  assert.match(legacyDocs, /\/guides\/quick-start\//);
  assert.match(legacyDocs, /<meta name="robots" content="noindex,follow">/);
  assert.match(legacyDocs, /location\.replace/);
  assert.doesNotMatch(legacyDocs, /<ul>|Quick start<\/a>|Primary navigation/);
  assert.doesNotMatch(legacyDocs, /fetch\(|marked\.min\.js|jsdelivr/i);

  const validationErrors = await validateSite({ outputDir, rootDir: outputDir, routes: result.routes.filter((route) => !route.endsWith('.html')) });
  assert.deepEqual(validationErrors, []);
});
