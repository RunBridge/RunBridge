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
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="1200">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" href="/Docs/runbridge-logo-128.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="/style.css?v=20260830-2">
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
        <a href="/terms.html">Terms</a><a href="/privacy">Privacy</a><a href="/compliance/">Compliance</a><a href="/guides/">Guides</a><a href="mailto:${siteConfig.supportEmail}">Support</a>
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}

const compatibilityStatus = {
  compatible: 'RunBridge tested',
  reported: 'Customer confirmed',
  incompatible: 'Not compatible',
};

export function renderCompatibilityHub(records) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Treadmill compatibility', href: '/compatibility/' }];
  const fullName = (record) => `${record.manufacturer} ${record.model}${record.variant ? ` ${record.variant}` : ''}`;
  const searchIndex = (record) => {
    const raw = fullName(record).toLowerCase();
    return `${raw} ${raw.replace(/[\s./-]+/g, '')}`.trim();
  };
  const badge = (record) => `<span class="compat-badge" data-status="${escapeHtml(record.status)}">${escapeHtml(compatibilityStatus[record.status] ?? record.status)}</span>`;
  const row = (record) => `<li class="compat-row" id="${escapeHtml(record.slug)}" data-search="${escapeHtml(searchIndex(record))}"><div class="compat-row-head"><span class="compat-model">${escapeHtml(fullName(record))}</span>${badge(record)}</div>${record.note ? `<p class="compat-note">${escapeHtml(record.note)}</p>` : ''}</li>`;
  const group = (heading, items, attr = '') => `<section class="compat-brand"${attr}><h2>${escapeHtml(heading)}</h2><ul>${items.map(row).join('')}</ul></section>`;

  const listed = records.filter((record) => record.status !== 'incompatible');
  const incompatible = records.filter((record) => record.status === 'incompatible');

  const brands = new Map();
  for (const record of listed) {
    if (!brands.has(record.manufacturer)) brands.set(record.manufacturer, []);
    brands.get(record.manufacturer).push(record);
  }
  const brandSections = [...brands.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'en', { sensitivity: 'base' }))
    .map(([brand, items]) => group(brand, items.sort((x, y) => x.model.localeCompare(y.model, 'en', { numeric: true, sensitivity: 'base' }))))
    .join('');
  const incompatibleSection = incompatible.length ? group('Not compatible', incompatible, ' data-group="incompatible"') : '';

  const filterScript = `<script>
(function () {
  var wrap = document.querySelector('[data-compat-filter]');
  if (!wrap) return;
  wrap.hidden = false;
  var input = wrap.querySelector('input');
  var status = document.querySelector('[data-compat-status]');
  var empty = document.querySelector('[data-compat-empty]');
  var rows = [].slice.call(document.querySelectorAll('.compat-row'));
  var groups = [].slice.call(document.querySelectorAll('.compat-brand'));
  function run() {
    var value = input.value.trim();
    var tokens = value.toLowerCase().split(/\\s+/).filter(Boolean);
    var shown = 0;
    rows.forEach(function (r) {
      var hay = r.getAttribute('data-search') || '';
      var ok = tokens.every(function (t) {
        var compact = t.replace(/[\\s./-]+/g, '');
        return hay.indexOf(t) !== -1 || (compact && hay.indexOf(compact) !== -1);
      });
      r.hidden = !ok;
      if (ok) shown += 1;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.compat-row:not([hidden])'); });
    if (empty) empty.hidden = shown !== 0;
    if (status) {
      status.textContent = !tokens.length ? ''
        : shown === 0 ? 'No treadmills match “' + value + '”.'
        : shown + (shown === 1 ? ' treadmill matches “' : ' treadmills match “') + value + '”.';
    }
  }
  input.addEventListener('input', run);
  var preset = new URLSearchParams(location.search).get('q');
  if (preset) { input.value = preset; run(); }
})();
</script>`;

  const body = `<p class="page-lede">Check whether a treadmill can send its speed and distance to Garmin through RunBridge. A Bluetooth logo alone is not enough — RunBridge needs a treadmill that broadcasts Bluetooth FTMS workout data.</p>
    <aside class="accuracy-note"><h2>What the labels mean</h2><ul>
      <li><strong>RunBridge tested</strong> — RunBridge has run this treadmill with RunBridge and confirmed it works.</li>
      <li><strong>Customer confirmed</strong> — a customer confirms this treadmill works with RunBridge; RunBridge has not independently tested it. Check yours with the free RunBridge Companion app before buying.</li>
      <li><strong>Not compatible</strong> — Customer has reported this treadmill does not work with RunBridge.</li>
    </ul></aside>
    <div class="compat-filter" data-compat-filter hidden>
      <label for="compat-search">Find your treadmill</label>
      <input type="search" id="compat-search" autocomplete="off" spellcheck="false" placeholder="Search by brand or model, e.g. Sole F80">
      <p class="compat-status" data-compat-status role="status" aria-live="polite"></p>
    </div>
    <div class="compat-list">${brandSections}${incompatibleSection}</div>
    <p class="compat-empty" data-compat-empty hidden>No treadmill matches your search. Test yours with the free <a href="/runbridge-companion/">RunBridge Companion</a> app to check it before buying.</p>
    <section class="cta-panel"><h2>Treadmill not listed?</h2><p>Most FTMS treadmills are not individually listed yet. Use RunBridge Companion to check whether yours broadcasts the workout data RunBridge needs.</p><div class="button-row"><a class="btn btn-primary" href="/runbridge-companion/">Check my treadmill</a><a class="btn btn-ghost" href="/guides/check-compatibility/">Read the compatibility guide</a></div></section>
    ${filterScript}`;
  return renderPage({
    route: '/compatibility/',
    title: 'Treadmill Compatibility with Garmin and RunBridge',
    description: 'Check whether your treadmill can send speed and distance to Garmin through RunBridge, or test an unlisted treadmill before buying.',
    h1: 'RunBridge treadmill compatibility',
    breadcrumbs: renderBreadcrumbs(crumbs),
    body,
    schema: [
      { '@context': 'https://schema.org', '@type': 'WebPage', name: 'RunBridge treadmill compatibility', description: 'Which treadmills can send speed and distance to Garmin through RunBridge.', url: canonicalUrl('/compatibility/') },
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
  const faqs = [
    {
      q: 'Does RunBridge store or upload my workout data?',
      a: 'No. RunBridge relays speed and distance from your treadmill to your watch as a standard Bluetooth sensor. Your run is recorded by your watch and lives in Garmin Connect, just like any other activity. Communication stays local and there is no RunBridge account or cloud sync.',
    },
    {
      q: 'Can I update the firmware myself?',
      a: 'Firmware is not publicly distributed. RunBridge ships ready to use, and support provides a firmware file individually if an update is ever needed. Email support@runbridge.dev if you think you need one.',
    },
    {
      q: 'What if RunBridge does not work with my treadmill or watch?',
      a: 'Test your treadmill first with the free RunBridge Companion app. If you have already bought RunBridge and cannot get it working, email support@runbridge.dev within 14 days of delivery and we will help or arrange a return or refund under the Support and Policies terms.',
    },
  ];
  const faqItems = faqs.map((item) => `<div><dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd></div>`).join('');
  const body = `<section class="hero-landing">
      <div><p class="eyebrow">Treadmill data on Garmin</p><h1>Your treadmill already knows its speed. Let your Garmin know it too.</h1>
      <p class="hero-copy">RunBridge relays treadmill-reported speed and distance from compatible Bluetooth FTMS treadmills to Garmin as a familiar running sensor—without a subscription, cloud account or phone during the workout.</p>
      <div class="button-row"><a class="btn btn-primary" href="/compatibility/">Check my treadmill</a><a class="btn btn-secondary" href="/runbridge-companion/">Test with Companion</a><a class="btn btn-ghost" href="#get-runbridge">Get RunBridge</a></div></div>
      <img src="/Docs/runbridge-front.webp" width="640" height="960" alt="Front and back views of the compact RunBridge device" fetchpriority="high">
    </section>
    <section class="problem-section"><div><p class="eyebrow">The problem</p><h2>Indoor running asks Garmin to estimate</h2><p>Without GPS, wrist-based pace and distance can lag or disagree with the treadmill, especially through intervals and pace changes. Calibration can help, but it does not solve every live-pacing situation.</p><a class="text-link" href="/garmin-treadmill-accuracy/">Understand Garmin treadmill accuracy</a></div><div><p class="eyebrow">The bridge</p><h2>Use the treadmill's own reported workout data</h2><p>RunBridge translates compatible FTMS data into a running-sensor profile Garmin understands. It does not claim the treadmill's physical belt speed is perfectly calibrated.</p><a class="text-link" href="/connect-treadmill-to-garmin/">See how the connection works</a></div></section>
    <section><p class="eyebrow">Check before buying</p><h2>Is your treadmill compatible?</h2><p>Check the compatibility list for your treadmill model, or test an unlisted model with the free RunBridge Companion app. Generic Bluetooth support is not enough; RunBridge needs usable FTMS workout data.</p><div class="button-row"><a class="btn btn-primary" href="/compatibility/">See compatible treadmills</a><a class="btn btn-secondary" href="/runbridge-companion/">Test with RunBridge Companion</a></div></section>
    <section class="trust-grid"><div><strong>Local Bluetooth</strong><span>No unnecessary cloud account</span></div><div><strong>No subscription</strong><span>Buy the hardware once</span></div><div><strong>Privacy focused</strong><span>Workout communication stays local</span></div><div><strong>Independently developed</strong><span>Focused support and documentation</span></div></section>
    <section id="get-runbridge"><p class="eyebrow">Choose your build</p><h2>Get RunBridge</h2><div class="product-grid">
      <article><h3>Assembled RunBridge</h3><p class="price">$${siteConfig.assembledPrice} USD</p><p>Ready-to-use hardware for runners who want the simplest path from a compatible treadmill to Garmin.</p><a class="btn btn-primary" href="${siteConfig.assembledEtsyUrl}">Buy assembled on Etsy</a></article>
      <article><h3>DIY kit</h3><p class="price">$${siteConfig.diyPrice} USD</p><p>For makers who want to assemble the documented RunBridge hardware themselves.</p><a class="btn btn-secondary" href="${siteConfig.diyEtsyUrl}">Buy the DIY kit on Etsy</a></article>
    </div></section>
    <section class="review-section"><h2>What RunBridge customers say</h2><p>Recent feedback from the <a class="text-link" href="https://www.etsy.com/shop/RunBridge#reviews">RunBridge Etsy shop</a>.</p><div class="review-grid">${reviewCards}</div></section>
    <section><h2>Learn before you choose</h2><div class="resource-grid"><article><h3><a href="/garmin-treadmill-accuracy/">Garmin treadmill accuracy</a></h3><p>Why pace and distance differ, and where calibration helps.</p></article><article><h3><a href="/runna-garmin-treadmill/">Runna, Garmin and treadmill workouts</a></h3><p>What structured indoor workouts reveal about live pace.</p></article><article><h3><a href="/garmin-treadmill-foot-pod/">Foot pod alternatives</a></h3><p>Compare the main measurement approaches honestly.</p></article></div></section>
    <section class="faq-section"><h2>Common questions</h2><dl class="faq-list">${faqItems}</dl></section>`;
  return renderPage({
    route: '/', title: 'RunBridge: Treadmill Speed and Distance on Garmin',
    description: 'Send treadmill-reported speed and distance from a compatible Bluetooth FTMS treadmill to Garmin. Check compatibility before buying RunBridge.',
    h1: 'Your treadmill already knows its speed. Let your Garmin know it too.', hideTitle: true, mainClass: 'home-shell', body,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'RunBridge', url: siteConfig.origin, email: siteConfig.contactEmail },
      { '@context': 'https://schema.org', '@type': 'Product', name: productName, description: 'Hardware bridge that relays compatible treadmill-reported FTMS speed and distance to Garmin as a running sensor.', image: `${siteConfig.origin}${siteConfig.socialImage}`, brand: { '@type': 'Brand', name: 'RunBridge' }, offers: [{ '@type': 'Offer', name: 'Assembled RunBridge', price: siteConfig.assembledPrice, priceCurrency: 'USD', url: siteConfig.assembledEtsyUrl }, { '@type': 'Offer', name: 'RunBridge DIY kit', price: siteConfig.diyPrice, priceCurrency: 'USD', url: siteConfig.diyEtsyUrl }], review: customerReviews.map((review) => ({ '@type': 'Review', author: { '@type': 'Person', name: review.author }, datePublished: review.date, reviewBody: review.body, reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 } })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) },
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
  <title>RunBridge documentation index</title>
  <meta name="description" content="Index of the current RunBridge setup, compatibility, troubleshooting, LED status and support guides.">
  <link rel="canonical" href="https://runbridge.dev/guides/">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="stylesheet" href="/style.css?v=20260830-2">
  <script>(function(){var k=new URLSearchParams(location.search).get('page');var routes={'QuickStart':'/guides/quick-start/','Troubleshooting':'/guides/troubleshooting/','Compatibility':'/guides/check-compatibility/','LED-States':'/guides/led-states/','Support-and-Policies':'/guides/support-and-policies/'};if(k&&routes[k])location.replace(routes[k]);}());</script>
</head>
<body class="content-page">
  <main id="main-content">
    <div class="page-shell doc-shell">
      <h1>RunBridge documentation</h1>
      <p>RunBridge guides now live at <a href="/guides/">runbridge.dev/guides/</a>. Older <code>docs.html?page=&hellip;</code> links redirect to their current locations below.</p>
      <nav class="legacy-links" aria-label="RunBridge guides and compatibility">
        <a href="/guides/quick-start/">RunBridge quick-start guide</a>
        <a href="/guides/troubleshooting/">RunBridge troubleshooting guide</a>
        <a href="/guides/check-compatibility/">Check treadmill compatibility</a>
        <a href="/guides/led-states/">RunBridge LED status guide</a>
        <a href="/guides/support-and-policies/">RunBridge support and policies</a>
        <a href="/compatibility/">Treadmill compatibility list</a>
      </nav>
    </div>
  </main>
</body>
</html>
`;
}
