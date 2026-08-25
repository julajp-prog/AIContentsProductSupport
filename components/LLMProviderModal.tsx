import React, { useState, useEffect } from 'react';
import { LLMSettings, LLMProviderConfig, ProviderType, GeminiRateLimitSettings } from '../types';
import { testProviderConnection, ConnectionTestResult, getGeminiRecentRequestCount } from '../services/llmService';
import { ICONS } from '../constants';
import { Spinner } from './common/Spinner';

interface LLMProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LLMSettings;
  onUpdateSettings: (newSettings: LLMSettings) => void;
}

export const LLMProviderModal: React.FC<LLMProviderModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<ProviderType>(settings.activeProvider);
  const [localProviders, setLocalProviders] = useState<Record<ProviderType, LLMProviderConfig>>(settings.providers);
  const [localRateLimit, setLocalRateLimit] = useState<GeminiRateLimitSettings>(settings.geminiRateLimit);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [customModelInput, setCustomModelInput] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    setLocalProviders(settings.providers);
    setLocalRateLimit(settings.geminiRateLimit);
    setSelectedProviderId(settings.activeProvider);
  }, [settings]);

  if (!isOpen) return null;

  const currentProvider = localProviders[selectedProviderId];

  const handleUpdateCurrentProvider = (updates: Partial<LLMProviderConfig>) => {
    setLocalProviders(prev => ({
      ...prev,
      [selectedProviderId]: {
        ...prev[selectedProviderId],
        ...updates,
      },
    }));
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    const result = await testProviderConnection(currentProvider);
    setIsTesting(false);
    setTestResult(result);

    // If test returned models, merge them with available models
    const updatedAvailableModels = Array.from(
      new Set([...(result.models || []), ...currentProvider.availableModels])
    );

    const updatedConfig: LLMProviderConfig = {
      ...currentProvider,
      availableModels: updatedAvailableModels,
      testStatus: result.success ? 'success' : 'error',
      testLatencyMs: result.latencyMs,
      testMessage: result.message,
      lastTestedAt: Date.now(),
      enabled: result.success ? true : currentProvider.enabled,
    };

    // If current selected model is not in list and we got models, set first
    if (result.success && result.models.length > 0 && !result.models.includes(currentProvider.selectedModel)) {
      updatedConfig.selectedModel = result.models[0];
    }

    setLocalProviders(prev => ({
      ...prev,
      [selectedProviderId]: updatedConfig,
    }));
  };

  const handleAddCustomModel = () => {
    if (!customModelInput.trim()) return;
    const modelName = customModelInput.trim();
    const updatedModels = Array.from(new Set([modelName, ...currentProvider.availableModels]));
    handleUpdateCurrentProvider({
      availableModels: updatedModels,
      selectedModel: modelName,
    });
    setCustomModelInput('');
  };

  const handleSaveAll = () => {
    const newSettings: LLMSettings = {
      activeProvider: selectedProviderId,
      providers: localProviders,
      geminiRateLimit: localRateLimit,
    };
    onUpdateSettings(newSettings);
    setSaveSuccessNotice('設定を正常に保存しました。');
    setTimeout(() => setSaveSuccessNotice(null), 2500);
  };

  const handleSetAsActive = (id: ProviderType) => {
    setSelectedProviderId(id);
    const newSettings: LLMSettings = {
      activeProvider: id,
      providers: localProviders,
      geminiRateLimit: localRateLimit,
    };
    onUpdateSettings(newSettings);
    setSaveSuccessNotice(`「${localProviders[id].name}」をデフォルトプロバイダーに設定しました。`);
    setTimeout(() => setSaveSuccessNotice(null), 2500);
  };

  const recentGeminiRequests = getGeminiRecentRequestCount();

  const providerCategories: Array<{ key: string; label: string; ids: ProviderType[] }> = [
    {
      key: 'cloud',
      label: '🌐 クラウド・主要API',
      ids: ['gemini', 'openrouter', 'groq', 'deepseek', 'openai', 'anthropic', 'github', 'huggingface'],
    },
    {
      key: 'local',
      label: '💻 PCローカルLLM / オンプレミス',
      ids: ['ollama', 'lmstudio', 'custom'],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-gray-200">
        
        {/* Header */}
        <div className="p-4 bg-gray-850 border-b border-gray-700 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl text-white shadow-md">
              {ICONS.cpu}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                LLMプロバイダー & ローカルPC連携設定
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  現在: {localProviders[settings.activeProvider]?.name || 'Gemini'}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Gemini無料枠Waitタイマー設定、OpenRouter、Ollama/LM Studio（ローカルPC）、Groq、DeepSeek等の接続＆モデル取得
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessNotice && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800 animate-pulse">
                {saveSuccessNotice}
              </span>
            )}
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all"
            >
              {ICONS.check}
              <span>設定を保存</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {ICONS.close}
            </button>
          </div>
        </div>

        {/* Modal Main Area: Left Sidebar (Provider Selector) + Right Content (Configuration) */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden min-h-0">
          
          {/* Left Provider List */}
          <div className="w-full md:w-72 bg-gray-950/70 border-b md:border-b-0 md:border-r border-gray-800 p-3 overflow-y-auto shrink-0 space-y-4">
            {providerCategories.map(category => (
              <div key={category.key}>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
                  {category.label}
                </h3>
                <div className="space-y-1">
                  {category.ids.map(id => {
                    const p = localProviders[id];
                    const isSelected = selectedProviderId === id;
                    const isActive = settings.activeProvider === id;

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedProviderId(id);
                          setTestResult(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-2 transition-all text-xs font-medium ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-bold'
                            : 'text-gray-300 hover:bg-gray-850 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Status Dot */}
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              id === 'gemini'
                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                : p.testStatus === 'success'
                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                : p.testStatus === 'error'
                                ? 'bg-rose-500'
                                : p.apiKey || p.id === 'ollama' || p.id === 'lmstudio'
                                ? 'bg-amber-400'
                                : 'bg-gray-600'
                            }`}
                          />
                          <span className="truncate">{p.name}</span>
                        </div>

                        {isActive && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            isSelected ? 'bg-blue-800 text-blue-100' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          }`}>
                            既定
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Provider Details & Settings */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gray-900 space-y-6">
            
            {/* Top Provider Title & Switcher */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">
                    {currentProvider.name}
                  </h3>
                  {settings.activeProvider === currentProvider.id ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700 font-semibold">
                      ⚡ 現在のプロンプト送信先
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetAsActive(currentProvider.id)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-emerald-700 text-gray-300 hover:text-white transition-colors border border-gray-700"
                    >
                      ✓ 既定の送信先に設定
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                  {currentProvider.description}
                </p>
              </div>

              {currentProvider.docsUrl && (
                <a
                  href={currentProvider.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  公式サイト / ドキュメント ↗
                </a>
              )}
            </div>

            {/* GEMINI SPECIFIC: RATE LIMIT & WAIT TIMER SETTINGS */}
            {currentProvider.id === 'gemini' && (
              <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-gray-850 p-5 rounded-2xl border border-blue-800/60 space-y-4 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Gemini 無料枠 Waitタイマー & レートリミット制御
                      </h4>
                      <p className="text-xs text-gray-400">
                        無料枠の「分間あたり最大連続オーダー（RPM: Requests Per Minute）」制限を超えないよう自動待機・制御します。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">直近1分間の送信回数:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      recentGeminiRequests >= localRateLimit.rpm
                        ? 'bg-rose-900/80 text-rose-300 border border-rose-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}>
                      {recentGeminiRequests} / {localRateLimit.rpm} RPM
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* RPM setting */}
                  <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-700/80">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-200">
                        最大連続オーダー数 (RPM)
                      </label>
                      <span className="text-xs font-extrabold text-blue-400">
                        {localRateLimit.rpm} 回 / 分
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={localRateLimit.rpm}
                      onChange={e =>
                        setLocalRateLimit(prev => ({
                          ...prev,
                          rpm: parseInt(e.target.value, 10),
                          cooldownSeconds: Math.ceil(60 / parseInt(e.target.value, 10)),
                        }))
                      }
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>1 (厳格セーフ)</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLocalRateLimit(prev => ({ ...prev, rpm: 15, cooldownSeconds: 4 }))
                        }
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        15 RPM (無料枠標準)
                      </button>
                      <span>60 (有料枠/高頻度)</span>
                    </div>
                  </div>

                  {/* Auto-Wait Setting */}
                  <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-700/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-200">
                          制限到達時の自動待機 (Auto-Wait)
                        </label>
                        <input
                          type="checkbox"
                          checked={localRateLimit.autoWait}
                          onChange={e =>
                            setLocalRateLimit(prev => ({
                              ...prev,
                              autoWait: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        有効にすると、分間上限に達した際にエラーにせず、次回実行可能枠まで自動で秒数カウントダウンして送信します。
                      </p>
                    </div>

                    <div className="text-[11px] text-blue-300 bg-blue-950/60 p-2 rounded-lg border border-blue-800/60 mt-2">
                      💡 推奨最小インターバル: 約 {localRateLimit.cooldownSeconds || 4} 秒 / 回
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API KEY & ENDPOINT INPUTS */}
            <div className="space-y-4">
              {/* Endpoint URL (For Ollama, LM Studio, Custom, OpenRouter) */}
              {currentProvider.id !== 'gemini' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      API エンドポイント / Base URL
                    </label>
                    <button
                      onClick={() =>
                        handleUpdateCurrentProvider({ baseUrl: currentProvider.defaultEndpoint })
                      }
                      className="text-[11px] text-gray-500 hover:text-gray-300 underline"
                    >
                      デフォルトに戻す ({currentProvider.defaultEndpoint})
                    </button>
                  </div>
                  <input
                    type="text"
                    value={currentProvider.baseUrl || ''}
                    onChange={e => handleUpdateCurrentProvider({ baseUrl: e.target.value })}
                    placeholder={currentProvider.defaultEndpoint}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {currentProvider.id === 'ollama' && (
                    <p className="text-[11px] text-amber-300/90 mt-1.5 leading-relaxed bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
                      💡 <strong>ローカルOllamaのCORS設定方法:</strong><br />
                      ブラウザからローカル接続するため、Ollama起動時にCORS許可が必要です。<br />
                      ・Mac/Linux: <code>OLLAMA_ORIGINS=&quot;*&quot; ollama serve</code><br />
                      ・Windows: システム環境変数に <code>OLLAMA_ORIGINS</code> = <code>*</code> を追加してOllamaを再起動
                    </p>
                  )}
                  {currentProvider.id === 'lmstudio' && (
                    <p className="text-[11px] text-cyan-300/90 mt-1.5 leading-relaxed bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/40">
                      💡 <strong>LM Studioの設定:</strong><br />
                      「Local Server」タブを開き、モデルをロードして「Start Server」を押してください。CORSが自動有効化されます。
                    </p>
                  )}
                </div>
              )}

              {/* API Key Input */}
              {currentProvider.id !== 'ollama' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      API キー / アクセストークン
                      {currentProvider.id === 'gemini' && (
                        <span className="text-gray-500 font-normal ml-1">
                          （空欄の場合は標準内蔵キーを使用）
                        </span>
                      )}
                      {currentProvider.id === 'lmstudio' && (
                        <span className="text-gray-500 font-normal ml-1">
                          （LM Studioは通常不要）
                        </span>
                      )}
                    </label>
                  </div>
                  <input
                    type="password"
                    value={currentProvider.apiKey || ''}
                    onChange={e => handleUpdateCurrentProvider({ apiKey: e.target.value })}
                    placeholder={
                      currentProvider.id === 'gemini'
                        ? '内蔵APIキーを使用中（カスタムキーがある場合のみ入力）'
                        : currentProvider.id === 'openrouter'
                        ? 'sk-or-v1-...'
                        : currentProvider.id === 'github'
                        ? 'ghp_... (GitHub Personal Access Token)'
                        : 'sk-...'
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Connection Test & Model Fetch Button Bar */}
              <div className="bg-gray-850 p-4 rounded-xl border border-gray-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🔌 接続テスト & 提供LLM一覧リスト取得</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    エンドポイントにPingを送信し、レイテンシ測定と利用可能なモデル一覧を動的取得します。
                  </p>
                </div>

                <button
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-950 flex items-center gap-2 transition-all shrink-0 disabled:opacity-50"
                >
                  {isTesting ? <Spinner /> : <span>⚡</span>}
                  <span>{isTesting ? '通信テスト中...' : '接続テスト & モデル取得'}</span>
                </button>
              </div>

              {/* Test Result Message Box */}
              {(testResult || currentProvider.testMessage) && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    (testResult?.success ?? currentProvider.testStatus === 'success')
                      ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-700/80 text-rose-200'
                  }`}
                >
                  <span className="text-base shrink-0">
                    {(testResult?.success ?? currentProvider.testStatus === 'success') ? '🟢' : '🔴'}
                  </span>
                  <div className="flex-grow">
                    <div className="font-bold">
                      {(testResult?.success ?? currentProvider.testStatus === 'success')
                        ? '接続テスト成功'
                        : '接続テスト失敗'}
                      {(testResult?.latencyMs || currentProvider.testLatencyMs) && (
                        <span className="ml-2 font-mono text-[11px] px-1.5 py-0.2 bg-black/40 rounded">
                          応答時間: {testResult?.latencyMs || currentProvider.testLatencyMs}ms
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 opacity-90">
                      {testResult?.message || currentProvider.testMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* MODEL SELECTION & CUSTOM MODEL ADDITION */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <span>🤖 使用モデルの選択</span>
                    <span className="text-[11px] text-blue-400 bg-blue-950 px-2 py-0.2 rounded-full border border-blue-800">
                      {currentProvider.availableModels.length} モデル登録中
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <select
                      value={currentProvider.selectedModel}
                      onChange={e => handleUpdateCurrentProvider({ selectedModel: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-sm text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    >
                      {currentProvider.availableModels.map(m => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add Custom Model */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customModelInput}
                      onChange={e => setCustomModelInput(e.target.value)}
                      placeholder="手動モデル名を追加..."
                      className="flex-grow bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                      onClick={handleAddCustomModel}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
                    >
                      追加
                    </button>
                  </div>
                </div>
              </div>

              {/* Parameters (Temperature & Max Tokens) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-850 p-3 rounded-xl border border-gray-750">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Temperature（創造性 / ランダム性）
                    </label>
                    <span className="text-xs font-mono text-blue-400 font-bold">
                      {currentProvider.temperature ?? 0.7}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={currentProvider.temperature ?? 0.7}
                    onChange={e =>
                      handleUpdateCurrentProvider({ temperature: parseFloat(e.target.value) })
                    }
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>0.0 (厳密・正確)</span>
                    <span>1.0 (創造的・拡散)</span>
                  </div>
                </div>

                <div className="bg-gray-850 p-3 rounded-xl border border-gray-750">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Max Tokens（最大出力長）
                    </label>
                    <span className="text-xs font-mono text-blue-400 font-bold">
                      {currentProvider.maxTokens ?? 4096}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={currentProvider.maxTokens ?? 4096}
                    onChange={e =>
                      handleUpdateCurrentProvider({ maxTokens: parseInt(e.target.value, 10) || 4096 })
                    }
                    min={256}
                    max={32768}
                    step={256}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
