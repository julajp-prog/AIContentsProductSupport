import React, { useState, useRef } from 'react';
import { KnowledgeItem } from '../types';
import {
  KNOWLEDGE_CATEGORIES,
  resetKnowledgeToDefault,
} from '../services/knowledgeStorage';
import { extractTextFromPdf, readTextFromFile } from '../services/pdfExtractor';
import { ICONS } from '../constants';

interface KnowledgeManagerProps {
  knowledgeList: KnowledgeItem[];
  onSaveKnowledge: (item: KnowledgeItem) => void;
  onDeleteKnowledge: (id: string) => void;
  onResetKnowledge: (items: KnowledgeItem[]) => void;
  selectedKnowledgeId?: string | null;
  onSelectKnowledge?: (id: string) => void;
  isCompactMode?: boolean; // When embedded in other views
}

export const KnowledgeManager: React.FC<KnowledgeManagerProps> = ({
  knowledgeList,
  onSaveKnowledge,
  onDeleteKnowledge,
  onResetKnowledge,
  selectedKnowledgeId,
  onSelectKnowledge,
  isCompactMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'upload' | 'edit'>('list');

  // File Upload State
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('custom');
  const [formContent, setFormContent] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formSourceFileName, setFormSourceFileName] = useState('');
  const [formSourceType, setFormSourceType] = useState<KnowledgeItem['sourceType']>('manual');

  // Collect all unique tags
  const allTags = Array.from(
    new Set(knowledgeList.flatMap(k => k.tags || []))
  );

  // Filtered knowledge
  const filteredList = knowledgeList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesTag && matchesQuery;
  });

  const handleStartCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('custom');
    setFormContent('');
    setFormSummary('');
    setFormTags('');
    setFormSourceFileName('');
    setFormSourceType('manual');
    setIsCreating(true);
    setActiveTab('edit');
  };

  const handleStartEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormContent(item.content);
    setFormSummary(item.summary || '');
    setFormTags((item.tags || []).join(', '));
    setFormSourceFileName(item.sourceFileName || '');
    setFormSourceType(item.sourceType || 'manual');
    setIsCreating(false);
    setActiveTab('edit');
  };

  const handleCloneItem = (item: KnowledgeItem) => {
    const cloned: KnowledgeItem = {
      ...item,
      id: `k-custom-${Date.now()}`,
      title: `${item.title} (カスタム複製)`,
      isPreset: false,
      sourceType: 'manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onSaveKnowledge(cloned);
    handleStartEdit(cloned);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('タイトルを入力してください。');
      return;
    }
    if (!formContent.trim()) {
      alert('ナレッジの本文内容を入力してください。');
      return;
    }

    const tags = formTags
      .split(/[,、\s]+/)
      .map(t => t.trim())
      .filter(Boolean);

    const now = Date.now();
    const item: KnowledgeItem = {
      id: editingItem ? editingItem.id : `k-${now}`,
      title: formTitle.trim(),
      category: formCategory,
      content: formContent.trim(),
      summary: formSummary.trim() || undefined,
      tags,
      sourceType: formSourceType,
      sourceFileName: formSourceFileName || undefined,
      charCount: formContent.trim().length,
      isPreset: editingItem ? editingItem.isPreset : false,
      createdAt: editingItem ? editingItem.createdAt : now,
      updatedAt: now,
    };

    onSaveKnowledge(item);
    setActiveTab('list');
    setIsCreating(false);
    setEditingItem(null);
  };

  // Handle PDF and Text File Processing
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadError(null);
    setUploadSuccess(null);
    setIsExtracting(true);
    setExtractionProgress(null);

    try {
      let extractedText = '';
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        const result = await extractTextFromPdf(file, (curr, total) => {
          setExtractionProgress({ current: curr, total });
        });
        extractedText = result.text;
      } else {
        // Plain text, markdown, json, csv, etc.
        extractedText = await readTextFromFile(file);
      }

      if (!extractedText.trim()) {
        throw new Error('ファイルからテキストを抽出できませんでした。空のファイルであるか、OCR処理されていない画像PDFの可能性があります。');
      }

      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const charCount = extractedText.length;
      const snippet = extractedText.slice(0, 200).replace(/\n+/g, ' ') + '...';

      // Switch to edit form with extracted content prefilled
      setFormTitle(`📄 ${cleanTitle}`);
      setFormCategory('custom');
      setFormContent(extractedText);
      setFormSummary(`【ファイル取込】${file.name}（${(file.size / 1024).toFixed(1)} KB, 約${charCount.toLocaleString()}文字）\n要約: ${snippet}`);
      setFormTags(isPdf ? 'PDF取込, ドキュメント, ナレッジ' : 'ファイル取込, ナレッジ');
      setFormSourceFileName(file.name);
      setFormSourceType(isPdf ? 'pdf' : 'file');
      setEditingItem(null);
      setIsCreating(true);

      setUploadSuccess(`「${file.name}」の読み込みが完了しました！（約${charCount.toLocaleString()}文字）内容を確認・保存してください。`);
      setActiveTab('edit');
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'ファイルの読み込み中にエラーが発生しました。');
    } finally {
      setIsExtracting(false);
      setExtractionProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Export all knowledge as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(knowledgeList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ai-orchestrator-knowledge-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import knowledge JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with current knowledge
          const existingIds = new Set(knowledgeList.map(k => k.id));
          const newItems = [...knowledgeList];
          parsed.forEach(p => {
            if (p.id && p.title && p.content) {
              if (existingIds.has(p.id)) {
                const idx = newItems.findIndex(k => k.id === p.id);
                newItems[idx] = p;
              } else {
                newItems.push(p);
              }
            }
          });
          onResetKnowledge(newItems);
          alert(`${parsed.length}件のナレッジをインポート・更新しました。`);
        } else {
          alert('有効なナレッジJSON形式ではありません。');
        }
      } catch (err) {
        alert('JSONファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">ナレッジベース & ファイル取り込み管理</h3>
            <p className="text-xs text-gray-400">
              PDF・ドキュメント・独自ノウハウを蓄積し、AIプロンプトの参照知識として自在に活用
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'upload'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700'
            }`}
          >
            <span>📥</span>
            <span>PDF/ファイル取込</span>
          </button>

          <button
            onClick={handleStartCreate}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'edit' && isCreating
                ? 'bg-blue-600 text-white'
                : 'bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700'
            }`}
          >
            <span>➕</span>
            <span>新規ナレッジ作成</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-750'
            }`}
          >
            ナレッジ一覧 ({knowledgeList.length})
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'upload' && (
        <div className="p-6 bg-gray-800/70 border border-purple-700/50 rounded-xl space-y-5">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-purple-950/80 border border-purple-600 rounded-full text-2xl mb-1">
              📄
            </div>
            <h4 className="text-base font-bold text-white">PDF・テキスト・ドキュメントを取り込む</h4>
            <p className="text-xs text-gray-300 max-w-xl mx-auto">
              手持ちのPDFマニュアル、レポート、書籍要約、企画書、ノウハウ記事（.pdf, .txt, .md, .csv, .json）を読み込んで、AIが参照できるナレッジとしてワンクリック登録します。
            </p>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-purple-500/60 hover:border-purple-400 bg-gray-850/80 hover:bg-purple-950/20 rounded-xl p-8 text-center transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => handleFileUpload(e.target.files)}
              accept=".pdf,.txt,.md,.markdown,.json,.csv,.text"
              className="hidden"
            />
            
            {isExtracting ? (
              <div className="space-y-3">
                <div className="inline-block animate-spin text-3xl text-purple-400">⏳</div>
                <p className="text-sm font-semibold text-purple-300">ファイルを高速解析中...</p>
                {extractionProgress && (
                  <p className="text-xs text-gray-400 font-mono">
                    ページ処理中: {extractionProgress.current} / {extractionProgress.total} ページ
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl group-hover:scale-110 transition-transform">📂</div>
                <p className="text-sm font-bold text-white">
                  クリックしてファイルを選択、またはここにドラッグ＆ドロップ
                </p>
                <p className="text-xs text-gray-400">
                  対応形式: <span className="text-purple-300 font-mono">PDF (.pdf), テキスト (.txt), Markdown (.md), JSON, CSV</span>
                </p>
                <p className="text-[11px] text-gray-500">
                  ※ ブラウザ内完結のローカル解析なので機密データも外部サーバーに転送されず安全です。
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-3 bg-red-950/70 border border-red-700 text-red-200 text-xs rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs rounded-lg flex items-center gap-2">
              <span>✅</span>
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-700">
            <span>登録済ナレッジ総数: {knowledgeList.length} 件</span>
            <button
              onClick={() => setActiveTab('list')}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              ナレッジ一覧に戻る →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <form onSubmit={handleSaveForm} className="space-y-4 bg-gray-800/80 p-5 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isCreating ? '➕ 新規ナレッジの登録' : '✏️ ナレッジの編集'}</span>
              {formSourceFileName && (
                <span className="text-[11px] font-normal px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded">
                  元ファイル: {formSourceFileName}
                </span>
              )}
            </h4>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="text-xs text-gray-400 hover:text-white"
            >
              キャンセル
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                ナレッジ名・タイトル <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="例: 📘 BtoB向け高単価リード獲得の完全設計マニュアル"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                カテゴリ分類
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {KNOWLEDGE_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              タグ (カンマ区切り)
            </label>
            <input
              type="text"
              value={formTags}
              onChange={e => setFormTags(e.target.value)}
              placeholder="マーケティング, Note, SEO, 心理学, PDF取込"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              概要・要約（プロンプト選択時のプレビューや簡易指示として表示）
            </label>
            <textarea
              value={formSummary}
              onChange={e => setFormSummary(e.target.value)}
              rows={2}
              placeholder="このナレッジの要点や適用場面を簡潔に記載..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Full Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-300">
                ナレッジ本文・詳細ノウハウ（AIがプロンプト実行時に参照する知識） <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-gray-400 font-mono">
                文字数: {formContent.length.toLocaleString()} 文字
              </span>
            </div>
            <textarea
              value={formContent}
              onChange={e => setFormContent(e.target.value)}
              rows={12}
              placeholder="ナレッジの詳細テキスト、ステップ、理論、ノウハウ、PDFから抽出した内容などを貼り付けまたは編集..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>📄 別のファイルから読み直す</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-900/40"
              >
                💾 ナレッジを保存
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-wrap gap-2 items-center justify-between bg-gray-800/60 p-3 rounded-xl border border-gray-700/80">
            {/* Search Input */}
            <div className="relative flex-grow min-w-[200px]">
              <span className="absolute left-3 top-2.5 text-gray-400 text-xs">{ICONS.search}</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ナレッジを検索 (キーワード・タグ・本文)..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-gray-500 hover:text-gray-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-xs text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {KNOWLEDGE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags cloud */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-gray-400 font-semibold">タグ:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  selectedTag === null
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                すべて
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Knowledge Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="md:col-span-2 text-center py-10 bg-gray-800/40 rounded-xl border border-gray-800 text-gray-500 space-y-2">
                <p className="text-2xl">🔍</p>
                <p className="text-sm font-semibold text-gray-400">該当するナレッジが見つかりませんでした</p>
                <p className="text-xs text-gray-500">
                  上の「PDF/ファイル取込」または「新規ナレッジ作成」から追加できます。
                </p>
              </div>
            ) : (
              filteredList.map(item => {
                const isSelected = selectedKnowledgeId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 bg-gray-800/70 hover:bg-gray-800 ${
                      isSelected
                        ? 'border-blue-500 ring-1 ring-blue-500 shadow-md shadow-blue-900/30'
                        : 'border-gray-700/80 hover:border-gray-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-sm text-white leading-snug flex items-center gap-1.5">
                          {item.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold whitespace-nowrap ${
                            item.sourceType === 'pdf'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : item.sourceType === 'preset'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {item.sourceType === 'pdf'
                            ? 'PDF取込'
                            : item.sourceType === 'preset'
                            ? 'プリセット'
                            : item.sourceType === 'file'
                            ? 'ファイル取込'
                            : 'カスタム'}
                        </span>
                      </div>

                      {item.summary && (
                        <p className="text-xs text-gray-300 line-clamp-2 mb-2 leading-relaxed">
                          {item.summary}
                        </p>
                      )}

                      <div className="text-[11px] text-gray-400 font-mono bg-gray-900/60 p-2 rounded border border-gray-800 line-clamp-3 leading-relaxed mb-2">
                        {item.content}
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/60 text-xs">
                      <span className="text-[10px] text-gray-500 font-mono">
                        約{item.content.length.toLocaleString()}文字
                      </span>

                      <div className="flex items-center gap-1.5">
                        {onSelectKnowledge && (
                          <button
                            onClick={() => onSelectKnowledge(item.id)}
                            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-300'
                            }`}
                          >
                            {isSelected ? '✓ 選択中' : '選択'}
                          </button>
                        )}

                        <button
                          onClick={() => handleCloneItem(item)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-650 text-gray-300 hover:text-white rounded text-xs transition-colors"
                          title="複製して編集"
                        >
                          複製
                        </button>

                        <button
                          onClick={() => handleStartEdit(item)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-650 text-gray-300 hover:text-white rounded text-xs transition-colors"
                          title="編集"
                        >
                          編集
                        </button>

                        {!item.isPreset && (
                          <button
                            onClick={() => {
                              if (confirm(`ナレッジ「${item.title}」を削除してもよろしいですか？`)) {
                                onDeleteKnowledge(item.id);
                              }
                            }}
                            className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                            title="削除"
                          >
                            {ICONS.trash}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Backup / Restore / Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportJSON}
                className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
              >
                <span>💾 ナレッジ全体をJSONエクスポート (バックアップ)</span>
              </button>

              <label className="text-purple-400 hover:text-purple-300 underline cursor-pointer flex items-center gap-1">
                <span>📂 JSONインポート</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm('ナレッジベースを初期プリセット状態に復元しますか？（追加したカスタムナレッジがリセットされます）')) {
                  const def = resetKnowledgeToDefault();
                  onResetKnowledge(def);
                }
              }}
              className="text-gray-500 hover:text-red-400 text-[11px]"
            >
              初期状態にリセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
