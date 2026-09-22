import React, { useState, useMemo } from 'react';
import { 
  PRIMARY_RESOURCE_CATEGORIES, 
  PrimaryResourceCategory, 
  ResourceCategoryMeta,
  inspectPrimaryResourcesInText,
  InspectionResult 
} from '../services/primaryResourceService';
import { ExecutionMode } from '../types';

interface PrimaryResourceHubProps {
  promptContent: string;
  onUpdatePromptContent: (newContent: string) => void;
  currentOutput?: string;
  executionMode: ExecutionMode;
  onSetExecutionMode: (mode: ExecutionMode) => void;
  onSelectSystemInstructionId?: (id: string) => void;
  isCompact?: boolean;
}

export const PrimaryResourceHub: React.FC<PrimaryResourceHubProps> = ({
  promptContent,
  onUpdatePromptContent,
  currentOutput = '',
  executionMode,
  onSetExecutionMode,
  onSelectSystemInstructionId,
  isCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'inject' | 'inspect'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<PrimaryResourceCategory>('bigtech');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Automatically extract a useful initial keyword from the prompt content if searchKeyword is empty
  const defaultKeyword = useMemo(() => {
    if (!promptContent.trim()) return '';
    // Look for prominent keywords or take the first 40 chars
    const cleaned = promptContent.replace(/[#*`\n\r]/g, ' ').trim();
    const firstLine = cleaned.split(/[。！？\n]/)[0];
    return firstLine.substring(0, 40).trim();
  }, [promptContent]);

  const effectiveKeyword = searchKeyword.trim() || defaultKeyword;

  const currentCategoryMeta: ResourceCategoryMeta = useMemo(() => {
    return PRIMARY_RESOURCE_CATEGORIES.find(c => c.id === selectedCategory) || PRIMARY_RESOURCE_CATEGORIES[0];
  }, [selectedCategory]);

  // Run output inspector
  const inspectionResult: InspectionResult = useMemo(() => {
    return inspectPrimaryResourcesInText(currentOutput);
  }, [currentOutput]);

  const handleInjectPrompt = (snippet: string, mode: 'append' | 'prepend') => {
    if (mode === 'append') {
      const updated = promptContent.trim() 
        ? `${promptContent}\n\n${snippet}` 
        : snippet;
      onUpdatePromptContent(updated);
    } else {
      const updated = promptContent.trim()
        ? `${snippet}\n\n${promptContent}`
        : snippet;
      onUpdatePromptContent(updated);
    }
  };

  const handleSetPrimaryResourceInstruction = () => {
    if (onSelectSystemInstructionId) {
      onSelectSystemInstructionId('si-primary-source-investigator');
    }
  };

  return (
    <div className="bg-gray-850 rounded-xl border border-gray-750 shadow-md overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-3 bg-gradient-to-r from-gray-900 via-gray-850 to-indigo-950/40 flex items-center justify-between gap-3 flex-wrap border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-lg text-white shadow-sm shadow-indigo-900/40 text-sm">
            <span>🔬</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">一次リソース特定・アクセス強化ハブ</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
                Primary Sources
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Reddit・HuggingFace・GitHub OSS・ComfyUI・BigTech・Agent・論文・Zenn/Qiitaの原典特定と検証
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Execution Mode Shortcut */}
          <button
            type="button"
            onClick={() => onSetExecutionMode(ExecutionMode.PRIMARY_RESOURCE)}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all flex items-center gap-1.5 ${
              executionMode === ExecutionMode.PRIMARY_RESOURCE
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-sm shadow-cyan-950'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:text-white hover:border-gray-600'
            }`}
            title="実行モードを「一次リソース特定・検証」に即座に設定"
          >
            <span>⚡</span>
            <span>一次リソース検証モード:</span>
            <span className={executionMode === ExecutionMode.PRIMARY_RESOURCE ? 'text-cyan-100 underline' : 'text-gray-400'}>
              {executionMode === ExecutionMode.PRIMARY_RESOURCE ? '適用中' : '適用する'}
            </span>
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-750 text-gray-200 text-xs rounded-lg border border-gray-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>{isOpen ? '▲ 折りたたむ' : '▼ 一次リソースナビを開く'}</span>
          </button>
        </div>
      </div>

      {/* Quick Category Badges Bar (Always visible) */}
      <div className="px-3 py-2 bg-gray-900/90 border-b border-gray-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-thin">
        <span className="text-gray-400 font-semibold whitespace-nowrap mr-1 flex items-center gap-1">
          <span>🎯</span>
          <span>8大領域:</span>
        </span>
        {PRIMARY_RESOURCE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              if (!isOpen) setIsOpen(true);
            }}
            className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              selectedCategory === cat.id && isOpen
                ? 'bg-indigo-900/80 text-indigo-200 border-indigo-500 font-bold shadow-sm'
                : 'bg-gray-800/80 text-gray-400 border-gray-750 hover:text-gray-200 hover:border-gray-600'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name.split('・')[0].split('&')[0]}</span>
          </button>
        ))}
      </div>

      {/* Expanded Content Panel */}
      {isOpen && (
        <div className="p-4 space-y-4 text-xs">
          {/* Tabs Bar */}
          <div className="flex items-center justify-between border-b border-gray-750 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-950'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🌐</span>
                <span>一次リソース直リンク & 検索</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inject')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'inject'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-950'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>💉</span>
                <span>一次検証プロンプト注入・試行</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inspect')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'inspect'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-950'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>📋</span>
                <span>出力の一次情報インスペクター</span>
                {currentOutput && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    inspectionResult.grade === 'S' ? 'bg-emerald-900 text-emerald-300' :
                    inspectionResult.grade === 'A' ? 'bg-cyan-900 text-cyan-300' :
                    inspectionResult.grade === 'B' ? 'bg-blue-900 text-blue-300' : 'bg-amber-900 text-amber-300'
                  }`}>
                    {inspectionResult.grade} ({inspectionResult.score}点)
                  </span>
                )}
              </button>
            </div>

            {/* Quick SI Switch Button */}
            {onSelectSystemInstructionId && (
              <button
                type="button"
                onClick={handleSetPrimaryResourceInstruction}
                className="px-2.5 py-1 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 text-purple-200 rounded-lg border border-purple-600/50 transition-colors flex items-center gap-1 cursor-pointer"
                title="「一次リソース特定・厳格検証マスター」システムインストラクションを適用"
              >
                <span>🧭</span>
                <span>一次検証システム指示を適用</span>
              </button>
            )}
          </div>

          {/* TAB 1: EXPLORE & SEARCH */}
          {activeTab === 'explore' && (
            <div className="space-y-4">
              {/* Category Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRIMARY_RESOURCE_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-950 to-gray-900 border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500'
                          : 'bg-gray-800/70 border-gray-750 hover:bg-gray-800 hover:border-gray-650'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">{cat.icon}</span>
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-indigo-200' : 'text-gray-200'}`}>
                          {cat.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{cat.tagline}</p>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Detail & Search Bar */}
              <div className="bg-gray-900/90 rounded-xl border border-gray-750 p-3.5 space-y-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentCategoryMeta.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{currentCategoryMeta.name}</span>
                        <span className="text-[11px] font-normal text-cyan-300">
                          {currentCategoryMeta.tagline}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">{currentCategoryMeta.description}</p>
                    </div>
                  </div>
                </div>

                {/* Keyword Search Input for Direct Deep Links */}
                <div className="bg-gray-850 p-2.5 rounded-lg border border-gray-750 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0 font-semibold text-xs">
                    <span>🔍 調査キーワード:</span>
                  </div>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    placeholder={defaultKeyword || '例: Llama 3.3, ComfyUI Flux, LangGraph State, LoRA...'}
                    className="flex-grow bg-gray-900 border border-gray-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 font-mono"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword('')}
                      className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-gray-800 rounded border border-gray-700 cursor-pointer"
                    >
                      クリア
                    </button>
                  )}
                </div>

                {/* Direct Search Generator Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-gray-400">
                    🚀 「{effectiveKeyword || '全般'}」の一次情報ダイレクト検索（別タブで開く）:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentCategoryMeta.searchGenerators.map((gen, idx) => {
                      const searchUrl = gen.generateUrl(effectiveKeyword || 'AI');
                      return (
                        <a
                          key={idx}
                          href={searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-750 hover:from-blue-900/60 hover:to-indigo-900/60 text-blue-200 hover:text-white rounded-lg border border-gray-700 hover:border-blue-500 text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span>🔎</span>
                          <span>{gen.label}</span>
                          <span className="text-[10px] text-gray-400">↗</span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Official Links Collection */}
                <div className="space-y-1.5 pt-2 border-t border-gray-800">
                  <span className="text-[11px] font-semibold text-gray-400">
                    🏛️ 公式一次ドキュメント・公式リポジトリ一覧:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentCategoryMeta.officialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-850 hover:bg-gray-800 border border-gray-750 hover:border-gray-650 rounded-lg transition-all flex flex-col justify-between group"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-gray-200 group-hover:text-blue-300 transition-colors truncate">
                            {link.title}
                          </span>
                          {link.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 font-mono flex-shrink-0">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 group-hover:text-gray-300 line-clamp-2">
                          {link.description}
                        </p>
                        <span className="text-[10px] text-gray-500 font-mono truncate mt-1">
                          {link.url}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INJECT TEMPLATES */}
          {activeTab === 'inject' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-indigo-200 flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">💡</span>
                <div>
                  <h5 className="font-bold text-xs">ワンクリック一次検証プロンプト注入</h5>
                  <p className="text-[11px] text-indigo-300/90 mt-0.5">
                    作成中のプロンプトに、一次リソース（公式コード・リポジトリ・論文・ノード仕様）への厳密特定指示を付加し、ハルシネーションのない最高精度のアウトプットを試行できます。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRIMARY_RESOURCE_CATEGORIES.flatMap(c => c.injectionTemplates.map(t => ({ ...t, categoryName: c.name, icon: c.icon }))).map(t => (
                  <div
                    key={t.id}
                    className="p-3 bg-gray-900 rounded-xl border border-gray-750 flex flex-col justify-between space-y-2 hover:border-gray-650 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>{t.icon}</span>
                        <span className="font-bold text-xs text-white">{t.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded border border-gray-700 ml-auto">
                          {t.categoryName}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-2">{t.description}</p>
                      <pre className="p-2 bg-gray-950 rounded-lg text-[10px] text-cyan-200/90 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto border border-gray-800">
                        {t.promptSnippet}
                      </pre>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={() => handleInjectPrompt(t.promptSnippet, 'prepend')}
                        className="px-2.5 py-1 bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs rounded border border-gray-700 cursor-pointer font-medium"
                        title="プロンプトの先頭に検証指示を追加"
                      >
                        先頭に追加
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInjectPrompt(t.promptSnippet, 'append')}
                        className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded shadow-sm shadow-blue-950 cursor-pointer flex items-center gap-1"
                        title="プロンプトの末尾に検証指示を追加"
                      >
                        <span>➕</span>
                        <span>プロンプト末尾に挿入して試行</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OUTPUT INSPECTOR */}
          {activeTab === 'inspect' && (
            <div className="space-y-4">
              {/* Inspection Summary Card */}
              <div className="p-4 bg-gray-900 rounded-xl border border-gray-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-800 rounded-xl text-center border border-gray-700">
                    <span className={`text-3xl font-black font-mono block ${inspectionResult.gradeColor}`}>
                      {inspectionResult.grade}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">適合ランク</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">一次リソース検証スコア: {inspectionResult.score} / 100</h4>
                      <div className="w-24 bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500" 
                          style={{ width: `${inspectionResult.score}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{inspectionResult.summary}</p>
                  </div>
                </div>

                {/* Trigger re-run with primary resource mode if score is low */}
                {inspectionResult.score < 70 && (
                  <button
                    type="button"
                    onClick={() => {
                      onSetExecutionMode(ExecutionMode.PRIMARY_RESOURCE);
                      const followUpPrompt = `【一次リソース特定・再検証指示】\n上記の回答内容について、一次情報（公式API仕様書、GitHub OSSリポジトリ、論文arXiv ID、Hugging Face Model Card等）を厳格に再調査し、URL・リポジトリ名・正確な原典仕様を追記して出力してください。`;
                      handleInjectPrompt(followUpPrompt, 'append');
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg shadow-sm shadow-emerald-950 text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>🔄</span>
                    <span>一次リソース再特定指示を付加して再実行</span>
                  </button>
                )}
              </div>

              {/* Checklist Breakdown */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-gray-300">検証チェックリスト項目（6大指標）:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {inspectionResult.checks.map(item => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                        item.passed
                          ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                          : 'bg-gray-900 border-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{item.passed ? '✅' : '⚪'}</span>
                        <div>
                          <span className={`font-bold text-xs block ${item.passed ? 'text-emerald-300' : 'text-gray-300'}`}>
                            {item.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{item.details}</span>
                          {item.foundMatches.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.foundMatches.map((m, i) => (
                                <span key={i} className="text-[10px] px-1 bg-gray-800 text-cyan-300 rounded font-mono border border-gray-700">
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono flex-shrink-0">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Primary Elements Breakdown */}
              {(inspectionResult.detectedUrls.length > 0 || 
                inspectionResult.detectedRepos.length > 0 || 
                inspectionResult.detectedArxivOrPapers.length > 0 || 
                inspectionResult.detectedModels.length > 0) && (
                <div className="p-3 bg-gray-900 rounded-xl border border-gray-750 space-y-2">
                  <h5 className="font-bold text-xs text-gray-300">出力から抽出された一次リソース一覧:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    {inspectionResult.detectedUrls.length > 0 && (
                      <div>
                        <span className="font-semibold text-cyan-300 block mb-1">🔗 検出されたURL ({inspectionResult.detectedUrls.length}件):</span>
                        <ul className="space-y-0.5 font-mono text-gray-300">
                          {inspectionResult.detectedUrls.map((u, i) => (
                            <li key={i} className="truncate">
                              <a href={u} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                {u}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {inspectionResult.detectedRepos.length > 0 && (
                      <div>
                        <span className="font-semibold text-indigo-300 block mb-1">🐙 GitHubリポジトリ ({inspectionResult.detectedRepos.length}件):</span>
                        <ul className="space-y-0.5 font-mono text-gray-300">
                          {inspectionResult.detectedRepos.map((r, i) => (
                            <li key={i}>
                              <a href={`https://github.com/${r}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                {r}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {inspectionResult.detectedArxivOrPapers.length > 0 && (
                      <div>
                        <span className="font-semibold text-amber-300 block mb-1">📄 論文/arXiv識別子:</span>
                        <ul className="space-y-0.5 font-mono text-gray-300">
                          {inspectionResult.detectedArxivOrPapers.map((p, i) => (
                            <li key={i} className="text-amber-200 font-mono">
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {inspectionResult.detectedModels.length > 0 && (
                      <div>
                        <span className="font-semibold text-purple-300 block mb-1">🤖 モデル識別子:</span>
                        <ul className="space-y-0.5 font-mono text-gray-300">
                          {inspectionResult.detectedModels.map((m, i) => (
                            <li key={i} className="text-purple-200 font-mono">
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
