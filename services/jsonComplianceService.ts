/**
 * JSON Compliance & Auto-Repair Engine (jsonComplianceService.ts)
 * 
 * Specifically engineered for local and OpenAI-compatible models (LM Studio, 
 * LM Studio Bionic, Unsloth Studio, vLLM, Ollama, etc.) where models frequently 
 * output malformed JSON, markdown fences, trailing commas, or truncated braces.
 */

import { LLMProviderConfig, JsonComplianceTestResult, LLMErrorDebugInfo } from '../types';
import { resolveEndpoint } from './llmBridge';

export interface JsonRepairResult {
  success: boolean;
  parsed: any;
  rawText: string;
  repairedText: string;
  wasRepaired: boolean;
  repairLogs: string[];
  syntaxError?: string;
}

/**
 * Robust JSON Cleaner and Auto-Repair Engine
 * Handles:
 * - Markdown fences (```json ... ``` or ``` ...)
 * - Leading conversational text ("Here is your JSON: ...")
 * - Trailing commentary ("Hope this helps! Let me know...")
 * - Trailing commas in arrays and objects (e.g. `{"a": 1,}`)
 * - Single quotes instead of double quotes for keys/strings
 * - Unclosed brackets or braces due to token limits / truncation
 * - Unescaped control characters / newlines inside string literals
 * - JS-style comments (// and /* ... *\/)
 */
export const cleanAndRepairJson = (rawText: string): JsonRepairResult => {
  const repairLogs: string[] = [];
  if (!rawText || !rawText.trim()) {
    return {
      success: false,
      parsed: null,
      rawText: rawText || '',
      repairedText: '',
      wasRepaired: false,
      repairLogs: ['入力テキストが空です'],
      syntaxError: 'Empty input',
    };
  }

  const originalTrimmed = rawText.trim();

  // 1. First, attempt standard direct JSON.parse
  try {
    const directParsed = JSON.parse(originalTrimmed);
    return {
      success: true,
      parsed: directParsed,
      rawText,
      repairedText: originalTrimmed,
      wasRepaired: false,
      repairLogs: ['標準構文に完全合致（修復不要）'],
    };
  } catch {
    // Needs inspection and repair
  }

  let text = originalTrimmed;

  // 2. Strip Markdown code blocks (```json ... ``` or ``` ...)
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = text.match(codeBlockRegex);
  if (match && match[1]) {
    text = match[1].trim();
    repairLogs.push('Markdownコードブロック記法 (```json ... ```) を検知・剥離');
  } else {
    // If opening ``` exists without closing, strip the prefix
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '').trim();
      repairLogs.push('未閉じのMarkdownコードブロック開始記号を除去');
    }
  }

  // 3. Extract JSON boundaries ({ ... } or [ ... ])
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let startIdx = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx > 0) {
    repairLogs.push(`JSON開始前の余剰会話文 (${startIdx}文字) を除去`);
    text = text.substring(startIdx);
  }

  // Find last boundary
  const lastBrace = text.lastIndexOf('}');
  const lastBracket = text.lastIndexOf(']');
  let endIdx = Math.max(lastBrace, lastBracket);

  if (endIdx !== -1 && endIdx < text.length - 1) {
    repairLogs.push(`JSON終了後の余剰解説文 (${text.length - 1 - endIdx}文字) を除去`);
    text = text.substring(0, endIdx + 1);
  }

  // 4. Strip single-line (//) and multi-line (/* */) comments
  const strippedComments = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^\\:])\/\/.*$/gm, '$1');
  if (strippedComments !== text) {
    text = strippedComments;
    repairLogs.push('JavaScript形式のコメント (//, /* */) を除去');
  }

  // 5. Fix trailing commas before closing braces/brackets (e.g. [1, 2, ] or {"a": 1, })
  const trailingCommaRegex = /,\s*([\]}])/g;
  if (trailingCommaRegex.test(text)) {
    text = text.replace(trailingCommaRegex, '$1');
    repairLogs.push('配列・オブジェクト末尾の不正なカンマ (Trailing Comma) を除去');
  }

  // 6. Test intermediate parse
  try {
    const parsed = JSON.parse(text);
    return {
      success: true,
      parsed,
      rawText,
      repairedText: text,
      wasRepaired: true,
      repairLogs,
    };
  } catch {
    // Continue deep repair
  }

  // 7. Repair unclosed quotes, brackets or braces (Token limit cut-off repair)
  let balanceResult = attemptBracketClosure(text);
  if (balanceResult.repaired) {
    text = balanceResult.text;
    repairLogs.push(...balanceResult.logs);
  }

  // Test parse after bracket closure
  try {
    const parsed = JSON.parse(text);
    return {
      success: true,
      parsed,
      rawText,
      repairedText: text,
      wasRepaired: true,
      repairLogs,
    };
  } catch {
    // Continue single-quote repair
  }

  // 8. Convert single quotes to double quotes if keys or values use single quotes
  // e.g. {'name': 'test'} -> {"name": "test"}
  const singleQuoteRegex = /([{,]\s*)'([^']+)'\s*:/g;
  if (singleQuoteRegex.test(text)) {
    text = text.replace(singleQuoteRegex, '$1"$2":');
    repairLogs.push("キーの単一引用符 ('key':) を二重引用符 (\"key\":) に変換");
  }

  // Final parse attempt
  try {
    const parsed = JSON.parse(text);
    return {
      success: true,
      parsed,
      rawText,
      repairedText: text,
      wasRepaired: true,
      repairLogs,
    };
  } catch (finalErr: any) {
    return {
      success: false,
      parsed: null,
      rawText,
      repairedText: text,
      wasRepaired: repairLogs.length > 0,
      repairLogs,
      syntaxError: finalErr?.message || 'JSON構文解析エラー',
    };
  }
};

/**
 * Attempts to close truncated JSON by analyzing the brace/bracket stack
 */
function attemptBracketClosure(input: string): { text: string; repaired: boolean; logs: string[] } {
  const stack: ('}' | ']')[] = [];
  let inString = false;
  let escape = false;
  const logs: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      stack.push('}');
    } else if (char === '[') {
      stack.push(']');
    } else if (char === '}') {
      if (stack.length > 0 && stack[stack.length - 1] === '}') {
        stack.pop();
      }
    } else if (char === ']') {
      if (stack.length > 0 && stack[stack.length - 1] === ']') {
        stack.pop();
      }
    }
  }

  let text = input;
  let repaired = false;

  // If closed inside string literal, close the string quote first
  if (inString) {
    text += '"';
    logs.push('途中で切断された文字列クォート (") を補完');
    repaired = true;
  }

  // Remove trailing comma right before closing
  text = text.trim().replace(/,\s*$/, '');

  // Close remaining brackets in reverse stack order
  if (stack.length > 0) {
    const closing = stack.reverse().join('');
    text += closing;
    logs.push(`トークン長制限等で欠落した未閉じ括弧 (${closing}) を自動補完`);
    repaired = true;
  }

  return { text, repaired, logs };
}

/**
 * Constructs a strict JSON instruction prompt for OpenAI-compatible/LM Studio models
 */
export const buildStrictJsonPrompt = (
  userPrompt: string,
  schemaRequirements?: string
): string => {
  return `【厳格JSON出力プロトコル（STRICT JSON ONLY）】
あなたはJSON生成エンジンです。以下の規則を100%遵守して回答してください：
1. 出力は最初の一文字から最後の一文字まで、純粋かつ構文上有効なJSONコードのみで構成すること。
2. Markdownのコードブロック記号（\`\`\` や \`\`\`json）で囲まないこと。直接 { または [ から開始すること。
3. JSONの前後に「承知しました」「以下がJSONです」「以上です」等の挨拶・解説・注釈文を一切含めないこと。
4. 全てのキーおよび文字列値はダブルクォート（"）で囲み、末尾の余分なカンマ（Trailing comma）を入れないこと。
${schemaRequirements ? `\n■ 要求スキーマ定義:\n${schemaRequirements}\n` : ''}
元の入力:
${userPrompt}`;
};

/**
 * Format complete debug report text suitable for one-click copy to clipboard
 */
export const formatDebugReport = (info: LLMErrorDebugInfo): string => {
  return [
    '==================================================',
    '🔍 [AI PROMPT ORCHESTRATOR] LLM DEBUG REPORT',
    '==================================================',
    `■ 発生日時: ${info.timestamp}`,
    `■ プロバイダー: ${info.providerName} (${info.providerId})`,
    `■ 指定モデル: ${info.model || '未指定'}`,
    `■ エンドポイント: ${info.endpoint}`,
    `■ 接続モード: ${info.connectionMode.toUpperCase()}`,
    info.httpStatus ? `■ HTTPステータス: ${info.httpStatus}` : null,
    info.errorType ? `■ エラー分類: ${info.errorType}` : null,
    '--------------------------------------------------',
    '■ エラー内容 (Error Message):',
    info.errorMessage,
    '--------------------------------------------------',
    info.suggestedRemedy ? `■ 推奨される解決策:\n${info.suggestedRemedy}\n--------------------------------------------------` : null,
    info.requestPayloadSummary ? `■ 送信ペイロード概要:\n${info.requestPayloadSummary}\n--------------------------------------------------` : null,
    info.rawResponseText ? `■ 生レスポンス本文 (Raw Response):\n${info.rawResponseText}\n--------------------------------------------------` : null,
    '==================================================',
  ].filter(Boolean).join('\n');
};

/**
 * Perform a live API JSON compliance test against LM Studio, Unsloth Studio, or OpenAI-compatibles
 */
export const runApiJsonComplianceTest = async (
  provider: LLMProviderConfig
): Promise<JsonComplianceTestResult> => {
  const startTime = Date.now();
  const endpointInfo = resolveEndpoint(provider, 'chat');
  const targetUrl = endpointInfo.url;
  const isCloud = provider.category === 'cloud' || provider.id === 'gemini';

  const testPayload = {
    test: 'json_compliance_probe',
    timestamp: Date.now(),
    requirements: ['status', 'provider', 'model', 'capabilities'],
  };

  const testSystemInstruction = 
    'You are a high-speed JSON testing agent. Output strictly valid JSON without any markdown formatting or commentary. ' +
    'Keys required: "status" (string "ok"), "tested_provider" (string), "latency_check" (boolean true), "features" (array of strings).';

  const messages = [
    { role: 'system', content: testSystemInstruction },
    { role: 'user', content: `Please return a JSON test confirmation for provider: ${provider.name}, model: ${provider.selectedModel || 'default'}. Data: ${JSON.stringify(testPayload)}` },
  ];

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (provider.apiKey) {
    headers.Authorization = `Bearer ${provider.apiKey}`;
  }

  let supportsJsonObjectMode = false;
  let rawResponseText = '';
  let finalRawContent = '';

  // 1. Try sending with response_format: { type: "json_object" } first (Standard OpenAI protocol)
  let requestBody: any = {
    model: provider.selectedModel || 'default',
    messages,
    stream: false,
    temperature: 0.1,
    max_tokens: 350,
  };

  if (provider.jsonMode !== 'prompt_only' && provider.jsonMode !== 'disabled') {
    requestBody.response_format = { type: 'json_object' };
  }

  try {
    let res = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    // If 400 Bad Request mentions response_format not supported, retry without response_format
    if (!res.ok && res.status === 400) {
      const errText = await res.text().catch(() => '');
      if (errText.includes('response_format') || errText.includes('json_object') || errText.includes('schema')) {
        supportsJsonObjectMode = false;
        // Retry without response_format
        delete requestBody.response_format;
        res = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });
      } else {
        rawResponseText = errText;
        throw new Error(`HTTP 400 Bad Request: ${errText.slice(0, 300)}`);
      }
    } else if (res.ok && requestBody.response_format) {
      supportsJsonObjectMode = true;
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    rawResponseText = JSON.stringify(data, null, 2);

    // Extract text content
    finalRawContent = data.choices?.[0]?.message?.content || 
                      data.choices?.[0]?.text || 
                      data.response || 
                      data.content || 
                      '';

    if (!finalRawContent) {
      throw new Error('LLMからのレスポンス本文が空でした。モデルが稼働しているか確認してください。');
    }

    const latencyMs = Date.now() - startTime;
    const repairResult = cleanAndRepairJson(finalRawContent);

    const debugReport = [
      '=== [JSON COMPLIANCE TEST REPORT] ===',
      `Target: ${provider.name} (${provider.id})`,
      `Model: ${provider.selectedModel}`,
      `Endpoint: ${targetUrl} [${endpointInfo.mode.toUpperCase()}]`,
      `Latency: ${latencyMs}ms`,
      `response_format { type: "json_object" } Support: ${supportsJsonObjectMode ? 'YES (ネイティブ対応)' : 'NO (プロンプト制御対応)'}`,
      `JSON Parse Success: ${repairResult.success ? 'YES' : 'NO'}`,
      `Auto-Repaired: ${repairResult.wasRepaired ? 'YES' : 'NO'}`,
      repairResult.repairLogs.length > 0 ? `Repair Steps:\n- ${repairResult.repairLogs.join('\n- ')}` : 'Repair: なし（完全準拠）',
      '--- Raw Output ---',
      finalRawContent,
      '--- Parsed JSON ---',
      repairResult.parsed ? JSON.stringify(repairResult.parsed, null, 2) : '(Parse Failed)',
      '====================================',
    ].join('\n');

    return {
      success: repairResult.success,
      latencyMs,
      providerId: provider.id,
      providerName: provider.name,
      model: provider.selectedModel,
      supportsJsonObjectMode,
      rawResponse: finalRawContent,
      parsedJson: repairResult.parsed,
      wasRepaired: repairResult.wasRepaired,
      repairLog: repairResult.repairLogs,
      errorMessage: repairResult.syntaxError,
      fullDebugReport: debugReport,
    };

  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = error?.message || '接続に失敗しました';

    const debugReport = [
      '=== [JSON COMPLIANCE TEST FAILED] ===',
      `Target: ${provider.name} (${provider.id})`,
      `Model: ${provider.selectedModel}`,
      `Endpoint: ${targetUrl} [${endpointInfo.mode.toUpperCase()}]`,
      `Latency: ${latencyMs}ms`,
      `Error: ${errorMsg}`,
      rawResponseText ? `Raw Response:\n${rawResponseText}` : '',
      '======================================',
    ].filter(Boolean).join('\n');

    return {
      success: false,
      latencyMs,
      providerId: provider.id,
      providerName: provider.name,
      model: provider.selectedModel,
      supportsJsonObjectMode: false,
      rawResponse: rawResponseText || '',
      parsedJson: null,
      wasRepaired: false,
      repairLog: ['通信・リクエストエラーにより検査中止'],
      errorMessage: errorMsg,
      fullDebugReport: debugReport,
    };
  }
};
