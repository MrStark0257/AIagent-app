import React, { useState } from 'react';
import { CHARACTERS, type CartoonCharacter } from '../data/characters';
import { AI_ENGINES } from '../data/aiEngines';
import { Download, CheckCircle2, Shield, Folder, Terminal, Wand2, ArrowRight } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StepOneHarnessProps {
  onAgentSelect?: (character: CartoonCharacter) => void;
  activeCharacter: CartoonCharacter;
  setActiveCharacter: (character: CartoonCharacter) => void;
  onProceedToStep2?: () => void;
}

export const StepOneHarness: React.FC<StepOneHarnessProps> = ({
  activeCharacter,
  setActiveCharacter,
  onProceedToStep2
}) => {
  const [agentName, setAgentName] = useState(activeCharacter.name);
  const [colorHex, setColorHex] = useState(activeCharacter.colorHex);
  const [workspace, setWorkspace] = useState(`~/.agent-harness/clones/${activeCharacter.id}`);
  const [engineId, setEngineId] = useState('claude-code');
  const [briefing, setBriefing] = useState(activeCharacter.quote);
  const [isGenerating, setIsGenerating] = useState(false);
  const [harnessInstalled, setHarnessInstalled] = useState(false);

  const colors = [
    { name: 'Teal Green', hex: '#10b981', bg: 'bg-emerald-400' },
    { name: 'Sunny Gold', hex: '#f59e0b', bg: 'bg-amber-400' },
    { name: 'Rose Pink', hex: '#ec4899', bg: 'bg-pink-400' },
    { name: 'Electric Sky', hex: '#0284c7', bg: 'bg-sky-400' },
    { name: 'Royal Purple', hex: '#a855f7', bg: 'bg-purple-400' },
    { name: 'Slate Dark', hex: '#334155', bg: 'bg-slate-700' }
  ];

  const handleSelectCharacter = (char: CartoonCharacter) => {
    cartoonAudio.playPop(600);
    setActiveCharacter(char);
    setAgentName(char.name);
    setColorHex(char.colorHex);
    setWorkspace(`~/.agent-harness/clones/${char.id}`);
    setBriefing(char.quote);
  };

  const handleGenerateAI = () => {
    cartoonAudio.playSuccess();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const selectedEngine = AI_ENGINES.find(e => e.id === engineId) || AI_ENGINES[0];
      setBriefing(`Powered by ${selectedEngine.name} (${selectedEngine.provider}). ${selectedEngine.tagline}!`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }, 600);
  };

  const handleInstallHarness = () => {
    cartoonAudio.playSuccess();
    setHarnessInstalled(true);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      if (onProceedToStep2) onProceedToStep2();
    }, 1200);
  };

  const currentEngine = AI_ENGINES.find(e => e.id === engineId) || AI_ENGINES[0];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-center font-heading text-2xl font-bold text-slate-900 shrink-0">
          1
        </div>
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Install your harness
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            One download. It wraps the agent CLI you already use and runs on <strong className="text-slate-900 underline decoration-amber-400 decoration-4">your laptop</strong>. Supports all 10 major AI engines — nothing leaves your machine.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: ADD AGENT Interactive Builder */}
        <div className="lg:col-span-7 cartoon-card p-5 md:p-6 bg-amber-50/50">
          
          {/* Top Mockup Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-900">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs uppercase tracking-wider font-extrabold px-2.5 py-1 bg-amber-300 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#0f172a]">
                ADD AGENT
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">v2.4-harness • 10 AI Engines</span>
            </div>
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-emerald-300 text-slate-900 rounded-full flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> 100% Local Sandbox
            </span>
          </div>

          {/* Section 1: IDENTITY */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center font-heading">1</span>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wide">
                IDENTITY <span className="text-slate-400 text-xs font-normal">name • character • color</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#0f172a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color Palette</label>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        cartoonAudio.playClick();
                        setColorHex(c.hex);
                      }}
                      className={`w-7 h-7 rounded-lg border-2 border-slate-900 ${c.bg} transition-transform ${
                        colorHex === c.hex ? 'scale-125 ring-2 ring-slate-900 shadow-[2px_2px_0px_#0f172a]' : 'hover:scale-110'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Cartoon Character Avatar Picker */}
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Cartoon Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {CHARACTERS.map((char) => {
                const isSelected = activeCharacter.id === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char)}
                    className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all flex flex-col items-center text-center ${
                      isSelected
                        ? `${char.bgColor} ring-2 ring-amber-500 shadow-[3px_3px_0px_#0f172a] -translate-y-1`
                        : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden border border-slate-900 bg-white"
                      dangerouslySetInnerHTML={{ __html: char.avatarSvg }}
                    />
                    <span className="text-[11px] font-bold text-slate-900 mt-1 truncate max-w-full font-heading">
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: WORKSPACE */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center font-heading">2</span>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wide">
                WORKSPACE <span className="text-slate-400 text-xs font-normal">folder • isolation • resume</span>
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a]">
              <Folder className="w-4 h-4 text-amber-500 shrink-0 ml-1" />
              <input
                type="text"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="w-full text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
              />
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded border border-slate-900 font-bold text-slate-700 shrink-0">
                SANDBOXED
              </span>
            </div>
          </div>

          {/* Section 3: ENGINE (Select from all 10 AI Engines!) */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center font-heading">3</span>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wide">
                ENGINE <span className="text-slate-400 text-xs font-normal">10 Integrated AI Models</span>
              </h3>
            </div>
            
            <select
              value={engineId}
              onChange={(e) => setEngineId(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl font-bold text-xs text-slate-900 focus:outline-none shadow-[2px_2px_0px_#0f172a]"
            >
              {AI_ENGINES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.logoText} {e.name} ({e.provider}) — {e.defaultModel}
                </option>
              ))}
            </select>

            <p className="mt-1.5 text-[11px] font-mono text-slate-600">
              ⚡ Selected: <strong className="text-slate-900">{currentEngine.name}</strong> • Speed: {currentEngine.speed}
            </p>
          </div>

          {/* Section 4: BRIEFING */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center font-heading">4</span>
                <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wide">
                  BRIEFING <span className="text-slate-400 text-xs font-normal">description • goal</span>
                </h3>
              </div>
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-200 px-2 py-0.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a]"
              >
                <Wand2 className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <textarea
              rows={2}
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-medium text-slate-900 focus:outline-none shadow-[2px_2px_0px_#0f172a]"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                cartoonAudio.playPop();
                alert('Imported agent manifest template!');
              }}
              className="px-3 py-2 text-xs font-bold bg-white text-slate-800 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100"
            >
              import hire...
            </button>

            <button
              onClick={handleInstallHarness}
              className="cartoon-button-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2"
            >
              {harnessInstalled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  <span>Harness Installed!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Install Agent Harness & Spin Up</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Side: Live Interactive Character Harness Card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="cartoon-card p-6 bg-white flex flex-col items-center text-center relative overflow-hidden h-full">
            
            {/* Background Accent Banner */}
            <div className={`w-full h-24 absolute top-0 left-0 right-0 ${activeCharacter.bgColor} border-b-3 border-slate-900 -z-0`} />

            {/* Avatar Circle */}
            <div className="relative z-10 mt-4 mb-3">
              <div
                className="w-28 h-28 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] bg-white overflow-hidden animate-float"
                dangerouslySetInnerHTML={{ __html: activeCharacter.avatarSvg }}
              />
              <span className="absolute -bottom-2 -right-2 cartoon-badge px-2 py-0.5 text-[10px] bg-amber-300 text-slate-900 rounded-lg font-bold">
                {currentEngine.name} Active
              </span>
            </div>

            {/* Character Info */}
            <div className="relative z-10 w-full">
              <h3 className="font-heading text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                {agentName}
              </h3>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mt-0.5">
                {activeCharacter.title} • {activeCharacter.role}
              </p>

              {/* Speech Bubble Quote */}
              <div className="speech-bubble-left my-4 p-3 text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Terminal className="w-3 h-3" /> Engine Quote ({currentEngine.provider})
                </div>
                <p className="text-xs font-medium text-slate-800 italic">
                  "{briefing}"
                </p>
              </div>

              {/* Personality Stats Progress Bars */}
              <div className="w-full bg-slate-50 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-left mb-4">
                <div className="text-xs font-bold text-slate-900 mb-2 font-heading flex justify-between">
                  <span>AI Engine Throughput</span>
                  <span className="text-amber-600 font-mono text-[11px]">{currentEngine.speed}</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                      <span>Execution Speed</span>
                      <span>{activeCharacter.stats.speed}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full border border-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${activeCharacter.stats.speed}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                      <span>Humor & Wit</span>
                      <span>{activeCharacter.stats.humor}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full border border-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-pink-400 transition-all duration-500"
                        style={{ width: `${activeCharacter.stats.humor}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-0.5">
                      <span>Task Intelligence</span>
                      <span>{activeCharacter.stats.intelligence}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full border border-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 transition-all duration-500"
                        style={{ width: `${activeCharacter.stats.intelligence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready to proceed CTA */}
              <button
                onClick={() => {
                  cartoonAudio.playPop();
                  if (onProceedToStep2) onProceedToStep2();
                }}
                className="w-full cartoon-button-secondary py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Step 2: Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
