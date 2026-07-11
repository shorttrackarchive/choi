export type ImageSlot = {
  src?: string;
  alt: string;
  placeholder: string;
  position?: string;
  ratio?: string;
};

export type MedalMetric = {
  id: string;
  label: string;
  value: number | null;
  unit: string;
  note: string;
  image?: ImageSlot;
};

export type TimelineEventGroup = {
  label: "올림픽" | "세계선수권" | "월드컵·월드투어";
  items: string[];
};

export type TimelineSeason = {
  id: string;
  season: string;
  seasonLabel: string;
  seasonSummary: string;
  image: ImageSlot;
  olympics?: string[];
  worldChampionships?: string[];
  worldCupOrWorldTour?: string[];
  additionalNote?: string;
};

export type HighlightLayout =
  | "imageLeft"
  | "imageRight"
  | "fullBleed"
  | "portrait"
  | "minimal";

export type Highlight = {
  id: string;
  number: string;
  date: string;
  competition: string;
  event: string;
  title: string;
  shortDescription: string;
  image: ImageSlot;
  imagePosition?: string;
  layoutType: HighlightLayout;
  resultLink?: string;
  archiveLink?: string;
};

export type KeywordLayout =
  | "fullText"
  | "imageLeft"
  | "imageRight"
  | "backgroundImage"
  | "minimal"
  | "split";

export type KeywordItem = {
  id: string;
  keyword: string;
  description: string;
  image?: ImageSlot;
  layoutType: KeywordLayout;
  imagePosition?: string;
};

export type TearMoment = {
  id: string;
  date: string;
  title: string;
  shortDescription: string;
  context: string;
  image: ImageSlot;
  imagePosition?: string;
};

export type QuoteItem = {
  id: string;
  quote: string;
  date: string;
  source: string;
  context: string;
  image?: ImageSlot;
  link?: string;
};

export type PollType =
  | "singleChoice"
  | "imageChoice"
  | "highlightChoice"
  | "keywordChoice";

export type PollOption = {
  id: string;
  label: string;
  image?: ImageSlot;
  meta?: string;
};

export type Poll = {
  id: string;
  title: string;
  description: string;
  type: PollType;
  options: PollOption[];
  isActive: boolean;
  showResults: boolean;
  resultDisplayType: "bars" | "imageGrid" | "largeType";
};

export type TributeData = {
  hero: {
    nameKo: string;
    nameEn: string;
    dedication: string;
    image: ImageSlot;
  };
  careerSummary: {
    intro: string;
    metrics: MedalMetric[];
  };
  timeline: TimelineSeason[];
  highlights: Highlight[];
  keywords: KeywordItem[];
  tears: TearMoment[];
  quotes: QuoteItem[];
  polls: Poll[];
  closing: {
    closingTitle: string;
    closingText: string;
    closingImage: ImageSlot;
    closingImagePosition?: string;
  };
};

const slot = (
  placeholder: string,
  alt: string,
  ratio = "16 / 10",
  position = "50% 50%",
): ImageSlot => ({
  src: "",
  alt,
  placeholder,
  ratio,
  position,
});

export const MAX_FAN_MESSAGE_LENGTH = 150;

export const imageFolderGuide = {
  hero: "/images/tribute/hero/",
  career: "/images/tribute/career/",
  timeline: "/images/tribute/timeline/",
  highlights: "/images/tribute/highlights/",
  keywords: "/images/tribute/keywords/",
  tears: "/images/tribute/tears/",
  quotes: "/images/tribute/quotes/",
  closing: "/images/tribute/closing/",
} as const;

export const tributeData: TributeData = {
  hero: {
    nameKo: "최민정",
    nameEn: "CHOI MINJEONG",
    dedication: "오랜 시간, 당신은 하나의 시대였습니다.",
    image: slot("HERO IMAGE", "hero-01.webp", "21 / 13", "50% 35%"),
  },
  careerSummary: {
    intro: "실제 메달 수와 커리어 요약은 추후 입력합니다.",
    metrics: [
      {
        id: "olympic-medals",
        label: "올림픽 메달",
        value: null,
        unit: "개",
        note: "계주 포함, 실제 숫자 입력 예정",
        image: slot("CAREER 01", "올림픽 메달 관련 이미지", "4 / 5", "50% 42%"),
      },
      {
        id: "world-medals",
        label: "세계선수권 메달",
        value: null,
        unit: "개",
        note: "슈퍼파이널 제외, 실제 숫자 입력 예정",
        image: slot("CAREER 02", "세계선수권 관련 이미지", "16 / 9", "50% 50%"),
      },
      {
        id: "worldcup-medals",
        label: "월드컵·월드투어 메달",
        value: null,
        unit: "개",
        note: "실제 숫자 입력 예정",
        image: slot("CAREER 03", "월드컵 또는 월드투어 관련 이미지", "5 / 4", "50% 50%"),
      },
      {
        id: "other-medals",
        label: "기타 국제대회 메달",
        value: null,
        unit: "개",
        note: "실제 숫자 입력 예정",
        image: slot("CAREER 04", "기타 국제대회 관련 이미지", "16 / 10", "50% 50%"),
      },
    ],
  },
  timeline: Array.from({ length: 6 }, (_, index) => ({
    id: `season-${index + 1}`,
    season: `SEASON ${String(index + 1).padStart(2, "0")}`,
    seasonLabel: "시즌명이 들어갑니다.",
    seasonSummary: "시즌 요약이 들어갑니다.",
    image: slot(
      `TIMELINE ${String(index + 1).padStart(2, "0")}`,
      "시즌 대표 이미지",
      index % 2 === 0 ? "16 / 11" : "4 / 5",
      "50% 45%",
    ),
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  })),
  highlights: Array.from({ length: 10 }, (_, index) => {
    const layouts: HighlightLayout[] = [
      "imageLeft",
      "fullBleed",
      "imageRight",
      "portrait",
      "minimal",
    ];

    return {
      id: `highlight-${index + 1}`,
      number: String(index + 1).padStart(2, "0"),
      date: "날짜 입력 예정",
      competition: "대회명 입력 예정",
      event: "종목 입력 예정",
      title: "하이라이트 제목",
      shortDescription: "하이라이트 설명이 들어갑니다.",
      image: slot(
        `HIGHLIGHT ${String(index + 1).padStart(2, "0")}`,
        "하이라이트 이미지",
        index % 3 === 0 ? "21 / 11" : "16 / 10",
        "50% 48%",
      ),
      layoutType: layouts[index % layouts.length],
      resultLink: "",
      archiveLink: "",
    };
  }),
  keywords: [
    "키워드 01",
    "키워드 02",
    "키워드 03",
    "키워드 04",
    "키워드 05",
    "키워드 06",
  ].map((keyword, index) => {
    const layouts: KeywordLayout[] = [
      "fullText",
      "imageLeft",
      "backgroundImage",
      "minimal",
      "imageRight",
      "split",
    ];

    return {
      id: `keyword-${index + 1}`,
      keyword,
      description: "키워드 설명이 들어갑니다.",
      image: slot(
        `KEYWORD ${String(index + 1).padStart(2, "0")}`,
        "키워드 관련 이미지",
        index % 2 === 0 ? "16 / 9" : "4 / 5",
        "50% 50%",
      ),
      layoutType: layouts[index % layouts.length],
    };
  }),
  tears: Array.from({ length: 4 }, (_, index) => ({
    id: `tear-${index + 1}`,
    date: "날짜 입력 예정",
    title: "기록 제목",
    shortDescription: "짧은 설명이 들어갑니다.",
    context: "추가 맥락이 들어갑니다.",
    image: slot(
      `TEARS ${String(index + 1).padStart(2, "0")}`,
      "눈물의 기록 관련 이미지",
      index % 2 === 0 ? "4 / 5" : "16 / 10",
      "50% 45%",
    ),
  })),
  quotes: Array.from({ length: 4 }, (_, index) => ({
    id: `quote-${index + 1}`,
    quote: "인터뷰 발췌문",
    date: "날짜 입력 예정",
    source: "출처 입력 예정",
    context: "발언 맥락이 들어갑니다.",
    image: slot(
      `QUOTE ${String(index + 1).padStart(2, "0")}`,
      "인터뷰 또는 경기 관련 이미지",
      "16 / 10",
      "50% 45%",
    ),
    link: "",
  })),
  polls: [],
  closing: {
    closingTitle: "오랫동안 기억하겠습니다.",
    closingText: "마지막 문장이 들어갑니다.",
    closingImage: slot(
      "CLOSING IMAGE",
      "최민정 선수 헌정 페이지 마지막 이미지",
      "21 / 12",
      "50% 45%",
    ),
  },
};
