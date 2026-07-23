"use client";

import { useEffect, useRef } from "react";

// deliberately tiny — this is the whole point of pixel art: few, chunky,
// hard-edged pixels blown up big rather than a smooth high-res render
const COLS = 96;
const ROWS = 54;
const PALETTE = ["#ffffff", "#bcd8ff", "#f6cfe0", "#e0c9ff", "#ffd98a"];
const STAR_COUNT = 260;

type Star = { x: number; y: number; color: string; base: number; blinkUntil: number };

export default function PixelCluster() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = COLS;
    canvas.height = ROWS;
    ctx.imageSmoothingEnabled = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cx = COLS / 2;
    const cy = ROWS / 2;
    const spread = Math.min(COLS, ROWS) * 0.44;

    // sum-of-uniforms gives a cluster that's dense in the middle and
    // thins out toward the edges, like the galaxy model's own point cloud
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const r = (Math.random() + Math.random() + Math.random()) / 3;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: cx + Math.cos(angle) * r * spread,
        y: cy + Math.sin(angle) * r * spread * 0.6,
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        base: 0.3 + Math.random() * 0.45,
        blinkUntil: 0,
      };
    });

    let raf = 0;
    let t = 0;
    const frame = () => {
      t++;
      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, COLS, ROWS);

      const blinkChance = reduced ? 0 : 0.0018;
      for (const s of stars) {
        if (t > s.blinkUntil && Math.random() < blinkChance) s.blinkUntil = t + 8;
        const blinking = t < s.blinkUntil;
        ctx.globalAlpha = blinking ? 1 : s.base;
        ctx.fillStyle = blinking ? "#ffffff" : s.color;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
