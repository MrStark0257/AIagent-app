import React, { useState } from 'react';
import { type CartoonCharacter } from '../data/characters';
import { Database, Plus, ArrowRight, Share2 } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StepTwoCommandCenterProps {
  activeCharacter: CartoonCharacter;
  onProceedToStep3?: () => void;
}

export const StepTwoCommandCenter: React.FC<StepTwoCommandCenterProps> = ({
  activeCharacter,
  onProceedToStep3,
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'terminal' | 'monitor' | 'tasks' | 'workers'>('memory');
  const [textSearch, setTextSearch] = useState('');
  const [semanticSearch, setSemanticSearch] = useState('');
  const [memoryContent, setMemoryContent] = useState(activeCharacter.defaultMemory);
  const [newFact, setNewFact] = useState('');
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { id: 'memory', label: 'memory', badge: 'Active' },
    { id: 'terminal', label: 'terminal', badge: 'CLI' },
    { id: 'monitor', label: 'monitor', badge: 'CPU' },
    { id: 'tasks', label: 'tasks', badge: '5' },
    { id: 'workers', label: 'workers', badge: '3' },
  ];

  const handleAddFact = () => {
    if (!newFact.trim()) return;
    cartoonAudio.playPop();
    const updated = `${memoryContent}\n- ${newFact.trim()}`;
    setMemoryContent(updated);
    setNewFact('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    cartoonAudio.playPop(500);
    if (!textSearch.trim()) {
      setSearchResults(null);
      return;
    }
    const lines = memoryContent.split('\n');
    const matched = lines.filter(l => l.toLowerCase().includes(textSearch.toLowerCase()));
    setSearchResults(matched.length > 0 ? matched : ['No exact match found in memory files.']);
  };

  const handleSemanticSearch = (e: React.FormEvent) => {
    e.preventDefault();
    cartoonAudio.playSuccess();
    if (!semanticSearch.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchResults([
      `[MemPalace Vector Match score: 0.94] "${semanticSearch}"`,
      `-> Relates to: "${activeCharacter.name}'s clone workflow knowledge"`,
      `-> Shared across all active clones on local machine.`
    ]);
  };

  const handleSaveMemory = () => {
    cartoonAudio.playSuccess();
    setIsSaved(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-400 border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-center font-heading text-2xl font-bold text-slate-900 shrink-0">
          2
        </div>
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            It becomes you
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            It captures your workflow, your tooling and what you know. <strong className="text-slate-900 underline decoration-sky-400 decoration-4">Every clone you run shares that memory</strong>, so the next one you spin up starts already knowing how you work.
          </p>
        </div>
      </div>

      {/* Main Command Center Box */}
      <div className="cartoon-card bg-[#fefce8] p-4 md:p-6 relative">
        
        {/* Top Command Center Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b-3 border-slate-900 bg-white p-3 rounded-xl border-2 shadow-[3px_3px_0px_#0f172a]">
          
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-amber-100 overflow-hidden shrink-0"
              dangerouslySetInnerHTML={{ __html: activeCharacter.avatarSvg }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base md:text-lg font-bold text-slate-900 tracking-tight uppercase">
                  {activeCharacter.name.toUpperCase()} CENTER • COMMAND
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[11px] font-mono text-slate-600 font-bold flex items-center gap-2">
                <span>■ idle runs the floor</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700">auto-delivery on</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="cartoon-badge px-2.5 py-1 text-xs bg-amber-300 text-slate-900 rounded-lg flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Shared Memory Sync
            </span>
            <button className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 text-amber-300 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              &lt;&gt; IDE
            </button>
          </div>

        </div>

        {/* Tab Controls Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                cartoonAudio.playClick();
                setActiveTab(t.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-slate-900 transition-all flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-amber-400 text-slate-900 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>◆ {t.label}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 text-amber-300 rounded font-sans">
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Search Inputs Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Text Search Form */}
          <form onSubmit={handleTextSearch} className="bg-white p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
              TEXT SEARCH (board, tasks, memory)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                placeholder="Find exact text across hive files..."
                className="w-full text-xs font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-400 text-slate-900 font-mono font-bold text-xs rounded-lg border border-slate-900 hover:bg-amber-500"
              >
                search
              </button>
            </div>
          </form>

          {/* Semantic Search Form */}
          <form onSubmit={handleSemanticSearch} className="bg-white p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
              SEMANTIC SEARCH (MemPalace Vector DB)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={semanticSearch}
                onChange={(e) => setSemanticSearch(e.target.value)}
                placeholder="What does the hive know about..."
                className="w-full text-xs font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-sky-400 text-slate-900 font-mono font-bold text-xs rounded-lg border border-slate-900 hover:bg-sky-500"
              >
                search
              </button>
            </div>
          </form>
        </div>

        {/* Search Results Drawer */}
        {searchResults && (
          <div className="mb-4 p-3 bg-amber-100 border-2 border-slate-900 rounded-xl font-mono text-xs text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">🔍 Search Matches:</span>
              <button
                onClick={() => setSearchResults(null)}
                className="text-[10px] font-bold text-slate-600 underline"
              >
                Clear
              </button>
            </div>
            {searchResults.map((res, idx) => (
              <div key={idx} className="py-0.5 text-slate-800">
                {res}
              </div>
            ))}
          </div>
        )}

        {/* Main Tab Content Display */}
        {activeTab === 'memory' && (
          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_#0f172a]">
            <div className="flex flex-wrap justify-between items-center pb-2 mb-3 border-b-2 border-slate-900 gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-xs font-bold uppercase text-slate-900">
                  MEMORY FILE — {activeCharacter.name} (shared god memory)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">
                  _Append durable facts, decisions, and context below_
                </span>
                <button
                  onClick={handleSaveMemory}
                  className="px-2.5 py-1 text-xs font-bold bg-emerald-400 text-slate-900 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a] hover:bg-emerald-500"
                >
                  {isSaved ? '✓ Saved!' : 'Save Memory'}
                </button>
              </div>
            </div>

            {/* Editable Memory Area */}
            <textarea
              rows={5}
              value={memoryContent}
              onChange={(e) => setMemoryContent(e.target.value)}
              className="w-full p-3 font-mono text-xs text-slate-900 bg-slate-50 rounded-xl border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            {/* Add Quick Fact Row */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFact()}
                placeholder="Add new durable fact (e.g. 'PRs require unit tests + Pam approval')..."
                className="w-full text-xs font-mono bg-white px-3 py-2 border-2 border-slate-900 rounded-xl focus:outline-none"
              />
              <button
                onClick={handleAddFact}
                className="cartoon-button-primary px-4 py-2 text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Fact
              </button>
            </div>

            <p className="mt-2 text-[11px] font-mono text-slate-500 italic">
              ⚡ Org knowledge (shared with every clone instantly)
            </p>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="bg-slate-900 border-2 border-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 shadow-[3px_3px_0px_#0f172a]">
            <div className="flex justify-between text-slate-400 pb-2 mb-2 border-b border-slate-700 text-[11px]">
              <span>TERMINAL — {activeCharacter.name} Agent CLI Harness</span>
              <span>100% LAPTOP ISOLATED</span>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400">[03:12:01] Initializing harness wrapper for local workspace...</p>
              <p>[03:12:02] Connected to local LLM engine: Anthropic Claude 3.5 Sonnet</p>
              <p>[03:12:04] Loaded memory manifest: {memoryContent.split('\n').length} knowledge points active</p>
              <p className="text-amber-300">[03:12:05] Watching repository changes in d:\AIagent app</p>
              <p className="text-sky-300">[03:12:06] Synchronized clone state with Jim's Clone and Pam's Clone</p>
              <p className="animate-pulse text-emerald-400">&gt; Harness ready. Awaiting clone handoff task...</p>
            </div>
          </div>
        )}

        {activeTab !== 'memory' && activeTab !== 'terminal' && (
          <div className="bg-white border-2 border-slate-900 rounded-xl p-6 text-center shadow-[3px_3px_0px_#0f172a]">
            <h4 className="font-heading font-bold text-slate-900 text-base uppercase">
              {activeTab} Dashboard Active
            </h4>
            <p className="text-xs text-slate-600 font-mono mt-1">
              Monitoring {activeCharacter.name}'s active background workers and clone task state.
            </p>
          </div>
        )}

        {/* CTA to Step 3 */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => {
              cartoonAudio.playPop();
              if (onProceedToStep3) onProceedToStep3();
            }}
            className="cartoon-button-secondary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2"
          >
            <span>Proceed to Step 3: Office Clones Handoff</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
