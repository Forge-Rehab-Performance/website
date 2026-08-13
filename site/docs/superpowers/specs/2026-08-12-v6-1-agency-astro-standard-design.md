# Forge PT V6.1 Agency Astro Standard Design

## Goal
Refactor Concept 01 without intentional visual changes into a reusable agency-grade Astro structure with centralized site config, nested layouts, Google Analytics readiness, and baseline technical SEO.

## Architecture
- `BaseLayout.astro` owns the HTML document, metadata, canonical URL, sitemap discovery, robots directives, Open Graph/Twitter metadata, and analytics integration.
- `SiteLayout.astro` owns Concept 01 site chrome and composes header/footer around page content.
- Route files remain thin and compose page section components.
- Client facts live in `src/config/site.ts`; navigation lives in `src/config/navigation.ts`; reusable structured page content may live in `src/data/`.
- Historical Concepts 02/03 remain available but are excluded from the sitemap and noindexed.

## Analytics
`PUBLIC_GA_MEASUREMENT_ID` is optional. When empty or invalid, no Google tag is emitted. When a valid `G-...` ID is configured, the Google tag is placed in the document head. Standard multi-page navigation relies on GA4 automatic page views.

## SEO
- `SITE_URL` configures Astro's production `site` value, with a safe example-domain fallback for local/demo builds.
- `@astrojs/sitemap` generates sitemap files for Concept 01 routes only.
- `robots.txt` is generated dynamically and links to the sitemap.
- BaseLayout provides canonical, description, Open Graph, Twitter card, sitemap link, and index/noindex support.
- Historical concept routes are excluded from the sitemap.

## Documentation
- `README.md`: human onboarding, architecture, content/config workflow, analytics, SEO, build/deployment, and launch checklist.
- `AGENTS.md`: rules for coding agents: thin routes, reusable components, centralized facts, minimal client JS, accessibility, SEO completion criteria, and verification commands.
