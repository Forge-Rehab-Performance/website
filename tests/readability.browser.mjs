// Run after npm run build: node tests/readability.browser.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4333';
const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4333'], { stdio: 'inherit' });
let browser;
try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch();
  const page = await browser.newPage();
  const bodyText = {
    '/': '.home-audience-feature__labels p',
    '/approach/': '.approach-progression__heading > p, .approach-card > p, .approach-one-on-one li',
    '/services/': '.services-page p:not(.eyebrow, .hero-lede), .services__feed li, .services__feed blockquote',
    '/about/': '.about-story .prose-column p:not(.editorial-quote), .journey-path__content p, .about-forge .prose-column p, .about-values p:not(.eyebrow), .about-philosophy p:not(.eyebrow), [aria-labelledby="about-close-title"] p:not(.eyebrow)',
    '/faq/': '.faq-item > div p, .faq-bullet-list li',
  };
  for (const width of [1440, 1050, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, selector] of Object.entries(bodyText)) {
      const label = `${route} at ${width}px`;
      await page.goto(origin + route);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const item of document.querySelectorAll('.faq-item')) item.open = true;
      });
      const sizes = await page.locator(selector).evaluateAll(elements => elements.map(el => getComputedStyle(el).fontSize));
      assert.deepEqual([...new Set(sizes)], ['16px'], `body text should be 16px on ${label}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no page overflow on ${label}`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://rehabforge.com${route}`);
      assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
      if (route === '/services/') {
        const columns = await page.locator('#service-ortho .services__list li').evaluateAll(items => new Set(items.map(item => item.getBoundingClientRect().x)).size);
        assert.equal(columns, width > 544 ? 2 : 1, `orthopedic treatment columns on ${label}`);
      }
    }
    console.log(`Readability verified across all five pages at ${width}px`);
  }
} finally {
  await browser?.close();
  server.kill();
}
