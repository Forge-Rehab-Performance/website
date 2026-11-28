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
    const topBooking = page.locator('.home-scheduling');
    const bottomBooking = page.locator('.home-close .booking-status');
    const scheduleLink = { name: 'Schedule a Visit', exact: true };
    const bookingUrl = await topBooking.getByRole('link', scheduleLink).getAttribute('href');
    assert.equal(bookingUrl, 'https://app.pteverywhere.com/s/6afe1c3816dc891738277f68/register');
    const bottomLink = bottomBooking.getByRole('link', scheduleLink);
    assert.equal(await bottomLink.getAttribute('href'), bookingUrl);
    const cta = await bottomLink.boundingBox();
    const copy = await page.locator('.home-close p').last().boundingBox();
    assert.ok(Math.abs(cta.x - copy.x) <= 1 && cta.y >= copy.y + copy.height, `closing button sits below and aligns with the copy at ${width}px`);
    assert.equal(await page.getByText('Online scheduling available', { exact: true }).count(), 0);
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
    for (const image of await page.locator('img[loading="lazy"]').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
    }
    await page.screenshot({ path: `/tmp/forge-home-${width}.png`, fullPage: true });
    assert.equal(await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length), 0);
    console.log(`Home page verified at ${width}px`);
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto(`${origin}/contact/`);
  assert.equal(await page.locator('.footer-booking-note').innerText(), 'Online scheduling available');
  assert.equal(await page.locator('.contact-cards a[href="tel:9735543655"]').count(), 1);
  assert.equal(await page.locator('.contact-cards a[href="mailto:brandon@rehabforge.com"]').count(), 1);
  assert.match(await page.locator('iframe').getAttribute('src'), /Redshed%20Crossfit%203%20Gold%20Mine%20Rd/);
  const form = page.locator('form[data-netlify="true"][method="POST"]');
  assert.equal(await form.count(), 1);
  assert.equal(await form.getAttribute('action'), '/contact/thanks/');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `contact page overflow at ${width}px`);
    await page.screenshot({ path: `/tmp/forge-contact-${width}.png`, fullPage: true });
  }
  const thanks = `${origin}/contact/thanks/`;
  // Astro preview doesn't handle Netlify POSTs; simulate only the server response.
  await page.route(thanks, route => route.request().method() === 'POST'
    ? route.fulfill({ status: 303, headers: { location: thanks } })
    : route.continue());
  await form.getByLabel('Name', { exact: true }).fill('Test Visitor');
  await form.getByLabel('Email', { exact: true }).fill('visitor@example.com');
  await form.getByLabel('Message', { exact: true }).fill('Local confirmation test.');
  const [submission] = await Promise.all([
    page.waitForRequest(request => request.url() === thanks && request.method() === 'POST'),
    form.getByRole('button', { name: 'Send Message' }).click(),
  ]);
  assert.equal(submission.isNavigationRequest(), true, 'the browser submits directly, without the Astro router');
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForURL(thanks);
    const heading = page.getByRole('heading', { name: 'Thanks for reaching out.', exact: true });
    await heading.waitFor();
    assert.equal(await page.getByRole('link', { name: 'Back to Home', exact: true }).getAttribute('href'), '/');
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://rehabforge.com/contact/thanks/');
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `thank-you page overflow at ${width}px`);
    await page.screenshot({ path: `/tmp/forge-contact-thanks-${width}.png`, fullPage: true });
  }
  const sitemap = await (await page.request.get(`${origin}/sitemap-0.xml`)).text();
  assert.match(sitemap, /https:\/\/rehabforge\.com\/contact\//);
  assert.doesNotMatch(sitemap, /\/contact\/thanks\//);
  console.log('Contact details, native form navigation, and thank-you page verified');
} finally {
  await browser?.close();
  server.kill();
}
