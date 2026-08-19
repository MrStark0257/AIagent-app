import React from 'react';
import { Sparkles, Volume2, VolumeX, Building2, PlusCircle, Search, Gauge, Mail, RefreshCw, BarChart3 } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';

export type PlatformTab = 'floor' | 'lead-hunter' | 'audit' | 'outreach' | 'sequencer' | 'crm';

interface HeaderProps {
  activeTab: PlatformTab;
  setActiveTab: (tab: PlatformTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenAddModal: () => void;
  onOpenHarnessStudioModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onOpenAddModal,
  onOpenHarnessStudioModal,
}) => {
  const handleToggleSound = () => {
    const nextState = cartoonAudio.toggleSound();
    setSoundEnabled(nextState);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 px-4 py-3 shadow-[0_4px_0_0_#0f172a]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('floor')}>
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center text-2xl font-bold animate-wiggle">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                AgentHarness<span className="text-amber-500 font-extrabold">.ai</span>
              </h1>
              <span className="cartoon-badge px-2 py-0.5 text-xs bg-pink-300 text-slate-900 rounded-full flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-pink-700 fill-pink-600" /> Sales Platform
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium hidden sm:block">
              AI Lead Gen • Website Audit • Cold Outreach • CRM Pipeline
            </p>
          </div>
        </div>

        {/* 6 Core Platform Module Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_#0f172a] overflow-x-auto max-w-full">
          
          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveTab('floor');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'floor'
                ? 'bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> 🏢 Agent Floor
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveTab('lead-hunter');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'lead-hunter'
                ? 'bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> 🎯 Lead Hunter
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveTab('audit');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'audit'
                ? 'bg-emerald-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" /> 🔍 Website Audit
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveTab('outreach');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'outreach'
                ? 'bg-sky-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> ✉️ Outreach Copy
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveTab('sequencer');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'sequencer'
                ? 'bg-purple-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> 🔄 Sequencer
          </button>

          <button
            onClick={() => {
              cartoonAudio.playClick();
              setActiveTab('crm');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'crm'
                ? 'bg-pink-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> 📊 Sales CRM
          </button>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Harness Studio Button */}
          <button
            onClick={() => {
              cartoonAudio.playPop();
              onOpenHarnessStudioModal();
            }}
            title="Open 3-Step Harness Studio Modal"
            className="px-3 py-2 bg-slate-100 text-slate-900 font-bold text-xs border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a] hover:bg-slate-200"
          >
            📋 Studio
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Disable Cartoon SFX' : 'Enable Cartoon SFX'}
            className="p-2 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a] hover:bg-amber-100 transition-transform active:translate-y-0.5"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Add Agent Button */}
          <button
            onClick={() => {
              cartoonAudio.playPop();
              onOpenAddModal();
            }}
            className="cartoon-button-primary px-3 py-2 text-xs sm:text-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Agent</span>
          </button>
        </div>

      </div>
    </header>
  );
};
