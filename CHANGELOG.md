# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
