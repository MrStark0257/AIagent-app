export interface AIEngine {
  id: string;
  name: string;
  provider: string;
  logoText: string;
  svgIcon?: string;
  tagline: string;
  defaultModel: string;
  speed: string;
  badgeBg: string;
  textColor: string;
  isManagerOnly?: boolean;
}

export const AI_ENGINES: AIEngine[] = [
  {
    id: 'director-ai',
    name: 'Director AI (Antigravity 2.0 Ultra)',
    provider: 'Google DeepMind',
    logoText: '👑',
    tagline: 'Zero-latency multi-agent orchestration & executive task dispatching (👑 Manager Only)',
    defaultModel: 'Antigravity 2.0 Ultra Executive Engine',
    speed: '120 t/s (Instant Zero-Delay)',
    badgeBg: 'bg-amber-200 border-amber-600',
    textColor: 'text-amber-950',
    isManagerOnly: true,
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    provider: 'Anthropic',
    logoText: 'A\\',
    tagline: 'Deep reasoning, coding CLI & agentic tool use',
    defaultModel: 'Claude 3.5 Sonnet',
    speed: '48 t/s',
    badgeBg: 'bg-orange-100 border-orange-500',
    textColor: 'text-orange-900',
  },
  {
    id: 'codex',
    name: 'Codex',
    provider: 'OpenAI',
    logoText: '☸',
    tagline: 'State of the art code synthesis & function calling',
    defaultModel: 'GPT-4o Codex Engine',
    speed: '55 t/s',
    badgeBg: 'bg-emerald-100 border-emerald-500',
    textColor: 'text-emerald-900',
  },
  {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    logoText: '✕',
    tagline: 'Real-time knowledge, unaligned reasoning & fast execution',
    defaultModel: 'Grok-2 Code',
    speed: '62 t/s',
    badgeBg: 'bg-slate-200 border-slate-900',
    textColor: 'text-slate-900',
  },
  {
    id: 'kimi-code',
    name: 'Kimi Code',
    provider: 'Moonshot AI',
    logoText: 'K’',
    tagline: 'Ultra long-context 2M token repo window',
    defaultModel: 'Kimi K1.5 Pro',
    speed: '40 t/s',
    badgeBg: 'bg-blue-100 border-blue-500',
    textColor: 'text-blue-900',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    provider: 'Google DeepMind',
    logoText: '✦',
    tagline: 'Advanced agentic coding & multimodal intelligence',
    defaultModel: 'Antigravity 2.0 (Gemini 1.5 Pro)',
    speed: '70 t/s',
    badgeBg: 'bg-purple-100 border-purple-500',
    textColor: 'text-purple-900',
  },
  {
    id: 'qwen',
    name: 'Qwen',
    provider: 'Alibaba Cloud',
    logoText: '❖',
    tagline: 'Leading open-weight coding LLM',
    defaultModel: 'Qwen 2.5 Coder 32B',
    speed: '50 t/s',
    badgeBg: 'bg-sky-100 border-sky-500',
    textColor: 'text-sky-900',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    provider: 'OpenSource',
    logoText: '▢',
    tagline: 'Self-hosted 100% private local code model',
    defaultModel: 'OpenCode 34B Local',
    speed: '35 t/s',
    badgeBg: 'bg-teal-100 border-teal-500',
    textColor: 'text-teal-900',
  },
  {
    id: 'crush',
    name: 'Crush',
    provider: 'Crush AI',
    logoText: '♥',
    tagline: 'Creative UI aesthetics & frontend design genius',
    defaultModel: 'Crush Vision 2.0',
    speed: '45 t/s',
    badgeBg: 'bg-pink-100 border-pink-500',
    textColor: 'text-pink-900',
  },
  {
    id: 'pi',
    name: 'Pi',
    provider: 'Inflection AI',
    logoText: 'π',
    tagline: 'Empathetic pair-programmer & supportive assistant',
    defaultModel: 'Pi 2.5 Code',
    speed: '52 t/s',
    badgeBg: 'bg-yellow-100 border-yellow-500',
    textColor: 'text-yellow-900',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    provider: 'GitHub / Microsoft',
    logoText: '🤖',
    tagline: 'Workspace context, inline completions & PR automation',
    defaultModel: 'Copilot Workspace Engine',
    speed: '65 t/s',
    badgeBg: 'bg-indigo-100 border-indigo-500',
    textColor: 'text-indigo-900',
  },
];
