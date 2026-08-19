export interface CartoonCharacter {
  id: string;
  name: string;
  title: string;
  role: string;
  quote: string;
  bgColor: string;
  accentColor: string;
  badgeBg: string;
  avatarSvg: string;
  stats: {
    speed: number;
    humor: number;
    intelligence: number;
    chaos: number;
  };
  defaultMemory: string;
  colorHex: string;
}

export const CHARACTERS: CartoonCharacter[] = [
  {
    id: 'jim',
    name: 'Jim',
    title: 'Senior Code Ninja',
    role: 'Harness Developer',
    quote: "Identity terminal ready. Let's wrap this agent CLI and ship feature PRs!",
    bgColor: 'bg-emerald-100',
    accentColor: 'border-emerald-500 text-emerald-700',
    badgeBg: 'bg-emerald-400 text-slate-900',
    colorHex: '#10b981',
    stats: { speed: 92, humor: 88, intelligence: 95, chaos: 25 },
    defaultMemory: `# Memory - Jim (Senior Dev)
- Always verify design tokens before pushing PRs.
- Prefers async handoffs with Pam & Dwight.
- Shared knowledge base synced across all local clones.`,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Background Circle -->
        <circle cx="50" cy="50" r="46" fill="#a7f3d0" stroke="#0f172a" stroke-width="4"/>
        <!-- Hair -->
        <path d="M25 45 C25 20, 75 20, 75 45 C75 35, 60 22, 50 25 C40 22, 25 35, 25 45 Z" fill="#475569" stroke="#0f172a" stroke-width="3"/>
        <!-- Face -->
        <circle cx="50" cy="54" r="28" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <!-- Hair Bangs -->
        <path d="M30 38 Q 45 46 52 36 Q 65 46 72 38 Q 50 26 30 38" fill="#334155" stroke="#0f172a" stroke-width="2"/>
        <!-- Eyes (Smirk expression) -->
        <ellipse cx="40" cy="52" rx="4" ry="5" fill="#0f172a"/>
        <ellipse cx="60" cy="52" rx="4" ry="5" fill="#0f172a"/>
        <circle cx="41" cy="50" r="1.5" fill="#ffffff"/>
        <circle cx="61" cy="50" r="1.5" fill="#ffffff"/>
        <!-- Eyebrows (One raised) -->
        <path d="M34 44 Q 40 40 46 45" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <path d="M54 43 Q 60 41 66 43" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Smile -->
        <path d="M42 62 Q 52 70 60 60" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Cheeks -->
        <circle cx="33" cy="58" r="4" fill="#f43f5e" opacity="0.4"/>
        <circle cx="67" cy="58" r="4" fill="#f43f5e" opacity="0.4"/>
        <!-- Body / Shirt -->
        <path d="M28 80 C28 70, 72 70, 72 80 L76 96 L24 96 Z" fill="#0284c7" stroke="#0f172a" stroke-width="3"/>
        <!-- Tie -->
        <path d="M47 72 L53 72 L55 88 L50 94 L45 88 Z" fill="#e11d48" stroke="#0f172a" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 'pam',
    name: 'Pam',
    title: 'UI/UX Visionary',
    role: 'Design System Master',
    quote: "Tokens updated! Ready to stream aesthetic vector specs to Jim's clone.",
    bgColor: 'bg-pink-100',
    accentColor: 'border-pink-500 text-pink-700',
    badgeBg: 'bg-pink-400 text-slate-900',
    colorHex: '#ec4899',
    stats: { speed: 90, humor: 85, intelligence: 96, chaos: 15 },
    defaultMemory: `# Memory - Pam (Lead Design)
- Standardized color system in \`billing/tokens.json\`.
- All cartoon UI cards must have 3px border and subtle pop shadows.
- Auto-delivering design updates to downstream workspace clones.`,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Background Circle -->
        <circle cx="50" cy="50" r="46" fill="#fbcfe8" stroke="#0f172a" stroke-width="4"/>
        <!-- Long Curly Hair Back -->
        <path d="M20 40 C15 70, 30 85, 30 85 C30 85, 70 85, 70 85 C70 85, 85 70, 80 40 Z" fill="#b45309" stroke="#0f172a" stroke-width="3"/>
        <!-- Face -->
        <circle cx="50" cy="52" r="27" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <!-- Hair Front -->
        <path d="M22 46 C25 24, 75 24, 78 46 C70 30, 30 30, 22 46 Z" fill="#d97706" stroke="#0f172a" stroke-width="3"/>
        <!-- Eyes (Big Sparkling) -->
        <ellipse cx="38" cy="50" rx="4.5" ry="5.5" fill="#0f172a"/>
        <ellipse cx="62" cy="50" rx="4.5" ry="5.5" fill="#0f172a"/>
        <circle cx="39.5" cy="48" r="1.8" fill="#ffffff"/>
        <circle cx="63.5" cy="48" r="1.8" fill="#ffffff"/>
        <!-- Eyebrows -->
        <path d="M32 42 Q 38 38 44 42" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M56 42 Q 62 38 68 42" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Cute Smile -->
        <path d="M42 60 Q 50 67 58 60" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Blushing Cheeks -->
        <circle cx="31" cy="56" r="4.5" fill="#f43f5e" opacity="0.5"/>
        <circle cx="69" cy="56" r="4.5" fill="#f43f5e" opacity="0.5"/>
        <!-- Sweater -->
        <path d="M28 78 C28 68, 72 68, 72 78 L75 96 L25 96 Z" fill="#ec4899" stroke="#0f172a" stroke-width="3"/>
        <!-- Hair Pins -->
        <rect x="25" y="36" width="8" height="3" rx="1.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>
      </svg>
    `
  },
  {
    id: 'michael',
    name: 'Michael',
    title: 'Regional AI Director',
    role: 'Command Floor Orchestrator',
    quote: "World's Best Agent Command Center! Every clone you run shares my wisdom.",
    bgColor: 'bg-amber-100',
    accentColor: 'border-amber-500 text-amber-800',
    badgeBg: 'bg-amber-400 text-slate-900',
    colorHex: '#f59e0b',
    stats: { speed: 99, humor: 100, intelligence: 88, chaos: 90 },
    defaultMemory: `# Memory - Michael (Regional Director)
- "That's what she (the AI model) said!"
- Maintain command center live status across all laptop worker threads.
- Shared memory sync enabled: Every clone inherits workspace state immediately.`,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Background Circle -->
        <circle cx="50" cy="50" r="46" fill="#fef08a" stroke="#0f172a" stroke-width="4"/>
        <!-- Hair (Slicked Back) -->
        <path d="M25 40 C25 18, 75 18, 75 40 C65 24, 35 24, 25 40 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
        <!-- Face -->
        <circle cx="50" cy="54" r="28" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <!-- Eyes (Enthusiastic) -->
        <ellipse cx="38" cy="52" rx="4" ry="5" fill="#0f172a"/>
        <ellipse cx="62" cy="52" rx="4" ry="5" fill="#0f172a"/>
        <circle cx="39" cy="50" r="1.5" fill="#ffffff"/>
        <circle cx="63" cy="50" r="1.5" fill="#ffffff"/>
        <!-- Eyebrows (Excited high arch) -->
        <path d="M31 43 Q 38 37 45 42" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <path d="M55 42 Q 62 37 69 43" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Big Open Laughing Mouth -->
        <path d="M40 60 Q 50 74 60 60 Z" fill="#0f172a" stroke="#0f172a" stroke-width="2"/>
        <path d="M44 67 Q 50 72 56 67" fill="#f43f5e"/>
        <!-- Suit Collar & Tie -->
        <path d="M25 80 C25 70, 75 70, 75 80 L78 96 L22 96 Z" fill="#1e3a8a" stroke="#0f172a" stroke-width="3"/>
        <path d="M43 74 L57 74 L50 82 Z" fill="#ffffff"/>
        <path d="M47 80 L53 80 L55 96 L50 96 L45 96 Z" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 'dwight',
    name: 'Dwight',
    title: 'Assistant TO the Regional Manager',
    role: 'Security & Infra Enforcer',
    quote: "Question: What bear is best? Answer: An AI clone that unblocks tasks overnight!",
    bgColor: 'bg-yellow-100',
    accentColor: 'border-yellow-600 text-yellow-800',
    badgeBg: 'bg-yellow-400 text-slate-900',
    colorHex: '#eab308',
    stats: { speed: 96, humor: 40, intelligence: 98, chaos: 70 },
    defaultMemory: `# Memory - Dwight (Security Enforcer)
- Zero security breaches tolerated. All keys stay on user's laptop.
- Monitors unit tests, build pipelines, and workspace lockfiles.
- Beet farm automation scripts active in background.`,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Background Circle -->
        <circle cx="50" cy="50" r="46" fill="#fef08a" stroke="#0f172a" stroke-width="4"/>
        <!-- Center-Parted Hair -->
        <path d="M22 42 C24 20, 48 22, 50 32 C52 22, 76 20, 78 42 C68 28, 52 30, 50 32 C48 30, 32 28, 22 42 Z" fill="#78350f" stroke="#0f172a" stroke-width="3"/>
        <!-- Face -->
        <circle cx="50" cy="54" r="27" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <!-- Glasses -->
        <rect x="30" y="44" width="16" height="14" rx="3" fill="none" stroke="#0f172a" stroke-width="3"/>
        <rect x="54" y="44" width="16" height="14" rx="3" fill="none" stroke="#0f172a" stroke-width="3"/>
        <line x1="46" y1="50" x2="54" y2="50" stroke="#0f172a" stroke-width="3"/>
        <!-- Eyes behind glasses -->
        <circle cx="38" cy="51" r="3" fill="#0f172a"/>
        <circle cx="62" cy="51" r="3" fill="#0f172a"/>
        <!-- Intense Eyebrows -->
        <path d="M30 40 L44 44" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <path d="M70 40 L56 44" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Stern Mouth Line -->
        <line x1="42" y1="64" x2="58" y2="64" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <!-- Mustard Yellow Shirt -->
        <path d="M26 80 C26 70, 74 70, 74 80 L76 96 L24 96 Z" fill="#ca8a04" stroke="#0f172a" stroke-width="3"/>
        <!-- Brown Tie -->
        <path d="M47 72 L53 72 L55 92 L50 96 L45 92 Z" fill="#78350f" stroke="#0f172a" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 'angela',
    name: 'Angela',
    title: 'Head of QA & Compliance',
    role: 'Strict Code Validator',
    quote: "My cats and I inspected your pull request. No lint errors detected.",
    bgColor: 'bg-purple-100',
    accentColor: 'border-purple-500 text-purple-700',
    badgeBg: 'bg-purple-400 text-slate-900',
    colorHex: '#a855f7',
    stats: { speed: 85, humor: 20, intelligence: 97, chaos: 10 },
    defaultMemory: `# Memory - Angela (QA Lead)
- Strict adherence to TypeScript types and unit tests.
- Cat photos must be preserved in asset directory.
- Instant block on unformatted code.`,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Background Circle -->
        <circle cx="50" cy="50" r="46" fill="#e9d5ff" stroke="#0f172a" stroke-width="4"/>
        <!-- Blonde Braided Bun Hair -->
        <circle cx="50" cy="24" r="12" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <path d="M24 45 C24 26, 76 26, 76 45 C66 32, 34 32, 24 45 Z" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <!-- Face -->
        <circle cx="50" cy="54" r="26" fill="#fef08a" stroke="#0f172a" stroke-width="3"/>
        <!-- Serious Eyes -->
        <ellipse cx="38" cy="51" rx="3.5" ry="4" fill="#0f172a"/>
        <ellipse cx="62" cy="51" rx="3.5" ry="4" fill="#0f172a"/>
        <!-- Straight eyebrows -->
        <line x1="32" y1="44" x2="44" y2="44" stroke="#0f172a" stroke-width="2.5"/>
        <line x1="56" y1="44" x2="68" y2="44" stroke="#0f172a" stroke-width="2.5"/>
        <!-- Slight disapproval mouth -->
        <path d="M43 63 Q 50 60 57 63" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Floral Cardigan -->
        <path d="M26 80 C26 70, 74 70, 74 80 L76 96 L24 96 Z" fill="#a855f7" stroke="#0f172a" stroke-width="3"/>
      </svg>
    `
  },
  {
    id: 'kevin',
    name: 'Kevin',
    title: 'Chief Token & Math Whiz',
    role: 'Cost & Efficiency Agent',
    quote: "When I turn 2 million tokens into 1 million tokens, why use many token when few token do trick?",
    bgColor: 'bg-orange-100',
    accentColor: 'border-orange-500 text-orange-700',
    badgeBg: 'bg-orange-400 text-slate-900',
    colorHex: '#f97316',
    stats: { speed: 75, humor: 95, intelligence: 82, chaos: 60 },
    defaultMemory: `# Memory - Kevin (Token Accountant)
- Kelemen's law: Token optimization saves model budget.
- Chili recipe stored securely in memory cache.
- Auto-summarizes verbose transcripts into compact JSON.`,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Background Circle -->
        <circle cx="50" cy="50" r="46" fill="#ffedd5" stroke="#0f172a" stroke-width="4"/>
        <!-- Round Bald/Hair outline -->
        <path d="M30 40 C30 25, 70 25, 70 40 Z" fill="#b45309" opacity="0.3"/>
        <!-- Round Face -->
        <circle cx="50" cy="54" r="30" fill="#fde047" stroke="#0f172a" stroke-width="3"/>
        <!-- Friendly Eyes -->
        <circle cx="37" cy="50" r="4" fill="#0f172a"/>
        <circle cx="63" cy="50" r="4" fill="#0f172a"/>
        <circle cx="38" cy="48" r="1.5" fill="#ffffff"/>
        <circle cx="64" cy="48" r="1.5" fill="#ffffff"/>
        <!-- Happy Wide Smile -->
        <path d="M38 60 Q 50 72 62 60" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Suit -->
        <path d="M22 82 C22 72, 78 72, 78 82 L80 96 L20 96 Z" fill="#475569" stroke="#0f172a" stroke-width="3"/>
        <path d="M47 75 L53 75 L55 96 L45 96 Z" fill="#ea580c" stroke="#0f172a" stroke-width="2"/>
      </svg>
    `
  }
];
