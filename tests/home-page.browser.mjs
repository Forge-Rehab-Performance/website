// Run after npm run build: node tests/home-page.browser.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4329';
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4329'], { stdio: 'ignore' });
let browser;
try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ headless: true });
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.home-hero').getByText('Brandon Coveney', { exact: false }).count(), 0);
    assert.equal(await page.locator('[aria-label="Practice highlights"]').count(), 0);
    const header = await page.locator('.site-header-wrapper').boundingBox();
    const scheduling = await page.locator('.home-scheduling').boundingBox();
    const hero = await page.locator('.home-hero').boundingBox();
    assert.ok(scheduling.y >= header.y + header.height - 1, JSON.stringify({ width, header, scheduling, hero }));
    assert.ok(hero.y >= scheduling.y + scheduling.height - 1);
    assert.equal(await page.locator('.home-scheduling').getByRole('link', { name: 'Schedule a Visit', exact: true }).getAttribute('href'), 'https://app.pteverywhere.com/s/6afe1c3816dc891738277f68/register');
    assert.match(await page.locator('.home-audiences').innerText(), /Whether you're walking the dog, chasing kids, or gardening, stay pain-free in your daily life\./);
    assert.match(await page.locator('.home-audiences').innerText(), /Keep training in the gym, lifting, or taking classes without working around pain\./);
    assert.equal(await page.locator('.home-why tbody tr').count(), 4);
    assert.equal(await page.locator('.home-why tbody th[scope="row"]').count(), 4);
    assert.equal(await page.locator('.home-why tbody tr:last-child td:last-child').innerText(), 'Faster, targeted recovery built around your active goals');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://rehabforge.com/');
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
    assert.equal(await page.locator('.footer-contact a[href="tel:9735543655"]').count(), 1);
    assert.equal(await page.locator('.footer-contact a[href="mailto:brandon@rehabforge.com"]').count(), 1);
    await page.locator('.home-why').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `page overflow at ${width}px`);
    const table = page.locator('.home-why__table');
    if (width < 672) {
      await table.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      assert.ok(await table.evaluate((element) => element.scrollLeft > 0), 'comparison supports keyboard scrolling');
    }
    await page.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
    const audit = await page.evaluate(async () => (await window.axe.run({ include: ['.home-audiences', '.home-why'] })).violations);
    assert.deepEqual(audit.map(({ id }) => id), [], `section accessibility at ${width}px: ${JSON.stringify(audit.map(({ nodes }) => nodes.map(({ target, failureSummary }) => ({ target, failureSummary }))))}`);
    await page.screenshot({ path: `/tmp/forge-home-${width}.png`, fullPage: true });
    assert.equal(await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length), 0);
    console.log(`Home page verified at ${width}px`);
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto(`${origin}/contact/`);
  assert.equal(await page.locator('.contact-cards a[href="tel:9735543655"]').count(), 1);
  assert.equal(await page.locator('.contact-cards a[href="mailto:brandon@rehabforge.com"]').count(), 1);
  assert.match(await page.locator('iframe').getAttribute('src'), /Redshed%20Crossfit%203%20Gold%20Mine%20Rd/);
  assert.equal(await page.locator('form[data-netlify="true"][method="POST"]').count(), 1);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `contact page overflow at ${width}px`);
    await page.screenshot({ path: `/tmp/forge-contact-${width}.png`, fullPage: true });
  }
  console.log('Contact links, location, form, and responsive layouts verified');
} finally {
  await browser?.close();
  server.kill();
}
