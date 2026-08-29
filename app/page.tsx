'use client';

import HeroToSecondSec from "../src/components/ui/sections/heroToSecondSec";
import FloatingUI from "../src/components/ui/sections/floatingUi";
import dynamic from "next/dynamic";

const HeroToSecondTransition = dynamic(
  () => import("../src/components/ui/sections/heroToSecondSec"),
  { ssr: false }
);


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 ">
      <HeroToSecondSec />
      <FloatingUI />

    </main>
  );
}