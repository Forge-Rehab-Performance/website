import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import test from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';

import { canonicalQaForReproducibility, lighthouseScores, terminateChild } from './qa-helpers.mjs';

test('QA reproducibility ignores only advisory performance evidence', () => {
  const qa = {
    status: 'passed',
    concepts: [{
      id: 'concept-03',
      lighthouse: { performance: 93, accessibility: 100, bestPractices: 100, seo: 100 },
      performanceAdvisory: 'Performance 93 is advisory.'
    }]
  };
  const original = structuredClone(qa);
  const faster = structuredClone(qa);
  faster.concepts[0].lighthouse.performance = 94;
  faster.concepts[0].performanceAdvisory = 'Performance 94 is advisory.';
  const inaccessible = structuredClone(qa);
  inaccessible.concepts[0].lighthouse.accessibility = 99;
  const weakerPractices = structuredClone(qa);
  weakerPractices.concepts[0].lighthouse.bestPractices = 99;
  const weakerSeo = structuredClone(qa);
  weakerSeo.concepts[0].lighthouse.seo = 99;
  const changedStatus = structuredClone(qa);
  changedStatus.status = 'failed';

  assert.equal(canonicalQaForReproducibility(qa), canonicalQaForReproducibility(faster));
  assert.notEqual(canonicalQaForReproducibility(qa), canonicalQaForReproducibility(inaccessible));
  assert.notEqual(canonicalQaForReproducibility(qa), canonicalQaForReproducibility(weakerPractices));
  assert.notEqual(canonicalQaForReproducibility(qa), canonicalQaForReproducibility(weakerSeo));
  assert.notEqual(canonicalQaForReproducibility(qa), canonicalQaForReproducibility(changedStatus));
  assert.deepEqual(qa, original);
});

test('lighthouseScores preserves sub-point precision', () => {
  const scores = lighthouseScores({
    performance: { score: 0.9999 },
    accessibility: { score: 0.8999 },
    'best-practices': { score: 0.9555 },
    seo: { score: 1 }
  });
  assert.equal(scores.performance, 0.9999 * 100);
  assert.equal(scores.accessibility, 0.8999 * 100);
  assert.ok(scores.accessibility < 90);
  assert.equal(scores.bestPractices, 0.9555 * 100);
  assert.equal(scores.seo, 100);
});

test('QA schema accepts decimal Lighthouse scores', async () => {
  const schema = JSON.parse(await fs.readFile(new URL('../../../../factory/schemas/qa.schema.json', import.meta.url)));
  const validate = new Ajv2020({ strict: false }).compile(schema);
  assert.equal(validate({
    schemaVersion: '3.0.0',
    status: 'passed',
    build: { astroCheck: 'passed', astroBuild: 'passed' },
    concepts: [{
      id: 'concept-01',
      rendering: 'passed',
      accessibility: { critical: 0, serious: 0 },
      lighthouse: { performance: 99.99, accessibility: 95.55, bestPractices: 96.67, seo: 100 }
    }],
    uiUxReview: { status: 'passed', minimumScore: 80 }
  }), true, JSON.stringify(validate.errors));
});

test('terminateChild escalates when a process ignores SIGTERM', async () => {
  const child = spawn(process.execPath, ['-e', "process.on('SIGTERM', () => {}); console.log('ready'); setInterval(() => {}, 1000)"], {
    stdio: ['ignore', 'pipe', 'ignore']
  });
  await new Promise((resolve, reject) => {
    child.stdout.once('data', resolve);
    child.once('error', reject);
  });

  await terminateChild(child, 50);
  assert.equal(child.signalCode, 'SIGKILL');
});
