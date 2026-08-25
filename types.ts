export enum ExecutionMode {
  STRAIGHT = 'そのまま実行',
  RESEARCH = 'リサーチ強化',
  IMPROVE = '改善・洗練',
  SIMULATE = 'テスト・シミュレーション',
}

export type ProviderType = 
  | 'gemini' 
  | 'openrouter' 
  | 'ollama' 
  | 'lmstudio' 
  | 'huggingface' 
  | 'github' 
  | 'groq' 
  | 'deepseek' 
  | 'openai' 
  | 'anthropic' 
  | 'custom';

export interface LLMProviderConfig {
  id: ProviderType;
  name: string;
  category: 'cloud' | 'local' | 'router' | 'custom';
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
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

