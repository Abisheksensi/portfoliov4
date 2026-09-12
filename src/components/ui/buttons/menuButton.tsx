"use client";

import {
  AnimatePresence,
  cubicBezier,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { tokens } from "../../../tokens/tokens";

interface MenuButtonProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (isOpen: boolean) => void;
  readonly onPitchDeck?: () => void;
}

type PanelMode = "menu" | "schedule";

const ease = cubicBezier(0.22, 1, 0.36, 1);
const logoGridSize = 16;
const logoAnimationDuration = 1200;
const logoOrange = "#f8703e";
const logoWhite = "#f6f6f6";
const logoDots = new Set([
  "9,4", "10,4",
  "8,5", "9,5", "10,5", "11,5",
  "8,6", "9,6", "10,6", "11,6",
  "9,7", "10,7",
]);

const menuItems: ReadonlyArray<{ readonly label: string; readonly dots?: 2 | 4 }> = [
  { label: "Work" },
  { label: "What we do", dots: 4 },
  { label: "About us" },
  { label: "Careers", dots: 2 },
  { label: "Contact" },
];

const calendarDays: Array<number | null> = [
  null, null, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, null, null, null,
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function ordinal(day: number) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
  if (day % 10 === 1) return `${day}st`;
  if (day % 10 === 2) return `${day}nd`;
  if (day % 10 === 3) return `${day}rd`;
  return `${day}th`;
}

function BrandMark({ animationCycle }: { readonly animationCycle: number }) {
  const gridRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (animationCycle === 0 || !gridRef.current) return;

    const animations = Array.from(gridRef.current.children).map(
      (dot, index) => {
        const x = index % logoGridSize;
        const y = Math.floor(index / logoGridSize);
        const delay = Math.round(
          Math.sqrt((x - 9.5) ** 2 + (y - 5.5) ** 2) * 24
        );
        const isLogoDot = logoDots.has(`${x},${y}`);
        const keyframes: Keyframe[] = [
          { opacity: 0, backgroundColor: logoOrange, offset: 0 },
          {
            opacity: 0,
            backgroundColor: logoOrange,
            offset: delay / logoAnimationDuration,
          },
          {
            opacity: 1,
            backgroundColor: logoOrange,
            offset: (delay + 240) / logoAnimationDuration,
          },
          ...(isLogoDot
            ? []
            : [
                {
                  opacity: 1,
                  backgroundColor: logoOrange,
                  offset: (delay + 140) / logoAnimationDuration,
                },
                {
                  opacity: 1,
                  backgroundColor: logoWhite,
                  offset: (delay + 520) / logoAnimationDuration,
                },
              ]),
          {
            opacity: 1,
            backgroundColor: isLogoDot ? logoOrange : logoWhite,
            offset: 1,
          },
        ];

        keyframes.sort(
          (first, second) => (first.offset ?? 0) - (second.offset ?? 0)
        );

        return dot.animate(keyframes, {
          duration: logoAnimationDuration,
          iterations: 1,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
      }
    );

    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, [animationCycle]);

  return (
    <motion.span
      layoutId="menu-brand-mark"
      className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-white"
      transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
      aria-hidden="true"
    >
      <span
        ref={gridRef}
        className="absolute left-[-13px] top-[-14px] grid h-[78.48px] w-[78.48px] grid-cols-[repeat(16,4.13px)] grid-rows-[repeat(16,4.13px)] gap-[0.83px]"
      >
        {Array.from({ length: logoGridSize * logoGridSize }, (_, index) => {
          const x = index % logoGridSize;
          const y = Math.floor(index / logoGridSize);
          const isLogoDot = logoDots.has(`${x},${y}`);

          return (
            <span
              key={index}
              className="block h-[4.13px] w-[4.13px] rounded-full"
              style={{ backgroundColor: isLogoDot ? logoOrange : logoWhite }}
            />
          );
        })}
      </span>
    </motion.span>
  );
}

function DotSpinner() {
  return (
    <motion.svg
      viewBox="0 0 30 29"
      width="29.4"
      height="28.4"
      className="shrink-0"
      initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
      animate={{ opacity: 1, rotate: 360, scale: 1 }}
      exit={{ opacity: 0, rotate: 35, scale: 0.75 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.3, ease },
        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
      }}
      aria-hidden="true"
    >
      <circle cx="15" cy="2.5" r="2.1" fill="currentColor" />
      <circle cx="23.7" cy="5.6" r="2.1" fill="currentColor" />
      <circle cx="27.5" cy="14.5" r="2.1" fill="currentColor" />
      <circle cx="23.6" cy="23" r="2.1" fill="currentColor" />
      <circle cx="15" cy="26.5" r="2.1" fill="currentColor" />
      <circle cx="6.4" cy="23" r="2.1" fill="currentColor" />
      <circle cx="2.5" cy="14.5" r="2.1" fill="currentColor" />
      <circle cx="6.3" cy="5.7" r="2.1" fill="currentColor" />
    </motion.svg>
  );
}

function ItemDots({ count }: { readonly count: 2 | 4 }) {
  return (
    <span
      className={`grid shrink-0 grid-cols-2 gap-[3px] ${count === 2 ? "grid-rows-1" : "grid-rows-2"}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="h-1 w-1 rounded-full bg-[#edecec]" />
      ))}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.25" width="9.5" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m11 6.2 3.5-1.7v7L11 9.8V6.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ direction = "down" }: { readonly direction?: "down" | "left" | "right" }) {
  const rotate = direction === "left" ? 90 : direction === "right" ? -90 : 0;
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3"
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      aria-hidden="true"
    >
      <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavigationPanel({
  onPitchDeck,
  onSchedule,
}: {
  readonly onPitchDeck?: () => void;
  readonly onSchedule: () => void;
}) {
  return (
    <motion.div
      key="navigation"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease }}
      className="pt-6"
    >
      <div className="h-[284px] w-full">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            type="button"
            className={`mx-7 flex h-[57px] w-[calc(100%-56px)] items-center justify-between border-[#3a3f42] text-2xl transition-colors hover:text-[#ff7a55] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#edecec] ${
              index < menuItems.length - 1 ? "border-b" : ""
            }`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ delay: 0.06 + index * 0.035, duration: 0.26, ease }}
          >
            <span>{item.label}</span>
            {item.dots ? <ItemDots count={item.dots} /> : null}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="flex flex-col gap-[10px] px-5 pb-6 pt-5 text-[13px] font-medium uppercase"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ delay: 0.2, duration: 0.28, ease }}
      >
        <button
          type="button"
          onClick={onPitchDeck}
          className="flex h-[62px] w-full items-center justify-center rounded-lg border border-[#3a3a3a] transition-colors hover:border-[#edecec]/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#edecec]"
        >
          Our Pitchdeck
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="flex h-[62px] w-full items-center justify-center rounded-lg bg-[#f0ebe0] text-xs text-[#23282b] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#edecec]"
        >
          Schedule a call
        </button>
      </motion.div>
    </motion.div>
  );
}

function SchedulePanel() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const times = is24Hour ? ["22:30", "23:00"] : ["10:30pm", "11:00pm"];

  return (
    <motion.div
      key="schedule"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.3, ease }}
      className="flex flex-col gap-[18px] px-5 pb-6 pt-8 text-white"
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[22px] font-semibold leading-[1.5]">SenSieLas Introduction</h2>
        <p className="text-[13px] leading-[1.5] text-[#aaa]">
          30-minute intro call to figure out if Off/Menu is the right fit.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 text-sm text-[#ccc]">
        <div className="flex items-start gap-2.5">
          <span className="flex flex-1 items-center gap-2.5"><ClockIcon /> 25m</span>
          <span className="flex items-center gap-2.5"><VideoIcon /> Organizer&apos;s default app</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ClockIcon />
          <span className="flex items-center gap-1">Asia/Colombo <Chevron /></span>
        </div>
      </div>

      <div className="h-px w-full bg-[#3a3f42]" />

      <div className="flex flex-col gap-3 text-[13px]">
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">September</span>
            <span className="text-[#aaa]">2026</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#333739] transition-colors hover:bg-[#44494c]" aria-label="Previous month">
              <Chevron direction="left" />
            </button>
            <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#333739] transition-colors hover:bg-[#44494c]" aria-label="Next month">
              <Chevron direction="right" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-x-[clamp(2px,2.8vw,11px)] text-center text-[11px] font-medium text-[#888]">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-x-[clamp(2px,2.8vw,11px)] gap-y-0">
          {calendarDays.map((day, index) => {
            if (day === null) return <span key={`empty-${index}`} className="h-9" aria-hidden="true" />;
            const isSelected = day === selectedDay;
            const isAvailable = day === 10 || day === 11;
            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  setSelectedTime(null);
                }}
                className={`flex h-9 min-w-0 items-center justify-center rounded-[20px] text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${
                  isSelected
                    ? "bg-white font-bold text-[#23282b]"
                    : isAvailable
                      ? "bg-[#4a5056] text-white hover:bg-[#596067]"
                      : "text-white hover:bg-white/10"
                }`}
                aria-pressed={isSelected}
                aria-label={`September ${day}, 2026`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {selectedDay !== null ? (
          <motion.div
            key="time-picker"
            initial={{ height: 0, opacity: 0, y: 8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 6 }}
            transition={{
              height: { type: "spring", bounce: 0.04, duration: 0.5 },
              opacity: { duration: 0.24, delay: 0.06 },
              y: { duration: 0.3, ease },
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-[18px]">
              <div className="h-px w-full bg-[#3a3f42]" />

              <div className="flex flex-col gap-3 pb-[18px] text-base">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold">
                      {weekdays[(selectedDay + 1) % weekdays.length]}
                    </span>
                    <span className="text-[11px] font-medium text-[#888]">
                      {ordinal(selectedDay)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 rounded-[20px] bg-[#333739] p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setIs24Hour(false);
                setSelectedTime(null);
              }}
              className={`rounded-2xl px-2.5 py-1 transition-colors ${!is24Hour ? "bg-[#555] text-white" : "text-[#888] hover:text-white"}`}
              aria-pressed={!is24Hour}
            >
              12h
            </button>
            <button
              type="button"
              onClick={() => {
                setIs24Hour(true);
                setSelectedTime(null);
              }}
              className={`rounded-2xl px-2.5 py-1 transition-colors ${is24Hour ? "bg-[#555] text-white" : "text-[#888] hover:text-white"}`}
              aria-pressed={is24Hour}
            >
              24h
            </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-[15px]">
                  {times.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`flex h-11 w-full items-center justify-center rounded-[22px] border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                          isSelected
                            ? "border-white bg-white font-medium text-[#23282b]"
                            : "border-[#3a3f42] bg-[#2e3336] text-white hover:border-[#777] hover:bg-[#363c40]"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MenuButton({
  isOpen,
  onOpenChange,
  onPitchDeck,
}: MenuButtonProps) {
  const [panelMode, setPanelMode] = useState<PanelMode>("menu");
  const [logoAnimationCycle, setLogoAnimationCycle] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const playLogoAnimation = () => {
    if (!shouldReduceMotion) {
      setLogoAnimationCycle((cycle) => cycle + 1);
    }
  };

  const handleHeaderClick = () => {
    if (!isOpen) {
      setPanelMode("menu");
      onOpenChange(true);
      return;
    }

    if (panelMode === "schedule") {
      setPanelMode("menu");
      return;
    }

    onOpenChange(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelMode("menu");
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onOpenChange]);

  const headerLabel = !isOpen || panelMode === "schedule"
    ? "Schedule a Calll"
    : "No Awkward Talk";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        layout: { type: "spring", bounce: 0.08, duration: 0.6 },
        opacity: { duration: 0.3 },
        y: { duration: 0.5, ease },
        scale: { duration: 0.5, ease },
      }}
      onPointerEnter={playLogoAnimation}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          playLogoAnimation();
        }
      }}
      onClickCapture={playLogoAnimation}
      className="pitch-deck-scrollbar max-h-[calc(100dvh-32px)] w-full overflow-y-auto overflow-x-hidden rounded-[32px] bg-[#23282b] text-left text-[#edecec] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      style={{ fontFamily: tokens.typography.font.family.title }}
    >
      <motion.button
        layout="position"
        type="button"
        onClick={handleHeaderClick}
        className="sticky top-0 z-10 flex h-[60px] w-full cursor-pointer items-center gap-5 overflow-hidden rounded-[32px] bg-[#23282b] py-1 pl-1 pr-[14px]"
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.45 }}
        aria-expanded={isOpen}
        aria-controls="primary-menu-panel"
        aria-label={panelMode === "schedule" ? "Back to navigation menu" : isOpen ? "Close navigation menu" : "Open navigation menu"}
        title={panelMode === "schedule" ? "Back to navigation menu" : isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <BrandMark animationCycle={logoAnimationCycle} />

        <span className={`relative flex h-6 items-center overflow-hidden text-base leading-[1.5] tracking-[-0.01em] ${panelMode === "schedule" && isOpen ? "ml-auto flex-none" : "flex-1 justify-center"}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={headerLabel}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.22, ease }}
              className="whitespace-nowrap"
            >
              {headerLabel}
            </motion.span>
          </AnimatePresence>
        </span>

        {panelMode !== "schedule" || !isOpen ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="minus"
                  className="h-0.5 w-6 bg-[#edecec]"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.25, ease }}
                />
              ) : (
                <DotSpinner key="dots" />
              )}
            </AnimatePresence>
          </span>
        ) : null}
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="primary-menu-panel"
            key="menu-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: "spring", bounce: 0.06, duration: 0.6 },
              opacity: { duration: 0.22, delay: 0.06 },
            }}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {panelMode === "menu" ? (
                <NavigationPanel
                  key="navigation-panel"
                  onPitchDeck={onPitchDeck}
                  onSchedule={() => setPanelMode("schedule")}
                />
              ) : (
                <SchedulePanel key="schedule-panel" />
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
