import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (p) => readFile(path.join(root, p), 'utf8');
const exists = async (p) => { try { await stat(path.join(root, p)); return true; } catch { return false; } };

const required = [
  'README.md','AGENTS.md','.env.example',
  'src/layouts/BaseLayout.astro','src/layouts/SiteLayout.astro',
  'src/config/site.ts','src/config/navigation.ts','src/config/seo.ts','src/data/faq.ts',
  'src/components/layout/Header.astro','src/components/layout/Footer.astro','src/components/layout/Navigation.astro',
  'src/components/integrations/analytics/GoogleAnalytics.astro',
  'src/pages/robots.txt.ts',
];

test('agency-standard files exist', async () => {
  for (const file of required) assert.equal(await exists(file), true, `${file} should exist`);
});

test('BaseLayout owns SEO and optional analytics', async () => {
  const source = await read('src/layouts/BaseLayout.astro');
  assert.match(source, /rel="canonical"/);
  assert.match(source, /rel="sitemap"/);
  assert.match(source, /property="og:title"/);
  assert.match(source, /name="twitter:card"/);
  assert.match(source, /GoogleAnalytics/);
  assert.match(source, /noindex/);
  assert.ok(source.indexOf('<GoogleAnalytics />') < source.indexOf('<meta name="description"'), 'analytics hook should remain high in <head>');
});

test('analytics is disabled without a valid GA4 measurement id', async () => {
  const source = await read('src/components/integrations/analytics/GoogleAnalytics.astro');
  assert.match(source, /PUBLIC_GA_MEASUREMENT_ID/);
  assert.match(source, /astro:env\/client/);
  assert.match(source, /G-/);
  assert.match(source, /gtag\('config'/);
  assert.match(source, /<script is:inline async/);
});


test('structured-data scripts are explicitly inline', async () => {
  const source = await read('src/components/seo/StructuredData.astro');
  assert.match(source, /<script is:inline type="application\/ld\+json"/);
});

test('sitemap is configured for active Concept 01 only', async () => {
  const source = await read('astro.config.mjs');
  assert.match(source, /@astrojs\/sitemap/);
  assert.match(source, /SITE_URL/);
  assert.match(source, /process\.env\.SITE_URL/);
  assert.match(source, /envField/);
  assert.match(source, /env:\s*\{/);
  assert.match(source, /concept-01/);
  assert.match(source, /filter/);
});



test('architecture refactor preserves the V6 header composition', async () => {
  const source = await read('src/components/layout/Header.astro');
  assert.doesNotMatch(source, /BookingStatus/);
});

test('retired Concept 01 layout shims are removed', async () => {
  assert.equal(await exists('src/layouts/PrecisionLayout.astro'), false);
  assert.equal(await exists('src/components/Concept01Nav.astro'), false);
});

test('Concept 01 route files are thin compositions using SiteLayout', async () => {
  const routes = ['index','approach','services','about','pricing','faq','contact'];
  for (const route of routes) {
    const file = `src/pages/concept-01/${route}.astro`;
    const source = await read(file);
    assert.match(source, /SiteLayout/);
    assert.ok(source.split('\n').length < 45, `${file} should remain a thin route file`);
  }
});


test('structured content is separated from page composition', async () => {
  const source = await read('src/components/sections/faq/FaqPage.astro');
  assert.match(source, /faqCategories/);
  assert.match(source, /src\/data|\.\.\/\.\.\/\.\.\/data/);
  assert.doesNotMatch(source, /const categories = \[/);
});



test('SEO verifier checks canonical and indexability output', async () => {
  const source = await read('scripts/verify-seo-output.mjs');
  assert.match(source, /canonical/);
  assert.match(source, /noindex, nofollow/);
  assert.match(source, /index, follow/);
  assert.match(source, /SITE_URL/);
});

test('standalone agency verification does not depend on factory schemas', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.match(pkg.scripts.test, /v6-1-architecture\.test\.mjs/);
  assert.match(pkg.scripts.test, /concept-01-v8\.test\.mjs/);
  assert.match(pkg.scripts.verify, /v6-1-architecture\.test\.mjs/);
  assert.match(pkg.scripts.verify, /concept-01-v8\.test\.mjs/);
  assert.match(pkg.scripts.verify, /astro check/);
  assert.match(pkg.scripts.verify, /astro build/);
  assert.match(pkg.scripts.verify, /verify-seo-output/);
  assert.ok(pkg.scripts['test:factory'], 'factory provenance validation should remain available explicitly');
});

test('site manifest references the current Concept 01 architecture', async () => {
  const manifest = JSON.parse(await read('site-manifest.json'));
  const concept = manifest.concepts.find(({ id }) => id === 'concept-01');
  assert.ok(concept.customComponents.includes('SiteLayout'));
  assert.ok(concept.customComponents.includes('layout/Header'));
  assert.ok(!concept.customComponents.includes('PrecisionLayout'));
  assert.ok(!concept.customComponents.includes('Concept01Nav'));
});

test('documentation defines agency architecture and SEO/analytics setup', async () => {
  const readme = await read('README.md');
  const agents = await read('AGENTS.md');
  for (const term of ['Google Analytics','sitemap','SITE_URL','PUBLIC_GA_MEASUREMENT_ID','BaseLayout']) assert.match(readme, new RegExp(term));
  for (const term of ['thin route','client facts','npm run check','sitemap','analytics']) assert.match(agents, new RegExp(term, 'i'));
});
