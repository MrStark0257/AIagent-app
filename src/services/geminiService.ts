// Gemini API Key Rotation & Live Model Execution Engine

/**
 * Dynamically extract all VITE_GEMINI_API_KEY_* environment variables at runtime.
 * Never hardcode raw secret keys in the TypeScript source code!
 */
export function getGeminiKeyPool(): string[] {
  const envObj = import.meta.env || {};
  const keys: string[] = [];

  // Scan for any environment variable containing GEMINI (e.g. GEMINI_API_KEY_CROP_1, GEMINI_API_KEY_ALERT_1, VITE_GEMINI_API_KEY_1)
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

  return keys;
}

export const GEMINI_KEY_POOL: string[] = getGeminiKeyPool();

let currentKeyIndex = 0;
let totalRotations = 0;
let successfulCalls = 0;
let failedCalls = 0;

const blacklistedKeys = new Set<string>();
const rateLimitedKeys = new Map<string, number>();

export interface RotationStats {
  totalKeys: number;
  currentKeyIndex: number;
  activeKeyMasked: string;
  totalRotations: number;
  successfulCalls: number;
  failedCalls: number;
}

export function getRotationStats(): RotationStats {
  const pool = GEMINI_KEY_POOL.filter(k => !blacklistedKeys.has(k));
  const currentKey = pool[currentKeyIndex % (pool.length || 1)] || '';
  const masked = currentKey
    ? `${currentKey.substring(0, 7)}...${currentKey.substring(currentKey.length - 4)}`
    : 'No Valid Keys';

  return {
    totalKeys: pool.length,
    currentKeyIndex: pool.length > 0 ? (currentKeyIndex % pool.length) + 1 : 0,
    activeKeyMasked: masked,
    totalRotations,
    successfulCalls,
    failedCalls,
  };
}

/**
 * Execute Gemini REST API call with automatic key failover rotation.
 */
export async function callGemini(
  prompt: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<{ text: string; keyUsedIndex: number }> {
  const now = Date.now();
  const allKeys = GEMINI_KEY_POOL;

  // Filter out keys that are permanently invalid (400) or currently in rate-limit cooldown (429)
  const availableKeys = allKeys.filter(k => {
    if (blacklistedKeys.has(k)) return false;
    const cooldownUntil = rateLimitedKeys.get(k);
    if (cooldownUntil && now < cooldownUntil) return false;
    return true;
  });

  if (availableKeys.length === 0) {
    throw new Error('Gemini API free tier rate limit reached. Using verified local intelligence engine.');
  }

  for (const key of availableKeys) {
    const originalIndex = allKeys.indexOf(key) + 1;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 3072,
            },
          }),
        }
      );

      if (!response.ok) {
        const status = response.status;

        if (status === 400) {
          console.warn(`[Gemini Rotation] Key #${originalIndex} (${key.substring(0, 8)}...) returned 400 (Invalid API key). Blacklisting.`);
          blacklistedKeys.add(key);
        } else if (status === 429) {
          console.warn(`[Gemini Rotation] Key #${originalIndex} (${key.substring(0, 8)}...) returned 429 (Rate Limit Exceeded). Cooldown 2m.`);
          rateLimitedKeys.set(key, Date.now() + 120000);
          failedCalls++;
        }
        continue;
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textOutput) {
        successfulCalls++;
        totalRotations++;
        return { text: textOutput, keyUsedIndex: originalIndex };
      }
    } catch (err) {
      rateLimitedKeys.set(key, Date.now() + 60000);
    }
  }

  throw new Error('Gemini API free tier rate limit reached. Using verified local intelligence engine.');
}

