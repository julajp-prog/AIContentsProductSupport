import { LLMSettings, LLMProviderConfig, ProviderType, GeminiRateLimitSettings } from '../types';

export const DEFAULT_GEMINI_RATE_LIMIT: GeminiRateLimitSettings = {
  rpm: 15, // Free tier default 15 RPM
  autoWait: true, // Automatically wait countdown before execution
  cooldownSeconds: 4, // 60s / 15 requests = 4s gap
};

export const INITIAL_PROVIDERS_CONFIG: Record<ProviderType, LLMProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'cloud',
    enabled: true,
    selectedModel: 'gemini-2.5-flash',
    availableModels: [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
    ],
    defaultEndpoint: 'https://generativelanguage.googleapis.com',
    description: '標準搭載のGoogle Gemini。高速・高品質なマルチモーダル対応LLM。無料枠向けRPMタイマー制御に対応。',
    docsUrl: 'https://ai.google.dev',
    testStatus: 'success',
    testLatencyMs: 80,
    testMessage: '標準APIキーで利用可能です',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    category: 'router',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultEndpoint: 'https://openrouter.ai/api/v1',
    selectedModel: 'deepseek/deepseek-r1',
    availableModels: [
      'deepseek/deepseek-r1',
      'deepseek/deepseek-chat',
      'anthropic/claude-3.7-sonnet',
      'anthropic/claude-3.5-sonnet',
      'meta-llama/llama-3.3-70b-instruct',
      'qwen/qwen-2.5-72b-instruct',
      'mistralai/mistral-large-2411',
      'openai/gpt-4o-mini',
      'google/gemini-2.0-flash-001',
    ],
    description: 'DeepSeek, Claude, Llama, Qwenなど数百種類の世界中モデルを単一APIキーで利用可能。モデル自動取得対応。',
    docsUrl: 'https://openrouter.ai/docs',
    testStatus: 'untested',
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local PC)',
    category: 'local',
    enabled: false,
    baseUrl: 'http://localhost:11434',
    defaultEndpoint: 'http://localhost:11434',
    selectedModel: 'llama3.3:latest',
    availableModels: [
      'llama3.3:latest',
      'deepseek-r1:8b',
      'deepseek-r1:14b',
      'qwen2.5:7b',
      'gemma2:9b',
      'phi4:latest',
      'mistral:latest',
    ],
    description: 'あなたのPCで完全ローカル実行される無料・無制限LLM。通信費不要＆オフライン動作。モデル一覧自動取得対応。',
    docsUrl: 'https://ollama.com',
    testStatus: 'untested',
  },
  lmstudio: {
    id: 'lmstudio',
    name: 'LM Studio (Local PC)',
    category: 'local',
    enabled: false,
    baseUrl: 'http://localhost:1234/v1',
    defaultEndpoint: 'http://localhost:1234/v1',
    selectedModel: 'local-model',
    availableModels: ['local-model'],
    description: 'LM Studioのローカル推論サーバー（OpenAI互換）。ロード中のローカルモデル一覧を即時取得可能。',
    docsUrl: 'https://lmstudio.ai',
    testStatus: 'untested',
  },
  groq: {
    id: 'groq',
    name: 'Groq (高速LPU)',
    category: 'cloud',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultEndpoint: 'https://api.groq.com/openai/v1',
    selectedModel: 'llama-3.3-70b-versatile',
    availableModels: [
      'llama-3.3-70b-versatile',
      'deepseek-r1-distill-llama-70b',
      'llama-3.1-8b-instant',
      'gemma2-9b-it',
      'mixtral-8x7b-32768',
    ],
    description: '超高速LPUエンジンにより秒速数百トークンで瞬時に回答を生成する高速プロバイダー。',
    docsUrl: 'https://console.groq.com',
    testStatus: 'untested',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek (公式)',
    category: 'cloud',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    defaultEndpoint: 'https://api.deepseek.com',
    selectedModel: 'deepseek-chat',
    availableModels: [
      'deepseek-chat',
      'deepseek-reasoner',
    ],
    description: '業界最高峰の推論能力とコストパフォーマンスを誇るDeepSeek公式API（V3 & R1）。',
    docsUrl: 'https://platform.deepseek.com',
    testStatus: 'untested',
  },
  github: {
    id: 'github',
    name: 'GitHub Models',
    category: 'cloud',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://models.inference.ai.azure.com',
    defaultEndpoint: 'https://models.inference.ai.azure.com',
    selectedModel: 'gpt-4o',
    availableModels: [
      'gpt-4o',
      'gpt-4o-mini',
      'o3-mini',
      'o1-mini',
      'Phi-3.5-mini-instruct',
      'Meta-Llama-3.1-70B-Instruct',
      'Mistral-large-2407',
    ],
    description: 'GitHubの個人アクセストークン（PAT）でAzure AI基盤のモデルを試行できるGitHub Models。',
    docsUrl: 'https://github.com/marketplace/models',
    testStatus: 'untested',
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face Inference',
    category: 'cloud',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://router.huggingface.co/novita/v1',
    defaultEndpoint: 'https://router.huggingface.co/novita/v1',
    selectedModel: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    availableModels: [
      'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
      'meta-llama/Llama-3.3-70B-Instruct',
      'mistralai/Mistral-7B-Instruct-v0.3',
      'Qwen/Qwen2.5-Coder-32B-Instruct',
    ],
    description: '世界最大のオープンソースAIハブ。HFトークンを使って最新モデルの推論エンドポイントにアクセス。',
    docsUrl: 'https://huggingface.co/docs/inference-endpoints',
    testStatus: 'untested',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    category: 'cloud',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    defaultEndpoint: 'https://api.openai.com/v1',
    selectedModel: 'gpt-4o-mini',
    availableModels: [
      'gpt-4o',
      'gpt-4o-mini',
      'o3-mini',
      'o1',
      'gpt-4-turbo',
    ],
    description: 'OpenAI公式API。GPT-4oおよび推論特化型o3-mini/o1モデルを利用可能。',
    docsUrl: 'https://platform.openai.com/docs',
    testStatus: 'untested',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    category: 'cloud',
    enabled: false,
    apiKey: '',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultEndpoint: 'https://api.anthropic.com/v1',
    selectedModel: 'claude-3-7-sonnet-20250219',
    availableModels: [
      'claude-3-7-sonnet-20250219',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
    ],
    description: '長文コンテキストと論理的執筆に優れたClaude 3.7 / 3.5 Sonnetファミリー。',
    docsUrl: 'https://docs.anthropic.com',
    testStatus: 'untested',
  },
  custom: {
    id: 'custom',
    name: 'カスタム (OpenAI互換)',
    category: 'custom',
    enabled: false,
    apiKey: '',
    baseUrl: 'http://localhost:8000/v1',
    defaultEndpoint: 'http://localhost:8000/v1',
    selectedModel: 'custom-model',
    availableModels: ['custom-model'],
    description: 'vLLM, Text Generation WebUI, LiteLLM, 自作エンドポイントなど任意のOpenAI互換APIに接続。',
    docsUrl: '',
    testStatus: 'untested',
  },
};

const STORAGE_KEY = 'ai_orchestrator_llm_settings';

export const loadLLMSettings = (): LLMSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        activeProvider: 'gemini',
        providers: INITIAL_PROVIDERS_CONFIG,
        geminiRateLimit: DEFAULT_GEMINI_RATE_LIMIT,
      };
    }
    const parsed = JSON.parse(raw);
    
    // Merge loaded config with initial config to ensure new providers or keys exist
    const mergedProviders = { ...INITIAL_PROVIDERS_CONFIG };
    if (parsed.providers) {
      (Object.keys(INITIAL_PROVIDERS_CONFIG) as ProviderType[]).forEach(id => {
        if (parsed.providers[id]) {
          mergedProviders[id] = {
            ...INITIAL_PROVIDERS_CONFIG[id],
            ...parsed.providers[id],
          };
        }
      });
    }

    return {
      activeProvider: parsed.activeProvider || 'gemini',
      providers: mergedProviders,
      geminiRateLimit: {
        ...DEFAULT_GEMINI_RATE_LIMIT,
        ...(parsed.geminiRateLimit || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load LLM settings from localStorage:', err);
    return {
      activeProvider: 'gemini',
      providers: INITIAL_PROVIDERS_CONFIG,
      geminiRateLimit: DEFAULT_GEMINI_RATE_LIMIT,
    };
  }
};

export const saveLLMSettings = (settings: LLMSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save LLM settings to localStorage:', err);
  }
};

export const resetLLMSettingsToDefault = (): LLMSettings => {
  const defaults: LLMSettings = {
    activeProvider: 'gemini',
    providers: INITIAL_PROVIDERS_CONFIG,
    geminiRateLimit: DEFAULT_GEMINI_RATE_LIMIT,
  };
  saveLLMSettings(defaults);
  return defaults;
};
