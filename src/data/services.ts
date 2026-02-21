export interface TrainingModule {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  learns: string[];
  tools: string[];
  color: string;
  image: string;
  overlayColor: string;
}

export interface Stat {
  value: string;
  label: string;
  subtext?: string;
}

export interface TopTool {
  name: string;
  badge: string;
  description: string;
}

export interface Outcome {
  text: string;
}

export interface DeptTrend {
  dept: string;
  usecases: string;
}

export interface SuccessFactor {
  title: string;
  detail: string;
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

export interface CaseStudy {
  number: string;
  titleEn: string;
  titleJa: string;
  description: string;
  tools: string[];
  steps: { title: string; description: string }[];
  highlights: string[];
  color: string;
  interview?: {
    name: string;
    role: string;
    company: string;
    image: string;
    quote: string;
  };
}

export const aiImpactLab = {
  nameEn: "AI IMPACT LAB",
  tagline: "「つくりたい」を、現場の手で。",
  description:
    "スピード不足、ミスコミュニケーション——<br class='hidden sm:inline'>思い描いた成果物が形にならないもどかしさ。<br>現場が自らつくれる力を持つことが、最も確実な解決策だと私たちは考えます。<br>その信念から生まれた研修プログラムです。",

  pillars: [
    {
      title: "現場力の強化",
      subtitle: "経済的利益の源泉（価値創出）",
      points: [
        { metric: "18.6万時間/年 削減", description: "大手製造業 — 全社員1.2万人にAI展開した事例" },
        { metric: "営業効率 68% 向上", description: "大手食品メーカー — AIをコンサルとして活用した事例" },
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
      description: "主要な大規模言語モデルを比較しながら、目的別の最適な使い分けを習得。プロンプトエンジニアリングの基礎から応用まで。",
      learns: ["各LLMの特性と使い分け", "高精度な指示の出し方", "長文分析・レポート作成"],
      tools: ["ChatGPT", "Claude", "Gemini"],
      color: "bg-blue-50 border-blue-200",
      image: "module-llm.jpg",
      overlayColor: "rgba(13, 0, 132, 0.72)",
    },
    {
      number: "II",
      title: "自律実行と知識管理",
      subtitle: "AIエージェント",
      description: "AIが自律的にタスクを遂行するエージェント技術と、社内ナレッジの統合管理手法を体験。",
      learns: ["AIエージェントによる業務代行", "社内文書のナレッジ化", "LINE/BOT連携"],
      tools: ["Manus", "NotebookLM"],
      color: "bg-orange-50 border-orange-200",
      image: "module-agent.jpg",
      overlayColor: "rgba(154, 52, 18, 0.72)",
    },
    {
      number: "III",
      title: "業務プロセスの自動化",
      subtitle: "ノーコード",
      description: "コードを書かずにアプリ間連携・業務フローの自動化を実現。メール・会議・承認などの定型業務を効率化。",
      learns: ["アプリ間の自動連携", "条件分岐・統合フロー構築", "メール・会議の自動処理"],
      tools: ["Make", "Google Workspace Flows"],
      color: "bg-green-50 border-green-200",
      image: "module-nocode.jpg",
      overlayColor: "rgba(5, 102, 68, 0.72)",
    },
    {
      number: "IV",
      title: "視覚化とデザイン",
      subtitle: "クリエイティブ",
      description: "テキストから高品質なビジュアルを生成。プレゼン資料、広告バナー、動画など多様なアウトプットに対応。",
      learns: ["テキストからビジュアル生成", "プレゼン資料の自動作成", "広告バナー・動画制作"],
      tools: ["Google Mixboard"],
      color: "bg-purple-50 border-purple-200",
      image: "module-creative.jpg",
      overlayColor: "rgba(88, 28, 135, 0.72)",
    },
  ] as TrainingModule[],

  stats: [
    { value: "4.8", label: "総合満足度", subtext: "/ 5.0（非常に高い）" },
    { value: "4.7", label: "業務活用度" },
    { value: "4.7", label: "分かりやすさ" },
    { value: "4.2", label: "適度な難易度" },
  ] as Stat[],

  topTools: [
    { name: "NotebookLM", badge: "最高評価", description: "社内ナレッジ統合・情報検索・新人研修に最適" },
    { name: "Manus", badge: "高機能", description: "AIエージェント・BOT作成・LINE連携" },
    { name: "Gemini Gem", badge: "実用的", description: "プラン作成量産化・業務効率化" },
    { name: "Make", badge: "達成感", description: "ツール横断自動化・業務フロー構築" },
  ] as TopTool[],

  outcomes: [
    { text: "具体的な改善アイデア 50件以上を創出" },
    { text: "「明日から使える」実践スキルを習得" },
    { text: "AIファースト思考と自信を獲得" },
    { text: "難関ツール（Make等）への挑戦意欲が向上" },
  ] as Outcome[],

  deptTrends: [
    { dept: "マーケティング部", usecases: "プラン・コンテンツ量産、画像・動画生成" },
    { dept: "CS・人事部", usecases: "顧客対応自動化（LINE/BOT）、ナレッジ・研修効率化" },
    { dept: "営業部", usecases: "事務自動化による営業時間確保" },
  ] as DeptTrend[],

  successFactors: [
    { title: "実践重視", detail: "実習70%：講義30%" },
    { title: "多様なツール", detail: "10種以上を体験" },
    { title: "段階的設計", detail: "基礎→応用→実践" },
    { title: "業務直結", detail: "即課題解決に活用" },
  ] as SuccessFactor[],

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

  caseStudies: [
    {
      number: "01",
      titleEn: "Recruitment Website",
      titleJa: "採用サイトの制作",
      description:
        "AIがPC内のファイルを直接操作し、React/Next.jsの本格的な採用サイトを環境構築から公開まで一貫して制作。エンジニアがいなくても、プロ品質のWebサイトを現場主導で完成させられます。",
      tools: ["Claude Code", "VS Code", "React / Next.js", "Git", "XServer"],
      steps: [
        {
          title: "環境構築",
          description: "Claude Desktop + VS Code + Claude Codeをインストール、プロジェクトフォルダを作成",
        },
        {
          title: "要件定義・構築",
          description: "「採用サイトを作りたい」と要件を伝えるだけでAIがサイト全体を自動構築",
        },
        {
          title: "デザイン修正",
          description: "ブラウザでプレビューしながら「ここをもっとかっこよくして」等の指示で調整",
        },
        {
          title: "機能追加",
          description: "FAQチャットボット、CMS連携、問い合わせフォーム等を日本語の指示で追加",
        },
        {
          title: "公開・デプロイ",
          description: "サーバーへの接続からドメイン設定、本番公開までAIに指示して完了",
        },
      ],
      highlights: [
        "エンジニアなしでプロ品質のサイトが完成",
        "運用・保守・更新もAIで継続対応可能",
        "CMS導入で非エンジニアでもコンテンツ更新が容易",
      ],
      color: "from-teal to-emerald-600",
      interview: {
        name: "上本",
        role: "",
        company: "株式会社NASH",
        image: "interview-01.jpg",
        quote: "採用サイトのリニューアルを任されたとき、最初は制作会社への外注を考えていました。でも見積もりは数百万円、修正のたびに追加費用がかかると聞いて悩んでいたところ、この研修を知りました。受講後はClaude Codeに日本語で指示するだけでサイトが形になっていくのが衝撃的で、デザイン修正も「ここをもう少し明るく」と伝えるだけ。外注と比べてトータルコストは大幅に抑えられましたし、自分たちで即座に更新できるのも大きいです。公開後は応募数が前年比1.8倍に増え、今では他部署からも「うちのページも作って」と相談が来ています。",
      },
    },
  ] as CaseStudy[],

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
