import { canonicalUrl, siteConfig } from './config.mjs';

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function jsonLd(schema) {
  const blocks = Array.isArray(schema) ? schema : [];
  return blocks.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n  ');
}

function navigation() {
  return siteConfig.navigation
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join('\n        ');
}

export function renderBreadcrumbs(items) {
  const links = items.map((item, index) => {
    const current = index === items.length - 1;
    return current
      ? `<li aria-current="page">${escapeHtml(item.label)}</li>`
      : `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`;
  }).join('');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${links}</ol></nav>`;
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: canonicalUrl(item.href),
    })),
  };
}

export function makeBreadcrumbSchema(items) {
  return breadcrumbSchema(items);
}

function listSection(title, values) {
  if (!values?.length) return '';
  return `<section><h2>${escapeHtml(title)}</h2><ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul></section>`;
}

export function renderPage(page) {
  const canonical = canonicalUrl(page.route);
  const socialImage = new URL(page.socialImage ?? siteConfig.socialImage, siteConfig.origin).href;
  const schema = page.schema ?? [{
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.h1,
    description: page.description,
    url: canonical,
  }];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${escapeHtml(page.ogType ?? 'website')}">
  <meta property="og:site_name" content="RunBridge">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:alt" content="RunBridge treadmill-to-Garmin bridge device">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" type="image/png" href="/Docs/runbridge-logo-128.png">
  <link rel="stylesheet" href="/style.css?v=20260829-2">
  ${jsonLd(schema)}
</head>
<body class="${escapeHtml(page.bodyClass ?? 'content-page')}">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="nav-inner">
      <a class="logo" href="/" aria-label="RunBridge home">
        <img src="/Docs/runbridge-logo-128.png" alt="" class="logo-img" width="30" height="30">
        <span>RunBridge<small>Treadmill → Garmin bridge</small></span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        ${navigation()}
      </nav>
    </div>
  </header>
  <main id="main-content">
    <div class="${escapeHtml(page.mainClass ?? 'page-shell')}">
${page.breadcrumbs ? `      ${page.breadcrumbs}\n` : ''}${page.hideTitle ? '' : `      <h1>${escapeHtml(page.h1)}</h1>\n`}
      ${page.body}
    </div>
  </main>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>© 2026 RunBridge. Independently developed and privacy focused.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/terms.html">Terms</a><a href="/privacy/">Privacy</a><a href="/compliance/">Compliance</a><a href="/guides/">Guides</a><a href="mailto:${siteConfig.supportEmail}">Support</a>
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}

export function renderCompatibilityPage(record, { allRecords = [] } = {}) {
  const name = `${record.manufacturer} ${record.model}${record.variant ? ` ${record.variant}` : ''}`;
  const route = `/compatibility/${record.slug}/`;
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Treadmill compatibility', href: '/compatibility/' },
    { label: name, href: route },
  ];
  const fieldHistoryNote = record.classification === 'customer_field_history'
    ? '<p class="evidence-caution"><strong>Evidence strength:</strong> This is customer field history, not a direct RunBridge lab test or an explicit customer confirmation. No compatibility failure was reported for the recorded firmware 4.0.1 deployment.</p>'
    : '';
  const related = allRecords.filter((candidate) => record.related?.includes(candidate.slug) && candidate.detailPage)
    .map((candidate) => `<li><a href="/compatibility/${candidate.slug}/">${escapeHtml(candidate.manufacturer)} ${escapeHtml(candidate.model)}</a></li>`)
    .join('');
  const body = `
    <p class="page-lede">${escapeHtml(record.summary)}</p>
    <section class="compatibility-status" data-classification="${escapeHtml(record.classification)}">
      <p class="status-label">${escapeHtml(record.publicStatus)}</p>
      ${fieldHistoryNote}
      <dl class="evidence-grid">
        <div><dt>Evidence</dt><dd>${escapeHtml(record.evidence)}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(record.source || 'Project records')}</dd></div>
        <div><dt>Recorded</dt><dd>${escapeHtml(record.recordedDate || 'Date not recorded')}</dd></div>
        <div><dt>Firmware</dt><dd>${escapeHtml(record.firmware || 'Not recorded')}</dd></div>
      </dl>
    </section>
    ${listSection('Setup notes', record.setup)}
    ${listSection('Known limitations', record.limitations)}
    <aside class="accuracy-note"><h2>What “compatible” means</h2><p>RunBridge can relay the speed and distance data this treadmill reports. It cannot correct a treadmill whose belt speed or console distance is itself miscalibrated.</p></aside>
    <section class="cta-panel"><h2>Test your treadmill before buying</h2><p>RunBridge Companion checks the FTMS services and live workout data RunBridge needs, locally on your phone.</p><div class="button-row"><a class="btn btn-primary" href="/runbridge-companion/">Test with RunBridge Companion</a><a class="btn btn-ghost" href="${siteConfig.etsyUrl}">Get RunBridge</a></div></section>
    ${related ? `<section><h2>Related treadmills</h2><ul>${related}</ul></section>` : ''}
  `;
  return renderPage({
    route,
    title: `${name} Garmin Compatibility | RunBridge`,
    description: `See the recorded RunBridge compatibility evidence for the ${name}, including status, firmware context, limitations, and how to test FTMS support.`,
    h1: `${name} and RunBridge compatibility`,
    body,
    breadcrumbs: renderBreadcrumbs(crumbs),
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${name} and RunBridge compatibility`,
        description: record.summary,
        url: canonicalUrl(route),
      },
      breadcrumbSchema(crumbs),
    ],
  });
}

export function renderCompatibilityHub(records) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Treadmill compatibility', href: '/compatibility/' }];
  const positive = records.filter((record) => record.detailPage);
  const unsupported = records.filter((record) => record.classification === 'unsupported');
  const unknown = records.filter((record) => !record.detailPage && record.classification !== 'unsupported');
  const card = (record) => `<article class="compatibility-card" data-classification="${escapeHtml(record.classification)}">
    <p class="eyebrow">${escapeHtml(record.manufacturer)}</p>
    <h2><a href="/compatibility/${record.slug}/">${escapeHtml(record.model)}</a></h2>
    <p class="status-label">${escapeHtml(record.publicStatus)}</p>
    <p>${escapeHtml(record.summary)}</p>
    <a class="text-link" href="/compatibility/${record.slug}/">View ${escapeHtml(record.manufacturer)} ${escapeHtml(record.model)} evidence</a>
  </article>`;
  const compactRows = (items) => items.map((record) => `<tr><th scope="row">${escapeHtml(record.manufacturer)} ${escapeHtml(record.model)}</th><td>${escapeHtml(record.publicStatus)}</td><td>${escapeHtml(record.evidence)}</td></tr>`).join('');
  const body = `<p class="page-lede">Find the evidence RunBridge has for specific treadmills. A Bluetooth logo alone does not prove FTMS support, so every status below is tied to a project record rather than a manufacturer marketing inference.</p>
    <aside class="accuracy-note"><h2>Read the evidence label</h2><p><strong>RunBridge tested</strong>, <strong>customer confirmed</strong>, and <strong>customer field history</strong> are different evidence strengths. Field history means a firmware 4.0.1 deployment exists with no reported compatibility failure; it is not presented as a direct lab test.</p></aside>
    <section><h2>Working treadmill records</h2><div class="compatibility-grid">${positive.map(card).join('')}</div></section>
    ${(unsupported.length || unknown.length) ? `<section><h2>Other inventory records</h2><p>These entries do not get positive model pages.</p><div class="table-scroll"><table><thead><tr><th>Treadmill</th><th>Status</th><th>Evidence</th></tr></thead><tbody>${compactRows([...unsupported, ...unknown])}</tbody></table></div></section>` : ''}
    <section class="cta-panel"><h2>Your treadmill is not listed?</h2><p>Use RunBridge Companion to check the actual FTMS service and live data instead of guessing from generic Bluetooth support.</p><div class="button-row"><a class="btn btn-primary" href="/runbridge-companion/">Check my treadmill</a><a class="btn btn-ghost" href="/guides/check-compatibility/">Read the compatibility guide</a></div></section>`;
  return renderPage({
    route: '/compatibility/',
    title: 'Treadmill Compatibility with Garmin and RunBridge',
    description: 'Browse evidence-backed RunBridge compatibility records for FTMS treadmills and test an unlisted treadmill before buying.',
    h1: 'RunBridge treadmill compatibility',
    breadcrumbs: renderBreadcrumbs(crumbs),
    body,
    schema: [
      { '@context': 'https://schema.org', '@type': 'WebPage', name: 'RunBridge treadmill compatibility', description: 'Evidence-backed RunBridge compatibility records for FTMS treadmills.', url: canonicalUrl('/compatibility/') },
      breadcrumbSchema(crumbs),
    ],
  });
}

export function renderDocsIndex() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Guides', href: '/guides/' }];
  const body = `<p class="page-lede">Permanent, crawlable guides for setup, compatibility testing, troubleshooting and support.</p>
    <div class="resource-grid">
      <article><h2><a href="/guides/quick-start/">Quick start</a></h2><p>Connect RunBridge to a compatible treadmill, then pair its running sensor with Garmin.</p></article>
      <article><h2><a href="/guides/check-compatibility/">Check compatibility</a></h2><p>Verify FTMS service and live treadmill data before purchasing.</p></article>
      <article><h2><a href="/guides/troubleshooting/">Troubleshooting</a></h2><p>Use connection behavior and status lights to isolate treadmill or Garmin issues.</p></article>
      <article><h2><a href="/guides/led-states/">LED states</a></h2><p>Understand RunBridge connection and firmware-update patterns.</p></article>
      <article><h2><a href="/guides/support-and-policies/">Support and policies</a></h2><p>Contact support and review warranty, returns and customer policies.</p></article>
      <article><h2><a href="/updater.html">Firmware updater</a></h2><p>Install a support-provided RunBridge firmware file.</p></article>
    </div>`;
  return renderPage({
    route: '/guides/', title: 'RunBridge Guides and Support',
    description: 'RunBridge setup, treadmill compatibility, LED status, troubleshooting, firmware update and support documentation.',
    h1: 'RunBridge documentation', body,
    breadcrumbs: renderBreadcrumbs(crumbs),
    schema: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'RunBridge guides', description: 'RunBridge setup, compatibility, troubleshooting and support guides.', url: canonicalUrl('/guides/') },
      breadcrumbSchema(crumbs),
    ],
  });
}

export function renderHomePage() {
  const productName = 'RunBridge treadmill-to-Garmin bridge';
  const customerReviews = [
    { author: 'Evan', date: '2026-08-22', body: 'Extremely easy to use, very helpful, blows away its competitors' },
    { author: 'Thilo', date: '2026-08-21', body: 'Works perfectly. Very easy installation.' },
    { author: 'Solvej', date: '2026-06-29', body: "Everything worked (therefore didn't need customer service), thanks!" },
    { author: 'Rhys Jacob', date: '2026-02-17', body: 'This is exactly what I needed and the seller could not have been more accommodating. I can finally run on my treadmill and have my garmin know exactly how far I went!' },
  ];
  const reviewCards = customerReviews.map((review) => `<figure class="customer-review"><blockquote>“${escapeHtml(review.body)}”</blockquote><figcaption><strong>${escapeHtml(review.author)}</strong><span>5-star Etsy review · <time datetime="${review.date}">${review.date}</time></span></figcaption></figure>`).join('');
  const body = `<section class="hero-landing">
      <div><p class="eyebrow">Treadmill data on Garmin</p><h1>Your treadmill already knows its speed. Let your Garmin know it too.</h1>
      <p class="hero-copy">RunBridge relays treadmill-reported speed and distance from compatible Bluetooth FTMS treadmills to Garmin as a familiar running sensor—without a subscription, cloud account or phone during the workout.</p>
      <div class="button-row"><a class="btn btn-primary" href="/compatibility/">Check my treadmill</a><a class="btn btn-secondary" href="/runbridge-companion/">Test with Companion</a><a class="btn btn-ghost" href="#get-runbridge">Get RunBridge</a></div></div>
      <img src="/Docs/runbridge-front.webp" width="640" height="960" alt="Front and back views of the compact RunBridge device" fetchpriority="high">
    </section>
    <section class="problem-section"><div><p class="eyebrow">The problem</p><h2>Indoor running asks Garmin to estimate</h2><p>Without GPS, wrist-based pace and distance can lag or disagree with the treadmill, especially through intervals and pace changes. Calibration can help, but it does not solve every live-pacing situation.</p><a class="text-link" href="/garmin-treadmill-accuracy/">Understand Garmin treadmill accuracy</a></div><div><p class="eyebrow">The bridge</p><h2>Use the treadmill's own reported workout data</h2><p>RunBridge translates compatible FTMS data into a running-sensor profile Garmin understands. It does not claim the treadmill's physical belt speed is perfectly calibrated.</p><a class="text-link" href="/connect-treadmill-to-garmin/">See how the connection works</a></div></section>
    <section><p class="eyebrow">Check before buying</p><h2>Is your treadmill compatible?</h2><p>Browse model-specific evidence or test an unlisted treadmill with the free RunBridge Companion app. Generic Bluetooth support is not enough; RunBridge needs usable FTMS workout data.</p><div class="button-row"><a class="btn btn-primary" href="/compatibility/">See compatible treadmills</a><a class="btn btn-secondary" href="/runbridge-companion/">Test with RunBridge Companion</a></div></section>
    <section class="trust-grid"><div><strong>Local Bluetooth</strong><span>No unnecessary cloud account</span></div><div><strong>No subscription</strong><span>Buy the hardware once</span></div><div><strong>Privacy focused</strong><span>Workout communication stays local</span></div><div><strong>Independently developed</strong><span>Focused support and documentation</span></div></section>
    <section id="get-runbridge"><p class="eyebrow">Choose your build</p><h2>Get RunBridge</h2><div class="product-grid">
      <article><h3>Assembled RunBridge</h3><p class="price">$${siteConfig.assembledPrice}</p><p>Ready-to-use hardware for runners who want the simplest path from a compatible treadmill to Garmin.</p><a class="btn btn-primary" href="${siteConfig.etsyUrl}">Buy assembled on Etsy</a></article>
      <article><h3>DIY kit</h3><p class="price">$${siteConfig.diyPrice}</p><p>For makers who want to assemble the documented RunBridge hardware themselves.</p><a class="btn btn-secondary" href="${siteConfig.etsyUrl}">Buy the DIY kit on Etsy</a></article>
    </div></section>
    <section class="review-section"><h2>What RunBridge customers say</h2><p>Recent feedback from the <a class="text-link" href="https://www.etsy.com/shop/RunBridge#reviews">RunBridge Etsy shop</a>.</p><div class="review-grid">${reviewCards}</div></section>
    <section><h2>Learn before you choose</h2><div class="resource-grid"><article><h3><a href="/garmin-treadmill-accuracy/">Garmin treadmill accuracy</a></h3><p>Why pace and distance differ, and where calibration helps.</p></article><article><h3><a href="/runna-garmin-treadmill/">Runna, Garmin and treadmill workouts</a></h3><p>What structured indoor workouts reveal about live pace.</p></article><article><h3><a href="/garmin-treadmill-foot-pod/">Foot pod alternatives</a></h3><p>Compare the main measurement approaches honestly.</p></article></div></section>`;
  return renderPage({
    route: '/', title: 'RunBridge: Treadmill Speed and Distance on Garmin',
    description: 'Send treadmill-reported speed and distance from a compatible Bluetooth FTMS treadmill to Garmin. Check compatibility before buying RunBridge.',
    h1: 'Your treadmill already knows its speed. Let your Garmin know it too.', hideTitle: true, mainClass: 'home-shell', body,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'RunBridge', url: siteConfig.origin, email: siteConfig.contactEmail },
      { '@context': 'https://schema.org', '@type': 'Product', name: productName, description: 'Hardware bridge that relays compatible treadmill-reported FTMS speed and distance to Garmin as a running sensor.', image: `${siteConfig.origin}${siteConfig.socialImage}`, brand: { '@type': 'Brand', name: 'RunBridge' }, offers: [{ '@type': 'Offer', name: 'Assembled RunBridge', price: siteConfig.assembledPrice, priceCurrency: 'USD', url: siteConfig.etsyUrl }, { '@type': 'Offer', name: 'RunBridge DIY kit', price: siteConfig.diyPrice, priceCurrency: 'USD', url: siteConfig.etsyUrl }], review: customerReviews.map((review) => ({ '@type': 'Review', author: { '@type': 'Person', name: review.author }, datePublished: review.date, reviewBody: review.body, reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 } })) },
    ],
  });
}

export function renderLegacyDocsPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,follow">
  <title>RunBridge guides have moved</title>
  <link rel="canonical" href="https://runbridge.dev/guides/">
  <noscript><meta http-equiv="refresh" content="0; url=/guides/"></noscript>
  <script>(function(){var p=new URLSearchParams(location.search).get('page');var routes={'QuickStart':'/guides/quick-start/','Troubleshooting':'/guides/troubleshooting/','Compatibility':'/guides/check-compatibility/','LED-States':'/guides/led-states/','Support-and-Policies':'/guides/support-and-policies/'};location.replace(routes[p]||'/guides/');}());</script>
</head>
<body>
  <p>RunBridge documentation has moved to <a href="/guides/">the current guides</a>.</p>
</body>
</html>
`;
}
