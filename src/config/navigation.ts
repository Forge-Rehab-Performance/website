import { siteConfig } from './site';

export type SitePage = 'home' | 'approach' | 'services' | 'about' | 'pricing' | 'faq' | 'contact' | 'not-found';

const route = (path = '') => `${siteConfig.basePath}${path}/`.replace('//', '/');

export const primaryNavigation: Array<{ key: SitePage; label: string; href: string }> = [
  { key: 'home', label: 'Home', href: route() },
  { key: 'approach', label: 'Approach', href: route('/approach') },
  { key: 'services', label: 'Services', href: route('/services') },
  { key: 'about', label: 'About', href: route('/about') },
  { key: 'pricing', label: 'Pricing', href: route('/pricing') },
  { key: 'faq', label: 'FAQ', href: route('/faq') },
  { key: 'contact', label: 'Contact', href: route('/contact') },
];
