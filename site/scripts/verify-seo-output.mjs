import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const siteOrigin = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const routes = ['/concept-01/','/concept-01/approach/','/concept-01/services/','/concept-01/about/','/concept-01/pricing/','/concept-01/faq/','/concept-01/contact/'];

const [sitemapIndex, sitemap, robots, home, concept2, concept3] = await Promise.all([
  readFile('dist/sitemap-index.xml', 'utf8'),
  readFile('dist/sitemap-0.xml', 'utf8'),
  readFile('dist/robots.txt', 'utf8'),
  readFile('dist/concept-01/index.html', 'utf8'),
  readFile('dist/concept-02/index.html', 'utf8'),
  readFile('dist/concept-03/index.html', 'utf8'),
]);

assert.match(sitemapIndex, /sitemap-0\.xml/);
for (const route of routes) assert.ok(sitemap.includes(route), `sitemap should contain ${route}`);
assert.ok(!sitemap.includes('/concept-02/'), 'sitemap must exclude concept-02');
assert.ok(!sitemap.includes('/concept-03/'), 'sitemap must exclude concept-03');
assert.ok(sitemap.includes(`${siteOrigin}/concept-01/`), 'sitemap should use SITE_URL origin');

assert.ok(robots.includes(`Sitemap: ${siteOrigin}/sitemap-index.xml`), 'robots.txt should expose the production sitemap URL');
assert.ok(home.includes(`<link rel="canonical" href="${siteOrigin}/concept-01/">`), 'active homepage canonical should use SITE_URL');
assert.ok(home.includes('<meta name="robots" content="index, follow">'), 'active client pages should be indexable');
assert.ok(home.includes('<meta property="og:title"'), 'active client pages should include Open Graph metadata');
assert.ok(home.includes('<link rel="sitemap" href="/sitemap-index.xml">'), 'active client pages should expose sitemap discovery');
assert.ok(concept2.includes('<meta name="robots" content="noindex, nofollow">'), 'concept-02 must remain noindex, nofollow');
assert.ok(concept3.includes('<meta name="robots" content="noindex, nofollow">'), 'concept-03 must remain noindex, nofollow');

console.log('SEO output verified: canonical/site origin, sitemap, robots, metadata, and historical noindex behavior are correct.');
