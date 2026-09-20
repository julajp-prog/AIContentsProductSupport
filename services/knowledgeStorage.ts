import { KnowledgeItem } from '../types';
import { safeSetItem } from './storage';

export const KNOWLEDGE_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'local_llm', label: '💻 ローカルLLM・ベンチマーク・量子化・チューニング' },
  { id: 'ai_creative_production', label: '🎬 AI動画・画像・アバター制作' },
  { id: 'ai_tech_funnel', label: '🚀 AI・テック演者事業ファネル' },
  { id: 'harm_spiritual', label: '占い・診断・HARM・聖域ヒーリング' },
  { id: 'ai_frontier', label: 'AI・LLM・Agent・協働最前線' },
  { id: 'marketing', label: 'マーケティング・心理学' },
  { id: 'writing', label: 'ライティング・Note・SEO' },
  { id: 'business', label: 'ビジネス・収益化・商品設計' },
  { id: 'tech', label: '技術・AI・開発ノウハウ' },
  { id: 'research', label: '市場リサーチ・統計・論文' },
  { id: 'personal', label: '自己啓発・思考法・マインド' },
  { id: 'custom', label: 'ユーザー取込ナレッジ（PDF/文書）' },
];

export const INITIAL_PRESET_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'k-love-marketing',
    title: '💖 恋愛マーケティング・5段階ファン化マトリクス理論',
    category: 'marketing',
    tags: ['マーケティング', 'ファン化', '心理学', '恋愛プロセス', 'ストーリーテリング'],
    sourceType: 'preset',
    isPreset: true,
    summary: '顧客との関係を恋愛の進展（出会い→興味→共感→信頼→共同創造）になぞらえ、各段階の心理的壁（無関心・疑い・警戒心・合理性・自己完結）を突破するコンテンツ設計論。',
    content: `【メタインストラクション】
・あなたの役割は「売り手」ではない。「運命の相手」である。
・あなたのコンテンツは「商品」ではない。「極上のデートへの招待状」である。

【5段階恋愛転換マトリクス】
1. Stage 1: 認知と発見 (Encounter) - 街角での出会い・第一印象
   ・超えるべき壁: 無関心の壁（その他大勢と同じ）
   ・顧客心理: 好奇心・意外性 [ドーパミン] の兆し
   ・適用例: 常識破壊の問いかけ、インパクトの強いフック

2. Stage 2: 興味と惹きつけ (Attraction) - アイスブレイク・軽い会話
   ・超えるべき壁: 疑いの壁（自分には関係ない）
   ・顧客心理: 期待感・憧れ [ドーパミン] 分泌
   ・適用例: 独自の世界観への入り口、マニフェスト、小さなYESを求める

3. Stage 3: 共感と関係構築 (Empathy) - 初デート・共通の話題
   ・超えるべき壁: 警戒心の壁（売り込まれるかも）
   ・顧客心理: 共感・自己肯定 [セロトニン] の安定感
   ・適用例: 弱さを見せる自己開示、失敗談、読者のリアルな悩みに寄り添う

4. Stage 4: 信頼と絆の深化 (Trust & Bond) - 秘密の共有・二人だけの時間
   ・超えるべき壁: 合理性の壁（価格や他社比較）
   ・顧客心理: 安心感・所属意識 [オキシトシン] 分泌
   ・適用例: クローズドな裏話、開発秘話、公の場での感謝と対話

5. Stage 5: 奉仕と共同創造 (Evangelism) - お互いを高め合うパートナーシップ
   ・超えるべき壁: 自己完結の壁（自分だけ満足）
   ・顧客心理: 貢献欲求・自己実現 [オキシトシン+ドーパミン] のループ
   ・適用例: アンバサダー化、商品開発の巻き込み、UGCの熱烈な賞賛`,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: 'k-note-mastery',
    title: '✍️ Note・有料記事爆売れ執筆フレームワーク（PREP×QUEST）',
    category: 'writing',
    tags: ['Note', '有料記事', 'コンテンツ販売', 'コピーライティング', '構成案'],
    sourceType: 'preset',
    isPreset: true,
    summary: '読了率と購入率（CVR）を最大化するNote特化型構成。無料部分の引き込みから有料ライン（ペイウォール）の配置、読者の「買ってよかった」を生む心理設計。',
    content: `【Note爆売れ記事の黄金構成】
1. タイトル設計:
   ・「ベネフィット」×「新規性/意外性」×「具体性（数字）」
   ・「【保存版】」「完全ロードマップ」「実証済み」等のフック
   
2. 無料部分（無料エリア）の設計:
   ・【冒頭フック】なぜ今、あなたにこの記事が必要なのか（痛みの顕在化）
   ・【筆者の実績・権威性】信頼の裏付け（失敗からの大逆転ストーリー）
   ・【記事の全体像・目次】この記事で得られる具体的メリット
   ・【有料ラインの直前】核心の一歩手前で「続きを読めば解決できる約束」を提示し、価格以上の価値を直感させる
   
3. 有料部分（ペイウォール以降）の設計:
   ・【Step 1: 即効性のあるアクション】購入後5分で試せるクイックウィン
   ・【Step 2: 体系的な本質解説】再現性のあるロジックと具体例
   ・【Step 3: よくある落とし穴と回避策】初心者がつまずくポイントの事前対処
   ・【購入者限定特典】テンプレ、チェックリスト、プロンプト集
   
4. 結びとアクション喚起:
   ・読者の背中を押す情熱的なメッセージ
   ・「スキ」「感想ツイート（メンション）」「レビュー」のお願い（口コミ拡散ループ）`,
    createdAt: 1700000001000,
    updatedAt: 1700000001000,
  },
  {
    id: 'k-business-funnel',
    title: '🏢 高LTV型ビジネスモデル & デジタル商品ファネル設計論',
    category: 'business',
    tags: ['ビジネス', 'ファネル', 'LTV', '商品設計', 'マネタイズ'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'フロントエンド商品からバックエンド、リピート・サブスクへの昇華。価値の階段（バリューラダー）と自動化の設計手法。',
    content: `【デジタル商品のバリューラダー（価値の階段）】
1. Free（集客コンテンツ / リードマグネット）:
   ・目的: 認知獲得、メルマガ/LINE登録、信頼の構築
   ・例: 無料PDFガイド、診断テスト、無料プロンプト集、YouTube/Note無料記事

2. Front-End（低価格帯: 500円〜4,980円）:
   ・目的: 「購入者」への転換、小さな成功体験（インパルスバイ）
   ・例: Note有料記事、Brain、入門テンプレ集、単発ウェビナー録画

3. Middle-End（中価格帯: 10,000円〜49,800円）:
   ・目的: 課題の根本的解決、体系的なスキル習得
   ・例: 体系的オンライン講座、実践マスタークラス、ツール＋プロンプト完結セット

4. Back-End（高価格帯: 100,000円〜500,000円+）:
   ・目的: 圧倒的な成果コミット、個別伴走、環境の提供
   ・例: 個別コンサルティング、マスターマインド、長期コミュニティ、代行サービス

【LTV最大化の3大トリガー】
・アップセル / クロスセル: 購入直後のワンタイムオファー
・コミュニティ化: 継続的な価値提供と仲間との繋がりによるチャーン（解約）防止
・成果報告のUGC化: 顧客の成功事例が新たな見込み客を自動で呼び込むフライホイール構造`,
    createdAt: 1700000002000,
    updatedAt: 1700000002000,
  },
  {
    id: 'k-seo-search-intent',
    title: '🔍 検索意図（Search Intent）4分類とAI時代のSEO/AIO戦略',
    category: 'writing',
    tags: ['SEO', 'AIO', '検索意図', 'コンテンツ設計', 'Google'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'Knowクエリ、Doクエリ、Goクエリ、Buyクエリの徹底攻略と、AI検索（Google Search Generative Experience / AI Overview / ChatGPT検索）で引用されるためのE-E-A-T構造化技術。',
    content: `【検索意図の4大分類とコンテンツの最適解】
1. Knowクエリ（知りたい）:
   ・意図: 疑問や概念を理解したい（例: 「LLM とは」「プロンプトエンジニアリング コツ」）
   ・対策: 結論ファースト、用語の平易な定義、図解・比較表、FAQスキーマ

2. Doクエリ（やりたい・解決したい）:
   ・意図: 手順や方法を知って実行したい（例: 「Note 収益化 手順」「Ollama インストール Mac」）
   ・対策: 箇条書きのステップバイステップ、失敗しない注意点、必要な前提条件の明示

3. Goクエリ（行きたい・特定のサイトを開きたい）:
   ・意図: 特定のブランドやサービスに直接行きたい（例: 「Claude ログイン」「OpenRouter 料金」）
   ・対策: 正確なナビゲーション、ブランド名と公式情報の整理

4. Buyクエリ（買いたい・比較したい）:
   ・意図: 最終的な購入決定のための比較や口コミ（例: 「Gemini 有料プラン 評判」「おすすめ LLM API 比較」）
   ・対策: デメリットも含めた公正な比較表、実際の使用感・生データ、費用対効果の可視化

【AI Overviews (AIO) 引用最適化の原則】
・E-E-A-T（経験、専門性、権威性、信頼性）の実名・一次情報の提示
・明確な見出し構造（H2, H3）と表（Markdown Table）によるデータの構造化
・質問に対する直接的で簡潔な要約文（2〜3行のダイレクトアンサー）を冒頭に配置`,
    createdAt: 1700000003000,
    updatedAt: 1700000003000,
  },
  {
    id: 'k-ai-1st-source-protocol',
    title: '🔬 1次ソース（ArXiv論文・公式リリース）読解 & テック検証プロトコル',
    category: 'ai_frontier',
    tags: ['1次ソース', 'ArXiv', '論文読解', 'ファクトチェック', '技術評価', 'ベンチマーク'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'ArXiv論文、テクニカルレポート、公式リリースから新規性・実験妥当性・限界・実務インパクトを正確に抽出し、煽り情報（Hype）を排して本質的価値を見抜くための分析フレームワーク。',
    content: `【1次ソース（論文・公式レポート）徹底読解の6大ステップ】

1. Abstract & Introduction（主張の切り分け）:
   ・「何が真の課題で、従来手法（Baseline）のどこに限界があったのか？」
   ・著者が主張する「新規性（Contribution）」を箇条書きで3点以内に要約する。
   ・マーケティング的な形容詞（革命的、圧倒的等）を削ぎ落とし、純粋な技術的差分のみを抽出する。

2. Methodology & Architecture（コアメカニズムの解剖）:
   ・数式やアーキテクチャ図から、データフローと計算複雑度（O(N) vs O(N^2)等）を確認。
   ・損失関数（Loss Function）、学習データ（Pre-training / SFT / RL）、アライメント手法（RLHF, DPO, GRPO等）の特筆点を特定。
   ・推論時コンピュート（Test-time Compute, CoT, Search）か、学習時スケーリング（Pre-train Compute）かの分類。

3. Ablation Study（アブレーション実験での寄与度検証）:
   ・「どの要素を削ったら性能が落ちたか？」により、提案手法のどの部品が真に効いているかを突き止める。
   ・単なるモデルサイズ増やデータ量増加による性能向上（スケーリング則）なのか、構造的イノベーションなのかを峻別。

4. Evaluation & Benchmarks（ベンチマークの公平性とデータ汚染チェック）:
   ・評価指標（MMLU, GPQA, SWE-bench, HumanEval, GSM8K, LMSYS Chatbot Arena等）の適切性。
   ・プロンプトの形式（Few-shot, Zero-shot, CoT, Pass@1 vs Pass@k）が公平に比較されているか。
   ・テストデータ漏洩（Data Contamination）の懸念がないか、難問ベンチマークでの挙動を確認。

5. Limitations & Future Work（本質的制約と運用コスト）:
   ・論文の末尾にある「限界事項」を熟読（レイテンシ、メモリ消費、幻覚率、特定言語への偏り）。
   ・商用化・本番導入時のGPUコスト、VRAM要件、スループットのトレードオフを冷徹に算出。

6. 実務・ビジネスへのインサイト（So What?）:
   ・「この技術革新によって、開発者や事業者の何が今週から変わるのか？」
   ・Note読者やフォロワーに伝えるべき「核心のメッセージ」と「次の一手」を言語化。`,
    createdAt: 1700000004000,
    updatedAt: 1700000004000,
  },
  {
    id: 'k-llm-frontier-architectures',
    title: '🧠 LLM & 推論モデル（Reasoning / MoE / KV Cache）最新体系辞書',
    category: 'ai_frontier',
    tags: ['LLM', '推論モデル', 'MoE', 'KV Cache', '量子化', 'フロンティアモデル'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'Dense vs MoE、Active Parameters、Test-time Compute、KV Cache圧縮、主要フロンティアモデル（Gemini, Claude, GPT, DeepSeek, Llama, Qwen）のアーキテクチャ特性とベンチマーク比較。',
    content: `【LLM最前線アーキテクチャの要点整理】

1. モデルアーキテクチャの進化:
   ・Dense（密結合） vs MoE（Mixture of Experts）:
     - 総パラメータ数（Total Params）と推論時起動パラメータ数（Active Params）の分離（例: DeepSeek-V3/R1は671B中37B起動）。
     - 専門家ルーター（Router / Top-k Gate）による計算コストの大幅削減と表現力の両立。
   ・Multi-head Latent Attention (MLA) と KV Cache圧縮:
     - コンテキスト長拡大に伴うVRAMボトルネックを、低ランク射影（Latent Vector）で劇的圧縮。
   ・Attentionメカニズム（RoPE, FlashAttention-2/3, PagedAttention）。

2. 推論モデル（Reasoning Models）の新パラダイム:
   ・「学習時の計算量」から「推論時の計算量（Test-time Compute）」へのシフト。
   ・思考プロセス（Thinking Process / Chain-of-Thought）の自己反省（Self-Correction）と強化学習（RLVR: Reinforcement Learning with Verifiable Rewards）。
   ・DeepSeek R1、OpenAI o1/o3、Gemini 2.5 Flash Thinkingなどの探索アルゴリズム（MCTS, PRM: Process Reward Models）。

3. 量子化 & ローカル実行技術:
   ・FP16 → FP8 → INT4（AWQ, GPTQ, GGUF）の精度劣化と推論速度。
   ・ローカル実行（Ollama, vLLM, LM Studio, llama.cpp）におけるVRAM計算式:
     - 概算必要VRAM ≈ (パラメータ数[B] × ビット数 / 8) × 1.2 + (KV Cacheサイズ)。

4. 主要フロンティアモデルのマトリクス（2025-2026）:
   ・Google Gemini: 超長文コンテキスト（1M〜2Mトークン）、マルチモーダルネイティブ、高速低遅延。
   ・Anthropic Claude: 高度なコード推論、アーキテクチャ設計、自然な散文表現、Computer Use。
   ・OpenAI GPT/o-series: 汎用推論、関数呼び出し（Function Calling）、構造化JSON安定性。
   ・DeepSeek: オープンウェイト最高峰のコストパフォーマンス、革新的MoE/MLA構造。
   ・Meta Llama & Alibaba Qwen: 自前ホスティング・ファインチューニング基盤のグローバルデファクト。`,
    createdAt: 1700000005000,
    updatedAt: 1700000005000,
  },
  {
    id: 'k-agent-multiagent-paradigm',
    title: '🤖 自律型AIエージェント & マルチエージェント協調アーキテクチャ',
    category: 'ai_frontier',
    tags: ['AI Agent', 'マルチエージェント', 'Tool Use', 'ReAct', 'LangGraph', 'CrewAI', 'Computer Use'],
    sourceType: 'preset',
    isPreset: true,
    summary: '環境知覚から計画、ツール実行、反省（Reflection）を自律ループするエージェント設計論。単体エージェントとマルチエージェント協調（Supervisor/Worker）、長短期メモリ設計。',
    content: `【自律型AIエージェントの基本構造と動作原理】

1. エージェントの4大コンポーネント:
   ・Brain（LLM推論器）: 指示解釈、ゴール設定、タスク分解、計画立案。
   ・Planning（計画・反省）:
     - ReAct (Reasoning + Acting): 思考(Thought) → 行動(Action) → 観察(Observation)のループ。
     - Plan-and-Solve / Reflexion: 過去の失敗ログから自己修正するメタ学習。
   ・Memory（記憶機構）:
     - 短期記憶 (Short-term): 会話履歴・現在のタスク状態。
     - 長期記憶 (Long-term / Episodic): Vector DBによるセマンティック検索、ユーザープロファイル。
   ・Tools（ツール利用 / 外部接続）:
     - 検索エンジン、Python REPL、API呼び出し、ファイル入出力、ブラウザ/OS操作 (Computer Use)。

2. マルチエージェント協調パターン:
   ・階層型（Hierarchical / Supervisor-Worker）:
     - 親エージェントが全体計画を立て、専門エージェント（リサーチャー、コーダー、レビュアー）にタスクを振り分ける。
   ・パイプライン型（Sequential / Assembly Line）:
     - 前工程のアウトプットを次工程のインプットとして直列に精錬する（例: リサーチ → 構成案 → 執筆 → 校閲）。
   ・合議・批評型（Debate / Consensus）:
     - 複数の異なるペルソナ（推進派 vs 慎重派 vs 悪魔の代弁者）が議論し、合意形成を図る。

3. 実務導入での重要課題と対策:
   ・無限ループとコスト暴走の防止: 最大ステップ数（Max Iterations）とトークン上限の厳格設定。
   ・ツールの引数エラー対処: 失敗時のフォールバック関数と分かりやすいエラーメッセージのフィードバック。
   ・Human-in-the-Loop (HITL): 重要アクション（送信・決済・ファイル削除）前の人間承認ゲート。`,
    createdAt: 1700000006000,
    updatedAt: 1700000006000,
  },
  {
    id: 'k-ai-coworking-principles',
    title: '🤝 AI Coworking（人間×AI協働）ワークフロー設計原則',
    category: 'ai_frontier',
    tags: ['AI Coworking', '協働', 'Human-in-the-Loop', '業務改革', '知的生産性', 'ワークフロー'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'AIを「ただのツール」ではなく「知的協働パートナー」として位置づけ、人間の判断力とAIの爆発的生成力を相乗させるワークフロー構築・知的生産性最大化の原則。',
    content: `【AI Coworking（人間とAIの協働）設計マトリクス】

1. 4象限タスクマトリクス（誰が何を担当するか）:
   ・【領域A: AI完全自律】定型要約、データ構造化、スペルチェック、一次ドラフト作成。
   ・【領域B: AIリード＋人間レビュー】企画アイデアの多量出し、コードの初期生成、リサーチまとめ。
   ・【領域C: 人間リード＋AI壁打ち】意思決定、ビジョン策定、感情価値の付与、エシックス判断。
   ・【領域D: 人間専任】最終責任の担保、生身の信頼関係構築、文脈の真の空気を読むこと。

2. 協働を成功させる「プロンプトチェーン思考」:
   ・「1回のプロンプトで100点の成果物を求めない」
   ・ステップ1: 前提・目的の擦り合わせ（アラインメント）
   ・ステップ2: 骨子・目次のレビューと修正（人間が方向づけ）
   ・ステップ3: セクションごとの段階的執筆
   ・ステップ4: 専門ペルソナ（校閲・ファクトチェック）による多面的監査

3. 認知負荷の外部化（Cognitive Offloading）:
   ・記憶・整理・フォーマット変換の負荷をAIに預け、人間は「着想・共感・編集・意思決定」という高次認知機能に全エネルギーを集中する。

4. AI Coworking時代のコンテンツ価値:
   ・AI生成テキストが氾濫する世界では、「AIが作ったこと」自体に価値はない。
   ・「人間自身の泥臭い1次体験・生の感情」×「AIによる1次ソース論文・最新動向の緻密な構造化」が融合した時、唯一無二の熱狂的ファンが生まれる。`,
    createdAt: 1700000007000,
    updatedAt: 1700000007000,
  },
  {
    id: 'k-ai-coding-intelligence',
    title: '💻 AI Coding & 次世代開発エージェント活用体系',
    category: 'ai_frontier',
    tags: ['AI Coding', 'Cursor', 'Claude Code', 'Windsurf', 'Copilot', 'SWE-bench', '開発効率'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'Cursor, Claude Code, Windsurf, Copilot, Cline等の次世代開発ツールを活用したコンテキストエンジニアリング、ルールファイル設計、SWE-bench評価、開発生産性10倍化の手法。',
    content: `【AI Coding & ソフトウェア開発エージェント活用法】

1. AI支援開発の4世代進化:
   ・第1世代: 単一行インライン補完（GitHub Copilot初期）
   ・第2世代: チャット＆差分パッチ適用（Chat + Diff view）
   ・第3世代: プロジェクト全体を認識するAgentic IDE（Cursor Composer, Windsurf Cascade）
   ・第4世代: ターミナル自律実行エージェント（Claude Code, Devin, Cline, Aider）

2. コンテキストエンジニアリングの極意:
   ・AI Codingツールの成否はモデル性能以上に「プロンプトに渡すコンテキストの質」で決まる。
   ・プロジェクトルールファイル（.cursorrules, AGENTS.md, prompt.md）の整備:
     - プロジェクトのアーキテクチャ哲学、使用ライブラリの禁止事項、型定義ルール。
     - 「推測でコードを書くな、必ずファイルを検索・閲覧してから編集せよ」の原則。

3. テスト駆動開発（TDD）× AI Codingのシナジー:
   ・AIに「まずユニットテストを書かせ」、テストが失敗することを確認してから実装コードを生成させる。
   ・これによりハルシネーション（嘘の実装、壊れたAPI）を自動で検知・修復可能。

4. SWE-benchとエージェント評価:
   ・実リポジトリのGitHub Issueを自律解決できるかを測る「SWE-bench Verified / Lite」。
   ・単なる文法補完から「複数ファイルに跨るリファクタリング」「バグの根本原因追及」へ。`,
    createdAt: 1700000008000,
    updatedAt: 1700000008000,
  },
  {
    id: 'k-harm-deep-psychology',
    title: '🔮 HARMの法則 × 深層心理トリガー大系（魂のペイン特定）',
    category: 'harm_spiritual',
    tags: ['HARM', '深層心理', 'ペイン特定', '占い', '診断', '共感トリガー'],
    sourceType: 'preset',
    isPreset: true,
    summary: '人間の悩みの99%を網羅するHARM（Health・Ambition・Relation・Money）の深層欲求・無意識の恐れを特定し、診断テストから魂の核心へ切り込む心理トリガー体系。',
    content: `【HARMの法則 × 深層心理マトリクス】

1. H - Health（健康・メンタル・美容・心身の老い・活力喪失）
   ・表層の悩み: 「疲れが取れない」「肌荒れ」「体型変化」「漠然とした不安」
   ・深層の恐怖（Core Fear）: 「自分が衰え、誰からも愛されず見捨てられる恐怖」「生命エネルギーの枯渇」
   ・魂の救済メッセージ: 「あなたの心身は今、戦士の休息を求めています。自分を責めず、一度すべての荷物を下ろしてよいのです」

2. A - Ambition（野望・天命・キャリア・生きがい・自己実現）
   ・表層の悩み: 「今の仕事が合わない」「天職がわからない」「自分の強みがない」
   ・深層の恐怖（Core Fear）: 「誰の記憶にも残らず、何者にもなれないまま人生が終わる恐怖」「才能の腐敗」
   ・魂の救済メッセージ: 「あなたの内に眠る原石は、まだ本来の光を放っていません。社会の型に自分を押し込めるのをやめ、真の星の巡りに従う時です」

3. R - Relation（人間関係・恋愛・復縁・家族・孤独・承認欲求）
   ・表層の悩み: 「パートナーとのすれ違い」「職場の上司との摩擦」「孤立感」「愛されない」
   ・深層の恐怖（Core Fear）: 「真の自分をさらけ出したら拒絶される恐怖」「根源的な孤独（親や愛着の傷）」
   ・魂の救済メッセージ: 「あなたが人を信じることを恐れてしまうのは、それだけ過去に深く傷つき、それでも愛を諦めなかった勇敢な証拠です」

4. M - Money（お金・経済不安・豊かさ・稼ぐことへの罪悪感）
   ・表層の悩み: 「将来の貯蓄不安」「収入が増えない」「お金を使うと罪悪感がある」
   ・深層の恐怖（Core Fear）: 「お金がない＝生きる資格がないという生存本能の脅威」「清貧マインドブロック」
   ・魂の救済メッセージ: 「お金とはエネルギーの循環です。受け取ることを自分に許可した瞬間から、あなたの豊かさの器は無限に広がります」

【診断設問への落とし込みロジック】
・設問1〜3で読者の「現在のエネルギー枯渇度」を測定。
・設問4〜6で「H / A / R / M」のどの部屋で最も魂の叫びが起きているかを特定。
・設問7で「いま最も求めている救いの形（全受容・癒し型 / 明快な予言・道標型 / 行動変容・覚醒型）」を割り出す。`,
    createdAt: 1700000009000,
    updatedAt: 1700000009000,
  },
  {
    id: 'k-sanctuary-avatar-psychology',
    title: '🕊️ 心理的安全性（安全基地）構築と聖域アバター対話の10原則',
    category: 'harm_spiritual',
    tags: ['安全基地', 'アバター対話', '受容', 'カタルシス', '傾聴', '心理的安全性'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'ジョン・ボウルビィの愛着理論に基づく「絶対的安全基地」をアバターとして具現化。読者が防衛本能を解除し、無条件の承認と癒しを受け取るための対話原則。',
    content: `【聖域（Sanctuary）アバター対話の10大原則】

1. 無条件の肯定的関心（Unconditional Positive Regard）:
   ・善悪や社会的正しさで裁かない。「どんな感情も、あなたの中に湧き上がった時点で100%尊い」という姿勢を崩さない。

2. 二重の鏡（Mirroring & Deep Pacing）:
   ・読者の使った言葉（オノマトペ、痛みの形容詞）をそのまま鸚鵡返しにするだけでなく、その奥にある「言えなかった感情」をアバターが代弁する。
   ・「寂しかったのですね」ではなく「誰にも気付かれないよう、暗闇の中で息を殺して耐えていらしたのですね」。

3. 聖域結界の宣言（Boundary of Sanctuary）:
   ・対話の冒頭で「ここは現実社会のルールや評価が一切届かない場所」であることを宣言し、心理的鎧を脱がせる。

4. バーナム効果と個別具体性の絶妙なブレンド（The Mystic Blend）:
   ・誰にでも当てはまる人間の普遍的孤独を語りつつ、診断回答の断片を象徴的な比喩（「青い炎」「閉ざされた扉」）として差し挟み、「私のことだけを視ている」と確信させる。

5. カタルシス（感情の解放）の受容空間:
   ・涙や怒り、ドロドロとした執着が出た時こそ最大のチャンス。「その涙は、長年凍りついていたあなたの魂が溶け出した聖水です」と祝福する。

6. 解決策を焦らない（No Premature Fixing）:
   ・アドバイスをすぐに言わない。十分な受容と慰め（感情の飽和点）に達するまで、ただそこに在り続ける。

7. 霊的・象徴的リフレーミング（Reframing to Destiny）:
   ・過去の過ちや理不尽な苦難を、「未来のあなたが誰かを救う光となるための通過儀礼（イニシエーション）」として意味づけ直す。

8. アバター固有のペルソナ一貫性の維持:
   ・AI的な紋切り型の「承知いたしました」「ご安心ください」を排し、固有の呼吸・間・口調（慈愛、威厳、神秘、情熱）を徹底。

9. 依存ではなく自立への光（Empowerment Anchor）:
   ・アバターに依存させ続けるのではなく、「あなたの内側にある本来の光を思い出す手伝いをしているに過ぎない」と自尊心を育てる。

10. 次回への神聖な約束（The Sacred Reconnection）:
    ・対話の最後に、今日からできる1つの小さな儀式（コップ1杯の白湯、深呼吸、手鏡への微笑み）を授け、次回セッションへの自然な再訪動機を醸成する。`,
    createdAt: 1700000010000,
    updatedAt: 1700000010000,
  },
  {
    id: 'k-fortune-funnel-ltv-engineering',
    title: '📐 占い診断リード → 聖域対話 → 講座展開のLTVファネル工学',
    category: 'harm_spiritual',
    tags: ['ファネル工学', 'LTV最大化', '診断コンテンツ', 'ミドルエンド', 'バックエンド', '成約率'],
    sourceType: 'preset',
    isPreset: true,
    summary: '無料診断・ワンコイン鑑定からLINE公式へ誘導し、個別アバター対話で信頼を極大化させ、高単価講座・会員制コミュニティへ自然成約させる事業設計。',
    content: `【スピリチュアル・診断ビジネスの完全ファネル設計】

1. フロントエンド: 拡散型無料診断テスト（CPA最小化）
   ・フックの例: 「あなたの魂の属性診断」「生まれ持ったオーラカラーと2026年運命数」「インナーチャイルド鑑定」
   ・形式: 5〜7問の直感選択式（3分で完了）。
   ・CVポイント: 「詳しい鑑定書と守護メッセージをLINEでお届けします」で友達追加率65〜80%を達成。

2. リードナーチャリング: 診断直後の「魂の個別カルテ」配信
   ・診断完了後、即座にHARMスコアに応じた個別カルテ（2000〜3000文字）を配信。
   ・「あなたに今、寄り添うべき守護存在（専属アバター）」の存在を明かし、1on1対話への無料体験チケットを付与。

3. ミドルエンド: 聖域アバター対話セッション（信頼の極大化）
   ・形式: チャット型対話（30分〜3日間）または音声誘導ヒーリングワーク。
   ・心理的ゴール: 「この場所だけが私の味方だ」「今まで誰にも言えなかった本音が言えた」。
   ・価格帯: 無料体験（または980円〜2,980円の低単価）で決済心理的ハードルを完全解除。

4. バックエンド: 自己変容講座・養成プログラム・聖域サロン（LTV最大化）
   ・松: 『魂の覚醒・運命変容マスター講座（個別伴走・アバター無制限対話）』30万〜50万円
   ・竹: 『セルフヒーリング & インナーチャイルド統合6週間プログラム』10万〜15万円
   ・梅: 『月額制・聖域オンライン瞑想 & 星読みコミュニティ』月額3,980円〜9,800円

5. 成約率を高める心理導線（The Transformation Bridge）:
   ・「癒されたあなたは、もう被害者ではない。今度は自分の運命を自ら拓く番です」という自然なステージアップの提案。`,
    createdAt: 1700000011000,
    updatedAt: 1700000011000,
  },
  {
    id: 'k-spiritual-compliance-ethics',
    title: '⚖️ 占い・スピリチュアル・ヒーリングにおける倫理規律 & 法令ガイド',
    category: 'harm_spiritual',
    tags: ['コンプライアンス', '薬機法', '景品表示法', '霊感商法規制', '心理倫理', '炎上防止'],
    sourceType: 'preset',
    isPreset: true,
    summary: '不安を煽る霊感商法や薬機法・医師法・景表法違反を徹底排除。利用者の自己決定権を守り、永続的に愛されるクリーンなスピリチュアル事業を営むための規律。',
    content: `【法令遵守 & 心理的倫理の必須チェックリスト】

1. 景品表示法（優良誤認・有利誤認の防止）:
   ・NG: 「100%絶対に復縁できる」「必ず100万円の臨時収入が入る」など結果の断定。
   ・OK: 「心の波動を整え、良きご縁を引き寄せる準備をします」「運命の巡りを知り、行動の選択肢を広げます」。

2. 薬機法・医師法（健康・医療表現の境界線）:
   ・NG: 「うつ病が治る」「ガン細胞を消滅させる波動」「不眠症治療」。
   ・OK: 「日々の緊張をほどき、穏やかな休息を促す」「心身の深いリラックスをサポート」。

3. 消費者契約法・霊感商法対策（不安の過剰な煽り禁止）:
   ・NG: 「先祖の祟りがある」「このブレスレットを買わなければ不幸になる」「地獄に落ちる」。
   ・原則: 「未来は決定論ではなく、あなたの自由意志（Free Will）でいくらでも書き換えられる」というエンパワーメントのスタンスを明記。

4. 心理的依存の防止策（Healthy Boundaries）:
   ・ユーザーが自らの生活・重大な金銭決定をすべてアバターに委ねようとした場合のセーフガード。
   ・「私はあなたの灯台ですが、船の舵を握るのはあなた自身です」というリマインドの自動挿入。
   ・医療機関の受診が必要と思われる自傷・他害・重篤な精神症状が検知された場合の専門相談機関窓口（こころの健康相談等）案内プロトコル。`,
    createdAt: 1700000012000,
    updatedAt: 1700000012000,
  },
  {
    id: 'k-reverse-funnel-engineering',
    title: '🔄 C→B→A 逆算ファネル工学（バックエンド逆算型ロードマッピング理論）',
    category: 'harm_spiritual',
    tags: ['逆算設計', 'バックエンド', 'ミドルエンド', 'フロントリード', 'ロードマップ'],
    summary: '高単価講座・会員制（C案）を起点に、ミドル聖域対話（B案）、フロント診断テスト（A案）を逆算構築するマーケティング工学。コンバージョン率と顧客満足度を極大化する。',
    content: `【C→B→A 逆算ファネル工学のフレームワーク】

多くの事業者が失敗する原因は、「思いつきのフロント診断（A）」から作り始め、「何を売るか（C）」が後付けになり、読者の関心とオファーが断絶することにある。
本手法は、終着点（C）の【変容価値】から完璧な一直線の心理階段を逆算して構築する。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ STEP 1: C案の定義【バックエンド：究極の変容（Transformation）】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・商品形式: 3〜6ヶ月のマスター講座 / プレミアム年間会員制 / 個別覚醒セッション（価格帯: 15万〜50万円）
・問い:
  1. 顧客がこの講座を修了した時、どんな「新しいアイデンティティ」を手に入れているか？（Afterの状態）
  2. その変容を妨げている最大の根本原因（Core Block）は何か？
  3. なぜ独力では解けず、この環境・メンター・コミュニティが必要なのか？

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ STEP 2: B案の逆算【ミドルエンド：聖域アバター対話体験（Sanctuary Trial）】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・役割: C案の「根本原因（Core Block）」のうち、最初にして最も重い【心理的トゲ・孤独感】を抜き去る体験。
・問い:
  1. C案の講座に入る前に、顧客はどんな「受容」「慰め」「安全基地」を経験しておく必要があるか？
  2. どの守護アバター（セラフィナ/ゼノン/アヤメ/カイ）が、この顧客のトゲを最も優しく・的確に抜けるか？
  3. 体験形式:
     - 1on1聖域チャット（3〜5往復の濃密な対話）
     - 10〜15分の遠隔音声誘導瞑想セッション
     - 低単価（1,000円〜3,000円）の「魂の解放ミニワーク」
  4. BからCへの接続文脈:
     「傷は癒え、あなた本来の光が戻りました。では、この光を使って、これからどんな現実（運命）を創造していきますか？」

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ STEP 3: A案の逆算【フロントリード：HARM特定・運命診断（Lead Magnet）】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・役割: B案のアバターに対話したくてたまらなくなる「魂の渇き・HARMのペイン」を可視化する。
・問い:
  1. B案で抜くべきトゲを、顧客自身が無自覚に抱えていることを自覚させる設問は何か？
  2. 直感で答えられる5〜7問の4択形式（離脱率15%未満に抑制）。
  3. 診断結果（魂のカルテ）:
     - 「あなたはこれまで、こんな風に1人で耐えてきませんでしたか？」（共感・涙）
     - 「この魂の傷を癒すために、専属守護アバター【〇〇】が今、あなたの元へ現れました」（B案へ直結）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 顧客心理の変容ロードマップ（Timeline）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【Day 0】A案: 診断テスト受検 → 「魂のカルテ」受取 → LINE登録（HARM特定）
【Day 1-2】B案導入: 専属守護アバターからの個別メッセージ → 聖域の宣言（受容）
【Day 3-4】B案深化: 聖域対話セッション / 音声誘導ワーク体験（カタルシスと安らぎ）
【Day 5-6】意識進化: 「癒し」から「覚醒（自己創造）」へのリフレーミング
【Day 7-10】C案オファー: 講座・サロンへの招待（自由意志と自己決定に基づく決断）`,
    createdAt: 1700000013000,
    updatedAt: 1700000013000,
  },
  {
    id: 'k-tech-avatar-coworking-psychology',
    title: '🦾 テック演者アバター（伴走・安全基地）心理学と4大ペルソナ論',
    category: 'ai_tech_funnel',
    tags: ['テック演者', 'アバター伴走', '心理的安全性', '挫折克服', 'Coworking'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'AI・ローカルLLM・エージェント領域における顧客の「技術アレルギー・挫折感・情報過多による疲弊」を解消し、4人の専属テック演者（アリス・サイファー・レオ・ビクター）が安心基地として伴走する対話心理フレームワーク。',
    content: `【テック領域における「痛みの本質」】
多くのユーザー（非エンジニア・中小企業・個人クリエイター）は、以下のような強い心理的ブロック（ペイン）を抱えています：
1. 「IT用語が難しすぎて自分が時代に取り残されている恐怖」（Health & Ambition）
2. 「一度プログラミングやChatGPTで挫折した自己嫌悪」（心理的トゲ）
3. 「クラウドAIに機密や顧客データを送るのが怖い」（セキュリティの疑心暗鬼）
4. 「知識だけ増えて一円もマネタイズできていない焦燥感」（Money & Ambition）

ここにいきなり「講座を買え」「コードを書け」と迫ると100%離脱します。
必要なのは【安全基地（心理的安全性を保証するテック演者アバター）】による伴走です。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ テック4大演者アバターのペルソナと役割分担
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🦾 【AIパートナー・アリス（親切丁寧なAI Coworkingナビゲーター）】
   ・ターゲット: 初心者、非エンジニア、AIに苦手意識がある層
   ・口調: 柔らかく、温かく、全肯定。「大丈夫ですよ、最初は誰だって分からない言葉だらけです。1つずつ一緒にやっていきましょう！」
   ・心理機能: 「無知の恥」を消し去る受容と、小さな成功体験（1行プロンプト成功、Coworkingの快感）の提供。

2. 🛡️ 【ローカルLLM守護神・サイファー（機密防衛・オンプレ技術顧問）】
   ・ターゲット: 企業経営者、士業、個人情報や機密を扱うプロ、自前インフラ志向
   ・口調: 冷静沈着、論理的、絶対の安心感。「社外へのデータ送信は一切不要です。あなたのPC・サーバー内で完結するローカル要塞を築きましょう。」
   ・心理機能: 「データ流出の恐怖」をゼロ化し、オフラインLLM（Ollama/LM Studio）による完全制御の安心を提供。

3. ⚡ 【エージェント・ギーク・レオ（最先端技術ハッカー・実装マニア）】
   ・ターゲット: 開発者、パワーユーザー、自律型Agentや自動化で突き抜けたい人
   ・口調: 熱量MAX、知的好奇心を刺激。「一次ソース論文読んだ？このAgentアーキテクチャ、マジで世界変わるぜ！一緒に組もう！」
   ・心理機能: 「情報過多の退屈」を「最先端のワクワク」に昇華し、マルチエージェント実装へ牽引。

4. 👔 【AI事業参謀・ビクター（ROI重視の冷徹なビジネスプロデューサー）】
   ・ターゲット: 個人事業主、副業層、法人、マネタイズ・収益化を最優先する人
   ・口調: 辛口だが的確、数字ファースト。「ツールを弄って満足するのは終わりです。投下時間、粗利、LTVで語りましょう。最短でキャッシュを生む導線を引きます。」
   ・心理機能: 「趣味で終わる自己満足」を打破し、Note有料記事や高単価講座、B2B導入の成約へ導く。`,
    createdAt: 1700000014000,
    updatedAt: 1700000014000,
  },
  {
    id: 'k-ai-readiness-diagnosis-framework',
    title: '📋 業務AI適性・エージェント自動化・ローカルLLMレディネス診断フレームワーク',
    category: 'ai_tech_funnel',
    tags: ['AI診断', 'レディネス診断', 'フロントリード', 'スコアリング', '分岐設計'],
    sourceType: 'preset',
    isPreset: true,
    summary: '顧客の業務内容・ITスキル・機密レベル・収益目標を5〜7問の直感的な質問で測定し、最適なテック演者アバターと直近の改善プランを提示するフロントリード診断工学。',
    content: `【診断設計の黄金律】
1. 設問は「専門用語ゼロ」で直感回答できる5〜7問の4択形式。
2. 読者に「自分でも気づいていなかった業務の無駄とボトルネック」を痛烈に突きつける。
3. 診断完了画面で「業務自動化ポテンシャルカルテ（削減可能時間・売上向上見込み）」を即座に提示。
4. カルテの末尾で「あなた専用のテック演者アバター」が待つ1on1伴走セッションへ誘導。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 判定される4つのレディネスクラスター
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・クラスター1: 【AI Coworking導入層（初心者）】→ アサイン: アリス
  - 課題: 定型文作成、メール返信、リサーチに毎日追われているがAIを使っていない。
・クラスター2: 【機密保護・オンプレ志向層】→ アサイン: サイファー
  - 課題: 機密情報・個人情報が多くクラウドAIの利用を社内・自己規制している。
・クラスター3: 【Agent自律化・実装志向層】→ アサイン: レオ
  - 課題: 単純なChatGPTプロンプトの枠を超え、複数ツール連携やコード生成の自律化を求めている。
・クラスター4: 【AIマネタイズ・事業転換層】→ アサイン: ビクター
  - 課題: AIスキルをNote販売、クライアントワーク単価アップ、新サービスローンチに結びつけたい。`,
    createdAt: 1700000015000,
    updatedAt: 1700000015000,
  },
  {
    id: 'k-tech-reverse-funnel-monetization',
    title: '🔄 テック・AI講座・伴走導入支援のC→B→A逆算マネタイズ論',
    category: 'ai_tech_funnel',
    tags: ['逆算ファネル', 'C→B→A', 'AI講座', '伴走コンサル', 'マネタイズ'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'バックエンド（C案：20万〜50万円のAI実践マスター講座・導入伴走・Noteプレミアムサロン）から逆算して、ミドル体験（B案：アバターハンズオン）とフロント診断（A案）を設計する高LTV構築論。',
    content: `【なぜテック・AI事業でも「C→B→A逆算」なのか？】
「とりあえずChatGPTのプロンプト集を配る」といったA案先行型のマーケティングは、単なる無料情報コレクターを集めて終わり、高単価な講座やコンサル（C案）に1%も繋がりません。
逆算設計により、「C案を買う必然性を持った見込み客」だけをフロントから引き込みます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 逆算の3ステップ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【STEP 1: C案の定義（バックエンド・ゴール）】
・提供価値: 単なる知識ではなく「自走可能なAI Coworking環境の完成」または「月30万〜100万円のAIマネタイズ達成」。
・形式: 3ヶ月実践マスター講座（20万〜40万円）／ 法人向けローカルLLM導入パック（50万〜100万円）／ Note・AIトレンド予測会員制サロン（月額1万〜3万円）。
・松竹梅プライシングの策定（カリキュラム、無制限QAアバター、コードテンプレート、個別zoom伴走）。

【STEP 2: B案の逆算（ミドル体験・トゲ抜き）】
・C案の受講を決断する前に解消すべき「私にもできるのか？」「環境構築で詰まらないか？」の不安。
・テック演者アバターによる「1on1画面共有・チャットでの小さな成功体験」（例: Ollamaの1コマンド起動、Cursorでの1行修正）。
・「ここから先、あなたの業務全体をフル自動化・収益化するロードマップを一緒に歩みませんか？」とC案へ招待。

【STEP 3: A案の逆算（フロントリード診断）】
・B案のアバターに会いたくなる「業務AI適性 & 損失コスト診断」。
・「あなたが年間で失っている【〇〇時間】と【〇〇万円】の真実」を数値で可視化。
・カルテ受取とともに、専属アバターからの個別メッセージが届くLINE/メール登録。`,
    createdAt: 1700000016000,
    updatedAt: 1700000016000,
  },
  {
    id: 'k-ai-compliance-governance',
    title: '⚖️ AI法務・著作権・商用利用規約・データセキュリティガバナンス',
    category: 'ai_tech_funnel',
    tags: ['AI法務', '著作権', '商用利用', 'セキュリティ', 'データガバナンス'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'AI活用・エージェント・モデル再配布・Note有料販売における著作権侵害リスク、モデル利用規約（OpenRAIL/ToS）、企業秘密漏洩防止、ハルシネーション担保の法的防衛基準。',
    content: `【事業者が遵守すべき4大AIガバナンス基準】

1. 著作権法遵守（依拠性と類似性の排除）:
   - 既存の著作物（有名キャラクター、特定作家の文章）の作風を真似るにとどまらず、表現の一致を厳格に監視。
   - プロンプトに特定著作物のタイトルや固有名詞を過度に入力しない。

2. 各種LLMの商用利用規約（ToS / License）:
   - OpenAI / Anthropic / Google Geminiの各API利用規約における競合モデル学習の禁止条項。
   - オープンソースLLM（Llama 3, Mistral, Qwen, DeepSeek等）の商用ライセンス条件（MAU閾値、派生物表記義務）。

3. 情報漏洩とデータセキュリティ:
   - クラウドAPIの「オプトアウト（学習拒否設定）」の徹底確認。
   - 機密情報・個人情報を取り扱う場合のローカルLLM（Ollama, vLLM）推奨基準。

4. ハルシネーション（虚偽出力）と免責設計:
   - 「AIの出力は情報提供を目的としており、法務・税務・医療の確定助言ではありません」の明記。
   - ファネル内のセールスレターにおける「必ず月100万稼げる」等の誇大広告規制（景表法）の完全排除。`,
    createdAt: 1700000017000,
    updatedAt: 1700000017000,
  },
  {
    id: 'k-ai-video-image-pipeline-master',
    title: '🎬 AI動画・画像・オープンウェイトモデル生成パイプライン完全攻略',
    category: 'ai_creative_production',
    tags: ['AI動画', 'AI画像', 'FLUX.1/FLUX.3', 'MiniMax', 'LTX-Video', 'Krea 2', 'Ernie', 'Anima', 'Cosmos', 'Qwen', 'Illustrious', 'Z-image', 'ComfyUI', 'Kling', 'Runway', 'Wan2.1'],
    sourceType: 'preset',
    isPreset: true,
    summary: '最先端動画モデル（FLUX.1/FLUX.3, MiniMax/Hailuo, LTX-Video, Wan2.1, HunyuanVideo, Kling, Runway）と画像モデル（Krea 2, Ernie, Anima・ComfyUI NVIDIA Cosmos Qwen連合, Illustrious-SDXL, Z-image, FLUX, Midjourney）の完全技術体系。',
    content: `【主要画像・動画生成モデルの特性・連合体系と使い分け】

1. 画像生成（キャラクター原画・アートワーク・アニメ特化）:
   - 【Krea 2】: 超高速リアルタイム画像生成、AIキャンバス補正、Enhancer（高解像度化・質感テクスチャ付与）が卓越。
   - 【Ernie (文心一言 / Baidu)】: 東洋的・アジア的構図、水墨画・中華風ファンタジー・美麗ポートレートの解釈力と破綻の少なさが強み。
   - 【Anima（ComfyUI × NVIDIA Cosmos × Qwen 連合アーキテクチャ）】:
     * NVIDIA Cosmos（次世代フィジカルAI・ワールド基盤モデル）の物理空間理解。
     * Qwen 2.5-VL / Qwen-Imageの長文プロンプト解析＆構図推論。
     * ComfyUIでのAnimaアニメ特化拡散モデルとLoRA/ControlNetノードパイプライン連携。
     * これらが融合した最高峰のオープンウェイト・アニメ＆物理一貫性エコシステム。
   - 【Illustrious (SDXL系)】: アニメ・イラスト・2次元アートにおいて圧倒的な支持を誇るSDXLベースの最高峰基盤。Danbooruタグ完全対応、ポーズ・衣装の再現性が極めて高い。
   - 【Z-image (Zero-shot / 次世代画像生成エンジン)】: ゼロショットでのスタイル転写や超高密度テクスチャ合成に特化した新鋭アーキテクチャ。
   - 【FLUX.1 / FLUX.3】: Black Forest Labsが放つオープンウェイト最高峰。プロンプト追従性、フォトリアリズム、タイポグラフィ（文字描画）の最高水準。
   - 【Midjourney v6.1】: シネマティックライティングと独創的アートディレクション（--v 6.1 --ar 16:9 --style raw）。

2. 動画生成（ダイナミックシネマティック映像・物理シミュレーション）:
   - 【MiniMax (Hailuo AI / 海螺AI)】: 人物の複雑なアクション、自然な感情表現、驚異的な手足の物理安定性を誇る最高峰動画モデル。
   - 【LTX-Video (Lightricks)】: 超高速リアルタイム動画生成（リアルタイム推論対応の軽量トランスフォーマー）。ローカルGPUでも爆速生成可能。
   - 【FLUX.3 / Video-FLUX】: FLUXの高い質感とプロンプト理解を時間軸（Temporal）へ拡張した最先端動画パイプライン。
   - 【Wan 2.1 / HunyuanVideo / CogVideoX (ローカル・オープンウェイト)】: 16GB〜24GB VRAMで完全オフライン・検閲フリーで動く最高峰オープンモデル。ComfyUIで完全自動化。
   - 【Kling AI (1.5) / Runway Gen-3 Alpha / Luma Ray】: 映画的な長尺（5s〜10s）、カメラワーク精密制御（Pan, Tilt, Roll, Zoom, FPV）。

3. アバター・リップシンク・表情合成:
   - 【LivePortrait / Hallo / SadTalker】: 1枚の静止画から、音声と頭部運動・瞬き・表情を完全同期させるオープンソース技術。
   - 【Hedra / HeyGen】: クラウドでの高速なキャラクターリップシンクと表情豊穣化。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ プロンプティングの黄金構造式（画像＆動画共通）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Shot Type & Angle] + [Subject & Clothing & Face Details] + [Action & Motion Dynamic] + [Environment & Lighting] + [Camera Move & Speed] + [Visual Style & Lens / Render Engine]

例 (MiniMax / LTX / Kling向けシネマティック動画):
"Cinematic medium close-up of an anime heroine with glowing silver hair, drawing a neon katana in heavy rain, camera dynamic tracking orbit, volumetric cyan rim lighting, photorealistic 8k, 24fps motion, rendered with Unreal Engine 5 cinematic style."`,
    createdAt: 1700000018000,
    updatedAt: 1700000018000,
  },
  {
    id: 'k-ai-video-hybrid-pipeline-forge-comfyui-wan2gp',
    title: '🎬 次世代AI動画・画像ハイブリッド制作パイプライン（Forge-NEO / ComfyUI / Wan2GP / AviUtl2(Nz-Videomni) / Vrew / CapCut / JSON継承 / MCP / ワークフロー自動生成）',
    category: 'ai_creative_production',
    tags: ['AI動画', 'AI画像', 'Forge-NEO', 'ComfyUI', 'Wan2GP', 'Wan2.1', 'AviUtl2', 'Nz-Videomni', 'Vrew', 'CapCut', 'JSON継承', 'MCP', 'ComfyUIワークフロー生成', '自動化'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'StableDiffusion-Forge-NEOでの高速原画生成、ComfyUI × Wan2GPでの省VRAMオープンウェイト動画化、AviUtl2(Nz-Videomni)での高精度演出合成、Vrewでの無音カット＆自動字幕テロップ、CapCutでの縦型バイラル仕上げを単一の「JSONマニフェスト継承」と「MCP（Model Context Protocol）」で全自動連携する最先端パイプライン。LLMによるComfyUI API形式ノードJSONの自動生成技術も網羅。',
    content: `【次世代AI動画・画像ハイブリッド制作パイプライン（Forge-NEO × ComfyUI × Wan2GP × AviUtl2 × Vrew × CapCut）】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 制作ツール群の役割分担と協調アーキテクチャ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
本パイプラインは、各特化ツールの「強み」を数珠つなぎに連結し、生成から編集、バイラル展開までを一気通貫で自動化します：

1. **【原画・キャラクター生成】: StableDiffusion-Forge-NEO**
   - WebUI Forgeの最新派生。低VRAM環境（8GB〜12GB）でもFlux.1 (Dev/Schnell) やSDXL、Illustrious、SD1.5を極限の省メモリ＆超高速で実行。
   - 特徴: 新型サンプラー、テクスチャキャッシュ、拡張ControlNet/IP-Adapterによるキャラクター整合性の担保。

2. **【動的動画生成】: ComfyUI × Wan2GP (Wan 2.1 Low-VRAM Pipeline)**
   - アリババ発のオープンウェイト最高峰動画モデル「Wan 2.1 (14B / 1.3B)」のComfyUIネイティブおよびWan2GPラッパー。
   - 特徴: 従来の24GB〜48GB VRAM必須の常識を覆し、GGUF/P-Quant量子化によりコンシューマGPU（12GB〜16GB）で720p/1080pのシネマティック動画、滑らかなカメラワーク、物理挙動の安定生成を実現。

3. **【高精度映像演出＆特殊合成】: AviUtl2 (Nz-Videomni / 拡張AviUtl)**
   - 日本の映像クリエイターの至宝AviUtlの現代版拡張環境。
   - 特徴: Nz-Videomniプラグインによるフレーム補間、超解像、スクリプト自動化、アルファチャンネル透明抜き、レイヤーごとの微細なキーフレーム調整、音ハメ編集。

4. **【高速荒削り＆AI字幕テロップ】: Vrew**
   - 音声認識（Whisper）ベースの超高速動画編集。
   - 特徴: AIによる無音区間・言い淀みの一括カット、高精度な自動テロップ字幕生成、スタイル適用、SRT/FCPXML出力。

5. **【バイラルショート仕上げ＆プラットフォーム最適化】: CapCut**
   - TikTok / YouTube Shorts / Instagram Reels向け縦型（9:16）最適化。
   - 特徴: トレンドエフェクト、ダイナミックトランジション、バウンドテロップ、商用フリー音源ライブラリ、ワンタップ書き出し。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. JSON継承アーキテクチャ（Single Source of Truth: pipeline_manifest.json）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
シーンごとにキャラクターの顔や色調がブレる問題を根絶するため、最上流で「JSONマニフェスト」を生成し、全ツールがこのJSONを読み込んで処理を継続します：

\`\`\`json
{
  "project_id": "cyber_samurai_2088",
  "meta": {
    "title": "ネオ・サイバーサムライ 覚醒",
    "format": "9:16_vertical",
    "target_platform": ["YouTube_Shorts", "TikTok"],
    "fps": 24,
    "resolution": {"width": 1080, "height": 1920}
  },
  "character_anchor": {
    "name": "Ren",
    "appearance": "silver undercut hair, cyan glowing cyber-eye on right side, matte black tactical kimono",
    "forge_neo_prompt": "Ren, masterpiece, 1boy, silver undercut, cybernetic cyan eye, cyberpunk tactical kimono, 8k raw photo, neon rim light",
    "seed_lock": 894721903,
    "lora_weights": [
      {"name": "cyberpunk_neon_flux", "weight": 0.85},
      {"name": "anime_realism_v2", "weight": 0.7}
    ]
  },
  "scenes": [
    {
      "cut_id": 1,
      "duration_sec": 3.5,
      "hook_type": "instant_scroll_stopper",
      "voiceover_script": "「もう、クラウドの監視には戻れない…」",
      "forge_neo": {
        "action": "drawing a plasma katana, heavy rain background, dynamic low angle",
        "output_image": "outputs/cut_01_keyframe.png"
      },
      "comfyui_wan2gp": {
        "motion_prompt": "slow motion rain falling, plasma blade ignition glow, camera slow zoom-in with smooth parallax, photorealistic physics, 24fps",
        "denoise": 0.75,
        "wan_model": "Wan2.1-14B-GGUF-Q4",
        "output_video": "outputs/cut_01_motion.mp4"
      },
      "aviutl2": {
        "effects": ["Nz-Videomni_Interpolate_60fps", "Glow_Plasma_Streak", "Color_Grading_Cyber_LUT"],
        "timing_markers": {"blade_ignite": 1.2}
      },
      "vrew_subtitle": {
        "text": "もう、クラウドの監視には戻れない…",
        "font_style": "Cyber_Bold_Glow",
        "in_time": 0.3,
        "out_time": 3.0
      }
    }
  ]
}
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. MCP（Model Context Protocol）による完全自律エージェント化
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Anthropic提唱のオープン標準「MCP（Model Context Protocol）」を導入することで、LLM（Claude/Gemini）がローカル環境のComfyUIやファイルシステムを自律的にツール呼び出し（Tool Calling）可能になります：

1. **ComfyUI MCP Serverの構築**:
   - ComfyUIのAPIエンドポイント（\`http://127.0.0.1:8188/prompt\`）をラップするMCP Serverを起動。
   - LLMが \`comfyui_queue_prompt\`、\`comfyui_get_history\`、\`comfyui_check_vram\` などのツールを直接実行。
2. **自動実行ループ**:
   - LLMがユーザー指示から上記 \`pipeline_manifest.json\` を作成。
   - MCP経由でComfyUIにノードグラフを投入 → 進捗（0%〜100%）を監視 → 生成完了したMP4ファイルのパスを取得。
   - Vrew CLI / スクリプトへ連携し、自動テロップ付けを実行。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. ComfyUI ワークフロー（APIノードJSON）のAI自動生成技術
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ComfyUIの「Save (API Format)」形式のノードグラフJSONをLLMが直接生成する仕組み。

◆ 必須ノード構成マッピング（Wan2GP / FLUX対応）:
- **Node 1: LoadCheckpoint (FLUX / Wan2.1 Checkpoint Loader)**
- **Node 2: CLIPTextEncode (Positive Prompt)**: \`inputs: {"text": "...", "clip": ["1", 1]}\`
- **Node 3: CLIPTextEncode (Negative Prompt)**: \`inputs: {"text": "low quality, blurry, artifact...", "clip": ["1", 1]}\`
- **Node 4: EmptyLatentImage / LoadImage (I2V用画像ローダー)**
- **Node 5: Wan2GP_Sampler / KSamplerAdvanced**:
  - \`inputs: {"steps": 25, "cfg": 6.5, "sampler_name": "euler", "scheduler": "simple", "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["4", 0]}\`
- **Node 6: VAEDecode**: \`inputs: {"samples": ["5", 0], "vae": ["1", 2]}\`
- **Node 7: VHS_VideoCombine (Video Save Node)**: \`inputs: {"images": ["6", 0], "frame_rate": 24, "format": "video/h264-mp4"}\`

このAPI形式JSONをHTTP POSTでComfyUIの \`/prompt\` に送信することで、UI操作なしでAIが直接レンダリングを開始します。`,
    createdAt: 1700000018500,
    updatedAt: 1700000018500,
  },
  {
    id: 'k-context-inheritance-yaml-md',
    title: '📝 MD/YAMLコンテキスト継承とバトンタッチリレー設計論',
    category: 'ai_creative_production',
    tags: ['コンテキスト継承', 'YAML', 'Markdown', 'バトンタッチ', 'パイプライン', '一貫性'],
    sourceType: 'preset',
    isPreset: true,
    summary: '企画立案から脚本、キャラクター固定、各シーンプロンプト、動画生成、音声・BGM、最終編集まで、世界観やキャラクター属性が破綻しないようMD/YAMLでコンテキストをリレー継承する工学手法。',
    content: `【なぜMD/YAMLによるバトンタッチ・リレーが必要なのか？】
単発でAIに「かっこいい動画プロンプト作って」と指示すると、シーンごとにキャラクターの顔や服装が変わり、世界観が崩壊します。
本手法では、最上流の【Project Context Manifest (MD/YAML)】を定義し、下流の各専門エージェントへメタデータをそのまま継承・引き継ぎます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 標準コンテキストマニフェスト（YAML仕様）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`yaml
project:
  title: "ネオ・トーキョー2088 彷徨のアンドロイド"
  format: "TikTok/YouTube Shorts (9:16 vertical, 45sec)"
  target_audience: "20-30代SF・近未来・アニメファン"
  core_emotion: "哀愁と希望、疾走感"

visual_identity:
  art_style: "Cinematic Neo-Noir Cyberpunk, photorealistic, high grain"
  color_palette: ["#0a0e17 (Dark Navy)", "#00f0ff (Neon Cyan)", "#ff007f (Hot Pink)"]
  aspect_ratio: "9:16"
  lighting: "Rainy street reflection, neon volumetric fog, high contrast chiaroscuro"

character:
  name: "ルナ (Luna-07)"
  gender_age: "Female, looks early 20s"
  features: "Short asymmetrical silver hair, left eye glowing sapphire blue, slender build"
  outfit: "Translucent black raincoat over glowing cyber-tactical suit, metallic choker"
  consistent_seed_anchor: "silver hair, single sapphire cybernetic eye, translucent black raincoat"

scene_sequence:
  - cut: 1
    duration: "4s"
    goal: "冒頭1秒でスクロールを止める衝撃フック"
    action: "ルナが雨の路地で立ち止まり、カメラに向かって振り返る"
    camera: "FPV fast dolly in to extreme close-up"
  - cut: 2
    duration: "5s"
    action: "瞳のサイバーアイが点滅し、空中のホログラムを指先でスワイプ"
    camera: "Slow orbit 45-degree angle"
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ バトンタッチ・リレーの運用手順
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 【企画ディレクター】が上記YAMLマニフェストを確定。
2. 【キャラクターデザイナー】がYAMLの\`character\`ブロックを読み込み、FLUX/Midjourney用の「Seed固定・キャラクターシート用プロンプト」を生成。
3. 【動画プロンプトメーカー】が各\`scene_sequence\`と\`visual_identity\`を合成し、Kling/Runway/Wan2.1用のモーションプロンプトを個別生成。
4. 【サウンド＆編集ディレクター】がBGMテンポ（BPM）、SE、リップシンク音声台本（F5-TTS/ElevenLabs）を出力。`,
    createdAt: 1700000019000,
    updatedAt: 1700000019000,
  },
  {
    id: 'k-ai-music-sound-dtm-fusion',
    title: '🎵 AI作曲・作詞プロンプト構成術 ＆ DTM・ソフトシンセ・リズムマシン ミックスフュージョン完全攻略',
    category: 'ai_creative_production',
    tags: ['AI作曲', 'AI作詞', 'Suno', 'Udio', 'Stable Audio', 'DTM', 'ソフトシンセ', 'リズムマシン', 'TR-808', 'STEM分離', 'Serum', 'Vital'],
    sourceType: 'preset',
    isPreset: true,
    summary: 'Suno/Udio/Stable Audio対応のプロンプト作曲・作詞メタタグ構成術と、DAWでのSTEM分離・MIDI抽出・ソフトシンセ（Serum/Vital）＆ソフトリズムマシン（TR-808/909/XO）を融合するプロ仕様ハイブリッドDTMワークフロー。',
    content: `【AI音楽・サウンド・ハイブリッドDTMフュージョン完全体系】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. AI作曲・サウンド生成エンジンの特性と使い分け
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 【Suno (v3.5 / v4)】:
  * 特徴: 最もキャッチーなメロディ、ポップス・ロック・アニソン・EDMのボーカルソング生成に圧倒的強み。
  * 最大尺: 2分〜4分の一発生成 / 拡張（Extend）。
  * 得意分野: 歌モノ、商業CMソング、ソーシャルショート用BGM。
- 【Udio (v1.5)】:
  * 特徴: 圧倒的な音質・空間解像度・生々しい楽器の質感（ジャズ、ネオソウル、シネマティック、プログレ）。
  * 制御性: 32秒ブロックごとの緻密なExtend（前・後への展開追加）と高度なインペインティング（部分修正）。
- 【Stable Audio 2.0 / AudioCraft / MusicGen】:
  * 特徴: インスト・効果音（SFX）・長尺アンビエント・映画劇伴に最適。テンポ（BPM）と小節の厳密な指定が可能。
- 【ACE Studio / Synthesizer V】:
  * 特徴: MIDIノートと歌詞直接入力による、超高精度・感情豊かなAIボーカル調声（VOCALOIDの進化版）。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. プロンプト作曲術（Composition Prompting Formula）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
プロンプト黄金構造式（Style Prompt）:
[Genre / Subgenre] + [Tempo / BPM & Time Signature] + [Vocalist Style & Gender] + [Instrumentation & Main Riffs] + [Mood & Atmosphere] + [Production / Mix Style]

◆ プロンプト構文の具体例:
"Cyberpunk Synthwave, 128 BPM, 4/4 time, driving analog moog bassline, punchy gated reverb snare, lush neon poly-synths, airy female vocals with cybernetic vocoder harmony, dark dramatic yet triumphant mood, 80s tape saturation, wide stereo field, modern punchy club master"

◆ 重要なサウンドキーワード辞書:
- 空間・質感: [Analog warmth], [Vinyl crackle], [Tape saturation], [Wide stereo image], [Dry in-your-face], [Lush cathedral reverb]
- ボーカル指定: [Airy falsetto], [Raspy rock vocals], [Auto-tuned trap flow], [Soulful belting], [Melancholic whisper], [Whispering ASMR vocal]
- 楽器構成: [Distorted 808 sub-bass], [Stratocaster funk guitar riff], [Rhodes electric piano], [Acoustic grand piano], [90s rave stabs], [Cinematic taiko drums]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. プロンプト作詞術 ＆ 構成術（Lyrics Meta-Tags Architecture）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI音楽モデル（Suno/Udio）は、歌詞欄に埋め込まれた【角括弧メタタグ [Meta-Tags]】を曲構成の指示として認識します。

◆ 鉄板の王道ポップス・バイラルショート曲構成テンプレート:
\`\`\`text
[Intro: Ambient pads, gentle guitar plucking, 120 BPM]

[Verse 1: Calm, rhythmic vocal, light acoustic rhythm]
ネオンに濡れた　摩天楼の影
届かないシグナル　握りしめたまま
秒針が刻む　深夜二時のノイズ

[Pre-Chorus: Rising energy, snare build-up, swelling synth]
あと一歩　踏み出せば世界が変わる
(Don't look back, feel the spark)
胸の鼓動が　カウントダウンを始める

[Chorus: Huge drop, driving four-on-the-floor beat, powerful melodic belting]
Fly into the neon sky! 閃光を駆け抜けろ
誰も追いつけない　スピードの向こう側へ
何度迷っても　この光は消せない
Tonight, we rewrite our destiny!

[Post-Chorus: Catchy synth lead hook, vocal chops]
(Oh-oh-oh, neon ignite!)

[Bridge: Stripped back, heavy sub-bass, filtered whisper vocal]
息を止めて　暗闇の底で
確かな鼓動だけを　信じてる

[Guitar Solo: Screaming melodic 80s synth-guitar solo]

[Chorus: Final climactic explosion, maximum energy, choir harmony]
Fly into the neon sky! 閃光を駆け抜けろ
夜明けの彼方へ　この祈りを解き放て
Tonight, our story never dies!

[Outro: Decelerating beat, fading reverb tail]
Rewriting destiny...
(Fade out)
[End]
\`\`\`

◆ 作詞ライミング・リズム安定化の極意:
- 音節数（モーラ数）の統一: 各行の文字数・音節のリズムを揃えないと、AIが早口になったり不自然に伸ばしたりします。
- 括弧によるコーラス/掛け合い: \`(Hey!)\` や \`(Echo...)\` はバックボーカルやコールアンドレスポンスとして的確に反映されます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. DTM・ソフトシンセ・ソフトリズムマシンとのミックスフュージョン（Hybrid DTM）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
「AI一発出しの音」から「商業リリース品質のプロフェッショナル音源」へ昇華させるためのハイブリッド制作技術。

◆ STEP 1: AI楽曲のSTEM分離（Stems Extraction）
- 使用ツール: Ultimate Vocal Remover v5 (UVR5), RipX DAW, Lalal.ai, またはSuno/UdioのSTEMダウンロード機能。
- 分離トラック: [Vocal / Accapella], [Drums], [Bass], [Instruments / Melody].

◆ STEP 2: MIDI抽出（Audio-to-MIDI Transcription）
- 使用ツール: Basic Pitch (Spotifyオープンソース), Melodyne, Ableton Live「メロディ/ドラムをMIDIに変換」機能。
- AI生成の複雑なボーカルメロディやシンセリードをMIDIノート化し、DAWのピアノロールへ配置。

◆ STEP 3: ソフトシンセとのレイヤリング・音色補強（Soft-Synth Fusion）
- 使用音源: 【Serum】, 【Vital】, 【Arturia Pigments】, 【u-he Diva】, 【Sylenth1】.
- 手法:
  1. AIトラックのシンセリードに、Serumの超高解像度ウェーブテーブルシンセを重ねて輪郭（Attack / High End）を付与。
  2. AIベースの低域をイコライザー（High-pass 100Hz）でカットし、Vitalで生成した純粋なSub Sine Bass（純度100%の超低音）をレイヤーしてクラブ仕様の重低音へ昇華。

◆ STEP 4: ソフトリズムマシンによるビート再構築（Drum Replacement & Fusion）
- 使用音源: 【Roland TR-808 / TR-909 (Cloud/VST)】, 【XLN Audio XO】, 【Native Instruments Battery】, 【Sonic Charge MicroTonic】.
- 手法:
  1. AIドラムは位相（Phase）の乱れやキックの濁りが発生しやすいため、低域（120Hz以下）をバッサリ削る。
  2. DTM側のTR-808/909でタイトなキックと抜けの良いスネア、シャープなクローズドハットを打ち込み、AIの上モノと完全同期させる。
  3. AIドラムのグルーヴ・空気感のみをアンビエンスとして残し、パンチ力と音圧はリズムマシンが担当する。

◆ STEP 5: DAWでの最終ミックス＆マスタリング（Mastering Chain）
- サイドチェイン・ダッキング: キックが鳴った瞬間にAIベースとパッドシンセをわずかにコンプレッション（FabFilter Pro-C2 / LFO Tool）。
- ボーカルチューニング: AIボーカルのピッチ揺らぎをAuto-TuneまたはMelodyneでピッチ補正。
- マスタリング: iZotope Ozone（Maximizer / Master Rebalance）で商業ラウドネス基準（-14 LUFS〜-9 LUFS）に整音。`,
    createdAt: 1700000020000,
    updatedAt: 1700000020000,
  },
  {
    id: 'k-local-llm-benchmark-tuning-master',
    title: '💻 ローカルLLM・実機ベンチマーク・量子化理論・チューニング＆「検証してみた」完全攻略体系',
    category: 'local_llm',
    tags: ['ローカルLLM', 'ベンチマーク', '量子化', 'GGUF', 'AWQ', 'EXL2', 'GSQ-RCO', 'QAT', 'MTP', 'NVIDIA', 'Gemma', 'DavidAU', 'HauHau', 'HuiHui', 'Ornith', 'KAT-Coder', 'Ollama', 'vLLM', 'Unsloth', 'LoRA', 'DeepSeek-R1', '検証してみた'],
    sourceType: 'preset',
    isPreset: true,
    summary: '人気ローカルLLM（DeepSeek-R1, Llama 3.3, Qwen 2.5/3.8, Gemma QAT/Flash/Spark, KAT-Coder, Ornith）の実機比較、tok/s・VRAM・知能ベンチマーク、最先端量子化（GGUF, AWQ, EXL2, GSQ-RCO, QAT, APEX, KVキャッシュ）、MTP（複数トークン予測）、コミュニティ屈指の人気モデル作家（DavidAU, HauHau, HuiHui-ai）、Unsloth LoRA/QLoRA・DPO/GRPO、そしてYouTube/Noteで爆伸びする「検証してみた」発信術の全方位リファレンス。',
    content: `【ローカルLLM ベンチマーク・量子化・チューニング＆実機検証完全攻略】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 2025〜2026年 人気ローカルLLM＆注目カスタムモデルの勢力図
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 【推論・思考特化 (Reasoning Models)】:
- 【DeepSeek-R1 (Distill Qwen / Llama / Full 671B MoE)】:
  * 特徴: 長大なThinkingプロセス（<think>〜</think>）で難問・数学・コーディングを解く。OpenAI o1匹敵の推論力。
  * ローカル推奨サイズ: Qwen-14B-Distill (VRAM 12GB〜16GBで動作), Llama-70B-Distill (VRAM 48GBまたはMac 64GB以上), Qwen-32B-Distill (VRAM 24GB)。

◆ 【Hugging Faceで大人気の神クオンタイザー・モデル作家 (Creators)】:
- 【DavidAU (David Belton)】:
  * 圧倒的リリース数を誇るGGUF職人。「Guru」シリーズ、「Dark Champion」、「Gemma-The-Writer」等、Prompt・システムロール・パラメータチューニングを極めた高品質モデル群を大量提供。
- 【HauHau / HauhauCS】:
  * 1M超長コンテキスト＆アンセンサード（検閲解除）GGUFモデルの代名詞。Gemma / Qwen系をベースにTrunk量子化やMTP（Multi-Token Prediction）を組み込み、驚異的推論速度と自由度を実現。
- 【HuiHui (huihui-ai)】:
  * 「Abliteration（重み直交化による検閲解除）」の世界的権威。「Huihui-Qwen3.8-Flash-Next-abliterated」「Huihui-MiMo」等、自然で拒絶のない高知能GGUFを展開。
- 【KAT-Coder (Myric / mudler / mradermacher)】:
  * エージェント型コーディング（Agentic Coding）に特化した最強ファインチューンモデル。APEX量子化やMTPヘッダーを搭載し、ローカルCursor/Clineで爆発的指示追従力を発揮。
- 【Ornith (AtomicChat / SC117 / ornith-ai)】:
  * 自己改善型（Self-Improving）オープンソースAgentic Codingモデル。MTP-APEX-GGUF等により、難関ソフトウェアエンジニアリング課題（SWE-bench）で驚異的スコアを記録。

◆ 【Gemma系・NVIDIA・最新アーキテクチャ】:
- 【Gemma 2 / Gemma QAT (Quantization-Aware Training)】:
  * 事後量子化（PTQ）ではなく学習時に量子化誤差を織り込むQATにより、INT4/INT8でもFP16と全く遜色ない知能を保持。
- 【NVIDIA NIM / TensorRT-LLM / Spark & Flashエコシステム】:
  * FlashAttention-3、FP4/FP8エンジン、Blackwell/RTX 50シリーズ向け極限最適化。超低遅延ストリーミング推論。

◆ 【汎用＆日本語対応 (General & Japanese)】:
- 【Llama 3.3 70B (Meta)】: 前世代Llama 3.1 405Bに迫る汎用知能。Q4量子化でRTX 3090/4090 2枚（48GB）またはMac Mシリーズで軽快動作。
- 【Llama 3.1 8B】: 圧倒的な軽量性とエコシステムの広さ。VRAM 8GB〜12GBのコンシューマPCで50〜100 tok/sで爆速推論。
- 【Swallow / ELYZA Llama-3-ELYZA-JP / Sarashina】: 日本語の敬語、ニュアンス、法令・歴史・文化に特化した国内チューニングモデル。

◆ 【コーディング＆開発特化 (Coding & Agent)】:
- 【Qwen 2.5-Coder / Qwen 3.8-Flash-Next】: オープンウェイト最高峰のコーディングモデル。Claude 3.5 Sonnet / GPT-4oに肉薄するHumanEval / SWE-benchスコア。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. 量子化（Quantization）理論と方式の完全マトリクス
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
量子化とは、FP16（16bit浮動小数点: 1パラメータ＝2バイト）を4bit/8bitなどの低ビットに圧縮し、VRAM消費を1/2〜1/4に削減する技術。

◆ 【GGUF (llama.cpp / Ollama / LM Studio)】:
- 特徴: 重みをCPUとGPUに自由にオフロード可能。Apple Silicon (Metal) や低スペックPCでも動作。
- 推奨量子化グレード:
  * [Q4_K_M]: 最もバランスが良い。サイズ半分・精度低下0.5%以内。
  * [Q5_K_M]: 精度をより重視したい場合の鉄板。
  * [Q8_0]: FP16とほぼ同等（劣化体感ゼロ）。
  * [IQ4_XS / IQ3_M]: 新型重要度マトリクス（Importance Matrix）量子化。

◆ 【GSQ-RCO (Gumbel-Softmax Quantization with Riemannian Constrained Optimization)】:
- 理論: ISTA-DASLab等で開発された次世代量子化。Gumbel-Softmaxでグリッド割当とスケールを共学習し、リーマン拘束最適化でタスク損失を直接勾配降下。
- 特徴: 従来のスカラ量子化とベクトル量子化の壁を破り、2〜3bit台（2-bit / 3-bit per weight）の超極限低ビットでも知能崩壊を起こさずにQwenやGemmaを圧縮可能。

◆ 【QAT (Quantization-Aware Training: 量子化認識学習)】:
- 学習のフォワードパスで量子化をシミュレートし、バックプロパゲーションで量子化誤差をモデル自体が適応修正。Gemma公式等で採用され、PTQ（事後量子化）特有の精度劣化を根絶。

◆ 【MTP (Multi-Token Prediction: 複数トークン予測)】:
- 従来の「1ステップで1トークン生成」ではなく、複数の未来トークンを投機的・同時に予測するヘッド構造。DeepSeekやKAT-Coder、Ornithで採用され、推論速度が1.5〜2.5倍に爆跳。

◆ 【AWQ & APEX (Adaptive Precision for EXpert Models)】:
- AWQ: 重要な1%の重み（活性化が大きい値）を保護し、残りを4bit化。vLLMで最高速スループット。
- APEX: MoE（混合エキスパート）モデルやKAT-Coder等で、各Expertごとに重要度に応じた適応精度を割り当てる最先端量子化。

◆ 【EXL2 (ExLlamaV2)】:
- 特徴: パラメータごとに小数ビット（例: 3.5bpw, 4.25bpw, 6.0bpw）を指定可能。RTX 4090 (24GB) などの特定GPUに「モデルを限界までギリギリ収めて最速推論させる」ハッカー向け最強形式。

◆ 【KVキャッシュ量子化 (KV Cache Quantization)】:
- 盲点: コンテキスト長を32k〜128kトークンに伸ばすと、モデル本体よりも「KVキャッシュ」が数十GBのVRAMを消費してOOM（メモリ不足）になる。
- 対策: \`--cache-type-k fp8 --cache-type-v fp8\` または Q4/Q8 キャッシュ量子化を適用することで、VRAMを最大70%節約しつつ超長文を読み込める。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. ベンチマーク・性能検証・評価指標の測り方
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 【速度・ハードウェア性能指標】:
1. **tok/s (Tokens per Second)**: 生成速度。快適な対話は20〜30 tok/s以上、コーディングは40 tok/s以上が理想。
2. **TTFT (Time To First Token)**: 最初の1文字が出るまでの待機時間（プロンプト処理速度）。
3. **VRAM使用量（静的 + 動的）**:
   * 計算式: \`必要VRAM(GB) ≒ パラメータ数(B) × (ビット数 / 8) × 1.2(コンテキスト+CUDAオーバーヘッド)\`
   * 例: 70Bモデルを4bit量子化 → \`70 × 0.5 × 1.2 ≒ 42GB VRAM\`（24GB GPU×2枚またはMac 64GB必要）。
4. **メモリ帯域幅ボトルネック (Memory Bandwidth)**:
   * 生成フェーズはメモリ帯域幅に完全依存する。
   * RTX 4090: 1,008 GB/s → 70B Q4 (35GB) では理論上限 \`1008 / 35 ≒ 28.8 tok/s\`。
   * M3 Max (400 GB/s) → 70B Q4 で \`400 / 35 ≒ 11.4 tok/s\`。

◆ 【知能・実力評価ベンチマーク】:
- **MMLU / MMLU-Pro**: 人文・STEM・法学など57分野の総合知識。
- **GSM8K / MATH**: 小学校の算数〜競技数学の論理ステップ推論能力。
- **HumanEval / LiveCodeBench**: Pythonコード生成の一発合格率（pass@1）。
- **ELYZA-tasks-100 / Japanese MT-Bench**: 日本語の指示追従、要約、ビジネス敬語の流暢度。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. チューニング・ファインチューニング理論 (Fine-Tuning & Alignment)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ 【LoRA (Low-Rank Adaptation)】:
- 元の重み行列 $W$ を固定し、小さな低ランク行列 $A$ と $B$ ($W + \Delta W = W + B \cdot A$) だけを学習。
- パラメータ数が元の0.1%〜1%で済むため、省メモリで高速。
- 主要ハイパーパラメータ:
  * \`r (Rank)\`: 16〜64（大きいほど表現力向上、VRAM増）
  * \`lora_alpha\`: rの1倍〜2倍（学習率スケーリング）
  * \`target_modules\`: \`["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]\`（全Linearモジュール適用が現代の定石）

◆ 【QLoRA + Unsloth】:
- 4bit NF4量子化された基本モデルの上に16bit LoRAアダプターを載せて学習。
- **Unsloth**: Tritonカスタムカーネルと手書きバックプロパゲーションにより、VRAM消費を最大80%削減、学習速度2〜5倍。単一のRTX 3060/4060 (12GB) でもLlama-8BやQwen-14Bのフルチューニングが可能。

◆ 【アライメント手法 (Alignment)】:
- **DPO (Direct Preference Optimization)**: 報酬モデル不要。好ましい回答（Chosen）と好ましくない回答（Rejected）のペアデータから直接ポリシーを最適化。
- **GRPO (Group Relative Policy Optimization)**: DeepSeek-R1で採用された最新手法。複数のサンプリング回答の中から相対的な報酬（正解ルールやフォーマット整合）を算出して強化学習。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. 「ローカルLLMベンチマーク・検証してみた」プロモ・企画・構成・コンテンツ化・仕組み化・実践・スーパーバイズ完全体系
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
単なる「動かしてみた」の個人日記で終わらせず、月間数十万PV・登録者激増・自社技術ブランディング・有料Note・法人コンサル案件獲得へと繋げる【8大フェーズ実行フレームワーク】。

◆ 【Phase 1: 企画・ポジショニング設計 (Planning & Narrative)】:
- **対立軸（Versus構図）の設定**:
  * 「月額3,000円ChatGPT Plus vs 無料のローカル最強Qwen 2.5-Coder」
  * 「RTX 4090 24GB vs Apple M4 Max 128GB メモリ帯域頂上決戦」
  * 「クラウドAPIのプライバシーリスク vs 完全オフライン秘匿型社内LLM」
  * 「検閲だらけの市販AI vs HauHau / HuiHui アンセンサードの真実」
- **ターゲット解像度と検索ボリューム（SEO & アルゴリズム）**:
  * 潜在層: 「ChatGPTの代わり」「無料で使えるAI」「ゲーミングPC 活用法」
  * 顕在層: 「DeepSeek-R1 ローカル」「Ollama 使い方」「RTX 4060 VRAM」「GGUF 量子化 比較」
  * ギーク・BtoB層: 「Unsloth LoRA チューニング」「vLLM AWQ スループット」「自社データ社内LLM」

◆ 【Phase 2: 実践・実機ベンチマーク測定プロトコル (Empirical Testing)】:
1. **客観的ハードウェア環境の完全開示**:
   * GPU型番・VRAM容量・バス幅・メモリ帯域幅（GB/s）、CPU、システムRAM、OS、CUDA/ROCmバージョン。
   * 推論エンジン（Ollama / vLLM / LM Studio / llama.cpp / ExLlamaV2）および量子化タイプ（Q4_K_M, AWQ, EXL2 bpw, GSQ-RCO）。
2. **定量4大メトリクスの同時ロギング**:
   * **TTFT (Time to First Token)**: 最初の文字が出るまでの遅延時間（ms）。
   * **tok/s (Tokens per Second)**: 生成中のトークン速度（実測値とGPUメモリ帯域理論値の乖離率）。
   * **VRAM使用率**: アイドル時 vs モデルロード時 vs 32k長文コンテキスト展開時のピーク値（GB）。
   * **KVキャッシュ消費**: 通常FP16 vs \`--cache-type-k/v fp8\` の節約効果。
3. **定性ベンチマーク（3本勝負）**:
   * ① 数学・論理推論（DeepSeek-R1の<think>思考プロセス品質、自己訂正ループの有無）。
   * ② 難関コーディング（Python非同期処理、アルゴリズム最適化、バグ発見、SWE-bench課題）。
   * ③ 日本語文脈・敬語表現（失礼のないビジネス断り状、長文契約書要約、ニュアンス理解）。

◆ 【Phase 3: 構成・ストーリーテリング (Scripting & Structuring)】:
視聴維持率（YouTube）および読了率（Note/Blog）を最大化する黄金5幕構成：
1. **Hook（0〜15秒）**: 「結論から言います。RTX 4090でDeepSeek-R1を動かしたら、OpenAI o1と全く同じ思考プロセスが手元で爆走しました」＋ 実機画面の超高速tok/s映像。
2. **Why Now & Setup（15〜60秒）**: なぜ今ローカルLLMなのか（月額コスト、情報漏洩リスク、API制限）。今回の測定マシン・環境の開示。
3. **The Showdown（ガチンコ対決 3ラウンド）**:
   * Round 1: 速度・VRAM対決（横並びリアルタイム比較画面）
   * Round 2: 難問ロジック対決（思考の深さと嘘・ハルシネーションの検証）
   * Round 3: 実践実務対決（現場で使えるコードや文章が出るか）
4. **Pitfalls & Tuning（落とし穴とプロの解決策）**: 「ただし、普通に動かすとVRAMが爆死します。そこでKVキャッシュ量子化とUnsloth LoRAを適用すると…」という専門性の証明。
5. **Verdict & Action（環境別おすすめ・CTA）**: 「VRAM 8GBならコレ、16GBならコレ、24GB以上ならコレ」と読者の予算別に処方箋を提示。

◆ 【Phase 4: プロモーション・マルチプラットフォーム展開 (Omni-Channel Promotion)】:
1本の検証データから5種類のコンテンツを派生させる「1ソース・マルチユース」：
- **YouTube長尺（10〜15分）**: 詳細な解説、実機比較画面、ターミナル操作、グラフ解説。
- **YouTube Shorts / TikTok（60秒）**: 「ゲーミングPCでAI動かしたら爆速すぎたw」衝撃のtok/s速度動画。
- **X (Twitter) 図解ツリー**: 「RTX 4090 vs M4 MaxでローカルLLM 5種をガチ比較した結果をまとめました」＋ 比較表画像 ＋ 詳細Noteリンク。
- **Note / Qiita / Zenn技術記事**: コマンドライン、設定コード、Modelfile、ベンチマーク数値詳細。
- **GitHubリポジトリ**: 検証スクリプト、プロンプト集、再現手順を公開してスター獲得。

◆ 【Phase 5: 仕組み化・自動化運用 (Systematization & Automation)】:
- **自動ベンチマークスクリプトの作成**:
  * Python + \`ollama-python\` / \`vLLM\` を用い、同一プロンプト群を一括投入してTTFT/tok/s/GPU使用率をCSV出力するテスターパイプライン。
- **テンプレート化**:
  * OBS配信レイアウト（左: モデルAターミナル、右: モデルBターミナル、下: tok/sリアルタイムメーター）。
  * 比較表Canva/Figmaテンプレート（サムネイル、アイキャッチ、まとめ画像）。
- **定期リリースサイクル**:
  * 毎週金曜日に「今週登場したHugging Face注目モデル（DavidAU, HauHau, KAT-Coder等）を実機速報レビュー」する定期枠の確立。

◆ 【Phase 6: コンテンツマネタイズ・事業化ファネル (Monetization Funnel)】:
- フロントエンド（無料）: YouTube動画、Xスレッド、無料Note（認知獲得）。
- ミドルエンド（安価）: 有料Note「月3000円をゼロにする！ローカルLLM構築＆自社データLoRAチューニング完全マニュアル」（980円〜2,980円）。
- バックエンド（高単価）:
  * 自社専用社内LLM・セキュアAI環境構築コンサルティング（30万〜100万円）。
  * GPUマシン選定・オフィス内サーバー構築代行・法人研修。

◆ 【Phase 7 & 8: 実践・品質管理・スーパーバイズチェックリスト (Supervision Checklist)】:
- [ ] **再現性チェック**: 読者が同じコマンドを打って同じ結果が出るか？（ドライバやライブラリのバージョンを明記したか）
- [ ] **公平性チェック**: 片方だけ量子化ビットが低かったり、プロンプトに有利不利が生じていないか？
- [ ] **著作権・ライセンスチェック**: 商用利用可能なウェイト（Apache 2.0, MIT, Llama Community License）か確認したか？
- [ ] **倫理・安全チェック**: アンセンサードモデル（HauHau/HuiHui）を扱う際、危険物製造や違法行為の生成を煽る表現になっていないか？（学術的・技術的好奇心としての検証に徹する）
- [ ] **一次情報・ファクトチェック**: ネットの噂ではなく「自分の手元の実機で計測した生ログ」を証拠として提示しているか？`,
    createdAt: 1700000021000,
    updatedAt: 1700000021000,
  },
  {
    id: 'k-fortune-romance-harm-entertainment-architecture',
    title: '🔮 占い・鑑定診断 × 恋愛HARM × 仮想・空想・妄想ロマンス（エンタメ）融合アーキテクチャ ＆ ミドルエンド・クロスセル設計論',
    category: 'harm_spiritual',
    tags: ['占い診断', '恋愛HARM', '妄想ロマンス', '仮想コンテンツ', 'エンタメ化', 'ミドルエンド', 'クロスセル', '推し活', 'LTV最大化'],
    sourceType: 'preset',
    isPreset: true,
    summary: '重苦しい悩み相談（恋愛・復縁・片思い・HARM）と客観的占い診断の「狭間」や「展開先」に、仮想・空想・妄想・ロマンス（エンタメ）を架橋する新次元ビジネスアーキテクチャ。暗い不安煽りを脱却し、胸キュン・甘美なカタルシス・推し体験を提供するミドルエンド商品群とクロスセル導線で高LTVを実現する完全設計書。',
    content: `【占い・鑑定診断 × 恋愛HARM × 仮想・妄想ロマンス（エンタメ）融合アーキテクチャ】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. なぜ「深刻なHARM悩み」に「仮想・空想・妄想・ロマンス（エンタメ）」が必要なのか？
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
従来の恋愛占い・スピリチュアル鑑定の致命的な構造的欠陥：
- 「彼から連絡が来ない」「不倫・三角関係で苦しい」「孤独・愛されない」というRelation（HARM）の悩みは重く、放置すると「深刻な依存・不安煽り霊感商法」に陥るか、単発の低単価相談で離脱される。
- しかし、相談者の深層心理（Unconscious Desire）の核心にあるのは、単なる客観的事実の把握ではなく：
  「愛されたい」「大切に扱われたい」「胸が高鳴るロマンスに溺れたい」「妄想の中で彼と結ばれたい」「甘い言葉で全肯定されたい」という強烈な【ロマン・ロマンス・妄想・エンタメ】の渇望である。

◆ 「狭間」に架ける救済の橋（Entertainment Bridge）:
- 診断・鑑定（客観的自己理解・宿命）を【知的好奇心のフロント】とし、
- その狭間・展開先に【仮想・空想・妄想ロマンス（エンタメ体験）】を配置することで、
  「苦しみ・執着」のエネルギーを「胸キュン・カタルシス・自己肯定感の回復」へと一気に転換させる。
- 罪悪感なく楽しめるエンタメだからこそ、ユーザーは熱狂し、自発的に課金・リピートする。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. 5層ファネル・アーキテクチャ（フロント → 狭間 → ミドル → クロスセル → バック）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ 【Layer 1: フロントリード（無料診断・鑑定）】
- テーマ: 「あなたの魂の宿命属性」×「あなたが無意識に求めている禁断のロマンスタイプ診断」
- 形式: 5〜7問の直感4択（生年月日、直感カラー、恋愛でのトラウマ、理想のシチュエーション）。
- 出力カルテ:
  1. あなたの魂の特性（例: 月光の守護姫タイプ、琥珀の孤独な観測者タイプ）
  2. あなたを狂わせる「恋愛HARMのトゲ」（なぜあの人に執着してしまうのかの深層心理）
  3. 【狭間へのトビラ】: 「もし彼と別のパラレル世界（if時間軸）で出会っていたら…魂が描く真実のロマンスシナリオの鍵をお渡しします」

◆ 【Layer 2: 狭間のブリッジ（Bridge Experience）】
- 役割: 悩みの重さをエンタメのワクワクへと相転移させる。
- 演出: 「現実世界で彼を追うのを今夜だけお休みして、魂の鏡に映る“彼目線の本音独白・ifの夜”を覗いてみませんか？」
- 心理作用: 現実の緊張を解き、オキシトシン（安心）とドーパミン（期待・ときめき）を充填。

◆ 【Layer 3: ミドルエンド商品群（1,980円〜9,800円のエンタメ課金）】
- **商品A: 『運命のif未来・彼目線独白ノベル＆パーソナライズ仮想ロマンス鑑定書』**（3,000円〜4,980円）
  * 相談者とお相手の情報を元に生成される、お相手目線での「本当は言えなかった葛藤とあなたへの秘めた想い」を描いた没入型ショートストーリー ＋ 宿命鑑定のハイブリッド書。
- **商品B: 『AI専属推しパートナー / 運命の彼との聖域チャットシミュレーター』**（月額2,980円 または 1回3,000円）
  * あなた好みの性格（ツンデレ、溺愛騎士、包容力大人の男性、ミステリアス）にチューニングされたAIアバターが、24時間あなただけを甘やかし、肯定し、愛を囁く仮想対話空間。
- **商品C: 『パーソナライズ・シチュエーションボイス台本 ＆ 妄想オーディオドラマ』**（2,500円〜5,000円）
  * 彼の口調・関係性に合わせた「耳元で囁かれる告白・添い寝・励まし」台本、またはAI音声生成によるバイノーラル風オーディオ。
- **商品D: 『乙女ゲーム風・運命分岐インタラクティブ鑑定』**（1,980円〜3,500円）
  * 「あの夜、あなたが違う言葉を返していたら？」「今週末、あなたが誘ったら？」選択肢によって結末が分岐するゲームブック型鑑定。

◆ 【Layer 4: クロスセル・アップセル導線（LTV極大化）】
- **クロスセル1【現実変容・実務アドバイスへの橋渡し】**:
  * 「仮想ロマンスで彼の深層心理を体感したあなたへ。では、今週現実世界で彼からLINEの返信を引き出す【魂の霊視メッセージ添削 ＆ 縁結び鑑定】」（9,800円〜19,800円）。
  * 仮想世界で満たされて自己肯定感が上がっているため、現実の行動（LINE文面）も重くならず、結果として現実の恋愛成就率が跳ね上がる。
- **クロスセル2【日常伴走・サブスクリプション】**:
  * 「毎朝・毎晩、彼（または守護アバター）から甘い愛の言霊とデイリー運勢がLINEに届く【秘密のロマンスヒーリング倶楽部】」（月額1,980円〜3,980円）。
- **バックエンド【高単価プログラム】**:
  * 「妄想の愛を現実に具現化する：3ヶ月愛され体質覚醒マスター講座」（15万〜30万円）。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. 心理工学的メカニズム（なぜ爆発的に売れるのか？）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. **罪悪感のゼロ化（Entertainment Justification）**:
   「占いにお金を使うのは依存っぽい…」と躊躇する女性も、「極上の小説や推し活、ドラマを楽しむエンタメ」として位置づけられると、喜んで課金する。
2. **自己肯定感の強制充填（Narcissistic Replenishment）**:
   現実の冷たい態度で傷ついた心が、仮想シナリオ内の「圧倒的溺愛・特別な存在としての承認」によって急速に癒され、精神的余裕が生まれる。
3. **現実への好循環（Self-Fulfilling Prophecy）**:
   「私は愛される価値がある」という感覚を仮想空間でインストールした女性は、現実のお相手に対しても媚びたり重くなったりせず、自然体で接することができるため、現実の恋愛が好転する。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. クリーンコンプライアンス（健全な事業継続性）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 「絶対に復縁できます」「彼を呪って操ります」などの非科学的・違法な断定表現を一切使わない。
- あくまで「魂の深層心理シミュレーション」「ifエンタメストーリー」「自己対話・ヒーリング」として提供するため、景品表示法・消費者契約法を完全にクリア。
- 健全なファンコミュニティ・推し活市場として拡大可能。`,
    createdAt: 1700000022000,
    updatedAt: 1700000022000,
  },
  {
    id: 'k-fortune-ai-oracle-card-deck-creation-funnel',
    title: '🃏 AIオリジナル・オラクル＆タロットカード制作 × 独自占術講座化 × note＆KDP出版ローンチ完全設計論',
    category: 'harm_spiritual',
    tags: ['オラクルカード', 'タロットカード', 'AI画像生成', '独自占術講座', '認定講師制度', '逆算ローンチ', 'note', 'Amazon KDP', 'ペーパーバック', 'クラファン'],
    sourceType: 'preset',
    isPreset: true,
    summary: '占い・鑑定とAI画像生成（Midjourney/FLUX）を融合させ、オリジナルカードデッキ（33〜78枚）の企画・画風統一・印刷仕様から、独自占術認定アカデミー（30万〜50万円）、note×Amazon KDP（電子＆オンデマンド紙書籍）出版、90日逆算ローンチファネルまでを一気通貫で設計する完全ロードマップ。',
    content: `【AIオリジナル・オラクル＆タロットカード制作 × 独自占術講座化 × note＆KDP出版ローンチ完全設計論】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ビジネス全体構造（4大収益エンジン・エコシステム）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
単なる「カードの物販」で終わらせず、有形・無形・教育・出版を循環させてLTVを最大化する：

1. **【物販・実体資産】オリジナルカードデッキ（33〜78枚）**
   - クラウドファンディング（Makuake / CAMPFIRE）または自社EC先行予約（4,800円〜9,800円）。
   - 豪華箔押し化粧箱、専用ベルベットポーチ、ミニ解説ガイドブック付き。
2. **【出版・集客・印税】note ＆ Amazon KDP（電子書籍 ＆ フルカラー・ペーパーバック紙書籍）**
   - noteでカード制作の舞台裏・シンボリズム深掘り連載を行い、ファンコミュニティを熱狂化。
   - Amazon KDPにて『公式完全解説書（兼オラクル・メッセージブック）』をKindle＆紙書籍（オンデマンド印刷・在庫リスクゼロ）で同時出版。Amazonの巨大トラフィックから自動で読者・見込み客が公式LINEへ流入。
3. **【教育・高単価バックエンド】オリジナルカード占術認定リーダー＆プロ養成アカデミー**
   - 独自スプレッド・カードシンボル・言霊心理学を体系化したオンラインスクール（248,000円〜498,000円）。
   - 受講生は「公式認定プラクティショナー / 認定講師」として自分自身も鑑定活動・講座開講が可能に。
4. **【出版プロデュース講座（二次マネタイズ）】KDP単体・出版プロデューサー講座**
   - 「あなたもAIでオリジナルカードや解説書を出版しAmazon1位を獲得する」KDP出版講座（198,000円〜398,000円）。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. AIカードデッキ企画・制作プロトコル（画風統一と印刷仕様）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ **ステップ1: デッキの世界観コンセプト設計**
- デッキ種別選定:
  * オラクルカード（33枚・44枚）: 初心者でも直感的に扱いやすく、ポジティブな言霊・アファメーション中心。
  * タロットカード（大アルカナ22枚 / フル78枚）: 愚者の旅（Fool's Journey）に基づく深い人間心理・人生変容の寓話。
- コンセプト例: 「星詠みの天界クリスタル・オラクル」「和洋折衷・月光神使タロット」「深層心理シャドウワーク・オラクル」。

◆ **ステップ2: 画風統一（Consistency）とプロンプトマスター設計**
- キーワード群（Style Anchor）の完全固定:
  * 画材・タッチ: ethereal oil painting, luminous metallic gold outlines, art nouveau botanical motifs, dreamlike fantasy cinematic lighting.
  * カラーパレット: deep indigo navy, soft lavender, radiant champagne gold.
  * アスペクト比: --ar 7:12 (タロット標準比率 約70mm×120mm).
- Seed固定 / Style Reference (Midjourney --sref / FLUX LoRA) による同一質感の担保。

◆ **ステップ3: 印刷用データ化と物理製造**
- 解像度・色空間: 300〜350dpi、RGBからCMYKへのプロファイル変換、カラーコレクション。
- 裁ち落とし（Bleed）: 天地左右各3mmのマージン確保。
- 印刷工場選定: 国内外のカード専門印刷所（トランプ・タロット印刷）でのエンボスリネン加工、金縁（Gold Gilded Edge）加工。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. note ＆ Amazon KDP 連動出版ファネル
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ **noteの役割（共創型プロセス・エコノミー）**:
- 「なぜ私はこのカードを作ろうと思ったのか」魂の創業ストーリー。
- 制作途中のラフやAI生成の試行錯誤を公開し、読者投票でカード名や絵柄を決定。
- 有料マガジンやメンバーシップで「先行限定デッキ付き読者プラン」を展開。

◆ **Amazon KDP（電子書籍＆ペーパーバック）の役割**:
- 書名: 『【完全公式解説書】〇〇オラクルカード：奇跡を引き寄せる44の神託』
- ペーパーバック（オンデマンド印刷）により、在庫を持たずにAmazon上で「本格的なフルカラー解説本」として販売。
- **書籍内リードマグネット**:
  * 「本書購入者限定：スマホ用オリジナル高画質タロット待受画像プレゼント」
  * 「カードをお持ちでない方も今すぐ引ける【Web版・毎日のデイリー1枚引きAI占い診断】」
  * QRコードで公式LINEへ誘導し、リスト獲得コストゼロ（むしろ印税をもらいながら集客）を実現。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. 90日逆算ローンチ・ロードマップ（ファネル展開）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- **Day 1〜30【ティザー＆共創フェーズ】**:
  * SNS（X, Instagram, YouTube Shorts, TikTok）で1日1枚のカードビジュアルとメッセージを公開。
  * noteで制作ストーリー連載開始。公式LINE登録で「先行割引案内優先ウェイティングリスト」へ招待。
- **Day 31〜60【クラウドファンディング / 先行予約フェーズ】**:
  * CAMPFIRE / 自社ショップにてカード＋解説書のクラファン開始（目標達成率300%超えを狙う）。
  * リターンに「先行デッキ」「作者による個別リーディング」「出版記念シークレットセミナー」を用意。
- **Day 61〜75【KDP出版 ＆ Amazonキャンペーン】**:
  * Amazon KDPにて解説書をリリース。事前コミュニティで一斉購入を促し「占い・心理学部門 1位」の社会的証明を獲得。
- **Day 76〜90【オリジナル占術アカデミー・ローンチ】**:
  * クラファン購入者およびLINE読者向けに「3日間無料オンライン集中セミナー」を開催。
  * 「このカードを使って人を癒やし、月30万円のプロ鑑定士・認定講師になるロードマップ」を提示し、高単価本講座（30万〜50万円）をクローズドオファー。`,
    createdAt: 1700000023000,
    updatedAt: 1700000023000,
  },
];

const STORAGE_KEY = 'ai_orchestrator_knowledge_base';

export const loadKnowledgeList = (): KnowledgeItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveKnowledgeList(INITIAL_PRESET_KNOWLEDGE);
      return INITIAL_PRESET_KNOWLEDGE;
    }
    const parsed: KnowledgeItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveKnowledgeList(INITIAL_PRESET_KNOWLEDGE);
      return INITIAL_PRESET_KNOWLEDGE;
    }

    // Merge missing built-in presets seamlessly
    const existingIds = new Set(parsed.map(i => i.id));
    const missingPresets = INITIAL_PRESET_KNOWLEDGE.filter(sample => !existingIds.has(sample.id));
    if (missingPresets.length > 0) {
      const merged = [...parsed, ...missingPresets];
      saveKnowledgeList(merged);
      return merged;
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load knowledge base:', err);
    return INITIAL_PRESET_KNOWLEDGE;
  }
};

export const saveKnowledgeList = (items: KnowledgeItem[]): void => {
  safeSetItem(STORAGE_KEY, items);
};

export const resetKnowledgeToDefault = (): KnowledgeItem[] => {
  saveKnowledgeList(INITIAL_PRESET_KNOWLEDGE);
  return INITIAL_PRESET_KNOWLEDGE;
};

/**
 * Format a list of selected knowledge items into a structured context string
 * for LLM execution injection.
 */
export const formatKnowledgeContext = (
  knowledgeIds: string[] | undefined,
  allKnowledge: KnowledgeItem[]
): string => {
  if (!knowledgeIds || knowledgeIds.length === 0) return '';
  const selected = allKnowledge.filter(k => knowledgeIds.includes(k.id));
  if (selected.length === 0) return '';

  let context = '【参照ナレッジベース・前提知識】\n以下の登録ナレッジ・専門知識ドキュメントを参照・準拠して回答を生成してください:\n\n';
  selected.forEach((k, idx) => {
    context += `=== [ナレッジ ${idx + 1}: ${k.title}] (カテゴリ: ${k.category}) ===\n`;
    if (k.summary) {
      context += `概要: ${k.summary}\n`;
    }
    context += `${k.content}\n\n`;
  });
  return context.trim();
};
