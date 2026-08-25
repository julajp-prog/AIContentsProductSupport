import React from 'react';
import { Project, Prompt, NoteAccountType, SystemInstruction } from '../types';
import { ICONS } from '../constants';
import { Tag } from './common/Tag';

interface ProjectDashboardProps {
  project: Project;
  instructions: SystemInstruction[];
  onSelectPrompt: (prompt: Prompt) => void;
  onCreatePrompt: () => void;
  onClonePrompt: (promptId: string) => void;
  onOpenInstructions: () => void;
  onUpdateProjectDefaultInstruction?: (instructionId: string) => void;
}

const NoteCard: React.FC<{
  type: NoteAccountType;
  prompts: Prompt[];
  instructions: SystemInstruction[];
  onSelectPrompt: (prompt: Prompt) => void;
}> = ({ type, prompts, instructions, onSelectPrompt }) => {
  const colorMap = {
    [NoteAccountType.SEO]: 'border-green-500 bg-green-950/10',
    [NoteAccountType.PAID_CONTENT]: 'border-purple-500 bg-purple-950/10',
    [NoteAccountType.EDUCATION]: 'border-blue-500 bg-blue-950/10',
    [NoteAccountType.AFFILIATE]: 'border-yellow-500 bg-yellow-950/10',
  };

  const badgeColorMap = {
    [NoteAccountType.SEO]: 'bg-green-900/60 text-green-300 border-green-700/60',
    [NoteAccountType.PAID_CONTENT]: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
    [NoteAccountType.EDUCATION]: 'bg-blue-900/60 text-blue-300 border-blue-700/60',
    [NoteAccountType.AFFILIATE]: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/60',
  };

  return (
    <div className={`bg-gray-800/90 rounded-xl border-l-4 ${colorMap[type]} border border-gray-700/80 p-4 shadow-md flex flex-col justify-between`}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-white text-sm">{type}</h4>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColorMap[type]}`}>
            {prompts.length}件
          </span>
        </div>
        <ul className="space-y-2">
          {prompts.map(p => {
            const promptInstruction = p.systemInstructionId
              ? instructions.find(i => i.id === p.systemInstructionId)
              : null;
            return (
              <li key={p.id}>
                <button
                  onClick={() => onSelectPrompt(p)}
                  className="w-full text-left p-2.5 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition-all border border-gray-700/50 hover:border-blue-500 group"
                >
                  <p className="text-xs font-semibold text-gray-200 group-hover:text-white line-clamp-1">
                    {p.title}
                  </p>
                  {promptInstruction && (
                    <span className="inline-block mt-1 text-[10px] text-blue-300 bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-800/60 truncate max-w-full">
                      ⚡ {promptInstruction.title}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {prompts.length === 0 && (
            <li className="text-xs text-gray-500 py-3 text-center italic">
              プロンプトがありません
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  project,
  instructions,
  onSelectPrompt,
  onCreatePrompt,
  onClonePrompt,
  onOpenInstructions,
}) => {
  const notePrompts = Object.values(NoteAccountType).reduce((acc, type) => {
    acc[type] = project.prompts.filter(p => p.tags.includes(type));
    return acc;
  }, {} as Record<NoteAccountType, Prompt[]>);

  const otherPrompts = project.prompts.filter(
    p => !Object.values(NoteAccountType).some(tag => p.tags.includes(tag))
  );

  const defaultInstruction = project.defaultSystemInstructionId
    ? instructions.find(i => i.id === project.defaultSystemInstructionId)
    : null;

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6 bg-gray-900">
      {/* Project Overview Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-800/90 to-gray-800/60 p-6 rounded-2xl border border-gray-700/80 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-900/60 text-blue-300 border border-blue-700">
              アクティブプロジェクト
            </span>
            {defaultInstruction && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-900/40 text-amber-300 border border-amber-700/60 flex items-center gap-1">
                {ICONS.cpu} 基準人格: {defaultInstruction.title}
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {project.title}
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenInstructions}
            className="px-3.5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-600 shadow-sm"
          >
            {ICONS.cpu}
            <span>システム設定</span>
          </button>
          <button
            onClick={onCreatePrompt}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/40"
          >
            {ICONS.plus}
            <span>新規プロンプト</span>
          </button>
        </div>
      </div>

      {/* Note Publisher Model View */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-pink-400">{ICONS.note}</span>
            <span>Note パブリッシャーモデル（役割別プロンプト群）</span>
          </h3>
          <span className="text-xs text-gray-400">
            集客・教育・販売・レビューの多面展開
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.values(NoteAccountType).map(type => (
            <NoteCard
              key={type}
              type={type}
              prompts={notePrompts[type]}
              instructions={instructions}
              onSelectPrompt={onSelectPrompt}
            />
          ))}
        </div>
      </div>

      {/* All / Other Prompts List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-blue-400">{ICONS.prompt}</span>
            <span>一般・ワークフロー プロンプト</span>
          </h3>
          <span className="text-xs text-gray-400">
            {otherPrompts.length}件
          </span>
        </div>

        <div className="bg-gray-800/90 rounded-xl border border-gray-700 overflow-hidden shadow-md">
          {otherPrompts.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {otherPrompts.map(prompt => {
                const promptInstruction = prompt.systemInstructionId
                  ? instructions.find(i => i.id === prompt.systemInstructionId)
                  : null;
                return (
                  <li
                    key={prompt.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex-grow min-w-0 pr-4">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-white text-sm">
                          {prompt.title}
                        </p>
                        {promptInstruction && (
                          <span className="text-[10px] text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60 font-semibold">
                            ⚡ {promptInstruction.title}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 mb-2 font-mono">
                        {prompt.content || '（内容未入力）'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map(tag => (
                          <Tag key={tag} label={tag} />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onClonePrompt(prompt.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                        title="プロンプトを複製"
                      >
                        {ICONS.clone}
                      </button>
                      <button
                        onClick={() => onSelectPrompt(prompt)}
                        className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        title="エディターで開く"
                      >
                        {ICONS.edit}
                        <span>編集・実行</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              追加のプロンプトはありません。「新規プロンプト」から追加してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
