import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const about = readFileSync(resolve(root, 'src/components/sections/about/AboutPage.astro'), 'utf8');
const styles = readFileSync(resolve(root, 'src/styles/global.css'), 'utf8');

test('about path uses a two-column layout with heading left and journey right', () => {
  assert.match(about, /class="section-shell about-path__layout"/);
  assert.match(styles, /\.about-path__layout\s*\{[^}]*grid-template-columns:/s);
});

test('about path heading contains eyebrow and h2 without sticky positioning', () => {
  assert.match(
    about,
    /<header class="about-path__heading"><p class="eyebrow">MY PATH TO PHYSICAL THERAPY<\/p><h2 id="path-title">Built through education, experience, and continued development\.<\/h2><\/header>/
  );
  // Heading should NOT be sticky
  const headingBlock = styles.match(/\.about-path__heading\s*\{([^}]*)\}/s);
  assert.ok(headingBlock, '.about-path__heading rule exists');
  assert.doesNotMatch(headingBlock[1], /position:\s*sticky/);
});

test('about path stacks to single column on mobile', () => {
  assert.match(styles, /\.about-path__layout\s*\{[^}]*grid-template-columns:\s*1fr;/s);
});

test('journey path has five steps with rail nodes and content', () => {
  const steps = about.match(/journey-path__step/g);
  assert.equal(steps.length, 5, 'should have exactly 5 steps');

  const rails = about.match(/journey-path__rail/g);
  assert.equal(rails.length, 5, 'each step should have a rail');

  const nodes = about.match(/journey-path__node/g);
  assert.equal(nodes.length, 5, 'each step should have a node');
});

test('journey path contains the correct milestones in order', () => {
  const years = [...about.matchAll(/journey-path__year">([^<]+)/g)].map(m => m[1].trim());
  assert.deepEqual(years, ['2015', '2018', '8', '2024', '2024']);

  assert.match(about, /Montclair State University/);
  assert.match(about, /Sacred Heart University/);
  assert.match(about, /Outpatient Orthopedic Experience/);
  assert.match(about, /Orthopedic Physical Therapy Residency/);
  assert.match(about, /Hospital for Special Surgery/);
  assert.match(about, /Board Certified Orthopedic Clinical Specialist/);
  assert.match(about, /American Board of Physical Therapy Specialties/);
});

test('journey path has a continuous vertical line via ::before pseudo-element', () => {
  assert.match(styles, /\.journey-path::before\s*\{[^}]*position:\s*absolute;/s);
  assert.match(styles, /\.journey-path::before\s*\{[^}]*width:\s*1px;/s);
});

test('journey path nodes are styled as gold-bordered circles', () => {
  assert.match(styles, /\.journey-path__node\s*\{[^}]*border-radius:\s*50%;/s);
  assert.match(styles, /\.journey-path__node\s*\{[^}]*border:\s*2px solid var\(--gold\);/s);
});

test('journey path rail nodes use aria-hidden', () => {
  const railMatches = [...about.matchAll(/<div class="journey-path__rail"[^>]*>/g)];
  assert.equal(railMatches.length, 5);
  for (const match of railMatches) {
    assert.match(match[0], /aria-hidden="true"/, 'rail should be aria-hidden');
  }
});