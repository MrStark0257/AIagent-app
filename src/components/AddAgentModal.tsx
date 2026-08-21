import React, { useState } from 'react';
import { CHARACTERS, type CartoonCharacter } from '../data/characters';
import { AI_ENGINES, type AIEngine } from '../data/aiEngines';
import { X, Plus, Palette } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharacter: (character: CartoonCharacter, initialEngine?: AIEngine) => void;
  availableCharacters?: CartoonCharacter[];
}

const CUSTOM_COLOR_PALETTES = [
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-100', border: 'border-emerald-500 text-emerald-700', badge: 'bg-emerald-400 text-slate-900', hex: '#10b981', svgBg: '#a7f3d0' },
  { id: 'pink', name: 'Pink', bg: 'bg-pink-100', border: 'border-pink-500 text-pink-700', badge: 'bg-pink-400 text-slate-900', hex: '#ec4899', svgBg: '#fbcfe8' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-100', border: 'border-amber-500 text-amber-800', badge: 'bg-amber-400 text-slate-900', hex: '#f59e0b', svgBg: '#fef08a' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-100', border: 'border-purple-500 text-purple-700', badge: 'bg-purple-400 text-slate-900', hex: '#a855f7', svgBg: '#e9d5ff' },
  { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-100', border: 'border-cyan-500 text-cyan-700', badge: 'bg-cyan-400 text-slate-900', hex: '#06b6d4', svgBg: '#cffaff' },
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-100', border: 'border-indigo-500 text-indigo-700', badge: 'bg-indigo-400 text-slate-900', hex: '#6366f1', svgBg: '#e0e7ff' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-100', border: 'border-rose-500 text-rose-700', badge: 'bg-rose-400 text-slate-900', hex: '#f43f5e', svgBg: '#fecdd3' },
  { id: 'slate', name: 'Dark Mode', bg: 'bg-slate-200', border: 'border-slate-700 text-slate-900', badge: 'bg-slate-900 text-amber-300', hex: '#334155', svgBg: '#cbd5e1' },
];

const EMOJI_AVATARS = ['🤖', '⚡', '🚀', '🧙‍♂️', '🦸‍♂️', '🕵️‍♂️', '🦊', '🧠', '💻', '👑', '🎯', '⚙️', '🔥', '🛡️'];

export const AddAgentModal: React.FC<AddAgentModalProps> = ({
  isOpen,
  onClose,
  onAddCharacter,
  availableCharacters = CHARACTERS,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CartoonCharacter | 'custom'>(availableCharacters[0] || CHARACTERS[0]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('Client Communications & Operations');
  const [quote, setQuote] = useState('');
  const workerEngines = AI_ENGINES.filter((e) => !e.isManagerOnly);
  const [selectedEngineId, setSelectedEngineId] = useState<string>(workerEngines[0]?.id || 'claude-code');

  // Custom Avatar Builder state
  const [customEmoji, setCustomEmoji] = useState('🚀');
  const [customPalette, setCustomPalette] = useState(CUSTOM_COLOR_PALETTES[0]);

  if (!isOpen) return null;

  const handleSelectTemplate = (char: CartoonCharacter) => {
    cartoonAudio.playPop();
    setSelectedTemplate(char);
    setName(char.name);
    setTitle(char.title);
    setRole(char.role);
    setQuote(char.quote);
  };

  const handleSelectCustomMode = () => {
    cartoonAudio.playPop();
    setSelectedTemplate('custom');
    if (!name) setName('Custom Agent Zero');
    if (!title) setTitle('Autonomous AI Specialist');
    if (!quote) setQuote('System online! Ready to process unlimited tasks in local workspace.');
  };

  const generateCustomSvg = (emoji: string, bgHex: string) => {
    return `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="${bgHex}" stroke="#0f172a" stroke-width="4"/>
        <text x="50" y="62" font-size="46" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      </svg>
    `;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    cartoonAudio.playSuccess();

    let newChar: CartoonCharacter;

    if (selectedTemplate === 'custom') {
      newChar = {
        id: `custom-agent-${Date.now()}`,
        name: name.trim(),
        title: title.trim() || 'Custom AI Agent',
        role: role.trim() || 'Specialist',
        quote: quote.trim() || 'Ready to run tasks in workspace!',
        bgColor: customPalette.bg,
        accentColor: customPalette.border,
        badgeBg: customPalette.badge,
        colorHex: customPalette.hex,
        stats: { speed: 95, humor: 80, intelligence: 98, chaos: 30 },
        defaultMemory: `# Memory - ${name.trim()}\n- Autonomous task harness initialized.\n- High performance local model workflow.`,
        avatarSvg: generateCustomSvg(customEmoji, customPalette.svgBg),
      };
    } else {
      newChar = {
        ...selectedTemplate,
        id: `clone-${selectedTemplate.id}-${Date.now()}`,
        name: name.trim() || `${selectedTemplate.name}'s Clone`,
        title: title.trim() || selectedTemplate.title,
        role: role.trim() || selectedTemplate.role,
        quote: quote.trim() || selectedTemplate.quote,
      };
    }

    const chosenEngine = AI_ENGINES.find((e) => e.id === selectedEngineId) || AI_ENGINES[0];

    onAddCharacter(newChar, chosenEngine);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="cartoon-card max-w-xl w-full bg-white p-6 relative border-4 border-slate-900 shadow-[10px_10px_0px_#0f172a] rounded-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            cartoonAudio.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-slate-100 border-2 border-slate-900 rounded-xl hover:bg-rose-200 transition-colors shadow-[2px_2px_0px_#0f172a]"
        >
          <X className="w-5 h-5 text-slate-900" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center font-bold text-2xl animate-bounce">
            ✨
          </div>
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Spin Up New Cartoon Agent 🤖
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Create unlimited isolated agent clones & custom character desks for your workspace
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Base Template Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-extrabold text-slate-900 font-heading uppercase">
                CHOOSE AVATAR STYLE:
              </label>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-slate-900">
                {availableCharacters.length} Styles + Custom Builder
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-100 rounded-2xl border-2 border-slate-900">
              
              {/* Custom Builder Option Tile */}
              <button
                type="button"
                onClick={handleSelectCustomMode}
                className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all text-center flex flex-col items-center justify-center ${
                  selectedTemplate === 'custom'
                    ? 'bg-amber-300 shadow-[3px_3px_0px_#0f172a] ring-2 ring-slate-900 scale-105'
                    : 'bg-white hover:bg-amber-100'
                }`}
              >
                <div className="w-10 h-10 rounded-lg border border-slate-900 bg-amber-400 flex items-center justify-center text-xl shadow-[1px_1px_0px_#0f172a]">
                  🎨
                </div>
                <span className="text-[9px] font-extrabold text-slate-900 font-heading mt-1 leading-tight">
                  + Custom
                </span>
              </button>

              {/* Preset Characters Tiles */}
              {availableCharacters.map((char) => {
                const isSelected = typeof selectedTemplate === 'object' && selectedTemplate.id === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleSelectTemplate(char)}
                    className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all text-center flex flex-col items-center ${
                      isSelected
                        ? `${char.bgColor} shadow-[3px_3px_0px_#0f172a] ring-2 ring-slate-900 scale-105`
                        : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden border border-slate-900 bg-white mx-auto shadow-[1px_1px_0px_#0f172a]"
                      dangerouslySetInnerHTML={{ __html: char.avatarSvg }}
                    />
                    <span className="text-[9px] font-extrabold text-slate-900 font-heading block mt-1 truncate w-full">
                      {char.name}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          {/* CUSTOM AVATAR DESIGNER CONTROLS (If custom selected) */}
          {selectedTemplate === 'custom' && (
            <div className="p-3 bg-amber-50 border-2 border-slate-900 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-slate-900">
                <Palette className="w-4 h-4 text-amber-600" />
                <span>Custom Avatar Color & Icon Builder:</span>
              </div>

              {/* Emoji Icon Selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Choose Icon:</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        cartoonAudio.playPop();
                        setCustomEmoji(emoji);
                      }}
                      className={`w-8 h-8 rounded-lg border-2 border-slate-900 text-lg flex items-center justify-center transition-transform ${
                        customEmoji === emoji ? 'bg-amber-400 scale-110 shadow-[2px_2px_0px_#0f172a]' : 'bg-white hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette Selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Choose Color Theme:</label>
                <div className="flex flex-wrap gap-1.5">
                  {CUSTOM_COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => {
                        cartoonAudio.playPop();
                        setCustomPalette(pal);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-extrabold font-heading rounded-lg border-2 border-slate-900 transition-all ${
                        customPalette.id === pal.id
                          ? `${pal.bg} ${pal.border} ring-2 ring-slate-900 scale-105 shadow-[2px_2px_0px_#0f172a]`
                          : 'bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pal.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Clone Agent Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dwight (Senior Security)"
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Job Title & Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead QA & Automated Test Enforcer"
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* AI Engine Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Primary AI Engine Powering Agent Desk:</span>
              <span className="text-[10px] text-amber-700 font-mono font-bold">100% Local Sandbox</span>
            </label>
            <div className="relative">
              <select
                value={selectedEngineId}
                onChange={(e) => setSelectedEngineId(e.target.value)}
                className="w-full text-xs font-bold font-mono px-3 py-2 bg-amber-50 border-2 border-slate-900 rounded-xl focus:outline-none cursor-pointer"
              >
                {workerEngines.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.logoText} {eng.name} ({eng.defaultModel}) — {eng.provider}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Agent Custom Quote / System Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Agent Catchphrase / Motto</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. Identity terminal ready. Let's ship feature PRs!"
              className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t-2 border-slate-900 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 border-2 border-slate-900 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cartoon-button-primary px-5 py-2.5 text-xs flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold shadow-[4px_4px_0px_#0f172a]"
            >
              <Plus className="w-4 h-4" /> Spin Up Agent Harness
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
