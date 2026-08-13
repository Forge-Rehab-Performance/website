import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('concept 01 home uses the V3 dense editorial composition', async () => {
  const home = await read('src/pages/concept-01/index.astro');
  for (const required of [
    'home-v3-problem',
    'home-v3-approach',
    'home-v3-audiences',
    'home-v3-services',
    'home-v3-brandon',
    'home-v3-close',
    'You don\'t just want to feel better.',
    'THE FORGE APPROACH',
    'WHO IT\'S FOR',
    'SERVICES',
    'MEET BRANDON'
  ]) assert.ok(home.includes(required), `missing ${required}`);
});

test('concept 01 approach is rebuilt as a continuous V3 story', async () => {
  const approach = await read('src/pages/concept-01/approach.astro');
  for (const required of [
    'approach-v3-hero',
    'approach-v3-stage--recover',
    'approach-v3-stage--build',
    'approach-v3-stage--perform',
    'approach-v3-life',
    'approach-v3-one-on-one',
    'approach-v3-close',
    'Your rehabilitation should look like your life.',
    'Your session. Your goals. Your time.',
    'Don\'t just return. Build forward.'
  ]) assert.ok(approach.includes(required), `missing ${required}`);
  assert.equal(approach.includes('approach-v2-'), false, 'V2 approach classes should be removed from page markup');
});

test('precision stylesheet contains V3 responsive composition rules', async () => {
  const css = await read('src/styles/precision.css');
  for (const required of ['.home-v3-problem', '.home-v3-approach', '.approach-v3-stage', '.approach-v3-life', '@media (max-width: 52rem)']) {
    assert.ok(css.includes(required), `missing CSS rule ${required}`);
  }
});
