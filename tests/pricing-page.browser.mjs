// Run after npm run build: node tests/pricing-page.browser.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4331';
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4331'], { stdio: 'ignore' });
let browser;
try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ headless: true });
  for (const width of [1440, 900, 834, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`${origin}/pricing/`);
    await page.evaluate(() => document.fonts.ready);
    const bodySizes = await page.locator('.pricing__heading > p, .pricing__package-heading > p, .pricing__visit-card > p, .pricing__visit-card li, .pricing__package-card > p:not(.pricing__visits):not(.pricing__saving), .pricing__support article > p:not(.eyebrow), .founding-banner__content > p:not(.eyebrow), .pricing__note').evaluateAll((elements) => elements.map((element) => parseFloat(getComputedStyle(element).fontSize)));
    assert.ok(bodySizes.length > 10);
    assert.ok(bodySizes.every((size) => size >= 16), `body text must be at least 16px at ${width}px: ${bodySizes}`);
    const labelSizes = await page.locator('.pricing__label, .pricing__visits, .pricing__best span, .pricing__best strong, .pricing__saving, .recommended-badge, .founding-banner__status span').evaluateAll((elements) => elements.map((element) => parseFloat(getComputedStyle(element).fontSize)));
    assert.ok(labelSizes.every((size) => size >= 14), `secondary text must be at least 14px: ${labelSizes}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `page overflow at ${width}px`);
    await page.screenshot({ path: `/tmp/forge-pricing-${width}.png`, fullPage: true });
    console.log(`Pricing page verified at ${width}px`);
    await page.close();
  }
} finally {
  await browser?.close();
  server.kill();
}
