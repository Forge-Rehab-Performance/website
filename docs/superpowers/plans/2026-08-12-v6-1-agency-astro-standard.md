# V6.1 Agency Astro Standard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize Forge Concept 01 as the reusable Astro architecture for future agency sites while preserving V6 visuals.

**Architecture:** Add nested base/site layouts, reusable site chrome, centralized configuration, optional GA4, and technical SEO infrastructure. Keep historical Concepts 02/03 in the repo while excluding them from search indexing/sitemap output.

**Tech Stack:** Astro 7.2.1, TypeScript 5.9, `@astrojs/sitemap`, static output, CSS.

## Global Constraints
- No intentional visual redesign of Concept 01.
- Preserve Concepts 02/03 for historical reference.
- Google Analytics must emit nothing unless `PUBLIC_GA_MEASUREMENT_ID` is a valid `G-...` ID.
- Concept 02/03 routes must be excluded from the sitemap and marked noindex.
- New route files should be thin composition layers.
- Run architecture tests, Astro check, production build, and sitemap/robots assertions before packaging.

---

### Task 1: Add architecture regression test
- [ ] Add `scripts/v6-1-architecture.test.mjs` asserting standard directories/files, thin Concept 01 routes, centralized analytics/SEO integration, and sitemap filters.
- [ ] Run it and confirm it fails on the V6 tree.

### Task 2: Add agency config, SEO, analytics and nested layouts
- [ ] Create `src/config/site.ts`, `src/config/navigation.ts`, `src/config/seo.ts`.
- [ ] Create `src/components/integrations/analytics/GoogleAnalytics.astro`.
- [ ] Create `src/components/layout/Header.astro`, `Footer.astro`, `Navigation.astro`.
- [ ] Create `src/layouts/BaseLayout.astro` and `SiteLayout.astro`.
- [ ] Add `.env.example`, `src/env.d.ts`, `src/pages/robots.txt.ts`.

### Task 3: Refactor Concept 01 routes into section/page components
- [ ] Move each existing Concept 01 page body to `src/components/sections/<page>/<PageName>Page.astro`.
- [ ] Replace each Concept 01 route with a thin `SiteLayout` + page component composition.
- [ ] Keep existing class names and `precision.css` to preserve appearance; document it as the current theme stylesheet while new reusable primitives use scoped styles.

### Task 4: Add sitemap and historical noindex behavior
- [ ] Install `@astrojs/sitemap` and configure `SITE_URL` through `loadEnv`.
- [ ] Include only `/concept-01/` routes in sitemap output.
- [ ] Add noindex metadata to historical concept layouts without changing their visual content.

### Task 5: Add agency documentation
- [ ] Add `README.md` with setup, architecture, client configuration, content changes, analytics, SEO, deployment, and launch checklist.
- [ ] Add `AGENTS.md` with codebase constraints and verification rules.

### Task 6: Verify and package
- [ ] Run `node --test scripts/v6-1-architecture.test.mjs`.
- [ ] Run `npm run check`.
- [ ] Run `npm run build` with an explicit example `SITE_URL`.
- [ ] Assert sitemap contains Concept 01 routes and excludes Concept 02/03; assert robots points at sitemap.
- [ ] Package complete project without `node_modules` and verify archive integrity.
