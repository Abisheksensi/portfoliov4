"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Hero from "./hero";
import SecondSection, { SecondSectionHandle } from "./second";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function HeroToSecondTransition() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<SecondSectionHandle>(null);
  const isSnapping = useRef(false);
  const snapForwardThreshold = 0.72;
  const snapBackwardThreshold = 0.28;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!containerRef.current || !heroWrapRef.current || !heroInnerRef.current) return;

    const ctx = gsap.context(() => {
      /* ─── CRITICAL: Hide second text immediately before timeline runs ─── */
      gsap.set(".second-second-text", { autoAlpha: 0, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1.2,
          onUpdate(self) {
            if (isSnapping.current) return;

            if (self.progress > snapForwardThreshold && self.direction > 0) {
              isSnapping.current = true;
              gsap.to(window, {
                scrollTo: { y: self.end },
                duration: 1.1,
                ease: "power2.inOut",
                overwrite: true,
                onComplete: () => {
                  isSnapping.current = false;
                },
              });
            } else if (self.progress < snapBackwardThreshold && self.direction < 0) {
              isSnapping.current = true;
              gsap.to(window, {
                scrollTo: { y: self.start },
                duration: 1.1,
                ease: "power2.inOut",
                overwrite: true,
                onComplete: () => {
                  isSnapping.current = false;
                },
              });
            }
          },
        },
      });

      /* ─── Phase 1: Hero shrinks ─── */
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

      /* ─── Trigger scan on first text early ─── */
      tl.call(() => {
        secondSectionRef.current?.playScan();
      }, undefined, 0.15);

      /* ─── Phase 2: Hero blurs ─── */
      tl.to(
        heroInnerRef.current,
        {
          filter: "blur(100px)",
          opacity: 0.,
          scale: 0.98,
          duration: 0.35,
          ease: "none",
        },
        "-=0.05"
      );

      /* ─── Phase 3: Text crossfade ─── */
      tl.fromTo(
        ".second-first-text",
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -24, duration: 0.35, ease: "power2.out" },
        2
      );

      tl.fromTo(
        ".second-second-text",
        { autoAlpha: 0, y: 56 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
        2
      );

      tl.call(() => {
        secondSectionRef.current?.playSecondScan();
      }, undefined, 2);

      /* ─── Phase 4: Hero fades away ─── */
      tl.to(
        heroWrapRef.current,
        {
          opacity: 0,
          duration: 0.05,
          ease: "none",
        },
        "-=0.05"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="h-[100dvh] w-full bg-white">
        <div className="h-full w-full p-[10px]">
          <div className="w-full h-full rounded-[16px] overflow-hidden bg-stone-300" />
        </div>
      </div>
    );
  }

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
