import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { Lock, Play, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface HandoffMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  messageText: string;
  status: 'blocked' | 'sent' | 'unblocked';
  timestamp: string;
  prLink?: string;
}

export const StepThreeOfficeWork: React.FC = () => {
  const [messages, setMessages] = useState<HandoffMessage[]>([
    {
      id: 'msg-1',
      senderId: 'jim',
      receiverId: 'pam',
      senderName: "Jim's Clone",
      receiverName: "Pam's Clone",
      messageText: 'Blocked — need the invoice-state design tokens.',
      status: 'blocked',
      timestamp: '03:12 • encrypted',
    },
    {
      id: 'msg-2',
      senderId: 'pam',
      receiverId: 'jim',
      senderName: "Pam's Clone",
      receiverName: "Jim's Clone",
      messageText: 'Sent — tokens + edge-case flows in billing/tokens.json.',
      status: 'sent',
      timestamp: '03:12 • encrypted',
    },
    {
      id: 'msg-3',
      senderId: 'dwight',
      receiverId: 'jim',
      senderName: "Dwight's Clone",
      receiverName: "Jim's Clone",
      messageText: 'Verified zero security violations. All keys protected locally.',
      status: 'unblocked',
      timestamp: '03:13 • encrypted',
      prLink: 'PR #147 open',
    },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSender, setSelectedSender] = useState('jim');
  const [selectedReceiver, setSelectedReceiver] = useState('pam');
  const [customText, setCustomText] = useState('');

  const handleSimulateHandoff = () => {
    cartoonAudio.playPop(450);
    setIsSimulating(true);

    setTimeout(() => {
      cartoonAudio.playPop(600);
      const newMsg1: HandoffMessage = {
        id: `sim-${Date.now()}-1`,
        senderId: 'dwight',
        receiverId: 'angela',
        senderName: "Dwight's Clone",
        receiverName: "Angela's Clone",
        messageText: 'Requesting strict QA scan on authentication subagent flow.',
        status: 'blocked',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • encrypted',
      };
      setMessages((prev) => [...prev, newMsg1]);
    }, 800);

    setTimeout(() => {
      cartoonAudio.playSuccess();
      const newMsg2: HandoffMessage = {
        id: `sim-${Date.now()}-2`,
        senderId: 'angela',
        receiverId: 'dwight',
        senderName: "Angela's Clone",
        receiverName: "Dwight's Clone",
        messageText: 'Sent — lint checks passed 100%. Cat photos approved.',
        status: 'sent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • encrypted',
        prLink: `PR #${Math.floor(Math.random() * 800 + 100)} open`,
      };
      setMessages((prev) => [...prev, newMsg2]);
      setIsSimulating(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 2200);
  };

  const handleAddCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    cartoonAudio.playPop(550);
    const senderChar = CHARACTERS.find((c) => c.id === selectedSender) || CHARACTERS[0];
    const receiverChar = CHARACTERS.find((c) => c.id === selectedReceiver) || CHARACTERS[1];

    const newMsg: HandoffMessage = {
      id: `custom-${Date.now()}`,
      senderId: senderChar.id,
      receiverId: receiverChar.id,
      senderName: `${senderChar.name}'s Clone`,
      receiverName: `${receiverChar.name}'s Clone`,
      messageText: customText.trim(),
      status: 'sent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • encrypted',
      prLink: `PR #${Math.floor(Math.random() * 900 + 100)} open`,
    };

    setMessages((prev) => [...prev, newMsg]);
    setCustomText('');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  const getCharById = (id: string) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-400 border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-center font-heading text-2xl font-bold text-slate-900 shrink-0">
          3
        </div>
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your office gets to work
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            Your clones work around the clock — and when one needs something, it messages another. <strong className="text-slate-900 underline decoration-purple-400 decoration-4">They hand off work, share context and unblock each other</strong>, all on your own machine.
          </p>
        </div>
      </div>

      {/* Office Collaboration Box */}
      <div className="cartoon-card bg-white p-5 md:p-6">
        
        {/* Mockup Top Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b-3 border-slate-900 bg-slate-50 p-3 rounded-xl border-2 shadow-[2px_2px_0px_#0f172a]">
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs md:text-sm font-bold text-slate-900 uppercase">
              JIM'S CLONE ⇄ PAM'S CLONE ⇄ OFFICE HIVE
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <span className="cartoon-badge px-2.5 py-1 text-xs bg-slate-900 text-amber-300 rounded-lg flex items-center gap-1">
              <Lock className="w-3 h-3" /> E2E Encrypted Local IPC
            </span>
            <button
              onClick={handleSimulateHandoff}
              disabled={isSimulating}
              className="cartoon-button-primary px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Handoff Running...' : 'Watch real handoff live →'}</span>
            </button>
          </div>

        </div>

        {/* Live Clone Chat Handoff Feed */}
        <div className="space-y-4 mb-6 max-h-[420px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const senderChar = getCharById(msg.senderId);
            const isBlocked = msg.status === 'blocked';
            const isSent = msg.status === 'sent';

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] transition-all ${
                  isBlocked
                    ? 'bg-slate-100/90'
                    : isSent
                    ? 'bg-amber-100/90'
                    : 'bg-emerald-100/90'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Sender Cartoon Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white overflow-hidden shrink-0"
                    dangerouslySetInnerHTML={{ __html: senderChar.avatarSvg }}
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs font-extrabold uppercase text-slate-800 tracking-wider">
                        {msg.senderName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-snug">
                      {msg.messageText}
                    </p>

                    {msg.prLink && (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-emerald-200 border-2 border-slate-900 rounded-full text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                        <span>unblocked overnight • {msg.prLink}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Custom Clone Handoff Form */}
        <form onSubmit={handleAddCustomMessage} className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-heading flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Simulate Custom Clone Message Handoff</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">From Clone:</label>
              <select
                value={selectedSender}
                onChange={(e) => setSelectedSender(e.target.value)}
                className="w-full text-xs font-bold px-3 py-1.5 bg-white border-2 border-slate-900 rounded-lg shadow-[1px_1px_0px_#0f172a]"
              >
                {CHARACTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}'s Clone ({c.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">To Clone:</label>
              <select
                value={selectedReceiver}
                onChange={(e) => setSelectedReceiver(e.target.value)}
                className="w-full text-xs font-bold px-3 py-1.5 bg-white border-2 border-slate-900 rounded-lg shadow-[1px_1px_0px_#0f172a]"
              >
                {CHARACTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}'s Clone ({c.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. 'Pam, please review design tokens in dark mode...'"
              className="w-full text-xs font-medium px-3 py-2 bg-white border-2 border-slate-900 rounded-xl focus:outline-none"
            />
            <button
              type="submit"
              className="cartoon-button-primary px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> Handoff
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
