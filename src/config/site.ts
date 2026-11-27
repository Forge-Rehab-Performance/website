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
    name: 'Dr. Brandon Coveney',
    credentials: 'PT, DPT, OCS',
    specialty: 'Board-Certified Orthopedic Clinical Specialist',
  },
  contact: {
    phone: '973-554-3655' as string | null,
    email: 'brandon@rehabforge.com' as string | null,
    gymName: 'Redshed Crossfit' as string | null,
    address: '3 Gold Mine Rd, Roxbury, NJ' as string | null,
    hours: null as string | null,
  },
  booking: {
    url: 'https://app.pteverywhere.com/s/6afe1c3816dc891738277f68/register' as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
