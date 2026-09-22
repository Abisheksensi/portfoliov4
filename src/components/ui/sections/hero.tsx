"use client";

import HeroNoiseCanvas from "./heroNoiseCanvas";

export default function Hero() {
  return (
    <section
      className="relative min-h-[var(--viewport-height)] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/backgrounds/hero-bg.png')",
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/5" />
      <HeroNoiseCanvas />

      <div className="absolute inset-0 z-10 flex items-end p-[var(--container-x)]">
        <div
          className="flex w-full max-w-[58.75rem] flex-col items-start text-white"
          style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}
        >
          <h1 className="m-0 flex flex-col text-[length:var(--font-display)] font-bold uppercase leading-[0.8] tracking-[-0.065em]">
            <span>YOUR DIGITAL</span>
            <span className="flex items-start">
              <span>PARTNER</span>
              <sup className="ml-2 mt-1 text-[0.32em] font-medium leading-none tracking-normal sm:mt-2">
                ®
              </sup>
            </span>
          </h1>
          <p className="mb-0 mt-[var(--space-sm)] max-w-[min(43.125rem,90vw)] text-[length:var(--font-body)] font-semibold leading-[1.2] tracking-[-0.025em]">
            I help private healthcare practices and clinics attract more
            patients, increase revenue, and build digital systems that work
            strategy, design, marketing, and AI as one integrated engine.
          </p>
        </div>
      </div>
    </section>
  );
}
