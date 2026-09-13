"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import WhatIDo from "./whatIDo";
import ProfileOverview from "./profileOverview";

export type SecondSectionHandle = {
  playScan: () => void;
  playSecondScan: () => void;
  playCardScan: () => void;
  playHeadingScan: () => void;
  getFirstTextEl: () => HTMLDivElement | null;
  getSecondTextEl: () => HTMLDivElement | null;
  getCardStageEl: () => HTMLDivElement | null;
  getCardBlockEl: () => HTMLDivElement | null;
  getCardWrapperEl: () => HTMLDivElement | null;
  getCardHeadingEl: () => HTMLDivElement | null;
  getCardLineEl: () => HTMLDivElement | null;
  getProfileStageEl: () => HTMLDivElement | null;
};

const SecondSection = forwardRef<SecondSectionHandle>((_, ref) => {
  const firstScanRef = useRef<HTMLDivElement>(null);
  const secondScanRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardBlockRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardHeadingRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const profileStageRef = useRef<HTMLDivElement>(null);

  const runScan = (target: HTMLDivElement | null) => {
    if (!target) return;

    gsap.fromTo(
      target,
      { "--scan-x": "-20%" },
      {
        "--scan-x": "125%",
        duration: 2.5,
        ease: "power2.out",
      }
    );
  };

  useImperativeHandle(ref, () => ({
    playScan: () => {
      runScan(firstScanRef.current);
    },
    playSecondScan: () => {
      runScan(secondScanRef.current);
    },
    playCardScan: () => {
      runScan(cardRef.current);
    },
    playHeadingScan: () => {
      runScan(cardHeadingRef.current);
    },
    getFirstTextEl: () => firstScanRef.current,
    getSecondTextEl: () => secondScanRef.current,
    getCardStageEl: () => cardRef.current,
    getCardBlockEl: () => cardBlockRef.current,
    getCardWrapperEl: () => cardWrapperRef.current,
    getCardHeadingEl: () => cardHeadingRef.current,
    getCardLineEl: () => cardLineRef.current,
    getProfileStageEl: () => profileStageRef.current,
  }));

  const scanTextStyle: React.CSSProperties = {
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    backgroundImage: `linear-gradient(
      90deg,
      var(--scan-color) 0%,
      var(--scan-color) calc(var(--scan-x) - 16%),
      #fc5d20 var(--scan-x),
      rgba(252, 93, 32, 0) calc(var(--scan-x) + 16%)
    )`,
    backgroundSize: "100% 100%",
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-cover bg-center bg-no-repeat">
      <div className="w-full h-screen p-2.5 flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch flex-1 relative bg-gradient-to-t from-[#C1C2C3] to-[#E5E6E7] rounded-[28px] overflow-hidden">
          
          {/* FIRST TEXT — fades out while scrolling */}
          <div
            ref={firstScanRef}
            className="second-first-text absolute inset-0 w-full h-full inline-flex flex-col justify-center items-center gap-8"
            style={
              {
                "--scan-x": "-20%",
                "--scan-color": "#24282b",
              } as React.CSSProperties
            }
          >
            <div className="justify-center self-center text-center">
              <span
                className="text-zinc-800 text-5xl font-medium font-['Neue_Haas_Grotesk_Display_Pro']"
                style={scanTextStyle}
              >
                Most healthcare practices manage <br />
                Web design, Marketing &amp; SEO{" "}
              </span>
              <span
                className="text-zinc-800 text-5xl font-semibold font-['Neue_Haas_Grotesk_Display_Pro']"
                style={scanTextStyle}
              >
                separately.
              </span>
            </div>
            <div
              className="self-stretch text-center justify-start text-zinc-800 text-5xl font-semibold font-['Neue_Haas_Grotesk_Display_Pro']"
              style={scanTextStyle}
            >
              Disconnected strategies lead to disconnected results.
            </div>
          </div>

          {/* SECOND TEXT — stage 2 */}
          <div
            ref={secondScanRef}
            className="absolute inset-0 z-10 inline-flex h-full w-full flex-col items-center justify-center px-6 py-16"
            style={
              {
                "--scan-x": "-20%",
                "--scan-color": "#24282b",
              } as React.CSSProperties
            }
          >
            <div
              className="text-center justify-start text-zinc-800 text-6xl font-medium font-['Neue_Haas_Grotesk_Display_Pro'] leading-[88px]"
              style={scanTextStyle}
            >
              I unify them into one
            </div>
            <div
              className="text-center justify-start text-zinc-800 text-8xl font-bold font-['Neue_Haas_Grotesk_Display_Pro'] leading-[88px]"
              style={scanTextStyle}
            >
              GROWTH SYSTEM.
            </div>
          </div>

          {/* CARD — stage 3 */}
          <div
            ref={cardRef}
            className="absolute inset-0 z-20 flex flex-row items-stretch justify-start"
            style={
              {
                opacity: 1,
                "--scan-x": "-20%",
                "--scan-color": "#24282b",
              } as React.CSSProperties
            }
          >
            {/* White sliding block — GSAP moves this in from left as one rectangle */}
            <div
              ref={cardBlockRef}
              className="relative flex p-[6px] w-full max-w-[850px] h-full overflow-hidden"
              style={{ gap: 0 }}
            >
            {/* White morph line — animates width then height, fades to reveal cards */}
            <div
              ref={cardLineRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 0,
                height: 4,
                background: "white",
                zIndex: 50,
                pointerEvents: "none",
              }}
            />
            {/* Wrapper row — gap animates from 0 → 4px to split columns */}
              <div
                ref={cardWrapperRef}
                className="flex w-full h-full"
                style={{ gap: 0 }}
              >
                {/* Left Column */}
                <div className="card-col flex flex-col flex-1 h-full min-h-0" style={{ gap: 0 }}>
                  <WhatIDo
                    title="Strategy & Positioning"
                    description="Aligning practice branding, acquisition funnels, and market positioning into one integrated growth engine."
                    className="what-i-do-left rounded-tl-[20px]"
                  />
                  <WhatIDo
                    title="Web Design & UX"
                    description="High-converting, mobile-first practice websites crafted for patient trust, rapid speeds, and seamless booking."
                    className="what-i-do-left rounded-bl-[20px]"
                  />
                </div>
                {/* Right Column */}
                <div className="card-col flex flex-col flex-1 h-full min-h-0" style={{ gap: 0 }}>
                  <WhatIDo
                    title="SEO & Patient Growth"
                    description="Dominating local medical searches and high-intent keywords to consistently drive new patient inquiries."
                    videoSrc="/videos/compass.mp4"
                    videoFit="cover"
                    videoRenderScale={0.76}
                    videoOffsetYRatio={0.1}
                    videoStartDelayMs={100}
                    className="what-i-do-right"
                  />
                  <WhatIDo
                    title="AI & Automation"
                    description="Automating intake workflows, lead follow-ups, and patient communication using smart custom AI systems."
                    className="what-i-do-right"
                  />
                </div>
              </div>
            </div>

            {/* Right area heading — reveals with scan + clip slide-up */}
            <div
              className="flex flex-1 items-center justify-center px-8"
              style={{ overflow: "hidden" }}
            >
              <div
                ref={cardHeadingRef}
                className="flex flex-col gap-3 text-left"
                style={{
                  "--scan-x": "-20%",
                  "--scan-color": "#24282b",
                  transform: "translateY(60px)",
                  opacity: 0,
                } as React.CSSProperties}
              >
                <div
                  className="text-zinc-800 text-4xl font-medium font-['Neue_Haas_Grotesk_Display_Pro'] leading-tight"
                  style={scanTextStyle}
                >
                  This is the heading
                </div>
                <div
                  className="text-zinc-800 text-6xl font-bold font-['Neue_Haas_Grotesk_Display_Pro'] leading-tight"
                  style={scanTextStyle}
                >
                  to the cards.
                </div>
              </div>
            </div>
          </div>

          {/* PROFILE — final stage inside the shared rounded container */}
          <div
            ref={profileStageRef}
            className="absolute inset-0 z-30"
            style={{ opacity: 0, visibility: "hidden", transform: "translateY(30px)" }}
          >
            <ProfileOverview />
          </div>
        </div>
      </div>
    </section>
  );
});

SecondSection.displayName = "SecondSection";
export default SecondSection;
