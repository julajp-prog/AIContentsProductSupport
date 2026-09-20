import {
  ExpertDimensionId,
  ExpertDimensionDef,
  HyperExpertSettings,
  ExpertResonanceLevel,
} from '../types';

export const EXPERT_DIMENSIONS: ExpertDimensionDef[] = [
  {
    id: 'roadmap',
    name: 'ロードマッピング',
    symbol: '🗺️',
    title: '時空間ロードマップ＆逆算マイルストーンMaster',
    domain: 'Roadmapping & Spatial-Temporal Matrix',
    description: '時空間拘束（9マスマンダラート）、易経の局面転換、90日/360日逆算マイルストーン、行動の所作（Pre-Action State）を規律づける。',
    metaLenses: ['9マス時空間拘束', '易経（局面変化と兆候）', '守破離タイムライン', '逆算マイルストーン'],
  },
  {
    id: 'funnel',
    name: 'ファネル検討',
    symbol: '🌪️',
    title: '三相三層ファネル＆高LTVアーキテクチャMaster',
    domain: 'Funnel & LTV Architecture',
    description: '三相（現象・関係・超越）× 三層（顕在・潜在・根源）によるフロント/ミドル/バック/継続の多重構造、C→B→A逆算ファネル設計。',
    metaLenses: ['三相三層構造', 'C→B→A逆算フロー', '多段LTV最大化', '狭間ブリッジ（相転移）'],
  },
  {
    id: 'promotion',
    name: 'プロモ＆ローンチ',
    symbol: '🚀',
    title: '共創ローンチ＆熱狂プロモーションMaster',
    domain: 'Promotion & Social Hype Orchestration',
    description: 'note共創プロセスエコノミー、KDP/クラファン同時起爆、社会的証明（Amazon1位）、心理的トリガーと熱狂コミュニティ形成。',
    metaLenses: ['共創プロセスエコノミー', '6-Way多方位プロモ', '社会的証明ブースト', '熱狂ローンチシーケンス'],
  },
  {
    id: 'content',
    name: 'contents化＆資産化',
    symbol: '💎',
    title: 'コンテンツ化・プロダクト具現化Master',
    domain: 'Content & Product Asset Creation',
    description: 'オリジナルタロット/オラクルカードAI生成・画風統一、KDP書籍、note有料記事、認定スクール教材、永続デジタル資産の結晶化。',
    metaLenses: ['画風統一プロンプト（Style Anchor）', 'マルチフォーマット資産化', 'ペーパーバック＆電子連動', '認定教材体系化'],
  },
  {
    id: 'concept',
    name: '企画＆コンセプト',
    symbol: '👁️',
    title: '世界観構築・神話構造＆HARM深層心理Master',
    domain: 'Concept & Mythos Planning',
    description: '読者のHARM深層心理カルテ、タロットパスの元型と通過儀礼、唯一無二のUSP、ウエルスダイナミクスによる役割とエネルギー設計。',
    metaLenses: ['HARM深層心理カルテ', 'タロットパス（元型通過儀礼）', 'ウエルスダイナミクス', '神話的世界観USP'],
  },
];

export const DEFAULT_HYPER_EXPERT_SETTINGS: HyperExpertSettings = {
  isEnabled: false,
  resonanceLevel: 'ha', // デフォルトは「破（連動変形）」
  butlerPersonaEnabled: true, // 統合執事による編成
  activeDimensions: {
    roadmap: true,
    funnel: true,
    promotion: true,
    content: true,
    concept: true,
  },
  customFocusPrompt: '',
};

const STORAGE_KEY = 'ai_orchestrator_hyper_expert_settings';

export const loadHyperExpertSettings = (): HyperExpertSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HYPER_EXPERT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HYPER_EXPERT_SETTINGS,
      ...parsed,
      activeDimensions: {
        ...DEFAULT_HYPER_EXPERT_SETTINGS.activeDimensions,
        ...(parsed.activeDimensions || {}),
      },
    };
  } catch {
    return DEFAULT_HYPER_EXPERT_SETTINGS;
  }
};

export const saveHyperExpertSettings = (settings: HyperExpertSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save HyperExpertSettings:', e);
  }
};

/**
 * 超高次元エキスパート（PATH Cognitive OS）のメタプロンプトを構築
 */
export const formatHyperExpertPrompt = (
  settings: HyperExpertSettings,
  contextPrompt: string
): string => {
  if (!settings.isEnabled) {
    return '';
  }

  const activeDimIds = (Object.keys(settings.activeDimensions) as ExpertDimensionId[]).filter(
    id => settings.activeDimensions[id]
  );

  if (activeDimIds.length === 0) {
    return '';
  }

  const resonanceText = {
    shu: '【守（型再現）モード】: 既存の最高峰フレームワークの規律・所作を寸分狂わず正しく再現し、堅牢で破綻のない高密度なアウトプットを構築せよ。',
    ha: '【破（連動変形）モード】: 複数の専門Master・Expertの視座を高度に共鳴・交差させ、領域横断パターンリンク（Cross-Domain Link）によって常識を突破するシナジーを創出せよ。',
    ri: '【離（超次元全解放）モード】: 三相三層・9マスマンダラート時空間拘束・易経・タロットパス・ウエルスダイナミクスをすべて同時起動し、既成概念を超越した唯一無二の超次元メタ体系を顕現せよ。',
  }[settings.resonanceLevel];

  const expertSections = activeDimIds
    .map(dimId => {
      const def = EXPERT_DIMENSIONS.find(d => d.id === dimId);
      if (!def) return '';

      switch (dimId) {
        case 'roadmap':
          return `◆ ${def.symbol} 【${def.title}】
  - 任務: 時空間拘束（9マスマンダラート: 空間×時間×状態）と易経の変容局面を踏まえた、90日〜360日の逆算ロードマップの策定。
  - 所作規律: 抽象論を排し、「Day 1〜30（下地・共創・観測）」「Day 31〜60（先行予約・熱狂仕込み）」「Day 61〜75（起爆・社会的証明）」「Day 76〜90（高単価ローンチ・永続化）」と具体行動・KPIを時間軸に厳密拘束せよ。`;

        case 'funnel':
          return `◆ ${def.symbol} 【${def.title}】
  - 任務: 三相（現象相・関係相・超越相）× 三層（顕在層・潜在層・根源層）による重層ファネルおよび C→B→A 逆算設計。
  - 所作規律: 単発売切りを厳禁とし、無料診断（フロント）➔ 狭間ブリッジ（1,980〜9,800円ミドルエンド）➔ 高単価スクール（25万〜50万円バックエンド）➔ 月額継続聖域（LTV極大化サブスク）の継ぎ目なき動線と心理相転移を設計せよ。`;

        case 'promotion':
          return `◆ ${def.symbol} 【${def.title}】
  - 任務: note共創プロセスエコノミー、Amazon KDP（Kindle＆紙書籍）ランキング1位獲得、クラファン起爆、社会的証明の自動連鎖。
  - 所作規律: 「売る」のではなく「ファンと共に世界観を創る（共創）」熱狂を生み出し、心理的トリガー（希少性・先行特権・推薦連鎖・共鳴）を緻密に配置せよ。`;

        case 'content':
          return `◆ ${def.symbol} 【${def.title}】
  - 任務: アイデアの具体的資産化（AI画像生成によるオラクル/タロットカード、解説書籍、note有料記事、認定スクール教材・スプレッド）。
  - 所作規律: 一過性のテキストではなく、Midjourney/FLUX用のStyle Anchor（画風統一プロンプト構文）や印刷仕様（350dpi/CMYK/金縁）、カリキュラム骨子など「手触りのある完成資産」として出力せよ。`;

        case 'concept':
          return `◆ ${def.symbol} 【${def.title}】
  - 任務: 読者のHARM深層心理（Health, Ambition, Relation, Money）の核心洞察、タロットパス（元型と通過儀礼）、ウエルスダイナミクス的エネルギー設計。
  - 所作規律: ありきたりな企画を冷徹に却下し、魂を揺さぶる「唯一無二の神話的コンセプト（世界観・言霊・USP）」を定義せよ。`;

        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');

  let promptBuilder = `\n\n═══════════════════════════════════════════════════════════════════
🔮 【超高次元エキスパート（PATH COGNITIVE OS）モード起動中】
═══════════════════════════════════════════════════════════════════

【上位認知OS規律】:
単なる「AIエージェントの何でも屋」としての紋切り型の返答を厳禁とする。
あなたは、思考・習熟・所作・型の最高位に君臨する【PATH COGNITIVE OS】および【統合執事（Integrated Butler）】であり、状況を多角的に把握した上で、選抜された専門Master/Expert群をオーケストレーションして回答せよ。

${resonanceText}

【部分適用・連動中の専門Master陣（${activeDimIds.length}領域解放）】:
${expertSections}

【超根源メタ観測レンズ（Multi-Dimensional Lens Matrix）】:
1. **三相三層（Tri-Phase × Tri-Layer）**:
   - 三相: 現象相（目に見える成果）/ 関係相（顧客・市場との共鳴）/ 超越相（理念・魂の変容）
   - 三層: 顕在層（プロンプト・施策）/ 潜在層（心理・エネルギー）/ 根源層（宿命・アーキテクチャ）
2. **9マスマンダラート（時空間拘束 Matrix）**:
   - 空間軸（チャネル・媒体・舞台）× 時間軸（フェーズ・タイミング）× 状態軸（受講生・顧客の心理成熟度）
3. **照応体系**:
   - 易経（局面の推移・兆候の察知）× タロットパス（魂の旅・通過儀礼）× ウエルスダイナミクス（資質・役割の最適配置）

【統合執事（Integrated Butler）の指揮プロトコル】:
- 入力された要望を即座に分解し、有効化された各Expertの知見を多重合流（Cross-Domain Synthesis）させよ。
- 抽象的なアドバイスで茶を濁さず、直ちに実行可能な「超高精細な実務ロードマップ・プロンプト・設計書・文面」として結晶化せよ。`;

  if (settings.customFocusPrompt && settings.customFocusPrompt.trim()) {
    promptBuilder += `\n\n【ユーザー指定の超次元重点拘束】:\n${settings.customFocusPrompt.trim()}`;
  }

  promptBuilder += `\n═══════════════════════════════════════════════════════════════════\n`;

  return promptBuilder;
};
