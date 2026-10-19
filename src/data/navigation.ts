export interface NavItem {
  label: string;
  labelEn: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "トップ", labelEn: "HOME", href: "/" },
  { label: "サービス一覧", labelEn: "SERVICES", href: "/services/" },
  { label: "AI研修", labelEn: "AI TRAINING", href: "/ai-training/" },
  { label: "おまかせグラム", labelEn: "INSTAGRAM", href: "/insta-auto/" },
  { label: "サブスクデザイン", labelEn: "DESIGN", href: "/subsc-design/" },
  { label: "顔の見えるFAQ", labelEn: "VIDEO FAQ", href: "/video-faq/" },
  { label: "導入事例", labelEn: "CASES", href: "/cases/" },
  { label: "お問い合わせ", labelEn: "CONTACT", href: "/contact/" },
];
