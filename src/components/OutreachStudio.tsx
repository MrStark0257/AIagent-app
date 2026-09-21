import React, { useState } from 'react';
import type { Lead } from '../services/leadScraper';
import type { WebsiteAuditReport } from '../services/websiteAuditor';
import { generatePersonalizedOutreach, generateLiveOutreachWithGemini, type GeneratedOutreach } from '../services/outreachGenerator';
import { getRotationStats } from '../services/geminiService';
import { Mail, Sparkles, Copy, Check, Send, PhoneCall, Video, Share2, RefreshCw, Key, UserCheck } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
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

  const effectiveAudit: WebsiteAuditReport | undefined = selectedAudit || (() => {
    try {
      const saved = localStorage.getItem('ai_agency_latest_audit');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return undefined;
  })();

  const [angle, setAngle] = useState<'audit-focused' | 'roi-focused' | 'competitor-focused'>('audit-focused');
  const [activeChannel, setActiveChannel] = useState<'email' | 'linkedin' | 'phone' | 'video'>('email');
  const [outreachCopy, setOutreachCopy] = useState<GeneratedOutreach>(() =>
    generatePersonalizedOutreach(defaultLead, effectiveAudit, 'audit-focused')
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGeneratingGemini, setIsGeneratingGemini] = useState<boolean>(false);
  const [rotStats, setRotStats] = useState(getRotationStats());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [customKeyInput, setCustomKeyInput] = useState<string>(() => {
    return localStorage.getItem('ai_deepseek_api_key') || localStorage.getItem('ai_gemini_api_key') || '';
  });

  // Mailing Agent Operator (Pam)
  const outreachAgent = CHARACTERS.find(c => c.id === 'pam' || c.title.includes('Mailing')) || CHARACTERS[1];

  const [agentLiveLog, setAgentLiveLog] = useState<string[]>([
    `📧 [Mailing Agent ${outreachAgent.name}] Ready with 3 high-converting proposal angles for ${defaultLead.companyName}.`,
    `✍️ [Mailing Agent ${outreachAgent.name}] Linked audit revenue leak data into personalized email sequences.`
  ]);

  const streamOutreachCopy = (res: GeneratedOutreach) => {
    let charIndex = 0;
    const fullBody = res.emailBody;
    const fullSubject = res.emailSubject;

    setOutreachCopy({
      ...res,
      emailBody: '',
      emailSubject: '',
    });

    const interval = setInterval(() => {
      charIndex += 12;
      setOutreachCopy(prev => ({
        ...prev,
        emailSubject: fullSubject,
        emailBody: fullBody.slice(0, charIndex),
      }));

      if (charIndex >= fullBody.length) {
        clearInterval(interval);
        setOutreachCopy(prev => ({
          ...prev,
          emailBody: fullBody,
        }));
      }
    }, 15);
  };

  const handleGenerateGeminiCopy = async (selectedAngle = angle) => {
    cartoonAudio.playPop(700);
    setIsGeneratingGemini(true);
    try {
      const res = await generateLiveOutreachWithGemini(defaultLead, effectiveAudit, selectedAngle, customPrompt);
      streamOutreachCopy(res);
      setRotStats(getRotationStats());
      setAgentLiveLog(prev => [
        `✍️ [Mailing Agent ${outreachAgent.name}] Generated live customized copy for "${defaultLead.companyName}" (${selectedAngle})!`,
        ...prev.slice(0, 4)
      ]);
      cartoonAudio.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
      const fallback = generatePersonalizedOutreach(defaultLead, effectiveAudit, selectedAngle);
      setOutreachCopy(fallback);
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  const handleAngleChange = (newAngle: 'audit-focused' | 'roi-focused' | 'competitor-focused') => {
    cartoonAudio.playPop();
    setAngle(newAngle);
    setOutreachCopy(generatePersonalizedOutreach(defaultLead, effectiveAudit, newAngle));
  };

  const handleSaveCustomKey = () => {
    const trimmed = customKeyInput.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('sk-')) {
      localStorage.setItem('ai_deepseek_api_key', trimmed);
    } else {
      localStorage.setItem('ai_gemini_api_key', trimmed);
    }
    setRotStats(getRotationStats());
    setShowKeyModal(false);
    cartoonAudio.playSuccess();
    setAgentLiveLog(prev => [
      `🔑 [Mailing Agent ${outreachAgent.name}] Loaded custom live API key! Ready for AI generation.`,
      ...prev.slice(0, 4)
    ]);
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
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner - Powered by Mailing Agent Pam */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-sky-100 via-pink-100 to-purple-100 flex flex-wrap items-center justify-between gap-4 border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="cartoon-badge px-3 py-1 text-xs bg-sky-400 text-slate-900 rounded-full flex items-center gap-1.5 font-extrabold border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
              <Sparkles className="w-3.5 h-3.5 text-sky-950" /> Module 3: AI Outreach & Copywriter
            </span>

            {/* Mailing Agent Identity Badge */}
            <span className="px-3 py-1 text-xs bg-white text-slate-900 font-extrabold rounded-full border-2 border-slate-900 flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#0f172a]">
              <UserCheck className="w-3.5 h-3.5 text-pink-600" />
              <span>OPERATED BY: {outreachAgent.name} ({outreachAgent.title})</span>
            </span>

            <span className="text-xs font-mono font-bold bg-slate-900 text-amber-300 px-2.5 py-1 rounded-full">
              Cold Email • Proposals • Multi-Channel
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Personalized Outreach Studio ✉️
          </h2>

          {/* Pam's Directive & Work Spec */}
          <div className="p-2.5 bg-white/90 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs font-medium text-slate-800 flex items-center gap-2">
            <span className="text-lg">📧</span>
            <div>
              <span className="font-extrabold text-slate-900">{outreachAgent.name}'s Directive:</span> "{outreachAgent.quote}"
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => handleGenerateGeminiCopy()}
            disabled={isGeneratingGemini}
            className="px-4 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-extrabold text-xs border-3 border-slate-900 rounded-xl shadow-[3px_3px_0px_#0f172a] flex items-center justify-center gap-2 transition-transform active:translate-y-0.5"
          >
            <RefreshCw className={`w-4 h-4 text-slate-900 ${isGeneratingGemini ? 'animate-spin' : ''}`} />
            <span>{isGeneratingGemini ? `${outreachAgent.name} is Generating...` : `⚡ Generate Live Copy with ${outreachAgent.name}`}</span>
          </button>

          <button
            onClick={handleSendToSequencer}
            className="cartoon-button-primary px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Launch Drip Campaign →</span>
          </button>
        </div>
      </div>

      {/* Pam's Live Agent Terminal Ticker */}
      <div className="cartoon-card p-3 bg-slate-900 text-white border-2 border-slate-900 rounded-xl font-mono text-xs flex items-center gap-3">
        <span className="text-xs font-bold px-2 py-0.5 bg-pink-400 text-slate-900 rounded border border-slate-900 shrink-0">
          📧 {outreachAgent.name.toUpperCase()} LIVE LOG
        </span>
        <div className="truncate text-emerald-400 font-bold">
          &gt; {agentLiveLog[0]}
        </div>
      </div>

      {/* Gemini / DeepSeek Key Active Indicator Bar */}
      <div className="cartoon-card p-3 bg-amber-100 border-2 border-slate-900 space-y-2 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <Key className="w-4 h-4 text-amber-700 animate-bounce" />
            <span>AI Engine ({rotStats.provider}):</span>
            <span className="px-2 py-0.5 bg-amber-300 border border-slate-900 rounded text-slate-900 font-extrabold">
              Key #{rotStats.currentKeyIndex} of {rotStats.totalKeys} ({rotStats.activeKeyMasked})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyModal(!showKeyModal)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-900 font-bold border border-slate-900 rounded-lg shadow-[1px_1px_0px_#0f172a] text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3 h-3 text-amber-600" />
              <span>{showKeyModal ? 'Close Key Settings' : '⚙️ Configure AI Key'}</span>
            </button>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-700">
              <span>🔄 Rotations: <strong>{rotStats.totalRotations}</strong></span>
              <span className="text-emerald-700">✓ Success: <strong>{rotStats.successfulCalls}</strong></span>
              {rotStats.failedCalls > 0 && <span className="text-rose-600">⚠ Failover: <strong>{rotStats.failedCalls}</strong></span>}
            </div>
          </div>
        </div>

        {/* Inline Custom Key Form */}
        {showKeyModal && (
          <div className="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2 mt-2">
            <div className="flex justify-between items-center text-slate-800 font-bold">
              <span>Enter DeepSeek or Gemini API Key:</span>
              <span className="text-[10px] text-slate-500 font-normal">Saved in local browser storage (100% private)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="sk-... (DeepSeek) or AIzaSy... (Gemini)"
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-900 rounded-lg text-slate-900"
              />
              <button
                onClick={handleSaveCustomKey}
                className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-extrabold rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a]"
              >
                Save & Activate
              </button>
              {customKeyInput && (
                <button
                  onClick={() => {
                    localStorage.removeItem('ai_deepseek_api_key');
                    localStorage.removeItem('ai_gemini_api_key');
                    setCustomKeyInput('');
                    setRotStats(getRotationStats());
                  }}
                  className="px-2 py-1.5 bg-rose-200 hover:bg-rose-300 text-rose-900 font-bold rounded-lg border border-slate-900 text-[10px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
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

        {effectiveAudit && (
          <div className="px-3 py-1 bg-emerald-100 border border-slate-900 rounded-lg text-emerald-900 font-bold">
            ✓ Live Audit Score: {effectiveAudit.overallScore}/100 ({effectiveAudit.loadTimeSeconds}s load time)
          </div>
        )}
      </div>

      {/* Custom AI Prompt Instruction Input */}
      <div className="cartoon-card p-4 bg-purple-50 border-2 border-slate-900">
        <label className="block text-xs font-bold font-heading uppercase text-purple-900 mb-1 flex items-center justify-between">
          <span>✨ Custom AI Prompt Instruction (Test Live Gemini Intelligence):</span>
          <span className="text-[10px] font-mono text-purple-700 font-normal">Type anything unique below to prove live AI generation!</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Write it like a pirate, mention 20% discount, or congratulate on winning dentist of the year..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full text-xs font-bold px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={() => handleGenerateGeminiCopy()}
            disabled={isGeneratingGemini}
            className="px-4 py-2 bg-purple-400 hover:bg-purple-300 text-slate-900 font-extrabold text-xs border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a] shrink-0 active:translate-y-0.5"
          >
            {isGeneratingGemini ? 'Generating...' : '⚡ Generate Custom AI Copy'}
          </button>
        </div>
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
        <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-slate-900 overflow-x-auto py-1">
          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveChannel('email');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all shrink-0 leading-none cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeChannel === 'email'
                ? 'bg-amber-400 text-slate-900 ring-1 ring-slate-900'
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all shrink-0 leading-none cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeChannel === 'linkedin'
                ? 'bg-sky-400 text-slate-900 ring-1 ring-slate-900'
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all shrink-0 leading-none cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeChannel === 'phone'
                ? 'bg-purple-400 text-slate-900 ring-1 ring-slate-900'
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all shrink-0 leading-none cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeChannel === 'video'
                ? 'bg-pink-400 text-slate-900 ring-1 ring-slate-900'
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
