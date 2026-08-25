import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ExecutionMode } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstructionForMode = (mode: ExecutionMode, originalPrompt: string): string | undefined => {
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

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      ...(finalSystemInstruction && { config: { systemInstruction: finalSystemInstruction } }),
    });

    return response.text;
  } catch (error) {
    console.error("Error executing Gemini prompt:", error);
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

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      ...(finalSystemInstruction && { config: { systemInstruction: finalSystemInstruction } }),
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error executing Gemini prompt stream:", error);
    if (error instanceof Error) {
      onChunk(`\n\nエラーが発生しました: ${error.message}`);
    } else {
      onChunk("\n\n予期せぬエラーが発生しました。");
    }
  }
};
