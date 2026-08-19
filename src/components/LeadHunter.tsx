import React, { useState } from 'react';
import { INITIAL_LEADS, type Lead, generateDynamicLeads } from '../services/leadScraper';
import { Search, Sparkles, Filter, Mail, Phone, ExternalLink, Flame } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LeadHunterProps {
  onAuditLead: (lead: Lead) => void;
  onGenerateOutreach: (lead: Lead) => void;
  onAddToPipeline: (lead: Lead) => void;
}

export const LeadHunter: React.FC<LeadHunterProps> = ({
  onAuditLead,
  onGenerateOutreach,
  onAddToPipeline,
}) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [searchLocation] = useState<string>('Austin, TX');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [addedLeadIds, setAddedLeadIds] = useState<{ [key: string]: boolean }>({});

  const niches = ['All', 'E-commerce', 'SaaS', 'Real Estate', 'Dental & Healthcare', 'Local Services', 'Legal & Finance'];

  const handleRunScraper = () => {
    cartoonAudio.playSuccess();
    setIsScraping(true);

    setTimeout(() => {
      const newLeads = generateDynamicLeads(selectedNiche === 'All' ? 'Local Services' : selectedNiche, searchLocation);
      setLeads((prev) => [...newLeads, ...prev]);
      setIsScraping(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 1500);
  };

  const handleAddLeadToCRM = (lead: Lead) => {
    cartoonAudio.playPop();
    onAddToPipeline(lead);
    setAddedLeadIds((prev) => ({ ...prev, [lead.id]: true }));
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
      
      {/* Top Hero Banner */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-amber-100 via-sky-100 to-purple-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" /> Module 1: Lead Hunter AI
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">{leads.length} Verified Prospects</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Lead Scraper & Prospect Finder 🎯
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Find high-intent leads by Niche, City & Tech Stack. Run 1-click Website Audits & auto-generate Cold Outreach!
          </p>
        </div>

        <button
          onClick={handleRunScraper}
          disabled={isScraping}
          className="cartoon-button-primary px-5 py-3 text-xs sm:text-sm flex items-center gap-2"
        >
          <Sparkles className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
          <span>{isScraping ? 'Scraping Verified Leads...' : '✨ Find New Leads with AI'}</span>
        </button>
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
