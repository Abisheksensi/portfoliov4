"use client";

import { useEffect, useRef } from "react";

const NOISE_DENSITY = 0.1;
const NOISE_FPS = 60;
const NOISE_SCALE = 0.55;

export default function HeroNoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let frameId = 0;
    let lastFrameTime = 0;
    let resizeObserver: ResizeObserver | null = null;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * NOISE_SCALE * dpr));
      canvas.height = Math.max(1, Math.floor(height * NOISE_SCALE * dpr));

      ctx.imageSmoothingEnabled = false;
    };

    const generateNoise = () => {
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const pixels = imgData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        if (Math.random() < NOISE_DENSITY) {
          const shade = Math.random() > 0.5 ? 255 : 0;

          pixels[i] = shade;
          pixels[i + 1] = shade;
          pixels[i + 2] = shade;
          pixels[i + 3] = shade === 255 ? 42 : 28;
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };

    const animate = (time: number) => {
      if (time - lastFrameTime >= 1000 / NOISE_FPS) {
        generateNoise();
        lastFrameTime = time;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    generateNoise();
    frameId = window.requestAnimationFrame(animate);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-70"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
