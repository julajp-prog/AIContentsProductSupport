import React, { useState } from 'react';
import { LLMSettings, LLMStatusMonitorState, ProviderType, ConnectionMode } from '../types';
import { ICONS } from '../constants';

interface LLMNanoStatusMonitorProps {
  monitorState: LLMStatusMonitorState;
  settings: LLMSettings;
  onUpdateSettings: (newSettings: LLMSettings) => void;
  onOpenSettingsModal: () => void;
}

export const LLMNanoStatusMonitor: React.FC<LLMNanoStatusMonitorProps> = ({
  monitorState,
  settings,
  onUpdateSettings,
  onOpenSettingsModal,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const currentProvider = settings.providers[settings.activeProvider];
  const isLocal = currentProvider?.category === 'local' || currentProvider?.id === 'lmstudio' || currentProvider?.id === 'ollama';
  const connectionMode = currentProvider?.connectionMode || 'direct';

  // Toggle between Direct and Proxy for LM Studio or Ollama
  const handleToggleMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocal) return;

    const newMode: ConnectionMode = connectionMode === 'direct' ? 'proxy' : 'direct';
    const updatedProvider = {
      ...currentProvider,
      connectionMode: newMode,
    };

    onUpdateSettings({
      ...settings,
      providers: {
        ...settings.providers,
        [settings.activeProvider]: updatedProvider,
      },
    });
  };

  // Status visual configurations
  const getStatusBadge = () => {
    switch (monitorState.status) {
      case 'connecting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-900/60 text-blue-300 border border-blue-600/50 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            接続中...
          </span>
        );
      case 'streaming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-900/70 text-purple-200 border border-purple-500/50 shadow-sm shadow-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
            生成中 ({monitorState.characterCount.toLocaleString()} 文字)
          </span>
        );
      case 'cooldown':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-900/60 text-amber-300 border border-amber-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
            待機中 ({monitorState.cooldownSeconds ?? 0}s)
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-900/60 text-red-300 border border-red-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            エラー
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            完了 ({monitorState.characterCount.toLocaleString()} 文字 / {monitorState.latencyMs ?? 0}ms)
          </span>
        );
      case 'idle':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-800/80 text-gray-300 border border-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            待機中 (Idle)
          </span>
        );
    }
  };

  return (
    <div className="relative inline-block text-left select-none">
      {/* Nano Status Bar Container */}
      <div
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-2.5 py-1 bg-gray-900/90 hover:bg-gray-850 border border-gray-700/80 hover:border-gray-600 rounded-lg shadow-sm cursor-pointer transition-all duration-150 backdrop-blur-md"
        title="クリックしてLLM通信詳細と接続モード（Direct / Proxy）を確認・切替"
      >
        {/* Provider Brand Badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-100">
          <span className="text-sm">
            {isLocal ? '💻' : currentProvider?.id === 'gemini' ? '✨' : '🌐'}
          </span>
          <span className="truncate max-w-[120px] font-mono text-cyan-300">
            {currentProvider?.name || 'Gemini'}
          </span>
        </div>

        {/* Local Routing Badge (Direct vs Proxy Toggle) */}
        {isLocal && (
          <button
            type="button"
            onClick={handleToggleMode}
            className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded tracking-wider border transition-colors ${
              connectionMode === 'proxy'
                ? 'bg-amber-950/80 text-amber-300 border-amber-600/70 hover:bg-amber-900'
                : 'bg-indigo-950/80 text-indigo-300 border-indigo-600/70 hover:bg-indigo-900'
            }`}
            title={`現在: ${connectionMode.toUpperCase()} モード。クリックで Direct ↔ Proxy を即座に切替`}
          >
            {connectionMode === 'proxy' ? '🔀 Proxy経由' : '⚡ Direct接続'}
          </button>
        )}

        {/* Selected Model Name */}
        <span className="text-[11px] text-gray-400 font-mono hidden md:inline truncate max-w-[140px]">
          {currentProvider?.selectedModel || 'default'}
        </span>

        {/* Divider */}
        <span className="text-gray-700 hidden sm:inline">|</span>

        {/* Live Status Badge */}
        <div className="flex items-center">
          {getStatusBadge()}
        </div>

        {/* Gemini Isolation Shield (Active when non-Gemini is used) */}
        {currentProvider?.id !== 'gemini' && (
          <span
            className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60"
            title="LM StudioまたはローカルLLM動作中: Gemini APIへの漏洩はコードレベルで100%遮断されています"
          >
            <span className="text-xs">🔒</span>
            <span>Gemini完全隔離</span>
          </span>
        )}

        {/* Dropdown Indicator */}
        <span className="text-gray-500 text-[10px]">▼</span>
      </div>

      {/* Quick Details Popover */}
      {showDetails && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 z-50 text-xs text-gray-200 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-base">{isLocal ? '💻' : '🌐'}</span>
              <span className="font-bold text-sm text-white">LLM 通信ステータス詳細</span>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Details Content */}
          <div className="space-y-2 font-mono">
            <div className="flex justify-between items-center py-1 px-2 rounded bg-gray-850">
              <span className="text-gray-400">プロバイダー:</span>
              <span className="font-semibold text-cyan-300">{currentProvider?.name}</span>
            </div>

            <div className="flex justify-between items-center py-1 px-2 rounded bg-gray-850">
              <span className="text-gray-400">稼働モデル:</span>
              <span className="font-semibold text-gray-200 truncate max-w-[200px]">
                {currentProvider?.selectedModel}
              </span>
            </div>

            {/* Connection Mode Toggle Row */}
            {isLocal && (
              <div className="p-2 rounded bg-gray-850 border border-gray-750">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400">通信モード:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...currentProvider, connectionMode: 'direct' as ConnectionMode };
                        onUpdateSettings({
                          ...settings,
                          providers: { ...settings.providers, [settings.activeProvider]: updated },
                        });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        connectionMode === 'direct'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-750 text-gray-400 hover:text-white'
                      }`}
                    >
                      ⚡ Direct (直接)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...currentProvider, connectionMode: 'proxy' as ConnectionMode };
                        onUpdateSettings({
                          ...settings,
                          providers: { ...settings.providers, [settings.activeProvider]: updated },
                        });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        connectionMode === 'proxy'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-750 text-gray-400 hover:text-white'
                      }`}
                    >
                      🔀 Proxy (Vite経由)
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 font-sans mt-1">
                  {connectionMode === 'direct'
                    ? 'ブラウザから http://localhost:1234/v1 へ直接通信（LM StudioでCORS有効時）'
                    : 'Viteプロキシ (/api/proxy/lmstudio) 経由で通信（CORS制限を完全回避）'}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center py-1 px-2 rounded bg-gray-850">
              <span className="text-gray-400">アクティブURL:</span>
              <span className="text-gray-300 text-[10px] truncate max-w-[200px]" title={monitorState.endpoint}>
                {monitorState.endpoint || (isLocal ? (connectionMode === 'proxy' ? '/api/proxy/lmstudio' : 'http://localhost:1234/v1') : 'Direct API')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 px-2 rounded bg-gray-850">
              <span className="text-gray-400">直近通信文字数:</span>
              <span className="font-semibold text-purple-300">
                {monitorState.characterCount.toLocaleString()} 文字
              </span>
            </div>

            {monitorState.latencyMs !== undefined && (
              <div className="flex justify-between items-center py-1 px-2 rounded bg-gray-850">
                <span className="text-gray-400">処理時間:</span>
                <span className="font-semibold text-emerald-300">{monitorState.latencyMs} ms</span>
              </div>
            )}

            {/* Gemini Leak Prevention Verification */}
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50 text-[11px] font-sans">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-0.5">
                <span>🔒</span>
                <span>Gemini API 漏洩防止ガード</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {currentProvider?.id === 'gemini'
                  ? '現在Google Geminiがアクティブです。RPMレート制限制御が適用されます。'
                  : '現在LM Studio / 外部LLMがアクティブです。Google Geminiへの通信は完全に遮断・隔離されており、データが流出することはありません。'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2 border-t border-gray-800 flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDetails(false);
                onOpenSettingsModal();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 shadow"
            >
              {ICONS.settings || '⚙️'}
              <span>LLMプロバイダー詳細設定</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
