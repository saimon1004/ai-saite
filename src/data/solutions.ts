// SAIMONのサービス一覧。トップの「育てる/任せる」と /services/ の比較表、
// トップの構造化データ（makesOffer）が同じデータを参照する。
// 料金は各LPの表記に合わせること（LP側を変えたらここも直す）。

export interface Solution {
  title: string;
  description: string;
  image: string;
  href: string;
  /** どんな会社向けか（/services/ の比較表で使う） */
  target: string;
  /** 料金の目安（/services/ の比較表で使う） */
  price: string;
  /** 構造化データ用の正式名称。省略時は title */
  serviceName?: string;
  badge?: { label: string; tone: "new" | "popular" };
  subLinks?: { label: string; href: string }[];
}

// 学ぶ（研修系）— 社内に"つくる力"を育てる
export const learnSolutions: Solution[] = [
  {
    title: "AI実務研修",
    serviceName: "AI IMPACT LAB（企業向けAI研修）",
    description: "実務に必要なAIスキルを、体系的に学べる研修プログラム。",
    image: "solutions/solution-training.jpg",
    href: "/ai-training/",
    target: "AIを全社で使える状態にしたい企業",
    price: "10万円〜（税抜）",
  },
  {
    title: "助成金活用プラン",
    description: "人材開発支援助成金を使い、費用を抑えてAI研修を導入。申請テンプレートも提供します。",
    image: "solutions/solution-subsidy.jpg",
    href: "/subsidy-plan/",
    target: "研修費を助成金で抑えたい中小企業",
    price: "経費の最大75%を助成",
  },
  {
    title: "石垣島AI実践研修",
    serviceName: "石垣島で学ぶAI実践研修",
    description: "石垣島の自然のなかで、AI実践研修とチームビルディングを3泊4日で。",
    image: "ishigaki/cover.jpg",
    href: "/ishigaki/",
    target: "研修とチームづくりを一度に行いたい企業",
    price: "個別見積（助成金対象）",
    badge: { label: "NEW", tone: "new" },
  },
  {
    title: "採用HP内製化",
    serviceName: "採用HP内製化プログラム",
    description: "採用HPを採用担当者がAIと一緒に更新できる体制をつくる3日間。外注待ちをなくし、改善を社内資産に。",
    image: "recruit-hp/assets/hero-ai-jitsumu-poster.png",
    href: "/recruit-hp/",
    target: "採用HPを自社で更新したい人事担当",
    price: "1社80万円〜（2名・3日間）",
    badge: { label: "人気", tone: "popular" },
  },
];

// 任せる（制作・運用・伴走系）— プロの"つくる力"を月額で
export const delegateSolutions: Solution[] = [
  {
    title: "おまかせグラム",
    serviceName: "おまかせグラム（飲食店Instagram運用）",
    description: "飲食店のInstagram運用を、写真を送るのと承認するのだけに。AIが加工と文章を用意し、承認すると決めた時間に投稿されます。",
    image: "insta-auto/assets/feed-salad.jpg",
    href: "/insta-auto/",
    target: "Instagramに手が回らない飲食店",
    price: "月額3万円（税別）／1店舗・初期費用0円",
    badge: { label: "NEW", tone: "new" },
  },
  {
    title: "サブスクデザイン",
    serviceName: "サブスクデザイン（月額定額のデザイン制作）",
    description: "保険・互助会業界特化の月額定額デザイン制作。バナー・チラシ・LP・Webサイトを専属デザイナーに何度でも依頼可能。",
    image: "solutions/solution-design.jpg",
    href: "/subsc-design/",
    target: "制作物が多い保険・互助会などの企業",
    price: "月額11万円〜（税込）",
    subLinks: [{ label: "人材紹介会社向けOEMプラン", href: "/subsc-design/partner/" }],
  },
  {
    title: "顔の見えるFAQ",
    serviceName: "顔の見えるFAQ（動画FAQチャットボット）",
    description: "よくある質問に、担当者が動画で答えるFAQチャットボット。タグを貼るだけで設置でき、動画の制作はSAIMONが引き受けます。",
    image: "video-faq/assets/card-video-faq-v2.jpg",
    href: "/video-faq/",
    target: "サイトの問い合わせ対応を減らしたい企業",
    price: "月額5万円（税別）・初期費用0円",
    badge: { label: "NEW", tone: "new" },
  },
  {
    title: "顧問・伴走支援",
    serviceName: "AI活用の顧問・業務委託",
    description: "研修後のAI活用を月額で継続サポート。定着支援から業務改善の相談まで、社外のAI顧問として伴走します。",
    image: "solutions/solution-advisor.jpg",
    href: "/contact/",
    target: "AI活用を社内に定着させたい企業",
    price: "個別見積",
  },
];
