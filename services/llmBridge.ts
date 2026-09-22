/**
 * Unified LLM Protocol Bridge (llmBridge.ts)
 * 
 * Normalizes differences between Google Gemini API and OpenAI-compatible APIs
 * (LM Studio, Ollama, OpenRouter, Groq, DeepSeek, etc.).
 * 
 * Guarantees:
 * 1. Strict Gemini API isolation: When LM Studio or another local/3rd-party LLM is selected,
 *    NO payload or request will ever leak or fall back to Gemini API.
 * 2. Bi-modal LM Studio Support: Seamlessly handles Direct Local (localhost:1234) and Proxy (/api/proxy/lmstudio).
 * 3. Standardized Text & System Instruction Wrapping: Separates systemInstruction for Gemini,
 *    maps to messages: [{ role: 'system' }, { role: 'user' }] for OpenAI-compatibles.
 * 4. Robust Response & JSON Extraction: Cleanly unwraps stream deltas, non-stream responses,
 *    and extracts pure JSON even if wrapped in Markdown fences.
 */

import { ProviderType, LLMProviderConfig, ConnectionMode } from '../types';
import { cleanAndRepairJson } from './jsonComplianceService';

export interface StandardChatPayload {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  jsonMode?: boolean;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIChatRequest {
  model: string;
  messages: OpenAIMessage[];
  stream: boolean;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}

export interface GeminiFormattedRequest {
  contents: string;
  config?: {
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
  };
}

/**
 * GEMINI ISOLATION GUARD
 * Throws a fatal exception if any attempt is made to contact Gemini
 * when another provider (such as LM Studio) is intended.
 */
export const assertGeminiIsolation = (
  intendedProvider: ProviderType,
  executingProvider: string
): void => {
  if (intendedProvider !== 'gemini' && executingProvider.toLowerCase().includes('gemini')) {
    const errorMsg = `[GeminiIsolationGuard] CRITICAL: Attempted to call Gemini API while active provider is "${intendedProvider}". Request aborted to prevent data leak.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * Format payload into OpenAI-compatible format (LM Studio, LM Studio Bionic, Unsloth, Ollama, OpenRouter, etc.)
 * Strictly sanitizes payload and enforces JSON mode / schema delivery integrity.
 */
export const formatForOpenAI = (
  payload: StandardChatPayload,
  model: string,
  providerConfig?: LLMProviderConfig
): OpenAIChatRequest => {
  const messages: OpenAIMessage[] = [];

  // 1. Map system instruction cleanly into the first message with strict JSON formatting directive if requested
  let systemText = (payload.systemInstruction || '').trim();

  // If JSON mode requested or provider set to strict_json_object, enhance system prompt for local models
  if (payload.jsonMode || providerConfig?.jsonMode === 'strict_json_object') {
    const jsonDirective = '【SYSTEM MANDATE: OUTPUT STRICT RAW JSON ONLY. DO NOT INCLUDE ANY MARKDOWN FENCES (```), GREETINGS, OR EXPLANATORY TEXT.】';
    systemText = systemText ? `${systemText}\n\n${jsonDirective}` : jsonDirective;
  }

  if (systemText) {
    messages.push({
      role: 'system',
      content: systemText,
    });
  }

  // 2. Map user prompt with empty string fallback and strict sanitization
  const userContent = (payload.prompt || '').trim() || ' ';
  messages.push({
    role: 'user',
    content: userContent,
  });

  const request: OpenAIChatRequest = {
    model: model || 'default-model',
    messages,
    stream: payload.stream ?? true,
  };

  if (payload.temperature !== undefined) {
    request.temperature = payload.temperature;
  }
  if (payload.maxTokens !== undefined && payload.maxTokens > 0) {
    request.max_tokens = payload.maxTokens;
  }

  // 3. Attach response_format: { type: "json_object" } when appropriate
  const isPromptOnly = providerConfig?.jsonMode === 'prompt_only' || providerConfig?.jsonMode === 'disabled';
  if ((payload.jsonMode || providerConfig?.jsonMode === 'strict_json_object') && !isPromptOnly) {
    request.response_format = { type: 'json_object' };
  }

  return request;
};

/**
 * Format payload for Google Gemini (@google/genai)
 */
export const formatForGemini = (
  payload: StandardChatPayload
): GeminiFormattedRequest => {
  const contents = (payload.prompt || '').trim() || ' ';
  const config: GeminiFormattedRequest['config'] = {};

  if (payload.systemInstruction && payload.systemInstruction.trim()) {
    config.systemInstruction = payload.systemInstruction.trim();
  }
  if (payload.temperature !== undefined) {
    config.temperature = payload.temperature;
  }
  if (payload.maxTokens !== undefined && payload.maxTokens > 0) {
    config.maxOutputTokens = payload.maxTokens;
  }

  return {
    contents,
    ...(Object.keys(config).length > 0 ? { config } : {}),
  };
};

/**
 * Resolve endpoint for a provider, taking Direct vs Proxy into account
 */
export const resolveEndpoint = (
  provider: LLMProviderConfig,
  type: 'chat' | 'models' = 'chat'
): {
  url: string;
  mode: ConnectionMode | 'cloud';
  isProxy: boolean;
  description: string;
} => {
  const providerId = provider.id;

  // Cloud providers
  if (provider.category === 'cloud' || provider.category === 'router') {
    if (providerId === 'gemini') {
      return {
        url: 'Google Gen AI SDK (Official)',
        mode: 'cloud',
        isProxy: false,
        description: 'Google Gen AI SDK (@google/genai)',
      };
    }
    if (providerId === 'openrouter') {
      return {
        url: type === 'models' ? 'https://openrouter.ai/api/v1/models' : 'https://openrouter.ai/api/v1/chat/completions',
        mode: 'cloud',
        isProxy: false,
        description: 'OpenRouter Cloud API',
      };
    }
    if (providerId === 'groq') {
      const base = provider.baseUrl?.replace(/\/$/, '') || 'https://api.groq.com/openai/v1';
      return {
        url: type === 'models' ? `${base}/models` : `${base}/chat/completions`,
        mode: 'cloud',
        isProxy: false,
        description: 'Groq Cloud API',
      };
    }
    if (providerId === 'deepseek') {
      const base = provider.baseUrl?.replace(/\/$/, '') || 'https://api.deepseek.com';
      return {
        url: type === 'models' ? `${base}/models` : `${base}/chat/completions`,
        mode: 'cloud',
        isProxy: false,
        description: 'DeepSeek Cloud API',
      };
    }
    if (providerId === 'openai') {
      const base = provider.baseUrl?.replace(/\/$/, '') || 'https://api.openai.com/v1';
      return {
        url: type === 'models' ? `${base}/models` : `${base}/chat/completions`,
        mode: 'cloud',
        isProxy: false,
        description: 'OpenAI Cloud API',
      };
    }
    if (providerId === 'anthropic') {
      const base = provider.baseUrl?.replace(/\/$/, '') || 'https://api.anthropic.com/v1';
      return {
        url: `${base}/messages`,
        mode: 'cloud',
        isProxy: false,
        description: 'Anthropic Cloud API',
      };
    }
    if (providerId === 'github') {
      const base = provider.baseUrl?.replace(/\/$/, '') || 'https://models.inference.ai.azure.com';
      return {
        url: `${base}/chat/completions`,
        mode: 'cloud',
        isProxy: false,
        description: 'GitHub Models Inference API',
      };
    }
    if (providerId === 'huggingface') {
      const base = provider.baseUrl?.replace(/\/$/, '') || 'https://router.huggingface.co/novita/v1';
      return {
        url: `${base}/chat/completions`,
        mode: 'cloud',
        isProxy: false,
        description: 'Hugging Face Novita Router API',
      };
    }
  }

  // Local PC Providers (LM Studio, Ollama, Custom)
  const isProxyMode = provider.connectionMode === 'proxy';

  if (providerId === 'lmstudio' || providerId === 'lmstudio_bionic') {
    const isBionic = providerId === 'lmstudio_bionic';
    if (isProxyMode) {
      const proxyBase = provider.proxyUrl?.replace(/\/$/, '') || '/api/proxy/lmstudio';
      return {
        url: type === 'models' ? `${proxyBase}/models` : `${proxyBase}/chat/completions`,
        mode: 'proxy',
        isProxy: true,
        description: `Proxy経由 (${proxyBase}) ➔ ${isBionic ? 'LM Studio Bionic' : 'LM Studio'} (http://127.0.0.1:1234/v1)`,
      };
    } else {
      const directBase = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:1234/v1';
      return {
        url: type === 'models' ? `${directBase}/models` : `${directBase}/chat/completions`,
        mode: 'direct',
        isProxy: false,
        description: `Direct直接接続 (${directBase}) [${isBionic ? 'LM Studio Bionic' : 'LM Studio'}]`,
      };
    }
  }

  if (providerId === 'unsloth') {
    if (isProxyMode) {
      const proxyBase = provider.proxyUrl?.replace(/\/$/, '') || '/api/proxy/unsloth';
      return {
        url: type === 'models' ? `${proxyBase}/models` : `${proxyBase}/chat/completions`,
        mode: 'proxy',
        isProxy: true,
        description: `Proxy経由 (${proxyBase}) ➔ Unsloth Studio (http://127.0.0.1:8000/v1)`,
      };
    } else {
      const directBase = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:8000/v1';
      return {
        url: type === 'models' ? `${directBase}/models` : `${directBase}/chat/completions`,
        mode: 'direct',
        isProxy: false,
        description: `Direct直接接続 (${directBase}) [Unsloth Studio]`,
      };
    }
  }

  if (providerId === 'openai_compat') {
    if (isProxyMode) {
      const proxyBase = provider.proxyUrl?.replace(/\/$/, '') || '/api/proxy/openai-compat';
      return {
        url: type === 'models' ? `${proxyBase}/models` : `${proxyBase}/chat/completions`,
        mode: 'proxy',
        isProxy: true,
        description: `Proxy経由 (${proxyBase}) ➔ OpenAI互換サーバー`,
      };
    } else {
      const directBase = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:8000/v1';
      return {
        url: type === 'models' ? `${directBase}/models` : `${directBase}/chat/completions`,
        mode: 'direct',
        isProxy: false,
        description: `Direct直接接続 (${directBase}) [OpenAI互換]`,
      };
    }
  }

  if (providerId === 'ollama') {
    if (isProxyMode) {
      const proxyBase = provider.proxyUrl?.replace(/\/$/, '') || '/api/proxy/ollama';
      return {
        url: type === 'models' ? `${proxyBase}/api/tags` : `${proxyBase}/v1/chat/completions`,
        mode: 'proxy',
        isProxy: true,
        description: `Proxy経由 (${proxyBase}) ➔ http://127.0.0.1:11434`,
      };
    } else {
      const directBase = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:11434';
      return {
        url: type === 'models' ? `${directBase}/api/tags` : `${directBase}/v1/chat/completions`,
        mode: 'direct',
        isProxy: false,
        description: `Direct直接接続 (${directBase})`,
      };
    }
  }

  // Custom or other
  const customBase = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:8000/v1';
  return {
    url: type === 'models' ? `${customBase}/models` : `${customBase}/chat/completions`,
    mode: isProxyMode ? 'proxy' : 'direct',
    isProxy: isProxyMode,
    description: isProxyMode ? `Proxy: ${customBase}` : `Direct: ${customBase}`,
  };
};

/**
 * Extract plain text chunk from SSE or JSON payload across OpenAI/LM Studio/Ollama
 */
export const extractOpenAITextChunk = (chunkData: any): { text: string; isReasoning?: boolean } => {
  if (!chunkData) return { text: '' };

  // 1. OpenAI Chat Completion chunk
  const delta = chunkData.choices?.[0]?.delta;
  if (delta) {
    if (delta.content) {
      return { text: delta.content, isReasoning: false };
    }
    if (delta.reasoning_content) {
      return { text: delta.reasoning_content, isReasoning: true };
    }
  }

  // 2. Non-streaming OpenAI response
  const message = chunkData.choices?.[0]?.message;
  if (message?.content) {
    return { text: message.content, isReasoning: false };
  }

  // 3. Choice text field (legacy / v1/completions)
  if (chunkData.choices?.[0]?.text) {
    return { text: chunkData.choices[0].text, isReasoning: false };
  }

  // 4. Ollama raw response format (e.g. /api/generate or /api/chat)
  if (typeof chunkData.response === 'string') {
    return { text: chunkData.response, isReasoning: false };
  }
  if (chunkData.message?.content) {
    return { text: chunkData.message.content, isReasoning: false };
  }

  return { text: '' };
};

/**
 * Extract JSON object safely from LLM output string
 * Utilizes the deep cleanAndRepairJson engine to recover from malformed JSON,
 * markdown blocks, trailing commas, single quotes, unclosed braces, etc.
 */
export const extractJsonFromText = <T = any>(rawText: string, fallback: T): T => {
  if (!rawText || !rawText.trim()) return fallback;

  // Use comprehensive auto-repair engine
  const repairResult = cleanAndRepairJson(rawText);
  if (repairResult.success && repairResult.parsed !== null && repairResult.parsed !== undefined) {
    return repairResult.parsed as T;
  }

  return fallback;
};
