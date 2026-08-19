import React, { useState, useEffect } from 'react';
import { CHARACTERS, type CartoonCharacter } from '../data/characters';
import { AI_ENGINES, type AIEngine } from '../data/aiEngines';
import { Sparkles, Monitor, Coffee, Server, Shield, Plus, Layers, Cpu } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface OfficeSpaceProps {
  onOpenHarnessStudio: () => void;
  onOpenAddAgent: () => void;
}

interface WorkingEmployee {
  character: CartoonCharacter;
  aiEngine: AIEngine;
  status: 'typing' | 'designing' | 'reviewing' | 'coffee' | 'thinking';
  currentTask: string;
  linesOfCode: number;
  screenOutput: string;
}

export const OfficeSpace: React.FC<OfficeSpaceProps> = ({
  onOpenHarnessStudio,
  onOpenAddAgent,
}) => {
  const [employees, setEmployees] = useState<WorkingEmployee[]>([
    {
      character: CHARACTERS[0], // Jim
      aiEngine: AI_ENGINES[4], // Antigravity (Google DeepMind)
      status: 'typing',
      currentTask: 'Writing harness CLI wrapper in Rust & TS',
      linesOfCode: 1420,
      screenOutput: `const harness = new AntigravityHarness({ isolated: true });\nawait harness.executePR(#147);`
    },
    {
      character: CHARACTERS[1], // Pam
      aiEngine: AI_ENGINES[0], // Claude Code (Anthropic)
      status: 'designing',
      currentTask: 'Designing billing/tokens.json UI swatches',
      linesOfCode: 850,
      screenOutput: `{\n  "primary": "#fbbf24",\n  "cartoonBorder": "3px solid #0f172a"\n}`
    },
    {
      character: CHARACTERS[2], // Michael
      aiEngine: AI_ENGINES[1], // Codex (OpenAI)
      status: 'thinking',
      currentTask: 'Orchestrating office floor & managing clones',
      linesOfCode: 3200,
      screenOutput: `# Michael Command Palace\nState: ACTIVE • Engine: Codex GPT-4o`
    },
    {
      character: CHARACTERS[3], // Dwight
      aiEngine: AI_ENGINES[2], // Grok (xAI)
      status: 'reviewing',
      currentTask: 'Enforcing security isolation & key protection',
      linesOfCode: 2100,
      screenOutput: `[GROK SECURITY SCAN]\nKeys: LAPTOP_LOCAL_ONLY\nStatus: 0 Leaks detected`
    },
    {
      character: CHARACTERS[4], // Angela
      aiEngine: AI_ENGINES[9], // Copilot
      status: 'reviewing',
      currentTask: 'Inspecting PR code formatting & unit tests',
      linesOfCode: 1100,
      screenOutput: `✓ 48/48 Copilot Unit tests passed\n✓ Zero lint warnings`
    },
    {
      character: CHARACTERS[5], // Kevin
      aiEngine: AI_ENGINES[5], // Qwen
      status: 'coffee',
      currentTask: 'Optimizing token context window costs',
      linesOfCode: 640,
      screenOutput: `Qwen Token Savings: 420,000 Tokens\nCost: $0.00 (Local Engine)`
    }
  ]);

  const [selectedDeskId, setSelectedDeskId] = useState<string>('jim');
  const [customTaskInput, setCustomTaskInput] = useState<string>('');
  const [activeFloorSpeech, setActiveFloorSpeech] = useState<{ [key: string]: string }>({
    jim: "Antigravity 2.0 typing code...",
    pam: "Claude Code design tokens ready!",
    michael: "Codex orchestrating floor!",
  });
  const [floorActivityLog, setFloorActivityLog] = useState<string[]>([
    "🏢 Office Floor active in 100% Local Laptop Sandbox.",
    "👨‍💻 Jim working with Antigravity 2.0 at Desk 1.",
    "🎨 Pam working with Claude Code at Desk 2.",
    "👔 Michael working with Codex at Desk 3.",
  ]);

  // Simulate real live typing and work progress at desks
  useEffect(() => {
    const interval = setInterval(() => {
      setEmployees(prev =>
        prev.map(emp => {
          const addLines = Math.floor(Math.random() * 8) + 1;
          return {
            ...emp,
            linesOfCode: emp.linesOfCode + addLines
          };
        })
      );

      // Random office chatter over employee heads
      const chatterOptions = [
        { id: 'jim', text: 'Antigravity 2.0 writing code... 💻' },
        { id: 'pam', text: 'Claude Code swatches ready! 🎨' },
        { id: 'michael', text: "Codex: That's what she said! 😂" },
        { id: 'dwight', text: 'Grok security scan 100% clean! ✕' },
        { id: 'angela', text: 'Copilot unit tests: 100% 🐱' },
        { id: 'kevin', text: 'Qwen token math: 420k saved! ❖' }
      ];
      const randomChat = chatterOptions[Math.floor(Math.random() * chatterOptions.length)];
      setActiveFloorSpeech(prev => ({
        ...prev,
        [randomChat.id]: randomChat.text
      }));

    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectDesk = (emp: WorkingEmployee) => {
    cartoonAudio.playPop(550);
    setSelectedDeskId(emp.character.id);
  };

  const handleSwitchEngineForSelected = (engineId: string) => {
    const engine = AI_ENGINES.find(e => e.id === engineId) || AI_ENGINES[0];
    cartoonAudio.playPop(650);

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.character.id === selectedDeskId) {
          return {
            ...emp,
            aiEngine: engine,
            screenOutput: `[${engine.name.toUpperCase()} ENGINE ACTIVATED]\nModel: ${engine.defaultModel}\nProvider: ${engine.provider}`
          };
        }
        return emp;
      })
    );

    setActiveFloorSpeech(prev => ({
      ...prev,
      [selectedDeskId]: `Switched to ${engine.name}! 🧠`
    }));

    setFloorActivityLog(prev => [
      `⚡ Switched ${selectedDeskId.toUpperCase()}'s engine to ${engine.name}`,
      ...prev.slice(0, 5)
    ]);
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;

    cartoonAudio.playSuccess();
    const task = customTaskInput.trim();

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.character.id === selectedDeskId) {
          return {
            ...emp,
            currentTask: task,
            status: 'typing',
            screenOutput: `[${emp.aiEngine.name.toUpperCase()}]\n> TASK: ${task}\n> Executing with ${emp.aiEngine.defaultModel}...`
          };
        }
        return emp;
      })
    );

    setActiveFloorSpeech(prev => ({
      ...prev,
      [selectedDeskId]: `Working on: "${task}"! 🚀`
    }));

    setFloorActivityLog(prev => [
      `⚡ Task assigned to ${selectedDeskId.toUpperCase()}: "${task}"`,
      ...prev.slice(0, 5)
    ]);

    setCustomTaskInput('');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const selectedEmployee = employees.find(e => e.character.id === selectedDeskId) || employees[0];

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner Control Bar (Clean & Focused on Working Floor) */}
      <div className="cartoon-card p-5 md:p-6 bg-gradient-to-r from-amber-100 via-sky-100 to-emerald-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" /> Active AI Working Floor
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">6 Working Desks • Real-Time Execution</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Working Cartoon Office 🏢
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Working employees typing at their computer desks! Click any desk to inspect live work & assign tasks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              cartoonAudio.playPop();
              onOpenHarnessStudio();
            }}
            className="cartoon-button-primary px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>📋 3 Working Steps & Studio</span>
          </button>

          <button
            onClick={() => {
              cartoonAudio.playPop();
              onOpenAddAgent();
            }}
            className="cartoon-button-secondary px-4 py-2.5 text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Working Desk</span>
          </button>
        </div>
      </div>

      {/* Main Office Space Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Real 2D Cartoon Office Floor Map with Computer Desks (8 cols) */}
        <div className="lg:col-span-8 cartoon-card bg-[#f1f5f9] p-4 md:p-6 relative overflow-hidden border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a]">
          
          {/* Tile Flooring Background */}
          <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

          {/* Top Office Facilities Bar */}
          <div className="relative z-10 grid grid-cols-3 gap-3 mb-6 p-3 bg-white rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            {/* Server Rack */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Server className="w-5 h-5 text-emerald-600 animate-pulse" />
              <div>
                <div className="font-heading font-extrabold text-[11px] uppercase">ACTIVE ENGINE RACK</div>
                <div className="text-[9px] font-mono text-emerald-700">6 Working AI Containers</div>
              </div>
            </div>

            {/* Coffee Lounge */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
              <Coffee className="w-5 h-5 text-amber-600" />
              <div>
                <div className="font-heading font-extrabold text-[11px] uppercase">COFFEE & CHILI BAR</div>
                <div className="text-[9px] font-mono text-amber-700">Fresh Brewed • 100% Free</div>
              </div>
            </div>

            {/* Security Isolation */}
            <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-800">
              <Shield className="w-5 h-5 text-sky-600" />
              <div className="text-right">
                <div className="font-heading font-extrabold text-[11px] uppercase">SANDBOX ISOLATION</div>
                <div className="text-[9px] font-mono text-sky-700">0 Network Key Leaks</div>
              </div>
            </div>
          </div>

          {/* 6 Cartoon Computer Desks & Working Employees Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {employees.map((emp, index) => {
              const isSelected = selectedDeskId === emp.character.id;
              const speech = activeFloorSpeech[emp.character.id];

              return (
                <div
                  key={emp.character.id}
                  onClick={() => handleSelectDesk(emp)}
                  className={`cartoon-card p-3.5 cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? `${emp.character.bgColor} ring-4 ring-slate-900 -translate-y-1 shadow-[8px_8px_0px_#0f172a]`
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {/* Desk Header with Active Working AI Badge */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading text-[10px] font-extrabold px-2 py-0.5 bg-slate-900 text-amber-300 rounded border border-slate-900">
                      DESK {index + 1} • {emp.character.name.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-amber-300 border border-slate-900 rounded-full text-slate-900 flex items-center gap-1">
                      <span>{emp.aiEngine.logoText}</span>
                      <span>{emp.aiEngine.name}</span>
                    </span>
                  </div>

                  {/* Speech Bubble floating over working employee */}
                  {speech && (
                    <div className="speech-bubble-left mb-2 px-2.5 py-1 text-[10px] font-bold text-slate-900 animate-bounce">
                      {speech}
                    </div>
                  )}

                  {/* Cartoon Workstation Illustration: Chair + Sitting Employee + Computer Desk */}
                  <div className="bg-slate-100 p-3 rounded-xl border-2 border-slate-900 relative my-1 text-center">
                    
                    {/* Glowing Dual Monitor Screen */}
                    <div className="bg-slate-900 rounded-lg p-2 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] mb-2 relative">
                      <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 pb-1 mb-1 border-b border-slate-700">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Monitor className="w-2.5 h-2.5" /> {emp.aiEngine.name}
                        </span>
                        <span className="text-emerald-400">{emp.linesOfCode} LOC</span>
                      </div>
                      <p className="font-mono text-[9px] text-emerald-400 truncate text-left">
                        &gt; {emp.screenOutput.split('\n')[0]}
                      </p>
                    </div>

                    {/* Sitting Cartoon Employee & Ergonomic Office Chair */}
                    <div className="flex items-center justify-center gap-2 relative">
                      {/* Ergonomic Chair Backrest */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-900 absolute -z-0 top-1 shadow-[2px_2px_0px_#0f172a]" />

                      {/* Sitting Employee Cartoon Avatar */}
                      <div
                        className="w-12 h-12 rounded-xl border-2 border-slate-900 bg-white overflow-hidden relative z-10 animate-float"
                        dangerouslySetInnerHTML={{ __html: emp.character.avatarSvg }}
                      />

                      {/* Keyboard & Typing Animation */}
                      <div className="w-12 h-3 bg-slate-300 border border-slate-900 rounded flex items-center justify-center text-[7px] font-mono font-bold text-slate-700 animate-pulse">
                        ⌨️ TYPING
                      </div>
                    </div>

                  </div>

                  {/* Employee Role & Active Task */}
                  <div className="mt-2 text-left">
                    <div className="flex justify-between items-center">
                      <h4 className="font-heading font-extrabold text-xs text-slate-900 truncate">
                        {emp.character.title}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">
                      📌 {emp.currentTask}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Live Office Floor Activity Log */}
          <div className="mt-5 p-3 bg-slate-900 text-emerald-400 rounded-xl border-2 border-slate-900 font-mono text-xs shadow-[3px_3px_0px_#0f172a]">
            <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase mb-1 border-b border-slate-700 pb-1">
              <span>LIVE FLOOR ACTIVITY LOG</span>
              <span>WORKING ENGINES</span>
            </div>
            <div className="space-y-1">
              {floorActivityLog.map((log, idx) => (
                <p key={idx} className="truncate">
                  {log}
                </p>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Selected Employee Workstation Screen Inspector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="cartoon-card p-5 bg-white flex flex-col justify-between relative overflow-hidden h-full">
            
            {/* Selected Desk Banner */}
            <div>
              <div className="flex items-center gap-3 pb-3 mb-3 border-b-2 border-slate-900">
                <div
                  className="w-14 h-14 rounded-xl border-2 border-slate-900 bg-amber-100 overflow-hidden shrink-0 shadow-[2px_2px_0px_#0f172a]"
                  dangerouslySetInnerHTML={{ __html: selectedEmployee.character.avatarSvg }}
                />
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-slate-900">
                    {selectedEmployee.character.name}'s Desk
                  </h3>
                  <p className="text-xs font-bold text-amber-600 uppercase">
                    {selectedEmployee.character.title}
                  </p>
                </div>
              </div>

              {/* Working AI Engine Info */}
              <div className="p-3 bg-amber-50 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] mb-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1">
                  <span className="font-heading flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-amber-700" /> Working AI Engine:
                  </span>
                  
                  {/* Clean Engine Selector Dropdown for this Desk */}
                  <select
                    value={selectedEmployee.aiEngine.id}
                    onChange={(e) => handleSwitchEngineForSelected(e.target.value)}
                    className="text-xs font-bold font-mono px-2 py-0.5 bg-white border border-slate-900 rounded shadow-[1px_1px_0px_#0f172a] focus:outline-none"
                  >
                    {AI_ENGINES.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.logoText} {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <p className="text-[11px] text-slate-700 font-medium mt-1">
                  {selectedEmployee.aiEngine.tagline}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-300 flex justify-between text-[10px] font-mono text-slate-600 font-bold">
                  <span>Provider: {selectedEmployee.aiEngine.provider}</span>
                  <span>Speed: {selectedEmployee.aiEngine.speed}</span>
                </div>
              </div>

              {/* Live Computer Screen Inspector */}
              <div className="bg-slate-900 border-2 border-slate-900 rounded-xl p-3.5 font-mono text-xs text-emerald-400 shadow-[3px_3px_0px_#0f172a] mb-4">
                <div className="flex justify-between text-slate-400 text-[10px] pb-1.5 mb-2 border-b border-slate-700">
                  <span>🖥️ MONITOR OUTPUT</span>
                  <span>{selectedEmployee.linesOfCode} LOC</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] space-y-1">
                  <p className="text-amber-300">// Task: {selectedEmployee.currentTask}</p>
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {selectedEmployee.screenOutput}
                  </pre>
                </div>
              </div>

              {/* Assign Task Form to Sitting Employee */}
              <form onSubmit={handleAssignTask} className="bg-slate-50 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] mb-4">
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase font-heading">
                  Assign Task to {selectedEmployee.character.name}:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTaskInput}
                    onChange={(e) => setCustomTaskInput(e.target.value)}
                    placeholder="e.g. 'Build login UI' or 'Run security scan'"
                    className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-900 rounded-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="cartoon-button-primary px-3 py-1.5 text-xs shrink-0"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>

            {/* Studio Button */}
            <button
              onClick={() => {
                cartoonAudio.playPop();
                onOpenHarnessStudio();
              }}
              className="cartoon-button-secondary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>View Full 3-Step Harness Studio 📋</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
