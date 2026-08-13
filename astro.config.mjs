import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// Astro evaluates this file before application modules. CLI-provided variables
// are available on process.env; .env files are loaded explicitly for config use.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = process.env.SITE_URL || fileEnv.SITE_URL || 'https://example.com';

export default defineConfig({
  output: 'static',
  site,
  env: {
    schema: {
      PUBLIC_GA_MEASUREMENT_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
  integrations: [
    sitemap({
      // Concept 01 is the active client direction. Historical concepts stay in the repo but out of search indexes.
      filter: (page) => new URL(page).pathname.startsWith('/concept-01/'),
      namespaces: { news: false, xhtml: false, video: false },
    }),
  ],
});
