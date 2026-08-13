import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import process from 'node:process';
import { canonicalQaForReproducibility, terminateChild } from './qa-helpers.mjs';

const qaDir = new URL('../../qa/', import.meta.url);

let child;
const runQa = () => new Promise((resolve, reject) => {
  child = spawn('npm', ['run', 'qa'], { cwd: new URL('..', import.meta.url), detached: true, stdio: 'inherit' });
  const timeout = setTimeout(() => terminateChild(child, 2_000, true).then(() => reject(new Error('npm run qa timed out after 5 minutes'))), 5 * 60_000);
  child.once('error', (error) => { clearTimeout(timeout); reject(error); });
  child.once('exit', (code) => {
    clearTimeout(timeout);
    child = undefined;
    code === 0 ? resolve() : reject(new Error(`npm run qa failed (${code})`));
  });
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => terminateChild(child, 2_000, true).finally(() => process.exit(128 + (signal === 'SIGINT' ? 2 : 15))));
}

const hashes = async (directory = qaDir, prefix = '') => {
  const result = {};
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name, directory);
    const name = `${prefix}${entry.name}`;
    if (entry.isDirectory()) Object.assign(result, await hashes(new URL(`${entry.name}/`, directory), `${name}/`));
    else {
      const contents = await fs.readFile(path);
      const evidence = name === 'qa.json' ? canonicalQaForReproducibility(JSON.parse(contents)) : contents;
      result[name] = createHash('sha256').update(evidence).digest('hex');
    }
  }
  return result;
};

await runQa();
const first = await hashes();
await runQa();
const second = await hashes();
const changed = Object.keys({ ...first, ...second }).filter((file) => first[file] !== second[file]);
assert.deepEqual(changed, [], `QA evidence changed between identical runs:\n${changed.join('\n')}`);
console.log(`PASS reproducible blocking QA evidence/artifacts: ${Object.keys(second).length} artifacts (advisory performance normalized)`);
