import { KnowledgeItem } from '../types';

export const KNOWLEDGE_CATEGORIES = [
  { id: 'all', label: 'すべて' },
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
    return parsed;
  } catch (err) {
    console.error('Failed to load knowledge base:', err);
    return INITIAL_PRESET_KNOWLEDGE;
  }
};

export const saveKnowledgeList = (items: KnowledgeItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save knowledge base:', err);
  }
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
