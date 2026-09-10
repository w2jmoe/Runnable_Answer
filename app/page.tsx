"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

type Locale = "en" | "zh";
type ConceptId = "context" | "memory" | "tool" | "decision" | "result";

type Concept = {
  id: ConceptId;
  label: string;
  short: string;
  title: string;
  why: string;
  steps: [string, string, string];
};

type Point = {
  x: number;
  y: number;
};

const copy: Record<
  Locale,
  {
    taskLabel: string;
    title: string;
    subtitle: string;
    helper: string;
    tryClick: string;
    answerLabel: string;
    concepts: Concept[];
    foundTitle: string;
    foundBody: string;
    fixAction: string;
    missingLabel: string;
    missingHint: string;
    fixedTitle: string;
    fixedBody: string;
    celebrationLabel: string;
    celebrationTitle: string;
    celebrationBody: string;
    beforeLabel: string;
    beforeFrom: string;
    beforeTo: string;
    afterLabel: string;
    afterFrom: string;
    afterTo: string;
    contextFixed: string;
    decisionFixed: string;
    resultFixed: string;
    repairedSteps: [string, string, string];
    storyAria: string;
    languageLabel: string;
    resetLabel: string;
    portfolioLabel: string;
  }
> = {
  en: {
    taskLabel: "Your task",
    title: "Try to fix this AI.",
    subtitle: "It just made the wrong decision. Find out why, then fix it.",
    helper: "Start by clicking a node to see what went wrong.",
    tryClick: "Try clicking here →",
    answerLabel: "Runnable Answer",
    concepts: [
      {
        id: "context",
        label: "Context",
        short: "Only saw the latest request",
        title: "It only saw the latest request.",
        why: "It missed one important piece of information, so it couldn’t see the full picture.",
        steps: ["Latest request only", "Missed key info", "Wrong decision"],
      },
      {
        id: "memory",
        label: "Memory",
        short: "Remembered an old preference",
        title: "It remembered an old preference.",
        why: "That old habit looked helpful, but it wasn’t enough.",
        steps: ["Old preference", "Looked helpful", "Still wrong"],
      },
      {
        id: "tool",
        label: "Tool",
        short: "Got incomplete information",
        title: "It got incomplete information.",
        why: "One important piece was missing, so it made the wrong call.",
        steps: ["Incomplete info", "Looked good enough", "Wrong decision"],
      },
      {
        id: "decision",
        label: "Decision",
        short: "Acted without checking",
        title: "It decided without checking.",
        why: "The information was incomplete, but it acted anyway.",
        steps: ["Didn’t check", "Acted too soon", "Wrong result"],
      },
      {
        id: "result",
        label: "Result",
        short: "Solved the wrong problem",
        title: "It solved the wrong problem.",
        why: "Because key information was missing, the final action went the wrong way.",
        steps: ["Missing info", "Wrong decision", "Wrong result"],
      },
    ],
    foundTitle: "Found the problem.",
    foundBody: "It’s missing one important piece of information.",
    fixAction: "Add the missing information →",
    missingLabel: "Missing information",
    missingHint: "One important piece it didn’t have",
    fixedTitle: "Fixed.",
    fixedBody: "Now it checks first, then decides.",
    celebrationLabel: "You did it",
    celebrationTitle: "Nice work!",
    celebrationBody: "This AI is better now because of you.",
    beforeLabel: "Before",
    beforeFrom: "Acted too soon",
    beforeTo: "Wrong result",
    afterLabel: "After",
    afterFrom: "Checked first",
    afterTo: "Better result",
    contextFixed: "Information restored",
    decisionFixed: "Decision revised",
    resultFixed: "Better result",
    repairedSteps: ["Information restored", "Decision revised", "Better result"],
    storyAria: "What changed",
    languageLabel: "Language",
    resetLabel: "Reset",
    portfolioLabel: "Portfolio",
  },
  zh: {
    taskLabel: "你的任务",
    title: "试着修好这个 AI",
    subtitle: "它刚才做错了决定。找出原因，再帮它修好。",
    helper: "先点一个，看看它为什么做错。",
    tryClick: "点这里试试 →",
    answerLabel: "可操作答案",
    concepts: [
      {
        id: "context",
        label: "上下文",
        short: "只看到了最新的问题",
        title: "它只看到了最新的问题。",
        why: "少了一条重要信息，所以它看不全全貌。",
        steps: ["只看到最新问题", "少了关键信息", "做错了决定"],
      },
      {
        id: "memory",
        label: "记忆",
        short: "记住了旧的偏好",
        title: "它记住了旧的偏好。",
        why: "旧习惯看起来有用，但还不够。",
        steps: ["旧偏好", "看起来有用", "还是做错了"],
      },
      {
        id: "tool",
        label: "工具",
        short: "拿到了不完整的信息",
        title: "它拿到的信息不完整。",
        why: "少了一条重要信息，所以它做了错误判断。",
        steps: ["信息不完整", "看起来够用", "做错了决定"],
      },
      {
        id: "decision",
        label: "决定",
        short: "没确认就直接行动",
        title: "它没确认就直接做了决定。",
        why: "信息并不完整，它却还是直接行动了。",
        steps: ["没确认", "直接行动", "结果做错了"],
      },
      {
        id: "result",
        label: "结果",
        short: "最后解决错了问题",
        title: "它最后解决错了问题。",
        why: "因为少了关键信息，最后的行动也就偏了。",
        steps: ["少了信息", "做错了决定", "结果不对"],
      },
    ],
    foundTitle: "找到问题了。",
    foundBody: "它少了一条重要信息。",
    fixAction: "补上这条信息 →",
    missingLabel: "缺失的信息",
    missingHint: "它没看到的一条关键信息",
    fixedTitle: "修好了。",
    fixedBody: "现在它会先确认，再做决定。",
    celebrationLabel: "完成了",
    celebrationTitle: "做得好！",
    celebrationBody: "因为你，这个 AI 变得更好了。",
    beforeLabel: "之前",
    beforeFrom: "直接行动",
    beforeTo: "做错",
    afterLabel: "现在",
    afterFrom: "先确认",
    afterTo: "做对",
    contextFixed: "信息已补上",
    decisionFixed: "决定已修正",
    resultFixed: "结果更好了",
    repairedSteps: ["信息已补上", "决定已修正", "结果更好了"],
    storyAria: "发生了什么变化",
    languageLabel: "语言",
    resetLabel: "重置",
    portfolioLabel: "作品集",
  },
};

const basePositions: Record<ConceptId, Point> = {
  context: { x: 17, y: 34 },
  memory: { x: 31, y: 66 },
  tool: { x: 48, y: 34 },
  decision: { x: 64, y: 54 },
  result: { x: 84, y: 35 },
};

const focusPositions: Record<ConceptId, Record<ConceptId, Point>> = {
  context: {
    context: { x: 43, y: 30 },
    memory: { x: 21, y: 66 },
    tool: { x: 27, y: 42 },
    decision: { x: 61, y: 50 },
    result: { x: 80, y: 36 },
  },
  memory: {
    context: { x: 17, y: 36 },
    memory: { x: 45, y: 31 },
    tool: { x: 29, y: 67 },
    decision: { x: 62, y: 54 },
    result: { x: 82, y: 38 },
  },
  tool: {
    context: { x: 18, y: 37 },
    memory: { x: 28, y: 68 },
    tool: { x: 45, y: 31 },
    decision: { x: 64, y: 50 },
    result: { x: 83, y: 35 },
  },
  decision: {
    context: { x: 12, y: 31 },
    memory: { x: 28, y: 72 },
    tool: { x: 46, y: 29 },
    decision: { x: 62, y: 55 },
    result: { x: 88, y: 33 },
  },
  result: {
    context: { x: 16, y: 37 },
    memory: { x: 28, y: 69 },
    tool: { x: 44, y: 35 },
    decision: { x: 61, y: 51 },
    result: { x: 76, y: 30 },
  },
};

const fixedPositions: Record<ConceptId, Point> = {
  context: { x: 22, y: 34 },
  memory: { x: 24, y: 70 },
  tool: { x: 42, y: 68 },
  decision: { x: 54, y: 38 },
  result: { x: 80, y: 36 },
};

const relatedToActive: Record<ConceptId, ConceptId[]> = {
  context: ["decision", "result"],
  memory: ["decision"],
  tool: ["decision"],
  decision: ["context", "memory", "tool", "result"],
  result: ["context", "decision"],
};

const CONFETTI_COLORS = ["#d7ff72", "#8ec8ff", "#ffd8d5", "#f4f1e8"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [active, setActive] = useState<ConceptId>("decision");
  const [hasExplored, setHasExplored] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const t = copy[locale];
  const concepts = t.concepts;

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    if (!showConfetti) {
      return;
    }

    const timer = window.setTimeout(() => setShowConfetti(false), 1600);
    return () => window.clearTimeout(timer);
  }, [showConfetti]);

  const positions = useMemo(() => {
    if (isFixed) {
      return fixedPositions;
    }

    return hasExplored ? focusPositions[active] ?? basePositions : basePositions;
  }, [active, hasExplored, isFixed]);

  const activeConcept = concepts.find((concept) => concept.id === active) ?? concepts[3];
  const story = isFixed ? t.repairedSteps : activeConcept.steps;
  const showClickHint = !hasExplored;
  const showActPhase = hasExplored && !isFixed;

  function selectConcept(id: ConceptId) {
    if (isFixed) {
      setActive(id);
      return;
    }

    setActive(id);
    setHasExplored(true);
  }

  function fixAnswer() {
    setIsFixed(true);
    setActive("decision");
    setShowConfetti(true);
  }

  function resetAnswer() {
    setHasExplored(false);
    setIsFixed(false);
    setShowConfetti(false);
    setActive("decision");
  }

  return (
    <main className={["prototype-shell", isFixed ? "is-complete" : ""].join(" ")} data-lang={locale}>
      {showConfetti ? (
        <div className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 32 }, (_, index) => (
            <span
              key={index}
              className={`piece-${index % 4}`}
              style={
                {
                  "--angle": `${(index / 32) * 360 + (index % 3) * 8}deg`,
                  "--distance": `${16 + (index % 6) * 3.5}vh`,
                  "--drift": `${(index % 2 === 0 ? 1 : -1) * (3 + (index % 4))}vw`,
                  "--color": CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                  "--delay": `${(index % 7) * 24}ms`,
                  "--size": `${0.4 + (index % 4) * 0.16}rem`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      <div className="language-switch" role="group" aria-label={t.languageLabel}>
        {(["en", "zh"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={locale === option ? "is-active" : ""}
            onClick={() => setLocale(option)}
            aria-pressed={locale === option}
          >
            {option === "en" ? "EN" : "中文"}
          </button>
        ))}
      </div>

      <section className={["question-block", isFixed ? "is-celebrating" : ""].join(" ")} aria-label={isFixed ? t.celebrationLabel : t.taskLabel}>
        <p className="eyebrow">{isFixed ? t.celebrationLabel : t.taskLabel}</p>
        <h1>{isFixed ? t.celebrationTitle : t.title}</h1>
        <p className="question-helper">{isFixed ? t.celebrationBody : t.subtitle}</p>
        {showClickHint ? <p className="start-hint">{t.helper}</p> : null}
      </section>

      <section className={["answer-stage", isFixed ? "is-fixed" : ""].join(" ")} aria-label={t.answerLabel}>
        <div className="stage-label">
          <span>{t.answerLabel}</span>
          {isFixed ? <small>{t.fixedTitle}</small> : null}
        </div>

        <button className="reset-button" type="button" onClick={resetAnswer}>
          {t.resetLabel}
        </button>

        <svg className="relation-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <Relation
            from={positions.context}
            to={positions.decision}
            active={isFixed || active === "context" || active === "decision"}
            repaired={isFixed}
          />
          <Relation from={positions.memory} to={positions.decision} active={!isFixed && (active === "memory" || active === "decision")} />
          <Relation from={positions.tool} to={positions.decision} active={!isFixed && (active === "tool" || active === "decision")} />
          <Relation
            from={positions.decision}
            to={positions.result}
            active={isFixed || active === "decision" || active === "result"}
            repaired={isFixed}
          />
        </svg>

        {concepts.map((concept) => {
          const isActive = concept.id === active;
          const isRelated = relatedToActive[active]?.includes(concept.id);
          return (
            <button
              key={concept.id}
              className={[
                "concept-node",
                isActive ? "is-active" : "",
                hasExplored && isRelated ? "is-related" : "",
                showClickHint && concept.id === "decision" ? "is-attention" : "",
                isFixed && (concept.id === "context" || concept.id === "decision" || concept.id === "result")
                  ? "is-recovered"
                  : "",
              ].join(" ")}
              style={{ left: `${positions[concept.id].x}%`, top: `${positions[concept.id].y}%` }}
              onClick={() => selectConcept(concept.id)}
              type="button"
            >
              <span>{concept.label}</span>
              <small>
                {isFixed && concept.id === "context"
                  ? t.contextFixed
                  : isFixed && concept.id === "decision"
                    ? t.decisionFixed
                    : isFixed && concept.id === "result"
                      ? t.resultFixed
                      : concept.short}
              </small>
            </button>
          );
        })}

        {showClickHint ? (
          <p className="nudge-hint" style={{ left: `${positions.decision.x}%`, top: `${positions.decision.y}%` }}>
            {t.tryClick}
          </p>
        ) : null}

        {showActPhase ? (
          <div className="missing-chip" style={{ left: "25%", top: "20%" }}>
            <strong>{t.missingLabel}</strong>
            <span>{t.missingHint}</span>
          </div>
        ) : null}

        {isFixed ? (
          <aside className="explanation-panel is-complete" aria-live="polite">
            <p className="panel-kicker">{t.fixedTitle}</p>
            <h2>{t.fixedTitle}</h2>
            <p>{t.fixedBody}</p>
            <div className="before-after">
              <div className="ba-card is-before">
                <span>{t.beforeLabel}</span>
                <p>
                  <strong>{t.beforeFrom}</strong>
                  <em aria-hidden="true">→</em>
                  <strong>{t.beforeTo}</strong>
                </p>
              </div>
              <div className="ba-card is-after">
                <span>{t.afterLabel}</span>
                <p>
                  <strong>{t.afterFrom}</strong>
                  <em aria-hidden="true">→</em>
                  <strong>{t.afterTo}</strong>
                </p>
              </div>
            </div>
          </aside>
        ) : null}

        {showActPhase ? (
          <aside className="explanation-panel" aria-live="polite">
            <p className="panel-kicker">{activeConcept.label}</p>
            <h2>{activeConcept.title}</h2>
            <p>{activeConcept.why}</p>

            <div className="found-block">
              <p className="found-title">{t.foundTitle}</p>
              <p>{t.foundBody}</p>
              <button className="fix-action" type="button" onClick={fixAnswer}>
                {t.fixAction}
              </button>
            </div>
          </aside>
        ) : null}

        {hasExplored ? (
          <div className={["cause-strip", isFixed ? "is-fixed" : "is-broken"].join(" ")} aria-label={t.storyAria}>
            {story.map((item, index) => (
              <span
                key={`${index}-${item}`}
                className={index === story.length - 1 ? "primary-cause" : ""}
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <footer className="site-footer">
        <a href="mailto:w2jmoe@gmail.com">w2jmoe@gmail.com</a>
        <span aria-hidden="true">·</span>
        <a href="https://w2jmoe.github.io/jay-portfolio" target="_blank" rel="noreferrer">
          {t.portfolioLabel}
        </a>
      </footer>
    </main>
  );
}

function Relation({
  from,
  to,
  active,
  repaired = false,
}: {
  from: Point;
  to: Point;
  active: boolean;
  repaired?: boolean;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      className={["relation-line", active ? "is-active" : "", repaired ? "is-repaired" : ""].join(" ")}
      markerEnd="url(#arrow)"
    />
  );
}
