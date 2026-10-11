# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added the home-page “Why Choose Forge?” care benefits and comparison table, including keyboard-accessible horizontal scrolling on small screens.
- Added locally stored family and kettlebell stock photography for the home-page audience section, with source and licensing references.
- Added Rapid Reset pricing: $115 for a single session, $420 for four visits, and $760 for eight visits, with the supplied treatment scope and exclusions.
- Added Chromium browser checks for responsive home, contact, and pricing layouts, pricing text sizes, package prices, SEO output, and accessibility of the updated home-page sections and Rapid Reset section.

### Changed
- Moved home-page scheduling below the navigation and above the hero.
- Updated Active Adults and Strength & Fitness Enthusiasts copy and placed audience captions below photos.
- Published the supplied phone, email, Roxbury address, and Redshed Crossfit location in centralized configuration, the footer, and the contact page, with telephone/email links and map directions.
- Set the default production origin to `https://rehabforge.com`, while preserving the `SITE_URL` override and opt-in analytics behavior.
- Adopted the supplied Vector 03 mark for the header/footer and regenerated the social image. Consolidated all definitive logo variants in `public/assets/branding/` with descriptive filenames.
- Increased pricing-page body text to 16px and secondary labels to at least 14px, and renamed the package heading to “Physical Therapy Packages”.
- Updated project documentation for branding assets, stock-photo sources, and browser verification commands.

### Removed
- Removed the home-page hero practitioner block and three practice-highlight boxes.
- Removed the Sports & Injury Rehabilitation closing blurb from the Services page.
- Removed the superseded raster logos and duplicate SVG mark.

### Fixed
- Improved contrast for the home-page audience eyebrow and stock-photo captions.
- Ensured the configured logo and social image resolve to publicly served assets.

## [1.0.0] - 2026-08-13

### Added
- Added automated `node --test` tests for structural layouts, CSS references, and built asset inclusion.
- Implemented Astro Content Collections for strictly-typed, JSON-backed FAQ data.
- Formalized architectural guidelines in `AGENTS.md` covering Web Components, CSS Scoping, Astro Image handling, and Netlify Forms.
- Added comprehensive documentation and development steps to `README.md`.

### Changed
- Refactored global CSS patterns by renaming `precision.css` to `global.css`.
- Extracted and isolated specific UI component styles (e.g., `.contact-form`) into native Astro `<style>` blocks.
- Transitioned all static HTML `<img>` elements to optimized Astro `<Image />` tags for automatic webp conversion and lazy-loading.
- Moved public assets from `/public/assets` directly into `/src/assets` to leverage Vite's bundling and hashing pipeline.
- Updated the "Insurance & Payment" FAQ section to prioritize an explanation on the benefits of cash-based, out-of-network care over traditional in-network models.
- Reordered FAQ categories to prioritize the "Getting Started" section.

### Fixed
- Fixed an issue where the custom `oswald-latin.woff2` font failed to bundle during production builds due to an absolute root path in `tokens.css`.
- Replaced arbitrary inline `<script>` tags with isolated, standard Web Components (`<contact-form>`) that leverage native HTML5 validation and DOM scoping.
