import React from 'react';
import { Project, SystemInstruction, LLMSettings } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onOpenGuidebook: () => void;
  onOpenReadme: () => void;
  onOpenInstructions: () => void;
  onOpenLLMSettings: () => void;
  activeInstruction?: SystemInstruction | null;
  llmSettings: LLMSettings;
  knowledgeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onOpenGuidebook,
  onOpenReadme,
  onOpenInstructions,
  onOpenLLMSettings,
  activeInstruction,
  llmSettings,
  knowledgeCount = 0,
}) => {
  const activeProvider = llmSettings.providers[llmSettings.activeProvider] || llmSettings.providers.gemini;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg text-white shadow-md">
            {ICONS.brain}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">AI Orchestrator</span>
            <span className="text-[10px] text-blue-400 font-normal">マルチLLM & ローカルPC連携版</span>
          </div>
        </h1>
      </div>

      {/* Projects List */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            プロジェクト
          </h2>
          <button
            onClick={onCreateProject}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="新規プロジェクト作成"
          >
            {ICONS.plus}
          </button>
        </div>

        <ul className="space-y-1">
          {projects.map(project => (
            <li key={project.id}>
              <button
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-all text-sm ${
                  activeProjectId === project.id
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className={activeProjectId === project.id ? 'text-white' : 'text-gray-400'}>
                  {ICONS.project}
                </span>
                <span className="truncate flex-grow">{project.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Navigation (LLM Settings, System Instructions & Guidebook) */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/90 space-y-1.5">
        {/* LLM Provider & Local PC Integration Button */}
        <button
          onClick={onOpenLLMSettings}
          className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all bg-gradient-to-r from-blue-950/70 to-indigo-950/50 hover:from-blue-900 hover:to-indigo-900 border border-blue-800/60 hover:border-blue-600 text-white group shadow-sm"
          title="LLMプロバイダー設定（Gemini無料枠タイマー、OpenRouter、Ollama/LM Studio等）"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-cyan-400 group-hover:scale-110 transition-transform text-sm">
              ⚡
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold leading-none">LLM & PC連携</span>
              <span className="text-[10px] text-blue-300 truncate max-w-[130px] mt-0.5">
                {activeProvider.name}
              </span>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900 text-cyan-200 border border-cyan-800 font-mono">
            {activeProvider.id === 'gemini' ? `${llmSettings.geminiRateLimit.rpm}RPM` : '設定'}
          </span>
        </button>

        {/* System Instructions Menu Button */}
        <button
          onClick={onOpenInstructions}
          className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 hover:border-amber-700/80 text-white group shadow-sm"
          title="システムインストラクションの選択・編集・管理"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-amber-400 group-hover:scale-110 transition-transform">
              {ICONS.cpu}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold leading-none">システム指示</span>
              <span className="text-[10px] text-gray-400 truncate max-w-[130px] mt-0.5">
                {activeInstruction ? activeInstruction.title : '選択・編集・サンプル'}
              </span>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
            {ICONS.sparkles}
          </span>
        </button>

        {/* Knowledge Base & Guidebook Button */}
        <button
          onClick={onOpenGuidebook}
          className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 hover:border-purple-600 text-white group shadow-sm"
          title="ナレッジベース（PDF・独自資料取込）＆ガイドブックを開く"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-purple-400 group-hover:scale-110 transition-transform">
              📚
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold leading-none">ナレッジ & ガイド</span>
              <span className="text-[10px] text-gray-400 truncate max-w-[130px] mt-0.5">
                PDF・文書取込 / 理論
              </span>
            </div>
          </div>
          {knowledgeCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
              {knowledgeCount}件
            </span>
          )}
        </button>

        {/* GitHub README & Install Guide Quick Button */}
        <button
          onClick={onOpenReadme}
          className="w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-all bg-gray-850 hover:bg-gray-800 border border-gray-750 hover:border-blue-600 text-gray-300 hover:text-white group"
          title="GitHub README & 導入・インストール手順を表示"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm group-hover:scale-110 transition-transform">
              🐙
            </span>
            <span className="text-xs font-medium truncate">GitHub README & 導入</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-mono">
            Docs
          </span>
        </button>

        <div className="pt-1 text-center">
          <p className="text-[10px] text-gray-600">AI Prompt Orchestrator v2.0</p>
        </div>
      </div>
    </div>
  );
};
