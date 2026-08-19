export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  niche: 'E-commerce' | 'SaaS' | 'Real Estate' | 'Dental & Healthcare' | 'Local Services' | 'Legal & Finance';
  location: string;
  techStack: string[];
  estimatedRevenue: string;
  initialSeoScore: number;
  mobileResponsive: boolean;
  status: 'new' | 'audited' | 'contacted' | 'demo_scheduled' | 'closed_won' | 'closed_lost';
  leadScore: number; // 0-100
}

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    companyName: 'Apex Dental Care',
    contactName: 'Dr. Marcus Vance',
    role: 'Owner & Chief Dentist',
    email: 'marcus@apexdental.com',
    phone: '+1 (555) 234-8901',
    website: 'https://apexdentalcare.com',
    niche: 'Dental & Healthcare',
    location: 'Austin, TX',
    techStack: ['WordPress', 'Google Ads', 'PHP 7.4'],
    estimatedRevenue: '$1.2M/yr',
    initialSeoScore: 54,
    mobileResponsive: false,
    status: 'new',
    leadScore: 88,
  },
  {
    id: 'lead-2',
    companyName: 'Velox Apparel & Co',
    contactName: 'Sarah Lin',
    role: 'Head of E-Commerce',
    email: 'sarah@veloxapparel.io',
    phone: '+1 (555) 876-1234',
    website: 'https://veloxapparel.shop',
    niche: 'E-commerce',
    location: 'Miami, FL',
    techStack: ['Shopify', 'Klaviyo', 'Facebook Pixel'],
    estimatedRevenue: '$3.5M/yr',
    initialSeoScore: 62,
    mobileResponsive: true,
    status: 'audited',
    leadScore: 92,
  },
  {
    id: 'lead-3',
    companyName: 'Summit Real Estate Group',
    contactName: 'David Sterling',
    role: 'Managing Director',
    email: 'dsterling@summitrealty.com',
    phone: '+1 (555) 432-9081',
    website: 'https://summitrealtygroup.com',
    niche: 'Real Estate',
    location: 'Denver, CO',
    techStack: ['WordPress', 'HubSpot', 'jQuery'],
    estimatedRevenue: '$4.8M/yr',
    initialSeoScore: 48,
    mobileResponsive: false,
    status: 'contacted',
    leadScore: 85,
  },
  {
    id: 'lead-4',
    companyName: 'CloudPulse Software',
    contactName: 'Elena Rostova',
    role: 'VP of Marketing',
    email: 'elena@cloudpulse.tech',
    phone: '+1 (555) 912-3456',
    website: 'https://cloudpulsetech.io',
    niche: 'SaaS',
    location: 'San Francisco, CA',
    techStack: ['React', 'Next.js', 'Stripe', 'Segment'],
    estimatedRevenue: '$2.1M/yr',
    initialSeoScore: 78,
    mobileResponsive: true,
    status: 'demo_scheduled',
    leadScore: 95,
  },
  {
    id: 'lead-5',
    companyName: 'Precision Legal Partners',
    contactName: 'Robert Vance, Esq.',
    role: 'Managing Partner',
    email: 'robert@precisionlegal.law',
    phone: '+1 (555) 654-3210',
    website: 'https://precisionlegal.law',
    niche: 'Legal & Finance',
    location: 'Chicago, IL',
    techStack: ['Wix', 'Google Analytics v3'],
    estimatedRevenue: '$1.8M/yr',
    initialSeoScore: 41,
    mobileResponsive: false,
    status: 'new',
    leadScore: 90,
  },
  {
    id: 'lead-6',
    companyName: 'GreenThumb Landscaping',
    contactName: 'Jake Thorne',
    role: 'Founder & CEO',
    email: 'jake@greenthumblandscaping.com',
    phone: '+1 (555) 789-0123',
    website: 'https://greenthumblandscaping.com',
    niche: 'Local Services',
    location: 'Seattle, WA',
    techStack: ['Squarespace', 'Mailchimp'],
    estimatedRevenue: '$750K/yr',
    initialSeoScore: 50,
    mobileResponsive: true,
    status: 'new',
    leadScore: 82,
  }
];

export function generateDynamicLeads(niche: string, location: string): Lead[] {
  const companyPrefixes = ['Omni', 'Nova', 'Titan', 'Vanguard', 'Pinnacle', 'Radiant', 'Starlight', 'Horizon'];
  const companySuffixes = ['Labs', 'Solutions', 'Group', 'Agency', 'Media', 'Systems', 'Global', 'Studio'];

  const firstNames = ['Alexander', 'Emily', 'Michael', 'Sophia', 'James', 'Olivia', 'Daniel', 'Ava'];
  const lastNames = ['Wright', 'Chen', 'Patel', 'Miller', 'Taylor', 'Johnson', 'Anderson', 'Kowalski'];

  const results: Lead[] = [];

  for (let i = 0; i < 6; i++) {
    const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
    const compName = `${prefix} ${suffix}`;

    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const contact = `${fn} ${ln}`;

    const domain = compName.toLowerCase().replace(/\s+/g, '') + '.com';
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`;

    const seoScore = Math.floor(Math.random() * 45) + 38; // 38 - 83
    const leadScore = Math.floor(Math.random() * 30) + 70; // 70 - 100

    results.push({
      id: `dyn-lead-${Date.now()}-${i}`,
      companyName: compName,
      contactName: contact,
      role: 'Decision Maker / Executive',
      email: email,
      phone: `+1 (555) ${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 8990 + 1000)}`,
      website: `https://${domain}`,
      niche: (niche as Lead['niche']) || 'Local Services',
      location: location || 'Austin, TX',
      techStack: ['WordPress', 'Google Analytics', 'PHP', 'Tailwind'],
      estimatedRevenue: `$${(Math.random() * 4 + 0.5).toFixed(1)}M/yr`,
      initialSeoScore: seoScore,
      mobileResponsive: Math.random() > 0.4,
      status: 'new',
      leadScore: leadScore,
    });
  }

  return results;
}
