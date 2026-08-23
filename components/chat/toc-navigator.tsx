"use client";

import React, { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Message } from "@/lib/chat-service";
import { cn } from "@/lib/utils";
import BlurFade from "@/components/ui/blur-fade";

export type Heading = {
  id: string;
  text: string;
  level?: number;
};

const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.85,
} as const;

/** Full TOC popup — shows all headings as a list with consistent hover box */
function TocPopup({
  headings,
  scrollActiveSectionId,
  onNavigate,
}: {
  headings: Heading[];
  scrollActiveSectionId: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  return (
    <div className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl py-2.5 animate-in fade-in-0 zoom-in-95 duration-150">
      <p className="mb-1.5 px-3.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
        ON THIS PAGE
      </p>
      <nav className="flex flex-col max-h-[360px] overflow-y-auto px-1">
        {headings.map((heading) => {
          const isActive = heading.id === scrollActiveSectionId;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(event) => onNavigate(event, heading.id)}
              data-selected={isActive ? "true" : undefined}
              className={cn(
                "relative isolate mx-1 rounded-xl px-3 py-2 text-[13px] leading-snug cursor-pointer transition-all duration-150",
                "overflow-hidden text-ellipsis whitespace-nowrap text-left",
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <span className="relative z-10">{heading.text}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

/** How far from top of viewport a heading counts as "currently reading" */
const READING_LINE_VIEWPORT_RATIO = 0.45;
const READING_LINE_MAX_PX = 220;

/** Pill width scales: active -> nearby -> far */
const PILL_SCALE = {
  active: 0.85,
  oneStepAway: 0.6,
  twoStepsAway: 0.45,
  resting: 0.35,
} as const;

function getReadingLinePx() {
  if (typeof window === "undefined") return 200;
  return Math.min(
    window.innerHeight * READING_LINE_VIEWPORT_RATIO,
    READING_LINE_MAX_PX
  );
}

function getPillScaleForIndex(pillIndex: number, focalIndex: number) {
  if (focalIndex < 0) return PILL_SCALE.resting;

  const stepsFromFocal = Math.abs(pillIndex - focalIndex);
  if (stepsFromFocal === 0) return PILL_SCALE.active;
  if (stepsFromFocal === 1) return PILL_SCALE.oneStepAway;
  if (stepsFromFocal === 2) return PILL_SCALE.twoStepsAway;
  return PILL_SCALE.resting;
}

function PreviewRail({
  headings,
  scrollActiveSectionId,
  onNavigate,
  className,
}: {
  headings: Heading[];
  scrollActiveSectionId: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);
  const [isRailHovered, setIsRailHovered] = useState(false);
  const hoverLeaveTimer = useRef<number | null>(null);

  const validScrollActiveSectionId =
    scrollActiveSectionId &&
    headings.some((heading) => heading.id === scrollActiveSectionId)
      ? scrollActiveSectionId
      : headings[0]?.id ?? "";

  const focalSectionId = focusedSectionId ?? validScrollActiveSectionId;
  const focalSectionIndex = headings.findIndex(
    (heading) => heading.id === focalSectionId
  );

  const showTocPopup = isRailHovered || focusedSectionId !== null;

  return (
    <motion.div
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedSectionId(null);
        }
      }}
      className={cn(
        "isolate relative flex w-full overflow-visible pointer-events-none min-h-80 justify-end",
        className
      )}
    >
      {/* Hover wrapper — covers the nav rail area */}
      <div
        onPointerEnter={() => {
          if (hoverLeaveTimer.current) {
            window.clearTimeout(hoverLeaveTimer.current);
            hoverLeaveTimer.current = null;
          }
          setIsRailHovered(true);
        }}
        onPointerLeave={() => {
          hoverLeaveTimer.current = window.setTimeout(() => {
            setIsRailHovered(false);
            hoverLeaveTimer.current = null;
          }, 300);
        }}
        className="pointer-events-auto relative my-auto ml-auto h-fit w-12 py-2 flex justify-end"
      >
        <nav
          aria-label="ON THIS PAGE"
          className="relative z-10 flex flex-col gap-2 shrink-0 h-fit w-10 content-center justify-items-end items-end"
        >
          {headings.map((heading, index) => {
            const isScrollActive = heading.id === validScrollActiveSectionId;
            const isFocalSection = heading.id === focalSectionId;
            const pillScale = getPillScaleForIndex(index, focalSectionIndex);

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                aria-label={heading.text}
                aria-current={isScrollActive ? "location" : undefined}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) {
                    setFocusedSectionId(heading.id);
                  }
                }}
                onClick={(event) => onNavigate(event, heading.id)}
                className="relative flex items-center justify-end h-4 w-10 focus-visible:outline-none group cursor-pointer"
              >
                <motion.span
                  aria-hidden="true"
                  animate={{ scaleX: pillScale }}
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  className={cn(
                    "block rounded-full h-1 w-10 origin-right transition-colors duration-150",
                    isFocalSection
                      ? "bg-foreground"
                      : "bg-muted-foreground/35 group-hover:bg-muted-foreground/70"
                  )}
                />
              </a>
            );
          })}
        </nav>

        {/* TOC popup — only on pill rail hover, overlays to the left of the rail */}
        {showTocPopup && (
          <div className="absolute top-1/2 right-12 z-50 -translate-y-1/2 mr-2">
            <TocPopup
              headings={headings}
              scrollActiveSectionId={validScrollActiveSectionId}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface TocNavigatorProps {
  messages?: Message[];
  containerRef?: React.RefObject<HTMLDivElement>;
  customHeadings?: Heading[];
}

export function TocNavigator({
  messages,
  containerRef,
  customHeadings,
}: TocNavigatorProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [scrollActiveSectionId, setScrollActiveSectionId] =
    useState<string>("");

  useEffect(() => {
    if (customHeadings && customHeadings.length > 0) {
      setHeadings(customHeadings);
      setScrollActiveSectionId(customHeadings[0]?.id || "");
      return;
    }

    if (messages && messages.length > 0) {
      const userPrompts = messages
        .filter((m) => m.role === "user")
        .map((msg, index) => ({
          id: `message-user-${index}`,
          text: msg.content
            ? msg.content.length > 42
              ? msg.content.substring(0, 42) + "..."
              : msg.content
            : `Prompt #${index + 1}`,
          level: 2,
        }));
      setHeadings(userPrompts);
      if (userPrompts.length > 0) {
        setScrollActiveSectionId(userPrompts[0].id);
      }
      return;
    }

    // Default DOM search for #posts h2
    const post = document.querySelector("#posts");
    if (post) {
      const headingElements = Array.from(post.querySelectorAll("h2"));
      const parsed = headingElements.map((el) => {
        if (!el.id) {
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_]+/g, "-") || "";
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: 2,
        };
      });
      setHeadings(parsed);
      if (parsed.length > 0) {
        setScrollActiveSectionId(parsed[0].id);
      }
    }
  }, [messages, customHeadings]);

  // Track scroll state in the container or window
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScrollSync = () => {
      const readingLinePx = getReadingLinePx();

      if (containerRef?.current) {
        const container = containerRef.current;
        const scrollPosition = container.scrollTop + readingLinePx;

        for (let i = headings.length - 1; i >= 0; i--) {
          const elem = document.getElementById(headings[i].id);
          if (elem && elem.offsetTop <= scrollPosition) {
            setScrollActiveSectionId(headings[i].id);
            return;
          }
        }
        setScrollActiveSectionId(headings[0]?.id || "");
      } else {
        // Window scroll
        let activeId = headings[0]?.id || "";
        for (const heading of headings) {
          const elem = document.getElementById(heading.id);
          if (elem) {
            const top = elem.getBoundingClientRect().top;
            if (top <= readingLinePx) {
              activeId = heading.id;
            }
          }
        }
        setScrollActiveSectionId(activeId);
      }
    };

    const target = containerRef?.current || window;
    target.addEventListener("scroll", handleScrollSync, { passive: true });
    return () => target.removeEventListener("scroll", handleScrollSync);
  }, [headings, containerRef]);

  if (headings.length < 2) return null;

  const handleNavigate = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (!elem) return;

    if (containerRef?.current) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const yOffset = -90;
      const y = Math.max(
        0,
        elem.getBoundingClientRect().top + window.scrollY + yOffset
      );
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setScrollActiveSectionId(id);
    window.history.pushState(null, "", `#${id}`);
  };

  // Only show on desktop (hidden on small screen devices as requested)
  return (
    <aside className="pointer-events-none fixed top-1/2 right-3 z-30 hidden h-[min(460px,70vh)] w-[min(17rem,calc(100vw-0.5rem))] -translate-y-1/2 select-none min-[1200px]:block">
      <BlurFade delay={0.12} duration={0.4}>
        <PreviewRail
          headings={headings}
          scrollActiveSectionId={scrollActiveSectionId}
          onNavigate={handleNavigate}
          className="h-[min(460px,70vh)]"
        />
      </BlurFade>
    </aside>
  );
}

export default TocNavigator;
