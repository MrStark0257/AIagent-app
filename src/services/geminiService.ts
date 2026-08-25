// Gemini API Key Rotation & Live Model Execution Engine

/**
 * Dynamically extract all VITE_GEMINI_API_KEY_* environment variables at runtime.
 * Never hardcode raw secret keys in the TypeScript source code!
 */
export function getGeminiKeyPool(): string[] {
  const envObj = import.meta.env || {};
  const keys: string[] = [];

  // 1. Scan for distinct VITE_GEMINI_API_KEY_1, VITE_GEMINI_API_KEY_2, etc.
  Object.keys(envObj).forEach((envKey) => {
    if (envKey.startsWith('VITE_GEMINI_API_KEY') || envKey.startsWith('VITE_GEMINI_KEY')) {
      const val = envObj[envKey];
      if (typeof val === 'string' && val.trim()) {
        // Handle comma-separated fallback or single key
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

export interface RotationStats {
  totalKeys: number;
  currentKeyIndex: number;
  activeKeyMasked: string;
  totalRotations: number;
  successfulCalls: number;
  failedCalls: number;
}

export function getRotationStats(): RotationStats {
  const pool = GEMINI_KEY_POOL;
  const currentKey = pool[currentKeyIndex] || '';
  const masked = currentKey
    ? `${currentKey.substring(0, 7)}...${currentKey.substring(currentKey.length - 4)}`
    : 'No Keys Loaded';

  return {
    totalKeys: pool.length,
    currentKeyIndex: pool.length > 0 ? currentKeyIndex + 1 : 0,
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
  const pool = GEMINI_KEY_POOL;

  if (pool.length === 0) {
    throw new Error('No Gemini API keys found in .env. Please configure VITE_GEMINI_API_KEY_1 in your .env file.');
  }

  const maxAttempts = pool.length;
  let attempts = 0;

  // Modern Gemini models to try in sequence if a model endpoint 404s
  const modelsToTry = [modelName, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

  while (attempts < maxAttempts) {
    const key = pool[currentKeyIndex];
    const keyNum = currentKeyIndex + 1;
    attempts++;

    for (const activeModel of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${key}`,
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
          const errData = await response.json().catch(() => ({}));
          const status = response.status;
          console.warn(
            `[Gemini Key Rotator] Key #${keyNum} (${activeModel}) returned HTTP ${status}:`,
            errData?.error?.message || response.statusText
          );

          if (status === 404) {
            // Try next model fallback
            continue;
          }

          // If 400 (Invalid Key) or 429 (Quota), break model loop to rotate to next key in pool
          break;
        }

        const data = await response.json();
        const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) {
          break;
        }

        successfulCalls++;
        const usedIndex = currentKeyIndex + 1;
        // Keep using valid key or rotate load balance
        totalRotations++;

        return { text: textOutput, keyUsedIndex: usedIndex };
      } catch (err) {
        console.warn(`[Gemini Key Rotator] Network error on Key #${keyNum}:`, err);
        break;
      }
    }

    // Key failed all models, rotate to next key in pool
    currentKeyIndex = (currentKeyIndex + 1) % pool.length;
    totalRotations++;
    failedCalls++;
  }

  throw new Error(`All ${pool.length} Gemini API keys in pool were attempted and failed. Check your API key status in Google AI Studio.`);
}

