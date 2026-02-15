export interface FAQ {
  question: string;
  answer: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  initial: string;
  monthly: string;
  features: string[];
  highlighted?: boolean;
}

export interface ServiceDetail {
  id: string;
  number: string;
  nameEn: string;
  nameJa: string;
  tagline: string;
  description: string;
  pillars?: { title: string; description: string }[];
  features: string[];
  steps: Step[];
  pricing?: PricingPlan[];
  pricingNote?: string;
  faq: FAQ[];
}

export const services: ServiceDetail[] = [
  {
    id: "recruitment",
    number: "01",
    nameEn: "RECRUITMENT PROGRAM",
    nameJa: "採用定着プログラム",
    tagline: "採用は扉を開く。定着は未来を創る。",
    description:
      "「求人を出しても応募が来ない」「採用してもすぐに辞めてしまう」——中小企業が直面する採用課題を、経営計画から逆算した戦略的アプローチで根本から解決します。",
    pillars: [
      { title: "3年先を見据えた採用計画", description: "経営計画と連動した中長期的な人材戦略を策定" },
      { title: "競合に勝つための採用戦略", description: "地域・業界の競合分析に基づく差別化戦略" },
      { title: "応募が集まるチャネル活用", description: "最適な求人媒体の選定と運用" },
      { title: "求職者目線の求人票", description: "ターゲット人材に刺さる求人票の作成" },
      { title: "中長期的な人材見極め", description: "定着を見据えた採用基準の設計" },
    ],
    features: [
      "経営計画から逆算した採用戦略の策定",
      "プロセスロードマップの作成",
      "競合調査に基づく差別化",
      "社員アンケートによる組織分析",
      "ペルソナ設定によるターゲティング",
      "具体的な求人票の作成・最適化",
      "月額制のリーズナブルな料金体系",
    ],
    steps: [
      { number: 1, title: "無料相談・ヒアリング", description: "現状の課題と目標を丁寧にお伺いします" },
      { number: 2, title: "現状分析・競合調査", description: "業界・地域の採用市場を徹底調査" },
      { number: 3, title: "社員アンケート実施", description: "組織の強み・課題を可視化" },
      { number: 4, title: "採用戦略・ロードマップ策定", description: "経営計画に基づく戦略を設計" },
      { number: 5, title: "求人票作成・公開", description: "ターゲットに刺さる求人を展開" },
      { number: 6, title: "応募者対応・面接サポート", description: "選考プロセスをサポート" },
      { number: 7, title: "PDCAサイクル運用", description: "継続的な改善で成果を最大化" },
    ],
    pricing: [
      {
        name: "Basic",
        initial: "0円",
        monthly: "50,000円",
        features: ["戦略立案", "ロードマップ", "競合調査", "社員アンケート", "求人票作成"],
      },
      {
        name: "Plus",
        initial: "250,000円",
        monthly: "100,000円",
        features: ["Basic全機能", "採用専用ページ制作"],
        highlighted: true,
      },
      {
        name: "Premium",
        initial: "250,000円",
        monthly: "200,000円",
        features: ["Plus全機能", "面接サポート"],
      },
    ],
    pricingNote: "初月無料・最低4ヶ月契約・月3件まで求人票作成/編集含む",
    faq: [
      {
        question: "応募数の保証はありますか？",
        answer: "応募数の保証はしておりません。しかし、採用の仕組みそのものを構築することで、継続的に応募が集まる体制を作ります。",
      },
      {
        question: "人材紹介との違いは？",
        answer: "人材紹介は人材の紹介のみですが、当プログラムは採用プロセス全体のコンサルティングを行い、自社で採用できる仕組みを構築します。",
      },
      {
        question: "最低契約期間が4ヶ月の理由は？",
        answer: "採用戦略の策定から求人公開、応募獲得、改善サイクルまでを回すには最低4ヶ月が必要です。",
      },
      {
        question: "どの業種でも対応可能ですか？",
        answer: "はい、全業種に対応可能です。訪問看護、遺品整理、会計事務所など幅広い実績があります。",
      },
    ],
  },
  {
    id: "ai-impact-lab",
    number: "02",
    nameEn: "AI IMPACT LAB",
    nameJa: "AI IMPACT LAB",
    tagline: "実践的なAI研修で、組織を次世代へ導く。",
    description:
      "3日間・合計11時間の実践型AI研修プログラム。講義30%、ハンズオン70%の構成で、受講者が即座に業務に活用できるスキルを習得します。",
    features: [
      "ChatGPT / Claude / Gemini の比較・活用",
      "マーケティング領域でのAI活用",
      "人事・総務領域の業務効率化",
      "NotebookLMによるナレッジ管理",
      "Claude Codeによるプログラミング体験",
      "Remotionによる動画自動生成",
      "自己紹介動画の実践制作",
      "Make による業務自動化",
    ],
    steps: [
      { number: 1, title: "Day 1: 生成AI基礎と活用事例", description: "13:00-16:30 / 主要AIツール比較、先進企業事例、マーケティング活用" },
      { number: 2, title: "Day 2: バックオフィス業務効率化", description: "13:00-16:30 / 人事領域、総務効率化（NotebookLM）、コールセンター改善" },
      { number: 3, title: "Day 3: 実践ワークショップ", description: "13:00-17:00 / Claude Code基礎、Remotion基礎、自己紹介動画制作、発表" },
    ],
    faq: [
      {
        question: "IT知識がなくても参加できますか？",
        answer: "はい。非エンジニアの方を対象に設計しており、基本的なPCスキルがあれば参加可能です。",
      },
      {
        question: "オンラインで受講できますか？",
        answer: "オンライン・対面のどちらにも対応しています。",
      },
      {
        question: "企業単位での申し込みは可能ですか？",
        answer: "はい。企業規模やニーズに応じたカスタマイズも可能です。",
      },
    ],
  },
  {
    id: "backoffice",
    number: "03",
    nameEn: "BACK OFFICE SUPPORT",
    nameJa: "バックオフィス構築支援",
    tagline: "企業の基盤を支える仕組みづくり。",
    description:
      "総務体制の構築、データ管理基盤の整備、BCP（事業継続計画）の策定まで、企業の管理部門を包括的にサポートします。",
    features: [
      "社内規程の整備・見直し",
      "文書管理体制の構築",
      "業務フローの可視化と最適化",
      "データベースの設計・構築",
      "情報セキュリティ体制の整備",
      "事業継続計画（BCP）の策定",
      "リスク評価と対策立案",
      "緊急時対応マニュアル作成",
    ],
    steps: [
      { number: 1, title: "ヒアリング", description: "現状の課題と理想の体制をお伺いします" },
      { number: 2, title: "現状分析", description: "既存の業務フロー・体制を詳細に分析" },
      { number: 3, title: "改善提案", description: "最適な改善プランを策定・ご提案" },
      { number: 4, title: "導入・運用支援", description: "実行から定着までをハンズオンでサポート" },
    ],
    faq: [
      {
        question: "どの程度の規模の企業に対応していますか？",
        answer: "従業員数10名〜100名規模の中小企業を中心に支援しています。",
      },
      {
        question: "BCPだけの依頼も可能ですか？",
        answer: "はい。総務体制、データ管理、BCP策定のいずれか単独でのご依頼も可能です。",
      },
    ],
  },
] as const;
