# 🧠 AI Orchestrator (マルチLLM & ローカルPC連携版)

> **思考を資産に変え、収益化への最短ルートを創造する次世代プロンプトオーケストレーション環境**  
> Google Gemini 無料枠Waitタイマー・OpenRouter・Ollama・LM Studio・PDFナレッジベース（RAG）・システムインストラクションを完全統合。

---

## 🌟 主な特徴 (Features)

### 1. ⚡ マルチLLMプロバイダー & ローカルPC完全連携
- **Google Gemini**: 公式 SDK (`@google/genai`) 連携。無料枠制限（15 RPM等）を自動待機する **Waitタイマー & レートリミッター** を標準内蔵。
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
```bash
# クローン
git clone https://github.com/your-username/ai-orchestrator.git
cd ai-orchestrator

# 依存パッケージのインストール
npm install
```

### 2. 環境変数の設定 (オプション)
Google Gemini APIを利用する場合は、プロジェクトルートに `.env.local` を作成するか、アプリ内の設定画面からAPIキーを設定できます。
```bash
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. アプリケーションの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開きます。

---

## 💻 ローカルPC LLM (Ollama / LM Studio) の超簡単連携手順

### 🦙 Ollama を使う場合
1. Ollamaを起動する際、ブラウザからのCORSアクセスを許可します：
   - **Mac / Linux (ターミナル)**:
     ```bash
     OLLAMA_ORIGINS="*" ollama serve
     ```
   - **Windows (PowerShell)**:
     ```powershell
     $env:OLLAMA_ORIGINS="*"
     ollama serve
     ```
2. 本アプリ左下の「**⚡ LLM & PC連携**」を開き、Ollamaを選択して「**接続テスト & モデル取得**」をクリック。PC内のモデル一覧が自動同期されます。

### 🧪 LM Studio を使う場合
1. LM Studioを起動し、お好みのモデルをロード。
2. 左メニュー「**Local Server (↔)**」を開き、「**Start Server**」をクリック（ポート: `1234`）。
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
- **AI SDK**: `@google/genai` (Official Google Gen AI SDK)
- **PDF Parser**: `pdfjs-dist` (ローカルブラウザ完結型PDF抽出)
- **Icons**: Lucide Icons
- **Storage**: Browser LocalStorage & Local File System

---

## 📄 ライセンス
MIT License
