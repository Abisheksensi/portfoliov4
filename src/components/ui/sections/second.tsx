"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import WhatIDo from "./whatIDo";

export type SecondSectionHandle = {
  playScan: () => void;
  playSecondScan: () => void;
  playCardScan: () => void;
  getFirstTextEl: () => HTMLDivElement | null;
  getSecondTextEl: () => HTMLDivElement | null;
  getCardStageEl: () => HTMLDivElement | null;
};

const SecondSection = forwardRef<SecondSectionHandle>((_, ref) => {
  const firstScanRef = useRef<HTMLDivElement>(null);
  const secondScanRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
    getFirstTextEl: () => firstScanRef.current,
    getSecondTextEl: () => secondScanRef.current,
    getCardStageEl: () => cardRef.current,
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
                opacity: 0,
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
            className="absolute inset-0 z-20 flex justify-start"
            style={
              {
                opacity: 0,
                "--scan-x": "-20%",
                "--scan-color": "#24282b",
              } as React.CSSProperties
            }
          >
            <div className="flex p-[6px] gap-[4px] w-full max-w-[850px] h-full">
              {/* Left Column */}
              <div className="flex flex-col flex-1 gap-[4px] h-full min-h-0">
                <WhatIDo className="what-i-do-left rounded-tl-[20px]" />
                <WhatIDo className="what-i-do-left rounded-bl-[20px]" />
              </div>
              {/* Right Column */}
              <div className="flex flex-col flex-1 gap-[4px] h-full min-h-0">
                <WhatIDo className="what-i-do-right" />
                <WhatIDo className="what-i-do-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

SecondSection.displayName = "SecondSection";
export default SecondSection;
