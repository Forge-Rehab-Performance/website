# Concept 01 V7 Design

## Goal

Make the densest Concept 01 information pages easier to scan on desktop and mobile without changing the approved visual identity, V6.1 agency architecture, analytics setup, or SEO behavior.

## Scope

V7 changes only Concept 01 Services, Pricing, and FAQ presentation. Home, Forge Approach, About, Contact, shared site chrome, SEO, analytics, sitemap/robots behavior, and historical Concepts 02/03 remain functionally unchanged.

## FAQ

Replace the long sequence of full-width FAQ category sections with one compact FAQ explorer.

- Desktop: a two-column container. The left column is a category rail. The right column contains the questions for only the selected category.
- The selected category is visually emphasized using the Forge accent and stronger foreground treatment; unselected categories are muted.
- Selecting a category swaps the visible FAQ set without navigation or a full page reload.
- Questions remain accessible disclosure controls using native `<details>/<summary>` within the currently visible category panel.
- The first category is selected by default.
- Mobile: category controls become a horizontally scrollable tab-style row above the FAQ list. The FAQ panel remains a single column.
- Interaction uses minimal framework-free client JavaScript with buttons, `aria-selected`, tab/panel relationships, keyboard-friendly native controls, and no third-party UI dependency.

## Pricing

Reduce visual scale and page length while preserving every supplied price, package, savings statement, explanatory section, and CTA.

- Shorter hero and tighter section spacing.
- À-la-carte pricing becomes a compact two-card row.
- Recover / Build / Perform packages remain three cards but use smaller headings, prices, padding, and content spacing; no artificial minimum card height.
- Supporting guidance, Forge Promise, Founding Forge 20, and final CTA remain but are condensed into tighter bands.
- Mobile cards stack naturally with reduced spacing and typography that fits narrow screens without horizontal overflow.

## Services

Replace service accordions with static service cards so users can scan all offerings without opening dropdowns.

- Five service cards in a responsive two-column desktop grid; the final card uses a balanced layout rather than appearing stranded.
- One-column cards on mobile.
- Each card exposes its service name, supporting headline, concise overview, and the key lists/details already supplied by the client.
- Orthopedic PT can contain compact internal subgroups for conditions; the other service cards use short structured lists or progression elements.
- No service content is hidden behind `<details>`.

## Responsive requirements

- Desktop target: 1440px-wide review captures.
- Mobile target: 390px-wide review captures.
- No horizontal overflow at either target.
- FAQ category navigation remains usable at 390px without reducing tap targets below comfortable touch sizes.
- Pricing and service cards must not rely on fixed/min heights that produce dead space on mobile.

## Architecture requirements

- Keep route files thin and continue using `SiteLayout` / `BaseLayout`.
- Continue storing FAQ content in `src/data/faq.ts`.
- Introduce only the smallest new component/data abstractions needed for the three pages.
- Framework-free JavaScript only for FAQ category switching.
- Do not alter GA4 readiness, SEO metadata, sitemap filtering, robots output, or historical-concept indexing behavior.
- Update `ITERATION.md`, `site/README.md`, and `site/AGENTS.md` only where V7 behavior changes the reusable agency guidance.

## Verification

- Add V7 source tests that fail on V6.1 and pass after implementation.
- Run Astro check and production build.
- Run SEO verification.
- Verify Concepts 02/03 source hashes remain unchanged.
- Browser-smoke the three changed Concept 01 routes at desktop and mobile widths.
- Produce desktop and mobile previews for FAQ, Pricing, and Services only.
- Return the entire Forge project in one ZIP, preserving historical concepts and earlier previews.
