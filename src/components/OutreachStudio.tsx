import React, { useState } from 'react';
import type { Lead } from '../services/leadScraper';
import type { WebsiteAuditReport } from '../services/websiteAuditor';
import { generatePersonalizedOutreach, type GeneratedOutreach } from '../services/outreachGenerator';
import { Mail, Sparkles, Copy, Check, Send, PhoneCall, Video, Share2 } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface OutreachStudioProps {
  selectedLead?: Lead;
  selectedAudit?: WebsiteAuditReport;
  onSendToSequencer: (lead: Lead, outreach: GeneratedOutreach) => void;
}

export const OutreachStudio: React.FC<OutreachStudioProps> = ({
  selectedLead,
  selectedAudit,
  onSendToSequencer,
}) => {
  const defaultLead: Lead = selectedLead || {
    id: 'demo-lead',
    companyName: 'Apex Dental Care',
    contactName: 'Dr. Marcus Vance',
    role: 'Owner & Chief Dentist',
    email: 'marcus@apexdental.com',
    phone: '+1 (555) 234-8901',
    website: 'https://apexdentalcare.com',
    niche: 'Dental & Healthcare',
    location: 'Austin, TX',
    techStack: ['WordPress', 'Google Ads'],
    estimatedRevenue: '$1.2M/yr',
    initialSeoScore: 54,
    mobileResponsive: false,
    status: 'audited',
    leadScore: 88,
  };

  const [angle, setAngle] = useState<'audit-focused' | 'roi-focused' | 'competitor-focused'>('audit-focused');
  const [activeChannel, setActiveChannel] = useState<'email' | 'linkedin' | 'phone' | 'video'>('email');
  const [outreachCopy, setOutreachCopy] = useState<GeneratedOutreach>(() =>
    generatePersonalizedOutreach(defaultLead, selectedAudit, 'audit-focused')
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleAngleChange = (newAngle: 'audit-focused' | 'roi-focused' | 'competitor-focused') => {
    cartoonAudio.playPop();
    setAngle(newAngle);
    setOutreachCopy(generatePersonalizedOutreach(defaultLead, selectedAudit, newAngle));
  };

  const handleCopyText = (text: string) => {
    cartoonAudio.playPop(700);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToSequencer = () => {
    cartoonAudio.playSuccess();
    onSendToSequencer(defaultLead, outreachCopy);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-sky-400 text-slate-900 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-800" /> Module 3: AI Outreach & Copywriter
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">Audit-Driven Cold Email & Social Pitch</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Personalized Outreach Studio ✉️
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Generates high-converting cold emails, LinkedIn messages & sales call scripts customized with audit findings.
          </p>
        </div>

        <button
          onClick={handleSendToSequencer}
          className="cartoon-button-primary px-5 py-3 text-xs sm:text-sm flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Launch Drip Campaign in Sequencer →</span>
        </button>
      </div>

      {/* Target Lead Summary Header */}
      <div className="cartoon-card p-4 bg-white flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center font-bold text-sm">
            🎯
          </div>
          <div>
            <div className="font-heading text-sm font-extrabold text-slate-900">
              TARGET PROSPECT: {defaultLead.companyName} ({defaultLead.contactName})
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              {defaultLead.email} • {defaultLead.location} • {defaultLead.niche}
            </p>
          </div>
        </div>

        {selectedAudit && (
          <div className="px-3 py-1 bg-emerald-100 border border-slate-900 rounded-lg text-emerald-900 font-bold">
            ✓ Audit Score: {selectedAudit.overallScore}/100 ({selectedAudit.loadTimeSeconds}s load time)
          </div>
        )}
      </div>

      {/* Angle Selector Tabs */}
      <div className="cartoon-card p-4 bg-white">
        <label className="block text-xs font-bold font-heading uppercase text-slate-700 mb-2">
          Select Outreach Strategy & Angle:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            onClick={() => handleAngleChange('audit-focused')}
            className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
              angle === 'audit-focused'
                ? 'bg-amber-300 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5 ring-2 ring-slate-900'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="font-heading font-extrabold text-xs text-slate-900 uppercase mb-0.5">
              🎯 1. Audit & Speed Focused
            </div>
            <p className="text-[11px] text-slate-700 font-medium">
              Highlights exact mobile load speed bottlenecks & visual audit fixes.
            </p>
          </button>

          <button
            onClick={() => handleAngleChange('roi-focused')}
            className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
              angle === 'roi-focused'
                ? 'bg-emerald-300 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5 ring-2 ring-slate-900'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="font-heading font-extrabold text-xs text-slate-900 uppercase mb-0.5">
              💰 2. Revenue & ROI Focused
            </div>
            <p className="text-[11px] text-slate-700 font-medium">
              Focuses on monthly dollar revenue loss & conversion recovery.
            </p>
          </button>

          <button
            onClick={() => handleAngleChange('competitor-focused')}
            className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
              angle === 'competitor-focused'
                ? 'bg-sky-300 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5 ring-2 ring-slate-900'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="font-heading font-extrabold text-xs text-slate-900 uppercase mb-0.5">
              📊 3. Competitor Benchmark
            </div>
            <p className="text-[11px] text-slate-700 font-medium">
              Compares target business against top competitors in their city.
            </p>
          </button>

        </div>
      </div>

      {/* Multi-Channel Outreach Display */}
      <div className="cartoon-card bg-white p-5">
        
        {/* Channel Switcher */}
        <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-slate-900 overflow-x-auto">
          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveChannel('email');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border-2 border-slate-900 transition-all ${
              activeChannel === 'email'
                ? 'bg-amber-400 text-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Cold Email Copy
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveChannel('linkedin');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border-2 border-slate-900 transition-all ${
              activeChannel === 'linkedin'
                ? 'bg-sky-400 text-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" /> LinkedIn InMail
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveChannel('phone');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border-2 border-slate-900 transition-all ${
              activeChannel === 'phone'
                ? 'bg-purple-400 text-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" /> Cold Call Script
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveChannel('video');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border-2 border-slate-900 transition-all ${
              activeChannel === 'video'
                ? 'bg-pink-400 text-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> 45s Video Script
          </button>
        </div>

        {/* Copy Box Content */}
        {activeChannel === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 font-mono mb-1">
                SUBJECT LINE:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={outreachCopy.emailSubject}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl"
                />
                <button
                  onClick={() => handleCopyText(outreachCopy.emailSubject)}
                  className="px-3 py-1 bg-amber-300 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 hover:bg-amber-400"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 font-mono mb-1">
                EMAIL BODY:
              </label>
              <textarea
                rows={9}
                readOnly
                value={outreachCopy.emailBody}
                className="w-full p-3 text-xs font-medium text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleCopyText(outreachCopy.emailBody)}
                className="cartoon-button-secondary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-slate-900" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Body'}</span>
              </button>

              <button
                onClick={handleSendToSequencer}
                className="cartoon-button-primary px-5 py-2 text-xs flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send to Campaign Sequencer</span>
              </button>
            </div>
          </div>
        )}

        {activeChannel === 'linkedin' && (
          <div className="space-y-3">
            <textarea
              rows={6}
              readOnly
              value={outreachCopy.linkedInInMail}
              className="w-full p-3 text-xs font-medium text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleCopyText(outreachCopy.linkedInInMail)}
                className="cartoon-button-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Copy InMail Message
              </button>
            </div>
          </div>
        )}

        {activeChannel === 'phone' && (
          <div className="space-y-3">
            <textarea
              rows={6}
              readOnly
              value={outreachCopy.coldCallScript}
              className="w-full p-3 text-xs font-medium text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleCopyText(outreachCopy.coldCallScript)}
                className="cartoon-button-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Copy Cold Call Pitch Script
              </button>
            </div>
          </div>
        )}

        {activeChannel === 'video' && (
          <div className="space-y-3">
            <textarea
              rows={6}
              readOnly
              value={outreachCopy.videoPitchScript}
              className="w-full p-3 text-xs font-medium text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleCopyText(outreachCopy.videoPitchScript)}
                className="cartoon-button-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Copy Video Outline Script
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
