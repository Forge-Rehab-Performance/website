import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (p) => readFile(path.join(root, p), 'utf8');

test('FAQ uses one compact category explorer instead of stacked full-page groups', async () => {
  const source = await read('src/components/sections/faq/FaqPage.astro');
  assert.match(source, /faq-explorer/);
  assert.match(source, /role="tablist"/);
  assert.match(source, /aria-selected/);
  assert.match(source, /data-faq-category/);
  assert.match(source, /data-faq-panel/);
  assert.match(source, /<details class="faq-item"/);
  assert.doesNotMatch(source, /faq-group--alt/);
  assert.doesNotMatch(source, /class="faq-index"/);
});

test('FAQ has framework-free category switching behavior', async () => {
  const source = await read('src/components/sections/faq/FaqPage.astro');
  assert.match(source, /querySelectorAll/);
  assert.match(source, /aria-selected/);
  assert.match(source, /hidden/);
  assert.doesNotMatch(source, /client:(load|visible|idle)/);
});

test('Services are visible cards rather than dropdown accordions', async () => {
  const source = await read('src/components/sections/services/ServicesPage.astro');
  assert.match(source, /service-card-v7/);
  assert.ok((source.match(/<article class="service-card-v7/g) || []).length >= 5, 'expected five service cards');
  assert.doesNotMatch(source, /<details class="service-accordion"/);
  assert.doesNotMatch(source, /service-accordion__toggle/);
});

test('Pricing uses compact V7 layout hooks', async () => {
  const source = await read('src/components/sections/pricing/PricingPage.astro');
  assert.match(source, /pricing-v7/);
  assert.match(source, /pricing-v7__summary/);
  assert.match(source, /pricing-v7__packages/);
});

test('V7 responsive styles stay with the page components', async () => {
  const faq = await read('src/components/sections/faq/FaqPage.astro');
  const pricing = await read('src/components/sections/pricing/PricingPage.astro');
  const services = await read('src/components/sections/services/ServicesPage.astro');
  for (const hook of ['faq-explorer', 'faq-explorer__categories', 'faq-explorer__panel']) assert.match(faq, new RegExp(hook));
  for (const hook of ['pricing-v7', 'pricing-v7__summary', 'pricing-v7__packages']) assert.match(pricing, new RegExp(hook));
  for (const hook of ['service-card-grid-v7', 'service-card-v7']) assert.match(services, new RegExp(hook));
  assert.match(faq, /@media \(max-width: 52rem\)[\s\S]*faq-explorer__categories/);
});
