import path from 'node:path';

export const siteConfig = Object.freeze({
  origin: 'https://runbridge.dev',
  name: 'RunBridge',
  assembledPrice: '49',
  diyPrice: '20',
  etsyUrl: 'https://runbridge.etsy.com',
  appStoreUrl: 'https://apps.apple.com/app/runbridge-companion/id6795531707',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=dev.runbridge.companion',
  supportEmail: 'support@runbridge.dev',
  contactEmail: 'hello@runbridge.dev',
  socialImage: '/Docs/runbridge-front.png',
  navigation: [
    { href: '/compatibility/', label: 'Compatibility' },
    { href: '/runbridge-companion/', label: 'Companion' },
    { href: '/garmin-treadmill-accuracy/', label: 'Garmin Guides' },
    { href: '/guides/', label: 'Guides' },
    { href: '/#get-runbridge', label: 'Get RunBridge' },
  ],
});

export function normalizeRoute(route) {
  if (!route || route === '/') return '/';
  const cleaned = String(route).replace(/^\/+|\/+$/g, '');
  return cleaned.endsWith('.html') ? `/${cleaned}` : `/${cleaned}/`;
}

export function canonicalUrl(route) {
  return `${siteConfig.origin}${normalizeRoute(route)}`;
}

export function routeToFile(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') return 'index.html';
  if (normalized.endsWith('.html')) return normalized.slice(1);
  return path.posix.join(normalized.slice(1), 'index.html');
}
