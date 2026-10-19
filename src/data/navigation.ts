export interface NavItem {
  label: string;
  labelEn: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "トップ", labelEn: "HOME", href: "/" },
  { label: "おまかせグラム", labelEn: "INSTAGRAM", href: "/insta-auto/" },
  { label: "石垣島研修", labelEn: "ISHIGAKI", href: "/ishigaki/" },
  { label: "サブスクデザイン", labelEn: "DESIGN", href: "/subsc-design/" },
  { label: "顔の見えるFAQ", labelEn: "VIDEO FAQ", href: "/video-faq/" },
  { label: "研修プログラム", labelEn: "PROGRAM", href: "/#modules" },
  { label: "導入実績", labelEn: "CASES", href: "/#cases" },
  { label: "無料研修コンテンツ", labelEn: "無料研修", href: "/blog/" },
  { label: "お問い合わせ", labelEn: "CONTACT", href: "/contact/" },
];
