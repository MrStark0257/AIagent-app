import React, { useState } from 'react';
import { runLiveWebsiteAudit, runWebsiteAudit, type WebsiteAuditReport } from '../services/websiteAuditor';
import type { Lead } from '../services/leadScraper';
import { Sparkles, Download, Gauge, Globe, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
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
  const [auditReport, setAuditReport] = useState<WebsiteAuditReport>(() => {
    try {
      const saved = localStorage.getItem('ai_agency_latest_audit');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return runWebsiteAudit(selectedLead ? selectedLead.website : 'https://apexdentalcare.com', selectedLead?.companyName);
  });
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Research Agent Operator (Dwight)
  const auditAgent = CHARACTERS.find(c => c.id === 'dwight' || c.title.includes('Research')) || CHARACTERS[3];

  const [agentLiveLog, setAgentLiveLog] = useState<string[]>([
    `🔎 [Research Agent ${auditAgent.name}] Loaded live HTTP DOM crawler & 5-dimension technical audit engine.`,
    `📊 [Research Agent ${auditAgent.name}] Ready to audit target URLs for SEO, speed, security & CRO revenue leaks in real-time.`
  ]);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    cartoonAudio.playSuccess();
    setIsAuditing(true);
    setAgentLiveLog(prev => [
      `🔎 [Research Agent ${auditAgent.name}] Initiating live real-time network crawl of "${targetUrl}"...`,
      ...prev.slice(0, 4)
    ]);

    try {
      const report = await runLiveWebsiteAudit(targetUrl, selectedLead?.companyName);
      setAuditReport(report);
      setAgentLiveLog(prev => [
        `✅ [Research Agent ${auditAgent.name}] Real-time audit completed for "${targetUrl}"! Score: ${report.overallScore}/100, Latency: ${report.loadTimeSeconds}s, Est Loss: ${report.estMonthlyRevenueLoss}`,
        ...prev.slice(0, 4)
      ]);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
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
      
      {/* Top Banner - Powered by Research Agent Dwight */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-emerald-100 via-sky-100 to-amber-100 flex flex-wrap items-center justify-between gap-4 border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="cartoon-badge px-3 py-1 text-xs bg-emerald-400 text-slate-900 rounded-full flex items-center gap-1.5 font-extrabold border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-950" /> Module 2: AI Website Auditor
            </span>

            {/* Research Agent Identity Badge */}
            <span className="px-3 py-1 text-xs bg-white text-slate-900 font-extrabold rounded-full border-2 border-slate-900 flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#0f172a]">
              <UserCheck className="w-3.5 h-3.5 text-yellow-600" />
              <span>OPERATED BY: {auditAgent.name} ({auditAgent.title})</span>
            </span>

            <span className="text-xs font-mono font-bold bg-slate-900 text-amber-300 px-2.5 py-1 rounded-full">
              Lighthouse • SEO • Security • CRO
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Website Audit Studio 🔍
          </h2>

          {/* Dwight's Directive & Work Spec */}
          <div className="p-2.5 bg-white/90 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs font-medium text-slate-800 flex items-center gap-2">
            <span className="text-lg">🔎</span>
            <div>
              <span className="font-extrabold text-slate-900">{auditAgent.name}'s Directive:</span> "{auditAgent.quote}"
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="cartoon-button-primary px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Audit Report PDF/TXT</span>
        </button>
      </div>

      {/* Dwight's Live Agent Terminal Ticker */}
      <div className="cartoon-card p-3 bg-slate-900 text-white border-2 border-slate-900 rounded-xl font-mono text-xs flex items-center gap-3">
        <span className="text-xs font-bold px-2 py-0.5 bg-yellow-400 text-slate-900 rounded border border-slate-900 shrink-0">
          🔎 {auditAgent.name.toUpperCase()} LIVE LOG
        </span>
        <div className="truncate text-emerald-400 font-bold">
          &gt; {agentLiveLog[0]}
        </div>
      </div>

      {/* URL Scanner Input Form */}
      <form onSubmit={handleRunAudit} className="cartoon-card p-4 bg-white flex items-center gap-3 border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0f172a]">
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
          <span>{isAuditing ? `${auditAgent.name} is Auditing Site...` : `Run AI Audit Scan (${auditAgent.name})`}</span>
        </button>
      </form>

      {/* Main Scorecard Header */}
      <div className="cartoon-card bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">AUDIT SCORECARD FOR:</span>
              {auditReport.isLiveRealTime ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 font-mono text-[9px] font-black border border-emerald-300 flex items-center gap-1 shadow-[1px_1px_0px_#0f172a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                  <span>🟢 REAL-TIME LIVE AUDIT ({auditReport.loadTimeSeconds}s)</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-mono text-[9px] font-bold">
                  Baseline Profile
                </span>
              )}
            </div>
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
