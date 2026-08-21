import React, { useState, useEffect } from 'react';
import { INITIAL_LEADS, type Lead, generateDynamicLeads } from '../services/leadScraper';
import { CHARACTERS } from '../data/characters';
import { Search, Sparkles, Filter, Mail, Phone, ExternalLink, Flame, UserCheck, Play, Pause } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LeadHunterProps {
  onAuditLead: (lead: Lead) => void;
  onGenerateOutreach: (lead: Lead) => void;
  onAddToPipeline: (lead: Lead) => void;
  isAutoHunting?: boolean;
  onToggleAutoHunting?: (val: boolean) => void;
}

export const LeadHunter: React.FC<LeadHunterProps> = ({
  onAuditLead,
  onGenerateOutreach,
  onAddToPipeline,
  isAutoHunting = true,
  onToggleAutoHunting,
}) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [searchLocation] = useState<string>('Austin, TX');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [addedLeadIds, setAddedLeadIds] = useState<{ [key: string]: boolean }>({});

  // Lead / BizDev Agent Operator (Jim)
  const leadAgent = CHARACTERS.find(c => c.id === 'jim' || c.title.includes('BizDev') || c.title.includes('Lead')) || CHARACTERS[2];

  const [agentLiveLog, setAgentLiveLog] = useState<string[]>([
    `💼 [Lead Agent ${leadAgent.name}] Discovered & evaluated ${INITIAL_LEADS.length} verified business leads in Austin, TX.`,
    `🎯 [Lead Agent ${leadAgent.name}] Filtered high-intent prospects with verified emails & budget scores.`
  ]);

  // AUTOMATIC BACKGROUND LEAD DISCOVERY BY LEAD AGENT (JIM)
  useEffect(() => {
    if (!isAutoHunting) return;

    const interval = setInterval(() => {
      const availableNiches = ['E-commerce', 'SaaS', 'Real Estate', 'Dental & Healthcare', 'Local Services', 'Legal & Finance'];
      const targetNiche = selectedNiche === 'All'
        ? availableNiches[Math.floor(Math.random() * availableNiches.length)]
        : selectedNiche;

      const discovered = generateDynamicLeads(targetNiche, searchLocation).slice(0, 1);
      if (discovered.length > 0) {
        const newLead = discovered[0];

        // Safely accumulate lead without removing ANY existing leads!
        setLeads(prev => [newLead, ...prev]);

        setAgentLiveLog(prev => [
          `⚡ [Lead Agent ${leadAgent.name} • AUTO-HUNTER] Auto-discovered verified prospect "${newLead.companyName}" (${newLead.niche})!`,
          ...prev.slice(0, 5)
        ]);
      }
    }, 6500); // Automatically discover new leads every 6.5s in background

    return () => clearInterval(interval);
  }, [isAutoHunting, selectedNiche, searchLocation, leadAgent.name]);

  const niches = ['All', 'E-commerce', 'SaaS', 'Real Estate', 'Dental & Healthcare', 'Local Services', 'Legal & Finance'];

  const handleRunScraper = () => {
    cartoonAudio.playSuccess();
    setIsScraping(true);

    const activeNiche = selectedNiche === 'All' ? 'Local Services' : selectedNiche;

    setAgentLiveLog(prev => [
      `🔎 [Lead Agent ${leadAgent.name}] Scraping target business directories for ${activeNiche}...`,
      ...prev
    ]);

    setTimeout(() => {
      const newLeads = generateDynamicLeads(activeNiche, searchLocation);
      setLeads((prev) => [...newLeads, ...prev]);
      setIsScraping(false);

      setAgentLiveLog(prev => [
        `✨ [Lead Agent ${leadAgent.name}] Found & verified ${newLeads.length} new high-intent prospects in ${activeNiche}!`,
        ...prev.slice(0, 5)
      ]);

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 1500);
  };

  const handleAddLeadToCRM = (lead: Lead) => {
    cartoonAudio.playPop();
    onAddToPipeline(lead);
    setAddedLeadIds((prev) => ({ ...prev, [lead.id]: true }));

    setAgentLiveLog(prev => [
      `📋 [Lead Agent ${leadAgent.name}] Handed off prospect "${lead.companyName}" to Operations Agent (Angela) for CRM pipeline!`,
      ...prev.slice(0, 5)
    ]);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesNiche = selectedNiche === 'All' || lead.niche === selectedNiche;
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesNiche && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Top Hero Banner - Powered by Lead Agent Jim */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-amber-100 via-amber-50 to-sky-100 border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="cartoon-badge px-3 py-1 text-xs bg-amber-400 text-slate-900 rounded-full flex items-center gap-1.5 font-extrabold border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" /> Module 1: Lead Hunter AI
            </span>

            {/* Lead Agent Identity Badge */}
            <span className="px-3 py-1 text-xs bg-white text-slate-900 font-extrabold rounded-full border-2 border-slate-900 flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#0f172a]">
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>OPERATED BY: {leadAgent.name} ({leadAgent.title})</span>
            </span>

            <span className="text-xs font-mono font-bold bg-slate-900 text-amber-300 px-2.5 py-1 rounded-full">
              {leads.length} Verified Prospects
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Lead Scraper & Prospect Finder 🎯
          </h2>

          {/* Lead Agent Motto & Role Quote */}
          <div className="p-2.5 bg-white/90 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs font-medium text-slate-800 flex items-center gap-2">
            <span className="text-lg">💼</span>
            <div>
              <span className="font-extrabold text-slate-900">{leadAgent.name}'s Directive:</span> "{leadAgent.quote}"
            </div>
          </div>
        </div>

        <div className="space-y-2 shrink-0 flex flex-col items-end">
          <button
            onClick={handleRunScraper}
            disabled={isScraping}
            className="cartoon-button-primary px-6 py-3 text-xs sm:text-sm flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold shadow-[4px_4px_0px_#0f172a] border-2 border-slate-900"
          >
            <Sparkles className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? `${leadAgent.name} is Scraping...` : `✨ Manual Scrape by ${leadAgent.name}`}</span>
          </button>

          {/* AUTO-HUNTER TOGGLE BADGE */}
          <button
            onClick={() => {
              cartoonAudio.playPop();
              if (onToggleAutoHunting) {
                onToggleAutoHunting(!isAutoHunting);
              }
            }}
            className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a] transition-all cursor-pointer ${
              isAutoHunting
                ? 'bg-emerald-300 text-slate-900 hover:bg-emerald-200'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isAutoHunting ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
                <Pause className="w-3 h-3 text-slate-900" />
                <span>🟢 AUTO-HUNTER ACTIVE ({leadAgent.name} finding leads automatically)</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-700" />
                <span>⏸️ Auto-Hunter Paused (Click to resume)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LEAD AGENT LIVE WORK & ACTIVITY TERMINAL STREAM */}
      <div className="cartoon-card p-3.5 bg-slate-900 border-2 border-slate-900 rounded-xl font-mono text-xs text-amber-300 shadow-[3px_3px_0px_#0f172a]">
        <div className="flex justify-between items-center text-[10px] text-slate-400 pb-1.5 mb-2 border-b border-slate-800">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <span>💼 LEAD AGENT LIVE WORK LOG ({leadAgent.name})</span>
          </span>
          <span className="text-emerald-400 font-bold">● ONLINE • RUNNING SCRAPER PIPELINE</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] space-y-1 max-h-32 overflow-y-auto">
          {agentLiveLog.map((logLine, idx) => (
            <p key={idx} className="text-emerald-400 leading-snug">
              {logLine}
            </p>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="cartoon-card p-4 bg-white flex flex-wrap items-center justify-between gap-3">
        
        {/* Niche Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => {
                cartoonAudio.playClick();
                setSelectedNiche(n);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-slate-900 transition-all shrink-0 ${
                selectedNiche === n
                  ? 'bg-amber-400 text-slate-900 shadow-[2px_2px_0px_#0f172a] -translate-y-0.5'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company, name or city..."
              className="w-full text-xs font-medium bg-transparent focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Leads Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLeads.map((lead) => {
          const isAdded = addedLeadIds[lead.id];

          return (
            <div
              key={lead.id}
              className="cartoon-card p-5 bg-white flex flex-col justify-between hover:bg-amber-50/40 transition-all relative group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-heading text-[10px] font-extrabold px-2.5 py-0.5 bg-amber-300 border border-slate-900 rounded-full text-slate-900">
                    {lead.niche}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-slate-900">
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Score: {lead.leadScore}</span>
                  </div>
                </div>

                {/* Company & Contact Info */}
                <div className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-slate-900 mb-2 inline-flex items-center gap-1 shadow-[1px_1px_0px_#0f172a]">
                  <span>💼 Verified by Lead Agent {leadAgent.name}</span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {lead.companyName}
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-0.5">
                  👤 {lead.contactName} • <span className="text-slate-500 font-normal">{lead.role}</span>
                </p>

                {/* Contact Cards */}
                <div className="my-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="flex items-center gap-1 text-slate-500"><Mail className="w-3.5 h-3.5 text-sky-600" /> Email:</span>
                    <span className="font-bold truncate max-w-[170px]">{lead.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="flex items-center gap-1 text-slate-500"><Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone:</span>
                    <span className="font-bold">{lead.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="flex items-center gap-1 text-slate-500"><ExternalLink className="w-3.5 h-3.5 text-purple-600" /> Website:</span>
                    <a href={lead.website} target="_blank" rel="noreferrer" className="font-bold underline text-purple-700 truncate max-w-[150px]">
                      {lead.website.replace('https://', '')}
                    </a>
                  </div>
                </div>

                {/* Tech Stack & Financial Indicator */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Tech:</span>
                    <div className="flex gap-1">
                      {lead.techStack.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 bg-slate-200 border border-slate-900 rounded text-[9px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-amber-700 font-mono">{lead.estimatedRevenue}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t-2 border-slate-900 grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    cartoonAudio.playPop();
                    onAuditLead(lead);
                  }}
                  className="px-2 py-1.5 bg-emerald-300 text-slate-900 font-extrabold text-[11px] rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a] hover:bg-emerald-400"
                  title="Run AI Website Audit"
                >
                  🔍 Audit
                </button>

                <button
                  onClick={() => {
                    cartoonAudio.playPop();
                    onGenerateOutreach(lead);
                  }}
                  className="px-2 py-1.5 bg-sky-300 text-slate-900 font-extrabold text-[11px] rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a] hover:bg-sky-400"
                  title="Generate Cold Outreach Email"
                >
                  ✉️ Email
                </button>

                <button
                  onClick={() => handleAddLeadToCRM(lead)}
                  disabled={isAdded}
                  className={`px-2 py-1.5 font-extrabold text-[11px] rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a] ${
                    isAdded
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-300 text-slate-900 hover:bg-purple-400'
                  }`}
                  title="Add Lead to Sales CRM Pipeline"
                >
                  {isAdded ? '✓ Saved' : '+ CRM'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
