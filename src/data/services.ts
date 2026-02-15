export interface TrainingModule {
  number: string;
  title: string;
  subtitle: string;
  tools: string[];
  color: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Strength {
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Pillar {
  title: string;
  subtitle: string;
  points: { metric: string; description: string }[];
  outcome: string;
}

export const aiImpactLab = {
  nameEn: "AI IMPACT LAB",
  tagline: "人が育つ会社に、人は集まる。",
  description:
    "AIリテラシーは「企業の生存戦略」そのもの。全社的AIリスキリングで現場力の強化と採用ブランディングの両方を実現します。",

  pillars: [
    {
      title: "現場力の強化",
      subtitle: "経済的利益の源泉（価値創出）",
      points: [
        { metric: "18.6万時間/年 削減", description: "パナソニック コネクト — 全社員1.2万人にAI展開" },
        { metric: "営業効率 68% 向上", description: "日清食品 — AIをコンサルとして活用" },
        { metric: "2025年の崖 回避", description: "IT/AIリテラシーがモダナイゼーションの鍵" },
      ],
      outcome: "収益構造の抜本的改善",
    },
    {
      title: "採用ブランディング",
      subtitle: "人材獲得競争の勝利（選ばれるインフラ）",
      points: [
        { metric: "26卒の 82.7% がAI活用", description: "AIは「あって当たり前のインフラ」に（マイナビ調査）" },
        { metric: "志望度に直結", description: "DX推進度・AI環境が求職者の企業選定基準に（CodeZine調査）" },
        { metric: "離職リスク抑制", description: "デジタルフリクション低減で世代間ギャップ解消（Gartner）" },
      ],
      outcome: "イノベーション源泉の確保",
    },
  ] as Pillar[],

  modules: [
    {
      number: "I",
      title: "思考と対話の「脳」",
      subtitle: "LLM",
      tools: ["ChatGPT", "Claude", "Gemini"],
      color: "bg-blue-50 border-blue-200",
    },
    {
      number: "II",
      title: "自律実行と知識管理",
      subtitle: "AIエージェント",
      tools: ["Manus", "NotebookLM"],
      color: "bg-orange-50 border-orange-200",
    },
    {
      number: "III",
      title: "業務プロセスの自動化",
      subtitle: "ノーコード",
      tools: ["Make", "Google Workspace Flows"],
      color: "bg-green-50 border-green-200",
    },
    {
      number: "IV",
      title: "視覚化とデザイン",
      subtitle: "クリエイティブ",
      tools: ["Google Mixboard"],
      color: "bg-purple-50 border-purple-200",
    },
  ] as TrainingModule[],

  stats: [
    { value: "4.8", label: "総合満足度（5.0満点）" },
    { value: "4.7", label: "業務活用度" },
    { value: "50+", label: "改善アイデア創出数" },
    { value: "70%", label: "実習比率" },
  ] as Stat[],

  strengths: [
    {
      title: "実務経験10年以上の担当者",
      description: "人事総務、マーケティングなどの現場経験が豊富な担当者が直接研修を実施します。",
    },
    {
      title: "実習70%の実践重視設計",
      description: "講義は30%に抑え、ハンズオン中心のカリキュラムで「明日から使える」スキルを習得。",
    },
    {
      title: "10種以上のAIツール体験",
      description: "主要なAIツールを横断的に体験。自社に最適なツールの選定眼を養います。",
    },
  ] as Strength[],

  pricing: {
    hours: "月間8時間",
    price: "200,000",
    priceNote: "円（税抜）",
    includes: ["AI研修（オンライン or 対面）", "業務改善伴走"],
    features: ["研修受講人数無制限", "1ヶ月単位更新可能"],
    subsidy: {
      label: "スマート助成金プラン",
      description: "助成金活用で10時間研修 + 5ヶ月伴走",
      price: "実質月々2万円/人",
    },
  },

  steps: [
    { number: 1, title: "ご検討", description: "貴社内にて提案内容をご検討ください。" },
    { number: 2, title: "ご契約", description: "ご契約書を作成し、締結いたします。" },
    { number: 3, title: "研修内容協議", description: "貴社の状況やレベル感に合わせて研修内容を協議。" },
    { number: 4, title: "研修実施", description: "オンラインまたは対面にて、研修を実施します。" },
    { number: 5, title: "伴走サポート", description: "継続的なサポートを実施します。" },
  ] as Step[],

  faq: [
    {
      question: "IT知識がなくても参加できますか？",
      answer:
        "はい。非エンジニアの方を対象に設計しており、基本的なPCスキルがあれば参加可能です。",
    },
    {
      question: "オンラインで受講できますか？",
      answer: "オンライン・対面のどちらにも対応しています。",
    },
    {
      question: "企業単位での申し込みは可能ですか？",
      answer:
        "はい。企業規模やニーズに応じたカスタマイズも可能です。受講人数は無制限です。",
    },
    {
      question: "助成金は利用できますか？",
      answer:
        "はい。スマート助成金プランでは、助成金を活用することで実質月々2万円/人で受講可能です。詳しくはお問い合わせください。",
    },
    {
      question: "研修後のフォローアップはありますか？",
      answer:
        "はい。研修後も伴走サポートとして、業務改善の定着支援や追加研修のご相談を承ります。",
    },
  ] as FAQ[],
};
