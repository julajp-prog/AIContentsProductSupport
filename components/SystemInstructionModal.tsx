import React, { useState, useMemo } from 'react';
import { Modal } from './common/Modal';
import { SystemInstruction } from '../types';
import { ICONS } from '../constants';
import { Tag } from './common/Tag';
import {
  createSystemInstruction,
  duplicateSystemInstruction,
  resetSystemInstructionsToDefault,
  exportSystemInstructionsToJson,
  importSystemInstructionsFromJson
} from '../services/systemInstructionStorage';

interface SystemInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructions: SystemInstruction[];
  selectedId: string | null;
  onSelect: (instruction: SystemInstruction) => void;
  onSaveInstruction: (instruction: SystemInstruction) => void;
  onDeleteInstruction: (id: string) => void;
  onResetInstructions: (newInstructions: SystemInstruction[]) => void;
}

type ViewMode = 'list' | 'edit' | 'create' | 'import-export';

export const SystemInstructionModal: React.FC<SystemInstructionModalProps> = ({
  isOpen,
  onClose,
  instructions,
  selectedId,
  onSelect,
  onSaveInstruction,
  onDeleteInstruction,
  onResetInstructions,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for Create/Edit
  const [editingItem, setEditingItem] = useState<SystemInstruction | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formError, setFormError] = useState('');

  // Import/Export states
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    instructions.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return ['all', ...Array.from(cats)];
  }, [instructions]);

  const filteredInstructions = useMemo(() => {
    return instructions.filter(item => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [instructions, searchQuery, selectedCategory]);

  const handleStartCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('カスタム');
    setFormDescription('');
    setFormTags('');
    setFormContent('');
    setFormError('');
    setViewMode('create');
  };

  const handleStartEdit = (item: SystemInstruction) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category || 'カスタム');
    setFormDescription(item.description || '');
    setFormTags(item.tags?.join(', ') || '');
    setFormContent(item.content);
    setFormError('');
    setViewMode('edit');
  };

  const handleDuplicate = (item: SystemInstruction) => {
    const dup = duplicateSystemInstruction(item);
    onSaveInstruction(dup);
    onSelect(dup);
    setViewMode('list');
  };

  const handleSaveForm = () => {
    if (!formTitle.trim()) {
      setFormError('タイトルを入力してください。');
      return;
    }
    if (!formContent.trim()) {
      setFormError('インストラクション内容を入力してください。');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (viewMode === 'create' || !editingItem) {
      const newItem = createSystemInstruction({
        title: formTitle.trim(),
        category: formCategory.trim() || 'カスタム',
        description: formDescription.trim(),
        tags: tagsArray,
        content: formContent.trim(),
      });
      onSaveInstruction(newItem);
      onSelect(newItem);
    } else {
      const updated: SystemInstruction = {
        ...editingItem,
        title: formTitle.trim(),
        category: formCategory.trim() || 'カスタム',
        description: formDescription.trim(),
        tags: tagsArray,
        content: formContent.trim(),
        isCustom: true,
        updatedAt: Date.now(),
      };
      onSaveInstruction(updated);
      if (selectedId === updated.id) {
        onSelect(updated);
      }
    }

    setViewMode('list');
  };

  const handleCopyContent = (item: SystemInstruction) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportDownload = () => {
    const jsonStr = exportSystemInstructionsToJson(instructions);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_instructions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    try {
      if (!jsonText.trim()) {
        setImportStatus('JSONテキストを入力してください。');
        return;
      }
      const imported = importSystemInstructionsFromJson(jsonText);
      const combined = [...instructions];
      for (const item of imported) {
        const idx = combined.findIndex(c => c.id === item.id);
        if (idx >= 0) {
          combined[idx] = item;
        } else {
          combined.push(item);
        }
      }
      onResetInstructions(combined);
      setImportStatus(`✅ ${imported.length}件のインストラクションを正常にインポートしました。`);
      setJsonText('');
    } catch (err: any) {
      setImportStatus(`❌ エラー: ${err.message}`);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('プリセットを初期状態にリセットしますか？（作成したカスタム設定も初期化されます）')) {
      const defaults = resetSystemInstructionsToDefault();
      onResetInstructions(defaults);
      if (defaults.length > 0) {
        onSelect(defaults[0]);
      }
      setImportStatus('✅ プリセットを初期状態に復元しました。');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-gray-200">
        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              {ICONS.cpu}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                システムインストラクション管理
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
                  {instructions.length}件 登録中
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                AIの人格、思考フレームワーク、出力トーンを規定するシステムプロンプトの選択・作成・編集
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode !== 'list' ? (
              <button
                onClick={() => setViewMode('list')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                一覧に戻る
              </button>
            ) : (
              <>
                <button
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-blue-900/30"
                >
                  {ICONS.plus}
                  <span>新規作成</span>
                </button>
                <button
                  onClick={() => setViewMode('import-export')}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors flex items-center gap-1"
                  title="インポート / エクスポート"
                >
                  {ICONS.download}
                  <span>バックアップ</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {ICONS.close}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 min-h-0 bg-gray-900/90">
          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {ICONS.search}
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="タイトル、説明、キーワード、タグで検索..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">全カテゴリ ({instructions.length})</option>
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>
                        {cat} ({instructions.filter(i => i.category === cat).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInstructions.map(item => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col rounded-xl border p-4 transition-all duration-150 ${
                        isSelected
                          ? 'bg-blue-950/30 border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-950/50'
                          : 'bg-gray-800/80 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                      }`}
                    >
                      {/* Card Top */}
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-700/80 text-gray-300 border border-gray-600">
                              {item.category || 'カスタム'}
                            </span>
                            {item.isCustom ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50 font-medium">
                                カスタム
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/50 font-medium">
                                サンプル
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-semibold flex items-center gap-1">
                                {ICONS.check} 適用中
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-300 line-clamp-2 mb-3 leading-relaxed flex-grow">
                        {item.description || item.content.slice(0, 100) + '...'}
                      </p>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map(t => (
                            <span
                              key={t}
                              className="text-[11px] px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-700/60"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Bottom Actions */}
                      <div className="pt-3 border-t border-gray-700/60 flex items-center justify-between text-xs gap-2">
                        <span className="text-gray-500 text-[11px]">
                          {item.content.length}文字
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyContent(item)}
                            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
                            title="プロンプト本文をコピー"
                          >
                            {copiedId === item.id ? ICONS.check : ICONS.copy}
                          </button>
                          <button
                            onClick={() => handleDuplicate(item)}
                            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
                            title="複製してカスタム化"
                          >
                            {ICONS.clone}
                          </button>
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
                            title="編集"
                          >
                            {ICONS.edit}
                          </button>
                          {item.isCustom && (
                            <button
                              onClick={() => {
                                if (window.confirm(`「${item.title}」を削除しますか？`)) {
                                  onDeleteInstruction(item.id);
                                }
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-900/30 transition-colors"
                              title="削除"
                            >
                              {ICONS.trash}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onSelect(item);
                              onClose();
                            }}
                            className={`px-3 py-1 rounded font-semibold transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white hover:bg-blue-500'
                                : 'bg-gray-700 hover:bg-blue-600 text-gray-200 hover:text-white'
                            }`}
                          >
                            {isSelected ? '適用中' : '選択する'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredInstructions.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    <p className="text-base font-medium">条件に一致するシステムインストラクションが見つかりませんでした。</p>
                    <p className="text-xs text-gray-500 mt-1">検索ワードを変えるか、右上の「新規作成」ボタンから追加してください。</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREATE / EDIT VIEW */}
          {(viewMode === 'create' || viewMode === 'edit') && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {viewMode === 'create' ? '✨ 新規システムインストラクション作成' : '✏️ システムインストラクション編集'}
                </h3>
                <span className="text-xs text-gray-400">
                  {formContent.length} 文字
                </span>
              </div>

              {formError && (
                <div className="p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    タイトル <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="例: 🎯 超一流のセールスコピーライター"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    カテゴリ
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="例: マーケティング"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  簡単な説明 / 用途の要約
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="例: 顧客の深層心理を揺さぶり、成約率を最大化する文章構成を指示するプロンプト。"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  タグ（カンマ区切り）
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  placeholder="例: コピーライティング, セールス, 成約率, LP"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-300">
                    インストラクション本文 (System Prompt) <span className="text-red-400">*</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    AIが常に前提として参照する役割・トーン・制約条件を記述
                  </span>
                </div>
                <textarea
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  rows={12}
                  placeholder={`あなたは〜の専門家です。\n\n【基本ルール】\n1. 読者の視点に立ち、〜\n2. アウトプット形式は〜\n\n【トーン＆マナー】\n・簡潔で洗練された語り口`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveForm}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-blue-900/30 flex items-center gap-2"
                >
                  {ICONS.check}
                  <span>保存して選択する</span>
                </button>
              </div>
            </div>
          )}

          {/* IMPORT / EXPORT VIEW */}
          {viewMode === 'import-export' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  {ICONS.download} 設定のエクスポート（バックアップ）
                </h4>
                <p className="text-xs text-gray-400">
                  現在登録されている全{instructions.length}件のシステムインストラクション（サンプル＋カスタム）をJSONファイルとして保存します。
                </p>
                <button
                  onClick={handleExportDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {ICONS.download}
                  <span>JSONファイルをダウンロード</span>
                </button>
              </div>

              <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  {ICONS.upload} 設定のインポート
                </h4>
                <p className="text-xs text-gray-400">
                  エクスポートしたJSONテキストを貼り付けてインポートします。既存の同名・同IDのものは上書きされます。
                </p>
                <textarea
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  rows={6}
                  placeholder="JSONテキストをここに貼り付けてください..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {importStatus && (
                  <p className="text-xs font-medium text-amber-300">
                    {importStatus}
                  </p>
                )}
                <button
                  onClick={handleImportJson}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {ICONS.upload}
                  <span>インポート実行</span>
                </button>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-800/60 rounded-xl space-y-2">
                <h4 className="font-bold text-red-300 flex items-center gap-2">
                  {ICONS.refresh} 初期サンプルへの復元
                </h4>
                <p className="text-xs text-gray-400">
                  ローカルストレージの変更を破棄し、アプリ同梱の公式サンプル（Note専任エディター、セールスコピー、ファクトチェッカー等）を初期状態に復元します。
                </p>
                <button
                  onClick={handleResetToDefault}
                  className="px-4 py-2 bg-red-800/80 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  初期プリセットにリセット
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
