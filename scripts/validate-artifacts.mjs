import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const prospectRoot = new URL('../../', import.meta.url);
const schemaRoot = new URL('../../../../factory/schemas/', import.meta.url);
const artifacts = [
  ['business brief', 'discovery/business-brief.json', 'business-brief.schema.json'],
  ['competitive landscape', 'discovery/competitive-landscape.json', 'competitive-landscape.schema.json'],
  ['assets', 'assets/assets.json', 'assets.schema.json'],
  ['prospect', 'prospect.json', 'prospect.schema.json'],
  ['run', 'run.json', 'run.schema.json'],
  ['design intelligence', 'strategy/design-intelligence.json', 'design-intelligence.schema.json'],
  ['creative brief', 'strategy/creative-brief.json', 'creative-brief.schema.json'],
  ['UX brief', 'strategy/ux-brief.json', 'ux-brief.schema.json'],
  ['site manifest', 'site/site-manifest.json', 'site-manifest.schema.json'],
  ['QA', 'qa/qa.json', 'qa.schema.json'],
  ['UI/UX review', 'qa/ui-ux-review.json', 'ui-ux-review.schema.json'],
  ['deployment', 'deployment.json', 'deployment.schema.json']
];

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
let failed = false;

const manifest = await fs.readFile(new URL('site/site-manifest.json', prospectRoot), 'utf8').then(JSON.parse);
for (const concept of manifest.concepts) {
  for (const component of concept.customComponents) {
    const candidates = [`site/src/components/${component}.astro`, `site/src/layouts/${component}.astro`];
    const resolved = await Promise.all(candidates.map((path) => fs.access(new URL(path, prospectRoot)).then(() => true, () => false)));
    if (!resolved.some(Boolean)) {
      failed = true;
      console.error(`FAIL site manifest: ${concept.id} custom component ${component} does not resolve to an Astro component or layout`);
    }
  }
}

const [assets, report] = await Promise.all([
  fs.readFile(new URL('assets/assets.json', prospectRoot), 'utf8').then(JSON.parse),
  fs.readFile(new URL('report/report.html', prospectRoot), 'utf8')
]);
for (const assetId of [...report.matchAll(/data-asset-ids="([^"]+)"/g)].flatMap(([, ids]) => ids.split(' '))) {
  const asset = assets.assets.find(({ id }) => id === assetId);
  const preview = report.match(new RegExp(`<figure class="preview"[^>]*data-asset-ids="[^"]*\\b${assetId}\\b[^"]*"[\\s\\S]*?<\\/figure>`));
  if (!asset || asset.origin !== 'licensed_stock' || !asset.allowedUses.includes('report') || ![asset.creator, asset.sourceUrl, asset.licenseUrl, 'cropped/resized and converted to WebP for this demo'].every((credit) => preview[0].includes(credit))) {
    failed = true;
    console.error(`FAIL report attribution: ${assetId} must have a complete adjacent preview credit`);
  }
}

for (const [name, artifactPath, schemaPath] of artifacts) {
  const artifactUrl = new URL(artifactPath, prospectRoot);
  try {
    await fs.access(artifactUrl);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }

  try {
    const [artifact, schema] = await Promise.all([
      fs.readFile(artifactUrl, 'utf8').then(JSON.parse),
      fs.readFile(new URL(schemaPath, schemaRoot), 'utf8').then(JSON.parse)
    ]);
    const validate = ajv.compile(schema);
    if (validate(artifact)) {
      console.log(`PASS ${name}: ${artifactPath}`);
    } else {
      failed = true;
      console.error(`FAIL ${name}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
    }
  } catch (error) {
    failed = true;
    console.error(`FAIL ${name}: ${fileURLToPath(artifactUrl)}: ${error.message}`);
  }
}

if (failed) process.exitCode = 1;
