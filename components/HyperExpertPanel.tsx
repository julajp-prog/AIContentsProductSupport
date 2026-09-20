import React, { useState } from 'react';
import { HyperExpertSettings, ExpertDimensionId, ExpertResonanceLevel } from '../types';
import { EXPERT_DIMENSIONS } from '../services/hyperExpertService';

interface HyperExpertPanelProps {
  settings: HyperExpertSettings;
  onUpdateSettings: (newSettings: HyperExpertSettings) => void;
  isCompact?: boolean;
}

export const HyperExpertPanel: React.FC<HyperExpertPanelProps> = ({
  settings,
  onUpdateSettings,
  isCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false);

  const activeCount = Object.values(settings.activeDimensions).filter(Boolean).length;
  const totalCount = EXPERT_DIMENSIONS.length;

  const handleToggleGlobal = () => {
    onUpdateSettings({
      ...settings,
      isEnabled: !settings.isEnabled,
    });
  };

  const handleToggleDimension = (dimId: ExpertDimensionId) => {
    onUpdateSettings({
      ...settings,
      activeDimensions: {
        ...settings.activeDimensions,
        [dimId]: !settings.activeDimensions[dimId],
      },
    });
  };

  const handleSetLevel = (level: ExpertResonanceLevel) => {
    onUpdateSettings({
      ...settings,
      resonanceLevel: level,
    });
  };

  const handleAllUnlock = () => {
    onUpdateSettings({
      ...settings,
      isEnabled: true,
      resonanceLevel: 'ri',
      activeDimensions: {
        roadmap: true,
        funnel: true,
        promotion: true,
        content: true,
        concept: true,
      },
    });
  };

  const handleSmartLinking = () => {
    onUpdateSettings({
      ...settings,
      isEnabled: true,
      resonanceLevel: 'ha',
      activeDimensions: {
        roadmap: true,
        funnel: true,
        promotion: true,
        content: true,
        concept: true,
      },
    });
  };

  const handleReset = () => {
    onUpdateSettings({
      ...settings,
      activeDimensions: {
        roadmap: false,
        funnel: false,
        promotion: false,
        content: false,
        concept: false,
      },
    });
  };

  const resonanceLevelInfo = {
    shu: { label: '守（型再現）', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50', desc: '基本フレームワークの所作と規律を堅牢に遵守' },
    ha: { label: '破（連動変形）', color: 'text-purple-400 bg-purple-950/60 border-purple-500/50', desc: '複数Expertの越境リンクと創発的シナジーを最大化' },
    ri: { label: '離（超次元全解放）', color: 'text-amber-400 bg-amber-950/60 border-amber-500/50', desc: '三相三層・9マス時空間・易経・タロット照応を完全起動' },
  }[settings.resonanceLevel];

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-indigo-950/30 to-purple-950/30 border border-indigo-500/40 rounded-lg overflow-hidden shadow-lg transition-all duration-200">
      {/* Mini Bar / Toggle Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-900/90 border-b border-indigo-500/20 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleGlobal}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.isEnabled ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-700'
            }`}
            title={settings.isEnabled ? '超高次元エキスパートモード: ON' : '超高次元エキスパートモード: OFF'}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.isEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <span className="text-base">🔮</span>
            <span className="text-xs font-bold text-gray-200 hover:text-indigo-300 transition-colors">
              超高次元エキスパート <span className="text-[10px] text-indigo-400 font-mono font-normal tracking-wide">[PATH COGNITIVE OS]</span>
            </span>
          </div>

          {settings.isEnabled ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${resonanceLevelInfo.color}`}>
                {resonanceLevelInfo.label}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 rounded">
                部分適用: {activeCount}/{totalCount}解放
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-500 font-medium">
              OFF（標準モード）
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {settings.isEnabled && (
            <>
              <button
                type="button"
                onClick={handleSmartLinking}
                className="px-2 py-0.5 text-[10px] font-medium bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/50 rounded transition-colors"
                title="5大エキスパート全連動・破モードを起動"
              >
                🔄 連動(破)
              </button>
              <button
                type="button"
                onClick={handleAllUnlock}
                className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded shadow-sm transition-all"
                title="三相三層・9マス時空間・全Expertを完全解放"
              >
                ⚡ 超次元全解放(離)
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title={isOpen ? '折りたたむ' : '詳細パネルを展開'}
          >
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Controls Panel */}
      {isOpen && (
        <div className="p-3.5 space-y-3.5 bg-gray-900/95 text-xs">
          {/* Header Concept Statement */}
          <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-gray-300 leading-relaxed flex items-start gap-2">
            <span className="text-base text-indigo-400 flex-shrink-0">🏛️</span>
            <div>
              <strong className="text-indigo-200 font-semibold">道（PATH）× 統合執事（Integrated Butler）アーキテクチャ:</strong><br/>
              単なるプロンプトや使い捨てAgentではなく、「ロードマッピング」「ファネル検討」「プロモ」「contents化」「企画」の専門Master体系と三相三層・9マス時空間拘束を動的にオーケストレーションします。
            </div>
          </div>

          {/* Resonance Level (守・破・離) Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300 text-[11px]">共鳴・深化レベル（守破離）:</span>
              <span className="text-[10px] text-gray-400">{resonanceLevelInfo.desc}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['shu', 'ha', 'ri'] as ExpertResonanceLevel[]).map(lvl => {
                const info = {
                  shu: { label: '守 (型再現)', desc: '堅実な規律と所作' },
                  ha: { label: '破 (連動変形)', desc: '越境リンクとシナジー' },
                  ri: { label: '離 (超次元全解放)', desc: '三相三層×9マス時空間' },
                }[lvl];
                const isSelected = settings.resonanceLevel === lvl;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSetLevel(lvl)}
                    className={`px-2.5 py-1.5 rounded border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-900/80 border-indigo-400 text-white font-bold shadow-md ring-1 ring-indigo-400'
                        : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-750'
                    }`}
                  >
                    <div className="text-xs font-semibold">{info.label}</div>
                    <div className="text-[10px] text-gray-400 font-normal">{info.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 Expert Dimensions (部分適用・トグルスイッチ) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300 text-[11px]">専門Master群の部分適用・解放（5大ドメイン）:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[10px] text-gray-400 hover:text-rose-300 underline"
                >
                  一括OFF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const allTrue = EXPERT_DIMENSIONS.reduce((acc, d) => ({ ...acc, [d.id]: true }), {});
                    onUpdateSettings({ ...settings, activeDimensions: allTrue as any });
                  }}
                  className="text-[10px] text-indigo-300 hover:text-indigo-200 underline"
                >
                  一括ON
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {EXPERT_DIMENSIONS.map(dim => {
                const isActive = settings.activeDimensions[dim.id];
                return (
                  <div
                    key={dim.id}
                    onClick={() => handleToggleDimension(dim.id)}
                    className={`cursor-pointer p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2.5 ${
                      isActive
                        ? 'bg-gray-800/90 border-indigo-500/70 shadow-sm'
                        : 'bg-gray-900/60 border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{dim.symbol}</span>
                        <span className={`font-bold text-xs ${isActive ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {dim.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">({dim.domain})</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-snug line-clamp-2">
                        {dim.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {dim.metaLenses.map(lens => (
                          <span
                            key={lens}
                            className="px-1.5 py-0.2 text-[9px] bg-gray-900 text-indigo-300/80 rounded border border-gray-700/60"
                          >
                            #{lens}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                      >
                        {isActive ? '連動中' : '待機'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integrated Butler & Custom Constraint */}
          <div className="pt-2 border-t border-gray-800 flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-300">
              <input
                type="checkbox"
                checked={settings.butlerPersonaEnabled}
                onChange={e =>
                  onUpdateSettings({ ...settings, butlerPersonaEnabled: e.target.checked })
                }
                className="rounded bg-gray-800 border-gray-700 text-indigo-500 focus:ring-indigo-400 h-3.5 w-3.5"
              />
              <span>統合執事（Integrated Butler）による全体の認知・資源オーケストレーション</span>
            </label>

            <button
              type="button"
              onClick={() => setIsCustomPromptOpen(!isCustomPromptOpen)}
              className="text-[11px] text-indigo-300 hover:text-indigo-200 underline flex items-center gap-1"
            >
              <span>⚙️ 独自の超次元重点拘束プロンプト</span>
              <span>{isCustomPromptOpen ? '▲' : '▼'}</span>
            </button>
          </div>

          {isCustomPromptOpen && (
            <div className="p-2.5 bg-gray-950/80 rounded border border-indigo-500/30 space-y-1.5">
              <div className="text-[11px] text-gray-300 font-semibold">
                ユーザー指定の超次元重点拘束（カスタム追記指示）:
              </div>
              <textarea
                value={settings.customFocusPrompt || ''}
                onChange={e =>
                  onUpdateSettings({ ...settings, customFocusPrompt: e.target.value })
                }
                placeholder="例: 特にオラクルカードの印刷仕様（350dpi/CMYK/金縁）と、Amazon KDPペーパーバックでのオンデマンド紙書籍出版およびnoteでの共創プロセス連載を最重要視して回答せよ。"
                rows={2}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
