export const lighthouseScores = (categories) => ({
  performance: categories.performance.score * 100,
  accessibility: categories.accessibility.score * 100,
  bestPractices: categories['best-practices'].score * 100,
  seo: categories.seo.score * 100
});

export const canonicalQaForReproducibility = (qa) => {
  const canonical = structuredClone(qa);
  for (const concept of canonical.concepts) {
    delete concept.lighthouse.performance;
    delete concept.performanceAdvisory;
  }
  return JSON.stringify(canonical);
};

export const terminateChild = async (child, graceMs = 2_000, group = false) => {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  const kill = (signal) => {
    try {
      group ? process.kill(-child.pid, signal) : child.kill(signal);
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  };
  kill('SIGTERM');
  if (group) await new Promise((resolve) => setTimeout(resolve, graceMs));
  else if (await Promise.race([exited.then(() => true), new Promise((resolve) => setTimeout(() => resolve(false), graceMs))])) return;
  kill('SIGKILL');
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, graceMs))]);
};
