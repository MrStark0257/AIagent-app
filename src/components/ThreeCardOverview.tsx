import React from 'react';
import { type CartoonCharacter } from '../data/characters';
import { ArrowRight, Sparkles, Lock } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';

interface ThreeCardOverviewProps {
  activeCharacter: CartoonCharacter;
  onSelectStep: (step: 'step1' | 'step2' | 'step3') => void;
}

export const ThreeCardOverview: React.FC<ThreeCardOverviewProps> = ({
  activeCharacter,
  onSelectStep,
}) => {
  return (
    <div className="w-full">
      
      {/* Cartoon Hero Banner */}
      <div className="cartoon-card p-6 md:p-8 bg-gradient-to-r from-amber-100 via-pink-100 to-sky-100 mb-8 relative overflow-hidden text-center">
        <span className="cartoon-badge px-3 py-1 bg-amber-300 text-slate-900 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-amber-700" /> Interactive Workflow Harness
        </span>
        <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Your Autonomous AI Office <br className="hidden sm:block" />
          <span className="text-amber-500 underline decoration-pink-400 decoration-wavy decoration-3">Powered by Local Clones</span>
        </h2>
        <p className="text-slate-700 text-sm md:text-base max-w-2xl mx-auto mt-3 font-medium">
          3 simple steps to spin up cartoon AI agents on your laptop. Shared memory, zero setup leaks, 24/7 clone collaboration!
        </p>
      </div>

      {/* 3-Card Grid (Exact layout from user screenshot, cartoon elevated!) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Card 1: Install your harness */}
        <div
          onClick={() => {
            cartoonAudio.playPop();
            onSelectStep('step1');
          }}
          className="cartoon-card p-6 bg-white flex flex-col justify-between cursor-pointer group hover:bg-amber-50/60 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center font-heading text-xl font-bold text-slate-900 mb-4 group-hover:scale-110 transition-transform">
              1
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-2">
              Install your harness
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              One download. It wraps the agent CLI you already use and runs on <strong className="text-slate-900 underline decoration-amber-400">your laptop</strong>. Your code, your keys, your existing subscription — nothing leaves your machine.
            </p>

            {/* Visual Mockup Preview for Step 1 */}
            <div className="cartoon-card-subtle p-3 bg-amber-50/90 text-left mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900 text-[11px] font-bold text-slate-800 uppercase font-heading">
                <span>ADD AGENT</span>
                <span className="text-amber-600 font-mono">CLI Sandbox</span>
              </div>
              
              <div className="mt-2 text-[11px] font-mono text-slate-700 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-900 text-amber-300 flex items-center justify-center text-[9px] font-bold">1</span>
                  <span>IDENTITY: {activeCharacter.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-900 text-amber-300 flex items-center justify-center text-[9px] font-bold">2</span>
                  <span>ENGINE: Claude 3.5 Sonnet</span>
                </div>
              </div>

              {/* Cartoon Character Avatar Mini Row */}
              <div className="mt-3 pt-2 border-t border-slate-300 flex items-center gap-1.5 justify-center">
                <div
                  className="w-10 h-10 rounded-lg border border-slate-900 bg-white overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: activeCharacter.avatarSvg }}
                />
                <span className="text-xs font-bold text-slate-900 font-heading">
                  {activeCharacter.name} Harness Active
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xs font-bold text-amber-600 group-hover:text-slate-900 font-heading">
            <span>Configure Harness & Characters →</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: It becomes you */}
        <div
          onClick={() => {
            cartoonAudio.playPop();
            onSelectStep('step2');
          }}
          className="cartoon-card p-6 bg-white flex flex-col justify-between cursor-pointer group hover:bg-sky-50/60 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sky-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center font-heading text-xl font-bold text-slate-900 mb-4 group-hover:scale-110 transition-transform">
              2
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-2">
              It becomes you
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              It captures your workflow, your tooling and what you know. <strong className="text-slate-900 underline decoration-sky-400">Every clone you run shares that memory</strong>, so the next one you spin up starts already knowing how you work.
            </p>

            {/* Visual Mockup Preview for Step 2 */}
            <div className="cartoon-card-subtle p-3 bg-sky-50/90 text-left mb-4 font-mono text-[11px]">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900 font-bold text-slate-900 uppercase">
                <span>{activeCharacter.name.toUpperCase()} CENTER • COMMAND</span>
                <span className="text-emerald-700 text-[10px]">auto-delivery on</span>
              </div>
              <div className="my-2 p-1.5 bg-white border border-slate-900 rounded text-[10px]">
                SEARCH: "invoice tokens & PR context"
              </div>
              <div className="p-2 bg-slate-900 text-emerald-400 rounded text-[10px] space-y-0.5">
                <p># Memory - {activeCharacter.name} (god)</p>
                <p className="text-slate-400">_Append durable facts below_</p>
                <p className="text-amber-300">✓ Org knowledge shared with every clone</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xs font-bold text-sky-600 group-hover:text-slate-900 font-heading">
            <span>Explore Command Center & Memory →</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Your office gets to work */}
        <div
          onClick={() => {
            cartoonAudio.playPop();
            onSelectStep('step3');
          }}
          className="cartoon-card p-6 bg-white flex flex-col justify-between cursor-pointer group hover:bg-purple-50/60 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center font-heading text-xl font-bold text-slate-900 mb-4 group-hover:scale-110 transition-transform">
              3
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-2">
              Your office gets to work
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              Your clones work around the clock — and when one needs something, it messages another. <strong className="text-slate-900 underline decoration-purple-400">They hand off work, share context and unblock each other</strong>, all on your own machine.
            </p>

            {/* Visual Mockup Preview for Step 3 */}
            <div className="cartoon-card-subtle p-3 bg-purple-50/90 text-left mb-4 space-y-2">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-900 text-[10px] font-mono font-bold text-slate-800">
                <span>JIM'S CLONE ⇄ PAM'S CLONE</span>
                <span className="flex items-center gap-0.5 text-slate-600"><Lock className="w-2.5 h-2.5" /> E2E</span>
              </div>
              <div className="p-2 bg-white border border-slate-900 rounded text-[11px] font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a]">
                Blocked — need invoice-state design tokens.
              </div>
              <div className="p-2 bg-amber-100 border border-slate-900 rounded text-[11px] font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a]">
                Sent — tokens + edge-case flows in billing/tokens.json
              </div>
              <div className="px-2 py-1 bg-emerald-300 border border-slate-900 rounded-full text-[10px] font-bold text-slate-900 inline-block">
                ✓ unblocked overnight • PR #147 open
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xs font-bold text-purple-600 group-hover:text-slate-900 font-heading">
            <span>Watch Live Clone Handoff →</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
};
