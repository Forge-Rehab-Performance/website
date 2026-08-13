import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 4339;
const base = `http://127.0.0.1:${port}`;
const preview = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: new URL('..', import.meta.url),
  stdio: ['ignore', 'pipe', 'pipe']
});
let previewOutput = '';
preview.stdout.on('data', (chunk) => { previewOutput += chunk; });
preview.stderr.on('data', (chunk) => { previewOutput += chunk; });

const waitForServer = async () => {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(`${base}/concept-01/`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Astro preview did not start:\n${previewOutput}`);
};

const count = (source, pattern) => [...source.matchAll(pattern)].length;

try {
  await waitForServer();
  const routes = ['/concept-01/', '/concept-01/approach/'];
  for (const route of routes) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, `${route}: expected HTTP 200`);
    const html = await response.text();
    assert.equal(count(html, /<main\b/gi), 1, `${route}: expected one main landmark`);
    assert.equal(count(html, /<h1\b/gi), 1, `${route}: expected one h1`);
    assert.ok(count(html, /<button[^>]*disabled/gi) >= 1, `${route}: expected disabled booking control`);
    assert.ok(!/<form\b/i.test(html), `${route}: demo should not submit medical/contact data`);
    assert.match(html, /href="\/concept-01\/approach\/"/, `${route}: missing Approach navigation`);
    assert.match(html, /href="\/concept-01"/, `${route}: missing Home navigation`);
    for (const asset of ['/assets/forge-logo.png', '/assets/forward-strength.webp']) {
      if (html.includes(asset)) {
        const assetResponse = await fetch(`${base}${asset}`);
        assert.equal(assetResponse.status, 200, `${route}: missing local asset ${asset}`);
      }
    }
  }
  console.log('PASS concept-01 smoke: routes, landmarks, disabled booking, navigation, and core assets');
} finally {
  preview.kill('SIGTERM');
}
