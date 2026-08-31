"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./hero";
import SecondSection, { SecondSectionHandle } from "./second";

gsap.registerPlugin(ScrollTrigger);

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

      if (!firstTextEl || !secondTextEl || !cardStageEl) {
        return;
      }

      gsap.set(firstTextEl, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
      gsap.set(secondTextEl, { autoAlpha: 0, y: 40, filter: "blur(8px)" });
      gsap.set(cardStageEl, { autoAlpha: 1 });
      gsap.set(".what-i-do-left", { autoAlpha: 0, x: -60, scale: 0.95 });
      gsap.set(".what-i-do-right", { autoAlpha: 0, x: -60, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=450%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 0.5 },
            delay: 0.05,
            ease: "power2.out",
          },
        },
      });

      /* ─── State 0: Hero ─── */
      tl.addLabel("hero", 0);

      /* ─── Phase 1: Hero shrinks & blurs ─── */
      tl.to(heroWrapRef.current, {
        borderRadius: "16px",
        padding: "10px",
        duration: 0.35,
        ease: "none",
      });

      tl.to(
        heroInnerRef.current,
        {
          borderRadius: "16px",
          duration: 0.5,
          ease: "none",
        },
        "<"
      );

      tl.to(
        heroInnerRef.current,
        {
          filter: "blur(80px)",
          opacity: 0,
          scale: 0.98,
          duration: 0.35,
          ease: "none",
        },
        "-=0.05"
      );

      /* ─── Trigger scan on first text once hero reveals it ─── */
      tl.call(() => {
        secondSectionRef.current?.playScan();
      }, undefined, 0.5);

      /* ─── State 1: First Text ─── */
      tl.addLabel("firstText", 0.9);

      /* ─── Phase 2: Fluid morph/crossfade between First Text & Second Text ─── */
      tl.to(
        firstTextEl,
        {
          autoAlpha: 0,
          y: -40,
          filter: "blur(8px)",
          duration: 0.45,
          ease: "power2.inOut",
        },
        1.5
      );

      tl.to(
        secondTextEl,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.inOut",
        },
        1.6
      );

      tl.call(() => {
        secondSectionRef.current?.playSecondScan();
      }, undefined, 1.95);

      /* ─── State 2: Growth System Dwell ─── */
      tl.addLabel("growthSystem", 2.6);

      /* ─── Phase 3: Growth System cleanly exits completely BEFORE cards ─── */
      tl.to(
        secondTextEl,
        {
          autoAlpha: 0,
          y: -40,
          scale: 0.96,
          filter: "blur(12px)",
          duration: 0.35,
          ease: "power2.in",
        },
        3.3
      );

      /* ─── Phase 4: Cards Enter as unified cards (Surfaces + Numbers + Content together) ─── */
      tl.to(
        ".what-i-do-left",
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "power3.out",
        },
        3.7
      );

      tl.to(
        ".what-i-do-right",
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "power3.out",
        },
        4.1
      );

      /* ─── State 3: Cards Dwell ─── */
      tl.addLabel("cards", 4.7);

      /* ─── Phase 5: Hero wrapper fully fades ─── */
      tl.to(
        heroWrapRef.current,
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.05,
          ease: "none",
        },
        0.8
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white">
      <div className="h-[100dvh] w-full relative overflow-hidden p-[10px]">
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
