import React, { useState, useEffect } from 'react';
import { Prompt, ExecutionMode, SystemInstruction, LLMSettings, ProviderType, KnowledgeItem } from '../types';
import { executePromptStreamUnified, getGeminiRecentRequestCount } from '../services/llmService';
import { formatKnowledgeContext } from '../services/knowledgeStorage';
import { Spinner } from './common/Spinner';
import { ICONS } from '../constants';

interface PromptEditorProps {
  prompt: Prompt | null;
  onUpdatePrompt: (updatedPrompt: Prompt) => void;
  instructions: SystemInstruction[];
  activeInstructionId: string | null;
  onSelectInstructionId: (id: string | null) => void;
  onOpenInstructionsModal: () => void;
  llmSettings: LLMSettings;
  onOpenLLMSettings: () => void;
  onUpdateLLMSettings: (newSettings: LLMSettings) => void;
  knowledgeList: KnowledgeItem[];
  onOpenKnowledgeModal: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onUpdatePrompt,
  instructions,
  activeInstructionId,
  onSelectInstructionId,
  onOpenInstructionsModal,
  llmSettings,
  onOpenLLMSettings,
  knowledgeList,
  onOpenKnowledgeModal,
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(prompt);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>(ExecutionMode.STRAIGHT);
  const [isLoading, setIsLoading] = useState(false);
  const [waitCountdown, setWaitCountdown] = useState<number | null>(null);
  const [output, setOutput] = useState('');
  const [isSystemInstructionEnabled, setIsSystemInstructionEnabled] = useState(true);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [overrideInstructionText, setOverrideInstructionText] = useState<string>('');
  const [hasCopiedOutput, setHasCopiedOutput] = useState(false);
  const [recentGeminiCount, setRecentGeminiCount] = useState(0);

  // Attached Knowledge state for current prompt
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>([]);
  const [isKnowledgeSectionOpen, setIsKnowledgeSectionOpen] = useState(false);

  // Determine current active provider & model for this prompt or global
  const effectiveProviderId: ProviderType = currentPrompt?.providerOverride || llmSettings.activeProvider;
  const currentProviderConfig = llmSettings.providers[effectiveProviderId] || llmSettings.providers.gemini;
  const effectiveModel = currentPrompt?.modelOverride || currentProviderConfig.selectedModel;

  useEffect(() => {
    setCurrentPrompt(prompt);
    setOutput('');
    setWaitCountdown(null);
    if (prompt?.systemInstructionId) {
      onSelectInstructionId(prompt.systemInstructionId);
    }
    if (prompt?.attachedKnowledgeIds) {
      setSelectedKnowledgeIds(prompt.attachedKnowledgeIds);
    } else {
      setSelectedKnowledgeIds([]);
    }
  }, [prompt]);

  // Update Gemini recent requests count periodically
  useEffect(() => {
    const updateCount = () => {
      setRecentGeminiCount(getGeminiRecentRequestCount());
    };
    updateCount();
    const timer = setInterval(updateCount, 2000);
    return () => clearInterval(timer);
  }, []);

  const activeInstruction = instructions.find(i => i.id === activeInstructionId) || null;

  useEffect(() => {
    if (activeInstruction) {
      setOverrideInstructionText(activeInstruction.content);
    } else {
      setOverrideInstructionText('');
    }
  }, [activeInstructionId, activeInstruction]);

  if (!currentPrompt) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-500 p-8 text-center h-full">
        <div className="p-4 bg-gray-800/60 rounded-full mb-3 text-gray-400">
          {ICONS.prompt}
        </div>
        <p className="text-lg font-medium text-gray-300">プロンプトが選択されていません</p>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          左側のプロジェクトプロンプトまたは画面下の「ツールパレット」から、実行・編集したいプロンプトを選択してください。
        </p>
      </div>
    );
  }

  const handleRun = async () => {
    if (!currentPrompt.content.trim()) return;
    setIsLoading(true);
    setWaitCountdown(null);
    setOutput('');

    let finalInstruction: string | undefined = undefined;
    if (isSystemInstructionEnabled) {
      finalInstruction = overrideInstructionText.trim() || activeInstruction?.content;
    }

    // Format attached knowledge context
    const knowledgeContext = formatKnowledgeContext(selectedKnowledgeIds, knowledgeList);

    const providerConfigToUse = {
      ...currentProviderConfig,
      selectedModel: effectiveModel,
    };

    await executePromptStreamUnified({
      prompt: currentPrompt.content,
      mode: executionMode,
      customSystemInstruction: finalInstruction,
      knowledgeContext: knowledgeContext || undefined,
      providerConfig: providerConfigToUse,
      settings: llmSettings,
      onChunk: chunk => {
        setOutput(prev => prev + chunk);
      },
      onWaitTick: remainingSec => {
        setWaitCountdown(remainingSec > 0 ? remainingSec : null);
      },
    });

    setIsLoading(false);
    setWaitCountdown(null);
    setRecentGeminiCount(getGeminiRecentRequestCount());
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedPrompt = { ...currentPrompt, content: e.target.value };
    setCurrentPrompt(updatedPrompt);
    onUpdatePrompt(updatedPrompt);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPrompt = { ...currentPrompt, title: e.target.value };
    setCurrentPrompt(updatedPrompt);
    onUpdatePrompt(updatedPrompt);
  };

  const handleProviderChange = (newProviderId: ProviderType) => {
    const updatedPrompt: Prompt = {
      ...currentPrompt,
      providerOverride: newProviderId,
      modelOverride: llmSettings.providers[newProviderId].selectedModel,
    };
    setCurrentPrompt(updatedPrompt);
    onUpdatePrompt(updatedPrompt);
  };

  const handleModelChange = (newModel: string) => {
    const updatedPrompt: Prompt = {
      ...currentPrompt,
      modelOverride: newModel,
    };
    setCurrentPrompt(updatedPrompt);
    onUpdatePrompt(updatedPrompt);
  };

  const toggleKnowledgeItem = (id: string) => {
    const next = selectedKnowledgeIds.includes(id)
      ? selectedKnowledgeIds.filter(kId => kId !== id)
      : [...selectedKnowledgeIds, id];
    setSelectedKnowledgeIds(next);

    const updatedPrompt: Prompt = {
      ...currentPrompt,
      attachedKnowledgeIds: next,
    };
    setCurrentPrompt(updatedPrompt);
    onUpdatePrompt(updatedPrompt);
  };

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setHasCopiedOutput(true);
    setTimeout(() => setHasCopiedOutput(false), 2000);
  };

  const isGemini = effectiveProviderId === 'gemini';
  const rpmLimit = llmSettings.geminiRateLimit.rpm || 15;
  const isNearRpmLimit = isGemini && recentGeminiCount >= rpmLimit;

  // Selected knowledge items
  const attachedKnowledgeItems = knowledgeList.filter(k => selectedKnowledgeIds.includes(k.id));

  return (
    <div className="flex flex-col h-full p-4 gap-3 overflow-hidden bg-gray-900">
      
      {/* Title Bar & Quick Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-gray-800">
        <div className="flex items-center gap-2 flex-grow min-w-0 w-full sm:w-auto">
          <span className="text-blue-400 p-1.5 bg-blue-950/60 rounded-lg border border-blue-800">
            {ICONS.prompt}
          </span>
          <input
            type="text"
            value={currentPrompt.title}
            onChange={handleTitleChange}
            placeholder="プロンプト名"
            className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-gray-700 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-full transition-colors truncate"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Active LLM Provider & Model Quick Badge */}
          <div className="flex items-center gap-1.5 bg-gray-850 px-2.5 py-1 rounded-xl border border-gray-750 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isGemini
                  ? 'bg-emerald-400'
                  : currentProviderConfig.testStatus === 'success'
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
            />
            <span className="font-bold text-gray-200">
              {currentProviderConfig.name}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-blue-300 font-mono font-medium truncate max-w-[140px]">
              {effectiveModel}
            </span>
          </div>

          {currentPrompt.tags && currentPrompt.tags.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {currentPrompt.tags.slice(0, 2).map(t => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 font-medium truncate max-w-[100px]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LLM Provider Selection & Wait Timer Bar */}
      <div className="bg-gray-850 rounded-xl border border-gray-750 p-3 shadow-md space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: LLM Provider & Model Quick Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-gray-300 font-bold">
              <span className="text-cyan-400">{ICONS.cpu}</span>
              <span>LLM送信先:</span>
            </div>

            {/* Provider Selector */}
            <select
              value={effectiveProviderId}
              onChange={e => handleProviderChange(e.target.value as ProviderType)}
              className="bg-gray-900 border border-gray-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {Object.values(llmSettings.providers).map(p => (
                <option key={p.id} value={p.id}>
                  {p.id === 'gemini' ? '✨ ' : p.category === 'local' ? '💻 ' : '🌐 '}
                  {p.name}
                </option>
              ))}
            </select>

            {/* Model Selector */}
            <select
              value={effectiveModel}
              onChange={e => handleModelChange(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-xs text-blue-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono max-w-[200px] truncate"
            >
              {currentProviderConfig.availableModels.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Provider Settings Button */}
            <button
              onClick={onOpenLLMSettings}
              className="px-2.5 py-1.5 bg-gray-750 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-gray-700"
              title="プロバイダー設定（APIキー・ローカルOllama接続・モデル一覧取得・Geminiタイマー）"
            >
              <span>⚙️ プロバイダ・PC連携</span>
            </button>
          </div>

          {/* Right: Gemini Rate Limit Indicator / Mode & Execute */}
          <div className="flex items-center gap-2.5 flex-wrap ml-auto">
            
            {/* Gemini Wait Timer / RPM Meter */}
            {isGemini && (
              <div
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-mono ${
                  isNearRpmLimit
                    ? 'bg-rose-950/60 border-rose-700 text-rose-300 animate-pulse'
                    : 'bg-gray-900 border-gray-700 text-gray-300'
                }`}
                title={`直近1分間のGeminiリクエスト数: ${recentGeminiCount} / 最大 ${rpmLimit} RPM`}
              >
                <span>⏱️ 無料枠:</span>
                <span className="font-bold">{recentGeminiCount}/{rpmLimit} RPM</span>
                {waitCountdown !== null && waitCountdown > 0 && (
                  <span className="ml-1 text-amber-300 font-bold">
                    [待機中: {waitCountdown}s]
                  </span>
                )}
              </div>
            )}

            {/* Execution Mode */}
            <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-400">モード:</span>
              <select
                value={executionMode}
                onChange={e => setExecutionMode(e.target.value as ExecutionMode)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                {Object.values(ExecutionMode).map(mode => (
                  <option key={mode} value={mode} className="bg-gray-800 text-white">
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={isLoading || !currentPrompt.content.trim()}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-md shadow-blue-900/40 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <Spinner /> : ICONS.play}
              <span>
                {isLoading
                  ? waitCountdown !== null && waitCountdown > 0
                    ? `自動待機中 (${waitCountdown}s)...`
                    : '生成中...'
                  : 'プロンプト実行'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* System Instruction & Knowledge Base Selection Ribbon */}
      <div className="bg-gray-850 rounded-xl border border-gray-750 p-2.5 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left: System Instruction Dropdown & Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <input
                type="checkbox"
                id="enable-si"
                checked={isSystemInstructionEnabled}
                onChange={e => setIsSystemInstructionEnabled(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="enable-si" className="text-gray-300 font-semibold cursor-pointer flex items-center gap-1">
                <span className="text-amber-400">{ICONS.cpu}</span>
                <span>システム指示:</span>
              </label>
            </div>

            <select
              value={activeInstructionId || ''}
              onChange={e => onSelectInstructionId(e.target.value || null)}
              disabled={!isSystemInstructionEnabled}
              className="bg-gray-900 border border-gray-700 text-amber-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 font-medium max-w-[200px] truncate"
            >
              <option value="">(なし / 標準動作)</option>
              {instructions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsQuickEditOpen(!isQuickEditOpen)}
              disabled={!isSystemInstructionEnabled}
              className={`px-2 py-1 rounded text-xs transition-colors border ${
                isQuickEditOpen
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
              } disabled:opacity-40`}
              title="今回の実行限定でシステム指示を微調整"
            >
              ⚙️ 微調整
            </button>

            <button
              onClick={onOpenInstructionsModal}
              className="px-2 py-1 bg-gray-800 hover:bg-amber-950/80 hover:text-amber-300 text-gray-300 rounded text-xs transition-colors border border-gray-700"
              title="システムインストラクション管理（サンプル・新規作成）を開く"
            >
              {ICONS.sparkles} プリセット一覧
            </button>
          </div>

          {/* Right: Attached Knowledge Base Button & Quick Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsKnowledgeSectionOpen(!isKnowledgeSectionOpen)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                selectedKnowledgeIds.length > 0 || isKnowledgeSectionOpen
                  ? 'bg-purple-950/80 text-purple-200 border-purple-700 shadow-sm'
                  : 'bg-gray-800 hover:bg-purple-950/50 text-gray-300 border-gray-700'
              }`}
              title="プロンプトに注入する参照ナレッジ（PDF・文書ノウハウ）を選択"
            >
              <span>📚 参照ナレッジ</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-900 text-purple-200 text-[10px] font-bold">
                {selectedKnowledgeIds.length}件選択中
              </span>
              <span>{isKnowledgeSectionOpen ? '▲' : '▼'}</span>
            </button>

            <button
              onClick={onOpenKnowledgeModal}
              className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-purple-700 shadow-sm"
              title="PDFやファイルを新規取り込み・ナレッジ管理"
            >
              <span>📥 PDF/文書取込・管理</span>
            </button>
          </div>
        </div>

        {/* Expandable Attached Knowledge Selector */}
        {isKnowledgeSectionOpen && (
          <div className="pt-2 border-t border-gray-750 text-xs space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-semibold text-purple-300">
                プロンプト実行時にAIへ参照させるナレッジ（複数選択可）:
              </span>
              <button
                onClick={onOpenKnowledgeModal}
                className="text-[11px] text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
              >
                <span>➕ PDF等の新規ファイルを取り込む</span>
              </button>
            </div>

            {knowledgeList.length === 0 ? (
              <p className="text-gray-500 italic py-1">登録されているナレッジがありません。</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {knowledgeList.map(k => {
                  const isChecked = selectedKnowledgeIds.includes(k.id);
                  return (
                    <button
                      key={k.id}
                      onClick={() => toggleKnowledgeItem(k.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border text-left ${
                        isChecked
                          ? 'bg-purple-950 text-purple-200 border-purple-500 shadow-sm ring-1 ring-purple-500/50'
                          : 'bg-gray-900/80 text-gray-400 border-gray-750 hover:border-gray-600 hover:text-gray-200'
                      }`}
                    >
                      <span>{isChecked ? '☑️' : '◻️'}</span>
                      <span className="font-semibold truncate max-w-[200px]">{k.title}</span>
                      {k.sourceType === 'pdf' && (
                        <span className="text-[9px] px-1 bg-purple-900 text-purple-300 rounded font-mono">
                          PDF
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {attachedKnowledgeItems.length > 0 && (
              <div className="p-2 bg-purple-950/30 rounded border border-purple-800/40 text-[11px] text-purple-300 space-y-1">
                <span className="font-bold">✨ 今回AIに注入される知識コンテキスト:</span>
                <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                  {attachedKnowledgeItems.map(k => (
                    <li key={k.id} className="truncate">
                      <strong>{k.title}</strong>
                      {k.summary ? ` - ${k.summary.slice(0, 60)}...` : ` (約${k.content.length}文字)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Expandable Quick Edit Panel for System Instruction */}
        {isQuickEditOpen && isSystemInstructionEnabled && (
          <div className="pt-2 border-t border-gray-750 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-semibold text-amber-300">今回の実行用 システム指示微調整:</span>
              <button
                onClick={() => setOverrideInstructionText(activeInstruction?.content || '')}
                className="text-[11px] text-blue-400 hover:underline"
              >
                元の指示に戻す
              </button>
            </div>
            <textarea
              value={overrideInstructionText}
              onChange={e => setOverrideInstructionText(e.target.value)}
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
              placeholder="システムインストラクションの内容..."
            />
          </div>
        )}
      </div>

      {/* Main Split: Prompt Input & AI Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-0">
        
        {/* Left: Prompt Content Editor */}
        <div className="flex flex-col bg-gray-850 rounded-xl border border-gray-750 p-3 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>{ICONS.edit}</span>
              <span>プロンプト入力</span>
            </span>
            <span className="text-[11px] text-gray-500 font-mono">
              {currentPrompt.content.length} 文字
            </span>
          </div>

          <textarea
            value={currentPrompt.content}
            onChange={handleContentChange}
            placeholder="プロンプト本文を入力してください... (例: Note記事のリード文構成案、商品LPのキャッチコピー、競合リサーチなど)"
            className="w-full flex-grow bg-gray-900 border border-gray-750 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Right: Output Stream & Markdown Viewer */}
        <div className="flex flex-col bg-gray-850 rounded-xl border border-gray-750 p-3 shadow-md min-h-0">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-cyan-400">{ICONS.sparkles}</span>
                <span>AI 実行結果</span>
              </span>
              {isLoading && (
                <span className="text-[11px] text-cyan-400 animate-pulse flex items-center gap-1">
                  <span>ストリーミング生成中...</span>
                </span>
              )}
            </div>

            {output && (
              <button
                onClick={handleCopyOutput}
                className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-gray-700"
              >
                {hasCopiedOutput ? '✓ コピー完了' : `${ICONS.copy} コピー`}
              </button>
            )}
          </div>

          <div className="flex-grow bg-gray-900 rounded-xl p-4 overflow-y-auto border border-gray-750 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {output ? (
              output
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
                <div className="text-3xl opacity-40">✨</div>
                <p className="text-xs">
                  「プロンプト実行」ボタンを押すと、選択したLLMプロバイダーと参照ナレッジに基づいてリアルタイムに結果がストリーミング出力されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
