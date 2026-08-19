import React, { useState } from 'react';
import { CHARACTERS, type CartoonCharacter } from '../data/characters';
import { X, Plus } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharacter: (character: CartoonCharacter) => void;
}

export const AddAgentModal: React.FC<AddAgentModalProps> = ({
  isOpen,
  onClose,
  onAddCharacter,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role] = useState('Full Stack Developer');
  const [selectedTemplate, setSelectedTemplate] = useState<CartoonCharacter>(CHARACTERS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    cartoonAudio.playSuccess();
    const newChar: CartoonCharacter = {
      ...selectedTemplate,
      id: `custom-${Date.now()}`,
      name: name.trim(),
      title: title.trim() || 'AI Office Clone',
      role: role,
      quote: `Ready to assist in local workspace tasks!`,
    };

    onAddCharacter(newChar);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="cartoon-card max-w-lg w-full bg-white p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            cartoonAudio.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 bg-slate-100 border-2 border-slate-900 rounded-xl hover:bg-rose-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-900" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-bold text-xl">
            ✨
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-slate-900">
              Spin Up New Cartoon Agent
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Create an isolated harness clone for your local workspace
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Base Template Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 font-heading uppercase">
              Choose Avatar Style:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => {
                    cartoonAudio.playPop();
                    setSelectedTemplate(char);
                    if (!name) setName(`${char.name}'s Clone`);
                    if (!title) setTitle(char.title);
                  }}
                  className={`p-1 rounded-xl border-2 border-slate-900 transition-all ${
                    selectedTemplate.id === char.id
                      ? `${char.bgColor} shadow-[3px_3px_0px_#0f172a] ring-2 ring-amber-400 scale-105`
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden border border-slate-900 bg-white mx-auto"
                    dangerouslySetInnerHTML={{ __html: char.avatarSvg }}
                  />
                  <span className="text-[10px] font-bold text-slate-900 font-heading block mt-0.5 truncate">
                    {char.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
              className="cartoon-button-primary px-5 py-2 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Spin Up Agent Harness
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
