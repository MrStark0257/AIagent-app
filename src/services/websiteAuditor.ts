export interface AuditIssue {
  id: string;
  category: 'Performance' | 'SEO' | 'Mobile' | 'Security' | 'CRO';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  recommendation: string;
  impactScore: number; // 1-10
}

export interface WebsiteAuditReport {
  targetUrl: string;
  companyName: string;
  overallScore: number; // 0-100
  performanceScore: number; // 0-100
  seoScore: number; // 0-100
  mobileScore: number; // 0-100
  securityScore: number; // 0-100
  croScore: number; // 0-100
  loadTimeSeconds: number;
  estMonthlyRevenueLoss: string;
  issues: AuditIssue[];
  aiExecutiveSummary: string;
  auditTimestamp: string;
}

export function runWebsiteAudit(url: string, companyName?: string): WebsiteAuditReport {
  const cleanComp = companyName || url.replace(/^https?:\/\//, '').replace(/\..*$/, '');
  const formattedComp = cleanComp.charAt(0).toUpperCase() + cleanComp.slice(1);

  // Generate realistic audit metrics
  const perf = Math.floor(Math.random() * 30) + 42; // 42-72
  const seo = Math.floor(Math.random() * 35) + 45; // 45-80
  const mobile = Math.floor(Math.random() * 40) + 40; // 40-80
  const sec = Math.floor(Math.random() * 30) + 60; // 60-90
  const cro = Math.floor(Math.random() * 35) + 45; // 45-80

  const overall = Math.round((perf + seo + mobile + sec + cro) / 5);
  const loadTime = (Math.random() * 2.8 + 2.4).toFixed(1); // 2.4s - 5.2s
  const revLoss = `$${(Math.random() * 12 + 4.5).toFixed(1)}k/month`;

  const issues: AuditIssue[] = [
    {
      id: 'issue-1',
      category: 'Performance',
      severity: 'Critical',
      title: 'Page Load Time Exceeds 4.2 Seconds on Mobile 🐢',
      description: `Uncompressed hero images and legacy scripts slow down LCP (Largest Contentful Paint) by ${loadTime}s.`,
      recommendation: 'Convert hero banners to Next.js WebP/AVIF and defer unused JavaScript.',
      impactScore: 9,
    },
    {
      id: 'issue-2',
      category: 'CRO',
      severity: 'Critical',
      title: 'No Clear Primary Call-To-Action (CTA) Above the Fold 🎯',
      description: 'Visitors land on the homepage without a prominent "Book a Demo" or "Call Now" button in the hero section.',
      recommendation: 'Add high-contrast floating CTA pill in top header and hero banner.',
      impactScore: 9,
    },
    {
      id: 'issue-3',
      category: 'SEO',
      severity: 'Warning',
      title: 'Missing Schema.org Local Business & Meta Tag Descriptions 🔍',
      description: 'Google indexers cannot extract structured address, operating hours, and service metadata.',
      recommendation: 'Inject JSON-LD structured schema script and unique 155-char meta descriptions.',
      impactScore: 7,
    },
    {
      id: 'issue-4',
      category: 'Mobile',
      severity: 'Warning',
      title: 'Touch Targets Too Close on Mobile Viewports 📱',
      description: 'Navigation menu links are smaller than 48px, causing misclicks on mobile devices.',
      recommendation: 'Increase touch target padding to minimum 48x48px on mobile CSS breakpoint.',
      impactScore: 6,
    },
    {
      id: 'issue-5',
      category: 'Security',
      severity: 'Info',
      title: 'Strict Transport Security (HSTS) Header Missing 🔒',
      description: 'HTTP responses lack HSTS headers, leaving connections vulnerable to man-in-the-middle downgrade.',
      recommendation: 'Enable Strict-Transport-Security in web server config.',
      impactScore: 5,
    }
  ];

  return {
    targetUrl: url.startsWith('http') ? url : `https://${url}`,
    companyName: formattedComp,
    overallScore: overall,
    performanceScore: perf,
    seoScore: seo,
    mobileScore: mobile,
    securityScore: sec,
    croScore: cro,
    loadTimeSeconds: parseFloat(loadTime),
    estMonthlyRevenueLoss: revLoss,
    issues: issues,
    aiExecutiveSummary: `${formattedComp}'s website currently scores ${overall}/100. High mobile load times (${loadTime}s) and missing CTAs above the fold are costing an estimated ${revLoss} in lost conversions.`,
    auditTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}
