"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DECK_IMAGE = "/images/backgrounds/hero-bg.png";

const slides = [
  {
    title: "Introduction",
    eyebrow: "Abishek Jayathilaka",
    headline: "Clear digital experiences for complex ideas.",
    body: "I combine product thinking, interface design and implementation to create digital experiences that feel focused, useful and memorable.",
    items: [
      { label: "Focus", value: "Product design" },
      { label: "Craft", value: "Web experiences" },
      { label: "Approach", value: "Strategy to delivery" },
    ],
  },
  {
    title: "The challenge",
    eyebrow: "Why the work matters",
    headline: "Disconnected decisions create disconnected experiences.",
    body: "When strategy, content, design and technology are treated separately, people feel the gaps. The work starts by creating one clear direction.",
    items: [
      { label: "01", value: "Unclear positioning" },
      { label: "02", value: "Fragmented journeys" },
      { label: "03", value: "Inconsistent interfaces" },
      { label: "04", value: "Hidden next steps" },
    ],
  },
  {
    title: "Positioning",
    eyebrow: "One connected system",
    headline: "Strategy, design and technology—shaped together.",
    body: "I translate business goals and user needs into a coherent system: the right message, the right interaction and a build that preserves the intent.",
    items: [
      { label: "Clarify", value: "Define the real problem" },
      { label: "Connect", value: "Align the complete journey" },
      { label: "Create", value: "Design a distinct experience" },
      { label: "Deliver", value: "Turn direction into reality" },
    ],
  },
  {
    title: "Capabilities",
    eyebrow: "What I bring",
    headline: "A focused capability set, built around the experience.",
    body: "Each capability supports the same goal: helping people understand what matters, feel confident and take the next step.",
    items: [
      { label: "Strategy", value: "Positioning & product direction" },
      { label: "Experience", value: "UX, flows & information architecture" },
      { label: "Interface", value: "Visual systems & interaction design" },
      { label: "Delivery", value: "Prototyping & front-end implementation" },
    ],
  },
  {
    title: "Process",
    eyebrow: "How I work",
    headline: "Understand deeply. Make deliberately. Improve continuously.",
    body: "The process stays collaborative and visible, with decisions connected to the problem instead of personal preference.",
    items: [
      { label: "01 / Discover", value: "Context, users and constraints" },
      { label: "02 / Define", value: "Priorities and experience direction" },
      { label: "03 / Design", value: "Flows, systems and interfaces" },
      { label: "04 / Deliver", value: "Prototype, build and refine" },
    ],
  },
  {
    title: "FORM Charleston",
    eyebrow: "Featured work / 01",
    headline: "From discovering the studio to booking a first class.",
    body: "A fitness and wellness website connecting FORM's studio identity with first-visit guidance, two locations and a clear handoff into booking.",
    items: [
      { label: "Client", value: "FORM Charleston" },
      { label: "Sector", value: "Lagree fitness" },
      { label: "Scope", value: "Eight core routes" },
      { label: "Platform", value: "Mariana Tek booking" },
    ],
    primaryCta: { label: "View case study", href: "/work/form-charleston" },
    secondaryCta: { label: "Visit live website", href: "https://www.formcharleston.com/", external: true },
  },
  {
    title: "Selected work",
    eyebrow: "A wider view",
    headline: "Different industries. One focus: make the next step clear.",
    body: "Across consumer, healthcare and complex product experiences, the work is shaped around clarity, confidence and thoughtful interaction.",
    items: [
      { label: "02 / Blueshield", value: "Clearer healthcare decisions" },
      { label: "03 / Cryptolabs OTC", value: "Trust in high-stakes workflows" },
      { label: "04 / Activate Camera", value: "Guided camera interactions" },
    ],
  },
  {
    title: "Why work with me",
    eyebrow: "A hands-on partner",
    headline: "Clear thinking, careful craft and direct collaboration.",
    body: "I stay close to the problem and the details, helping maintain continuity from early direction through the final experience.",
    items: [
      { label: "01", value: "Strategy and execution together" },
      { label: "02", value: "Design decisions explained clearly" },
      { label: "03", value: "Responsive and accessible thinking" },
      { label: "04", value: "A practical path to implementation" },
    ],
  },
  {
    title: "Engagements",
    eyebrow: "Ways to work together",
    headline: "Flexible scope. One considered standard of work.",
    body: "Engagements can begin with a focused problem or cover a complete digital experience, depending on where the greatest value can be created.",
    items: [
      { label: "Product", value: "New experience or redesign" },
      { label: "Website", value: "Strategy, design and build" },
      { label: "Foundation", value: "UX audit or design system" },
      { label: "Partnership", value: "Ongoing product design support" },
    ],
  },
  {
    title: "Let's talk",
    eyebrow: "Start something meaningful",
    headline: "Let's create something clear, useful and memorable.",
    body: "If you have a product, service or digital experience that needs sharper direction, I would be glad to explore it with you.",
    primaryCta: { label: "Start a conversation", href: "/contact" },
    secondaryCta: { label: "Return home", href: "/" },
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
  const slideTotal = String(slides.length).padStart(2, "0");

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
          className="fixed inset-0 z-[9999] flex h-[var(--viewport-height)] w-screen overflow-hidden bg-[#080808] text-[#f1f0ea]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pitch-deck-title"
        >
          <motion.aside
            className="pitch-deck-scrollbar relative z-30 flex h-full w-[clamp(5.25rem,12vw,11.125rem)] shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-black/80 backdrop-blur-md"
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
                  className={`group relative flex min-h-[clamp(4.25rem,5.2vw,4.875rem)] w-full shrink-0 items-center gap-[var(--space-xs)] border-b border-white/10 px-[var(--space-xs)] text-left transition-colors duration-300 ${
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
              <span className="hidden md:block">[ Capability deck · {slideNumber} / {slideTotal} ]</span>
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
                className="pitch-deck-scrollbar relative z-10 flex h-full flex-col overflow-y-auto px-[var(--container-x)] pb-[var(--space-md)] pt-[clamp(6rem,11dvh,8rem)]"
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

                <div className="mt-auto grid items-end gap-6 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,500px)]">
                  <div>
                    {"items" in active && active.items ? (
                      <ul className="grid gap-2 sm:grid-cols-2" aria-label={`${active.title} details`}>
                        {active.items.map((item) => (
                          <li key={`${item.label}-${item.value}`} className="min-h-[76px] border border-white/15 bg-black/20 p-3 backdrop-blur-sm sm:p-4">
                            <span className="block font-mono text-[8px] uppercase tracking-[0.09em] text-[#ff805d] sm:text-[9px]">{item.label}</span>
                            <span className="mt-2 block text-[13px] font-medium leading-[1.2] tracking-[-0.02em] text-white/90 sm:text-[15px]">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-white/45 lg:block">
                        <span className="text-[#ff5f33]">●</span> {slideNumber} — {active.title}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="max-w-[500px] text-[clamp(1rem,1.55vw,1.45rem)] font-medium leading-[1.16] tracking-[-0.03em] text-white/90">
                      {active.body}
                    </p>
                    {("primaryCta" in active && active.primaryCta) || ("secondaryCta" in active && active.secondaryCta) ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {"primaryCta" in active && active.primaryCta ? (
                          <Link href={active.primaryCta.href} onClick={onClose} className="inline-flex min-h-11 items-center justify-center bg-[#f1f0ea] px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#171717] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                            {active.primaryCta.label}<span className="ml-4" aria-hidden="true">↗</span>
                          </Link>
                        ) : null}
                        {"secondaryCta" in active && active.secondaryCta ? (
                          <a href={active.secondaryCta.href} onClick={"external" in active.secondaryCta && active.secondaryCta.external ? undefined : onClose} target={"external" in active.secondaryCta && active.secondaryCta.external ? "_blank" : undefined} rel={"external" in active.secondaryCta && active.secondaryCta.external ? "noopener noreferrer" : undefined} className="inline-flex min-h-11 items-center justify-center border border-white/30 px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                            {active.secondaryCta.label}<span className="ml-4" aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="mt-6 flex items-center justify-between border-t border-white/25 pt-3 font-mono text-[9px] uppercase tracking-[0.08em] text-white/60 sm:text-[10px]">
                      <span>{slideNumber} / {slideTotal}</span>
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
            <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10" aria-hidden="true">
              <motion.div
                className="h-full bg-[#ff5f33]"
                animate={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </main>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
