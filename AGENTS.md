# AGENTS.md — Agency Astro Rules

This file is the implementation contract for coding agents working in this Astro client-site repository.

## Primary goal

Produce fast, maintainable, accessible static marketing sites that can be handed off, extended, and audited without rediscovering where client data or site-wide behavior lives.

## Architecture rules

1. **Keep a thin route layer.** Route files should stay thin. Files in `src/pages/` should select metadata/layouts and compose components. Move substantial markup to `src/components/sections/`.
2. **Use the layout hierarchy.** Active client pages use `SiteLayout`, which builds on `BaseLayout`. Do not duplicate `<html>`, `<head>`, header, footer, canonical, analytics, or SEO boilerplate in each route.
3. **Centralize client facts.** Practice name, practitioner details, phone, email, address, hours, booking URL, and other reusable business facts belong in `src/config/site.ts`. Never fabricate missing client facts.
4. **Centralize navigation.** Add or rename primary routes through `src/config/navigation.ts`.
5. **Separate structured content.** Repeated data such as FAQs, service lists, packages, testimonials, and staff records belongs in typed modules under `src/data/` when it improves reuse/readability.
6. **Keep global CSS intentional.** Design tokens, resets/base styles, utilities, and truly site-wide theme rules may live in `src/styles/`. Prefer component-scoped styles for component-specific presentation.
7. **Prefer Astro's static model.** Do not add React/Vue/Svelte or client-side JavaScript unless a real interaction requires it. Use native HTML behavior such as `<details>` for individual disclosures; use small framework-free scripts for interaction patterns such as the V7 FAQ category explorer when native HTML alone cannot express the requested behavior cleanly.
8. **Preserve accessibility.** Maintain semantic headings, landmarks, labels, keyboard operation, visible focus, reduced-motion behavior, alt text, and contrast.
9. **Preserve historical concepts.** Concept 02/03 and QA provenance are historical assets. Do not delete or rewrite them unless explicitly requested.

## SEO rules

Every new public page must have an intentional:

- title
- meta description
- canonical path/behavior
- indexability decision
- sitemap decision

`BaseLayout` owns canonical, Open Graph, Twitter, robots, sitemap discovery, structured-data hooks, and analytics. Do not reimplement these in page sections.

The active client concept is allowed into the sitemap. Historical concepts must remain excluded and `noindex, nofollow`.

Never add SEO fields such as fake locations, fabricated reviews, or unsupported medical claims.

## Analytics rules

Google Analytics is optional and disabled when `PUBLIC_GA_MEASUREMENT_ID` is empty or invalid.

- Do not hard-code a GA Measurement ID.
- Do not paste Google Analytics scripts into route files or page sections.
- Use `src/components/integrations/analytics/GoogleAnalytics.astro` as the single GA integration point.
- Do not manually fire `page_view` on this normal multi-page site unless automatic page views are intentionally disabled.
- Put future conversion tracking behind reusable analytics helpers/components and use stable event names.
- Never enable analytics on a client demo without an explicit configured ID.
- For healthcare sites, never send patient identifiers, form values, appointment details, diagnoses, or free-text health information to analytics. Confirm privacy/compliance requirements before adding EMR cross-domain tracking.


## Dense information-page patterns

- Do not solve information density by making every section oversized. Prefer compact hierarchy, tighter section rhythm, and responsive grids.
- For large FAQs, prefer a single category explorer when categories are mutually browsed rather than seven stacked category sections. Desktop may use a left category rail; mobile should turn that rail into touch-friendly horizontal tabs.
- Do not hide every service behind an accordion. If the user needs to compare services, visible cards are usually the better default.
- Pricing pages should prioritize scanability: compact price cards, clear package comparisons, and no arbitrary minimum heights that create dead space.
- Any custom tab/category interaction must maintain keyboard operation, focus visibility, `aria-selected`, and tab/panel relationships.

## Client content rules

Use client-supplied material as the source of truth. Preserve terminology and claims unless the user explicitly asks for editorial changes. If information is unknown, keep a clear placeholder/null state rather than guessing.

For healthcare forms, do not silently introduce collection of sensitive medical information. Preserve the existing warning until a compliant form/data workflow is intentionally implemented.

## Completion checks

Before claiming implementation is complete, run fresh verification from `site/`:

```bash
npm test
npm run check
npm run build
npm run verify:seo
```

Also inspect the changed pages at desktop and mobile widths when browser tooling is available.

A change is not complete merely because it builds. Confirm the requested behavior, SEO output, analytics state, and historical-concept preservation.

## Scope discipline

Avoid speculative abstractions. Extract patterns only when they are useful in this project or clearly part of the agreed agency standard. Do not add a CMS, framework island library, cookie platform, or tag manager without a concrete requirement.
