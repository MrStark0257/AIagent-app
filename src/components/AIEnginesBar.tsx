import React from 'react';
import { AI_ENGINES, type AIEngine } from '../data/aiEngines';
import { Sparkles } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';

interface AIEnginesBarProps {
  selectedEngineId: string;
  onSelectEngine: (engine: AIEngine) => void;
}

export const AIEnginesBar: React.FC<AIEnginesBarProps> = ({
  selectedEngineId,
  onSelectEngine,
}) => {
  return (
    <div className="w-full cartoon-card p-4 bg-white mb-6">
      
      {/* Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-400 border-2 border-slate-900 flex items-center justify-center font-bold text-xs">
            🧠
          </span>
          <h3 className="font-heading text-sm md:text-base font-extrabold text-slate-900 uppercase tracking-tight">
            SUPPORTED AI ENGINES & MODELS <span className="text-amber-600 font-mono font-bold text-xs">(10 Integrated Engines)</span>
          </h3>
        </div>
        <span className="cartoon-badge px-2.5 py-0.5 text-[10px] bg-emerald-300 text-slate-900 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-800" /> Multi-LLM Sandbox Active
        </span>
      </div>

      {/* The 10 AI Engines Grid (Matching User Screenshot Layout!) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
        {AI_ENGINES.map((engine) => {
          const isSelected = selectedEngineId === engine.id;

          return (
            <button
              key={engine.id}
              onClick={() => {
                cartoonAudio.playPop(650);
                onSelectEngine(engine);
              }}
              className={`p-2.5 rounded-xl border-2 border-slate-900 transition-all flex flex-col items-center justify-between text-center min-h-[90px] relative ${
                isSelected
                  ? 'bg-amber-300 shadow-[4px_4px_0px_#0f172a] -translate-y-1 ring-2 ring-slate-900 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5'
              }`}
            >
              {/* Logo Box (Matching Screenshot white box icon style) */}
              <div className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] flex items-center justify-center font-mono font-extrabold text-sm text-slate-900 my-1">
                {engine.logoText}
              </div>

              {/* Engine Name */}
              <span className="font-mono text-[10px] font-bold text-slate-900 truncate max-w-full">
                {engine.name}
              </span>

              {/* Manager Only Badge */}
              {engine.isManagerOnly && (
                <span className="text-[8px] font-extrabold font-heading bg-amber-400 text-slate-900 px-1 rounded border border-slate-900 shadow-[1px_1px_0px_#0f172a] mb-0.5">
                  👑 Manager
                </span>
              )}

              {/* Active Indicator Dot */}
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-900">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
