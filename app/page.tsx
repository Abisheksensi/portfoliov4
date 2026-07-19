'use client';

import MenuButton from "../src/components/ui/buttons/menuButton";
import VideoButton from "../src/components/ui/buttons/videoButton";
import { motion } from "framer-motion";
import { headingEntrance } from "../src/motions/typography/entrance";


export default function Home() {
  return (
    <main
      style={{
        padding: 12,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
<main className="min-h-screen bg-gray-100 flex justify-end items-start">
<div className="w-full flex flex-col">
  <div className="w-full flex justify-end mb-[6px]">
    <div className="w-[193px] flex flex-col gap-[6px]">
      <MenuButton />
      <VideoButton />
    </div>
  </div>

<div className="w-full flex items-center justify-center">
<motion.h1
  {...headingEntrance.h1.reveal}
  className="w-[500px] text-stone-950 text-6xl font-medium font-['Outfit'] leading-[48px]"
>
  A creative digital agency that goes all in or not at all.
</motion.h1>
</div>
</div>
  
</main>
    </main>
  );
}
