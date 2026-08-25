import React from 'react';
import { Project, Prompt, SystemInstruction, LLMSettings, KnowledgeItem } from '../types';
import { ProjectDashboard } from './ProjectDashboard';
import { PromptEditor } from './PromptEditor';
import { ICONS } from '../constants';

type ActiveView = 'dashboard' | 'editor';

interface MainContentProps {
  activeProject: Project | null;
  activePrompt: Prompt | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onSelectPrompt: (prompt: Prompt) => void;
  onUpdatePrompt: (updatedPrompt: Prompt) => void;
  onCreatePrompt: () => void;
  onClonePrompt: (promptId: string) => void;
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

export const MainContent: React.FC<MainContentProps> = ({ 
  activeProject, 
  activePrompt,
  activeView, 
  setActiveView, 
  onSelectPrompt,
  onUpdatePrompt,
  onCreatePrompt,
  onClonePrompt,
  instructions,
  activeInstructionId,
  onSelectInstructionId,
  onOpenInstructionsModal,
  llmSettings,
  onOpenLLMSettings,
  onUpdateLLMSettings,
  knowledgeList,
  onOpenKnowledgeModal,
}) => {
  if (!activeProject) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-500 p-8 text-center">
        <div className="p-4 bg-gray-800 rounded-full mb-3 text-gray-400">
          {ICONS.project}
        </div>
        <p className="text-lg font-medium text-gray-300">プロジェクトが選択されていません</p>
        <p className="text-xs text-gray-500 mt-1">
          左側のサイドバーからプロジェクトを選択するか、新規作成してください。
        </p>
      </div>
    );
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt);
    setActiveView('editor');
  };

  const activeInstruction = instructions.find(i => i.id === activeInstructionId);
  const activeProvider = llmSettings.providers[llmSettings.activeProvider] || llmSettings.providers.gemini;

  return (
    <div className="flex-grow flex flex-col min-w-0 h-full bg-gray-900 overflow-hidden">
      {/* Top Header & Tab Navigation */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-4 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center">
          <TabButton
            title="ダッシュボード"
            icon={ICONS.project}
            isActive={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <TabButton
            title="エディター"
            icon={ICONS.edit}
            isActive={activeView === 'editor'}
            onClick={() => setActiveView('editor')}
          />
        </div>

        {/* Current Active LLM Provider, Knowledge Base & System Instruction Quick pills */}
        <div className="flex items-center gap-2 py-1.5 flex-wrap">
          {/* LLM Provider Pill */}
          <button
            onClick={onOpenLLMSettings}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-800/90 hover:bg-gray-750 text-xs text-gray-200 rounded-full border border-gray-700 transition-colors"
            title="LLMプロバイダー設定を開く"
          >
            <span className="text-cyan-400">⚡</span>
            <span className="font-semibold text-gray-400">LLM:</span>
            <span className="text-cyan-300 font-medium truncate max-w-[120px]">
              {activeProvider.name}
            </span>
          </button>

          {/* Knowledge Base Quick Pill */}
          <button
            onClick={onOpenKnowledgeModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-800/90 hover:bg-purple-950/70 text-xs text-gray-200 rounded-full border border-gray-700 hover:border-purple-700 transition-colors"
            title="ナレッジベース（PDF・ファイル取込・ノウハウ）を開く"
          >
            <span className="text-purple-400">📚</span>
            <span className="font-semibold text-gray-400">ナレッジ:</span>
            <span className="text-purple-300 font-medium">
              {knowledgeList.length}件登録済
            </span>
          </button>

          {/* System Instruction Pill */}
          <button
            onClick={onOpenInstructionsModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-gray-800/90 hover:bg-gray-750 text-xs text-gray-200 rounded-full border border-gray-700 transition-colors"
            title="現在のシステムインストラクションを変更・管理"
          >
            <span className="text-amber-400">{ICONS.cpu}</span>
            <span className="font-semibold text-gray-400">指示:</span>
            <span className="text-amber-300 font-medium truncate max-w-[120px]">
              {activeInstruction ? activeInstruction.title : '標準'}
            </span>
          </button>
        </div>
      </div>
    
      <div className="flex-grow bg-gray-900 overflow-hidden">
        {activeView === 'dashboard' && (
          <ProjectDashboard 
            project={activeProject}
            instructions={instructions}
            onSelectPrompt={handleSelectPrompt} 
            onCreatePrompt={onCreatePrompt}
            onClonePrompt={onClonePrompt}
            onOpenInstructions={onOpenInstructionsModal}
          />
        )}
        {activeView === 'editor' && (
          <PromptEditor
            prompt={activePrompt}
            onUpdatePrompt={onUpdatePrompt}
            instructions={instructions}
            activeInstructionId={activeInstructionId}
            onSelectInstructionId={onSelectInstructionId}
            onOpenInstructionsModal={onOpenInstructionsModal}
            llmSettings={llmSettings}
            onOpenLLMSettings={onOpenLLMSettings}
            onUpdateLLMSettings={onUpdateLLMSettings}
            knowledgeList={knowledgeList}
            onOpenKnowledgeModal={onOpenKnowledgeModal}
          />
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  title: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ title, icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
        isActive 
          ? 'border-blue-500 text-white bg-gray-800/40' 
          : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
      }`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      <span>{title}</span>
    </button>
  );
};
