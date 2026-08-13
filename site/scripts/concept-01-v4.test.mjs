import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('concept 01 approach V4 removes the redundant banner and uses three compact stage cards', async () => {
  const approach = await read('src/pages/concept-01/approach.astro');

  assert.equal(approach.includes('approach-v3-index'), false, 'redundant Recover/Build/Perform banner should be removed');
  assert.ok(approach.includes('approach-v4-progression'), 'missing V4 progression section');
  assert.ok(approach.includes('approach-v4-cards'), 'missing V4 card grid');
  assert.equal((approach.match(/<article[^>]+class="approach-v4-card(?:\s|\")/g) ?? []).length, 3, 'expected exactly three V4 stage cards');
  assert.equal(approach.includes('approach-v3-stage__media'), false, 'stage-specific photos should be removed');

  for (const heading of ['Recover', 'Build', 'Perform']) {
    assert.ok(approach.includes(`<h3>${heading}</h3>`), `missing ${heading} stage heading`);
  }
});

test('concept 01 V4 retains the supporting Approach sections and V3 homepage', async () => {
  const approach = await read('src/pages/concept-01/approach.astro');
  const home = await read('src/pages/concept-01/index.astro');

  for (const required of ['approach-v3-life', 'approach-v3-one-on-one', 'approach-v3-close']) {
    assert.ok(approach.includes(required), `missing retained section ${required}`);
  }
  assert.ok(home.includes('home-v3-hero'), 'homepage should remain the V3 design');
  assert.ok(home.includes('home-v3-approach'), 'homepage V3 approach section should remain intact');
});
