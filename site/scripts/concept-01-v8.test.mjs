import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (p) => readFile(path.join(root, p), 'utf8');

test('FAQ uses simple directory structure', async () => {
  const source = await read('src/components/sections/faq/FaqPage.astro');
  assert.match(source, /faq-directory-v8/);
  assert.doesNotMatch(source, /faq-explorer/);
});

test('Services uses directory layout instead of v7 cards', async () => {
  const source = await read('src/components/sections/services/ServicesPage.astro');
  assert.match(source, /services-directory-v8/);
  assert.doesNotMatch(source, /service-card-v7/);
});

test('Mobile navigation has hamburger toggle that toggles aria-expanded', async () => {
  const source = await read('src/components/layout/Navigation.astro');
  assert.match(source, /mobile-menu-toggle/);
  assert.match(source, /aria-expanded="false"/);
  assert.match(source, /setAttribute\('aria-expanded'/);
});

test('Pricing uses compact V7 layout hooks', async () => {
  const source = await read('src/components/sections/pricing/PricingPage.astro');
  assert.match(source, /pricing-v7/);
  assert.match(source, /pricing-v7__summary/);
  assert.match(source, /pricing-v7__packages/);
});
