import React, { useState } from 'react';
import { ICONS } from '../constants';

export const GitHubReadmeGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const cloneCommands = `# 1. リポジトリをクローン
git clone https://github.com/your-username/ai-orchestrator.git
cd ai-orchestrator

# 2. 依存関係をインストール
npm install

# 3. アプリケーションをローカル起動 (Port 3000)
npm run dev`;

  const ollamaCommands = `# Mac / Linux:
OLLAMA_ORIGINS="*" ollama serve

# Windows (PowerShell):
$env:OLLAMA_ORIGINS="*"
ollama serve`;

  const envSample = `# Google Gemini APIキー (オプション: UIの設定画面からも入力可能)
VITE_GEMINI_API_KEY="your_api_key_here"`;

  return (
    <div className="space-y-6 text-gray-200 text-sm leading-relaxed">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-gray-800 via-gray-850 to-gray-800 rounded-xl border border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐙</span>
            <h3 className="text-lg font-bold text-white">GitHub README & 超簡易導入ガイド</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            GitHubリポジトリ掲載用の日本語READMEと、1分で始められる最短セットアップ手順書です。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
            README.md 生成済
          </span>
        </div>
      </div>

      {/* 1. Quick Start / Installation Section */}
      <div className="p-4 bg-gray-850 rounded-xl border border-gray-750 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-white flex items-center gap-2 text-base">
            <span className="text-cyan-400">⚡</span>
            <span>超簡易インストール (3ステップ)</span>
          </h4>
          <button
            onClick={() => handleCopy(cloneCommands, 'clone')}
            className="text-xs px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors flex items-center gap-1"
          >
            {copiedSection === 'clone' ? '✓ コピー完了' : `${ICONS.copy} コマンドをコピー`}
          </button>
        </div>

        <pre className="bg-gray-950 p-3 rounded-lg border border-gray-800 font-mono text-xs text-cyan-300 overflow-x-auto">
          {cloneCommands}
        </pre>
        <p className="text-xs text-gray-400">
          起動後、ブラウザで <code className="text-amber-300">http://localhost:3000</code> を開くだけですぐに使用できます。
        </p>
      </div>

      {/* 2. Usage Quick Flow */}
      <div className="p-4 bg-gray-850 rounded-xl border border-gray-750 space-y-3">
        <h4 className="font-bold text-white flex items-center gap-2 text-base">
          <span className="text-purple-400">🚀</span>
          <span>使い方概要 (3ステップ・ワークフロー)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 space-y-1">
            <div className="text-purple-400 font-bold text-xs">Step 1. ナレッジ・PDF取込</div>
            <p className="text-xs text-gray-300">
              左下「ナレッジ＆ガイド」から、手持ちのPDFや参考ノウハウをドラッグ＆ドロップで登録。
            </p>
          </div>

          <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 space-y-1">
            <div className="text-amber-400 font-bold text-xs">Step 2. 指示＆モデル選択</div>
            <p className="text-xs text-gray-300">
              「Note専任プロエディター」等の指示と、Gemini/PCローカルLLM/OpenRouterを選択。
            </p>
          </div>

          <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 space-y-1">
            <div className="text-cyan-400 font-bold text-xs">Step 3. 実行＆出力</div>
            <p className="text-xs text-gray-300">
              参照したいナレッジにチェックを入れ「プロンプト実行」。リアルタイムにストリーミング出力！
            </p>
          </div>
        </div>
      </div>

      {/* 3. PC Local LLM (Ollama & LM Studio) Integration Quick Guide */}
      <div className="p-4 bg-gray-850 rounded-xl border border-gray-750 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-white flex items-center gap-2 text-base">
            <span className="text-emerald-400">💻</span>
            <span>PCローカルLLM（Ollama / LM Studio）超簡単連携</span>
          </h4>
          <button
            onClick={() => handleCopy(ollamaCommands, 'ollama')}
            className="text-xs px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors flex items-center gap-1"
          >
            {copiedSection === 'ollama' ? '✓ コピー完了' : `${ICONS.copy} CORS設定をコピー`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-bold text-xs text-cyan-300">🦙 Ollama の場合:</div>
            <p className="text-xs text-gray-400">ブラウザからの通信を許可して起動します:</p>
            <pre className="bg-gray-950 p-2.5 rounded border border-gray-800 font-mono text-[11px] text-cyan-200">
              {ollamaCommands}
            </pre>
            <p className="text-[11px] text-gray-400">
              アプリの「接続テスト & モデル取得」を押せば、PC内のモデルが自動反映されます。
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-xs text-amber-300">🧪 LM Studio の場合:</div>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1">
              <li>LM Studio を起動し、モデルをロード</li>
              <li>左タブ「Local Server」を開き「Start Server」を押す（Port: <code>1234</code>）</li>
              <li>アプリ側の「接続テスト & モデル取得」をクリックするだけで即時接続完了！</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 4. Full README.md Markdown View & Copy */}
      <div className="p-4 bg-gray-850 rounded-xl border border-gray-750 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-white flex items-center gap-2 text-base">
            <span>📄</span>
            <span>GitHub用 日本語 README.md 完全版</span>
          </h4>
          <button
            onClick={() => handleCopy(fullReadmeText, 'readme')}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow"
          >
            {copiedSection === 'readme' ? '✓ README.mdを全コピーしました' : `${ICONS.copy} README.md を全コピー`}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          リポジトリのルートに <code className="text-white">README.md</code> として保存されています。GitHubリポジトリの作成時にそのままご利用いただけます。
        </p>
        <div className="max-h-60 overflow-y-auto bg-gray-950 p-3 rounded-lg border border-gray-800 text-xs font-mono text-gray-300 whitespace-pre-wrap">
          {fullReadmeText}
        </div>
      </div>
    </div>
  );
};

const fullReadmeText = `# 🧠 AI Orchestrator (マルチLLM & ローカルPC連携版)

> **思考を資産に変え、収益化への最短ルートを創造する次世代プロンプトオーケストレーション環境**  
> Google Gemini 無料枠Waitタイマー・OpenRouter・Ollama・LM Studio・PDFナレッジベース（RAG）・システムインストラクションを完全統合。

---

## 🌟 主な特徴 (Features)

### 1. ⚡ マルチLLMプロバイダー & ローカルPC完全連携
- **Google Gemini**: 公式 SDK (@google/genai) 連携。無料枠制限（15 RPM等）を自動待機する **Waitタイマー & レートリミッター** を標準内蔵。
- **PCローカルLLM (Ollama & LM Studio)**: お使いのPCで動作するローカルモデル（Llama 3.3, DeepSeek-R1, Qwen等）とCORS経由で完全プライベート＆無料・無制限に連携。
- **OpenRouter / Groq / DeepSeek / GitHub Models**: 1つのAPIキーで数百種類の最先端LLM（Claude 3.7, DeepSeek-V3等）へ瞬時に切り替え可能。
- **プロンプト単位のモデル上書き**: プロジェクトやプロンプトごとに最適なプロバイダーとモデルを個別設定可能。

### 2. 📚 ナレッジベース & PDF・文書ファイル取り込み (ローカルRAG)
- **ドラッグ＆ドロップで即時取り込み**: PDF、Markdown、Text、CSV、JSONをローカルブラウザ内で高速パース・テキスト抽出。
- **AIプロンプトへの知識注入**: 取り込んだPDFや独自ノウハウを選択するだけで、プロンプト実行時にAIへ参照コンテキストとして自動付加。
- **体系的カテゴリ管理**: マーケティング・心理学、Note・SEO、ビジネス収益化、技術AIノウハウなどのプリセット知識を標準搭載。

### 3. 🧠 プロの思考をインストールする「システムインストラクション」
- AIの役割・ルール・トーン＆マナーを規定するシステムプロンプト管理。
- **プロ仕様のプリセット**: 「Note専任プロエディター」「恋愛マーケティング・ファン化ディレクター」「辛口コードレビュアー」「YouTube台本作家」等を即座に利用可能。
- **1クリック複製 & JSONエクスポート/インポート**: 自分の資産として永続化・移行可能。

### 4. 🚀 4つの実行モード
- **ストレート実行 (Straight)**: 基本のダイレクト出力。
- **リサーチ強化 (Research Mode)**: 多角的な分析と情報網羅性を高めるモード。
- **改善・洗練 (Refine Mode)**: 既存の文章やアイデアをプロ品質へブラッシュアップ。
- **シミュレーション (Simulation)**: 読者や顧客視点での反応をシミュレート。

---

## 🚀 超簡易インストール & セットアップガイド (Quick Start)

### 📋 前提条件
- Node.js 18.0 以上
- npm または yarn / pnpm

### 1. リポジトリのクローン & パッケージインストール
\`\`\`bash
# クローン
git clone https://github.com/your-username/ai-orchestrator.git
cd ai-orchestrator

# 依存パッケージのインストール
npm install
\`\`\`

### 2. 環境変数の設定 (オプション)
Google Gemini APIを利用する場合は、プロジェクトルートに \`.env.local\` を作成するか、アプリ内の設定画面からAPIキーを設定できます。
\`\`\`bash
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
\`\`\`

### 3. アプリケーションの起動
\`\`\`bash
npm run dev
\`\`\`
ブラウザで \`http://localhost:3000\` を開きます。

---

## 💻 ローカルPC LLM (Ollama / LM Studio) の超簡単連携手順

### 🦙 Ollama を使う場合
1. Ollamaを起動する際、ブラウザからのCORSアクセスを許可します：
   - **Mac / Linux (ターミナル)**:
     \`\`\`bash
     OLLAMA_ORIGINS="*" ollama serve
     \`\`\`
   - **Windows (PowerShell)**:
     \`\`\`powershell
     $env:OLLAMA_ORIGINS="*"
     ollama serve
     \`\`\`
2. 本アプリ左下の「**⚡ LLM & PC連携**」を開き、Ollamaを選択して「**接続テスト & モデル取得**」をクリック。PC内のモデル一覧が自動同期されます。

### 🧪 LM Studio を使う場合
1. LM Studioを起動し、お好みのモデルをロード。
2. 左メニュー「**Local Server (↔)**」を開き、「**Start Server**」をクリック（ポート: \`1234\`）。
3. アプリ内の「**⚡ LLM & PC連携**」で LM Studio を選択し、「**接続テスト & モデル取得**」を押すだけ！

---

## 📖 アプリケーションの使い方 3ステップ

1. **ナレッジ・PDFの登録 (ナレッジ＆ガイド)**
   - 左下または画面上の「📚 ナレッジ」から、お手持ちのPDFや資料をドラッグ＆ドロップで取り込みます。
2. **システム指示とモデルの選択**
   - 目的（Note執筆、マーケティング等）に合わせてシステムインストラクションを選択。
   - Gemini、OpenRouter、PCローカルLLMなど好きなモデルを指定。
3. **プロンプトを実行**
   - 参照したいナレッジにチェックを入れて「プロンプト実行」をクリック。リアルタイムにストリーミング出力されます。

---

## 🛠️ 技術スタック
- **Frontend**: React 18 / TypeScript / Vite / Tailwind CSS
- **AI SDK**: @google/genai (Official Google Gen AI SDK)
- **PDF Parser**: pdfjs-dist (ローカルブラウザ完結型PDF抽出)
- **Icons**: Lucide Icons
- **Storage**: Browser LocalStorage & Local File System

---

## 📄 ライセンス
MIT License
`;
