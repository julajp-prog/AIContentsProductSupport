import React from 'react';
import { EXPERT_DIMENSIONS } from '../services/hyperExpertService';

export const HyperExpertGuide: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300 text-xs sm:text-sm leading-relaxed p-1">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-gray-900 border border-indigo-500/50 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔮</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              超高次元エキスパート（PATH COGNITIVE OS）
            </h2>
            <p className="text-xs text-indigo-300 font-mono mt-0.5">
              道（PATH）× 統合執事（Integrated Butler）× 専門Master体系 × 時空間拘束マトリクス
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
          単なる「何でも屋の使い捨てAIエージェント」を超え、思考・所作・型の最高位に君臨する
          <strong className="text-indigo-200">【認知OS】</strong>です。
          「ロードマッピング」「ファネル検討」「プロモ」「contents化」「企画」の専門Master群を、
          三相三層・9マスマンダラート・易経・タロットパス・ウエルスダイナミクスと共鳴させ、
          <strong className="text-amber-300">「部分適用・連動・超次元全解放」</strong>で出力クオリティを次元上昇させます。
        </p>
      </div>

      {/* 1. Paradigm Shift: From Disposable Agent to PATH OS */}
      <div className="bg-gray-850/80 p-4 rounded-xl border border-gray-750 space-y-3">
        <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2 border-b border-gray-750 pb-2">
          <span>🏛️</span> 1. なぜ「Agent」ではなく「道（PATH）・所作・型・Master」なのか？
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          現在のAI Agent開発は「Skillを増やしてツールを呼ぶ」方向に進んでいますが、Skillが100個増えても
          「今どの状況でどの型を適用し、どう習熟し、いつ破り、他領域と融合させるか」という
          <strong className="text-white">【上位の認知OS（道・PATH）】</strong>がなければ、コンテキストの肥大化と凡庸な回答に陥ります。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-gray-900/90 p-3 rounded-lg border border-gray-800">
            <span className="text-rose-400 font-bold block mb-1">❌ 従来の使い捨てAgent</span>
            <ul className="space-y-1 text-gray-400 list-disc list-inside">
              <li>何でも屋・万能メイド的（浅く広く）</li>
              <li>場当たり的なプロンプトの継ぎ接ぎ</li>
              <li>領域間の壁（ロードマップとプロモが断絶）</li>
              <li>「所作・前段階の場づくり」の欠如</li>
            </ul>
          </div>
          <div className="bg-gray-900/90 p-3 rounded-lg border border-indigo-600/50 bg-gradient-to-br from-gray-900 to-indigo-950/30">
            <span className="text-indigo-300 font-bold block mb-1">✨ 超高次元PATH OS & 統合執事</span>
            <ul className="space-y-1 text-gray-200 list-disc list-inside">
              <li>統合執事（全体の状況把握・資源編成）</li>
              <li>専門Master（研ぎ澄まされた所作・規律・美学）</li>
              <li>領域横断リンク（Cross-Domain Synthesis）</li>
              <li>三相三層・9マス時空間拘束による多重展開</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Five Expert Dimensions */}
      <div className="bg-gray-850/80 p-4 rounded-xl border border-gray-750 space-y-3">
        <h3 className="text-base font-bold text-purple-300 flex items-center gap-2 border-b border-gray-750 pb-2">
          <span>⚡</span> 2. 5大専門Master体系（部分適用・連動・解放が可能）
        </h3>
        <p className="text-xs text-gray-400">
          プロンプトエディター上で、あなたの目的（例: 「企画とコンテンツ化だけ強化」「全5領域を全解放」）に合わせて
          個別にON/OFF・連動が可能です。
        </p>

        <div className="space-y-2.5 pt-1">
          {EXPERT_DIMENSIONS.map(dim => (
            <div
              key={dim.id}
              className="p-3 bg-gray-900/80 rounded-lg border border-gray-750 hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{dim.symbol}</span>
                  <span className="font-bold text-indigo-200 text-xs sm:text-sm">{dim.title}</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  {dim.domain}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed pl-6">
                {dim.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pl-6 pt-2">
                {dim.metaLenses.map(lens => (
                  <span
                    key={lens}
                    className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60"
                  >
                    ✦ {lens}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Multi-Dimensional Lens Matrix */}
      <div className="bg-gray-850/80 p-4 rounded-xl border border-gray-750 space-y-3">
        <h3 className="text-base font-bold text-amber-300 flex items-center gap-2 border-b border-gray-750 pb-2">
          <span>🪐</span> 3. 超根源メタ観測レンズ（Multi-Dimensional Lens Matrix）
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-gray-900/90 p-3 rounded-lg border border-gray-800 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>🔺</span>
              <span>三相 × 三層（Tri-Phase × Tri-Layer）</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <strong>三相:</strong> 現象相（売上・数字）/ 関係相（顧客・コミュニティ共鳴）/ 超越相（理念・世界観）<br/>
              <strong>三層:</strong> 顕在層（施策・プロンプト）/ 潜在層（心理・エネルギー）/ 根源層（宿命・アーキテクチャ）
            </p>
          </div>

          <div className="bg-gray-900/90 p-3 rounded-lg border border-gray-800 space-y-1.5">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>🗺️</span>
              <span>9マス時空間拘束（Spatial-Temporal Matrix）</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              マンダラートを単なる発想法ではなく「空間軸（媒体）× 時間軸（フェーズ）× 状態軸（成熟度）」の座標系として拘束。
              「今どの状態で、どの場所で、どの方向へ動くか」を厳密に規定。
            </p>
          </div>

          <div className="bg-gray-900/90 p-3 rounded-lg border border-gray-800 space-y-1.5">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <span>🔮</span>
              <span>易経 × タロット × ウエルスダイナミクス</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <strong>易経:</strong> 局面の推移・兆候の察知。<br/>
              <strong>タロットパス:</strong> 愚者から世界へ至る魂の通過儀礼・元型。<br/>
              <strong>ウエルス:</strong> クリエイター・スター・サポーター等の役割・エネルギー最適配置。
            </p>
          </div>
        </div>
      </div>

      {/* 4. Shu-Ha-Ri (Resonance Levels) */}
      <div className="bg-gray-850/80 p-4 rounded-xl border border-gray-750 space-y-3">
        <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2 border-b border-gray-750 pb-2">
          <span>🥋</span> 4. 守・破・離（共鳴・深化レベル）の実践運用
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-lg space-y-1">
            <div className="font-bold text-emerald-300 text-sm">守 (型再現)</div>
            <p className="text-[11px] text-gray-300">
              基本所作・王道のフレームワークを寸分違わず再現。まずは破綻のない堅実なビジネス設計や実務計画を作りたい時に最適。
            </p>
          </div>

          <div className="bg-purple-950/40 border border-purple-500/40 p-3 rounded-lg space-y-1">
            <div className="font-bold text-purple-300 text-sm">破 (連動変形) - 推奨</div>
            <p className="text-[11px] text-gray-300">
              複数のExpert（ロードマップとプロモ、ファネルとコンテンツ）を交差させ、領域横断リンクによる創発的シナジーを生み出す。
            </p>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-lg space-y-1">
            <div className="font-bold text-amber-300 text-sm">離 (超次元全解放)</div>
            <p className="text-[11px] text-gray-300">
              三相三層・9マス時空間・易経・タロットパス・全5大Masterを全方位で同時解放。常識を突き抜けた唯一無二の神話的体系を顕現。
            </p>
          </div>
        </div>
      </div>

      {/* 5. Quick Usage Guide in the App */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2">
          <span>💡</span> アプリでの使いかた（ワンクリック操作）:
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed">
          <li><strong>プロンプトエディター上部の「🔮 超高次元エキスパート」トグルをON</strong>にします。</li>
          <li>急ぎで最高出力を得たい場合は<strong>「⚡ 超次元全解放(離)」</strong>ボタンをクリック。</li>
          <li>特定の領域（例：企画とコンテンツ化のみ）に集中したい場合は、5大Masterのカードをクリックして<strong>部分適用</strong>を切り替えます。</li>
          <li>「独自の超次元重点拘束」を開き、「特にオラクルカード印刷仕様とAmazon KDPペーパーバックを最重要視」などの個別規律を追記することも可能です。</li>
          <li>そのまま「プロンプト実行」を押すと、GeminiやローカルLLMへ自動的に高次元メタプロンプトが合成されて送られます。</li>
        </ol>
      </div>
    </div>
  );
};
