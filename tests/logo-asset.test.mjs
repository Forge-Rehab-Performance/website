import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');

test('configured logo and social image resolve to public assets', () => {
  const config = readFileSync(resolve(root, 'src/config/site.ts'), 'utf8');
  for (const field of ['logo', 'socialImage']) {
    const path = config.match(new RegExp(`${field}: '([^']+)'`))[1];
    const asset = readFileSync(resolve(root, `public${path}`));
    if (field === 'logo') {
      assert.match(asset.toString(), /<svg[^>]+viewBox="0 0 491\.11 430\.47"/);
      assert.doesNotMatch(asset.toString(), /<script\b|<foreignObject\b/);
    } else {
      assert.equal(asset.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    }
  }
});
