import type { Lead } from './leadScraper';
import type { WebsiteAuditReport } from './websiteAuditor';

export interface GeneratedOutreach {
  emailSubject: string;
  emailBody: string;
  linkedInInMail: string;
  coldCallScript: string;
  videoPitchScript: string;
  angle: 'audit-focused' | 'roi-focused' | 'competitor-focused';
}

export function generatePersonalizedOutreach(
  lead: Lead,
  auditReport?: WebsiteAuditReport,
  angle: 'audit-focused' | 'roi-focused' | 'competitor-focused' = 'audit-focused'
): GeneratedOutreach {
  const comp = lead.companyName;
  const name = lead.contactName.split(' ')[0]; // First name
  const loadTime = auditReport ? `${auditReport.loadTimeSeconds}s` : '4.2s';
  const revLoss = auditReport ? auditReport.estMonthlyRevenueLoss : '$8.5k/month';
  const score = auditReport ? auditReport.overallScore : lead.initialSeoScore;

  if (angle === 'audit-focused') {
    return {
      angle: 'audit-focused',
      emailSubject: `Quick audit of ${comp}'s site (${score}/100 score)`,
      emailBody: `Hi ${name},

I was looking at ${comp}'s website (${lead.website}) while analyzing top ${lead.niche} companies in ${lead.location}.

We ran a quick AI performance scan and noticed a couple of low-hanging fixes:
1. Mobile page load takes ${loadTime} (losing up to 35% of mobile traffic).
2. Missing primary CTA above the fold in the hero banner.

These 2 issues are costing an estimated ${revLoss} in lost lead inquiries.

I put together a free 2-minute visual audit showing exact fixes. Would you be open to taking a look?

Best,
AI Sales Agent @ AgentHarness`,
      linkedInInMail: `Hi ${name}, quick note regarding ${comp}'s website mobile speed (${loadTime}). We ran an automated audit and found 2 quick optimizations that can boost lead conversions by ~24%. Worth a quick 3-min chat?`,
      coldCallScript: `Hey ${name}, this is [Your Name] calling about ${comp}. I know I caught you out of nowhere, but we ran a performance audit on your website and noticed your mobile site takes ${loadTime} to load, which is hurting your Google ranking in ${lead.location}. If I sent over a 1-page visual fix guide, would you be open to reviewing it?`,
      videoPitchScript: `Hey ${name}! In this 45-second video, I'm sharing my screen with ${comp}'s website. Watch what happens when we simulate mobile loading speeds... (show Lighthouse bottleneck). Here is how we fixed this for similar ${lead.niche} clients to increase bookings by 32%.`,
    };
  } else if (angle === 'roi-focused') {
    return {
      angle: 'roi-focused',
      emailSubject: `Estimated ${revLoss} leak on ${comp}'s site`,
      emailBody: `Hi ${name},

Most ${lead.niche} businesses in ${lead.location} lose 20-30% of high-intent website traffic due to slow mobile load times and friction in their booking forms.

Based on ${comp}'s current traffic and website score (${score}/100), our AI model estimates you're leaving approximately ${revLoss} on the table every month.

We've automated the exact playbook to recover this lost revenue within 14 days.

Do you have 10 minutes this Thursday to walk through the numbers?

Best,
AI Revenue Agent @ AgentHarness`,
      linkedInInMail: `Hey ${name}, loved what ${comp} is doing in ${lead.niche}! Quick question: are you currently optimizing your mobile landing pages? We identified an estimated ${revLoss} revenue opportunity on your site. Happy to share the report.`,
      coldCallScript: `Hi ${name}, I'm calling because our data model flagged ${comp} as a top candidate for a 20%+ increase in online lead conversions in ${lead.location}. We helped a similar business recover ${revLoss} in lost traffic. Got 30 seconds to explain how?`,
      videoPitchScript: `Hi ${name}, I built this custom ROI breakdown specifically for ${comp}. Let's look at your conversion pipeline metrics and how fixing your mobile CTA friction yields immediate revenue.`,
    };
  } else {
    return {
      angle: 'competitor-focused',
      emailSubject: `How ${comp} compares to top ${lead.niche} competitors in ${lead.location}`,
      emailBody: `Hi ${name},

We recently benchmarked top ${lead.niche} websites in ${lead.location} across speed, SEO, and lead conversion rates.

Currently, ${comp}'s site scores ${score}/100, while top competitors are averaging 84/100 (mainly due to faster mobile load times and instant booking widgets).

I compiled a side-by-side competitor audit report showing the 3 key gaps ${comp} can plug this week.

Can I drop the PDF link in your inbox?

Best,
AI Growth Specialist @ AgentHarness`,
      linkedInInMail: `Hi ${name}, we benchmarked ${comp} against top ${lead.niche} players in ${lead.location}. Would you be interested in seeing where your website ranks in mobile speed and SEO score?`,
      coldCallScript: `Hi ${name}, calling from AgentHarness. We just published our 2026 ${lead.niche} Digital Benchmarking Report for ${lead.location}. ${comp} ranked in the top percentile for brand, but has a 2-step gap in mobile loading speed. Mind if I email you the comparison chart?`,
      videoPitchScript: `Hey ${name}, here is a side-by-side benchmark comparing ${comp}'s website against 3 top competitors in ${lead.location}. Notice how competitor X loads in 1.2s while ${comp} takes ${loadTime}...`,
    };
  }
}
