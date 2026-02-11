export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { label: "ホーム", href: "/" },
  {
    label: "サービス",
    href: "/services/",
    children: [
      { label: "採用定着プログラム", href: "/services/recruitment/" },
      { label: "AI IMPACT LAB", href: "/services/ai-impact-lab/" },
      { label: "バックオフィス構築支援", href: "/services/backoffice/" },
    ],
  },
  { label: "経営理念", href: "/philosophy/" },
  { label: "会社概要", href: "/company/" },
  { label: "お問い合わせ", href: "/contact/" },
];
