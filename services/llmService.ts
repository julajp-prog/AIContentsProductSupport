import { GoogleGenAI } from '@google/genai';
import {
  ExecutionMode,
  LLMProviderConfig,
  ProviderType,
  LLMSettings,
  LLMStatusMonitorState,
  ConnectionMode,
  HyperExpertSettings,
  LLMErrorDebugInfo,
} from '../types';
import {
  formatForGemini,
  formatForOpenAI,
  resolveEndpoint,
  extractOpenAITextChunk,
  assertGeminiIsolation,
} from './llmBridge';
import { formatHyperExpertPrompt } from './hyperExpertService';
import { cleanAndRepairJson, formatDebugReport } from './jsonComplianceService';

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
    case ExecutionMode.PRIMARY_RESOURCE:
      return `【一次リソース特定・検証モード指示（Primary Source Verification Protocol）】
二次情報、まとめ記事、推測、ハルシネーションを厳格に排除し、以下の「一次リソース（Primary Resources）」に直接遡って確認・特定・検証した上で回答してください。

■ 準拠すべき一次リソース対象：
1. 大手LLM/BigTech元会社（OpenAI, Google AI/DeepMind, Anthropic, Meta AI, Mistral等）の公式API仕様書、System Card、公式発表
2. Hugging Face公式（Model Card, config.json, 公式Leaderboard, Papers）
3. GitHub OSSリポジトリ（公式コードベース、関数シグネチャ、README、Issues/Discussions、Release Notes）
4. ComfyUI（公式リポジトリ、Custom Node実装、公式ノード仕様、Civitaiモデル原典、Workflow JSON仕様）
5. Agent系フレームワーク（LangGraph, AutoGen, CrewAI, LlamaIndex, MCP等）の公式最新ドキュメント
6. 開発者一次コミュニティ（Reddit r/LocalLLaMA, r/MachineLearning, r/ComfyUI等）での実機検証・再現レポート
7. 研究発表・論文原典（arXiv ID、NeurIPS/ICLR/CVPR採択論文、数式・理論定義）
8. 国内エンジニア一次発信（Zenn, Qiitaにおける実機トラブルシューティング・環境構築ログ）

■ 出力フォーマット規定：
必ず以下の構造を含めて回答してください：
①【特定された一次リソース一覧】:
  - リソース名 / 発行元 / カテゴリ / 公式URLまたはリポジトリ名(\`owner/repo\`)またはarXiv ID / バージョン
②【一次情報に基づく仕様・回答（Verified Facts）】:
  - 原典の仕様・コード・公式パラメータに基づく高解像度な解説・成果物
③【二次情報・俗説との乖離・ハマりどころ（Pitfalls & Notes）】:
  - 伝言ゲームによる誤認、古いバージョンとの非互換、公式未推奨事項
④【一次リソース追試・再現手順（Reproduction & Verification）】:
  - ユーザーが手元で再現・確認するための公式コマンド、APIコード、またはワークフロー設定

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
   ERROR FORMATTING & DIAGNOSTICS
   ========================================================================== */

export const formatLLMErrorMessage = (error: any, provider: LLMProviderConfig): string => {
  const rawMsg = error instanceof Error ? error.message : (typeof error === 'string' ? error : JSON.stringify(error));
  
  // Attempt to parse JSON error object returned by Google GenAI or other SDKs
  let parsedErrorObj: any = null;
  try {
    const jsonMatch = rawMsg.match(/\{[\s\S]*"error"[\s\S]*\}/);
    if (jsonMatch) {
      parsedErrorObj = JSON.parse(jsonMatch[0]);
    } else {
      parsedErrorObj = JSON.parse(rawMsg);
    }
  } catch {
    // not json
  }

  const errCode = parsedErrorObj?.error?.code;
  const errStatus = parsedErrorObj?.error?.status;
  const innerMsg = parsedErrorObj?.error?.message || '';

  if (provider.id === 'gemini') {
    // 404 NOT FOUND (Model discontinued or not found)
    if (
      errCode === 404 ||
      errStatus === 'NOT_FOUND' ||
      rawMsg.includes('404') ||
      rawMsg.includes('NOT_FOUND') ||
      rawMsg.includes('Requested entity was not found') ||
      rawMsg.includes('is no longer available') ||
      innerMsg.includes('is no longer available')
    ) {
      return (
        `【モデル指定エラー (404 NOT_FOUND)】\n` +
        `指定されたモデル「${provider.selectedModel}」はGoogleにより提供終了または未対応です。\n\n` +
        `【解決方法】\n` +
        `プロバイダー設定でモデルを推奨の「gemini-3.8-flash」または「gemini-flash-latest」に変更してください。\n` +
        `（画面上部のプロバイダー設定、または下のボタンからワンクリックで更新できます）`
      );
    }

    // 402 RESOURCE_EXHAUSTED (Prepayment credits depleted)
    if (
      errCode === 402 ||
      rawMsg.includes('402') ||
      rawMsg.includes('prepayment credits are depleted') ||
      rawMsg.includes('billing#prepay') ||
      innerMsg.includes('prepayment credits are depleted')
    ) {
      return (
        `【API利用残高不足 (402 RESOURCE_EXHAUSTED)】\n` +
        `Google Gemini APIのプリペイドクレジット（利用残高）が枯渇しています。\n\n` +
        `【解決手順】\n` +
        `1. Google AI Studio (https://ai.studio/projects) または Google Cloud Billing でクレジットを追加チャージしてください。\n` +
        `2. または、プロバイダー設定でご自身の別アカウントのGemini APIキーを入力してください。\n` +
        `3. または、上部のプロバイダー切替から「PCローカルLLM (LM Studio / Ollama)」や「OpenRouter」「Groq」等の別プロバイダーを選択して実行できます。`
      );
    }

    // 429 RESOURCE_EXHAUSTED (Rate limit / Quota exceeded)
    if (
      errCode === 429 ||
      errStatus === 'RESOURCE_EXHAUSTED' ||
      rawMsg.includes('429') ||
      rawMsg.includes('RESOURCE_EXHAUSTED') ||
      rawMsg.includes('quota')
    ) {
      return (
        `【リクエスト制限到達 (429 RESOURCE_EXHAUSTED)】\n` +
        `Gemini APIの分間リクエスト制限（RPM）または1日のクォータ上限に達しました。\n\n` +
        `【解決手順】\n` +
        `・数十秒お待ちいただいてから再実行してください。\n` +
        `・プロバイダー設定で「制限到達時の自動待機 (Auto-Wait)」をONにすると自動で順番待ちされます。`
      );
    }

    // 403 PERMISSION_DENIED / API_KEY_INVALID
    if (
      errCode === 403 ||
      errStatus === 'PERMISSION_DENIED' ||
      rawMsg.includes('403') ||
      rawMsg.includes('API_KEY_INVALID') ||
      rawMsg.includes('PERMISSION_DENIED')
    ) {
      return (
        `【APIキー権限エラー (403 PERMISSION_DENIED)】\n` +
        `Gemini APIキーが無効か、十分な権限がありません。\n\n` +
        `【解決手順】\n` +
        `プロバイダー設定を開き、有効なGemini APIキーが設定されているかご確認ください。`
      );
    }
  }

  if (innerMsg) {
    return innerMsg;
  }
  return rawMsg || '予期せぬエラーが発生しました。';
};

/* ==========================================================================
   CONNECTION TESTING & MODEL LIST FETCHING
   ========================================================================== */

export interface ConnectionTestResult {
  success: boolean;
  latencyMs: number;
  models: string[];
  message: string;
  effectiveMode?: ConnectionMode | 'cloud';
  suggestedMode?: ConnectionMode;
}

/* ==========================================================================
   DYNAMIC MODEL LIST FETCHING (AUTO-UPDATE & RETRIEVAL)
   ========================================================================== */

export const fetchProviderModels = async (
  provider: LLMProviderConfig
): Promise<string[]> => {
  switch (provider.id) {
    case 'gemini': {
      const apiKey = provider.apiKey || (typeof process !== 'undefined' ? (process.env.API_KEY || process.env.GEMINI_API_KEY) : '');
      if (!apiKey) {
        return provider.availableModels || ['gemini-flash-latest', 'gemini-3.8-flash'];
      }

      const DEPRECATED_MODELS = new Set([
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-2.0-pro',
        'gemini-2.0-flash-thinking',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
      ]);

      try {
        const ai = new GoogleGenAI({ apiKey });
        const list = await ai.models.list();
        const models: string[] = [];

        for await (const m of list) {
          const methods = (m as any).supportedActions || (m as any).supportedGenerationMethods || [];
          if (methods.includes('generateContent')) {
            const cleanName = m.name ? m.name.replace(/^models\//, '') : '';
            if (cleanName && !DEPRECATED_MODELS.has(cleanName)) {
              models.push(cleanName);
            }
          }
        }

        if (models.length > 0) {
          // Priority sort:
          // 1. Official Google auto-updating aliases (e.g. gemini-flash-latest, gemini-pro-latest)
          // 2. High-performance active versions (gemini-3.8-flash, gemini-3.7-flash, gemini-3.6-flash, gemini-3.5-flash)
          // 3. Pro preview and light models
          const priority = [
            'gemini-flash-latest',
            'gemini-pro-latest',
            'gemini-flash-lite-latest',
            'gemini-3.8-flash',
            'gemini-3.7-flash',
            'gemini-3.6-flash',
            'gemini-3.5-flash',
            'gemini-3.1-pro-preview',
            'gemini-3.1-flash-lite',
          ];

          models.sort((a, b) => {
            const indexA = priority.indexOf(a);
            const indexB = priority.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
          });

          return models;
        }
      } catch (sdkErr) {
        console.warn('[Gemini SDK fetchProviderModels Notice]:', sdkErr);
        // Fallback to direct REST API if SDK list encounters issues
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
          );
          if (res.ok) {
            const data = await res.json();
            const restModels = (data.models || [])
              .filter((m: any) =>
                (m.supportedGenerationMethods || m.supportedActions || []).includes('generateContent')
              )
              .map((m: any) => (m.name || '').replace(/^models\//, ''))
              .filter((name: string) => name && !DEPRECATED_MODELS.has(name));

            if (restModels.length > 0) {
              return restModels;
            }
          }
        } catch (restErr) {
          console.warn('[Gemini REST fallback Notice]:', restErr);
        }
      }

      return provider.availableModels || ['gemini-flash-latest', 'gemini-3.8-flash'];
    }

    case 'openrouter': {
      if (!provider.apiKey) return provider.availableModels;
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models', {
          headers: { Authorization: `Bearer ${provider.apiKey}` },
        });
        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m: any) => m.id).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('OpenRouter fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    case 'ollama': {
      const isProxy = provider.connectionMode === 'proxy';
      const endpoint = isProxy ? '/api/proxy/ollama/api/tags' : `${provider.baseUrl || 'http://localhost:11434'}/api/tags`;
      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          const models = (data.models || []).map((m: any) => m.name).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('Ollama fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    case 'lmstudio':
    case 'lmstudio_bionic': {
      const isProxy = provider.connectionMode === 'proxy';
      const endpoint = isProxy ? '/api/proxy/lmstudio/v1/models' : `${provider.baseUrl || 'http://localhost:1234'}/v1/models`;
      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m: any) => m.id).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('LM Studio fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    case 'unsloth': {
      const isProxy = provider.connectionMode === 'proxy';
      const endpoint = isProxy ? '/api/proxy/unsloth/models' : `${(provider.baseUrl || 'http://localhost:8000/v1').replace(/\/$/, '')}/models`;
      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m: any) => m.id).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('Unsloth fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    case 'openai_compat':
    case 'custom': {
      const isProxy = provider.connectionMode === 'proxy';
      const endpoint = isProxy ? '/api/proxy/openai-compat/models' : `${(provider.baseUrl || 'http://localhost:8000/v1').replace(/\/$/, '')}/models`;
      const headers: Record<string, string> = {};
      if (provider.apiKey) headers.Authorization = `Bearer ${provider.apiKey}`;
      try {
        const res = await fetch(endpoint, { headers });
        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m: any) => m.id).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('OpenAI compat fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    case 'groq': {
      if (!provider.apiKey) return provider.availableModels;
      try {
        const res = await fetch(`${provider.baseUrl || 'https://api.groq.com/openai/v1'}/models`, {
          headers: { Authorization: `Bearer ${provider.apiKey}` },
        });
        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m: any) => m.id).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('Groq fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    case 'openai': {
      if (!provider.apiKey) return provider.availableModels;
      try {
        const res = await fetch(`${provider.baseUrl || 'https://api.openai.com/v1'}/models`, {
          headers: { Authorization: `Bearer ${provider.apiKey}` },
        });
        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m: any) => m.id).filter(Boolean);
          return models.length > 0 ? models : provider.availableModels;
        }
      } catch (e) {
        console.warn('OpenAI fetchProviderModels error:', e);
      }
      return provider.availableModels;
    }

    default:
      return provider.availableModels;
  }
};

export const testProviderConnection = async (
  provider: LLMProviderConfig
): Promise<ConnectionTestResult> => {
  const startTime = Date.now();

  try {
    switch (provider.id) {
      case 'gemini': {
        const apiKey = provider.apiKey || (typeof process !== 'undefined' ? (process.env.API_KEY || process.env.GEMINI_API_KEY) : '');
        if (!apiKey) {
          throw new Error('Gemini APIキーが設定されていません。');
        }

        // 1. Dynamically retrieve the current live models list from Google API
        let liveModels: string[] = [];
        try {
          liveModels = await fetchProviderModels(provider);
        } catch (fetchErr) {
          console.warn('[Gemini Live Models Fetch Notice]:', fetchErr);
        }

        const modelsToReturn = liveModels.length > 0 ? liveModels : provider.availableModels;
        const testModel = provider.selectedModel && modelsToReturn.includes(provider.selectedModel)
          ? provider.selectedModel
          : (modelsToReturn[0] || 'gemini-flash-latest');

        // 2. Perform ping generation test
        const ai = new GoogleGenAI({ apiKey });
        let pingSuccess = true;
        let pingResultText = '';
        let pingError: any = null;

        try {
          const response = await ai.models.generateContent({
            model: testModel,
            contents: 'Ping! 1単語で「OK」と返答してください。',
          });
          pingResultText = response.text || 'OK';
        } catch (genErr: any) {
          pingSuccess = false;
          pingError = genErr;
        }

        const latencyMs = Date.now() - startTime;

        if (pingSuccess) {
          return {
            success: true,
            latencyMs,
            models: modelsToReturn,
            message: `接続成功 (${latencyMs}ms) - Google公式APIより最新モデル${modelsToReturn.length}件を取得しました (応答: ${pingResultText.slice(0, 30)})`,
            effectiveMode: 'cloud',
          };
        } else {
          // If models list fetched successfully but generateContent returned an error (e.g. 402 Prepayment depleted)
          const formattedErr = formatLLMErrorMessage(pingError, { ...provider, selectedModel: testModel });
          const isPrepaymentDepleted = formattedErr.includes('402');

          return {
            success: !isPrepaymentDepleted && false,
            latencyMs,
            models: modelsToReturn,
            message: `【Google API通信確認済 (${latencyMs}ms)】\n最新モデル${modelsToReturn.length}件をAPIから自動取得・更新しました。\n\n${formattedErr}`,
            effectiveMode: 'cloud',
          };
        }
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
          effectiveMode: 'cloud',
        };
      }

      case 'ollama': {
        const isProxy = provider.connectionMode === 'proxy';
        const primaryEndpoint = resolveEndpoint(provider, 'models').url;
        
        try {
          const res = await fetch(primaryEndpoint, { method: 'GET' });
          const latencyMs = Date.now() - startTime;
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          const data = await res.json();
          const fetchedModels: string[] = (data.models || [])
            .map((m: any) => m.name)
            .filter(Boolean);

          return {
            success: true,
            latencyMs,
            models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
            message: `Ollama接続成功 [${isProxy ? 'Proxy経由' : 'Direct直接'}] (${latencyMs}ms) - ${fetchedModels.length}件のモデルを検出`,
            effectiveMode: isProxy ? 'proxy' : 'direct',
          };
        } catch (primaryErr: any) {
          // If direct failed, try proxy fallback
          if (!isProxy) {
            try {
              const proxyRes = await fetch('/api/proxy/ollama/api/tags', { method: 'GET' });
              if (proxyRes.ok) {
                const proxyData = await proxyRes.json();
                const fetchedModels: string[] = (proxyData.models || []).map((m: any) => m.name).filter(Boolean);
                const latencyMs = Date.now() - startTime;
                return {
                  success: true,
                  latencyMs,
                  models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
                  message: `Direct接続はCORS/接続エラーでしたが、Proxy経由での接続に成功しました！「Proxy経由」への切替を推奨します。`,
                  effectiveMode: 'proxy',
                  suggestedMode: 'proxy',
                };
              }
            } catch {
              // Ignore proxy trial error
            }
          }
          throw new Error(
            `Ollama接続失敗 (${primaryEndpoint}): ${primaryErr.message}。Ollamaが起動しているか確認してください。`
          );
        }
      }

      case 'lmstudio':
      case 'lmstudio_bionic': {
        const isLocalHost =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '0.0.0.0');

        const isProxy = provider.connectionMode === 'proxy';
        const primaryEndpoint = resolveEndpoint(provider, 'models').url;
        const headers: Record<string, string> = {};
        if (provider.apiKey) headers.Authorization = `Bearer ${provider.apiKey}`;

        try {
          const res = await fetch(primaryEndpoint, {
            method: 'GET',
            headers,
          });
          const latencyMs = Date.now() - startTime;
          if (!res.ok) {
            const errRaw = await res.text().catch(() => '');
            let detail = res.statusText || 'Fetch Failed';
            try {
              const errParsed = JSON.parse(errRaw);
              detail = errParsed.error?.message || errParsed.error || errParsed.message || errRaw;
            } catch {
              detail = errRaw || detail;
            }
            throw new Error(`HTTP ${res.status}: ${detail}`);
          }
          const data = await res.json();
          const fetchedModels: string[] = (data.data || []).map((m: any) => m.id).filter(Boolean);

          if (fetchedModels.length === 0) {
            return {
              success: false,
              latencyMs,
              models: [],
              message: `⚠️ ${provider.name}サーバー(ポート1234)に接続できましたが、モデルがロードされていません。LM Studio上部の「Select a model to load」からモデルを選択・ロードしてください。`,
              effectiveMode: isProxy ? 'proxy' : 'direct',
            };
          }

          return {
            success: true,
            latencyMs,
            models: fetchedModels,
            message: `${provider.name}接続成功 [${isProxy ? 'Proxy経由' : 'Direct直接'}] (${latencyMs}ms) - ロード中モデル: ${fetchedModels.join(', ')}`,
            effectiveMode: isProxy ? 'proxy' : 'direct',
          };
        } catch (primaryErr: any) {
          // If direct failed and we are running in local dev environment (localhost), test proxy endpoint!
          if (!isProxy && isLocalHost) {
            try {
              const proxyRes = await fetch('/api/proxy/lmstudio/models', {
                method: 'GET',
                headers,
              });
              if (proxyRes.ok) {
                const proxyData = await proxyRes.json();
                const fetchedModels: string[] = (proxyData.data || []).map((m: any) => m.id).filter(Boolean);
                const latencyMs = Date.now() - startTime;
                return {
                  success: true,
                  latencyMs,
                  models: fetchedModels.length > 0 ? fetchedModels : ['local-model'],
                  message: `Direct直接接続はブラウザCORS制限等で失敗しましたが、Proxy経由 (/api/proxy/lmstudio) での接続に成功しました！「接続モード: Proxy経由」への切替を推奨します。`,
                  effectiveMode: 'proxy',
                  suggestedMode: 'proxy',
                };
              }
            } catch {
              // ignore
            }
          }
          throw new Error(
            `${provider.name}接続失敗 (${primaryEndpoint}): ${primaryErr.message}。\n` +
            `【確認点】LM Studioで「Local Server」タブを開き、モデルをロードして「Start Server」を押しているか確認してください。`
          );
        }
      }

      case 'unsloth': {
        const isLocalHost =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '0.0.0.0');

        const isProxy = provider.connectionMode === 'proxy';
        const primaryEndpoint = resolveEndpoint(provider, 'models').url;
        const headers: Record<string, string> = {};
        if (provider.apiKey) headers.Authorization = `Bearer ${provider.apiKey}`;

        try {
          const res = await fetch(primaryEndpoint, { method: 'GET', headers });
          const latencyMs = Date.now() - startTime;
          if (!res.ok) {
            const errRaw = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status}: ${errRaw || res.statusText}`);
          }
          const data = await res.json();
          const fetchedModels: string[] = (data.data || []).map((m: any) => m.id).filter(Boolean);

          return {
            success: true,
            latencyMs,
            models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
            message: `Unsloth Studio接続成功 [${isProxy ? 'Proxy経由' : 'Direct直接'}] (${latencyMs}ms) - 認識モデル: ${fetchedModels.join(', ') || 'OK'}`,
            effectiveMode: isProxy ? 'proxy' : 'direct',
          };
        } catch (primaryErr: any) {
          if (!isProxy && isLocalHost) {
            try {
              const proxyRes = await fetch('/api/proxy/unsloth/models', { method: 'GET', headers });
              if (proxyRes.ok) {
                const proxyData = await proxyRes.json();
                const fetchedModels: string[] = (proxyData.data || []).map((m: any) => m.id).filter(Boolean);
                const latencyMs = Date.now() - startTime;
                return {
                  success: true,
                  latencyMs,
                  models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
                  message: `Direct接続失敗後、Proxy経由 (/api/proxy/unsloth) で接続に成功しました！「Proxy経由」モードへの切替を推奨します。`,
                  effectiveMode: 'proxy',
                  suggestedMode: 'proxy',
                };
              }
            } catch {
              // ignore
            }
          }
          throw new Error(
            `Unsloth Studio接続失敗 (${primaryEndpoint}): ${primaryErr.message}。\n` +
            `【確認点】Unsloth Studio / vLLM推論サーバーが起動しているか確認してください (デフォルトポート: 8000)。`
          );
        }
      }

      case 'openai_compat':
      case 'custom': {
        const isLocalHost =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '0.0.0.0');

        const isProxy = provider.connectionMode === 'proxy';
        const primaryEndpoint = resolveEndpoint(provider, 'models').url;
        const headers: Record<string, string> = {};
        if (provider.apiKey) headers.Authorization = `Bearer ${provider.apiKey}`;

        try {
          const res = await fetch(primaryEndpoint, { method: 'GET', headers });
          const latencyMs = Date.now() - startTime;
          if (!res.ok) {
            const errRaw = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status}: ${errRaw || res.statusText}`);
          }
          const data = await res.json();
          const fetchedModels: string[] = (data.data || []).map((m: any) => m.id).filter(Boolean);

          return {
            success: true,
            latencyMs,
            models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
            message: `${provider.name}接続成功 [${isProxy ? 'Proxy経由' : 'Direct直接'}] (${latencyMs}ms)`,
            effectiveMode: isProxy ? 'proxy' : 'direct',
          };
        } catch (primaryErr: any) {
          if (!isProxy && isLocalHost) {
            try {
              const proxyRes = await fetch('/api/proxy/openai-compat/models', { method: 'GET', headers });
              if (proxyRes.ok) {
                const proxyData = await proxyRes.json();
                const fetchedModels: string[] = (proxyData.data || []).map((m: any) => m.id).filter(Boolean);
                const latencyMs = Date.now() - startTime;
                return {
                  success: true,
                  latencyMs,
                  models: fetchedModels.length > 0 ? fetchedModels : provider.availableModels,
                  message: `Direct接続失敗後、Proxy経由 (/api/proxy/openai-compat) で接続に成功しました！`,
                  effectiveMode: 'proxy',
                  suggestedMode: 'proxy',
                };
              }
            } catch {
              // ignore
            }
          }
          throw new Error(
            `${provider.name}接続失敗 (${primaryEndpoint}): ${primaryErr.message}。エンドポイントURLとサーバー稼働状況をご確認ください。`
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
    const formattedMessage = formatLLMErrorMessage(err, provider);
    return {
      success: false,
      latencyMs,
      models: provider.availableModels,
      message: formattedMessage,
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
  hyperExpertSettings?: HyperExpertSettings;
  providerConfig: LLMProviderConfig;
  settings: LLMSettings;
  onChunk: (chunk: string) => void;
  onWaitTick?: (remainingSeconds: number) => void;
  onStatusUpdate?: (status: Partial<LLMStatusMonitorState>) => void;
  onError?: (error: Error, providerConfig: LLMProviderConfig) => void;
}

export const executePromptStreamUnified = async (
  options: ExecutePromptOptions
): Promise<void> => {
  const {
    prompt,
    mode,
    customSystemInstruction,
    knowledgeContext,
    hyperExpertSettings,
    providerConfig,
    settings,
    onChunk,
    onWaitTick,
    onStatusUpdate,
    onError,
  } = options;

  const startTime = Date.now();
  let totalCharacters = 0;
  const providerId = providerConfig.id;

  // GEMINI ISOLATION ASSERTION: Guarantee that non-Gemini requests never leak to Gemini API
  assertGeminiIsolation(providerId, providerConfig.name);

  let combinedInstruction = customSystemInstruction;
  if (knowledgeContext) {
    combinedInstruction = combinedInstruction
      ? `${combinedInstruction}\n\n${knowledgeContext}`
      : knowledgeContext;
  }

  // Inject Hyper-Dimensional Expert (PATH Cognitive OS) prompt if enabled
  if (hyperExpertSettings && hyperExpertSettings.isEnabled) {
    const hyperExpertPrompt = formatHyperExpertPrompt(hyperExpertSettings, prompt);
    if (hyperExpertPrompt) {
      combinedInstruction = combinedInstruction
        ? `${combinedInstruction}\n\n${hyperExpertPrompt}`
        : hyperExpertPrompt;
    }
  }

  const finalSystemInstruction = composeFinalSystemInstruction(
    mode,
    prompt,
    combinedInstruction
  );

  const endpointInfo = resolveEndpoint(providerConfig, 'chat');

  // Notify initial connecting state
  onStatusUpdate?.({
    status: 'connecting',
    providerId,
    providerName: providerConfig.name,
    model: providerConfig.selectedModel,
    connectionMode: endpointInfo.mode,
    endpoint: endpointInfo.url,
    characterCount: 0,
    isGeminiIsolated: providerId !== 'gemini',
    lastUpdated: Date.now(),
  });

  try {
    /* -----------------------------
       1. GOOGLE GEMINI (Direct SDK)
       ----------------------------- */
    if (providerId === 'gemini') {
      const rpm = settings.geminiRateLimit.rpm || 15;
      const autoWait = settings.geminiRateLimit.autoWait !== false;

      // Check RPM limit
      if (!canExecuteGemini(rpm)) {
        if (autoWait) {
          const waitSec = getGeminiWaitSeconds(rpm);
          onStatusUpdate?.({
            status: 'cooldown',
            cooldownSeconds: waitSec,
            lastUpdated: Date.now(),
          });
          onChunk(`⏳ [Gemini 無料枠レート制限待機中: ${rpm} RPM] 次のリクエスト枠まで待機しています...\n`);
          await waitForGeminiCooldown(rpm, (remaining) => {
            if (onWaitTick) onWaitTick(remaining);
            onStatusUpdate?.({
              status: 'cooldown',
              cooldownSeconds: remaining,
              lastUpdated: Date.now(),
            });
          });
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

      // Use formatForGemini from llmBridge
      const geminiPayload = formatForGemini({
        prompt,
        systemInstruction: finalSystemInstruction,
        temperature: providerConfig.temperature,
        maxTokens: providerConfig.maxTokens,
      });

      onStatusUpdate?.({
        status: 'streaming',
        characterCount: 0,
        latencyMs: Date.now() - startTime,
        lastUpdated: Date.now(),
      });

      const responseStream = await ai.models.generateContentStream({
        model: providerConfig.selectedModel || 'gemini-3.8-flash',
        contents: geminiPayload.contents,
        ...(geminiPayload.config && { config: geminiPayload.config }),
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          totalCharacters += chunk.text.length;
          onChunk(chunk.text);
          onStatusUpdate?.({
            status: 'streaming',
            characterCount: totalCharacters,
            latencyMs: Date.now() - startTime,
            lastUpdated: Date.now(),
          });
        }
      }

      onStatusUpdate?.({
        status: 'completed',
        characterCount: totalCharacters,
        latencyMs: Date.now() - startTime,
        lastUpdated: Date.now(),
      });
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

      onStatusUpdate?.({
        status: 'streaming',
        characterCount: 0,
        latencyMs: Date.now() - startTime,
        lastUpdated: Date.now(),
      });

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
                totalCharacters += parsed.delta.text.length;
                onChunk(parsed.delta.text);
                onStatusUpdate?.({
                  status: 'streaming',
                  characterCount: totalCharacters,
                  latencyMs: Date.now() - startTime,
                  lastUpdated: Date.now(),
                });
              }
            } catch {
              // skip parse err
            }
          }
        }
      }

      onStatusUpdate?.({
        status: 'completed',
        characterCount: totalCharacters,
        latencyMs: Date.now() - startTime,
        lastUpdated: Date.now(),
      });
      return;
    }

    /* -----------------------------
       3. OPENAI-COMPATIBLE SSE STREAMING (LM Studio, Ollama, OpenRouter, Groq, DeepSeek, etc.)
       ----------------------------- */
    const isLocalHost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname === '0.0.0.0');

    // For LM Studio: if model is default or 'local-model', attempt to auto-detect loaded model name
    let modelToUse = providerConfig.selectedModel;
    if (providerId === 'lmstudio' && (!modelToUse || modelToUse === 'local-model')) {
      try {
        const modelsEndpoint = resolveEndpoint(providerConfig, 'models').url;
        const modelsRes = await fetch(modelsEndpoint, {
          method: 'GET',
          headers: providerConfig.apiKey ? { Authorization: `Bearer ${providerConfig.apiKey}` } : {},
        });
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const loadedModels: string[] = (modelsData.data || []).map((m: any) => m.id).filter(Boolean);
          if (loadedModels.length === 0) {
            throw new Error(
              'LM Studioサーバーは応答しましたが、モデルがロードされていません。\nLM Studio画面上部の「Select a model to load」からモデルをロードして再試行してください。'
            );
          }
          modelToUse = loadedModels[0];
          onStatusUpdate?.({ model: modelToUse });
        }
      } catch (detectErr: any) {
        if (detectErr.message?.includes('モデルがロードされていません')) {
          throw detectErr;
        }
        // otherwise proceed with modelToUse
      }
    }

    // Normalize request using llmBridge
    const openAIRequest = formatForOpenAI(
      {
        prompt,
        systemInstruction: finalSystemInstruction,
        temperature: providerConfig.temperature,
        maxTokens: providerConfig.maxTokens,
        stream: true,
      },
      modelToUse,
      providerConfig
    );

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

    let targetEndpoint = endpointInfo.url;
    let response: Response | null = null;

    try {
      response = await fetch(targetEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(openAIRequest),
      });
    } catch (primaryFetchErr: any) {
      // If local providers failed in Direct mode due to CORS / NetworkError, attempt automatic proxy fallback ONLY if on localhost
      const isLocalProvider = providerId === 'lmstudio' || providerId === 'lmstudio_bionic' || providerId === 'ollama' || providerId === 'unsloth' || providerId === 'openai_compat';
      if (
        isLocalProvider &&
        endpointInfo.mode === 'direct' &&
        isLocalHost
      ) {
        let fallbackProxyUrl = providerConfig.proxyUrl || '/api/proxy/lmstudio/chat/completions';
        if (providerId === 'ollama') fallbackProxyUrl = '/api/proxy/ollama/v1/chat/completions';
        else if (providerId === 'unsloth') fallbackProxyUrl = '/api/proxy/unsloth/chat/completions';
        else if (providerId === 'openai_compat') fallbackProxyUrl = '/api/proxy/openai-compat/chat/completions';

        try {
          onChunk(`ℹ️ [通信経路自動切替] Direct接続 (${targetEndpoint}) がブラウザCORS等のため、Proxy経由 (${fallbackProxyUrl}) に切り替えて試行します...\n\n`);
          targetEndpoint = fallbackProxyUrl;
          response = await fetch(fallbackProxyUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(openAIRequest),
          });
          // Update status monitor
          onStatusUpdate?.({
            connectionMode: 'proxy',
            endpoint: fallbackProxyUrl,
          });
        } catch {
          // Re-throw original error
          throw primaryFetchErr;
        }
      } else {
        // Detailed error diagnostic when on remote cloud host (e.g. *.run.app)
        if (isLocalProvider && !isLocalHost) {
          const isFetchFailed = primaryFetchErr.name === 'TypeError' || primaryFetchErr.message?.includes('fetch');
          throw new Error(
            `${providerConfig.name} (${targetEndpoint}) への通信に失敗しました (${isFetchFailed ? 'ブラウザセキュリティ制限または接続未応答' : primaryFetchErr.message})。\n\n` +
            `【原因と解決手順】\n` +
            `1. クラウド環境（HTTPS）からローカルPC（http://localhost）への通信は、ブラウザのセキュリティ保護（Mixed Content / Private Network Access）により直接接続が制限されます。\n` +
            `2. 【推奨】画面右上の「⚡ Google Geminiに切り替えて実行」を押せば、今すぐ高品質にプロンプトを実行できます。\n` +
            `3. ローカルPCの推論サーバーを連携したい場合は、ngrok等のHTTPSトンネルURL（例: https://xxxx.ngrok-free.app/v1）をBase URLに指定するか、本アプリをローカル環境（npm run dev）で実行してください。`
          );
        }
        throw primaryFetchErr;
      }
    }

    // Smart fallback: If server returned 400 Bad Request due to response_format not supported, retry without response_format
    if (response && response.status === 400 && openAIRequest.response_format) {
      const peekText = await response.clone().text().catch(() => '');
      if (peekText.includes('response_format') || peekText.includes('json_object') || peekText.includes('schema') || peekText.includes('unrecognized')) {
        console.warn(`[JSON Delivery Fallback] Server rejected response_format: ${peekText}. Retrying with prompt-based JSON enforcement.`);
        delete openAIRequest.response_format;
        response = await fetch(targetEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(openAIRequest),
        });
      }
    }

    if (!response || !response.ok) {
      const rawText = await response?.text().catch(() => '');
      let errMsg = '';
      try {
        const errJson = JSON.parse(rawText);
        if (typeof errJson.error === 'string') {
          errMsg = errJson.error;
        } else if (errJson.error?.message) {
          errMsg = errJson.error.message;
        } else if (typeof errJson.message === 'string') {
          errMsg = errJson.message;
        } else if (rawText) {
          errMsg = rawText;
        }
      } catch {
        errMsg = rawText;
      }

      if (!errMsg || errMsg.length > 300) {
        errMsg = `HTTP ${response?.status} ${response?.statusText || ''} ${errMsg ? `(${errMsg.slice(0, 150)})` : ''}`.trim();
      }

      if (providerId === 'lmstudio' || providerId === 'lmstudio_bionic') {
        if (errMsg.includes('ECONNREFUSED') || response?.status === 502) {
          errMsg = `LM Studio (ポート1234) に接続できませんでした。\nLM Studioが起動しており、Local Serverが開始されているか確認してください。`;
        } else if (response?.status === 500 && (errMsg.includes('No model loaded') || errMsg.includes('500') || !errMsg)) {
          errMsg = `LM Studioサーバーエラー (HTTP 500): ${errMsg}\n\n💡 LM Studio上部でモデルがロードされているか、またはコンテキスト長・VRAM制限に達していないか確認してください。`;
        }
      }

      const generatedError: any = new Error(`[${providerConfig.name}] エラー: ${errMsg}`);
      generatedError.statusCode = response?.status;
      generatedError.rawResponseText = rawText;
      throw generatedError;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ストリームリーダーの初期化に失敗しました。');
    }

    onStatusUpdate?.({
      status: 'streaming',
      characterCount: 0,
      latencyMs: Date.now() - startTime,
      lastUpdated: Date.now(),
    });

    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedGeneratedText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const { text } = extractOpenAITextChunk(parsed);
            if (text) {
              totalCharacters += text.length;
              accumulatedGeneratedText += text;
              onChunk(text);
              onStatusUpdate?.({
                status: 'streaming',
                characterCount: totalCharacters,
                latencyMs: Date.now() - startTime,
                lastUpdated: Date.now(),
              });
            }
          } catch {
            // ignore JSON parse chunk errors
          }
        }
      }
    }

    // Check JSON compliance and repair if requested or applicable
    let jsonStatus: 'none' | 'valid' | 'repaired' | 'invalid' = 'none';
    const isJsonExpected = providerConfig.jsonMode === 'strict' || 
                           providerConfig.jsonMode === 'prompt_only' ||
                           (providerConfig.jsonMode === 'auto' && /json|manifest|ノード|node graph|\{|\}/i.test(prompt));

    if (isJsonExpected && accumulatedGeneratedText) {
      const repairResult = cleanAndRepairJson(accumulatedGeneratedText);
      if (repairResult.success) {
        jsonStatus = repairResult.wasRepaired ? 'repaired' : 'valid';
      } else {
        jsonStatus = 'invalid';
      }
    }

    onStatusUpdate?.({
      status: 'completed',
      characterCount: totalCharacters,
      latencyMs: Date.now() - startTime,
      jsonValidationStatus: jsonStatus,
      lastUpdated: Date.now(),
    });

  } catch (error: any) {
    console.warn('[LLM Execution Handled Notice]:', error?.message || error);
    const formattedMsg = formatLLMErrorMessage(error, providerConfig);
    const errObj = new Error(formattedMsg);

    // Build comprehensive debug report object for effortless copying
    const debugInfo: LLMErrorDebugInfo = {
      timestamp: new Date().toISOString(),
      providerId,
      providerName: providerConfig.name,
      model: providerConfig.selectedModel || 'default',
      endpoint: endpointInfo.url,
      connectionMode: endpointInfo.mode,
      statusCode: error?.statusCode,
      errorMessage: formattedMsg,
      rawResponseText: error?.rawResponseText || error?.message,
      requestPayloadSummary: `Provider: ${providerConfig.name}, Model: ${providerConfig.selectedModel}, Temp: ${providerConfig.temperature ?? 0.7}, MaxTokens: ${providerConfig.maxTokens ?? 'auto'}, PromptLen: ${prompt.length}`,
      suggestedRemedy: error?.statusCode === 400 && error?.message?.includes('response_format')
        ? '推論サーバーがresponse_format={type: "json_object"}に対応していません。「JSON伝送モード」を「プロンプト強制のみ(prompt_only)」に変更してください。'
        : (error?.message?.includes('CORS') || error?.message?.includes('Failed to fetch'))
          ? 'ブラウザのCORS制限または接続拒否です。接続モードを「Proxy経由」に切り替えるか、LM Studio/推論サーバーのCORS設定を有効にしてください。'
          : 'エンドポイントURL、ポート番号、モデル名、および推論サーバーのコンソールログをご確認ください。',
      rawErrorObject: error,
    };
    
    // Ensure that in case of error, we never silently invoke Gemini
    onStatusUpdate?.({
      status: 'error',
      errorMessage: formattedMsg,
      lastErrorDetails: debugInfo,
      lastUpdated: Date.now(),
    });

    if (onError) {
      onError(errObj, providerConfig);
    }

    onChunk(`\n\n❌ [実行エラー - ${providerConfig.name}]:\n${formattedMsg}\n\n📋 右上のステータスモニターから「デバッグ情報をコピー」して即時診断できます。`);
  }
};
