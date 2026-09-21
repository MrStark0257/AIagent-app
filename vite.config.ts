import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Real-Time Website Audit Dev Middleware
function realtimeAuditPlugin(): Plugin {
  return {
    name: 'realtime-website-audit-plugin',
    configureServer(server) {
      server.middlewares.use('/api/audit', async (req, res) => {
        try {
          const fullUrl = new URL(req.url || '', `http://${req.headers.host}`);
          const targetUrl = fullUrl.searchParams.get('url');

          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing ?url= parameter' }));
            return;
          }

          let normalizedUrl = targetUrl.trim();
          if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = `https://${normalizedUrl}`;
          }

          const startTime = Date.now();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 9000);

          const response = await fetch(normalizedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 AIAgentAuditor/2.0',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: controller.signal,
            redirect: 'follow',
          });
          clearTimeout(timeoutId);

          const loadTimeMs = Date.now() - startTime;
          const html = await response.text();
          const loadTimeSec = +(loadTimeMs / 1000).toFixed(2);

          // 1. Mobile Check
          const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
          
          // 2. SEO Checks
          const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const pageTitle = titleMatch ? titleMatch[1].trim() : '';
          const hasMetaDesc = /<meta\s+name=["']description["']/i.test(html);
          const hasH1 = /<h1[^>]*>/i.test(html);
          const hasCanonical = /<link\s+rel=["']canonical["']/i.test(html);

          // 3. Security Checks
          const isHttps = normalizedUrl.startsWith('https://');
          const hasHsts = !!response.headers.get('strict-transport-security');
          const hasCsp = !!response.headers.get('content-security-policy');
          const hasXFrame = !!response.headers.get('x-frame-options');

          // 4. Performance Checks
          const scriptMatches = html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi) || [];
          const imgMatches = html.match(/<img\b[^>]*>/gi) || [];
          const unoptimizedImgs = (html.match(/\.(png|jpg|jpeg)["']/gi) || []).length;
          
          // 5. CRO (Conversion Rate Optimization)
          const hasPhoneLink = /href=["']tel:/i.test(html);
          const hasEmailLink = /href=["']mailto:/i.test(html);
          const hasButton = /<(button|a)[^>]*(book|demo|contact|schedule|call|buy|pricing|order|quote)/i.test(html);

          // Calculate Dynamic Scores
          let perfScore = Math.max(25, Math.min(98, Math.round(100 - (loadTimeSec * 16) - (scriptMatches.length * 1.2) - (unoptimizedImgs * 0.5))));
          let seoScore = 40;
          if (hasTitle) seoScore += 20;
          if (hasMetaDesc) seoScore += 20;
          if (hasH1) seoScore += 10;
          if (hasCanonical) seoScore += 10;

          let mobileScore = hasViewport ? 88 : 35;
          if (loadTimeSec < 2.5) mobileScore += 8;

          let securityScore = isHttps ? 75 : 20;
          if (hasHsts) securityScore += 10;
          if (hasCsp || hasXFrame) securityScore += 15;

          let croScore = 45;
          if (hasButton) croScore += 25;
          if (hasPhoneLink) croScore += 15;
          if (hasEmailLink) croScore += 15;

          const overall = Math.round((perfScore + seoScore + mobileScore + securityScore + croScore) / 5);

          // Build Real Detected Issues
          const issues = [];
          if (loadTimeSec > 2.0) {
            issues.push({
              id: 'issue-perf-load',
              category: 'Performance',
              severity: loadTimeSec > 3.5 ? 'Critical' : 'Warning',
              title: `Live Response Latency: ${loadTimeSec}s (Target: <1.5s)`,
              description: `Actual live network download took ${loadTimeMs}ms. Detected ${scriptMatches.length} script tags and ${imgMatches.length} total images.`,
              recommendation: 'Enable asset compression (gzip/brotli), convert legacy JPEG/PNGs to modern WebP/AVIF, and defer secondary JS bundles.',
              impactScore: 9,
            });
          }

          if (!hasMetaDesc) {
            issues.push({
              id: 'issue-seo-desc',
              category: 'SEO',
              severity: 'Warning',
              title: 'Missing Meta Description Tag in <head>',
              description: 'Google search crawler will generate arbitrary text snippets instead of curated agency copywriting.',
              recommendation: 'Add high-converting 155-character <meta name="description"> tag highlighting the core business value.',
              impactScore: 8,
            });
          }

          if (!hasViewport) {
            issues.push({
              id: 'issue-mobile-viewport',
              category: 'Mobile',
              severity: 'Critical',
              title: 'Missing Viewport Meta Tag',
              description: 'Mobile smartphones will render the website zoomed out in desktop view, hurting bounce rates.',
              recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> immediately.',
              impactScore: 10,
            });
          }

          if (!isHttps || !hasHsts) {
            issues.push({
              id: 'issue-sec-hsts',
              category: 'Security',
              severity: isHttps ? 'Info' : 'Critical',
              title: isHttps ? 'HSTS (Strict-Transport-Security) Header Missing' : 'Website Not Running On Secure HTTPS',
              description: isHttps ? 'Browser connections are HTTPS, but HSTS header is not enforced on initial handshake.' : 'Browsers flag this business with "Not Secure" warning in address bar.',
              recommendation: isHttps ? 'Enable HSTS header with max-age=31536000.' : 'Provision SSL certificate immediately.',
              impactScore: isHttps ? 6 : 10,
            });
          }

          if (!hasButton) {
            issues.push({
              id: 'issue-cro-cta',
              category: 'CRO',
              severity: 'Critical',
              title: 'No Prominent Call-to-Action (CTA) Found in Hero',
              description: 'Could not detect an obvious "Book Appointment", "Get Quote", or "Call Now" button above the fold.',
              recommendation: 'Place a high-contrast action button in top navigation and hero section.',
              impactScore: 9,
            });
          }

          const parsedHostname = new URL(normalizedUrl).hostname;
          const hostParts = parsedHostname.replace(/^www\./, '').split('.');
          const companyName = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);

          const estRevenueLoss = `$${(Math.max(1, (loadTimeSec - 1.2) * 3.4)).toFixed(1)}k/month`;

          const result = {
            targetUrl: normalizedUrl,
            companyName: pageTitle || companyName,
            overallScore: overall,
            performanceScore: perfScore,
            seoScore: seoScore,
            mobileScore: mobileScore,
            securityScore: securityScore,
            croScore: croScore,
            loadTimeSeconds: loadTimeSec,
            estMonthlyRevenueLoss: estRevenueLoss,
            issues: issues,
            aiExecutiveSummary: `Live real-time audit of ${normalizedUrl} verified ${response.status} HTTP status in ${loadTimeSec}s. Overall technical health is ${overall}/100 with ${issues.length} detected optimization bottlenecks.`,
            auditTimestamp: new Date().toLocaleTimeString(),
            isLiveRealTime: true,
          };

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: err?.message || 'Failed to perform live audit on target URL',
            isLiveRealTime: false,
          }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), realtimeAuditPlugin()],
  envPrefix: ['VITE_', 'GEMINI_', 'DEEPSEEK_'],
  server: {
    port: 8080,
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      },
    },
  },
})
