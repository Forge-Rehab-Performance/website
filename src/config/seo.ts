import { siteConfig } from './site';

export const seoConfig = {
  defaultTitle: `${siteConfig.name} | ${siteConfig.tagline}`,
  defaultDescription: siteConfig.description,
  defaultImage: siteConfig.logo,
  twitterCard: 'summary_large_image' as const,
  themeColor: '#0b0c0b',
} as const;
