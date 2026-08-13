import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');

test('production build emits the Forge 404 document', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'ignore' });

  const html = readFileSync(resolve(root, 'dist/404.html'), 'utf8');

  assert.match(html, /<title>Page not found \| Forge Rehab &amp; Performance<\/title>/);
  assert.match(html, />Wrong turn<\/p>/);
  assert.match(html, />Page not found<\/h1>/);
  assert.match(html, /href="\/"[^>]*>Return home<\/a>/);
  assert.doesNotMatch(html, />Route \/ 404<\/span>/);
});

test('Cloudflare Workers Assets serves the generated 404 document', () => {
  const config = JSON.parse(readFileSync(resolve(root, 'wrangler.jsonc'), 'utf8'));

  assert.equal(config.assets?.not_found_handling, '404-page');
});
