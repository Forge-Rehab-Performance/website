# Forge Rehab & Performance — Astro Site

This directory contains the active Astro implementation for Forge Rehab & Performance and is also the reference structure for future agency-built static sites.

The V6.1 release established the **architecture and launch-readiness standard**. V7 keeps that foundation and adds reusable compact information-page patterns for dense service, pricing, and FAQ content without changing the agency rules around layouts, config, SEO, analytics, or historical concepts.

## Quick start

Requirements:

- Node.js `>=22.19.0`
- npm compatible with the committed `package-lock.json`

```bash
npm ci
cp .env.example .env
npm run dev
```

Quality checks:

```bash
npm test
npm run check
npm run build
npm run verify:seo
```

## Agency architecture

```text
src/
├── components/
│   ├── integrations/
│   │   └── analytics/
│   │       └── GoogleAnalytics.astro
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Navigation.astro
│   │   └── Footer.astro
│   ├── sections/
│   │   ├── home/
│   │   ├── approach/
│   │   ├── services/
│   │   ├── about/
│   │   ├── pricing/
│   │   ├── faq/
│   │   └── contact/
│   └── seo/
│       └── StructuredData.astro
├── config/
│   ├── site.ts
│   ├── navigation.ts
│   └── seo.ts
├── data/
│   └── faq.ts
├── layouts/
│   ├── BaseLayout.astro
│   ├── SiteLayout.astro
│   ├── BlueprintLayout.astro
│   └── ForwardLayout.astro
├── pages/
│   ├── concept-01/
│   └── robots.txt.ts
└── styles/
    ├── tokens.css
    ├── base.css
    ├── utilities.css
    └── precision.css
```

### Responsibility rules

**Routes compose. Components implement. Config stores client facts. Data stores structured content. Layouts own the document shell.**

- `src/pages/` should remain thin. A route chooses metadata, selects a layout, and composes page/section components.
- `src/components/sections/` owns page-specific presentation.
- `src/components/layout/` owns reusable site chrome.
- `src/config/site.ts` is the first place to update business details such as the practice name, booking URL, phone, email, address, and hours.
- `src/config/navigation.ts` owns primary navigation and active route identifiers.
- `src/config/seo.ts` owns site-wide SEO defaults.
- `src/data/` is for repeated structured content that should not be embedded inside route markup. The FAQ is the first example.
- `src/layouts/BaseLayout.astro` owns the HTML document, metadata, canonical behavior, analytics hook, and structured-data hook.
- `src/layouts/SiteLayout.astro` builds on `BaseLayout` and owns the active client site's header, main region, footer, and theme styles.
- Component-specific CSS should stay with the component when practical. Global CSS is reserved for design tokens, resets/base rules, utilities, and intentional site-wide theme rules.


## Compact information-page patterns

V7 adds three reusable patterns for client sites with a lot of structured information:

- **Category explorer:** use a compact left-rail/right-panel treatment on desktop and horizontally scrollable category tabs on mobile when a large FAQ would otherwise become many full-page sections. Keep the selected category visually distinct, keep inactive categories muted, and preserve accessible tab semantics.
- **Service card directory:** prefer visible service cards when users benefit from scanning offerings side-by-side. Use disclosure widgets only when hiding detail materially improves comprehension; do not default to accordions merely to reduce page length.
- **Compact pricing grid:** pricing should emphasize clarity rather than oversized landing-page typography. Keep prices, inclusions, optionality, and savings obvious while avoiding artificial minimum heights and excessive vertical padding.

When adding a small client-side interaction such as category switching, prefer framework-free JavaScript if the behavior does not justify a React/Vue/Svelte island. Keep interactive controls keyboard-operable and preserve native disclosure behavior for individual FAQ questions.

## Environment variables

Copy `.env.example` to `.env` for local development.

```env
SITE_URL=https://www.example.com
PUBLIC_GA_MEASUREMENT_ID=
```

### `SITE_URL`

Set this to the final production origin before launch. It is used for:

- Astro's configured site origin
- canonical URLs
- Open Graph URLs
- sitemap generation
- `robots.txt` sitemap discovery

Do not launch a client site with the example URL.

### `PUBLIC_GA_MEASUREMENT_ID`

Google Analytics is **disabled by default**. Leave this blank for concept demos, local development, and pre-launch review sites.

When the client has a GA4 property, set a valid Measurement ID:

```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

`GoogleAnalytics.astro` is included by `BaseLayout` so analytics is enabled site-wide from one integration point. Do not paste Google tags into individual pages.

The site uses normal multi-page navigation, so do not add manual GA4 `page_view` events unless automatic page-view measurement has intentionally been disabled. Future conversion events such as `book_evaluation`, `contact_submit`, or phone-link clicks should be implemented as explicitly named events in the analytics integration layer rather than inline snippets scattered through components.

If the agency later standardizes on Google Tag Manager, add it beside the existing analytics integration rather than rewriting page templates.

### Healthcare analytics caution

For healthcare clients, do not send names, email addresses, form field values, appointment details, diagnoses, free-text health information, or other sensitive patient data to Google Analytics. Confirm the client's privacy/compliance requirements before enabling analytics or cross-domain tracking with an EMR/scheduling platform.

## SEO baseline

V6.1 provides the baseline every production client repo should inherit:

- `@astrojs/sitemap` integration
- automatic sitemap generation during the production build
- active Concept 01 routes included in the sitemap
- historical Concept 02/03 routes excluded from the sitemap
- dynamic `robots.txt` with a sitemap reference
- canonical URLs in `BaseLayout`
- per-page title and meta description
- `robots` index/noindex support
- Open Graph metadata
- Twitter card metadata
- sitemap discovery link in `<head>`
- `StructuredData.astro` hook for future JSON-LD
- historical concept pages explicitly `noindex, nofollow`

### Adding a production page

A page is not finished until it has all of the following:

1. an intentional title
2. a useful meta description
3. correct canonical behavior
4. an explicit indexability decision
5. correct sitemap behavior
6. accessible heading hierarchy and landmark structure

For normal active-client pages, use `SiteLayout`. Pass `noindex={true}` only for pages that genuinely should not be indexed.

### Sitemap behavior

`astro.config.mjs` filters sitemap output to `/concept-01/` because Concepts 02 and 03 are historical design directions. When a concept graduates to its own production repository, remove the concept-prefix architecture and update the sitemap filter for the production route structure.

After a production build:

```bash
npm run verify:seo
```

This checks that the sitemap and robots output exist, the expected Concept 01 routes are present, and historical concepts are not published in the sitemap.

## Client facts and placeholders

Update `src/config/site.ts` before launch. Unknown facts must remain `null` rather than being invented.

Current placeholders include:

- EMR scheduling URL
- phone number
- email address
- gym name
- street address
- business hours

Components should read these values from config. Do not hard-code replacements in multiple templates.

## Content workflow

For a new client:

1. duplicate the starter/repo
2. update `src/config/site.ts`
3. update navigation in `src/config/navigation.ts`
4. update SEO defaults in `src/config/seo.ts`
5. replace client content in `src/data/` and section components
6. replace imagery in `public/`
7. set `SITE_URL`
8. optionally set `PUBLIC_GA_MEASUREMENT_ID`
9. run the full verification commands
10. deploy the static output

For repeated structured content (FAQ entries, services, team members, pricing tiers), prefer typed files in `src/data/`. If a future client needs a blog or editor-managed content, evaluate Astro content collections or a CMS at that time rather than introducing one by default.

## Historical concepts

Concepts 02 and 03 are retained in this package for design provenance. Their layouts are intentionally marked `noindex, nofollow`, and the sitemap excludes them. Do not delete historical concept/QA assets unless the client or agency workflow explicitly calls for cleanup.

## Pre-launch checklist

- [ ] Replace all client placeholders in `src/config/site.ts`
- [ ] Set the real `SITE_URL`
- [ ] Confirm every public page title and description
- [ ] Confirm canonical URLs use the production domain
- [ ] Confirm sitemap contains only intended production routes
- [ ] Confirm `robots.txt` references the production sitemap
- [ ] Confirm historical/demo pages are noindex or removed from production
- [ ] Add the real GA4 Measurement ID only after the client's analytics property exists
- [ ] Verify booking/contact links against the real destination
- [ ] Replace demo/stock imagery with approved client assets
- [ ] Run `npm test`
- [ ] Run `npm run check`
- [ ] Run `npm run build`
- [ ] Run `npm run verify:seo`
- [ ] Run final accessibility/performance QA against the deployed URL

## Deployment

The site builds as static HTML/CSS/JS:

```bash
npm run build
```

The output is written to `dist/` and can be deployed to a static host such as Cloudflare Pages. Environment variables used at build time must be configured in the hosting platform as well as locally.

## Factory provenance checks

This V6.1 package still preserves the original concept-factory discovery and QA artifacts. Those historical validators depend on the wider factory workspace and are intentionally **not** part of the standalone client-site `npm test` command.

For the graduated/standalone client repo, use:

```bash
npm test
npm run verify
```

When this directory is mounted back inside the original concept factory with its schema directory available, the historical provenance suite remains available as:

```bash
npm run test:factory
```
