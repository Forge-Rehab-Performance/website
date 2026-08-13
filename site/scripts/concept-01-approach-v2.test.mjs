import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const approach = await fs.readFile(new URL('../src/pages/concept-01/approach.astro', import.meta.url), 'utf8');
const css = await fs.readFile(new URL('../src/styles/precision.css', import.meta.url), 'utf8');

test('concept-01 approach v2 uses the editorial progression structure', () => {
  assert.match(approach, /approach-v2-process/, 'missing compact process strip');
  assert.equal((approach.match(/class="approach-v2-phase(?:\s|")/g) ?? []).length, 3, 'expected exactly three phase sections');
  assert.match(approach, /READY IS MORE THAN PAIN-FREE/i, 'missing stronger Perform headline');
  assert.match(approach, /approach-v2-activities/, 'missing real-world activity list');
  assert.match(approach, /approach-v2-individualized/, 'missing combined individualized-care section');
  assert.match(approach, /approach-v2-expectations/, 'missing compact expectations block');
});

test('concept-01 approach v2 stylesheet exposes the new layout primitives', () => {
  for (const selector of [
    '.approach-v2-hero',
    '.approach-v2-process',
    '.approach-v2-phase',
    '.approach-v2-individualized',
    '.approach-v2-performance',
    '.approach-v2-expectations'
  ]) {
    assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing selector: ${selector}`);
  }
});
