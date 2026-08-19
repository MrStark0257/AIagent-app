import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ThreeCardOverview } from './ThreeCardOverview';
import { StepOneHarness } from './StepOneHarness';
import { StepTwoCommandCenter } from './StepTwoCommandCenter';
import { StepThreeOfficeWork } from './StepThreeOfficeWork';
import { CHARACTERS, type CartoonCharacter } from '../data/characters';
import { cartoonAudio } from '../utils/audio';

interface HarnessStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HarnessStudioModal: React.FC<HarnessStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCharacter, setActiveCharacter] = useState<CartoonCharacter>(CHARACTERS[0]);
  const [subView, setSubView] = useState<'cards' | 'step1' | 'step2' | 'step3'>('cards');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="cartoon-card w-full max-w-6xl bg-[#f6f8fd] p-4 sm:p-6 relative max-h-[92vh] flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b-3 border-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-bold text-xl">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900">
                  Harness Studio & 3 Working Steps
                </h3>
                <span className="cartoon-badge px-2 py-0.5 text-[10px] bg-pink-300 text-slate-900 rounded-full">
                  Original Architecture
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Install harness, setup shared memory, and inspect office clone handoffs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Nav */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              <button
                onClick={() => {
                  cartoonAudio.playClick();
                  setSubView('cards');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  subView === 'cards' ? 'bg-amber-400 text-slate-900' : 'text-slate-700'
                }`}
              >
                3-Card Grid
              </button>
              <button
                onClick={() => {
                  cartoonAudio.playClick();
                  setSubView('step1');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  subView === 'step1' ? 'bg-emerald-400 text-slate-900' : 'text-slate-700'
                }`}
              >
                Step 1
              </button>
              <button
                onClick={() => {
                  cartoonAudio.playClick();
                  setSubView('step2');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  subView === 'step2' ? 'bg-sky-400 text-slate-900' : 'text-slate-700'
                }`}
              >
                Step 2
              </button>
              <button
                onClick={() => {
                  cartoonAudio.playClick();
                  setSubView('step3');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  subView === 'step3' ? 'bg-purple-400 text-slate-900' : 'text-slate-700'
                }`}
              >
                Step 3
              </button>
            </div>

            {/* Close Modal Button */}
            <button
              onClick={() => {
                cartoonAudio.playPop();
                onClose();
              }}
              className="p-2 bg-rose-300 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a] hover:bg-rose-400 font-bold"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {subView === 'cards' && (
            <ThreeCardOverview
              activeCharacter={activeCharacter}
              onSelectStep={(step) => setSubView(step)}
            />
          )}

          {subView === 'step1' && (
            <StepOneHarness
              activeCharacter={activeCharacter}
              setActiveCharacter={setActiveCharacter}
              onProceedToStep2={() => setSubView('step2')}
            />
          )}

          {subView === 'step2' && (
            <StepTwoCommandCenter
              activeCharacter={activeCharacter}
              onProceedToStep3={() => setSubView('step3')}
            />
          )}

          {subView === 'step3' && (
            <StepThreeOfficeWork />
          )}
        </div>

      </div>
    </div>
  );
};
