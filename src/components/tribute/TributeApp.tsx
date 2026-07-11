"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_FAN_MESSAGE_LENGTH,
  type Highlight,
  type KeywordItem,
  type MedalMetric,
  type Poll,
  type TearMoment,
  type TimelineSeason,
  type TributeData,
} from "@/src/data/tributeData";
import {
  fetchApprovedMessages,
  isSupabaseConfigured,
  submitFanMessage,
  type FanMessage,
} from "@/src/lib/supabaseRest";
import { TributeImage } from "./TributeImage";

type TributeAppProps = {
  data: TributeData;
};

const sections = [
  ["records", "기록"],
  ["timeline", "시간"],
  ["highlights", "순간"],
  ["keywords", "키워드"],
  ["tears", "눈물"],
  ["voice", "목소리"],
  ["poll", "당신의 최민정"],
  ["message", "최민정에게"],
  ["closing", "작별"],
] as const;

export function TributeApp({ data }: TributeAppProps) {
  const [messages, setMessages] = useState<FanMessage[]>([]);
  const [activePoll, setActivePoll] = useState<Record<string, string>>({});
  const [pollSubmitted, setPollSubmitted] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach((node) => {
        node.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 },
    );

    document.querySelectorAll("[data-reveal]").forEach((node) => {
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchApprovedMessages()
      .then(setMessages)
      .catch(() => setMessages([]));
  }, []);

  const pollData = useMemo(() => data.polls.filter((poll) => poll.isActive), [
    data.polls,
  ]);

  return (
    <main className="tribute-shell">
      <a className="skip-link" href="#records">
        본문으로 이동
      </a>
      <SceneNav />
      <TributeHero data={data.hero} />
      <CareerSummarySection
        intro={data.careerSummary.intro}
        metrics={data.careerSummary.metrics}
      />
      <CareerTimelineSection seasons={data.timeline} />
      <CareerHighlightsSection highlights={data.highlights} />
      <KeywordsSection keywords={data.keywords} />
      <TearsSection tears={data.tears} />
      <VoiceSection quotes={data.quotes} />
      <FanPollSection
        polls={pollData}
        activePoll={activePoll}
        pollSubmitted={pollSubmitted}
        onSelect={(pollId, optionId) =>
          setActivePoll((current) => ({ ...current, [pollId]: optionId }))
        }
        onSubmit={(pollId) =>
          setPollSubmitted((current) => ({ ...current, [pollId]: true }))
        }
      />
      <FanMessageSection messages={messages} setMessages={setMessages} />
      <TributeClosing closing={data.closing} />
    </main>
  );
}

function SceneNav() {
  return (
    <nav className="scene-nav" aria-label="헌정 페이지 섹션">
      {sections.map(([id, label]) => (
        <a key={id} href={`#${id}`}>
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="section-heading" data-reveal>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{description}</span>
    </header>
  );
}

function TributeHero({ data }: { data: TributeData["hero"] }) {
  return (
    <section className="hero-section" aria-label="오프닝 히어로">
      <div className="hero-copy" data-reveal>
        <p className="hero-overline">RETIREMENT TRIBUTE</p>
        <h1>{data.nameKo}</h1>
        <strong>{data.nameEn}</strong>
        <span>{data.dedication}</span>
      </div>
      <TributeImage slot={data.image} className="hero-image" priority />
      <div className="scroll-cue" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  );
}

function CareerSummarySection({
  intro,
  metrics,
}: {
  intro: string;
  metrics: MedalMetric[];
}) {
  return (
    <section className="records-section section-dark" id="records">
      <SectionHeading
        eyebrow="01 / Records"
        title="최민정이 남긴 기록"
        description={intro}
      />
      <div className="metric-scenes">
        {metrics.map((metric, index) => (
          <MetricScene key={metric.id} metric={metric} index={index} />
        ))}
      </div>
    </section>
  );
}

function MetricScene({
  metric,
  index,
}: {
  metric: MedalMetric;
  index: number;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [displayValue, setDisplayValue] = useState<number | null>(
    metric.value === null ? null : 0,
  );

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.4,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(scene);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (metric.value === null) {
      setDisplayValue(null);
      return;
    }

    if (!hasEntered) {
      setDisplayValue(0);
      return;
    }

    const target = metric.value;
    const duration = 1200;
    let animationFrame = 0;
    let startTime: number | null = null;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(target);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(target * easedProgress));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [hasEntered, metric.value]);

  return (
    <article
      ref={sceneRef}
      className={`metric-scene metric-scene--${index % 2 === 0 ? "left" : "right"}`}
      data-reveal
    >
      <div className="metric-type">
        <span>{displayValue === null ? "N" : displayValue}</span>
        <small>{metric.unit}</small>
      </div>
      <div className="metric-caption">
        <h3>{metric.label}</h3>
        <p>{metric.note}</p>
      </div>
      {metric.image ? <TributeImage slot={metric.image} /> : null}
    </article>
  );
}

function CareerTimelineSection({ seasons }: { seasons: TimelineSeason[] }) {
  return (
    <section className="timeline-section section-light" id="timeline">
      <SectionHeading
        eyebrow="02 / Seasons"
        title="최민정이 달려온 시간"
        description="한 시즌씩 쌓여, 한 시대가 되기까지"
      />
      <div className="timeline-scenes">
        {seasons.map((season) => (
          <CareerTimelineSeason key={season.id} season={season} />
        ))}
      </div>
    </section>
  );
}

function CareerTimelineSeason({ season }: { season: TimelineSeason }) {
  const groups = [
    ["올림픽", season.olympics],
    ["세계선수권", season.worldChampionships],
    ["월드컵·월드투어", season.worldCupOrWorldTour],
  ] as const;

  return (
    <article className="season-scene" data-reveal>
      <div className="season-title">
        <span>{season.season}</span>
        <p>{season.seasonLabel}</p>
      </div>
      <div className="season-body">
        <TributeImage slot={season.image} />
        <div className="season-details">
          <p>{season.seasonSummary}</p>
          {groups.map(([label, items]) =>
            items && items.length > 0 ? (
              <div className="season-group" key={label}>
                <h3>{label}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
          {season.additionalNote ? <small>{season.additionalNote}</small> : null}
        </div>
      </div>
    </article>
  );
}

function CareerHighlightsSection({ highlights }: { highlights: Highlight[] }) {
  return (
    <section className="highlights-section section-dark" id="highlights">
      <SectionHeading
        eyebrow="03 / Moments"
        title="우리가 기억하는 순간"
        description="하이라이트 10개가 작은 목록이 아니라 하나의 장면처럼 이어집니다."
      />
      <div className="highlight-reel">
        {highlights.map((highlight) => (
          <CareerHighlightItem key={highlight.id} highlight={highlight} />
        ))}
      </div>
    </section>
  );
}

function CareerHighlightItem({ highlight }: { highlight: Highlight }) {
  return (
    <article
      className={`highlight-item highlight-item--${highlight.layoutType}`}
      data-reveal
    >
      <div className="highlight-number">{highlight.number}</div>
      <TributeImage slot={highlight.image} />
      <div className="highlight-copy">
        <p>
          {highlight.competition} · {highlight.event}
        </p>
        <h3>{highlight.title}</h3>
        <span>{highlight.shortDescription}</span>
        <small>{highlight.date}</small>
        <div className="link-row">
          {highlight.resultLink ? (
            <a href={highlight.resultLink}>결과 보기</a>
          ) : null}
          {highlight.archiveLink ? (
            <a href={highlight.archiveLink}>아카이브 보기</a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function KeywordsSection({ keywords }: { keywords: KeywordItem[] }) {
  return (
    <section className="keywords-section section-light" id="keywords">
      <SectionHeading
        eyebrow="04 / Interpretation"
        title="최민정을 말하는 키워드"
        description="기록을 나열하지 않고, 한 선수를 해석하는 장면으로 구성합니다."
      />
      <div className="keyword-stack">
        {keywords.map((keyword) => (
          <KeywordScene key={keyword.id} keyword={keyword} />
        ))}
      </div>
    </section>
  );
}

function KeywordScene({ keyword }: { keyword: KeywordItem }) {
  return (
    <article
      className={`keyword-scene keyword-scene--${keyword.layoutType}`}
      data-reveal
    >
      {keyword.image ? <TributeImage slot={keyword.image} /> : null}
      <div>
        <h3>{keyword.keyword}</h3>
        <p>{keyword.description}</p>
      </div>
    </article>
  );
}

function TearsSection({ tears }: { tears: TearMoment[] }) {
  return (
    <section className="tears-section section-dark" id="tears">
      <SectionHeading
        eyebrow="05 / Emotion"
        title="눈물의 기록"
        description="감정을 과장하지 않고, 사진과 짧은 기록이 조용히 남도록 합니다."
      />
      <div className="tear-grid">
        {tears.map((moment) => (
          <TearMomentCard key={moment.id} moment={moment} />
        ))}
      </div>
    </section>
  );
}

function TearMomentCard({ moment }: { moment: TearMoment }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="tear-card" data-reveal>
      <TributeImage slot={moment.image} />
      <div className="tear-card__copy">
        <time>{moment.date}</time>
        <h3>{moment.title}</h3>
        <p>{moment.shortDescription}</p>
        <button type="button" onClick={() => setOpen((current) => !current)}>
          {open ? "접기" : "맥락 보기"}
        </button>
        {open ? <span>{moment.context}</span> : null}
      </div>
    </article>
  );
}

function VoiceSection({ quotes }: { quotes: TributeData["quotes"] }) {
  return (
    <section className="voice-section section-light" id="voice">
      <SectionHeading
        eyebrow="06 / Voice"
        title="최민정의 목소리"
        description="실제 인터뷰 발언과 출처가 들어오면 한 문장씩 천천히 마주합니다."
      />
      <div className="quote-flow">
        {quotes.map((quote) => (
          <QuoteItemView key={quote.id} quote={quote} />
        ))}
      </div>
    </section>
  );
}

function QuoteItemView({ quote }: { quote: TributeData["quotes"][number] }) {
  return (
    <article className="quote-item" data-reveal>
      {quote.image ? <TributeImage slot={quote.image} /> : null}
      <div>
        <blockquote>{quote.quote}</blockquote>
        <p>{quote.context}</p>
        <small>
          {quote.date} · {quote.source}
        </small>
        {quote.link ? <a href={quote.link}>출처로 이동</a> : null}
      </div>
    </article>
  );
}

function FanPollSection({
  polls,
  activePoll,
  pollSubmitted,
  onSelect,
  onSubmit,
}: {
  polls: Poll[];
  activePoll: Record<string, string>;
  pollSubmitted: Record<string, boolean>;
  onSelect: (pollId: string, optionId: string) => void;
  onSubmit: (pollId: string) => void;
}) {
  return (
    <section className="poll-section section-dark" id="poll">
      <SectionHeading
        eyebrow="07 / Fans"
        title="당신의 최민정"
        description="투표 질문과 선택지는 추후 데이터로 추가합니다."
      />
      {polls.length === 0 ? (
        <div className="poll-empty" data-reveal>
          <span>VOTE READY</span>
          <h3>투표 콘텐츠 준비 상태</h3>
          <p>
            실제 질문과 선택지가 입력되면 이 영역은 투표 전 화면과 결과 화면을
            자동으로 보여줍니다.
          </p>
        </div>
      ) : (
        <div className="poll-list">
          {polls.map((poll) => (
            <PollItem
              key={poll.id}
              poll={poll}
              selected={activePoll[poll.id]}
              submitted={Boolean(pollSubmitted[poll.id])}
              onSelect={(optionId) => onSelect(poll.id, optionId)}
              onSubmit={() => onSubmit(poll.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PollItem({
  poll,
  selected,
  submitted,
  onSelect,
  onSubmit,
}: {
  poll: Poll;
  selected?: string;
  submitted: boolean;
  onSelect: (optionId: string) => void;
  onSubmit: () => void;
}) {
  return (
    <article className="poll-item" data-reveal>
      <div className="poll-copy">
        <h3>{poll.title}</h3>
        <p>{poll.description}</p>
      </div>
      <div className={`poll-options poll-options--${poll.type}`}>
        {poll.options.map((option) => (
          <button
            type="button"
            className={selected === option.id ? "is-selected" : ""}
            key={option.id}
            onClick={() => onSelect(option.id)}
            aria-pressed={selected === option.id}
          >
            {option.image ? <TributeImage slot={option.image} /> : null}
            <span>{option.label}</span>
            {option.meta ? <small>{option.meta}</small> : null}
          </button>
        ))}
      </div>
      {submitted ? (
        <p className="poll-status">투표가 기록되었습니다.</p>
      ) : (
        <button
          className="primary-action"
          type="button"
          onClick={onSubmit}
          disabled={!selected}
        >
          투표하기
        </button>
      )}
    </article>
  );
}

function FanMessageSection({
  messages,
  setMessages,
}: {
  messages: FanMessage[];
  setMessages: React.Dispatch<React.SetStateAction<FanMessage[]>>;
}) {
  return (
    <section className="message-section section-light" id="message">
      <SectionHeading
        eyebrow="08 / Letter"
        title="최민정에게"
        description="팬 메시지는 관리자 승인 후 공개됩니다."
      />
      <div className="message-layout">
        <FanMessageForm setMessages={setMessages} />
        <FanMessageWall messages={messages} />
      </div>
    </section>
  );
}

function FanMessageForm({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<FanMessage[]>>;
}) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const saved = await submitFanMessage({ nickname, message });
      if (!isSupabaseConfigured) {
        setMessages((current) => [saved, ...current]);
      }
      setNickname("");
      setMessage("");
      setStatus("success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "메시지를 제출하지 못했습니다.",
      );
      setStatus("error");
    }
  }

  return (
    <form className="message-form" onSubmit={handleSubmit} data-reveal>
      <div>
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          name="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={30}
          required
        />
      </div>
      <div>
        <label htmlFor="message">최민정 선수에게 남길 한마디</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={MAX_FAN_MESSAGE_LENGTH}
          required
        />
        <span className="char-count">
          {message.length} / {MAX_FAN_MESSAGE_LENGTH}
        </span>
      </div>
      <p>
        작성한 메시지는 바로 공개되지 않으며, 관리자 승인 후 헌정 페이지에
        표시됩니다.
      </p>
      <button
        className="primary-action"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "제출 중" : "제출"}
      </button>
      {status === "success" ? (
        <span className="form-status">메시지가 승인 대기 상태로 저장되었습니다.</span>
      ) : null}
      {status === "error" ? <span className="form-error">{error}</span> : null}
    </form>
  );
}

function FanMessageWall({ messages }: { messages: FanMessage[] }) {
  const approvedMessages = messages.filter(
    (message) => message.status === "approved",
  );

  return (
    <div className="message-wall" data-reveal>
      {approvedMessages.length === 0 ? (
        <div className="message-empty">
          <span>MESSAGE WALL</span>
          <p>승인된 팬 메시지가 이 공간에 차곡차곡 쌓입니다.</p>
        </div>
      ) : (
        approvedMessages.map((message) => (
          <article key={message.id}>
            <p>{message.message}</p>
            <small>{message.nickname}</small>
          </article>
        ))
      )}
    </div>
  );
}

function TributeClosing({ closing }: { closing: TributeData["closing"] }) {
  return (
    <section className="closing-section" id="closing">
      <TributeImage slot={closing.closingImage} />
      <div className="closing-copy" data-reveal>
        <h2>{closing.closingTitle}</h2>
        <p>{closing.closingText}</p>
      </div>
    </section>
  );
}
