import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalUrl, routeToFile } from '../site/config.mjs';

export const compatibilityStatuses = new Set(['compatible', 'reported', 'incompatible']);

export function validateCompatibilityRecords(records) {
  const errors = [];
  const slugs = new Set();
  for (const record of records) {
    if (slugs.has(record.slug)) errors.push(`Duplicate compatibility slug: ${record.slug}`);
    slugs.add(record.slug);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug ?? '')) {
      errors.push(`Invalid compatibility slug: ${record.slug}`);
    }
    if (!compatibilityStatuses.has(record.status)) {
      errors.push(`Invalid compatibility status for ${record.slug}: ${record.status}`);
    }
    if (!String(record.manufacturer ?? '').trim() || !String(record.model ?? '').trim()) {
      errors.push(`Missing manufacturer or model for ${record.slug}`);
    }
  }
  return errors;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function internalTargets(html, route) {
  const base = canonicalUrl(route);
  return [...html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)]
    .map((match) => match[1].trim())
    .filter((target) => target && !target.startsWith('#') && !target.startsWith('?'))
    .map((target) => {
      try {
        const resolved = new URL(target, base);
        return resolved.origin === new URL(base).origin
          ? { target, pathname: decodeURIComponent(resolved.pathname) }
          : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function targetToFile(target) {
  if (target.endsWith('/')) return routeToFile(target);
  return target.slice(1);
}

export async function validateSite({ rootDir, routes, checkSitemap = true }) {
  const errors = [];
  const routeList = routes ?? [];
  const titles = new Map();
  for (const route of routeList) {
    const relative = routeToFile(route);
    const file = path.join(rootDir, relative);
    if (!(await exists(file))) {
      errors.push(`Missing generated route: ${route} (${relative})`);
      continue;
    }
    const html = await readFile(file, 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    if (!title) errors.push(`Missing title: ${route}`);
    else if (titles.has(title)) errors.push(`Duplicate title: ${route} and ${titles.get(title)}`);
    else titles.set(title, route);
    if (!/<meta name="description" content="[^"]+"\s*\/?>/.test(html)) errors.push(`Missing description: ${route}`);
    if (!/<link rel="canonical" href="https:\/\/runbridge\.dev\/[^"]*"\s*\/?>/.test(html)) errors.push(`Missing canonical: ${route}`);
    if ((html.match(/<h1\b/g) ?? []).length !== 1) errors.push(`Expected one H1: ${route}`);
    if (/googletagmanager|jsdelivr|marked\.min\.js/i.test(html)) errors.push(`Forbidden remote runtime script: ${route}`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical && canonical !== canonicalUrl(route)) errors.push(`Incorrect canonical in ${route}: ${canonical}`);

    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(match[1]); } catch { errors.push(`Invalid JSON-LD: ${route}`); }
    }

    for (const { target, pathname } of internalTargets(html, route)) {
      const targetFile = path.join(rootDir, targetToFile(pathname));
      if (!(await exists(targetFile))) errors.push(`Broken internal link in ${route}: ${target} (resolved to ${pathname})`);
    }
  }

  if (checkSitemap) {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    if (!(await exists(sitemapPath))) errors.push('Missing sitemap.xml');
    else {
      const sitemap = await readFile(sitemapPath, 'utf8');
      if (/docs\.html\?page=/i.test(sitemap)) errors.push('Legacy query documentation URL in sitemap');
      for (const route of routeList) {
        const expected = `<loc>${canonicalUrl(route)}</loc>`;
        const count = sitemap.split(expected).length - 1;
        if (count !== 1) errors.push(`Expected one sitemap entry for ${route}; found ${count}`);
      }
    }
  }
  return errors;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const rootDir = path.resolve(process.cwd());
  const [{ publicRoutes }, records] = await Promise.all([
    import('../site/pages.mjs'),
    readFile(path.join(rootDir, 'site', 'compatibility.json'), 'utf8').then(JSON.parse),
  ]);
  const routes = [
    ...publicRoutes,
    '/updater.html', '/extractor.html', '/analyzer.html', '/terms.html', '/privacy/',
    '/compliance/', '/compliance/declaration/', '/compliance/regulatory/',
  ];
  const errors = [...validateCompatibilityRecords(records), ...await validateSite({ rootDir, routes })];
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Site validation passed.');
  }
}
