import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');

test('site header uses a full-width border wrapper around constrained content', () => {
  const header = readFileSync(resolve(root, 'src/components/layout/Header.astro'), 'utf8');
  const styles = readFileSync(resolve(root, 'src/styles/precision.css'), 'utf8');

  assert.match(header, /<div class="site-header-wrapper">\s*<header class="site-header">/);
  assert.match(styles, /\.site-header-wrapper\s*\{[^}]*width: 100%;[^}]*border-bottom: 1px solid rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.09\s*\);/s);
  assert.match(styles, /\.site-header\s*\{[^}]*border-bottom: 0;/s);
});
