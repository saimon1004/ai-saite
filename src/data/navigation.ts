export interface NavItem {
  label: string;
  labelEn: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "トップ", labelEn: "HOME", href: "/" },
  { label: "石垣島研修", labelEn: "ISHIGAKI", href: "/ishigaki/" },
  { label: "HP制作内製化", labelEn: "CREATE HP", href: "/recruit-hp/" },
  { label: "研修プログラム", labelEn: "PROGRAM", href: "/#modules" },
  { label: "導入実績", labelEn: "CASES", href: "/#cases" },
  { label: "料金プラン", labelEn: "PRICING", href: "/#pricing" },
  { label: "無料研修コンテンツ", labelEn: "無料研修", href: "/blog/" },
  { label: "お問い合わせ", labelEn: "CONTACT", href: "/#contact" },
];
