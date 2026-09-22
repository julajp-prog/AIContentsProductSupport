/**
 * Primary Resource Service (一次リソース特定・強化・検証サービス)
 * 
 * Reddit, Hugging Face, OSS/GitHub, ComfyUI, BigTech/LLM元会社, Agent系,
 * Zenn, Qiita, 研究発表/arXiv等の一次情報へのアクセス強化、プロンプト注入、
 * 直接リサーチリンク生成、および出力検証を提供。
 */

export type PrimaryResourceCategory = 
  | 'bigtech'
  | 'huggingface'
  | 'github'
  | 'comfyui'
  | 'agent'
  | 'reddit'
  | 'academic'
  | 'techblog';

export interface OfficialLink {
  title: string;
  url: string;
  description: string;
  badge?: string;
}

export interface ResourceCategoryMeta {
  id: PrimaryResourceCategory;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  officialLinks: OfficialLink[];
  searchGenerators: {
    label: string;
    generateUrl: (query: string) => string;
  }[];
  injectionTemplates: {
    id: string;
    title: string;
    description: string;
    promptSnippet: string;
  }[];
}

export const PRIMARY_RESOURCE_CATEGORIES: ResourceCategoryMeta[] = [
  {
    id: 'bigtech',
    name: '大手LLM・BigTech元会社',
    icon: '🏢',
    tagline: '公式API仕様・System Cards・一次ドキュメント',
    description: 'OpenAI, Google AI/DeepMind, Anthropic, Meta AI, Mistral 等の公式仕様・公式発表・APIリファレンスに直接準拠。',
    officialLinks: [
      {
        title: 'OpenAI Developer Documentation & Cookbook',
        url: 'https://platform.openai.com/docs',
        description: '公式APIリファレンス、モデル一覧、プロンプトガイド、Cookbook',
        badge: 'OpenAI公式',
      },
      {
        title: 'Google AI Studio & Gemini API Docs',
        url: 'https://ai.google.dev/gemini-api/docs',
        description: 'Geminiモデル仕様、システムインストラクション、REST/SDK仕様',
        badge: 'Google公式',
      },
      {
        title: 'Anthropic Claude API & Prompt Library',
        url: 'https://docs.anthropic.com/en/docs/welcome',
        description: 'Claude 3.7/3.5仕様、Tool Use、Computer Use、MCP仕様書',
        badge: 'Anthropic公式',
      },
      {
        title: 'Meta AI & Llama Official Hub',
        url: 'https://www.llama.com/docs/overview/',
        description: 'Llama 3.3/3.2/3.1公式ドキュメント、System Card、アーキテクチャ',
        badge: 'Meta公式',
      },
      {
        title: 'Mistral AI Platform Docs',
        url: 'https://docs.mistral.ai/',
        description: 'Mistral Large, Codestral, Pixtral公式仕様',
        badge: 'Mistral公式',
      },
      {
        title: 'Microsoft AI Research & Azure AI',
        url: 'https://learn.microsoft.com/azure/ai-services/',
        description: 'Azure OpenAI、Phi-4/Phi-3モデル、Semantic Kernel',
        badge: 'MS公式',
      },
    ],
    searchGenerators: [
      {
        label: 'Google公式ドキュメント限定検索 (site:ai.google.dev)',
        generateUrl: q => `https://www.google.com/search?q=site%3Aai.google.dev+${encodeURIComponent(q)}`,
      },
      {
        label: 'OpenAI公式限定検索 (site:platform.openai.com)',
        generateUrl: q => `https://www.google.com/search?q=site%3Aplatform.openai.com+${encodeURIComponent(q)}`,
      },
      {
        label: 'Anthropic公式限定検索 (site:docs.anthropic.com)',
        generateUrl: q => `https://www.google.com/search?q=site%3Adocs.anthropic.com+${encodeURIComponent(q)}`,
      },
    ],
    injectionTemplates: [
      {
        id: 'bigtech-api-spec',
        title: '公式API仕様・System Card厳密準拠',
        description: '公式ドキュメントのエンドポイント・パラメータ・公式制約に遡って確認を指示',
        promptSnippet: `【一次リソース検証指示: 大手LLM元会社公式仕様】
回答時は、必ず開発元（OpenAI / Google / Anthropic / Meta等）の「公式APIリファレンス」「公式リリースノート」「System Card」に基づく一次仕様のみを記述してください。
- 該当する公式APIパラメータ名、引数の型、最新サポートモデル名を明記すること。
- サードパーティの古い推測記事や非公式ラッパーによる歪曲を排除し、公式仕様と非公式ツールの差分を明示すること。`,
      },
    ],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face & オープンモデル',
    icon: '🤗',
    tagline: 'Model Cards・Datasets・Papers・Spaces',
    description: '重みファイル、Model Card記載のライセンス・量子化・ベンチマーク、Transformers/Diffusersの公式実装。',
    officialLinks: [
      {
        title: 'Hugging Face Models Explorer',
        url: 'https://huggingface.co/models',
        description: '最新オープンウェイトモデル、GGUF/AWQ/EXL2、Model Cards',
        badge: 'Models',
      },
      {
        title: 'Hugging Face Daily Papers',
        url: 'https://huggingface.co/papers',
        description: 'コミュニティによって評価された最新一次研究論文と実装',
        badge: 'Papers',
      },
      {
        title: 'Hugging Face Transformers Docs',
        url: 'https://huggingface.co/docs/transformers/index',
        description: '公式パイプライン、generate引数、量子化ロード仕様',
        badge: 'Docs',
      },
      {
        title: 'Hugging Face Open LLM Leaderboard v2',
        url: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard',
        description: 'オープンLLMの厳密ベンチマーク（IFEval, BBH, MATH, MMLU-PRO等）',
        badge: 'Leaderboard',
      },
    ],
    searchGenerators: [
      {
        label: 'Hugging Face モデル検索',
        generateUrl: q => `https://huggingface.co/models?search=${encodeURIComponent(q)}`,
      },
      {
        label: 'Hugging Face 論文検索 (Papers)',
        generateUrl: q => `https://huggingface.co/papers?q=${encodeURIComponent(q)}`,
      },
      {
        label: 'HF Spaces (デモ・WebUI) 検索',
        generateUrl: q => `https://huggingface.co/spaces?search=${encodeURIComponent(q)}`,
      },
    ],
    injectionTemplates: [
      {
        id: 'hf-model-card',
        title: 'Model Card・ベンチマーク・量子化特定',
        description: 'Hugging Face上の公式リポジトリID、対応量子化フォーマット、公式推奨プロンプトフォーマットを特定',
        promptSnippet: `【一次リソース検証指示: Hugging Faceオープンモデル】
オープンモデルに関する記述は、Hugging Faceの「公式Model Card」「config.json」「tokenizer_config.json」に基づき以下を特定してください：
1. 正確なモデルリポジトリID（例: \`meta-llama/Llama-3.3-70B-Instruct\`）
2. 公式推奨のChat Template（システムプロンプトのフォーマット）
3. 推奨量子化形式（GGUF / EXL2 / AWQ）とVRAM要件の根拠`,
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub & OSS リポジトリ',
    icon: '🐙',
    tagline: 'ソースコード原典・Issues・Releases・コミット',
    description: 'ソースコードの関数実装、README、Closed Issuesの解決策、リリースノートによる変更点の原典特定。',
    officialLinks: [
      {
        title: 'GitHub Search & Trending',
        url: 'https://github.com/trending',
        description: '世界中のオープンソースの最新トレンドと公式リポジトリ',
        badge: 'GitHub公式',
      },
      {
        title: 'GitHub Topics: Generative AI',
        url: 'https://github.com/topics/generative-ai',
        description: '生成AI関連の最先端OSSリポジトリコレクション',
        badge: 'Topics',
      },
    ],
    searchGenerators: [
      {
        label: 'GitHub リポジトリ検索',
        generateUrl: q => `https://github.com/search?q=${encodeURIComponent(q)}&type=repositories`,
      },
      {
        label: 'GitHub コード検索 (Code Search)',
        generateUrl: q => `https://github.com/search?q=${encodeURIComponent(q)}&type=code`,
      },
      {
        label: 'GitHub Issues / Discussions 検索 (エラー・解決策)',
        generateUrl: q => `https://github.com/search?q=${encodeURIComponent(q)}&type=issues`,
      },
    ],
    injectionTemplates: [
      {
        id: 'github-code-verify',
        title: 'ソースコード原典・Issues解決策特定',
        description: 'GitHubリポジトリ名、該当コードファイルパス、関数名、解決Issue番号の明記を強制',
        promptSnippet: `【一次リソース検証指示: GitHub OSS原典特定】
回答の技術的根拠として、GitHub上の公式OSSリポジトリに遡って確認してください：
- 対象の公式リポジトリ（\`owner/repo\`形式）を特定し明記すること。
- 実装コード・設定ファイル（例: \`requirements.txt\`, \`pyproject.toml\`, \`main.py\`）の該当箇所を参照すること。
- 不具合や仕様上の注意点については、GitHub IssuesやPR（Pull Request）での公式議論・マージ履歴を参照すること。`,
      },
    ],
  },
  {
    id: 'comfyui',
    name: 'ComfyUI & 画像/動画生成OSS',
    icon: '🎨',
    tagline: 'ノード仕様・Custom Nodes・Workflow JSON・Civitai',
    description: 'ComfyUI公式リポジトリ、Custom Node実装、API JSON仕様、Civitaiのモデル原典・サンプラー検証。',
    officialLinks: [
      {
        title: 'ComfyUI 公式リポジトリ (comfyanonymous)',
        url: 'https://github.com/comfyanonymous/ComfyUI',
        description: 'ComfyUIの公式コア実装、標準ノード定義、実行エンジン',
        badge: '公式コア',
      },
      {
        title: 'ComfyUI Examples & Documentation',
        url: 'https://comfyanonymous.github.io/ComfyUI_examples/',
        description: '公式ワークフロー例（SDXL, Flux, Inpainting, ControlNet, Video）',
        badge: '公式例',
      },
      {
        title: 'Civitai (モデル・LoRA・ワークフロー原典)',
        url: 'https://civitai.com/',
        description: 'Checkpoints, LoRA, VAE, ComfyUI Workflowsの実践一次リソース',
        badge: 'Civitai',
      },
      {
        title: 'ComfyUI Manager リポジトリ',
        url: 'https://github.com/ltdrdata/ComfyUI-Manager',
        description: 'カスタムノード導入・依存関係解決の標準マネージャー',
        badge: 'Manager',
      },
    ],
    searchGenerators: [
      {
        label: 'ComfyUI 公式レポ内検索',
        generateUrl: q => `https://github.com/comfyanonymous/ComfyUI/search?q=${encodeURIComponent(q)}`,
      },
      {
        label: 'Civitai モデル・ワークフロー検索',
        generateUrl: q => `https://civitai.com/search/models?query=${encodeURIComponent(q)}`,
      },
      {
        label: 'Reddit r/ComfyUI 検証スレッド検索',
        generateUrl: q => `https://www.reddit.com/r/ComfyUI/search/?q=${encodeURIComponent(q)}&restrict_sr=1`,
      },
    ],
    injectionTemplates: [
      {
        id: 'comfyui-node-spec',
        title: 'ComfyUIノード仕様・入出力ピン・API JSON検証',
        description: 'ノードのCLASS_MAPPINGS、入力・出力ピン型、API形式Workflowの厳密特定',
        promptSnippet: `【一次リソース検証指示: ComfyUIワークフロー＆ノード仕様】
ComfyUIに関する解説や構築を行う際は、以下を一次ソース（公式コードおよびCustom Node実装）に基づき検証してください：
1. 各ノードの正確なPythonクラス名（\`class_type\`）と入力キー名（Inputs）
2. 接続ピンの型（MODEL, CLIP, VAE, CONDITIONING, LATENT, IMAGE 等）の厳密な整合性
3. 外部Custom Nodesが必要な場合は、該当GitHubリポジトリ（URL）およびノード名を明記すること。
4. API実行用JSON（Prompt dict形式）とUI表示用JSONの違いを混同しないこと。`,
      },
    ],
  },
  {
    id: 'agent',
    name: 'Agent系フレームワーク & MCP',
    icon: '🤖',
    tagline: 'LangChain/Graph・AutoGen・CrewAI・MCP・LlamaIndex',
    description: 'マルチエージェント、Tool Calling、Model Context Protocol (MCP)、メモリ管理、ステートマシンの公式仕様。',
    officialLinks: [
      {
        title: 'LangGraph & LangChain Documentation',
        url: 'https://langchain-ai.github.io/langgraph/',
        description: 'エージェント循環グラフ、Human-in-the-loop、ステート管理',
        badge: 'LangGraph公式',
      },
      {
        title: 'Microsoft AutoGen (AG2) Docs',
        url: 'https://microsoft.github.io/autogen/',
        description: 'マルチエージェント会話フレームワーク公式仕様書',
        badge: 'AutoGen公式',
      },
      {
        title: 'CrewAI Documentation',
        url: 'https://docs.crewai.com/',
        description: 'ロールプレイング型マルチエージェントオーケストレーション',
        badge: 'CrewAI公式',
      },
      {
        title: 'Anthropic Model Context Protocol (MCP)',
        url: 'https://modelcontextprotocol.io/',
        description: 'エージェントと外部データ・ツールの標準接続プロトコル仕様書',
        badge: 'MCP公式',
      },
      {
        title: 'LlamaIndex Documentation',
        url: 'https://docs.llamaindex.ai/',
        description: 'RAG、ナレッジグラフ、エージェントデータコネクタ',
        badge: 'LlamaIndex公式',
      },
    ],
    searchGenerators: [
      {
        label: 'LangChain / LangGraph 公式検索',
        generateUrl: q => `https://www.google.com/search?q=site%3Alangchain-ai.github.io+${encodeURIComponent(q)}`,
      },
      {
        label: 'MCP (Model Context Protocol) 仕様検索',
        generateUrl: q => `https://www.google.com/search?q=site%3Amodelcontextprotocol.io+${encodeURIComponent(q)}`,
      },
      {
        label: 'AutoGen 公式検索',
        generateUrl: q => `https://www.google.com/search?q=site%3Amicrosoft.github.io%2Fautogen+${encodeURIComponent(q)}`,
      },
    ],
    injectionTemplates: [
      {
        id: 'agent-arch-spec',
        title: 'エージェント循環設計・State構造・MCP準拠',
        description: 'フレームワークの最新バージョンにおけるState定義・メッセージ履歴・ツール定義の一次仕様',
        promptSnippet: `【一次リソース検証指示: Agentフレームワーク一次仕様】
エージェント構築に関する回答は、各フレームワーク（LangGraph / AutoGen / CrewAI / MCP等）の公式最新ドキュメントの一次仕様に基づいてください：
- 各エージェントの \`State\` 定義、エッジ（遷移条件）、ルーティング関数を具体的に記述すること。
- 旧バージョンの廃止API（例: LangChainのレガシーAgentExecutorなど）を避け、最新の推奨パターン（LangGraphのStateGraph等）を提示すること。
- ツール呼び出し（Tool Calling）スキーマの整合性を検証すること。`,
      },
    ],
  },
  {
    id: 'reddit',
    name: 'Reddit 開発者一次コミュニティ',
    icon: '💬',
    tagline: 'r/LocalLLaMA・r/MachineLearning・r/ComfyUI 実践検証',
    description: '実機ハードウェアでのVRAM消費検証、コミュニティによる最新モデル追試、未ドキュメントの挙動報告。',
    officialLinks: [
      {
        title: 'r/LocalLLaMA (ローカルLLM世界最大フォーラム)',
        url: 'https://www.reddit.com/r/LocalLLaMA/',
        description: '実機ベンチマーク、量子化比較、最新オープンモデルの一次検証報告',
        badge: 'r/LocalLLaMA',
      },
      {
        title: 'r/MachineLearning (機械学習研究ディスカッション)',
        url: 'https://www.reddit.com/r/MachineLearning/',
        description: '研究者・エンジニアによる最新論文の査読議論と再現性検証',
        badge: 'r/MachineLearning',
      },
      {
        title: 'r/ComfyUI (ComfyUI専門コミュニティ)',
        url: 'https://www.reddit.com/r/ComfyUI/',
        description: 'ワークフロー共有、Custom Nodeバグ報告、解決ノウハウ',
        badge: 'r/ComfyUI',
      },
      {
        title: 'r/OpenAI & r/ClaudeAI',
        url: 'https://www.reddit.com/r/OpenAI/',
        description: 'APIレートリミット、プロンプトの挙動変化、実践事例',
        badge: 'r/OpenAI',
      },
    ],
    searchGenerators: [
      {
        label: 'r/LocalLLaMA 検索 (実機検証・量子化)',
        generateUrl: q => `https://www.reddit.com/r/LocalLLaMA/search/?q=${encodeURIComponent(q)}&restrict_sr=1`,
      },
      {
        label: 'r/ComfyUI 検索 (ノード・エラー解決)',
        generateUrl: q => `https://www.reddit.com/r/ComfyUI/search/?q=${encodeURIComponent(q)}&restrict_sr=1`,
      },
      {
        label: 'Reddit全体 (機械学習・AI開発)',
        generateUrl: q => `https://www.reddit.com/search/?q=${encodeURIComponent(q)}+subreddit%3ALocalLLaMA+OR+subreddit%3AMachineLearning`,
      },
    ],
    injectionTemplates: [
      {
        id: 'reddit-empirical-eval',
        title: '実機検証・コミュニティ再現レポート照合',
        description: 'スペックシート上の公称値と、コミュニティでの実測値・再現報告の差分検証',
        promptSnippet: `【一次リソース検証指示: 開発者コミュニティ実測・再現性】
公称スペックだけでなく、Reddit（r/LocalLLaMA, r/MachineLearning等）や開発者コミュニティで実際に報告されている「実機再現性・実測ベンチマーク」の知見を照合してください：
- ハードウェア（VRAM容量、コンテキスト長、量子化ビット数）ごとの実測スループット（tok/s）やメモリ溢れの現実的限界。
- 公式ドキュメントには書かれていない実践的ハマりどころや、コミュニティで発見されたワークアラウンド（回避策）。`,
      },
    ],
  },
  {
    id: 'academic',
    name: '研究発表・論文 (arXiv & Academic)',
    icon: '📄',
    tagline: 'arXiv・Papers with Code・OpenReview・Scholar',
    description: 'アルゴリズムの原典論文、アブストラクト、数式定義、NeurIPS/ICLR/ACL採択論文の一次特定。',
    officialLinks: [
      {
        title: 'arXiv.org (コンピュータサイエンス/AI論文アーカイブ)',
        url: 'https://arxiv.org/list/cs.AI/recent',
        description: 'AI, CL, CV分野の世界最先端プレプリント原典',
        badge: 'arXiv公式',
      },
      {
        title: 'Papers with Code',
        url: 'https://paperswithcode.com/',
        description: '論文と公式実装コード・SOTAベンチマークの紐付けデータベース',
        badge: 'PapersWithCode',
      },
      {
        title: 'Google Scholar (学術検索)',
        url: 'https://scholar.google.com/',
        description: '被引用数、著者、関連研究の網羅的学術検索',
        badge: 'Scholar',
      },
      {
        title: 'OpenReview.net',
        url: 'https://openreview.net/',
        description: 'ICLR, NeurIPS等の公式査読（Reviewer comments）と反論原典',
        badge: 'OpenReview',
      },
    ],
    searchGenerators: [
      {
        label: 'arXiv 論文検索 (タイトル・アブストラクト)',
        generateUrl: q => `https://arxiv.org/search/?query=${encodeURIComponent(q)}&searchtype=all`,
      },
      {
        label: 'Papers with Code (論文＋実装コード検索)',
        generateUrl: q => `https://paperswithcode.com/search?q_term=${encodeURIComponent(q)}`,
      },
      {
        label: 'Google Scholar 検索',
        generateUrl: q => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`,
      },
    ],
    injectionTemplates: [
      {
        id: 'academic-paper-cite',
        title: '論文原典・著者・arXiv ID・手法特定',
        description: '理論や手法の提唱論文（タイトル、主要著者、発表年、arXiv ID）を明記し数理的根拠を提示',
        promptSnippet: `【一次リソース検証指示: 学術論文・原典特定】
本トピックで言及するアルゴリズム・モデル構造・理論については、必ず提唱された「原典論文（Primary Research Paper）」を特定してください：
1. 論文タイトル、主要著者名、発表年（またはarXiv ID: \`arXiv:XXXX.XXXXX\`）
2. 論文で提案されたコア・アイデアの原典における定義（数式またはアーキテクチャ図の要点）
3. 追試実装（Papers with Code等での公式/準公式リポジトリ）の存在有無`,
      },
    ],
  },
  {
    id: 'techblog',
    name: '国内エンジニア技術発信 (Zenn / Qiita)',
    icon: '⚡',
    tagline: 'Zenn・Qiita・企業テックブログの実践追試知見',
    description: '国内エンジニアによる最新技術の日本語での実践検証、トラブルシューティング、環境構築の一次ログ。',
    officialLinks: [
      {
        title: 'Zenn (エンジニアのための情報共有コミュニティ)',
        url: 'https://zenn.dev/',
        description: '知見や実装コードを共有する高品質技術発信プラットフォーム',
        badge: 'Zenn',
      },
      {
        title: 'Qiita (プログラミング情報共有サイト)',
        url: 'https://qiita.com/',
        description: 'エラー解決、Tips、環境構築の国内最大級ナレッジベース',
        badge: 'Qiita',
      },
      {
        title: 'はてなブックマーク テクノロジー',
        url: 'https://b.hatena.ne.jp/hotentry/it',
        description: '日本のITエンジニアコミュニティで今話題の技術記事',
        badge: 'Hatena',
      },
    ],
    searchGenerators: [
      {
        label: 'Zenn 記事検索',
        generateUrl: q => `https://zenn.dev/search?q=${encodeURIComponent(q)}`,
      },
      {
        label: 'Qiita 記事検索',
        generateUrl: q => `https://qiita.com/search?q=${encodeURIComponent(q)}`,
      },
      {
        label: 'Google (Zenn & Qiita 同時検索)',
        generateUrl: q => `https://www.google.com/search?q=(site%3Azenn.dev+OR+site%3Aqiita.com)+${encodeURIComponent(q)}`,
      },
    ],
    injectionTemplates: [
      {
        id: 'techblog-troubleshooting',
        title: '国内実装ログ・トラブルシューティング検証',
        description: '国内エンジニアの追試記事や日本語特有の環境構築（Windows/日本語エンコード等）の知見を照合',
        promptSnippet: `【一次リソース検証指示: 国内エンジニア実装検証】
グローバルの公式仕様に加えて、ZennやQiita等で報告されている「国内エンジニアの実装検証・落とし穴（日本語処理、Windows固有のパス問題、CUDA環境構築の相性等）」を反映し、日本国内の開発環境で即座に再現可能な具体的手順を提示してください。`,
      },
    ],
  },
];

/* ==========================================================================
   PRIMARY RESOURCE OUTPUT INSPECTOR (AI出力の一次情報適合度スキャン)
   ========================================================================== */

export interface InspectionCheckItem {
  id: string;
  label: string;
  category: string;
  passed: boolean;
  details: string;
  foundMatches: string[];
}

export interface InspectionResult {
  score: number; // 0 - 100
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeColor: string;
  summary: string;
  checks: InspectionCheckItem[];
  detectedUrls: string[];
  detectedRepos: string[];
  detectedArxivOrPapers: string[];
  detectedModels: string[];
}

export const inspectPrimaryResourcesInText = (text: string): InspectionResult => {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      grade: 'D',
      gradeColor: 'text-gray-400',
      summary: '出力テキストがまだありません。',
      checks: [],
      detectedUrls: [],
      detectedRepos: [],
      detectedArxivOrPapers: [],
      detectedModels: [],
    };
  }

  // 1. Detect URLs
  const urlRegex = /(https?:\/\/[^\s\)\"\'\`\<\>]+)/gi;
  const urls = Array.from(new Set(text.match(urlRegex) || []));

  // 2. Detect GitHub Repos (e.g. username/repository or github.com/username/repository)
  const repoRegex = /(?:github\.com\/|[\s\`\(\[])([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)(?:[\s\`\)\]\/]|$)/gi;
  const rawRepos: string[] = [];
  let repoMatch;
  while ((repoMatch = repoRegex.exec(text)) !== null) {
    const owner = repoMatch[1];
    const repo = repoMatch[2];
    if (owner && repo && !['http:', 'https:', 'www', 'com', 'org', 'api'].includes(owner)) {
      rawRepos.push(`${owner}/${repo}`);
    }
  }
  const repos = Array.from(new Set(rawRepos));

  // 3. Detect arXiv IDs & Paper citations
  const arxivRegex = /(?:arXiv:?\s*(\d{4}\.\d{4,5}(?:v\d+)?)|(?:NeurIPS|ICLR|ICML|CVPR|ACL|EMNLP)\s*(?:20\d{2})?)/gi;
  const arxivMatches = Array.from(new Set(text.match(arxivRegex) || []));

  // 4. Detect Model IDs (e.g. meta-llama/..., gemini-..., gpt-..., Qwen/...)
  const modelRegex = /(?:gemini-[a-zA-Z0-9\.\-]+|gpt-[a-zA-Z0-9\.\-]+|claude-[a-zA-Z0-9\.\-]+|llama-[a-zA-Z0-9\.\-]+|[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+(?:Instruct|Chat|Base|GGUF|AWQ))/gi;
  const models = Array.from(new Set(text.match(modelRegex) || []));

  // 5. Version numbers check (e.g. v1.2, 3.8, 0.4.1)
  const versionRegex = /(?:v\d+\.\d+|\b\d+\.\d+\.\d+\b|Python\s*3\.\d+|CUDA\s*\d+\.\d+)/gi;
  const versions = Array.from(new Set(text.match(versionRegex) || []));

  // 6. Check for distinction between verified facts vs assumptions/guesses
  const distinctionKeywords = ['一次情報', '公式仕様', '原典', 'ドキュメント', '公称', '推定', '注意点', '検証'];
  const foundDistinction = distinctionKeywords.filter(k => text.includes(k));

  // Build Checklist
  const checks: InspectionCheckItem[] = [
    {
      id: 'urls',
      label: '一次リソースURL / 公式参照リンクの明記',
      category: '参照性',
      passed: urls.length > 0,
      details: urls.length > 0 ? `${urls.length}件のリンクを検出` : 'URLリンクが含まれていません',
      foundMatches: urls.slice(0, 5),
    },
    {
      id: 'repos',
      label: 'GitHub OSSリポジトリ / コードパスの特定',
      category: 'コード原典',
      passed: repos.length > 0,
      details: repos.length > 0 ? `${repos.length}件のリポジトリ参照を検出` : 'GitHubリポジトリ表記なし',
      foundMatches: repos.slice(0, 5),
    },
    {
      id: 'models',
      label: '対象モデルID・正式名称の特定',
      category: 'モデル特定',
      passed: models.length > 0,
      details: models.length > 0 ? `${models.length}件のモデル識別子を検出` : 'モデル識別子なし',
      foundMatches: models.slice(0, 5),
    },
    {
      id: 'versions',
      label: 'バージョン番号 / 環境仕様の明記',
      category: '再現性',
      passed: versions.length > 0,
      details: versions.length > 0 ? `${versions.length}件のバージョン・環境表記を検出` : 'バージョン番号が明記されていません',
      foundMatches: versions.slice(0, 5),
    },
    {
      id: 'papers',
      label: '学術論文原典 (arXiv / 国際会議) または公式発表の特定',
      category: '学術・原典',
      passed: arxivMatches.length > 0,
      details: arxivMatches.length > 0 ? `${arxivMatches.length}件の論文・査読引用を検出` : '論文ID等の学術原典言及なし',
      foundMatches: arxivMatches.slice(0, 5),
    },
    {
      id: 'fact-distinction',
      label: '公式仕様と推測・注意点の明示的切り分け',
      category: '厳格性',
      passed: foundDistinction.length >= 2,
      details: foundDistinction.length >= 2 ? `検証語彙 [${foundDistinction.join(', ')}] を検出` : '公式仕様と推測の区分けが不十分です',
      foundMatches: foundDistinction,
    },
  ];

  // Calculate score
  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
  let gradeColor = 'text-rose-400';
  let summary = '一次リソースの特定が不足しています。リンクやリポジトリ名、論文原典の明記を促してください。';

  if (score >= 85) {
    grade = 'S';
    gradeColor = 'text-emerald-400';
    summary = '極めて高い一次リソース適合度です。公式リンク、リポジトリ、モデルID、再現要件が厳格に揃っています。';
  } else if (score >= 65) {
    grade = 'A';
    gradeColor = 'text-cyan-400';
    summary = '十分な一次リソース特定がなされています。公式リポジトリや識別子が具体的に特定されています。';
  } else if (score >= 45) {
    grade = 'B';
    gradeColor = 'text-blue-400';
    summary = '基礎的な一次情報（モデル名やリンク等）が含まれています。より詳細な原典URLやバージョン番号を付加すると万全です。';
  } else if (score >= 20) {
    grade = 'C';
    gradeColor = 'text-amber-400';
    summary = '一部のキーワードはありますが、一次情報の原典URLやコードリポジトリへの紐付けが弱めです。';
  }

  return {
    score,
    grade,
    gradeColor,
    summary,
    checks,
    detectedUrls: urls,
    detectedRepos: repos,
    detectedArxivOrPapers: arxivMatches,
    detectedModels: models,
  };
};
