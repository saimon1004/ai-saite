export interface Arc {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  chapters: number[];
  color: string;
}

export const arcs: Arc[] = [
  {
    id: "founding",
    name: "創業編",
    nameEn: "FOUNDING",
    emoji: "🚀",
    description:
      "ShimaLinkの立ち上げ。開発環境の構築からWebの基礎を学ぶ。",
    chapters: [1, 2, 3, 4, 5],
    color: "teal",
  },
  {
    id: "growth",
    name: "成長編",
    nameEn: "GROWTH",
    emoji: "📈",
    description:
      "ユーザーが増え、本格的なアプリ開発が必要に。JS/TS、API、データベースを学ぶ。",
    chapters: [6, 7, 8, 9, 10],
    color: "blue",
  },
  {
    id: "crisis",
    name: "危機編",
    nameEn: "CRISIS",
    emoji: "🔒",
    description:
      "謎のハッカーShadowが現れ、セキュリティの重要性を痛感する。",
    chapters: [11, 12, 13, 14, 15],
    color: "red",
  },
  {
    id: "scale",
    name: "拡大編",
    nameEn: "SCALE",
    emoji: "☁️",
    description:
      "ShimaLinkを本格的なサービスに成長させる。インフラとDevOpsを学ぶ。",
    chapters: [16, 17, 18, 19, 20],
    color: "purple",
  },
  {
    id: "beyond",
    name: "飛躍編",
    nameEn: "BEYOND",
    emoji: "✨",
    description: "新しい技術に挑戦し、ShimaLinkをさらに進化させる。",
    chapters: [21, 22, 23, 24, 25],
    color: "gold",
  },
];

export function getArcById(id: string): Arc | undefined {
  return arcs.find((arc) => arc.id === id);
}

export function getArcByChapter(chapter: number): Arc | undefined {
  return arcs.find((arc) => arc.chapters.includes(chapter));
}
