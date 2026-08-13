import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const home = await fs.readFile(new URL('../src/pages/concept-01/index.astro', import.meta.url), 'utf8');
const approach = await fs.readFile(new URL('../src/pages/concept-01/approach.astro', import.meta.url), 'utf8');
const css = await fs.readFile(new URL('../src/styles/precision.css', import.meta.url), 'utf8');

test('concept-01 homepage exposes the refreshed section contract', () => {
  for (const text of [
    'THE PROBLEM',
    'THE FORGE APPROACH',
    "WHO IT'S FOR",
    'SERVICES',
    'MEET BRANDON',
    'Ready to get back to what you love?'
  ]) {
    assert.match(home, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `missing homepage text: ${text}`);
  }
});

test('concept-01 approach page exposes the refreshed page hierarchy', () => {
  for (const text of [
    'THE FORGE APPROACH',
    'Not a cookie-cutter protocol',
    'What we build toward'
  ]) {
    assert.match(approach, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `missing approach text: ${text}`);
  }
});

test('concept-01 stylesheet includes the refreshed layout primitives', () => {
  for (const selector of [
    '.problem-band',
    '.home-approach',
    '.audience-grid',
    '.services-grid',
    '.approach-page-hero'
  ]) {
    assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing selector: ${selector}`);
  }
  assert.match(css, /--paper:\s*#[0-9a-f]{6}/i, 'missing warm-light surface token');
});
