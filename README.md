# Forge Rehab & Performance

A fast, statically generated Astro website for Forge Rehab & Performance.

## Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Run type/astro checking
npm run check

# Build for production
npm run build
```

## Architecture

This site uses Astro for fast, zero-JS-by-default static generation. It is built on a custom design system with plain CSS, using a `precision.css` theme over a lightweight `base.css` and `tokens.css` foundation. 

Content is structured in `src/pages/` (thin routers) and `src/components/sections/` (heavy markup), pulling configuration from `src/config/site.ts`.

All SEO metadata, canonicals, and sitemaps are handled automatically by `BaseLayout.astro`.
