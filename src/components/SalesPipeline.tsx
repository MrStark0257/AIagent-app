import React, { useState } from 'react';
import { type Lead, INITIAL_LEADS } from '../services/leadScraper';
import { Sparkles } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SalesPipelineProps {
  pipelineLeads?: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const SalesPipeline: React.FC<SalesPipelineProps> = ({
  pipelineLeads = INITIAL_LEADS,
  onSelectLead,
}) => {
  const [leads, setLeads] = useState<Lead[]>(pipelineLeads);

  const stages: { id: Lead['status']; title: string; color: string; badgeBg: string }[] = [
    { id: 'new', title: 'New Leads', color: 'border-slate-900 bg-slate-100', badgeBg: 'bg-slate-300' },
    { id: 'audited', title: 'Audit Completed', color: 'border-emerald-500 bg-emerald-50', badgeBg: 'bg-emerald-300' },
    { id: 'contacted', title: 'Outreach Sent', color: 'border-sky-500 bg-sky-50', badgeBg: 'bg-sky-300' },
    { id: 'demo_scheduled', title: 'Demo Scheduled', color: 'border-purple-500 bg-purple-50', badgeBg: 'bg-purple-300' },
    { id: 'closed_won', title: 'Closed Won 🏆', color: 'border-amber-500 bg-amber-50', badgeBg: 'bg-amber-400' },
  ];

  const handleMoveStage = (leadId: string, nextStatus: Lead['status']) => {
    cartoonAudio.playSuccess();
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );

    if (nextStatus === 'closed_won') {
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.5 } });
    }
  };

  const wonDeals = leads.filter((l) => l.status === 'closed_won');
  const demoDeals = leads.filter((l) => l.status === 'demo_scheduled');
  const pipelineValue = (leads.length * 2800).toLocaleString();
  const mrrForecast = (wonDeals.length * 1500 + demoDeals.length * 750).toLocaleString();

  return (
    <div className="w-full space-y-6">
      
      {/* Top Hero & Analytics Cards */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-emerald-100 via-amber-100 to-sky-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" /> Module 5: Sales CRM Pipeline
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">Real-Time Revenue Analytics</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sales CRM & Deal Pipeline 📊
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Track leads across stages from cold acquisition to Closed Won. Forecast monthly recurring revenue!
          </p>
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
            <span className="font-heading text-lg font-extrabold text-amber-600">{wonDeals.length} Won</span>
          </div>
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
