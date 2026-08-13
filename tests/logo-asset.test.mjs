import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';

const root = resolve(import.meta.dirname, '..');

const paeth = (a, b, c) => {
  const estimate = a + b - c;
  const distanceA = Math.abs(estimate - a);
  const distanceB = Math.abs(estimate - b);
  const distanceC = Math.abs(estimate - c);
  return distanceA <= distanceB && distanceA <= distanceC ? a : distanceB <= distanceC ? b : c;
};

test('site logo uses a PNG with an alpha channel', () => {
  const logo = readFileSync(resolve(root, 'src/assets/forge-logo-transparent.png'));
  const siteConfig = readFileSync(resolve(root, 'src/config/site.ts'), 'utf8');

  assert.equal(logo.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const imageData = [];
  for (let offset = 8; offset < logo.length;) {
    const length = logo.readUInt32BE(offset);
    const type = logo.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const data = logo.subarray(dataStart, dataEnd);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === 'IDAT') imageData.push(data);
    offset = dataEnd + 4;
  }

  assert.equal(bitDepth, 8);
  assert.equal(colorType, 6);

  const scanlines = inflateSync(Buffer.concat(imageData));
  const stride = width * 4;
  let cursor = 0;
  let previous = Buffer.alloc(stride);
  let minimumAlpha = 255;
  let maximumAlpha = 0;

  for (let row = 0; row < height; row += 1) {
    const filter = scanlines[cursor++];
    const current = Buffer.alloc(stride);
    for (let index = 0; index < stride; index += 1) {
      const raw = scanlines[cursor++];
      const left = index >= 4 ? current[index - 4] : 0;
      const above = previous[index];
      const upperLeft = index >= 4 ? previous[index - 4] : 0;
      const prediction = filter === 0
        ? 0
        : filter === 1
          ? left
          : filter === 2
            ? above
            : filter === 3
              ? Math.floor((left + above) / 2)
              : paeth(left, above, upperLeft);
      current[index] = (raw + prediction) & 0xff;
    }
    for (let index = 3; index < stride; index += 4) {
      minimumAlpha = Math.min(minimumAlpha, current[index]);
      maximumAlpha = Math.max(maximumAlpha, current[index]);
    }
    previous = current;
  }

  assert.ok(minimumAlpha < 255, 'logo should contain transparent pixels');
  assert.equal(maximumAlpha, 255);
  assert.match(siteConfig, /logo: '\/assets\/forge-logo-transparent\.png'/);
  assert.match(siteConfig, /socialImage: '\/assets\/forge-logo\.png'/);
});
