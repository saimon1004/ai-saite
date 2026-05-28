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
  image: string;
  overlayColor: string;
}

export interface CaseStudy {
  number: string;
  titleEn: string;
  titleJa: string;
  image: string;
  description: string;
  url?: string;
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
    imagePosition?: string;
  };
}

export interface Interview {
  company: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  highlights: string[];
}

export const interviews: Interview[] = [];

export const aiImpactLab = {
  nameEn: "AI IMPACT LAB",
  tagline: "内製化を実現するAI研修プログラム",
  description:
    "外注していたサイト制作、資料作成、業務自動化——<br class='hidden sm:inline'>AIを活用すれば、現場の社員が自分たちでつくれる時代です。<br>外に出していた仕事を社内に取り戻し、スピードとコストの両方を改善する。<br>そのための実践型AI研修プログラムです。",

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
      image: "pillar-genba.jpg",
      overlayColor: "rgba(13, 0, 132, 0.72)",
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
      image: "pillar-recruit.jpg",
      overlayColor: "rgba(5, 102, 68, 0.72)",
    },
  ] as Pillar[],

  modules: [
    {
      number: "01",
      title: "知る",
      subtitle: "TREND ／ INPUT",
      description: "進化が速い生成AI領域の最新動向を、業界事例とともに体系的に整理。「いま、何ができるのか」を正確にキャッチアップし、自社に適用する目を養います。",
      learns: [
        "主要LLM（ChatGPT / Claude / Gemini）の最新動向",
        "AIエージェント・自動化ツールの潮流",
        "業界別・職種別の活用事例",
      ],
      tools: ["ChatGPT", "Claude", "Gemini", "NotebookLM"],
      color: "bg-blue-50 border-blue-200",
      image: "module-creative.jpg",
      overlayColor: "rgba(13, 0, 132, 0.72)",
    },
    {
      number: "02",
      title: "考える",
      subtitle: "STRATEGY ／ DESIGN",
      description: "知った技術を、自社の業務・組織課題に当てはめて「何にどう使うか」を設計。アイデアを構造化し、優先順位と効果の見立てまで落とし込みます。",
      learns: [
        "自社業務の棚卸しとAI適用設計",
        "業務フロー・体制の再設計",
        "優先度・投資対効果の可視化",
      ],
      tools: ["業務分析ワーク", "課題構造化", "ロードマップ"],
      color: "bg-orange-50 border-orange-200",
      image: "module-agent.jpg",
      overlayColor: "rgba(13, 0, 132, 0.72)",
    },
    {
      number: "03",
      title: "実践する",
      subtitle: "BUILD ／ OUTPUT",
      description: "設計したプランを実際に手を動かして実装。LLM・エージェント・ノーコード・クリエイティブツールを駆使し、業務に直結する成果物を持ち帰ります。",
      learns: [
        "LLM・AIエージェントの実装ハンズオン",
        "ノーコードによる自動化フロー構築",
        "資料・ビジュアル・サイトの制作",
      ],
      tools: ["Make", "Manus", "Claude Code", "Mixboard"],
      color: "bg-teal-50 border-teal-200",
      image: "module-nocode.jpg",
      overlayColor: "rgba(49, 185, 181, 0.72)",
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
    startPrice: "100,000",
    priceNote: "円〜（税抜）",
    description: "貴社の課題やレベル感に合わせて、研修内容・時間・回数を柔軟にカスタマイズいたします。<br>まずはお気軽にご相談ください。",
    includes: [
      "社内レベルに合わせた研修内容のカスタマイズ",
      "AI研修（オンライン or 対面）",
      "業務改善伴走サポート",
    ],
    features: ["研修受講人数無制限", "1ヶ月単位で更新可能", "無料相談OK"],
    subsidy: {
      label: "スマート助成金プラン",
      description: "助成金活用で10時間研修 + 5ヶ月伴走",
      price: "実質月々2万円/人",
    },
  },

  steps: [
    { number: 1, title: "無料相談", description: "まずはお気軽にお問い合わせください。" },
    { number: 2, title: "研修内容協議", description: "貴社の状況やレベル感に合わせて研修内容を協議。" },
    { number: 3, title: "ご検討", description: "貴社内にて提案内容をご検討ください。" },
    { number: 4, title: "ご契約", description: "ご契約書を作成し、締結いたします。" },
    { number: 5, title: "研修実施", description: "オンラインまたは対面にて、研修を実施します。" },
    { number: 6, title: "伴走サポート", description: "継続的なサポートを実施します。" },
  ] as Step[],

  caseStudies: [
    {
      number: "01",
      titleEn: "Recruitment Website",
      titleJa: "採用サイトの制作",
      image: "case-site-image.jpg",
      description:
        "AIがPC内のファイルを直接操作し、React/Next.jsの本格的な採用サイトを環境構築から公開まで一貫して制作。エンジニアがいなくても、プロ品質のWebサイトを現場主導で完成させられます。",
      url: "https://recruit.nash-holdings.com",
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
        name: "上本 様",
        role: "",
        company: "株式会社NASH",
        image: "interview-01.jpg",
        quote: "採用サイトのリニューアルを任されたとき、最初は制作会社への外注を考えていました。でも見積もりは数百万円、修正のたびに追加費用がかかると聞いて悩んでいたところ、この研修を知りました。受講後はClaude Codeに日本語で指示するだけでサイトが形になっていくのが衝撃的で、デザイン修正も「ここをもう少し明るく」と伝えるだけ。外注と比べてトータルコストは大幅に抑えられましたし、自分たちで即座に更新できるのも大きいです。公開後は応募数が前年比1.8倍に増え、今では他部署からも「うちのページも作って」と相談が来ています。",
      },
    },
    {
      number: "02",
      titleEn: "Service Site Renewal",
      titleJa: "サービスサイトのリニューアル",
      image: "case-site-image-02.png",
      description:
        "ノーコードツールBubbleとAIを組み合わせ、サービスサイト「worktalk」をリニューアル。AIによるUI/UX改善提案とBubbleでの高速実装で、外注に頼らず自社でプロ品質のサイト刷新を実現しました。",
      url: "https://work-talk.jp/hp_top/mycareer",
      tools: ["Claude Code", "VS Code", "Bubble", "Git"],
      steps: [
        {
          title: "現状分析",
          description: "既存サイトの課題を洗い出し、改善方針をAIと策定",
        },
        {
          title: "デザイン設計",
          description: "AIにリニューアル案を相談し、UI/UXの方向性を決定",
        },
        {
          title: "Bubbleで実装",
          description: "ノーコードで新デザインを構築、AIがロジック設計をサポート",
        },
        {
          title: "テスト・改善",
          description: "動作確認しながらAIに改善点を指示して即修正",
        },
        {
          title: "公開・運用開始",
          description: "本番公開、運用マニュアルもAIで作成",
        },
      ],
      highlights: [
        "外注なしで社内完結のサイトリニューアル",
        "ノーコード×AIで開発期間を大幅短縮",
        "社内で即座にコンテンツ更新・改善が可能に",
      ],
      color: "from-blue-600 to-indigo-600",
      interview: {
        name: "小野 様",
        role: "",
        company: "マイキャリア株式会社",
        image: "interview-02.jpg",
        quote:
          "サービスサイトのリニューアルは以前から課題でしたが、制作会社に依頼すると費用も時間もかかるため後回しにしていました。この研修でBubbleとClaude Codeの組み合わせを学んだことで、自分たちで短期間にリニューアルを完了できました。AIに「この部分をもっと見やすくして」と伝えるだけで具体的な改善案が返ってくるので、デザインの知識がなくても迷わず進められます。リニューアル後はサイト経由の問い合わせが増え、採用活動にも好影響が出ています。何より、社長のイメージを社内でいち早く具現化できる体制が整ったことが、弊社の事業戦略上もっともインパクトが大きいと感じています。",
      },
    },
    {
      number: "03",
      titleEn: "Website Renewal",
      titleJa: "HPのリニューアル",
      image: "case-site-image-03.jpg",
      description:
        "AIを活用して、自社コーポレートサイトをゼロから刷新。専門知識がなくても、日本語の指示だけでデザインからページ構築までを進め、自分たちの手でHPをリニューアルできる体制を実現しました。",
      url: "https://ir-estate.jp/",
      tools: ["OpenAI Codex", "VS Code", "React / Next.js", "Git"],
      steps: [
        {
          title: "現状把握",
          description: "既存HPの課題をCodexと一緒に洗い出し、リニューアルの方針を整理",
        },
        {
          title: "構成・デザイン設計",
          description: "サイト構成とデザインの方向性をCodexに相談しながら決定",
        },
        {
          title: "Codexで実装",
          description: "Codexに日本語で指示し、ページを一つずつ構築",
        },
        {
          title: "修正・調整",
          description: "ブラウザでプレビューしながら「ここをこう直して」と指示して微調整",
        },
        {
          title: "公開・運用",
          description: "本番公開後も、社内で自由に更新・改善できる体制を整備",
        },
      ],
      highlights: [
        "AI初心者でも自社HPを自分の手でリニューアル",
        "Codexに「伝えるだけ」で本格的なサイト制作",
        "公開後も社内で自由に更新・改善できる",
      ],
      color: "from-violet-600 to-fuchsia-600",
      interview: {
        name: "岡村 様",
        role: "",
        company: "株式会社IR estate",
        image: "interview-03.jpg",
        imagePosition: "70% 22%",
        quote:
          "正直なところ、普段ChatGPTもそこまで使ったことがなく、自分にWebサイトの制作なんてできるとは思っていませんでした。専門的な知識もないので、最初は『本当に自分にできるのか』と半信半疑で受講しました。ところが、Codexに日本語で指示するだけでページがどんどん形になっていくのを目の当たりにして、『自分にもできるんだ』と一気に世界が広がった感覚でした。今では会社のHPを自分の手で更新でき、伝えたいことをすぐ形にできます。できないと思い込んでいたことが、こんなに身近になるとは思いませんでした。",
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
