import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { KnowledgeItem } from '../types';
import { KnowledgeManager } from './KnowledgeManager';
import { GitHubReadmeGuide } from './GitHubReadmeGuide';
import { ICONS } from '../constants';

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeList: KnowledgeItem[];
  onSaveKnowledge: (item: KnowledgeItem) => void;
  onDeleteKnowledge: (id: string) => void;
  onResetKnowledge: (items: KnowledgeItem[]) => void;
  initialTab?: 'knowledgeBase' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing';
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

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  isOpen,
  onClose,
  knowledgeList,
  onSaveKnowledge,
  onDeleteKnowledge,
  onResetKnowledge,
  initialTab = 'knowledgeBase',
}) => {
  const [activeTab, setActiveTab] = useState<'knowledgeBase' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing'>(initialTab);

  const TabButton: React.FC<{
    tabId: 'knowledgeBase' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing';
    title: string;
    badge?: string;
  }> = ({ tabId, title, badge }) => (
     <button
        onClick={() => setActiveTab(tabId)}
        className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === tabId
            ? 'bg-gray-800 text-white font-bold border-b-2 border-blue-500'
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
