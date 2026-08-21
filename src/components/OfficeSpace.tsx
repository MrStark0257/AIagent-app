import React, { useState, useEffect } from 'react';
import { CHARACTERS, type CartoonCharacter } from '../data/characters';
import { AI_ENGINES, type AIEngine } from '../data/aiEngines';
import { Sparkles, Monitor, Coffee, Server, Shield, Plus, Layers, Cpu, Calendar, CheckCircle2, Clock, Copy, Filter, BarChart3, Terminal, FileText } from 'lucide-react';
import { cartoonAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { generateExecutivePdfReport } from '../utils/pdfExporter';

interface OfficeSpaceProps {
  onOpenHarnessStudio: () => void;
  onOpenAddAgent: () => void;
  newlyAddedEmployee?: { character: CartoonCharacter; aiEngine?: AIEngine } | null;
  isAutoHunting?: boolean;
  onToggleAutoHunting?: (val: boolean) => void;
}

export interface WorkingEmployee {
  character: CartoonCharacter;
  aiEngine: AIEngine;
  status: 'typing' | 'designing' | 'reviewing' | 'coffee' | 'thinking';
  currentTask: string;
  linesOfCode: number;
  screenOutput: string;
}

export interface DailyWorkItem {
  id: string;
  time: string;
  agentId: string;
  agentName: string;
  task: string;
  output: string;
  category: 'Management' | 'Mailing' | 'BizDev' | 'Research' | 'Content' | 'Operations' | 'Planning';
  status: 'completed' | 'active' | 'queued';
  progress: number;
  loc: number;
}

export const getAgentRoleHelp = (char: CartoonCharacter) => {
  const title = char.title.toLowerCase();
  const id = char.id.toLowerCase();

  if (title.includes('manager') || id === 'michael') {
    return {
      capabilities: ['🧠 Work Assignment', '⏰ Deadline Monitoring', '📊 Project Reports'],
      placeholder: "e.g. 'Assign client report task & set Friday deadline'",
      presets: [
        '📢 Dispatch work directive to all floor agents',
        '⏰ Monitor project deadlines & agent progress',
        '📋 Collect executive briefing report for Boss'
      ]
    };
  }
  if (title.includes('mailing') || id === 'pam') {
    return {
      capabilities: ['📧 Client Emails', '✍️ Proposals & Quotes', '📬 Follow-up Automation'],
      placeholder: "e.g. 'Draft proposal for client & schedule follow-up email'",
      presets: [
        '✍️ Draft client proposal & pricing quote',
        '📬 Schedule 3-day follow-up email sequence',
        '📧 Answer client inquiry emails & FAQs'
      ]
    };
  }
  if (title.includes('bizdev') || title.includes('lead') || id === 'jim') {
    return {
      capabilities: ['💼 Client Finder', '🎯 Lead Evaluation', '📄 Lead Dossiers'],
      placeholder: "e.g. 'Scrape 20 target SaaS clients & evaluate deal budgets'",
      presets: [
        '💼 Find 20 target business prospects',
        '🎯 Evaluate lead budget & project urgency',
        '📄 Prepare structured lead dossier for Boss'
      ]
    };
  }
  if (title.includes('research') || id === 'dwight') {
    return {
      capabilities: ['🔎 Competitor Audits', '📊 Industry Trends', '📝 Tech & Design Specs'],
      placeholder: "e.g. 'Audit competitor pricing & research industry trends'",
      presets: [
        '🔎 Audit top 5 competitor websites & pricing',
        '📊 Research industry trends & target demographics',
        '📝 Compile design & technical requirements brief'
      ]
    };
  }
  if (title.includes('content') || title.includes('marketing') || id === 'stanley') {
    return {
      capabilities: ['📢 Marketing Plans', '📱 Social Media Ideas', '✍️ Website Copy'],
      placeholder: "e.g. 'Create Instagram content calendar & website marketing copy'",
      presets: [
        '📢 Create 30-day social media content plan',
        '✍️ Write high-converting website landing copy',
        '🚀 Design promotional campaign concept for business'
      ]
    };
  }
  if (title.includes('operations') || title.includes('client') || id === 'angela') {
    return {
      capabilities: ['📋 Client Onboarding', '🔄 Task Revisions', '✅ Delivery Checklists'],
      placeholder: "e.g. 'Onboard new client & verify delivery checklist'",
      presets: [
        '📋 Handle new client onboarding workflow',
        '🔄 Track client revision requests & feedback',
        '✅ Audit project milestone delivery checklist'
      ]
    };
  }

  return {
    capabilities: [`📋 ${char.role}`, '🎯 Task Execution', '⚡ Automated Workflow'],
    placeholder: `e.g. 'Assign ${char.role} task to ${char.name}'`,
    presets: [
      `🎯 Execute ${char.role} task for active project`,
      `📋 Process client requirements & task checklist`,
      `📊 Generate operational status report`
    ]
  };
};

export const getRoleAdaptedTask = (char: CartoonCharacter, directive: string) => {
  const title = char.title.toLowerCase();
  const id = char.id.toLowerCase();
  const cleanDirective = directive.trim();

  if (title.includes('bizdev') || title.includes('lead') || id === 'jim') {
    return `Find prospective clients & evaluate lead opportunities for "${cleanDirective}" (BizDev 💼)`;
  }
  if (title.includes('mailing') || id === 'pam') {
    return `Draft proposals, client emails & schedule follow-ups for "${cleanDirective}" (Mailing 📧)`;
  }
  if (title.includes('research') || id === 'dwight') {
    return `Audit target companies, competitors & specs for "${cleanDirective}" (Research 🔎)`;
  }
  if (title.includes('content') || title.includes('marketing') || id === 'stanley') {
    return `Create marketing plan, social media copy & campaign for "${cleanDirective}" (Content 📢)`;
  }
  if (title.includes('operations') || title.includes('client') || id === 'angela') {
    return `Handle client onboarding, task tracking & delivery checklist for "${cleanDirective}" (Operations 📋)`;
  }
  if (title.includes('resource') || id === 'kevin') {
    return `Track project resource allocation & client billing budget for "${cleanDirective}" (Operations 📊)`;
  }
  if (title.includes('outreach') || id === 'andy') {
    return `Pitch proposals & conduct introductory client calls for "${cleanDirective}" (Mailing 🎤)`;
  }
  if (title.includes('financial') || id === 'oscar') {
    return `Fact-check deal profitability & pricing benchmarks for "${cleanDirective}" (Research 💼)`;
  }
  if (id === 'cyber') {
    return `Run automated lead discovery, mail queues & checklist sync for "${cleanDirective}" (Operations 🤖)`;
  }

  return `Process specialized ${char.role} work for "${cleanDirective}"`;
};

export const OfficeSpace: React.FC<OfficeSpaceProps> = ({
  onOpenHarnessStudio,
  onOpenAddAgent,
  newlyAddedEmployee,
  isAutoHunting = true,
  onToggleAutoHunting,
}) => {
  const [employees, setEmployees] = useState<WorkingEmployee[]>([
    {
      character: CHARACTERS[0], // Jim - Lead / BizDev
      aiEngine: AI_ENGINES.find((e) => e.id === 'antigravity') || AI_ENGINES[5],
      status: 'typing',
      currentTask: 'Scraping target business clients & evaluating lead opportunities',
      linesOfCode: 1420,
      screenOutput: `[BIZDEV AGENT 💼]\nState: ACTIVE • Discovered 24 High-Value Prospects\n> Target Industries: SaaS, E-commerce, Design Agencies\n> Scope: Budget $5k-$25k verified`
    },
    {
      character: CHARACTERS[1], // Pam - Mailing
      aiEngine: AI_ENGINES.find((e) => e.id === 'claude-code') || AI_ENGINES[1],
      status: 'designing',
      currentTask: 'Drafting client proposals & scheduling follow-up email sequences',
      linesOfCode: 850,
      screenOutput: `[MAILING AGENT 📧]\nState: ACTIVE • 18 Client Emails & Proposals Sent\n> Status: 85% Open Rate • 4 Follow-ups Auto-Scheduled\n> Proposals Sent: 6 Enterprise Quotes`
    },
    {
      character: CHARACTERS[2], // Michael - Manager Agent 🧠
      aiEngine: AI_ENGINES.find((e) => e.id === 'director-ai') || AI_ENGINES[0],
      status: 'thinking',
      currentTask: '👑 Assigning work, tracking deadlines & preparing project reports',
      linesOfCode: 4800,
      screenOutput: `[MANAGER AGENT 🧠]\nState: ACTIVE • Executive Floor Orchestration\n> Assigns work to all specialized agency desks\n> Monitoring deadlines & preparing Boss project reports!`
    },
    {
      character: CHARACTERS[3], // Dwight - Research Agent 🔎
      aiEngine: AI_ENGINES.find((e) => e.id === 'grok') || AI_ENGINES[3],
      status: 'reviewing',
      currentTask: 'Auditing company background, competitors & project requirements',
      linesOfCode: 2100,
      screenOutput: `[RESEARCH AGENT 🔎]\nState: ACTIVE • Competitor Intelligence Brief Ready\n> Audited 10 Competitor Sites & Design Specs\n> Intelligence Report Verified`
    },
    {
      character: CHARACTERS[4], // Angela - Operations / Client Agent 📋
      aiEngine: AI_ENGINES.find((e) => e.id === 'copilot') || AI_ENGINES[10],
      status: 'reviewing',
      currentTask: 'Handling client onboarding, task tracking & delivery checklists',
      linesOfCode: 1100,
      screenOutput: `[OPERATIONS AGENT 📋]\nState: ACTIVE • Onboarding Checklist 100% Complete\n> 12/12 Client Milestones & Revisions Tracked\n> Zero Pending Delivery Blockers`
    },
    {
      character: CHARACTERS[5], // Kevin - Cost Specialist 📊
      aiEngine: AI_ENGINES.find((e) => e.id === 'qwen') || AI_ENGINES[6],
      status: 'coffee',
      currentTask: 'Tracking project resource costs & client billing margins',
      linesOfCode: 640,
      screenOutput: `[BUDGET ANALYST 📊]\nState: ACTIVE • Client Margin: +42%\n> Cost Savings: $1,250 (100% Local Models)`
    }
  ]);

  const [selectedDeskId, setSelectedDeskId] = useState<string>('jim');
  const [customTaskInput, setCustomTaskInput] = useState<string>('');
  const [activityTab, setActivityTab] = useState<'daily' | 'live' | 'stats'>('daily');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);

  // New task form state inside Daily Work
  const [newLogAgent, setNewLogAgent] = useState<string>('jim');
  const [newLogTask, setNewLogTask] = useState<string>('');
  const [newLogCategory, setNewLogCategory] = useState<DailyWorkItem['category']>('BizDev');

  const [activeFloorSpeech, setActiveFloorSpeech] = useState<{ [key: string]: string }>({
    jim: "Antigravity 2.0 typing code...",
    pam: "Claude Code design tokens ready!",
    michael: "Codex orchestrating floor!",
  });

  const [floorActivityLog, setFloorActivityLog] = useState<string[]>([
    "🏢 Office Floor active in 100% Local Laptop Sandbox.",
    "👨‍💻 Jim working with Antigravity 2.0 at Desk 1.",
    "👔 Michael working with Codex at Desk 3."
  ]);

  // Synchronize Jim (Lead Agent 💼) status with Auto-Hunter toggle
  useEffect(() => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.character.id === 'jim' || emp.character.title.includes('BizDev') || emp.character.title.includes('Lead')) {
          if (isAutoHunting) {
            return {
              ...emp,
              status: 'typing' as const,
              currentTask: '⚡ [AUTO-HUNTER ACTIVE] Scraping & evaluating client leads in background',
              screenOutput: `[${emp.aiEngine.name.toUpperCase()} • BIZDEV AGENT 💼]\nState: 🟢 AUTO-HUNTER ENGINE ACTIVE (6.5s Interval)\n> Continuously scanning target directories for verified leads...\n> Auto-populating high-intent prospects for Boss!`
            };
          } else {
            return {
              ...emp,
              status: 'coffee' as const,
              currentTask: '⏸️ Auto-Hunter Paused by Boss',
              screenOutput: `[${emp.aiEngine.name.toUpperCase()} • BIZDEV AGENT 💼]\nState: ⏸️ AUTO-HUNTER ENGINE PAUSED\n> Lead Hunter auto-discovery is currently stopped.\n> Standing by for directive from Boss or Manager.`
            };
          }
        }
        return emp;
      })
    );

    setActiveFloorSpeech(prev => ({
      ...prev,
      jim: isAutoHunting
        ? '⚡ Auto-Hunter active! Finding leads automatically.'
        : '☕ Auto-Hunter paused! Standing by.'
    }));
  }, [isAutoHunting]);

  // Dynamically add newly created agent harnesses to office floor
  useEffect(() => {
    if (newlyAddedEmployee && newlyAddedEmployee.character) {
      const newChar = newlyAddedEmployee.character;
      const isNewCharManager = newChar.id === 'michael' || newChar.role.toLowerCase().includes('manager') || newChar.title.toLowerCase().includes('director');
      const rawEngine = newlyAddedEmployee.aiEngine || AI_ENGINES[1];
      const engine = (rawEngine.isManagerOnly && !isNewCharManager)
        ? (AI_ENGINES.find((e) => !e.isManagerOnly) || AI_ENGINES[1])
        : rawEngine;
      const newEmp: WorkingEmployee = {
        character: newChar,
        aiEngine: engine,
        status: 'typing',
        currentTask: newChar.quote || 'Autonomous task execution initialized',
        linesOfCode: Math.floor(Math.random() * 500) + 200,
        screenOutput: `[${engine.name.toUpperCase()} AGENT INITIALIZED]\nState: ACTIVE • Isolated Local Harness\nRole: ${newChar.role}`
      };

      setEmployees(prev => {
        if (prev.some(e => e.character.id === newChar.id)) return prev;
        return [...prev, newEmp];
      });

      setSelectedDeskId(newChar.id);
      setActiveFloorSpeech(prev => ({
        ...prev,
        [newChar.id]: `Agent ${newChar.name} online! 🚀`
      }));

      setFloorActivityLog(prev => [
        `✨ Spun up new agent harness desk: ${newChar.name} (${newChar.role})`,
        ...prev.slice(0, 7)
      ]);
    }
  }, [newlyAddedEmployee]);

  // Initial Daily Work List
  const [dailyWorkList, setDailyWorkList] = useState<DailyWorkItem[]>([
    {
      id: 'dw-1',
      time: '12:35 PM',
      agentId: 'jim',
      agentName: 'Jim',
      task: 'Discovered 24 qualified prospective clients & prepared lead dossiers',
      output: '24 Leads Verified',
      category: 'BizDev',
      status: 'completed',
      progress: 100,
      loc: 1420
    },
    {
      id: 'dw-2',
      time: '12:15 PM',
      agentId: 'pam',
      agentName: 'Pam',
      task: 'Sent 18 client proposals & scheduled follow-up email sequences',
      output: '18 Emails Sent',
      category: 'Mailing',
      status: 'completed',
      progress: 100,
      loc: 850
    },
    {
      id: 'dw-3',
      time: '11:50 AM',
      agentId: 'michael',
      agentName: 'Michael',
      task: 'Assigned daily agency tasks, set deadlines & prepared project reports',
      output: 'Project Reports Ready',
      category: 'Management',
      status: 'completed',
      progress: 100,
      loc: 3200
    },
    {
      id: 'dw-4',
      time: '11:20 AM',
      agentId: 'dwight',
      agentName: 'Dwight',
      task: 'Researched target companies, competitors & project requirements',
      output: 'Research Brief OK',
      category: 'Research',
      status: 'completed',
      progress: 100,
      loc: 2100
    },
    {
      id: 'dw-5',
      time: '10:45 AM',
      agentId: 'angela',
      agentName: 'Angela',
      task: 'Handled client onboarding, task tracking & delivery checklists',
      output: 'Checklist 100% OK',
      category: 'Operations',
      status: 'completed',
      progress: 100,
      loc: 1100
    },
    {
      id: 'dw-6',
      time: '10:10 AM',
      agentId: 'stanley',
      agentName: 'Stanley',
      task: 'Created promotional marketing plan & social media campaign ideas',
      output: 'Campaign Ready',
      category: 'Content',
      status: 'completed',
      progress: 100,
      loc: 940
    },
    {
      id: 'dw-7',
      time: '09:30 AM',
      agentId: 'jim',
      agentName: 'Jim',
      task: 'Evaluated lead requirements & budget scope for enterprise account',
      output: 'High Priority',
      category: 'BizDev',
      status: 'completed',
      progress: 100,
      loc: 350
    },
    {
      id: 'dw-8',
      time: '09:00 AM',
      agentId: 'michael',
      agentName: 'Michael',
      task: 'Morning standup & agency briefing report compiled for Boss',
      output: 'Report Delivered',
      category: 'Planning',
      status: 'completed',
      progress: 100,
      loc: 180
    }
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
      ...prev.slice(0, 7)
    ]);
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;

    cartoonAudio.playSuccess();
    const task = customTaskInput.trim();
    const targetEmp = employees.find(e => e.character.id === selectedDeskId) || employees[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      ...prev.slice(0, 7)
    ]);

    // Append to Daily Work Log Timeline
    const newWorkItem: DailyWorkItem = {
      id: `dw-${Date.now()}`,
      time: nowTime,
      agentId: selectedDeskId,
      agentName: targetEmp.character.name,
      task: task,
      output: `Executing in ${targetEmp.aiEngine.name}`,
      category: (targetEmp.character.title.includes('Mailing') ? 'Mailing' :
        targetEmp.character.title.includes('BizDev') ? 'BizDev' :
        targetEmp.character.title.includes('Research') ? 'Research' :
        targetEmp.character.title.includes('Content') ? 'Content' :
        targetEmp.character.title.includes('Manager') ? 'Management' : 'Operations') as DailyWorkItem['category'],
      status: 'active',
      progress: 65,
      loc: Math.floor(Math.random() * 180) + 40
    };
    setDailyWorkList(prev => [newWorkItem, ...prev]);

    setCustomTaskInput('');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const handleAddManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTask.trim()) return;

    cartoonAudio.playSuccess();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetChar = CHARACTERS.find(c => c.id === newLogAgent) || CHARACTERS[0];

    const newItem: DailyWorkItem = {
      id: `dw-${Date.now()}`,
      time: nowTime,
      agentId: newLogAgent,
      agentName: targetChar.name,
      task: newLogTask.trim(),
      output: 'Task Logged to Daily Summary',
      category: newLogCategory,
      status: 'completed',
      progress: 100,
      loc: Math.floor(Math.random() * 250) + 50
    };

    setDailyWorkList(prev => [newItem, ...prev]);
    setNewLogTask('');
    setShowAddLogModal(false);
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleCopyReport = () => {
    cartoonAudio.playSuccess();
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let report = `# 📅 DAILY WORK REPORT - ${dateStr}\n\n`;
    report += `## 📊 Today's Work Summary\n`;
    report += `- Total Tasks Completed: ${dailyWorkList.length}\n`;
    report += `- Total Lines of Code Built Today: ${dailyWorkList.reduce((acc, curr) => acc + curr.loc, 0).toLocaleString()} LOC\n`;
    report += `- Active Agents: 6 Working Desks (Jim, Pam, Michael, Dwight, Angela, Kevin)\n\n`;
    report += `## 📋 Hourly Task Log Breakdown\n\n`;
    
    dailyWorkList.forEach(item => {
      report += `- **[${item.time}] ${item.agentName}** (${item.category}): ${item.task} ➔ *Output: ${item.output}* [${item.loc} LOC]\n`;
    });
    
    navigator.clipboard.writeText(report);
    setCopyToast(true);
    confetti({ particleCount: 60, spread: 60 });
    setTimeout(() => setCopyToast(false), 3000);
  };

  const managerEmployee = employees.find(e =>
    e.character.id === 'michael' ||
    e.character.role.toLowerCase().includes('manager') ||
    e.character.role.toLowerCase().includes('director') ||
    e.character.title.toLowerCase().includes('director')
  ) || employees[0];

  const workerEmployees = employees.filter(e => e.character.id !== managerEmployee.character.id);

  // State for Manager Task Dispatcher
  const [dispatchWorkerId, setDispatchWorkerId] = useState<string>('all');

  const handleManagerBroadcast = () => {
    cartoonAudio.playSuccess();
    const directive = prompt("Enter Manager Directive / Floor Announcement:", "All hands on deck! Ship feature PRs & pass QA unit tests!");
    if (!directive || !directive.trim()) return;

    const newSpeech: { [key: string]: string } = {};
    employees.forEach(emp => {
      newSpeech[emp.character.id] = `📢 Director: "${directive.trim().slice(0, 26)}..."`;
    });
    setActiveFloorSpeech(newSpeech);

    setFloorActivityLog(prev => [
      `📢 MANAGER DIRECTIVE BROADCAST: "${directive.trim()}"`,
      ...prev.slice(0, 7)
    ]);

    confetti({ particleCount: 90, spread: 75, origin: { y: 0.4 } });
  };

  const handleManagerDispatchWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;

    cartoonAudio.playSuccess();
    const task = customTaskInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (dispatchWorkerId === 'all') {
      // Assign role-specific specialized sub-tasks to each worker agent
      setEmployees(prev =>
        prev.map(emp => {
          if (emp.character.id === managerEmployee.character.id) {
            return {
              ...emp,
              currentTask: `👑 Supervising Floor on Directive: "${task}"`,
              screenOutput: `[MANAGER DISPATCHER 🧠]\n> Directive: "${task}"\n> Role-specific specialized tasks assigned to all ${workerEmployees.length} Agents\n> Status: Monitoring progress & compiling project report for Boss!`
            };
          } else {
            const roleTask = getRoleAdaptedTask(emp.character, task);
            return {
              ...emp,
              currentTask: roleTask,
              status: 'typing',
              screenOutput: `[${emp.aiEngine.name.toUpperCase()} • ${emp.character.title}]\n> ROLE TASK FROM MANAGER (${managerEmployee.character.name}):\n> ${roleTask}\n> Speed: ${emp.aiEngine.speed}`
            };
          }
        })
      );

      const newSpeech: { [key: string]: string } = {};
      employees.forEach(emp => {
        if (emp.character.id === managerEmployee.character.id) {
          newSpeech[emp.character.id] = `👑 Assigned specialized role tasks to all!`;
        } else {
          newSpeech[emp.character.id] = `🫡 Working on my specialized ${emp.character.role} task!`;
        }
      });
      setActiveFloorSpeech(newSpeech);

      setFloorActivityLog(prev => [
        `👑 MANAGER DISPATCHED ROLE-SPECIFIC TASKS TO ALL WORKERS FOR DIRECTIVE: "${task}"`,
        ...prev.slice(0, 7)
      ]);

      // Log daily work items for workers with role-adapted tasks
      const newItems: DailyWorkItem[] = workerEmployees.map(w => {
        const roleTask = getRoleAdaptedTask(w.character, task);
        const category = (w.character.title.includes('Mailing') ? 'Mailing' :
          w.character.title.includes('BizDev') ? 'BizDev' :
          w.character.title.includes('Research') ? 'Research' :
          w.character.title.includes('Content') ? 'Content' :
          w.character.title.includes('Manager') ? 'Management' : 'Operations') as DailyWorkItem['category'];

        return {
          id: `dw-${Date.now()}-${w.character.id}`,
          time: nowTime,
          agentId: w.character.id,
          agentName: w.character.name,
          task: roleTask,
          output: `Role Task Assigned by Manager`,
          category: category,
          status: 'active',
          progress: 75,
          loc: Math.floor(Math.random() * 200) + 50
        };
      });
      setDailyWorkList(prev => [...newItems, ...prev]);

    } else {
      // Assign to specific worker with role-awareness
      const targetWorker = employees.find(e => e.character.id === dispatchWorkerId);
      if (!targetWorker) return;

      const roleTask = getRoleAdaptedTask(targetWorker.character, task);

      setEmployees(prev =>
        prev.map(emp => {
          if (emp.character.id === dispatchWorkerId) {
            return {
              ...emp,
              currentTask: roleTask,
              status: 'typing',
              screenOutput: `[${emp.aiEngine.name.toUpperCase()} • ${targetWorker.character.title}]\n> ROLE TASK FROM MANAGER (${managerEmployee.character.name}):\n> ${roleTask}`
            };
          }
          if (emp.character.id === managerEmployee.character.id) {
            return {
              ...emp,
              currentTask: `Supervising ${targetWorker.character.name} on: "${roleTask}"`,
              screenOutput: `[MANAGER DISPATCHER 🧠]\n> Assigned role task to ${targetWorker.character.name} (${targetWorker.character.title})\n> Task: "${roleTask}"\n> Status: Awaiting completion report.`
            };
          }
          return emp;
        })
      );

      setActiveFloorSpeech(prev => ({
        ...prev,
        [managerEmployee.character.id]: `👑 Assigned role task to ${targetWorker.character.name}!`,
        [targetWorker.character.id]: `🫡 On it, Manager!`
      }));

      setFloorActivityLog(prev => [
        `👑 MANAGER DISPATCHED ROLE TASK TO ${targetWorker.character.name.toUpperCase()}: "${roleTask}"`,
        ...prev.slice(0, 7)
      ]);

      const newItem: DailyWorkItem = {
        id: `dw-${Date.now()}`,
        time: nowTime,
        agentId: targetWorker.character.id,
        agentName: targetWorker.character.name,
        task: roleTask,
        output: `Assigned by Manager ${managerEmployee.character.name}`,
        category: (targetWorker.character.title.includes('Mailing') ? 'Mailing' :
          targetWorker.character.title.includes('BizDev') ? 'BizDev' :
          targetWorker.character.title.includes('Research') ? 'Research' :
          targetWorker.character.title.includes('Content') ? 'Content' :
          targetWorker.character.title.includes('Manager') ? 'Management' : 'Operations') as DailyWorkItem['category'],
        status: 'active',
        progress: 80,
        loc: Math.floor(Math.random() * 200) + 60
      };
      setDailyWorkList(prev => [newItem, ...prev]);
    }

    setCustomTaskInput('');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
  };

  const handleManagerCollectReport = () => {
    cartoonAudio.playSuccess();
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let report = `# 👑 MANAGER EXECUTIVE BRIEFING REPORT FOR YOU (BOSS)\n`;
    report += `*Generated by Manager ${managerEmployee.character.name} at ${nowTime} on ${dateStr}*\n\n`;
    report += `---\n\n`;
    report += `## 📊 Executive Workforce Summary\n`;
    report += `- **Total Active Workforce**: ${workerEmployees.length} Worker Agents\n`;
    report += `- **Total Tasks Supervised & Executed**: ${dailyWorkList.length} Tasks\n`;
    report += `- **Total Code Built Across Floor**: ${dailyWorkList.reduce((acc, curr) => acc + curr.loc, 0).toLocaleString()} Lines of Code\n`;
    report += `- **Manager Supervision Status**: 100% Active (All Key Leaks Prevented)\n\n`;
    report += `## 👨‍💻 Worker Agents Work Breakdown Report\n\n`;

    employees.forEach(emp => {
      if (emp.character.id !== managerEmployee.character.id) {
        report += `### 📌 ${emp.character.name} (${emp.character.title})\n`;
        report += `- **AI Engine Powering Desk**: ${emp.aiEngine.name} (${emp.aiEngine.provider})\n`;
        report += `- **Active Task**: ${emp.currentTask}\n`;
        report += `- **Total Code Output**: ${emp.linesOfCode.toLocaleString()} LOC\n`;
        report += `- **Status**: ${emp.status.toUpperCase()}\n\n`;
      }
    });

    report += `## 📋 Complete Daily Tasks Log Collected By Manager\n\n`;
    dailyWorkList.forEach(item => {
      report += `- **[${item.time}] ${item.agentName}**: ${item.task} ➔ *Result: ${item.output}* [${item.loc} LOC]\n`;
    });

    report += `\n---\n*Manager Directive: All reports verified and ready for Boss review! 👑*`;

    navigator.clipboard.writeText(report);
    setCopyToast(true);

    setActiveFloorSpeech(prev => ({
      ...prev,
      [managerEmployee.character.id]: `👑 Boss, I collected all work reports for you! 📋`
    }));

    setFloorActivityLog(prev => [
      `📋 MANAGER ${managerEmployee.character.name.toUpperCase()} COLLECTED ALL WORK REPORTS & DELIVERED TO BOSS!`,
      ...prev.slice(0, 7)
    ]);

    confetti({ particleCount: 110, spread: 90, origin: { y: 0.4 } });
    setTimeout(() => setCopyToast(false), 3500);
  };

  const handleManagerAutoDelegate = () => {
    cartoonAudio.playSuccess();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const specializedTasks: { [key: string]: { task: string; category: DailyWorkItem['category']; loc: number } } = {
      jim: { task: 'Find potential clients, evaluate leads & prepare lead dossiers (BizDev 💼)', category: 'BizDev', loc: 320 },
      pam: { task: 'Draft proposals, send client emails & schedule follow-up sequences (Mailing 📧)', category: 'Mailing', loc: 280 },
      dwight: { task: 'Audit target companies, competitors & project requirements (Research 🔎)', category: 'Research', loc: 290 },
      stanley: { task: 'Create marketing plans, social media ideas & website content (Content 📢)', category: 'Content', loc: 310 },
      angela: { task: 'Handle client onboarding, task tracking & delivery checklists (Operations 📋)', category: 'Operations', loc: 240 },
      kevin: { task: 'Track project costs, resource allocation & client billing margins (Operations 📋)', category: 'Operations', loc: 190 },
      andy: { task: 'Conduct introductory client calls & pitch proposal presentations (Mailing 📧)', category: 'Mailing', loc: 210 },
      oscar: { task: 'Fact-check contract pricing & financial benchmarks (Research 🔎)', category: 'Research', loc: 220 },
      cyber_ai: { task: 'Run automated lead discovery, mail queues & checklist sync (Operations 📋)', category: 'Operations', loc: 410 },
    };

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.character.id === managerEmployee.character.id) {
          return {
            ...emp,
            currentTask: `👑 Director AI Auto-Delegated Tasks to ${workerEmployees.length} Workers`,
            screenOutput: `[DIRECTOR AI ULTRA ORCHESTRATOR]\nState: ZERO-DELAY DELEGATION COMPLETE\n> Dispatched specialized tasks to all desks instantly.\n> Monitoring execution & preparing Boss report!`
          };
        }

        const taskInfo = specializedTasks[emp.character.id] || {
          task: `Build & optimize ${emp.character.role} microservices`,
          category: 'Coding' as const,
          loc: 250
        };

        return {
          ...emp,
          currentTask: taskInfo.task,
          status: 'typing' as const,
          screenOutput: `[${emp.aiEngine.name.toUpperCase()}]\n> INSTANT DELEGATION FROM DIRECTOR AI (${managerEmployee.character.name}):\n> Task: ${taskInfo.task}\n> Speed: ${emp.aiEngine.speed}`
        };
      })
    );

    const newSpeech: { [key: string]: string } = {};
    employees.forEach(emp => {
      if (emp.character.id === managerEmployee.character.id) {
        newSpeech[emp.character.id] = `⚡ Director AI delegated all tasks instantly!`;
      } else {
        newSpeech[emp.character.id] = `🫡 Working on Director AI delegated task!`;
      }
    });
    setActiveFloorSpeech(newSpeech);

    setFloorActivityLog(prev => [
      `⚡ DIRECTOR AI (ANTIGRAVITY 2.0 ULTRA) INSTANTLY DELEGATED WORK TO ALL ${workerEmployees.length} AGENTS!`,
      ...prev.slice(0, 7)
    ]);

    const newItems: DailyWorkItem[] = workerEmployees.map(w => {
      const taskInfo = specializedTasks[w.character.id] || {
        task: `Build & optimize ${w.character.role} microservices`,
        category: 'Coding' as const,
        loc: 250
      };
      return {
        id: `dw-${Date.now()}-${w.character.id}`,
        time: nowTime,
        agentId: w.character.id,
        agentName: w.character.name,
        task: taskInfo.task,
        output: `Instant Auto-Delegated by Director AI`,
        category: taskInfo.category,
        status: 'completed' as const,
        progress: 100,
        loc: taskInfo.loc
      };
    });

    setDailyWorkList(prev => [...newItems, ...prev]);
    confetti({ particleCount: 120, spread: 85, origin: { y: 0.4 } });
  };

  const handleExportPdf = () => {
    cartoonAudio.playSuccess();
    generateExecutivePdfReport(managerEmployee.character.name, employees, dailyWorkList);
    setFloorActivityLog(prev => [
      `📄 GENERATED EXECUTIVE PDF WORK REPORT FOR BOSS!`,
      ...prev.slice(0, 7)
    ]);
  };

  const selectedEmployee = employees.find(e => e.character.id === selectedDeskId) || employees[0];

  const filteredDailyWork = selectedAgentFilter === 'all'
    ? dailyWorkList
    : dailyWorkList.filter(item => item.agentId === selectedAgentFilter);

  const totalLocToday = dailyWorkList.reduce((acc, item) => acc + item.loc, 0);

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner Control Bar */}
      <div className="cartoon-card p-5 md:p-6 bg-gradient-to-r from-amber-100 via-sky-100 to-emerald-100 flex flex-wrap items-center justify-between gap-4 border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cartoon-badge px-2.5 py-0.5 text-xs bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-bold border border-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" /> Active AI Working Floor
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">{employees.length} Working Desks (1 Manager Suite + {workerEmployees.length} Workers)</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Working Cartoon Office 🏢
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Dedicated Manager Executive Desk + Worker Agent Desks! Track daily work, live activity logs & assign tasks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleExportPdf}
            className="cartoon-button-primary px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-[3px_3px_0px_#0f172a] border-2 border-slate-900"
          >
            <FileText className="w-4 h-4 text-slate-900" />
            <span>📄 Export Executive PDF</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="cartoon-button-primary px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900"
          >
            <Copy className="w-4 h-4" />
            <span>📋 Copy Daily Work Report</span>
          </button>

          <button
            onClick={() => {
              cartoonAudio.playPop();
              onOpenHarnessStudio();
            }}
            className="cartoon-button-secondary px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Studio</span>
          </button>
        </div>
      </div>

      {/* Toast Alert for Copying Report */}
      {copyToast && (
        <div className="p-3 bg-emerald-500 text-slate-950 font-heading font-extrabold text-xs sm:text-sm rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] animate-bounce flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-slate-900" />
            <span>Daily Work Report copied to clipboard in Markdown format! 📋</span>
          </span>
          <span className="text-xs font-mono underline">Ready to share</span>
        </div>
      )}

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
                <div className="text-[9px] font-mono text-emerald-700">{employees.length} Working AI Containers</div>
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

          {/* 👑 SEPARATE DEDICATED MANAGER'S EXECUTIVE COMMAND SUITE DESK 👑 */}
          <div className="relative z-10 mb-6 cartoon-card bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 p-4 border-3 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl">
            
            {/* Manager Suite Header */}
            <div className="flex flex-wrap justify-between items-center gap-2 pb-2.5 mb-3 border-b-2 border-slate-900">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-bold text-xl animate-bounce">
                  👑
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900 uppercase tracking-wide">
                      MANAGER'S EXECUTIVE COMMAND SUITE 🏢
                    </h3>
                    <span className="cartoon-badge px-2.5 py-0.5 text-[10px] bg-slate-900 text-amber-300 rounded-full font-mono font-bold">
                      EXECUTIVE DESK • SEPARATE ROOM
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-700 font-medium">
                    Command deck for floor orchestration, AI engine routing & broadcast directives
                  </p>
                </div>
              </div>

              {/* Manager Executive Suite Header Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleManagerAutoDelegate}
                  className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-xs font-extrabold font-heading rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  <span>⚡ Instant Auto-Delegate All Work</span>
                </button>

                <button
                  onClick={handleExportPdf}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-extrabold font-heading rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export PDF Report</span>
                </button>

                <button
                  onClick={handleManagerBroadcast}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold font-heading rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  📢 Broadcast
                </button>
              </div>
            </div>

            {/* Manager Desk Card */}
            <div
              onClick={() => handleSelectDesk(managerEmployee)}
              className={`cartoon-card p-3.5 cursor-pointer transition-all border-3 border-slate-900 rounded-xl ${
                selectedDeskId === managerEmployee.character.id
                  ? 'bg-amber-100 ring-4 ring-slate-900 -translate-y-0.5 shadow-[6px_6px_0px_#0f172a]'
                  : 'bg-white hover:bg-amber-50 shadow-[3px_3px_0px_#0f172a]'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Left: Manager Avatar & Title (4 cols) */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] overflow-hidden shrink-0 relative animate-float">
                    <div dangerouslySetInnerHTML={{ __html: managerEmployee.character.avatarSvg }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-heading font-extrabold text-base text-slate-900">
                        {managerEmployee.character.name}
                      </h4>
                      <span className="text-xs">👑</span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase font-heading">
                      {managerEmployee.character.title}
                    </p>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-amber-300 border border-slate-900 rounded-full text-slate-900 mt-1 inline-block">
                      {managerEmployee.aiEngine.logoText} {managerEmployee.aiEngine.name}
                    </span>
                  </div>
                </div>

                {/* Center: Live Executive Screen Output (5 cols) */}
                <div className="md:col-span-5 bg-slate-900 rounded-xl p-2.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] font-mono text-xs text-emerald-400">
                  <div className="flex justify-between text-[8px] text-slate-400 pb-1 mb-1 border-b border-slate-800">
                    <span className="text-amber-400 font-bold">🖥️ DIRECTOR EXECUTIVE SCREEN</span>
                    <span className="text-emerald-400 font-bold">{managerEmployee.linesOfCode} LOC</span>
                  </div>
                  <p className="text-[9px] text-amber-300 font-bold truncate">
                    &gt; Task: {managerEmployee.currentTask}
                  </p>
                  <p className="text-[9px] text-emerald-400 truncate mt-0.5">
                    &gt; {managerEmployee.screenOutput.split('\n')[0]}
                  </p>
                </div>

                {/* Right: Speech & Action (3 cols) */}
                <div className="md:col-span-3 text-right space-y-1.5">
                  <div className="speech-bubble-left px-2.5 py-1 text-[10px] font-bold text-slate-900 animate-bounce inline-block text-left">
                    "{activeFloorSpeech[managerEmployee.character.id] || managerEmployee.character.quote.slice(0, 35) + "..."}"
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDesk(managerEmployee);
                    }}
                    className="w-full py-1 text-[11px] font-extrabold font-heading bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#0f172a]"
                  >
                    Select Manager Desk ⚙️
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* 💻 WORKER AGENTS DESKS FLOOR SECTION 💻 */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="font-heading font-extrabold text-xs md:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>💻 WORKER AGENT DESKS FLOOR</span>
              <span className="text-xs font-mono font-bold bg-amber-300 text-slate-900 px-2.5 py-0.5 rounded-full border border-slate-900">
                {workerEmployees.length} Worker Desks
              </span>
            </h4>
            <span className="text-[10px] text-slate-600 font-medium hidden sm:inline">
              Click desk to inspect monitor output & assign task
            </span>
          </div>

          {/* Cartoon Computer Desks & Working Employees Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {workerEmployees.map((emp, index) => {
              const isSelected = selectedDeskId === emp.character.id;
              const speech = activeFloorSpeech[emp.character.id];

              return (
                <div
                  key={emp.character.id}
                  onClick={() => handleSelectDesk(emp)}
                  className={`cartoon-card p-3.5 cursor-pointer transition-all relative flex flex-col justify-between border-3 border-slate-900 ${
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
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-900 absolute -z-0 top-1 shadow-[2px_2px_0px_#0f172a]" />

                      <div
                        className="w-12 h-12 rounded-xl border-2 border-slate-900 bg-white overflow-hidden relative z-10 animate-float"
                        dangerouslySetInnerHTML={{ __html: emp.character.avatarSvg }}
                      />

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

            {/* Interactive Add Custom Agent Tile */}
            <div
              onClick={() => {
                cartoonAudio.playPop();
                onOpenAddAgent();
              }}
              className="cartoon-card p-3.5 cursor-pointer transition-all relative flex flex-col justify-between border-3 border-dashed border-slate-900 bg-amber-50 hover:bg-amber-100 min-h-[220px] group shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-heading text-[10px] font-extrabold px-2 py-0.5 bg-amber-400 text-slate-900 rounded border border-slate-900">
                  NEW DESK +
                </span>
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-white border border-slate-900 rounded-full text-slate-900">
                  Unlimited
                </span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border-2 border-dashed border-slate-900 text-center my-auto flex flex-col items-center justify-center py-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform mb-2">
                  ✨
                </div>
                <h4 className="font-heading font-extrabold text-xs text-slate-900">
                  + Add Custom Agent
                </h4>
                <p className="text-[9px] text-slate-600 font-medium mt-1">
                  Choose avatar & AI engine
                </p>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[10px] font-extrabold text-amber-900 font-heading bg-amber-300 px-3 py-1 rounded-full border border-slate-900">
                  + Spin Up Harness
                </span>
              </div>
            </div>
          </div>

          {/* 🌟 DEDICATED DAILY WORK & LIVE ACTIVITY CENTER 🌟 */}
          <div className="mt-6 cartoon-card bg-slate-900 text-white rounded-2xl border-4 border-slate-900 overflow-hidden shadow-[6px_6px_0px_#0f172a]">
            
            {/* Header Tabs Navigation */}
            <div className="p-3 bg-slate-950 border-b-2 border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivityTab('daily')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-extrabold flex items-center gap-1.5 transition-all border ${
                    activityTab === 'daily'
                      ? 'bg-amber-400 text-slate-900 border-slate-900 shadow-[2px_2px_0px_#f59e0b]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>📅 DAILY WORK REPORT</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-slate-900 text-amber-300 rounded font-mono">
                    {dailyWorkList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActivityTab('live')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-extrabold flex items-center gap-1.5 transition-all border ${
                    activityTab === 'live'
                      ? 'bg-emerald-400 text-slate-900 border-slate-900 shadow-[2px_2px_0px_#10b981]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>⚡ LIVE TICKER LOGS</span>
                </button>

                <button
                  onClick={() => setActivityTab('stats')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-extrabold flex items-center gap-1.5 transition-all border ${
                    activityTab === 'stats'
                      ? 'bg-sky-400 text-slate-900 border-slate-900 shadow-[2px_2px_0px_#0284c7]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>📊 WORK METRICS</span>
                </button>
              </div>

              {/* Agent Filter & Add Button */}
              <div className="flex items-center gap-2">
                {activityTab === 'daily' && (
                  <>
                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
                      <Filter className="w-3 h-3 text-amber-400" />
                      <select
                        value={selectedAgentFilter}
                        onChange={(e) => setSelectedAgentFilter(e.target.value)}
                        className="bg-transparent text-slate-200 font-mono text-[11px] focus:outline-none cursor-pointer"
                      >
                        <option value="all" className="bg-slate-900 text-white">All Employees</option>
                        {CHARACTERS.map(c => (
                          <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                            {c.name} ({c.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setShowAddLogModal(true)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded border border-slate-900 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Task</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* TAB 1: DAILY WORK REPORT */}
            {activityTab === 'daily' && (
              <div className="p-4 space-y-4">
                
                {/* Summary Banner Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-900 font-mono">
                  <div className="p-2.5 bg-amber-100 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-[10px] font-bold uppercase text-slate-700">TOTAL TASKS TODAY</div>
                    <div className="text-lg font-heading font-extrabold text-slate-900">{dailyWorkList.length} Completed</div>
                  </div>

                  <div className="p-2.5 bg-emerald-100 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-[10px] font-bold uppercase text-slate-700">CODE GENERATED</div>
                    <div className="text-lg font-heading font-extrabold text-emerald-900">{totalLocToday.toLocaleString()} LOC</div>
                  </div>

                  <div className="p-2.5 bg-sky-100 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-[10px] font-bold uppercase text-slate-700">TOKENS SAVED</div>
                    <div className="text-lg font-heading font-extrabold text-sky-900">420,000 Saved</div>
                  </div>

                  <div className="p-2.5 bg-pink-100 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-[10px] font-bold uppercase text-slate-700">SECURITY AUDIT</div>
                    <div className="text-lg font-heading font-extrabold text-pink-900">100% Passed</div>
                  </div>
                </div>

                {/* Overall Daily Task Execution Progress Bar */}
                <div className="p-3 bg-slate-950 rounded-xl border-2 border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-heading font-extrabold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      OVERALL DAILY TASK EXECUTION PROGRESS
                    </span>
                    <span className="font-mono text-emerald-400 text-xs">
                      {Math.round((dailyWorkList.filter(d => d.status === 'completed').length / dailyWorkList.length) * 100)}% Complete ({dailyWorkList.filter(d => d.status === 'completed').length}/{dailyWorkList.length} Tasks)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700 p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ width: `${(dailyWorkList.filter(d => d.status === 'completed').length / dailyWorkList.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Daily Work Timeline Items */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredDailyWork.map((item) => {
                    const char = CHARACTERS.find(c => c.id === item.agentId) || CHARACTERS[0];
                    return (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-950 rounded-xl border-2 border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                      >
                        {/* Left Side: Avatar + Agent Info + Task Description */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Agent Avatar Badge */}
                          <div
                            className="w-9 h-9 rounded-lg bg-amber-300 border border-slate-900 overflow-hidden shrink-0"
                            dangerouslySetInnerHTML={{ __html: char.avatarSvg }}
                          />
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-extrabold text-amber-300 shrink-0">{item.agentName}</span>
                              <span className="px-2 py-0.2 text-[9px] font-mono font-bold bg-slate-800 text-slate-300 rounded border border-slate-700 shrink-0">
                                {item.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-slate-500" /> {item.time}
                              </span>
                            </div>
                            
                            <p className="font-medium text-slate-200 text-xs mt-0.5 truncate" title={item.task}>
                              {item.task}
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Fixed Width Columns for LOC, Progress Meter, & Status Badge */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* LOC Badge */}
                          <div className="w-20 text-center text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 shrink-0">
                            + {item.loc} LOC
                          </div>

                          {/* Task Progress Bar */}
                          <div className="w-28 text-left shrink-0">
                            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                              <span>Progress</span>
                              <span className="text-emerald-400 font-bold">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all ${item.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Output Status Badge */}
                          <div className="w-36 flex justify-end shrink-0">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1 w-full justify-center ${
                              item.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                            }`}>
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">{item.output}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 2: LIVE TICKER LOGS */}
            {activityTab === 'live' && (
              <div className="p-4 font-mono text-xs text-emerald-400 space-y-1.5 max-h-72 overflow-y-auto">
                <div className="flex justify-between text-slate-400 text-[10px] font-bold uppercase pb-1 mb-2 border-b border-slate-800">
                  <span>TERMINAL STREAM</span>
                  <span>LOCAL SANDBOX PROCESS</span>
                </div>
                {floorActivityLog.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">&gt;</span>
                    <span className="truncate">{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: WORK METRICS & AGENT STATS */}
            {activityTab === 'stats' && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CHARACTERS.map(c => {
                    const empLoc = employees.find(e => e.character.id === c.id)?.linesOfCode || 1000;
                    return (
                      <div key={c.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0"
                          dangerouslySetInnerHTML={{ __html: c.avatarSvg }}
                        />
                        <div className="truncate">
                          <div className="font-heading font-extrabold text-amber-400 text-xs truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{c.role}</div>
                          <div className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">{empLoc.toLocaleString()} LOC Produced</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Selected Employee Workstation Screen Inspector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="cartoon-card p-5 bg-white flex flex-col justify-between relative overflow-hidden h-full border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a]">
            
            {/* Right Side: Selected Employee Workstation Screen Inspector (4 cols) */}
            <div>
              <div className="flex items-center gap-3 pb-3 mb-3 border-b-2 border-slate-900">
                <div
                  className="w-14 h-14 rounded-xl border-2 border-slate-900 bg-amber-100 overflow-hidden shrink-0 shadow-[2px_2px_0px_#0f172a]"
                  dangerouslySetInnerHTML={{ __html: selectedEmployee.character.avatarSvg }}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-heading text-lg font-extrabold text-slate-900">
                      {selectedEmployee.character.name}'s Desk
                    </h3>
                    {selectedEmployee.character.id === managerEmployee.character.id && <span className="text-sm">👑</span>}
                  </div>
                  <p className="text-xs font-bold text-amber-600 uppercase">
                    {selectedEmployee.character.title}
                  </p>
                </div>
              </div>

              {/* Working AI Engine Info */}
              <div className="p-3 bg-amber-50 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] mb-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-xs font-extrabold text-slate-900 flex items-center gap-1.5 shrink-0">
                    <Cpu className="w-4 h-4 text-amber-700" /> AI Engine:
                  </span>
                  
                  {/* Clean Engine Selector Dropdown for this Desk */}
                  <select
                    value={selectedEmployee.aiEngine.id}
                    onChange={(e) => handleSwitchEngineForSelected(e.target.value)}
                    className="w-full max-w-[180px] sm:max-w-[200px] text-xs font-bold font-mono px-2 py-1 bg-white border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#0f172a] focus:outline-none cursor-pointer truncate"
                  >
                    {(() => {
                      const isSelectedManager = selectedEmployee.character.id === managerEmployee.character.id;
                      const deskAvailableEngines = AI_ENGINES.filter((e) => isSelectedManager || !e.isManagerOnly);
                      return deskAvailableEngines.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.logoText} {e.name}
                        </option>
                      ));
                    })()}
                  </select>
                </div>
                
                <p className="text-[11px] text-slate-700 font-medium leading-tight">
                  {selectedEmployee.aiEngine.tagline}
                </p>
                <div className="pt-1.5 border-t border-slate-300 flex justify-between text-[10px] font-mono text-slate-600 font-bold">
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

              {/* MANAGER SPECIFIC DISPATCH FORM VS WORKER TASK FORM */}
              {(() => {
                const roleHelp = getAgentRoleHelp(selectedEmployee.character);
                const isManagerSelected = selectedEmployee.character.id === managerEmployee.character.id;

                if (isManagerSelected) {
                  return (
                    /* 👑 MANAGER TASK DISPATCHER FORM 👑 */
                    <form onSubmit={handleManagerDispatchWork} className="bg-amber-100 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] mb-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold text-slate-900 font-heading uppercase flex items-center gap-1">
                          <span>👑 MANAGER TASK DISPATCHER</span>
                        </label>
                        <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded border border-slate-900">
                          Manager Agent 🧠
                        </span>
                      </div>

                      {/* Capabilities badges */}
                      <div className="flex flex-wrap gap-1">
                        {roleHelp.capabilities.map((cap, idx) => (
                          <span key={idx} className="text-[9px] font-mono font-bold bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-700 shadow-[1px_1px_0px_#0f172a]">
                            {cap}
                          </span>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-800 uppercase mb-0.5">Select Target Agent:</label>
                        <select
                          value={dispatchWorkerId}
                          onChange={(e) => setDispatchWorkerId(e.target.value)}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-slate-900 rounded-lg focus:outline-none cursor-pointer"
                        >
                          <option value="all">📢 ALL WORKERS (Floor Wide Dispatch)</option>
                          {workerEmployees.map(w => (
                            <option key={w.character.id} value={w.character.id}>
                              👨‍💻 {w.character.name} ({w.character.title})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-800 uppercase mb-0.5">Directive / Work Task:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={customTaskInput}
                            onChange={(e) => setCustomTaskInput(e.target.value)}
                            placeholder={roleHelp.placeholder}
                            className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-900 rounded-lg focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="cartoon-button-primary px-3 py-1.5 text-xs shrink-0 bg-slate-900 text-amber-300 hover:bg-slate-800 font-extrabold"
                          >
                            🎯 Dispatch
                          </button>
                        </div>
                      </div>

                      {/* LIVE MANAGER ORCHESTRATION STREAM */}
                      <div className="pt-2 border-t border-amber-300">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[10px] font-extrabold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>⚡ LIVE MANAGER WORK & DISPATCH LOG</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-amber-300 text-slate-900 px-2 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                            {dailyWorkList.filter(item => item.agentId === managerEmployee.character.id).length} Dispatch Logs
                          </span>
                        </div>

                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                          {dailyWorkList.filter(item => item.agentId === managerEmployee.character.id).length > 0 ? (
                            dailyWorkList
                              .filter(item => item.agentId === managerEmployee.character.id)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="p-2 bg-white rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] text-[11px] font-mono space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-1 text-[9px] font-bold">
                                    <span className="text-amber-800 flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5 text-amber-600" /> {item.time}
                                    </span>
                                    <span className="px-1.5 py-0.2 bg-amber-300 text-slate-900 rounded text-[8px] border border-slate-900">
                                      {item.category}
                                    </span>
                                  </div>
                                  <p className="font-bold text-slate-900 text-[10px] leading-tight">
                                    👑 {item.task}
                                  </p>
                                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px]">
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>{item.output}</span>
                                    </span>
                                    <span className="text-slate-500 font-mono text-[8px] font-bold">
                                      +{item.loc} Units
                                    </span>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="p-3 bg-white rounded-lg border border-dashed border-slate-900 text-center font-mono text-[10px] text-slate-700">
                              👑 Manager {managerEmployee.character.name} is ready. Dispatch a directive above!
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  );
                }

                return (
                  /* STANDARD WORKER AGENT TASK FORM */
                  <form onSubmit={handleAssignTask} className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] mb-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900 uppercase font-heading">
                        Assign Direct Task to {selectedEmployee.character.name}:
                      </label>
                      <span className="text-[9px] font-extrabold bg-amber-300 text-slate-900 px-2 py-0.5 rounded border border-slate-900">
                        {selectedEmployee.character.title}
                      </span>
                    </div>

                    {/* Capabilities badges */}
                    <div className="flex flex-wrap gap-1">
                      {roleHelp.capabilities.map((cap, idx) => (
                        <span key={idx} className="text-[9px] font-mono font-bold bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-700 shadow-[1px_1px_0px_#0f172a]">
                          {cap}
                        </span>
                      ))}
                    </div>

                    {/* Auto-Hunter Control for Lead Agent */}
                    {onToggleAutoHunting && (selectedEmployee.character.id === 'jim' || selectedEmployee.character.title.includes('BizDev')) && (
                      <button
                        type="button"
                        onClick={() => onToggleAutoHunting(!isAutoHunting)}
                        className={`w-full text-center p-1.5 rounded-lg border border-slate-900 text-[10px] font-bold font-mono transition-all cursor-pointer shadow-[1px_1px_0px_#0f172a] ${
                          isAutoHunting
                            ? 'bg-emerald-300 text-slate-900 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {isAutoHunting ? '🟢 Auto-Hunter Active (Click to Pause)' : '⏸️ Auto-Hunter Paused (Click to Resume)'}
                      </button>
                    )}

                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={customTaskInput}
                          onChange={(e) => setCustomTaskInput(e.target.value)}
                          placeholder={roleHelp.placeholder}
                          className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                          type="submit"
                          className="cartoon-button-primary px-3 py-1.5 text-xs shrink-0 font-extrabold"
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    {/* LIVE WORK & DELIVERABLES STREAM FOR THIS SELECTED AGENT */}
                    <div className="pt-2 border-t border-slate-300">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[10px] font-extrabold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>⚡ LIVE WORK & DELIVERABLES — {selectedEmployee.character.name.toUpperCase()}</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                          {dailyWorkList.filter(item => item.agentId === selectedEmployee.character.id).length} Work Items
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                        {dailyWorkList.filter(item => item.agentId === selectedEmployee.character.id).length > 0 ? (
                          dailyWorkList
                            .filter(item => item.agentId === selectedEmployee.character.id)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="p-2 bg-white rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] text-[11px] font-mono space-y-1"
                              >
                                <div className="flex items-center justify-between gap-1 text-[9px] font-bold">
                                  <span className="text-amber-800 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5 text-amber-600" /> {item.time}
                                  </span>
                                  <span className="px-1.5 py-0.2 bg-slate-900 text-amber-300 rounded text-[8px]">
                                    {item.category}
                                  </span>
                                </div>
                                <p className="font-bold text-slate-900 text-[10px] leading-tight">
                                  📌 {item.task}
                                </p>
                                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px]">
                                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>{item.output}</span>
                                  </span>
                                  <span className="text-slate-500 font-mono text-[8px] font-bold">
                                    +{item.loc} Units
                                  </span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="p-3 bg-white rounded-lg border border-dashed border-slate-900 text-center font-mono text-[10px] text-slate-600">
                            ⚡ {selectedEmployee.character.name} is online and ready. Assign a direct task above to log live deliverables!
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                );
              })()}
            </div>

            {/* MANAGER WORK REPORT HANDOFF BUTTONS TO BOSS (USER) - ONLY FOR MANAGER */}
            {selectedEmployee.character.id === managerEmployee.character.id && (
              <div className="space-y-2">
                <button
                  onClick={handleExportPdf}
                  className="cartoon-button-primary w-full py-3 text-xs font-extrabold flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-[4px_4px_0px_#0f172a] border-2 border-slate-900"
                >
                  <FileText className="w-4 h-4 text-slate-900" />
                  <span>👑 Export Manager PDF Report for Boss (You) 📄</span>
                </button>
                
                <button
                  onClick={handleManagerCollectReport}
                  className="cartoon-button-secondary w-full py-2 text-xs font-bold flex items-center justify-center gap-2 bg-emerald-300 hover:bg-emerald-200 text-slate-900 border-2 border-slate-900"
                >
                  <span>📋 Copy Markdown Briefing to Clipboard</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* QUICK ADD MANUAL LOG MODAL */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="cartoon-card bg-white max-w-md w-full p-6 border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-2xl relative">
            <h3 className="font-heading text-xl font-extrabold text-slate-900 mb-1">
              Log Daily Work Task 📝
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Add a completed or ongoing task to today's daily work breakdown.
            </p>

            <form onSubmit={handleAddManualLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">
                  Select Employee / Agent:
                </label>
                <select
                  value={newLogAgent}
                  onChange={(e) => setNewLogAgent(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-slate-50 border-2 border-slate-900 rounded-lg"
                >
                  {CHARACTERS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">
                  Category:
                </label>
                <select
                  value={newLogCategory}
                  onChange={(e) => setNewLogCategory(e.target.value as DailyWorkItem['category'])}
                  className="w-full text-xs font-bold p-2 bg-slate-50 border-2 border-slate-900 rounded-lg"
                >
                  <option value="Management">Management 🧠</option>
                  <option value="Mailing">Mailing 📧</option>
                  <option value="BizDev">Lead / BizDev 💼</option>
                  <option value="Research">Research 🔎</option>
                  <option value="Content">Content / Marketing 📢</option>
                  <option value="Operations">Operations / Client 📋</option>
                  <option value="Planning">Planning 📅</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">
                  Task Description:
                </label>
                <input
                  type="text"
                  required
                  value={newLogTask}
                  onChange={(e) => setNewLogTask(e.target.value)}
                  placeholder="e.g. Generated API documentation & unit tests"
                  className="w-full text-xs p-2 bg-slate-50 border-2 border-slate-900 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-200 text-slate-800 rounded-lg border-2 border-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cartoon-button-primary px-4 py-2 text-xs font-bold"
                >
                  Save Daily Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

