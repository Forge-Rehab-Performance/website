export const siteConfig = {
  name: 'Forge Rehab & Performance',
  shortName: 'Forge',
  accessibleName: 'Forge Rehab and Performance',
  tagline: 'Recover. Build. Perform.',
  description: 'One-on-one physical therapy for active people who expect more from their recovery.',
  basePath: '/concept-01',
  logo: '/assets/forge-logo.png',
  practitioner: {
    name: 'Brandon Coveney',
    credentials: 'PT, DPT, OCS',
    specialty: 'Board-Certified Orthopedic Clinical Specialist',
  },
  contact: {
    phone: null as string | null,
    email: null as string | null,
    gymName: null as string | null,
    address: null as string | null,
    hours: null as string | null,
  },
  booking: {
    url: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
