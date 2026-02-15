export interface NavItem {
  label: string;
  labelEn: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "私たちについて", labelEn: "ABOUT", href: "#about" },
  { label: "ソリューション", labelEn: "SOLUTION", href: "#solution" },

  { label: "代表プロフィール", labelEn: "TEAM", href: "#team" },
  { label: "会社概要", labelEn: "COMPANY", href: "#company" },
  { label: "お問い合わせ", labelEn: "CONTACT", href: "#contact" },
];
