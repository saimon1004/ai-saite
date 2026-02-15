export interface CaseStudy {
  id: string;
  category: string;
  categoryEn: string;
  metric: string;
  metricLabel: string;
  metricNumber?: number;
  description: string;
  service: "recruitment" | "ai-impact-lab" | "backoffice";
}

export const works: CaseStudy[] = [
  {
    id: "nursing",
    category: "訪問看護",
    categoryEn: "Healthcare",
    metric: "100+",
    metricLabel: "応募獲得",
    metricNumber: 100,
    description:
      "採用戦略の見直しと求人票の最適化により、訪問看護事業所で100件以上の応募を獲得。定着率も大幅に改善。",
    service: "recruitment",
  },
  {
    id: "cleanup",
    category: "遺品整理",
    categoryEn: "Service",
    metric: "約400",
    metricLabel: "応募獲得",
    metricNumber: 400,
    description:
      "人口3万人の町の遺品整理事業者で、約400件の応募を獲得。地域特性を活かした採用戦略が成功。",
    service: "recruitment",
  },
  {
    id: "accounting",
    category: "会計事務所",
    categoryEn: "Accounting",
    metric: "120+",
    metricLabel: "8ヶ月間の応募",
    metricNumber: 120,
    description:
      "会計事務所で8ヶ月間にわたり120件以上の応募を獲得。継続的な採用の仕組みを構築。",
    service: "recruitment",
  },
  {
    id: "manufacturing",
    category: "製造業",
    categoryEn: "Manufacturing",
    metric: "90%",
    metricLabel: "作成時間削減",
    metricNumber: 90,
    description:
      "品質管理レポートの作成にAIを導入し、作成時間を90%削減。従業員はより戦略的な業務に集中可能に。",
    service: "ai-impact-lab",
  },
  {
    id: "service-industry",
    category: "サービス業",
    categoryEn: "Service",
    metric: "+15%",
    metricLabel: "顧客満足度向上",
    metricNumber: 15,
    description:
      "カスタマーサポートにAIツールを導入し、応対品質と速度を向上。顧客満足度が15%改善。",
    service: "ai-impact-lab",
  },
  {
    id: "it-company",
    category: "IT企業",
    categoryEn: "IT",
    metric: "+30%",
    metricLabel: "プロジェクト成功率",
    metricNumber: 30,
    description:
      "プロジェクト管理にAIツールを導入し、タスクの優先順位付けと進捗管理を効率化。成功率が30%向上。",
    service: "ai-impact-lab",
  },
] as const;
