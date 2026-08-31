import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

import { canonicalUrl, routeToFile, siteConfig } from '../site/config.mjs';
import { contentPages, publicRoutes } from '../site/pages.mjs';
import {
  makeBreadcrumbSchema,
  renderBreadcrumbs,
  renderCompatibilityHub,
  renderDocsIndex,
  renderHomePage,
  renderLegacyDocsPage,
  renderPage,
} from '../site/templates.mjs';
import { validateCompatibilityRecords } from './validate-site.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function interpolate(source) {
  return source
    .replaceAll('{{APP_STORE_URL}}', siteConfig.appStoreUrl)
    .replaceAll('{{GOOGLE_PLAY_URL}}', siteConfig.googlePlayUrl)
    .replaceAll('{{ETSY_URL}}', siteConfig.etsyUrl);
}

function withoutFirstMarkdownHeading(source) {
  return source.replace(/^#\s+.+(?:\r?\n)+/, '');
}

function pageSchema(page) {
  const base = {
    '@context': 'https://schema.org',
    '@type': page.kind === 'article' ? 'Article' : page.kind === 'software' ? 'SoftwareApplication' : 'TechArticle',
    name: page.h1,
    headline: page.h1,
    description: page.description,
    url: canonicalUrl(page.route),
    author: { '@type': 'Organization', name: 'RunBridge', url: siteConfig.origin },
    publisher: { '@type': 'Organization', name: 'RunBridge', url: siteConfig.origin },
  };
  if (page.kind === 'software') {
    delete base.headline;
    base.applicationCategory = 'UtilitiesApplication';
    base.operatingSystem = 'iOS, Android';
    base.isAccessibleForFree = true;
    base.downloadUrl = [siteConfig.appStoreUrl, siteConfig.googlePlayUrl];
  }
  return base;
}

async function writeRoute(outputDir, route, html) {
  const filename = path.join(outputDir, routeToFile(route));
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, html, 'utf8');
}

export async function buildSite({ outputDir = projectRoot } = {}) {
  const records = JSON.parse(await readFile(path.join(projectRoot, 'site', 'compatibility.json'), 'utf8'));
  const compatibilityErrors = validateCompatibilityRecords(records);
  if (compatibilityErrors.length) throw new Error(compatibilityErrors.join('\n'));

  if (path.resolve(outputDir) !== projectRoot) {
    for (const relative of ['style.css', 'updater.html', 'extractor.html', 'analyzer.html', 'terms.html']) {
      await mkdir(path.dirname(path.join(outputDir, relative)), { recursive: true });
      await copyFile(path.join(projectRoot, relative), path.join(outputDir, relative));
    }
    for (const relative of ['privacy', 'compliance']) {
      await cp(path.join(projectRoot, relative), path.join(outputDir, relative), { recursive: true });
    }
    for (const relative of ['favicon.ico', 'apple-touch-icon.png', 'Docs/runbridge-logo-128.png', 'Docs/runbridge-front.webp', 'Docs/runbridge-front.jpg', 'Docs/badges/google-play.png', 'Docs/badges/app-store.svg']) {
      await mkdir(path.dirname(path.join(outputDir, relative)), { recursive: true });
      await copyFile(path.join(projectRoot, relative), path.join(outputDir, relative));
    }
  }

  await writeRoute(outputDir, '/', renderHomePage());
  await writeRoute(outputDir, '/compatibility/', renderCompatibilityHub(records));
  await writeRoute(outputDir, '/guides/', renderDocsIndex());

  for (const page of contentPages) {
    const raw = await readFile(path.join(projectRoot, page.source), 'utf8');
    const bodyHtml = marked.parse(interpolate(withoutFirstMarkdownHeading(raw)), { gfm: true });
    const crumbs = [
      { label: 'Home', href: '/' },
      ...(page.kind === 'documentation' ? [{ label: 'Guides', href: '/guides/' }] : []),
      { label: page.h1, href: page.route },
    ];
    const related = page.kind === 'article'
      ? '<aside class="cta-panel"><h2>Check your treadmill</h2><p>Check the treadmill compatibility list, or test FTMS support with the free RunBridge Companion app.</p><div class="button-row"><a class="btn btn-primary" href="/compatibility/">See compatibility</a><a class="btn btn-ghost" href="/runbridge-companion/">Test with Companion</a></div></aside>'
      : page.kind === 'documentation'
        ? '<nav class="doc-next" aria-label="Documentation links"><a href="/guides/">All guides</a><a href="/compatibility/">Treadmill compatibility</a><a href="/runbridge-companion/">Companion app</a></nav>'
        : '';
    await writeRoute(outputDir, page.route, renderPage({
      ...page,
      title: page.title.includes('RunBridge') ? page.title : `${page.title} | RunBridge`,
      body: `<div class="prose">${bodyHtml}</div>${related}`,
      breadcrumbs: renderBreadcrumbs(crumbs),
      mainClass: page.kind === 'documentation' ? 'page-shell doc-shell' : 'page-shell article-shell',
      ogType: page.kind === 'article' ? 'article' : 'website',
      schema: [pageSchema(page), makeBreadcrumbSchema(crumbs)],
    }));
  }

  await writeFile(path.join(outputDir, 'docs.html'), renderLegacyDocsPage(), 'utf8');

  const legacyRoutes = ['/updater.html', '/extractor.html', '/analyzer.html', '/terms.html', '/privacy/', '/compliance/', '/compliance/declaration/', '/compliance/regulatory/'];
  const sitemapRoutes = [...new Set([...publicRoutes, ...legacyRoutes])];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${canonicalUrl(route).replace(/\/$/, route.endsWith('.html') ? '' : '/')}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(path.join(outputDir, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(path.join(outputDir, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://runbridge.dev/sitemap.xml\n', 'utf8');

  return { routes: sitemapRoutes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildSite();
  console.log(`Built ${result.routes.length} public routes.`);
}
