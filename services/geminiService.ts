import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ExecutionMode } from '../types';
import { loadLLMSettings } from './llmStorage';

let aiClient: GoogleGenAI | null = null;
const getAi = (): GoogleGenAI => {
  if (!aiClient) {
    const key = (typeof process !== 'undefined' ? (process.env.API_KEY || process.env.GEMINI_API_KEY) : '') || '';
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
};

const getModel = (): string => {
  try {
    const settings = loadLLMSettings();
    return settings.providers.gemini.selectedModel || 'gemini-flash-latest';
  } catch {
    return 'gemini-flash-latest';
  }
};

const getSystemInstructionForMode = (mode: ExecutionMode, originalPrompt: string): string | undefined => {
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

const composeFinalSystemInstruction = (mode: ExecutionMode, prompt: string, customSystemInstruction?: string): string | undefined => {
  const modeInstruction = getSystemInstructionForMode(mode, prompt);
  
  if (customSystemInstruction && modeInstruction) {
    return `${customSystemInstruction}\n\n--- [実行モード追加指示] ---\n${modeInstruction}`;
  }
  return customSystemInstruction || modeInstruction;
};

export const executePrompt = async (
  prompt: string, 
  mode: ExecutionMode, 
  customSystemInstruction?: string
): Promise<string> => {
  try {
    const finalSystemInstruction = composeFinalSystemInstruction(mode, prompt, customSystemInstruction);

    const response: GenerateContentResponse = await getAi().models.generateContent({
      model: getModel(),
      contents: prompt,
      ...(finalSystemInstruction && { config: { systemInstruction: finalSystemInstruction } }),
    });

    return response.text;
  } catch (error) {
    console.warn("[GeminiService Notice]:", error);
    if (error instanceof Error) {
        return `AI通信中にエラーが発生しました: ${error.message}`;
    }
    return "AI通信中に予期せぬエラーが発生しました。";
  }
};

export const streamExecutePrompt = async (
  prompt: string, 
  mode: ExecutionMode, 
  onChunk: (chunk: string) => void, 
  customSystemInstruction?: string
): Promise<void> => {
  try {
    const finalSystemInstruction = composeFinalSystemInstruction(mode, prompt, customSystemInstruction);

    const responseStream = await getAi().models.generateContentStream({
      model: getModel(),
      contents: prompt,
      ...(finalSystemInstruction && { config: { systemInstruction: finalSystemInstruction } }),
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.warn("[GeminiService Notice]:", error);
    if (error instanceof Error) {
      onChunk(`\n\nエラーが発生しました: ${error.message}`);
    } else {
      onChunk("\n\n予期せぬエラーが発生しました。");
    }
  }
};
