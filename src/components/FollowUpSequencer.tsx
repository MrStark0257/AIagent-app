import React, { useState } from 'react';
import type { Lead } from '../services/leadScraper';
import type { GeneratedOutreach } from '../services/outreachGenerator';
import { Play, Sparkles } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FollowUpSequencerProps {
  activeLead?: Lead;
  activeOutreach?: GeneratedOutreach;
  onMoveToCRM: (lead: Lead, stage: 'demo_scheduled' | 'closed_won') => void;
}

interface StepItem {
  dayNumber: number;
  title: string;
  channel: 'Email' | 'LinkedIn' | 'Call';
  contentSnippet: string;
  status: 'pending' | 'sent' | 'replied';
}

export const FollowUpSequencer: React.FC<FollowUpSequencerProps> = ({
  activeLead,
  activeOutreach,
  onMoveToCRM,
}) => {
  const lead = activeLead || {
    id: 'demo-lead',
    companyName: 'Apex Dental Care',
    contactName: 'Dr. Marcus Vance',
    role: 'Owner & Chief Dentist',
    email: 'marcus@apexdental.com',
    phone: '+1 (555) 234-8901',
    website: 'https://apexdentalcare.com',
    niche: 'Dental & Healthcare',
    location: 'Austin, TX',
    techStack: ['WordPress'],
    estimatedRevenue: '$1.2M/yr',
    initialSeoScore: 54,
    mobileResponsive: false,
    status: 'contacted',
    leadScore: 88,
  };

  const [steps, setSteps] = useState<StepItem[]>([
    {
      dayNumber: 1,
      title: 'Initial Audit Delivery Email',
      channel: 'Email',
      contentSnippet: activeOutreach ? activeOutreach.emailSubject : `Quick audit of ${lead.companyName}'s website`,
      status: 'sent',
    },
    {
      dayNumber: 3,
      title: 'Quick 2-Line Nudge',
      channel: 'Email',
      contentSnippet: `Hey ${lead.contactName.split(' ')[0]}, just checking if you had 2 minutes to review the mobile audit report?`,
      status: 'pending',
    },
    {
      dayNumber: 7,
      title: 'Case Study & Proof Breakdown',
      channel: 'Email',
      contentSnippet: `Here is how a similar ${lead.niche} business recovered $8.5k/mo after fixing their mobile CTA friction...`,
      status: 'pending',
    },
    {
      dayNumber: 14,
      title: 'Final Breakup Nudge',
      channel: 'Email',
      contentSnippet: `Closing out our file for ${lead.companyName} for this month. Should I archive this report?`,
      status: 'pending',
    },
  ]);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [prospectReplied, setProspectReplied] = useState<boolean>(false);

  const handleSimulateCampaign = () => {
    cartoonAudio.playPop(500);
    setIsSimulating(true);

    // Step 2 sent
    setTimeout(() => {
      cartoonAudio.playPop(650);
      setSteps((prev) =>
        prev.map((s) => (s.dayNumber === 3 ? { ...s, status: 'sent' } : s))
      );
    }, 1200);

    // Step 3 sent & Prospect Replies!
    setTimeout(() => {
      cartoonAudio.playSuccess();
      setSteps((prev) =>
        prev.map((s) => (s.dayNumber === 7 ? { ...s, status: 'replied' } : s))
      );
      setProspectReplied(true);
      setIsSimulating(false);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }, 2800);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-purple-400 text-slate-900 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-800" /> Module 4: Follow-up Drip Sequencer
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">4-Touch Automated Drip</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Automated Drip & Response Manager 🔄
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Runs 14-day automated email sequences. Auto-detects prospect replies & triggers AI smart booking responses.
          </p>
        </div>

        <button
          onClick={handleSimulateCampaign}
          disabled={isSimulating}
          className="cartoon-button-primary px-5 py-3 text-xs sm:text-sm flex items-center gap-2"
        >
          <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Sending Sequence...' : '▶️ Run Live Drip Campaign'}</span>
        </button>
      </div>

      {/* Target Prospect Info Bar */}
      <div className="cartoon-card p-4 bg-white flex justify-between items-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-extrabold text-slate-900">
            CAMPAIGN ACTIVE: {lead.companyName} ({lead.contactName}) — {lead.email}
          </span>
        </div>
        <span className="cartoon-badge px-2.5 py-0.5 bg-amber-300 text-slate-900 rounded-full text-[10px]">
          Multi-Touch Sequencer ON
        </span>
      </div>

      {/* Drip Sequence Steps Cards */}
      <div className="cartoon-card p-6 bg-white space-y-4">
        <div className="font-heading font-extrabold text-base text-slate-900 uppercase pb-2 border-b-2 border-slate-900 flex justify-between items-center">
          <span>14-DAY AUTOMATED SEQUENCER STEPS</span>
          <span className="text-xs font-mono text-purple-700">Auto-Pause on Prospect Reply</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step) => {
            const isSent = step.status === 'sent';
            const isReplied = step.status === 'replied';

            return (
              <div
                key={step.dayNumber}
                className={`cartoon-card p-4 flex flex-col justify-between transition-all ${
                  isReplied
                    ? 'bg-emerald-100 ring-4 ring-emerald-400 shadow-[6px_6px_0px_#0f172a]'
                    : isSent
                    ? 'bg-sky-100'
                    : 'bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-slate-900 text-amber-300 rounded">
                      DAY {step.dayNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-slate-900 ${
                      isReplied ? 'bg-emerald-400 text-slate-900' : isSent ? 'bg-sky-300 text-slate-900' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-sm text-slate-900 mb-1">
                    {step.title}
                  </h4>

                  <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-900 mt-2 truncate">
                    "{step.contentSnippet}"
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-300 flex justify-between items-center text-[10px] font-bold text-slate-600 font-mono">
                  <span>Channel: {step.channel}</span>
                  {isReplied ? <span className="text-emerald-800">🎉 REPLIED</span> : isSent ? <span>✓ Delivered</span> : <span>⏰ Scheduled</span>}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Prospect Reply Popup Box if triggered */}
      {prospectReplied && (
        <div className="cartoon-card p-5 bg-emerald-50 border-4 border-slate-900 relative animate-fadeIn shadow-[8px_8px_0px_#0f172a]">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📩</span>
              <div>
                <h4 className="font-heading text-lg font-extrabold text-slate-900">
                  PROSPECT REPLIED! ({lead.contactName})
                </h4>
                <p className="text-xs font-mono text-emerald-800 font-bold">
                  "Thanks for sending over the visual audit. Can we schedule a quick demo this Thursday at 2 PM?"
                </p>
              </div>
            </div>
            <span className="cartoon-badge px-3 py-1 bg-emerald-400 text-slate-900 rounded-full text-xs">
              HOT INTENT DETECTED
            </span>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-900 flex justify-end gap-3">
            <button
              onClick={() => {
                cartoonAudio.playSuccess();
                onMoveToCRM(lead, 'demo_scheduled');
                alert('Moved deal to Demo Scheduled stage in Sales CRM!');
              }}
              className="cartoon-button-primary px-5 py-2 text-xs flex items-center gap-2"
            >
              <span>📅 Schedule Demo & Move to CRM →</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
