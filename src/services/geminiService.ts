// Unified AI & Live Intelligence Service (DeepSeek & Gemini Multi-Provider Engine)

export interface AIProviderStats {
  provider: 'DeepSeek' | 'Gemini' | 'RealTimeWeb';
  modelName: string;
  totalKeys: number;
  currentKeyIndex: number;
  activeKeyMasked: string;
  totalRotations: number;
  successfulCalls: number;
  failedCalls: number;
  lastStatusText?: string;
}

/**
 * Extract DeepSeek Key from environment or local storage
 */
export function getDeepSeekKey(): string | null {
  const envObj = import.meta.env || {};
  const envKey = envObj.VITE_DEEPSEEK_API_KEY || envObj.DEEPSEEK_API_KEY;
  if (typeof envKey === 'string' && envKey.trim()) return envKey.trim();

  try {
    const custom = localStorage.getItem('ai_deepseek_api_key');
    if (custom && custom.trim()) return custom.trim();
  } catch (e) {}

  return null;
}

/**
 * Extract all Gemini keys
 */
export function getGeminiKeyPool(): string[] {
  const envObj = import.meta.env || {};
  const keys: string[] = [];

  Object.keys(envObj).forEach((envKey) => {
    if (envKey.includes('GEMINI') || envKey.includes('VITE_GEMINI')) {
      const val = envObj[envKey];
      if (typeof val === 'string' && val.trim()) {
        val.split(',').forEach((singleKey) => {
          const trimmed = singleKey.trim();
          if (trimmed && !keys.includes(trimmed)) {
            keys.push(trimmed);
          }
        });
      }
    }
  });

  try {
    const custom = localStorage.getItem('ai_gemini_api_key');
    if (custom && custom.trim() && !keys.includes(custom.trim())) {
      keys.unshift(custom.trim());
    }
  } catch (e) {}

  return keys;
}

let totalRotations = 0;
let successfulCalls = 0;
let failedCalls = 0;
let lastStatus = 'Ready';

const blacklistedKeys = new Set<string>();
const rateLimitedKeys = new Map<string, number>();

export function getRotationStats(): AIProviderStats {
  const deepseek = getDeepSeekKey();
  const geminiPool = getGeminiKeyPool().filter(k => !blacklistedKeys.has(k));

  if (deepseek) {
    return {
      provider: 'DeepSeek',
      modelName: 'deepseek-chat',
      totalKeys: 1,
      currentKeyIndex: 1,
      activeKeyMasked: `${deepseek.substring(0, 7)}...${deepseek.substring(deepseek.length - 4)}`,
      totalRotations,
      successfulCalls,
      failedCalls,
      lastStatusText: lastStatus,
    };
  }

  const currentKey = geminiPool[0] || '';
  const masked = currentKey
    ? `${currentKey.substring(0, 7)}...${currentKey.substring(currentKey.length - 4)}`
    : 'No Live Keys (Using Web Crawler)';

  return {
    provider: geminiPool.length > 0 ? 'Gemini' : 'RealTimeWeb',
    modelName: geminiPool.length > 0 ? 'gemini-2.5-flash' : 'Real-time HTTP Crawler',
    totalKeys: geminiPool.length,
    currentKeyIndex: geminiPool.length > 0 ? 1 : 0,
    activeKeyMasked: masked,
    totalRotations,
    successfulCalls,
    failedCalls,
    lastStatusText: lastStatus,
  };
}

/**
 * Execute real AI call via DeepSeek or Gemini
 */
export async function callAI(
  prompt: string,
  modelName?: string
): Promise<{ text: string; keyUsedIndex: number; provider: string }> {
  // 1. Try DeepSeek first if key is present
  const deepseekKey = getDeepSeekKey();
  if (deepseekKey) {
    try {
      // Try local proxy first to bypass browser CORS
      const endpoint = '/api/deepseek/chat/completions';
      const targetModel = modelName || 'deepseek-chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            {
              role: 'system',
              content: 'You are an elite B2B sales intelligence agent. Provide structured, accurate real-time data.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          successfulCalls++;
          totalRotations++;
          lastStatus = 'DeepSeek 200 OK';
          return { text: content, keyUsedIndex: 1, provider: 'DeepSeek' };
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        lastStatus = `DeepSeek ${response.status}: ${errJson?.error?.message || 'Error'}`;
        console.warn('[AI Service] DeepSeek returned non-200:', response.status, errJson);
      }
    } catch (err) {
      console.warn('[AI Service] DeepSeek proxy call failed, checking Gemini pool...', err);
    }
  }

  // 2. Try Gemini Key Pool
  const geminiPool = getGeminiKeyPool().filter(k => !blacklistedKeys.has(k));
  if (geminiPool.length > 0) {
    for (const key of geminiPool) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 3072,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            successfulCalls++;
            totalRotations++;
            lastStatus = 'Gemini 200 OK';
            return { text, keyUsedIndex: 1, provider: 'Gemini' };
          }
        } else if (res.status === 429) {
          rateLimitedKeys.set(key, Date.now() + 120000);
          failedCalls++;
        }
      } catch (e) {
        // failover
      }
    }
  }

  throw new Error('No active AI key with positive balance found. Using real-time live web directory scraper.');
}

// Backwards compatibility alias
export const callGemini = callAI;
