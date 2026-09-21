import React, { useState, useEffect } from 'react';
import { type Lead, INITIAL_LEADS } from '../services/leadScraper';
import { Sparkles, UserCheck, Database } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SalesPipelineProps {
  pipelineLeads?: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeads?: (leads: Lead[]) => void;
}

export const SalesPipeline: React.FC<SalesPipelineProps> = ({
  pipelineLeads,
  onSelectLead,
  onUpdateLeads,
}) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('ai_agency_crm_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return pipelineLeads && pipelineLeads.length > 0 ? pipelineLeads : INITIAL_LEADS;
  });

  // Sync with incoming props if new leads are routed
  useEffect(() => {
    if (pipelineLeads && pipelineLeads.length > 0) {
      setLeads((prev) => {
        const existingIds = new Set(prev.map(l => l.id));
        const newFromProps = pipelineLeads.filter(l => !existingIds.has(l.id));
        if (newFromProps.length > 0) {
          const combined = [...newFromProps, ...prev];
          try {
            localStorage.setItem('ai_agency_crm_leads', JSON.stringify(combined));
          } catch (e) {}
          return combined;
        }
        return prev;
      });
    }
  }, [pipelineLeads]);

  // Operations Agent (Angela) & Financial Analyst (Kevin)
  const crmAgent = CHARACTERS.find(c => c.id === 'angela' || c.title.includes('Operations')) || CHARACTERS[4];
  const financeAgent = CHARACTERS.find(c => c.id === 'kevin' || c.title.includes('Budget')) || CHARACTERS[5];

  const wonDeals = leads.filter((l) => l.status === 'closed_won');
  const demoDeals = leads.filter((l) => l.status === 'demo_scheduled');
  const pipelineValue = (leads.length * 2800).toLocaleString();
  const mrrForecast = (wonDeals.length * 1500 + demoDeals.length * 750).toLocaleString();

  const [agentLiveLog, setAgentLiveLog] = useState<string[]>([
    `📋 [Operations Agent ${crmAgent.name}] Tracking ${leads.length} active leads across pipeline lifecycle.`,
    `📊 [Budget Analyst ${financeAgent.name}] Calculated projected MRR: $${mrrForecast}/mo with healthy margins.`
  ]);

  const stages: { id: Lead['status']; title: string; color: string; badgeBg: string }[] = [
    { id: 'new', title: 'New Leads', color: 'border-slate-900 bg-slate-100', badgeBg: 'bg-slate-300' },
    { id: 'audited', title: 'Audit Completed', color: 'border-emerald-500 bg-emerald-50', badgeBg: 'bg-emerald-300' },
    { id: 'contacted', title: 'Outreach Sent', color: 'border-sky-500 bg-sky-50', badgeBg: 'bg-sky-300' },
    { id: 'demo_scheduled', title: 'Demo Scheduled', color: 'border-purple-500 bg-purple-50', badgeBg: 'bg-purple-300' },
    { id: 'closed_won', title: 'Closed Won 🏆', color: 'border-amber-500 bg-amber-50', badgeBg: 'bg-amber-400' },
  ];

  const handleMoveStage = (leadId: string, nextStatus: Lead['status']) => {
    cartoonAudio.playSuccess();
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l));
    setLeads(updated);
    try {
      localStorage.setItem('ai_agency_crm_leads', JSON.stringify(updated));
    } catch (e) {}
    if (onUpdateLeads) onUpdateLeads(updated);

    const changedLead = leads.find(l => l.id === leadId);
    setAgentLiveLog(prev => [
      `📋 [Operations Agent ${crmAgent.name}] Moved "${changedLead?.companyName || leadId}" to stage: ${nextStatus.toUpperCase()}!`,
      ...prev.slice(0, 4)
    ]);

    if (nextStatus === 'closed_won') {
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Hero & Analytics Cards - Powered by Angela & Kevin */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-emerald-100 via-amber-100 to-purple-100 flex flex-wrap items-center justify-between gap-4 border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="cartoon-badge px-3 py-1 text-xs bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-bold border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" /> Module 5: Sales CRM Pipeline
            </span>

            {/* Operations Agent Identity Badge */}
            <span className="px-3 py-1 text-xs bg-white text-slate-900 font-extrabold rounded-full border-2 border-slate-900 flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#0f172a]">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>OPERATED BY: {crmAgent.name} (Ops 📋) & {financeAgent.name} (Budget 📊)</span>
            </span>

            <span className="text-xs font-mono font-bold bg-slate-900 text-amber-300 px-2.5 py-1 rounded-full">
              Real-Time Revenue Analytics
            </span>

            <span className="px-2.5 py-1 text-[11px] bg-emerald-100 text-emerald-900 font-extrabold rounded-full border border-slate-900 flex items-center gap-1 shadow-[1px_1px_0px_#0f172a]">
              <Database className="w-3 h-3 text-emerald-700" />
              <span>Real-Time CRM Sync Active</span>
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sales CRM & Deal Pipeline 📊
          </h2>

          {/* Directives */}
          <div className="p-2.5 bg-white/90 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs font-medium text-slate-800 flex items-center gap-2">
            <span className="text-lg">📋</span>
            <div>
              <span className="font-extrabold text-slate-900">{crmAgent.name}'s Directive:</span> "{crmAgent.quote}"
            </div>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
          <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-center">
            <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">PIPELINE VALUE</span>
            <span className="font-heading text-lg font-extrabold text-slate-900">${pipelineValue}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-center">
            <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">MRR FORECAST</span>
            <span className="font-heading text-lg font-extrabold text-emerald-700">${mrrForecast}/mo</span>
          </div>

          <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">DEALS WON</span>
            <span className="font-heading text-lg font-extrabold text-amber-600">{wonDeals.length} Deals</span>
          </div>
        </div>
      </div>

      {/* Angela & Kevin Live Terminal Ticker */}
      <div className="cartoon-card p-3 bg-slate-900 text-white border-2 border-slate-900 rounded-xl font-mono text-xs flex items-center gap-3">
        <span className="text-xs font-bold px-2 py-0.5 bg-purple-400 text-slate-900 rounded border border-slate-900 shrink-0">
          📋 {crmAgent.name.toUpperCase()} & 📊 {financeAgent.name.toUpperCase()} CRM LOG
        </span>
        <div className="truncate text-emerald-400 font-bold">
          &gt; {agentLiveLog[0]}
        </div>
      </div>

      {/* Kanban Board Columns (5 Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`cartoon-card p-3 rounded-2xl border-2 ${stage.color} min-h-[480px] flex flex-col justify-between`}
            >
              <div>
                {/* Column Header */}
                <div className="flex justify-between items-center pb-2 mb-3 border-b-2 border-slate-900 font-heading">
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase">
                    {stage.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-900 ${stage.badgeBg}`}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lead Cards inside Column */}
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        cartoonAudio.playPop(550);
                        onSelectLead(lead);
                      }}
                      className="cartoon-card p-3 bg-white cursor-pointer hover:bg-amber-50 transition-all border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 border border-slate-900 rounded">
                          {lead.niche}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-700">
                          {lead.estimatedRevenue}
                        </span>
                      </div>

                      <h5 className="font-heading font-extrabold text-xs text-slate-900 truncate">
                        {lead.companyName}
                      </h5>

                      <p className="text-[10px] font-medium text-slate-600 truncate mt-0.5">
                        👤 {lead.contactName}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-emerald-700 font-bold">
                          Score: {lead.leadScore}
                        </span>

                        {/* Stage Advancer Button */}
                        {stage.id === 'new' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(lead.id, 'audited');
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-300 rounded border border-slate-900 hover:bg-emerald-400"
                          >
                            Audit →
                          </button>
                        )}
                        {stage.id === 'audited' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(lead.id, 'contacted');
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-300 rounded border border-slate-900 hover:bg-sky-400"
                          >
                            Pitch →
                          </button>
                        )}
                        {stage.id === 'contacted' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(lead.id, 'demo_scheduled');
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-300 rounded border border-slate-900 hover:bg-purple-400"
                          >
                            Demo →
                          </button>
                        )}
                        {stage.id === 'demo_scheduled' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(lead.id, 'closed_won');
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-400 rounded border border-slate-900 hover:bg-amber-500"
                          >
                            Win 🏆
                          </button>
                        )}
                        {stage.id === 'closed_won' && (
                          <span className="text-[9px] font-bold text-amber-700">🏆 WON</span>
                        )}
                      </div>

                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-6 text-center text-xs font-mono text-slate-400 border-2 border-dashed border-slate-300 rounded-xl">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
