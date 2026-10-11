export const siteConfig = {
  name: 'Forge Rehab & Performance',
  shortName: 'Forge',
  accessibleName: 'Forge Rehab and Performance',
  tagline: 'Recover. Build. Perform.',
  description: 'One-on-one physical therapy for active people who expect more from their recovery.',
  basePath: '',
  logo: '/assets/branding/forge-mark.svg',
  socialImage: '/assets/branding/forge-social.png',
  practitioner: {
    name: 'Brandon Coveney',
    credentials: 'PT, DPT, OCS',
    specialty: 'Board-Certified Orthopedic Clinical Specialist',
  },
  contact: {
    phone: '(973) 222-0839' as string | null,
    email: 'brandon@rehabforge.com' as string | null,
    gymName: 'Redshed Crossfit' as string | null,
    address: '3 Gold Mine Rd, Roxbury, NJ' as string | null,
    hours: null as string | null,
  },
  booking: {
    url: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
