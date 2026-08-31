"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Economica, Outfit } from "next/font/google";
import { gsap } from "gsap";
import maskImage from "../../../assets/image/image.png";

const economica = Economica({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/*
 * IMPORTANT
 *
 * These must match the size of the box the
 * grid is rendered into below (the h-[320px]
 * graphic container, at max-w-[420px]).
 * If you resize that box, update these too.
 */
const BOX_WIDTH = 400;
const BOX_HEIGHT = 1800;

/*
 * Size of one character cell.
 * 8px font + 2px gap = 10px per cell,
 * matching the span/row styling below.
 */
const CELL = 10;

/*
 * How long the scramble/reveal effect runs, in ms.
 */
const REVEAL_DURATION = 60000;

/*
 * How often the digits re-randomize while scrambling, in ms.
 * Smaller = faster flicker.
 */
const SCRAMBLE_INTERVAL = 65;

function generateGridText(cols: number, rows: number) {
  let result = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result += (Math.random() * 10) | 0;
    }
    if (r < rows - 1) result += "\n";
  }
  return result;
}

export default function WhatIDo({ className = "" }: { className?: string }) {
  const cols = Math.ceil(BOX_WIDTH / CELL) + 2;
  const rows = Math.ceil(BOX_HEIGHT / CELL) + 2;

  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLPreElement>(null);
  const scanGridRef = useRef<HTMLPreElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const initialText = useMemo(() => generateGridText(cols, rows), [cols, rows]);

  useEffect(() => {
    if (!isHovered) return;

    // Sweep orange laser scan beam across the numbers
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { "--scan-x": "-20%" },
        {
          "--scan-x": "130%",
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }

    // Scramble the digits rapidly while hovered
    const scrambleInterval = setInterval(() => {
      const newText = generateGridText(cols, rows);
      if (gridRef.current) gridRef.current.textContent = newText;
      if (scanGridRef.current) scanGridRef.current.textContent = newText;
    }, SCRAMBLE_INTERVAL);

    return () => {
      clearInterval(scrambleInterval);
    };
  }, [isHovered, cols, rows]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          "--scan-x": "-20%",
        } as React.CSSProperties
      }
      className={`group relative w-full flex flex-1 min-h-0 hover:flex-[1.45] max-w-[420px] overflow-hidden rounded-[0px] transition-all duration-500 ease-in-out cursor-pointer ${className}`}
    >

      {/* CARD FILL & BORDER SURFACE (Eases in after numbers) */}
      <div className="what-i-do-surface absolute inset-0 bg-white/90 border border-black/10 rounded-[inherit] -z-0 pointer-events-none" />

      {/* ========================================= */}
      {/* GRAPHIC (Always visible numbers)          */}
      {/* ========================================= */}

      <div className="relative h-full w-[200px] overflow-hidden z-10">

        {/* DEFAULT GREY NUMBERPAD (No Masking) */}
        <pre
          className={`
            ${economica.className}
            select-none
            text-[8px]
            font-normal
            leading-[10px]
            tracking-[2px]
            text-black/20
            p-[8px]
            m-0
            overflow-hidden
            whitespace-pre
            pointer-events-none
            absolute inset-0
          `}
        >
          {initialText}
        </pre>

        {/* MASKED SILHOUETTE ASCII ANIMATION (Reveals on Hover) */}
        <div
          className="absolute inset-0 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 scale-[0.97] group-hover:scale-100 pointer-events-none"
          style={{
            WebkitMaskImage: `linear-gradient(#fff, #fff), url(${maskImage.src})`,
            maskImage: `linear-gradient(#fff, #fff), url(${maskImage.src})`,

            WebkitMaskSize: "cover, cover",
            maskSize: "cover, cover",

            WebkitMaskPosition: "center, center",
            maskPosition: "center, center",

            WebkitMaskRepeat: "no-repeat, no-repeat",
            maskRepeat: "no-repeat, no-repeat",

            WebkitMaskComposite: "xor",
            maskComposite: "exclude",

            WebkitMaskMode: "luminance, luminance",
            maskMode: "luminance, luminance",
          } as any}
        >
          {/* Base Black Numbers */}
          <pre
            ref={gridRef}
            className={`
              ${economica.className}
              select-none
              text-[8px]
              font-normal
              leading-[10px]
              tracking-[2px]
              text-black
              p-[8px]
              m-0
              overflow-hidden
              whitespace-pre
              pointer-events-none
            `}
          >
            {initialText}
          </pre>

          {/* Orange Laser Scan Numbers (Illuminates numbers in beam path) */}
          <pre
            ref={scanGridRef}
            style={{
              maskImage: `linear-gradient(
                90deg,
                transparent 0%,
                transparent calc(var(--scan-x, -20%) - 18%),
                #000 var(--scan-x, -20%),
                transparent calc(var(--scan-x, -20%) + 18%),
                transparent 100%
              )`,
              WebkitMaskImage: `linear-gradient(
                90deg,
                transparent 0%,
                transparent calc(var(--scan-x, -20%) - 18%),
                #000 var(--scan-x, -20%),
                transparent calc(var(--scan-x, -20%) + 18%),
                transparent 100%
              )`,
            }}
            className={`
              ${economica.className}
              select-none
              text-[8px]
              font-semibold
              leading-[10px]
              tracking-[2px]
              text-[#fc5d20]
              p-[8px]
              m-0
              overflow-hidden
              whitespace-pre
              pointer-events-none
              absolute inset-0
            `}
          >
            {initialText}
          </pre>

        </div>
      </div>

      {/* ========================================= */}
      {/* TEXT CONTENT (Original Clean Design)       */}
      {/* ========================================= */}

      <div className={`what-i-do-text relative z-10 flex h-full w-full flex-1 flex-col items-start justify-between gap-[10px] p-6 text-left text-[18px] text-[#23282b] ${outfit.className}`}>

        <h3
          className="relative self-stretch font-medium"
        >
          Lorem ipsum
        </h3>

        <p
          className="relative self-stretch text-[16px] font-light text-[#888]"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

      </div>

    </div>
  );
}