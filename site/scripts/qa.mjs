import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import process from 'node:process';
import { chromium } from 'playwright';
import axe from 'axe-core';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import Ajv2020 from 'ajv/dist/2020.js';
import { lighthouseScores, terminateChild } from './qa-helpers.mjs';

const port = 4328;
const baseUrl = `http://127.0.0.1:${port}`;
const qaDir = new URL('../../qa/', import.meta.url);
const screenshotsDir = new URL('screenshots/', qaDir);
const reviewSourceUrl = new URL('web-design-guidelines-review.json', qaDir);
const routes = ['/', '/concept-01/', '/concept-01/approach/', '/concept-02/', '/concept-02/approach/', '/concept-03/', '/concept-03/approach/'];
const conceptIds = ['concept-01', 'concept-02', 'concept-03'];
const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 }
};

const reviewSource = await fs.readFile(reviewSourceUrl, 'utf8').then(JSON.parse);
assert.equal(reviewSource.schemaVersion, '1.0.0');
assert.equal(reviewSource.guidelines.sourceUrl, 'https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md');
assert.ok(Date.now() - Date.parse(reviewSource.guidelines.fetchedAt) < 7 * 24 * 60 * 60 * 1000, 'Web guidelines review is older than 7 days');
assert.ok(reviewSource.review.method && reviewSource.review.reviewer);
assert.equal(reviewSource.files.length, 17, 'Independent review must cover all 17 page/style/component/layout files');
for (const file of reviewSource.files) {
  const source = await fs.readFile(new URL(`../${file.path}`, import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), file.sha256, `Stale independent review: ${file.path}`);
}
assert.equal(reviewSource.concepts.length, 3);
assert.ok(reviewSource.concepts.every(({ categories, findings, blockingFindings }) => Object.keys(categories).length === 8 && Array.isArray(findings) && Array.isArray(blockingFindings)));
assert.equal(reviewSource.creativePairs.length, 3);
assert.ok(reviewSource.creativePairs.every(({ categories }) => Object.keys(categories).length === 12 && Object.values(categories).every(({ score, evidence }) => [0, 1, 2].includes(score) && evidence)));

const run = (command, args) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd: new URL('..', import.meta.url), stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  child.once('error', reject);
  child.once('exit', (code) => code === 0 ? resolve({ status: 'passed', output }) : reject(new Error(`${command} ${args.join(' ')} failed (${code})\n${output}`)));
});

let preview;
let browser;
let previewError = '';
const stopPreview = () => new Promise((resolve) => {
  const stop = spawn('./node_modules/.bin/astro', ['preview', 'stop', '--port', String(port)], {
    cwd: new URL('..', import.meta.url),
    stdio: 'ignore'
  });
  const timeout = setTimeout(() => terminateChild(stop).finally(resolve), 2_000);
  stop.once('exit', () => { clearTimeout(timeout); resolve(); });
  stop.once('error', () => { clearTimeout(timeout); resolve(); });
});
const cleanup = async () => {
  if (browser) await Promise.race([
    browser.close().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 2000))
  ]);
  await Promise.all([terminateChild(preview), stopPreview()]);
};
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => cleanup().finally(() => process.exit(128 + (signal === 'SIGINT' ? 2 : 15))));
}

const waitForPreview = async () => {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (preview.exitCode && preview.exitCode !== 0) throw new Error(`Astro preview exited with code ${preview.exitCode}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error('Astro preview did not become ready within 20 seconds');
};

try {
  const astroCheck = await run('./node_modules/.bin/astro', ['check']);
  const astroBuild = await run('./node_modules/.bin/astro', ['build']);
  await fs.mkdir(screenshotsDir, { recursive: true });
  await stopPreview();
  preview = spawn('./node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: new URL('..', import.meta.url),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  preview.stderr.on('data', (chunk) => { previewError += chunk; });
  await waitForPreview();
  browser = await chromium.launch({ headless: true });
  const axeByConcept = Object.fromEntries(conceptIds.map((id) => [id, { critical: 0, serious: 0, violations: [] }]));
  const pageDetails = [];

  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      const failedImages = [];
      const posts = [];
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (request.method() === 'POST' && /form|book|schedul/i.test(request.url())) posts.push(request.url());
      });
      page.on('response', (response) => {
        if (response.request().resourceType() === 'image' && new URL(response.url()).origin === baseUrl && response.status() >= 400) failedImages.push(`${response.status()} ${response.url()}`);
      });
      page.on('requestfailed', (request) => {
        if (request.resourceType() === 'image' && new URL(request.url()).origin === baseUrl) failedImages.push(`${request.failure()?.errorText ?? 'request failed'} ${request.url()}`);
      });

      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
          scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        scrollTo(0, 0);
      });
      await page.waitForFunction(() => document.fonts.status === 'loaded' && [...document.images].every((image) => image.complete && image.naturalWidth > 0));
      await page.evaluate(async () => {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      assert.equal(response?.status(), 200, `${viewportName} ${route}: HTTP ${response?.status()}`);
      assert.equal(await page.locator('main').count(), 1, `${viewportName} ${route}: expected one main landmark`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${viewportName} ${route}: ${overflow}px horizontal overflow`);
      assert.deepEqual(errors, [], `${viewportName} ${route}: browser errors: ${errors.join('; ')}`);
      assert.deepEqual(failedImages, [], `${viewportName} ${route}: failed local images: ${failedImages.join('; ')}`);
      assert.deepEqual(posts, [], `${viewportName} ${route}: unexpected POST: ${posts.join('; ')}`);

      if (route !== '/') {
        const expectedPage = route.includes('/approach/') ? 'Forge Approach' : 'Home';
        const plannedItems = page.locator('.planned-item');
        const plannedEvidence = await plannedItems.evaluateAll((items) => items.map((item) => ({ tag: item.tagName, href: item.getAttribute('href'), ariaDisabled: item.getAttribute('aria-disabled'), text: item.textContent.trim() })));
        assert.ok(plannedEvidence.length, `${route}: missing planned items`);
        assert.ok(plannedEvidence.every(({ tag, href, ariaDisabled }) => tag !== 'A' && href === null && ariaDisabled === 'true'), `${route}: every planned item must be a non-anchor with aria-disabled=true`);
        const bookingButtons = page.locator('.booking-status button');
        assert.ok(await bookingButtons.count(), `${route}: missing booking control`);
        assert.equal(await bookingButtons.evaluateAll((buttons) => buttons.every((button) => button.disabled)), true, `${route}: booking must remain disabled`);
        assert.equal(await page.locator('.concept-nav a[aria-current="page"]').textContent(), expectedPage);

        if (viewportName === 'desktop') {
          const captureStyle = await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
          try {
            await page.screenshot({ path: new URL(`${route.slice(1).replaceAll('/', '-') || 'selector'}desktop.png`, screenshotsDir).pathname, fullPage: true, animations: 'disabled' });
          } finally {
            await captureStyle.evaluate((style) => style.remove());
          }
        }
        if (viewportName === 'mobile') {
          const details = page.locator('.concept-nav__mobile');
          assert.equal(await details.isVisible(), true, `${route}: mobile details navigation hidden`);
          await details.locator('summary').click();
          assert.equal(await details.getAttribute('open'), '', `${route}: mobile details did not open`);
          const captureStyle = await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
          try {
            await page.screenshot({ path: new URL(`${route.slice(1).replaceAll('/', '-') || 'selector'}mobile.png`, screenshotsDir).pathname, fullPage: true, animations: 'disabled' });
          } finally {
            await captureStyle.evaluate((style) => style.remove());
          }
        }

        await page.addScriptTag({ content: axe.source });
        const axeResults = await page.evaluate(() => axe.run(document, { resultTypes: ['violations'] }));
        const blocking = axeResults.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
        const concept = route.split('/')[1];
        for (const violation of axeResults.violations) {
          if (violation.impact === 'critical' || violation.impact === 'serious') axeByConcept[concept][violation.impact] += 1;
          axeByConcept[concept].violations.push({ route, viewport: viewportName, id: violation.id, impact: violation.impact, nodes: violation.nodes.length });
        }
        assert.deepEqual(blocking.map(({ id, impact }) => `${impact}:${id}`), [], `${viewportName} ${route}: axe blocking violations`);

        let focus;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          await page.keyboard.press('Tab');
          focus = await page.evaluate(() => {
            const element = document.activeElement;
            const style = getComputedStyle(element);
            return { tag: element?.tagName, outline: style.outlineStyle, width: Number.parseFloat(style.outlineWidth), shadow: style.boxShadow };
          });
          if (focus.tag !== 'BODY') break;
        }
        assert.notEqual(focus.tag, 'BODY', `${route}: keyboard focus did not move`);
        assert.ok((focus.outline !== 'none' && focus.width > 0) || focus.shadow !== 'none', `${route}: keyboard focus is not visibly styled`);

        const target = route.includes('/approach/') ? route.replace('/approach/', '/') : `${route}approach/`;
        const label = route.includes('/approach/') ? 'Home' : 'Forge Approach';
        await Promise.all([
          page.waitForURL((url) => url.pathname.replace(/\/$/, '') === target.replace(/\/$/, '')),
          page.getByRole('link', { name: label, exact: true }).click()
        ]);
        await page.waitForLoadState('networkidle');
        assert.equal(new URL(page.url()).pathname.replace(/\/$/, ''), target.replace(/\/$/, ''), `${route}: navigation failed`);
        assert.deepEqual(failedImages, [], `${route} navigation: failed local images: ${failedImages.join('; ')}`);
        assert.deepEqual(errors, [], `${viewportName} ${route} after interactions: browser errors: ${errors.join('; ')}`);
        assert.deepEqual(posts, [], `${viewportName} ${route} after interactions: unexpected POST: ${posts.join('; ')}`);
        pageDetails.push({ route, viewport: viewportName, httpStatus: response.status(), horizontalOverflowPixels: overflow, consoleErrors: errors.length, failedLocalImages: failedImages.length, unexpectedPosts: posts.length, plannedItems: { count: plannedEvidence.length, allNonAnchors: true, allAriaDisabled: true, labels: plannedEvidence.map(({ text }) => text) } });
      } else {
        assert.deepEqual(errors, [], `${viewportName} selector after checks: browser errors: ${errors.join('; ')}`);
        assert.deepEqual(posts, [], `${viewportName} selector after checks: unexpected POST: ${posts.join('; ')}`);
        pageDetails.push({ route, viewport: viewportName, httpStatus: response.status(), horizontalOverflowPixels: overflow, consoleErrors: errors.length, failedLocalImages: failedImages.length, unexpectedPosts: posts.length });
      }
      await page.close();
    }
    await context.close();
  }

  await browser.close();
  browser = undefined;

  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
  const lighthouseByConcept = {};
  try {
    for (const id of conceptIds) {
      const result = await lighthouse(`${baseUrl}/${id}/`, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        formFactor: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }
      });
      const categories = result.lhr.categories;
      lighthouseByConcept[id] = lighthouseScores(categories);
      assert.ok(lighthouseByConcept[id].accessibility >= 90, `${id}: Lighthouse accessibility below 90`);
      assert.ok(lighthouseByConcept[id].bestPractices >= 90, `${id}: Lighthouse best practices below 90`);
      assert.ok(lighthouseByConcept[id].seo >= 90, `${id}: Lighthouse SEO below 90`);
    }
  } finally {
    chrome.kill();
  }

  const reviews = reviewSource.concepts.map(({ id, score, categories, blockingFindings, findings }) => ({
    id,
    score,
    categories: Object.fromEntries(Object.entries(categories).map(([name, value]) => [name, value.score])),
    categoryEvidence: Object.fromEntries(Object.entries(categories).map(([name, value]) => [name, value.evidence])),
    blockingFindings,
    guidelineFindings: findings
  }));
  for (const review of reviews) assert.equal(Object.values(review.categories).reduce((sum, score) => sum + score, 0), review.score);
  const uiUxReview = {
    schemaVersion: '1.0.0',
    status: reviews.every(({ score, blockingFindings }) => score >= 80 && blockingFindings.length === 0) ? 'passed' : 'needs_repair',
    minimumScore: 80,
    reviewSource: 'web-design-guidelines-review.json',
    reviewMethod: { ...reviewSource.review, guidelines: reviewSource.guidelines, exactFilesReviewed: reviewSource.files.map(({ path }) => path), sharedFindings: reviewSource.sharedFindings },
    concepts: reviews
  };

  const creativePairs = reviewSource.creativePairs.map(({ pair, categories }) => {
    const values = Object.values(categories);
    return { pair, score: values.reduce((sum, { score }) => sum + score, 0), materialDifferences: values.filter(({ score }) => score === 2).length, categories };
  });
  for (const pair of creativePairs) {
    assert.ok(pair.score >= 17, `${pair.pair}: creative score below 17/24`);
    assert.ok(pair.materialDifferences >= 7, `${pair.pair}: fewer than 7 material differences`);
  }

  const concepts = conceptIds.map((id) => ({
    id,
    rendering: 'passed',
    accessibility: axeByConcept[id],
    lighthouse: lighthouseByConcept[id],
    performanceAdvisory: lighthouseByConcept[id].performance < 85 ? `Performance ${lighthouseByConcept[id].performance} is below advisory threshold 85.` : null,
    pages: pageDetails.filter(({ route }) => route.startsWith(`/${id}/`)),
    screenshots: [`screenshots/${id}-desktop.png`, `screenshots/${id}-mobile.png`, `screenshots/${id}-approach-desktop.png`, `screenshots/${id}-approach-mobile.png`]
  }));
  const gateResults = {
    build: astroCheck.status === 'passed' && astroBuild.status === 'passed',
    routeRendering: concepts.every(({ rendering }) => rendering === 'passed'),
    axe: concepts.every(({ accessibility }) => accessibility.critical === 0 && accessibility.serious === 0),
    blockingLighthouse: concepts.every(({ lighthouse: scores }) => scores.accessibility >= 90 && scores.bestPractices >= 90 && scores.seo >= 90),
    creativeDifferentiation: creativePairs.every(({ score, materialDifferences }) => score >= 17 && materialDifferences >= 7),
    uiUx: uiUxReview.status === 'passed'
  };
  assert.deepEqual(Object.keys(gateResults), ['build', 'routeRendering', 'axe', 'blockingLighthouse', 'creativeDifferentiation', 'uiUx']);
  const qa = {
    schemaVersion: '3.0.0',
    status: Object.values(gateResults).every(Boolean) ? 'passed' : 'failed',
    gateResults: Object.fromEntries(Object.entries(gateResults).map(([gate, passed]) => [gate, passed ? 'passed' : 'failed'])),
    build: { astroCheck: astroCheck.status, astroBuild: astroBuild.status, commands: ['./node_modules/.bin/astro check', './node_modules/.bin/astro build'] },
    rendering: { routes, viewports, checks: ['HTTP 200', 'no horizontal overflow', 'no console/page errors', 'no failed local images', 'one main landmark', 'functional navigation', 'aria-current', 'planned non-anchors', 'disabled booking', 'no form/booking POST', 'mobile details', 'keyboard-visible focus'] },
    accessibility: { engine: `axe-core ${axe.version}`, blockingImpacts: ['critical', 'serious'], totalCritical: concepts.reduce((sum, concept) => sum + concept.accessibility.critical, 0), totalSerious: concepts.reduce((sum, concept) => sum + concept.accessibility.serious, 0) },
    lighthouse: { routes: conceptIds.map((id) => `/${id}/`), blockingThresholds: { accessibility: 90, bestPractices: 90, seo: 90 }, performanceAdvisoryThreshold: 85 },
    creativeDifferentiation: { minimumScore: 17, minimumMaterialDifferences: 7, pairs: creativePairs },
    pageResults: pageDetails,
    selectorResults: pageDetails.filter(({ route }) => route === '/'),
    concepts,
    uiUxReview: { status: uiUxReview.status, minimumScore: 80, scores: Object.fromEntries(reviews.map(({ id, score }) => [id, score])) }
  };
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const [qaSchema, reviewSchema] = await Promise.all([
    fs.readFile(new URL('../../../../factory/schemas/qa.schema.json', import.meta.url), 'utf8').then(JSON.parse),
    fs.readFile(new URL('../../../../factory/schemas/ui-ux-review.schema.json', import.meta.url), 'utf8').then(JSON.parse)
  ]);
  assert.ok(ajv.compile(reviewSchema)(uiUxReview), 'UI/UX review failed schema validation');
  assert.ok(ajv.compile(qaSchema)(qa), 'QA failed schema validation');
  await Promise.all([
    fs.writeFile(new URL('ui-ux-review.json', qaDir), `${JSON.stringify(uiUxReview, null, 2)}\n`),
    fs.writeFile(new URL('qa.json', qaDir), `${JSON.stringify(qa, null, 2)}\n`)
  ]);
  console.log(`PASS deterministic QA: ${routes.length * Object.keys(viewports).length} route/viewports, axe critical 0 serious 0, Lighthouse ${conceptIds.map((id) => `${id} P${lighthouseByConcept[id].performance.toFixed(2)}/A${lighthouseByConcept[id].accessibility.toFixed(2)}/BP${lighthouseByConcept[id].bestPractices.toFixed(2)}/SEO${lighthouseByConcept[id].seo.toFixed(2)}`).join(', ')}`);
} catch (error) {
  if (preview?.exitCode !== null) error.message += `\n${previewError}`;
  throw error;
} finally {
  await cleanup();
}
