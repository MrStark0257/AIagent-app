import { useState } from 'react';
import { Header, type PlatformTab } from './components/Header';
import { OfficeSpace } from './components/OfficeSpace';
import { LeadHunter } from './components/LeadHunter';
import { AuditStudio } from './components/AuditStudio';
import { OutreachStudio } from './components/OutreachStudio';
import { FollowUpSequencer } from './components/FollowUpSequencer';
import { SalesPipeline } from './components/SalesPipeline';
import { HarnessStudioModal } from './components/HarnessStudioModal';
import { AddAgentModal } from './components/AddAgentModal';
import { CHARACTERS, type CartoonCharacter } from './data/characters';
import { INITIAL_LEADS, type Lead } from './services/leadScraper';
import { runWebsiteAudit, type WebsiteAuditReport } from './services/websiteAuditor';
import type { GeneratedOutreach } from './services/outreachGenerator';
import { ShieldCheck, Heart, Laptop } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<PlatformTab>('floor');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState<boolean>(false);

  // Dynamic Agents state
  const [charactersList, setCharactersList] = useState<CartoonCharacter[]>(CHARACTERS);
  const [newlyAddedAgent, setNewlyAddedAgent] = useState<{ character: CartoonCharacter; aiEngine?: any } | null>(null);

  // Active state objects across modules
  const [pipelineLeads, setPipelineLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(INITIAL_LEADS[0]);
  const [selectedAudit, setSelectedAudit] = useState<WebsiteAuditReport | undefined>(() =>
    runWebsiteAudit(INITIAL_LEADS[0].website, INITIAL_LEADS[0].companyName)
  );
  const [activeOutreach, setActiveOutreach] = useState<GeneratedOutreach | undefined>();

  const handleAddCharacter = (newChar: CartoonCharacter, initialEngine?: any) => {
    setCharactersList((prev) => [newChar, ...prev]);
    setNewlyAddedAgent({ character: newChar, aiEngine: initialEngine });
  };

  const handleAuditLead = (lead: Lead) => {
    setSelectedLead(lead);
    const audit = runWebsiteAudit(lead.website, lead.companyName);
    setSelectedAudit(audit);
    setActiveTab('audit');
  };

  const handleGenerateOutreach = (lead: Lead) => {
    setSelectedLead(lead);
    const audit = runWebsiteAudit(lead.website, lead.companyName);
    setSelectedAudit(audit);
    setActiveTab('outreach');
  };

  const handleAddToPipeline = (lead: Lead) => {
    setPipelineLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) return prev;
      return [lead, ...prev];
    });
  };

  const handleOutreachWithAudit = (lead?: Lead, audit?: WebsiteAuditReport) => {
    if (lead) setSelectedLead(lead);
    if (audit) setSelectedAudit(audit);
    setActiveTab('outreach');
  };

  const handleSendToSequencer = (lead: Lead, outreach: GeneratedOutreach) => {
    setSelectedLead(lead);
    setActiveOutreach(outreach);
    handleAddToPipeline(lead);
    setActiveTab('sequencer');
  };

  const handleMoveToCRM = (lead: Lead, stage: 'demo_scheduled' | 'closed_won') => {
    setPipelineLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: stage } : l))
    );
    setActiveTab('crm');
  };

  const [isAutoHunting, setIsAutoHunting] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-grid-dots bg-[#f6f8fd] text-slate-900 flex flex-col font-['Outfit',sans-serif]">
      
      {/* Platform Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenHarnessStudioModal={() => setIsStudioModalOpen(true)}
      />

      {/* Main Platform Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* Module 0: Autonomous Virtual Cartoon AI Office Floor */}
        {activeTab === 'floor' && (
          <OfficeSpace
            onOpenHarnessStudio={() => setIsStudioModalOpen(true)}
            onOpenAddAgent={() => setIsAddModalOpen(true)}
            newlyAddedEmployee={newlyAddedAgent}
            isAutoHunting={isAutoHunting}
            onToggleAutoHunting={(val) => setIsAutoHunting(val)}
          />
        )}

        {/* Module 1: AI Lead Hunter & Scraper */}
        {activeTab === 'lead-hunter' && (
          <LeadHunter
            onAuditLead={handleAuditLead}
            onGenerateOutreach={handleGenerateOutreach}
            onAddToPipeline={handleAddToPipeline}
            isAutoHunting={isAutoHunting}
            onToggleAutoHunting={(val) => setIsAutoHunting(val)}
          />
        )}

        {/* Module 2: AI Website Audit Studio */}
        {activeTab === 'audit' && (
          <AuditStudio
            selectedLead={selectedLead}
            onGenerateOutreachWithAudit={handleOutreachWithAudit}
            onAddToCRM={(lead) => {
              if (lead) handleAddToPipeline(lead);
              setActiveTab('crm');
            }}
          />
        )}

        {/* Module 3: AI Personalized Outreach & Copywriter */}
        {activeTab === 'outreach' && (
          <OutreachStudio
            selectedLead={selectedLead}
            selectedAudit={selectedAudit}
            onSendToSequencer={handleSendToSequencer}
          />
        )}

        {/* Module 4: Automated Drip Sequencer */}
        {activeTab === 'sequencer' && (
          <FollowUpSequencer
            activeLead={selectedLead}
            activeOutreach={activeOutreach}
            onMoveToCRM={handleMoveToCRM}
          />
        )}

        {/* Module 5: Sales CRM Pipeline & Analytics */}
        {activeTab === 'crm' && (
          <SalesPipeline
            pipelineLeads={pipelineLeads}
            onSelectLead={(lead) => {
              setSelectedLead(lead);
              handleAuditLead(lead);
            }}
          />
        )}

      </main>

      {/* 3-Step Harness Studio Toggleable Modal */}
      <HarnessStudioModal
        isOpen={isStudioModalOpen}
        onClose={() => setIsStudioModalOpen(false)}
      />

      {/* Add Agent Custom Modal */}
      <AddAgentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCharacter={handleAddCharacter}
        availableCharacters={charactersList}
      />

      {/* Platform Footer */}
      <footer className="bg-white border-t-4 border-slate-900 py-6 px-4 text-center mt-12 shadow-[0_-4px_0_0_#0f172a]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold">
              🤖
            </span>
            <span className="font-heading text-sm text-slate-900">
              AgentHarness • Production Multi-Agent Sales Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-700">
            <span className="flex items-center gap-1">
              <Laptop className="w-4 h-4 text-emerald-600" /> Runs 100% on Laptop Sandbox
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-600" /> Zero Key Leakage
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Autonomous Agents
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
