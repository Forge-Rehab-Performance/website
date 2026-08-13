import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const page = (name) => `src/pages/concept-01/${name}`;

const concept01Pages = [
  'index.astro',
  'approach.astro',
  'services.astro',
  'about.astro',
  'pricing.astro',
  'faq.astro',
  'contact.astro',
];

test('Concept 01 exposes the complete seven-page route set', () => {
  for (const filename of concept01Pages) {
    assert.equal(existsSync(resolve(root, page(filename))), true, `${filename} should exist`);
  }
});

test('Concept 01 navigation links to real pages while historical concepts keep planned navigation', () => {
  const nav = read('src/components/Concept01Nav.astro');
  const historicalNav = read('src/components/ConceptNav.astro');
  for (const route of ['services', 'about', 'pricing', 'faq', 'contact']) {
    assert.match(nav, new RegExp(`${route}`), `nav should contain ${route}`);
  }
  assert.match(nav, /\/concept-01\/services\//);
  assert.match(historicalNav, /PlannedItem/);
  assert.doesNotMatch(historicalNav, /\/concept-01\/services\//);
});

test('Services page includes all five supplied services and accessible expanders', () => {
  const source = read(page('services.astro'));
  for (const label of [
    'Orthopedic Physical Therapy',
    'Sports &amp; Injury Rehabilitation',
    'Post-Operative Rehabilitation',
    'Return to Sport &amp; Activity',
    'Strength &amp; Performance',
  ]) assert.match(source, new RegExp(label));
  assert.ok((source.match(/<details/g) || []).length >= 5, 'services should use at least five details elements');
  assert.match(source, /What service is right for me\?/i);
  assert.match(source, /One-on-one\. Evidence-based\. Built around you\./i);
});

test('About page carries Brandon’s supplied credentials, path, coaching background, and philosophy', () => {
  const source = read(page('about.astro'));
  assert.match(source, /Brandon Coveney, (?:PT, )?DPT, OCS/);
  assert.match(source, /Montclair State University/);
  assert.match(source, /Sacred Heart University/);
  assert.match(source, /assistant high school wrestling coach/i);
  assert.match(source, /Board-Certified Orthopedic Clinical Specialist/);
  assert.match(source, /Why I Created Forge/i);
  assert.match(source, /I Practice What I Preach/i);
  assert.match(source, /Beyond the Clinic/i);
  assert.match(source, /Recover[\s\S]*Build[\s\S]*Perform/i);
});

test('Pricing page includes supplied a-la-carte rates, packages, and calculated package savings', () => {
  const source = read(page('pricing.astro'));
  for (const text of ['$225', '$175', '$700', '$1,000', '$1,300', 'Recover', 'Build', 'Perform']) assert.match(source, new RegExp(text.replace('$', '\\$')));
  for (const saving of ['$50', '$100', '$150']) assert.match(source, new RegExp(saving.replace('$', '\\$')));
  assert.match(source, /Founding Forge 20/);
  assert.match(source, /completely optional/i);
});

test('FAQ page includes all supplied category groups and key questions in native accordions', () => {
  const source = read(page('faq.astro'));
  for (const category of ['About Forge Rehab & Performance', 'Physical Therapy & Treatment', 'Insurance & Payment', 'Pricing & Packages', 'The Forge Difference', 'Getting Started', 'Cancellation Policy']) assert.match(source, new RegExp(category));
  for (const question of ['What is Forge Rehab & Performance?', 'Do I need a referral from my doctor?', 'Do you accept insurance?', 'Can I use my HSA or FSA?', 'Why is Forge located inside a gym?', 'What is your cancellation policy?']) assert.match(source, new RegExp(question.replace(/[?]/g, '\\?')));
  assert.match(source, /<details class="faq-item"/);
  assert.match(source, /categories\.map/);
});

test('Contact page includes supplied inquiry fields, privacy warning, and explicit clinic placeholders', () => {
  const source = read(page('contact.astro'));
  for (const field of ['Name', 'Email', 'Phone', 'What can we help you with?', 'Message']) assert.match(source, new RegExp(field.replace(/[?]/g, '\\?')));
  assert.match(source, /Please do not include sensitive medical information in this form\./);
  assert.match(source, /Phone number coming soon/i);
  assert.match(source, /Email address coming soon/i);
  assert.match(source, /Gym name coming soon/i);
  assert.match(source, /Address coming soon/i);
  assert.match(source, /Hours coming soon/i);
  assert.match(source, /type="button"/);
});

test('Home links to live Services and About pages and no longer describes them as planned', () => {
  const source = read(page('index.astro'));
  assert.doesNotMatch(source, /Full Services page planned/i);
  assert.match(source, /href="\/concept-01\/services\//);
  assert.match(source, /href="\/concept-01\/about\//);
});

test('Precision footer exposes the complete Concept 01 site map and explicit placeholders', () => {
  const source = read('src/layouts/PrecisionLayout.astro');
  for (const route of ['approach', 'services', 'about', 'pricing', 'faq', 'contact']) assert.match(source, new RegExp(`/concept-01/${route}/`));
  assert.match(source, /Phone coming soon/);
  assert.match(source, /Email coming soon/);
  assert.match(source, /Location coming soon/);
});
