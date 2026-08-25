import { GoogleGenAI } from '@google/genai';
import {
  ExecutionMode,
  LLMProviderConfig,
  ProviderType,
  LLMSettings,
} from '../types';

// In-memory rate limiting history for Gemini
let geminiRequestTimestamps: number[] = [];

/**
 * Clean up timestamps older than 60 seconds
 */
const cleanupOldTimestamps = () => {
  const now = Date.now();
  geminiRequestTimestamps = geminiRequestTimestamps.filter(t => now - t < 60000);
};

/**
 * Get current count of Gemini requests in the last 60 seconds
 */
export const getGeminiRecentRequestCount = (): number => {
  cleanupOldTimestamps();
  return geminiRequestTimestamps.length;
};

/**
 * Check if a Gemini request can be made right now under the RPM limit
 */
export const canExecuteGemini = (rpm: number): boolean => {
  cleanupOldTimestamps();
  return geminiRequestTimestamps.length < rpm;
};

/**
 * Calculate how many seconds until next Gemini slot is free
 */
export const getGeminiWaitSeconds = (rpm: number): number => {
  cleanupOldTimestamps();
  if (geminiRequestTimestamps.length < rpm) {
    return 0;
  }
  // The oldest timestamp in the current window of `rpm` requests
  const oldestInWindow = geminiRequestTimestamps[0];
  const elapsed = Date.now() - oldestInWindow;
  const remainingMs = Math.max(0, 60000 - elapsed);
  return Math.ceil(remainingMs / 1000);
};

/**
 * Record a new Gemini execution timestamp
 */
export const recordGeminiRequest = (): void => {
  geminiRequestTimestamps.push(Date.now());
  cleanupOldTimestamps();
};

/**
 * Helper to sleep for ms
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Auto-wait for Gemini rate limit cooldown with second-by-second progress callback
 */
export const waitForGeminiCooldown = async (
  rpm: number,
  onTick?: (remainingSeconds: number) => void
): Promise<void> => {
  while (!canExecuteGemini(rpm)) {
    const waitSec = getGeminiWaitSeconds(rpm);
    if (waitSec <= 0) break;
    if (onTick) onTick(waitSec);
    await sleep(1000);
  }
  if (onTick) onTick(0);
};

/**
 * Compose system instructions with execution mode modifiers
 */
export const getSystemInstructionForMode = (
  mode: ExecutionMode,
  originalPrompt: string
): string | undefined => {
  switch (mode) {
    case ExecutionMode.RESEARCH:
      return `【リサーチ強化モード指示】
まず、ユーザーの入力プロンプトの背景、市場トレンド、関連する専門用語や事例を多角的に深くリサーチ・分析してください。そのリサーチ結果と深い知見を踏まえた上で、ユーザーの元の要望に対して圧倒的な解像度と具体性を持った最高水準のアウトプットを作成してください。
元のプロンプト: "${originalPrompt}"`;
    case ExecutionMode.IMPROVE:
      return `【改善・洗練モード指示】
プロンプトエンジニアリングおよびクリエイティブディレクターの視点から、ユーザーの入力プロンプトの意図、具体性、曖昧さを分析し、まず「より効果的な洗練プロンプト案（改善版）」を提示してください。その上で、その改善されたプロンプトに基づいて生成された最高品質の回答を出力してください。
元のプロンプト: "${originalPrompt}"`;
    case ExecutionMode.SIMULATE:
      return `【テスト・シミュレーションモード指示】
ユーザーのプロンプトをベースシナリオとして捉え、異なるターゲット層、異なるトーン、あるいは3つの対照的な切り口（例: 尖った革新派、手堅い王道派、超初心者フレンドリー派など）による「3つの異なるバリエーション・もしものシナリオ」を展開して出力してください。
元のプロンプト: "${originalPrompt}"`;
    case ExecutionMode.STRAIGHT:
    default:
      return undefined;
  }
};

export const composeFinalSystemInstruction = (
  mode: ExecutionMode,
  prompt: string,
  customSystemInstruction?: string
): string | undefined => {
  const modeInstruction = getSystemInstructionForMode(mode, prompt);

  if (customSystemInstruction && modeInstruction) {
    return `${customSystemInstruction}\n\n--- [実行モード追加指示] ---\n${modeInstruction}`;
  }
  return customSystemInstruction || modeInstruction;
};

/* ==========================================================================
   CONNECTION TESTING & MODEL LIST FETCHING
   ========================================================================== */

export interface ConnectionTestResult {
  success: boolean;
  latencyMs: number;
  models: string[];
  message: string;
}

export const testProviderConnection = async (
  provider: LLMProviderConfig
): Promise<ConnectionTestResult> => {
  const startTime = Date.now();

  try {
    switch (provider.id) {
      case 'gemini': {
        const apiKey = provider.apiKey || (typeof process !== 'undefined' ? process.env.API_KEY : '');
        if (!apiKey) {
          throw new Error('Gemini APIキーが設定されていません。');
        }
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: provider.selectedModel || 'gemini-2.5-flash',
          contents: 'Ping! 1単語で「OK」と返答してください。',
        });
        const latencyMs = Date.now() - startTime;
        return {
          success: true,
          latencyMs,
          models: provider.availableModels,
          message: `接続成功 (${latencyMs}ms) - 応答: ${response.text?.slice(0, 30)}`,
        };
      }

      case 'openrouter': {
        if (!provider.apiKey) {
          throw new Error('OpenRouter APIキーを入力してください。');
        }
        const res = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            'HTTP-Referer': window.location.origin || 'http://localhost:3000',
            'X-Title': 'AI Prompt Orchestrator',
          },
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        const data = await res.json();
        const fetchedModels: string[] = (data.data || [])
          .map((m: any) => m.id)
          .filter(Boolean)
          .slice(0, 100);

        return {
          success: true,
          latencyMs,
          models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
          message: `接続成功 (${latencyMs}ms) - ${fetchedModels.length}件のモデルを取得しました`,
        };
      }

      case 'ollama': {
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:11434';
        try {
          const res = await fetch(`${baseUrl}/api/tags`, {
            method: 'GET',
          });
          const latencyMs = Date.now() - startTime;
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          const data = await res.json();
          const fetchedModels: string[] = (data.models || [])
            .map((m: any) => m.name)
            .filter(Boolean);

          if (fetchedModels.length === 0) {
            return {
              success: true,
              latencyMs,
              models: provider.availableModels,
              message: `Ollamaに接続成功 (${latencyMs}ms)。ローカルモデルが未ダウンロードです ('ollama run llama3.3' 等を実行してください)`,
            };
          }

          return {
            success: true,
            latencyMs,
            models: fetchedModels,
            message: `ローカルOllama接続成功 (${latencyMs}ms) - ${fetchedModels.length}件のモデルを検出: ${fetchedModels.slice(0, 3).join(', ')}...`,
          };
        } catch (fetchErr: any) {
          throw new Error(
            `Ollama接続失敗 (${baseUrl}): ${fetchErr.message}。Ollamaが起動しているか、CORS設定 (OLLAMA_ORIGINS="*") を確認してください。`
          );
        }
      }

      case 'lmstudio': {
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:1234/v1';
        try {
          const res = await fetch(`${baseUrl}/models`, {
            method: 'GET',
            headers: provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {},
          });
          const latencyMs = Date.now() - startTime;
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          const data = await res.json();
          const fetchedModels: string[] = (data.data || [])
            .map((m: any) => m.id)
            .filter(Boolean);

          return {
            success: true,
            latencyMs,
            models: fetchedModels.length > 0 ? fetchedModels : ['local-model'],
            message: `LM Studio接続成功 (${latencyMs}ms) - ロード中モデル: ${fetchedModels.join(', ') || 'OK'}`,
          };
        } catch (fetchErr: any) {
          throw new Error(
            `LM Studio接続失敗 (${baseUrl}): ${fetchErr.message}。LM StudioでLocal Serverを開始し、CORSを有効にしてください。`
          );
        }
      }

      case 'groq': {
        if (!provider.apiKey) throw new Error('Groq APIキーを入力してください。');
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'https://api.groq.com/openai/v1';
        const res = await fetch(`${baseUrl}/models`, {
          headers: { Authorization: `Bearer ${provider.apiKey}` },
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        const data = await res.json();
        const fetchedModels: string[] = (data.data || [])
          .map((m: any) => m.id)
          .filter(Boolean);

        return {
          success: true,
          latencyMs,
          models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
          message: `Groq接続成功 (${latencyMs}ms) - ${fetchedModels.length}件のモデルを取得`,
        };
      }

      case 'deepseek': {
        if (!provider.apiKey) throw new Error('DeepSeek APIキーを入力してください。');
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'https://api.deepseek.com';
        const res = await fetch(`${baseUrl}/models`, {
          headers: { Authorization: `Bearer ${provider.apiKey}` },
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        const data = await res.json();
        const fetchedModels: string[] = (data.data || [])
          .map((m: any) => m.id)
          .filter(Boolean);

        return {
          success: true,
          latencyMs,
          models: fetchedModels.length > 0 ? fetchedModels : ['deepseek-chat', 'deepseek-reasoner'],
          message: `DeepSeek接続成功 (${latencyMs}ms) - ${fetchedModels.join(', ')}`,
        };
      }

      case 'openai': {
        if (!provider.apiKey) throw new Error('OpenAI APIキーを入力してください。');
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'https://api.openai.com/v1';
        const res = await fetch(`${baseUrl}/models`, {
          headers: { Authorization: `Bearer ${provider.apiKey}` },
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        const data = await res.json();
        const fetchedModels: string[] = (data.data || [])
          .map((m: any) => m.id)
          .filter((id: string) => id.includes('gpt') || id.includes('o1') || id.includes('o3'))
          .slice(0, 50);

        return {
          success: true,
          latencyMs,
          models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
          message: `OpenAI接続成功 (${latencyMs}ms) - ${fetchedModels.length}件のGPT/o-seriesモデルを取得`,
        };
      }

      case 'github': {
        if (!provider.apiKey) throw new Error('GitHub PAT（アクセストークン）を入力してください。');
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'https://models.inference.ai.azure.com';
        // Test with a lightweight request
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model: provider.selectedModel || 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Ping! reply "OK"' }],
            max_tokens: 5,
          }),
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        return {
          success: true,
          latencyMs,
          models: provider.availableModels,
          message: `GitHub Models接続成功 (${latencyMs}ms)`,
        };
      }

      case 'anthropic': {
        if (!provider.apiKey) throw new Error('Anthropic APIキーを入力してください。');
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'https://api.anthropic.com/v1';
        const res = await fetch(`${baseUrl}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': provider.apiKey,
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true',
          },
          body: JSON.stringify({
            model: provider.selectedModel || 'claude-3-5-haiku-20241022',
            messages: [{ role: 'user', content: 'Ping! reply "OK"' }],
            max_tokens: 5,
          }),
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        return {
          success: true,
          latencyMs,
          models: provider.availableModels,
          message: `Anthropic接続成功 (${latencyMs}ms)`,
        };
      }

      case 'huggingface': {
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'https://router.huggingface.co/novita/v1';
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (provider.apiKey) {
          headers.Authorization = `Bearer ${provider.apiKey}`;
        }
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: provider.selectedModel || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 5,
          }),
        });
        const latencyMs = Date.now() - startTime;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`HTTP ${res.status}: ${errData.error?.message || res.statusText}`);
        }
        return {
          success: true,
          latencyMs,
          models: provider.availableModels,
          message: `Hugging Face接続成功 (${latencyMs}ms)`,
        };
      }

      case 'custom':
      default: {
        const baseUrl = provider.baseUrl?.replace(/\/$/, '') || 'http://localhost:8000/v1';
        let fetchedModels: string[] = [];
        try {
          const res = await fetch(`${baseUrl}/models`, {
            headers: provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            fetchedModels = (data.data || []).map((m: any) => m.id).filter(Boolean);
          }
        } catch {
          // ignore model list failure for custom
        }

        const latencyMs = Date.now() - startTime;
        return {
          success: true,
          latencyMs,
          models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
          message: `カスタムエンドポイント接続確認 (${latencyMs}ms)${
            fetchedModels.length > 0 ? ` - モデル数: ${fetchedModels.length}` : ''
          }`,
        };
      }
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      latencyMs,
      models: provider.availableModels,
      message: err.message || '接続に失敗しました。',
    };
  }
};

/* ==========================================================================
   UNIFIED PROMPT STREAMING EXECUTION
   ========================================================================== */

export interface ExecutePromptOptions {
  prompt: string;
  mode: ExecutionMode;
  customSystemInstruction?: string;
  knowledgeContext?: string;
  providerConfig: LLMProviderConfig;
  settings: LLMSettings;
  onChunk: (chunk: string) => void;
  onWaitTick?: (remainingSeconds: number) => void;
}

export const executePromptStreamUnified = async (
  options: ExecutePromptOptions
): Promise<void> => {
  const {
    prompt,
    mode,
    customSystemInstruction,
    knowledgeContext,
    providerConfig,
    settings,
    onChunk,
    onWaitTick,
  } = options;

  let combinedInstruction = customSystemInstruction;
  if (knowledgeContext) {
    combinedInstruction = combinedInstruction
      ? `${combinedInstruction}\n\n${knowledgeContext}`
      : knowledgeContext;
  }

  const finalSystemInstruction = composeFinalSystemInstruction(
    mode,
    prompt,
    combinedInstruction
  );

  const providerId = providerConfig.id;

  try {
    /* -----------------------------
       1. GOOGLE GEMINI
       ----------------------------- */
    if (providerId === 'gemini') {
      const rpm = settings.geminiRateLimit.rpm || 15;
      const autoWait = settings.geminiRateLimit.autoWait !== false;

      // Check RPM limit
      if (!canExecuteGemini(rpm)) {
        if (autoWait) {
          onChunk(`⏳ [Gemini 無料枠レート制限待機中: ${rpm} RPM] 次のリクエスト枠まで待機しています...\n`);
          await waitForGeminiCooldown(rpm, onWaitTick);
          onChunk(`\n🚀 [待機解除] プロンプト実行を開始します。\n\n`);
        } else {
          const waitSec = getGeminiWaitSeconds(rpm);
          throw new Error(
            `Geminiレートリミット到達 (${rpm} RPM)。次の実行可能まであと約 ${waitSec} 秒です。設定で「自動待機」を有効にするか、少しお待ちください。`
          );
        }
      }

      const apiKey = providerConfig.apiKey || (typeof process !== 'undefined' ? process.env.API_KEY : '');
      if (!apiKey) {
        throw new Error('Gemini APIキーが設定されていません。');
      }

      recordGeminiRequest();
      const ai = new GoogleGenAI({ apiKey });

      const responseStream = await ai.models.generateContentStream({
        model: providerConfig.selectedModel || 'gemini-2.5-flash',
        contents: prompt,
        ...(finalSystemInstruction && { config: { systemInstruction: finalSystemInstruction } }),
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
      return;
    }

    /* -----------------------------
       2. ANTHROPIC CLAUDE
       ----------------------------- */
    if (providerId === 'anthropic') {
      if (!providerConfig.apiKey) {
        throw new Error('Anthropic APIキーを設定してください。');
      }
      const baseUrl = providerConfig.baseUrl?.replace(/\/$/, '') || 'https://api.anthropic.com/v1';

      const response = await fetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': providerConfig.apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: providerConfig.selectedModel || 'claude-3-7-sonnet-20250219',
          system: finalSystemInstruction,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: providerConfig.maxTokens || 4096,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(`Anthropicエラー (HTTP ${response.status}): ${errJson.error?.message || response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ストリームの読み込みに失敗しました。');
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                onChunk(parsed.delta.text);
              }
            } catch {
              // skip parse err
            }
          }
        }
      }
      return;
    }

    /* -----------------------------
       3. OPENAI-COMPATIBLE SSE STREAMING
       (OpenRouter, Ollama, LM Studio, Groq, DeepSeek, GitHub, HuggingFace, OpenAI, Custom)
       ----------------------------- */
    let baseUrl = providerConfig.baseUrl?.replace(/\/$/, '');
    let endpoint = `${baseUrl}/chat/completions`;

    // Defaults per provider if not specified
    if (!baseUrl) {
      switch (providerId) {
        case 'openrouter':
          endpoint = 'https://openrouter.ai/api/v1/chat/completions';
          break;
        case 'ollama':
          endpoint = 'http://localhost:11434/v1/chat/completions';
          break;
        case 'lmstudio':
          endpoint = 'http://localhost:1234/v1/chat/completions';
          break;
        case 'groq':
          endpoint = 'https://api.groq.com/openai/v1/chat/completions';
          break;
        case 'deepseek':
          endpoint = 'https://api.deepseek.com/chat/completions';
          break;
        case 'github':
          endpoint = 'https://models.inference.ai.azure.com/chat/completions';
          break;
        case 'huggingface':
          endpoint = 'https://router.huggingface.co/novita/v1/chat/completions';
          break;
        case 'openai':
          endpoint = 'https://api.openai.com/v1/chat/completions';
          break;
        default:
          endpoint = 'http://localhost:8000/v1/chat/completions';
      }
    } else if (!endpoint.endsWith('/chat/completions')) {
      endpoint = `${baseUrl}/chat/completions`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (providerConfig.apiKey) {
      headers.Authorization = `Bearer ${providerConfig.apiKey}`;
    }

    if (providerId === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin || 'http://localhost:3000';
      headers['X-Title'] = 'AI Prompt Orchestrator';
    }

    const messages: Array<{ role: string; content: string }> = [];
    if (finalSystemInstruction) {
      messages.push({ role: 'system', content: finalSystemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const requestBody: Record<string, any> = {
      model: providerConfig.selectedModel,
      messages,
      stream: true,
    };

    if (providerConfig.temperature !== undefined) {
      requestBody.temperature = providerConfig.temperature;
    }
    if (providerConfig.maxTokens) {
      requestBody.max_tokens = providerConfig.maxTokens;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg =
        errJson.error?.message ||
        errJson.message ||
        `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`[${providerConfig.name}] エラー: ${errMsg}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ストリームリーダーの初期化に失敗しました。');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue; // comments/empty

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta;
            if (delta?.content) {
              onChunk(delta.content);
            } else if (delta?.reasoning_content) {
              // Support for reasoning tokens (DeepSeek R1 etc.)
              onChunk(delta.reasoning_content);
            }
          } catch {
            // ignore JSON parse chunk errors
          }
        }
      }
    }
  } catch (error: any) {
    console.error('LLM Execution Error:', error);
    const msg = error instanceof Error ? error.message : '予期せぬエラーが発生しました。';
    onChunk(`\n\n❌ [実行エラー - ${providerConfig.name}]: ${msg}`);
  }
};
