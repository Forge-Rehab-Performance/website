import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('footer and contact page expose configured telephone and email links', () => {
  for (const path of ['src/components/layout/Footer.astro', 'src/components/sections/contact/ContactPage.astro']) {
    const markup = read(path);
    assert.match(markup, /href=\{`tel:\$\{contact\.phone/);
    assert.match(markup, /href=\{`mailto:\$\{contact\.email/);
    assert.match(markup, /contact\.address/);
    assert.match(markup, /contact\.gymName/);
  }
});
