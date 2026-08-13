import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');

test('custom fonts use relative paths in CSS for Vite bundling', () => {
  const tokensCss = readFileSync(resolve(root, 'src/styles/tokens.css'), 'utf8');
  
  // Find all url() declarations in the file
  const urlMatches = tokensCss.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
  
  // Filter to just font files (.woff2, .woff, etc.)
  const fontUrls = urlMatches.filter(url => url.includes('.woff2') || url.includes('.woff'));
  
  assert.ok(fontUrls.length > 0, 'Should find at least one font url() in tokens.css');
  
  for (const urlMatch of fontUrls) {
    const pathMatch = urlMatch.match(/url\(['"]?([^'")]+)['"]?\)/);
    const fontPath = pathMatch[1];
    
    assert.ok(
      fontPath.startsWith('../') || fontPath.startsWith('./'), 
      `Font path "${fontPath}" must be relative (start with ../ or ./) so Vite can bundle it.`
    );
    
    assert.ok(
      !fontPath.startsWith('/'), 
      `Font path "${fontPath}" must not be absolute (start with /) because public assets were moved to src/assets.`
    );
  }
});
