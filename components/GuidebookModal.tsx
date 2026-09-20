import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { KnowledgeItem } from '../types';
import { KnowledgeManager } from './KnowledgeManager';
import { GitHubReadmeGuide } from './GitHubReadmeGuide';
import { HyperExpertGuide } from './HyperExpertGuide';
import { ICONS } from '../constants';

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeList: KnowledgeItem[];
  onSaveKnowledge: (item: KnowledgeItem) => void;
  onDeleteKnowledge: (id: string) => void;
  onResetKnowledge: (items: KnowledgeItem[]) => void;
  initialTab?: 'knowledgeBase' | 'hyperExpert' | 'localLlm' | 'creativePipeline' | 'techFunnel' | 'harmFunnel' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing';
}

const GuidebookSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`mb-8 ${className}`}>
    <h3 className="text-xl font-bold text-blue-400 mb-3 border-b-2 border-blue-500/30 pb-2">{title}</h3>
    <div className="text-gray-300 space-y-3 text-sm leading-relaxed">{children}</div>
  </div>
);

const AppUsageGuide: React.FC<{onClose: () => void; onGoToKnowledge: () => void}> = ({onClose, onGoToKnowledge}) => (
    <>
        <div className="text-center mb-8 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-extrabold text-white">🧠 あなたの「思考」、最強のAI参謀で「資産」に変えよう。</h2>
            <p className="mt-2 text-gray-400">アイデアの混沌から、収益化への最短ルートを創造する場所。</p>
        </div>

        <GuidebookSection title="🤔 こんな「悩み」を抱えていませんか？">
          <ul className="list-disc list-inside space-y-2">
            <li>🧠「頭の中にアイデアや蓄積したPDF資料はあるのに、どうAIと連携して形にすればいいか分からない…」</li>
            <li>🌪️「コンテンツ制作、SNS投稿、収益化…やることが多すぎて、何から手をつければいいか混乱している。」</li>
            <li>🤖「AIを使ってみたけど、単発の指示ばかり。もっと独自の資料やPDFを読み込ませて動かせないだろうか？」</li>
            <li>💸「毎日頑張っているのに、なかなか収益に繋がらない。自分のやっていることは正しいのだろうか？」</li>
          </ul>
          <p className="font-semibold text-white mt-4">もし一つでも当てはまるなら、このツールは<span className="text-yellow-300">あなたのためのもの</span>です。</p>
        </GuidebookSection>

        <GuidebookSection title="✨ AI Orchestratorがもたらす「革命」">
          <p>このツールは単なるプロンプト管理アプリではありません。あなたの<strong className="text-yellow-400">「思考」を「資産」に変え、「作業」を「収益化へのワークフロー」に昇華させる</strong>ための戦略的パートナーです。</p>
          
          <div className="mt-4 space-y-4">
            <p><strong>1. 特徴: 自由自在な「ナレッジベース & PDF・ファイル取り込み」</strong><br/>
            <span className="text-sm text-gray-400"><strong>効能:</strong> お手持ちのPDFレポート、マニュアル、過去の優良記事、独自ノウハウをファイルごと一括登録。AIがそれらを「参照知識」として理解し、社内専任アドバイザーのように精度の高い回答を導きます。</span></p>

            <p><strong>2. 特徴: 1つのプロンプトを4倍に活かす「実行モード」</strong><br/>
            <span className="text-sm text-gray-400"><strong>効能:</strong> 同じアイデアでも<strong className="text-purple-400">「リサーチ強化」「改善・洗練」「シミュレーション」</strong>など、AIに異なる役割を与えることで、アウトプットの質と量を飛躍的に向上させます。</span></p>

            <p><strong>3. 特徴: 自由自在な「マルチLLMプロバイダー & ローカルPC連携」</strong><br/>
            <span className="text-sm text-gray-400"><strong>効能:</strong> Gemini（無料枠用Waitタイマー付き）、OpenRouter（数百種）、Ollama/LM Studio（ローカルPC完全オフライン実行）、Groq（超高速LPU）、DeepSeek等をワンクリックで切り替え可能です。</span></p>

            <p><strong>4. 特徴: AIの人格と品質を劇的に高める「システムインストラクション」</strong><br/>
            <span className="text-sm text-gray-400"><strong>効能:</strong> 「Note専任プロエディター」「トップセールスコピーライター」「厳格な校閲者」などのプロフェッショナルな前提条件をAIに与え、プロ同等の出力精度を実現します。</span></p>
          </div>
        </GuidebookSection>
        
        <div className="flex flex-wrap justify-center gap-3 bg-gray-800 rounded-lg p-6 text-center">
            <button onClick={onGoToKnowledge} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-purple-500 transition-colors shadow-md">
                📚 ナレッジ・PDF取込を開く
            </button>
            <button onClick={onClose} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-500 transition-colors shadow-md">
                エディターへ進む 🚀
            </button>
        </div>
    </>
);

const LLMIntegrationGuide: React.FC = () => {
  return (
    <>
      <div className="text-center mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-extrabold text-white">⚡ マルチLLM & PCローカル連携完全ガイド</h2>
        <p className="mt-2 text-gray-400">Gemini無料枠タイマー、OpenRouter、PC上のOllama / LM Studioをフル活用する</p>
      </div>

      <GuidebookSection title="⏱️ 1. Google Gemini 無料枠用 Waitタイマーの仕組み">
        <p>
          Google Gemini の無料枠（Free Tier）には「<strong>1分間あたり最大15回リクエスト（15 RPM）</strong>」などのレート制限が設けられています。本アプリではこれらを自動管理する<strong>Waitタイマー</strong>を内蔵しています。
        </p>
        <div className="space-y-3 mt-3 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">・RPM設定 (1〜60):</span>
            <p className="text-xs text-gray-300">無料枠標準の15 RPMや、安全な5〜10 RPMを自由に指定できます。</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">・自動待機 (Auto-Wait):</span>
            <p className="text-xs text-gray-300">分間制限に達した場合にエラー終了せず、残り秒数をカウントダウン表示して、枠が空き次第自動でプロンプトを実行します。</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">・リアルタイムメーター:</span>
            <p className="text-xs text-gray-300">エディター画面右上に「直近の実行数 (例: 3/15 RPM)」が常時表示されます。</p>
          </div>
        </div>
      </GuidebookSection>

      <GuidebookSection title="💻 2. あなたのPCローカルLLM（Ollama / LM Studio）と繋ぐ">
        <p>
          クラウドAPIだけでなく、お使いのPCで動作している無料・無制限のローカルLLMとも直接通信できます。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {/* Ollama */}
          <div className="p-4 bg-gray-850 rounded-xl border border-gray-750 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span>🦙 Ollama の連携手順</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1.5">
              <li>PCで Ollama をインストール (<code>ollama run llama3.3</code> 等)</li>
              <li>ブラウザからのCORS通信を許可して起動:<br/>
                ・Mac/Linux: <code>OLLAMA_ORIGINS=&quot;*&quot; ollama serve</code><br/>
                ・Windows: 環境変数 <code>OLLAMA_ORIGINS</code> に <code>*</code> を追加
              </li>
              <li>アプリの「接続テスト & モデル取得」を押すと、ダウンロード済みモデルが一覧に自動反映されます。</li>
            </ol>
          </div>

          {/* LM Studio */}
          <div className="p-4 bg-gray-850 rounded-xl border border-gray-750 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span>🧪 LM Studio の連携手順</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1.5">
              <li>LM Studio を起動し、お好みのGGUFモデルをロード</li>
              <li>左メニュー「Local Server (↔)」タブを開く</li>
              <li>「Start Server」をクリック（デフォルトポート: <code>1234</code>）</li>
              <li>アプリの「接続テスト & モデル取得」を押すだけで即時接続完了！</li>
            </ol>
          </div>
        </div>
      </GuidebookSection>

      <GuidebookSection title="🌐 3. OpenRouter / Groq / DeepSeek / GitHub Models の活用">
        <div className="space-y-3 text-xs text-gray-300">
          <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700">
            <strong className="text-white text-sm">・OpenRouter:</strong> 単一のAPIキーで、DeepSeek R1/V3、Claude 3.7 Sonnet、Llama 3.3 70B、Qwen 2.5など最新の世界最高峰モデル群を包括的に利用可能。
          </div>
          <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700">
            <strong className="text-white text-sm">・Groq (超高速LPU):</strong> 秒速数百トークンの圧倒的スピードで、推敲やリサーチを瞬時に完了。
          </div>
          <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700">
            <strong className="text-white text-sm">・GitHub Models:</strong> GitHubのPersonal Access Token (PAT) を使ってAzure AI推論基盤のモデルをテスト。
          </div>
        </div>
      </GuidebookSection>
    </>
  );
};

const SystemInstructionGuide: React.FC = () => {
  return (
    <>
      <div className="text-center mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-extrabold text-white">⚡ システムインストラクション (System Instruction) 活用術</h2>
        <p className="mt-2 text-gray-400">プロの思考フレームワークをAIにインストールし、出力クオリティを次元上昇させる</p>
      </div>

      <GuidebookSection title="🎯 システムインストラクションとは？（通常のプロンプトとの違い）">
        <p>
          通常プロンプトが「今回の作業内容（タスク）」を指示するのに対し、<strong>システムインストラクション（システムプロンプト）は「AIの人格、思考の前提条件、制約ルール、出力トーン＆マナー」</strong>を規定します。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="p-4 bg-gray-800/80 rounded-xl border border-gray-700">
            <h4 className="font-bold text-amber-300 mb-1">❌ システム指示なし</h4>
            <p className="text-xs text-gray-400">一般的なAIの回答になり、当たり障りのない表現や、冗長な教科書的解説になりがち。</p>
          </div>
          <div className="p-4 bg-blue-950/40 rounded-xl border border-blue-700">
            <h4 className="font-bold text-blue-300 mb-1">✨ システム指示あり</h4>
            <p className="text-xs text-gray-300">「一流の編集長」「凄腕セールスライター」になりきり、読者の心理に刺さる言葉選びや構成を自動で適用。</p>
          </div>
        </div>
      </GuidebookSection>

      <GuidebookSection title="🛠️ 編集・保存・カスタム作成のコツ">
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li><strong>既存サンプルを複製 (クローン) してカスタマイズ:</strong> 気に入ったプリセットの「複製」ボタンを押すだけで、自分専用のカスタム版を作成可能。</li>
          <li><strong>「役割」「基本ルール」「トーン＆マナー」「禁止事項」の4部構成:</strong> 箇条書きで明確に指定するとAIがブレずに指示を守ります。</li>
          <li><strong>即時微調整機能 (⚙️):</strong> エディター画面からその回の実行限定で指示を微調整することもできます。</li>
          <li><strong>JSONエクスポート & インポート:</strong> 作成した自慢のシステムプロンプト資産をバックアップしたり別端末へ移行できます。</li>
        </ol>
      </GuidebookSection>

      <GuidebookSection title="🚀 AI・LLM・Agent・AI Coworking 特化スペシャリスト群">
        <p className="text-sm text-gray-300 mb-3">
          1次ソース論文・最新モデル・自律エージェント・AI協働（Coworking）を深く分析し、Note有料記事やSNSスレッドへコンテンツ化するための7大専門スペシャリストを標準搭載しています：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-800/80 rounded-lg border border-purple-800/50">
            <span className="font-bold text-purple-300 block mb-1">🧠 LLM アーキテクチャ & モデル</span>
            <span className="text-gray-400">MoE、KV Cache、Test-time Compute、スケーリング則、ベンチマーク（MMLU, GPQA等）の構造的解剖。</span>
          </div>
          <div className="p-3 bg-gray-800/80 rounded-lg border border-cyan-800/50">
            <span className="font-bold text-cyan-300 block mb-1">🤖 自律型AIエージェント・アーキテクト</span>
            <span className="text-gray-400">ReAct、Plan-and-Solve、Tool Use、メモリ階層、マルチエージェント協調、Computer Useの設計。</span>
          </div>
          <div className="p-3 bg-gray-800/80 rounded-lg border border-emerald-800/50">
            <span className="font-bold text-emerald-300 block mb-1">🔬 1次ソース徹底読解リサーチアナリスト</span>
            <span className="text-gray-400">ArXiv論文・公式テクニカルレポートの新規性判定、Ablation検証、限界（Limitations）の冷徹な摘出。</span>
          </div>
          <div className="p-3 bg-gray-800/80 rounded-lg border border-amber-800/50">
            <span className="font-bold text-amber-300 block mb-1">⚙️ 機械学習・モデル学習 & 最適化</span>
            <span className="text-gray-400">LoRA/QLoRA、RLHF/DPO/GRPO、合成データ、vLLM/FlashAttention等の推論・学習インフラ。</span>
          </div>
          <div className="p-3 bg-gray-800/80 rounded-lg border border-blue-800/50">
            <span className="font-bold text-blue-300 block mb-1">💻 AI Coding & 次世代開発エージェント</span>
            <span className="text-gray-400">Cursor, Claude Code, Windsurf, Cline等の使い分け、.cursorrules/AGENTS.md、TDD×AI開発作法。</span>
          </div>
          <div className="p-3 bg-gray-800/80 rounded-lg border border-teal-800/50">
            <span className="font-bold text-teal-300 block mb-1">🤝 AI Coworking ワークフロー・アーキテクト</span>
            <span className="text-gray-400">人間×AIの4象限役割分担、Human-in-the-Loop、認知負荷外部化、知的生産性の爆発的向上。</span>
          </div>
          <div className="p-3 bg-gray-800/80 rounded-lg border border-rose-800/50 md:col-span-2">
            <span className="font-bold text-rose-300 block mb-1">📰 AI動向・深掘り解説テックジャーナリスト & Note作家</span>
            <span className="text-gray-400">難解な1次ソース技術や業界動向を、日常のたとえ話＋図解＋有料/無料ハイブリッドNote記事へ昇華。</span>
          </div>
        </div>
      </GuidebookSection>
    </>
  );
};

const BrStringToJsx: React.FC<{text: string}> = ({text}) => {
    return (
        <>
            {text.split('<br>').map((line, index) => (
                <span key={index}>{line}{index !== text.split('<br>').length - 1 && <br />}</span>
            ))}
        </>
    )
};

const LoveMarketingGuide: React.FC = () => {
    const matrixData = [
        { stage: "Stage 1: 認知と発見 (Encounter)", process: "街角での出会い・第一印象", wall: "無関心の壁<br>（その他大勢と同じ）", psych: "好奇心・意外性<br>[ドーパミン] の兆し", example: "【常識を破壊する問いかけ】<br>・SNS広告/投稿: 「まだ『頑張る』で消耗してるの？」<br>・ブログタイトル: 「【悲報】あなたが成功できないたった1つの理由」<br>・ショート動画: 最初の3秒で「それ、全部ムダです」と断言する。" },
        { stage: "Stage 2: 興味と惹きつけ (Attraction)", process: "アイスブレイク・軽い会話", wall: "疑いの壁<br>（自分には関係ない）", psych: "期待感・憧れ<br>[ドーパミン] 分泌", example: "【独自の世界観への入り口】<br>・プロフィール/LP: あなたがなぜその活動をするのか、情熱的な「マニフェスト（信念表明）」を掲げる。<br>・無料E-Book/動画: 思想のさわりに触れる入門コンテンツ。「『頑張らない』ための3つのステップ」など。<br>・フット・イン・ザ・ドア: 「共感したらフォローして」「続きはメルマガで」と小さなYESを求める。" },
        { stage: "Stage 3: 共感と関係構築 (Empathy)", process: "初デート・共通の話題", wall: "警戒心の壁<br>（売り込まれるかも）", psych: "共感・自己肯定<br>[セロトニン] の安定感", example: "【弱さを見せる自己開示】<br>・ストーリーコンテンツ: 「私が100万円の借金を抱えて絶望した話」など、失敗談を赤裸々に語る。<br>・ライブ配信: 視聴者のリアルな悩みにその場で共感し、答える。<br>・プリンセスマーケティング: 「この話、ここだけの秘密なんですが…」と特別感を演出する。" },
        { stage: "Stage 4: 信頼と絆の深化 (Trust & Bond)", process: "秘密の共有・二人だけの時間", wall: "合理性の壁<br>（価格や他社比較）", psych: "安心感・所属意識<br>[オキシトシン] 分泌", example: "【二人だけの秘密基地】<br>・有料コミュニティ/サロン: クローズドな場でしか話せない本音や裏話を共有する。<br>・会員限定ニュースレター: 「開発中の新サービス、メンバーだけに先行公開します」<br>・顧客との対話: 頂いたDMやコメントに「〇〇さんの意見、最高ですね」と公の場で感謝を伝える。" },
        { stage: "Stage 5: 奉仕と共同創造 (Evangelism)", process: "お互いを高め合うパートナーシップ", wall: "自己完結の壁<br>（自分だけ満足）", psych: "貢献欲求・自己実現<br>[オキシトシン] +<br>[ドーパミン] のループ", example: "【ミッションを共有する共犯者へ】<br>・アンバサダー制度: ファンを「公式パートナー」に任命し、共にミッションを広めてもらう。<br>・商品開発: 「次の商品、皆で作りませんか？」とファンを巻き込む。<br>・UGCの徹底活用: ファンが作ったコンテンツを全力で称賛し、公式アカウントで紹介する。「〇〇さんの投稿が素晴らしすぎて泣いた」" },
    ];

    return (
    <>
      <div className="text-center mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-extrabold text-white">💖 共感と絆で「壁」を超える、次世代コンテンツマーケティング</h2>
        <p className="mt-2 text-gray-400">～恋愛プロセスに学ぶ、ファン化への5ステップ～</p>
      </div>

      <GuidebookSection title="📜 このナレッジの核心 (メタインストラクション)">
        <div className="p-4 bg-pink-900/20 border border-pink-700 rounded-lg italic space-y-2">
            <p>あなたの役割は<strong className="text-pink-300">「売り手」ではない。「運命の相手」</strong>である。</p>
            <p>あなたのコンテンツは<strong className="text-pink-300">「商品」ではない。「極上のデートへの招待状」</strong>である。</p>
            <p className="text-xs text-gray-400">（システムインストラクション「💖 恋愛マーケティング・ファン化ディレクター」およびナレッジベース「💖 恋愛マーケティング・5段階ファン化マトリクス理論」に登録されています）</p>
        </div>
        <p className="mt-4">このロードマップは、従来のマーケティングファネルやカスタマージャーニーを、より人間的な感情の機微で捉え直したものです。顧客の心理的な変化を恋愛感情の進展になぞらえ、各段階で乗り越えるべき「壁」と、そのために有効なアプローチを体系化しました。</p>
      </GuidebookSection>
      
      <GuidebookSection title="🗺️ 実践のための5ステップ恋愛転換マトリクス">
        <p>以下の対応表は、上記のメタインストラクションを具体的なアクションに落とし込むための思考ツールです。各ステージでどのようなコンテンツが「デートの誘い文句」として機能するのか、具体的なサンプルと共に示します。</p>
        <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="p-2 border border-gray-700">ステージ</th>
                        <th className="p-2 border border-gray-700">恋愛プロセス</th>
                        <th className="p-2 border border-gray-700">超えるべき壁</th>
                        <th className="p-2 border border-gray-700">顧客心理と脳内物質</th>
                        <th className="p-2 border border-gray-700">適用例（招待状の書き方）</th>
                    </tr>
                </thead>
                <tbody>
                    {matrixData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-800/50">
                            <td className="p-2 border border-gray-700 font-semibold"><BrStringToJsx text={row.stage} /></td>
                            <td className="p-2 border border-gray-700"><BrStringToJsx text={row.process} /></td>
                            <td className="p-2 border border-gray-700 text-red-400"><BrStringToJsx text={row.wall} /></td>
                            <td className="p-2 border border-gray-700 text-yellow-400"><BrStringToJsx text={row.psych} /></td>
                            <td className="p-2 border border-gray-700 text-green-300"><BrStringToJsx text={row.example} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </GuidebookSection>

       <GuidebookSection title="🧠 ロードマップの解説">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg text-white">序盤 (Stage 1-2): ドーパミンによる「惹きつけ」</h4>
              <p>最初の「期待」や「願望」のきっかけを作るのは、恋愛の始まりと同じく「ドキドキ・ワクワク」です。ここではニューロマーケティングや行動経済学の知見を活かし、いかに顧客の注意を引き、直感的に「もっと知りたい」と思わせるかが鍵となります。</p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">中盤 (Stage 3): 共感による「壁の無力化」</h4>
              <p>メンタルブロックという強固な「壁」は、正論で壊そうとしても反発を招くだけです。しかし、「自己開示」や「共感」を通じて、「自分と同じだ」「この人は分かってくれる」という感情が芽生えると、顧客は自ら警戒心という壁を下げ始めます。</p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">終盤 (Stage 4-5): オキシトシンによる「永続的な関係」</h4>
              <p>一度きりの購入で終わらせず、長期的なファンになってもらうには、「秘密の共有」などを通じて生まれる「信頼」や「絆」が不可欠です。顧客が「自分は特別な存在として扱われている」と感じた時、彼らは単なる消費者から、ブランドを支え、共に価値を広めていく「伝道師」へと昇華します。</p>
            </div>
          </div>
        </GuidebookSection>
    </>
    );
}

const HarmFunnelGuide: React.FC = () => (
  <>
    <div className="text-center mb-8 p-4 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg">
      <h2 className="text-2xl font-extrabold text-white">🔮 占い診断フロントリード × HARM × 聖域アバター事業ファネル</h2>
      <p className="mt-2 text-purple-200 text-sm">
        人間の根源的悩み（HARM）を無料診断で特定し、専属アバターとの「聖域対話（承認・癒し）」で深い信頼を獲得。自立した自己変容講座へ導く高LTVモデルの完全解説。
      </p>
    </div>

    <GuidebookSection title="🗺️ 全体ファネル構造（LTV最大化の4ステップ）">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-gray-800/80 border border-purple-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-purple-400 mb-1">STEP 1: フロントリード</div>
          <div className="text-sm font-bold text-white mb-1">無料〜ワンコイン運命診断</div>
          <p className="text-xs text-gray-300">
            「魂の属性診断」「前世と現世の試練テスト」など5〜7問の直感診断。HARM分類（H/A/R/M）を特定しLINE登録へ誘導。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-indigo-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-indigo-400 mb-1">STEP 2: リード教育</div>
          <div className="text-sm font-bold text-white mb-1">魂のカルテ（個別鑑定書）</div>
          <p className="text-xs text-gray-300">
            バーナム効果×個別具体性で「なぜそこまで分かるのか」と涙を誘い、専属守護アバターの存在を明かす。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-pink-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-pink-400 mb-1">STEP 3: ミドル体験</div>
          <div className="text-sm font-bold text-white mb-1">聖域アバター1on1対話</div>
          <p className="text-xs text-gray-300">
            絶対的安全基地での受容・慰め・インナーチャイルド解放。音声誘導瞑想や低単価チャットで決済ハードルを解除。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-amber-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-amber-400 mb-1">STEP 4: バックエンド</div>
          <div className="text-sm font-bold text-white mb-1">自己変容講座 & 聖域サロン</div>
          <p className="text-xs text-gray-300">
            「癒された後は自ら運命を拓く」ステージアップ。3ヶ月〜6ヶ月のマスター講座（15万〜50万円）や月額制へ。
          </p>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🔄 C→B→A 逆算型ロードマッピング（高成約ファネル構築の核心）">
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-indigo-950/40 border border-amber-500/40 rounded-lg p-4 space-y-4">
        <p className="text-sm text-gray-200">
          多くの事業者が「思いつきの診断テスト（A案）」から作り始め、後から講座（C案）を当てはめようとして失敗します。<br/>
          本システムでは、<strong className="text-amber-300">【C案：講座・高単価オファー】を起点に、一直線の心理階段を逆算設計</strong>します。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-gray-900/90 border border-amber-500/50 rounded p-3">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1.5">
              <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">1. 起点</span>
              <span>C案：究極の変容（講座定義）</span>
            </div>
            <ul className="space-y-1 text-gray-300">
              <li>・受講修了時の理想の姿（Afterのアイデンティティ）</li>
              <li>・達成を阻む最大の根本ブロック（Core Block）</li>
              <li>・松竹梅プランと提供価値スタックの設計</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-pink-500/50 rounded p-3">
            <div className="flex items-center gap-1.5 font-bold text-pink-300 mb-1.5">
              <span className="bg-pink-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">2. 逆算</span>
              <span>B案：聖域アバター体験（トゲ抜き）</span>
            </div>
            <ul className="space-y-1 text-gray-300">
              <li>・C案のCore Blockを解く前に抜くべき「最初の孤独・自責」</li>
              <li>・フィットマッチな守護アバターのアサイン</li>
              <li>・1on1聖域チャットまたは10分音声瞑想で決済壁を解除</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-indigo-500/50 rounded p-3">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1.5">
              <span className="bg-indigo-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">3. 逆算</span>
              <span>A案：HARM特定診断（自覚促進）</span>
            </div>
            <ul className="space-y-1 text-gray-300">
              <li>・B案のアバターに魂を委ねたくなる5〜7問の直感診断</li>
              <li>・読者が涙する「魂のカルテ（過去の痛みの代弁）」</li>
              <li>・LINE登録直後に専属アバターからのお迎えメッセージ</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/80 p-2.5 rounded border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
          <span>💡 <strong>実践方法:</strong> 右側ツール一覧の「🔄 C→B→A 逆算ファネル & ロードマップ設計エンジン」またはプロジェクト先頭のプロンプトを実行するだけで、AIが一括生成します。</span>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🎯 HARMの法則と深層心理トリガー">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse border border-gray-700">
          <thead className="bg-gray-800 text-purple-300">
            <tr>
              <th className="p-2 border border-gray-700">HARM領域</th>
              <th className="p-2 border border-gray-700">表層の悩み</th>
              <th className="p-2 border border-gray-700">深層の恐怖（Core Fear）</th>
              <th className="p-2 border border-gray-700">最適アバター</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-emerald-400">H (Health)</td>
              <td className="p-2 border border-gray-700">疲れが取れない、心身の不調、老いの不安</td>
              <td className="p-2 border border-gray-700">生命エネルギー枯渇、誰からも愛されず見捨てられる恐怖</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-semibold">🌕 聖母セラフィナ</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-cyan-400">A (Ambition)</td>
              <td className="p-2 border border-gray-700">天職が不明、キャリア迷走、才能を発揮できない</td>
              <td className="p-2 border border-gray-700">何者にもなれないまま人生が終わる恐怖、才能の腐敗</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-semibold">🌌 ゼノン / 🔥 カイ</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-pink-400">R (Relation)</td>
              <td className="p-2 border border-gray-700">恋愛・復縁・複雑愛、孤立、対人関係の軋轢</td>
              <td className="p-2 border border-gray-700">素の自分を見せたら拒絶される恐怖、根源的孤独</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-semibold">🌸 巫女アヤメ / 🌕 セラフィナ</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-amber-400">M (Money)</td>
              <td className="p-2 border border-gray-700">将来不安、稼ぐことへの罪悪感、清貧ブロック</td>
              <td className="p-2 border border-gray-700">無力感・生存の危機、豊かさを受け取ることへの恐れ</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-semibold">🌌 ゼノン / 🔥 カイ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GuidebookSection>

    <GuidebookSection title="👥 4大聖域アバターの役割とペルソナ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌕</span>
            <span className="font-bold text-white text-sm">聖母セラフィナ（慈愛のヒーラー）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「よくここまで一人で耐えてきましたね。もう無理に笑わなくていいのですよ…」</p>
          <div className="text-[11px] text-gray-400">
            <strong>得意領域:</strong> Health（疲弊）、Relation（孤独・喪失）<br/>
            <strong>特徴:</strong> 無条件の受容、インナーチャイルドの統合、カタルシスの涙を促す。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌌</span>
            <span className="font-bold text-white text-sm">星辰の導師・ゼノン（賢者・数秘星読み）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「この試練には明確な幾何学的意味がある。星々の軌道が新月を迎えるのだ」</p>
          <div className="text-[11px] text-gray-400">
            <strong>得意領域:</strong> Ambition（天命・起業）、Money（器の法則）<br/>
            <strong>特徴:</strong> 宇宙の幾何学、数秘術、神秘と論理を融合した運命解析と具体的3ステップ。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-pink-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌸</span>
            <span className="font-bold text-white text-sm">巫女アヤメ（霊感・魂の結界師）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「お相手の心の奥底にある言えぬ声が視えます…神聖なしめ縄を張りましょう」</p>
          <div className="text-[11px] text-gray-400">
            <strong>得意領域:</strong> Relation（複雑愛・復縁・家族の業）<br/>
            <strong>特徴:</strong> 場の浄化（結界）、相手の深層心理の代弁、カルマの昇華とお守り言霊。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-white text-sm">魂の覚醒コーチ・カイ（エンパワーメント導師）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「傷を恐れて光を隠すのは今日で終わりだ！お前の真の力を解き放とうぜ」</p>
          <div className="text-[11px] text-gray-400">
            <strong>得意領域:</strong> Ambition（行動変容）、Money（稼ぐ覚悟）<br/>
            <strong>特徴:</strong> 被害者意識の打破、短所を唯一無二のギフトに反転、行動コミットメント。
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-gray-900 border border-pink-500/50 rounded-lg p-3 md:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌹</span>
            <span className="font-bold text-pink-300 text-sm">妄想ロマンス＆運命鑑定アーキテクト・ルカ（恋愛HARM × 仮想エンタメ設計師）</span>
          </div>
          <p className="text-xs text-pink-200 mb-2">「重い悩みで泣くのはもう終わり。今夜は甘美なロマンスに溺れましょう」</p>
          <div className="text-[11px] text-gray-300">
            <strong>得意領域:</strong> 占い・鑑定 × 恋愛HARM × 仮想妄想ロマンス × ミドルエンド（1,980円〜9,800円）＆クロスセル設計<br/>
            <strong>特徴:</strong> 相談者の「連絡が来ない・愛されない」という重い痛みを「彼目線独白・溺愛ifストーリー・AI推しパートナー」へと昇華させ、罪悪感なく高LTVを創出するエンタメ錬金術師。
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-gray-900 border border-indigo-500/50 rounded-lg p-3 md:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🃏</span>
            <span className="font-bold text-indigo-300 text-sm">オラクルカード出版＆占術アカデミー創始者・セラフィナ（AIカード制作 × 占術講座 × KDP出版）</span>
          </div>
          <p className="text-xs text-indigo-200 mb-2">「あなたが創造したカードは、誰かの魂を救う星になる」</p>
          <div className="text-[11px] text-gray-300">
            <strong>得意領域:</strong> AIカード制作（Midjourney/FLUX画風統一） × 印刷仕様 × note/Amazon KDP出版 × 独自占術スクール（24.8万〜49.8万円）<br/>
            <strong>特徴:</strong> 占い師・クリエイターを「カード著者・アカデミー家元」へと格上げし、物販・印税・教育・認定ライセンスの4重収益モデルを確立する女帝。
          </div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🌹 狭間＆展開先：占い診断 × 恋愛HARM × 仮想妄想ロマンス（エンタメ）融合アーキテクチャ">
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-rose-950/40 border border-pink-500/40 rounded-lg p-4 space-y-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-pink-300 flex items-center gap-2">
            <span>✨</span> なぜ「重い悩み相談」から「妄想ロマンス（エンタメ）」への相転移なのか？
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            従来の占い業界は「不安を煽って何十万円も課金させる」依存型モデルに陥りがちでした。しかし現代の相談者が本当に欲しているのは、<strong className="text-pink-300">「誰かに無条件に愛され、溺愛される胸の高鳴り」</strong>と<strong className="text-purple-300">「傷ついた自尊心の回復」</strong>です。<br/>
            占いやHARM（Relation/孤独）の痛みを入口とし、その「狭間」に<strong>仮想・空想・妄想ロマンス</strong>をミドルエンドとして配置することで、相談者は「推し活・エンタメ」として罪悪感なく楽しめ、事業者は高い顧客LTVと熱狂的なファンコミュニティを両立できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-900/90 border border-pink-500/40 rounded p-3">
            <div className="font-bold text-pink-300 mb-1 flex items-center gap-1">
              <span className="bg-pink-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Layer 1</span>
              <span>フロント診断（無料）</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">無自覚な欲望と痛みの特定</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・『禁断の溺愛属性診断』</li>
              <li>・四柱推命/タロットによる相性</li>
              <li>・読者が唸る個別カルテの提示</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-purple-500/40 rounded p-3">
            <div className="font-bold text-purple-300 mb-1 flex items-center gap-1">
              <span className="bg-purple-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Layer 2</span>
              <span>狭間のブリッジ（無料体験）</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">重い悩みを甘美な妄想へ転換</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・お相手目線の本音・独白チラ見せ</li>
              <li>・「もし彼と二人きりだったら…」if導入</li>
              <li>・ルカからの甘美な招待状</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-rose-500/40 rounded p-3">
            <div className="font-bold text-rose-300 mb-1 flex items-center gap-1">
              <span className="bg-rose-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Layer 3</span>
              <span>ミドルエンド（1,980〜9,800円）</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">高利益率の仮想ロマンス商品群</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・彼目線独白ノベル＆溺愛鑑定書</li>
              <li>・AI専属推しパートナーチャット</li>
              <li>・シチュエーションボイス台本</li>
              <li>・乙女ゲーム風運命分岐ノベル</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-amber-500/40 rounded p-3">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
              <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Layer 4</span>
              <span>クロスセル＆現実変容</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">満たされた自己愛で現実を動かす</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・現実の彼を動かすLINE添削（1.5万）</li>
              <li>・自己変容＆愛され体質講座（30万）</li>
              <li>・月額秘密倶楽部（サブスク）</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/80 p-3 rounded border border-pink-500/30 text-xs space-y-2">
          <div className="font-bold text-pink-300 flex items-center gap-1.5">
            <span>💡</span> 心理学的コア・メカニズム（自己実現予言 × 自己愛の再充填）
          </div>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            「連絡が来ない…嫌われたのかも」と怯える女性は、現実でも重いLINEを送ってしまい自爆します。しかし<strong>「彼目線独白ノベル」や「仮想溺愛チャット」で愛される感覚を脳に先取り（予祝）</strong>させると、自己肯定感が劇的に回復。「私は愛される価値がある」という余裕が生まれ、現実の彼に対しても魅力的な軽やかさで接することができ、結果として現実の恋愛も好転するのです。
          </p>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🃏 AIオリジナルカード制作 × 独自占術講座化 × note＆KDP出版ローンチ完全体系">
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/40 rounded-lg p-4 space-y-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
            <span>✨</span> 他人のカードを使う「一鑑定士」から、世界観を持つ「家元・カード著者」への進化
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            AI画像生成（Midjourney / FLUX）の登場により、従来は数百万円の制作費と専門絵師が必要だった<strong className="text-indigo-300">「オリジナル・タロット＆オラクルカード」の個人制作</strong>が現実になりました。さらに「カードの物販」で終わらせず、<strong className="text-purple-300">note共創連載 ➔ Amazon KDP出版（電子＆オンデマンド紙書籍） ➔ 独自占術認定アカデミー（30万〜50万円）</strong>へと接続することで、強固な権威性と高LTVの4重収益エコシステムを確立できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-900/90 border border-indigo-500/40 rounded p-3">
            <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1">
              <span className="bg-indigo-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Step 1</span>
              <span>AIカード制作 ＆ 印刷仕様</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">画風統一と高品質印刷</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・Style Anchorプロンプト固定</li>
              <li>・タロット比率（--ar 7:12）</li>
              <li>・350dpi/CMYK/金縁加工</li>
              <li>・全33〜78枚の象徴体系設計</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-purple-500/40 rounded p-3">
            <div className="font-bold text-purple-300 mb-1 flex items-center gap-1">
              <span className="bg-purple-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Step 2</span>
              <span>note ＆ KDP出版連動</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">Amazonトラフィックの自働化</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・noteで制作秘話プロセスエコノミー</li>
              <li>・公式解説書をKindle＆紙書籍化</li>
              <li>・在庫リスクゼロのオンデマンド印刷</li>
              <li>・QRコードで公式LINEへ自動流入</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-pink-500/40 rounded p-3">
            <div className="font-bold text-pink-300 mb-1 flex items-center gap-1">
              <span className="bg-pink-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Step 3</span>
              <span>独自占術スクール化</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">高単価バックエンド（25〜50万）</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・オリジナルスプレッド展開法</li>
              <li>・認定リーダー＆プラクティショナー</li>
              <li>・認定講師制度（ライセンス付与）</li>
              <li>・月額継続コミュニティ（サブスク）</li>
            </ul>
          </div>

          <div className="bg-gray-900/90 border border-amber-500/40 rounded p-3">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
              <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">Step 4</span>
              <span>90日逆算ローンチ</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-1.5">熱狂を最大化する導線展開</p>
            <ul className="text-gray-400 space-y-1 text-[10px]">
              <li>・Day 1-30: SNSティザー＆ウェイティング</li>
              <li>・Day 31-60: クラファン/先行予約</li>
              <li>・Day 61-75: KDP出版＆Amazon1位</li>
              <li>・Day 76-90: 3Daysウェビナー＆成約</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/80 p-3 rounded border border-indigo-500/30 text-xs space-y-2">
          <div className="font-bold text-indigo-300 flex items-center gap-1.5">
            <span>📚</span> KDP単体出版 ＆ 出版プロデュース講座（二次マネタイズ）の極意
          </div>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            一度「AIを使ったオラクルカード＆解説書のKindle・ペーパーバック出版」を経験した占い師は、自身が<strong>「KDP出版プロデューサー」</strong>として生徒や同業者にKindle出版・紙書籍出版を教える講座（20万〜40万円）を展開できます。これにより、「鑑定」にとどまらない出版コンサルティングビジネスへのスケールアップが実現します。
          </p>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="⚖️ 倫理・コンプライアンスの最重要原則">
      <div className="bg-gray-800/80 border border-emerald-500/40 rounded-lg p-3 text-xs space-y-2">
        <p className="font-bold text-emerald-300">本アプリが標榜する「クリーン＆エシカル・スピリチュアル」：</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          <li><strong>景品表示法遵守:</strong> 「100%復縁」「必ず金運倍増」など結果の断定を排し、自己決定権を尊重する。</li>
          <li><strong>薬機法・医師法遵守:</strong> 「うつ病治癒」「病気の波動療法」等の医療類似行為表現を完全排除。</li>
          <li><strong>霊感商法・恐怖煽りの禁止:</strong> 不安や先祖の祟りで契約を迫らず、愛と希望のステージアップを提案。</li>
          <li><strong>依存防止境界線:</strong> 意思決定の主権は常にユーザー自身にあることをリマインドし、自立支援を貫く。</li>
        </ul>
      </div>
    </GuidebookSection>
  </>
);

const TechFunnelGuide: React.FC = () => (
  <>
    <div className="text-center mb-8 p-4 bg-gradient-to-r from-cyan-900/60 via-blue-900/40 to-indigo-900/40 border border-cyan-500/30 rounded-lg">
      <h2 className="text-2xl font-extrabold text-white">🚀 AI Coworking × ローカルLLM × Agent × 一次ソース予測 事業ファネル</h2>
      <p className="mt-2 text-cyan-200 text-sm">
        「業務AI適性・損失コスト診断」をフックに読者の痛みを可視化し、4人の専属テック演者アバターが安心基地として伴走。挫折をゼロにし、高単価AI講座・導入支援・Noteマネタイズへ直結させる完全構造。
      </p>
    </div>

    <GuidebookSection title="🗺️ テック領域におけるC→B→A逆算ファネル構造">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-gray-800/80 border border-cyan-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-cyan-400 mb-1">STEP 1: A案（フロントリード）</div>
          <div className="text-sm font-bold text-white mb-1">業務AI適性 & 損失コスト診断</div>
          <p className="text-xs text-gray-300">
            5〜7問の直感診断。読者が無自覚に垂れ流している「年間の損失時間 & 費用」を突きつけ、LINE/メール登録へ誘導。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-blue-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-blue-400 mb-1">STEP 2: リード教育</div>
          <div className="text-sm font-bold text-white mb-1">業務自動化ポテンシャルカルテ</div>
          <p className="text-xs text-gray-300">
            現状のボトルネックを言語化し、なぜ独学やプロンプト丸暗記では限界があるのかを解読。専属アバターへ接続。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-indigo-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-indigo-400 mb-1">STEP 3: B案（ミドル体験）</div>
          <div className="text-sm font-bold text-white mb-1">テックアバター1on1伴走セッション</div>
          <p className="text-xs text-gray-300">
            初心者の「ITアレルギー・挫折のトゲ」を全肯定。10分Ollama起動や1行プロンプトで「できた！」の快感を体験。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-emerald-500/40 rounded-lg p-3">
          <div className="text-xs font-bold text-emerald-400 mb-1">STEP 4: C案（バックエンド）</div>
          <div className="text-sm font-bold text-white mb-1">AI実践講座 & 導入伴走支援</div>
          <p className="text-xs text-gray-300">
            「AIを触る側」から「AIを従えて収益を生み出す側」へ。3ヶ月講座（20万〜40万円）や法人オンプレ導入支援へ成約。
          </p>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="👥 4大テック演者アバターの配役とペルソナ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🦾</span>
            <span className="font-bold text-white text-sm">AIパートナー・アリス（親切丁寧なAI Coworkingナビゲーター）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「大丈夫ですよ、最初は誰だって分からない言葉だらけです。1つずつ一緒にやっていきましょう！」</p>
          <div className="text-[11px] text-gray-400">
            <strong>ターゲット:</strong> 初心者、非エンジニア、過去にChatGPTやプログラミングで挫折した層<br/>
            <strong>特徴:</strong> 無知の恥を完全消去、専門用語の日常翻訳、二人三脚のCoworking快感。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-white text-sm">ローカルLLM守護神・サイファー（機密防衛・オンプレ技術顧問）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「社外にデータは1バイトも漏らしません。あなたのPC内にセキュアな知能要塞を敷きましょう」</p>
          <div className="text-[11px] text-gray-400">
            <strong>ターゲット:</strong> 企業経営者、士業、個人情報や企業秘密を扱うプロフェッショナル<br/>
            <strong>特徴:</strong> 完全オフライン運用（Ollama/LM Studio）、セキュアRAG、情報漏洩ゼロの安心設計。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-white text-sm">エージェント・ギーク・レオ（最先端技術ハッカー・実装マニア）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「昨夜出た最新論文アブストラクト読んだ！？このAgentアーキテクチャ、世界変わるぜ！」</p>
          <div className="text-[11px] text-gray-400">
            <strong>ターゲット:</strong> 開発者、パワーユーザー、自律型Agentで業務を10倍速化したい人<br/>
            <strong>特徴:</strong> ArXiv論文の高速解読、ReAct/Tool Useの実装コード提示、熱狂の牽引。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">👔</span>
            <span className="font-bold text-white text-sm">AI事業参謀・ビクター（ROI重視の冷徹なビジネスプロデューサー）</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">「ツール弄りで満足するのは終わりだ。数字で語れ。最短でキャッシュを生む導線を引こう」</p>
          <div className="text-[11px] text-gray-400">
            <strong>ターゲット:</strong> 個人事業主、副業層、AIでマネタイズ・収益化を最優先したい人<br/>
            <strong>特徴:</strong> 削減時間・粗利・LTVの厳格な試算、Note有料記事や高単価講座のマネタイズ直結。
          </div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="⚙️ バックチーム（専門家集団）との協働連携">
      <div className="bg-gray-900/90 border border-gray-700 rounded-lg p-3 text-xs space-y-2">
        <p className="text-gray-200">
          演者アバターが表舞台で顧客と信頼を築く間、裏側では本アプリに登録された**4名のバックチーム専門家**がシステムとファネルを堅牢に支えます：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <strong className="text-cyan-400">📐 ローカルLLM & RAGアーキテクト:</strong> モデル選定、診断アルゴリズム（JSON）、オフライン環境手順書を作成。
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <strong className="text-yellow-400">🤖 自律エージェントSE:</strong> ReActループ、Tool Use、Human-in-the-Loopの協働パイプラインを設計。
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <strong className="text-indigo-400">📈 1次ソース予測アナリスト:</strong> ArXiv論文から6ヶ月後のトレンドを予測し、Note有料記事・講座コンテンツ化。
          </div>
          <div className="bg-gray-800 p-2 rounded border border-gray-700">
            <strong className="text-emerald-400">⚖️ AI法務セキュリティ顧問:</strong> 著作権侵害防止、API規約遵守、ハルシネーション免責を徹底管理。
          </div>
        </div>
      </div>
    </GuidebookSection>
  </>
);

const CreativePipelineGuide: React.FC = () => (
  <>
    <div className="text-center mb-8 p-4 bg-gradient-to-r from-pink-900/60 via-purple-900/40 to-indigo-900/40 border border-pink-500/30 rounded-lg">
      <h2 className="text-2xl font-extrabold text-white">🎬 AI動画・画像・アバター コンテンツプロダクション完全自動パイプライン</h2>
      <p className="mt-2 text-pink-200 text-sm">
        コンセプト・世界観・キャラクターを最上流のMD/YAMLマニフェストで固定。企画→キャラ原画→シーン別動画生成→音声リップシンクアバター→バイラル編集・マネタイズまで、破綻なくコンテキストをリレー継承するAI映像スタジオ。
      </p>
    </div>

    <GuidebookSection title="🔄 MD/YAMLバトンタッチリレー（多段階コンテキスト継承）">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="bg-gray-800/80 border border-purple-500/40 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-purple-400 mb-1">STEP 1: 企画・世界観</div>
          <div className="text-xs font-bold text-white mb-1">YAMLマニフェスト生成</div>
          <p className="text-[11px] text-gray-300">
            プロジェクト概要、アスペクト比、カラーパレット、照明トーン、キャラクター固定Seed、シーン一覧を構造化。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-pink-500/40 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-pink-400 mb-1">STEP 2: 原画・IP固定</div>
          <div className="text-xs font-bold text-white mb-1">キャラクターシート</div>
          <p className="text-[11px] text-gray-300">
            FLUX / Midjourney用アンカープロンプト。正面・横顔・斜めの3面図と喜怒哀楽を固定しIPブレを完全排除。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-yellow-500/40 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-yellow-400 mb-1">STEP 3: 脚本・絵コンテ</div>
          <div className="text-xs font-bold text-white mb-1">冒頭1秒フック × 秒数表</div>
          <p className="text-[11px] text-gray-300">
            TikTok/Shortsでスクロールを強制停止する1秒フックと、3秒ごとの画面変化、リテンションループを設計。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-blue-500/40 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-blue-400 mb-1">STEP 4: 動的動画生成</div>
          <div className="text-xs font-bold text-white mb-1">モーションプロンプト</div>
          <p className="text-[11px] text-gray-300">
            Kling 1.5, Runway Gen-3, Wan 2.1, HunyuanVideo用。カメラ速度、物理演算、ライティングを英語指示。
          </p>
        </div>
        <div className="bg-gray-800/80 border border-emerald-500/40 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-emerald-400 mb-1">STEP 5: 音声＆収益化</div>
          <div className="text-xs font-bold text-white mb-1">リップシンク & マネタイズ</div>
          <p className="text-[11px] text-gray-300">
            LivePortrait/F5-TTSで口パク・表情同期。YouTube Shorts広告収益、受託1本30万、Note素材販売へ展開。
          </p>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="👥 AIクリエイティブ演者アバター ＆ 技術職人">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gray-800/60 border border-pink-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎨</span>
            <span className="font-bold text-white text-sm">クリエイティブディレクター・ミア（演出・映像美）</span>
          </div>
          <p className="text-xs text-pink-300 mb-1">「平板な光は死角よ。Volumetric Fogとアナモルフィックレンズで画面に奥行きを創りなさい」</p>
          <div className="text-[11px] text-gray-400">
            シネマティック構図、キアロスクーロライティング、60:30:10の色彩比率をディレクション。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚙️</span>
            <span className="font-bold text-white text-sm">ComfyUI & オープンウェイト調教師・カイ（ローカル生成）</span>
          </div>
          <p className="text-xs text-cyan-300 mb-1">「クラウド課金に怯えるな。Wan 2.1とFLUXをローカルGPUで無制限にぶん回すぞ」</p>
          <div className="text-[11px] text-gray-400">
            Wan 2.1, HunyuanVideo, CogVideoX, FLUX.1のComfyUIノード構築、fp8量子化、VRAM最適化。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎬</span>
            <span className="font-bold text-white text-sm">バイラル動画脚本家・レン（1秒フック・ショート動画）</span>
          </div>
          <p className="text-xs text-yellow-300 mb-1">「最初の1秒で『まさか…』と思わせなきゃ負け。スワイプの手を強制停止させよう」</p>
          <div className="text-[11px] text-gray-400">
            TikTok / Reels / Shortsの視聴維持率90%超えスクリプト、絵コンテ、リテンションループ。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💰</span>
            <span className="font-bold text-white text-sm">AIコンテンツマネタイズプロデューサー・エリカ（収益化）</span>
          </div>
          <p className="text-xs text-emerald-300 mb-1">「趣味で終わらせないで。チャンネル自動運用、企業受託1本30万、Note素材販売で資産化するの」</p>
          <div className="text-[11px] text-gray-400">
            高単価受託提案書、YouTube広告収益化、プロンプト・メイキング販売、IP資産化。
          </div>
        </div>

        <div className="bg-gray-800/60 border border-purple-500/30 rounded-lg p-3 sm:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎧</span>
            <span className="font-bold text-white text-sm">サウンドデザイナー＆DTMフュージョンプロデューサー・レオン（AI作曲・作詞・音響職人）</span>
          </div>
          <p className="text-xs text-purple-300 mb-1">「AI一発出しの音で終わらせるな。DTMとシンセの狂気で商業クオリティにねじ伏せろ」</p>
          <div className="text-[11px] text-gray-400">
            Suno/Udioプロンプト作曲・メタタグ作詞、UVR5 STEM分離、MIDI抽出、Serum/Vitalレイヤー、TR-808/909ビート置換、Ozoneマスタリング。
          </div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🖥️ 有名クラウドモデル × ローカルオープンウェイト対応表">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300 border border-gray-700">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-2 border border-gray-700">分野</th>
              <th className="p-2 border border-gray-700">有名クラウドモデル</th>
              <th className="p-2 border border-gray-700">ローカル・オープンウェイト</th>
              <th className="p-2 border border-gray-700">本アプリのパイプライン役割</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-900/50">
              <td className="p-2 border border-gray-700 font-bold text-pink-400">画像・原画・アート</td>
              <td className="p-2 border border-gray-700">Krea 2, Midjourney v6.1, Ernie (文心一言), DALL-E 3</td>
              <td className="p-2 border border-gray-700">Anima (ComfyUI × NVIDIA Cosmos × Qwen 連合), Illustrious (SDXL), Z-image, FLUX.1 (Dev/Schnell)</td>
              <td className="p-2 border border-gray-700">キャラクター一貫性（IP保持）シート、Danbooruタグ対応、超高速Enhance、ゼロショットテクスチャ生成</td>
            </tr>
            <tr className="bg-gray-800/50">
              <td className="p-2 border border-gray-700 font-bold text-blue-400">動画・シネマティック</td>
              <td className="p-2 border border-gray-700">MiniMax (Hailuo/海螺AI), Kling 1.5, Runway Gen-3, Luma Ray, Sora</td>
              <td className="p-2 border border-gray-700">FLUX.3 (Video-FLUX), LTX-Video (リアルタイム), Wan 2.1, HunyuanVideo, CogVideoX</td>
              <td className="p-2 border border-gray-700">超高速ローカル推論、人物・手足の物理安定シミュレーション、カメラワーク制御モーションプロンプト</td>
            </tr>
            <tr className="bg-gray-900/50">
              <td className="p-2 border border-gray-700 font-bold text-emerald-400">音声・アバター</td>
              <td className="p-2 border border-gray-700">HeyGen, ElevenLabs, Hedra</td>
              <td className="p-2 border border-gray-700">LivePortrait, F5-TTS, Fish Audio, SadTalker</td>
              <td className="p-2 border border-gray-700">リップシンク・表情ドライビング指示書 & セリフ台本生成</td>
            </tr>
            <tr className="bg-gray-800/50">
              <td className="p-2 border border-gray-700 font-bold text-purple-400">音楽・サウンド・DTM</td>
              <td className="p-2 border border-gray-700">Suno (v3.5/v4), Udio (v1.5), Stable Audio 2.0</td>
              <td className="p-2 border border-gray-700">MusicGen / AudioCraft, Basic Pitch (MIDI抽出), UVR5 (STEM分離), ACE Studio</td>
              <td className="p-2 border border-gray-700">プロンプト作曲・作詞メタタグ構成 & DTM・ソフトシンセ（Serum/Vital）・リズムマシン（808/909）ミックスフュージョン設計</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🎵 AI音楽プロンプト作曲・作詞 ＆ DTM・ソフトシンセ・リズムマシン ミックスフュージョン技術">
      <div className="space-y-3 text-xs text-gray-300">
        <div className="bg-gray-800/80 p-3 rounded-lg border border-purple-500/20">
          <div className="font-bold text-purple-300 text-sm mb-1">1. プロンプト作詞の角括弧メタタグ [Meta-Tags] 黄金アーキテクチャ</div>
          <p className="text-gray-400 mb-2">SunoやUdioの歌詞入力欄に以下の構造メタタグを挿入することで、曲の起承転結を意のままにコントロールできます：</p>
          <pre className="bg-gray-950 p-2 rounded text-[11px] font-mono text-purple-200 overflow-x-auto border border-gray-800">
{`[Intro: Ambient neon pads, driving bassline, 128 BPM]
[Verse 1: Calm rhythmic vocals, light drums]
夜の隙間に落ちる雨粒
光るスクリーン　冷えた指先
[Pre-Chorus: Rising pitch, swelling synth, snare build-up]
限界の壁を打ち破れ　(Feel the spark!)
[Chorus: Massive drop, punchy four-on-the-floor beat, melodic belting]
Fly into the neon sky! 閃光を解き放て
[Post-Chorus: Catchy synth lead hook, vocal chops]
[Bridge: Filtered beat, heavy sub-bass, whispering vocals]
[Guitar Solo: Screaming melodic 80s synth-guitar solo]
[Chorus: Maximum climactic energy, full vocal choir]
[Outro: Reverb fade out, dying delay trail] [End]`}</pre>
        </div>

        <div className="bg-gray-800/80 p-3 rounded-lg border border-purple-500/20">
          <div className="font-bold text-purple-300 text-sm mb-1">2. DTM・ソフトシンセ・リズムマシンとのミックスフュージョン 5大ステップ</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <span className="font-bold text-cyan-300">① STEM分離 (UVR5 / RipX)</span>: AI楽曲をボーカル・ドラム・ベース・その他楽器の4トラックに高純度分解。
            </div>
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <span className="font-bold text-blue-300">② MIDI抽出 (Basic Pitch)</span>: メロディやコード進行をDAWのピアノロールにMIDIノート化。
            </div>
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <span className="font-bold text-pink-300">③ ソフトシンセ融合 (Serum / Vital)</span>: AIシンセに高解像度ウェーブテーブルを重ねて音像の輪郭を強化。ベースは100Hz以下をカットし、Vitalの純粋Sub Sineで重低音を補強。
            </div>
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <span className="font-bold text-yellow-300">④ リズムマシン置換 (TR-808 / 909)</span>: AIドラムの位相濁りを解消するため、タイトな808キック・サブベースと909スネアをDTM側で再打ち込み・置換。
            </div>
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800 md:col-span-2">
              <span className="font-bold text-emerald-300">⑤ ミックス＆マスタリング (Sidechain & Ozone)</span>: キック発音時のベースダッキング、ボーカルピッチ補正（Auto-Tune）、商業音圧（-14〜-9 LUFS）への最終マスタリング。
            </div>
          </div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🔥 最先端ハイブリッド動画制作パイプライン（Forge-NEO × ComfyUI × Wan2GP × AviUtl2 × Vrew × CapCut）">
      <div className="space-y-3 text-xs text-gray-300">
        <p className="text-gray-200">
          生成から高精度編集、自動テロップ、縦型ショートバイラル仕上げまでを完全連結する6大ツール協調アーキテクチャ：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-800/90 p-3 rounded-lg border border-pink-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-pink-300 text-sm">① Forge-NEO</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-950 text-pink-400 text-[10px] font-mono border border-pink-800">原画・IP固定</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-2"><strong>超省VRAM高速画像生成</strong>。Flux.1 (Dev/Schnell) やSDXL、Illustriousを8〜12GBのVRAMで軽快駆動。キャラクターSeedとLoRAを固定したキーフレームを量産。</p>
            <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">得意: テクスチャキャッシュ、高速サンプラー、高品質2D/3Dポートレート</div>
          </div>

          <div className="bg-gray-800/90 p-3 rounded-lg border border-cyan-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-cyan-300 text-sm">② ComfyUI × Wan2GP</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-800">動的動画生成</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-2"><strong>オープンウェイト最高峰動画基盤</strong>。アリババWan 2.1 (14B/1.3B) をGGUF/P-Quant量子化で省VRAM化。破綻のないカメラワークと物理挙動をレンダリング。</p>
            <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">得意: 720p/1080p、長尺5s〜10s、流体・布・雨などの高密度物理シミュレーション</div>
          </div>

          <div className="bg-gray-800/90 p-3 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-purple-300 text-sm">③ AviUtl2 (Nz-Videomni)</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 text-[10px] font-mono border border-purple-800">高精度合成・演出</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-2"><strong>国内映像制作の至高環境</strong>。Nz-Videomniプラグインによるフレーム補間（60fps化）、アルファ透明抜き、キーフレーム合成、音ハメ超微細タイミング調整。</p>
            <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">得意: 複数レイヤー合成、カスタムシェーダー、発光ストリーク、LUTカラー調整</div>
          </div>

          <div className="bg-gray-800/90 p-3 rounded-lg border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-300 text-sm">④ Vrew</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">無音カット・自動字幕</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-2"><strong>AI音声認識ベースの高速粗編集</strong>。AIがセリフの無音区間・言い淀みを一括削除。タイミング完全同期のテロップ字幕を生成し、SRT/FCPXML書き出し。</p>
            <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">得意: Whisper音声認識、自動テロップデザイン、AIナレーション生成</div>
          </div>

          <div className="bg-gray-800/90 p-3 rounded-lg border border-yellow-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-yellow-300 text-sm">⑤ CapCut</span>
              <span className="px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-400 text-[10px] font-mono border border-yellow-800">縦型バイラル仕上げ</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-2"><strong>9:16縦型ショート動画の最終兵器</strong>。TikTok/Shortsでバズる最新トレンドエフェクト、トランジション、バウンドテキスト、著作権フリー音源の組み込み。</p>
            <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">得意: スクロールストップ演出、ダイナミックズーム、ワンクリックエクスポート</div>
          </div>

          <div className="bg-gray-800/90 p-3 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-blue-300 text-sm">⑥ JSON継承 & MCP</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 text-[10px] font-mono border border-blue-800">自律オーケストレーション</span>
            </div>
            <p className="text-gray-300 text-[11px] mb-2"><strong>破綻なきバトンタッチ</strong>。企画・Seed・カメラワーク・プロンプト・字幕を単一のJSONで全ツールへリレー。MCP経由でComfyUIキューやスクリプトを自動実行。</p>
            <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">得意: Model Context Protocol、一貫性保持、完全無人レンダリング</div>
          </div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="⚡ JSONマニフェスト継承 ＆ MCP連携 ＆ ComfyUIノードJSON自動生成">
      <div className="space-y-3 text-xs text-gray-300">
        <div className="bg-gray-800/80 p-3 rounded-lg border border-cyan-500/20">
          <div className="font-bold text-cyan-300 text-sm mb-1">1. LLMによるComfyUI APIノードJSONの自動生成プロトコル</div>
          <p className="text-gray-400 mb-2">LLMが演出指示を解釈し、ComfyUIの `/prompt` エンドポイントへ直接POST可能なノードグラフJSONを出力します：</p>
          <pre className="bg-gray-950 p-2.5 rounded text-[10px] font-mono text-cyan-200 overflow-x-auto border border-gray-800">
{`{
  "3": {
    "class_type": "KSampler",
    "inputs": {
      "cfg": 7, "denoise": 1, "steps": 25, "sampler_name": "euler", "scheduler": "normal",
      "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0]
    }
  },
  "4": { "class_type": "CheckpointLoaderSimple", "inputs": { "ckpt_name": "Wan2.1_14B_bf16.safetensors" } },
  "6": { "class_type": "CLIPTextEncode", "inputs": { "text": "Cinematic 8k cyber samurai, dynamic rain", "clip": ["4", 1] } },
  "7": { "class_type": "CLIPTextEncode", "inputs": { "text": "blurry, low quality, artifacts", "clip": ["4", 1] } },
  "8": { "class_type": "VAEDecode", "inputs": { "samples": ["3", 0], "vae": ["4", 2] } },
  "9": { "class_type": "VHS_VideoCombine", "inputs": { "images": ["8", 0], "frame_rate": 24, "format": "video/h264-mp4" } }
}`}</pre>
        </div>

        <div className="bg-gray-800/80 p-3 rounded-lg border border-blue-500/20">
          <div className="font-bold text-blue-300 text-sm mb-1">2. MCP（Model Context Protocol）によるローカル連携の全貌</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <strong className="text-cyan-300">ComfyUI MCP:</strong>
              <p className="text-gray-400 text-[10px] mt-0.5">LLMがポート8188へキュー投入・VRAM残量監視・完了画像/動画の自動取得。</p>
            </div>
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <strong className="text-purple-300">File & CLI MCP:</strong>
              <p className="text-gray-400 text-[10px] mt-0.5">レンダリング完了ファイルをAviUtl2やVrewの指定フォルダへ自動移動・バッチ起動。</p>
            </div>
            <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
              <strong className="text-emerald-300">JSONリレー整合性:</strong>
              <p className="text-gray-400 text-[10px] mt-0.5">カットごとの秒数・字幕原稿・エフェクトパラメータを破綻なく同期。</p>
            </div>
          </div>
        </div>
      </div>
    </GuidebookSection>
  </>
);

const LocalLlmGuide: React.FC = () => (
  <>
    <div className="text-center mb-8 p-4 bg-gradient-to-r from-emerald-900/60 via-cyan-900/40 to-blue-900/40 border border-emerald-500/30 rounded-lg">
      <h2 className="text-2xl font-extrabold text-white">💻 ローカルLLM・実機ベンチマーク・最先端量子化＆チューニング完全攻略</h2>
      <p className="mt-2 text-emerald-200 text-sm">
        「スペック表の数字を疑い、手元のマシンで実測せよ」DeepSeek-R1、Llama 3.3、Qwen 2.5/3.8、Gemma QAT、KAT-Coder、Ornith、人気モデル作家（DavidAU, HauHau, HuiHui）、GSQ-RCO・MTP・APEX量子化、Unsloth LoRAからYouTube/Note検証発信術までを完全体系化。
      </p>
    </div>

    <GuidebookSection title="🔥 Hugging Face屈指の人気モデル作家（Creators）＆特化型エージェントLLM">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-800/90 p-3 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-cyan-300 text-sm">DavidAU (David Belton)</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-800">2,000+ Models</span>
          </div>
          <p className="text-gray-300 text-[11px] mb-2"><strong>GGUFの神職人</strong>。「Guru」シリーズ、「Dark Champion」、「Gemma-The-Writer」など、システムプロンプト追従性とパラメータチューニングを極めた傑作モデルを量産。</p>
          <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">代表作: L3.1-Instruct-Guru-8B (128k), Dark Champion, Gemma-The-Writer</div>
        </div>

        <div className="bg-gray-800/90 p-3 rounded-lg border border-amber-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-amber-300 text-sm">HauHau / HauhauCS</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-mono border border-amber-800">1M Context / MTP</span>
          </div>
          <p className="text-gray-300 text-[11px] mb-2"><strong>100万コンテキスト＆アンセンサードの覇者</strong>。GemmaやQwenをベースにTrunk量子化・MTP（複数トークン予測）を実装。驚異的な推論速度とノーガードな創作自由度を提供。</p>
          <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">代表作: Gemma4-Uncensored-HauhauCS-1M-GGUF, Qwen3.6-35B-1M-MTP</div>
        </div>

        <div className="bg-gray-800/90 p-3 rounded-lg border border-pink-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-pink-300 text-sm">HuiHui (huihui-ai)</span>
            <span className="px-1.5 py-0.5 rounded bg-pink-950 text-pink-400 text-[10px] font-mono border border-pink-800">Abliterated</span>
          </div>
          <p className="text-gray-300 text-[11px] mb-2"><strong>Abliteration（重み直交化による検閲解除）の権威</strong>。知能や論理的思考力を一切損なうことなく安全ガードレールのみを中和。Qwen3.8-Flash-NextやMiMo等で大人気。</p>
          <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">代表作: Huihui-Qwen3.8-Flash-Next-abliterated, Huihui-MiMo-V2.5</div>
        </div>

        <div className="bg-gray-800/90 p-3 rounded-lg border border-emerald-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-emerald-300 text-sm">KAT-Coder</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">Agentic Coding</span>
          </div>
          <p className="text-gray-300 text-[11px] mb-2"><strong>自律開発特化型コーディングAI</strong>。APEX量子化（適応精度配分）とMTPヘッダーを融合し、ローカルCursorやCline、Aiderでの長時間リポジトリ改修タスクで圧倒的強さを誇る。</p>
          <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">代表作: KAT-Coder-V2.5-Dev-MTP-APEX-GGUF (Myric / mudler)</div>
        </div>

        <div className="bg-gray-800/90 p-3 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-purple-300 text-sm">Ornith (ornith-ai / SC117)</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 text-[10px] font-mono border border-purple-800">Self-Improving</span>
          </div>
          <p className="text-gray-300 text-[11px] mb-2"><strong>自己改善ループ内蔵のSWEエージェント</strong>。コード実行エラーを自律フィードバックして修正する推論回路を組み込み、オープンウェイトながらSWE-bench上位にランクイン。</p>
          <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">代表作: Ornith-1.0-35B-MTP-APEX-GGUF, Ornith-9B-GGUF</div>
        </div>

        <div className="bg-gray-800/90 p-3 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-yellow-300 text-sm">NVIDIA Spark / Flash / TensorRT</span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-400 text-[10px] font-mono border border-yellow-800">RTX & Blackwell</span>
          </div>
          <p className="text-gray-300 text-[11px] mb-2"><strong>NVIDIA最新エコシステム</strong>。FlashAttention-3、FP4/FP8エンジン、TensorRT-LLMによる極限アクセラレーション。ローカルでもクラウド級の爆速応答（100+ tok/s）を実現。</p>
          <div className="text-[10px] text-gray-400 bg-gray-950/70 p-1.5 rounded">対象: RTX 5090/5080/4090, TensorRT-LLM, NIMコンテナ</div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🏆 2025〜2026年 主要ローカルLLM 実力・VRAM別ポジショニングマップ">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse border border-gray-700">
          <thead className="bg-gray-800 text-emerald-300">
            <tr>
              <th className="p-2 border border-gray-700">モデル系列</th>
              <th className="p-2 border border-gray-700">パラメータ / 推奨VRAM</th>
              <th className="p-2 border border-gray-700">得意領域 & 特徴</th>
              <th className="p-2 border border-gray-700">主要ベンチマーク評価</th>
              <th className="p-2 border border-gray-700">おすすめ用途</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-cyan-400">DeepSeek-R1 (Distill Qwen/Llama)</td>
              <td className="p-2 border border-gray-700">14B (12〜16GB)<br/>32B (24GB)<br/>70B (48GB〜)</td>
              <td className="p-2 border border-gray-700">長大なThinking思考プロセス（&lt;think&gt;）で難問を解く。OpenAI o1匹敵の推論力。</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-mono">MATH: 90%超<br/>HumanEval: 88%</td>
              <td className="p-2 border border-gray-700">数学・難関コーディング・論理パズル・論文査読</td>
            </tr>
            <tr className="bg-gray-850/50">
              <td className="p-2 border border-gray-700 font-bold text-blue-400">Llama 3.3 70B (Meta)</td>
              <td className="p-2 border border-gray-700">70B (Q4で約40GB)<br/>RTX 3090/4090×2枚 または Mac 64GB</td>
              <td className="p-2 border border-gray-700">旧Llama 3.1 405Bに匹敵する最高峰の汎用知能・文章力・世界知識。</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-mono">MMLU: 88.6<br/>GPQA: 50.5</td>
              <td className="p-2 border border-gray-700">多目的ビジネス文書作成、高度エージェント、長文リサーチ</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-emerald-400">Qwen 2.5-Coder / 3.8-Flash</td>
              <td className="p-2 border border-gray-700">7B (8GB)<br/>14B (12〜16GB)<br/>32B (24GB)</td>
              <td className="p-2 border border-gray-700">オープンウェイト最高峰のコーディングAI。Claude 3.5 Sonnetに肉薄する実力。</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-mono">SWE-bench: 33.8%<br/>LiveCodeBench上位</td>
              <td className="p-2 border border-gray-700">ローカルCursor/Cline連携、自社リポジトリ解析、コード自動生成</td>
            </tr>
            <tr className="bg-gray-850/50">
              <td className="p-2 border border-gray-700 font-bold text-amber-400">Gemma 2 / Gemma QAT (Google)</td>
              <td className="p-2 border border-gray-700">9B / 27B<br/>QAT INT4/INT8</td>
              <td className="p-2 border border-gray-700">Quantization-Aware Trainingにより4bitでもFP16同等の知能を維持。高い論理整合性。</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-mono">QAT無劣化<br/>tok/s: 60〜100</td>
              <td className="p-2 border border-gray-700">エッジデバイス常駐、正確な要約、推敲、指示追従</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-700 font-bold text-pink-400">Swallow / ELYZA / Sarashina</td>
              <td className="p-2 border border-gray-700">7B〜70B</td>
              <td className="p-2 border border-gray-700">日本語の敬語、ビジネス慣習、法令・歴史・文化的文脈に特化チューニング。</td>
              <td className="p-2 border border-gray-700 text-yellow-300 font-mono">ELYZA-tasks-100<br/>JMT-Bench高評価</td>
              <td className="p-2 border border-gray-700">日本国内向け稟議書作成、法務・行政文書、ビジネス敬語推敲</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GuidebookSection>

    <GuidebookSection title="⚙️ 最先端量子化・アーキテクチャ技術マトリクス（GGUF / GSQ-RCO / QAT / MTP / APEX）">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-800/80 p-3 rounded-lg border border-cyan-500/30">
          <div className="font-bold text-cyan-300 text-sm mb-1">① GGUF & IQ (llama.cpp / Ollama)</div>
          <p className="text-gray-300 mb-2"><strong>CPU/GPU混在オフロード対応</strong>。Macや通常PCの標準形式。</p>
          <ul className="space-y-1 text-[11px] text-gray-400">
            <li><strong className="text-white">Q4_K_M:</strong> 圧縮率50%、精度低下0.5%以内の黄金バランス。</li>
            <li><strong className="text-white">IQ4_XS / IQ3_M:</strong> 重要度マトリクス量子化。さらにVRAM圧縮。</li>
            <li><strong className="text-white">Q8_0:</strong> FP16とほぼ同等の最高品質。</li>
          </ul>
        </div>
        <div className="bg-gray-800/80 p-3 rounded-lg border border-emerald-500/30">
          <div className="font-bold text-emerald-300 text-sm mb-1">② GSQ-RCO (ISTA-DASLab)</div>
          <p className="text-gray-300 mb-2"><strong>2〜3bit超極限低ビット量子化</strong>。ガンベル・ソフトマックスとリーマン拘束最適化。</p>
          <ul className="space-y-1 text-[11px] text-gray-400">
            <li><strong className="text-white">スカラ量子化の限界突破:</strong> ベクトル量子化級の精度をスカラ形式で実現。</li>
            <li><strong className="text-white">2〜3 bpw:</strong> 27B〜35Bモデルが8〜10GB程度のVRAMで稼働可能に。</li>
          </ul>
        </div>
        <div className="bg-gray-800/80 p-3 rounded-lg border border-purple-500/30">
          <div className="font-bold text-purple-300 text-sm mb-1">③ MTP (Multi-Token Prediction)</div>
          <p className="text-gray-300 mb-2"><strong>投機的複数トークン予測</strong>。1回のフォワードで2〜4トークンを先行生成。</p>
          <ul className="space-y-1 text-[11px] text-gray-400">
            <li><strong className="text-white">推論速度1.5〜2.5倍:</strong> メモリ帯域幅がボトルネックの環境で爆発的効果。</li>
            <li><strong className="text-white">KAT-Coder / Ornith:</strong> エージェントコーディングで特に大きな恩恵。</li>
          </ul>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-900/90 p-2.5 rounded border border-blue-500/30 text-xs text-blue-200">
          🔹 <strong>QAT (Quantization-Aware Training):</strong> 事後量子化（PTQ）と異なり、学習段階で量子化ノイズを適応させるため、INT4量子化でもパープレキシティがFP16から悪化しません（Gemma公式推奨）。
        </div>
        <div className="bg-gray-900/90 p-2.5 rounded border border-amber-500/30 text-xs text-amber-200">
          💡 <strong>超長文時のKVキャッシュ量子化:</strong> 32k〜128kトークンを展開するとKVキャッシュだけでVRAMが十数GB枯渇します。推論起動時に <code>--cache-type-k fp8 --cache-type-v fp8</code> を指定し、メモリを最大70%節約。
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="📊 実機ベンチマーク・性能検証 4大指標と測定法">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <div className="font-bold text-white text-sm mb-1">1. 速度指標 (tok/s & TTFT)</div>
          <p className="text-gray-300 mb-1">・<strong>tok/s (Tokens per Second):</strong> 生成スピード。実用目安は20〜30 tok/s以上。</p>
          <p className="text-gray-300 mb-1">・<strong>TTFT (Time To First Token):</strong> プロンプトを入力してから最初の1文字が出るまでの遅延時間。</p>
          <p className="text-gray-400 text-[11px]">※メモリ帯域幅（RTX 4090: 1,008 GB/s vs M3 Max: 400 GB/s）が生成速度の物理上限を決定します。</p>
        </div>
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <div className="font-bold text-white text-sm mb-1">2. VRAM消費量 推定計算式</div>
          <div className="bg-gray-950 p-2 rounded font-mono text-[11px] text-cyan-300 mb-1">
            必要VRAM(GB) ≒ パラメータ数(B) × (bit数 / 8) × 1.2
          </div>
          <p className="text-gray-300 text-[11px]">
            例: 70Bモデルを4bit量子化 → 70 × 0.5 × 1.2 ＝ <strong>約42GB</strong>（VRAM 24GB×2枚 または Mac 64GB/128GBで稼働）。
          </p>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🛠️ Unsloth LoRA/QLoRA 高速チューニング＆アライメント（DPO/GRPO）">
      <div className="bg-gray-800/80 p-3 rounded-lg border border-purple-500/20 text-xs space-y-2">
        <div className="font-bold text-purple-300 text-sm">少量の自社データ・専門ドメインで自分専用LLMを鍛える</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
          <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
            <strong className="text-cyan-300">① LoRAの原理:</strong> 元の巨大な重み行列を凍結し、微小な低ランク行列（Rank 16〜64）のみを学習。パラメータ数を0.1%に圧縮。
          </div>
          <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
            <strong className="text-emerald-300">② Unslothの破壊力:</strong> 手書きGPUバックプロパゲーションにより、VRAM消費を最大80%削減、学習速度2〜5倍。RTX 3060/4060 (12GB) でも8B〜14Bが学習可能。
          </div>
          <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
            <strong className="text-yellow-300">③ DPO & GRPO:</strong> 報酬モデルを作らず「好ましい回答/好ましくない回答」から直接最適化するDPOと、DeepSeek-R1で話題の強化学習GRPO。
          </div>
        </div>
      </div>
    </GuidebookSection>

    <GuidebookSection title="🎬 「ローカルLLMベンチマーク・検証してみた」プロモ・企画・構成・コンテンツ化・仕組み化・実践・スーパーバイズ完全体系">
      <div className="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 p-4 rounded-lg border border-emerald-500/40 text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <div className="font-bold text-emerald-300 text-sm">【8大フェーズ実行フレームワーク】個人日記で終わらせず、月間数十万PV・登録者激増・自社技術ブランディング・有料Note・法人コンサル案件獲得へ繋げる</div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono">End-to-End Supervised</span>
        </div>

        {/* Phase 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-800/90 p-3 rounded border border-gray-700">
            <span className="font-bold text-red-400 block text-xs mb-1">Phase 1: 企画・ポジショニング設計 (Planning & Narrative)</span>
            <ul className="space-y-1 text-[11px] text-gray-300 list-disc list-inside">
              <li><strong>対立軸（Versus構図）の設定:</strong> 「月額3,000円ChatGPT Plus vs 無料ローカルQwen 2.5-Coder」「RTX 4090 vs M4 Max 帯域頂上決戦」。</li>
              <li><strong>SEO・検索ボリューム最適化:</strong> 「DeepSeek-R1 ローカル」「Ollama 使い方」「RTX 4060 VRAM限界」等の高需要キーワードを網羅。</li>
              <li><strong>BtoB・ギーク訴求:</strong> 「自社専用秘匿LLM」「Unsloth LoRA チューニング」「vLLM AWQ」で高単価相談を獲得。</li>
            </ul>
          </div>

          <div className="bg-gray-800/90 p-3 rounded border border-gray-700">
            <span className="font-bold text-blue-400 block text-xs mb-1">Phase 2: 実践・実機ベンチマーク測定プロトコル (Empirical Testing)</span>
            <ul className="space-y-1 text-[11px] text-gray-300 list-disc list-inside">
              <li><strong>環境完全開示:</strong> GPU型番・VRAMバス幅・メモリ帯域幅（GB/s）、推論エンジン（Ollama/vLLM/LM Studio）、量子化ビット。</li>
              <li><strong>定量4大指標同時ログ:</strong> TTFT（初速ms）、tok/s（実測値 vs メモリ帯域理論値）、VRAMピーク（GB）、KVキャッシュ節約量。</li>
              <li><strong>定性3本勝負:</strong> ①推論思考（DeepSeek-R1の&lt;think&gt;挙動） ②難関コード（Python・SWE-bench） ③日本語ビジネス敬語・要約。</li>
            </ul>
          </div>
        </div>

        {/* Phase 3 & 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-800/90 p-3 rounded border border-gray-700">
            <span className="font-bold text-amber-400 block text-xs mb-1">Phase 3: 構成・ストーリーテリング (Scripting & Structuring)</span>
            <ul className="space-y-1 text-[11px] text-gray-300 list-disc list-inside">
              <li><strong>Hook（0〜15秒）:</strong> 「結論から言います。RTX 4090でDeepSeek-R1を動かしたら手元でo1が爆走しました」＋実測画面。</li>
              <li><strong>Why Now & Setup:</strong> なぜ今ローカルなのか（月額ゼロ・秘匿性）。検証環境の透明な開示。</li>
              <li><strong>The Showdown:</strong> 速度・難問ロジック・実務タスクの3番勝負をリアルタイム横並び比較。</li>
              <li><strong>Pitfalls & Tuning:</strong> 「普通に動かすとVRAM爆死」からKVキャッシュfp8/LoRAでの解決を見せる専門性。</li>
              <li><strong>Verdict:</strong> 予算・環境（8GB/16GB/24GB）別の推奨処方箋とCTA。</li>
            </ul>
          </div>

          <div className="bg-gray-800/90 p-3 rounded border border-gray-700">
            <span className="font-bold text-emerald-400 block text-xs mb-1">Phase 4: プロモーション・マルチ展開 (Omni-Channel Promotion)</span>
            <ul className="space-y-1 text-[11px] text-gray-300 list-disc list-inside">
              <li><strong>YouTube長尺（10〜15分）:</strong> ターミナル操作、グラフ比較、実機解説の完全版。</li>
              <li><strong>Shorts / TikTok（60秒）:</strong> 「ゲーミングPCでAI動かしたら爆速すぎたw」tok/sハイライト。</li>
              <li><strong>X (Twitter) 図解ツリー:</strong> 比較表画像＋重要結論＋Note/YouTubeへの動線。</li>
              <li><strong>Note / Qiita / Zenn:</strong> コマンドライン、Modelfile、Pythonコード、数値詳細。</li>
              <li><strong>GitHub:</strong> 自動ベンチマークスクリプト・再現手順を公開して信頼獲得。</li>
            </ul>
          </div>
        </div>

        {/* Phase 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-800/90 p-3 rounded border border-gray-700">
            <span className="font-bold text-purple-400 block text-xs mb-1">Phase 5: 仕組み化・自動化運用 (Systematization & Automation)</span>
            <ul className="space-y-1 text-[11px] text-gray-300 list-disc list-inside">
              <li><strong>自動測定パイプライン:</strong> Python + `ollama-python` / `vLLM` で同一プロンプト群を一括投入し、TTFT/tok/s/VRAMをCSV出力。</li>
              <li><strong>制作テンプレ化:</strong> OBS比較レイアウト（左:モデルA、右:モデルB、下:速度計）、Figmaサムネイルテンプレ。</li>
              <li><strong>週次リリース枠:</strong> 毎週金曜日に「Hugging Face今週の神モデル（DavidAU, HauHau, KAT-Coder等）」を速報検証。</li>
            </ul>
          </div>

          <div className="bg-gray-800/90 p-3 rounded border border-gray-700">
            <span className="font-bold text-pink-400 block text-xs mb-1">Phase 6: コンテンツマネタイズ・事業化ファネル (Monetization Funnel)</span>
            <ul className="space-y-1 text-[11px] text-gray-300 list-disc list-inside">
              <li><strong>無料フロント:</strong> YouTube・X・無料Noteで認知と圧倒的技術信頼を獲得。</li>
              <li><strong>有料ミドル (980〜2,980円):</strong> 有料Note「ローカルLLM環境構築＆自社データLoRAチューニング完全マニュアル」。</li>
              <li><strong>高単価バックエンド (30〜100万円):</strong> 法人向け社内セキュアLLM導入コンサル、GPUマシン選定・社内サーバー構築代行。</li>
            </ul>
          </div>
        </div>

        {/* Phase 7 & 8: Supervision Checklist */}
        <div className="bg-gray-950/90 p-3 rounded border border-emerald-500/50">
          <div className="font-bold text-emerald-300 text-xs mb-2 flex items-center gap-1">
            <span>🛡️ Phase 7 & 8: 実践・品質管理・スーパーバイズチェックリスト (Supervision Checklist)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-gray-300">
            <div className="bg-gray-900 p-2 rounded border border-gray-800">
              <strong className="text-cyan-300">① 再現性と公平性の担保:</strong>
              <p className="text-gray-400 text-[10px] mt-0.5">読者が同じ結果を出せるか？OS・ドライバ・量子化ビット（Q4 vs Q8）に意図的な有利不利はないか？</p>
            </div>
            <div className="bg-gray-900 p-2 rounded border border-gray-800">
              <strong className="text-amber-300">② ライセンスと倫理順守:</strong>
              <p className="text-gray-400 text-[10px] mt-0.5">モデルの商用利用規約を確認したか？アンセンサード（HauHau/HuiHui）を扱う際、危険物や違法行為の生成を煽っていないか？</p>
            </div>
            <div className="bg-gray-900 p-2 rounded border border-gray-800">
              <strong className="text-emerald-300">③ 一次情報・生ログ主義:</strong>
              <p className="text-gray-400 text-[10px] mt-0.5">ネットの評判を鵜呑みにせず、「手元のマシンで実測したターミナル画面とログ」を根拠に語っているか？</p>
            </div>
          </div>
        </div>
      </div>
    </GuidebookSection>
  </>
);

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  isOpen,
  onClose,
  knowledgeList,
  onSaveKnowledge,
  onDeleteKnowledge,
  onResetKnowledge,
  initialTab = 'knowledgeBase',
}) => {
  const [activeTab, setActiveTab] = useState<'knowledgeBase' | 'hyperExpert' | 'localLlm' | 'creativePipeline' | 'techFunnel' | 'harmFunnel' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing'>(initialTab);

  const TabButton: React.FC<{
    tabId: 'knowledgeBase' | 'hyperExpert' | 'localLlm' | 'creativePipeline' | 'techFunnel' | 'harmFunnel' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing';
    title: string;
    badge?: string;
  }> = ({ tabId, title, badge }) => (
     <button
        onClick={() => setActiveTab(tabId)}
        className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === tabId
            ? 'bg-gray-800 text-white font-bold border-b-2 border-purple-500'
            : 'bg-gray-900 text-gray-400 hover:bg-gray-750 hover:text-white'
        }`}
     >
        <span>{title}</span>
        {badge && (
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700">
            {badge}
          </span>
        )}
     </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ナレッジベース＆ガイドブック">
       <div className="flex justify-between items-center border-b border-gray-700 mb-4 overflow-x-auto">
        <div className="flex">
            <TabButton tabId="knowledgeBase" title="📚 ナレッジ管理・PDF取込" badge={`${knowledgeList.length}件`} />
            <TabButton tabId="hyperExpert" title="🔮 超高次元Expert (PATH OS)" badge="新次元" />
            <TabButton tabId="localLlm" title="💻 ローカルLLM・検証・量子化" badge="HOT" />
            <TabButton tabId="creativePipeline" title="🎬 AI動画・画像・アバター制作" badge="NEW" />
            <TabButton tabId="techFunnel" title="🚀 AI・テック演者事業ファネル" />
            <TabButton tabId="harmFunnel" title="🔮 占い×HARM聖域ファネル" />
            <TabButton tabId="githubReadme" title="🐙 GitHub README & 導入" />
            <TabButton tabId="appUsage" title="🚀 アプリの使い方" />
            <TabButton tabId="llmIntegration" title="⚡ マルチLLM & PC連携" />
            <TabButton tabId="systemInstruction" title="🧠 システム設定活用術" />
            <TabButton tabId="loveMarketing" title="💖 恋愛マーケティング理論" />
        </div>
       </div>
      <div className="max-h-[72vh] overflow-y-auto pr-1">
        {activeTab === 'knowledgeBase' && (
          <KnowledgeManager
            knowledgeList={knowledgeList}
            onSaveKnowledge={onSaveKnowledge}
            onDeleteKnowledge={onDeleteKnowledge}
            onResetKnowledge={onResetKnowledge}
          />
        )}
        {activeTab === 'hyperExpert' && <HyperExpertGuide />}
        {activeTab === 'localLlm' && <LocalLlmGuide />}
        {activeTab === 'creativePipeline' && <CreativePipelineGuide />}
        {activeTab === 'techFunnel' && <TechFunnelGuide />}
        {activeTab === 'harmFunnel' && <HarmFunnelGuide />}
        {activeTab === 'githubReadme' && <GitHubReadmeGuide />}
        {activeTab === 'appUsage' && (
          <AppUsageGuide
            onClose={onClose}
            onGoToKnowledge={() => setActiveTab('knowledgeBase')}
          />
        )}
        {activeTab === 'llmIntegration' && <LLMIntegrationGuide />}
        {activeTab === 'systemInstruction' && <SystemInstructionGuide />}
        {activeTab === 'loveMarketing' && <LoveMarketingGuide />}
      </div>
    </Modal>
  );
};
