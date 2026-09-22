"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./hero";
import SecondSection, { SecondSectionHandle } from "./second";

gsap.registerPlugin(ScrollTrigger);

const PROFILE_STAGE_START = 9.45;
const PROFILE_PROJECT_COUNT = 4;
const PROFILE_STAGE_DWELL = 8;

export default function HeroToSecondTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<SecondSectionHandle>(null);
  
  useLayoutEffect(() => {
    if (!containerRef.current || !heroWrapRef.current || !heroInnerRef.current) return;

    const ctx = gsap.context(() => {
      const firstTextEl = secondSectionRef.current?.getFirstTextEl();
      const secondTextEl = secondSectionRef.current?.getSecondTextEl();
      const cardStageEl = secondSectionRef.current?.getCardStageEl();
      const cardBlockEl = secondSectionRef.current?.getCardBlockEl();
      const cardWrapperEl = secondSectionRef.current?.getCardWrapperEl();
      const cardHeadingEl = secondSectionRef.current?.getCardHeadingEl();
      const cardLineEl = secondSectionRef.current?.getCardLineEl();
      const profileStageEl = secondSectionRef.current?.getProfileStageEl();

      if (!firstTextEl || !secondTextEl || !cardStageEl || !cardBlockEl || !cardWrapperEl || !cardLineEl || !profileStageEl) {
        return;
      }

      gsap.set(firstTextEl, { opacity: 0, y: 30, "--scan-x": "-20%" });
      gsap.set(secondTextEl, { opacity: 0, y: 30, "--scan-x": "-20%" });
      // Card stage starts hidden — the scrubbed timeline reveals it at the right position
      // so scrolling BACKWARD hides it again, preventing text/card overlap
      gsap.set(cardStageEl, { autoAlpha: 0 });
      gsap.set(profileStageEl, { autoAlpha: 0, y: 30 });

      // Float UI: grab directly (fixed element lives outside containerRef scope)
      const floatUI = document.querySelector<HTMLElement>(".float-ui");
      let profileStageIsActive = false;
      let activeProjectIndex = 0;
      const updateProfileStage = (active: boolean, projectIndex = 0) => {
        if (
          profileStageIsActive === active &&
          (!active || activeProjectIndex === projectIndex)
        ) {
          return;
        }
        profileStageIsActive = active;
        activeProjectIndex = projectIndex;
        window.dispatchEvent(
          new CustomEvent("portfolio:profile-stage", {
            detail: { active, projectIndex },
          })
        );
      };

      // cardBlockEl stays at natural CSS size (p-[6px] padding preserved throughout)
      gsap.set(cardBlockEl, { clearProps: "all" });

      // cardWrapperEl IS the morphing white rectangle — lives INSIDE the padding
      // overflow:hidden clips all card content until the container is fully open
      gsap.set(cardWrapperEl, {
        width: 0,
        height: 4,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        transformOrigin: "top left",
        gap: 0,
      });
      // Column gaps start at 0
      gsap.set(".card-col", { gap: 0 });
      // Card surfaces always white — when backgroundColor becomes transparent they form one solid block
      gsap.set(".what-i-do-surface", { opacity: 1 });
      // Text hidden — slides up after the split
      gsap.set(".what-i-do-text", { opacity: 0, y: 24 });
      // cardLineEl not needed — hide it
      gsap.set(cardLineEl, { display: "none" });
      // Card heading hidden
      if (cardHeadingEl) gsap.set(cardHeadingEl, { opacity: 0, y: 60, "--scan-x": "-20%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1000%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const timelineDuration = tl.duration();
            const timelineTime = self.progress * timelineDuration;
            const isProfileActive = timelineTime >= PROFILE_STAGE_START;

            if (!isProfileActive) {
              updateProfileStage(false, 0);
              return;
            }

            const projectProgress = Math.min(
              0.999,
              Math.max(
                0,
                (timelineTime - PROFILE_STAGE_START) /
                  (timelineDuration - PROFILE_STAGE_START)
              )
            );
            const projectIndex = Math.min(
              PROFILE_PROJECT_COUNT - 1,
              Math.floor(projectProgress * PROFILE_PROJECT_COUNT)
            );

            updateProfileStage(true, projectIndex);
          },
          onLeaveBack: () => updateProfileStage(false),
        },
      });

      /* ─── Step 1: Hero shrinks & disappears ─── */
      tl.to(heroWrapRef.current, {
        borderRadius: "16px",
        padding: "10px",
        duration: 0.5,
        ease: "none",
      }, 0);

      tl.to(
        heroInnerRef.current,
        {
          borderRadius: "16px",
          duration: 0.5,
          ease: "none",
        },
        0
      );

      tl.to(
        heroInnerRef.current,
        {
          filter: "blur(80px)",
          opacity: 0,
          scale: 0.98,
          duration: 0.5,
          ease: "none",
        },
        0.5
      );

      tl.to(
        heroWrapRef.current,
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.1,
          ease: "none",
        },
        0.9
      );

      /* ─── Step 2: First Text (Entrance -> Automatic Scan -> Dwell -> Exit) ─── */
      // Entrance: First text slides up & fades in
      tl.to(
        firstTextEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        1.0
      );

      // Trigger automatic scan animation in real-time when text appears
      tl.call(
        () => {
          secondSectionRef.current?.playScan();
        },
        undefined,
        1.1
      );

      // Exit: First text glides up and fades out
      tl.to(
        firstTextEl,
        {
          opacity: 0,
          y: -40,
          duration: 0.8,
          ease: "power2.in",
        },
        3.2
      );

      /* ─── Step 3: Second Text / Growth System (Entrance -> Automatic Scan -> Dwell -> Exit) ─── */
      // Entrance: Second text slides up & fades in
      tl.to(
        secondTextEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        4.0
      );

      // Trigger automatic scan animation in real-time when text appears
      tl.call(
        () => {
          secondSectionRef.current?.playSecondScan();
        },
        undefined,
        4.1
      );

      // Exit: Second text glides up and fades out cleanly before cards
      tl.to(
        secondTextEl,
        {
          opacity: 0,
          y: -40,
          duration: 0.8,
          ease: "power2.in",
        },
        6.2
      );

      /* ─── Step 4: Card Entrance — real-time auto-play (not scrubbed) ─── */

      // Reveal card stage at position 7.0 — same moment tl.call fires, so no window for cards to
      // peek through. tl.set runs before tl.call at the same position → stage visible, width still 0.
      // Scrub-driven: scrolling backward past 7.0 hides it again instantly, no overlap with text.
      tl.set(cardStageEl, { autoAlpha: 1 }, 7.0);

      // Triggered once when scroll reaches 7.0, plays at full speed automatically
      tl.call(
        () => {
          // Kill any leftover card animation from a previous forward pass
          gsap.killTweensOf([cardWrapperEl, ".card-col", ".what-i-do-text"]);
          if (cardHeadingEl) gsap.killTweensOf(cardHeadingEl);

          // Reset card state to initial (handles re-entry after scrolling back)
          gsap.set(cardWrapperEl, { width: 0, height: 4, backgroundColor: "#ffffff", gap: 0 });
          gsap.set(".card-col", { gap: 0 });
          gsap.set(".what-i-do-text", { opacity: 0, y: 24 });
          if (cardHeadingEl) gsap.set(cardHeadingEl, { opacity: 0, y: 60, "--scan-x": "-20%" });

          // Hide float UI immediately
          if (floatUI) gsap.to(floatUI, { autoAlpha: 0, duration: 0.25, ease: "power2.out" });

          const cardTl = gsap.timeline({
            onComplete: () => {
              // Restore float UI once card animation finishes
              if (floatUI) gsap.to(floatUI, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
            },
          });

          // Phase 1: White 4px sliver expands WIDTH across the padded area
          cardTl.to(cardWrapperEl, {
            width: "100%",
            duration: 0.55,
            ease: "power3.inOut",
          });

          // Phase 2: Expands HEIGHT downward to fill the container
          cardTl.to(cardWrapperEl, {
            height: "100%",
            duration: 0.7,
            ease: "power3.inOut",
          });

          // Phase 3a: Background dissolves + gaps open simultaneously → one block splits into 4
          cardTl.to(
            cardWrapperEl,
            { backgroundColor: "rgba(0,0,0,0)", duration: 0.35, ease: "power2.out" },
            "split"
          );
          cardTl.to(cardWrapperEl, { gap: 4, duration: 0.45, ease: "power2.inOut" }, "split");
          cardTl.to(".card-col", { gap: 4, duration: 0.45, ease: "power2.inOut" }, "split");

          // Phase 3b: Card text slides up
          cardTl.to(".what-i-do-text", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.09,
            ease: "power3.out",
          });

          // Heading slides up then scan fires in real-time
          if (cardHeadingEl) {
            cardTl.to(
              cardHeadingEl,
              { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
              "-=0.35"
            );
            cardTl.call(() => secondSectionRef.current?.playHeadingScan());
          }
        },
        undefined,
        7.0
      );

      /* ─── Step 5: Profile overview — remains inside the same rounded stage ─── */
      tl.to(
        cardStageEl,
        {
          autoAlpha: 0,
          y: -36,
          duration: 0.7,
          ease: "power2.in",
        },
        9.0
      );

      tl.to(
        profileStageEl,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        PROFILE_STAGE_START
      );

      // Keep the profile scene pinned long enough for all four projects to
      // advance one-by-one as the visitor continues scrolling.
      tl.to(
        profileStageEl,
        { y: 0, duration: PROFILE_STAGE_DWELL, ease: "none" },
        PROFILE_STAGE_START + 0.8
      );

      return () => {
        updateProfileStage(false);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white">
      <div className="h-[var(--viewport-height)] w-full relative overflow-hidden p-[var(--space-page)]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SecondSection ref={secondSectionRef} />
        </div>
        <div
          ref={heroWrapRef}
          className="absolute overflow-hidden inset-0 z-10 h-full w-full"
          style={{ padding: 0 }}
        >
          <div
            ref={heroInnerRef}
            className="w-full h-full overflow-hidden"
            style={{ borderRadius: 0 }}
          >
            <Hero />
          </div>
        </div>
      </div>
    </div>
  );
}
