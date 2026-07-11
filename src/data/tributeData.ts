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
    image: {
    src: "/images/tribute/hero/hero-01.jpg",
    alt: "최민정 선수 헌정 페이지 히어로 이미지",
    placeholder: "",
    ratio: "21 / 13",
    position: "50% 35%",
  },
  },
  careerSummary: {
    intro: "숫자로 돌아보는 최민정의 시간",
    metrics: [
      {
        id: "olympic-medals",
        label: "올림픽 메달",
        value: 7,
        unit: "개",
        note: "금메달 4개, 은메달 3개",
        image: {
    src: "/images/tribute/career/career-01.jpg",
    alt: "최민정 선수 헌정 페이지 히어로 이미지",
    placeholder: "",
    ratio: "13 / 21",
    position: "35% 50%",
  },
      },
      {
        id: "world-medals",
        label: "세계선수권 메달",
        value: 24,
        unit: "개",
        note: "금메달 17개, 은메달 6개, 동메달 1개",
        image:  {
    src: "/images/tribute/career/career-02.avif",
    alt: "최민정 선수 헌정 페이지 히어로 이미지",
    placeholder: "",
    ratio: "21 / 13",
    position: "50% 35%",
  },
      },
      {
        id: "worldcup-medals",
        label: "월드컵·월드투어 메달",
        value: 102,
        unit: "개",
        note: "금메달 51개, 은메달 34개, 동메달 17개",
        image: {
    src: "/images/tribute/career/career-03.jpg",
    alt: "최민정 선수 헌정 페이지 히어로 이미지",
    placeholder: "",
    ratio: "5 / 4",
    position: "50% 50%",
  },
      },
      {
        id: "other-medals",
        label: "기타 국제대회 메달",
        value: 25,
        unit: "개",
        note: "금메달 17개, 은메달 2개, 동메달 6개",
        image: {
    src: "/images/tribute/career/career-04.jpg",
    alt: "최민정 선수 헌정 페이지 히어로 이미지",
    placeholder: "",
    ratio: "16 / 10",
    position: "50% 50%",
  },
      },
    ],
  },
timeline: [
  {
    id: "season-2014-15",
    season: "2014/2015",
    seasonLabel: "빙판 위에 떠오른 새로운 이름",
    seasonSummary:
      "시니어 무대에 첫발을 내디딘 시즌. 최민정은 곧바로 세계 정상에 오르며 한국 쇼트트랙의 새로운 에이스로 떠올랐다.",
    image: {
      src: "/images/tribute/timeline/timeline-2014-15.png",
      alt: "2014-15 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
   {
    id: "season-2015-16",
    season: "2015/2016",
    seasonLabel: "에이스에서 최강자로",
    seasonSummary:
      "월드컵 종합우승과 세계선수권 종합우승을 모두 석권한 시즌. 데뷔 두 시즌 만에 최민정은 세계 쇼트트랙의 정점에 섰다.",
    image: {
      src: "/images/tribute/timeline/timeline-2015-16.png",
      alt: "2015-16 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
     {
    id: "season-2016-17",
    season: "2016/2017",
    seasonLabel: "빛과 그늘을 함께 지나며",
    seasonSummary:
      "월드컵과 아시안게임에서는 여전히 강했지만, 세계선수권은 빈손으로 돌아서야 했다. 훗날 최민정 스스로 가장 힘들었다고 돌아본, 빛과 그늘이 함께했던 시즌이었다.",
    image: {
      src: "/images/tribute/timeline/timeline-2016-17.png",
      alt: "2016-17 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
       {
    id: "season-2017-18",
    season: "2017/2018",
    seasonLabel: "가장 찬란하게 빛난 시즌",
    seasonSummary:
      "세계 무대를 지배하던 최민정은 평창에서도 가장 높은 자리에 올랐다. 월드컵, 세계선수권, 올림픽까지 자신의 이름으로 물들인 가장 완벽한 시즌이었다.",
    image: {
      src: "/images/tribute/timeline/timeline-2017-18.png",
      alt: "2017-18 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
     {
    id: "season-2018-19",
    season: "2018/2019",
    seasonLabel: "흔들려도, 다시",
    seasonSummary:
      "부상의 여파와 또 한 번의 부상으로 쉽지 않은 시즌을 보냈지만, 끝내 세계선수권에서 다시 좋은 성과를 남겼다. 흔들렸어도 무너지지는 않았던 시즌이었다.",
    image: {
      src: "/images/tribute/timeline/timeline-2018-19.png",
      alt: "2018-19 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
       {
    id: "season-2019-20",
    season: "2019/2020",
    seasonLabel: "늦게 피어, 끝내 가장 빛나다",
    seasonSummary:
      "부상의 여파로 시즌 초반은 더뎠지만, 최민정은 끝까지 자신의 흐름을 되찾았다. 그리고 시즌의 마지막, 사대륙선수권 전관왕으로 가장 완벽한 마침표를 찍었다.",
    image: {
      src: "/images/tribute/timeline/timeline-2019-20.png",
      alt: "2019-20 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
         {
    id: "season-2020-21",
    season: "2020/2021",
    seasonLabel: "잠시 멈춰, 다시 앞으로",
    seasonSummary:
      "팬데믹으로 국제대회 무대를 잠시 떠나 있던 시즌. 숨을 고르고 몸과 마음을 재정비하며, 다시 달릴 시간을 준비했다.",
    image: {
      src: "/images/tribute/timeline/timeline-2020-21.png",
      alt: "2020-21 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
           {
    id: "season-2021-22",
    season: "2021/2022",
    seasonLabel: "의심을 넘어 다시 정상으로",
    seasonSummary:
      "마음이 흔들릴 만한 순간들과 부상까지 겹치며 쉽지 않은 시즌이었다. 그러나 최민정은 올림픽 2연패와 세계선수권 종합 우승으로, 끝내 변하지 않는 클래스를 보여 주었다.",
    image: {
      src: "/images/tribute/timeline/timeline-2021-22.png",
      alt: "2021-22 시즌 최민정 선수",
      placeholder: "",
      ratio: "16 / 11",
      position: "50% 45%",
    },
    olympics: [],
    worldChampionships: [],
    worldCupOrWorldTour: [],
    additionalNote: "",
  },
],
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
