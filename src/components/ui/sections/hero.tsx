"use client";

import HeroNoiseCanvas from "./heroNoiseCanvas";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/backgrounds/hero-bg.png')",
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/5" />
      <HeroNoiseCanvas />

      <div className="relative z-10 w-full flex flex-col p-3">
        <div className="w-full flex justify-between mb-[6px]">
          <div className="inline-flex flex-col gap-2 items-start">
            <div className="text-white text-[112px] font-bold font-['Neue_Haas_Grotesk_Display_Pro'] leading-none">
              YOUR DIGITAL
            </div>
            <div className="inline-flex items-start gap-1 -mt-8">
              <div className="text-white text-[112px] font-bold font-['Neue_Haas_Grotesk_Display_Pro'] leading-none">
                PARTNER
              </div>
              {/* Fixed: removed h-8 so ® isn't clipped by text-6xl */}
              <div className="text-white text-6xl font-medium font-['Neue_Haas_Grotesk_Display_Pro']">
                ®
              </div>
            </div>
            {/* Fixed: removed hardcoded h-[88px] and flex-col to prevent text clipping */}
            <div className="w-[690px] text-white text-lg font-bold font-['Neue_Haas_Grotesk_Display_Pro'] leading-none">
              I help private healthcare practices and clinics attract more
              patients, increase revenue, and build digital systems that work
              strategy, design, marketing, and AI as one integrated engine.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
