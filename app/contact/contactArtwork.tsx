"use client";

import { useEffect, useRef } from "react";
import styles from "./contact.module.css";

const IMAGE_SRC = "/images/backgrounds/hero-bg.png";
const CELL_WIDTH = 6;
const CELL_HEIGHT = 9;
const FRAME_INTERVAL = 1000 / 12;

export default function ContactArtwork() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const photo = photoRef.current;
    const ascii = asciiRef.current;
    if (!surface || !photo || !ascii) return;
    const photoContext = photo.getContext("2d");
    const context = ascii.getContext("2d");
    const sampler = document.createElement("canvas");
    const sampleContext = sampler.getContext("2d", { willReadFrequently: true });
    if (!photoContext || !context || !sampleContext) return;

    const image = new Image();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let frame = 0;
    let lastFrame = 0;
    let width = 0;
    let height = 0;
    let cells: Array<{ x: number; y: number; opacity: number; seed: number }> = [];

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.font = '8px "Courier New", monospace';
      context.textBaseline = "top";
      context.fillStyle = "#343a3d";
      const tick = reducedMotion.matches ? 0 : Math.floor(time / 180);

      for (const cell of cells) {
        // Each cell changes at its own cadence, retaining the image silhouette.
        const cadence = 3 + (cell.seed % 5);
        const digit = (cell.seed + Math.floor(tick / cadence)) % 10;
        const shimmer = reducedMotion.matches
          ? 1
          : 0.85 + 0.15 * Math.sin(time / 1200 + cell.y / 70);
        context.globalAlpha = cell.opacity * shimmer;
        context.fillText(String(digit), cell.x, cell.y);
      }
      context.globalAlpha = 1;
    };

    const resize = () => {
      if (disposed || !image.naturalWidth) return;
      width = surface.clientWidth;
      height = surface.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [photo, ascii]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      photoContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Frame the horse and riders from the same landing-page photograph.
      const crop = {
        x: image.naturalWidth * 0.37,
        y: image.naturalHeight * 0.5,
        width: image.naturalWidth * 0.48,
        height: image.naturalHeight * 0.5,
      };
      const scale = Math.min(width / crop.width, height / crop.height);
      const drawWidth = crop.width * scale;
      const drawHeight = crop.height * scale;
      const left = (width - drawWidth) / 2;
      const top = height - drawHeight;
      photoContext.clearRect(0, 0, width, height);
      photoContext.drawImage(image, crop.x, crop.y, crop.width, crop.height,
        left, top, drawWidth, drawHeight);

      const columns = Math.ceil(drawWidth / CELL_WIDTH);
      const rows = Math.ceil(drawHeight / CELL_HEIGHT);
      sampler.width = columns;
      sampler.height = rows;
      sampleContext.drawImage(image, crop.x, crop.y, crop.width, crop.height,
        0, 0, columns, rows);
      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const index = (row * columns + column) * 4;
          const luminance = pixels[index] * 0.2126 + pixels[index + 1] * 0.7152
            + pixels[index + 2] * 0.0722;
          // Use the clear sky above each column as its local background level.
          const skyIndex = column * 4;
          const sky = pixels[skyIndex] * 0.2126 + pixels[skyIndex + 1] * 0.7152
            + pixels[skyIndex + 2] * 0.0722;
          const contrast = Math.max(0, sky - luminance - 22);
          if (contrast < 8) continue;
          cells.push({
            x: left + column * CELL_WIDTH,
            y: top + row * CELL_HEIGHT,
            opacity: Math.min(0.62, contrast / 170),
            seed: (column * 31 + row * 17) % 997,
          });
        }
      }
      draw(0);
    };

    const animate = (time: number) => {
      if (time - lastFrame >= FRAME_INTERVAL) {
        draw(time);
        lastFrame = time;
      }
      frame = window.requestAnimationFrame(animate);
    };
    const updatePlayback = () => {
      window.cancelAnimationFrame(frame);
      if (disposed || !image.naturalWidth) return;
      if (reducedMotion.matches || document.hidden) draw(0);
      else frame = window.requestAnimationFrame(animate);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    image.onload = () => {
      resize();
      updatePlayback();
    };
    image.src = IMAGE_SRC;
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      disposed = true;
      image.onload = null;
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <div ref={surfaceRef} className={styles.artwork} aria-hidden="true">
      <canvas ref={photoRef} className={styles.artworkPhoto} />
      <canvas ref={asciiRef} className={styles.artworkAscii} />
    </div>
  );
}
