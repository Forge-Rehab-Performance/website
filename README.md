# Forge Rehab & Performance

A static marketing site built for Forge Rehab & Performance.

## Architecture & Technology Stack

This project is built using [Astro](https://astro.build/) with a strict static-first, zero-framework philosophy. We prioritize fast load times, accessible native HTML patterns, and robust vanilla CSS over heavy JavaScript frameworks (React, Vue, Svelte).

- **Framework**: Astro (Static Site Generation)
- **Styling**: Vanilla CSS with strict variable design tokens (`global.css`, `tokens.css`)
- **Forms**: [Netlify Forms](https://docs.netlify.com/forms/setup/) for serverless form submissions
- **Interactivity**: Native HTML5 elements (e.g., `<details>` for accordions) and standard Web Components / Custom Elements for isolated client-side logic
- **Testing**: Node.js native test runner (`node --test`)
- **Analytics**: Built-in, opt-in Google Analytics 4 integration via environment variables

## Project Structure

The project is structured to enforce a thin routing layer and highly reusable centralized components.

```text
/
├── .agents/                 # Agency AI automation & coding standards
├── src/
│   ├── components/          # Reusable UI components (header, footer, forms)
│   │   ├── forms/           # Form elements
│   │   ├── integrations/    # External integrations (e.g., Google Analytics)
│   │   └── sections/        # Page-specific substantial markup (Hero, About, etc.)
│   ├── config/              # Centralized site configurations
│   │   ├── site.ts          # Practice name, contact info, hours, URLs
│   │   └── navigation.ts    # Primary navigation route definitions
│   ├── data/                # Typed data modules (FAQs, Services, Pricing)
│   ├── layouts/             # Base wrapper layouts (BaseLayout, SiteLayout)
│   ├── pages/               # Thin route files that compose layouts & sections
│   ├── scripts/             # Client-side Web Components (e.g., contact-form.ts)
│   └── styles/              # Global CSS, resets, and design tokens
├── tests/                   # Automated structural and layout tests
├── AGENTS.md                # Agency Astro Rules and structural guidelines
├── astro.config.mjs         # Astro configuration
└── package.json             # NPM scripts and dependencies
```

## How It Works

### Routing & Layouts
All public pages exist inside `src/pages/`. These files remain extremely thin. Their only job is to select the correct Layout (usually `SiteLayout`) and compose sections from `src/components/sections/`. 

`SiteLayout` manages the site header and footer, while `BaseLayout` is responsible for all HTML `<head>` boilerplate, canonical URLs, Open Graph tags, sitemap discovery, and analytics. 

### Styling (`global.css` & `tokens.css`)
Global design tokens, resets, utilities, and site-wide theme rules live in `src/styles/`. 
We avoid utility-first frameworks like Tailwind in favor of semantic, cascading CSS that maintains a distinctive, intentional visual design.

### Interactivity & Web Components
We do not use UI frameworks like React. If a component requires client-side interactivity (such as form validation), we use standard DOM scripts encapsulated in Web Components. 

For example, the contact form validation logic is written in `src/scripts/contact-form.ts` and loaded via `<contact-form>` custom elements, perfectly isolating the JavaScript execution.

### Forms & Submissions
The site uses **Netlify Forms**. Forms are built natively in HTML using the `data-netlify="true"` attribute. During the build step, Netlify parses the HTML forms and automatically provisions secure serverless handlers to accept submissions—requiring zero backend code. Client-side form validation is handled via HTML5 `required` attributes and `libphonenumber-js`.

### Client Data Centralization
Do not hardcode business details into page markup. The practice name, practitioner details, phone, email, address, and booking links are maintained centrally in `src/config/site.ts`.

### Analytics
Google Analytics (GA4) is pre-configured but strictly opt-in. The integration lives in `src/components/integrations/analytics/GoogleAnalytics.astro` and is automatically injected into the `<head>` of all pages via `BaseLayout`. It only executes if a valid `PUBLIC_GA_MEASUREMENT_ID` environment variable is provided during the build or at runtime. Raw analytics scripts should never be pasted directly into page markup.

## Development Commands

All commands are run from the root of the project, from your terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Builds your site to the `./dist/` directory      |
| `npm run preview`         | Previews your build locally                      |
| `npm run test`            | Runs the test suite via Node's native test runner|
| `npm run check`           | Runs Astro's strict type checking and diagnostics|

## Deployment

This project is built as a completely static site (`npm run build`) and is specifically configured to be hosted on **Netlify**. This ensures that our static HTML form integration (Netlify Forms) works natively out-of-the-box without any backend code.

### Required Environment Variables

When setting up the project in the Netlify Dashboard, ensure the following environment variables are configured:

| Variable | Description |
| :--- | :--- |
| `SITE_URL` | The primary production URL of the site (e.g., `https://forgerehab.com`). Required by Astro to generate absolute canonical URLs and the `sitemap-index.xml`. |
| `PUBLIC_GA_MEASUREMENT_ID` | (Optional) Your Google Analytics 4 Measurement ID (e.g., `G-XXXXXXXXXX`). If provided, the site will automatically inject the GA tracking script. |

## Maintenance & AI Guidelines

If you are maintaining this site or using AI agents to modify it, you **must** review and adhere to `AGENTS.md`. This document outlines the strict architectural contracts, SEO requirements, and scope disciplines required to keep this site fast, maintainable, and compliant.
