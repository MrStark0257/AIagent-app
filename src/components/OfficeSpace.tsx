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
}

interface WorkingEmployee {
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
  category: 'Coding' | 'Design' | 'Management' | 'Security' | 'QA' | 'Optimization' | 'Planning';
  status: 'completed' | 'active' | 'queued';
  progress: number;
  loc: number;
}

export const OfficeSpace: React.FC<OfficeSpaceProps> = ({
  onOpenHarnessStudio,
  onOpenAddAgent,
  newlyAddedEmployee,
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
  const [activityTab, setActivityTab] = useState<'daily' | 'live' | 'stats'>('daily');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);

  // New task form state inside Daily Work
  const [newLogAgent, setNewLogAgent] = useState<string>('jim');
  const [newLogTask, setNewLogTask] = useState<string>('');
  const [newLogCategory, setNewLogCategory] = useState<DailyWorkItem['category']>('Coding');

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
    "⚡ Dwight completed security isolation scan.",
    "🐱 Angela passed 48 unit tests in Copilot QA."
  ]);

  // Dynamically add newly created agent harnesses to office floor
  useEffect(() => {
    if (newlyAddedEmployee && newlyAddedEmployee.character) {
      const newChar = newlyAddedEmployee.character;
      const engine = newlyAddedEmployee.aiEngine || AI_ENGINES[0];
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
      task: 'Built Rust & TS Harness CLI Wrapper for local isolation',
      output: 'PR #147 Merged',
      category: 'Coding',
      status: 'completed',
      progress: 100,
      loc: 1420
    },
    {
      id: 'dw-2',
      time: '12:15 PM',
      agentId: 'pam',
      agentName: 'Pam',
      task: 'Designed tokens.json UI color swatches & cartoon layout',
      output: 'tokens.json exported',
      category: 'Design',
      status: 'completed',
      progress: 100,
      loc: 850
    },
    {
      id: 'dw-3',
      time: '11:50 AM',
      agentId: 'michael',
      agentName: 'Michael',
      task: 'Orchestrated multi-agent office floor & memory sync',
      output: '6 AI Desks Sync OK',
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
      task: 'Enforced security isolation & key protection scan',
      output: '0 Security Leaks',
      category: 'Security',
      status: 'completed',
      progress: 100,
      loc: 2100
    },
    {
      id: 'dw-5',
      time: '10:45 AM',
      agentId: 'angela',
      agentName: 'Angela',
      task: 'Inspected PR code formatting, TypeScript types & unit tests',
      output: '48/48 Tests Passed',
      category: 'QA',
      status: 'completed',
      progress: 100,
      loc: 1100
    },
    {
      id: 'dw-6',
      time: '10:10 AM',
      agentId: 'kevin',
      agentName: 'Kevin',
      task: 'Optimized token context window & local model caching',
      output: '420k Tokens Saved',
      category: 'Optimization',
      status: 'completed',
      progress: 100,
      loc: 640
    },
    {
      id: 'dw-7',
      time: '09:30 AM',
      agentId: 'jim',
      agentName: 'Jim',
      task: 'Initialized local sandbox environment & dev server',
      output: 'Port 5173 Active',
      category: 'Coding',
      status: 'completed',
      progress: 100,
      loc: 350
    },
    {
      id: 'dw-8',
      time: '09:00 AM',
      agentId: 'michael',
      agentName: 'Michael',
      task: 'Morning standup & daily work plan generation',
      output: 'Daily Backlog Ready',
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
      category: 'Coding',
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
      // Assign to all workers
      setEmployees(prev =>
        prev.map(emp => {
          if (emp.character.id === managerEmployee.character.id) {
            return {
              ...emp,
              currentTask: `Supervising All Workers on: "${task}"`,
              screenOutput: `[MANAGER DISPATCHER]\n> Dispatched task to ALL ${workerEmployees.length} Workers\n> Task: "${task}"\n> Status: Monitoring workforce & compiling reports for Boss.`
            };
          } else {
            return {
              ...emp,
              currentTask: task,
              status: 'typing',
              screenOutput: `[${emp.aiEngine.name.toUpperCase()}]\n> TASK FROM MANAGER (${managerEmployee.character.name}): ${task}\n> Executing with ${emp.aiEngine.defaultModel}...`
            };
          }
        })
      );

      const newSpeech: { [key: string]: string } = {};
      employees.forEach(emp => {
        if (emp.character.id === managerEmployee.character.id) {
          newSpeech[emp.character.id] = `👑 Assigned "${task.slice(0, 20)}..." to all!`;
        } else {
          newSpeech[emp.character.id] = `🫡 Working on Manager's task!`;
        }
      });
      setActiveFloorSpeech(newSpeech);

      setFloorActivityLog(prev => [
        `👑 MANAGER DISPATCHED TASK TO ALL WORKERS: "${task}"`,
        ...prev.slice(0, 7)
      ]);

      // Log daily work items for workers
      const newItems: DailyWorkItem[] = workerEmployees.map(w => ({
        id: `dw-${Date.now()}-${w.character.id}`,
        time: nowTime,
        agentId: w.character.id,
        agentName: w.character.name,
        task: task,
        output: `Dispatched by Manager ${managerEmployee.character.name}`,
        category: 'Coding',
        status: 'active',
        progress: 75,
        loc: Math.floor(Math.random() * 200) + 50
      }));
      setDailyWorkList(prev => [...newItems, ...prev]);

    } else {
      // Assign to specific worker
      const targetWorker = employees.find(e => e.character.id === dispatchWorkerId);
      if (!targetWorker) return;

      setEmployees(prev =>
        prev.map(emp => {
          if (emp.character.id === dispatchWorkerId) {
            return {
              ...emp,
              currentTask: task,
              status: 'typing',
              screenOutput: `[${emp.aiEngine.name.toUpperCase()}]\n> DIRECTIVE FROM MANAGER: ${task}\n> Model: ${emp.aiEngine.defaultModel}`
            };
          }
          if (emp.character.id === managerEmployee.character.id) {
            return {
              ...emp,
              currentTask: `Supervising ${targetWorker.character.name} on: "${task}"`,
              screenOutput: `[MANAGER DISPATCHER]\n> Assigned task to ${targetWorker.character.name}\n> Task: "${task}"\n> Status: Awaiting completion report.`
            };
          }
          return emp;
        })
      );

      setActiveFloorSpeech(prev => ({
        ...prev,
        [managerEmployee.character.id]: `👑 Assigned task to ${targetWorker.character.name}!`,
        [targetWorker.character.id]: `🫡 On it, Manager!`
      }));

      setFloorActivityLog(prev => [
        `👑 MANAGER DISPATCHED TASK TO ${targetWorker.character.name.toUpperCase()}: "${task}"`,
        ...prev.slice(0, 7)
      ]);

      const newItem: DailyWorkItem = {
        id: `dw-${Date.now()}`,
        time: nowTime,
        agentId: targetWorker.character.id,
        agentName: targetWorker.character.name,
        task: task,
        output: `Assigned by Manager ${managerEmployee.character.name}`,
        category: 'Coding',
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
              <div className="flex items-center gap-2">
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
                  📢 Broadcast Directive
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

              {/* MANAGER SPECIFIC DISPATCH FORM VS WORKER TASK FORM */}
              {selectedEmployee.character.id === managerEmployee.character.id ? (
                /* 👑 MANAGER TASK DISPATCHER FORM 👑 */
                <form onSubmit={handleManagerDispatchWork} className="bg-amber-100 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] mb-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold text-slate-900 font-heading uppercase flex items-center gap-1">
                      <span>👑 MANAGER TASK DISPATCHER</span>
                    </label>
                    <span className="text-[9px] font-bold bg-amber-400 px-2 py-0.5 rounded border border-slate-900">
                      Dispatches Work to Floor
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-800 uppercase mb-0.5">Select Worker Agent Target:</label>
                    <select
                      value={dispatchWorkerId}
                      onChange={(e) => setDispatchWorkerId(e.target.value)}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-900 rounded-lg focus:outline-none"
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
                        placeholder="e.g. 'Build billing system & write unit tests'"
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
                </form>
              ) : (
                /* STANDARD WORKER TASK FORM */
                <form onSubmit={handleAssignTask} className="bg-slate-50 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] mb-4">
                  <label className="block text-xs font-bold text-slate-900 mb-1 uppercase font-heading">
                    Assign Direct Task to {selectedEmployee.character.name}:
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
              )}
            </div>

            {/* MANAGER WORK REPORT HANDOFF BUTTONS TO BOSS (USER) */}
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
                  <option value="Coding">Coding</option>
                  <option value="Design">Design</option>
                  <option value="Management">Management</option>
                  <option value="Security">Security</option>
                  <option value="QA">QA</option>
                  <option value="Optimization">Optimization</option>
                  <option value="Planning">Planning</option>
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

