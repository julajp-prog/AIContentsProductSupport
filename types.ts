export enum ExecutionMode {
  STRAIGHT = 'そのまま実行',
  RESEARCH = 'リサーチ強化',
  PRIMARY_RESOURCE = '一次リソース特定・検証',
  IMPROVE = '改善・洗練',
  SIMULATE = 'テスト・シミュレーション',
}

export type ProviderType = 
  | 'gemini' 
  | 'openrouter' 
  | 'ollama' 
  | 'lmstudio' 
  | 'lmstudio_bionic'
  | 'unsloth'
  | 'openai_compat'
  | 'huggingface' 
  | 'github' 
  | 'groq' 
  | 'deepseek' 
  | 'openai' 
  | 'anthropic' 
  | 'custom';

export type ConnectionMode = 'direct' | 'proxy';

export type JsonDeliveryMode = 'auto' | 'strict_json_object' | 'prompt_only' | 'disabled';

export interface LLMProviderConfig {
  id: ProviderType;
  name: string;
  category: 'cloud' | 'local' | 'router' | 'custom';
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  connectionMode?: ConnectionMode; // 'direct' (fetch direct to localhost) or 'proxy' (via /api/proxy/...)
  proxyUrl?: string; // Optional custom proxy URL
  selectedModel: string;
  availableModels: string[];
  temperature?: number;
  maxTokens?: number;
  description: string;
  defaultEndpoint: string;
  docsUrl?: string;
  lastTestedAt?: number;
  testStatus?: 'success' | 'error' | 'testing' | 'untested';
  testLatencyMs?: number;
  testMessage?: string;
  jsonMode?: JsonDeliveryMode; // JSON delivery protocol
  autoRepairJson?: boolean; // Automatically repair and sanitize malformed JSON
}

export type LLMRuntimeStatus = 'idle' | 'cooldown' | 'connecting' | 'streaming' | 'validating_json' | 'completed' | 'error';

export interface LLMErrorDebugInfo {
  timestamp: string;
  providerId: ProviderType;
  providerName: string;
  model: string;
  endpoint: string;
  connectionMode: 'direct' | 'proxy' | 'cloud';
  httpStatus?: number;
  errorType?: string;
  errorMessage: string;
  rawResponseText?: string;
  requestPayloadSummary?: string;
  suggestedRemedy?: string;
  rawErrorObject?: any;
}

export interface JsonComplianceTestResult {
  success: boolean;
  latencyMs: number;
  providerId: ProviderType;
  providerName: string;
  model: string;
  supportsJsonObjectMode: boolean;
  rawResponse: string;
  parsedJson: any;
  wasRepaired: boolean;
  repairLog: string[];
  errorMessage?: string;
  fullDebugReport: string;
}

export interface LLMStatusMonitorState {
  status: LLMRuntimeStatus;
  providerId: ProviderType;
  providerName: string;
  model: string;
  connectionMode: 'direct' | 'proxy' | 'cloud';
  endpoint: string;
  characterCount: number;
  latencyMs?: number;
  cooldownSeconds?: number;
  errorMessage?: string;
  lastErrorDetails?: LLMErrorDebugInfo;
  isJsonMode?: boolean;
  jsonValidationStatus?: 'valid' | 'repaired' | 'invalid' | 'none';
  isGeminiIsolated: boolean; // Guaranteed true when non-gemini is selected: Gemini API is completely uncalled
  lastUpdated: number;
}

export interface GeminiRateLimitSettings {
  rpm: number; // Requests per minute (e.g. 15 for free tier, 5, 2, etc.)
  autoWait: boolean; // Automatically wait and send when rate limit cooldown completes
  cooldownSeconds: number; // Minimum gap between consecutive requests (e.g. 4s for 15 RPM)
}

export interface LLMSettings {
  activeProvider: ProviderType;
  providers: Record<ProviderType, LLMProviderConfig>;
  geminiRateLimit: GeminiRateLimitSettings;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  sourceType?: 'pdf' | 'text' | 'manual' | 'preset' | 'file';
  sourceFileName?: string;
  fileSize?: number;
  charCount?: number;
  summary?: string;
  isPreset?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SystemInstruction {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags?: string[];
  isCustom?: boolean;
  isDefault?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  systemInstructionId?: string; // Optional prompt-specific system instruction ID
  customSystemInstruction?: string; // Optional prompt-specific override
  providerOverride?: ProviderType; // Optional prompt-specific LLM provider
  modelOverride?: string; // Optional prompt-specific LLM model
  attachedKnowledgeIds?: string[]; // Knowledge IDs to include as context for this prompt
}

export interface Tool extends Prompt {
  category: string;
}

export interface WorkflowStep {
  promptId: string;
  executionMode: ExecutionMode;
  systemInstructionId?: string;
  providerOverride?: ProviderType;
  modelOverride?: string;
  attachedKnowledgeIds?: string[];
}

export interface Workflow {
  id: string;
  title: string;
  steps: WorkflowStep[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  prompts: Prompt[];
  workflows: Workflow[];
  defaultSystemInstructionId?: string;
  defaultProvider?: ProviderType;
  defaultModel?: string;
  defaultKnowledgeIds?: string[]; // Project default attached knowledge items
}

export enum NoteAccountType {
  SEO = '認知・SEO・AIO用',
  PAID_CONTENT = '有料コンテンツ・特典用',
  EDUCATION = '学習・無料講座用',
  AFFILIATE = 'アフィリエイト用',
}

export type ExpertDimensionId = 'roadmap' | 'funnel' | 'promotion' | 'content' | 'concept';

export type ExpertResonanceLevel = 'shu' | 'ha' | 'ri'; // 守(型再現) / 破(連動変形) / 離(超次元全解放)

export interface ExpertDimensionDef {
  id: ExpertDimensionId;
  name: string;
  symbol: string;
  title: string;
  domain: string;
  description: string;
  metaLenses: string[];
}

export interface HyperExpertSettings {
  isEnabled: boolean; // 超高次元エキスパートモード全体 ON/OFF
  resonanceLevel: ExpertResonanceLevel; // 守破離レベル
  butlerPersonaEnabled: boolean; // 統合執事（Integrated Butler）による多重複合編成
  activeDimensions: Record<ExpertDimensionId, boolean>; // 個別Expert部分適用
  customFocusPrompt?: string; // 独自の超次元拘束・追加指示
}

