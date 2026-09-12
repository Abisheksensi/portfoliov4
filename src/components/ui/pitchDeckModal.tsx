"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DECK_IMAGE = "/images/backgrounds/hero-bg.png";

const slides = [
  {
    title: "Welcome",
    eyebrow: "Your digital partner",
    headline: "Digital growth, designed as one system.",
    body: "Strategy, design, marketing and AI working together to turn attention into trust, and trust into sustainable growth.",
  },
  {
    title: "Who we are",
    eyebrow: "Independent by design",
    headline: "Small team energy. Senior-level thinking.",
    body: "A hands-on digital partner for ambitious healthcare practices that want sharper positioning, stronger patient journeys and measurable momentum.",
  },
  {
    title: "What we do",
    eyebrow: "One connected engine",
    headline: "From first impression to booked appointment.",
    body: "Brand strategy, high-converting websites, local search, patient acquisition and intelligent automation—built to perform together.",
  },
  {
    title: "Our vibe",
    eyebrow: "Clear over clever",
    headline: "Serious about results. Easy to work with.",
    body: "Direct communication, thoughtful craft and a bias toward action. No theatre, no hand-offs, no strategy decks that gather dust.",
  },
  {
    title: "Core values",
    eyebrow: "How the work gets done",
    headline: "Clarity. Craft. Curiosity. Commitment.",
    body: "Every decision earns its place. Every detail supports the bigger goal. Every engagement is treated like a partnership, not a transaction.",
  },
  {
    title: "What we believe",
    eyebrow: "The operating principle",
    headline: "Disconnected strategies create disconnected results.",
    body: "The strongest digital experiences align what a practice says, how it feels and how easily a patient can take the next step.",
  },
  {
    title: "The work",
    eyebrow: "Built for momentum",
    headline: "Useful ideas, made beautifully—and made to work.",
    body: "The work balances brand distinction with commercial performance, creating digital systems that are memorable, practical and ready to scale.",
  },
  {
    title: "Awards",
    eyebrow: "The real measure",
    headline: "Recognition is good. Real-world impact is better.",
    body: "The aim is not decoration. It is better patient experiences, healthier acquisition costs and digital foundations that keep creating value.",
  },
  {
    title: "Clients",
    eyebrow: "Built around trust",
    headline: "For teams ready to lead their category.",
    body: "Best suited to ambitious clinics, healthcare founders and private practices that value strategy, move decisively and care about the details.",
  },
  {
    title: "Let's talk",
    eyebrow: "Start something meaningful",
    headline: "Have a challenge worth going all in on?",
    body: "Let’s turn it into a clearer position, a stronger experience and a connected growth system built for what comes next.",
  },
] as const;

const backgroundPositions = [
  "62% 60%",
  "72% 62%",
  "52% 68%",
  "78% 70%",
  "42% 62%",
  "68% 78%",
  "58% 72%",
  "82% 68%",
  "48% 74%",
  "70% 64%",
] as const;

interface PitchDeckModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function PitchDeckModal({
  isOpen,
  onClose,
}: PitchDeckModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const active = slides[activeSlide];
  const slideNumber = useMemo(
    () => String(activeSlide + 1).padStart(2, "0"),
    [activeSlide]
  );

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
        );
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }

      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSlide((current) => (current + 1) % slides.length);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSlide(
          (current) => (current - 1 + slides.length) % slides.length
        );
      }

      if (event.key === "Home") {
        event.preventDefault();
        setActiveSlide(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setActiveSlide(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    slideRefs.current[activeSlide]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeSlide, isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen overflow-hidden bg-[#080808] text-[#f1f0ea]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pitch-deck-title"
        >
          <motion.aside
            className="pitch-deck-scrollbar relative z-30 flex h-full w-[92px] shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-black/80 backdrop-blur-md sm:w-[178px]"
            initial={{ x: -32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -32, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Pitch deck slides"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeSlide;
              return (
                <button
                  key={slide.title}
                  ref={(node) => {
                    slideRefs.current[index] = node;
                  }}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`group relative flex min-h-[68px] w-full shrink-0 items-center gap-2 border-b border-white/10 px-2 text-left transition-colors duration-300 sm:min-h-[78px] sm:gap-3 sm:px-3 ${
                    isActive
                      ? "bg-[#e8e6df] text-[#11110f]"
                      : "bg-white/[0.025] text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                >
                  <span
                    className={`h-8 w-8 shrink-0 bg-cover bg-center grayscale transition-all duration-300 sm:h-9 sm:w-9 ${
                      isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    }`}
                    style={{
                      backgroundImage: `url('${DECK_IMAGE}')`,
                      backgroundPosition: backgroundPositions[index],
                    }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[8px] font-medium uppercase leading-[1.15] tracking-[-0.03em] sm:text-[10px]">
                    {slide.title}
                  </span>
                  {isActive ? (
                    <motion.span
                      layoutId="active-slide-marker"
                      className="absolute bottom-0 left-0 top-0 w-[2px] bg-[#ff5f33]"
                    />
                  ) : null}
                </button>
              );
            })}
          </motion.aside>

          <main
            className="relative min-w-0 flex-1 overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url('${DECK_IMAGE}')`,
              backgroundPosition: backgroundPositions[activeSlide],
            }}
          >
            <div className="absolute inset-0 bg-[#080808]/45 grayscale" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,transparent_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.8)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.05)_34%,rgba(0,0,0,0.75)_100%)]" />
            <div className="pitch-deck-grain absolute inset-0 opacity-30 mix-blend-soft-light" />

            <div className="absolute left-4 right-20 top-5 z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.08em] text-white/55 sm:left-8 sm:right-28 sm:top-7 sm:text-[10px]">
              <span>AB / Portfolio</span>
              <span className="hidden md:block">[ Pitch deck · {slideNumber} / 10 ]</span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/15 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-7 sm:top-7 sm:h-14 sm:w-14"
              aria-label="Close pitch deck"
              title="Close pitch deck"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M5 5 19 19M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              <motion.section
                key={activeSlide}
                className="relative z-10 flex h-full flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 md:px-[6vw] md:pb-10 md:pt-[13vh]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="max-w-[1120px]">
                  <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.09em] text-white/75 sm:mb-6 sm:text-[11px]">
                    [ {active.eyebrow} ]
                  </p>
                  <h1
                    id="pitch-deck-title"
                    className="max-w-[1050px] font-sans text-[clamp(2.65rem,7.35vw,7.6rem)] font-bold uppercase leading-[0.82] tracking-[-0.065em] text-[#efeee9]"
                  >
                    {active.headline}
                  </h1>
                </div>

                <div className="mt-auto grid items-end gap-6 md:grid-cols-[1fr_minmax(280px,500px)]">
                  <div className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-white/45 md:block">
                    <span className="text-[#ff5f33]">●</span> {slideNumber} — {active.title}
                  </div>
                  <div>
                    <p className="max-w-[500px] text-[clamp(1rem,1.55vw,1.45rem)] font-medium leading-[1.16] tracking-[-0.03em] text-white/90">
                      {active.body}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/25 pt-3 font-mono text-[9px] uppercase tracking-[0.08em] text-white/60 sm:text-[10px]">
                      <span>{slideNumber} / 10</span>
                      <div className="flex gap-5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSlide(
                              (current) =>
                                (current - 1 + slides.length) % slides.length
                            )
                          }
                          className="transition-colors hover:text-white focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
                          aria-label="Previous slide"
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSlide((current) => (current + 1) % slides.length)
                          }
                          className="transition-colors hover:text-white focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
                          aria-label="Next slide"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </AnimatePresence>
          </main>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
