import React, { useState } from 'react';
import { runWebsiteAudit, type WebsiteAuditReport } from '../services/websiteAuditor';
import type { Lead } from '../services/leadScraper';
import { Sparkles, Download, Gauge, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AuditStudioProps {
  selectedLead?: Lead;
  onGenerateOutreachWithAudit: (lead?: Lead, audit?: WebsiteAuditReport) => void;
  onAddToCRM: (lead?: Lead, audit?: WebsiteAuditReport) => void;
}

export const AuditStudio: React.FC<AuditStudioProps> = ({
  selectedLead,
  onGenerateOutreachWithAudit,
  onAddToCRM,
}) => {
  const [targetUrl, setTargetUrl] = useState<string>(selectedLead ? selectedLead.website : 'https://apexdentalcare.com');
  const [auditReport, setAuditReport] = useState<WebsiteAuditReport>(() =>
    runWebsiteAudit(selectedLead ? selectedLead.website : 'https://apexdentalcare.com', selectedLead?.companyName)
  );
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    cartoonAudio.playSuccess();
    setIsAuditing(true);

    setTimeout(() => {
      const report = runWebsiteAudit(targetUrl, selectedLead?.companyName);
      setAuditReport(report);
      setIsAuditing(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleDownloadReport = () => {
    cartoonAudio.playSuccess();
    const content = `AI WEBSITE AUDIT REPORT FOR ${auditReport.companyName.toUpperCase()}\nURL: ${auditReport.targetUrl}\nOverall Score: ${auditReport.overallScore}/100\nLoad Time: ${auditReport.loadTimeSeconds}s\nEst Monthly Loss: ${auditReport.estMonthlyRevenueLoss}\n\nSUMMARY:\n${auditReport.aiExecutiveSummary}\n\nCRITICAL ISSUES:\n` +
      auditReport.issues.map(i => `- [${i.severity}] ${i.title}: ${i.recommendation}`).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${auditReport.companyName}_AI_Audit_Report.txt`;
    link.click();
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-emerald-100 via-sky-100 to-amber-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-emerald-400 text-slate-900 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-800" /> Module 2: AI Website Auditor
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">Lighthouse • SEO • Security • CRO</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Website Audit Studio 🔍
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Run automated 5-dimension audits on prospect websites. Calculate revenue loss and generate 1-click reports!
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="cartoon-button-primary px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Audit Report PDF/TXT</span>
        </button>
      </div>

      {/* URL Scanner Input Form */}
      <form onSubmit={handleRunAudit} className="cartoon-card p-4 bg-white flex items-center gap-3">
        <Globe className="w-5 h-5 text-emerald-600 shrink-0 ml-1" />
        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="Enter target website URL (e.g. https://apexdentalcare.com)..."
          className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={isAuditing}
          className="cartoon-button-secondary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 shrink-0"
        >
          <Gauge className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Auditing Site...' : 'Run AI Audit Scan'}</span>
        </button>
      </form>

      {/* Main Scorecard Header */}
      <div className="cartoon-card bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">AUDIT SCORECARD FOR:</span>
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
              {auditReport.companyName} <span className="text-xs font-mono text-slate-400">({auditReport.targetUrl})</span>
            </h3>
          </div>

          {/* Overall Score Dial */}
          <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-2xl border-2 border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center font-heading text-2xl font-extrabold text-slate-900 shadow-[3px_3px_0px_#0f172a]">
              {auditReport.overallScore}
            </div>
            <div>
              <div className="font-heading text-xs font-extrabold uppercase text-slate-300">OVERALL AUDIT SCORE</div>
              <div className="text-[11px] font-mono text-emerald-400">Est. Revenue Leak: {auditReport.estMonthlyRevenueLoss}</div>
            </div>
          </div>
        </div>

        {/* 5-Dimension Score Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-5">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">PERFORMANCE</span>
            <span className="font-heading text-xl font-extrabold text-amber-400">{auditReport.performanceScore}/100</span>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${auditReport.performanceScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">SEO HEALTH</span>
            <span className="font-heading text-xl font-extrabold text-emerald-400">{auditReport.seoScore}/100</span>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${auditReport.seoScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">MOBILE UX</span>
            <span className="font-heading text-xl font-extrabold text-sky-400">{auditReport.mobileScore}/100</span>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-sky-400 h-full" style={{ width: `${auditReport.mobileScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">SECURITY</span>
            <span className="font-heading text-xl font-extrabold text-purple-400">{auditReport.securityScore}/100</span>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full" style={{ width: `${auditReport.securityScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">CRO / CTA</span>
            <span className="font-heading text-xl font-extrabold text-pink-400">{auditReport.croScore}/100</span>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-pink-400 h-full" style={{ width: `${auditReport.croScore}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Critical Issues Breakdown */}
      <div className="cartoon-card p-6 bg-white">
        <div className="flex justify-between items-center pb-3 mb-4 border-b-2 border-slate-900 font-heading">
          <h3 className="text-lg font-extrabold text-slate-900 uppercase">
            Critical Bottlenecks & Fix Recommendations ({auditReport.issues.length} Issues Found)
          </h3>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-slate-900">
            Mobile Load Time: {auditReport.loadTimeSeconds}s
          </span>
        </div>

        <div className="space-y-3">
          {auditReport.issues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_#0f172a]"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white uppercase ${
                    issue.severity === 'Critical' ? 'bg-rose-600' : issue.severity === 'Warning' ? 'bg-amber-500' : 'bg-slate-700'
                  }`}>
                    {issue.severity}
                  </span>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900">
                    {issue.title}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">Impact: {issue.impactScore}/10</span>
              </div>

              <p className="text-xs text-slate-700 font-medium mb-2">
                {issue.description}
              </p>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-slate-900 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fix Recommendation: {issue.recommendation}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-6 pt-4 border-t-2 border-slate-900 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={() => {
              cartoonAudio.playPop();
              onAddToCRM(selectedLead, auditReport);
            }}
            className="px-4 py-2 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-200"
          >
            + Add to Sales CRM Pipeline
          </button>

          <button
            onClick={() => {
              cartoonAudio.playPop();
              onGenerateOutreachWithAudit(selectedLead, auditReport);
            }}
            className="cartoon-button-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2"
          >
            <span>Generate Cold Email with Audit Insights ✉️</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
