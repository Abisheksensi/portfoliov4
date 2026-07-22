'use client';

import MenuButton from "../buttons/menuButton";
import VideoButton from "../buttons/videoButton";
import CTAButton from "../buttons/ctaButton";
import { motion } from "framer-motion";
import { headingEntrance } from "../../../motions/typography/entrance";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/backgrounds/hero-bg.png')",
      }}
    >
      <div className="absolute inset-0 " />

      <div className="relative z-10 w-full flex flex-col p-3">
        <div className="w-full flex justify-end mb-[6px]">
          <div className="w-[193px] flex flex-col gap-[6px]">
            <MenuButton />
            <VideoButton />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <motion.h1
            {...headingEntrance.h1.reveal}
            className="w-[500px] text-stone-950 text-6xl font-medium font-['Outfit'] leading-[48px] headline-shimmer"
            data-text="A creative digital agency that goes all in or not at all."
          >
            A creative digital agency that goes all in or not at all.
          </motion.h1>
        </div>
      </div>
      <div className = "absolute bottom-3 left-3 z-10">
      <CTAButton/>
      </div>
    </section>
  );
}